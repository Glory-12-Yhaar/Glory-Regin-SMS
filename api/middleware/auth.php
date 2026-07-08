<?php
/**
 * Authentication & Role-Based Access Middleware
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Require that the user is logged in.
 * Returns the current session user array.
 */
function requireAuth(): array {
    if (empty($_SESSION['user'])) {
        jsonResponse(['success' => false, 'message' => 'Unauthorized. Please log in.'], 401);
    }
    return $_SESSION['user'];
}

/**
 * Require that the logged-in user has one of the given roles.
 * @param string|string[] $roles
 */
function requireRole(array|string $roles): array {
    $user = requireAuth();
    $allowed = is_array($roles) ? $roles : [$roles];
    if (!in_array($user['role'], $allowed)) {
        jsonResponse(['success' => false, 'message' => 'Forbidden. Insufficient permissions.'], 403);
    }
    return $user;
}

/**
 * Check if user is logged in (no redirect, just returns bool)
 */
function isLoggedIn(): bool {
    return !empty($_SESSION['user']);
}

/**
 * Get the current session user (or null)
 */
function currentUser(): ?array {
    return $_SESSION['user'] ?? null;
}
