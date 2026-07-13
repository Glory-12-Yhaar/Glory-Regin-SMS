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

$db->exec("ALTER TABLE staff ADD COLUMN IF NOT EXISTS archived_at DATETIME DEFAULT NULL");
$db->exec("UPDATE staff SET archived_at = NOW() WHERE category = 'Teaching' AND status IN ('Inactive','Archived') AND archived_at IS NULL");

function fetchStaff(PDO $db, int $id): array|false {
    $stmt = $db->prepare("SELECT s.*, t.subject, t.class_assigned, t.experience, t.schedule, t.avatar_color FROM staff s LEFT JOIN teachers t ON t.staff_id = s.id WHERE s.id = ?");
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

    $body = getRequestBody();
    $db->beginTransaction();
    try {
        // Update staff table
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
        if (array_key_exists('status', $body)) {
            if (in_array($body['status'], ['Inactive', 'Archived'], true)) {
                $fields[] = "archived_at = COALESCE(archived_at, NOW())";
            } elseif ($body['status'] === 'Active') {
                $fields[] = "archived_at = NULL";
            }
        }
        if (!empty($fields)) {
            $params[] = $id;
            $db->prepare("UPDATE staff SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
        }

        // Update / Insert teachers table
        $tFields  = [];
        $tParams  = [];
        $tAllowed = ['subject', 'class_assigned', 'experience', 'schedule', 'avatar_color'];
        foreach ($tAllowed as $tf) {
            if (array_key_exists($tf, $body)) {
                $tFields[] = "$tf = ?";
                $tParams[] = $body[$tf];
            }
        }

        if (!empty($tFields)) {
            // Check if teacher row exists
            $tCheck = $db->prepare("SELECT id FROM teachers WHERE staff_id = ?");
            $tCheck->execute([$id]);
            if ($tCheck->fetch()) {
                $tParams[] = $id;
                $db->prepare("UPDATE teachers SET " . implode(', ', $tFields) . " WHERE staff_id = ?")->execute($tParams);
            } else {
                $category = $body['category'] ?? $staff['category'];
                if ($category === 'Teaching') {
                    $insertFields = ['staff_id'];
                    $insertVals = [$id];
                    foreach ($tAllowed as $tf) {
                        if (array_key_exists($tf, $body)) {
                            $insertFields[] = $tf;
                            $insertVals[] = $body[$tf];
                        }
                    }
                    $placeholders = array_fill(0, count($insertFields), '?');
                    $db->prepare("INSERT INTO teachers (" . implode(', ', $insertFields) . ") VALUES (" . implode(', ', $placeholders) . ")")->execute($insertVals);
                }
            }
        }

        // Update users table status and details if user_id exists
        if ($staff['user_id']) {
            $uFields = [];
            $uParams = [];
            if (array_key_exists('name', $body)) {
                $uFields[] = "name = ?";
                $uParams[] = $body['name'];
            }
            if (array_key_exists('email', $body)) {
                $uFields[] = "email = ?";
                $uParams[] = $body['email'];
            }
            if (array_key_exists('status', $body)) {
                $uFields[] = "status = ?";
                $uParams[] = $body['status'];
            }
            if (!empty($uFields)) {
                $uParams[] = $staff['user_id'];
                $db->prepare("UPDATE users SET " . implode(', ', $uFields) . " WHERE id = ?")->execute($uParams);
            }
        }

        $db->commit();
        jsonResponse(['success' => true, 'message' => 'Staff updated']);
    } catch (PDOException $e) {
        $db->rollBack();
        jsonResponse(['success' => false, 'message' => 'Failed to update staff: ' . $e->getMessage()], 500);
    }
}

if ($method === 'DELETE') {
    requireRole(['Admin']);
    $staff = fetchStaff($db, $id);
    if (!$staff) jsonResponse(['success' => false, 'message' => 'Staff not found'], 404);

    $db->beginTransaction();
    try {
        $db->prepare("DELETE FROM staff WHERE id = ?")->execute([$id]);
        if ($staff['user_id']) {
            $db->prepare("DELETE FROM users WHERE id = ?")->execute([$staff['user_id']]);
        }
        $db->commit();
        jsonResponse(['success' => true, 'message' => 'Staff deleted']);
    } catch (PDOException $e) {
        $db->rollBack();
        jsonResponse(['success' => false, 'message' => 'Failed to delete staff: ' . $e->getMessage()], 500);
    }
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
