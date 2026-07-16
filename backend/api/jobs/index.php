<?php
/**
 * /api/jobs/index.php
 * GET    – list job postings (?status=Open)
 * POST   – create a job posting (logged-in Alumni or Admin)
 * PUT    – update a job posting (?id=) (poster or Admin)
 * DELETE – delete a job posting (Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET ──────────────────────────────────────────────────────────────────────
if ($method === 'GET') {
    $status = $_GET['status'] ?? 'Open';
    $search = $_GET['search'] ?? '';
    $industry = $_GET['industry'] ?? '';

    $where  = ['1=1'];
    $params = [];

    if ($status) { $where[] = 'jp.status = ?'; $params[] = $status; }
    if ($search) {
        $q = '%' . trim($search) . '%';
        $where[] = '(jp.title LIKE ? OR jp.company LIKE ? OR jp.location LIKE ? OR jp.industry LIKE ?)';
        array_push($params, $q, $q, $q, $q);
    }
    if ($industry) { $where[] = 'jp.industry = ?'; $params[] = $industry; }

    $stmt = $db->prepare(
        "SELECT jp.id, jp.title, jp.company, jp.location, jp.job_type, jp.industry,
                jp.salary_range, jp.experience, jp.description, jp.status,
                jp.posted_by_name, jp.posted_by_class, jp.created_at
         FROM job_postings jp
         WHERE " . implode(' AND ', $where) . "
         ORDER BY jp.created_at DESC
         LIMIT 100"
    );
    $stmt->execute($params);
    jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
}

// ── POST ─────────────────────────────────────────────────────────────────────
if ($method === 'POST') {
    requireAuth();
    $body  = getRequestBody();
    $title = trim($body['title'] ?? '');
    if (!$title) jsonResponse(['success' => false, 'message' => 'title is required'], 422);

    $user = getSessionUser();
    $postedByName  = trim($body['posted_by_name']  ?? ($user['name'] ?? 'Alumni'));
    $postedByClass = trim($body['posted_by_class'] ?? '');

    $stmt = $db->prepare(
        "INSERT INTO job_postings
         (title, company, location, job_type, industry, salary_range, experience, description, status, posted_by_name, posted_by_class, user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Open', ?, ?, ?)"
    );
    $stmt->execute([
        $title,
        trim($body['company']      ?? ''),
        trim($body['location']     ?? ''),
        trim($body['job_type']     ?? 'Full-time'),
        trim($body['industry']     ?? ''),
        trim($body['salary_range'] ?? ''),
        trim($body['experience']   ?? ''),
        trim($body['description']  ?? ''),
        $postedByName,
        $postedByClass,
        $user['id'] ?? null,
    ]);
    jsonResponse(['success' => true, 'message' => 'Job posted', 'id' => (int)$db->lastInsertId()], 201);
}

// ── PUT ──────────────────────────────────────────────────────────────────────
if ($method === 'PUT') {
    requireAuth();
    $id   = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'id required'], 422);
    $body = getRequestBody();
    $user = getSessionUser();

    // Only poster or Admin can update
    $check = $db->prepare("SELECT user_id FROM job_postings WHERE id = ?");
    $check->execute([$id]);
    $job = $check->fetch();
    if (!$job) jsonResponse(['success' => false, 'message' => 'Job not found'], 404);
    if (($user['role'] ?? '') !== 'Admin' && (int)$job['user_id'] !== (int)$user['id']) {
        jsonResponse(['success' => false, 'message' => 'Not authorised'], 403);
    }

    $allowed = ['title','company','location','job_type','industry','salary_range','experience','description','status'];
    $fields  = [];
    $params  = [];
    foreach ($allowed as $f) {
        if (array_key_exists($f, $body)) { $fields[] = "$f = ?"; $params[] = $body[$f]; }
    }
    if (!$fields) jsonResponse(['success' => false, 'message' => 'Nothing to update'], 422);
    $params[] = $id;
    $db->prepare("UPDATE job_postings SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
    jsonResponse(['success' => true, 'message' => 'Job updated']);
}

// ── DELETE ───────────────────────────────────────────────────────────────────
if ($method === 'DELETE') {
    requireAuth();
    requireRole(['Admin']);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'id required'], 422);
    $db->prepare("DELETE FROM job_postings WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'Job deleted']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
