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

function paymentStudentExists(PDO $db, int $studentId): bool {
    $stmt = $db->prepare("SELECT COUNT(*) FROM students WHERE id = ? AND status = 'Active'");
    $stmt->execute([$studentId]);
    return (int)$stmt->fetchColumn() > 0;
}

function generateReceiptNo(PDO $db): string {
    do {
        $receiptNo = 'RCP-' . date('Ymd') . '-' . str_pad((string)random_int(1, 9999), 4, '0', STR_PAD_LEFT);
        $stmt = $db->prepare("SELECT COUNT(*) FROM payments WHERE receipt_no = ?");
        $stmt->execute([$receiptNo]);
    } while ((int)$stmt->fetchColumn() > 0);
    return $receiptNo;
}

if ($method === 'GET') {
    $where = ['1=1'];
    $params = [];
    if (!empty($_GET['student_id'])) { $where[] = 'p.student_id = ?'; $params[] = (int)$_GET['student_id']; }
    if (!empty($_GET['term'])) { $where[] = 'p.term = ?'; $params[] = $_GET['term']; }
    if (!empty($_GET['academic_year'])) { $where[] = 'p.academic_year = ?'; $params[] = $_GET['academic_year']; }
    if (!empty($_GET['date_from'])) { $where[] = 'p.payment_date >= ?'; $params[] = $_GET['date_from']; }
    if (!empty($_GET['date_to'])) { $where[] = 'p.payment_date <= ?'; $params[] = $_GET['date_to']; }
    if (!empty($_GET['search'])) {
        $where[] = '(s.name LIKE ? OR s.student_code LIKE ? OR p.receipt_no LIKE ?)';
        $search = '%' . $_GET['search'] . '%';
        array_push($params, $search, $search, $search);
    }
    if ($user['role'] === 'Student') {
        $stmt = $db->prepare("SELECT id FROM students WHERE user_id = ? LIMIT 1");
        $stmt->execute([$user['id']]);
        $studentId = (int)($stmt->fetchColumn() ?: 0);
        if ($studentId) {
            $where[] = 'p.student_id = ?';
            $params[] = $studentId;
        } else {
            $where[] = '1=0';
        }
    } elseif ($user['role'] === 'Parent') {
        $stmt = $db->prepare(
            "SELECT sp.student_id
             FROM parents pr
             JOIN student_parents sp ON sp.parent_id = pr.id
             WHERE pr.user_id = ?"
        );
        $stmt->execute([$user['id']]);
        $studentIds = array_map('intval', array_column($stmt->fetchAll(), 'student_id'));
        if ($studentIds) {
            $where[] = 'p.student_id IN (' . implode(',', array_fill(0, count($studentIds), '?')) . ')';
            array_push($params, ...$studentIds);
        } else {
            $where[] = '1=0';
        }
    } elseif (!in_array($user['role'], ['Admin', 'Accountant'], true)) {
        jsonResponse(['success' => false, 'message' => 'Forbidden. Insufficient permissions.'], 403);
    }
    $whereStr = implode(' AND ', $where);
    $page   = max(1, (int)($_GET['page']  ?? 1));
    $limit  = min(200, max(1, (int)($_GET['limit'] ?? 50)));
    $offset = ($page - 1) * $limit;

    $totalStmt = $db->prepare("SELECT COUNT(*) FROM payments p JOIN students s ON s.id = p.student_id WHERE $whereStr");
    $totalStmt->execute($params);
    $total = (int)$totalStmt->fetchColumn();
    $stmt  = $db->prepare(
        "SELECT p.id, p.amount, p.term, p.academic_year, p.payment_date,
                p.method, p.receipt_no, p.received_by, p.remarks,
                s.id AS student_id, s.name AS student_name, s.student_code, c.name AS class_name,
                f.status AS fee_status
         FROM payments p
         JOIN students s ON s.id = p.student_id
         LEFT JOIN classes c ON c.id = s.class_id
         LEFT JOIN fees f ON f.student_id = p.student_id AND f.term = p.term AND f.academic_year = p.academic_year
         WHERE $whereStr
         ORDER BY p.payment_date DESC, p.id DESC
         LIMIT $limit OFFSET $offset"
    );
    $stmt->execute($params);
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
    if (!paymentStudentExists($db, $studentId)) {
        jsonResponse(['success' => false, 'message' => 'Selected student does not exist or is not active'], 422);
    }
    if ($amount <= 0) {
        jsonResponse(['success' => false, 'message' => 'Payment amount must be greater than zero'], 422);
    }

    // Generate receipt number
    $receiptNo = trim($body['receipt_no'] ?? '') ?: generateReceiptNo($db);

    try {
        $db->beginTransaction();

        // Update the matching fees record
        $feeStmt = $db->prepare(
            "SELECT id, amount_due, amount_paid FROM fees
             WHERE student_id = ? AND term = ? AND academic_year = ? LIMIT 1 FOR UPDATE"
        );
        $feeStmt->execute([$studentId, $term, $year]);
        $fee = $feeStmt->fetch();
        if (!$fee) {
            $classFeeStmt = $db->prepare(
                "SELECT fs.amount
                 FROM students st
                 JOIN fee_structure fs ON fs.class_id = st.class_id AND fs.term = ? AND fs.academic_year = ?
                 WHERE st.id = ?
                 LIMIT 1"
            );
            $classFeeStmt->execute([$term, $year, $studentId]);
            $amountDue = (float)($classFeeStmt->fetchColumn() ?: 0);
            if ($amountDue <= 0) {
                $amountDue = max($amount, (float)($body['amount_due'] ?? 0));
            }
            if ($amountDue <= 0) {
                if ($db->inTransaction()) $db->rollBack();
                jsonResponse(['success' => false, 'message' => 'No fee structure found for this student/class and term'], 422);
            }
            $db->prepare("INSERT INTO fees (student_id, term, academic_year, amount_due, amount_paid, status) VALUES (?, ?, ?, ?, 0, 'Pending')")
                ->execute([$studentId, $term, $year, $amountDue]);
            $fee = ['id' => $db->lastInsertId(), 'amount_due' => $amountDue, 'amount_paid' => 0];
        }
        $balance = (float)$fee['amount_due'] - (float)$fee['amount_paid'];
        if ($amount > $balance) {
            if ($db->inTransaction()) $db->rollBack();
            jsonResponse(['success' => false, 'message' => 'Payment amount exceeds outstanding balance'], 422);
        }

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

        $newPaid = $fee['amount_paid'] + $amount;
        $status  = $newPaid >= $fee['amount_due'] ? 'Paid' : 'Partial';
        $db->prepare(
            "UPDATE fees SET amount_paid = ?, status = ?, receipt_no = ?, payment_date = ? WHERE id = ?"
        )->execute([$newPaid, $status, $receiptNo, $body['payment_date'], $fee['id']]);

        $db->commit();
    } catch (Throwable $e) {
        if ($db->inTransaction()) $db->rollBack();
        jsonResponse(['success' => false, 'message' => 'Payment could not be recorded'], 500);
    }

    jsonResponse(['success' => true, 'message' => 'Payment recorded', 'receipt_no' => $receiptNo], 201);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
