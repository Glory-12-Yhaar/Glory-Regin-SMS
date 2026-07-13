<?php
/**
 * /api/admissions/index.php
 * GET  - list admissions (?status=Pending|Approved|Rejected|Enrolled)
 * POST - submit admission application (public or Admin)
 * PUT  - update admission status (Admin only) via ?id=X
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

if (session_status() === PHP_SESSION_NONE) session_start();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    require_once __DIR__ . '/../middleware/auth.php';
    requireRole(['Admin']);

    $where  = ['1=1'];
    $params = [];
    if (!empty($_GET['status'])) { $where[] = 'status = ?'; $params[] = $_GET['status']; }

    $page   = max(1, (int)($_GET['page']  ?? 1));
    $limit  = min(200, max(1, (int)($_GET['limit'] ?? 50)));
    $offset = ($page - 1) * $limit;

    $total = $db->prepare("SELECT COUNT(*) FROM admissions WHERE " . implode(' AND ', $where));
    $total->execute($params);
    $totalCount = (int)$total->fetchColumn();

    $stmt = $db->prepare(
        "SELECT id, applicant_name, dob, gender, class_applying, parent_name,
                parent_phone, parent_email, status, applied_date
         FROM admissions WHERE " . implode(' AND ', $where) . "
         ORDER BY applied_date DESC LIMIT $limit OFFSET $offset"
    );
    $stmt->execute($params);
    jsonResponse([
        'success'    => true,
        'data'       => $stmt->fetchAll(),
        'total'      => $totalCount,
        'totalPages' => ceil($totalCount / $limit),
    ]);
}

if ($method === 'POST') {
    $body     = getRequestBody();
    $required = ['applicant_name', 'class_applying', 'parent_name', 'parent_phone'];
    foreach ($required as $f) {
        if (empty($body[$f])) jsonResponse(['success' => false, 'message' => "Field '$f' required"], 422);
    }

    $stmt = $db->prepare(
        "INSERT INTO admissions (applicant_name, dob, gender, class_applying, parent_name,
                                  parent_phone, parent_email, address, previous_school, status, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?)"
    );
    $stmt->execute([
        htmlspecialchars(trim($body['applicant_name']), ENT_QUOTES),
        $body['dob']             ?? null,
        $body['gender']          ?? null,
        $body['class_applying'],
        htmlspecialchars(trim($body['parent_name']),    ENT_QUOTES),
        $body['parent_phone'],
        filter_var($body['parent_email'] ?? '', FILTER_SANITIZE_EMAIL) ?: null,
        $body['address']         ?? null,
        $body['previous_school'] ?? null,
        $body['notes']           ?? null,
    ]);
    jsonResponse(['success' => true, 'message' => 'Application submitted', 'id' => $db->lastInsertId()], 201);
}

if ($method === 'PUT') {
    require_once __DIR__ . '/../middleware/auth.php';
    requireRole(['Admin']);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'ID required'], 422);

    $body   = getRequestBody();
    $status = $body['status'] ?? null;
    if (!in_array($status, ['Pending','Approved','Rejected','Enrolled'])) {
        jsonResponse(['success' => false, 'message' => 'Invalid status'], 422);
    }

    $db->prepare("UPDATE admissions SET status = ?, notes = ? WHERE id = ?")
       ->execute([$status, $body['notes'] ?? null, $id]);
    jsonResponse(['success' => true, 'message' => "Application $status"]);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
