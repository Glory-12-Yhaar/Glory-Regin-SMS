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

function ensureAdmissionRuntimeColumns(PDO $db): void {
    static $checked = false;
    if ($checked) return;
    $checked = true;

    $db->exec("ALTER TABLE admissions ADD COLUMN IF NOT EXISTS photo LONGTEXT DEFAULT NULL");
    $db->exec("ALTER TABLE students ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL");
    $db->exec("ALTER TABLE students ADD COLUMN IF NOT EXISTS photo LONGTEXT DEFAULT NULL");
}

function findAdmissionClassId(PDO $db, ?string $className): ?int {
    $className = trim($className ?? '');
    if ($className === '') return null;
    $stmt = $db->prepare("SELECT id FROM classes WHERE name = ? LIMIT 1");
    $stmt->execute([$className]);
    $id = $stmt->fetchColumn();
    return $id ? (int)$id : null;
}

function generateStudentCode(PDO $db): string {
    $year = date('Y');
    $stmt = $db->prepare("SELECT student_code FROM students WHERE student_code LIKE ? ORDER BY id DESC LIMIT 1");
    $stmt->execute([$year . '-%']);
    $last = (string)($stmt->fetchColumn() ?: '');
    $next = 1;
    if (preg_match('/^' . preg_quote($year, '/') . '-(\d+)$/', $last, $matches)) {
        $next = (int)$matches[1] + 1;
    } else {
        $countStmt = $db->query("SELECT COUNT(*) FROM students WHERE student_code LIKE '$year-%'");
        $next = (int)$countStmt->fetchColumn() + 1;
    }
    return $year . '-' . str_pad($next, 2, '0', STR_PAD_LEFT);
}

function enrollAdmission(PDO $db, int $admissionId, ?string $notes = null): array {
    $stmt = $db->prepare("SELECT * FROM admissions WHERE id = ? LIMIT 1");
    $stmt->execute([$admissionId]);
    $admission = $stmt->fetch();
    if (!$admission) {
        jsonResponse(['success' => false, 'message' => 'Admission not found'], 404);
    }

    $existing = $db->prepare(
        "SELECT id, student_code FROM students
         WHERE name = ? AND (dob <=> ?) AND status <> 'Withdrawn'
         LIMIT 1"
    );
    $existing->execute([$admission['applicant_name'], $admission['dob']]);
    $student = $existing->fetch();

    if ($student) {
        $studentId = (int)$student['id'];
        $studentCode = $student['student_code'];
    } else {
        $studentCode = generateStudentCode($db);
        $classId = findAdmissionClassId($db, $admission['class_applying'] ?? null);
        $ins = $db->prepare(
            "INSERT INTO students (student_code, name, class_id, stream, gender, dob, address, photo, attendance, status)
             VALUES (?, ?, ?, 'General', ?, ?, ?, ?, 0, 'Active')"
        );
        $ins->execute([
            $studentCode,
            $admission['applicant_name'],
            $classId,
            $admission['gender'] ?: 'Male',
            $admission['dob'] ?: null,
            $admission['address'] ?? null,
            $admission['photo'] ?? null,
        ]);
        $studentId = (int)$db->lastInsertId();
    }

    $parentId = 0;
    if (!empty($admission['parent_name'])) {
        $parentId = associateParentWithStudent(
            $db,
            $studentId,
            $admission['parent_name'],
            $admission['parent_phone'] ?? null,
            $admission['parent_email'] ?? null,
            $admission['address'] ?? null
        );
    }

    $db->prepare("UPDATE admissions SET status = 'Enrolled', notes = ? WHERE id = ?")
       ->execute([$notes ?: 'Enrolled into students table', $admissionId]);

    return ['student_id' => $studentId, 'student_code' => $studentCode, 'parent_id' => $parentId];
}

ensureAdmissionRuntimeColumns($db);

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

    $countRows = $db->query("SELECT status, COUNT(*) AS count FROM admissions GROUP BY status")->fetchAll();
    $counts = [
        'total'    => 0,
        'Pending'  => 0,
        'Approved' => 0,
        'Rejected' => 0,
        'Enrolled' => 0,
    ];
    foreach ($countRows as $row) {
        $status = $row['status'] ?: 'Pending';
        $count = (int)$row['count'];
        if (!array_key_exists($status, $counts)) $counts[$status] = 0;
        $counts[$status] += $count;
        $counts['total'] += $count;
    }

    $stmt = $db->prepare(
        "SELECT id, applicant_name, dob, gender, class_applying, parent_name,
                parent_phone, parent_email, address, previous_school, photo, status, notes, applied_date
         FROM admissions WHERE " . implode(' AND ', $where) . "
         ORDER BY applied_date DESC LIMIT $limit OFFSET $offset"
    );
    $stmt->execute($params);
    jsonResponse([
        'success'    => true,
        'data'       => $stmt->fetchAll(),
        'total'      => $totalCount,
        'counts'     => $counts,
        'totalPages' => ceil($totalCount / $limit),
    ]);
}

if ($method === 'POST') {
    $body     = getRequestBody();
    $required = ['applicant_name', 'class_applying', 'parent_name', 'parent_phone'];
    foreach ($required as $f) {
        if (empty($body[$f])) jsonResponse(['success' => false, 'message' => "Field '$f' required"], 422);
    }

    $db->beginTransaction();
    try {
        $parentEmail = filter_var($body['parent_email'] ?? '', FILTER_SANITIZE_EMAIL) ?: null;
        $stmt = $db->prepare(
            "INSERT INTO admissions (applicant_name, dob, gender, class_applying, parent_name,
                                      parent_phone, parent_email, address, previous_school, photo, status, notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?)"
        );
        $stmt->execute([
            htmlspecialchars(trim($body['applicant_name']), ENT_QUOTES),
            $body['dob']             ?? null,
            $body['gender']          ?? null,
            $body['class_applying'],
            htmlspecialchars(trim($body['parent_name']),    ENT_QUOTES),
            $body['parent_phone'],
            $parentEmail,
            $body['address']         ?? null,
            $body['previous_school'] ?? null,
            $body['photo']           ?? null,
            $body['notes']           ?? null,
        ]);
        $admissionId = (int)$db->lastInsertId();
        $parentId = ensureParentRecord(
            $db,
            $body['parent_name'],
            $body['parent_phone'] ?? null,
            $parentEmail,
            $body['address'] ?? null
        );
        $db->commit();
        jsonResponse(['success' => true, 'message' => 'Application submitted', 'id' => $admissionId, 'parent_id' => $parentId], 201);
    } catch (Throwable $e) {
        $db->rollBack();
        jsonResponse(['success' => false, 'message' => 'Failed to submit application: ' . $e->getMessage()], 500);
    }
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

    if ($status === 'Enrolled') {
        $db->beginTransaction();
        try {
            $student = enrollAdmission($db, $id, $body['notes'] ?? null);
            $db->commit();
            jsonResponse([
                'success' => true,
                'message' => 'Application enrolled',
                'student_id' => $student['student_id'],
                'student_code' => $student['student_code'],
                'parent_id' => $student['parent_id'],
                'parent_default_password' => 'parent123',
            ]);
        } catch (Throwable $e) {
            $db->rollBack();
            jsonResponse(['success' => false, 'message' => 'Failed to enroll admission: ' . $e->getMessage()], 500);
        }
    } else {
        $db->prepare("UPDATE admissions SET status = ?, notes = ? WHERE id = ?")
           ->execute([$status, $body['notes'] ?? null, $id]);
        jsonResponse(['success' => true, 'message' => "Application $status"]);
    }
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
