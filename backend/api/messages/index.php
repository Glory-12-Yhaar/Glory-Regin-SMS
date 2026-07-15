<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$user = requireAuth();
$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

function ensureMessageColumns(PDO $db): void {
    $columns = $db->query("SHOW COLUMNS FROM messages")->fetchAll(PDO::FETCH_COLUMN);
    $changes = [
        'status' => "ADD COLUMN status ENUM('sent','draft') NOT NULL DEFAULT 'sent' AFTER body",
        'attachment_name' => "ADD COLUMN attachment_name VARCHAR(255) NULL AFTER status",
        'attachment_data' => "ADD COLUMN attachment_data LONGTEXT NULL AFTER attachment_name",
        'sender_archived' => "ADD COLUMN sender_archived TINYINT(1) NOT NULL DEFAULT 0 AFTER read_at",
        'receiver_archived' => "ADD COLUMN receiver_archived TINYINT(1) NOT NULL DEFAULT 0 AFTER sender_archived",
        'sender_deleted' => "ADD COLUMN sender_deleted TINYINT(1) NOT NULL DEFAULT 0 AFTER receiver_archived",
        'receiver_deleted' => "ADD COLUMN receiver_deleted TINYINT(1) NOT NULL DEFAULT 0 AFTER sender_deleted"
    ];
    foreach ($changes as $name => $sql) if (!in_array($name, $columns, true)) $db->exec("ALTER TABLE messages $sql");
}

function allowedRecipientRoles(string $role): array {
    return [
        'Admin' => ['Admin','Teacher','Parent','Student','Accountant','Alumni','Admissions Officer'],
        'Teacher' => ['Admin','Teacher','Student','Parent'],
        'Parent' => ['Admin','Teacher','Accountant'],
        'Student' => ['Admin','Teacher'],
        'Accountant' => ['Admin','Parent','Teacher'],
        'Alumni' => ['Admin','Alumni'],
        'Admissions Officer' => ['Admin','Parent','Admissions Officer']
    ][$role] ?? [];
}

function assertMessageOwner(array $message, int $userId): void {
    if ((int)$message['sender_id'] !== $userId && (int)$message['receiver_id'] !== $userId) jsonResponse(['success'=>false,'message'=>'Message not found'], 404);
}

ensureMessageColumns($db);

if ($method === 'GET' && ($_GET['action'] ?? '') === 'recipients') {
    $roles = allowedRecipientRoles($user['role']);
    if (!$roles) jsonResponse(['success'=>true,'data'=>[]]);
    $marks = implode(',', array_fill(0, count($roles), '?'));
    $query = trim($_GET['q'] ?? '');
    $sql = "SELECT id,name,role,email,username FROM users WHERE status='Active' AND id<>? AND role IN ($marks)";
    $params = array_merge([(int)$user['id']], $roles);
    if ($query !== '') { $sql .= " AND (name LIKE ? OR email LIKE ? OR username LIKE ?)"; $like = "%$query%"; array_push($params, $like, $like, $like); }
    $sql .= ' ORDER BY name LIMIT 100';
    $stmt = $db->prepare($sql); $stmt->execute($params);
    jsonResponse(['success'=>true,'data'=>$stmt->fetchAll()]);
}

if ($method === 'GET') {
    $type = $_GET['type'] ?? 'inbox';
    $where = 'm.receiver_id=? AND m.status=\'sent\' AND m.receiver_deleted=0 AND m.receiver_archived=0';
    if ($type === 'sent') $where = 'm.sender_id=? AND m.status=\'sent\' AND m.sender_deleted=0';
    if ($type === 'drafts') $where = 'm.sender_id=? AND m.status=\'draft\' AND m.sender_deleted=0';
    if ($type === 'archived') $where = '(m.sender_id=? AND m.sender_archived=1) OR (m.receiver_id=? AND m.receiver_archived=1)';
    if ($type === 'trash') $where = '(m.sender_id=? AND m.sender_deleted=1) OR (m.receiver_id=? AND m.receiver_deleted=1)';
    $params = in_array($type, ['archived','trash'], true) ? [(int)$user['id'],(int)$user['id']] : [(int)$user['id']];
    $stmt = $db->prepare("SELECT m.*,su.name AS sender_name,su.role AS sender_role,ru.name AS recipient_name,ru.role AS recipient_role FROM messages m JOIN users su ON su.id=m.sender_id JOIN users ru ON ru.id=m.receiver_id WHERE $where ORDER BY m.sent_at DESC LIMIT 100");
    $stmt->execute($params);
    jsonResponse(['success'=>true,'data'=>$stmt->fetchAll()]);
}

