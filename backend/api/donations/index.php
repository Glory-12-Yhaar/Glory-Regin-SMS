<?php
/**
 * /api/donations/index.php
 * GET  ?type=campaigns  – list donation campaigns
 * GET  ?type=donations  – list donations (Admin/Accountant only)
 * POST action=donate    – alumni submits a donation
 * POST action=campaign  – Admin creates/updates a campaign
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET ──────────────────────────────────────────────────────────────────────
if ($method === 'GET') {
    $type = $_GET['type'] ?? 'campaigns';

    if ($type === 'campaigns') {
        $stmt = $db->query(
            "SELECT dc.id, dc.title, dc.description, dc.goal, dc.status,
                    COALESCE(SUM(d.amount),0) AS raised,
                    COUNT(d.id) AS donor_count,
                    ROUND(COALESCE(SUM(d.amount),0) / dc.goal * 100, 1) AS percentage,
                    dc.created_at
             FROM donation_campaigns dc
             LEFT JOIN donations d ON d.campaign_id = dc.id AND d.status = 'Completed'
             WHERE dc.status = 'Active'
             GROUP BY dc.id
             ORDER BY dc.created_at DESC"
        );
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
    }

    if ($type === 'donations') {
        requireAuth();
        requireRole(['Admin', 'Accountant']);
        $stmt = $db->query(
            "SELECT d.id, d.donor_name, d.amount, d.method, d.status, d.created_at,
                    dc.title AS campaign
             FROM donations d
             LEFT JOIN donation_campaigns dc ON dc.id = d.campaign_id
             ORDER BY d.created_at DESC
             LIMIT 200"
        );
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
    }

    jsonResponse(['success' => false, 'message' => 'Unknown type'], 422);
}

// ── POST ─────────────────────────────────────────────────────────────────────
if ($method === 'POST') {
    $body   = getRequestBody();
    $action = $body['action'] ?? 'donate';

    // Alumni donates
    if ($action === 'donate') {
        requireAuth();
        $campaignId = (int)($body['campaign_id'] ?? 0);
        $donorName  = trim($body['donor_name'] ?? '');
        $amount     = (float)($body['amount'] ?? 0);
        $method_pay = trim($body['method'] ?? 'Card');

        if (!$campaignId || !$donorName || $amount < 10) {
            jsonResponse(['success' => false, 'message' => 'campaign_id, donor_name and amount (≥10) are required'], 422);
        }

        // Verify campaign exists
        $check = $db->prepare("SELECT id FROM donation_campaigns WHERE id = ? AND status = 'Active'");
        $check->execute([$campaignId]);
        if (!$check->fetch()) jsonResponse(['success' => false, 'message' => 'Campaign not found or closed'], 404);

        $stmt = $db->prepare(
            "INSERT INTO donations (campaign_id, donor_name, amount, method, status, user_id)
             VALUES (?, ?, ?, ?, 'Completed', ?)"
        );
        $userId = getSessionUser()['id'] ?? null;
        $stmt->execute([$campaignId, $donorName, $amount, $method_pay, $userId]);

        jsonResponse(['success' => true, 'message' => 'Donation recorded. Thank you!', 'id' => (int)$db->lastInsertId()], 201);
    }

    // Admin creates a campaign
    if ($action === 'campaign') {
        requireAuth();
        requireRole(['Admin']);
        $title       = trim($body['title'] ?? '');
        $description = trim($body['description'] ?? '');
        $goal        = (float)($body['goal'] ?? 0);
        if (!$title || $goal < 100) jsonResponse(['success' => false, 'message' => 'title and goal (≥100) required'], 422);

        $stmt = $db->prepare(
            "INSERT INTO donation_campaigns (title, description, goal, status)
             VALUES (?, ?, ?, 'Active')"
        );
        $stmt->execute([$title, $description, $goal]);
        jsonResponse(['success' => true, 'message' => 'Campaign created', 'id' => (int)$db->lastInsertId()], 201);
    }

    jsonResponse(['success' => false, 'message' => 'Unknown action'], 422);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
