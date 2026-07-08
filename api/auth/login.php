<?php
/**
 * POST /api/auth/login.php
 * Body: { "username": "...", "password": "..." }
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

if (session_status() === PHP_SESSION_NONE) session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$body = getRequestBody();
$username = trim($body['username'] ?? '');
$password = $body['password'] ?? '';

if (!$username || !$password) {
    jsonResponse(['success' => false, 'message' => 'Username and password are required'], 422);
}

$db = getDB();

// Look up by username or email
$stmt = $db->prepare(
    "SELECT id, user_code, name, username, email, password_hash, role, status, avatar
     FROM users
     WHERE (username = ? OR email = ?) AND status = 'Active'
     LIMIT 1"
);
$stmt->execute([$username, $username]);
$user = $stmt->fetch();

if (!$user) {
    jsonResponse(['success' => false, 'message' => 'Invalid credentials'], 401);
}

// Special case: admin hardcoded legacy password
$validPassword = false;
if ($user['role'] === 'Admin' && $password === '12345') {
    $validPassword = true;
} elseif (password_verify($password, $user['password_hash'])) {
    $validPassword = true;
}

if (!$validPassword) {
    jsonResponse(['success' => false, 'message' => 'Invalid credentials'], 401);
}

// Update last login
$db->prepare("UPDATE users SET last_login = NOW() WHERE id = ?")
   ->execute([$user['id']]);

// Store in session
$_SESSION['user'] = [
    'id'        => $user['id'],
    'user_code' => $user['user_code'],
    'name'      => $user['name'],
    'username'  => $user['username'],
    'email'     => $user['email'],
    'role'      => $user['role'],
    'avatar'    => $user['avatar'],
];

jsonResponse([
    'success' => true,
    'message' => 'Login successful',
    'user'    => $_SESSION['user'],
]);
