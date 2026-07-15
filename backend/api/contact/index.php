<?php
/**
 * /api/contact/index.php
 * POST   - submit a public contact message, or admin bulk action with action field
 * GET    - list contact messages (Admin only)
 * PUT    - update read state for one message (Admin only)
 * DELETE - delete one or all contact messages (Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

function requireContactAdmin(): array {
    require_once __DIR__ . '/../middleware/auth.php';
    return requireRole(['Admin']);
}

function fetchContactMessage(PDO $db, int $id): array|false {
    $stmt = $db->prepare("SELECT id FROM contact_messages WHERE id = ?");
    $stmt->execute([$id]);
    return $stmt->fetch();
}

if ($method === 'POST') {
    $body = getRequestBody();
    $action = $body['action'] ?? '';

    if ($action === 'mark_all_read') {
        requireContactAdmin();
        $db->exec("UPDATE contact_messages SET is_read = 1");
        jsonResponse(['success' => true, 'message' => 'All messages marked as read']);
    }

    if (empty($body['name']) || empty($body['message'])) {
        jsonResponse(['success' => false, 'message' => 'Name and message are required'], 422);
    }

    $email = filter_var(trim($body['email'] ?? ''), FILTER_SANITIZE_EMAIL) ?: null;
    if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['success' => false, 'message' => 'Please provide a valid email address'], 422);
    }

    $stmt = $db->prepare(
        "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)"
    );
    $stmt->execute([
        htmlspecialchars(trim((string)$body['name']), ENT_QUOTES),
        $email,
        htmlspecialchars(trim((string)($body['subject'] ?? '')), ENT_QUOTES) ?: null,
        htmlspecialchars(trim((string)$body['message']), ENT_QUOTES),
    ]);

    jsonResponse(['success' => true, 'message' => 'Message sent successfully', 'id' => (int)$db->lastInsertId()], 201);
}

if ($method === 'GET') {
    requireContactAdmin();
    $stmt = $db->query(
        "SELECT id, name, email, subject, message, sent_at, is_read
         FROM contact_messages
         ORDER BY is_read ASC, sent_at DESC, id DESC"
    );
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'PUT') {
    requireContactAdmin();
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'Message ID required'], 422);
    if (!fetchContactMessage($db, $id)) jsonResponse(['success' => false, 'message' => 'Message not found'], 404);

    $body = getRequestBody();
    $isRead = array_key_exists('is_read', $body) ? (int)(bool)$body['is_read'] : 1;
    $db->prepare("UPDATE contact_messages SET is_read = ? WHERE id = ?")->execute([$isRead, $id]);
    jsonResponse(['success' => true, 'message' => $isRead ? 'Marked as read' : 'Marked as unread']);
}

if ($method === 'DELETE') {
    requireContactAdmin();
    $id = (int)($_GET['id'] ?? 0);
    $all = isset($_GET['all']) && (string)$_GET['all'] === '1';

    if ($all) {
        $db->exec("DELETE FROM contact_messages");
        jsonResponse(['success' => true, 'message' => 'All contact messages deleted']);
    }

    if (!$id) jsonResponse(['success' => false, 'message' => 'Message ID required'], 422);
    if (!fetchContactMessage($db, $id)) jsonResponse(['success' => false, 'message' => 'Message not found'], 404);

    $db->prepare("DELETE FROM contact_messages WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'Message deleted']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
