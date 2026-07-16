<?php
/**
 * /api/assignments/index.php
 * GET  - list assignments (?class_id=&teacher_id=&status=)
 * POST - create assignment (Teacher/Admin)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$user   = requireAuth();
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

function assignmentClassExists(PDO $db, int $classId): bool {
    $stmt = $db->prepare("SELECT COUNT(*) FROM classes WHERE id = ?");
    $stmt->execute([$classId]);
    return (int)$stmt->fetchColumn() > 0;
}

function assignmentTeacherExists(PDO $db, ?int $teacherId): bool {
    if (!$teacherId) return true;
    $stmt = $db->prepare("SELECT COUNT(*) FROM staff WHERE id = ? AND category = 'Teaching' AND status = 'Active'");
    $stmt->execute([$teacherId]);
    return (int)$stmt->fetchColumn() > 0;
}

function normalizeAssignmentStatus(?string $status): string {
    $status = trim($status ?: 'Active');
    $allowed = ['Active', 'Upcoming', 'Closed'];
    if (!in_array($status, $allowed, true)) {
        jsonResponse(['success' => false, 'message' => 'Invalid assignment status'], 422);
    }
    return $status;
}
function assignmentTeacherId(PDO $db,array $user):int{$s=$db->prepare("SELECT id FROM staff WHERE category='Teaching' AND (user_id=? OR LOWER(email)=LOWER(?) OR LOWER(name)=LOWER(?)) ORDER BY user_id=? DESC LIMIT 1");$s->execute([$user['id'],$user['email']??'',$user['name']??'',$user['id']]);return(int)($s->fetchColumn()?:0);}
function teacherCanAssign(PDO $db,int $teacherId,int $classId,string $subject):bool{$s=$db->prepare("SELECT COUNT(*) FROM subjects WHERE teacher_id=? AND class_id=? AND LOWER(name)=LOWER(?)");$s->execute([$teacherId,$classId,$subject]);return(int)$s->fetchColumn()>0;}

if ($method === 'GET') {
    $where  = ['1=1'];
    $params = [];
    if (($user['role'] ?? '') === 'Teacher') { $tid=assignmentTeacherId($db,$user); if(!$tid)jsonResponse(['success'=>true,'data'=>[]]); $where[]='a.teacher_id = ?';$params[]=$tid; }
    if (($user['role'] ?? '') === 'Student') {
        $studentStmt = $db->prepare("SELECT id, class_id FROM students WHERE user_id = ? AND status = 'Active' LIMIT 1");
        $studentStmt->execute([$user['id']]);
        $studentScope = $studentStmt->fetch();
        $studentClassId = (int)($studentScope['class_id'] ?? 0);
        if (!$studentClassId) jsonResponse(['success' => true, 'data' => []]);
        $where[] = 'a.class_id = ?';
        $params[] = $studentClassId;
    }

    if (!empty($_GET['class_id'])) { $where[] = 'a.class_id = ?'; $params[] = (int)$_GET['class_id']; }
    if (!empty($_GET['teacher_id'])) { $where[] = 'a.teacher_id = ?'; $params[] = (int)$_GET['teacher_id']; }
    if (!empty($_GET['status']))   { $where[] = 'a.status = ?';   $params[] = $_GET['status']; }

    $stmt = $db->prepare(
        "SELECT a.id, a.title, a.subject, a.class_id, a.teacher_id, a.due_date, a.created_date, a.max_score,
                a.status, a.instructions, a.attachment,
                c.name AS class_name, s.name AS teacher_name,
                (SELECT COUNT(*) FROM assignment_submissions sub WHERE sub.assignment_id = a.id) AS submitted_count,
                (SELECT COUNT(*) FROM students st WHERE st.class_id = a.class_id AND st.status = 'Active') AS total_students,
                (SELECT GROUP_CONCAT(DISTINCT sub.student_id ORDER BY sub.student_id) FROM assignment_submissions sub WHERE sub.assignment_id = a.id) AS submitted_student_ids
         FROM assignments a
         LEFT JOIN classes c ON c.id = a.class_id
         LEFT JOIN staff   s ON s.id = a.teacher_id
         WHERE " . implode(' AND ', $where) . "
         ORDER BY a.due_date ASC, a.id DESC"
    );
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
    if (($user['role'] ?? '') === 'Student') {
        $studentId = (int)($studentScope['id'] ?? 0);
        foreach ($rows as &$row) {
            $submittedIds = array_filter(array_map('intval', explode(',', (string)($row['submitted_student_ids'] ?? ''))));
            $submitted = in_array($studentId, $submittedIds, true);
            $row['submitted_count'] = $submitted ? 1 : 0;
            $row['total_students'] = 1;
            $row['submitted_student_ids'] = $submitted ? (string)$studentId : null;
        }
        unset($row);
    }
    jsonResponse(['success' => true, 'data' => $rows]);
}

if ($method === 'POST') {
    requireRole(['Admin', 'Teacher']);
    $body     = getRequestBody();
    $required = ['title', 'class_id', 'due_date'];
    foreach ($required as $f) {
        if (empty($body[$f])) jsonResponse(['success' => false, 'message' => "Field '$f' required"], 422);
    }

    $classId = (int)$body['class_id'];
    $teacherId = ($user['role'] ?? '') === 'Teacher' ? assignmentTeacherId($db,$user) : (isset($body['teacher_id']) && $body['teacher_id'] !== '' ? (int)$body['teacher_id'] : null);
    if (!assignmentClassExists($db, $classId)) {
        jsonResponse(['success' => false, 'message' => 'Selected class does not exist'], 422);
    }
    if (!assignmentTeacherExists($db, $teacherId)) {
        jsonResponse(['success' => false, 'message' => 'Selected teacher does not exist or is not active'], 422);
    }
    if (($user['role'] ?? '') === 'Teacher' && !teacherCanAssign($db,$teacherId,$classId,(string)($body['subject']??''))) jsonResponse(['success'=>false,'message'=>'Class and subject must be assigned to you'],403);

    $maxScore = (int)($body['max_score'] ?? 100);
    if ($maxScore <= 0 || $maxScore > 1000) {
        jsonResponse(['success' => false, 'message' => 'Max score must be between 1 and 1000'], 422);
    }

    $stmt = $db->prepare(
        "INSERT INTO assignments (title, subject, class_id, teacher_id, due_date, created_date, max_score, status, instructions, attachment)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        htmlspecialchars(trim($body['title']), ENT_QUOTES),
        trim($body['subject'] ?? '') ?: null,
        $classId,
        $teacherId,
        $body['due_date'],
        $body['created_date'] ?? date('Y-m-d'),
        $maxScore,
        normalizeAssignmentStatus($body['status'] ?? null),
        $body['instructions'] ?? null,
        $body['attachment']   ?? null,
    ]);
    jsonResponse(['success' => true, 'message' => 'Assignment created', 'id' => $db->lastInsertId()], 201);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
