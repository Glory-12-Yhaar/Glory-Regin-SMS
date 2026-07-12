<?php
/**
 * /api/classes/index.php
 * GET  - list all classes (with subject counts and student counts)
 * POST - create class (Admin only)
 * PUT  - update class (Admin only)
 * DELETE - delete class (Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

requireAuth();
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $db->query(
        "SELECT c.id, c.name, c.level, c.teacher_id, c.capacity, c.stream, st.name AS teacher_name,
                COUNT(DISTINCT s.id)  AS student_count,
                COUNT(DISTINCT sb.id) AS subject_count,
                GROUP_CONCAT(DISTINCT sb.name ORDER BY sb.name ASC) AS subjects
         FROM classes c
         LEFT JOIN staff st    ON st.id = c.teacher_id
         LEFT JOIN students s  ON s.class_id  = c.id AND s.status = 'Active'
         LEFT JOIN subjects sb ON sb.class_id = c.id
         GROUP BY c.id
         ORDER BY c.id ASC"
    );
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    requireRole(['Admin']);
    $body = getRequestBody();
    if (empty($body['name']) || empty($body['level'])) {
        jsonResponse(['success' => false, 'message' => 'name and level are required'], 422);
    }

    $teacherId = !empty($body['teacher_id']) ? (int)$body['teacher_id'] : null;
    $teacherName = null;
    if ($teacherId) {
        $stQuery = $db->prepare("SELECT name FROM staff WHERE id = ?");
        $stQuery->execute([$teacherId]);
        $teacherName = $stQuery->fetchColumn() ?: null;
    }

    $capacity = isset($body['capacity']) ? (int)$body['capacity'] : 40;
    $stream = !empty($body['stream']) ? htmlspecialchars(trim($body['stream']), ENT_QUOTES) : 'General';

    $stmt = $db->prepare("INSERT INTO classes (name, level, teacher_id, class_teacher, capacity, stream) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        htmlspecialchars(trim($body['name']), ENT_QUOTES),
        $body['level'],
        $teacherId,
        $teacherName,
        $capacity,
        $stream
    ]);
    $classId = $db->lastInsertId();

    // Insert subjects if provided
    if (!empty($body['subjects']) && is_array($body['subjects'])) {
        $insSub = $db->prepare("INSERT INTO subjects (name, class_id, type) VALUES (?, ?, 'Core')");
        foreach ($body['subjects'] as $subName) {
            if (trim($subName) !== '') {
                $insSub->execute([htmlspecialchars(trim($subName), ENT_QUOTES), $classId]);
            }
        }
    }

    jsonResponse(['success' => true, 'message' => 'Class created', 'id' => $classId], 201);
}

if ($method === 'PUT') {
    requireRole(['Admin']);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) {
        jsonResponse(['success' => false, 'message' => 'Class ID required'], 422);
    }
    $body = getRequestBody();
    if (empty($body['name']) || empty($body['level'])) {
        jsonResponse(['success' => false, 'message' => 'name and level are required'], 422);
    }

    $teacherId = !empty($body['teacher_id']) ? (int)$body['teacher_id'] : null;
    $teacherName = null;
    if ($teacherId) {
        $stQuery = $db->prepare("SELECT name FROM staff WHERE id = ?");
        $stQuery->execute([$teacherId]);
        $teacherName = $stQuery->fetchColumn() ?: null;
    }

    $capacity = isset($body['capacity']) ? (int)$body['capacity'] : 40;
    $stream = !empty($body['stream']) ? htmlspecialchars(trim($body['stream']), ENT_QUOTES) : 'General';

    $stmt = $db->prepare("UPDATE classes SET name = ?, level = ?, teacher_id = ?, class_teacher = ?, capacity = ?, stream = ? WHERE id = ?");
    $stmt->execute([
        htmlspecialchars(trim($body['name']), ENT_QUOTES),
        $body['level'],
        $teacherId,
        $teacherName,
        $capacity,
        $stream,
        $id
    ]);

    // Update subjects if provided
    if (isset($body['subjects']) && is_array($body['subjects'])) {
        // Get existing subjects
        $stmt = $db->prepare("SELECT name FROM subjects WHERE class_id = ?");
        $stmt->execute([$id]);
        $currentSubjects = $stmt->fetchAll(PDO::FETCH_COLUMN);

        $newSubjects = array_map(function($val) {
            return htmlspecialchars(trim($val), ENT_QUOTES);
        }, $body['subjects']);
        $newSubjects = array_filter($newSubjects, function($val) {
            return $val !== '';
        });

        // Delete removed subjects
        $toDelete = array_diff($currentSubjects, $newSubjects);
        if (!empty($toDelete)) {
            $inQuery = implode(',', array_fill(0, count($toDelete), '?'));
            $delStmt = $db->prepare("DELETE FROM subjects WHERE class_id = ? AND name IN ($inQuery)");
            $delStmt->execute(array_merge([$id], array_values($toDelete)));
        }

        // Insert added subjects
        $toInsert = array_diff($newSubjects, $currentSubjects);
        if (!empty($toInsert)) {
            $insStmt = $db->prepare("INSERT INTO subjects (name, class_id, type) VALUES (?, ?, 'Core')");
            foreach ($toInsert as $subName) {
                $insStmt->execute([$subName, $id]);
            }
        }
    }

    jsonResponse(['success' => true, 'message' => 'Class updated']);
}

if ($method === 'DELETE') {
    requireRole(['Admin']);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) {
        jsonResponse(['success' => false, 'message' => 'Class ID required'], 422);
    }

    $stmt = $db->prepare("DELETE FROM classes WHERE id = ?");
    $stmt->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'Class deleted']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
