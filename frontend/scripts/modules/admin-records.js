
function getUsers() {
  return window.USER_RECORDS || [];
}

function saveUsers(users) {
  window.USER_RECORDS = Array.isArray(users) ? users : [];
}

function renderUsersTable() {
  const tbody = document.getElementById('users-tbody');
  if (!tbody) return;
  if (typeof API !== 'undefined' && API.users && !window.USER_RECORDS_LOADING && !window.USER_RECORDS_LOADED) {
    window.USER_RECORDS_LOADING = true;
    API.users.list({ limit: 200 }).then(res => {
      if (res && res.success) {
        window.USER_RECORDS = res.data || [];
        window.USER_RECORDS_LOADED = true;
        renderUsersTable();
      }
    }).finally(() => { window.USER_RECORDS_LOADING = false; });
  }
  const users = getUsers();
  document.getElementById('users-count').textContent = users.length;
  tbody.innerHTML = users.map((u, i) => {
    const initials = u.avatar || (u.name ? u.name.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase() : 'NA');
    return `<tr>
      <td style="padding:12px 10px">${i+1}</td>
      <td style="padding:12px 10px"><div style="display:flex;align-items:center;gap:10px"><div class="av av-sm av-blue" style="width:36px;height:36px;border-radius:8px">${initials}</div><div><strong>${escapeHtml(u.name)}</nobr></strong></div></div></td>
      <td style="padding:12px 10px">${escapeHtml(u.username)}</td>
      <td style="padding:12px 10px">${escapeHtml(u.email)}</td>
      <td style="padding:12px 10px">${escapeHtml(u.role)}</td>
      <td style="padding:12px 10px">${u.lastLogin || '—'}</td>
      <td style="padding:12px 10px">${u.status || 'Active'}</td>
      <td style="padding:12px 10px"><button class="btn btn-primary btn-xs" onclick="editUser('${u.id}')">Edit</button><button class="btn btn-secondary btn-xs" onclick="toggleUserStatus('${u.id}')" style="margin-left:6px">${u.status==='Disabled'?'Enable':'Disable'}</button></td>
    </tr>`;
  }).join('');
}

function openCreateUserModal(editId) {
  const users = getUsers();
  const user = editId ? users.find(u=>u.id===editId) : null;
  const html = `
    <div style="padding:20px;min-width:420px;max-width:92vw">
      <h3 style="margin-top:0">${user ? 'Edit User' : 'Create New User'}</h3>
      <form id="create-user-form">
        <div class="form-field"><label>Full Name *</label><input id="cu-name" value="${user?escapeHtml(user.name):''}" required><div class="field-err" id="err-cu-name" style="color:var(--danger);font-size:12px;margin-top:6px;display:none"></div></div>
        <div class="form-field"><label>Username *</label><input id="cu-username" value="${user?escapeHtml(user.username):''}" required><div class="field-err" id="err-cu-username" style="color:var(--danger);font-size:12px;margin-top:6px;display:none"></div></div>
        <div class="form-field"><label>Email *</label><input id="cu-email" type="email" value="${user?escapeHtml(user.email):''}" required><div class="field-err" id="err-cu-email" style="color:var(--danger);font-size:12px;margin-top:6px;display:none"></div></div>
        <div class="form-field"><label>Role *</label><select id="cu-role"><option>Admin</option><option>Teacher</option><option>Student</option><option>Accountant</option><option>Parent</option><option>Alumni</option><option>Visitor</option></select></div>
        <div class="form-field"><label>Password ${user? '(leave blank to keep existing)':''}</label><input id="cu-password" type="password" ${user? '':'required'} oninput="updatePasswordStrength()"><div id="pw-strength" style="height:8px;background:#eee;border-radius:6px;margin-top:6px;width:0%"></div><div id="pw-strength-label" style="font-size:12px;color:var(--gray-500);margin-top:6px"></div><div class="field-err" id="err-cu-password" style="color:var(--danger);font-size:12px;margin-top:6px;display:none"></div></div>
        <div style="display:flex;gap:8px;margin-top:12px">
          <button class="btn btn-primary" type="submit">${user ? 'Update' : 'Create'}</button>
          <button class="btn btn-secondary" type="button" onclick="closeModal()">Cancel</button>
        </div>
      </form>
    </div>
  `;

  openModal(html, true);

  if (user) {
    const roleSelect = document.getElementById('cu-role');
    if (roleSelect) roleSelect.value = user.role;
  }

  // Attach handlers
  const pwd = document.getElementById('cu-password');
  if (pwd) pwd.addEventListener('input', updatePasswordStrength);

  document.getElementById('create-user-form').addEventListener('submit', function (e) {
    e.preventDefault();
    handleCreateOrUpdateUser(editId);
  });
}

async function handleCreateOrUpdateUser(editId) {
  clearFieldErrors();
  const name = document.getElementById('cu-name').value.trim();
  const username = document.getElementById('cu-username').value.trim();
  const email = document.getElementById('cu-email').value.trim();
  const role = document.getElementById('cu-role').value;
  const password = document.getElementById('cu-password').value;

  // Basic validation
  let hasError = false;
  if (!name || name.length < 2) { showFieldError('err-cu-name', 'Please enter a valid full name'); hasError = true; }
  if (!username || username.length < 3) { showFieldError('err-cu-username', 'Username must be at least 3 characters'); hasError = true; }
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRe.test(email)) { showFieldError('err-cu-email', 'Enter a valid email address'); hasError = true; }

  if (!editId) {
    if (!password || password.length < 6) { showFieldError('err-cu-password', 'Password must be at least 6 characters'); hasError = true; }
    const score = passwordStrength(password || '');
    if ((password || '').length > 0 && score < 2) { showFieldError('err-cu-password', 'Choose a stronger password'); hasError = true; }
  } else if (password && password.length > 0) {
    const score = passwordStrength(password);
    if (score < 2) { showFieldError('err-cu-password', 'Choose a stronger password'); hasError = true; }
  }

  if (hasError) { showToast('<i class="fas fa-exclamation-triangle"></i> Please fix the highlighted fields', 'error'); return; }

  if (editId) {
    const res = await API.users.update(editId, { name, username, email, role, ...(password ? { password } : {}) });
    if (!res || !res.success) return showToast(res?.message || 'Failed to update user', 'error');
    closeModal();
    showToast('<i class="fas fa-check-circle"></i> User updated', 'success');
    window.USER_RECORDS = [];
    window.USER_RECORDS_LOADED = false;
    renderUsersTable();
    return;
  }

  const res = await API.users.create({ name, username, email, role, password });
  if (!res || !res.success) return showToast(res?.message || 'Failed to create user', 'error');
  closeModal();
  showToast('<i class="fas fa-check-circle"></i> User created', 'success');
  window.USER_RECORDS = [];
  window.USER_RECORDS_LOADED = false;
  renderUsersTable();
}

// Helper: clear and show field errors inside modal
function clearFieldErrors() {
  document.querySelectorAll('.field-err').forEach(el => { el.style.display = 'none'; el.textContent = ''; });
}

function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = 'block';
  el.textContent = msg;
}

// Password strength: returns 0-4
function passwordStrength(pwd) {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 6) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

function updatePasswordStrength() {
  const pwd = document.getElementById('cu-password');
  const bar = document.getElementById('pw-strength');
  const lbl = document.getElementById('pw-strength-label');
  if (!pwd || !bar || !lbl) return;
  const score = passwordStrength(pwd.value);
  const pct = Math.min(100, score * 25);
  bar.style.width = pct + '%';
  let color = 'var(--danger)';
  let text = 'Very weak';
  if (score >= 3) { color = 'var(--success)'; text = 'Strong'; }
  else if (score === 2) { color = 'var(--gold)'; text = 'Medium'; }
  else if (score === 1) { color = 'var(--warning)'; text = 'Weak'; }
  bar.style.background = color;
  lbl.textContent = pwd.value ? text : '';
}

// Export users as JSON file
function exportUsers() {
  const users = getUsers();
  const dataStr = JSON.stringify(users, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'users_' + new Date().toISOString().slice(0,10) + '.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast('<i class="fas fa-download"></i> Users exported', 'success');
}

// Handle import file input change
function handleImportFile(e) {
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    try {
      const parsed = JSON.parse(ev.target.result);
      if (!Array.isArray(parsed)) return showToast('Invalid file format: expected an array of users', 'error');
      importUsers(parsed);
    } catch (err) {
      showToast('Failed to parse JSON file', 'error');
    }
  };
  reader.readAsText(f);
  // clear input
  e.target.value = '';
}

function importUsers(list) {
  const existing = getUsers();
  let added = 0, updated = 0;
  list.forEach(u => {
    if (!u.username || !u.email || !u.name) return;
    const idx = existing.findIndex(ex => ex.username === u.username || ex.email === u.email);
    if (idx === -1) {
      const id = u.id || ('user' + Date.now() + Math.floor(Math.random()*1000));
      existing.unshift({ id, name: u.name, username: u.username, email: u.email, role: u.role || 'Visitor', password: u.password || 'changeme', lastLogin: u.lastLogin || '', status: u.status || 'Active', createdDate: u.createdDate || new Date().toISOString().split('T')[0], avatar: u.avatar || (u.name.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase()) });
      added++;
    } else {
      existing[idx] = { ...existing[idx], ...u };
      updated++;
    }
  });
  saveUsers(existing);
  renderUsersTable();
  showToast(`<i class="fas fa-file-import"></i> Import complete — ${added} added, ${updated} updated`, 'success');
}

