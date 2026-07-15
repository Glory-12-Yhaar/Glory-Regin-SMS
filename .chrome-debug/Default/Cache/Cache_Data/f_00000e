// Shared internal messaging for every authenticated dashboard.
let messageFolder = 'inbox';
let messageFilter = 'all';
let messageQuery = '';
let selectedInternalMessageId = null;
let internalMessagesSyncing = false;
let internalMessagesSyncedFor = '';

function getMessageIdentity() {
  const session = getSessionUser?.() || {};
  const chat = typeof getChatSelf === 'function' ? getChatSelf() : {};
  return {
    id: Number(session.id || session.user_id || 0),
    name: chat.name || session.name || currentRole,
    role: currentRole,
    username: session.username || ''
  };
}

function internalMessageUsers() {
  const users = [];
  const add = (name, role, id = 0, detail = '') => {
    if (!name || users.some(user => normalizeIdentity(user.name) === normalizeIdentity(name))) return;
    users.push({ id: Number(id || 0), name, role, detail });
  };
  (typeof getUsers === 'function' ? getUsers() : []).forEach(user => add(user.name, user.role, user.id || user.user_id, user.email || user.username));
  (window.MESSAGE_RECIPIENTS || []).forEach(user => add(user.name, user.role, user.id, user.email || user.username));
  (window.teachersData || []).forEach(user => add(user.name, 'Teacher', user.user_id, user.subject || ''));
  (window.enrolledStudents || []).forEach(user => add(user.name, 'Student', user.user_id, user.student_class || ''));
  (window.parentsData || []).forEach(user => add(user.contact_person || user.name, 'Parent', user.user_id, user.children || ''));
  add('Admin Office', 'Admin');
  return users;
}

function canInternalMessage(senderRole, recipientRole, recipientName = '') {
  const allowed = {
    Admin: ['Admin', 'Teacher', 'Parent', 'Student', 'Accountant', 'Alumni', 'Admissions Officer'],
    Teacher: ['Admin', 'Teacher', 'Student', 'Parent'],
    Parent: ['Admin', 'Teacher', 'Accountant'],
    Student: ['Admin', 'Teacher'],
    Accountant: ['Admin', 'Parent', 'Teacher'],
    Alumni: ['Admin', 'Alumni'],
    'Admissions Officer': ['Admin', 'Parent', 'Admissions Officer']
  };
  if (!(allowed[senderRole] || []).includes(recipientRole)) return false;
  if (senderRole === 'Parent' && recipientRole === 'Teacher' && typeof isParentAllowedTeacherName === 'function') return isParentAllowedTeacherName(recipientName);
  if (senderRole === 'Teacher' && ['Student', 'Parent'].includes(recipientRole)) {
    return (typeof getAvailableChatContacts !== 'function' || getAvailableChatContacts().some(contact => normalizeIdentity(contact.name) === normalizeIdentity(recipientName)));
  }
  return true;
}

function permittedInternalRecipients() {
  const self = getMessageIdentity();
  return internalMessageUsers().filter(user => normalizeIdentity(user.name) !== normalizeIdentity(self.name) && canInternalMessage(self.role, user.role, user.name));
}

function normalizeInternalMessages() {
  allMessages = (allMessages || []).map(message => ({
    ...message,
    subject: message.subject || '(No Subject)',
    body: message.body || message.text || '',
    text: message.text || message.body || '',
    folder: message.folder || 'sent',
    senderDeleted: Boolean(message.senderDeleted),
    receiverDeleted: Boolean(message.receiverDeleted),
    archivedBy: Array.isArray(message.archivedBy) ? message.archivedBy : [],
    attachments: Array.isArray(message.attachments) ? message.attachments : [],
    createdAt: message.createdAt || `${message.date || ''} ${message.time || ''}`.trim()
  }));
}

function getInternalFolderMessages(folder = messageFolder) {
  normalizeInternalMessages();
  const self = getMessageIdentity();
  const mine = allMessages.filter(message => {
    const received = normalizeIdentity(message.recipient) === normalizeIdentity(self.name);
    const sent = normalizeIdentity(message.sender) === normalizeIdentity(self.name);
    const archived = message.archivedBy.includes(self.name);
    if (folder === 'drafts') return sent && message.folder === 'draft';
    if (folder === 'sent') return sent && message.folder !== 'draft' && !message.senderDeleted;
    if (folder === 'archived') return (sent || received) && archived;
    if (folder === 'trash') return (sent && message.senderDeleted) || (received && message.receiverDeleted);
    return received && !message.receiverDeleted && !archived;
  });
  const query = messageQuery.trim().toLowerCase();
  return mine.filter(message => {
    if (messageFilter === 'unread' && message.read) return false;
    if (messageFilter === 'read' && !message.read) return false;
    if (messageFilter === 'attachments' && !message.attachments.length) return false;
    return !query || `${message.sender} ${message.recipient} ${message.subject} ${message.text} ${message.date}`.toLowerCase().includes(query);
  }).sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
}

