<?php
/**
 * /api/users/user.php?id=X
 * GET    - single user
 * PUT    - update user (Admin, or self for password change)
 * DELETE - delete user (Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$user   = requireAuth();
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = (int)($_GET['id'] ?? 0);
if (!$id) jsonResponse(['success' => false, 'message' => 'User ID required'], 422);

// Non-admins can only access their own record
if ($user['role'] !== 'Admin' && $user['id'] !== $id) {
    jsonResponse(['success' => false, 'message' => 'Forbidden'], 403);
}

function fetchUser(PDO $db, int $id): array|false {
    $stmt = $db->prepare("SELECT id, user_code, name, username, email, role, status, avatar, phone, address, last_login, created_at FROM users WHERE id = ?");
    $stmt->execute([$id]);
    return $stmt->fetch();
}

if ($method === 'GET') {
    $u = fetchUser($db, $id);
    if (!$u) jsonResponse(['success' => false, 'message' => 'User not found'], 404);
    jsonResponse(['success' => true, 'data' => $u]);
}

if ($method === 'PUT') {
    $targetUser = fetchUser($db, $id);
    if (!$targetUser) jsonResponse(['success' => false, 'message' => 'User not found'], 404);
    $body   = getRequestBody();
    $fields = [];
    $params = [];

    // Admin can change role/status; anyone can change name, email, avatar, phone, address
    $allowed = ['name', 'email', 'avatar', 'phone', 'address'];
    if ($user['role'] === 'Admin') {
        $allowed = array_merge($allowed, ['username', 'role', 'status']);
    }

    foreach ($allowed as $f) {
        if (array_key_exists($f, $body)) {
            $fields[] = "$f = ?";
            $params[] = in_array($f, ['name']) ? htmlspecialchars(trim($body[$f]), ENT_QUOTES) : $body[$f];
        }
    }

    // Password change
    if (!empty($body['password'])) {
        if (strlen($body['password']) < 6) {
            jsonResponse(['success' => false, 'message' => 'Password must be at least 6 characters'], 422);
        }
        $fields[] = "password_hash = ?";
        $params[] = password_hash($body['password'], PASSWORD_BCRYPT, ['cost' => 12]);
    }

    if (empty($fields)) jsonResponse(['success' => false, 'message' => 'No fields to update'], 422);
    $params[] = $id;
    $db->beginTransaction();
    try {
        $db->prepare("UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
        if ($targetUser['role'] === 'Parent') {
            $parentFields = [];
            $parentParams = [];
            foreach (['name', 'email', 'phone', 'address'] as $field) {
                if (array_key_exists($field, $body)) {
                    $parentFields[] = "$field = ?";
                    $parentParams[] = $field === 'name' ? htmlspecialchars(trim($body[$field]), ENT_QUOTES) : $body[$field];
                }
            }
            if ($parentFields) {
                $parentParams[] = $id;
                $db->prepare("UPDATE parents SET " . implode(', ', $parentFields) . " WHERE user_id = ?")->execute($parentParams);
            }
        }
        if ($targetUser['role'] === 'Teacher') {
            $staffFields=[];$staffParams=[];
            foreach(['name','email','phone','address'] as $field){if(array_key_exists($field,$body)){$staffFields[]="$field = ?";$staffParams[]=$field==='name'?htmlspecialchars(trim($body[$field]),ENT_QUOTES):$body[$field];}}
            if($staffFields){$staffParams[]=$id;$db->prepare("UPDATE staff SET ".implode(', ',$staffFields)." WHERE user_id = ? AND category = 'Teaching'")->execute($staffParams);}
        }
        $db->commit();
    } catch (Throwable $e) {
        if ($db->inTransaction()) $db->rollBack();
        jsonResponse(['success' => false, 'message' => 'Profile update failed'], 500);
    }
    jsonResponse(['success' => true, 'message' => 'User updated']);
}

if ($method === 'DELETE') {
    requireRole(['Admin']);
    if ($id === $user['id']) jsonResponse(['success' => false, 'message' => 'Cannot delete your own account'], 422);
    if (!fetchUser($db, $id)) jsonResponse(['success' => false, 'message' => 'User not found'], 404);
    $db->prepare("DELETE FROM users WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'User deleted']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
