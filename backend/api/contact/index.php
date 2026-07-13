<?php
/**
 * /api/contact/index.php
 * POST - submit a public contact message (no auth required)
 * GET  - list contact messages (Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

if (session_status() === PHP_SESSION_NONE) session_start();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $body = getRequestBody();
    if (empty($body['name']) || empty($body['message'])) {
        jsonResponse(['success' => false, 'message' => 'name and message are required'], 422);
    }

    $stmt = $db->prepare(
        "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)"
    );
    $stmt->execute([
        htmlspecialchars(trim($body['name']),    ENT_QUOTES),
        filter_var($body['email'] ?? '', FILTER_SANITIZE_EMAIL) ?: null,
        htmlspecialchars(trim($body['subject'] ?? ''), ENT_QUOTES) ?: null,
        htmlspecialchars(trim($body['message']), ENT_QUOTES),
    ]);
    jsonResponse(['success' => true, 'message' => 'Message sent successfully'], 201);
}

if ($method === 'GET') {
    require_once __DIR__ . '/../middleware/auth.php';
    requireRole(['Admin']);

    $stmt = $db->query(
        "SELECT id, name, email, subject, message, sent_at, is_read
         FROM contact_messages ORDER BY sent_at DESC"
    );
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'PUT') {
    require_once __DIR__ . '/../middleware/auth.php';
    requireRole(['Admin']);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'ID required'], 422);
    $db->prepare("UPDATE contact_messages SET is_read = 1 WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'Marked as read']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);

// ── DELETE ────────────────────────────────────────────────────
if ($method === 'DELETE') {
    require_once __DIR__ . '/../middleware/auth.php';
    requireRole(['Admin']);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'id required'], 422);
    $db->prepare("DELETE FROM contact_messages WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'Message deleted']);
}