function internalUnreadCount() {
  const self = getMessageIdentity();
  return (allMessages || []).filter(message => normalizeIdentity(message.recipient) === normalizeIdentity(self.name) && !message.read && !message.receiverDeleted && !(message.archivedBy || []).includes(self.name)).length;
}

function messagingModule() {
  syncInternalMessagesFromServer();
  const folders = [['inbox', 'Inbox'], ['sent', 'Sent'], ['drafts', 'Drafts'], ['archived', 'Archived'], ['trash', 'Trash']];
  const rows = getInternalFolderMessages();
  if (!selectedInternalMessageId || !rows.some(message => Number(message.id) === Number(selectedInternalMessageId))) selectedInternalMessageId = rows[0]?.id || null;
  const selected = rows.find(message => Number(message.id) === Number(selectedInternalMessageId));
  const self = getMessageIdentity();
  if (selected && normalizeIdentity(selected.recipient) === normalizeIdentity(self.name) && !selected.read) {
    selected.read = true;
    saveAllMessages();
    if (selected.backendId && typeof API !== 'undefined') API.messages.update(selected.backendId, 'read').catch(() => {});
  }
  return hdr('Messages', 'Your private school inbox', 'Messages') + `
    <div class="card internal-mail-card" style="padding:0;overflow:hidden">
      <div class="internal-mail-layout" style="display:grid;grid-template-columns:190px minmax(280px,360px) 1fr;min-height:590px">
        <aside class="internal-mail-sidebar" style="padding:18px;border-right:1px solid var(--gray-200)">
          <button class="btn btn-primary internal-compose-btn" style="width:100%;margin-bottom:18px" onclick="openInternalComposer()"><i class="fas fa-pen"></i> New Message</button>
          ${folders.map(([id, label]) => `<button class="sb-item internal-folder${messageFolder === id ? ' active' : ''}" style="border:0;width:100%;margin-bottom:4px" onclick="setMessageFolder('${id}')"><span class="si"><i class="fas fa-${id === 'inbox' ? 'inbox' : id === 'sent' ? 'paper-plane' : id === 'drafts' ? 'file' : id === 'archived' ? 'box-archive' : 'trash'}"></i></span><span class="sl">${label}</span>${id === 'inbox' && internalUnreadCount() ? `<span class="sb-badge">${internalUnreadCount()}</span>` : ''}</button>`).join('')}
        </aside>
        <section class="internal-mail-list-pane" style="border-right:1px solid var(--gray-200)">
          <div class="internal-mail-toolbar" style="padding:14px;border-bottom:1px solid var(--gray-200)"><input id="message-search" class="f-input" value="${escapeAttr(messageQuery)}" placeholder="Search messages..." oninput="messageQuery=this.value;renderMain()"><select class="f-input" style="margin-top:8px" onchange="messageFilter=this.value;renderMain()"><option value="all" ${messageFilter === 'all' ? 'selected' : ''}>All</option><option value="unread" ${messageFilter === 'unread' ? 'selected' : ''}>Unread</option><option value="read" ${messageFilter === 'read' ? 'selected' : ''}>Read</option><option value="attachments" ${messageFilter === 'attachments' ? 'selected' : ''}>Attachments</option></select></div>
          <div class="internal-mail-list" style="max-height:500px;overflow:auto">${rows.length ? rows.map(message => renderInternalMessageRow(message, self)).join('') : '<div class="internal-mail-empty" style="padding:38px 18px;text-align:center;color:var(--gray-400)"><i class="fas fa-inbox" style="font-size:30px;display:block;margin-bottom:10px"></i>No messages here</div>'}</div>
        </section>
        <section class="internal-mail-reader" style="padding:22px;min-width:0">${selected ? renderInternalMessageDetail(selected, self) : '<div class="internal-reader-empty" style="height:100%;display:flex;align-items:center;justify-content:center;color:var(--gray-400)"><i class="far fa-envelope-open"></i><span>Select a message to read</span></div>'}</section>
      </div>
    </div>`;
}

