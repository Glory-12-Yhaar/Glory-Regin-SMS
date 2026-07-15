<?php
/**
 * /api/hero_slides/index.php
 * GET    - list hero slides; public users receive active carousel slides only
 * POST   - upload/create a slide or publish a slide (Admin only)
 * DELETE - delete a slide (Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $viewer = currentUser();
    if ($viewer && ($viewer['role'] ?? '') === 'Admin') {
        $stmt = $db->query("SELECT * FROM hero_slides ORDER BY status = 'Active' DESC, sort_order ASC, id DESC");
    } else {
        $stmt = $db->query("SELECT * FROM hero_slides WHERE status = 'Active' ORDER BY sort_order ASC, id DESC");
    }
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    requireRole(['Admin']);
    $body = getRequestBody();

    // Publish an existing slide into the public carousel.
    if (isset($body['action']) && $body['action'] === 'set_active') {
        if (empty($body['id'])) {
            jsonResponse(['success' => false, 'message' => 'Slide ID required'], 422);
        }
        $slideId = (int)$body['id'];

        $stmt = $db->prepare("UPDATE hero_slides SET status = 'Active' WHERE id = ?");
        $stmt->execute([$slideId]);
        jsonResponse(['success' => true, 'message' => 'Hero slide published']);
    } elseif (isset($body['action']) && $body['action'] === 'set_draft') {
        if (empty($body['id'])) {
            jsonResponse(['success' => false, 'message' => 'Slide ID required'], 422);
        }
        $slideId = (int)$body['id'];
        $stmt = $db->prepare("UPDATE hero_slides SET status = 'Draft' WHERE id = ?");
        $stmt->execute([$slideId]);
        jsonResponse(['success' => true, 'message' => 'Hero slide drafted']);
    } else {
        // Create new slide
        if (empty($body['image'])) {
            jsonResponse(['success' => false, 'message' => 'Slide image content is required'], 422);
        }

        $title   = $body['title'] ?? 'Glory Reign Preparatory School';
        $caption = $body['caption'] ?? '';
        $status  = in_array(($body['status'] ?? 'Draft'), ['Active', 'Draft'], true) ? $body['status'] : 'Draft';
        $sortOrder = (int)($body['sort_order'] ?? 0);

        try {
            $stmt = $db->prepare("INSERT INTO hero_slides (title, caption, image, status, sort_order) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$title, $caption, $body['image'], $status, $sortOrder]);

            jsonResponse(['success' => true, 'message' => 'Hero slide created', 'id' => (int)$db->lastInsertId()], 201);
        } catch (PDOException $e) {
            jsonResponse(['success' => false, 'message' => 'Failed to create slide: ' . $e->getMessage()], 500);
        }
    }
}

if ($method === 'DELETE') {
    requireRole(['Admin']);
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if (!$id) jsonResponse(['success' => false, 'message' => 'Slide ID required'], 422);

    $stmt = $db->prepare("DELETE FROM hero_slides WHERE id = ?");
    $stmt->execute([$id]);

    jsonResponse(['success' => true, 'message' => 'Hero slide deleted']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
