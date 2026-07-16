<?php
/**
 * /api/salary/index.php
 * GET  - list salary payments (?term=&academic_year=)
 * POST - record a salary payment (Admin/Accountant only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$user = requireRole(['Admin', 'Accountant']);
$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $where = ['1=1'];
    $params = [];

    if (!empty($_GET['term'])) {
        $where[] = 's.term = ?';
        $params[] = $_GET['term'];
    }
    if (!empty($_GET['academic_year'])) {
        $where[] = 's.academic_year = ?';
        $params[] = $_GET['academic_year'];
    }

    $whereStr = implode(' AND ', $where);
    $stmt = $db->prepare(
        "SELECT s.id, s.staff_id, s.grade, s.base_salary, s.allowances, s.deductions, s.net_salary, s.pay_date, s.term, s.academic_year,
                st.name AS staff_name, st.staff_code, st.position, st.category
         FROM salary s
         JOIN staff st ON st.id = s.staff_id
         WHERE $whereStr
         ORDER BY s.pay_date DESC, s.id DESC"
    );
    $stmt->execute($params);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    $body = getRequestBody();
    $required = ['staff_id', 'base_salary', 'allowances', 'deductions', 'net_salary', 'pay_date', 'term', 'academic_year'];
    foreach ($required as $f) {
        if (!isset($body[$f]) || $body[$f] === '') {
            jsonResponse(['success' => false, 'message' => "Field '$f' is required"], 422);
        }
    }

    $staffId = (int)$body['staff_id'];
    $baseSalary = (float)$body['base_salary'];
    $allowances = (float)$body['allowances'];
    $deductions = (float)$body['deductions'];
    $netSalary = (float)$body['net_salary'];
    $payDate = $body['pay_date'];

    // Check if staff member exists
    $staffCheck = $db->prepare("SELECT COUNT(*) FROM staff WHERE id = ?");
    $staffCheck->execute([$staffId]);
    if ((int)$staffCheck->fetchColumn() === 0) {
        jsonResponse(['success' => false, 'message' => 'Staff member not found'], 422);
    }

    // Insert salary payment
    $stmt = $db->prepare(
        "INSERT INTO salary (staff_id, grade, base_salary, allowances, deductions, net_salary, pay_date, term, academic_year)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $staffId,
        $body['grade'] ?? null,
        $baseSalary,
        $allowances,
        $deductions,
        $netSalary,
        $payDate,
        $body['term'],
        $body['academic_year']
    ]);

    jsonResponse(['success' => true, 'message' => 'Salary payment recorded', 'id' => (int)$db->lastInsertId()], 201);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
