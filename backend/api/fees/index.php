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

function feeStudentExists(PDO $db, int $studentId): bool {
    $stmt = $db->prepare("SELECT COUNT(*) FROM students WHERE id = ? AND status = 'Active'");
    $stmt->execute([$studentId]);
    return (int)$stmt->fetchColumn() > 0;
}

function normalizeFeeStatus(float $amountDue, float $amountPaid): string {
    if ($amountDue <= 0) {
        jsonResponse(['success' => false, 'message' => 'Amount due must be greater than zero'], 422);
    }
    if ($amountPaid < 0) {
        jsonResponse(['success' => false, 'message' => 'Amount paid cannot be negative'], 422);
    }
    return $amountPaid >= $amountDue ? 'Paid' : ($amountPaid > 0 ? 'Partial' : 'Pending');
}

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
        else { $where[] = '1=0'; }
    } elseif ($user['role'] === 'Parent') {
        $stmt = $db->prepare(
            "SELECT sp.student_id
             FROM parents p
             JOIN parent_student sp ON sp.parent_id = p.id
             WHERE p.user_id = ?"
        );
        $stmt->execute([$user['id']]);
        $studentIds = array_map('intval', array_column($stmt->fetchAll(), 'student_id'));
        if ($studentIds) {
            $where[] = 'f.student_id IN (' . implode(',', array_fill(0, count($studentIds), '?')) . ')';
            array_push($params, ...$studentIds);
        } else {
            $where[] = '1=0';
        }
    } elseif (!in_array($user['role'], ['Admin', 'Accountant'], true)) {
        jsonResponse(['success' => false, 'message' => 'Forbidden. Insufficient permissions.'], 403);
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
        "SELECT f.id, f.student_id, f.term, f.academic_year, f.amount_due, f.amount_paid,
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
    $studentId = (int)$body['student_id'];
    if (!feeStudentExists($db, $studentId)) {
        jsonResponse(['success' => false, 'message' => 'Selected student does not exist or is not active'], 422);
    }
    $status = normalizeFeeStatus($amountDue, $amountPaid);

    $stmt = $db->prepare(
        "INSERT INTO fees (student_id, term, academic_year, amount_due, amount_paid, receipt_no, payment_date, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE amount_due = VALUES(amount_due), amount_paid = VALUES(amount_paid), receipt_no = VALUES(receipt_no), payment_date = VALUES(payment_date), status = VALUES(status)"
    );
    $stmt->execute([
        $studentId,
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
