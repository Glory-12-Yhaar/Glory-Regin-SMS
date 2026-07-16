<?php
/**
 * /api/notices/index.php
 * GET    - list published notices for public/portal display
 * POST   - create notice (Admin/Teacher)
 * PUT    - update notice (Admin/Teacher)
 * DELETE - delete notice (Admin/Teacher)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$db->exec("ALTER TABLE notices ADD COLUMN IF NOT EXISTS created_by INT DEFAULT NULL");

function validateNoticeEnum(?string $value, array $allowed, string $field): void {
    if ($value !== null && !in_array($value, $allowed, true)) {
        jsonResponse(['success' => false, 'message' => "Invalid $field"], 422);
    }
}

if ($method === 'GET') {
    $where = ['1=1'];
    $params = [];
    $viewer = currentUser();

    if (($viewer['role'] ?? '') === 'Teacher') {
        $where[] = "((status = 'Published' AND audience IN ('All','Teachers','Staff')) OR created_by = ?)";
        $params[] = (int)$viewer['id'];
    }

    if ($viewer && !in_array($viewer['role'] ?? '', ['Admin', 'Teacher'], true)) {
        $audienceByRole = ['Parent' => 'Parents', 'Student' => 'Students', 'Alumni' => 'Alumni', 'Accountant' => 'Staff'];
        $roleAudience = $audienceByRole[$viewer['role']] ?? 'Public';
        $where[] = "audience IN ('All', ?, 'Public')";
        $params[] = $roleAudience;
    } elseif (!$viewer) {
        $where[] = "audience IN ('All', 'Public')";
    }

    if (!empty($_GET['audience'])) {
        $where[] = "(audience = ? OR audience = 'All')";
        $params[] = $_GET['audience'];
    }
    if (!empty($_GET['priority'])) {
        $where[] = 'priority = ?';
        $params[] = $_GET['priority'];
    }
    if (!$viewer || !in_array($viewer['role'] ?? '', ['Admin', 'Teacher'], true)) {
        $where[] = "status = 'Published'";
    } elseif (!empty($_GET['status'])) {
        $where[] = 'status = ?';
        $params[] = $_GET['status'];
    }

    $limit = max(1, min(500, (int)($_GET['limit'] ?? 200)));
    $stmt = $db->prepare(
        "SELECT id, icon, title, audience, posted_by, notice_date, message, priority, status, attachment, created_by, created_at, updated_at
         FROM notices
         WHERE " . implode(' AND ', $where) . "
         ORDER BY notice_date DESC, id DESC
         LIMIT $limit"
    );
    $stmt->execute($params);
    $rows=$stmt->fetchAll();foreach($rows as &$row){$row['can_edit']=($viewer['role']??'')==='Admin'||(int)($row['created_by']??0)===(int)($viewer['id']??0);}unset($row);jsonResponse(['success' => true, 'data' => $rows]);
}

if ($method === 'POST') {
    $user = requireRole(['Admin', 'Teacher']);
    $body = getRequestBody();
    if (empty($body['title']) || empty($body['message'])) {
        jsonResponse(['success' => false, 'message' => 'title and message are required'], 422);
    }

    validateNoticeEnum($body['priority'] ?? null, ['Normal', 'Important', 'Urgent'], 'priority');
    validateNoticeEnum($body['status'] ?? null, ['Published', 'Draft', 'Archived'], 'status');

    $stmt = $db->prepare(
        "INSERT INTO notices (icon, title, audience, posted_by, notice_date, message, priority, status, attachment, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $body['icon'] ?? null,
        htmlspecialchars(trim($body['title']), ENT_QUOTES),
        $body['audience'] ?? 'All',
        $body['posted_by'] ?? $user['name'],
        $body['notice_date'] ?? date('Y-m-d'),
        htmlspecialchars(trim($body['message']), ENT_QUOTES),
        $body['priority'] ?? 'Normal',
        $body['status'] ?? 'Published',
        $body['attachment'] ?? null,
        $user['id'],
    ]);
    jsonResponse(['success' => true, 'message' => 'Notice created', 'id' => (int)$db->lastInsertId()], 201);
}

if ($method === 'PUT') {
    $user=requireRole(['Admin', 'Teacher']);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'id required'], 422);
    if(($user['role']??'')==='Teacher'){$own=$db->prepare('SELECT COUNT(*) FROM notices WHERE id=? AND created_by=?');$own->execute([$id,$user['id']]);if(!(int)$own->fetchColumn())jsonResponse(['success'=>false,'message'=>'Notice not found'],404);}
    $body = getRequestBody();

    validateNoticeEnum($body['priority'] ?? null, ['Normal', 'Important', 'Urgent'], 'priority');
    validateNoticeEnum($body['status'] ?? null, ['Published', 'Draft', 'Archived'], 'status');

    $fields = [];
    $params = [];
    foreach (['icon', 'title', 'audience', 'posted_by', 'message', 'priority', 'status', 'notice_date', 'attachment'] as $field) {
        if (array_key_exists($field, $body)) {
            $fields[] = "$field = ?";
            $params[] = in_array($field, ['title', 'message'], true)
                ? htmlspecialchars(trim((string)$body[$field]), ENT_QUOTES)
                : $body[$field];
        }
    }
    if (!$fields) jsonResponse(['success' => false, 'message' => 'Nothing to update'], 422);

    $params[] = $id;
    $db->prepare("UPDATE notices SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
    jsonResponse(['success' => true, 'message' => 'Notice updated']);
}

if ($method === 'DELETE') {
    $user=requireRole(['Admin', 'Teacher']);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'id required'], 422);
    if(($user['role']??'')==='Teacher'){$own=$db->prepare('SELECT COUNT(*) FROM notices WHERE id=? AND created_by=?');$own->execute([$id,$user['id']]);if(!(int)$own->fetchColumn())jsonResponse(['success'=>false,'message'=>'Notice not found'],404);}

    $db->prepare("DELETE FROM notices WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'Notice deleted']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
