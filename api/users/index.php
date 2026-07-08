<?php
/**
 * /api/users/index.php
 * GET  - list users (Admin only)
 * POST - create user (Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

requireRole(['Admin']);
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $where  = ['1=1'];
    $params = [];

    if (!empty($_GET['role']))   { $where[] = 'role = ?';    $params[] = $_GET['role']; }
    if (!empty($_GET['status'])) { $where[] = 'status = ?';  $params[] = $_GET['status']; }
    if (!empty($_GET['search'])) {
        $q = '%' . $_GET['search'] . '%';
        $where[] = '(name LIKE ? OR username LIKE ? OR email LIKE ?)';
        $params[] = $q; $params[] = $q; $params[] = $q;
    }

    $whereStr = implode(' AND ', $where);
    $stmt = $db->prepare(
        "SELECT id, user_code, name, username, email, role, status, avatar, last_login, created_at
         FROM users WHERE $whereStr ORDER BY name ASC"
    );
    $stmt->execute($params);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    $body     = getRequestBody();
    $required = ['name', 'username', 'email', 'password', 'role'];
    foreach ($required as $f) {
        if (empty($body[$f])) jsonResponse(['success' => false, 'message' => "Field '$f' required"], 422);
    }

    // Check uniqueness
    $check = $db->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
    $check->execute([$body['username'], $body['email']]);
    if ($check->fetch()) jsonResponse(['success' => false, 'message' => 'Username or email already exists'], 409);

    $count = (int)$db->query("SELECT COUNT(*) FROM users")->fetchColumn() + 1;
    $code  = 'user' . str_pad($count, 3, '0', STR_PAD_LEFT);
    $hash  = password_hash($body['password'], PASSWORD_BCRYPT, ['cost' => 12]);

    $stmt = $db->prepare(
        "INSERT INTO users (user_code, name, username, email, password_hash, role, status, avatar)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $code,
        htmlspecialchars(trim($body['name']),     ENT_QUOTES),
        htmlspecialchars(trim($body['username']), ENT_QUOTES),
        filter_var($body['email'], FILTER_SANITIZE_EMAIL),
        $hash,
        $body['role'],
        $body['status'] ?? 'Active',
        $body['avatar'] ?? strtoupper(substr($body['name'], 0, 2)),
    ]);
    jsonResponse(['success' => true, 'message' => 'User created', 'id' => $db->lastInsertId()], 201);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
