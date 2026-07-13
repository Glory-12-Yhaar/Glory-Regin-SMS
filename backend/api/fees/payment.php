<?php
/**
 * /api/fees/payment.php
 * POST - record a payment and update the fee record
 * GET  - list all payment transactions
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$user   = requireAuth();
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    requireRole(['Admin', 'Accountant']);
    $page   = max(1, (int)($_GET['page']  ?? 1));
    $limit  = min(200, max(1, (int)($_GET['limit'] ?? 50)));
    $offset = ($page - 1) * $limit;

    $total = (int)$db->query("SELECT COUNT(*) FROM payments")->fetchColumn();
    $stmt  = $db->prepare(
        "SELECT p.id, p.amount, p.term, p.academic_year, p.payment_date,
                p.method, p.receipt_no, p.received_by, p.remarks,
                s.name AS student_name, s.student_code, c.name AS class_name
         FROM payments p
         JOIN students s ON s.id = p.student_id
         LEFT JOIN classes c ON c.id = s.class_id
         ORDER BY p.payment_date DESC
         LIMIT $limit OFFSET $offset"
    );
    $stmt->execute();
    jsonResponse([
        'success'    => true,
        'data'       => $stmt->fetchAll(),
        'total'      => $total,
        'totalPages' => ceil($total / $limit),
    ]);
}

if ($method === 'POST') {
    requireRole(['Admin', 'Accountant']);
    $body     = getRequestBody();
    $required = ['student_id', 'amount', 'term', 'academic_year', 'payment_date'];
    foreach ($required as $f) {
        if (empty($body[$f]) && $body[$f] !== 0) {
            jsonResponse(['success' => false, 'message' => "Field '$f' required"], 422);
        }
    }

    $studentId = (int)$body['student_id'];
    $amount    = (float)$body['amount'];
    $term      = $body['term'];
    $year      = $body['academic_year'];

    // Generate receipt number
    $receiptNo = $body['receipt_no'] ?? ('RCP-' . str_pad(rand(1000, 9999), 4, '0', STR_PAD_LEFT));

    // Insert payment record
    $db->prepare(
        "INSERT INTO payments (student_id, amount, term, academic_year, payment_date, method, receipt_no, received_by, remarks)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )->execute([
        $studentId, $amount, $term, $year,
        $body['payment_date'],
        $body['method']      ?? 'Cash',
        $receiptNo,
        $body['received_by'] ?? $user['name'],
        $body['remarks']     ?? null,
    ]);

    // Update the matching fees record
    $feeStmt = $db->prepare(
        "SELECT id, amount_due, amount_paid FROM fees
         WHERE student_id = ? AND term = ? AND academic_year = ? LIMIT 1"
    );
    $feeStmt->execute([$studentId, $term, $year]);
    $fee = $feeStmt->fetch();

    if ($fee) {
        $newPaid = $fee['amount_paid'] + $amount;
        $status  = $newPaid >= $fee['amount_due'] ? 'Paid' : 'Partial';
        $db->prepare(
            "UPDATE fees SET amount_paid = ?, status = ?, receipt_no = ?, payment_date = ? WHERE id = ?"
        )->execute([$newPaid, $status, $receiptNo, $body['payment_date'], $fee['id']]);
    }

    jsonResponse(['success' => true, 'message' => 'Payment recorded', 'receipt_no' => $receiptNo], 201);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
