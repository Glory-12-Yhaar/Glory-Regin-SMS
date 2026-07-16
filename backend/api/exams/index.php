<?php
/**
 * /api/exams/index.php
 * GET    - list exams (?class_id=&term=&academic_year=)
 * POST   - create exam (Admin only)
 * PUT    - update exam by ?id= (Admin only)
 * DELETE - delete exam by ?id= (Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$user = requireAuth();
$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id = (int)($_GET['id'] ?? 0);

$db->exec("CREATE TABLE IF NOT EXISTS exams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject VARCHAR(150) NOT NULL,
  class_id INT NOT NULL,
  exam_date DATE NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 120,
  venue VARCHAR(120) DEFAULT NULL,
  invigilator_id INT DEFAULT NULL,
  term VARCHAR(50) NOT NULL DEFAULT '1st Term',
  academic_year VARCHAR(20) NOT NULL DEFAULT '2024/2025',
  status ENUM('Scheduled','Completed','Cancelled') NOT NULL DEFAULT 'Scheduled',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_exams_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  CONSTRAINT fk_exams_invigilator FOREIGN KEY (invigilator_id) REFERENCES staff(id) ON DELETE SET NULL,
  INDEX idx_exams_class_date (class_id, exam_date),
  INDEX idx_exams_term_year (term, academic_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

function validateExamClass(PDO $db, $classId): int {
    $classId = (int)$classId;
    if (!$classId) jsonResponse(['success' => false, 'message' => 'Class is required'], 422);
    $stmt = $db->prepare("SELECT COUNT(*) FROM classes WHERE id = ?");
    $stmt->execute([$classId]);
    if ((int)$stmt->fetchColumn() === 0) {
        jsonResponse(['success' => false, 'message' => 'Selected class does not exist'], 422);
    }
    return $classId;
}

function validateInvigilator(PDO $db, $staffId): ?int {
    if (empty($staffId)) return null;
    $staffId = (int)$staffId;
    $stmt = $db->prepare("SELECT COUNT(*) FROM staff WHERE id = ? AND status = 'Active'");
    $stmt->execute([$staffId]);
    if ((int)$stmt->fetchColumn() === 0) {
        jsonResponse(['success' => false, 'message' => 'Selected invigilator must be active staff'], 422);
    }
    return $staffId;
}

function examPayload(PDO $db, array $body): array {
    $subject = htmlspecialchars(trim((string)($body['subject'] ?? '')), ENT_QUOTES);
    if ($subject === '') jsonResponse(['success' => false, 'message' => 'Subject is required'], 422);
    $examDate = trim((string)($body['exam_date'] ?? ''));
    if (!$examDate) jsonResponse(['success' => false, 'message' => 'Exam date is required'], 422);
    $status = $body['status'] ?? 'Scheduled';
    if (!in_array($status, ['Scheduled','Completed','Cancelled'], true)) {
        jsonResponse(['success' => false, 'message' => 'Invalid exam status'], 422);
    }
    return [
        $subject,
        validateExamClass($db, $body['class_id'] ?? 0),
        $examDate,
        max(1, (int)($body['duration_minutes'] ?? 120)),
        !empty($body['venue']) ? htmlspecialchars(trim((string)$body['venue']), ENT_QUOTES) : null,
        validateInvigilator($db, $body['invigilator_id'] ?? null),
        htmlspecialchars(trim((string)($body['term'] ?? '1st Term')), ENT_QUOTES),
        htmlspecialchars(trim((string)($body['academic_year'] ?? '2024/2025')), ENT_QUOTES),
        $status
    ];
}
function teacherExamClassIds(PDO $db,array $user):array{$s=$db->prepare("SELECT s.id,t.class_assigned FROM staff s LEFT JOIN teachers t ON t.staff_id=s.id WHERE s.category='Teaching' AND (s.user_id=? OR LOWER(s.email)=LOWER(?) OR LOWER(s.name)=LOWER(?)) ORDER BY s.user_id=? DESC LIMIT 1");$s->execute([$user['id'],$user['email']??'',$user['name']??'',$user['id']]);$t=$s->fetch();if(!$t)return[];$s=$db->prepare("SELECT DISTINCT c.id FROM classes c WHERE c.teacher_id=? OR c.name=? OR EXISTS(SELECT 1 FROM subjects sub WHERE sub.class_id=c.id AND sub.teacher_id=?)");$s->execute([(int)$t['id'],$t['class_assigned']??'',(int)$t['id']]);return array_map('intval',$s->fetchAll(PDO::FETCH_COLUMN));}

if ($method === 'GET') {
    $where = ['1=1'];
    $params = [];
    if (($user['role'] ?? '') === 'Teacher') { $ids=teacherExamClassIds($db,$user);if(!$ids)jsonResponse(['success'=>true,'data'=>[]]);$where[]='e.class_id IN ('.implode(',',array_fill(0,count($ids),'?')).')';$params=array_merge($params,$ids); }
    if (($user['role'] ?? '') === 'Student') {
        $studentStmt=$db->prepare("SELECT class_id FROM students WHERE user_id=? AND status='Active' LIMIT 1");
        $studentStmt->execute([$user['id']]);
        $studentClassId=(int)($studentStmt->fetchColumn()?:0);
        if(!$studentClassId)jsonResponse(['success'=>true,'data'=>[]]);
        $where[]='e.class_id = ?';
        $params[]=$studentClassId;
    }
    if (!empty($_GET['class_id'])) { $where[] = 'e.class_id = ?'; $params[] = (int)$_GET['class_id']; }
    if (!empty($_GET['term'])) { $where[] = 'e.term = ?'; $params[] = $_GET['term']; }
    if (!empty($_GET['academic_year'])) { $where[] = 'e.academic_year = ?'; $params[] = $_GET['academic_year']; }

    $stmt = $db->prepare(
        "SELECT e.*, c.name AS class_name, c.level AS class_level, s.name AS invigilator_name
         FROM exams e
         JOIN classes c ON c.id = e.class_id
         LEFT JOIN staff s ON s.id = e.invigilator_id
         WHERE " . implode(' AND ', $where) . "
         ORDER BY e.exam_date ASC, c.name ASC, e.subject ASC"
    );
    $stmt->execute($params);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    requireRole(['Admin']);
    $stmt = $db->prepare("INSERT INTO exams (subject,class_id,exam_date,duration_minutes,venue,invigilator_id,term,academic_year,status) VALUES (?,?,?,?,?,?,?,?,?)");
    $stmt->execute(examPayload($db, getRequestBody()));
    jsonResponse(['success' => true, 'message' => 'Exam scheduled', 'id' => $db->lastInsertId()], 201);
}

if ($method === 'PUT') {
    requireRole(['Admin']);
    if (!$id) jsonResponse(['success' => false, 'message' => 'Exam ID required'], 422);
    $exists = $db->prepare("SELECT COUNT(*) FROM exams WHERE id = ?");
    $exists->execute([$id]);
    if ((int)$exists->fetchColumn() === 0) jsonResponse(['success' => false, 'message' => 'Exam not found'], 404);
    $payload = examPayload($db, getRequestBody());
    $payload[] = $id;
    $db->prepare("UPDATE exams SET subject=?, class_id=?, exam_date=?, duration_minutes=?, venue=?, invigilator_id=?, term=?, academic_year=?, status=? WHERE id=?")->execute($payload);
    jsonResponse(['success' => true, 'message' => 'Exam updated']);
}

if ($method === 'DELETE') {
    requireRole(['Admin']);
    if (!$id) jsonResponse(['success' => false, 'message' => 'Exam ID required'], 422);
    $stmt = $db->prepare("DELETE FROM exams WHERE id = ?");
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) jsonResponse(['success' => false, 'message' => 'Exam not found'], 404);
    jsonResponse(['success' => true, 'message' => 'Exam deleted']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
