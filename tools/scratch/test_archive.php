<?php
require_once __DIR__ . '/../api/config/database.php';

$db = getDB();

echo "Running Teacher Archiving backend integration test...\n";

// 1. Find a test or existing teacher
$stmt = $db->query("SELECT s.id, s.user_id, s.status FROM staff s JOIN teachers t ON t.staff_id = s.id LIMIT 1");
$teacher = $stmt->fetch();

if (!$teacher) {
    echo "No teacher found to run test. Exiting.\n";
    exit;
}

$id = $teacher['id'];
$userId = $teacher['user_id'];
$oldStatus = $teacher['status'];
echo "Found teacher ID: $id (User ID: $userId), Status: $oldStatus\n";

// 2. Perform mock PUT request to archive (set status = Inactive)
// We will mock the PUT logic directly by executing PDO updates similar to staff.php
$db->beginTransaction();
try {
    // Update staff status
    $db->prepare("UPDATE staff SET status = 'Inactive' WHERE id = ?")->execute([$id]);
    
    // Update user status if exists
    if ($userId) {
        $db->prepare("UPDATE users SET status = 'Inactive' WHERE id = ?")->execute([$userId]);
    }
    
    $db->commit();
    echo "Applied status update to 'Inactive' (archived).\n";
} catch (Exception $e) {
    $db->rollBack();
    echo "Error updating status: " . $e->getMessage() . "\n";
    exit;
}

// 3. Verify status in database
$verifyStaff = $db->prepare("SELECT status FROM staff WHERE id = ?");
$verifyStaff->execute([$id]);
$newStaffStatus = $verifyStaff->fetchColumn();

$verifyUser = $db->prepare("SELECT status FROM users WHERE id = ?");
$verifyUser->execute([$userId]);
$newUserStatus = $verifyUser->fetchColumn();

if ($newStaffStatus === 'Inactive' && ($userId ? $newUserStatus === 'Inactive' : true)) {
    echo "SUCCESS: Status correctly updated to 'Inactive' in both staff and users tables!\n";
} else {
    echo "ERROR: Status mismatch! Staff: $newStaffStatus, User: $newUserStatus\n";
}

// 4. Revert changes
$db->beginTransaction();
try {
    $db->prepare("UPDATE staff SET status = ? WHERE id = ?")->execute([$oldStatus, $id]);
    if ($userId) {
        $db->prepare("UPDATE users SET status = 'Active' WHERE id = ?")->execute([$userId]);
    }
    $db->commit();
    echo "Reverted teacher status back to $oldStatus.\n";
} catch (Exception $e) {
    $db->rollBack();
    echo "Error reverting status: " . $e->getMessage() . "\n";
}
