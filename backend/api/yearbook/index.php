<?php
/**
 * /api/yearbook/index.php
 * GET  - Get yearbooks (public=1 returns only published editions)
 * POST - Create or update a yearbook edition (Admin only)
 * DELETE - Delete a yearbook edition (Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $publicOnly = isset($_GET['public']) && $_GET['public'] === '1';
    if (!$publicOnly) {
        requireAuth();
    }

    $sql = "SELECT * FROM yearbooks";
    if ($publicOnly) {
        $sql .= " WHERE status = 'Published'";
    }
    $sql .= " ORDER BY year DESC";

    $stmt = $db->query($sql);
    $rows = $stmt->fetchAll();
    
    $yearbooks = [];
    foreach ($rows as $row) {
        $year = $row['year'];
        $decodedData = json_decode($row['data'], true) ?: [];
        
        $yearbooks[$year] = array_merge([
            'year'        => $year,
            'title'       => $row['title'],
            'coverImg'    => $row['cover_img'],
            'cover_img'   => $row['cover_img'],
            'pdfUrl'      => $row['pdf_url'],
            'pdf_url'     => $row['pdf_url'],
            'status'      => $row['status'],
            'totalGrads'  => (int)$row['total_grads'],
            'total_grads' => (int)$row['total_grads'],
            'totalPhotos' => (int)$row['total_photos'],
            'total_photos'=> (int)$row['total_photos'],
            'created_at'  => $row['created_at'],
            'updated_at'  => $row['updated_at']
        ], $decodedData);
    }
    
    jsonResponse(['success' => true, 'data' => $yearbooks]);
}

if ($method === 'POST') {
    requireAuth();
    requireRole(['Admin']);
    $body = getRequestBody();
    
    if (empty($body['year']) || empty($body['title'])) {
        jsonResponse(['success' => false, 'message' => 'Year and Title are required'], 422);
    }
    
    $year        = $body['year'];
    $title       = $body['title'];
    $coverImg    = $body['coverImg'] ?? $body['cover_img'] ?? $body['cover_image'] ?? '#1e3a8a';
    $pdfUrl      = $body['pdfUrl'] ?? $body['pdf_url'] ?? null;
    $status      = $body['status'] ?? 'Draft';
    if (!in_array($status, ['Published', 'Draft'], true)) {
        jsonResponse(['success' => false, 'message' => 'Invalid yearbook status'], 422);
    }
    $totalGrads  = (int)($body['totalGrads'] ?? $body['total_grads'] ?? $body['total_graduates'] ?? 0);
    $totalPhotos = (int)($body['totalPhotos'] ?? $body['total_photos'] ?? 0);
    $layout      = is_array($body['layout'] ?? null) ? $body['layout'] : [];
    
    // Extract metadata specific sections to put inside the data JSON field
    $extraData = [
        'classes'      => $body['classes']      ?? $layout['classes']      ?? new stdClass(),
        'teachers'     => $body['teachers']     ?? $layout['teachers']     ?? [],
        'leaders'      => $body['leaders']      ?? $layout['leaders']      ?? [],
        'achievements' => $body['achievements'] ?? $layout['achievements'] ?? [],
        'events'       => $body['events']       ?? $layout['events']       ?? [],
        'tributes'     => $body['tributes']     ?? $layout['tributes']     ?? []
    ];
    $dataJson = json_encode($extraData);
    
    $stmt = $db->prepare(
        "INSERT INTO yearbooks (year, title, cover_img, pdf_url, status, total_grads, total_photos, data) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE 
           title = VALUES(title), 
           cover_img = VALUES(cover_img), 
           pdf_url = VALUES(pdf_url),
           status = VALUES(status), 
           total_grads = VALUES(total_grads), 
           total_photos = VALUES(total_photos), 
           data = VALUES(data)"
    );
    $stmt->execute([$year, $title, $coverImg, $pdfUrl, $status, $totalGrads, $totalPhotos, $dataJson]);
    
    jsonResponse(['success' => true, 'message' => 'Yearbook saved successfully']);
}

if ($method === 'DELETE') {
    requireAuth();
    requireRole(['Admin']);

    $year = trim($_GET['year'] ?? '');
    if ($year === '') {
        jsonResponse(['success' => false, 'message' => 'Year is required'], 422);
    }

    $stmt = $db->prepare("DELETE FROM yearbooks WHERE year = ?");
    $stmt->execute([$year]);

    jsonResponse(['success' => true, 'message' => 'Yearbook deleted successfully']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
