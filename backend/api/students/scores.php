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

// ── GET ───────────────────────────────────────────────────────
if ($method === 'GET') {
    $studentId = (int)($_GET['student_id'] ?? 0);
    if (!$studentId) jsonResponse(['success' => false, 'message' => 'student_id required'], 422);

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
