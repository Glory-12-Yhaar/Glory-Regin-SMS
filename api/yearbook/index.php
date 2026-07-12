<?php
/**
 * /api/yearbook/index.php
 * GET  - Get all yearbooks (returns key-value dictionary keyed by year)
 * POST - Create or update a yearbook edition (Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

requireAuth();
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $db->query("SELECT * FROM yearbooks ORDER BY year DESC");
    $rows = $stmt->fetchAll();
    
    $yearbooks = [];
    foreach ($rows as $row) {
        $year = $row['year'];
        $decodedData = json_decode($row['data'], true) ?: [];
        
        $yearbooks[$year] = array_merge([
            'year'        => $year,
            'title'       => $row['title'],
            'coverImg'    => $row['cover_img'],
            'status'      => $row['status'],
            'totalGrads'  => (int)$row['total_grads'],
            'totalPhotos' => (int)$row['total_photos']
        ], $decodedData);
    }
    
    jsonResponse(['success' => true, 'data' => $yearbooks]);
}

if ($method === 'POST') {
    requireRole(['Admin']);
    $body = getRequestBody();
    
    if (empty($body['year']) || empty($body['title'])) {
        jsonResponse(['success' => false, 'message' => 'Year and Title are required'], 422);
    }
    
    $year        = $body['year'];
    $title       = $body['title'];
    $coverImg    = $body['coverImg'] ?? 'var(--blue-main)';
    $status      = $body['status'] ?? 'Draft';
    $totalGrads  = (int)($body['totalGrads'] ?? 0);
    $totalPhotos = (int)($body['totalPhotos'] ?? 0);
    
    // Extract metadata specific sections to put inside the data JSON field
    $extraData = [
        'classes'      => $body['classes']      ?? new stdClass(),
        'teachers'     => $body['teachers']     ?? [],
        'leaders'      => $body['leaders']      ?? [],
        'achievements' => $body['achievements'] ?? [],
        'events'       => $body['events']       ?? [],
        'tributes'     => $body['tributes']     ?? []
    ];
    $dataJson = json_encode($extraData);
    
    $stmt = $db->prepare(
        "INSERT INTO yearbooks (year, title, cover_img, status, total_grads, total_photos, data) 
         VALUES (?, ?, ?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE 
           title = VALUES(title), 
           cover_img = VALUES(cover_img), 
           status = VALUES(status), 
           total_grads = VALUES(total_grads), 
           total_photos = VALUES(total_photos), 
           data = VALUES(data)"
    );
    $stmt->execute([$year, $title, $coverImg, $status, $totalGrads, $totalPhotos, $dataJson]);
    
    jsonResponse(['success' => true, 'message' => 'Yearbook saved successfully']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
