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
    if (empty($body['name'])) {
        jsonResponse(['success' => false, 'message' => 'Subject name is required'], 422);
    }
    if (empty($body['class_id'])) {
        jsonResponse(['success' => false, 'message' => 'Class assignment is required'], 422);
    }

    $classId = (int)$body['class_id'];
    $clQuery = $db->prepare("SELECT name FROM classes WHERE id = ?");
    $clQuery->execute([$classId]);
    $className = $clQuery->fetchColumn() ?: 'Unknown Class';

    $stmt = $db->prepare(
        "INSERT INTO subjects (name, icon, teacher_id, type, classes, class_id, hours, description) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        htmlspecialchars(trim($body['name']), ENT_QUOTES),
        $body['icon']        ?? null,
        !empty($body['teacher_id']) ? (int)$body['teacher_id'] : null,
        $body['type']        ?? 'Core',
        $className,
        $classId,
        $body['hours']       ?? null,
        $body['description'] ?? null
    ]);

    jsonResponse(['success' => true, 'message' => 'Subject created', 'id' => $db->lastInsertId()], 201);
}

if ($method === 'PUT') {
    requireRole(['Admin']);
    if (!$id) jsonResponse(['success' => false, 'message' => 'Subject ID required'], 422);
    
    $subject = fetchSubject($db, $id);
    if (!$subject) jsonResponse(['success' => false, 'message' => 'Subject not found'], 404);

    $body    = getRequestBody();
    $fields  = [];
    $params  = [];
    $allowed = ['name', 'icon', 'teacher_id', 'type', 'class_id', 'classes', 'hours', 'description'];

    if (!empty($body['class_id'])) {
        $classId = (int)$body['class_id'];
        $clQuery = $db->prepare("SELECT name FROM classes WHERE id = ?");
        $clQuery->execute([$classId]);
        $body['classes'] = $clQuery->fetchColumn() ?: 'Unknown Class';
    }

    foreach ($allowed as $f) {
        if (array_key_exists($f, $body)) {
            $fields[] = "$f = ?";
            if ($f === 'name') {
                $params[] = htmlspecialchars(trim($body[$f]), ENT_QUOTES);
            } else if ($f === 'teacher_id') {
                $params[] = !empty($body[$f]) ? (int)$body[$f] : null;
            } else if ($f === 'class_id') {
                $params[] = (int)$body[$f];
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
