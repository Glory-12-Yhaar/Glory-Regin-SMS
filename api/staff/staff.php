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

        $db->commit();
        jsonResponse(['success' => true, 'message' => 'Staff updated']);
    } catch (PDOException $e) {
        $db->rollBack();
        jsonResponse(['success' => false, 'message' => 'Failed to update staff: ' . $e->getMessage()], 500);
    }
}

if ($method === 'DELETE') {
    requireRole(['Admin']);
    if (!fetchStaff($db, $id)) jsonResponse(['success' => false, 'message' => 'Staff not found'], 404);
    $db->prepare("DELETE FROM staff WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'Staff deleted']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
