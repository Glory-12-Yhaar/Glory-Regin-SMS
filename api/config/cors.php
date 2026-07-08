<?php
/**
 * CORS + JSON response headers
 */

// Allow requests from the same origin (XAMPP local)
$allowed_origins = [
    'http://localhost',
    'http://127.0.0.1',
    'http://localhost/SCH',
    'http://127.0.0.1/SCH',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: http://localhost");
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/**
 * Send a JSON response and exit
 */
function jsonResponse(array $data, int $statusCode = 200): void {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Get the JSON body from the request
 */
function getRequestBody(): array {
    $body = file_get_contents('php://input');
    return $body ? (json_decode($body, true) ?? []) : [];
}
