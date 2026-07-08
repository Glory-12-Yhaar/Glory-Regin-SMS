<?php
/**
 * /api/settings/index.php
 * GET  - get all settings (as key->value object)
 * POST - update a setting (Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

requireAuth();
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $db->query("SELECT setting_key, setting_value FROM settings ORDER BY setting_key ASC");
    $rows = $stmt->fetchAll();
    $settings = [];
    foreach ($rows as $row) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }
    jsonResponse(['success' => true, 'data' => $settings]);
}

if ($method === 'POST') {
    requireRole(['Admin']);
    $body = getRequestBody();

    if (empty($body) || !is_array($body)) {
        jsonResponse(['success' => false, 'message' => 'No settings provided'], 422);
    }

    $upsert = $db->prepare(
        "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)"
    );

    foreach ($body as $key => $value) {
        $safeKey = preg_replace('/[^a-z0-9_]/', '', strtolower($key));
        if ($safeKey) {
            $upsert->execute([$safeKey, $value]);
        }
    }

    jsonResponse(['success' => true, 'message' => 'Settings updated']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
