<?php
/**
 * /api/staff/staff.php?id=X
 * GET    - single staff member
 * PUT    - update staff
 * DELETE - delete staff (Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$user   = requireAuth();
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = (int)($_GET['id'] ?? 0);
if (!$id) jsonResponse(['success' => false, 'message' => 'Staff ID required'], 422);

function fetchStaff(PDO $db, int $id): array|false {
    $stmt = $db->prepare("SELECT * FROM staff WHERE id = ?");
    $stmt->execute([$id]);
    return $stmt->fetch();
}

if ($method === 'GET') {
    $staff = fetchStaff($db, $id);
    if (!$staff) jsonResponse(['success' => false, 'message' => 'Staff not found'], 404);
    jsonResponse(['success' => true, 'data' => $staff]);
}

if ($method === 'PUT') {
    requireRole(['Admin']);
    $staff = fetchStaff($db, $id);
    if (!$staff) jsonResponse(['success' => false, 'message' => 'Staff not found'], 404);

    $body    = getRequestBody();
    $fields  = [];
    $params  = [];
    $allowed = ['name','email','phone','category','department','position','qualifications',
                'salary_grade','join_date','gender','dob','address','emergency_contact',
                'emergency_phone','performance','status'];

    foreach ($allowed as $f) {
        if (array_key_exists($f, $body)) {
            $fields[] = "$f = ?";
            $params[] = in_array($f, ['name']) ? htmlspecialchars(trim($body[$f]), ENT_QUOTES) : $body[$f];
        }
    }
    if (empty($fields)) jsonResponse(['success' => false, 'message' => 'No fields to update'], 422);
    $params[] = $id;
    $db->prepare("UPDATE staff SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
    jsonResponse(['success' => true, 'message' => 'Staff updated']);
}

if ($method === 'DELETE') {
    requireRole(['Admin']);
    if (!fetchStaff($db, $id)) jsonResponse(['success' => false, 'message' => 'Staff not found'], 404);
    $db->prepare("DELETE FROM staff WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'Staff deleted']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
