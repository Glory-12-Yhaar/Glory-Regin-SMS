<?php

function provisionUserAccount(PDO $db, string $code, string $name, ?string $email, string $role, ?string $password = null): array {
    $base = strtolower(preg_replace('/[^a-z0-9]+/i', '.', trim($name)));
    $base = trim($base, '.') ?: strtolower($code);
    $username = $base;
    for ($i = 1; ; $i++) {
        $check = $db->prepare('SELECT COUNT(*) FROM users WHERE username = ?');
        $check->execute([$username]);
        if (!(int)$check->fetchColumn()) break;
        $username = $base . $i;
    }
    $safeEmail = filter_var($email, FILTER_VALIDATE_EMAIL) ? strtolower($email) : strtolower($code) . '@gloryreign.local';
    $checkEmail = $db->prepare('SELECT COUNT(*) FROM users WHERE email = ?');
    $checkEmail->execute([$safeEmail]);
    if ((int)$checkEmail->fetchColumn()) $safeEmail = strtolower($code) . '@gloryreign.local';
    $temporaryPassword = $password ?: $code . '@123';
    $stmt = $db->prepare('INSERT INTO users (user_code,name,username,email,password_hash,role,status,avatar) VALUES (?,?,?,?,?,?,\'Active\',?)');
    $stmt->execute([$code, $name, $username, $safeEmail, password_hash($temporaryPassword, PASSWORD_BCRYPT, ['cost' => 12]), $role, strtoupper(substr($name, 0, 2))]);
    return ['id' => (int)$db->lastInsertId(), 'username' => $username, 'email' => $safeEmail, 'temporary_password' => $temporaryPassword];
}

function updateProvisionedPassword(PDO $db, ?int $userId, array $body): void {
    if ($userId && !empty($body['password'])) {
        if (strlen((string)$body['password']) < 6) jsonResponse(['success' => false, 'message' => 'Password must be at least 6 characters'], 422);
        $db->prepare('UPDATE users SET password_hash = ? WHERE id = ?')->execute([password_hash($body['password'], PASSWORD_BCRYPT, ['cost' => 12]), $userId]);
    }
}
