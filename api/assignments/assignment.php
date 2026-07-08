<?php
/**
 * /api/assignments/assignment.php?id=X
 * GET    - single assignment
 * PUT    - update assignment
 * DELETE - delete assignment
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$user   = requireAuth();
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = (int)($_GET['id'] ?? 0);
if (!$id) jsonResponse(['success' => false, 'message' => 'id required'], 422);

if ($method === 'GET') {
    $stmt = $db->prepare(
        "SELECT a.*, c.name AS class_name, s.name AS teacher_name
         FROM assignments a
         LEFT JOIN classes c ON c.id = a.class_id
         LEFT JOIN staff   s ON s.id = a.teacher_id
         WHERE a.id = ?"
    );
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) jsonResponse(['success' => false, 'message' => 'Not found'], 404);
    jsonResponse(['success' => true, 'data' => $row]);
}

if ($method === 'PUT') {
    requireRole(['Admin', 'Teacher']);
    $body = getRequestBody();
    $fields = []; $params = [];
    foreach (['title','subject','class_id','due_date','max_score','status','instructions'] as $f) {
        if (array_key_exists($f, $body)) { $fields[] = "$f = ?"; $params[] = $body[$f]; }
    }
    if (empty($fields)) jsonResponse(['success' => false, 'message' => 'Nothing to update'], 422);
    $params[] = $id;
    $db->prepare("UPDATE assignments SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
    jsonResponse(['success' => true, 'message' => 'Assignment updated']);
}

if ($method === 'DELETE') {
    requireRole(['Admin', 'Teacher']);
    $db->prepare("DELETE FROM assignments WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'Assignment deleted']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
