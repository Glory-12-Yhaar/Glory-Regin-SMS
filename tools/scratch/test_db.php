<?php
require_once __DIR__ . '/../api/config/database.php';

$db = getDB();

echo "Running Parent-Student linkage integration tests...\n";

// 1. Clean up potential previous test data
$db->exec("DELETE FROM students WHERE name = 'Test Student'");
$db->exec("DELETE FROM parents WHERE name = 'Test Parent'");
$db->exec("DELETE FROM users WHERE username LIKE 'testparent%'");

// 2. Insert test student
$year = date('Y');
$code = $year . '-TEST';
$stmt = $db->prepare(
    "INSERT INTO students (student_code, name, class_id, stream, gender, dob, attendance, status)
     VALUES (?, 'Test Student', 1, 'General', 'Male', '2015-01-01', 95, 'Active')"
);
$stmt->execute([$code]);
$studentId = $db->lastInsertId();
echo "Inserted student: Test Student with ID: $studentId\n";

// 3. Call associateParentWithStudent helper
associateParentWithStudent($db, $studentId, 'Test Parent', '0241112222');
echo "Called associateParentWithStudent...\n";

// 4. Verify parent was created
$pStmt = $db->prepare("SELECT * FROM parents WHERE name = 'Test Parent'");
$pStmt->execute();
$parent = $pStmt->fetch();
if ($parent) {
    echo "SUCCESS: Parent record created! ID: " . $parent['id'] . ", Phone: " . $parent['phone'] . "\n";
} else {
    echo "ERROR: Parent record was NOT created!\n";
}

// 5. Verify user account was created
$uStmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$uStmt->execute([$parent['user_id']]);
$user = $uStmt->fetch();
if ($user) {
    echo "SUCCESS: User login account created! ID: " . $user['id'] . ", Username: " . $user['username'] . "\n";
} else {
    echo "ERROR: User account was NOT created!\n";
}

// 6. Verify linkage
$lStmt = $db->prepare("SELECT * FROM parent_student WHERE parent_id = ? AND student_id = ?");
$lStmt->execute([$parent['id'], $studentId]);
if ($lStmt->fetch()) {
    echo "SUCCESS: Student-Parent link created in parent_student bridge table!\n";
} else {
    echo "ERROR: Link was NOT created!\n";
}

// 7. Cleanup test data
$db->exec("DELETE FROM students WHERE id = $studentId");
$db->exec("DELETE FROM parents WHERE id = " . $parent['id']);
$db->exec("DELETE FROM users WHERE id = " . $user['id']);
echo "Cleaned up test data.\n";