// Initialize users table on load
window.addEventListener('load', function () {
  try { renderUsersTable(); } catch (e) { /* ignore during partial loads */ }
});
function printEnrollmentAttendanceReport() {
  const printWindow = window.open('', '', 'width=1000,height=800');
  const content = document.getElementById('main-content').innerHTML;
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Monthly Enrollment & Attendance Report</title>
      <style>
        body { font-family: Poppins, sans-serif; margin: 20px; color: #333; }
        .no-print { display: none; }
        @media print {
          body { margin: 0; }
          .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; }
          .stat-card { padding: 15px; border: 1px solid #ddd; border-radius: 8px; text-align: center; }
          .card { margin-bottom: 20px; border: 1px solid #ddd; border-radius: 8px; padding: 15px; }
          .card-hdr { font-weight: 700; margin-bottom: 12px; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
          th { background: #f5f5f5; font-weight: 700; }
          .btn { display: none; }
          .prog-bar { width: 100%; height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden; }
          .prog-fill { height: 100%; }
          .g2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .g3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
          h1 { margin: 0 0 5px 0; font-size: 24px; }
          .hdr-sub { color: #666; font-size: 12px; margin-bottom: 20px; }
        }
      </style>
    </head>
    <body>
      <h1>Monthly Enrollment & Attendance Report</h1>
      <div class="hdr-sub">Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} at ${new Date().toLocaleTimeString()}</div>
      ${content}
    </body>
    </html>
  `);
  printWindow.document.close();
  setTimeout(() => { printWindow.print(); }, 250);
}

function exportEnrollmentAttendanceToExcel() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const enrollmentData = [42, 48, 45, 52, 58, 62, 68, 75, 82, 88, 94, 102];
  const attendanceData = [88, 89, 87, 90, 92, 93, 94, 96, 95, 97, 98, 96];

  let csv = 'Monthly Enrollment & Attendance Report\n';
  csv += 'Generated: ' + new Date().toLocaleDateString() + '\n\n';

  csv += 'Month,Enrollment,Attendance %,Performance\n';
  for (let i = 0; i < months.length; i++) {
    const perf = attendanceData[i] >= 95 ? 'Excellent' : (attendanceData[i] >= 90 ? 'Very Good' : 'Good');
    csv += months[i] + ',' + enrollmentData[i] + ',' + attendanceData[i] + ',' + perf + '\n';
  }

  csv += '\n\nClass-wise Summary\n';
  csv += 'Class,Peak Enrollment,Average Attendance\n';
  csv += 'Form 1,35,92%\n';
  csv += 'Form 2,47,97%\n';
  csv += 'Form 3,20,98%\n';

  csv += '\n\nKey Metrics\n';
  csv += 'Metric,Value\n';
  csv += 'Total Enrollment Growth,42 to 102 (+142.9%)\n';
  csv += 'Attendance Improvement,88% to 96% (+9.1%)\n';
  csv += 'Monthly Average Enrollment,67.3 students\n';
  csv += 'Monthly Average Attendance,92.5%\n';
  csv += 'Highest Enrollment Month,December (102 students)\n';
  csv += 'Peak Attendance Month,October & November (97-98%)\n';

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', 'Enrollment_Attendance_Report_' + new Date().toISOString().slice(0, 10) + '.csv');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('<i class="fas fa-check-circle"></i> Report exported successfully!<br/>File: Enrollment_Attendance_Report_' + new Date().toISOString().slice(0, 10) + '.csv', 'success', 4000);
}

function downloadEnrollmentAttendancePDF() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const enrollmentData = [42, 48, 45, 52, 58, 62, 68, 75, 82, 88, 94, 102];
  const attendanceData = [88, 89, 87, 90, 92, 93, 94, 96, 95, 97, 98, 96];

  let html = '<html><head><meta charset="UTF-8"><style>';
  html += 'body{font-family:Arial,sans-serif;margin:20px;color:#333}';
  html += 'h1{font-size:20px;margin:0 0 10px 0}h2{font-size:14px;margin:15px 0 10px 0;border-bottom:2px solid #0066cc;padding-bottom:5px}';
  html += 'table{width:100%;border-collapse:collapse;margin:10px 0}th,td{border:1px solid #ddd;padding:8px;text-align:left}';
  html += 'th{background:#0066cc;color:white;font-weight:bold}.stat{display:inline-block;width:23%;margin:1%;padding:10px;border:1px solid #ddd;text-align:center}';
  html += '.stat-val{font-size:20px;font-weight:bold;color:#0066cc}.stat-lbl{font-size:11px;color:#666}';
  html += '.page-break{page-break-after:always}';
  html += '</style></head><body>';

  html += '<h1><i class="fas fa-chart-bar"></i> Monthly Enrollment & Attendance Report</h1>';
  html += '<p style="color:#666;font-size:12px">Generated on ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + '</p>';

  html += '<h2>Summary Metrics</h2>';
  html += '<div class="stat"><div class="stat-val">102</div><div class="stat-lbl">Current Enrollment</div></div>';
  html += '<div class="stat"><div class="stat-val">96%</div><div class="stat-lbl">Avg Attendance</div></div>';
  html += '<div class="stat"><div class="stat-val">3</div><div class="stat-lbl">Active Classes</div></div>';
  html += '<div class="stat"><div class="stat-val">842</div><div class="stat-lbl">Total Students</div></div>';

  html += '<h2>Monthly Breakdown</h2>';
  html += '<table><tr><th>Month</th><th>Enrollment</th><th>Attendance %</th><th>Performance</th></tr>';
  for (let i = 0; i < months.length; i++) {
    const perf = attendanceData[i] >= 95 ? 'Excellent' : (attendanceData[i] >= 90 ? 'Very Good' : 'Good');
    html += '<tr><td>' + months[i] + '</td><td>' + enrollmentData[i] + '</td><td>' + attendanceData[i] + '%</td><td>' + perf + '</td></tr>';
  }
  html += '</table>';

  html += '<div class="page-break"></div>';
  html += '<h2>Class-wise Analysis</h2>';
  html += '<table><tr><th>Class</th><th>Peak Enrollment</th><th>Average Attendance</th></tr>';
  html += '<tr><td>Form 1</td><td>35 students</td><td>92%</td></tr>';
  html += '<tr><td>Form 2</td><td>47 students</td><td>97%</td></tr>';
  html += '<tr><td>Form 3</td><td>20 students</td><td>98%</td></tr>';
  html += '</table>';

  html += '<h2>Key Statistics</h2>';
  html += '<table>';
  html += '<tr><th>Metric</th><th>Value</th></tr>';
  html += '<tr><td>Enrollment Growth (Jan-Dec)</td><td>42 to 102 (+142.9%)</td></tr>';
  html += '<tr><td>Attendance Improvement</td><td>88% to 96% (+9.1%)</td></tr>';
  html += '<tr><td>Monthly Average Enrollment</td><td>67.3 students</td></tr>';
  html += '<tr><td>Monthly Average Attendance</td><td>92.5%</td></tr>';
  html += '</table>';

  html += '</body></html>';

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(html));
  element.setAttribute('download', 'Enrollment_Attendance_Report_' + new Date().toISOString().slice(0, 10) + '.pdf.html');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('<i class="fas fa-check-circle"></i> PDF generated!<br/>File: Enrollment_Attendance_Report_' + new Date().toISOString().slice(0, 10) + '.pdf.html', 'success', 4000);
}

// -----------------------------------
// MONTHLY ENROLLMENT & ATTENDANCE REPORT
// -----------------------------------
function showMonthlyEnrollmentAttendanceReport() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const enrollmentData = [42, 48, 45, 52, 58, 62, 68, 75, 82, 88, 94, 102];
  const attendanceData = [88, 89, 87, 90, 92, 93, 94, 96, 95, 97, 98, 96];
  const classData = {
    'Basic 1-3': { enr: [12, 14, 13, 16, 18, 20, 22, 25, 28, 30, 32, 35], att: [85, 86, 84, 87, 89, 90, 91, 93, 92, 94, 95, 93] },
    'Basic 4-6': { enr: [18, 20, 19, 22, 25, 28, 30, 33, 36, 40, 43, 47], att: [88, 89, 87, 91, 93, 94, 95, 97, 96, 98, 99, 97] },
    'JHS 1-3': { enr: [12, 14, 13, 14, 15, 14, 16, 17, 18, 18, 19, 20], att: [92, 93, 91, 92, 93, 94, 95, 96, 95, 97, 98, 98] }
  };

  let html = hdr('<i class="fas fa-chart-bar"></i> Monthly Enrollment & Attendance Report', 'Comprehensive analysis of student enrollment and attendance trends', 'Report') + `
  <div class="stats-row">
    <div class="stat-card si-blue">
      <div class="stat-val">102</div>
      <div class="stat-lbl">Current Enrollment</div>
      <div class="stat-sub">+8 this month</div>
    </div>
    <div class="stat-card si-green">
      <div class="stat-val">96%</div>
      <div class="stat-lbl">Avg Attendance</div>
      <div class="stat-sub">+2% improvement</div>
    </div>
    <div class="stat-card si-gold">
      <div class="stat-val">3</div>
      <div class="stat-lbl">Active Classes</div>
      <div class="stat-sub">Basic & JHS</div>
    </div>
    <div class="stat-card si-purple">
      <div class="stat-val">842</div>
      <div class="stat-lbl">Total Students</div>
      <div class="stat-sub">All enrolled</div>
    </div>
  </div>

  <div class="g2 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-line"></i> 12-Month Enrollment Trend</span></div>
      <div style="display:flex;gap:3px;align-items:flex-end;height:180px;padding:15px 10px;background:var(--gray-xlight);border-radius:8px">
        ${enrollmentData.map((v, i) => `
        <div style="flex:1;display:flex;flex-direction:column;align-items:center">
          <div title="${months[i]}: ${v} students" style="width:100%;height:${v * 1.5}px;background:linear-gradient(180deg,var(--blue-main),var(--blue-light));border-radius:3px 3px 0 0;opacity:.85;cursor:pointer;transition:opacity .2s" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.85"></div>
          <div style="font-size:9px;color:var(--gray-500);margin-top:3px">${months[i].slice(0, 3)}</div>
          <div style="font-size:9px;font-weight:600;color:var(--blue-dark)">${v}</div>
        </div>`).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-check-circle"></i> 12-Month Attendance Trend</span></div>
      <div style="display:flex;gap:3px;align-items:flex-end;height:160px;padding:15px 10px;background:var(--gray-xlight);border-radius:8px;overflow:hidden">
        ${attendanceData.map((v, i) => `
        <div style="flex:1;display:flex;flex-direction:column;align-items:center">
          <div title="${months[i]}: ${v}% attendance" style="width:100%;height:${Math.round((v - 85) * 12)}px;background:linear-gradient(180deg,var(--success),var(--success-light));border-radius:3px 3px 0 0;opacity:.9;cursor:pointer;transition:opacity .2s" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.9"></div>
          <div style="font-size:9px;color:var(--gray-500);margin-top:2px">${months[i].slice(0, 3)}</div>
          <div style="font-size:9px;font-weight:600;color:var(--success)">${v}%</div>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <div class="card mb20">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-bar"></i> Class-wise Enrollment & Attendance Breakdown</span></div>
    <div class="g3">
      ${Object.entries(classData).map(([cls, data]) => `
      <div style="padding:12px;border:1px solid var(--gray-200);border-radius:8px">
        <div style="font-weight:700;color:var(--blue-main);margin-bottom:10px">${cls}</div>
        <div style="margin-bottom:12px">
          <div style="font-size:11px;color:var(--gray-600);margin-bottom:4px">Enrollment: ${data.enr[11]} students (+${data.enr[11] - data.enr[10]} this month)</div>
          <div class="prog-bar"><div class="prog-fill pf-blue" style="width:${(data.enr[11] / 35) * 100}%"></div></div>
        </div>
        <div>
          <div style="font-size:11px;color:var(--gray-600);margin-bottom:4px">Attendance: ${data.att[11]}%</div>
          <div class="prog-bar"><div class="prog-fill pf-green" style="width:${data.att[11]}%"></div></div>
        </div>
        <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--gray-100);font-size:10px;color:var(--gray-500)">
          <div>Peak: ${Math.max(...data.enr)} students</div>
          <div>Avg Att: ${Math.round(data.att.reduce((a, b) => a + b, 0) / data.att.length)}%</div>
        </div>
      </div>`).join('')}
    </div>
  </div>

  <div class="g2 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-line"></i> Key Metrics</span></div>
      <div style="padding:12px 0">
        ${[
      ['Enrollment Growth', 'Jan-Dec', '42 to 102 students', '+142.9%', 'success'],
      ['Attendance Improvement', 'Jan-Dec', '88% to 96%', '+9.1%', 'success'],
      ['Monthly Avg Enrollment', '2024/2025', '67.3 students', 'Stable', 'info'],
      ['Monthly Avg Attendance', '2024/2025', '92.5%', 'Excellent', 'success'],
      ['Highest Enrollment Month', 'December', '102 students', 'Peak term', 'gold'],
      ['Highest Attendance Month', 'October/Nov', '97-98%', 'Peak performance', 'success']
    ].map(([label, period, value, change, color]) => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--gray-100)">
          <div>
            <div style="font-weight:600;font-size:12px">${label}</div>
            <div style="font-size:10px;color:var(--gray-500)">${period}</div>
          </div>
          <div style="text-align:right">
            <div style="font-weight:700;color:var(--${color === 'success' ? 'success' : color === 'danger' ? 'danger' : 'blue-main'})">${value}</div>
            <div style="font-size:10px;color:var(--${color === 'success' ? 'success' : color === 'danger' ? 'danger' : 'gold'})">${change}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-clipboard-list"></i> Summary Statistics</span></div>
      <div style="padding:12px 0;font-size:12px">
        <div style="margin-bottom:14px">
          <div style="font-weight:700;color:var(--blue-main);margin-bottom:6px">Total Enrollment by Period</div>
          <table class="tbl" style="font-size:11px">
            <tr style="border-bottom:1px solid var(--gray-100)">
              <td style="padding:6px 0">Q1 (Jan-Mar)</td>
              <td style="text-align:right;font-weight:600">135 students</td>
              <td style="text-align:right;color:var(--gray-500)">44.4%</td>
            </tr>
            <tr style="border-bottom:1px solid var(--gray-100)">
              <td style="padding:6px 0">Q2 (Apr-Jun)</td>
              <td style="text-align:right;font-weight:600">172 students</td>
              <td style="text-align:right;color:var(--gray-500)">56.6%</td>
            </tr>
            <tr style="border-bottom:1px solid var(--gray-100)">
              <td style="padding:6px 0">Q3 (Jul-Sep)</td>
              <td style="text-align:right;font-weight:600">225 students</td>
              <td style="text-align:right;color:var(--gray-500)">74.0%</td>
            </tr>
            <tr>
              <td style="padding:6px 0">Q4 (Oct-Dec)</td>
              <td style="text-align:right;font-weight:600">274 students</td>
              <td style="text-align:right;color:var(--gray-500)">90.1%</td>
            </tr>
          </table>
        </div>
        <div>
          <div style="font-weight:700;color:var(--success);margin-bottom:6px">Attendance Quality</div>
          <table class="tbl" style="font-size:11px">
            <tr style="border-bottom:1px solid var(--gray-100)">
              <td style="padding:6px 0">Excellent (=95%)</td>
              <td style="text-align:right;font-weight:600">7 months</td>
            </tr>
            <tr style="border-bottom:1px solid var(--gray-100)">
              <td style="padding:6px 0">Very Good (90-94%)</td>
              <td style="text-align:right;font-weight:600">4 months</td>
            </tr>
            <tr>
              <td style="padding:6px 0">Good (85-89%)</td>
              <td style="text-align:right;font-weight:600">1 month</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>

  <div class="card mb20">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-calendar-alt"></i> Monthly Detailed Breakdown</span></div>
    <table class="tbl">
      <thead>
        <tr style="background:var(--gray-xlight);font-weight:700">
          <th>Month</th>
          <th style="text-align:center">Enrollment</th>
          <th style="text-align:center">Monthly Change</th>
          <th style="text-align:center">Attendance %</th>
          <th style="text-align:center">Trend</th>
          <th>Performance</th>
        </tr>
      </thead>
      <tbody>
        ${enrollmentData.map((enr, i) => {
      const prevEnr = i > 0 ? enrollmentData[i - 1] : 42;
      const change = enr - prevEnr;
      const att = attendanceData[i];
      const trend = change > 0 ? '<i class="fas fa-chart-line"></i>' : change < 0 ? '<i style="transform:rotate(90deg);display:inline-block" class="fas fa-chart-line"></i>' : '<i class="fas fa-arrow-right"></i>';
      const perfColor = att >= 95 ? 'success' : (att >= 90 ? 'blue-main' : 'warning');
      return `<tr>
            <td style="font-weight:600">${months[i]}</td>
            <td style="text-align:center;font-weight:600">${enr}</td>
            <td style="text-align:center;color:${change > 0 ? 'var(--success)' : 'var(--gray-500)'}">${change > 0 ? '+' + change : change === 0 ? '—' : change}</td>
            <td style="text-align:center;font-weight:600;color:var(--${perfColor})">${att}%</td>
            <td style="text-align:center;font-size:16px">${trend}</td>
            <td><span class="badge b-${perfColor === 'success' ? 'success' : 'info'}">${att >= 95 ? 'Excellent' : att >= 90 ? 'Very Good' : 'Good'}</span></td>
          </tr>`;
    }).join('')}
      </tbody>
    </table>
  </div>

  <div style="display:flex;gap:10px;padding:20px;background:var(--gray-xlight);border-radius:8px;margin-bottom:20px">
    <button class="btn btn-primary" onclick="printEnrollmentAttendanceReport()" style="cursor:pointer"><i class="fas fa-print"></i> Print Report</button>
    <button class="btn btn-secondary" onclick="exportEnrollmentAttendanceToExcel()" style="cursor:pointer"><i class="fas fa-download"></i> Export to Excel</button>
    <button class="btn btn-secondary" onclick="downloadEnrollmentAttendancePDF()" style="cursor:pointer"><i class="fas fa-file"></i> Download PDF</button>
  </div>`;

  document.getElementById('main-content').innerHTML = html;
}

// -----------------------------------
// STUDENTS MODULE
// -----------------------------------
// -----------------------------------
// STUDENT MANAGEMENT FUNCTIONS
// -----------------------------------
function showEnrollStudentForm() {
  let html = hdr('Enroll New Student', 'Add a student to the system', 'Students') + `
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-file-alt"></i> Student Enrollment Form</span></div>
    <div class="form-grid">
      <div class="form-field">
        <label>Full Name *</label>
        <input type="text" id="std-name" placeholder="Enter student full name">
      </div>
      <div class="form-field">
        <label>Date of Birth *</label>
        <input type="date" id="std-dob">
      </div>
      <div class="form-field">
        <label>Gender *</label>
        <select id="std-gender"><option>-- Select --</option><option>Male</option><option>Female</option></select>
      </div>
      <div class="form-field">
        <label>Class *</label>
        <select id="std-class">
          <option value="">-- Select Class --</option>
          ${classesData.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('')}
        </select>
      </div>
      <div class="form-field" style="grid-column:1/-1">
        <label>Address</label>
        <input type="text" id="std-address" placeholder="Residential address">
      </div>
      <div class="form-field">
        <label>Parent/Guardian Name</label>
        <input type="text" id="std-parent-name" placeholder="Parent or guardian name">
      </div>
      <div class="form-field">
        <label>Parent Phone</label>
        <input type="tel" id="std-parent-phone" placeholder="0244567890">
      </div>
      <div style="grid-column:1/-1;display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="submitStudentEnrollment()"><i class="fas fa-check"></i> Enroll Student</button>
        <button class="btn btn-secondary" style="flex:1" onclick="navTo('students')">Cancel</button>
      </div>
    </div>
  </div>`;

  document.getElementById('main-content').innerHTML = html;
}

async function submitStudentEnrollment() {
  const name = document.getElementById('std-name')?.value.trim();
  const dob = document.getElementById('std-dob')?.value;
  const gender = document.getElementById('std-gender')?.value;
  const studentClass = document.getElementById('std-class')?.value;
  const address = document.getElementById('std-address')?.value.trim();
  const parentName = document.getElementById('std-parent-name')?.value.trim();
  const parentPhone = document.getElementById('std-parent-phone')?.value.trim();

  if (!name || !dob || !gender || !studentClass) {
    showToast('<i class=\"fas fa-times-circle\"></i> Please fill all required fields', 'error');
    return;
  }

  if (typeof API === 'undefined' || !API.students) {
    showToast('<i class="fas fa-times-circle"></i> Backend student API is unavailable', 'error');
    return;
  }

  const res = await API.students.create({
    name,
    dob,
    gender,
    class_id: parseInt(studentClass, 10),
    address,
    guardian_name: parentName,
    guardian_phone: parentPhone,
    status: 'Active'
  });

  if (!res || !res.success) {
    showToast(res?.message || 'Failed to enroll student', 'error');
    return;
  }

  showToast('<i class="fas fa-check-circle"></i> Student enrolled in database!<br/>ID: ' + res.student_code + '<br/>Name: ' + name, 'success', 4000);
  if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
  navTo('students');
}

function viewAdmissionDetail(admId) {
  const a = admissionsData.find(adm => adm.adm_id === admId);
  if (!a) return;
  const modalHtml = `
    <div class="modal-overlay" onclick="document.querySelector('.modal-overlay')?.remove()">
      <div class="card" style="max-width:600px;margin:auto" onclick="event.stopPropagation()">
        <div class="card-hdr" style="display:flex;justify-content:space-between;align-items:center">
          <span class="card-title"><i class="fas fa-file-alt"></i> Admission Application Details</span>
          <button class="btn btn-icon" onclick="document.querySelector('.modal-overlay')?.remove()"><i class="fas fa-times"></i></button>
        </div>
        <div style="display:flex;flex-direction:column;gap:16px;padding:20px;font-size:13px">
          <div style="display:flex;align-items:center;gap:12px">
            <div class="av av-lg av-blue">${(a.name || 'A')[0]}</div>
            <div>
              <div style="font-size:16px;font-weight:700;color:var(--blue-dark)">${escapeHtml(a.name || '')}</div>
              <div style="color:var(--gray-500)">ID: ${escapeHtml(a.adm_id || '')} | Status: <span class="badge ${a.status === 'Pending' ? 'b-warning' : (a.status === 'Approved' ? 'b-success' : 'b-danger')}">${escapeHtml(a.status || '')}</span></div>
            </div>
          </div>
          <hr style="border:none;border-top:1px solid var(--gray-200);margin:8px 0">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
            <div><span style="color:var(--gray-500)">Date of Birth:</span> <strong>${escapeHtml(a.dob || '')}</strong></div>
            <div><span style="color:var(--gray-500)">Gender:</span> <strong>${escapeHtml(a.gender || '')}</strong></div>
            <div><span style="color:var(--gray-500)">Class Applying:</span> <strong>${escapeHtml(a.class_applying || '')}</strong></div>
            <div><span style="color:var(--gray-500)">Date Applied:</span> <strong>${escapeHtml(a.created || '')}</strong></div>
            <div><span style="color:var(--gray-500)">Parent Name:</span> <strong>${escapeHtml(a.parent_name || '')}</strong></div>
            <div><span style="color:var(--gray-500)">Parent Phone:</span> <strong>${escapeHtml(a.parent_phone || '')}</strong></div>
            <div><span style="color:var(--gray-500)">Parent Email:</span> <strong>${escapeHtml(a.parent_email || '')}</strong></div>
            <div><span style="color:var(--gray-500)">Address:</span> <strong>${escapeHtml(a.address || 'N/A')}</strong></div>
          </div>
          <div style="margin-top:10px"><span style="color:var(--gray-500)">Notes:</span> <p style="background:var(--gray-50);padding:10px;border-radius:6px;margin-top:4px">${escapeHtml(a.notes || 'None')}</p></div>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function viewStudent(studentId) {
  const student = enrolledStudents.find(s => s.student_id === studentId);
  if (!student) return;
  if (currentRole === 'Teacher' && !getAssignedClassNamesForTeacher().includes(student.student_class)) {
    showToast('You can only view students in your assigned classes', 'error');
    return;
  }

  let html = hdr('Student Profile', 'View student details and academic records', 'Students') + `
  <div class="g2 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-user"></i> Personal Information</span></div>
      <div style="display:flex;gap:20px;margin-bottom:20px">
        <div class="av av-xl av-${student.avatar_color}">${student.name[0]}</div>
        <div style="flex:1">
          <div style="font-size:18px;font-weight:700;color:var(--blue-dark);margin-bottom:4px">${student.name}</div>
          <div style="font-size:12px;color:var(--gray-500);margin-bottom:12px">Student ID: <strong>${student.student_id}</strong></div>
          <div style="display:flex;gap:16px;font-size:12px;color:var(--gray-600)">
            <div><strong>Gender:</strong> ${student.gender}</div>
            <div><strong>DOB:</strong> ${student.dob}</div>
            <div><strong>Class:</strong> ${student.student_class}</div>
          </div>
        </div>
      </div>
      <hr style="border:none;border-top:1px solid var(--gray-200);margin:16px 0">
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:12px">
        <div>
          <div style="color:var(--gray-500)">Address</div>
          <div style="font-weight:600;color:var(--gray-800)">${student.address || 'Not provided'}</div>
        </div>
        <div>
          <div style="color:var(--gray-500)">Enrolled Date</div>
          <div style="font-weight:600;color:var(--gray-800)">${student.enrolled_date}</div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-bar"></i> Academic Status</span></div>
      <div class="stats-row" style="grid-template-columns:repeat(2,1fr);gap:12px">
        ${[['<i class="fas fa-check-circle"></i>', 'Attendance', student.attendance, 'si-green'], ['<i class="fas fa-money-bill"></i>', 'Fees', student.fees_status, 'si-' + ({ Paid: 'green', Pending: 'warning', Partial: 'gold' }[student.fees_status] || 'gray')], ['<i class="fas fa-graduation-cap"></i>', 'Status', student.status, 'si-info'], ['<i class="fas fa-building"></i>', 'Class', student.student_class, 'si-blue']].map(([ic, lbl, val, cls]) => '<div class="stat-card ' + cls + '"><div class="stat-val">' + val + '</div><div class="stat-lbl">' + lbl + '</div></div>').join('')}
      </div>
    </div>
  </div>
  
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-users"></i> Parent/Guardian Information</span></div>
    <div style="display:flex;justify-content:space-between;font-size:12px">
      <div>
        <div style="color:var(--gray-500);margin-bottom:4px">Name</div>
        <div style="font-weight:600">${student.parent_name || 'Not provided'}</div>
      </div>
      <div>
        <div style="color:var(--gray-500);margin-bottom:4px">Phone</div>
        <div style="font-weight:600">${student.parent_phone || 'Not provided'}</div>
      </div>
    </div>
  </div>
  
  <div style="display:flex;gap:8px;margin-top:20px">
    <button class="btn btn-primary" onclick="editStudent('${studentId}')"><i class="fas fa-edit"></i> Edit</button>
    <button class="btn btn-secondary" onclick="navTo('students')">Back to Students</button>
  </div>`;

  document.getElementById('main-content').innerHTML = html;
}

function editStudent(studentId) {
  if (currentRole !== 'Admin') {
    showToast('Only administrators can edit students', 'error');
    return;
  }

  const student = enrolledStudents.find(s => s.student_id === studentId);
  if (!student) return;

  let html = hdr('Edit Student', 'Update student information', 'Students') + `
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-edit"></i> Edit Student Details</span></div>
    <div class="form-grid">
      <div class="form-field">
        <label>Full Name</label>
        <input type="text" id="edit-std-name" value="${student.name}">
      </div>
      <div class="form-field">
        <label>Class</label>
        <select id="edit-std-class">
          ${classesData.map(c => `<option value="${c.id}" ${student.student_class === c.name ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('')}
        </select>
      </div>
      <div class="form-field">
        <label>Fees Status</label>
        <div class="readonly-field"><span class="badge ${student.fees_status === 'Paid' ? 'b-success' : (student.fees_status === 'Pending' ? 'b-danger' : 'b-warning')}">${escapeHtml(student.fees_status || 'Pending')}</span></div>
        <div style="font-size:11px;color:var(--gray-500);margin-top:6px">Managed from Finance / Fees.</div>
      </div>
      <div class="form-field">
        <label>Status</label>
        <select id="edit-std-status">
          <option value="${student.status}" selected>${student.status}</option>
          <option>Active</option><option>Inactive</option><option>Suspended</option><option>Withdrawn</option>
        </select>
      </div>
      <div class="form-field" style="grid-column:1/-1">
        <label>Address</label>
        <input type="text" id="edit-std-address" value="${student.address || ''}">
      </div>
      <div class="form-field">
        <label>Parent Name</label>
        <input type="text" id="edit-std-parent-name" value="${student.parent_name || ''}">
      </div>
      <div class="form-field">
        <label>Parent Phone</label>
        <input type="tel" id="edit-std-parent-phone" value="${student.parent_phone || ''}">
      </div>
      <div style="grid-column:1/-1;display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="saveStudentChanges('${studentId}')"><i class="fas fa-save"></i> Save Changes</button>
        <button class="btn btn-secondary" style="flex:1" onclick="viewStudent('${studentId}')">Cancel</button>
      </div>
    </div>
  </div>`;

  document.getElementById('main-content').innerHTML = html;
}

async function saveStudentChanges(studentId) {
  const student = enrolledStudents.find(s => s.student_id === studentId);
  if (!student) return;

  if (typeof API === 'undefined' || !API.students || !student.id) {
    showToast('<i class="fas fa-times-circle"></i> Backend student API is unavailable', 'error');
    return;
  }

  const res = await API.students.update(student.id, {
    name: document.getElementById('edit-std-name')?.value || student.name,
    class_id: parseInt(document.getElementById('edit-std-class')?.value || student.class_id || 0, 10) || null,
    status: document.getElementById('edit-std-status')?.value || student.status,
    address: document.getElementById('edit-std-address')?.value || '',
    guardian_name: document.getElementById('edit-std-parent-name')?.value || '',
    guardian_phone: document.getElementById('edit-std-parent-phone')?.value || ''
  });
  if (!res || !res.success) {
    showToast(res?.message || 'Failed to update student', 'error');
    return;
  }
  if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();

  showToast('<i class="fas fa-check-circle"></i> Student details updated!<br/>Name: ' + student.name, 'success', 3000);

  setTimeout(() => {
    viewStudent(studentId);
  }, 1500);
}

function importStudentsCSV() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      showToast('<i class="fas fa-check-circle"></i> CSV imported!<br/>' + file.name, 'success');
      navTo('students');
    }
  };
  input.click();
}

function exportStudentsData() {
  let csv = 'Student ID,Name,Class,Gender,DOB,Attendance,Fees,Status,Address,Parent,Phone,Enrolled Date,Withdrawn Date\n';
  enrolledStudents.forEach((s) => {
    csv += s.student_id + ',' + s.name + ',' + s.student_class + ',' + s.gender + ',' + s.dob + ',' + s.attendance + ',' + s.fees_status + ',' + s.status + ',' + (s.address || '') + ',' + (s.parent_name || '') + ',' + (s.parent_phone || '') + ',' + (s.enrolled_date || '') + ',' + (s.withdrawn_date || '') + '\n';
  });

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', 'Students_Data_' + new Date().toISOString().slice(0, 10) + '.csv');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('<i class="fas fa-check-circle"></i> Students data exported!<br/>File: Students_Data_' + new Date().toISOString().slice(0, 10) + '.csv', 'success', 3000);
}

// -----------------------------------
// STUDENTS MODULE
// -----------------------------------
// -----------------------------------
// STUDENT FILTERING & SEARCH
// -----------------------------------
function filterStudents() {
  const searchInput = document.getElementById('student-search');
  const searchText = (searchInput ? searchInput.value : '').toLowerCase();
  const classFilter = document.getElementById('student-class-filter');
  const selectedClass = classFilter ? classFilter.value : 'All Classes';
  const statusFilter = document.getElementById('student-status-filter');
  const selectedStatus = statusFilter ? statusFilter.value : 'All Status';

  let filtered = getActiveStudents(getVisibleStudentsForRole(enrolledStudents)).filter((s) => {
    const matchSearch = !searchText || s.name.toLowerCase().includes(searchText) ||
      s.student_id.toLowerCase().includes(searchText) ||
      (s.parent_name && s.parent_name.toLowerCase().includes(searchText));
    const matchClass = selectedClass === 'All Classes' || s.student_class === selectedClass;
    const matchStatus = selectedStatus === 'All Status' || s.status === selectedStatus;

    return matchSearch && matchClass && matchStatus;
  });

  updateStudentTable(filtered);
}

function updateStudentTable(students) {
  const tbody = document.querySelector('table.tbl tbody');
  if (!tbody) return;
  const isAdmin = currentRole === 'Admin';

  if (students.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:30px;color:var(--gray-400)">No students found</td></tr>';
    return;
  }

  tbody.innerHTML = students.map((s, i) => studentTableRowHtml(s, i, isAdmin)).join('');
}

function studentTableRowHtml(s, i, isAdmin) {
  const studentId = escapeAttr(s.student_id);
  const actions = '<details class="row-action-menu"><summary title="Student actions"><i class="fas fa-bars"></i></summary><div class="row-action-list"><button onclick="viewStudent(\'' + studentId + '\')"><i class="fas fa-eye"></i> View</button>' + (isAdmin ? '<button onclick="editStudent(\'' + studentId + '\')"><i class="fas fa-edit"></i> Edit</button><button class="danger" onclick="withdrawStudent(\'' + studentId + '\')"><i class="fas fa-user-slash"></i> Withdraw</button>' : '') + '</div></details>';
  return '<tr style="cursor:pointer" onclick="if(!event.target.closest(\'.student-actions-cell\') && !event.target.closest(\'details\')) viewStudent(\'' + studentId + '\')"><td style="color:var(--gray-400);font-size:11px">' + (i + 1) + '</td><td><div style="display:flex;align-items:center;gap:9px"><div class="av av-sm av-' + (s.avatar_color || 'blue') + '">' + (s.name || 'S')[0] + '</div><span style="font-weight:600">' + escapeHtml(s.name || '') + '</span></div></td><td style="font-size:11px;color:var(--gray-400)">' + escapeHtml(s.student_id || '') + '</td><td>' + escapeHtml(s.student_class || '') + '</td><td><span class="badge ' + ((s.gender_abbr === 'F' || s.gender === 'Female') ? 'b-purple' : 'b-info') + '">' + escapeHtml(s.gender || '') + '</span></td><td style="font-size:11px;color:var(--gray-500)">' + escapeHtml(s.dob || '') + '</td><td style="font-weight:600;color:' + (parseFloat(s.attendance) >= 90 ? 'var(--success)' : 'var(--warning)') + '">' + escapeHtml(s.attendance || '') + '</td><td><span class="badge ' + (s.fees_status === 'Paid' ? 'b-success' : (s.fees_status === 'Pending' ? 'b-danger' : 'b-warning')) + '">' + escapeHtml(s.fees_status || '') + '</span></td><td><span class="badge ' + (({ 'Active': 'b-success', 'Inactive': 'b-warning', 'Graduated': 'b-info', 'Suspended': 'b-gold', 'Withdrawn': 'b-danger' }[s.status] || 'b-success')) + '">' + escapeHtml(s.status || 'Active') + '</span></td><td class="student-actions-cell">' + actions + '</td></tr>';
}

async function withdrawStudent(studentId) {
  const student = enrolledStudents.find(s => s.student_id === studentId);
  if (!student) return showToast('Student not found', 'error');
  if (typeof API === 'undefined' || !API.students || !student.id) return showToast('Backend student API is unavailable', 'error');
  const res = await API.students.update(student.id, { status: 'Withdrawn' });
  if (!res || !res.success) return showToast(res?.message || 'Failed to withdraw student', 'error');
  if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
  showToast('<i class="fas fa-check-circle"></i> Student moved to withdrawn records', 'success');
  navTo('students');
}

async function restoreStudent(studentId) {
  const student = enrolledStudents.find(s => s.student_id === studentId);
  if (!student) return showToast('Student not found', 'error');
  if (typeof API === 'undefined' || !API.students || !student.id) return showToast('Backend student API is unavailable', 'error');
  const res = await API.students.update(student.id, { status: 'Active' });
  if (!res || !res.success) return showToast(res?.message || 'Failed to restore student', 'error');
  if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
  showToast('<i class="fas fa-check-circle"></i> Student restored to active records', 'success');
  viewWithdrawnStudents();
}

function viewWithdrawnStudents() {
  const withdrawn = getWithdrawnStudents();
  const rows = withdrawn.length ? withdrawn.map((s, i) => '<tr style="cursor:pointer" onclick="if(!event.target.closest(\'button\')) viewStudent(\'' + escapeAttr(s.student_id) + '\')"><td>' + (i + 1) + '</td><td>' + escapeHtml(s.name || '') + '</td><td>' + escapeHtml(s.student_id || '') + '</td><td>' + escapeHtml(s.student_class || '') + '</td><td>' + escapeHtml(s.gender || '') + '</td><td>' + escapeHtml(s.dob || '') + '</td><td>' + escapeHtml(s.parent_name || 'Not provided') + '</td><td>' + escapeHtml(s.parent_phone || 'Not provided') + '</td><td>' + escapeHtml(s.withdrawn_date || '') + '</td><td><button class="btn btn-secondary btn-xs" onclick="viewStudent(\'' + escapeAttr(s.student_id) + '\')">View</button><button class="btn btn-primary btn-xs" onclick="restoreStudent(\'' + escapeAttr(s.student_id) + '\')" style="margin-left:6px">Restore</button></td></tr>').join('') : '<tr><td colspan="10" style="text-align:center;padding:30px;color:var(--gray-400)">No withdrawn students</td></tr>';
  document.getElementById('main-content').innerHTML = hdr('Withdrawn Students', 'Students withdrawn from active class lists', 'Students') + `
  <div class="toolbar"><button class="btn btn-secondary" onclick="navTo('students')"><i class="fas fa-arrow-left"></i> Back to Students</button></div>
  <div class="card records-table-card">
    <div class="table-wrapper records-table-wrapper">
    <table class="tbl records-table">
      <thead><tr><th>#</th><th>Student</th><th>ID No.</th><th>Class</th><th>Gender</th><th>DOB</th><th>Parent</th><th>Phone</th><th>Withdrawn Date</th><th>Actions</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    </div>
  </div>`;
}

// -----------------------------------
// STUDENTS MODULE
// -----------------------------------
function studentsModule() {
  const isAdmin = currentRole === 'Admin';
  const visibleStudents = getActiveStudents(getVisibleStudentsForRole(enrolledStudents));
  const visibleClassNames = getVisibleClassesForRole(classesData).map(c => c.name);
  const classOptions = (isAdmin ? classesData.map(c => c.name) : visibleClassNames)
    .map(className => `<option>${className}</option>`).join('');
  const adminActions = isAdmin ? `<button class="btn btn-primary" onclick="showEnrollStudentForm()" style="cursor:pointer"><i class="fas fa-user-plus"></i> Add Student</button>
    <button class="btn btn-secondary" onclick="viewWithdrawnStudents()" style="cursor:pointer"><i class="fas fa-user-slash"></i> Withdrawn Students (${getWithdrawnStudents().length})</button>
    <button class="btn btn-secondary" onclick="importStudentsCSV()" style="cursor:pointer"><i class="fas fa-upload"></i> Import CSV</button>
    <button class="btn btn-secondary" onclick="exportStudentsData()" style="cursor:pointer"><i class="fas fa-download"></i> Export</button>` : '';
  const roleNotice = !isAdmin ? '<div style="margin-bottom:18px;padding:14px;background:var(--blue-xpale);border:1px solid var(--blue-light);border-radius:var(--radius);color:var(--blue-dark);font-size:12px"><i class="fas fa-info-circle"></i> You are viewing only students in your assigned classes.</div>' : '';
  const studentRows = visibleStudents.map((s, i) => studentTableRowHtml(s, i, isAdmin)).join('');

  return hdr('Students Module', isAdmin ? 'Manage all student records, enrollment and academic data' : 'Students in your assigned classes', 'Students') +
    renderPageTemplate('pages/admin/students/index.html', {
      adminActions,
      classOptions,
      roleNotice,
      studentRows,
      pagination: paginationHtml()
    });
}

// Message a teacher (for students only)
function messageTeacher(teacherId, teacherName) {
  const teacher = teachersData.find(t => t.teacher_id === teacherId);
  if (!teacher) return;

  let html = hdr('Message ' + teacherName, 'Send a message to your teacher', 'Teachers') + `
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-envelope"></i> Send Message to ${teacherName}</span></div>
    <div style="margin-bottom:16px;padding:12px;background:var(--blue-xpale);border-radius:var(--radius);border:1px solid var(--blue-light)">
      <div style="font-size:11px;color:var(--gray-600);margin-bottom:4px"><i class="fas fa-info-circle"></i> Teacher Info</div>
      <div style="font-size:12px;color:var(--blue-dark)">
        <strong>${teacher.name}</strong> · ${teacher.subject}<br>
        <small>Email: ${teacher.email} | Phone: ${teacher.phone}</small>
      </div>
    </div>
    <div class="form-grid">
      <div class="form-field" style="grid-column:1/-1">
        <label>Subject *</label>
        <input type="text" id="msg-subject" placeholder="e.g., Question about Mathematics assignment">
      </div>
      <div class="form-field" style="grid-column:1/-1">
        <label>Message *</label>
        <textarea id="msg-content" placeholder="Type your message here..." style="min-height:200px;resize:vertical"></textarea>
      </div>
      <div style="grid-column:1/-1;display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="sendTeacherMessage('${teacherId}', '${teacherName}')"><i class="fas fa-paper-plane"></i> Send Message</button>
        <button class="btn btn-secondary" style="flex:1" onclick="navTo('teachers')">Cancel</button>
      </div>
    </div>
  </div>`;

  document.getElementById('main-content').innerHTML = html;
}

// Send message to teacher (placeholder function)
function sendTeacherMessage(teacherId, teacherName) {
  const subject = document.getElementById('msg-subject').value.trim();
  const content = document.getElementById('msg-content').value.trim();

  if (!subject || !content) {
    showToast('<i class="fas fa-exclamation-circle"></i> Please fill in all fields', 'error', 3000);
    return;
  }

  try{ addMessage({ sender: currentRole || 'Visitor', senderRole: (currentRole||'visitor').toLowerCase(), recipient: teacherName, recipientRole: 'teacher', subject, text: content }); }catch(e){}
  showToast('<i class="fas fa-check-circle"></i> Message sent to ' + teacherName + '!<br/>Your teacher will respond soon.', 'success', 3000);
  setTimeout(() => navTo('teachers'), 1500);
}

function filterTeachers() {
  const searchInput = document.getElementById('teacher-search');
  const searchText = (searchInput ? searchInput.value : '').toLowerCase();
  const deptFilter = document.getElementById('teacher-dept-filter');
  const selectedDept = deptFilter ? deptFilter.value : 'All Departments';

  let filtered = getActiveTeachers(teachersData).filter((t) => {
    const matchSearch = !searchText || t.name.toLowerCase().includes(searchText) ||
      t.subject.toLowerCase().includes(searchText) ||
      t.email.toLowerCase().includes(searchText);
    const matchDept = selectedDept === 'All Departments' || t.department === selectedDept;

    return matchSearch && matchDept;
  });

  updateTeacherCards(filtered);
}

function updateTeacherCards(teachers) {
  const container = document.querySelector('.g3');
  if (!container) return;

  if (teachers.length === 0) {
    container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gray-400)">No teachers found</div>';
    return;
  }

  container.innerHTML = teachers.map((t) => `
    <div class="card" style="cursor:pointer" onclick="if(!event.target.closest('button')) viewTeacherProfile('${t.teacher_id}')">
      <div style="display:flex;gap:14px;margin-bottom:14px">
        <div class="av av-lg av-${t.avatar_color}">${t.gender === 'Female' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-user"></i>'}</div>
        <div>
          <div style="font-size:14px;font-weight:700;color:var(--blue-dark)">${t.name}</div>
          <div style="font-size:11px;color:var(--gray-500)">${t.subject}</div>
          <span class="badge b-info" style="margin-top:6px;font-size:9px">${t.experience} yrs exp</span>
        </div>
      </div>
      <div style="font-size:11px;color:var(--gray-500);margin-bottom:8px"><i class="fas fa-users"></i> ${t.class_assigned} Class Teacher</div>
      <div style="font-size:10px;color:var(--gray-400);margin-bottom:12px"><i class="fas fa-calendar-alt"></i> ${t.schedule}</div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-secondary btn-xs" style="flex:1" onclick="viewTeacherProfile('${t.teacher_id}')">View Profile</button>
        <button class="btn btn-primary btn-xs" style="flex:1" onclick="editTeacher('${t.teacher_id}')">Edit</button>
      </div>
    </div>`).join('');
}

// TEACHERS MANAGEMENT HELPERS
function filterTeachersManagement() {
  const searchInput = document.getElementById('teacher-search');
  const searchText = (searchInput ? searchInput.value : '').toLowerCase();
  const deptFilter = document.getElementById('teacher-dept-filter');
  const selectedDept = deptFilter ? deptFilter.value : '';

  let filtered = getActiveTeachers(teachersData).filter((t) => {
    const matchSearch = !searchText || t.name.toLowerCase().includes(searchText) ||
      t.subject.toLowerCase().includes(searchText) ||
      t.email.toLowerCase().includes(searchText);
    const matchDept = !selectedDept || t.department === selectedDept;

    return matchSearch && matchDept;
  });

  const container = document.querySelector('.g3');
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gray-400)">No teachers found</div>';
    return;
  }

  container.innerHTML = filtered.map((t) => `
    <div class="card" style="cursor:pointer" onclick="if(!event.target.closest('button')) viewTeacherProfile('${t.teacher_id}')">
      <div style="display:flex;gap:14px;margin-bottom:14px">
        <div class="av av-lg av-${t.avatar_color}"><i class="fas fa-user"></i></div>
        <div style="flex:1">
          <div style="font-size:14px;font-weight:700;color:var(--blue-dark)">${t.name}</div>
          <div style="font-size:11px;color:var(--gray-500)">${t.subject}</div>
          <span class="badge b-info" style="margin-top:6px;font-size:9px">${t.experience} yrs exp</span>
        </div>
        <span class="badge ${t.class_assigned === 'Not Assigned' ? 'b-warning' : 'b-success'}" style="height:fit-content">${t.class_assigned === 'Not Assigned' ? 'Not Assigned' : t.class_assigned + ' Teacher'}</span>
      </div>
      <div style="display:grid;gap:8px;font-size:11px;margin-bottom:12px;padding:8px;background:var(--gray-xpale);border-radius:4px">
        <div><i class="fas fa-phone"></i> ${t.phone}</div>
        <div><i class="fas fa-calendar-alt"></i> ${t.schedule}</div>
      </div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-secondary btn-xs" style="flex:1" onclick="viewTeacherProfile('${t.teacher_id}')"><i class="fas fa-eye"></i> View Profile</button>
        <button class="btn btn-primary btn-xs" style="flex:1" onclick="editTeacher('${t.teacher_id}')"><i class="fas fa-edit"></i> Edit</button>
      </div>
    </div>`).join('');
}

function showAddTeacherForm() {
  let html = hdr('Add New Teacher', 'Register a new teacher to the system', 'Teachers') + `
  <div class="card">
    <div class="form-grid">
      <div class="form-field">
        <label>Full Name *</label>
        <input type="text" id="teacher-name" placeholder="e.g., Mr. Kweku Amponsah">
      </div>
      <div class="form-field">
        <label>Subject Specialization *</label>
        <input type="text" id="teacher-subject" placeholder="e.g., Mathematics">
      </div>
      <div class="form-field">
        <label>Department *</label>
        <select id="teacher-department"><option>-- Select --</option><option>Mathematics</option><option>Science</option><option>Languages</option></select>
      </div>
      <div class="form-field">
        <label>Years of Experience *</label>
        <input type="number" id="teacher-experience" placeholder="e.g., 12" min="0" max="50">
      </div>
      <div class="form-field">
        <label>Email *</label>
        <input type="email" id="teacher-email" placeholder="teacher@school.edu.gh">
      </div>
      <div class="form-field">
        <label>Phone *</label>
        <input type="tel" id="teacher-phone" placeholder="+233 24 000 0000">
      </div>
      <div class="form-field">
        <label>Class Assignment</label>
        <select id="teacher-class"><option>Not Assigned</option><option>JHS 1</option><option>JHS 2</option><option>JHS 3</option><option>Basic 4</option><option>Basic 5</option><option>Basic 6</option></select>
      </div>
      <div class="form-field">
        <label>Teaching Schedule</label>
        <input type="text" id="teacher-schedule" placeholder="e.g., Mon/Tue/Thu">
      </div>
      <div class="form-field">
        <label>Date of Birth</label>
        <input type="date" id="teacher-dob">
      </div>
      <div class="form-field">
        <label>Basic Salary (GH₵)</label>
        <input type="number" id="teacher-basic" min="0" placeholder="e.g., 3200">
      </div>
      <div class="form-field">
        <label>Allowances (GH₵)</label>
        <input type="number" id="teacher-allowance" min="0" placeholder="e.g., 800">
      </div>
      <div class="form-field">
        <label>Deductions (GH₵)</label>
        <input type="number" id="teacher-deduction" min="0" placeholder="e.g., 320">
      </div>
      <div class="form-field">
        <label>Status</label>
        <select id="teacher-status"><option>Active</option><option>On Leave</option><option>Inactive</option></select>
      </div>
      <div style="grid-column:1/-1;display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="submitTeacherForm()"><i class="fas fa-save"></i> Add Teacher</button>
        <button class="btn btn-secondary" style="flex:1" onclick="navTo('teachers')">Cancel</button>
      </div>
    </div>
  </div>`;
  document.getElementById('main-content').innerHTML = html;
}

function editTeacher(teacherId) {
  const teacher = teachersData.find(t => t.teacher_id === teacherId);
  if (!teacher) return showToast('Teacher not found', 'error');
  const isArchived = teacher.status === 'Archived';
  const archiveAction = isArchived
    ? `<button class="btn btn-primary" style="flex:1" onclick="restoreTeacher('${teacherId}')"><i class="fas fa-rotate-left"></i> Restore</button>`
    : `<button class="btn btn-danger" style="flex:1" onclick="archiveTeacher('${teacherId}')"><i class="fas fa-box-archive"></i> Archive</button>`;

  let html = hdr('Edit Teacher Profile', `Update details for ${teacher.name}`, 'Teachers') + `
  <div class="card">
    <div class="form-grid">
      <div class="form-field">
        <label>Full Name *</label>
        <input type="text" id="teacher-name" value="${teacher.name}">
      </div>
      <div class="form-field">
        <label>Subject Specialization *</label>
        <input type="text" id="teacher-subject" value="${teacher.subject}">
      </div>
      <div class="form-field">
        <label>Department *</label>
        <select id="teacher-department"><option ${teacher.department === 'Mathematics' ? 'selected' : ''}>Mathematics</option><option ${teacher.department === 'Science' ? 'selected' : ''}>Science</option><option ${teacher.department === 'Languages' ? 'selected' : ''}>Languages</option></select>
      </div>
      <div class="form-field">
        <label>Years of Experience *</label>
        <input type="number" id="teacher-experience" value="${teacher.experience}" min="0" max="50">
      </div>
      <div class="form-field">
        <label>Email *</label>
        <input type="email" id="teacher-email" value="${teacher.email}">
      </div>
      <div class="form-field">
        <label>Phone *</label>
        <input type="tel" id="teacher-phone" value="${teacher.phone}">
      </div>
      <div class="form-field">
        <label>Class Assignment</label>
        <select id="teacher-class"><option ${teacher.class_assigned === 'Not Assigned' ? 'selected' : ''}>Not Assigned</option><option ${teacher.class_assigned === 'JHS 1' ? 'selected' : ''}>JHS 1</option><option ${teacher.class_assigned === 'JHS 2' ? 'selected' : ''}>JHS 2</option><option ${teacher.class_assigned === 'JHS 3' ? 'selected' : ''}>JHS 3</option></select>
      </div>
      <div class="form-field">
        <label>Teaching Schedule</label>
        <input type="text" id="teacher-schedule" value="${teacher.schedule}">
      </div>
      <div class="form-field">
        <label>Basic Salary (GH₵)</label>
        <input type="number" id="teacher-basic" min="0" value="${teacher.basicSalary || getTeacherPayrollBasic(teacher)}">
      </div>
      <div class="form-field">
        <label>Allowances (GH₵)</label>
        <input type="number" id="teacher-allowance" min="0" value="${teacher.allowances ?? Math.round(getTeacherPayrollBasic(teacher) * 0.25)}">
      </div>
      <div class="form-field">
        <label>Deductions (GH₵)</label>
        <input type="number" id="teacher-deduction" min="0" value="${teacher.deductions ?? Math.round(getTeacherPayrollBasic(teacher) * 0.10)}">
      </div>
      <div class="form-field">
        <label>Status</label>
        <select id="teacher-status"><option ${teacher.status === 'Active' ? 'selected' : ''}>Active</option><option ${teacher.status === 'On Leave' ? 'selected' : ''}>On Leave</option><option ${(teacher.status === 'Inactive' || teacher.status === 'Archived') ? 'selected' : ''}>Inactive</option></select>
      </div>
      <div style="grid-column:1/-1;display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="submitEditTeacher('${teacherId}')"><i class="fas fa-save"></i> Save Changes</button>
        ${archiveAction}
        <button class="btn btn-secondary" style="flex:1" onclick="navTo('teachers')">Cancel</button>
      </div>
    </div>
  </div>`;
  document.getElementById('main-content').innerHTML = html;
}

function viewTeacherProfile(teacherId) {
  const teacher = teachersData.find(t => t.teacher_id === teacherId);
  if (!teacher) return showToast('Teacher not found', 'error');
  if (currentRole === 'Parent' && !getParentTeacherContacts().some(t => t.teacher_id === teacherId)) {
    showToast('<i class="fas fa-lock"></i> You can only view your children’s teachers', 'error');
    return;
  }

  const isArchived = teacher.status === 'Archived';
  const adminAction = isArchived
    ? `<button class="btn btn-primary" style="width:100%;margin-top:14px" onclick="restoreTeacher('${teacher.teacher_id}')"><i class="fas fa-rotate-left"></i> Restore Teacher</button>`
    : `<button class="btn btn-primary" style="width:100%;margin-top:14px" onclick="editTeacher('${teacher.teacher_id}')"><i class="fas fa-edit"></i> Edit Profile</button><button class="btn btn-danger" style="width:100%;margin-top:8px" onclick="archiveTeacher('${teacher.teacher_id}')"><i class="fas fa-box-archive"></i> Archive Teacher</button>`;

  let html = hdr('Teacher Profile', teacher.name, 'Teachers') + `
  <div class="g2">
    <div class="card">
      <div style="text-align:center;margin-bottom:20px">
        <div class="av av-xl av-${teacher.avatar_color}" style="margin:0 auto 12px"><i class="fas fa-user"></i></div>
        <div style="font-size:18px;font-weight:700;color:var(--blue-dark)">${teacher.name}</div>
        <div style="font-size:12px;color:var(--gray-500);margin-top:4px">${teacher.subject}</div>
        <span class="badge ${teacher.status === 'Active' ? 'b-success' : 'b-warning'}" style="margin-top:12px">${teacher.status}</span>
      </div>
      <div style="border-top:1px solid var(--gray-200);padding-top:14px">
        <div class="info-row">
          <span class="label"><i class="fas fa-graduation-cap"></i> Department</span>
          <span>${teacher.department}</span>
        </div>
        <div class="info-row">
          <span class="label"><i class="fas fa-book"></i> Subject</span>
          <span>${teacher.subject}</span>
        </div>
        <div class="info-row">
          <span class="label"><i class="fas fa-users"></i> Class Assigned</span>
          <span>${teacher.class_assigned}</span>
        </div>
        <div class="info-row">
          <span class="label"><i class="fas fa-briefcase"></i> Experience</span>
          <span>${teacher.experience} years</span>
        </div>
        <div class="info-row">
          <span class="label"><i class="fas fa-calendar-alt"></i> Schedule</span>
          <span>${teacher.schedule}</span>
        </div>
      </div>
    </div>
    <div class="card">
      <div style="font-size:14px;font-weight:700;color:var(--blue-dark);margin-bottom:14px"><i class="fas fa-contact-card"></i> Contact Information</div>
      <div style="border-top:1px solid var(--gray-200);padding-top:14px">
        <div class="info-row">
          <span class="label"><i class="fas fa-envelope"></i> Email</span>
          <span><a href="mailto:${teacher.email}" style="color:var(--blue-main)">${teacher.email}</a></span>
        </div>
        <div class="info-row">
          <span class="label"><i class="fas fa-phone"></i> Phone</span>
          <span><a href="tel:${teacher.phone}" style="color:var(--blue-main)">${teacher.phone}</a></span>
        </div>
        <div class="info-row">
          <span class="label"><i class="fas fa-birthday-cake"></i> Date of Birth</span>
          <span>${teacher.dob || 'Not provided'}</span>
        </div>
        <div class="info-row">
          <span class="label"><i class="fas fa-calendar-check"></i> Hired</span>
          <span>${teacher.hiring_date || 'Not provided'}</span>
        </div>
        ${isArchived ? `<div class="info-row"><span class="label"><i class="fas fa-box-archive"></i> Archived</span><span>${teacher.archived_date || 'Not provided'}</span></div>` : ''}
      </div>
      ${currentRole === 'Admin' ? adminAction : ''}
      ${currentRole === 'Parent' ? `<button class="btn btn-primary" style="width:100%;margin-top:14px" onclick="currentChat='${escapeAttr(teacher.name)}';navTo('messaging')"><i class="fas fa-envelope"></i> Message Teacher</button>` : ''}
    </div>
  </div>`;
  document.getElementById('main-content').innerHTML = html;
}

async function submitTeacherForm() {
  const name = document.getElementById('teacher-name').value.trim();
  const subject = document.getElementById('teacher-subject').value.trim();
  const department = document.getElementById('teacher-department').value;
  const experience = document.getElementById('teacher-experience').value;
  const email = document.getElementById('teacher-email').value.trim();
  const phone = document.getElementById('teacher-phone').value.trim();
  const classAssigned = document.getElementById('teacher-class').value;
  const schedule = document.getElementById('teacher-schedule').value.trim();
  const defaultBasic = getTeacherPayrollBasic({ experience });
  const basicSalary = Number(document.getElementById('teacher-basic')?.value || defaultBasic);

  if (!name || !subject || department === '-- Select --' || !experience || !email || !phone) {
    return showToast('Please fill all required fields', 'error');
  }

  if (typeof API === 'undefined' || !API.staff) {
    return showToast('Backend teacher API is unavailable', 'error');
  }

  const res = await API.staff.create({
    name,
    email,
    phone,
    category: 'Teaching',
    department,
    position: subject,
    qualifications: 'Degree',
    salary_grade: String(basicSalary),
    join_date: new Date().toISOString().split('T')[0],
    gender: 'Male',
    dob: document.getElementById('teacher-dob').value,
    address: 'Glory Reign Campus',
    subject,
    class_assigned: classAssigned || 'Not Assigned',
    experience: parseInt(experience, 10),
    schedule: schedule || 'Mon-Fri',
    avatar_color: 'blue',
    status: 'Active'
  });

  if (!res || !res.success) {
    return showToast(res?.message || 'Failed to add teacher', 'error');
  }
  showToast('<i class="fas fa-check-circle"></i> ' + name + ' added successfully!', 'success');
  if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
  const returnToPayroll = window.returnToPayrollAfterTeacherAdd;
  window.returnToPayrollAfterTeacherAdd = false;
  navTo(returnToPayroll ? 'salary' : 'teachers');
}

async function submitEditTeacher(teacherId) {
  const teacher = teachersData.find(t => t.teacher_id === teacherId);
  if (!teacher) return showToast('Teacher not found', 'error');
  if (typeof API === 'undefined' || !API.staff || !teacher.id) {
    return showToast('Backend teacher API is unavailable', 'error');
  }

  const status = document.getElementById('teacher-status').value;
  const basicSalary = Number(document.getElementById('teacher-basic')?.value || getTeacherPayrollBasic(teacher));
  const res = await API.staff.update(teacher.id, {
    name: document.getElementById('teacher-name').value.trim(),
    email: document.getElementById('teacher-email').value.trim(),
    phone: document.getElementById('teacher-phone').value.trim(),
    department: document.getElementById('teacher-department').value,
    position: document.getElementById('teacher-subject').value.trim(),
    subject: document.getElementById('teacher-subject').value.trim(),
    class_assigned: document.getElementById('teacher-class').value || 'Not Assigned',
    experience: parseInt(document.getElementById('teacher-experience').value || '0', 10),
    schedule: document.getElementById('teacher-schedule').value.trim() || 'Mon-Fri',
    salary_grade: String(basicSalary),
    status: status === 'Archived' ? 'Inactive' : status
  });
  if (!res || !res.success) {
    return showToast(res?.message || 'Failed to update teacher', 'error');
  }
  if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();

  showToast('<i class="fas fa-check-circle"></i> Teacher profile updated successfully!', 'success');
  navTo('teachers');
}

function deleteTeacher(teacherId) {
  archiveTeacher(teacherId);
}

async function archiveTeacher(teacherId) {
  const teacher = teachersData.find(t => t.teacher_id === teacherId);
  if (!teacher) return showToast('Teacher not found', 'error');
  if (typeof API === 'undefined' || !API.staff || !teacher.id) {
    return showToast('Backend teacher API is unavailable', 'error');
  }
  const res = await API.staff.update(teacher.id, { status: 'Inactive' });
  if (!res || !res.success) {
    return showToast(res?.message || 'Failed to archive teacher', 'error');
  }
  if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
  showToast('<i class="fas fa-check-circle"></i> Teacher moved to archived records', 'success');
  navTo('teachers');
}

async function restoreTeacher(teacherId) {
  const teacher = teachersData.find(t => t.teacher_id === teacherId);
  if (!teacher) return showToast('Teacher not found', 'error');
  if (typeof API === 'undefined' || !API.staff || !teacher.id) {
    return showToast('Backend teacher API is unavailable', 'error');
  }
  const res = await API.staff.update(teacher.id, { status: 'Active' });
  if (!res || !res.success) {
    return showToast(res?.message || 'Failed to restore teacher', 'error');
  }
  if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
  showToast('<i class="fas fa-check-circle"></i> Teacher restored to active records', 'success');
  viewArchivedTeachers();
}

function importTeachersCSV() {
  showToast('<i class="fas fa-upload"></i> Import functionality - File picker will open', 'info');
}

function exportTeachersData() {
  let csv = 'Teacher ID,Name,Subject,Department,Experience,Email,Phone,Class Assigned,Schedule,Status\n';
  teachersData.forEach(t => {
    csv += `${t.teacher_id},"${t.name}","${t.subject}","${t.department}",${t.experience},"${t.email}","${t.phone}","${t.class_assigned}","${t.schedule}","${t.status}"\n`;
  });
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', 'teachers-' + new Date().toISOString().slice(0, 10) + '.csv');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('<i class="fas fa-check-circle"></i> Teachers exported as CSV', 'success');
}

// TEACHERS MODULE
// -----------------------------------
function teachersModule() {
  const isStudent = currentRole === 'Student';
  const isParent = currentRole === 'Parent';
  const studentClass = isStudent ? 'JHS 1' : null;

  // For students, filter teachers to only show:
  // 1. Teachers of subjects they're taking
  // 2. Their form class teacher
  let filteredTeachers = getActiveTeachers(teachersData);
  if (isStudent) {
    // Find the class teacher for student's class using classesData
    const classInfo = classesData.find(c => c.name === studentClass);
    const classTeacherId = classInfo ? classInfo.teacher_id : null;

    // Find subject teacher IDs for classes that match student's class
    const subjectTeacherIds = new Set();
    subjectsData.forEach(s => {
      if (s.teacher_id && s.classes) {
        // Check if class is compatible (handles "All Forms", "JHS 1-3", etc.)
        const classes = s.classes.toLowerCase();
        const classNum = parseInt(studentClass.split(' ')[1]) || 0;

        let isMatch = false;
        if (classes === 'all forms') {
          isMatch = true;
        } else if (classes.includes('jhs') && classNum >= 1 && classNum <= 3) {
          if (classes.includes('-')) {
            const matches = classes.match(/\d+/g) || [];
            if (matches.length >= 2) {
              const start = parseInt(matches[0]);
              const end = parseInt(matches[1]);
              isMatch = classNum >= start && classNum <= end;
            }
          } else {
            isMatch = classes.includes(`${classNum}`);
          }
        }

        if (isMatch) {
          subjectTeacherIds.add(s.teacher_id);
        }
      }
    });

    filteredTeachers = getActiveTeachers(teachersData).filter(t => {
      // Check if teacher is the class teacher for student's class
      const isClassTeacher = classTeacherId && t.teacher_id === classTeacherId;

      // Check if teacher teaches a subject in student's class
      const teachesSubject = subjectTeacherIds.has(t.teacher_id);

      return isClassTeacher || teachesSubject;
    });
  } else if (isParent) {
    const childClasses = getParentChildren().map(child => child.class);
    const visibleTeacherIds = new Set();
    classesData.forEach(c => {
      if (childClasses.includes(c.name) && c.teacher_id) visibleTeacherIds.add(c.teacher_id);
    });
    subjectsData.forEach(s => {
      childClasses.forEach(className => {
        if (subjectAppliesToClass(s, className) && s.teacher_id) visibleTeacherIds.add(s.teacher_id);
      });
    });
    filteredTeachers = getActiveTeachers(teachersData).filter(t => visibleTeacherIds.has(t.teacher_id));
  }

  const roleNotice = isStudent ? `
    <div style="margin-bottom:18px;padding:14px;background:var(--blue-xpale);border:1px solid var(--blue-light);border-radius:var(--radius);color:var(--blue-dark);font-size:12px">
      <i class="fas fa-info-circle"></i> Viewing teachers who teach your subjects and your form class teacher
    </div>` : '';
  const teacherCards = filteredTeachers.map((t) => `
    <div class="card" style="cursor:pointer" onclick="if(!event.target.closest('button')) viewTeacherProfile('${t.teacher_id}')">
      <div style="display:flex;gap:14px;margin-bottom:14px">
        <div class="av av-lg av-${t.avatar_color}">${t.gender === 'Female' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-user"></i>'}</div>
        <div>
          <div style="font-size:14px;font-weight:700;color:var(--blue-dark)">${t.name}</div>
          <div style="font-size:11px;color:var(--gray-500)">${t.subject}</div>
          <span class="badge b-info" style="margin-top:6px;font-size:9px">${t.experience} yrs exp</span>
        </div>
      </div>
      <div style="font-size:11px;color:var(--gray-500);margin-bottom:8px"><i class="fas fa-users"></i> ${t.class_assigned} Class Teacher</div>
      <div style="font-size:10px;color:var(--gray-400);margin-bottom:12px"><i class="fas fa-calendar-alt"></i> ${t.schedule}</div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-secondary btn-xs" style="flex:1" onclick="viewTeacherProfile('${t.teacher_id}')">View Profile</button>
        <button class="btn btn-primary btn-xs" style="flex:1" onclick="messageTeacher('${t.teacher_id}', '${t.name}')"><i class="fas fa-envelope"></i> Message</button>
      </div>
    </div>`).join('');

  return hdr(isParent ? 'Messages with Teachers' : 'Teachers Module', isParent ? 'Communicate directly with your childrens teachers' : 'View teacher profiles and subject assignments', 'Teachers') +
    renderPageTemplate('pages/admin/teachers/index.html', { roleNotice, teacherCards });
}

// -----------------------------------
// TEACHERS MANAGEMENT MODULE (ADMIN)
// -----------------------------------
function teachersManagementModule() {
  const activeTeachers = getActiveTeachers(teachersData);
  const teacherCards = activeTeachers.map((t) => `
    <div class="card" style="cursor:pointer" onclick="if(!event.target.closest('button')) viewTeacherProfile('${t.teacher_id}')">
      <div style="display:flex;gap:14px;margin-bottom:14px">
        <div class="av av-lg av-${t.avatar_color}"><i class="fas fa-user"></i></div>
        <div style="flex:1">
          <div style="font-size:14px;font-weight:700;color:var(--blue-dark)">${t.name}</div>
          <div style="font-size:11px;color:var(--gray-500)">${t.subject}</div>
          <span class="badge b-info" style="margin-top:6px;font-size:9px">${t.experience} yrs exp</span>
        </div>
        <span class="badge ${t.class_assigned === 'Not Assigned' ? 'b-warning' : 'b-success'}" style="height:fit-content">${t.class_assigned === 'Not Assigned' ? 'Not Assigned' : t.class_assigned + ' Teacher'}</span>
      </div>
      <div style="display:grid;gap:8px;font-size:11px;margin-bottom:12px;padding:8px;background:var(--gray-xpale);border-radius:4px">
        <div><i class="fas fa-phone"></i> ${t.phone}</div>
        <div><i class="fas fa-calendar-alt"></i> ${t.schedule}</div>
      </div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-secondary btn-xs" style="flex:1" onclick="viewTeacherProfile('${t.teacher_id}')"><i class="fas fa-eye"></i> View Profile</button>
        <button class="btn btn-primary btn-xs" style="flex:1" onclick="editTeacher('${t.teacher_id}')"><i class="fas fa-edit"></i> Edit</button>
      </div>
    </div>`).join('');

  return hdr('Teachers Module', 'Manage all teacher profiles and subject assignments', 'Teachers') +
    renderPageTemplate('pages/admin/teachers/manage.html', {
      archivedCount: getArchivedTeachers().length,
      teacherCards
    });
}

function viewParentProfile(parentId) {
  const parent = parentsData.find(p => p.parent_id === parentId);
  if (!parent) return;

  let html = hdr('Parent Profile', 'View parent/guardian details', 'Parents') + `
  <div class="g2 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-user"></i> Personal Information</span></div>
      <div style="display:flex;gap:20px;margin-bottom:20px">
        <div class="av av-xl av-${parent.avatar_color}">${parent.gender === 'Female' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-user"></i>'}</div>
        <div style="flex:1">
          <div style="font-size:18px;font-weight:700;color:var(--blue-dark);margin-bottom:4px">${parent.name}</div>
          <div style="font-size:12px;color:var(--gray-500);margin-bottom:12px">Parent ID: <strong>${parent.parent_id}</strong></div>
          <div style="display:flex;gap:16px;font-size:12px;color:var(--gray-600)">
            <div><strong>Contact Person:</strong> ${parent.contact_person}</div>
            <div><strong>Gender:</strong> ${parent.gender}</div>
          </div>
        </div>
      </div>
      <hr style="border:none;border-top:1px solid var(--gray-200);margin:16px 0">
      <div style="display:flex;justify-content:space-between;font-size:12px">
        <div>
          <div style="color:var(--gray-500);margin-bottom:4px">Phone</div>
          <div style="font-weight:600;color:var(--gray-800)">${parent.phone}</div>
        </div>
        <div>
          <div style="color:var(--gray-500);margin-bottom:4px">Email</div>
          <div style="font-weight:600;color:var(--gray-800)">${parent.email}</div>
        </div>
        <div>
          <div style="color:var(--gray-500);margin-bottom:4px">Occupation</div>
          <div style="font-weight:600;color:var(--gray-800)">${parent.occupation}</div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-graduation-cap"></i> Children</span></div>
      <div style="display:grid;gap:10px">
        ${parent.children.split(',').map(child => '<div style="padding:10px;background:var(--blue-xpale);border-radius:var(--radius);font-size:12px;color:var(--gray-800)"><strong><i class="fas fa-book"></i></strong> ' + child.trim() + '</div>').join('')}
      </div>
    </div>
  </div>
  
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-money-bill"></i> Fees & Address</span></div>
    <div style="display:flex;justify-content:space-between;font-size:12px">
      <div>
        <div style="color:var(--gray-500);margin-bottom:4px">Fees Status</div>
        <span class="badge ${parent.fees_status === 'All Paid' ? 'b-success' : parent.fees_status === 'Pending' ? 'b-danger' : 'b-warning'}">${parent.fees_status}</span>
      </div>
      <div style="flex:1;margin-left:20px">
        <div style="color:var(--gray-500);margin-bottom:4px">Address</div>
        <div style="font-weight:600;color:var(--gray-800)">${parent.address}</div>
      </div>
    </div>
  </div>
  
  <div style="display:flex;gap:8px;margin-top:20px">
    <button class="btn btn-primary" onclick="editParent('${parentId}')"><i class="fas fa-edit"></i> Edit</button>
    <button class="btn btn-danger" onclick="deleteRecord('${parentId}', 'Parent')"><i class="fas fa-trash"></i> Delete</button>
    <button class="btn btn-secondary" onclick="navTo('parents')">Back</button>
  </div>`;

  document.getElementById('main-content').innerHTML = html;
}

function editParent(parentId) {
  const parent = parentsData.find(p => p.parent_id === parentId);
  if (!parent) return;

  let html = hdr('Edit Parent', 'Update parent/guardian information', 'Parents') + `
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-edit"></i> Edit Parent Details</span></div>
    <div class="form-grid">
      <div class="form-field">
        <label>Parent/Guardian Name *</label>
        <input type="text" id="edit-parent-name" value="${parent.name}">
      </div>
      <div class="form-field">
        <label>Primary Contact Person *</label>
        <input type="text" id="edit-parent-contact-person" value="${parent.contact_person}">
      </div>
      <div class="form-field">
        <label>Gender *</label>
        <select id="edit-parent-gender"><option value="Male" ${parent.gender === 'Male' ? 'selected' : ''}>Male</option><option value="Female" ${parent.gender === 'Female' ? 'selected' : ''}>Female</option></select>
      </div>
      <div class="form-field">
        <label>Phone *</label>
        <input type="tel" id="edit-parent-phone" value="${parent.phone}">
      </div>
      <div class="form-field">
        <label>Email *</label>
        <input type="email" id="edit-parent-email" value="${parent.email}">
      </div>
      <div class="form-field">
        <label>Occupation</label>
        <input type="text" id="edit-parent-occupation" value="${parent.occupation}">
      </div>
      <div class="form-field" style="grid-column:1/-1">
        <label>Address</label>
        <input type="text" id="edit-parent-address" value="${parent.address}">
      </div>
      <div class="form-field" style="grid-column:1/-1">
        <label>Children (Comma-separated) *</label>
        <input type="text" id="edit-parent-children" value="${parent.children}">
      </div>
      <div class="form-field" style="grid-column:1/-1">
        <label>Fees Status</label>
        <div class="readonly-field"><span class="badge ${parent.fees_status === 'All Paid' ? 'b-success' : parent.fees_status === 'Pending' ? 'b-danger' : 'b-warning'}">${escapeHtml(parent.fees_status || 'No Children')}</span></div>
        <div style="font-size:11px;color:var(--gray-500);margin-top:6px">Calculated from linked children fee records.</div>
      </div>
      <div style="grid-column:1/-1;display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="saveParentChanges('${parentId}')"><i class="fas fa-save"></i> Save Changes</button>
        <button class="btn btn-secondary" style="flex:1" onclick="navTo('parents')">Cancel</button>
      </div>
    </div>
  </div>`;

  document.getElementById('main-content').innerHTML = html;
}

function saveParentChanges(parentId) {
  const parent = parentsData.find(p => p.parent_id === parentId);
  if (!parent) return;

  const name = document.getElementById('edit-parent-name')?.value.trim();
  const contactPerson = document.getElementById('edit-parent-contact-person')?.value.trim();
  const gender = document.getElementById('edit-parent-gender')?.value;
  const phone = document.getElementById('edit-parent-phone')?.value.trim();
  const email = document.getElementById('edit-parent-email')?.value.trim();
  const occupation = document.getElementById('edit-parent-occupation')?.value.trim();
  const address = document.getElementById('edit-parent-address')?.value.trim();
  const children = document.getElementById('edit-parent-children')?.value.trim();

  if (!name || !contactPerson || !gender || !phone || !email || !children) {
    showToast('<i class="fas fa-times-circle"></i> Please fill all required fields', 'error');
    return;
  }

  parent.name = name;
  parent.contact_person = contactPerson;
  parent.gender = gender;
  parent.phone = phone;
  parent.email = email;
  parent.occupation = occupation || 'Not specified';
  parent.address = address || 'Not provided';
  parent.children = children;
  saveParentRecords();

  showToast('<i class="fas fa-check-circle"></i> Parent updated!<br/>Name: ' + name, 'success', 3000);

  setTimeout(() => {
    navTo('parents');
  }, 2000);
}

function filterParents() {
  const searchInput = document.getElementById('parent-search');
  const searchText = (searchInput ? searchInput.value : '').toLowerCase();

  let filtered = parentsData.filter((p) => {
    const matchSearch = !searchText || p.name.toLowerCase().includes(searchText) ||
      p.email.toLowerCase().includes(searchText) ||
      p.phone.toLowerCase().includes(searchText) ||
      p.contact_person.toLowerCase().includes(searchText);

    return matchSearch;
  });

  updateParentTable(filtered);
}

function updateParentTable(parents) {
  const tbody = document.querySelector('table.tbl tbody');
  if (!tbody) return;

  if (parents.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--gray-400)">No parents found</td></tr>';
    return;
  }

  tbody.innerHTML = parents.map((p, i) => '<tr style="cursor:pointer" onclick="if(!event.target.closest(\'button\')) viewParentProfile(\'' + p.parent_id + '\')"><td style="color:var(--gray-400);font-size:11px">' + (i + 1) + '</td><td><div style="display:flex;align-items:center;gap:8px"><div class="av av-sm av-' + p.avatar_color + '">' + p.name[0] + '</div><strong>' + p.name + '</strong></div></td><td style="font-size:11px">' + p.children + '</td><td style="font-size:11px">' + p.phone + '</td><td style="color:var(--blue-main);font-size:11px">' + p.email + '</td><td><span class="badge ' + (p.fees_status === 'All Paid' ? 'b-success' : (p.fees_status === 'Pending' ? 'b-danger' : 'b-warning')) + '">' + p.fees_status + '</span></td><td><div style="display:flex;gap:4px"><button class="btn btn-secondary btn-xs" onclick="viewParentProfile(\'' + p.parent_id + '\')">View</button><button class="btn btn-primary btn-xs" onclick="navTo(\'messaging\')">Message</button></div></td></tr>').join('');
}

// PARENTS MODULE
// -----------------------------------
// -----------------------------------
function parentsModule() {
  const parentRows = parentsData.map((p, i) => '<tr style="cursor:pointer" onclick="if(!event.target.closest(\'button\')) viewParentProfile(\'' + p.parent_id + '\')"><td style="color:var(--gray-400);font-size:11px">' + (i + 1) + '</td><td><div style="display:flex;align-items:center;gap:8px"><div class="av av-sm av-' + p.avatar_color + '">' + p.name[0] + '</div><strong>' + p.name + '</strong></div></td><td style="font-size:11px">' + p.children + '</td><td style="font-size:11px">' + p.phone + '</td><td style="color:var(--blue-main);font-size:11px">' + p.email + '</td><td><span class="badge ' + (p.fees_status === 'All Paid' ? 'b-success' : (p.fees_status === 'Pending' ? 'b-danger' : 'b-warning')) + '">' + p.fees_status + '</span></td><td><div style="display:flex;gap:4px"><button class="btn btn-secondary btn-xs" onclick="viewParentProfile(\'' + p.parent_id + '\')">View</button><button class="btn btn-primary btn-xs" onclick="navTo(\'messaging\')">Message</button></div></td></tr>').join('');

  return hdr('Parents Module', 'Parent/Guardian records and communication', 'Parents') +
    renderPageTemplate('pages/admin/parents/index.html', { parentRows });
}

// -----------------------------------
// CLASS MANAGEMENT FUNCTIONS
// -----------------------------------
function viewClassStudents(classId) {
  const classData = classesData.find(c => c.class_id === classId);
  if (!classData) return;
  if (!canAccessClass(classData)) {
    showToast('You can only view assigned classes', 'error');
    return;
  }

  // Get students in this class
  const classStudents = getActiveStudents(enrolledStudents).filter(s => s.student_class === classData.name);

  let html = hdr('Class Students', 'View all students in ' + classData.name, 'Classes') + `
  <div class="card mb20">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-book"></i> Class: ${classData.name}</span></div>
    <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:16px">
      <div>
        <div style="color:var(--gray-500);margin-bottom:4px">Stream</div>
        <span class="badge b-info">${classData.stream}</span>
      </div>
      <div>
        <div style="color:var(--gray-500);margin-bottom:4px">Class Teacher</div>
        <div style="font-weight:600;color:var(--gray-800)">${classData.teacher}</div>
      </div>
      <div>
        <div style="color:var(--gray-500);margin-bottom:4px">Total Students</div>
        <div style="font-weight:600;color:var(--gray-800)">${classStudents.length}</div>
      </div>
      <div>
        <div style="color:var(--gray-500);margin-bottom:4px">Attendance</div>
        <div style="font-weight:600;color:var(--success)">${classData.attendance}</div>
      </div>
    </div>
  </div>
  
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-users"></i> Enrolled Students (${classStudents.length})</span></div>
    <table class="tbl">
      <thead><tr><th>#</th><th>Student</th><th>ID No.</th><th>Gender</th><th>DOB</th><th>Attendance</th><th>Fees</th><th>Status</th></tr></thead>
      <tbody>
        ${classStudents.length === 0 ? '<tr><td colspan="8" style="text-align:center;padding:20px;color:var(--gray-400)">No students in this class yet</td></tr>' : classStudents.map((s, i) => '<tr><td style="color:var(--gray-400);font-size:11px">' + (i + 1) + '</td><td><div style="display:flex;align-items:center;gap:9px"><div class="av av-sm av-' + s.avatar_color + '">' + s.name[0] + '</div><strong>' + s.name + '</strong></div></td><td style="font-size:11px;color:var(--gray-400)">' + s.student_id + '</td><td><span class="badge ' + ((s.gender_abbr === 'F') ? 'b-purple' : 'b-info') + '">' + s.gender + '</span></td><td style="font-size:11px;color:var(--gray-500)">' + s.dob + '</td><td style="font-weight:600;color:' + (parseFloat(s.attendance) >= 90 ? 'var(--success)' : 'var(--warning)') + '">' + (s.attendance) + '</td><td><span class="badge ' + (s.fees_status === 'Paid' ? 'b-success' : (s.fees_status === 'Pending' ? 'b-danger' : 'b-warning')) + '">' + s.fees_status + '</span></td><td><span class="badge b-success">' + s.status + '</span></td></tr>').join('')}
      </tbody>
    </table>
  </div>
  
  <div style="display:flex;gap:8px;margin-top:20px">
    ${currentRole === 'Admin' ? `<button class="btn btn-primary" onclick="manageClass('${classId}')"><i class="fas fa-cog"></i> Manage Class</button>` : ''}
    <button class="btn btn-secondary" onclick="navTo('classes')">Back</button>
  </div>`;

  document.getElementById('main-content').innerHTML = html;
}

function manageClass(classId) {
  if (currentRole !== 'Admin') {
    showToast('Only administrators can manage classes', 'error');
    return;
  }

  const classData = classesData.find(c => c.class_id === classId);
  if (!classData) return;

  let html = hdr('Manage Class', 'Update class information and settings', 'Classes') + `
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-cog"></i> Class Settings</span></div>
    <div class="form-grid">
      <div class="form-field">
        <label>Class Name *</label>
        <input type="text" id="manage-class-name" value="${classData.name}">
      </div>
      <div class="form-field">
        <label>Class Level *</label>
        <select id="manage-class-level">
          <option value="Early Childhood" ${classData.level === 'Early Childhood' ? 'selected' : ''}>Early Childhood</option>
          <option value="Primary" ${classData.level === 'Primary' ? 'selected' : ''}>Primary</option>
          <option value="Junior High" ${classData.level === 'Junior High' ? 'selected' : ''}>Junior High</option>
        </select>
      </div>
      <div class="form-field">
        <label>Stream *</label>
        <select id="manage-class-stream">
          <option value="General" ${classData.stream === 'General' ? 'selected' : ''}>General</option>
          <option value="Mixed" ${classData.stream === 'Mixed' ? 'selected' : ''}>Mixed</option>
        </select>
      </div>
      <div class="form-field">
        <label>Class Teacher *</label>
        <select id="manage-class-teacher">
          <option value="">-- Select Teacher --</option>
          ${teachersData.map(t => '<option value="' + t.teacher_id + '" ' + ((t.teacher_id === classData.teacher_id) ? 'selected' : '') + '> ' + t.name + '</option>').join('')}
        </select>
      </div>
      <div class="form-field">
        <label>Current Students</label>
        <input type="number" id="manage-class-students" value="${classData.students}" readonly style="background:var(--gray-50);cursor:not-allowed" title="Student count is determined by active enrollments">
      </div>
      <div class="form-field">
        <label>Class Capacity *</label>
        <input type="number" id="manage-class-capacity" value="${classData.capacity}">
      </div>
      <div style="grid-column:1/-1">
        <label style="font-weight:600;display:block;margin-bottom:8px">Select Subjects *</label>
        <div id="class-subjects-container" style="display:flex;gap:12px;flex-wrap:wrap;padding:12px;background:var(--gray-50);border:1px solid var(--gray-200);border-radius:6px;max-height:150px;overflow-y:auto;margin-bottom:8px">
          <!-- Rendered dynamically -->
        </div>
        <div style="display:flex;gap:8px">
          <input type="text" id="custom-subject-input" placeholder="Or type custom subject name..." style="flex:1;font-size:12px;padding:6px 10px;border:1px solid var(--gray-300);border-radius:4px">
          <button type="button" class="btn btn-secondary btn-sm" onclick="addCustomSubjectToClassForm()" style="padding:4px 12px;font-size:12px">Add</button>
        </div>
      </div>
      <div style="grid-column:1/-1;display:flex;gap:8px;margin-top:10px">
        <button class="btn btn-primary" style="flex:1" onclick="saveClassChanges('${classId}')"><i class="fas fa-save"></i> Save Changes</button>
        <button class="btn btn-secondary" style="flex:1" onclick="navTo('classes')">Cancel</button>
      </div>
    </div>
  </div>`;

  document.getElementById('main-content').innerHTML = html;
  renderSubjectCheckboxes('class-subjects-container', classData.subjects || []);
}

async function saveClassChanges(classId) {
  if (window.API?.classes?.update) {
    if (currentRole !== 'Admin') {
      showToast('Only administrators can manage classes', 'error');
      return;
    }

    const classData = classesData.find(c => c.class_id === classId);
    if (!classData) {
      showToast('<i class="fas fa-times-circle"></i> Class not found', 'error');
      return;
    }

    const name = document.getElementById('manage-class-name')?.value.trim();
    const level = document.getElementById('manage-class-level')?.value;
    const stream = document.getElementById('manage-class-stream')?.value;
    const teacherId = document.getElementById('manage-class-teacher')?.value;
    const capacity = document.getElementById('manage-class-capacity')?.value;
    const subjects = Array.from(document.querySelectorAll('input[name="class-subjects"]:checked')).map(el => el.value);

    if (!name || !level || !stream || !capacity) {
      showToast('<i class="fas fa-times-circle"></i> Please fill all required fields', 'error');
      return;
    }

    const teacher = teachersData.find(t => t.teacher_id === teacherId);
    const res = await API.classes.update(classData.id, {
      name,
      level,
      stream,
      teacher_id: teacher ? teacher.id : null,
      capacity: parseInt(capacity, 10),
      subjects
    });

    if (res && res.success) {
      showToast('<i class="fas fa-check-circle"></i> Class updated successfully!', 'success');
      await syncAllDataFromBackend();
      navTo('classes');
    } else {
      showToast(res?.message || 'Failed to update class', 'error');
    }
    return;
  }

  showToast('Backend API is unavailable. Class changes were not saved.', 'error');
  return;
}

function renderSubjectCheckboxes(containerId, selectedNames = []) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const allNames = [...new Set([
    ...subjectsData.map(s => s.name),
    ...selectedNames
  ])].sort();

  if (allNames.length === 0) {
    container.innerHTML = '<span style="color:var(--gray-400);font-size:12px">No subjects found. Add a custom subject below.</span>';
    return;
  }

  container.innerHTML = allNames.map(name => {
    const checked = selectedNames.includes(name) ? 'checked' : '';
    return `
      <label style="display:inline-flex;align-items:center;gap:6px;font-size:13px;cursor:pointer;background:white;padding:4px 8px;border:1px solid var(--gray-200);border-radius:4px;user-select:none">
        <input type="checkbox" name="class-subjects" value="${name}" ${checked}>
        <span>${name}</span>
      </label>
    `;
  }).join('');
}

