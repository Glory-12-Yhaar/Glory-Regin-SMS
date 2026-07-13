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

function ensureParentRecord(PDO $db, string $guardianName, ?string $guardianPhone = null, ?string $guardianEmail = null, ?string $guardianAddress = null): int {
    $guardianName = trim($guardianName);
    if ($guardianName === '') return 0;

    $guardianPhone = trim($guardianPhone ?? '');
    $guardianEmail = filter_var(trim($guardianEmail ?? ''), FILTER_SANITIZE_EMAIL) ?: null;
    $guardianAddress = trim($guardianAddress ?? '') ?: null;

    $pId = null;
    $uId = null;
    if ($guardianPhone !== '') {
        $stmt = $db->prepare("SELECT id, user_id FROM parents WHERE phone = ? LIMIT 1");
        $stmt->execute([$guardianPhone]);
        $row = $stmt->fetch();
    } elseif ($guardianEmail) {
        $stmt = $db->prepare("SELECT id, user_id FROM parents WHERE email = ? LIMIT 1");
        $stmt->execute([$guardianEmail]);
        $row = $stmt->fetch();
    } else {
        $stmt = $db->prepare("SELECT id, user_id FROM parents WHERE name = ? LIMIT 1");
        $stmt->execute([$guardianName]);
        $row = $stmt->fetch();
    }
    if (!empty($row)) {
        $pId = (int)$row['id'];
        $uId = (int)($row['user_id'] ?? 0);
    }

    if (!$uId && $guardianEmail) {
        $userStmt = $db->prepare("SELECT id FROM users WHERE email = ? AND role = 'Parent' LIMIT 1");
        $userStmt->execute([$guardianEmail]);
        $uId = (int)($userStmt->fetchColumn() ?: 0);
    }

    if (!$uId) {
        $rawUsername = strtolower(preg_replace('/[^A-Za-z0-9]/', '', $guardianName)) ?: 'parent';
        $username = $rawUsername;
        $suffix = 1;
        while (true) {
            $check = $db->prepare("SELECT COUNT(*) FROM users WHERE username = ?");
            $check->execute([$username]);
            if ((int)$check->fetchColumn() === 0) break;
            $username = $rawUsername . $suffix++;
        }

        $email = $guardianEmail ?: $username . '@gloryreign.edu.gh';
        $userCode = 'user' . str_pad((int)$db->query("SELECT COUNT(*) FROM users")->fetchColumn() + 1, 3, '0', STR_PAD_LEFT);
        $passwordHash = password_hash('parent123', PASSWORD_BCRYPT, ['cost' => 10]);
        $avatar = strtoupper(substr($guardianName, 0, 2)) ?: 'P';
        $insUser = $db->prepare("INSERT INTO users (user_code, name, username, email, password_hash, role, status, avatar) VALUES (?, ?, ?, ?, ?, 'Parent', 'Active', ?)");
        $insUser->execute([$userCode, $guardianName, $username, $email, $passwordHash, $avatar]);
        $uId = (int)$db->lastInsertId();
    }

    $email = $guardianEmail ?: $db->query("SELECT email FROM users WHERE id = " . (int)$uId)->fetchColumn();
    if (!$pId) {
        $insParent = $db->prepare("INSERT INTO parents (name, email, phone, address, contact_person, user_id) VALUES (?, ?, ?, ?, ?, ?)");
        $insParent->execute([$guardianName, $email, $guardianPhone, $guardianAddress, $guardianName, $uId]);
        return (int)$db->lastInsertId();
    }

    $fields = ["user_id = ?", "name = ?", "contact_person = ?"];
    $params = [$uId, $guardianName, $guardianName];
    if ($email) {
        $fields[] = "email = ?";
        $params[] = $email;
    }
    if ($guardianPhone !== '') {
        $fields[] = "phone = ?";
        $params[] = $guardianPhone;
    }
    if ($guardianAddress !== null) {
        $fields[] = "address = ?";
        $params[] = $guardianAddress;
    }
    $params[] = $pId;
    $db->prepare("UPDATE parents SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
    $db->prepare("UPDATE users SET name = ?, email = ? WHERE id = ?")->execute([$guardianName, $email, $uId]);
    return $pId;
}

function associateParentWithStudent(PDO $db, int $studentId, string $guardianName, ?string $guardianPhone, ?string $guardianEmail = null, ?string $guardianAddress = null): void {
    $guardianName = trim($guardianName);
    if (empty($guardianName)) return;

    $guardianPhone = trim($guardianPhone ?? '');
    $guardianEmail = filter_var(trim($guardianEmail ?? ''), FILTER_SANITIZE_EMAIL) ?: null;
    $guardianAddress = trim($guardianAddress ?? '') ?: null;

    $linkedParentId = ensureParentRecord($db, $guardianName, $guardianPhone, $guardianEmail, $guardianAddress);
    if (!$linkedParentId) return;
    $db->prepare("DELETE FROM parent_student WHERE student_id = ?")->execute([$studentId]);
    $db->prepare("INSERT IGNORE INTO parent_student (parent_id, student_id) VALUES (?, ?)")
       ->execute([$linkedParentId, $studentId]);
}
