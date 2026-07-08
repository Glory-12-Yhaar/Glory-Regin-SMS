<?php
/**
 * /api/notices/index.php
 * GET  - list notices (?audience=&priority=)
 * POST - create notice (Admin/Teacher)
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

    if (!empty($_GET['audience'])) {
        $where[]  = "(audience = ? OR audience = 'All')";
        $params[] = $_GET['audience'];
    }
    if (!empty($_GET['priority'])) {
        $where[]  = 'priority = ?';
        $params[] = $_GET['priority'];
    }

    $stmt = $db->prepare(
        "SELECT id, icon, title, audience, posted_by, notice_date, message, priority, attachment
         FROM notices WHERE " . implode(' AND ', $where) . "
         ORDER BY notice_date DESC"
    );
    $stmt->execute($params);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    requireRole(['Admin', 'Teacher']);
    $body = getRequestBody();
    if (empty($body['title']) || empty($body['message'])) {
        jsonResponse(['success' => false, 'message' => 'title and message are required'], 422);
    }

    $stmt = $db->prepare(
        "INSERT INTO notices (icon, title, audience, posted_by, notice_date, message, priority, attachment)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $body['icon']       ?? null,
        htmlspecialchars(trim($body['title']),   ENT_QUOTES),
        $body['audience']   ?? 'All',
        $body['posted_by']  ?? $user['name'],
        $body['notice_date'] ?? date('Y-m-d'),
        htmlspecialchars(trim($body['message']), ENT_QUOTES),
        $body['priority']   ?? 'Normal',
        $body['attachment'] ?? null,
    ]);
    jsonResponse(['success' => true, 'message' => 'Notice created', 'id' => $db->lastInsertId()], 201);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);

// ── PUT (update) ──────────────────────────────────────────────
if ($method === 'PUT') {
    requireRole(['Admin', 'Teacher']);
    $id   = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'id required'], 422);
    $body = getRequestBody();
    $fields = []; $params = [];
    foreach (['title','audience','message','priority','notice_date'] as $f) {
        if (array_key_exists($f, $body)) { $fields[] = "$f = ?"; $params[] = $body[$f]; }
    }
    if (empty($fields)) jsonResponse(['success' => false, 'message' => 'Nothing to update'], 422);
    $params[] = $id;
    $db->prepare("UPDATE notices SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
    jsonResponse(['success' => true, 'message' => 'Notice updated']);
}

// ── DELETE ────────────────────────────────────────────────────
if ($method === 'DELETE') {
    requireRole(['Admin', 'Teacher']);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'id required'], 422);
    $db->prepare("DELETE FROM notices WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'Notice deleted']);
}
