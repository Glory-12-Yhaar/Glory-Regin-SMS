<?php
/**
 * /api/assignments/assignment.php?id=X
 * GET    - single assignment
 * PUT    - update assignment
 * DELETE - delete assignment
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$user   = requireAuth();
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = (int)($_GET['id'] ?? 0);
if (!$id) jsonResponse(['success' => false, 'message' => 'id required'], 422);

function assignmentExists(PDO $db, int $id): bool {
    $stmt = $db->prepare("SELECT COUNT(*) FROM assignments WHERE id = ?");
    $stmt->execute([$id]);
    return (int)$stmt->fetchColumn() > 0;
}

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
function assignmentEditorTeacherId(PDO $db,array $user):int{$s=$db->prepare("SELECT id FROM staff WHERE category='Teaching' AND (user_id=? OR LOWER(email)=LOWER(?) OR LOWER(name)=LOWER(?)) ORDER BY user_id=? DESC LIMIT 1");$s->execute([$user['id'],$user['email']??'',$user['name']??'',$user['id']]);return(int)($s->fetchColumn()?:0);}
function requireAssignmentOwner(PDO $db,array $user,int $id):void{if(($user['role']??'')!=='Teacher')return;$s=$db->prepare('SELECT teacher_id FROM assignments WHERE id=?');$s->execute([$id]);if((int)$s->fetchColumn()!==assignmentEditorTeacherId($db,$user))jsonResponse(['success'=>false,'message'=>'Assignment not found'],404);}

if ($method === 'GET') {
    requireAssignmentOwner($db,$user,$id);
    $stmt = $db->prepare(
        "SELECT a.*, c.name AS class_name, s.name AS teacher_name,
                (SELECT COUNT(*) FROM assignment_submissions sub WHERE sub.assignment_id = a.id) AS submitted_count,
                (SELECT COUNT(*) FROM students st WHERE st.class_id = a.class_id AND st.status = 'Active') AS total_students
         FROM assignments a
         LEFT JOIN classes c ON c.id = a.class_id
         LEFT JOIN staff   s ON s.id = a.teacher_id
         WHERE a.id = ?"
    );
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) jsonResponse(['success' => false, 'message' => 'Not found'], 404);
    jsonResponse(['success' => true, 'data' => $row]);
}

if ($method === 'PUT') {
    requireRole(['Admin', 'Teacher']);
    $body = getRequestBody();
    requireAssignmentOwner($db,$user,$id);
    $fields = []; $params = [];
    if (!assignmentExists($db, $id)) {
        jsonResponse(['success' => false, 'message' => 'Assignment not found'], 404);
    }
    foreach (['title','subject','due_date','instructions','attachment'] as $f) {
        if (array_key_exists($f, $body)) { $fields[] = "$f = ?"; $params[] = is_string($body[$f]) ? trim($body[$f]) : $body[$f]; }
    }
    if (array_key_exists('class_id', $body)) {
        $classId = (int)$body['class_id'];
        if (!assignmentClassExists($db, $classId)) {
            jsonResponse(['success' => false, 'message' => 'Selected class does not exist'], 422);
        }
        $fields[] = 'class_id = ?';
        $params[] = $classId;
    }
    if (array_key_exists('teacher_id', $body)) {
        $teacherId = $body['teacher_id'] === '' || $body['teacher_id'] === null ? null : (int)$body['teacher_id'];
        if (!assignmentTeacherExists($db, $teacherId)) {
            jsonResponse(['success' => false, 'message' => 'Selected teacher does not exist or is not active'], 422);
        }
        $fields[] = 'teacher_id = ?';
        $params[] = $teacherId;
    }
    if (array_key_exists('max_score', $body)) {
        $maxScore = (int)$body['max_score'];
        if ($maxScore <= 0 || $maxScore > 1000) {
            jsonResponse(['success' => false, 'message' => 'Max score must be between 1 and 1000'], 422);
        }
        $fields[] = 'max_score = ?';
        $params[] = $maxScore;
    }
    if (array_key_exists('status', $body)) {
        $fields[] = 'status = ?';
        $params[] = normalizeAssignmentStatus($body['status']);
    }
    if (empty($fields)) jsonResponse(['success' => false, 'message' => 'Nothing to update'], 422);
    $params[] = $id;
    $db->prepare("UPDATE assignments SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
    jsonResponse(['success' => true, 'message' => 'Assignment updated']);
}

if ($method === 'DELETE') {
    requireRole(['Admin', 'Teacher']);
    requireAssignmentOwner($db,$user,$id);
    if (!assignmentExists($db, $id)) {
        jsonResponse(['success' => false, 'message' => 'Assignment not found'], 404);
    }
    $db->prepare("DELETE FROM assignments WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'Assignment deleted']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
