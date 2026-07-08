// ═══════════════════════════════════════════════════════════════
// Glory Reign School — PHP API Client
// Replaces in-memory data with real backend calls
// ═══════════════════════════════════════════════════════════════

const API_BASE = '/SCH/api';

// ── Core fetch wrapper ────────────────────────────────────────
async function apiRequest(endpoint, method = 'GET', body = null) {
    const opts = {
        method,
        credentials: 'include',          // send session cookie
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    };
    if (body && method !== 'GET') opts.body = JSON.stringify(body);

    try {
        const res  = await fetch(API_BASE + endpoint, opts);
        const data = await res.json();

        if (res.status === 401) {
            // Session expired — redirect to login
            currentRole = 'Visitor';
            logout();
            showToast('Session expired. Please log in again.', 'error');
            return null;
        }
        return data;
    } catch (err) {
        console.error('API error:', endpoint, err);
        showToast('Network error. Check your connection.', 'error');
        return null;
    }
}

const API = {
    // ── Auth ──────────────────────────────────────────────────
    login:   (username, password) => apiRequest('/auth/login.php',  'POST', { username, password }),
    logout:  ()                   => apiRequest('/auth/logout.php',  'POST'),
    me:      ()                   => apiRequest('/auth/me.php'),

    // ── Students ─────────────────────────────────────────────
    students: {
        list:    (params = {}) => apiRequest('/students/index.php?'   + new URLSearchParams(params)),
        get:     (id, params)  => apiRequest('/students/student.php?' + new URLSearchParams({ id, ...params })),
        create:  (data)        => apiRequest('/students/index.php',   'POST', data),
        update:  (id, data)    => apiRequest('/students/student.php?id=' + id, 'PUT',    data),
        delete:  (id)          => apiRequest('/students/student.php?id=' + id, 'DELETE'),
        scores:  (studentId, params) => apiRequest('/students/scores.php?' + new URLSearchParams({ student_id: studentId, ...params })),
        saveScores: (data)     => apiRequest('/students/scores.php',  'POST', data),
    },

    // ── Staff ─────────────────────────────────────────────────
    staff: {
        list:   (params = {}) => apiRequest('/staff/index.php?'   + new URLSearchParams(params)),
        get:    (id)          => apiRequest('/staff/staff.php?id=' + id),
        create: (data)        => apiRequest('/staff/index.php',    'POST', data),
        update: (id, data)    => apiRequest('/staff/staff.php?id=' + id, 'PUT',    data),
        delete: (id)          => apiRequest('/staff/staff.php?id=' + id, 'DELETE'),
    },

    // ── Classes ───────────────────────────────────────────────
    classes: {
        list:   ()     => apiRequest('/classes/index.php'),
        create: (data) => apiRequest('/classes/index.php', 'POST', data),
    },

    // ── Fees ─────────────────────────────────────────────────
    fees: {
        list:        (params = {}) => apiRequest('/fees/index.php?'   + new URLSearchParams(params)),
        create:      (data)        => apiRequest('/fees/index.php',    'POST', data),
        payments:    (params = {}) => apiRequest('/fees/payment.php?' + new URLSearchParams(params)),
        recordPayment: (data)      => apiRequest('/fees/payment.php',  'POST', data),
    },

    // ── Events ───────────────────────────────────────────────
    events: {
        list:   (params = {}) => apiRequest('/events/index.php?' + new URLSearchParams(params)),
        create: (data)        => apiRequest('/events/index.php',  'POST', data),
        update: (id, data)    => apiRequest('/events/index.php?id=' + id, 'PUT',    data),
        delete: (id)          => apiRequest('/events/index.php?id=' + id, 'DELETE'),
    },

    // ── Notices ──────────────────────────────────────────────
    notices: {
        list:   (params = {}) => apiRequest('/notices/index.php?' + new URLSearchParams(params)),
        create: (data)        => apiRequest('/notices/index.php',  'POST', data),
        update: (id, data)    => apiRequest('/notices/index.php?id=' + id, 'PUT',    data),
        delete: (id)          => apiRequest('/notices/index.php?id=' + id, 'DELETE'),
    },

    // ── Messages ─────────────────────────────────────────────
    messages: {
        inbox: (params = {}) => apiRequest('/messages/index.php?' + new URLSearchParams({ type: 'inbox', ...params })),
        sent:  (params = {}) => apiRequest('/messages/index.php?' + new URLSearchParams({ type: 'sent',  ...params })),
        send:  (data)        => apiRequest('/messages/index.php',  'POST', data),
    },

    // ── Assignments ──────────────────────────────────────────
    assignments: {
        list:        (params = {}) => apiRequest('/assignments/index.php?'      + new URLSearchParams(params)),
        create:      (data)        => apiRequest('/assignments/index.php',       'POST', data),
        get:         (id)          => apiRequest('/assignments/assignment.php?id=' + id),
        update:      (id, data)    => apiRequest('/assignments/assignment.php?id=' + id, 'PUT',    data),
        delete:      (id)          => apiRequest('/assignments/assignment.php?id=' + id, 'DELETE'),
        submissions: (assignmentId) => apiRequest('/assignments/submission.php?assignment_id=' + assignmentId),
        grade:       (data)         => apiRequest('/assignments/submission.php', 'POST', data),
    },

    // ── Alumni ───────────────────────────────────────────────
    alumni: {
        list:   (params = {}) => apiRequest('/alumni/index.php?' + new URLSearchParams(params)),
        create: (data)        => apiRequest('/alumni/index.php',  'POST', data),
        update: (id, data)    => apiRequest('/alumni/index.php?id=' + id, 'PUT',    data),
        delete: (id)          => apiRequest('/alumni/index.php?id=' + id, 'DELETE'),
    },

    // ── Attendance ───────────────────────────────────────────
    attendance: {
        list:   (params = {}) => apiRequest('/attendance/index.php?' + new URLSearchParams(params)),
        record: (records)     => apiRequest('/attendance/index.php',  'POST', { records }),
    },

    // ── Admissions ───────────────────────────────────────────
    admissions: {
        list:         (params = {}) => apiRequest('/admissions/index.php?'  + new URLSearchParams(params)),
        apply:        (data)        => apiRequest('/admissions/index.php',   'POST', data),
        updateStatus: (id, status, notes) => apiRequest('/admissions/index.php?id=' + id, 'PUT', { status, notes }),
    },

    // ── Users ────────────────────────────────────────────────
    users: {
        list:   (params = {}) => apiRequest('/users/index.php?' + new URLSearchParams(params)),
        get:    (id)          => apiRequest('/users/user.php?id=' + id),
        create: (data)        => apiRequest('/users/index.php',   'POST', data),
        update: (id, data)    => apiRequest('/users/user.php?id=' + id, 'PUT',    data),
        delete: (id)          => apiRequest('/users/user.php?id=' + id, 'DELETE'),
    },

    // ── Settings ─────────────────────────────────────────────
    settings: {
        get:    ()     => apiRequest('/settings/index.php'),
        update: (data) => apiRequest('/settings/index.php', 'POST', data),
    },

    // ── Dashboard / Reports ──────────────────────────────────
    dashboard: () => apiRequest('/reports/dashboard.php'),

    // ── Parents ──────────────────────────────────────────────
    parents: {
        list:      (params = {}) => apiRequest('/parents/index.php?' + new URLSearchParams(params)),
        linkChild: (user_id, student_id) => apiRequest('/parents/index.php', 'POST', { user_id, student_id }),
        unlinkChild: (user_id, student_id) => apiRequest('/parents/index.php?' + new URLSearchParams({ user_id, student_id }), 'DELETE'),
    },

    // ── Contact ──────────────────────────────────────────────
    contact: {
        submit:   (data) => apiRequest('/contact/index.php',     'POST', data),
        list:     ()     => apiRequest('/contact/index.php'),
        markRead: (id)   => apiRequest('/contact/index.php?id=' + id, 'PUT'),
        delete:   (id)   => apiRequest('/contact/index.php?id=' + id, 'DELETE'),
    },
};

