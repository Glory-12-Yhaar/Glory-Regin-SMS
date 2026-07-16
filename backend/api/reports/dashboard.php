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

if ($role === 'Admin') {
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
            'attendance_average' => null,
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

        $assignmentStmt = $db->prepare(
            "SELECT a.id, a.title, a.subject, a.class_id, a.teacher_id, a.due_date, a.created_date,
                    a.max_score, a.status, a.instructions, a.attachment, c.name AS class_name,
                    (SELECT COUNT(*) FROM assignment_submissions sub WHERE sub.assignment_id = a.id) AS submitted_count,
                    (SELECT COUNT(*) FROM students st WHERE st.class_id = a.class_id AND st.status = 'Active') AS total_students
             FROM assignments a
             LEFT JOIN classes c ON c.id = a.class_id
             WHERE a.teacher_id = ?
             ORDER BY a.due_date ASC, a.id DESC
             LIMIT 6"
        );
        $assignmentStmt->execute([$staffId]);
        $teacherData['assignments'] = $assignmentStmt->fetchAll();

        $scheduleStmt = $db->prepare(
            "SELECT t.id, t.period_label, t.subject, t.day_of_week, t.start_time, t.end_time,
                    t.room, t.term, c.name AS class_name
             FROM timetable t
             INNER JOIN classes c ON c.id = t.class_id
             WHERE t.teacher_id = ?
             ORDER BY FIELD(t.day_of_week, 'Monday','Tuesday','Wednesday','Thursday','Friday'),
                      t.start_time ASC, t.id ASC
             LIMIT 8"
        );
        $scheduleStmt->execute([$staffId]);
        $teacherData['schedule'] = $scheduleStmt->fetchAll();

        $activeAssignmentStmt = $db->prepare(
            "SELECT COUNT(*) FROM assignments WHERE status = 'Active' AND teacher_id = ?"
        );
        $activeAssignmentStmt->execute([$staffId]);
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
            'attendance_average' => $attendanceValues ? round(array_sum($attendanceValues) / count($attendanceValues), 1) : null,
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

    // Build one authenticated, student-only overview payload.
    $stStmt = $db->prepare(
        "SELECT s.id, s.name, s.student_code, s.attendance, s.class_id,
                c.name AS class_name, c.stream, staff.name AS class_teacher
         FROM students s
         LEFT JOIN classes c ON c.id = s.class_id
         LEFT JOIN staff ON staff.id = c.teacher_id
         WHERE s.user_id = ? AND s.status = 'Active'
         LIMIT 1"
    );
    $stStmt->execute([$user['id']]);
    $student = $stStmt->fetch();
    if ($student) {
        $data['student'] = $student;
        $data['term'] = $term;
        $data['academic_year'] = $year;

        $scStmt = $db->prepare(
            "SELECT subject, class_score, exam_score, (class_score + exam_score) AS total
             FROM student_scores
             WHERE student_id = ? AND term = ? AND academic_year = ?
             ORDER BY subject ASC"
        );
        $scStmt->execute([$student['id'], $term, $year]);
        $data['scores'] = $scStmt->fetchAll();

        $subjectStmt = $db->prepare(
            "SELECT sub.id, sub.name, sub.type, sub.hours, staff.name AS teacher_name
             FROM subjects sub
             LEFT JOIN staff ON staff.id = sub.teacher_id
             WHERE sub.class_id = ?
             ORDER BY sub.name ASC"
        );
        $subjectStmt->execute([$student['class_id']]);
        $data['subjects'] = $subjectStmt->fetchAll();

        $attendanceStmt = $db->prepare(
            "SELECT attendance_date, status, remarks
             FROM attendance
             WHERE student_id = ?
             ORDER BY attendance_date DESC, id DESC"
        );
        $attendanceStmt->execute([$student['id']]);
        $attendance = $attendanceStmt->fetchAll();
        $attendanceTotal = count($attendance);
        $attendancePresent = count(array_filter($attendance, fn($row) => in_array($row['status'], ['Present', 'Late'], true)));
        $data['attendance'] = [
            'rate' => $attendanceTotal ? round(($attendancePresent / $attendanceTotal) * 100, 1) : (float)$student['attendance'],
            'records_count' => $attendanceTotal,
            'recent' => array_slice($attendance, 0, 5),
        ];

        $assignmentStmt = $db->prepare(
            "SELECT a.id, a.title, a.subject, a.due_date, a.status,
                    CASE WHEN sub.id IS NULL THEN 0 ELSE 1 END AS submitted
             FROM assignments a
             LEFT JOIN assignment_submissions sub
               ON sub.assignment_id = a.id AND sub.student_id = ?
             WHERE a.class_id = ?
             ORDER BY a.due_date ASC, a.id DESC
             LIMIT 6"
        );
        $assignmentStmt->execute([$student['id'], $student['class_id']]);
        $data['assignments'] = $assignmentStmt->fetchAll();
        $data['pending_assignments'] = count(array_filter(
            $data['assignments'],
            fn($row) => !(int)$row['submitted'] && in_array($row['status'], ['Active', 'Upcoming'], true)
        ));

        $scheduleStmt = $db->prepare(
            "SELECT t.id, t.period_label, t.subject, t.start_time, t.end_time, t.room,
                    staff.name AS teacher_name
             FROM timetable t
             LEFT JOIN staff ON staff.id = t.teacher_id
             WHERE t.class_id = ? AND t.day_of_week = DAYNAME(CURDATE())
             ORDER BY t.start_time ASC, t.id ASC"
        );
        $scheduleStmt->execute([$student['class_id']]);
        $data['today_timetable'] = $scheduleStmt->fetchAll();

        $noticeStmt = $db->query(
            "SELECT id, icon, title, notice_date, priority
             FROM notices
             WHERE status = 'Published' AND audience IN ('All', 'Students')
             ORDER BY notice_date DESC, id DESC
             LIMIT 3"
        );
        $data['notices'] = $noticeStmt->fetchAll();

        $rankStmt = $db->prepare(
            "SELECT student_id, average_score
             FROM (
                 SELECT st.id AS student_id, AVG(ss.class_score + ss.exam_score) AS average_score
                 FROM students st
                 JOIN student_scores ss ON ss.student_id = st.id
                 WHERE st.class_id = ? AND st.status = 'Active'
                   AND ss.term = ? AND ss.academic_year = ?
                 GROUP BY st.id
             ) ranked
             ORDER BY average_score DESC, student_id ASC"
        );
        $rankStmt->execute([$student['class_id'], $term, $year]);
        $rankedStudents = $rankStmt->fetchAll();
        $rankIndex = array_search((int)$student['id'], array_map(fn($row) => (int)$row['student_id'], $rankedStudents), true);
        $data['standing'] = [
            'position' => $rankIndex === false ? null : $rankIndex + 1,
            'ranked_students' => count($rankedStudents),
            'average' => $rankIndex === false ? null : round((float)$rankedStudents[$rankIndex]['average_score'], 1),
        ];

        $feStmt = $db->prepare(
            "SELECT amount_due, amount_paid, (amount_due - amount_paid) AS balance, status
             FROM fees WHERE student_id = ? AND term = ? AND academic_year = ? LIMIT 1"
        );
        $feStmt->execute([$student['id'], $term, $year]);
        $data['fees'] = $feStmt->fetch();
        $paymentStmt = $db->prepare(
            "SELECT payment_date, receipt_no, amount
             FROM payments WHERE student_id = ?
             ORDER BY payment_date DESC, id DESC LIMIT 1"
        );
        $paymentStmt->execute([$student['id']]);
        $data['latest_payment'] = $paymentStmt->fetch() ?: null;
    }
}

