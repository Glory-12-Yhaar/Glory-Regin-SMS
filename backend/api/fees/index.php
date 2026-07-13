<?php
/**
 * /api/fees/index.php
 * GET  - list fees (?student_id=&term=&academic_year=&status=&page=&limit=)
 * POST - create fee record (Accountant/Admin)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$user   = requireAuth();
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $where  = ['1=1'];
    $params = [];

    if (!empty($_GET['student_id'])) {
        $where[]  = 'f.student_id = ?';
        $params[] = (int)$_GET['student_id'];
    }
    if ($user['role'] === 'Student') {
        // Student can only see their own fees
        $stmt = $db->prepare("SELECT id FROM students WHERE user_id = ? LIMIT 1");
        $stmt->execute([$user['id']]);
        $row = $stmt->fetch();
        if ($row) { $where[] = 'f.student_id = ?'; $params[] = $row['id']; }
    }
    if (!empty($_GET['term'])) {
        $where[]  = 'f.term = ?';
        $params[] = $_GET['term'];
    }
    if (!empty($_GET['academic_year'])) {
        $where[]  = 'f.academic_year = ?';
        $params[] = $_GET['academic_year'];
    }
    if (!empty($_GET['status'])) {
        $where[]  = 'f.status = ?';
        $params[] = $_GET['status'];
    }

    $whereStr = implode(' AND ', $where);
    $page   = max(1, (int)($_GET['page']  ?? 1));
    $limit  = min(200, max(1, (int)($_GET['limit'] ?? 50)));
    $offset = ($page - 1) * $limit;

    $total = $db->prepare("SELECT COUNT(*) FROM fees f WHERE $whereStr");
    $total->execute($params);
    $totalCount = (int)$total->fetchColumn();

    $stmt = $db->prepare(
        "SELECT f.id, f.term, f.academic_year, f.amount_due, f.amount_paid,
                (f.amount_due - f.amount_paid) AS balance,
                f.receipt_no, f.payment_date, f.status,
                s.name AS student_name, s.student_code, c.name AS class_name
         FROM fees f
         JOIN students s ON s.id = f.student_id
         LEFT JOIN classes c ON c.id = s.class_id
         WHERE $whereStr
         ORDER BY s.name ASC
         LIMIT $limit OFFSET $offset"
    );
    $stmt->execute($params);
    jsonResponse([
        'success'    => true,
        'data'       => $stmt->fetchAll(),
        'total'      => $totalCount,
        'page'       => $page,
        'limit'      => $limit,
        'totalPages' => ceil($totalCount / $limit),
    ]);
}

if ($method === 'POST') {
    requireRole(['Admin', 'Accountant']);
    $body     = getRequestBody();
    $required = ['student_id', 'term', 'academic_year', 'amount_due'];
    foreach ($required as $f) {
        if (empty($body[$f]) && $body[$f] !== 0) {
            jsonResponse(['success' => false, 'message' => "Field '$f' required"], 422);
        }
    }

    $amountDue  = (float)$body['amount_due'];
    $amountPaid = (float)($body['amount_paid'] ?? 0);
    $status = $amountPaid >= $amountDue ? 'Paid' : ($amountPaid > 0 ? 'Partial' : 'Pending');

    $stmt = $db->prepare(
        "INSERT INTO fees (student_id, term, academic_year, amount_due, amount_paid, receipt_no, payment_date, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        (int)$body['student_id'],
        $body['term'],
        $body['academic_year'],
        $amountDue,
        $amountPaid,
        $body['receipt_no']    ?? null,
        $body['payment_date']  ?? null,
        $status,
    ]);
    jsonResponse(['success' => true, 'message' => 'Fee record created', 'id' => $db->lastInsertId()], 201);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
