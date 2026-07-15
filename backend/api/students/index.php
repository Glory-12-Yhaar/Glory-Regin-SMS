<?php
/**
 * /api/students/index.php
 * GET  - list all students (with optional ?class_id=&search=&page=&limit=)
 * POST - create a new student (Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../config/user-provisioning.php';

$user = requireAuth();
$db   = getDB();
$method = $_SERVER['REQUEST_METHOD'];

$db->exec("ALTER TABLE students ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL");
$db->exec("ALTER TABLE students ADD COLUMN IF NOT EXISTS photo LONGTEXT DEFAULT NULL");

// ── GET ───────────────────────────────────────────────────────
if ($method === 'GET') {
    $where  = ['1=1'];
    $params = [];

    // Filter by class
    if (!empty($_GET['class_id'])) {
        $where[]  = 's.class_id = ?';
        $params[] = (int)$_GET['class_id'];
    }

    // Student sees only their own record
    if ($user['role'] === 'Student') {
        $where[]  = 's.user_id = ?';
        $params[] = $user['id'];
    }

    // Search by name or student_code
    if (!empty($_GET['search'])) {
        $where[]  = '(s.name LIKE ? OR s.student_code LIKE ?)';
        $q        = '%' . $_GET['search'] . '%';
        $params[] = $q;
        $params[] = $q;
    }

    $whereStr = implode(' AND ', $where);

    // Pagination
    $page  = max(1, (int)($_GET['page']  ?? 1));
    $limit = min(200, max(1, (int)($_GET['limit'] ?? 50)));
    $offset = ($page - 1) * $limit;

    $total = $db->prepare("SELECT COUNT(*) FROM students s WHERE $whereStr");
    $total->execute($params);
    $totalCount = (int)$total->fetchColumn();

    $stmt = $db->prepare(
        "SELECT s.id, s.student_code, s.name, s.gender, s.dob, s.attendance, s.status,
                s.stream, s.class_id, s.address, s.photo, c.name AS class_name, c.class_teacher,
                COALESCE((
                    SELECT f.status
                    FROM fees f
                    WHERE f.student_id = s.id
                    ORDER BY f.academic_year DESC, f.term DESC, f.created_at DESC, f.id DESC
                    LIMIT 1
                ), 'Pending') AS fees_status,
                (SELECT p.name FROM parent_student ps JOIN parents p ON p.id = ps.parent_id WHERE ps.student_id = s.id LIMIT 1) AS guardian_name,
                (SELECT p.phone FROM parent_student ps JOIN parents p ON p.id = ps.parent_id WHERE ps.student_id = s.id LIMIT 1) AS guardian_phone
         FROM students s
         LEFT JOIN classes c ON c.id = s.class_id
         WHERE $whereStr
         ORDER BY s.name ASC
         LIMIT $limit OFFSET $offset"
    );
    $stmt->execute($params);
    $students = $stmt->fetchAll();

    jsonResponse([
        'success'    => true,
        'data'       => $students,
        'total'      => $totalCount,
        'page'       => $page,
        'limit'      => $limit,
        'totalPages' => ceil($totalCount / $limit),
    ]);
}

// ── POST ──────────────────────────────────────────────────────
if ($method === 'POST') {
    requireRole(['Admin']);
    $body = getRequestBody();

    $required = ['name', 'gender', 'class_id', 'guardian_name', 'guardian_phone'];
    foreach ($required as $field) {
        if (empty($body[$field])) {
            jsonResponse(['success' => false, 'message' => "Field '$field' is required"], 422);
        }
    }

    $db->beginTransaction();
    try {
        // Auto-generate student code
        $year = date('Y');
        $countStmt = $db->query("SELECT COUNT(*) FROM students WHERE student_code LIKE '$year-%'");
        $count = (int)$countStmt->fetchColumn() + 1;
        $code = $year . '-' . str_pad($count, 2, '0', STR_PAD_LEFT);

        $stmt = $db->prepare(
            "INSERT INTO students (student_code, name, class_id, stream, gender, dob, address, photo, attendance, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')"
        );
        $stmt->execute([
            $code,
            htmlspecialchars(trim($body['name']), ENT_QUOTES),
            (int)$body['class_id'],
            $body['stream'] ?? 'General',
            $body['gender'],
            $body['dob']    ?? null,
            $body['address'] ?? null,
            $body['photo']  ?? null,
            $body['attendance'] ?? 0,
        ]);

        $id = (int)$db->lastInsertId();
        $parentId = associateParentWithStudent(
            $db,
            $id,
            $body['guardian_name'],
            $body['guardian_phone'] ?? null,
            $body['guardian_email'] ?? null,
            $body['address'] ?? null
        );
        $db->commit();
        jsonResponse([
            'success' => true,
            'message' => 'Student created and parent account linked',
            'id' => $id,
            'student_code' => $code,
            'parent_id' => $parentId,
            'parent_default_password' => 'parent123',
        ], 201);
    } catch (Throwable $e) {
        $db->rollBack();
        jsonResponse(['success' => false, 'message' => 'Failed to create student: ' . $e->getMessage()], 500);
    }
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