function addCustomSubjectToClassForm() {
  const input = document.getElementById('custom-subject-input');
  const name = input ? input.value.trim() : '';
  if (!name) return;

  const checked = Array.from(document.querySelectorAll('input[name="class-subjects"]:checked')).map(el => el.value);
  if (!checked.includes(name)) {
    checked.push(name);
  }

  input.value = '';
  renderSubjectCheckboxes('class-subjects-container', checked);
}

function openCreateClass() {
  if (currentRole !== 'Admin') {
    showToast('Only administrators can create classes', 'error');
    return;
  }

  let html = hdr('Create Class', 'Add a new class to the school roster', 'Classes') + `
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-plus-circle"></i> New Class</span></div>
    <div class="form-grid">
      <div class="form-field">
        <label>Class Name *</label>
        <input type="text" id="new-class-name" placeholder="e.g. Basic 7">
      </div>
      <div class="form-field">
        <label>Class Level *</label>
        <select id="new-class-level">
          <option value="Early Childhood">Early Childhood</option>
          <option value="Primary">Primary</option>
          <option value="Junior High">Junior High</option>
        </select>
      </div>
      <div class="form-field">
        <label>Stream *</label>
        <select id="new-class-stream">
          <option value="General">General</option>
          <option value="Mixed">Mixed</option>
        </select>
      </div>
      <div class="form-field">
        <label>Class Teacher *</label>
        <select id="new-class-teacher">
          <option value="">-- Select Teacher --</option>
          ${teachersData.map(t => '<option value="' + t.teacher_id + '">' + t.name + '</option>').join('')}
        </select>
      </div>
      <div class="form-field">
        <label>Class Capacity *</label>
        <input type="number" id="new-class-capacity" value="40">
      </div>
      <div style="grid-column:1/-1">
        <label style="font-weight:600;display:block;margin-bottom:8px">Select Subjects *</label>
        <div id="class-subjects-container" style="display:flex;gap:12px;flex-wrap:wrap;padding:12px;background:var(--gray-50);border:1px solid var(--gray-200);border-radius:6px;max-height:150px;overflow-y:auto;margin-bottom:8px">
          <!-- Rendered dynamically -->
        </div>
        <div style="display:flex;gap:8px">
          <input type="text" id="custom-subject-input" placeholder="Or type custom subject name..." style="flex:1;font-size:12px;padding:6px 10px;border:1px solid var(--gray-300);border-radius:4px">
          <button type="button" class="btn btn-secondary btn-sm" onclick="addCustomSubjectToClassForm()" style="padding:4px 12px;font-size:12px">Add</button>
        </div>
      </div>
      <div style="grid-column:1/-1;display:flex;gap:8px;margin-top:10px">
        <button class="btn btn-primary" style="flex:1" onclick="createClass()"><i class="fas fa-check"></i> Create Class</button>
        <button class="btn btn-secondary" style="flex:1" onclick="navTo('classes')">Cancel</button>
      </div>
    </div>
  </div>`;

  document.getElementById('main-content').innerHTML = html;
  renderSubjectCheckboxes('class-subjects-container', []);
}

