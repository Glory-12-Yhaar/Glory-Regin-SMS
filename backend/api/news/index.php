<?php
/**
 * /api/news/index.php
 * GET    - public published articles, admin all articles, or fetch single article (?id=X)
 * POST   - create a news article (Admin only)
 * PUT    - update an article (?id=X) (Admin only)
 * DELETE - delete an article (?id=X) (Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

function normalizeArticlePayload(array $body, bool $partial = false): array {
    $status = $body['status'] ?? null;
    if ($status !== null && !in_array($status, ['Published', 'Draft'], true)) {
        jsonResponse(['success' => false, 'message' => 'Invalid article status'], 422);
    }

    $payload = [
        'icon' => $body['icon'] ?? null,
        'title' => isset($body['title']) ? htmlspecialchars(trim((string)$body['title']), ENT_QUOTES) : null,
        'category' => $body['category'] ?? null,
        'date' => $body['date'] ?? $body['publish_date'] ?? null,
        'desc' => $body['desc'] ?? $body['summary'] ?? null,
        'content' => $body['content'] ?? null,
        'status' => $status,
    ];

    if (!$partial) {
        $payload['icon'] = $payload['icon'] ?: '<i class="fas fa-newspaper"></i>';
        $payload['category'] = $payload['category'] ?: 'General';
        $payload['desc'] = $payload['desc'] ?: '';
        $payload['content'] = $payload['content'] ?: '';
        $payload['status'] = $payload['status'] ?: 'Published';
    }

    return $payload;
}

function fetchArticle(PDO $db, int $id): array|false {
    $user = currentUser();
    if ($user && ($user['role'] ?? '') === 'Admin') {
        $stmt = $db->prepare("SELECT * FROM news_articles WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    $stmt = $db->prepare("SELECT * FROM news_articles WHERE id = ? AND status = 'Published'");
    $stmt->execute([$id]);
    return $stmt->fetch();
}

if ($method === 'GET') {
    if ($id) {
        $article = fetchArticle($db, $id);
        if (!$article) jsonResponse(['success' => false, 'message' => 'Article not found'], 404);
        jsonResponse(['success' => true, 'data' => $article]);
    }

    $user = currentUser();
    if ($user && ($user['role'] ?? '') === 'Admin') {
        $stmt = $db->query("SELECT * FROM news_articles ORDER BY status = 'Published' DESC, date DESC, id DESC");
    } else {
        $stmt = $db->query("SELECT * FROM news_articles WHERE status = 'Published' ORDER BY date DESC, id DESC");
    }
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    requireRole(['Admin']);
    $body = getRequestBody();
    $article = normalizeArticlePayload($body);

    if (empty($article['title']) || empty($article['date'])) {
        jsonResponse(['success' => false, 'message' => 'Title and date are required'], 422);
    }

    $stmt = $db->prepare(
        "INSERT INTO news_articles (icon, title, category, date, `desc`, content, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $article['icon'],
        $article['title'],
        $article['category'],
        $article['date'],
        $article['desc'],
        $article['content'],
        $article['status']
    ]);

    jsonResponse(['success' => true, 'message' => 'Article created', 'id' => (int)$db->lastInsertId()], 201);
}

if ($method === 'PUT') {
    requireRole(['Admin']);
    if (!$id) jsonResponse(['success' => false, 'message' => 'Article ID required'], 422);
    if (!fetchArticle($db, $id)) jsonResponse(['success' => false, 'message' => 'Article not found'], 404);

    $body = normalizeArticlePayload(getRequestBody(), true);
    $fields = [];
    $params = [];
    foreach (['icon', 'title', 'category', 'date', 'desc', 'content', 'status'] as $field) {
        if (array_key_exists($field, $body) && $body[$field] !== null) {
            $fields[] = "`$field` = ?";
            $params[] = $body[$field];
        }
    }

    if (!$fields) jsonResponse(['success' => false, 'message' => 'No fields to update'], 422);

    $params[] = $id;
    $db->prepare("UPDATE news_articles SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
    jsonResponse(['success' => true, 'message' => 'Article updated']);
}

if ($method === 'DELETE') {
    requireRole(['Admin']);
    if (!$id) jsonResponse(['success' => false, 'message' => 'Article ID required'], 422);
    if (!fetchArticle($db, $id)) jsonResponse(['success' => false, 'message' => 'Article not found'], 404);

    $db->prepare("DELETE FROM news_articles WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'Article deleted']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