async function syncInternalMessagesFromServer() {
  const self = getMessageIdentity();
  const syncKey = `${self.id}:${self.name}`;
  if (!self.id || internalMessagesSyncing || internalMessagesSyncedFor === syncKey || typeof API === 'undefined' || !API.messages?.folder) return;
  internalMessagesSyncing = true;
  try {
    const responses = await Promise.all(['inbox', 'sent', 'drafts', 'archived', 'trash'].map(folder => API.messages.folder(folder)));
    const records = new Map();
    responses.forEach(response => (response?.data || []).forEach(row => records.set(Number(row.id), row)));
    const serverMessages = Array.from(records.values()).map(row => ({
      id: Number(row.id), backendId: Number(row.id), sender: row.sender_name, senderRole: String(row.sender_role || '').toLowerCase(),
      recipient: row.recipient_name, recipientRole: String(row.recipient_role || '').toLowerCase(), subject: row.subject || '(No Subject)',
      text: row.body || '', body: row.body || '', date: row.sent_at ? new Date(row.sent_at.replace(' ', 'T')).toLocaleDateString() : '',
      time: row.sent_at ? new Date(row.sent_at.replace(' ', 'T')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      createdAt: row.sent_at, read: Boolean(row.read_at), folder: row.status === 'draft' ? 'draft' : 'sent',
      senderDeleted: Boolean(Number(row.sender_deleted)), receiverDeleted: Boolean(Number(row.receiver_deleted)),
      archivedBy: [Number(row.sender_archived) ? row.sender_name : '', Number(row.receiver_archived) ? row.recipient_name : ''].filter(Boolean),
      attachments: row.attachment_name ? [{ name: row.attachment_name, data: row.attachment_data || '#' }] : []
    }));
    allMessages = [...allMessages.filter(message => !message.backendId), ...serverMessages];
    saveAllMessages();
    internalMessagesSyncedFor = syncKey;
    renderMain();
  } catch (error) { console.warn('Could not sync internal messages', error); }
  finally { internalMessagesSyncing = false; }
}

function renderInternalMessageRow(message, self) {
  const received = normalizeIdentity(message.recipient) === normalizeIdentity(self.name);
  const person = received ? message.sender : message.recipient;
  return `<button class="internal-message-row${Number(selectedInternalMessageId) === Number(message.id) ? ' selected' : ''}${received && !message.read ? ' unread' : ''}" onclick="openInternalMessage(${Number(message.id)})" style="display:block;width:100%;text-align:left;border:0;border-bottom:1px solid var(--gray-100);padding:14px;background:${Number(selectedInternalMessageId) === Number(message.id) ? 'var(--blue-xpale)' : 'white'};cursor:pointer">
    <div style="display:flex;justify-content:space-between;gap:8px"><strong style="font-size:13px">${escapeHtml(person)}</strong><small style="color:var(--gray-400)">${escapeHtml(message.time || message.date || '')}</small></div>
    <div style="font-size:12px;font-weight:${received && !message.read ? '800' : '600'};margin-top:5px">${escapeHtml(message.subject)}</div>
    <div style="font-size:11px;color:var(--gray-500);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(message.text)}</div>
  </button>`;
}

function renderInternalMessageDetail(message, self) {
  const received = normalizeIdentity(message.recipient) === normalizeIdentity(self.name);
  const other = received ? message.sender : message.recipient;
  return `<div style="display:flex;justify-content:space-between;gap:15px;border-bottom:1px solid var(--gray-200);padding-bottom:15px"><div><h3 style="margin:0 0 8px">${escapeHtml(message.subject)}</h3><div style="font-size:12px;color:var(--gray-500)">${received ? 'From' : 'To'}: <strong>${escapeHtml(other)}</strong> · ${escapeHtml(message.date || '')} ${escapeHtml(message.time || '')}</div></div><div style="display:flex;gap:7px"><button class="btn btn-secondary btn-xs" onclick="archiveInternalMessage(${Number(message.id)})"><i class="fas fa-box-archive"></i></button><button class="btn btn-danger btn-xs" onclick="trashInternalMessage(${Number(message.id)})"><i class="fas fa-trash"></i></button></div></div>
    <div style="padding:25px 2px;white-space:pre-wrap;line-height:1.7;font-size:14px">${escapeHtml(message.text)}</div>
    ${message.attachments.length ? `<div style="border-top:1px solid var(--gray-200);padding-top:12px">${message.attachments.map(file => `<a class="btn btn-secondary btn-xs" href="${escapeAttr(file.data || '#')}" download="${escapeAttr(file.name)}"><i class="fas fa-paperclip"></i> ${escapeHtml(file.name)}</a>`).join(' ')}</div>` : ''}
    ${received ? `<button class="btn btn-primary" style="margin-top:20px" onclick="openInternalComposer('${escapeAttr(other)}','Re: ${escapeAttr(message.subject)}')"><i class="fas fa-reply"></i> Reply</button>` : ''}`;
}

function setMessageFolder(folder) { messageFolder = folder; selectedInternalMessageId = null; renderMain(); }
function openInternalMessage(id) { selectedInternalMessageId = id; renderMain(); }
function archiveInternalMessage(id) { const message = allMessages.find(item => Number(item.id) === Number(id)); const self = getMessageIdentity(); if (message && !message.archivedBy.includes(self.name)) message.archivedBy.push(self.name); if (message?.backendId && typeof API !== 'undefined') API.messages.update(message.backendId, 'archive').catch(() => {}); saveAllMessages(); selectedInternalMessageId = null; renderMain(); }
function trashInternalMessage(id) { const message = allMessages.find(item => Number(item.id) === Number(id)); const self = getMessageIdentity(); if (normalizeIdentity(message?.sender) === normalizeIdentity(self.name)) message.senderDeleted = true; if (normalizeIdentity(message?.recipient) === normalizeIdentity(self.name)) message.receiverDeleted = true; if (message?.backendId && typeof API !== 'undefined') API.messages.delete(message.backendId).catch(() => {}); saveAllMessages(); selectedInternalMessageId = null; renderMain(); }

async function openInternalComposer(recipient = '', subject = '') {
  if (typeof API !== 'undefined' && API.messages?.recipients) {
    try {
      const response = await API.messages.recipients();
      if (response?.success && Array.isArray(response.data)) window.MESSAGE_RECIPIENTS = response.data;
    } catch (error) { console.warn('Could not refresh message recipients', error); }
  }
  const recipients = permittedInternalRecipients();
  openModal(`<div class="internal-compose-shell"><div class="modal-head"><h3><i class="fas fa-pen"></i> New Message</h3><button class="modal-close" onclick="closeModal()">&times;</button></div><div class="modal-body">
    <div class="f-field"><label>To</label><input id="compose-recipient-search" class="f-input" value="${escapeAttr(recipient)}" placeholder="Search registered users..." oninput="filterMessageRecipients()"><input id="compose-recipient-role" type="hidden"><div id="compose-recipient-results" style="border:1px solid var(--gray-200);border-radius:8px;max-height:150px;overflow:auto;margin-top:5px">${renderRecipientResults(recipients, recipient)}</div></div>
    <div class="f-field"><label>Subject</label><input id="compose-subject" class="f-input" value="${escapeAttr(subject)}" maxlength="200"></div>
    <div class="f-field"><label>Message</label><textarea id="compose-body" class="f-input" style="min-height:150px"></textarea></div>
    <div class="f-field"><label>Attachment</label><input id="compose-attachment" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"></div>
  </div><div class="modal-foot"><button class="btn btn-secondary" onclick="saveInternalDraft()"><i class="far fa-file"></i> Save Draft</button><button class="btn btn-primary" onclick="sendInternalMessage()"><i class="fas fa-paper-plane"></i> Send Message</button></div></div>`);
}

function renderRecipientResults(users, selected = '') { return users.map(user => `<button type="button" data-recipient-row style="display:flex;width:100%;border:0;border-bottom:1px solid var(--gray-100);background:white;padding:9px;cursor:pointer;text-align:left" onclick="selectInternalRecipient('${escapeAttr(user.name)}','${escapeAttr(user.role)}')"><span><strong>${escapeHtml(user.name)}</strong><small style="display:block;color:var(--gray-400)">${escapeHtml(user.role)}${user.detail ? ' · ' + escapeHtml(user.detail) : ''}</small></span>${normalizeIdentity(user.name) === normalizeIdentity(selected) ? '<i class="fas fa-check" style="margin-left:auto;color:var(--success)"></i>' : ''}</button>`).join('') || '<div style="padding:12px;color:var(--gray-400)">No permitted users found</div>'; }
function filterMessageRecipients() { const query = document.getElementById('compose-recipient-search')?.value.toLowerCase() || ''; const users = permittedInternalRecipients().filter(user => `${user.name} ${user.role} ${user.detail}`.toLowerCase().includes(query)); document.getElementById('compose-recipient-results').innerHTML = renderRecipientResults(users); }
function selectInternalRecipient(name, role) { document.getElementById('compose-recipient-search').value = name; document.getElementById('compose-recipient-role').value = role; document.getElementById('compose-recipient-results').innerHTML = renderRecipientResults(permittedInternalRecipients(), name); }

async function collectInternalAttachment() { const file = document.getElementById('compose-attachment')?.files?.[0]; if (!file) return []; if (file.size > 5 * 1024 * 1024) throw new Error('Attachment must be 5 MB or smaller'); return [{ name: file.name, type: file.type, size: file.size, data: await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); }) }]; }
async function persistComposedMessage(folder) {
  const self = getMessageIdentity();
  const recipient = document.getElementById('compose-recipient-search')?.value.trim();
  const recipientUser = permittedInternalRecipients().find(user => normalizeIdentity(user.name) === normalizeIdentity(recipient));
  const body = document.getElementById('compose-body')?.value.trim();
  if (!recipientUser && folder !== 'draft') throw new Error('Select a valid permitted recipient');
  if (!body && folder !== 'draft') throw new Error('Enter a message');
  const attachments = await collectInternalAttachment();
  const subject = document.getElementById('compose-subject')?.value.trim() || '(No Subject)';
  const now = new Date();
  const message = folder === 'draft' ? {
    id: (allMessages.length ? Math.max(...allMessages.map(item => Number(item.id || 0))) : 0) + 1,
    sender: self.name, senderRole: self.role.toLowerCase(), recipient: recipientUser?.name || recipient || '',
    recipientRole: (recipientUser?.role || '').toLowerCase(), subject, text: body || '', read: true,
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), date: now.toLocaleDateString()
  } : addMessage({ sender: self.name, senderRole: self.role.toLowerCase(), recipient: recipientUser.name, recipientRole: recipientUser.role.toLowerCase(), subject, text: body });
  if (folder === 'draft') allMessages.push(message);
  message.folder = folder;
  message.attachments = attachments;
  message.createdAt = now.toISOString();
  if (recipientUser?.id && typeof API !== 'undefined' && API.messages?.send) {
    const response = await API.messages.send({ receiver_id: recipientUser.id, subject, body: body || '', status: folder === 'draft' ? 'draft' : 'sent', attachment_name: attachments[0]?.name || null, attachment_data: attachments[0]?.data || null });
    if (!response?.success) { allMessages = allMessages.filter(item => item !== message); saveAllMessages(); throw new Error(response?.message || 'Message could not be saved'); }
    message.backendId = response.id;
  }
  saveAllMessages();
  return message;
}
async function sendInternalMessage() { try { await persistComposedMessage('sent'); closeModal(); showToast('<i class="fas fa-check-circle"></i> Message sent', 'success'); messageFolder = 'sent'; renderMain(); } catch (error) { showToast(escapeHtml(error.message), 'error'); } }
async function saveInternalDraft() { try { await persistComposedMessage('draft'); closeModal(); showToast('<i class="fas fa-check-circle"></i> Draft saved', 'success'); messageFolder = 'drafts'; renderMain(); } catch (error) { showToast(escapeHtml(error.message), 'error'); } }

function messagingDashboardCard() {
  if (currentRole === 'Visitor') return '';
  const self = getMessageIdentity();
  const latest = (allMessages || []).filter(message => normalizeIdentity(message.recipient) === normalizeIdentity(self.name) && !message.receiverDeleted).sort((a, b) => Number(b.id || 0) - Number(a.id || 0))[0];
  return `<div class="card" style="margin-top:18px"><div class="card-hdr"><span class="card-title"><i class="fas fa-envelope"></i> Messages</span><span class="badge ${internalUnreadCount() ? 'b-danger' : 'b-success'}">${internalUnreadCount()} Unread</span></div>${latest ? `<div style="font-size:13px"><strong>${escapeHtml(latest.sender)}</strong><div style="margin-top:5px;color:var(--gray-500)">${escapeHtml(latest.text || latest.body || '')}</div><small style="color:var(--gray-400)">${escapeHtml(latest.date || latest.time || '')}</small></div>` : '<div style="color:var(--gray-400)">No messages yet.</div>'}<button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="navTo('messaging')">View Inbox</button></div>`;
}
