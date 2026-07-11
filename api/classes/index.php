<?php
/**
 * /api/classes/index.php
 * GET  - list all classes (with subject counts and student counts)
 * POST - create class (Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

requireAuth();
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $db->query(
        "SELECT c.id, c.name, c.level, c.class_teacher,
                COUNT(DISTINCT s.id)  AS student_count,
                COUNT(DISTINCT sb.id) AS subject_count
         FROM classes c
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

    $stmt = $db->prepare("INSERT INTO classes (name, level, class_teacher) VALUES (?, ?, ?)");
    $stmt->execute([
        htmlspecialchars(trim($body['name']), ENT_QUOTES),
        $body['level'],
        $body['class_teacher'] ?? null,
    ]);
    jsonResponse(['success' => true, 'message' => 'Class created', 'id' => $db->lastInsertId()], 201);
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

    $stmt = $db->prepare("UPDATE classes SET name = ?, level = ?, class_teacher = ? WHERE id = ?");
    $stmt->execute([
        htmlspecialchars(trim($body['name']), ENT_QUOTES),
        $body['level'],
        $body['class_teacher'] ?? null,
        $id
    ]);
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
