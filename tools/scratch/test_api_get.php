<?php
$_SERVER['REQUEST_METHOD'] = 'GET';
// We mock auth to bypass requireAuth
// Wait, requireAuth uses session. Let's start session and mock user.
session_start();
$_SESSION['user'] = [
    'id' => 1,
    'username' => 'admin',
    'role' => 'Admin'
];

ob_start();
require __DIR__ . '/../api/staff/index.php';
$output = ob_get_clean();

$response = json_decode($output, true);
echo "API response status: " . ($response['success'] ? 'Success' : 'Fail') . "\n";
echo "First teacher data in API response:\n";
foreach ($response['data'] as $t) {
    if ($t['category'] === 'Teaching') {
        echo " - Name: " . $t['name'] . " | Status: " . $t['status'] . "\n";
    }
}
