<?php
/**
 * /api/subjects/index.php
 * GET    - list all subjects or get single subject (if ?id=X)
 * POST   - create subject (Admin only)
 * PUT    - update subject (if ?id=X) (Admin only)
 * DELETE - delete subject (if ?id=X) (Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

requireAuth();
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : 0;

$db->exec("ALTER TABLE subjects ADD COLUMN IF NOT EXISTS icon VARCHAR(100) DEFAULT NULL");
$db->exec("ALTER TABLE subjects ADD COLUMN IF NOT EXISTS teacher_id INT DEFAULT NULL");
$db->exec("ALTER TABLE subjects ADD COLUMN IF NOT EXISTS classes VARCHAR(255) DEFAULT NULL");
$db->exec("ALTER TABLE subjects ADD COLUMN IF NOT EXISTS hours VARCHAR(80) DEFAULT NULL");
$db->exec("ALTER TABLE subjects ADD COLUMN IF NOT EXISTS description TEXT DEFAULT NULL");
$db->exec("ALTER TABLE subjects ADD COLUMN IF NOT EXISTS updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");

function sanitizeSubjectType(?string $type): string {
    $type = $type ?: 'Core';
    $allowed = ['Core', 'Elective', 'Extracurricular'];
    if (!in_array($type, $allowed, true)) {
        jsonResponse(['success' => false, 'message' => 'Invalid subject type'], 422);
    }
    return $type;
}

function getClassNameOrFail(PDO $db, $classId): string {
    $classId = (int)$classId;
    if (!$classId) {
        jsonResponse(['success' => false, 'message' => 'Class assignment is required'], 422);
    }
    $stmt = $db->prepare("SELECT name FROM classes WHERE id = ? LIMIT 1");
    $stmt->execute([$classId]);
    $className = $stmt->fetchColumn();
    if (!$className) {
        jsonResponse(['success' => false, 'message' => 'Selected class does not exist'], 422);
    }
    return $className;
}

function validateTeacherId(PDO $db, $teacherId): ?int {
    if (empty($teacherId)) return null;
    $teacherId = (int)$teacherId;
    $stmt = $db->prepare("SELECT COUNT(*) FROM staff WHERE id = ? AND category = 'Teaching' AND status = 'Active'");
    $stmt->execute([$teacherId]);
    if ((int)$stmt->fetchColumn() === 0) {
        jsonResponse(['success' => false, 'message' => 'Selected subject teacher must be an active teaching staff member'], 422);
    }
    return $teacherId;
}

function fetchSubject(PDO $db, int $id): array|false {
    $stmt = $db->prepare(
        "SELECT sub.*, s.name AS teacher_name, c.name AS class_name 
         FROM subjects sub 
         LEFT JOIN staff s ON s.id = sub.teacher_id 
         LEFT JOIN classes c ON c.id = sub.class_id
         WHERE sub.id = ?"
    );
    $stmt->execute([$id]);
    return $stmt->fetch();
}

if ($method === 'GET') {
    if ($id) {
        $subject = fetchSubject($db, $id);
        if (!$subject) jsonResponse(['success' => false, 'message' => 'Subject not found'], 404);
        jsonResponse(['success' => true, 'data' => $subject]);
    } else {
        $stmt = $db->query(
            "SELECT sub.*, s.name AS teacher_name, c.name AS class_name 
             FROM subjects sub 
             LEFT JOIN staff s ON s.id = sub.teacher_id 
             LEFT JOIN classes c ON c.id = sub.class_id
             ORDER BY sub.name ASC"
        );
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
    }
}

if ($method === 'POST') {
    requireRole(['Admin']);
    $body = getRequestBody();
    if (empty(trim((string)($body['name'] ?? '')))) {
        jsonResponse(['success' => false, 'message' => 'Subject name is required'], 422);
    }
    if (empty($body['class_id'])) {
        jsonResponse(['success' => false, 'message' => 'Class assignment is required'], 422);
    }

    $classId = (int)$body['class_id'];
    $className = getClassNameOrFail($db, $classId);
    $teacherId = validateTeacherId($db, $body['teacher_id'] ?? null);
    $type = sanitizeSubjectType($body['type'] ?? 'Core');

    $stmt = $db->prepare(
        "INSERT INTO subjects (name, icon, teacher_id, type, classes, class_id, hours, description) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        htmlspecialchars(trim($body['name']), ENT_QUOTES),
        !empty($body['icon']) ? trim($body['icon']) : null,
        $teacherId,
        $type,
        $className,
        $classId,
        !empty($body['hours']) ? htmlspecialchars(trim($body['hours']), ENT_QUOTES) : null,
        !empty($body['description']) ? htmlspecialchars(trim($body['description']), ENT_QUOTES) : null
    ]);

    jsonResponse(['success' => true, 'message' => 'Subject created', 'id' => $db->lastInsertId()], 201);
}

if ($method === 'PUT') {
    requireRole(['Admin']);
    if (!$id) jsonResponse(['success' => false, 'message' => 'Subject ID required'], 422);
    
    $subject = fetchSubject($db, $id);
    if (!$subject) jsonResponse(['success' => false, 'message' => 'Subject not found'], 404);

    $body    = getRequestBody();
    if (array_key_exists('name', $body) && trim((string)$body['name']) === '') {
        jsonResponse(['success' => false, 'message' => 'Subject name is required'], 422);
    }
    $fields  = [];
    $params  = [];
    $allowed = ['name', 'icon', 'teacher_id', 'type', 'class_id', 'classes', 'hours', 'description'];

    if (array_key_exists('class_id', $body)) {
        $classId = (int)$body['class_id'];
        $body['classes'] = getClassNameOrFail($db, $classId);
    }

    if (array_key_exists('teacher_id', $body)) {
        $body['teacher_id'] = validateTeacherId($db, $body['teacher_id']);
    }

    if (array_key_exists('type', $body)) {
        $body['type'] = sanitizeSubjectType($body['type']);
    }

    foreach ($allowed as $f) {
        if (array_key_exists($f, $body)) {
            $fields[] = "$f = ?";
            if ($f === 'name') {
                $params[] = htmlspecialchars(trim((string)$body[$f]), ENT_QUOTES);
            } else if ($f === 'hours' || $f === 'description') {
                $value = trim((string)($body[$f] ?? ''));
                $params[] = $value !== '' ? htmlspecialchars($value, ENT_QUOTES) : null;
            } else if ($f === 'teacher_id') {
                $params[] = $body[$f];
            } else if ($f === 'class_id') {
                $params[] = (int)$body[$f];
            } else if ($f === 'icon') {
                $params[] = !empty($body[$f]) ? trim($body[$f]) : null;
            } else {
                $params[] = $body[$f];
            }
        }
    }

    if (empty($fields)) jsonResponse(['success' => false, 'message' => 'No fields to update'], 422);
    
    $params[] = $id;
    $db->prepare("UPDATE subjects SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
    jsonResponse(['success' => true, 'message' => 'Subject updated']);
}

if ($method === 'DELETE') {
    requireRole(['Admin']);
    if (!$id) jsonResponse(['success' => false, 'message' => 'Subject ID required'], 422);
    
    if (!fetchSubject($db, $id)) jsonResponse(['success' => false, 'message' => 'Subject not found'], 404);

    $db->prepare("DELETE FROM subjects WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'Subject deleted']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