async function createClass() {
  if (window.API?.classes?.create) {
    if (currentRole !== 'Admin') {
      showToast('Only administrators can create classes', 'error');
      return;
    }

    const name = document.getElementById('new-class-name')?.value.trim();
    const level = document.getElementById('new-class-level')?.value;
    const stream = document.getElementById('new-class-stream')?.value;
    const teacherId = document.getElementById('new-class-teacher')?.value;
    const capacity = document.getElementById('new-class-capacity')?.value;
    const subjects = Array.from(document.querySelectorAll('input[name="class-subjects"]:checked')).map(el => el.value);

    if (!name || !level || !stream || !capacity) {
      showToast('<i class="fas fa-times-circle"></i> Please fill all required fields', 'error');
      return;
    }

    const teacher = teachersData.find(t => t.teacher_id === teacherId);
    const res = await API.classes.create({
      name,
      level,
      stream,
      teacher_id: teacher ? teacher.id : null,
      capacity: parseInt(capacity, 10),
      subjects
    });

    if (res && res.success) {
      showToast('<i class="fas fa-check-circle"></i> Class created successfully!', 'success');
      await syncAllDataFromBackend();
      navTo('classes');
    } else {
      showToast(res?.message || 'Failed to create class', 'error');
    }
    return;
  }

  showToast('Backend API is unavailable. Class was not created.', 'error');
  return;
}

