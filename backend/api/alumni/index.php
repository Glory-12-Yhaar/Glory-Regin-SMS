<?php
/**
 * /api/alumni/index.php
 * GET    - list alumni (?search=&class_year=&public=1&featured=1)
 * POST   - add alumni record (Admin only)
 * PUT    - update alumni record (Admin only)
 * DELETE - delete alumni record (Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../config/user-provisioning.php';

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

function normalizeAlumniStatus(?string $status): string {
    return in_array($status, ['Published', 'Draft', 'Archived'], true) ? $status : 'Published';
}

if ($method === 'GET') {
    $where = ['1=1'];
    $params = [];

    if (!empty($_GET['search'])) {
        $q = '%' . trim($_GET['search']) . '%';
        $where[] = '(name LIKE ? OR profession LIKE ? OR location LIKE ? OR bio LIKE ?)';
        array_push($params, $q, $q, $q, $q);
    }
    if (!empty($_GET['class_year'])) {
        $where[] = 'class_year = ?';
        $params[] = (int)$_GET['class_year'];
    }
    if (!empty($_GET['public'])) {
        $where[] = "status = 'Published'";
    }
    if (!empty($_GET['featured'])) {
        $where[] = 'featured = 1';
    }

    $stmt = $db->prepare(
        "SELECT id, alumni_code, name, class_year, profession, location, bio,
                email, phone, instagram, linkedin, twitter, facebook, avatar, avatar_color,
                status, featured, created_at, updated_at
         FROM alumni
         WHERE " . implode(' AND ', $where) . "
         ORDER BY featured DESC, class_year DESC, name ASC"
    );
    $stmt->execute($params);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    requireRole(['Admin']);
    $body = getRequestBody();
    $name = trim($body['name'] ?? '');
    if ($name === '') jsonResponse(['success' => false, 'message' => 'name is required'], 422);

    $next = (int)$db->query("SELECT COALESCE(MAX(CAST(SUBSTRING(alumni_code, 4) AS UNSIGNED)), 0) + 1 FROM alumni WHERE alumni_code LIKE 'ALM%'")->fetchColumn();
    do {
        $code = 'ALM' . str_pad($next++, 3, '0', STR_PAD_LEFT);
        $check = $db->prepare("SELECT COUNT(*) FROM alumni WHERE alumni_code = ?");
        $check->execute([$code]);
    } while ((int)$check->fetchColumn() > 0);

    $stmt = $db->prepare(
        "INSERT INTO alumni (alumni_code, name, class_year, profession, location, bio, email, phone,
                             instagram, linkedin, twitter, facebook, avatar, avatar_color, status, featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $code,
        $name,
        $body['class_year'] ?? null,
        trim($body['profession'] ?? '') ?: null,
        trim($body['location'] ?? '') ?: null,
        trim($body['bio'] ?? '') ?: null,
        filter_var(trim($body['email'] ?? ''), FILTER_SANITIZE_EMAIL) ?: null,
        trim($body['phone'] ?? '') ?: null,
        trim($body['instagram'] ?? '') ?: null,
        trim($body['linkedin'] ?? '') ?: null,
        trim($body['twitter'] ?? '') ?: null,
        trim($body['facebook'] ?? '') ?: null,
        trim($body['avatar'] ?? '') ?: strtoupper(substr($name, 0, 2)),
        trim($body['avatar_color'] ?? '') ?: 'blue',
        normalizeAlumniStatus($body['status'] ?? 'Published'),
        !empty($body['featured']) ? 1 : 0,
    ]);

    jsonResponse(['success' => true, 'message' => 'Alumni added', 'id' => (int)$db->lastInsertId(), 'alumni_code' => $code], 201);
}

if ($method === 'PUT') {
    requireRole(['Admin']);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'id required'], 422);

    $body = getRequestBody();
    $fields = [];
    $params = [];
    foreach (['name', 'class_year', 'profession', 'location', 'bio', 'email', 'phone', 'instagram', 'linkedin', 'twitter', 'facebook', 'avatar', 'avatar_color', 'status', 'featured'] as $field) {
        if (!array_key_exists($field, $body)) continue;
        $fields[] = "$field = ?";
        if ($field === 'status') {
            $params[] = normalizeAlumniStatus($body[$field]);
        } elseif ($field === 'featured') {
            $params[] = !empty($body[$field]) ? 1 : 0;
        } else {
            $params[] = $body[$field];
        }
    }

    if (!$fields) jsonResponse(['success' => false, 'message' => 'Nothing to update'], 422);
    $params[] = $id;
    $db->prepare("UPDATE alumni SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
    jsonResponse(['success' => true, 'message' => 'Alumni updated']);
}

if ($method === 'DELETE') {
    requireRole(['Admin']);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'id required'], 422);
    $db->prepare("DELETE FROM alumni WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'Alumni deleted']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
