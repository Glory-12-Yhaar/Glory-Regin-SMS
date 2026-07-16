<?php
/**
 * /api/reports/public_stats.php
 * GET - public school statistics (no auth required)
 * Used by the visitor homepage stats cards
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

if (session_status() === PHP_SESSION_NONE) session_start();

$db = getDB();

// Total active students
$students = (int)$db->query(
    "SELECT COUNT(*) FROM students WHERE status = 'Active'"
)->fetchColumn();

// Total active teaching staff
$teachers = (int)$db->query(
    "SELECT COUNT(*) FROM staff WHERE category = 'Teaching' AND status = 'Active'"
)->fetchColumn();

// Total published alumni
$alumni = (int)$db->query(
    "SELECT COUNT(*) FROM alumni WHERE status = 'Published'"
)->fetchColumn();

// School founding year from settings
$foundedRow = $db->query(
    "SELECT setting_value FROM settings WHERE setting_key = 'founded_year' LIMIT 1"
)->fetchColumn();
$founded = $foundedRow ? (int)$foundedRow : 1985;
$yearsOfExcellence = (int)date('Y') - $founded;

// Total classes
$classes = (int)$db->query("SELECT COUNT(*) FROM classes")->fetchColumn();

jsonResponse([
    'success' => true,
    'data'    => [
        'students'         => $students,
        'teachers'         => $teachers,
        'alumni'           => $alumni,
        'years_excellence' => $yearsOfExcellence,
        'classes'          => $classes,
        'founded_year'     => $founded,
    ]
]);