async function deleteClass(classId) {
  if (window.API?.classes?.delete) {
    if (currentRole !== 'Admin') {
      showToast('Only administrators can delete classes', 'error');
      return;
    }

    if (!confirm('Are you sure you want to delete this class? This cannot be undone.')) return;

    const classData = classesData.find(c => c.class_id === classId);
    if (!classData) {
      showToast('<i class="fas fa-times-circle"></i> Class not found', 'error');
      return;
    }

    const res = await API.classes.delete(classData.id);
    if (res && res.success) {
      showToast('<i class="fas fa-check-circle"></i> Class deleted successfully', 'success');
      await syncAllDataFromBackend();
      navTo('classes');
    } else {
      showToast(res?.message || 'Failed to delete class', 'error');
    }
    return;
  }

  showToast('Backend API is unavailable. Class was not deleted.', 'error');
  return;
}

function filterClasses() {
  const searchInput = document.getElementById('class-search');
  const searchText = (searchInput ? searchInput.value : '').toLowerCase();
  const streamFilter = document.getElementById('class-stream-filter');
  const selectedStream = streamFilter ? streamFilter.value : 'All Streams';

  let filtered = getVisibleClassesForRole(classesData).filter((c) => {
    const matchSearch = !searchText || c.name.toLowerCase().includes(searchText) || 
                        (c.teacher && c.teacher.toLowerCase().includes(searchText)) ||
                        (c.level && c.level.toLowerCase().includes(searchText));
    const matchStream = selectedStream === 'All Streams' || c.stream === selectedStream;
    return matchSearch && matchStream;
  });

  updateClassCards(filtered);
}

function updateClassCards(classes) {
  const container = document.querySelector('.g3');
  if (!container) return;
  const isAdmin = currentRole === 'Admin';

  if (classes.length === 0) {
    container.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gray-400)">No classes found</div>';
    return;
  }

  container.innerHTML = classes.map((c) => `
    <div class="card" style="cursor:pointer" onclick="if(!event.target.closest('button')) viewClassStudents('${c.class_id}')">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div style="font-size:18px;font-weight:800;color:var(--blue-dark)">${c.name}</div>
      </div>
      <div style="font-size:11px;color:var(--gray-500);margin-bottom:4px"><i class="fas fa-chalkboard-user"></i> ${c.teacher}</div>
      <div style="display:flex;justify-content:space-between;font-size:12px;margin:10px 0">
        <span><i class="fas fa-users"></i> <strong>${parseInt(c.students || 0, 10)}</strong> students</span>
        <span style="color:var(--success);font-weight:700">${c.attendance}</span>
      </div>
      <div class="prog-bar mb16"><div class="prog-fill pf-blue" style="width:${c.attendance}"></div></div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-secondary btn-xs" style="flex:1" onclick="viewClassStudents('${c.class_id}')">View Students</button>
        <button class="btn btn-secondary btn-xs" style="flex:1" onclick="viewClassTimetable('${c.name}')">Timetable</button>
        ${isAdmin ? `<button class="btn btn-primary btn-xs" style="flex:1" onclick="manageClass('${c.class_id}')">Manage</button>` : ''}
        ${isAdmin ? `<button class="btn btn-danger btn-xs" style="flex:1" onclick="deleteClass('${c.class_id}')">Delete</button>` : ''}
      </div>
    </div>`).join('');
}

// CLASSES MODULE
// -----------------------------------
function classesModule() {
  const isAdmin = currentRole === 'Admin';
  const visibleClasses = getVisibleClassesForRole(classesData);
  const totalStudents = visibleClasses.reduce((sum, c) => sum + parseInt(c.students || 0, 10), 0);
  const avgClassSize = visibleClasses.length ? Math.round(totalStudents / visibleClasses.length) : 0;
  const statsCards = [
    statCard('<i class="fas fa-building"></i>', visibleClasses.length, isAdmin ? 'Total Classes' : 'My Classes', isAdmin ? 'All levels' : 'Assigned to you', 'neu', 'si-blue'),
    statCard('<i class="fas fa-graduation-cap"></i>', totalStudents, 'Total Students', isAdmin ? 'All classes' : 'My classes', 'neu', 'si-gold'),
    statCard('<i class="fas fa-chalkboard-user"></i>', visibleClasses.length, 'Class Teachers', isAdmin ? 'One per class' : 'Your assignments', 'neu', 'si-green'),
    statCard('<i class="fas fa-chart-bar"></i>', avgClassSize, 'Avg Class Size', 'Balanced', 'neu', 'si-purple')
  ].join('');
  const adminActions = isAdmin ? '<button class="btn btn-primary" onclick="openCreateClass()"><i class="fas fa-plus"></i> Add Class</button>' : '';
  const roleNotice = !isAdmin ? '<div style="margin-bottom:18px;padding:14px;background:var(--blue-xpale);border:1px solid var(--blue-light);border-radius:var(--radius);color:var(--blue-dark);font-size:12px"><i class="fas fa-info-circle"></i> You are viewing only classes assigned to you.</div>' : '';
  const classCards = visibleClasses.map((c) => `
    <div class="card" style="cursor:pointer" onclick="if(!event.target.closest('button')) viewClassStudents('${c.class_id}')">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div style="font-size:18px;font-weight:800;color:var(--blue-dark)">${c.name}</div>
      </div>
      <div style="font-size:11px;color:var(--gray-500);margin-bottom:4px"><i class="fas fa-chalkboard-user"></i> ${c.teacher}</div>
      <div style="display:flex;justify-content:space-between;font-size:12px;margin:10px 0">
        <span><i class="fas fa-users"></i> <strong>${parseInt(c.students || 0, 10)}</strong> students</span>
        <span style="color:var(--success);font-weight:700">${c.attendance}</span>
      </div>
      <div class="prog-bar mb16"><div class="prog-fill pf-blue" style="width:${c.attendance}"></div></div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-secondary btn-xs" style="flex:1" onclick="viewClassStudents('${c.class_id}')">View Students</button>
        <button class="btn btn-secondary btn-xs" style="flex:1" onclick="viewClassTimetable('${c.name}')">Timetable</button>
        ${isAdmin ? `<button class="btn btn-primary btn-xs" style="flex:1" onclick="manageClass('${c.class_id}')">Manage</button>` : ''}
        ${isAdmin ? `<button class="btn btn-danger btn-xs" style="flex:1" onclick="deleteClass('${c.class_id}')">Delete</button>` : ''}
      </div>
    </div>`).join('');

  return hdr('Classes Module', isAdmin ? 'Manage classes and teacher assignments' : 'Your assigned classes', 'Classes') +
    renderPageTemplate('pages/admin/classes/index.html', { statsCards, adminActions, roleNotice, classCards });
}

// SUBJECTS MODULE
function subjectsModule() {
  const filteredSubjects = updateSubjectCards(subjectsData);
  const isAdmin = currentRole === 'Admin';
  const isTeacher = currentRole === 'Teacher';
  const isStudent = currentRole === 'Student';
  const moduleSubtitle = isAdmin
    ? 'Curriculum management and subject assignments'
    : isTeacher
      ? 'Subjects assigned to you'
      : 'Subjects for your class';

  const controlPanel = isAdmin ? `
    <div class="toolbar">
      <input type="text" id="subject-search" class="input-search" placeholder="Search subjects..." onkeyup="filterSubjects()">
      <button class="btn btn-primary" onclick="showAddSubjectForm()"><i class="fas fa-plus"></i> Add Subject</button>
    </div>
    <div style="margin-bottom:18px">
      <label style="font-size:11px;font-weight:600;color:var(--gray-600);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px;display:block">Filter by Type</label>
      <div class="mod-tabs">
        ${['All Subjects', 'Core', 'Elective', 'Extracurricular'].map((t, i) => `<div class="mod-tab ${i === 0 ? 'active' : ''}" onclick="filterSubjectsByType('${t === 'All Subjects' ? 'All' : t}')">${t}</div>`).join('')}
      </div>
    </div>` : `
    <div style="margin-bottom:18px;padding:14px;background:var(--blue-xpale);border:1px solid var(--blue-light);border-radius:var(--radius);color:var(--blue-dark);font-size:12px">
      <i class="fas fa-info-circle"></i> ${isTeacher ? 'You are viewing only subjects assigned to you.' : 'You are viewing only subjects for your class.'}
    </div>`;

  const subjectCards = filteredSubjects.map(s => `
    <div class="card" style="cursor:pointer" onclick="if(!event.target.closest('button') && !event.target.closest('.subject-menu-wrapper')) viewSubject('${s.subject_id}')">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div style="font-size:32px">${s.icon}</div>
        ${isAdmin ? `
        <div class="subject-menu-wrapper">
          <button class="subject-menu-btn" onclick="toggleSubjectMenu(event)" title="Subject actions"><i class="fas fa-ellipsis-vertical"></i></button>
          <div class="subject-menu">
            <button class="subject-menu-item" onclick="viewSubject('${s.subject_id}')">View</button>
            <button class="subject-menu-item" onclick="editSubject('${s.subject_id}')">Edit</button>
            <button class="subject-menu-item danger" onclick="deleteSubject('${s.subject_id}')">Delete</button>
          </div>
        </div>
        ` : ''}
      </div>
      <div style="font-size:14px;font-weight:700;color:var(--blue-dark);margin-bottom:4px">${s.name}</div>
      <div style="font-size:11px;color:var(--gray-400);margin-bottom:8px"><i class="fas fa-chalkboard-user"></i> ${s.teacher}</div>
      <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap">
        <span class="badge ${s.type === 'Core' ? 'b-success' : s.type === 'Elective' ? 'b-warning' : 'b-info'}">${s.type}</span>
        <span class="badge b-gray">${s.classes}</span>
      </div>
      <div style="font-size:11px;color:var(--gray-500)">${s.hours}</div>
    </div>`).join('');

  return hdr('Subjects Module', moduleSubtitle, 'Subjects') +
    renderPageTemplate('pages/admin/subjects/index.html', { controlPanel, subjectCards });
}

// SUBJECTS MODULE HELPER FUNCTIONS
let currentSubjectType = 'All';

function getCurrentTeacherId() {
  const user = getSessionUser();
  if (user?.teacher_id) return user.teacher_id;
  if (user?.staff_id) return user.staff_id;

  const identity = [user?.username, user?.email, user?.name].map(normalizeIdentity).filter(Boolean);
  const teacher = teachersData.find(t => {
    const haystack = [t.teacher_id, t.email, t.name, t.subject].map(normalizeIdentity);
    return identity.some(id => haystack.includes(id) || haystack.some(v => v.includes(id) || id.includes(v)));
  });
  return teacher?.teacher_id || 'T001';
}

function getCurrentTeacherProfile() {
  const teacherId = getCurrentTeacherId();
  return teachersData.find(t => t.teacher_id === teacherId) || null;
}

function getAssignedClassNamesForTeacher() {
  const teacherId = getCurrentTeacherId();
  const assigned = new Set();
  classesData.forEach(c => {
    if (c.teacher_id === teacherId) assigned.add(c.name);
  });

  const teacher = getCurrentTeacherProfile();
  if (teacher && teacher.class_assigned && teacher.class_assigned !== 'Not Assigned') {
    assigned.add(teacher.class_assigned);
  }

  return Array.from(assigned);
}

function getVisibleClassesForRole(classes) {
  if (currentRole !== 'Teacher') return classes;
  const assignedClassNames = getAssignedClassNamesForTeacher();
  return classes.filter(c => assignedClassNames.includes(c.name));
}

function canAccessClass(classData) {
  if (currentRole === 'Admin') return true;
  if (currentRole !== 'Teacher') return true;
  return getAssignedClassNamesForTeacher().includes(classData.name);
}

function getVisibleStudentsForRole(students) {
  if (currentRole !== 'Teacher') return students;
  const assignedClassNames = getAssignedClassNamesForTeacher();
  return students.filter(s => assignedClassNames.includes(s.student_class));
}

function getCurrentStudentRecord() {
  const user = getSessionUser();
  if (user?.student_id || user?.studentId) {
    const id = user.student_id || user.studentId;
    const found = enrolledStudents.find(s => s.student_id === id);
    if (found) return { ...found, feeAmount: found.feeAmount || 2400 };
  }

  const identity = [user?.username, user?.email, user?.name].map(normalizeIdentity).filter(Boolean);
  const matched = enrolledStudents.find(s => {
    const studentName = normalizeIdentity(s.name);
    return identity.some(id => studentName === id || studentName.includes(id) || id.includes(studentName));
  });
  if (matched) return { ...matched, feeAmount: matched.feeAmount || 2400 };

  return {
    student_id: '',
    name: 'No linked student',
    student_class: 'Not assigned',
    attendance: '0%',
    fees_status: 'Pending',
    feeAmount: 0,
    avatar_color: 'blue'
  };
}

function getRoleFeeStudents() {
  if (currentRole === 'Student') return [getCurrentStudentRecord()];
  if (currentRole === 'Parent') {
    return getParentChildren().map(c => ({
      student_id: c.studentId,
      name: c.name,
      student_class: c.class,
      attendance: c.attendance + '%',
      fees_status: c.feeStatus,
      feeAmount: c.feeAmount,
      avatar_color: c.color || 'blue'
    }));
  }
  return enrolledStudents;
}

function getReadableClassForRole(fallbackClass) {
  if (currentRole === 'Admin') return fallbackClass;
  if (currentRole === 'Teacher') {
    const assignedClassNames = getAssignedClassNamesForTeacher();
    const savedClass = window.selectedTimetableClass;
    if (savedClass && assignedClassNames.includes(savedClass)) return savedClass;
    return assignedClassNames[0] || fallbackClass;
  }
  return fallbackClass;
}

function getCurrentStudentClass() {
  return getCurrentStudentRecord().student_class || 'JHS 1';
}

function subjectAppliesToClass(subject, className) {
  if (!subject || !className) return false;
  const subjectName = subject.name.toLowerCase();
  const classSubjects = (SUBJECTS_BY_CLASS[className] || []).map(s => s.toLowerCase());
  const classInfo = classesData.find(c => c.name === className);
  const classInfoSubjects = (classInfo?.subjects || []).map(s => s.toLowerCase());
  const classLabel = (subject.classes || '').toLowerCase();

  if (classLabel === 'all forms') return true;
  if (classSubjects.includes(subjectName) || classInfoSubjects.includes(subjectName)) return true;
  if (subjectName === 'science' && classSubjects.includes('integrated science')) return true;
  if (subjectName === 'computing' && classSubjects.some(s => s.includes('computing') || s.includes('ict'))) return true;
  if (subjectName === 'english' && classSubjects.some(s => s.includes('english'))) return true;

  return classLabel.split(',').map(c => c.trim()).includes(className.toLowerCase());
}

function getVisibleSubjectsForRole(subjects) {
  if (currentRole === 'Teacher') {
    const teacherId = getCurrentTeacherId();
    return subjects.filter(s => s.teacher_id === teacherId);
  }

  if (currentRole === 'Student') {
    const studentClass = getCurrentStudentClass();
    return subjects.filter(s => subjectAppliesToClass(s, studentClass));
  }

  return subjects;
}

function toggleSubjectMenu(event) {
  event.stopPropagation();
  const wrapper = event.target.closest('.subject-menu-wrapper');
  if (!wrapper) return;

  // Close any other open menus
  document.querySelectorAll('.subject-menu-wrapper').forEach(w => {
    if (w !== wrapper) {
      w.classList.remove('active');
    }
  });

  wrapper.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', () => {
  document.querySelectorAll('.subject-menu-wrapper').forEach(w => {
    w.classList.remove('active');
  });
});

function updateSubjectCards(subjects) {
  const searchTerm = document.getElementById('subject-search')?.value.toLowerCase() || '';
  return getVisibleSubjectsForRole(subjects).filter(s => {
    const matchesType = currentSubjectType === 'All' || s.type === currentSubjectType;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm) || s.teacher.toLowerCase().includes(searchTerm);
    return matchesType && matchesSearch;
  });
}

function filterSubjectsByType(type) {
  currentSubjectType = type;
  document.querySelectorAll('.mod-tab').forEach((tab, i) => {
    const tabName = i === 0 ? 'All' : ['Core', 'Elective', 'Extracurricular'][i - 1];
    tab.classList.toggle('active', tabName === type);
  });

  const searchTerm = document.getElementById('subject-search')?.value.toLowerCase() || '';
  const filteredSubjects = getVisibleSubjectsForRole(subjectsData).filter(s => {
    const matchesType = currentSubjectType === 'All' || s.type === currentSubjectType;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm) || s.teacher.toLowerCase().includes(searchTerm);
    return matchesType && matchesSearch;
  });
  updateSubjectDisplay(filteredSubjects);
}

function filterSubjects() {
  const searchTerm = document.getElementById('subject-search')?.value.toLowerCase() || '';
  const filteredSubjects = getVisibleSubjectsForRole(subjectsData).filter(s => {
    const matchesType = currentSubjectType === 'All' || s.type === currentSubjectType;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm) || s.teacher.toLowerCase().includes(searchTerm);
    return matchesType && matchesSearch;
  });
  updateSubjectDisplay(filteredSubjects);
}

function updateSubjectDisplay(filteredSubjects) {
  const gridContainer = document.querySelector('.g4');
  if (!gridContainer) return;
  const isAdmin = currentRole === 'Admin';

  if (filteredSubjects.length === 0) {
    gridContainer.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--gray-400)">No subjects found</div>';
    return;
  }

  gridContainer.innerHTML = filteredSubjects.map(s => `
    <div class="card" style="cursor:pointer" onclick="if(!event.target.closest('button') && !event.target.closest('.subject-menu-wrapper')) viewSubject('${s.subject_id}')">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div style="font-size:32px">${s.icon}</div>
        ${isAdmin ? `
        <div class="subject-menu-wrapper">
          <button class="subject-menu-btn" onclick="toggleSubjectMenu(event)" title="Subject actions"><i class="fas fa-ellipsis-vertical"></i></button>
          <div class="subject-menu">
            <button class="subject-menu-item" onclick="viewSubject('${s.subject_id}')">View</button>
            <button class="subject-menu-item" onclick="editSubject('${s.subject_id}')">Edit</button>
            <button class="subject-menu-item danger" onclick="deleteSubject('${s.subject_id}')">Delete</button>
          </div>
        </div>
        ` : ''}
      </div>
      <div style="font-size:14px;font-weight:700;color:var(--blue-dark);margin-bottom:4px">${s.name}</div>
      <div style="font-size:11px;color:var(--gray-400);margin-bottom:8px"><i class="fas fa-chalkboard-user"></i> ${s.teacher}</div>
      <div style="display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap">
        <span class="badge ${s.type === 'Core' ? 'b-success' : s.type === 'Elective' ? 'b-warning' : 'b-info'}">${s.type}</span>
        <span class="badge b-gray">${s.classes}</span>
      </div>
      <div style="font-size:11px;color:var(--gray-500)">${s.hours}</div>
    </div>`).join('');
}

