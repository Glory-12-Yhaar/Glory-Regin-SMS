<?php
/**
 * /api/hero_slides/index.php
 * GET    - list all hero slides
 * POST   - upload/create a slide or set a slide active (Admin only)
 * DELETE - delete a slide (Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

requireAuth();
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $db->query("SELECT * FROM hero_slides ORDER BY id DESC");
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    requireRole(['Admin']);
    $body = getRequestBody();

    // Check if we are activating an existing slide
    if (isset($body['action']) && $body['action'] === 'set_active') {
        if (empty($body['id'])) {
            jsonResponse(['success' => false, 'message' => 'Slide ID required'], 422);
        }
        $slideId = (int)$body['id'];

        $db->beginTransaction();
        try {
            // Set all to Draft
            $db->exec("UPDATE hero_slides SET status = 'Draft'");
            // Set targeted to Active
            $stmt = $db->prepare("UPDATE hero_slides SET status = 'Active' WHERE id = ?");
            $stmt->execute([$slideId]);
            $db->commit();
            jsonResponse(['success' => true, 'message' => 'Hero slide activated']);
        } catch (PDOException $e) {
            $db->rollBack();
            jsonResponse(['success' => false, 'message' => 'Failed to activate slide: ' . $e->getMessage()], 500);
        }
    } else {
        // Create new slide
        if (empty($body['image'])) {
            jsonResponse(['success' => false, 'message' => 'Slide image content is required'], 422);
        }

        $title   = $body['title'] ?? 'Glory Reign Preparatory School';
        $caption = $body['caption'] ?? '';
        $status  = $body['status'] ?? 'Active';

        $db->beginTransaction();
        try {
            if ($status === 'Active') {
                $db->exec("UPDATE hero_slides SET status = 'Draft'");
            }

            $stmt = $db->prepare("INSERT INTO hero_slides (title, caption, image, status) VALUES (?, ?, ?, ?)");
            $stmt->execute([$title, $caption, $body['image'], $status]);
            $db->commit();

            jsonResponse(['success' => true, 'message' => 'Hero slide created', 'id' => $db->lastInsertId()], 201);
        } catch (PDOException $e) {
            $db->rollBack();
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
