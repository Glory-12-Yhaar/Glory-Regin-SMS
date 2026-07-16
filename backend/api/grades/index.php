<?php
/**
 * /api/grades/index.php
 * GET  - list student_scores (?student_id=&class_id=&term=&academic_year=)
 * POST - create or upsert a score (Admin/Teacher)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$user   = requireAuth();
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
function gradeTeacher(PDO $db,array $u):int{$s=$db->prepare("SELECT id FROM staff WHERE category='Teaching' AND (user_id=? OR LOWER(email)=LOWER(?) OR LOWER(name)=LOWER(?)) ORDER BY user_id=? DESC LIMIT 1");$s->execute([$u['id'],$u['email']??'',$u['name']??'',$u['id']]);return(int)($s->fetchColumn()?:0);}
function gradeTeacherClasses(PDO $db,int $tid):array{$s=$db->prepare("SELECT DISTINCT c.id FROM classes c LEFT JOIN teachers t ON t.staff_id=? WHERE c.teacher_id=? OR c.name=t.class_assigned OR EXISTS(SELECT 1 FROM subjects sub WHERE sub.class_id=c.id AND sub.teacher_id=?)");$s->execute([$tid,$tid,$tid]);return array_map('intval',$s->fetchAll(PDO::FETCH_COLUMN));}
function teacherCanGrade(PDO $db,int $tid,int $studentId,string $subject):bool{$s=$db->prepare("SELECT COUNT(*) FROM students st JOIN subjects sub ON sub.class_id=st.class_id AND sub.teacher_id=? AND LOWER(sub.name)=LOWER(?) WHERE st.id=?");$s->execute([$tid,$subject,$studentId]);return(int)$s->fetchColumn()>0;}

if ($method === 'GET') {
    $where  = ['1=1'];
    $params = [];
    if (($user['role']??'')==='Teacher'){$ids=gradeTeacherClasses($db,gradeTeacher($db,$user));if(!$ids)jsonResponse(['success'=>true,'data'=>[]]);$where[]='s.class_id IN ('.implode(',',array_fill(0,count($ids),'?')).')';$params=array_merge($params,$ids);}
    if (($user['role']??'')==='Student') {
        $studentStmt=$db->prepare("SELECT id FROM students WHERE user_id=? AND status='Active' LIMIT 1");
        $studentStmt->execute([$user['id']]);
        $studentId=(int)($studentStmt->fetchColumn()?:0);
        if(!$studentId)jsonResponse(['success'=>true,'data'=>[]]);
        $where[]='ss.student_id = ?';
        $params[]=$studentId;
    }

    if (!empty($_GET['student_id']))   { $where[] = 'ss.student_id = ?';    $params[] = (int)$_GET['student_id']; }
    if (!empty($_GET['term']))         { $where[] = 'ss.term = ?';           $params[] = $_GET['term']; }
    if (!empty($_GET['academic_year'])){ $where[] = 'ss.academic_year = ?';  $params[] = $_GET['academic_year']; }
    if (!empty($_GET['class_id'])) {
        $where[]  = 's.class_id = ?';
        $params[] = (int)$_GET['class_id'];
    }

    $stmt = $db->prepare(
        "SELECT ss.id, ss.student_id, ss.subject, ss.class_score, ss.exam_score,
                ss.term, ss.academic_year,
                ROUND(ss.class_score + ss.exam_score, 2) AS total_score,
                s.name AS student_name, s.student_code, s.class_id,
                c.name AS class_name
         FROM student_scores ss
         JOIN students s ON s.id = ss.student_id
         LEFT JOIN classes c ON c.id = s.class_id
         WHERE " . implode(' AND ', $where) . "
         ORDER BY s.name ASC, ss.subject ASC"
    );
    $stmt->execute($params);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    requireRole(['Admin', 'Teacher']);
    $body     = getRequestBody();
    $required = ['student_id', 'subject', 'term'];
    foreach ($required as $f) {
        if (empty($body[$f])) jsonResponse(['success' => false, 'message' => "Field '$f' required"], 422);
    }

    $studentId = (int)$body['student_id'];
    if (($user['role']??'')==='Teacher' && !teacherCanGrade($db,gradeTeacher($db,$user),$studentId,(string)$body['subject'])) jsonResponse(['success'=>false,'message'=>'Student and subject must be assigned to you'],403);
    $studentCheck = $db->prepare("SELECT COUNT(*) FROM students WHERE id = ?");
    $studentCheck->execute([$studentId]);
    if ((int)$studentCheck->fetchColumn() === 0) {
        jsonResponse(['success' => false, 'message' => 'Selected student does not exist'], 422);
    }

    // UPSERT: update if exists for same student+subject+term+year
    $year = $body['academic_year'] ?? '2024/2025';
    $stmt = $db->prepare(
        "INSERT INTO student_scores (student_id, subject, class_score, exam_score, term, academic_year)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           class_score = VALUES(class_score),
           exam_score  = VALUES(exam_score)"
    );
    $stmt->execute([
        $studentId,
        htmlspecialchars(trim($body['subject']), ENT_QUOTES),
        min(50, max(0, (float)($body['class_score'] ?? 0))),
        min(50, max(0, (float)($body['exam_score']  ?? 0))),
        $body['term'],
        $year
    ]);
    jsonResponse(['success' => true, 'message' => 'Score saved', 'id' => $db->lastInsertId()], 201);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
