<?php
/**
 * /api/students/student.php?id=X
 * GET    - get one student (with scores)
 * PUT    - update student
 * DELETE - delete student (Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../config/user-provisioning.php';

$user   = requireAuth();
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = (int)($_GET['id'] ?? 0);

if (!$id) jsonResponse(['success' => false, 'message' => 'Student ID required'], 422);

$db->exec("ALTER TABLE students ADD COLUMN IF NOT EXISTS address TEXT DEFAULT NULL");
$db->exec("ALTER TABLE students ADD COLUMN IF NOT EXISTS photo LONGTEXT DEFAULT NULL");

function getTeacherStudentClassIds(PDO $db, array $user): array {
    $stmt = $db->prepare(
        "SELECT s.id AS staff_id, t.class_assigned
         FROM staff s
         LEFT JOIN teachers t ON t.staff_id = s.id
         WHERE s.category = 'Teaching'
           AND (
             s.user_id = ?
             OR LOWER(s.email) = LOWER(?)
             OR LOWER(s.name) = LOWER(?)
           )
         ORDER BY s.user_id = ? DESC, s.id ASC
         LIMIT 1"
    );
    $stmt->execute([
        $user['id'] ?? 0,
        $user['email'] ?? '',
        $user['name'] ?? '',
        $user['id'] ?? 0,
    ]);
    $teacher = $stmt->fetch();
    if (!$teacher) return [];

    $staffId = (int)$teacher['staff_id'];
    $classStmt = $db->prepare(
        "SELECT DISTINCT c.id
         FROM classes c
         WHERE c.teacher_id = ?
            OR c.name = ?
            OR EXISTS (
                SELECT 1 FROM subjects sub
                WHERE sub.class_id = c.id AND sub.teacher_id = ?
            )"
    );
    $classStmt->execute([$staffId, $teacher['class_assigned'] ?? '', $staffId]);
    return array_map('intval', $classStmt->fetchAll(PDO::FETCH_COLUMN));
}

function canAccessStudentRecord(PDO $db, array $user, array $student): bool {
    if (($user['role'] ?? '') === 'Admin') return true;
    if (($user['role'] ?? '') === 'Student') return (int)($student['user_id'] ?? 0) === (int)($user['id'] ?? 0);
    if (($user['role'] ?? '') === 'Teacher') {
        return in_array((int)($student['class_id'] ?? 0), getTeacherStudentClassIds($db, $user), true);
    }
    return false;
}

// Helper: fetch student row
function fetchStudent(PDO $db, int $id): array|false {
    $stmt = $db->prepare(
        "SELECT s.id, s.student_code, s.name, s.gender, s.dob, s.address, s.photo, s.attendance, s.status,
                s.stream, s.user_id, c.id AS class_id, c.name AS class_name, c.class_teacher,
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
         WHERE s.id = ?"
    );
    $stmt->execute([$id]);
    return $stmt->fetch();
}

// ── GET ───────────────────────────────────────────────────────
if ($method === 'GET') {
    $student = fetchStudent($db, $id);
    if (!$student) jsonResponse(['success' => false, 'message' => 'Student not found'], 404);
    if (!canAccessStudentRecord($db, $user, $student)) {
        jsonResponse(['success' => false, 'message' => 'Student not found'], 404);
    }

    // Fetch scores
    $term  = $_GET['term']          ?? '1st Term';
    $year  = $_GET['academic_year'] ?? '2024/2025';
    $sStmt = $db->prepare(
        "SELECT subject, class_score, exam_score,
                (class_score + exam_score) AS total
         FROM student_scores
         WHERE student_id = ? AND term = ? AND academic_year = ?"
    );
    $sStmt->execute([$id, $term, $year]);
    $student['scores'] = $sStmt->fetchAll();

    jsonResponse(['success' => true, 'data' => $student]);
}

// ── PUT ───────────────────────────────────────────────────────
if ($method === 'PUT') {
    requireRole(['Admin', 'Teacher']);
    $student = fetchStudent($db, $id);
    if (!$student) jsonResponse(['success' => false, 'message' => 'Student not found'], 404);
    if (!canAccessStudentRecord($db, $user, $student)) {
        jsonResponse(['success' => false, 'message' => 'Student not found'], 404);
    }

    $body = getRequestBody();
    if (array_key_exists('guardian_phone', $body) && !preg_match('/^\d{1,15}$/', trim((string)$body['guardian_phone']))) {
        jsonResponse(['success' => false, 'message' => 'Guardian phone must contain numbers only and be no more than 15 digits'], 422);
    }
    $linked = $db->prepare('SELECT user_id FROM students WHERE id = ?');
    $linked->execute([$id]);
    updateProvisionedPassword($db, ($uid = $linked->fetchColumn()) ? (int)$uid : null, $body);
    $fields = [];
    $params = [];

    $allowed = ['name', 'class_id', 'stream', 'gender', 'dob', 'address', 'photo', 'attendance', 'status'];
    foreach ($allowed as $f) {
        if (array_key_exists($f, $body)) {
            $fields[] = "$f = ?";
            $params[] = $f === 'name'
                ? htmlspecialchars(trim($body[$f]), ENT_QUOTES)
                : $body[$f];
        }
    }

    if (empty($fields) && !isset($body['guardian_name'])) jsonResponse(['success' => false, 'message' => 'No fields to update'], 422);

    if (!empty($fields)) {
        $params[] = $id;
        $db->prepare("UPDATE students SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
    }

    if (isset($body['guardian_name'])) {
        associateParentWithStudent($db, $id, $body['guardian_name'], $body['guardian_phone'] ?? null, $body['guardian_email'] ?? null, $body['address'] ?? null);
    }

    jsonResponse(['success' => true, 'message' => 'Student updated']);
}

// ── DELETE ────────────────────────────────────────────────────
if ($method === 'DELETE') {
    requireRole(['Admin']);
    $student = fetchStudent($db, $id);
    if (!$student) jsonResponse(['success' => false, 'message' => 'Student not found'], 404);

    $db->prepare("DELETE FROM students WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'Student deleted']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
