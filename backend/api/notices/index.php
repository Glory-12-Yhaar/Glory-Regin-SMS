<?php
/**
 * /api/notices/index.php
 * GET    - list published notices for public/portal display
 * POST   - create notice (Admin/Teacher)
 * PUT    - update notice (Admin/Teacher)
 * DELETE - delete notice (Admin/Teacher)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

function validateNoticeEnum(?string $value, array $allowed, string $field): void {
    if ($value !== null && !in_array($value, $allowed, true)) {
        jsonResponse(['success' => false, 'message' => "Invalid $field"], 422);
    }
}

if ($method === 'GET') {
    $where = ['1=1'];
    $params = [];
    $viewer = currentUser();

    if (!empty($_GET['audience'])) {
        $where[] = "(audience = ? OR audience = 'All')";
        $params[] = $_GET['audience'];
    }
    if (!empty($_GET['priority'])) {
        $where[] = 'priority = ?';
        $params[] = $_GET['priority'];
    }
    if (!$viewer || !in_array($viewer['role'] ?? '', ['Admin', 'Teacher'], true)) {
        $where[] = "status = 'Published'";
    } elseif (!empty($_GET['status'])) {
        $where[] = 'status = ?';
        $params[] = $_GET['status'];
    }

    $limit = max(1, min(500, (int)($_GET['limit'] ?? 200)));
    $stmt = $db->prepare(
        "SELECT id, icon, title, audience, posted_by, notice_date, message, priority, status, attachment, created_at, updated_at
         FROM notices
         WHERE " . implode(' AND ', $where) . "
         ORDER BY notice_date DESC, id DESC
         LIMIT $limit"
    );
    $stmt->execute($params);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    $user = requireRole(['Admin', 'Teacher']);
    $body = getRequestBody();
    if (empty($body['title']) || empty($body['message'])) {
        jsonResponse(['success' => false, 'message' => 'title and message are required'], 422);
    }

    validateNoticeEnum($body['priority'] ?? null, ['Normal', 'Important', 'Urgent'], 'priority');
    validateNoticeEnum($body['status'] ?? null, ['Published', 'Draft', 'Archived'], 'status');

    $stmt = $db->prepare(
        "INSERT INTO notices (icon, title, audience, posted_by, notice_date, message, priority, status, attachment)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $body['icon'] ?? null,
        htmlspecialchars(trim($body['title']), ENT_QUOTES),
        $body['audience'] ?? 'All',
        $body['posted_by'] ?? $user['name'],
        $body['notice_date'] ?? date('Y-m-d'),
        htmlspecialchars(trim($body['message']), ENT_QUOTES),
        $body['priority'] ?? 'Normal',
        $body['status'] ?? 'Published',
        $body['attachment'] ?? null,
    ]);
    jsonResponse(['success' => true, 'message' => 'Notice created', 'id' => (int)$db->lastInsertId()], 201);
}

if ($method === 'PUT') {
    requireRole(['Admin', 'Teacher']);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'id required'], 422);
    $body = getRequestBody();

    validateNoticeEnum($body['priority'] ?? null, ['Normal', 'Important', 'Urgent'], 'priority');
    validateNoticeEnum($body['status'] ?? null, ['Published', 'Draft', 'Archived'], 'status');

    $fields = [];
    $params = [];
    foreach (['icon', 'title', 'audience', 'posted_by', 'message', 'priority', 'status', 'notice_date', 'attachment'] as $field) {
        if (array_key_exists($field, $body)) {
            $fields[] = "$field = ?";
            $params[] = in_array($field, ['title', 'message'], true)
                ? htmlspecialchars(trim((string)$body[$field]), ENT_QUOTES)
                : $body[$field];
        }
    }
    if (!$fields) jsonResponse(['success' => false, 'message' => 'Nothing to update'], 422);

    $params[] = $id;
    $db->prepare("UPDATE notices SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
    jsonResponse(['success' => true, 'message' => 'Notice updated']);
}

if ($method === 'DELETE') {
    requireRole(['Admin', 'Teacher']);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'id required'], 422);

    $db->prepare("DELETE FROM notices WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'Notice deleted']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
