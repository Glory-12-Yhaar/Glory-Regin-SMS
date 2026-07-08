<?php
/**
 * /api/alumni/index.php
 * GET  - list alumni (?search=&class_year=)
 * POST - add alumni record (Admin only)
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

    if (!empty($_GET['search'])) {
        $q        = '%' . $_GET['search'] . '%';
        $where[]  = '(name LIKE ? OR profession LIKE ? OR location LIKE ?)';
        $params[] = $q; $params[] = $q; $params[] = $q;
    }
    if (!empty($_GET['class_year'])) {
        $where[]  = 'class_year = ?';
        $params[] = (int)$_GET['class_year'];
    }

    $stmt = $db->prepare(
        "SELECT id, alumni_code, name, class_year, profession, location, bio,
                email, phone, instagram, linkedin, twitter, facebook, avatar, avatar_color
         FROM alumni WHERE " . implode(' AND ', $where) . "
         ORDER BY class_year DESC, name ASC"
    );
    $stmt->execute($params);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    requireRole(['Admin']);
    $body = getRequestBody();
    if (empty($body['name'])) jsonResponse(['success' => false, 'message' => 'name is required'], 422);

    $count = (int)$db->query("SELECT COUNT(*) FROM alumni")->fetchColumn() + 1;
    $code  = 'ALM' . str_pad($count, 3, '0', STR_PAD_LEFT);

    $stmt = $db->prepare(
        "INSERT INTO alumni (alumni_code, name, class_year, profession, location, bio, email, phone,
                             instagram, linkedin, twitter, facebook, avatar, avatar_color)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $code,
        htmlspecialchars(trim($body['name']), ENT_QUOTES),
        $body['class_year']   ?? null,
        $body['profession']   ?? null,
        $body['location']     ?? null,
        $body['bio']          ?? null,
        $body['email']        ?? null,
        $body['phone']        ?? null,
        $body['instagram']    ?? null,
        $body['linkedin']     ?? null,
        $body['twitter']      ?? null,
        $body['facebook']     ?? null,
        $body['avatar']       ?? strtoupper(substr($body['name'], 0, 2)),
        $body['avatar_color'] ?? 'blue',
    ]);
    jsonResponse(['success' => true, 'message' => 'Alumni added', 'id' => $db->lastInsertId(), 'alumni_code' => $code], 201);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);

// ── PUT (update) ──────────────────────────────────────────────
if ($method === 'PUT') {
    requireRole(['Admin']);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'id required'], 422);
    $body = getRequestBody();
    $fields = []; $params = [];
    foreach (['name','class_year','profession','location','bio','email','phone','instagram','linkedin','twitter','facebook'] as $f) {
        if (array_key_exists($f, $body)) { $fields[] = "$f = ?"; $params[] = $body[$f]; }
    }
    if (empty($fields)) jsonResponse(['success' => false, 'message' => 'Nothing to update'], 422);
    $params[] = $id;
    $db->prepare("UPDATE alumni SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
    jsonResponse(['success' => true, 'message' => 'Alumni updated']);
}

// ── DELETE ────────────────────────────────────────────────────
if ($method === 'DELETE') {
    requireRole(['Admin']);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'id required'], 422);
    $db->prepare("DELETE FROM alumni WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'Alumni deleted']);
}
