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

$db->exec("ALTER TABLE classes ADD COLUMN IF NOT EXISTS teacher_id INT DEFAULT NULL");
$db->exec("ALTER TABLE classes ADD COLUMN IF NOT EXISTS capacity INT NOT NULL DEFAULT 40");
$db->exec("ALTER TABLE classes ADD COLUMN IF NOT EXISTS stream VARCHAR(80) NOT NULL DEFAULT 'General'");
$db->exec("ALTER TABLE classes ADD COLUMN IF NOT EXISTS updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");

function getTeachingStaffName(PDO $db, ?int $teacherId): ?string {
    if (!$teacherId) return null;

    $stmt = $db->prepare("SELECT name FROM staff WHERE id = ? AND category = 'Teaching' AND status = 'Active' LIMIT 1");
    $stmt->execute([$teacherId]);
    $name = $stmt->fetchColumn();
    if (!$name) {
        jsonResponse(['success' => false, 'message' => 'Selected class teacher must be an active teaching staff member'], 422);
    }
    return $name;
}

function normalizeSubjects(array $subjects): array {
    $clean = [];
    foreach ($subjects as $subject) {
        $name = htmlspecialchars(trim((string)$subject), ENT_QUOTES);
        if ($name !== '' && !in_array($name, $clean, true)) {
            $clean[] = $name;
        }
    }
    return $clean;
}

if ($method === 'GET') {
    $stmt = $db->query(
        "SELECT c.id, c.name, c.level, c.teacher_id, c.capacity, c.stream, st.name AS teacher_name,
                COUNT(DISTINCT s.id)  AS student_count,
                COALESCE(ROUND(AVG(s.attendance), 1), 0) AS attendance_avg,
                COUNT(DISTINCT sb.id) AS subject_count,
                GROUP_CONCAT(DISTINCT sb.name ORDER BY sb.name ASC) AS subjects
         FROM classes c
         LEFT JOIN staff st    ON st.id = c.teacher_id
         LEFT JOIN students s  ON s.class_id  = c.id AND s.status = 'Active'
         LEFT JOIN subjects sb ON sb.class_id = c.id
         GROUP BY c.id, c.name, c.level, c.teacher_id, c.capacity, c.stream, st.name
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
    $teacherName = getTeachingStaffName($db, $teacherId);

    $capacity = max(1, isset($body['capacity']) ? (int)$body['capacity'] : 40);
    $stream = !empty($body['stream']) ? htmlspecialchars(trim($body['stream']), ENT_QUOTES) : 'General';

    $db->beginTransaction();
    try {
        $stmt = $db->prepare("INSERT INTO classes (name, level, teacher_id, class_teacher, capacity, stream) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            htmlspecialchars(trim($body['name']), ENT_QUOTES),
            htmlspecialchars(trim($body['level']), ENT_QUOTES),
            $teacherId,
            $teacherName,
            $capacity,
            $stream
        ]);
        $classId = (int)$db->lastInsertId();

        if (!empty($body['subjects']) && is_array($body['subjects'])) {
            $insSub = $db->prepare("INSERT INTO subjects (name, class_id, type) VALUES (?, ?, 'Core')");
            foreach (normalizeSubjects($body['subjects']) as $subName) {
                $insSub->execute([$subName, $classId]);
            }
        }

        $db->commit();
        jsonResponse(['success' => true, 'message' => 'Class created', 'id' => $classId], 201);
    } catch (PDOException $e) {
        $db->rollBack();
        $message = $e->getCode() === '23000' ? 'Class name already exists or related data is invalid' : 'Failed to create class';
        jsonResponse(['success' => false, 'message' => $message], 422);
    }
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

    $exists = $db->prepare("SELECT COUNT(*) FROM classes WHERE id = ?");
    $exists->execute([$id]);
    if ((int)$exists->fetchColumn() === 0) {
        jsonResponse(['success' => false, 'message' => 'Class not found'], 404);
    }

    $teacherId = !empty($body['teacher_id']) ? (int)$body['teacher_id'] : null;
    $teacherName = getTeachingStaffName($db, $teacherId);

    $capacity = max(1, isset($body['capacity']) ? (int)$body['capacity'] : 40);
    $stream = !empty($body['stream']) ? htmlspecialchars(trim($body['stream']), ENT_QUOTES) : 'General';

    $db->beginTransaction();
    try {
        $stmt = $db->prepare("UPDATE classes SET name = ?, level = ?, teacher_id = ?, class_teacher = ?, capacity = ?, stream = ? WHERE id = ?");
        $stmt->execute([
            htmlspecialchars(trim($body['name']), ENT_QUOTES),
            htmlspecialchars(trim($body['level']), ENT_QUOTES),
            $teacherId,
            $teacherName,
            $capacity,
            $stream,
            $id
        ]);

        if (isset($body['subjects']) && is_array($body['subjects'])) {
            $db->prepare("DELETE FROM subjects WHERE class_id = ?")->execute([$id]);
            $insStmt = $db->prepare("INSERT INTO subjects (name, class_id, type) VALUES (?, ?, 'Core')");
            foreach (normalizeSubjects($body['subjects']) as $subName) {
                $insStmt->execute([$subName, $id]);
            }
        }

        $db->commit();
        jsonResponse(['success' => true, 'message' => 'Class updated']);
    } catch (PDOException $e) {
        $db->rollBack();
        $message = $e->getCode() === '23000' ? 'Class name already exists or related data is invalid' : 'Failed to update class';
        jsonResponse(['success' => false, 'message' => $message], 422);
    }
}

if ($method === 'DELETE') {
    requireRole(['Admin']);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) {
        jsonResponse(['success' => false, 'message' => 'Class ID required'], 422);
    }

    $stmt = $db->prepare("DELETE FROM classes WHERE id = ?");
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) {
        jsonResponse(['success' => false, 'message' => 'Class not found'], 404);
    }
    jsonResponse(['success' => true, 'message' => 'Class deleted']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
