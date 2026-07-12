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

if ($method === 'GET') {
    $where  = ['1=1'];
    $params = [];

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
                s.name AS student_name, s.student_code,
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
        (int)$body['student_id'],
        htmlspecialchars(trim($body['subject']), ENT_QUOTES),
        (float)($body['class_score'] ?? 0),
        (float)($body['exam_score']  ?? 0),
        $body['term'],
        $year
    ]);
    jsonResponse(['success' => true, 'message' => 'Score saved', 'id' => $db->lastInsertId()], 201);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
