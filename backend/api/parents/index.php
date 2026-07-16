<?php
/**
 * /api/parents/index.php
 *
 * GET    - list all parents with their linked students
 * POST   - link a parent (user_id) to a student (student_id)
 * PUT    - update parent details and sync children links
 * DELETE - delete a parent or unlink a child
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$sessionUser = requireRole($method === 'GET' ? ['Admin', 'Teacher', 'Parent'] : ['Admin', 'Teacher']);

// ── GET: list parents with their children ─────────────────────
if ($method === 'GET') {
    $search = $_GET['search'] ?? '';
    $params = [];
    $where  = "u.role = 'Parent' AND u.status = 'Active'";

    // Parent accounts must only ever receive their own linked student records.
    if (($sessionUser['role'] ?? '') === 'Parent') {
        $where .= " AND u.id = ?";
        $params[] = (int)$sessionUser['id'];
    }

    if ($search) {
        $where   .= " AND (u.name LIKE ? OR u.email LIKE ? OR u.username LIKE ?)";
        $q        = '%' . $search . '%';
        $params[] = $q; $params[] = $q; $params[] = $q;
    }

    $stmt = $db->prepare(
        "SELECT COALESCE(p.id, u.id) AS id, u.id AS user_id, u.user_code,
                COALESCE(p.name, u.name) AS name, u.username, COALESCE(p.email, u.email) AS email,
                p.phone, p.address, p.contact_person, p.gender, p.occupation, p.avatar_color,
                u.status, u.last_login, u.created_at
         FROM users u
         LEFT JOIN parents p ON p.user_id = u.id
         WHERE $where
         ORDER BY u.name ASC"
    );
    $stmt->execute($params);
    $parents = $stmt->fetchAll();

    // Attach children for each parent
    $childStmt = $db->prepare(
        "SELECT ps.parent_id, ps.relationship, s.id AS student_id, s.student_code,
                s.name AS student_name, c.name AS class_name,
                COALESCE((
                    SELECT f.status
                    FROM fees f
                    WHERE f.student_id = s.id
                    ORDER BY f.academic_year DESC, f.term DESC, f.created_at DESC, f.id DESC
                    LIMIT 1
                ), 'Pending') AS fees_status
         FROM parent_student ps
         JOIN students s ON s.id = ps.student_id
         LEFT JOIN classes c ON c.id = s.class_id"
    );
    $childStmt->execute();
    $allChildren = $childStmt->fetchAll();

    // Group children by parent_id
    $childMap = [];
    foreach ($allChildren as $ch) {
        $childMap[$ch['parent_id']][] = $ch;
    }

    foreach ($parents as &$p) {
        $p['children'] = $childMap[$p['id']] ?? [];
        $statuses = array_map(fn($child) => $child['fees_status'] ?? 'Pending', $p['children']);
        if (!$statuses) {
            $p['fees_status'] = 'No Children';
        } elseif (in_array('Pending', $statuses, true)) {
            $p['fees_status'] = 'Pending';
        } elseif (in_array('Partial', $statuses, true)) {
            $p['fees_status'] = 'Partial';
        } else {
            $p['fees_status'] = 'All Paid';
        }
    }

    jsonResponse(['success' => true, 'data' => $parents]);
}

// ── POST: link parent to student ──────────────────────────────
if ($method === 'POST') {
    $body       = getRequestBody();
    $userId     = (int)($body['user_id']    ?? 0);
    $studentId  = (int)($body['student_id'] ?? 0);

    if (!$userId || !$studentId) {
        jsonResponse(['success' => false, 'message' => 'user_id and student_id are required'], 422);
    }

    // Verify the user is actually a Parent
    $check = $db->prepare("SELECT name, email FROM users WHERE id = ? AND role = 'Parent'");
    $check->execute([$userId]);
    $uData = $check->fetch();
    if (!$uData) {
        jsonResponse(['success' => false, 'message' => 'User is not a Parent role'], 422);
    }

    // Ensure parents record exists
    $pCheck = $db->prepare("SELECT id FROM parents WHERE user_id = ?");
    $pCheck->execute([$userId]);
    $parent = $pCheck->fetch();
    if (!$parent) {
        $insParent = $db->prepare("INSERT INTO parents (name, email, user_id) VALUES (?, ?, ?)");
        $insParent->execute([$uData['name'], $uData['email'], $userId]);
        $parentId = $db->lastInsertId();
    } else {
        $parentId = $parent['id'];
    }

    $db->prepare(
        "INSERT IGNORE INTO parent_student (parent_id, student_id) VALUES (?, ?)"
    )->execute([$parentId, $studentId]);

    jsonResponse(['success' => true, 'message' => 'Child linked to parent']);
}

// ── PUT: update parent ────────────────────────────────────────
if ($method === 'PUT') {
    requireRole(['Admin']);
    $pId = (int)($_GET['id'] ?? 0);
    if (!$pId) {
        jsonResponse(['success' => false, 'message' => 'Parent ID required'], 422);
    }

    // Check parent exists (using p.id or fallback)
    $check = $db->prepare("SELECT id, user_id FROM parents WHERE id = ?");
    $check->execute([$pId]);
    $parent = $check->fetch();
    if (!$parent) {
        // Fallback: search by user_id
        $check = $db->prepare("SELECT id, user_id FROM parents WHERE user_id = ?");
        $check->execute([$pId]);
        $parent = $check->fetch();
        if ($parent) {
            $pId = $parent['id'];
        } else {
            jsonResponse(['success' => false, 'message' => 'Parent not found'], 404);
        }
    }

    $body = getRequestBody();
    $db->beginTransaction();
    try {
        // Update parents table
        $pFields = [];
        $pParams = [];
        $allowed = ['name', 'email', 'phone', 'address', 'contact_person', 'gender', 'occupation', 'avatar_color'];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $body)) {
                $pFields[] = "$f = ?";
                $pParams[] = $body[$f];
            }
        }
        if (!empty($pFields)) {
            $pParams[] = $pId;
            $db->prepare("UPDATE parents SET " . implode(', ', $pFields) . " WHERE id = ?")->execute($pParams);
        }

        // Update users table (if user_id exists)
        if ($parent['user_id']) {
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
            if (!empty($uFields)) {
                $uParams[] = $parent['user_id'];
                $db->prepare("UPDATE users SET " . implode(', ', $uFields) . " WHERE id = ?")->execute($uParams);
            }
        }

        // Handle linked children list if provided
        if (isset($body['children'])) {
            // Delete previous links
            $db->prepare("DELETE FROM parent_student WHERE parent_id = ?")->execute([$pId]);

            // Parse children names
            $childNames = array_filter(array_map('trim', explode(',', $body['children'])));
            foreach ($childNames as $cName) {
                // Remove class name if present in parentheses
                $cleanName = preg_replace('/\s*\(.*?\)\s*/', '', $cName);
                if (empty($cleanName)) continue;

                // Find student by name
                $sStmt = $db->prepare("SELECT id FROM students WHERE name = ? LIMIT 1");
                $sStmt->execute([$cleanName]);
                $sId = $sStmt->fetchColumn();
                if ($sId) {
                    $db->prepare("INSERT IGNORE INTO parent_student (parent_id, student_id) VALUES (?, ?)")
                       ->execute([$pId, $sId]);
                }
            }
        }

        $db->commit();
        jsonResponse(['success' => true, 'message' => 'Parent updated successfully']);
    } catch (PDOException $e) {
        $db->rollBack();
        jsonResponse(['success' => false, 'message' => 'Failed to update parent: ' . $e->getMessage()], 500);
    }
}

