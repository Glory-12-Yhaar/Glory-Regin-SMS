<?php
/** Shared fee structure API for Admin and Accountant dashboards. */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$user = requireAuth();
requireRole(['Admin', 'Accountant']);
$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $where = [];
    $params = [];
    if (!empty($_GET['term'])) { $where[] = 'fs.term = ?'; $params[] = $_GET['term']; }
    if (!empty($_GET['academic_year'])) { $where[] = 'fs.academic_year = ?'; $params[] = $_GET['academic_year']; }
    $sql = "SELECT fs.id, fs.class_id, c.name AS class_name, fs.term, fs.academic_year, fs.amount, fs.created_at
            FROM fee_structure fs JOIN classes c ON c.id = fs.class_id";
    if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
    $sql .= ' ORDER BY c.id, fs.academic_year DESC, fs.term';
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if (in_array($method, ['POST', 'PUT'], true)) {
    $body = getRequestBody();
    $classId = (int)($body['class_id'] ?? 0);
    $term = trim((string)($body['term'] ?? ''));
    $year = trim((string)($body['academic_year'] ?? ''));
    $amount = (float)($body['amount'] ?? -1);
    if (!$classId || $term === '' || $year === '' || $amount < 0) {
        jsonResponse(['success' => false, 'message' => 'Class, term, academic year and a valid amount are required'], 422);
    }
    $exists = $db->prepare('SELECT COUNT(*) FROM classes WHERE id = ?');
    $exists->execute([$classId]);
    if (!(int)$exists->fetchColumn()) jsonResponse(['success' => false, 'message' => 'Class not found'], 422);

    $stmt = $db->prepare(
        'INSERT INTO fee_structure (class_id, term, academic_year, amount) VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE amount = VALUES(amount)'
    );
    $stmt->execute([$classId, $term, $year, $amount]);
    jsonResponse(['success' => true, 'message' => 'Fee structure updated']);
}

if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'Fee structure id is required'], 422);
    $stmt = $db->prepare('DELETE FROM fee_structure WHERE id = ?');
    $stmt->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'Fee structure removed']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
