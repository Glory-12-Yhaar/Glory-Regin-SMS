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

if ($method === 'GET') {
    $assignmentId = (int)($_GET['assignment_id'] ?? 0);
    if (!$assignmentId) jsonResponse(['success' => false, 'message' => 'assignment_id required'], 422);

    $stmt = $db->prepare(
        "SELECT sub.id, sub.submitted_at, sub.score, sub.feedback,
                st.name AS student_name, st.student_code
         FROM assignment_submissions sub
         JOIN students st ON st.id = sub.student_id
         WHERE sub.assignment_id = ?
         ORDER BY st.name ASC"
    );
    $stmt->execute([$assignmentId]);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    requireRole(['Admin', 'Teacher']);
    $body     = getRequestBody();
    $required = ['assignment_id', 'student_id'];
    foreach ($required as $f) {
        if (empty($body[$f])) jsonResponse(['success' => false, 'message' => "Field '$f' required"], 422);
    }

    // Upsert submission
    $stmt = $db->prepare(
        "INSERT INTO assignment_submissions (assignment_id, student_id, submitted_at, score, feedback)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE submitted_at = VALUES(submitted_at), score = VALUES(score), feedback = VALUES(feedback)"
    );
    $stmt->execute([
        (int)$body['assignment_id'],
        (int)$body['student_id'],
        $body['submitted_at'] ?? date('Y-m-d'),
        isset($body['score']) ? (float)$body['score'] : null,
        $body['feedback']     ?? null,
    ]);
    jsonResponse(['success' => true, 'message' => 'Submission saved'], 201);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
