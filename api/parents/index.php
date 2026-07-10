<?php
/**
 * /api/parents/index.php
 *
 * GET  - list all users with role=Parent, include their linked students
 * POST - link a parent (user_id) to a student (student_id)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

requireRole(['Admin', 'Teacher']);
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET: list parents with their children ─────────────────────
if ($method === 'GET') {
    $search = $_GET['search'] ?? '';
    $params = [];
    $where  = "u.role = 'Parent' AND u.status = 'Active'";

    if ($search) {
        $where   .= " AND (u.name LIKE ? OR u.email LIKE ? OR u.username LIKE ?)";
        $q        = '%' . $search . '%';
        $params[] = $q; $params[] = $q; $params[] = $q;
    }

    $stmt = $db->prepare(
        "SELECT u.id, u.user_code, u.name, u.username, u.email,
                p.phone, p.address, u.status, u.last_login, u.created_at
         FROM users u
         LEFT JOIN parents p ON p.user_id = u.id
         WHERE $where
         ORDER BY u.name ASC"
    );
    $stmt->execute($params);
    $parents = $stmt->fetchAll();

    // Attach children for each parent
    $childStmt = $db->prepare(
        "SELECT p.user_id, s.id AS student_id, s.student_code,
                s.name AS student_name, c.name AS class_name
         FROM parent_student ps
         JOIN parents p ON p.id = ps.parent_id
         JOIN students s ON s.id = ps.student_id
         LEFT JOIN classes c ON c.id = s.class_id"
    );
    $childStmt->execute();
    $allChildren = $childStmt->fetchAll();

    // Group children by parent user_id
    $childMap = [];
    foreach ($allChildren as $ch) {
        $childMap[$ch['user_id']][] = $ch;
    }

    foreach ($parents as &$p) {
        $p['children'] = $childMap[$p['id']] ?? [];
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

// ── DELETE: unlink parent from student ────────────────────────
if ($method === 'DELETE') {
    $userId    = (int)($_GET['user_id']    ?? 0);
    $studentId = (int)($_GET['student_id'] ?? 0);
    if (!$userId || !$studentId) {
        jsonResponse(['success' => false, 'message' => 'user_id and student_id required'], 422);
    }
    $db->prepare("DELETE ps FROM parent_student ps JOIN parents p ON p.id = ps.parent_id WHERE p.user_id = ? AND ps.student_id = ?")
       ->execute([$userId, $studentId]);
    jsonResponse(['success' => true, 'message' => 'Child unlinked from parent']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
