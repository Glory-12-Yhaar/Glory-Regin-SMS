<?php
/**
 * GET /api/auth/me.php
 * Returns the currently logged-in user's session data
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$user = requireAuth();
jsonResponse(['success' => true, 'user' => $user]);
