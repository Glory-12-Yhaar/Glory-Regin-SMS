<?php
/**
 * /api/scholarships/index.php
 * GET  - list all scholarships (scoped by role: student/parent see theirs, admin/accountant see all)
 * POST - create or update a scholarship record (Admin/Accountant only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$user = requireAuth();
$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $where = ['1=1'];
    $params = [];

    if ($user['role'] === 'Student') {
        $stmt = $db->prepare("SELECT id FROM students WHERE user_id = ? LIMIT 1");
        $stmt->execute([$user['id']]);
        $studentId = $stmt->fetchColumn();
        if ($studentId) {
            $where[] = 's.student_id = ?';
            $params[] = (int)$studentId;
        } else {
            $where[] = '1=0';
        }
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
            $where[] = 's.student_id IN (' . implode(',', array_fill(0, count($studentIds), '?')) . ')';
            array_push($params, ...$studentIds);
        } else {
            $where[] = '1=0';
        }
    }

    $whereStr = implode(' AND ', $where);
    $stmt = $db->prepare(
        "SELECT s.id, s.student_id, s.grant_type, s.discount_value, s.status, s.remarks, s.created_at,
                st.name AS student_name, st.student_code, c.name AS class_name
         FROM scholarships s
         JOIN students st ON st.id = s.student_id
         LEFT JOIN classes c ON c.id = st.class_id
         WHERE $whereStr
         ORDER BY st.name ASC, s.id DESC"
    );
    $stmt->execute($params);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    requireRole(['Admin', 'Accountant']);
    $body = getRequestBody();
    $required = ['student_id', 'grant_type', 'discount_value'];
    foreach ($required as $f) {
        if (empty($body[$f])) {
            jsonResponse(['success' => false, 'message' => "Field '$f' is required"], 422);
        }
    }

    $studentId = (int)$body['student_id'];
    $grantType = trim($body['grant_type']);
    $discountValue = trim($body['discount_value']);
    $status = $body['status'] ?? 'Active';
    $remarks = $body['remarks'] ?? null;

    // Check if student exists
    $studentCheck = $db->prepare("SELECT COUNT(*) FROM students WHERE id = ?");
    $studentCheck->execute([$studentId]);
    if ((int)$studentCheck->fetchColumn() === 0) {
        jsonResponse(['success' => false, 'message' => 'Selected student not found'], 422);
    }

    // Insert or update scholarship record
    $stmt = $db->prepare(
        "INSERT INTO scholarships (student_id, grant_type, discount_value, status, remarks)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE grant_type = VALUES(grant_type), discount_value = VALUES(discount_value), status = VALUES(status), remarks = VALUES(remarks)"
    );
    $stmt->execute([
        $studentId,
        $grantType,
        $discountValue,
        $status,
        $remarks
    ]);

    jsonResponse(['success' => true, 'message' => 'Scholarship record saved', 'id' => (int)$db->lastInsertId()], 201);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
