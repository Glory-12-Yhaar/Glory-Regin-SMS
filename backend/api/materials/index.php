<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$user = requireRole(['Admin','Teacher']);
$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id = (int)($_GET['id'] ?? 0);

function materialTeacher(PDO $db, array $user): int {
    if (($user['role'] ?? '') === 'Admin') return 0;
    $s=$db->prepare("SELECT id FROM staff WHERE category='Teaching' AND (user_id=? OR LOWER(email)=LOWER(?) OR LOWER(name)=LOWER(?)) ORDER BY user_id=? DESC LIMIT 1");
    $s->execute([$user['id'],$user['email'] ?? '',$user['name'] ?? '',$user['id']]);
    return (int)($s->fetchColumn() ?: 0);
}
function materialOwnsScope(PDO $db, int $teacherId, int $classId, int $subjectId): bool {
    $s=$db->prepare("SELECT COUNT(*) FROM subjects WHERE id=? AND class_id=? AND teacher_id=?");
    $s->execute([$subjectId,$classId,$teacherId]);
    return (int)$s->fetchColumn() > 0;
}
$teacherId = materialTeacher($db,$user);
if (($user['role'] ?? '') === 'Teacher' && !$teacherId) jsonResponse(['success'=>false,'message'=>'Teacher profile is not linked'],403);

if ($method === 'GET') {
    $sql="SELECT m.id,m.teacher_id,m.subject_id,m.class_id,m.title,m.description,m.file_name,m.mime_type,m.file_data,m.downloads,m.created_at,s.name subject,c.name class_name,st.name teacher_name FROM learning_materials m JOIN classes c ON c.id=m.class_id LEFT JOIN subjects s ON s.id=m.subject_id JOIN staff st ON st.id=m.teacher_id";
    $params=[];
    if (($user['role'] ?? '') === 'Teacher') { $sql.=' WHERE m.teacher_id=?'; $params[]=$teacherId; }
    $sql.=' ORDER BY m.created_at DESC,m.id DESC';
    $q=$db->prepare($sql);$q->execute($params);jsonResponse(['success'=>true,'data'=>$q->fetchAll()]);
}
if ($method === 'POST') {
    $b=getRequestBody();$classId=(int)($b['class_id']??0);$subjectId=(int)($b['subject_id']??0);
    if (empty(trim($b['title']??''))||!$classId||!$subjectId||empty($b['file_name'])||empty($b['file_data'])) jsonResponse(['success'=>false,'message'=>'Title, subject, class and file are required'],422);
    $allowedTypes=['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.presentationml.presentation','video/mp4'];
    if(!in_array($b['mime_type']??'',$allowedTypes,true)) jsonResponse(['success'=>false,'message'=>'Unsupported file type'],422);
    if(strlen((string)$b['file_data'])>7*1024*1024) jsonResponse(['success'=>false,'message'=>'File is too large'],422);
    if (($user['role']??'')==='Teacher' && !materialOwnsScope($db,$teacherId,$classId,$subjectId)) jsonResponse(['success'=>false,'message'=>'Subject and class must be assigned to you'],403);
    $owner=$teacherId ?: (int)($b['teacher_id']??0);
    $q=$db->prepare('INSERT INTO learning_materials (teacher_id,subject_id,class_id,title,description,file_name,mime_type,file_data) VALUES (?,?,?,?,?,?,?,?)');
    $q->execute([$owner,$subjectId,$classId,htmlspecialchars(trim($b['title']),ENT_QUOTES),$b['description']??null,$b['file_name'],$b['mime_type']??null,$b['file_data']]);
    jsonResponse(['success'=>true,'message'=>'Learning material uploaded','id'=>$db->lastInsertId()],201);
}
if ($method === 'DELETE') {
    if (!$id) jsonResponse(['success'=>false,'message'=>'Material ID required'],422);
    $sql='DELETE FROM learning_materials WHERE id=?';$params=[$id];
    if (($user['role']??'')==='Teacher') {$sql.=' AND teacher_id=?';$params[]=$teacherId;}
    $q=$db->prepare($sql);$q->execute($params);if(!$q->rowCount())jsonResponse(['success'=>false,'message'=>'Material not found'],404);
    jsonResponse(['success'=>true,'message'=>'Learning material deleted']);
}
jsonResponse(['success'=>false,'message'=>'Method not allowed'],405);
