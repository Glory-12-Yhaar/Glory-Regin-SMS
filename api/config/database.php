<?php
/**
 * Database Configuration - Glory Reign Preparatory School
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'glory_regin_school');
define('DB_USER', 'root');
define('DB_PASS', '');          // Default XAMPP password (empty)
define('DB_CHARSET', 'utf8mb4');

function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database connection failed']);
            exit;
        }
    }
    return $pdo;
}

function associateParentWithStudent(PDO $db, int $studentId, string $guardianName, ?string $guardianPhone): void {
    $guardianName = trim($guardianName);
    if (empty($guardianName)) return;

    $guardianPhone = trim($guardianPhone ?? '');

    // 1. Check if parent record already exists by phone (or name if phone is empty)
    $pId = null;
    $uId = null;
    if (!empty($guardianPhone)) {
        $pStmt = $db->prepare("SELECT id, user_id FROM parents WHERE phone = ?");
        $pStmt->execute([$guardianPhone]);
        $row = $pStmt->fetch();
        if ($row) {
            $pId = (int)$row['id'];
            $uId = (int)$row['user_id'];
        }
    } else {
        $pStmt = $db->prepare("SELECT id, user_id FROM parents WHERE name = ?");
        $pStmt->execute([$guardianName]);
        $row = $pStmt->fetch();
        if ($row) {
            $pId = (int)$row['id'];
            $uId = (int)$row['user_id'];
        }
    }

    // 2. If parent doesn't exist, create a user account and parent record
    if (!$pId) {
        // Auto-generate username from parent name
        $rawUname = strtolower(preg_replace('/[^A-Za-z0-9]/', '', $guardianName));
        $username = $rawUname ?: 'parent';
        // Ensure username uniqueness
        $uCheck = $db->prepare("SELECT COUNT(*) FROM users WHERE username = ?");
        $uCheck->execute([$username]);
        if ((int)$uCheck->fetchColumn() > 0) {
            $username = $username . rand(100, 999);
        }
        
        $email = $username . '@gloryreign.edu.gh';
        $userCode = 'user' . str_pad((int)$db->query("SELECT COUNT(*) FROM users")->fetchColumn() + 1, 3, '0', STR_PAD_LEFT);
        
        $pwHash = password_hash('parent123', PASSWORD_BCRYPT, ['cost' => 10]);

        $insUser = $db->prepare("INSERT INTO users (user_code, name, username, email, password_hash, role, status, avatar) VALUES (?, ?, ?, ?, ?, 'Parent', 'Active', ?)");
        $avatarInitials = strtoupper(substr($guardianName, 0, 2)) ?: 'P';
        $insUser->execute([$userCode, $guardianName, $username, $email, $pwHash, $avatarInitials]);
        $uId = (int)$db->lastInsertId();

        $insParent = $db->prepare("INSERT INTO parents (name, email, phone, user_id) VALUES (?, ?, ?, ?)");
        $insParent->execute([$guardianName, $email, $guardianPhone, $uId]);
        $pId = (int)$db->lastInsertId();
    } else {
        // If parent exists, update their phone and name if provided
        $updateFields = [];
        $updateParams = [];
        if (!empty($guardianName)) {
            $updateFields[] = "name = ?";
            $updateParams[] = $guardianName;
        }
        if (!empty($guardianPhone)) {
            $updateFields[] = "phone = ?";
            $updateParams[] = $guardianPhone;
        }
        if (!empty($updateFields)) {
            $updateParams[] = $pId;
            $db->prepare("UPDATE parents SET " . implode(', ', $updateFields) . " WHERE id = ?")->execute($updateParams);
        }
    }

    // Clear previous parent links for this student to keep it in sync with the form
    $db->prepare("DELETE FROM parent_student WHERE student_id = ?")->execute([$studentId]);

    // 3. Link parent to student in parent_student table
    $db->prepare("INSERT IGNORE INTO parent_student (parent_id, student_id) VALUES (?, ?)")
       ->execute([$pId, $studentId]);
}
