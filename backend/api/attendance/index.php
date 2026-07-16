<?php
/**
 * /api/attendance/index.php
 * GET  - get attendance (?student_id=&class_id=&date=&from=&to=)
 * POST - record attendance (Teacher/Admin)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$user   = requireAuth();
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

function teacherAttendanceClassIds(PDO $db, array $user): array {
    $stmt = $db->prepare("SELECT s.id, t.class_assigned FROM staff s LEFT JOIN teachers t ON t.staff_id=s.id WHERE s.category='Teaching' AND (s.user_id=? OR LOWER(s.email)=LOWER(?) OR LOWER(s.name)=LOWER(?)) ORDER BY s.user_id=? DESC LIMIT 1");
    $stmt->execute([$user['id'] ?? 0, $user['email'] ?? '', $user['name'] ?? '', $user['id'] ?? 0]);
    $teacher = $stmt->fetch();
    if (!$teacher) return [];
    $stmt = $db->prepare("SELECT DISTINCT c.id FROM classes c WHERE c.teacher_id=? OR c.name=? OR EXISTS(SELECT 1 FROM subjects sub WHERE sub.class_id=c.id AND sub.teacher_id=?)");
    $stmt->execute([(int)$teacher['id'], $teacher['class_assigned'] ?? '', (int)$teacher['id']]);
    return array_map('intval', $stmt->fetchAll(PDO::FETCH_COLUMN));
}

if ($method === 'GET') {
    $where  = ['1=1'];
    $params = [];
    if (($user['role'] ?? '') === 'Teacher') {
        $classIds = teacherAttendanceClassIds($db, $user);
        if (!$classIds) jsonResponse(['success' => true, 'data' => []]);
        $where[] = 's.class_id IN (' . implode(',', array_fill(0, count($classIds), '?')) . ')';
        $params = array_merge($params, $classIds);
    } elseif (($user['role'] ?? '') === 'Student') {
        $studentStmt = $db->prepare("SELECT id FROM students WHERE user_id = ? AND status = 'Active' LIMIT 1");
        $studentStmt->execute([$user['id']]);
        $studentId = (int)($studentStmt->fetchColumn() ?: 0);
        if (!$studentId) jsonResponse(['success' => true, 'data' => []]);
        $where[] = 'a.student_id = ?';
        $params[] = $studentId;
    }

    if (!empty($_GET['student_id'])) { $where[] = 'a.student_id = ?'; $params[] = (int)$_GET['student_id']; }
    if (!empty($_GET['date']))       { $where[] = 'a.attendance_date = ?'; $params[] = $_GET['date']; }
    if (!empty($_GET['from']))       { $where[] = 'a.attendance_date >= ?'; $params[] = $_GET['from']; }
    if (!empty($_GET['to']))         { $where[] = 'a.attendance_date <= ?'; $params[] = $_GET['to']; }
    if (!empty($_GET['class_id'])) {
        $where[]  = 's.class_id = ?';
        $params[] = (int)$_GET['class_id'];
    }

    $stmt = $db->prepare(
        "SELECT a.id, a.student_id, a.attendance_date, a.status, a.remarks,
                s.name AS student_name, s.student_code, c.name AS class_name
         FROM attendance a
         JOIN students s ON s.id = a.student_id
         LEFT JOIN classes c ON c.id = s.class_id
         WHERE " . implode(' AND ', $where) . "
         ORDER BY a.attendance_date DESC, s.name ASC"
    );
    $stmt->execute($params);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    requireRole(['Admin', 'Teacher']);
    $body    = getRequestBody();
    $records = $body['records'] ?? []; // array of { student_id, date, status, remarks }

    if (empty($records)) {
        jsonResponse(['success' => false, 'message' => 'records array is required'], 422);
    }
    if (($user['role'] ?? '') === 'Teacher') {
        $classIds = teacherAttendanceClassIds($db, $user);
        $studentCheck = $db->prepare('SELECT class_id FROM students WHERE id = ? AND status = \'Active\'');
        foreach ($records as $record) {
            $studentCheck->execute([(int)($record['student_id'] ?? 0)]);
            if (!in_array((int)$studentCheck->fetchColumn(), $classIds, true)) {
                jsonResponse(['success' => false, 'message' => 'One or more students are outside your assigned classes'], 403);
            }
        }
    }

    $upsert = $db->prepare(
        "INSERT INTO attendance (student_id, attendance_date, status, remarks, recorded_by)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE status = VALUES(status), remarks = VALUES(remarks)"
    );

    foreach ($records as $r) {
        if (empty($r['student_id']) || empty($r['date'])) continue;
        $status = $r['status'] ?? 'Present';
        if (!in_array($status, ['Present','Absent','Late','Excused'], true)) {
            jsonResponse(['success' => false, 'message' => 'Invalid attendance status'], 422);
        }
        $upsert->execute([
            (int)$r['student_id'],
            $r['date'],
            $status,
            $r['remarks'] ?? null,
            $user['id'],
        ]);
    }

    // Recalculate attendance % for affected students
    $studentIds = array_unique(array_column($records, 'student_id'));
    $update = $db->prepare(
        "UPDATE students SET attendance = (
            SELECT ROUND(SUM(status = 'Present') / COUNT(*) * 100, 1)
            FROM attendance WHERE student_id = students.id
         ) WHERE id = ?"
    );
    foreach ($studentIds as $sid) {
        $update->execute([(int)$sid]);
    }

    jsonResponse(['success' => true, 'message' => count($records) . ' attendance records saved']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
