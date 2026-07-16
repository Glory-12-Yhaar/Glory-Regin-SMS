<?php
/**
 * /api/gallery/items.php
 * GET  - list items for an album (?album_id=X)
 * POST - add a photo to an album (Admin only)
 * DELETE - remove a photo (?id=X, Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

requireAuth();
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $albumId = (int)($_GET['album_id'] ?? 0);
    if (!$albumId) jsonResponse(['success' => false, 'message' => 'album_id required'], 422);

    $stmt = $db->prepare(
        "SELECT id, album_id, caption, image, sort_order, created_at
         FROM gallery_items
         WHERE album_id = ?
         ORDER BY sort_order ASC, id ASC"
    );
    $stmt->execute([$albumId]);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    requireRole(['Admin']);
    $body    = getRequestBody();
    $albumId = (int)($body['album_id'] ?? 0);
    $image   = $body['image'] ?? '';
    if (!$albumId || !$image) {
        jsonResponse(['success' => false, 'message' => 'album_id and image are required'], 422);
    }

    $stmt = $db->prepare(
        "INSERT INTO gallery_items (album_id, caption, image, sort_order) VALUES (?, ?, ?, ?)"
    );
    $stmt->execute([
        $albumId,
        trim($body['caption'] ?? ''),
        $image,
        (int)($body['sort_order'] ?? 0),
    ]);

    // Update album item count
    $db->prepare("UPDATE gallery_albums SET item_count = (SELECT COUNT(*) FROM gallery_items WHERE album_id = ?) WHERE id = ?")
       ->execute([$albumId, $albumId]);

    jsonResponse(['success' => true, 'message' => 'Photo added', 'id' => (int)$db->lastInsertId()], 201);
}

if ($method === 'DELETE') {
    requireRole(['Admin']);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'id required'], 422);

    // Get album_id before deletion so we can update count
    $row = $db->prepare("SELECT album_id FROM gallery_items WHERE id = ?");
    $row->execute([$id]);
    $item = $row->fetch();

    $db->prepare("DELETE FROM gallery_items WHERE id = ?")->execute([$id]);

    if ($item) {
        $db->prepare("UPDATE gallery_albums SET item_count = (SELECT COUNT(*) FROM gallery_items WHERE album_id = ?) WHERE id = ?")
           ->execute([$item['album_id'], $item['album_id']]);
    }

    jsonResponse(['success' => true, 'message' => 'Photo deleted']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
