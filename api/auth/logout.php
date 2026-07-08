<?php
/**
 * POST /api/auth/logout.php
 */

require_once __DIR__ . '/../config/cors.php';

if (session_status() === PHP_SESSION_NONE) session_start();

$_SESSION = [];
session_destroy();

jsonResponse(['success' => true, 'message' => 'Logged out successfully']);
