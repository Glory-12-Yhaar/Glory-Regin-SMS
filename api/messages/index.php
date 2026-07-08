<?php
/**
 * /api/messages/index.php
 * GET  - inbox for current user (with ?type=sent for sent box)
 * POST - send a message
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$user   = requireAuth();
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $type   = $_GET['type'] ?? 'inbox';
    $page   = max(1, (int)($_GET['page']  ?? 1));
    $limit  = min(100, max(1, (int)($_GET['limit'] ?? 30)));
    $offset = ($page - 1) * $limit;

    if ($type === 'sent') {
        $col      = 'sender_id';
        $joinCol  = 'receiver_id';
        $nameAlias= 'recipient_name';
    } else {
        $col      = 'receiver_id';
        $joinCol  = 'sender_id';
        $nameAlias= 'sender_name';
    }

    $total = (int)$db->prepare("SELECT COUNT(*) FROM messages WHERE $col = ?")
                     ->execute([$user['id']]) ? $db->query("SELECT COUNT(*) FROM messages WHERE $col = {$user['id']}")->fetchColumn() : 0;

    // Re-run properly
    $cntStmt = $db->prepare("SELECT COUNT(*) FROM messages WHERE $col = ?");
    $cntStmt->execute([$user['id']]);
    $total = (int)$cntStmt->fetchColumn();

    $stmt = $db->prepare(
        "SELECT m.id, m.subject, m.body, m.sent_at, m.read_at,
                u.name AS $nameAlias, u.role AS other_role
         FROM messages m
         JOIN users u ON u.id = m.$joinCol
         WHERE m.$col = ?
         ORDER BY m.sent_at DESC
         LIMIT $limit OFFSET $offset"
    );
    $stmt->execute([$user['id']]);

    jsonResponse([
        'success'    => true,
        'data'       => $stmt->fetchAll(),
        'total'      => $total,
        'totalPages' => ceil($total / $limit),
    ]);
}

if ($method === 'POST') {
    $body = getRequestBody();
    if (empty($body['receiver_id']) || empty($body['body'])) {
        jsonResponse(['success' => false, 'message' => 'receiver_id and body are required'], 422);
    }

    // Verify receiver exists
    $check = $db->prepare("SELECT id FROM users WHERE id = ?");
    $check->execute([(int)$body['receiver_id']]);
    if (!$check->fetch()) jsonResponse(['success' => false, 'message' => 'Recipient not found'], 404);

    $stmt = $db->prepare(
        "INSERT INTO messages (sender_id, receiver_id, subject, body) VALUES (?, ?, ?, ?)"
    );
    $stmt->execute([
        $user['id'],
        (int)$body['receiver_id'],
        htmlspecialchars(trim($body['subject'] ?? '(No Subject)'), ENT_QUOTES),
        htmlspecialchars(trim($body['body']),                       ENT_QUOTES),
    ]);
    jsonResponse(['success' => true, 'message' => 'Message sent', 'id' => $db->lastInsertId()], 201);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