if ($role === 'Parent') {
    $termStmt = $db->query("SELECT setting_value FROM settings WHERE setting_key = 'current_term' LIMIT 1");
    $term = $termStmt->fetchColumn() ?: '1st Term';
    $yearStmt = $db->query("SELECT setting_value FROM settings WHERE setting_key = 'academic_year' LIMIT 1");
    $year = $yearStmt->fetchColumn() ?: '2024/2025';

    $parentStmt = $db->prepare(
        "SELECT id, name, contact_person, phone, email
         FROM parents
         WHERE user_id = ?
         LIMIT 1"
    );
    $parentStmt->execute([$user['id']]);
    $parent = $parentStmt->fetch();

    $parentData = [
        'profile' => $parent ?: null,
        'term' => $term,
        'academic_year' => $year,
        'children' => [],
        'teachers' => [],
        'pending_assignments' => [],
        'events' => [],
        'stats' => [
            'children_count' => 0,
            'attendance_average' => null,
            'latest_report_average' => null,
            'latest_report_grade' => null,
            'pending_assignments_count' => 0,
            'fees_pending_count' => 0,
            'total_fees_due' => 0,
            'total_fees_paid' => 0,
            'total_fees_balance' => 0,
        ],
    ];

    if ($parent) {
        $teachersStmt = $db->prepare(
            "SELECT DISTINCT st.id, st.staff_code, st.name, st.email, st.phone,
                    st.department, st.position, st.qualifications, st.gender,
                    st.performance, st.avatar, st.status,
                    tr.subject, tr.class_assigned, tr.experience, tr.schedule
             FROM parent_student ps
             INNER JOIN students child ON child.id = ps.student_id AND child.status = 'Active'
             INNER JOIN classes child_class ON child_class.id = child.class_id
             LEFT JOIN subjects child_subject ON child_subject.class_id = child_class.id
             INNER JOIN staff st ON (st.id = child_class.teacher_id OR st.id = child_subject.teacher_id)
                                AND st.category = 'Teaching' AND st.status = 'Active'
             LEFT JOIN teachers tr ON tr.staff_id = st.id
             WHERE ps.parent_id = ?
             ORDER BY st.name ASC"
        );
        $teachersStmt->execute([$parent['id']]);
        $parentData['teachers'] = $teachersStmt->fetchAll();

        $childrenStmt = $db->prepare(
            "SELECT s.id, s.student_code, s.name, s.gender, s.dob, s.photo, s.attendance,
                    s.status, s.created_at AS enrolled_at,
                    c.id AS class_id, c.name AS class_name, c.stream, c.class_teacher,
                    ps.relationship,
                    COALESCE(f.amount_due, 0) AS amount_due,
                    COALESCE(f.amount_paid, 0) AS amount_paid,
                    GREATEST(COALESCE(f.amount_due, 0) - COALESCE(f.amount_paid, 0), 0) AS balance,
                    COALESCE(f.status, 'Pending') AS fee_status,
                    scores.report_average, scores.subject_count,
                    (SELECT COUNT(*)
                     FROM assignments child_assignment
                     LEFT JOIN assignment_submissions child_submission
                            ON child_submission.assignment_id = child_assignment.id
                           AND child_submission.student_id = s.id
                     WHERE child_assignment.class_id = s.class_id
                       AND child_assignment.status IN ('Active', 'Upcoming')
                       AND child_submission.id IS NULL) AS pending_assignments_count,
                    (SELECT COUNT(*) FROM attendance child_attendance
                     WHERE child_attendance.student_id = s.id) AS attendance_records_count,
                    (SELECT COUNT(*) FROM attendance child_attendance
                     WHERE child_attendance.student_id = s.id
                       AND child_attendance.status = 'Present') AS present_records_count,
                    (SELECT COUNT(*) FROM payments child_payment
                     WHERE child_payment.student_id = s.id
                       AND child_payment.term = ?
                       AND child_payment.academic_year = ?) AS payment_records_count
             FROM parent_student ps
             INNER JOIN students s ON s.id = ps.student_id
             LEFT JOIN classes c ON c.id = s.class_id
             LEFT JOIN fees f
                    ON f.student_id = s.id AND f.term = ? AND f.academic_year = ?
             LEFT JOIN (
                 SELECT student_id, ROUND(AVG(class_score + exam_score), 1) AS report_average,
                        COUNT(*) AS subject_count
                 FROM student_scores
                 WHERE term = ? AND academic_year = ?
                 GROUP BY student_id
             ) scores ON scores.student_id = s.id
             WHERE ps.parent_id = ? AND s.status = 'Active'
             ORDER BY s.name ASC"
        );
        $childrenStmt->execute([$term, $year, $term, $year, $term, $year, $parent['id']]);
        $children = $childrenStmt->fetchAll();

        $gradeRangesStmt = $db->query("SELECT setting_value FROM settings WHERE setting_key = 'grading_ranges' LIMIT 1");
        $gradeRanges = json_decode((string)($gradeRangesStmt->fetchColumn() ?: '[]'), true);
        $reportScoresStmt = $db->prepare(
            "SELECT id, subject, class_score, exam_score,
                    ROUND(class_score + exam_score, 2) AS total
             FROM student_scores
             WHERE student_id = ? AND term = ? AND academic_year = ?
             ORDER BY subject ASC"
        );
        foreach ($children as &$child) {
            $average = $child['report_average'] !== null ? (float)$child['report_average'] : null;
            $child['report_grade'] = null;
            if ($average !== null && is_array($gradeRanges)) {
                foreach ($gradeRanges as $range) {
                    if ($average >= (float)($range['min'] ?? 0) && $average <= (float)($range['max'] ?? 100)) {
                        $child['report_grade'] = $range['grade'] ?? null;
                        break;
                    }
                }
            }
            $reportScoresStmt->execute([$child['id'], $term, $year]);
            $child['report_scores'] = $reportScoresStmt->fetchAll();
            foreach ($child['report_scores'] as &$score) {
                $score['grade'] = null;
                $score['remark'] = null;
                foreach ($gradeRanges as $range) {
                    if ((float)$score['total'] >= (float)($range['min'] ?? 0) && (float)$score['total'] <= (float)($range['max'] ?? 100)) {
                        $score['grade'] = $range['grade'] ?? null;
                        $score['remark'] = $range['remark'] ?? null;
                        break;
                    }
                }
            }
            unset($score);
        }
        unset($child);

        $attendanceStmt = $db->prepare(
            "SELECT a.id, a.student_id, a.attendance_date, a.status, a.remarks,
                    COALESCE(u.name, 'School Staff') AS recorded_by_name
             FROM parent_student ps
             INNER JOIN attendance a ON a.student_id = ps.student_id
             LEFT JOIN users u ON u.id = a.recorded_by
             WHERE ps.parent_id = ?
             ORDER BY a.attendance_date DESC, a.id DESC
             LIMIT 500"
        );
        $attendanceStmt->execute([$parent['id']]);
        $attendanceByStudent = [];
        foreach ($attendanceStmt->fetchAll() as $record) {
            $attendanceByStudent[(int)$record['student_id']][] = $record;
        }
        foreach ($children as &$child) {
            $records = $attendanceByStudent[(int)$child['id']] ?? [];
            $counts = ['Present' => 0, 'Absent' => 0, 'Late' => 0, 'Excused' => 0];
            foreach ($records as $record) {
                if (array_key_exists($record['status'], $counts)) {
                    $counts[$record['status']]++;
                }
            }
            $totalRecords = count($records);
            $child['attendance_history'] = $records;
            $child['attendance_summary'] = [
                'total' => $totalRecords,
                'present' => $counts['Present'],
                'absent' => $counts['Absent'],
                'late' => $counts['Late'],
                'excused' => $counts['Excused'],
                'rate' => $totalRecords > 0 ? round(($counts['Present'] / $totalRecords) * 100, 1) : null,
            ];
        }
        unset($child);
        $parentData['children'] = $children;

        $attendanceValues = array_values(array_filter(
            array_map(fn($child) => $child['attendance'] !== null ? (float)$child['attendance'] : null, $children),
            fn($value) => $value !== null
        ));
        $reportValues = array_values(array_filter(
            array_map(fn($child) => $child['report_average'] !== null ? (float)$child['report_average'] : null, $children),
            fn($value) => $value !== null
        ));
        $feePendingCount = count(array_filter($children, fn($child) => ($child['fee_status'] ?? 'Pending') !== 'Paid'));
        $reportAverage = $reportValues ? round(array_sum($reportValues) / count($reportValues), 1) : null;
        $reportGrade = null;
        if ($reportAverage !== null && is_array($gradeRanges)) {
            foreach ($gradeRanges as $range) {
                if ($reportAverage >= (float)($range['min'] ?? 0) && $reportAverage <= (float)($range['max'] ?? 100)) {
                    $reportGrade = $range['grade'] ?? null;
                    break;
                }
            }
        }

        $parentData['stats'] = [
            'children_count' => count($children),
            'attendance_average' => $attendanceValues ? round(array_sum($attendanceValues) / count($attendanceValues), 1) : null,
            'latest_report_average' => $reportAverage,
            'latest_report_grade' => $reportGrade,
            'pending_assignments_count' => array_sum(array_map(fn($child) => (int)$child['pending_assignments_count'], $children)),
            'fees_pending_count' => $feePendingCount,
            'total_fees_due' => array_sum(array_map(fn($child) => (float)$child['amount_due'], $children)),
            'total_fees_paid' => array_sum(array_map(fn($child) => (float)$child['amount_paid'], $children)),
            'total_fees_balance' => array_sum(array_map(fn($child) => (float)$child['balance'], $children)),
        ];
    }

    $eventsStmt = $db->prepare(
        "SELECT id, title, event_date, event_time, all_day, location, audience, description
         FROM events
         WHERE status = 'Published'
           AND audience IN ('All', 'Parents')
           AND event_date >= CURRENT_DATE
         ORDER BY event_date ASC, all_day DESC, event_time ASC, id ASC
         LIMIT 3"
    );
    $eventsStmt->execute();
    $parentData['events'] = $eventsStmt->fetchAll();
    $data['parent'] = $parentData;
}

jsonResponse(['success' => true, 'data' => $data]);
