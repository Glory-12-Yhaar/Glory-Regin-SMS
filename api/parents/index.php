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
                u.phone, u.address, u.status, u.last_login, u.created_at
         FROM users u
         WHERE $where
         ORDER BY u.name ASC"
    );
    $stmt->execute($params);
    $parents = $stmt->fetchAll();

    // Attach children for each parent
    $childStmt = $db->prepare(
        "SELECT ps.user_id, s.id AS student_id, s.student_code,
                s.name AS student_name, c.name AS class_name
         FROM parent_student ps
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
    $check = $db->prepare("SELECT id FROM users WHERE id = ? AND role = 'Parent'");
    $check->execute([$userId]);
    if (!$check->fetch()) {
        jsonResponse(['success' => false, 'message' => 'User is not a Parent role'], 422);
    }

    $db->prepare(
        "INSERT IGNORE INTO parent_student (user_id, student_id) VALUES (?, ?)"
    )->execute([$userId, $studentId]);

    jsonResponse(['success' => true, 'message' => 'Child linked to parent']);
}

// ── DELETE: unlink parent from student ────────────────────────
if ($method === 'DELETE') {
    $userId    = (int)($_GET['user_id']    ?? 0);
    $studentId = (int)($_GET['student_id'] ?? 0);
    if (!$userId || !$studentId) {
        jsonResponse(['success' => false, 'message' => 'user_id and student_id required'], 422);
    }
    $db->prepare("DELETE FROM parent_student WHERE user_id = ? AND student_id = ?")
       ->execute([$userId, $studentId]);
    jsonResponse(['success' => true, 'message' => 'Child unlinked from parent']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
