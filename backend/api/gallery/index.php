<?php
/**
 * /api/gallery/index.php
 * GET    – list gallery albums
 * POST   – create a gallery album (Admin only)
 * DELETE – delete a gallery album (Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET ──────────────────────────────────────────────────────────────────────
if ($method === 'GET') {
    $category = $_GET['category'] ?? '';
    $year     = $_GET['year'] ?? '';
    $status   = $_GET['status'] ?? 'Published';

    $where  = ['1=1'];
    $params = [];

    if ($status) { $where[] = 'status = ?'; $params[] = $status; }
    if ($category) { $where[] = 'category = ?'; $params[] = $category; }
    if ($year) { $where[] = 'year = ?'; $params[] = $year; }

    $stmt = $db->prepare(
        "SELECT id, title, category, year, item_count, icon, bg_color, cover_img, status, created_at
         FROM gallery_albums
         WHERE " . implode(' AND ', $where) . "
         ORDER BY year DESC, created_at DESC"
    );
    $stmt->execute($params);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

// ── POST ─────────────────────────────────────────────────────────────────────
if ($method === 'POST') {
    requireAuth();
    requireRole(['Admin']);
    $body  = getRequestBody();
    $title = trim($body['title'] ?? '');
    if (!$title) jsonResponse(['success' => false, 'message' => 'title is required'], 422);

    $stmt = $db->prepare(
        "INSERT INTO gallery_albums (title, category, year, item_count, icon, bg_color, cover_img, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $title,
        trim($body['category']   ?? 'School Events'),
        trim($body['year']       ?? date('Y')),
        (int)($body['item_count'] ?? 0),
        trim($body['icon']       ?? 'fa-images'),
        trim($body['bg_color']   ?? 'linear-gradient(135deg, #3b82f6, #1e3a5f)'),
        trim($body['cover_img']  ?? null),
        trim($body['status']     ?? 'Published')
    ]);

    jsonResponse(['success' => true, 'message' => 'Gallery album created', 'id' => (int)$db->lastInsertId()], 201);
}

// ── DELETE ───────────────────────────────────────────────────────────────────
if ($method === 'DELETE') {
    requireAuth();
    requireRole(['Admin']);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'id required'], 422);

    $db->prepare("DELETE FROM gallery_albums WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'Gallery album deleted']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
