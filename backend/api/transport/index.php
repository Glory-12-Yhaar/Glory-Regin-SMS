<?php
/** Parent-scoped transport assignments and latest recorded locations. */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$user = requireAuth();
$db = getDB();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$params = [];
$where = ["ta.status = 'Active'"];
if ($user['role'] === 'Parent') {
    $where[] = 'EXISTS (SELECT 1 FROM parents p JOIN parent_student ps ON ps.parent_id = p.id WHERE p.user_id = ? AND ps.student_id = ta.student_id)';
    $params[] = $user['id'];
} elseif ($user['role'] === 'Student') {
    $where[] = 's.user_id = ?';
    $params[] = $user['id'];
} elseif (!in_array($user['role'], ['Admin', 'Accountant'], true)) {
    jsonResponse(['success' => false, 'message' => 'Forbidden. Insufficient permissions.'], 403);
}

$stmt = $db->prepare(
    "SELECT ta.id, ta.student_id, s.student_code, s.name AS student_name,
            c.name AS class_name, ta.bus_number, ta.driver_name, ta.driver_phone,
            ta.route_name, ta.pickup_point, ta.dropoff_point,
            ta.pickup_time, ta.dropoff_time, ta.gps_enabled, ta.status,
            loc.location_name AS current_location, loc.latitude, loc.longitude,
            loc.recorded_at AS location_recorded_at
     FROM transport_assignments ta
     INNER JOIN students s ON s.id = ta.student_id
     LEFT JOIN classes c ON c.id = s.class_id
     LEFT JOIN transport_location_updates loc ON loc.id = (
         SELECT latest.id FROM transport_location_updates latest
         WHERE latest.assignment_id = ta.id
         ORDER BY latest.recorded_at DESC, latest.id DESC LIMIT 1
     )
     WHERE " . implode(' AND ', $where) . "
     ORDER BY s.name ASC"
);
$stmt->execute($params);
jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
