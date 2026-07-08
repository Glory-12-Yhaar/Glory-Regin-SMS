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

if ($method === 'GET') {
    $where  = ['1=1'];
    $params = [];

    if (!empty($_GET['student_id'])) { $where[] = 'a.student_id = ?'; $params[] = (int)$_GET['student_id']; }
    if (!empty($_GET['date']))       { $where[] = 'a.attendance_date = ?'; $params[] = $_GET['date']; }
    if (!empty($_GET['from']))       { $where[] = 'a.attendance_date >= ?'; $params[] = $_GET['from']; }
    if (!empty($_GET['to']))         { $where[] = 'a.attendance_date <= ?'; $params[] = $_GET['to']; }
    if (!empty($_GET['class_id'])) {
        $where[]  = 's.class_id = ?';
        $params[] = (int)$_GET['class_id'];
    }

    $stmt = $db->prepare(
        "SELECT a.id, a.attendance_date, a.status, a.remarks,
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

    $upsert = $db->prepare(
        "INSERT INTO attendance (student_id, attendance_date, status, remarks, recorded_by)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE status = VALUES(status), remarks = VALUES(remarks)"
    );

    foreach ($records as $r) {
        if (empty($r['student_id']) || empty($r['date'])) continue;
        $upsert->execute([
            (int)$r['student_id'],
            $r['date'],
            $r['status']  ?? 'Present',
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