// ── DELETE: delete parent or unlink child ─────────────────────
if ($method === 'DELETE') {
    if (isset($_GET['id'])) {
        requireRole(['Admin']);
        $pId = (int)$_GET['id'];

        // Find parent and user_id
        $stmt = $db->prepare("SELECT user_id FROM parents WHERE id = ?");
        $stmt->execute([$pId]);
        $uId = $stmt->fetchColumn();

        $db->beginTransaction();
        try {
            // Delete parent (cascades to parent_student)
            $db->prepare("DELETE FROM parents WHERE id = ?")->execute([$pId]);
            // Delete user
            if ($uId) {
                $db->prepare("DELETE FROM users WHERE id = ?")->execute([$uId]);
            }
            $db->commit();
            jsonResponse(['success' => true, 'message' => 'Parent deleted successfully']);
        } catch (PDOException $e) {
            $db->rollBack();
            jsonResponse(['success' => false, 'message' => 'Failed to delete parent: ' . $e->getMessage()], 500);
        }
    } else {
        $userId    = (int)($_GET['user_id']    ?? 0);
        $studentId = (int)($_GET['student_id'] ?? 0);
        if (!$userId || !$studentId) {
            jsonResponse(['success' => false, 'message' => 'user_id and student_id required'], 422);
        }
        $db->prepare("DELETE ps FROM parent_student ps JOIN parents p ON p.id = ps.parent_id WHERE p.user_id = ? AND ps.student_id = ?")
           ->execute([$userId, $studentId]);
        jsonResponse(['success' => true, 'message' => 'Child unlinked from parent']);
    }
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
