<?php
/**
 * /api/staff/index.php
 * GET  - list all staff (?category=Teaching|Admin|Support&search=&page=&limit=)
 * POST - create staff (Admin only)
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

    if (!empty($_GET['category'])) {
        $where[]  = 'category = ?';
        $params[] = $_GET['category'];
    }
    if (!empty($_GET['search'])) {
        $where[]  = '(name LIKE ? OR email LIKE ? OR department LIKE ?)';
        $q        = '%' . $_GET['search'] . '%';
        $params[] = $q; $params[] = $q; $params[] = $q;
    }

    $whereStr = implode(' AND ', $where);
    $page   = max(1, (int)($_GET['page']  ?? 1));
    $limit  = min(200, max(1, (int)($_GET['limit'] ?? 50)));
    $offset = ($page - 1) * $limit;

    $total = $db->prepare("SELECT COUNT(*) FROM staff WHERE $whereStr");
    $total->execute($params);
    $totalCount = (int)$total->fetchColumn();

    $stmt = $db->prepare(
        "SELECT id, staff_code, name, email, phone, category, department, position,
                salary_grade, join_date, gender, status, performance, avatar
         FROM staff WHERE $whereStr ORDER BY name ASC LIMIT $limit OFFSET $offset"
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
    requireRole(['Admin']);
    $body     = getRequestBody();
    $required = ['name', 'email', 'gender', 'category'];
    foreach ($required as $f) {
        if (empty($body[$f])) jsonResponse(['success' => false, 'message' => "Field '$f' required"], 422);
    }

    // Auto-generate staff code
    $prefix    = strtoupper(substr(preg_replace('/[^A-Za-z]/', '', $body['name']), 0, 3));
    $countStmt = $db->query("SELECT COUNT(*) FROM staff");
    $seq       = str_pad((int)$countStmt->fetchColumn() + 1, 3, '0', STR_PAD_LEFT);
    $code      = $prefix . $seq;

    $stmt = $db->prepare(
        "INSERT INTO staff (staff_code,name,email,phone,category,department,position,
                            qualifications,salary_grade,join_date,gender,dob,address,
                            emergency_contact,emergency_phone,performance,status,avatar)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    );
    $stmt->execute([
        $code,
        htmlspecialchars(trim($body['name']),   ENT_QUOTES),
        filter_var($body['email'], FILTER_SANITIZE_EMAIL),
        $body['phone']             ?? null,
        $body['category'],
        $body['department']        ?? null,
        $body['position']          ?? null,
        $body['qualifications']    ?? null,
        $body['salary_grade']      ?? null,
        $body['join_date']         ?? null,
        $body['gender'],
        $body['dob']               ?? null,
        $body['address']           ?? null,
        $body['emergency_contact'] ?? null,
        $body['emergency_phone']   ?? null,
        $body['performance']       ?? null,
        $body['status']            ?? 'Active',
        $body['avatar']            ?? strtoupper(substr($body['name'], 0, 2)),
    ]);

    jsonResponse(['success' => true, 'message' => 'Staff created', 'id' => $db->lastInsertId(), 'staff_code' => $code], 201);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
