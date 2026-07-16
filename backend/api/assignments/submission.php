<?php
/**
 * /api/assignments/submission.php
 * GET  - get submissions for an assignment (?assignment_id=X)
 * POST - grade a submission (Teacher/Admin)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$user   = requireAuth();
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

function getAssignmentForSubmission(PDO $db, int $assignmentId): ?array {
    $stmt = $db->prepare("SELECT id, class_id, teacher_id, max_score FROM assignments WHERE id = ?");
    $stmt->execute([$assignmentId]);
    $assignment = $stmt->fetch();
    return $assignment ?: null;
}
function submissionTeacherId(PDO $db,array $user):int{$s=$db->prepare("SELECT id FROM staff WHERE category='Teaching' AND (user_id=? OR LOWER(email)=LOWER(?) OR LOWER(name)=LOWER(?)) ORDER BY user_id=? DESC LIMIT 1");$s->execute([$user['id'],$user['email']??'',$user['name']??'',$user['id']]);return(int)($s->fetchColumn()?:0);}
function requireSubmissionOwner(PDO $db,array $user,array $assignment):void{if(($user['role']??'')==='Teacher'&&(int)$assignment['teacher_id']!==submissionTeacherId($db,$user))jsonResponse(['success'=>false,'message'=>'Assignment not found'],404);}

function studentBelongsToAssignment(PDO $db, int $studentId, array $assignment): bool {
    $stmt = $db->prepare("SELECT COUNT(*) FROM students WHERE id = ? AND class_id = ? AND status = 'Active'");
    $stmt->execute([$studentId, (int)$assignment['class_id']]);
    return (int)$stmt->fetchColumn() > 0;
}

if ($method === 'GET') {
    $assignmentId = (int)($_GET['assignment_id'] ?? 0);
    if (!$assignmentId) jsonResponse(['success' => false, 'message' => 'assignment_id required'], 422);
    $assignment = getAssignmentForSubmission($db, $assignmentId);
    if (!$assignment) jsonResponse(['success' => false, 'message' => 'Assignment not found'], 404);
    requireSubmissionOwner($db,$user,$assignment);

    $stmt = $db->prepare(
        "SELECT sub.id, st.id AS student_id, sub.submitted_at, sub.score, sub.feedback,
                st.name AS student_name, st.student_code
         FROM students st
         LEFT JOIN assignment_submissions sub
           ON sub.student_id = st.id AND sub.assignment_id = ?
         WHERE st.class_id = ? AND st.status = 'Active'
         ORDER BY st.name ASC"
    );
    $stmt->execute([$assignmentId, (int)$assignment['class_id']]);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    requireRole(['Admin', 'Teacher']);
    $body     = getRequestBody();
    $required = ['assignment_id', 'student_id'];
    foreach ($required as $f) {
        if (empty($body[$f])) jsonResponse(['success' => false, 'message' => "Field '$f' required"], 422);
    }

    $assignmentId = (int)$body['assignment_id'];
    $studentId = (int)$body['student_id'];
    $assignment = getAssignmentForSubmission($db, $assignmentId);
    if (!$assignment) jsonResponse(['success' => false, 'message' => 'Assignment not found'], 404);
    requireSubmissionOwner($db,$user,$assignment);
    if (!studentBelongsToAssignment($db, $studentId, $assignment)) {
        jsonResponse(['success' => false, 'message' => 'Student is not enrolled in the assignment class'], 422);
    }
    $score = isset($body['score']) && $body['score'] !== '' ? (float)$body['score'] : null;
    if ($score !== null && ($score < 0 || $score > (float)$assignment['max_score'])) {
        jsonResponse(['success' => false, 'message' => 'Score must be between 0 and assignment max score'], 422);
    }

    // Upsert submission
    $stmt = $db->prepare(
        "INSERT INTO assignment_submissions (assignment_id, student_id, submitted_at, score, feedback)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE submitted_at = VALUES(submitted_at), score = VALUES(score), feedback = VALUES(feedback)"
    );
    $stmt->execute([
        $assignmentId,
        $studentId,
        $body['submitted_at'] ?? date('Y-m-d'),
        $score,
        $body['feedback']     ?? null,
    ]);
    jsonResponse(['success' => true, 'message' => 'Submission saved'], 201);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
