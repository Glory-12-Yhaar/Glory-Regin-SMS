<?php
/**
 * /api/events/index.php
 * GET  - list events (?audience=&from=&to=)
 * POST - create event (Admin/Teacher)
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
    if (!empty($_GET['from'])) { $where[] = 'event_date >= ?'; $params[] = $_GET['from']; }
    if (!empty($_GET['to']))   { $where[] = 'event_date <= ?'; $params[] = $_GET['to'];   }

    $stmt = $db->prepare(
        "SELECT id, title, event_date, event_time, all_day, audience, description
         FROM events WHERE " . implode(' AND ', $where) . "
         ORDER BY event_date ASC"
    );
    $stmt->execute($params);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    requireRole(['Admin', 'Teacher']);
    $body     = getRequestBody();
    $required = ['title', 'event_date'];
    foreach ($required as $f) {
        if (empty($body[$f])) jsonResponse(['success' => false, 'message' => "Field '$f' required"], 422);
    }

    $stmt = $db->prepare(
        "INSERT INTO events (title, event_date, event_time, all_day, audience, description, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        htmlspecialchars(trim($body['title']), ENT_QUOTES),
        $body['event_date'],
        $body['event_time']  ?? null,
        (int)($body['all_day'] ?? 0),
        $body['audience']    ?? 'All',
        $body['description'] ?? null,
        $user['id'],
    ]);
    jsonResponse(['success' => true, 'message' => 'Event created', 'id' => $db->lastInsertId()], 201);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);

// ── PUT (update) ──────────────────────────────────────────────
if ($method === 'PUT') {
    requireRole(['Admin', 'Teacher']);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'id required'], 422);
    $body = getRequestBody();
    $fields = []; $params = [];
    foreach (['title','event_date','event_time','all_day','audience','description'] as $f) {
        if (array_key_exists($f, $body)) { $fields[] = "$f = ?"; $params[] = $body[$f]; }
    }
    if (empty($fields)) jsonResponse(['success' => false, 'message' => 'Nothing to update'], 422);
    $params[] = $id;
    $db->prepare("UPDATE events SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
    jsonResponse(['success' => true, 'message' => 'Event updated']);
}

// ── DELETE ────────────────────────────────────────────────────
if ($method === 'DELETE') {
    requireRole(['Admin', 'Teacher']);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'id required'], 422);
    $db->prepare("DELETE FROM events WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'Event deleted']);
}
