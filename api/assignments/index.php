<?php
/**
 * /api/assignments/index.php
 * GET  - list assignments (?class_id=&teacher_id=&status=)
 * POST - create assignment (Teacher/Admin)
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

    if (!empty($_GET['class_id'])) { $where[] = 'a.class_id = ?'; $params[] = (int)$_GET['class_id']; }
    if (!empty($_GET['status']))   { $where[] = 'a.status = ?';   $params[] = $_GET['status']; }

    $stmt = $db->prepare(
        "SELECT a.id, a.title, a.subject, a.due_date, a.created_date, a.max_score,
                a.status, a.instructions, a.attachment,
                c.name AS class_name, s.name AS teacher_name
         FROM assignments a
         LEFT JOIN classes c ON c.id = a.class_id
         LEFT JOIN staff   s ON s.id = a.teacher_id
         WHERE " . implode(' AND ', $where) . "
         ORDER BY a.due_date ASC"
    );
    $stmt->execute($params);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    requireRole(['Admin', 'Teacher']);
    $body     = getRequestBody();
    $required = ['title', 'class_id', 'due_date'];
    foreach ($required as $f) {
        if (empty($body[$f])) jsonResponse(['success' => false, 'message' => "Field '$f' required"], 422);
    }

    $stmt = $db->prepare(
        "INSERT INTO assignments (title, subject, class_id, teacher_id, due_date, created_date, max_score, status, instructions, attachment)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        htmlspecialchars(trim($body['title']), ENT_QUOTES),
        $body['subject']      ?? null,
        (int)$body['class_id'],
        $body['teacher_id']   ?? null,
        $body['due_date'],
        $body['created_date'] ?? date('Y-m-d'),
        (int)($body['max_score'] ?? 100),
        $body['status']       ?? 'Active',
        $body['instructions'] ?? null,
        $body['attachment']   ?? null,
    ]);
    jsonResponse(['success' => true, 'message' => 'Assignment created', 'id' => $db->lastInsertId()], 201);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
