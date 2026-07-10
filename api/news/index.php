<?php
/**
 * /api/news/index.php
 * GET    - list all articles or fetch single article (?id=X)
 * POST   - create a news article (Admin only)
 * PUT    - update an article (?id=X) (Admin only)
 * DELETE - delete an article (?id=X) (Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

requireAuth();
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : 0;

function fetchArticle(PDO $db, int $id): array|false {
    $stmt = $db->prepare("SELECT * FROM news_articles WHERE id = ?");
    $stmt->execute([$id]);
    return $stmt->fetch();
}

if ($method === 'GET') {
    if ($id) {
        $art = fetchArticle($db, $id);
        if (!$art) jsonResponse(['success' => false, 'message' => 'Article not found'], 404);
        jsonResponse(['success' => true, 'data' => $art]);
    } else {
        $stmt = $db->query("SELECT * FROM news_articles ORDER BY date DESC, id DESC");
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
    }
}

if ($method === 'POST') {
    requireRole(['Admin']);
    $body = getRequestBody();

    if (empty($body['title']) || empty($body['date'])) {
        jsonResponse(['success' => false, 'message' => 'Title and Date are required'], 422);
    }

    $stmt = $db->prepare(
        "INSERT INTO news_articles (icon, title, category, date, `desc`, status) 
         VALUES (?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $body['icon']     ?? '📰',
        htmlspecialchars(trim($body['title']), ENT_QUOTES),
        $body['category'] ?? 'General',
        $body['date'],
        $body['desc']     ?? '',
        $body['status']   ?? 'Published'
    ]);

    jsonResponse(['success' => true, 'message' => 'Article created', 'id' => $db->lastInsertId()], 201);
}

if ($method === 'PUT') {
    requireRole(['Admin']);
    if (!$id) jsonResponse(['success' => false, 'message' => 'Article ID required'], 422);

    $art = fetchArticle($db, $id);
    if (!$art) jsonResponse(['success' => false, 'message' => 'Article not found'], 404);

    $body    = getRequestBody();
    $fields  = [];
    $params  = [];
    $allowed = ['icon', 'title', 'category', 'date', 'desc', 'status'];

    foreach ($allowed as $f) {
        if (array_key_exists($f, $body)) {
            $fields[] = "`$f` = ?";
            if ($f === 'title') {
                $params[] = htmlspecialchars(trim($body[$f]), ENT_QUOTES);
            } else {
                $params[] = $body[$f];
            }
        }
    }

    if (empty($fields)) jsonResponse(['success' => false, 'message' => 'No fields to update'], 422);

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
