<?php
/**
 * /api/reports/dashboard.php
 * GET - returns dashboard stats for the current role
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$user = requireAuth();
$db   = getDB();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$role = $user['role'];
$data = [];

function getTeacherDashboardProfile(PDO $db, array $user): ?array {
    $stmt = $db->prepare(
        "SELECT s.id AS staff_id, s.staff_code, s.name, s.email, s.phone, s.department, s.position,
                s.status, t.subject, t.class_assigned, t.experience, t.schedule, t.avatar_color
         FROM staff s
         LEFT JOIN teachers t ON t.staff_id = s.id
         WHERE s.category = 'Teaching'
           AND (
             s.user_id = ?
             OR LOWER(s.email) = LOWER(?)
             OR LOWER(s.name) = LOWER(?)
           )
         ORDER BY s.user_id = ? DESC, s.id ASC
         LIMIT 1"
    );
    $stmt->execute([
        $user['id'] ?? 0,
        $user['email'] ?? '',
        $user['name'] ?? '',
        $user['id'] ?? 0,
    ]);
    $profile = $stmt->fetch();
    return $profile ?: null;
}

if (in_array($role, ['Admin', 'Teacher'])) {
    // Student counts per class
    $data['total_students'] = (int)$db->query("SELECT COUNT(*) FROM students WHERE status = 'Active'")->fetchColumn();
    $data['total_staff']    = (int)$db->query("SELECT COUNT(*) FROM staff WHERE status = 'Active'")->fetchColumn();
    $data['total_teachers'] = (int)$db->query("SELECT COUNT(*) FROM staff WHERE category = 'Teaching' AND status = 'Active'")->fetchColumn();

    // Active assignments
    $data['active_assignments'] = (int)$db->query("SELECT COUNT(*) FROM assignments WHERE status = 'Active'")->fetchColumn();

    // Pending admissions
    $data['pending_admissions'] = (int)$db->query("SELECT COUNT(*) FROM admissions WHERE status = 'Pending'")->fetchColumn();

    // Upcoming events (next 30 days)
    $data['upcoming_events'] = (int)$db->query(
        "SELECT COUNT(*) FROM events WHERE event_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)"
    )->fetchColumn();

    // Published notices
    $data['total_notices'] = (int)$db->query("SELECT COUNT(*) FROM notices WHERE status = 'Published'")->fetchColumn();

    // Students per class
    $stmt = $db->query(
        "SELECT c.name AS class_name, COUNT(s.id) AS student_count
         FROM classes c LEFT JOIN students s ON s.class_id = c.id AND s.status = 'Active'
         GROUP BY c.id ORDER BY c.id ASC"
    );
    $data['students_per_class'] = $stmt->fetchAll();

    // Attendance average
    $data['avg_attendance'] = round(
        (float)$db->query("SELECT AVG(attendance) FROM students WHERE status = 'Active'")->fetchColumn(), 1
    );

    $chartYear = (int)$db->query("SELECT COALESCE(MAX(YEAR(created_at)), YEAR(CURDATE())) FROM students")->fetchColumn();
    $monthly = [];
    $enrollStmt = $db->prepare(
        "SELECT COUNT(*) FROM students
         WHERE status = 'Active' AND created_at <= LAST_DAY(STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d'))"
    );
    $attendanceStmt = $db->prepare(
        "SELECT AVG(attendance) FROM students
         WHERE status = 'Active' AND created_at <= LAST_DAY(STR_TO_DATE(CONCAT(?, '-', ?, '-01'), '%Y-%m-%d'))"
    );
    for ($month = 1; $month <= 12; $month++) {
        $monthNo = str_pad((string)$month, 2, '0', STR_PAD_LEFT);
        $enrollStmt->execute([$chartYear, $monthNo]);
        $attendanceStmt->execute([$chartYear, $monthNo]);
        $monthly[] = [
            'month' => date('M', mktime(0, 0, 0, $month, 1)),
            'enrollment' => (int)$enrollStmt->fetchColumn(),
            'attendance' => round((float)($attendanceStmt->fetchColumn() ?: 0), 1),
        ];
    }
    $data['monthly_enrollment_attendance'] = $monthly;
}

if ($role === 'Teacher') {
    $teacher = getTeacherDashboardProfile($db, $user);
    $teacherData = [
        'profile' => $teacher,
        'classes' => [],
        'subjects' => [],
        'students' => [],
        'assignments' => [],
        'schedule' => [],
        'notices' => [],
        'stats' => [
            'classes_count' => 0,
            'subjects_count' => 0,
            'students_count' => 0,
            'attendance_average' => 0,
            'active_assignments' => 0,
        ],
    ];

    if ($teacher) {
        $staffId = (int)$teacher['staff_id'];

        $classStmt = $db->prepare(
            "SELECT c.id, c.name, c.level, c.stream, c.teacher_id, c.capacity,
                    COALESCE(ROUND(AVG(st.attendance), 1), 0) AS attendance_avg,
                    COUNT(st.id) AS student_count
             FROM classes c
             LEFT JOIN students st ON st.class_id = c.id AND st.status = 'Active'
             WHERE c.teacher_id = ?
                OR c.name = ?
                OR EXISTS (
                    SELECT 1 FROM subjects sub
                    WHERE sub.class_id = c.id AND sub.teacher_id = ?
                )
             GROUP BY c.id, c.name, c.level, c.stream, c.teacher_id, c.capacity
             ORDER BY c.name ASC"
        );
        $classStmt->execute([$staffId, $teacher['class_assigned'] ?? '', $staffId]);
        $classes = $classStmt->fetchAll();
        $teacherData['classes'] = $classes;
        $classIds = array_map(fn($row) => (int)$row['id'], $classes);

        $subjectStmt = $db->prepare(
            "SELECT sub.id, sub.name, sub.type, sub.classes, sub.hours, sub.description,
                    c.id AS class_id, c.name AS class_name
             FROM subjects sub
             LEFT JOIN classes c ON c.id = sub.class_id
             WHERE sub.teacher_id = ?
             ORDER BY c.name ASC, sub.name ASC"
        );
        $subjectStmt->execute([$staffId]);
        $teacherData['subjects'] = $subjectStmt->fetchAll();

        if (!empty($classIds)) {
            $placeholders = implode(',', array_fill(0, count($classIds), '?'));
            $studentStmt = $db->prepare(
                "SELECT s.id, s.student_code, s.name, s.gender, s.attendance, s.status,
                        c.name AS class_name
                 FROM students s
                 LEFT JOIN classes c ON c.id = s.class_id
                 WHERE s.status = 'Active' AND s.class_id IN ($placeholders)
                 ORDER BY c.name ASC, s.name ASC"
            );
            $studentStmt->execute($classIds);
            $teacherData['students'] = $studentStmt->fetchAll();
        }

        $classFilter = !empty($classIds) ? " OR a.class_id IN (" . implode(',', array_fill(0, count($classIds), '?')) . ")" : "";
        $assignmentParams = array_merge([$staffId], $classIds);
        $assignmentStmt = $db->prepare(
            "SELECT a.id, a.title, a.subject, a.class_id, a.teacher_id, a.due_date, a.created_date,
                    a.max_score, a.status, a.instructions, a.attachment, c.name AS class_name,
                    (SELECT COUNT(*) FROM assignment_submissions sub WHERE sub.assignment_id = a.id) AS submitted_count,
                    (SELECT COUNT(*) FROM students st WHERE st.class_id = a.class_id AND st.status = 'Active') AS total_students
             FROM assignments a
             LEFT JOIN classes c ON c.id = a.class_id
             WHERE a.teacher_id = ?$classFilter
             ORDER BY a.due_date ASC, a.id DESC
             LIMIT 6"
        );
        $assignmentStmt->execute($assignmentParams);
        $teacherData['assignments'] = $assignmentStmt->fetchAll();

        $scheduleClassFilter = !empty($classIds) ? " OR t.class_id IN (" . implode(',', array_fill(0, count($classIds), '?')) . ")" : "";
        $scheduleParams = array_merge([$staffId], $classIds);
        $scheduleStmt = $db->prepare(
            "SELECT t.id, t.period_label, t.subject, t.day_of_week, t.start_time, t.end_time,
                    t.room, t.term, c.name AS class_name
             FROM timetable t
             INNER JOIN classes c ON c.id = t.class_id
             WHERE t.teacher_id = ?$scheduleClassFilter
             ORDER BY FIELD(t.day_of_week, 'Monday','Tuesday','Wednesday','Thursday','Friday'),
                      t.start_time ASC, t.id ASC
             LIMIT 8"
        );
        $scheduleStmt->execute($scheduleParams);
        $teacherData['schedule'] = $scheduleStmt->fetchAll();

        $activeClassFilter = !empty($classIds) ? " OR class_id IN (" . implode(',', array_fill(0, count($classIds), '?')) . ")" : "";
        $activeAssignmentStmt = $db->prepare(
            "SELECT COUNT(*) FROM assignments WHERE status = 'Active' AND (teacher_id = ?$activeClassFilter)"
        );
        $activeAssignmentStmt->execute($assignmentParams);
        $activeAssignmentsCount = (int)$activeAssignmentStmt->fetchColumn();

        $noticeStmt = $db->prepare(
            "SELECT id, icon, title, audience, posted_by, notice_date, message, priority, status, attachment
             FROM notices
             WHERE status = 'Published'
               AND audience IN ('All', 'Teachers', 'Staff')
             ORDER BY notice_date DESC, id DESC
             LIMIT 4"
        );
        $noticeStmt->execute();
        $teacherData['notices'] = $noticeStmt->fetchAll();

        $attendanceValues = array_map(fn($row) => (float)($row['attendance_avg'] ?? 0), $classes);
        $attendanceValues = array_values(array_filter($attendanceValues, fn($value) => $value > 0));

        $teacherData['stats'] = [
            'classes_count' => count($classes),
            'subjects_count' => count($teacherData['subjects']),
            'students_count' => count($teacherData['students']),
            'attendance_average' => $attendanceValues ? round(array_sum($attendanceValues) / count($attendanceValues), 1) : 0,
            'active_assignments' => $activeAssignmentsCount,
        ];
    }

    $data['teacher'] = $teacherData;
}

if (in_array($role, ['Admin', 'Accountant'])) {
    // Financial summary for current term
    $termStmt = $db->query("SELECT setting_value FROM settings WHERE setting_key = 'current_term' LIMIT 1");
    $term     = $termStmt->fetchColumn() ?: '1st Term';
    $yearStmt = $db->query("SELECT setting_value FROM settings WHERE setting_key = 'academic_year' LIMIT 1");
    $year     = $yearStmt->fetchColumn() ?: '2024/2025';

    $fStmt = $db->prepare(
        "SELECT SUM(amount_due) AS total_due, SUM(amount_paid) AS total_paid
         FROM fees WHERE term = ? AND academic_year = ?"
    );
    $fStmt->execute([$term, $year]);
    $fin = $fStmt->fetch();

    $data['total_fees_due']        = (float)($fin['total_due']  ?? 0);
    $data['total_fees_collected']  = (float)($fin['total_paid'] ?? 0);
    $data['total_fees_outstanding']= $data['total_fees_due'] - $data['total_fees_collected'];
    $data['fees_paid_count']       = (int)$db->prepare(
        "SELECT COUNT(*) FROM fees WHERE status = 'Paid' AND term = ? AND academic_year = ?"
    )->execute([$term, $year]) ? $db->query("SELECT COUNT(*) FROM fees WHERE status='Paid'")->fetchColumn() : 0;

    // Properly
    $pcStmt = $db->prepare("SELECT COUNT(*) FROM fees WHERE status = 'Paid' AND term = ? AND academic_year = ?");
    $pcStmt->execute([$term, $year]);
    $data['fees_paid_count'] = (int)$pcStmt->fetchColumn();

    $ptStmt = $db->prepare("SELECT COUNT(*) FROM fees WHERE status = 'Pending' AND term = ? AND academic_year = ?");
    $ptStmt->execute([$term, $year]);
    $data['fees_pending_count'] = (int)$ptStmt->fetchColumn();

    $ppStmt = $db->prepare("SELECT COUNT(*) FROM fees WHERE status = 'Partial' AND term = ? AND academic_year = ?");
    $ppStmt->execute([$term, $year]);
    $data['fees_partial_count'] = (int)$ppStmt->fetchColumn();
}

if ($role === 'Admin') {
    $activity = [];

    $stmt = $db->query(
        "SELECT CONCAT('New student enrolled - ', name) AS message, created_at AS activity_time, 'blue' AS color
         FROM students
         ORDER BY created_at DESC
         LIMIT 3"
    );
    $activity = array_merge($activity, $stmt->fetchAll());

    $stmt = $db->query(
        "SELECT CONCAT('Admission ', LOWER(status), ' - ', applicant_name) AS message, applied_date AS activity_time, 'gold' AS color
         FROM admissions
         ORDER BY applied_date DESC, id DESC
         LIMIT 3"
    );
    $activity = array_merge($activity, $stmt->fetchAll());

    $stmt = $db->query(
        "SELECT CONCAT('Fee payment received - GHS ', FORMAT(amount, 2)) AS message, payment_date AS activity_time, 'green' AS color
         FROM payments
         ORDER BY payment_date DESC, id DESC
         LIMIT 3"
    );
    $activity = array_merge($activity, $stmt->fetchAll());

    $stmt = $db->query(
        "SELECT CONCAT('Notice published: ', title) AS message, notice_date AS activity_time, 'purple' AS color
         FROM notices
         WHERE status = 'Published'
         ORDER BY notice_date DESC, id DESC
         LIMIT 3"
    );
    $activity = array_merge($activity, $stmt->fetchAll());

    usort($activity, fn($a, $b) => strcmp((string)($b['activity_time'] ?? ''), (string)($a['activity_time'] ?? '')));
    $data['recent_activity'] = array_slice($activity, 0, 7);
}

if ($role === 'Student') {
    $termStmt = $db->query("SELECT setting_value FROM settings WHERE setting_key = 'current_term' LIMIT 1");
    $term     = $termStmt->fetchColumn() ?: '1st Term';
    $yearStmt = $db->query("SELECT setting_value FROM settings WHERE setting_key = 'academic_year' LIMIT 1");
    $year     = $yearStmt->fetchColumn() ?: '2024/2025';

    // Get student record linked to this user
    $stStmt = $db->prepare("SELECT s.id, s.name, s.student_code, s.attendance, c.name AS class_name FROM students s LEFT JOIN classes c ON c.id = s.class_id WHERE s.user_id = ? LIMIT 1");
    $stStmt->execute([$user['id']]);
    $student = $stStmt->fetch();
    if ($student) {
        $data['student'] = $student;
        // Latest term scores
        $scStmt = $db->prepare("SELECT subject, class_score, exam_score, (class_score+exam_score) AS total FROM student_scores WHERE student_id = ? AND term = ? AND academic_year = ?");
        $scStmt->execute([$student['id'], $term, $year]);
        $data['scores'] = $scStmt->fetchAll();
        // Fees
        $feStmt = $db->prepare("SELECT amount_due, amount_paid, status FROM fees WHERE student_id = ? AND term = ? AND academic_year = ? LIMIT 1");
        $feStmt->execute([$student['id'], $term, $year]);
        $data['fees'] = $feStmt->fetch();
    }
}

jsonResponse(['success' => true, 'data' => $data]);