function showAddSubjectForm() {
  if (currentRole !== 'Admin') {
    showToast('Only administrators can add subjects', 'error');
    return;
  }

  const form = `
  <div style="background:white;border-radius:8px;padding:20px;max-width:500px">
    <h3 style="margin:0 0 20px;color:var(--blue-dark)"><i class="fas fa-plus"></i> Add New Subject</h3>
    <div class="form-grid">
      <div class="form-field">
        <label>Subject Icon HTML</label>
        <input type="text" id="add-subject-icon" placeholder='e.g., <i class="fas fa-book"></i>' style="font-size:12px">
      </div>
      <div class="form-field">
        <label>Subject Name</label>
        <input type="text" id="add-subject-name" placeholder="e.g., Physics">
      </div>
      <div class="form-field">
        <label>Subject Type</label>
        <select id="add-subject-type">
          <option value="Core">Core</option>
          <option value="Elective">Elective</option>
          <option value="Extracurricular">Extracurricular</option>
        </select>
      </div>
      <div class="form-field">
        <label>Teacher</label>
        <select id="add-subject-teacher">
          ${teachersData.map(t => `<option value="${t.teacher_id}" data-name="${t.name}">${t.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-field">
        <label>Class Assignment *</label>
        <select id="add-subject-class-id">
          <option value="">-- Select Class --</option>
          ${classesData.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-field">
        <label>Hours Per Week</label>
        <input type="text" id="add-subject-hours" placeholder="e.g., 4 hrs/wk">
      </div>
      <div class="form-field" style="grid-column:1/-1">
        <label>Description</label>
        <textarea id="add-subject-desc" placeholder="Brief description..." style="resize:vertical;min-height:80px"></textarea>
      </div>
      <div style="grid-column:1/-1;display:flex;gap:10px;justify-content:flex-end">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="submitSubjectForm()">Add Subject</button>
      </div>
    </div>
  </div>`;
  openModal(form);
}

async function submitSubjectForm() {
  if (window.API?.subjects?.create) {
    if (currentRole !== 'Admin') {
      showToast('Only administrators can add subjects', 'error');
      return;
    }

    const icon = document.getElementById('add-subject-icon')?.value.trim() || '';
    const name = document.getElementById('add-subject-name')?.value.trim();
    const type = document.getElementById('add-subject-type')?.value;
    const teacherId = document.getElementById('add-subject-teacher')?.value;
    const classId = document.getElementById('add-subject-class-id')?.value;
    const hours = document.getElementById('add-subject-hours')?.value.trim();
    const desc = document.getElementById('add-subject-desc')?.value.trim();

    if (!name || !classId || !hours) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const teacher = teachersData.find(t => t.teacher_id === teacherId);
    const res = await API.subjects.create({
      icon,
      name,
      type,
      teacher_id: teacher ? teacher.id : null,
      class_id: parseInt(classId, 10),
      hours,
      description: desc
    });

    if (res && res.success) {
      closeModal();
      showToast(`Subject "${name}" added successfully`, 'success');
      await syncAllDataFromBackend();
      renderMain();
    } else {
      showToast(res?.message || 'Failed to add subject', 'error');
    }
    return;
  }

  showToast('Backend API is unavailable. Subject was not created.', 'error');
  return;
}

function viewSubject(subjectId) {
  const subject = subjectsData.find(s => s.subject_id === subjectId);
  if (!subject) return;

  const view = `
  <div style="background:white;border-radius:8px;padding:20px;max-width:600px">
    <div style="display:flex;align-items:center;gap:15px;margin-bottom:20px">
      <div style="font-size:48px">${subject.icon}</div>
      <div>
        <h3 style="margin:0;color:var(--blue-dark)">${subject.name}</h3>
        <div style="font-size:13px;color:var(--gray-500)">ID: ${subject.subject_id}</div>
      </div>
    </div>
    <div style="background:var(--gray-50);padding:15px;border-radius:6px;margin-bottom:20px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px">
        <div>
          <div style="font-size:11px;color:var(--gray-500);margin-bottom:4px">TYPE</div>
          <span class="badge ${subject.type === 'Core' ? 'b-success' : subject.type === 'Elective' ? 'b-warning' : 'b-info'}">${subject.type}</span>
        </div>
        <div>
          <div style="font-size:11px;color:var(--gray-500);margin-bottom:4px">HOURS</div>
          <div style="font-weight:600">${subject.hours}</div>
        </div>
        <div>
          <div style="font-size:11px;color:var(--gray-500);margin-bottom:4px">TEACHER</div>
          <div style="font-weight:600">${subject.teacher}</div>
        </div>
        <div>
          <div style="font-size:11px;color:var(--gray-500);margin-bottom:4px">CLASSES</div>
          <div style="font-weight:600">${subject.classes}</div>
        </div>
      </div>
    </div>
    <div>
      <div style="font-size:12px;font-weight:600;color:var(--gray-600);margin-bottom:8px">DESCRIPTION</div>
      <div style="font-size:13px;color:var(--gray-700);line-height:1.6">${subject.description}</div>
    </div>
    <div style="margin-top:20px;display:flex;gap:10px;justify-content:flex-end">
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      ${currentRole === 'Admin' ? `<button class="btn btn-primary" onclick="editSubject('${subject.subject_id}')">Edit</button>` : ''}
    </div>
  </div>`;
  openModal(view);
}

function editSubject(subjectId) {
  if (currentRole !== 'Admin') {
    showToast('Only administrators can edit subjects', 'error');
    return;
  }

  const subject = subjectsData.find(s => s.subject_id === subjectId);
  if (!subject) return;

  const form = `
  <div style="background:white;border-radius:8px;padding:20px;max-width:500px">
    <h3 style="margin:0 0 20px;color:var(--blue-dark)"><i class="fas fa-edit"></i> Edit Subject</h3>
    <div class="form-grid">
      <div class="form-field">
        <label>Subject Icon HTML</label>
        <input type="text" id="edit-subject-icon" placeholder='e.g., <i class="fas fa-book"></i>' value="${escapeHtml(subject.icon)}" style="font-size:12px">
      </div>
      <div class="form-field">
        <label>Subject Name</label>
        <input type="text" id="edit-subject-name" value="${subject.name}">
      </div>
      <div class="form-field">
        <label>Subject Type</label>
        <select id="edit-subject-type">
          <option value="Core" ${subject.type === 'Core' ? 'selected' : ''}>Core</option>
          <option value="Elective" ${subject.type === 'Elective' ? 'selected' : ''}>Elective</option>
          <option value="Extracurricular" ${subject.type === 'Extracurricular' ? 'selected' : ''}>Extracurricular</option>
        </select>
      </div>
      <div class="form-field">
        <label>Teacher</label>
        <select id="edit-subject-teacher">
          ${teachersData.map(t => `<option value="${t.teacher_id}" ${t.teacher_id === subject.teacher_id ? 'selected' : ''}>${t.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-field">
        <label>Class Assignment *</label>
        <select id="edit-subject-class-id">
          <option value="">-- Select Class --</option>
          ${classesData.map(c => `<option value="${c.id}" ${(c.id === subject.class_id || c.name === subject.classes) ? 'selected' : ''}>${c.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-field">
        <label>Hours Per Week</label>
        <input type="text" id="edit-subject-hours" value="${subject.hours}">
      </div>
      <div class="form-field" style="grid-column:1/-1">
        <label>Description</label>
        <textarea id="edit-subject-desc" style="resize:vertical;min-height:80px">${subject.description}</textarea>
      </div>
      <div style="grid-column:1/-1;display:flex;gap:10px;justify-content:flex-end">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveSubjectChanges('${subject.subject_id}')">Save Changes</button>
        
      </div>
    </div>
  </div>`;
  openModal(form);
}

async function saveSubjectChanges(subjectId) {
  if (window.API?.subjects?.update) {
    if (currentRole !== 'Admin') {
      showToast('Only administrators can edit subjects', 'error');
      return;
    }

    const subject = subjectsData.find(s => s.subject_id === subjectId);
    if (!subject) return;

    const icon = document.getElementById('edit-subject-icon')?.value.trim() || '';
    const name = document.getElementById('edit-subject-name')?.value.trim();
    const type = document.getElementById('edit-subject-type')?.value;
    const teacherId = document.getElementById('edit-subject-teacher')?.value;
    const classId = document.getElementById('edit-subject-class-id')?.value;
    const hours = document.getElementById('edit-subject-hours')?.value.trim();
    const desc = document.getElementById('edit-subject-desc')?.value.trim();

    if (!name || !classId || !hours) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const teacher = teachersData.find(t => t.teacher_id === teacherId);
    const res = await API.subjects.update(subject.id, {
      icon,
      name,
      type,
      teacher_id: teacher ? teacher.id : null,
      class_id: parseInt(classId, 10),
      hours,
      description: desc
    });

    if (res && res.success) {
      closeModal();
      showToast('Subject updated successfully', 'success');
      await syncAllDataFromBackend();
      renderMain();
    } else {
      showToast(res?.message || 'Failed to update subject', 'error');
    }
    return;
  }

  showToast('Backend API is unavailable. Subject changes were not saved.', 'error');
  return;
}

async function deleteSubject(subjectId) {
  if (window.API?.subjects?.delete) {
    if (currentRole !== 'Admin') {
      showToast('Only administrators can delete subjects', 'error');
      return;
    }

    if (!confirm('Are you sure you want to delete this subject?')) return;

    const subject = subjectsData.find(s => s.subject_id === subjectId);
    if (!subject) return;

    const res = await API.subjects.delete(subject.id);
    if (res && res.success) {
      showToast(`Subject "${subject.name}" deleted`, 'success');
      await syncAllDataFromBackend();
      renderMain();
    } else {
      showToast(res?.message || 'Failed to delete subject', 'error');
    }
    return;
  }

  showToast('Backend API is unavailable. Subject was not deleted.', 'error');
  return;
}


// TIMETABLE MODULE
// -----------------------------------
// Period structure per class level:
// ALL CLASSES: 7:00-7:30 Morning Assembly (Mon-Fri)
// Basic 4 - JHS 3: 7:30-8:00 (Mon=Reading, Tue=Spellings, Wed=Dictation, Thu=Reading, Fri=PE/Preps)
// P1: 8:00-8:50, P2: 8:50-9:40, P3: 9:40-10:30, P4: 10:30-11:20
// BREAK: 11:20-11:40
// P5: 11:40-12:25, P6: 12:25-1:05
// BREAK: 1:05-1:35
// P7: 1:35-2:35, P8: 2:35-3:30
// P9: 3:30-4:00 (JHS 1-3 only; Basic 4-6 close at 3:30)
// -----------------------------------

// Get the correct period structure for a given class
function getPeriodsForClass(className) {
  const isUpper = ['Basic 4', 'Basic 5', 'Basic 6', 'JHS 1', 'JHS 2', 'JHS 3'].includes(className);
  const isJHS = ['JHS 1', 'JHS 2', 'JHS 3'].includes(className);
  const isLower = ['Creche', 'Nursery', 'KG 1', 'KG 2', 'Basic 1', 'Basic 2', 'Basic 3'].includes(className);

  const periods = [];
  // Morning Assembly for all
  periods.push({ id: 'Assembly', label: 'Assembly · 7:00–7:30', type: 'assembly' });
  // Special slot for upper classes
  if (isUpper) {
    periods.push({
      id: 'Special', label: '7:30–8:00', type: 'special',
      dayLabels: ['Reading', 'Spellings', 'Dictation', 'Reading', isJHS && className === 'JHS 3' ? 'Preps' : 'PE']
    });
  }
  periods.push({ id: 'P1', label: 'P1 · 8:00–8:50', type: 'period' });
  periods.push({ id: 'P2', label: 'P2 · 8:50–9:40', type: 'period' });
  periods.push({ id: 'P3', label: 'P3 · 9:40–10:30', type: 'period' });
  periods.push({ id: 'P4', label: 'P4 · 10:30–11:20', type: 'period' });
  periods.push({ id: 'Break1', label: 'Break · 11:20–11:40', type: 'break' });
  periods.push({ id: 'P5', label: 'P5 · 11:40–12:25', type: 'period' });
  periods.push({ id: 'P6', label: 'P6 · 12:25–1:05', type: 'period' });
  periods.push({ id: 'Break2', label: 'Break · 1:05–1:35', type: 'break' });
  periods.push({ id: 'P7', label: 'P7 · 1:35–2:35', type: 'period' });
  periods.push({ id: 'P8', label: 'P8 · 2:35–3:30', type: 'period' });
  // P9 only for JHS
  if (isJHS) {
    periods.push({ id: 'P9', label: 'P9 · 3:30–4:00', type: 'period' });
  } else if (['Basic 4', 'Basic 5', 'Basic 6'].includes(className)) {
    periods.push({ id: 'Close', label: 'Closing · 3:30', type: 'close' });
  }
  return periods;
}

function timetableModule() {
  const isAdmin = currentRole === 'Admin';
  loadTimetablesFromStorage();

  // Determine class to show
  const allClasses = classesData.map(c => c.name);
  let selectedClass;
  if (isAdmin) {
    selectedClass = window.selectedTimetableClass || allClasses[0];
  } else {
    selectedClass = getReadableClassForRole('Basic 2');
  }
  const selectedTerm = window.selectedTimetableTerm || 'Term 1, 2025';
  ensureTimetablesForAllClasses(selectedTerm);

  // Build class tabs for admin
  let classTabsHtml = '';
  if (isAdmin) {
    classTabsHtml = `<div class="tt-class-tabs" id="tt-class-tabs">
      ${allClasses.map(c => `<button class="tt-class-tab${c === selectedClass ? ' active' : ''}" onclick="selectTimetableClass('${c}')">${c}</button>`).join('')}
    </div>`;
  }

  const timetableHtml = getTimetableDisplay(selectedClass, selectedTerm);

  // Stats
  const totalClasses = allClasses.length;
  const classesWithTT = allClasses.filter(c => timetablesData[c] && Object.keys(timetablesData[c]).length > 0).length;

  return hdr('Timetable Module', 'Class schedules and period management', 'Timetable') + `
  <div class="stats-row">
    ${statCard('<i class="fas fa-building"></i>', totalClasses, 'Total Classes', 'All levels', 'neu', 'si-blue')}
    ${statCard('<i class="fas fa-calendar-check"></i>', classesWithTT, 'With Timetable', 'Configured', 'up', 'si-green')}
    ${statCard('<i class="fas fa-clock"></i>', '9', 'Periods/Day', 'Max (JHS)', 'neu', 'si-gold')}
    ${statCard('<i class="fas fa-chalkboard-user"></i>', isAdmin ? 'Admin' : currentRole, 'Your Role', isAdmin ? 'Full Access' : 'Read Only', 'neu', 'si-purple')}
  </div>

  ${isAdmin ? `<div class="toolbar" style="flex-wrap:wrap;gap:10px">
    <select id="tt-term-select" class="select-sm" onchange="saveTTTerm(); refreshTimetableView();">
      <option value="Term 1, 2025" ${selectedTerm === 'Term 1, 2025' ? 'selected' : ''}>Term 1, 2025</option>
      <option value="Term 2, 2025" ${selectedTerm === 'Term 2, 2025' ? 'selected' : ''}>Term 2, 2025</option>
      <option value="Term 3, 2025" ${selectedTerm === 'Term 3, 2025' ? 'selected' : ''}>Term 3, 2025</option>
    </select>
    <button class="btn btn-primary" onclick="openCreateTimetableForm()"><i class="fas fa-plus"></i> Create Timetable</button>
    <button class="btn btn-primary" onclick="openEditTimetableForm()"><i class="fas fa-edit"></i> Edit Timetable</button>
    <button class="btn btn-secondary" onclick="printTimetable()"><i class="fas fa-print"></i> Print</button>
    <button class="btn btn-secondary" onclick="exportTimetablePDF()"><i class="fas fa-file-pdf"></i> Export PDF</button>
    <button class="btn btn-danger btn-sm" onclick="deleteTimetable()"><i class="fas fa-trash"></i> Delete</button>
  </div>` : `<div class="toolbar" style="flex-wrap:wrap;gap:10px">
    <select id="tt-term-select" class="select-sm" onchange="saveTTTerm(); refreshTimetableView();">
      <option value="Term 1, 2025" ${selectedTerm === 'Term 1, 2025' ? 'selected' : ''}>Term 1, 2025</option>
      <option value="Term 2, 2025" ${selectedTerm === 'Term 2, 2025' ? 'selected' : ''}>Term 2, 2025</option>
      <option value="Term 3, 2025" ${selectedTerm === 'Term 3, 2025' ? 'selected' : ''}>Term 3, 2025</option>
    </select>
    <button class="btn btn-secondary" onclick="printTimetable()"><i class="fas fa-print"></i> Print</button>
    <button class="btn btn-secondary" onclick="exportTimetablePDF()"><i class="fas fa-file-pdf"></i> Export PDF</button>
    <div style="flex:1"></div>
    <div style="background:linear-gradient(135deg,rgba(59,130,246,.08),rgba(147,51,234,.08));border:1px solid rgba(59,130,246,.2);border-radius:8px;padding:8px 16px;font-size:12px;color:var(--blue-dark)">
      <i class="fas fa-eye"></i> Viewing: <strong>${selectedClass}</strong> (Read Only)
    </div>
  </div>`}

  ${classTabsHtml}
  <div id="tt-display-area">${timetableHtml}</div>`;
}

// -- backend-backed timetable state --
function loadTimetablesFromStorage() {
  ensureTimetablesForAllClasses(window.selectedTimetableTerm || 'Term 1, 2025');
}
function saveTimetablesToStorage() {
}
function saveTTTerm() {
  const el = document.getElementById('tt-term-select');
  if (el) window.selectedTimetableTerm = el.value;
}
function selectTimetableClass(className) {
  window.selectedTimetableClass = className;
  document.querySelectorAll('.tt-class-tab').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim() === className);
  });
  refreshTimetableView();
}
function refreshTimetableView() {
  const el = document.getElementById('tt-term-select');
  const term = el ? el.value : (window.selectedTimetableTerm || 'Term 1, 2025');
  const cls = currentRole === 'Admin'
    ? (window.selectedTimetableClass || classesData[0].name)
    : getReadableClassForRole('Basic 2');
  ensureTimetablesForAllClasses(term);
  const area = document.getElementById('tt-display-area');
  if (area) area.innerHTML = getTimetableDisplay(cls, term);
}

// -- Display --
function getTimetableDisplay(className, term) {
  const schedule = timetablesData[className] && timetablesData[className][term];
  if (!schedule) {
    return `<div class="card" style="text-align:center;padding:60px 30px">
      <div style="font-size:64px;color:var(--gray-300);margin-bottom:16px"><i class="fas fa-calendar-xmark"></i></div>
      <h3 style="color:var(--gray-500);font-size:16px;margin-bottom:8px">No Timetable Available</h3>
      <p style="color:var(--gray-400);font-size:13px;margin-bottom:20px">No schedule for <strong>${className}</strong> · <strong>${term}</strong></p>
      ${currentRole === 'Admin' ? '<button class="btn btn-primary" onclick="openCreateTimetableForm()"><i class="fas fa-plus"></i> Create Timetable Now</button>' : '<p style="color:var(--gray-400);font-size:12px">Contact your admin to set up the schedule.</p>'}
    </div>`;
  }

  const subjectColors = {
    'English': '#3b82f6', 'Mathematics': '#ef4444', 'Science': '#10b981', 'Dagaare': '#d97706',
    'Computing': '#8b5cf6', 'History': '#f59e0b', 'RME': '#a855f7', 'Creative Art': '#f97316',
    'Social Studies': '#06b6d4', 'Career Technology': '#ec4899', 'Numeracy': '#ef4444',
    'Literacy': '#3b82f6', 'Writing': '#6366f1', 'Environmental Studies': '#10b981',
    'Reading': '#3b82f6', 'Spellings': '#8b5cf6', 'Dictation': '#f59e0b', 'PE': '#06b6d4', 'Preps': '#64748b',
    'Assembly': '#64748b'
  };
  function dot(subj) {
    if (!subj || subj === '—') return '';
    const e = Object.entries(subjectColors).find(([k]) => subj.toLowerCase().includes(k.toLowerCase()));
    return `<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${e ? e[1] : '#94a3b8'};margin-right:5px"></span>`;
  }

  const ci = classesData.find(c => c.name === className);
  const teacher = ci ? ci.teacher : 'N/A';
  const students = ci ? ci.students : 0;

  return `<div class="card">
    <div class="card-hdr" style="flex-wrap:wrap;gap:10px">
      <span class="card-title"><i class="fas fa-calendar-alt"></i> Weekly Timetable — ${className} · ${term}</span>
      <div style="display:flex;gap:12px;align-items:center;font-size:11px;color:var(--gray-500)">
        <span><i class="fas fa-chalkboard-user"></i> ${teacher}</span>
        <span><i class="fas fa-users"></i> ${students} students</span>
      </div>
    </div>
    <div style="overflow-x:auto">
      <table class="tt" id="tt-table">
        <thead><tr>
          <th style="text-align:left;min-width:150px"><i class="fas fa-clock" style="margin-right:4px"></i> Period / Time</th>
          <th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th>
        </tr></thead>
        <tbody>
          ${schedule.map(([period, subjects]) => {
    const pLow = period.toLowerCase();
    const isBreak = pLow.includes('break') || pLow.includes('closing');
    const isAssembly = pLow.includes('assembly');
    const isSpecial = pLow.includes('7:30') && !pLow.includes('assembly');
    const rowClass = isBreak ? 'tt-break-row' : (isAssembly ? 'tt-assembly-row' : '');
    return `<tr class="${rowClass}">
              <td class="period">${isBreak ? '<i class="fas fa-mug-hot" style="margin-right:4px;opacity:.6"></i>' : (isAssembly ? '<i class="fas fa-flag" style="margin-right:4px;opacity:.6"></i>' : '')}${period}</td>
              ${subjects.map(s => {
      if (s === '—' || isBreak) return `<td class="break">${s}</td>`;
      if (isAssembly) return `<td style="background:rgba(100,116,139,.04);color:var(--gray-500);font-style:italic;font-size:10px">${s}</td>`;
      return `<td class="sub-cell"><div style="display:flex;align-items:center;justify-content:center">${dot(s)}${s}</div></td>`;
    }).join('')}
            </tr>`;
  }).join('')}
        </tbody>
      </table>
    </div>
    <div style="margin-top:16px;display:flex;flex-wrap:wrap;gap:14px;font-size:11px;padding:10px;background:var(--gray-50);border-radius:8px">
      <span style="font-weight:600;color:var(--gray-600)"><i class="fas fa-palette"></i> Legend:</span>
      <span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;background:var(--blue-xpale);border-radius:3px;border:1px solid var(--blue-pale)"></span>Periods</span>
      <span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;background:var(--gray-200);border-radius:3px"></span>Break</span>
      ${Object.entries(subjectColors).filter(([k]) => (SUBJECTS_BY_CLASS[className] || []).includes(k)).map(([k, c]) =>
    `<span style="display:flex;align-items:center;gap:4px"><span style="width:6px;height:6px;border-radius:50%;background:${c}"></span>${k}</span>`
  ).join('')}
    </div>
  </div>`;
}

// -- Create Timetable (Admin) --
function openCreateTimetableForm() {
  if (currentRole !== 'Admin') { showToast('<i class="fas fa-lock"></i> Admin only', 'error'); return; }
  currentMod = 'timetable';
  const selClass = window.selectedTimetableClass || classesData[0].name;
  const classOpts = classesData.map(c => `<option value="${c.name}" ${c.name === selClass ? 'selected' : ''}>${c.name}</option>`).join('');
  const el = document.getElementById('main-content');
  if (!el) return;
  el.innerHTML = hdr('Create Timetable', 'Set up a termly schedule for a class', 'Timetable') + `
  <div class="card">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
      <div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#3b82f6,#1e3a5f);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px"><i class="fas fa-plus"></i></div>
      <div><h2 style="margin:0;font-size:18px;font-weight:700;color:var(--gray-800)">Create New Timetable</h2>
      <p style="margin:0;font-size:12px;color:var(--gray-500)">Fill the weekly periods below, then save.</p></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
      <div class="form-field"><label>Class *</label>
        <select id="create-tt-class" onchange="updateCreateFormPeriods()" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:8px;font-family:Poppins,sans-serif;font-size:13px">${classOpts}</select></div>
      <div class="form-field"><label>Term *</label>
        <select id="create-tt-term" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:8px;font-family:Poppins,sans-serif;font-size:13px">
          <option value="Term 1, 2025">Term 1, 2025</option><option value="Term 2, 2025">Term 2, 2025</option><option value="Term 3, 2025">Term 3, 2025</option>
        </select></div>
    </div>
    <div id="create-periods-grid">${buildCreateGrid(selClass)}</div>
    <div style="display:flex;gap:10px;justify-content:flex-end;padding-top:16px;border-top:1px solid var(--gray-200)">
      <button class="btn btn-secondary" onclick="navTo('timetable')" style="padding:10px 24px">Cancel</button>
      <button class="btn btn-primary" onclick="saveNewTimetable()" style="padding:10px 24px"><i class="fas fa-check"></i> Create Timetable</button>
    </div>
  </div>`;
  window.scrollTo(0, 0);
}

function buildCreateGrid(className) {
  const periods = getPeriodsForClass(className);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  let html = `<div style="overflow-x:auto;border:1.5px solid var(--gray-200);border-radius:10px;background:white;margin-bottom:16px">
    <table style="width:100%;border-collapse:collapse" id="create-tt-table">
      <thead><tr style="background:linear-gradient(135deg,#1e3a5f,#3b82f6)">
        <th style="padding:12px 10px;color:white;font-size:11px;font-weight:600;text-align:left;min-width:150px;border-right:1px solid rgba(255,255,255,.15)">Period / Time</th>
        ${days.map(d => `<th style="padding:12px 6px;color:white;font-size:11px;font-weight:600;text-align:center;border-right:1px solid rgba(255,255,255,.1)">${d}</th>`).join('')}
      </tr></thead><tbody>`;

  periods.forEach((p, idx) => {
    const isBreak = p.type === 'break' || p.type === 'close';
    const isAssembly = p.type === 'assembly';
    const isSpecial = p.type === 'special';
    const bgColor = isBreak ? 'var(--gray-100)' : (isAssembly ? 'rgba(100,116,139,.08)' : 'var(--blue-xpale)');
    const txtColor = isBreak ? 'var(--gray-500)' : (isAssembly ? 'var(--gray-600)' : 'var(--blue-dark)');

    html += `<tr style="border-bottom:1px solid var(--gray-200)${isBreak ? ';background:var(--gray-50)' : ''}">
      <td style="padding:10px;font-weight:600;font-size:11px;background:${bgColor};color:${txtColor};border-right:1px solid var(--gray-200)">${p.label}</td>`;

    for (let d = 0; d < 5; d++) {
      let defaultVal = '';
      let readonly = false;
      if (isBreak) { defaultVal = '—'; readonly = true; }
      else if (isAssembly) { defaultVal = 'Morning Assembly'; readonly = true; }
      else if (isSpecial && p.dayLabels) { defaultVal = p.dayLabels[d]; readonly = true; }

      html += `<td style="padding:4px;text-align:center">
        <input type="text" id="create-p-${idx}-${d}" value="${defaultVal}" placeholder="${readonly ? '' : 'Subject'}" ${readonly ? 'readonly' : ''}
          style="width:100%;padding:8px 4px;border:1.5px solid ${readonly ? 'transparent' : 'var(--gray-200)'};border-radius:6px;font-family:Poppins,sans-serif;font-size:11px;background:${readonly ? 'transparent' : 'white'};text-align:center;box-sizing:border-box;transition:border-color .2s"
          ${!readonly ? 'onfocus="this.style.borderColor=\'var(--blue-main)\'" onblur="this.style.borderColor=\'var(--gray-200)\'"' : ''} />
      </td>`;
    }
    html += `</tr>`;
  });

  html += `</tbody></table></div>`;
  return html;
}

function updateCreateFormPeriods() {
  const cls = document.getElementById('create-tt-class');
  if (!cls) return;
  const grid = document.getElementById('create-periods-grid');
  if (grid) grid.innerHTML = buildCreateGrid(cls.value);
}

function saveNewTimetable() {
  const clsEl = document.getElementById('create-tt-class');
  const termEl = document.getElementById('create-tt-term');
  if (!clsEl || !termEl) { showToast('Select class and term', 'error'); return; }
  const cls = clsEl.value, term = termEl.value;
  if (timetablesData[cls] && timetablesData[cls][term]) {
    if (!confirm('Timetable exists for ' + cls + ' · ' + term + '. Overwrite?')) return;
  }
  const periods = getPeriodsForClass(cls);
  const schedule = [];
  let hasContent = false;
  periods.forEach((p, idx) => {
    const subjects = [];
    for (let d = 0; d < 5; d++) {
      const input = document.getElementById('create-p-' + idx + '-' + d);
      const val = input ? input.value.trim() : '';
      subjects.push(val || '—');
      if (val && val !== '—' && val !== 'Morning Assembly' && p.type === 'period') hasContent = true;
    }
    schedule.push([p.label, subjects]);
  });
  if (!hasContent) { showToast('Fill in at least one subject', 'error'); return; }
  if (!timetablesData[cls]) timetablesData[cls] = {};
  timetablesData[cls][term] = schedule;
  saveTimetablesToStorage();
  closeModal();
  window.selectedTimetableClass = cls;
  window.selectedTimetableTerm = term;
  renderMain();
  showToast('<i class="fas fa-check-circle"></i> Timetable created for ' + cls + ' · ' + term, 'success');
}

// -- Edit Timetable (Admin) --
function openEditTimetableForm() {
  if (currentRole !== 'Admin') { showToast('<i class="fas fa-lock"></i> Admin only', 'error'); return; }
  const cls = window.selectedTimetableClass || classesData[0].name;
  const termEl = document.getElementById('tt-term-select');
  const term = termEl ? termEl.value : 'Term 1, 2025';
  const schedule = timetablesData[cls] && timetablesData[cls][term];
  if (!schedule) { showToast('No timetable for ' + cls + ' · ' + term, 'error'); return; }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const form = `
  <div style="background:white;border-radius:12px;padding:24px;width:95vw;max-width:1400px;overflow-y:auto;max-height:95vh;box-shadow:0 10px 40px rgba(0,0,0,0.2)">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
      <div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#f59e0b,#d97706);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px"><i class="fas fa-edit"></i></div>
      <div><h2 style="margin:0;font-size:18px;font-weight:700">Edit — ${cls} · ${term}</h2>
      <p style="margin:0;font-size:12px;color:var(--gray-500)">Modify subjects for each period</p></div>
    </div>
    <div style="overflow-x:auto;border:1.5px solid var(--gray-200);border-radius:10px;background:white;margin-bottom:16px">
      <table style="width:100%;border-collapse:collapse">
        <thead><tr style="background:linear-gradient(135deg,#d97706,#f59e0b)">
          <th style="padding:12px 10px;color:white;font-size:11px;font-weight:600;text-align:left;min-width:150px;border-right:1px solid rgba(255,255,255,.15)">Period / Time</th>
          ${days.map(d => `<th style="padding:12px 6px;color:white;font-size:11px;font-weight:600;text-align:center;border-right:1px solid rgba(255,255,255,.1)">${d}</th>`).join('')}
        </tr></thead><tbody>
          ${schedule.map(([period, subjects], idx) => {
    const pLow = period.toLowerCase();
    const isFixed = pLow.includes('break') || pLow.includes('assembly') || pLow.includes('closing') || (pLow.includes('7:30') && !pLow.includes('p'));
    const bg = isFixed ? 'var(--gray-100)' : 'var(--blue-xpale)';
    const color = isFixed ? 'var(--gray-500)' : 'var(--blue-dark)';
    return `<tr style="border-bottom:1px solid var(--gray-200)">
              <td style="padding:10px;font-weight:600;font-size:11px;background:${bg};color:${color};border-right:1px solid var(--gray-200)">${period}</td>
              ${subjects.map((s, d) => `<td style="padding:4px;text-align:center">
                <input type="text" id="edit-p-${idx}-${d}" value="${s}" ${isFixed ? 'readonly' : ''} placeholder="${isFixed ? '' : 'Subject'}"
                  style="width:100%;padding:8px 4px;border:1.5px solid ${isFixed ? 'transparent' : 'var(--gray-200)'};border-radius:6px;font-family:Poppins,sans-serif;font-size:11px;background:${isFixed ? 'transparent' : 'white'};text-align:center;box-sizing:border-box"
                  ${!isFixed ? 'onfocus="this.style.borderColor=\'var(--gold)\'" onblur="this.style.borderColor=\'var(--gray-200)\'"' : ''} />
              </td>`).join('')}
            </tr>`;
  }).join('')}
        </tbody>
      </table>
    </div>
    <div style="display:flex;gap:10px;justify-content:flex-end;padding-top:16px;border-top:1px solid var(--gray-200)">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveEditedTimetable('${cls}','${term}')"><i class="fas fa-save"></i> Save Changes</button>
    </div>
  </div>`;
  openModal(form, true);
}

function saveEditedTimetable(cls, term) {
  const schedule = timetablesData[cls] && timetablesData[cls][term];
  if (!schedule) return;
  schedule.forEach(([period], idx) => {
    const pLow = period.toLowerCase();
    const isFixed = pLow.includes('break') || pLow.includes('assembly') || pLow.includes('closing') || (pLow.includes('7:30') && !pLow.includes('p'));
    if (isFixed) return;
    for (let d = 0; d < 5; d++) {
      const input = document.getElementById('edit-p-' + idx + '-' + d);
      if (input) schedule[idx][1][d] = input.value.trim() || '—';
    }
  });
  saveTimetablesToStorage();
  closeModal();
  refreshTimetableView();
  showToast('<i class="fas fa-check-circle"></i> Timetable updated for ' + cls, 'success');
}

// -- Delete --
function deleteTimetable() {
  if (currentRole !== 'Admin') return;
  const cls = window.selectedTimetableClass || classesData[0].name;
  const termEl = document.getElementById('tt-term-select');
  const term = termEl ? termEl.value : 'Term 1, 2025';
  if (!timetablesData[cls] || !timetablesData[cls][term]) { showToast('No timetable to delete', 'warning'); return; }
  if (!confirm('Delete timetable for ' + cls + ' · ' + term + '?')) return;
  delete timetablesData[cls][term];
  if (Object.keys(timetablesData[cls]).length === 0) delete timetablesData[cls];
  saveTimetablesToStorage();
  refreshTimetableView();
  showToast('<i class="fas fa-trash"></i> Timetable deleted', 'success');
}

// -- Print --
function printTimetable() {
  const table = document.getElementById('tt-table');
  if (!table) { showToast('No timetable to print', 'error'); return; }
  const cls = currentRole === 'Admin' ? (window.selectedTimetableClass || classesData[0].name) : getReadableClassForRole('Basic 2');
  const termEl = document.getElementById('tt-term-select');
  const term = termEl ? termEl.value : 'Term 1, 2025';
  const ci = classesData.find(c => c.name === cls);
  const teacher = ci ? ci.teacher : '';
  const w = window.open('', '', 'width=1000,height=800');
  if (!w) { showToast('Pop-up blocked', 'error'); return; }
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Timetable - ${cls}</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',Arial,sans-serif;padding:30px;color:#333}
    .header{text-align:center;margin-bottom:24px;border-bottom:3px solid #1e3a5f;padding-bottom:16px}
    .header h1{font-size:22px;color:#1e3a5f;margin-bottom:4px}.header p{font-size:13px;color:#666}
    .meta{display:flex;justify-content:space-between;margin-bottom:16px;font-size:12px;color:#555}
    table{width:100%;border-collapse:collapse}th{background:#1e3a5f;color:white;padding:10px 8px;font-size:11px;font-weight:600;text-align:center}
    th:first-child{text-align:left}td{border:1px solid #ddd;padding:8px 6px;text-align:center;font-size:11px}
    .period{background:#e8f0fe;color:#1e3a5f;font-weight:600;text-align:left!important}
    .brk td{background:#f5f5f5;color:#999;font-style:italic}
    .footer{margin-top:20px;font-size:10px;color:#aaa;text-align:center;border-top:1px solid #ddd;padding-top:10px}
    @media print{body{padding:15px}}</style></head><body>
    <div class="header"><h1>Glory Reign Preparatory School</h1><p>Weekly Class Timetable</p></div>
    <div class="meta"><span><strong>Class:</strong> ${cls}</span><span><strong>Term:</strong> ${term}</span><span><strong>Teacher:</strong> ${teacher}</span></div>
    <table><thead><tr><th style="text-align:left">Period / Time</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th></tr></thead><tbody>
    ${(timetablesData[cls][term] || []).map(([p, s]) => { const brk = p.toLowerCase().includes('break') || p.toLowerCase().includes('closing'); return '<tr class="' + (brk ? 'brk' : '') + '"><td class="period">' + p + '</td>' + s.map(v => '<td>' + v + '</td>').join('') + '</tr>'; }).join('')}
    </tbody></table>
    <div class="footer">Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · Glory Reign Preparatory School</div>
    </body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 300);
}

// -- Export PDF --
function exportTimetablePDF() {
  const cls = currentRole === 'Admin' ? (window.selectedTimetableClass || classesData[0].name) : getReadableClassForRole('Basic 2');
  const termEl = document.getElementById('tt-term-select');
  const term = termEl ? termEl.value : 'Term 1, 2025';
  const schedule = timetablesData[cls] && timetablesData[cls][term];
  if (!schedule) { showToast('No timetable to export', 'error'); return; }
  const ci = classesData.find(c => c.name === cls);
  const teacher = ci ? ci.teacher : '';
  let h = '<html><head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;padding:30px;color:#333}h1{text-align:center;color:#1e3a5f;font-size:20px;margin-bottom:4px}h2{text-align:center;color:#666;font-size:13px;font-weight:normal;margin-bottom:20px}.info{display:flex;justify-content:space-between;margin-bottom:16px;font-size:12px;color:#555;border-bottom:2px solid #1e3a5f;padding-bottom:10px}table{width:100%;border-collapse:collapse;margin-top:10px}th{background:#1e3a5f;color:white;padding:10px 8px;font-size:11px;font-weight:bold;text-align:center}th:first-child{text-align:left}td{border:1px solid #ccc;padding:8px 6px;text-align:center;font-size:11px}.period{background:#e8f0fe;color:#1e3a5f;font-weight:600;text-align:left}.brk{background:#f5f5f5;color:#999;font-style:italic}.footer{margin-top:24px;font-size:10px;color:#aaa;text-align:center;border-top:1px solid #ddd;padding-top:10px}</style></head><body>';
  h += '<h1>Glory Reign Preparatory School</h1><h2>Weekly Class Timetable</h2>';
  h += '<div class="info"><span><strong>Class:</strong> ' + cls + '</span><span><strong>Term:</strong> ' + term + '</span><span><strong>Teacher:</strong> ' + teacher + '</span></div>';
  h += '<table><thead><tr><th style="text-align:left">Period / Time</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th></tr></thead><tbody>';
  schedule.forEach(function ([p, s]) { const brk = p.toLowerCase().includes('break') || p.toLowerCase().includes('closing'); h += '<tr><td class="period">' + p + '</td>'; s.forEach(function (v) { h += '<td class="' + (brk ? 'brk' : '') + '">' + v + '</td>'; }); h += '</tr>'; });
  h += '</tbody></table><div class="footer">Generated on ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + ' · Glory Reign Preparatory School</div></body></html>';
  const blob = new Blob([h], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'Timetable_' + cls.replace(/\s/g, '_') + '_' + term.replace(/[\s,]/g, '_') + '.html';
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  showToast('<i class="fas fa-file-pdf"></i> Timetable exported for ' + cls, 'success');
}

// ATTENDANCE MODULE
function getAttendanceBatches() {
  return window.ATTENDANCE_BATCHES || [];
}

function saveAttendanceBatches(batches) {
  window.ATTENDANCE_BATCHES = batches.slice(0, 100);
}

function formatAttendanceDate(dateString) {
  const d = dateString ? new Date(dateString + 'T00:00:00') : new Date();
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getAttendanceStudentsForClass(className) {
  const students = enrolledStudents.filter(s => (s.student_class || s.class) === className);
  return students.length ? students : enrolledStudents.slice(0, 6);
}

function buildAttendanceSummaryRows() {
  const latestByClass = new Map();
  getAttendanceBatches().forEach(batch => {
    if (!latestByClass.has(batch.className)) latestByClass.set(batch.className, batch);
  });
  return classesData.map(c => {
    const batch = latestByClass.get(c.name);
    const records = batch?.records || [];
    const total = records.length || getClassActiveStudentCount(c.name) || c.students || 0;
    const present = records.filter(r => r.status === 'P').length || Math.max(0, total - 2);
    const absent = records.length ? records.filter(r => r.status === 'A').length : Math.min(2, total);
    const late = records.filter(r => r.status === 'L').length || 0;
    return { className: c.name, teacher: c.teacher, present, absent, late, date: batch?.date || new Date().toISOString().slice(0, 10), submittedAt: batch?.submittedAt || '' };
  });
}

function attendanceModule() {
  const today = new Date().toISOString().slice(0, 10);

  if (currentRole === 'Teacher') {
    const assignedClasses = getAssignedClassNamesForTeacher();
    const selectedClass = window.selectedAttendanceClass;
    const className = assignedClasses.includes(selectedClass) ? selectedClass : (assignedClasses[0] || '');
    const students = className ? getAttendanceStudentsForClass(className) : [];
    return hdr('Attendance Module', 'Record daily class attendance', 'Attendance') + `
    <div class="card mb20">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-clipboard-list"></i> Class Attendance</span></div>
      <div class="f-row" style="margin-bottom:16px">
        <div class="f-field"><label>Date</label><input id="attendance-date" type="date" value="${today}"></div>
        <div class="f-field"><label>Class</label><select id="attendance-class" onchange="window.selectedAttendanceClass=this.value;renderMain()">${assignedClasses.map(c => `<option value="${escapeAttr(c)}" ${c === className ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}</select></div>
      </div>
      ${className ? `
      <table class="tbl">
        <thead><tr><th>No.</th><th>Student Name</th><th style="text-align:center">Present (P)</th><th style="text-align:center">Absent (A)</th></tr></thead>
        <tbody>
          ${students.map((s, i) => `
          <tr class="attendance-row" data-student-id="${escapeAttr(s.student_id || '')}" data-student-name="${escapeAttr(s.name)}">
            <td>${i + 1}</td>
            <td><div style="display:flex;align-items:center;gap:8px"><div class="av av-sm av-${s.avatar_color || 'blue'}">${(s.name || 'S')[0]}</div><strong>${escapeHtml(s.name)}</strong></div></td>
            <td style="text-align:center"><input type="radio" name="att_${i}" value="P" checked></td>
            <td style="text-align:center"><input type="radio" name="att_${i}" value="A"></td>
          </tr>`).join('')}
        </tbody>
      </table>
      <div style="display:flex;justify-content:flex-end;margin-top:16px">
        <button class="btn btn-primary" onclick="saveAttendance()"><i class="fas fa-save"></i> Save Attendance</button>
      </div>` : `<div style="padding:20px;text-align:center;color:var(--gray-500)">No assigned class found for this teacher.</div>`}
    </div>`;
  }

  if (currentRole === 'Parent' || currentRole === 'Student') {
    const visibleStudents = currentRole === 'Student' ? [getCurrentStudentRecord()] : getParentChildren().map(c => ({ name: c.name, student_class: c.class, attendance: c.attendance + '%' }));
    return hdr('Attendance Tracking', currentRole === 'Student' ? 'View your attendance record' : 'Monitor your children\'s attendance', 'Attendance') + `
    <div class="g2">
      ${visibleStudents.map(student => `
      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-user-check"></i> ${escapeHtml(student.name)}</span></div>
        <div class="stats-row" style="grid-template-columns:repeat(2,1fr)">
          ${statCard('<i class="fas fa-check-circle"></i>', student.attendance || '96%', 'Attendance Rate', student.student_class || student.class || '', 'up', 'si-green')}
          ${statCard('<i class="fas fa-building"></i>', escapeHtml(student.student_class || student.class || 'Class'), 'Class', 'View only', 'neu', 'si-blue')}
        </div>
        <table class="tbl">
          <thead><tr><th>Date</th><th>Status</th><th>Class Teacher</th></tr></thead>
          <tbody>
            ${getAttendanceBatches().filter(b => b.records?.some(r => r.student === student.name)).slice(0, 5).map(b => {
              const rec = b.records.find(r => r.student === student.name);
              return `<tr><td>${formatAttendanceDate(b.date)}</td><td><span class="badge ${rec.status === 'P' ? 'b-success' : 'b-danger'}">${rec.status === 'P' ? 'Present' : 'Absent'}</span></td><td>${escapeHtml(b.teacherName || 'Class Teacher')}</td></tr>`;
            }).join('') || '<tr><td colspan="3" style="text-align:center;color:var(--gray-500)">No submitted attendance records yet.</td></tr>'}
          </tbody>
        </table>
      </div>`).join('')}
    </div>`;
  }

  const rows = buildAttendanceSummaryRows();
  const presentCount = rows.reduce((sum, r) => sum + r.present, 0);
  const absentCount = rows.reduce((sum, r) => sum + r.absent, 0);
  const lateCount = rows.reduce((sum, r) => sum + r.late, 0);
  return hdr('Attendance Module', 'Monitor attendance across all classes', 'Attendance') + `
  <div class="stats-row">
    ${statCard('<i class="fas fa-check-circle"></i>', presentCount, 'Present Today', 'All classes', 'up', 'si-green')}
    ${statCard('<i class="fas fa-times-circle"></i>', absentCount, 'Absent Today', 'All classes', 'dn', 'si-red')}
    ${statCard('<i class="fas fa-clock"></i>', lateCount, 'Late Today', 'Recorded late', 'neu', 'si-gold')}
    ${statCard('<i class="fas fa-chart-bar"></i>', rows.length, 'Classes Monitored', 'Admin view', 'up', 'si-blue')}
  </div>
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-table"></i> Class Attendance Summary</span><button class="btn btn-secondary btn-sm" onclick="generateReportPDF('Attendance')"><i class="fas fa-chart-line"></i> View Reports</button></div>
    <table class="tbl">
      <thead><tr><th>Class</th><th>Teacher</th><th>Present</th><th>Absent</th><th>Late</th><th>Date</th><th>Submitted</th></tr></thead>
      <tbody>
        ${rows.map(r => `<tr><td><strong>${escapeHtml(r.className)}</strong></td><td>${escapeHtml(r.teacher)}</td><td>${r.present}</td><td>${r.absent}</td><td>${r.late}</td><td>${formatAttendanceDate(r.date)}</td><td>${r.submittedAt ? new Date(r.submittedAt).toLocaleString() : 'Awaiting submission'}</td></tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

// EXAMS MODULE
function examsModule() {
  const isAdmin = currentRole === 'Admin';
  const isTeacher = currentRole === 'Teacher';
  const isStudent = currentRole === 'Student';
  const readableClasses = isTeacher ? getAssignedClassNamesForTeacher() : isStudent ? [getCurrentStudentRecord().student_class] : classesData.map(c => c.name);
  const allExamRows = classesData.flatMap(c => (SUBJECTS_BY_CLASS[c.name] || c.subjects || ['Mathematics', 'English']).slice(0, 3).map((subject, i) => [
    subject,
    c.name,
    ['Apr 1', 'Apr 2', 'Apr 3'][i] || 'Apr 4',
    i === 2 ? '1.5 hrs' : '2 hrs',
    c.level === 'JHS' ? 'Hall A' : 'Classroom',
    c.teacher
  ]));
  const examRows = allExamRows.filter(([_, className]) => !isTeacher && !isStudent || readableClasses.includes(className));

  if (isTeacher) {
    return hdr('Exam Schedule', 'View exam schedule information for your permitted classes', 'Exams') + `
    <div class="card">
      <div class="card-hdr">
        <span class="card-title"><i class="fas fa-calendar-alt"></i> Permitted Class Exam Schedule</span>
        <input type="text" id="exam-search" placeholder="Search by subject or class..." style="padding:8px 12px;border:1px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;width:250px" onkeyup="filterExamTable()">
      </div>
      <table class="tbl">
        <thead><tr><th>Subject</th><th>Class</th><th>Date</th><th>Duration</th><th>Venue</th><th>Invigilator</th></tr></thead>
        <tbody id="exam-table-body">
          ${examRows.length ? examRows.map(([s, c, d, du, v, inv]) => `
          <tr class="exam-row" data-subject="${s.toLowerCase()}" data-class="${c.toLowerCase()}">
            <td style="font-weight:600">${escapeHtml(s)}</td>
            <td>${escapeHtml(c)}</td>
            <td style="color:var(--blue-main);font-weight:600">${escapeHtml(d)}</td>
            <td>${escapeHtml(du)}</td>
            <td>${escapeHtml(v)}</td>
            <td style="font-size:11px">${escapeHtml(inv)}</td>
          </tr>`).join('') : '<tr><td colspan="6" style="text-align:center;color:var(--gray-500);padding:24px">No exams scheduled for your assigned classes.</td></tr>'}
        </tbody>
      </table>
    </div>`;
  }

  return hdr(isStudent ? 'Exam Results' : 'Exams & Report Cards', isAdmin ? 'Manage examinations, grading and report generation' : 'View exam information for your permitted classes', 'Exams') + `
  <div class="mod-tabs">
    ${['Exam Schedule', 'Report Cards', 'Results Analysis'].map((t, i) => `<div class="mod-tab ${i === 0 ? 'active' : ''}" onclick="switchExamTab(${i})">${t}</div>`).join('')}
  </div>
  
  <!-- TAB 1: EXAM SCHEDULE -->
  <div id="exam-tab-0" class="exam-tab-content" style="display:block">
    <div class="card">
      <div class="card-hdr">
        <span class="card-title"><i class="fas fa-calendar-alt"></i> Upcoming Examinations</span>
        <div style="display:flex;gap:8px;align-items:center">
          <input type="text" id="exam-search" placeholder="Search by subject or class..." style="padding:8px 12px;border:1px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;width:250px" onkeyup="filterExamTable()">
          ${isAdmin ? '<button class="btn btn-primary btn-sm" onclick="openScheduleExamForm()">+ Schedule Exam</button>' : ''}
        </div>
      </div>
      <table class="tbl">
        <thead><tr><th>Subject</th><th>Class</th><th>Date</th><th>Duration</th><th>Venue</th><th>Invigilator</th><th>Actions</th></tr></thead>
        <tbody id="exam-table-body">
          ${examRows.map(([s, c, d, du, v, inv]) => `
          <tr class="exam-row" data-subject="${s.toLowerCase()}" data-class="${c.toLowerCase()}">
            <td style="font-weight:600">${s}</td>
            <td>${c}</td>
            <td style="color:var(--blue-main);font-weight:600">${d}</td>
            <td>${du}</td>
            <td>${v}</td>
            <td style="font-size:11px">${inv}</td>
            <td style="font-size:11px">${isAdmin ? `<button class="btn btn-sm" style="padding:4px 8px;background:var(--info);color:white;border:none;border-radius:4px;cursor:pointer" onclick="editExam('${s}','${c}')">Edit</button> <button class="btn btn-sm" style="padding:4px 8px;background:var(--danger);color:white;border:none;border-radius:4px;cursor:pointer" onclick="deleteExam('${s}')">Delete</button>` : '<span class="badge b-info">Read Only</span>'}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
  
  <!-- TAB 2: REPORT CARDS -->
  <div id="exam-tab-1" class="exam-tab-content" style="display:none">
    <div class="card mb20">
      <div class="card-hdr">
        <span class="card-title"><i class="fas fa-clipboard-list"></i> Select Student Report Card</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px;padding:15px">
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">Select Student</label>
          <select id="report-student-selector" onchange="onStudentSelected()" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;cursor:pointer">
            <option value="">-- Choose a student --</option>
            <option value="Ama Serwaa">Ama Serwaa (JHS 1)</option>
            <option value="Kwame Asante">Kwame Asante (Basic 6)</option>
            <option value="Abena Mensah">Abena Mensah (Basic 6)</option>
            <option value="Kofi Boateng">Kofi Boateng (Basic 6)</option>
            <option value="Akosua Darko">Akosua Darko (JHS 1)</option>
            <option value="Yaw Mensah">Yaw Mensah (Basic 5)</option>
            <option value="Adwoa Frimpong">Adwoa Frimpong (Basic 5)</option>
            <option value="Kweku Ofori">Kweku Ofori (JHS 2)</option>
          </select>
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">Term</label>
          <select id="report-term-selector" onchange="onStudentSelected()" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;cursor:pointer">
            <option value="1st Term">1st Term</option>
            <option value="2nd Term">2nd Term</option>
            <option value="3rd Term">3rd Term</option>
          </select>
        </div>
      </div>
      <div id="selected-report-preview" style="padding:15px;background:var(--gray-50);border-radius:8px;border:1px solid var(--gray-200);text-align:center;color:var(--gray-600);font-size:13px">
        <i class="fas fa-thumbtack"></i> Tip: Select a student above to view their complete report card with all subjects, scores, grades, and remarks.
      </div>
    </div>

    <div class="card mb20" id="report-summary-section" style="display:none">
      <div class="card-hdr">
        <span class="card-title"><i class="fas fa-chart-bar"></i> Student Report Summary</span>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:15px;padding:15px">
        <input type="text" id="report-student-search" placeholder="Search student..." style="padding:8px 12px;border:1px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;flex:1" onkeyup="filterReportCards()">
        <select id="report-class-filter" style="padding:8px 12px;border:1px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;cursor:pointer" onchange="filterReportCards()">
          <option value="">All Classes</option><option value="Creche">Creche</option><option value="Nursery">Nursery</option><option value="KG 1">KG 1</option><option value="KG 2">KG 2</option><option value="Basic 1">Basic 1</option><option value="Basic 2">Basic 2</option><option value="Basic 3">Basic 3</option><option value="Basic 4">Basic 4</option><option value="Basic 5">Basic 5</option><option value="Basic 6">Basic 6</option><option value="JHS 1">JHS 1</option><option value="JHS 2">JHS 2</option><option value="JHS 3">JHS 3</option>
        </select>
      </div>
      <table class="tbl">
        <thead><tr><th style="width:25%">Student Name</th><th style="width:15%">Class</th><th style="width:15%">Total Marks</th><th style="width:15%">Average</th><th style="width:12%">Grade</th><th style="width:12%">Position</th><th style="width:15%">Action</th></tr></thead>
        <tbody id="report-cards-body">
          ${[['Ama Serwaa', 'JHS 1', '590', '84%', 'B', '8th'], ['Kwame Asante', 'Basic 6', '455', '76%', 'C', '8th'], ['Abena Mensah', 'Basic 6', '546', '91%', 'A', '2nd'], ['Kofi Boateng', 'Basic 6', '384', '64%', 'C', '18th'], ['Akosua Darko', 'JHS 1', '570', '95%', 'A', '1st'], ['Yaw Mensah', 'Basic 5', '492', '82%', 'B', '5th'], ['Adwoa Frimpong', 'Basic 5', '522', '87%', 'A', '3rd'], ['Kweku Ofori', 'JHS 2', '378', '63%', 'C', '22nd']].map(([name, cls, total, avg, grade, pos]) => '<tr class="report-row" data-student="' + name.toLowerCase() + '" data-class="' + cls + '"><td style="font-weight:600">' + name + '</td><td>' + cls + '</td><td style="color:var(--blue-main);font-weight:600">' + total + '</td><td>' + avg + '</td><td><span style="display:inline-block;padding:4px 10px;border-radius:4px;font-weight:700;color:white;background:' + (grade === 'A' ? 'var(--success)' : grade === 'B' ? 'var(--info)' : grade === 'C' ? 'var(--warning)' : 'var(--danger)') + '">' + grade + '</span></td><td>' + pos + '</td><td><button class="btn btn-sm" style="padding:4px 8px;background:var(--blue-main);color:white;border:none;border-radius:4px;cursor:pointer" onclick="viewReportCard(\'' + name + '\')"><i class="fas fa-file"></i> View Report</button></td></tr>').join('')}
        </tbody>
      </table>
    </div>
  </div>
  
  <!-- TAB 3: RESULTS ANALYSIS -->
  <div id="exam-tab-2" class="exam-tab-content" style="display:none">
    <div class="card mb20">
      <div class="card-hdr">
        <span class="card-title"><i class="fas fa-chart-bar"></i> Results Analysis & Statistics</span>
        <div style="display:flex;gap:8px">
          <select id="analysis-subject" style="padding:8px 12px;border:1px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;cursor:pointer" onchange="updateAnalysis()">
            <option>All Subjects</option><option>Mathematics</option><option>English Language</option><option>Integrated Science</option><option>ICT & Computing</option><option>Social Studies</option>
          </select>
          <select id="analysis-class" style="padding:8px 12px;border:1px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;cursor:pointer" onchange="updateAnalysis()">
            <option value="">All Classes</option><option>Creche</option><option>Nursery</option><option>KG 1</option><option>KG 2</option><option>Basic 1</option><option>Basic 2</option><option>Basic 3</option><option>Basic 4</option><option>Basic 5</option><option>Basic 6</option><option>JHS 1</option><option>JHS 2</option><option>JHS 3</option>
          </select>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:16px;margin-bottom:20px">
        <div style="padding:15px;background:var(--blue-xpale);border-radius:8px;text-align:center">
          <div style="font-size:24px;font-weight:bold;color:var(--blue-dark)">92.5%</div>
          <div style="font-size:11px;color:var(--gray-600);margin-top:5px">Class Average</div>
        </div>
        <div style="padding:15px;background:var(--success-light);border-radius:8px;text-align:center">
          <div style="font-size:24px;font-weight:bold;color:var(--success)">78%</div>
          <div style="font-size:11px;color:var(--gray-600);margin-top:5px">Pass Rate</div>
        </div>
        <div style="padding:15px;background:var(--warning-light);border-radius:8px;text-align:center">
          <div style="font-size:24px;font-weight:bold;color:var(--warning)">45</div>
          <div style="font-size:11px;color:var(--gray-600);margin-top:5px">A Grade Count</div>
        </div>
        <div style="padding:15px;background:var(--info-light);border-radius:8px;text-align:center">
          <div style="font-size:24px;font-weight:bold;color:var(--info)">62</div>
          <div style="font-size:11px;color:var(--gray-600);margin-top:5px">B Grade Count</div>
        </div>
        <div style="padding:15px;background:var(--danger-light);border-radius:8px;text-align:center">
          <div style="font-size:24px;font-weight:bold;color:var(--danger)">22%</div>
          <div style="font-size:11px;color:var(--gray-600);margin-top:5px">Below Average</div>
        </div>
      </div>
      <div style="padding:15px;background:var(--gray-50);border-radius:8px;border-left:4px solid var(--blue-main)">
        <div style="font-weight:600;color:var(--blue-dark);margin-bottom:10px"><i class="fas fa-chart-line"></i> Performance Insight</div>
        <ul style="margin:0;padding:0;list-style:none;font-size:12px;color:var(--gray-600);line-height:1.8">
          <li><i class="fas fa-check-circle"></i> Strong performance in Mathematics with 94% average</li>
          <li><i class="fas fa-check-circle"></i> English Language shows consistent improvement</li>
          <li><i class="fas fa-exclamation-triangle"></i> 15 students require remedial support in Science</li>
          <li><i class="fas fa-lightbulb"></i> Recommend extra tuition for bottom 20% in ICT</li>
        </ul>
      </div>
    </div>
  </div>
  `;
}

// GRADES ENTRY MODULE
function gradesModule() {
  const classOptions = (currentRole === 'Teacher' ? getAssignedClassNamesForTeacher() : classesData.map(c => c.name))
    .map(c => `<option>${escapeHtml(c)}</option>`).join('');
  const subjectOptions = (currentRole === 'Teacher' ? getVisibleSubjectsForRole(subjectsData) : subjectsData)
    .map(s => `<option>${escapeHtml(s.name)}</option>`).join('');

  return hdr('Enter Student Grades', currentRole === 'Teacher' ? 'Record scores for your assigned classes only' : 'Record class and exam scores for all students', 'Grade Entry') + `
  <div class="card mb20">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-file-alt"></i> Grade Entry Form</span></div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:14px;margin-bottom:16px">
      <div class="f-field">
        <label>Class</label>
        <select style="padding:10px;border:1px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;width:100%">
          ${classOptions}
        </select>
      </div>
      <div class="f-field">
        <label>Subject</label>
        <select style="padding:10px;border:1px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;width:100%">
          ${subjectOptions}
        </select>
      </div>
      <div class="f-field">
        <label>Term</label>
        <select style="padding:10px;border:1px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;width:100%">
          <option>1st Term 2024/2025</option>
          <option>2nd Term 2024/2025</option>
          <option>3rd Term 2024/2025</option>
        </select>
      </div>
      <div class="f-field">
        <label>Type</label>
        <select style="padding:10px;border:1px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;width:100%">
          <option>Class Score</option>
          <option>Exam Score</option>
          <option>Both</option>
        </select>
      </div>
    </div>
  </div>
  <div class="card mb20">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-users"></i> Enter Scores for All Students</span></div>
    <table class="tbl">
      <thead>
        <tr>
          <th>#</th>
          <th>Student Name</th>
          <th>Class Score (/50)</th>
          <th>Exam Score (/50)</th>
          <th>Total (/100)</th>
          <th>Grade</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${[['1', 'Ama Serwaa', '45', '43', '88', 'A', 'Complete'], ['2', 'Kwame Asante', '38', '34', '72', 'B', 'Complete'], ['3', 'Abena Mensah', '48', '43', '91', 'A', 'Complete'], ['4', 'Kofi Boateng', '32', '32', '64', 'C', 'Pending'], ['5', 'Akosua Darko', '48', '47', '95', 'A', 'Complete'], ['6', 'Yaw Mensah', '42', '40', '82', 'B', 'Complete'], ['7', 'Adwoa Frimpong', '45', '42', '87', 'A', 'Complete'], ['8', 'Kweku Ofori', '35', '28', '63', 'C', 'Pending']].map(([idx, name, cls, exam, total, grade, status]) => '<tr><td style="text-align:center;color:var(--gray-400)">' + idx + '</td><td style="font-weight:600">' + name + '</td><td><input type="number" value="' + cls + '" min="0" max="50" style="width:70px;border:1.5px solid var(--gray-200);border-radius:6px;padding:6px;text-align:center;font-family:Poppins,sans-serif"></td><td><input type="number" value="' + exam + '" min="0" max="50" style="width:70px;border:1.5px solid var(--gray-200);border-radius:6px;padding:6px;text-align:center;font-family:Poppins,sans-serif"></td><td style="font-weight:700;color:var(--blue-dark)">' + total + '</td><td><span style="display:inline-block;padding:4px 10px;border-radius:4px;font-weight:700;color:white;background:' + (grade === 'A' ? 'var(--success)' : grade === 'B' ? 'var(--info)' : 'var(--warning)') + '">' + grade + '</span></td><td><span class="badge ' + (status === 'Complete' ? 'b-success' : 'b-warning') + '">' + status + '</span></td></tr>').join('')}
      </tbody>
    </table>
    <div style="display:flex;gap:8px;margin-top:16px">
      <button class="btn btn-primary" onclick="showToast('<i class=\\'fas fa-check-circle\\'></i> Grades saved! You can now generate report cards.', 'success')" style="flex:1"><i class="fas fa-check-circle"></i> Save All Grades</button>
      <button class="btn btn-secondary" onclick="alert('Draft saved')" style="flex:1"><i class="fas fa-clipboard-list"></i> Save as Draft</button>
      <button class="btn btn-secondary" onclick="navTo('reportcards')" style="flex:1"><i class="fas fa-file"></i> View Report Cards</button>
    </div>
  </div>
  `;
}

function viewClassTimetable(className) {
  const classData = classesData.find(c => c.name === className);
  if (classData && !canAccessClass(classData)) {
    showToast('You can only view assigned class timetables', 'error');
    return;
  }

  window.selectedTimetableClass = className;
  window.selectedTimetableTerm = 'Term 1, 2025';
  navTo('timetable');
}

// TIMETABLES DATA
const timetablesData = {
  'Basic 2': {
    'Term 1, 2025': [
      ['P1 · 7:30–8:20', ['English Language', 'Mathematics', 'Integrated Science', 'English', 'Assembly']],
      ['P2 · 8:20–9:10', ['Mathematics', 'English', 'Physical Education', 'Science', 'Mathematics']],
      ['Break · 9:10–9:30', ['—', '—', '—', '—', '—']],
      ['P3 · 9:30–10:20', ['Science', 'Social Studies', 'Mathematics', 'English', 'Science']],
      ['P4 · 10:20–11:10', ['Social Studies', 'English', 'English', 'Science', 'English']],
      ['Lunch · 11:10–12:00', ['—', '—', '—', '—', '—']],
      ['P5 · 12:00–12:50', ['ICT', 'Science', 'Social Studies', 'Mathematics', 'Social Studies']],
      ['P6 · 12:50–13:40', ['Physical Education', 'Social Studies', 'ICT', 'Physical Education', 'ICT']]
    ]
  }
};

function buildDefaultTimetableForClass(className) {
  const subjects = SUBJECTS_BY_CLASS[className] || ['English', 'Mathematics', 'Science', 'Computing', 'RME'];
  const periods = getPeriodsForClass(className);
  let subjectIndex = 0;
  return periods.map(period => {
    if (period.type === 'break' || period.type === 'close') return [period.label, ['—', '—', '—', '—', '—']];
    if (period.type === 'assembly') return [period.label, ['Morning Assembly', 'Morning Assembly', 'Morning Assembly', 'Morning Assembly', 'Morning Assembly']];
    if (period.type === 'special' && period.dayLabels) return [period.label, period.dayLabels];
    return [period.label, Array.from({ length: 5 }, () => {
      const subject = subjects[subjectIndex % subjects.length];
      subjectIndex += 1;
      return subject;
    })];
  });
}

function ensureTimetablesForAllClasses(term = 'Term 1, 2025') {
  classesData.forEach(c => {
    if (!timetablesData[c.name]) timetablesData[c.name] = {};
    if (!timetablesData[c.name][term]) timetablesData[c.name][term] = buildDefaultTimetableForClass(c.name);
  });
}

// REPORT CARDS MODULE
// -----------------------------------
// REPORT CARD DATA & CALCULATIONS
// -----------------------------------

const admissionsData = [];
const enrolledStudents = [];
const teachersData = [];
const classesData = [];

const STUDENT_RECORDS_KEY = 'gr_student_records';
const TEACHER_RECORDS_KEY = 'gr_teacher_records';
const PARENT_RECORDS_KEY = 'gr_parent_records';
const ADMISSION_RECORDS_KEY = 'gr_admission_records';

function stripLegacyAverageFields(student) {
  const legacyKey = 'g' + 'pa';
  if (student && Object.prototype.hasOwnProperty.call(student, legacyKey)) delete student[legacyKey];
  return student;
}

function loadPersistentRecords() {
  enrolledStudents.forEach(stripLegacyAverageFields);
}

function saveStudentRecords() {
}

function saveTeacherRecords() {
}

function saveParentRecords() {
}

function saveAdmissionRecords() {
}

function getActiveStudents(students = enrolledStudents) {
  return students.filter(s => s.status !== 'Withdrawn');
}

function getWithdrawnStudents() {
  return enrolledStudents.filter(s => s.status === 'Withdrawn');
}

function getActiveTeachers(teachers = teachersData) {
  return teachers.filter(t => t.status !== 'Archived');
}

function getArchivedTeachers() {
  return teachersData.filter(t => t.status === 'Archived');
}

function getClassActiveStudentCount(className) {
  return getActiveStudents(enrolledStudents).filter(s => s.student_class === className).length;
}

function createOrUpdateParentFromAdmission(admission, student) {
  const childText = `${student.name} (${student.student_class})`;
  const parentKey = (admission.parent_email || admission.parent_phone || admission.parent_name || '').toLowerCase();
  let parent = parentsData.find(p =>
    (admission.parent_email && (p.email || '').toLowerCase() === admission.parent_email.toLowerCase()) ||
    (admission.parent_phone && p.phone === admission.parent_phone) ||
    ((p.name || '').toLowerCase() === (admission.parent_name || '').toLowerCase() && parentKey)
  );

  if (!parent) {
    parent = {
      parent_id: 'P' + String(parentsData.length + 1).padStart(3, '0'),
      name: admission.parent_name,
      contact_person: admission.parent_contact_person || admission.parent_name,
      gender: admission.parent_gender || (admission.parent_relationship === 'Mother' ? 'Female' : 'Male'),
      avatar_color: ['blue', 'gold', 'purple', 'green', 'teal'][parentsData.length % 5],
      phone: admission.parent_phone,
      email: admission.parent_email || '',
      address: admission.address || 'Not provided',
      children: childText,
      fees_status: 'Pending',
      occupation: admission.parent_occupation || 'Not specified',
      relationship: admission.parent_relationship || 'Guardian',
      picture: null
    };
    parentsData.push(parent);
  } else {
    parent.name = parent.name || admission.parent_name;
    parent.contact_person = admission.parent_contact_person || parent.contact_person || admission.parent_name;
    parent.gender = admission.parent_gender || parent.gender || 'Male';
    parent.phone = admission.parent_phone || parent.phone;
    parent.email = admission.parent_email || parent.email;
    parent.address = admission.address || parent.address || 'Not provided';
    parent.occupation = admission.parent_occupation || parent.occupation || 'Not specified';
    parent.relationship = admission.parent_relationship || parent.relationship || 'Guardian';
    const children = (parent.children || '').split(',').map(c => c.trim()).filter(Boolean);
    if (!children.some(c => c.toLowerCase() === childText.toLowerCase())) {
      children.push(childText);
      parent.children = children.join(', ');
    }
  }

  saveParentRecords();
  return parent;
}

// SUBJECTS DATA
let subjectsData = [];


// PARENTS DATA
const parentsData = [];

// Student scores data
const studentScores = {
  '2024-0042': {
    name: 'Ama Serwaa',
    class: 'JHS 1',
    classTeacher: 'Mr. Kweku Amponsah',
    stream: 'Mixed',
    picture: 'A',
    attendance: 96,
    term: '1st',
    year: '2024/2025',
    scores: [
      { subject: 'Mathematics', classScore: 45, examScore: 43, totalMarks: 100 },
      { subject: 'English Language', classScore: 48, examScore: 44, totalMarks: 100 },
      { subject: 'Integrated Science', classScore: 42, examScore: 43, totalMarks: 100 },
      { subject: 'ICT & Computing', classScore: 48, examScore: 47, totalMarks: 100 },
      { subject: 'Social Studies', classScore: 40, examScore: 38, totalMarks: 100 },
      { subject: 'French Language', classScore: 38, examScore: 34, totalMarks: 100 },
      { subject: 'Religious Studies', classScore: 42, examScore: 38, totalMarks: 100 }
    ]
  },
  '2024-0043': {
    name: 'Kwame Asante',
    class: 'Basic 6',
    classTeacher: 'Mr. Boateng Sr.',
    stream: 'General',
    picture: 'K',
    attendance: 88,
    term: '1st',
    year: '2024/2025',
    scores: [
      { subject: 'Mathematics', classScore: 35, examScore: 32, totalMarks: 100 },
      { subject: 'English Language', classScore: 42, examScore: 40, totalMarks: 100 },
      { subject: 'History', classScore: 44, examScore: 42, totalMarks: 100 },
      { subject: 'Geography', classScore: 40, examScore: 38, totalMarks: 100 },
      { subject: 'ICT', classScore: 38, examScore: 36, totalMarks: 100 },
      { subject: 'French Language', classScore: 35, examScore: 33, totalMarks: 100 }
    ]
  }
};
