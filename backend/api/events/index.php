<?php
/**
 * /api/events/index.php
 * GET  - list events (?audience=&from=&to=&limit=)
 * POST - create event (Admin/Teacher)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $where  = ['1=1'];
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
        $where[]  = "(audience = ? OR audience = 'All')";
        $params[] = $_GET['audience'];
    }
    if (!$viewer || !in_array($viewer['role'] ?? '', ['Admin', 'Teacher'], true)) {
        $where[] = "status = 'Published'";
    } elseif (!empty($_GET['status'])) {
        $where[] = 'status = ?';
        $params[] = $_GET['status'];
    }
    if (!empty($_GET['from'])) { $where[] = 'event_date >= ?'; $params[] = $_GET['from']; }
    if (!empty($_GET['to']))   { $where[] = 'event_date <= ?'; $params[] = $_GET['to'];   }

    $stmt = $db->prepare(
        "SELECT id, title, event_date, event_time, all_day, location, audience, description, status, created_by, created_at, updated_at
         FROM events WHERE " . implode(' AND ', $where) . "
         ORDER BY event_date ASC, event_time ASC
         LIMIT " . max(1, min(500, (int)($_GET['limit'] ?? 200)))
    );
    $stmt->execute($params);
    $rows=$stmt->fetchAll();foreach($rows as &$row){$row['can_edit']=($viewer['role']??'')==='Admin'||(int)($row['created_by']??0)===(int)($viewer['id']??0);}unset($row);jsonResponse(['success' => true, 'data' => $rows]);
}

if ($method === 'POST') {
    $user = requireRole(['Admin', 'Teacher']);
    $body     = getRequestBody();
    $required = ['title', 'event_date'];
    foreach ($required as $f) {
        if (empty($body[$f])) jsonResponse(['success' => false, 'message' => "Field '$f' required"], 422);
    }

    $eventTime = trim((string)($body['event_time'] ?? ''));
    $stmt = $db->prepare(
        "INSERT INTO events (title, event_date, event_time, all_day, location, audience, description, status, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        htmlspecialchars(trim($body['title']), ENT_QUOTES),
        $body['event_date'],
        $eventTime !== '' ? $eventTime : null,
        (int)($body['all_day'] ?? 0),
        $body['location']    ?? null,
        $body['audience']    ?? 'All',
        $body['description'] ?? null,
        in_array(($body['status'] ?? 'Published'), ['Published', 'Draft', 'Cancelled'], true) ? $body['status'] : 'Published',
        $user['id'],
    ]);
    jsonResponse(['success' => true, 'message' => 'Event created', 'id' => (int)$db->lastInsertId()], 201);
}

// ── PUT (update) ──────────────────────────────────────────────
if ($method === 'PUT') {
    $user=requireRole(['Admin', 'Teacher']);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'id required'], 422);
    if(($user['role']??'')==='Teacher'){$own=$db->prepare('SELECT COUNT(*) FROM events WHERE id=? AND created_by=?');$own->execute([$id,$user['id']]);if(!(int)$own->fetchColumn())jsonResponse(['success'=>false,'message'=>'Event not found'],404);}
    $body = getRequestBody();
    if (isset($body['status']) && !in_array($body['status'], ['Published', 'Draft', 'Cancelled'], true)) {
        jsonResponse(['success' => false, 'message' => 'Invalid event status'], 422);
    }
    $fields = []; $params = [];
    foreach (['title','event_date','event_time','all_day','location','audience','description','status'] as $f) {
        if (array_key_exists($f, $body)) {
            $fields[] = "$f = ?";
            $params[] = $f === 'event_time' && trim((string)$body[$f]) === '' ? null : $body[$f];
        }
    }
    if (empty($fields)) jsonResponse(['success' => false, 'message' => 'Nothing to update'], 422);
    $params[] = $id;
    $db->prepare("UPDATE events SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
    jsonResponse(['success' => true, 'message' => 'Event updated']);
}

// ── DELETE ────────────────────────────────────────────────────
if ($method === 'DELETE') {
    $user=requireRole(['Admin', 'Teacher']);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) jsonResponse(['success' => false, 'message' => 'id required'], 422);
    if(($user['role']??'')==='Teacher'){$own=$db->prepare('SELECT COUNT(*) FROM events WHERE id=? AND created_by=?');$own->execute([$id,$user['id']]);if(!(int)$own->fetchColumn())jsonResponse(['success'=>false,'message'=>'Event not found'],404);}
    $db->prepare("DELETE FROM events WHERE id = ?")->execute([$id]);
    jsonResponse(['success' => true, 'message' => 'Event deleted']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