// ═══════════════════════════════════════════════════════════════
// LOGIN INTEGRATION
// Replace the JS-only login with a real API call
// ═══════════════════════════════════════════════════════════════
async function doRoleLoginAPI(role) {
    const email = document.getElementById('role-email')?.value?.trim();
    const pass  = document.getElementById('role-pass')?.value;

    if (!email || !pass) { showToast('Please fill in all fields', 'error'); return; }

    const btn = document.querySelector('.login-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Signing in...'; }

    const res = await API.login(email, pass);

    if (btn) { btn.disabled = false; btn.textContent = `Sign In to ${role} Dashboard →`; }

    if (!res || !res.success) {
        showToast(res?.message || 'Invalid credentials', 'error');
        const passField = document.getElementById('role-pass');
        if (passField) {
            passField.value = '';
            passField.style.borderColor = 'var(--danger)';
            setTimeout(() => passField.style.borderColor = '', 2000);
        }
        return;
    }

    // Store session user globally
    if (typeof setSessionUser === 'function') setSessionUser(res.user);
    else window.SESSION_USER = res.user;
    loginRole = (typeof getSessionUser === 'function' ? getSessionUser()?.role : res.user.role) || role;

    const roleLoginPage = document.getElementById('role-login-page');
    if (roleLoginPage) roleLoginPage.remove();
    doLogin();
    showToast(`<i class="fas fa-check-circle"></i> Welcome, ${res.user.name}!`, 'success');
}

async function doAdminLoginAPI() {
    const usernameField = document.getElementById('admin-user');
    const passField     = document.getElementById('admin-pass');
    const username = usernameField?.value?.trim() || 'admin';
    const pass     = passField?.value;

    if (!pass) { showToast('Please enter the admin password', 'error'); return; }

    const btn = document.querySelector('.admin-login-btn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...'; }

    const res = await API.login(username, pass);

    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-shield-halved"></i> Access Admin Dashboard →'; }

    if (!res || !res.success || res.user?.role !== 'Admin') {
        showToast('<i class="fas fa-times-circle"></i> Incorrect credentials', 'error');
        if (passField) {
            passField.value = '';
            passField.focus();
            passField.style.borderColor = 'var(--danger)';
            setTimeout(() => passField.style.borderColor = '', 2000);
        }
        return;
    }

    if (typeof setSessionUser === 'function') setSessionUser(res.user);
    else window.SESSION_USER = res.user;
    loginRole = (typeof getSessionUser === 'function' ? getSessionUser()?.role : res.user.role) || 'Admin';
    const adminPage = document.getElementById('role-login-page');
    if (adminPage) adminPage.remove();
    doLogin();
    showToast('<i class="fas fa-shield-halved"></i> Welcome, Administrator!', 'success');
}

async function logoutAPI() {
    await API.logout();
    if (typeof setSessionUser === 'function') setSessionUser(null);
    else window.SESSION_USER = null;
    logout(); // call the existing JS logout UI function
}
