<?php
/**
 * /api/students/scores.php?student_id=X
 * GET  - get all scores for a student
 * POST - save/update scores (upsert) - Teacher/Admin
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$user   = requireAuth();
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
function scoreTeacher(PDO $db,array $u):int{$s=$db->prepare("SELECT id FROM staff WHERE category='Teaching' AND (user_id=? OR LOWER(email)=LOWER(?) OR LOWER(name)=LOWER(?)) ORDER BY user_id=? DESC LIMIT 1");$s->execute([$u['id'],$u['email']??'',$u['name']??'',$u['id']]);return(int)($s->fetchColumn()?:0);}
function teacherScoreAccess(PDO $db,int $tid,int $studentId,?string $subject=null):bool{$sql="SELECT COUNT(*) FROM students st WHERE st.id=? AND (EXISTS(SELECT 1 FROM classes c WHERE c.id=st.class_id AND c.teacher_id=?) OR EXISTS(SELECT 1 FROM subjects sub WHERE sub.class_id=st.class_id AND sub.teacher_id=?";$p=[$studentId,$tid,$tid];if($subject!==null){$sql.=' AND LOWER(sub.name)=LOWER(?)';$p[]=$subject;}$sql.='))';$s=$db->prepare($sql);$s->execute($p);return(int)$s->fetchColumn()>0;}

// ── GET ───────────────────────────────────────────────────────
if ($method === 'GET') {
    $studentId = (int)($_GET['student_id'] ?? 0);
    if (!$studentId) jsonResponse(['success' => false, 'message' => 'student_id required'], 422);
    if (($user['role']??'')==='Teacher'&&!teacherScoreAccess($db,scoreTeacher($db,$user),$studentId))jsonResponse(['success'=>false,'message'=>'Student not found'],404);

    $term = $_GET['term']          ?? '1st Term';
    $year = $_GET['academic_year'] ?? '2024/2025';

    $stmt = $db->prepare(
        "SELECT ss.id, ss.subject, ss.class_score, ss.exam_score,
                (ss.class_score + ss.exam_score) AS total
         FROM student_scores ss
         WHERE ss.student_id = ? AND ss.term = ? AND ss.academic_year = ?
         ORDER BY ss.subject ASC"
    );
    $stmt->execute([$studentId, $term, $year]);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

// ── POST (batch upsert) ───────────────────────────────────────
if ($method === 'POST') {
    requireRole(['Admin', 'Teacher']);
    $body      = getRequestBody();
    $studentId = (int)($body['student_id'] ?? 0);
    $term      = $body['term']          ?? '1st Term';
    $year      = $body['academic_year'] ?? '2024/2025';
    $scores    = $body['scores']        ?? [];   // [{ subject, class_score, exam_score }, ...]

    if (!$studentId || empty($scores)) {
        jsonResponse(['success' => false, 'message' => 'student_id and scores are required'], 422);
    }
    if (($user['role']??'')==='Teacher'){$tid=scoreTeacher($db,$user);foreach($scores as $score){if(!teacherScoreAccess($db,$tid,$studentId,(string)($score['subject']??'')))jsonResponse(['success'=>false,'message'=>'Student and subject must be assigned to you'],403);}}

    $studentCheck = $db->prepare("SELECT COUNT(*) FROM students WHERE id = ?");
    $studentCheck->execute([$studentId]);
    if ((int)$studentCheck->fetchColumn() === 0) {
        jsonResponse(['success' => false, 'message' => 'Selected student does not exist'], 422);
    }

    $upsert = $db->prepare(
        "INSERT INTO student_scores (student_id, subject, class_score, exam_score, term, academic_year)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE class_score = VALUES(class_score), exam_score = VALUES(exam_score)"
    );

    // Ensure unique index exists for upsert (student_id + subject + term + academic_year)
    foreach ($scores as $s) {
        if (empty($s['subject'])) continue;
        $upsert->execute([
            $studentId,
            htmlspecialchars(trim($s['subject']), ENT_QUOTES),
            min(50, max(0, (float)($s['class_score'] ?? 0))),
            min(50, max(0, (float)($s['exam_score']  ?? 0))),
            $term,
            $year,
        ]);
    }

    jsonResponse(['success' => true, 'message' => 'Scores saved']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