if ($method === 'POST') {
    $body = getRequestBody();
    $status = ($body['status'] ?? 'sent') === 'draft' ? 'draft' : 'sent';
    $receiverId = (int)($body['receiver_id'] ?? 0);
    if ($status === 'sent' && (!$receiverId || trim($body['body'] ?? '') === '')) jsonResponse(['success'=>false,'message'=>'Recipient and message are required'], 422);
    $receiver = null;
    if ($receiverId) { $stmt=$db->prepare('SELECT id,name,role FROM users WHERE id=? AND status=\'Active\''); $stmt->execute([$receiverId]); $receiver=$stmt->fetch(); }
    if ($status === 'sent' && !$receiver) jsonResponse(['success'=>false,'message'=>'Recipient not found'], 404);
    if ($receiver && !in_array($receiver['role'], allowedRecipientRoles($user['role']), true)) jsonResponse(['success'=>false,'message'=>'You cannot message this user'], 403);
    $stmt=$db->prepare('INSERT INTO messages(sender_id,receiver_id,subject,body,status,attachment_name,attachment_data) VALUES(?,?,?,?,?,?,?)');
    $stmt->execute([(int)$user['id'],$receiverId ?: (int)$user['id'],trim($body['subject'] ?? '(No Subject)'),trim($body['body'] ?? ''),$status,$body['attachment_name'] ?? null,$body['attachment_data'] ?? null]);
    jsonResponse(['success'=>true,'message'=>$status==='draft'?'Draft saved':'Message sent','id'=>(int)$db->lastInsertId()], 201);
}

if ($method === 'PUT') {
    $id=(int)($_GET['id'] ?? 0); $body=getRequestBody();
    $stmt=$db->prepare('SELECT * FROM messages WHERE id=?'); $stmt->execute([$id]); $message=$stmt->fetch();
    if (!$message) jsonResponse(['success'=>false,'message'=>'Message not found'],404); assertMessageOwner($message,(int)$user['id']);
    $action=$body['action'] ?? '';
    if ($action==='read' && (int)$message['receiver_id']===(int)$user['id']) $db->prepare('UPDATE messages SET read_at=COALESCE(read_at,NOW()) WHERE id=?')->execute([$id]);
    elseif ($action==='archive') { $column=(int)$message['sender_id']===(int)$user['id']?'sender_archived':'receiver_archived'; $db->prepare("UPDATE messages SET $column=1 WHERE id=?")->execute([$id]); }
    elseif ($action==='restore') { $prefix=(int)$message['sender_id']===(int)$user['id']?'sender':'receiver'; $db->prepare("UPDATE messages SET {$prefix}_deleted=0,{$prefix}_archived=0 WHERE id=?")->execute([$id]); }
    else jsonResponse(['success'=>false,'message'=>'Unsupported action'],422);
    jsonResponse(['success'=>true,'message'=>'Message updated']);
}

if ($method === 'DELETE') {
    $id=(int)($_GET['id'] ?? 0); $stmt=$db->prepare('SELECT * FROM messages WHERE id=?'); $stmt->execute([$id]); $message=$stmt->fetch();
    if (!$message) jsonResponse(['success'=>false,'message'=>'Message not found'],404); assertMessageOwner($message,(int)$user['id']);
    $column=(int)$message['sender_id']===(int)$user['id']?'sender_deleted':'receiver_deleted';
    $db->prepare("UPDATE messages SET $column=1 WHERE id=?")->execute([$id]);
    jsonResponse(['success'=>true,'message'=>'Message moved to trash']);
}

jsonResponse(['success'=>false,'message'=>'Method not allowed'],405);
