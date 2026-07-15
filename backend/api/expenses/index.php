<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$user = requireRole(['Admin', 'Accountant']);
$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $rows = $db->query("SELECT id, category, description, amount, expense_date, recorded_by FROM expenses ORDER BY expense_date DESC, id DESC")->fetchAll();
    jsonResponse(['success' => true, 'data' => $rows]);
}

if ($method === 'POST') {
    $body = getRequestBody();
    $category = trim($body['category'] ?? '');
    $description = trim($body['description'] ?? '');
    $amount = (float)($body['amount'] ?? 0);
    $expenseDate = trim($body['expense_date'] ?? '');
    if ($category === '' || $description === '' || $amount <= 0 || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $expenseDate)) {
        jsonResponse(['success' => false, 'message' => 'Provide a category, description, positive amount, and valid date.'], 422);
    }
    $stmt = $db->prepare('INSERT INTO expenses (category, description, amount, expense_date, recorded_by) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$category, $description, $amount, $expenseDate, $user['name'] ?? 'Accountant']);
    jsonResponse(['success' => true, 'message' => 'Expense recorded', 'id' => (int)$db->lastInsertId()], 201);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
