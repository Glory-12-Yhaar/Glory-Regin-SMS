// ═══════════════════════════════════════════════════════════════
// Glory Reign School — PHP API Client
// Replaces in-memory data with real backend calls
// ═══════════════════════════════════════════════════════════════

const API_BASE = (() => {
    const path = window.location.pathname;
    const baseDir = path.substring(0, path.lastIndexOf('/'));
    return baseDir.replace(/\/frontend\/?$/, '') + '/backend/api';
})();

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
        update: (id, data) => apiRequest('/classes/index.php?id=' + id, 'PUT', data),
        delete: (id)   => apiRequest('/classes/index.php?id=' + id, 'DELETE'),
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
        enroll:       (id, notes)   => apiRequest('/admissions/index.php?id=' + id, 'PUT', { status: 'Enrolled', notes }),
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
    analytics: (params = {}) => apiRequest('/reports/analytics.php?' + new URLSearchParams(params)),

    exams: {
        list:   (params = {}) => apiRequest('/exams/index.php?' + new URLSearchParams(params)),
        create: (data)        => apiRequest('/exams/index.php', 'POST', data),
        update: (id, data)    => apiRequest('/exams/index.php?id=' + id, 'PUT', data),
        delete: (id)          => apiRequest('/exams/index.php?id=' + id, 'DELETE'),
    },

    grades: {
        list: (params = {}) => apiRequest('/grades/index.php?' + new URLSearchParams(params)),
        save: (data)       => apiRequest('/grades/index.php', 'POST', data),
    },

    // ── Parents ──────────────────────────────────────────────
    parents: {
        list:        (params = {}) => apiRequest('/parents/index.php?' + new URLSearchParams(params)),
        update:      (id, data)    => apiRequest('/parents/index.php?id=' + id, 'PUT', data),
        delete:      (id)          => apiRequest('/parents/index.php?id=' + id, 'DELETE'),
        linkChild:   (user_id, student_id) => apiRequest('/parents/index.php', 'POST', { user_id, student_id }),
        unlinkChild: (user_id, student_id) => apiRequest('/parents/index.php?' + new URLSearchParams({ user_id, student_id }), 'DELETE'),
    },

    // ── Contact ──────────────────────────────────────────────
    contact: {
        submit:   (data) => apiRequest('/contact/index.php',     'POST', data),
        list:     ()     => apiRequest('/contact/index.php'),
        markRead: (id)   => apiRequest('/contact/index.php?id=' + id, 'PUT'),
        delete:   (id)   => apiRequest('/contact/index.php?id=' + id, 'DELETE'),
    },

    // ── Subjects ─────────────────────────────────────────────
    subjects: {
        list:   ()          => apiRequest('/subjects/index.php'),
        get:    (id)        => apiRequest('/subjects/index.php?id=' + id),
        create: (data)      => apiRequest('/subjects/index.php', 'POST', data),
        update: (id, data)  => apiRequest('/subjects/index.php?id=' + id, 'PUT', data),
        delete: (id)        => apiRequest('/subjects/index.php?id=' + id, 'DELETE')
    },

    // ── Timetable ────────────────────────────────────────────
    timetable: {
        get:    ()          => apiRequest('/timetable/index.php'),
        save:   (data)      => apiRequest('/timetable/index.php', 'POST', data),
        delete: (className, term) => apiRequest('/timetable/index.php?' + new URLSearchParams({ class_name: className, term }), 'DELETE')
    },

    // ── Hero Slides ──────────────────────────────────────────
    heroSlides: {
        list:   ()          => apiRequest('/hero_slides/index.php'),
        create: (data)      => apiRequest('/hero_slides/index.php', 'POST', data),
        setActive: (id)     => apiRequest('/hero_slides/index.php', 'POST', { action: 'set_active', id }),
        delete: (id)        => apiRequest('/hero_slides/index.php?id=' + id, 'DELETE')
    },

    // ── News ─────────────────────────────────────────────────
    news: {
        list:   ()          => apiRequest('/news/index.php'),
        get:    (id)        => apiRequest('/news/index.php?id=' + id),
        create: (data)      => apiRequest('/news/index.php', 'POST', data),
        update: (id, data)  => apiRequest('/news/index.php?id=' + id, 'PUT', data),
        delete: (id)        => apiRequest('/news/index.php?id=' + id, 'DELETE')
    },

    // ── Yearbook ─────────────────────────────────────────────
    yearbook: {
        list:   ()          => apiRequest('/yearbook/index.php'),
        save:   (data)      => apiRequest('/yearbook/index.php', 'POST', data),
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
    syncAllDataFromBackend().then(() => { if (typeof renderMain === 'function') renderMain(); });
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
    syncAllDataFromBackend().then(() => { if (typeof renderMain === 'function') renderMain(); });
}

async function logoutAPI() {
    await API.logout();
    if (typeof setSessionUser === 'function') setSessionUser(null);
    else window.SESSION_USER = null;
    logout(); // call the existing JS logout UI function
}

// ═══════════════════════════════════════════════════════════════
// MONOLITHIC APP OVERRIDES & SYNC HOOKS
// ═══════════════════════════════════════════════════════════════

// Helper to extract a reliable database integer ID from a student object/ID
function getStudentDbId(studentId) {
    if (!studentId) return 0;
    if (Number.isInteger(studentId)) return studentId;
    const num = parseInt(studentId, 10);
    if (!isNaN(num) && String(num) === String(studentId)) return num;

    const student = enrolledStudents.find(s => s.student_id === studentId || s.id == studentId);
    if (student && student.id) return student.id;

    if (typeof studentId === 'string' && studentId.includes('-')) {
        const parts = studentId.split('-');
        const parsed = parseInt(parts[parts.length - 1], 10);
        if (!isNaN(parsed)) return parsed;
    }
    const clean = parseInt(String(studentId).replace(/[^0-9]/g, ''), 10);
    return isNaN(clean) ? 0 : clean;
}

// Helper to extract a reliable database integer ID from a teacher/staff object/ID
function getTeacherDbId(teacherId) {
    if (!teacherId) return 0;
    if (Number.isInteger(teacherId)) return teacherId;
    const num = parseInt(teacherId, 10);
    if (!isNaN(num) && String(num) === String(teacherId)) return num;

    const teacher = teachersData.find(t => t.teacher_id === teacherId || t.id == teacherId);
    if (teacher && teacher.id) return teacher.id;

    if (typeof teacherId === 'string') {
        const clean = parseInt(teacherId.replace('T', ''), 10);
        if (!isNaN(clean)) return clean;
    }
    const clean = parseInt(String(teacherId).replace(/[^0-9]/g, ''), 10);
    return isNaN(clean) ? 0 : clean;
}

// Helper to extract a reliable database integer ID from an admission object/ID
function getAdmissionDbId(admId) {
    if (!admId) return 0;
    if (Number.isInteger(admId)) return admId;
    const num = parseInt(admId, 10);
    if (!isNaN(num) && String(num) === String(admId)) return num;

    const adm = admissionsData.find(a => a.adm_id === admId || a.id == admId);
    if (adm && adm.id) return adm.id;

    if (typeof admId === 'string') {
        const clean = parseInt(admId.replace('ADM', ''), 10);
        if (!isNaN(clean)) return clean;
    }
    const clean = parseInt(String(admId).replace(/[^0-9]/g, ''), 10);
    return isNaN(clean) ? 0 : clean;
}

// Sync utility to populate global arrays with data from backend MySQL APIs
async function syncAllDataFromBackend() {
    console.log("Syncing all data with MySQL backend...");

    try {
        const res = await API.dashboard();
        if (res && res.success && res.data) {
            window.dashboardReportData = res.data;
        }
    } catch (e) { console.error("Error syncing dashboard reports:", e); }

    // 1. Classes
    try {
        const res = await API.classes.list();
        if (res && res.success && res.data) {
            classesData.splice(0, classesData.length, ...res.data.map(c => ({
                class_id: 'C' + String(c.id).padStart(3, '0'),
                id: c.id,
                name: c.name,
                level: c.level,
                stream: c.stream,
                teacher: c.teacher_name || 'Not assigned',
                teacher_id: c.teacher_id ? 'T' + String(c.teacher_id).padStart(3, '0') : null,
                students: parseInt(c.student_count || 0, 10),
                capacity: parseInt(c.capacity || 40, 10),
                subjects: Array.isArray(c.subjects) ? c.subjects : (c.subjects ? c.subjects.split(',').map(s => s.trim()) : []),
                attendance: (parseFloat(c.attendance_avg || 0)) + '%'
            })));
        }
    } catch (e) { console.error("Error syncing classes:", e); }

    // 2. Staff/Teachers
    try {
        const res = await API.staff.list();
        if (res && res.success && res.data) {
            teachersData.splice(0, teachersData.length, ...res.data.filter(t => t.category === 'Teaching').map(t => ({
                teacher_id: 'T' + String(t.id).padStart(3, '0'),
                id: t.id,
                name: t.name,
                subject: t.subject || 'General',
                department: t.department || 'Academic',
                experience: String(t.experience || 0),
                email: t.email || '',
                phone: t.phone || '',
                class_assigned: t.class_assigned || 'Not Assigned',
                basicSalary: parseFloat(t.salary_grade) || 3000,
                allowances: Math.round((parseFloat(t.salary_grade) || 3000) * 0.25),
                deductions: Math.round((parseFloat(t.salary_grade) || 3000) * 0.10),
                schedule: t.schedule || 'Mon-Fri',
                gender: t.gender || 'Male',
                avatar_color: t.avatar_color || 'blue',
                dob: t.dob || '1990-01-01',
                address: t.address || '',
                hiring_date: t.join_date || '2020-01-01',
                archived_date: t.archived_at ? t.archived_at.split(' ')[0] : '',
                status: (t.status === 'Inactive' || t.status === 'Archived') ? 'Archived' : (t.status || 'Active')
            })));
        }
    } catch (e) { console.error("Error syncing staff:", e); }

    // 3. Students
    try {
        const res = await API.students.list();
        if (res && res.success && res.data) {
            enrolledStudents.splice(0, enrolledStudents.length, ...res.data.map(s => ({
                student_id: s.student_code || ('2024-' + String(s.id).padStart(4, '0')),
                id: s.id,
                name: s.name,
                class_id: s.class_id || null,
                student_class: s.class_name || 'Not Assigned',
                gender: s.gender || 'Male',
                dob: s.dob || '2015-01-01',
                attendance: (parseFloat(s.attendance || 0)) + '%',
                fees_status: s.fees_status || 'Pending',
                status: s.status || 'Active',
                avatar_color: s.avatar_color || ['blue', 'gold', 'purple', 'green', 'teal'][s.id % 5],
                gender_abbr: (s.gender || 'Male') === 'Male' ? 'M' : 'F',
                address: s.address || '',
                parent_name: s.guardian_name || '',
                parent_phone: s.guardian_phone || '',
                picture: s.photo || null,
                enrolled_date: s.created_at ? s.created_at.split(' ')[0] : new Date().toISOString().split('T')[0]
            })));
        }
    } catch (e) { console.error("Error syncing students:", e); }

    // 4. Parents
    try {
        const res = await API.parents.list();
        if (res && res.success && res.data) {
            parentsData.splice(0, parentsData.length, ...res.data.map(p => ({
                parent_id: 'P' + String(p.id).padStart(3, '0'),
                id: p.id,
                name: p.name,
                contact_person: p.contact_person || p.name,
                gender: p.gender || 'Not provided',
                avatar_color: p.avatar_color || ['blue', 'gold', 'purple', 'green', 'teal'][p.id % 5],
                phone: p.phone || '',
                email: p.email || '',
                address: p.address || '',
                children: p.children && p.children.length ? p.children.map(c => c.student_name + ' (' + (c.class_name || 'Not Assigned') + ')').join(', ') : 'None',
                child_records: p.children || [],
                fees_status: p.fees_status || 'No Children',
                occupation: p.occupation || 'Not provided'
            })));
        }
    } catch (e) { console.error("Error syncing parents:", e); }

    // 5. Admissions
    try {
        const res = await API.admissions.list({ limit: 200 });
        if (res && res.success && res.data) {
            admissionsData.splice(0, admissionsData.length, ...res.data.map(a => ({
                adm_id: 'ADM' + String(a.id).padStart(3, '0'),
                id: a.id,
                name: a.applicant_name,
                gender: a.gender || 'Male',
                dob: a.dob || '2015-01-01',
                class_applying: a.class_applying || '',
                address: a.address || '',
                parent_name: a.parent_name || '',
                parent_phone: a.parent_phone || '',
                parent_email: a.parent_email || '',
                photo: a.photo || null,
                picture: a.photo || null,
                status: a.status || 'Pending',
                notes: a.notes || '',
                created: a.applied_date || new Date().toISOString().split('T')[0]
            })));
            const fallbackCounts = admissionsData.reduce((counts, admission) => {
                const status = admission.status || 'Pending';
                counts[status] = (counts[status] || 0) + 1;
                counts.total += 1;
                return counts;
            }, { total: 0, Pending: 0, Approved: 0, Rejected: 0, Enrolled: 0 });
            window.ADMISSIONS_COUNTS = { ...fallbackCounts, ...(res.counts || {}) };
        }
    } catch (e) { console.error("Error syncing admissions:", e); }

    // 6. Subjects
    try {
        const res = await API.subjects.list();
        if (res && res.success && res.data) {
            subjectsData.splice(0, subjectsData.length, ...res.data.map(s => ({
                subject_id: 'SUB' + String(s.id).padStart(3, '0'),
                id: s.id,
                name: s.name,
                icon: s.icon || '',
                type: s.type || 'Core',
                teacher: s.teacher_name || '',
                teacher_id: s.teacher_id ? 'T' + String(s.teacher_id).padStart(3, '0') : null,
                classes: s.class_name || s.classes || '',
                class_id: s.class_id,
                hours: s.hours || '',
                description: s.description || ''
            })));
        }
    } catch (e) { console.error("Error syncing subjects:", e); }

    // 7. News Articles
    try {
        const res = await API.news.list();
        if (res && res.success && res.data) {
            newsArticles.splice(0, newsArticles.length, ...res.data.map(a => ({
                id: parseInt(a.id, 10),
                title: a.title,
                icon: a.icon || '📰',
                date: a.publish_date,
                category: a.category,
                desc: a.summary || '',
                content: a.content || '',
                status: a.status || 'Published'
            })));
        }
    } catch (e) { console.error("Error syncing news:", e); }

    // 8. Timetables
    try {
        const res = await API.timetable.get();
        if (res && res.success && res.data) {
            for (let k in timetablesData) delete timetablesData[k];
            Object.assign(timetablesData, res.data);
        }
    } catch (e) { console.error("Error syncing timetables:", e); }

    // 9. Exams, grades, and reports
    try {
        const res = await API.exams.list();
        if (res && res.success && res.data && Array.isArray(window.examsData)) {
            examsData.splice(0, examsData.length, ...res.data.map(e => ({
                id: parseInt(e.id, 10),
                subject: e.subject || '',
                class_id: e.class_id ? parseInt(e.class_id, 10) : null,
                className: e.class_name || '',
                date: e.exam_date || '',
                duration: parseInt(e.duration_minutes || 0, 10),
                venue: e.venue || '',
                invigilator_id: e.invigilator_id ? parseInt(e.invigilator_id, 10) : null,
                invigilator: e.invigilator_name || '',
                term: e.term || '',
                academic_year: e.academic_year || '',
                status: e.status || ''
            })));
        }
    } catch (e) { console.error("Error syncing exams:", e); }

    try {
        const res = await API.grades.list();
        if (res && res.success && res.data && Array.isArray(window.gradesData)) {
            gradesData.splice(0, gradesData.length, ...res.data.map(g => ({
                id: parseInt(g.id, 10),
                student_id: parseInt(g.student_id, 10),
                studentCode: g.student_code || '',
                studentName: g.student_name || '',
                className: g.class_name || '',
                subject: g.subject || '',
                classScore: parseFloat(g.class_score || 0),
                examScore: parseFloat(g.exam_score || 0),
                totalScore: parseFloat(g.total_score || 0),
                term: g.term || '',
                academic_year: g.academic_year || ''
            })));
        }
    } catch (e) { console.error("Error syncing grades:", e); }

    try {
        const res = await API.analytics();
        if (res && res.success && res.data) {
            window.reportsAnalyticsData = res.data;
        }
    } catch (e) { console.error("Error syncing report analytics:", e); }

    // 10. Yearbook
    try {
        const res = await API.yearbook.list();
        if (res && res.success && res.data) {
            const formatted = {};
            res.data.forEach(row => {
                formatted[row.year] = {
                    year: row.year,
                    title: row.title,
                    status: row.status,
                    totalGrads: parseInt(row.total_graduates || 0, 10),
                    totalPhotos: parseInt(row.total_photos || 0, 10),
                    coverImg: row.cover_image || '#1e3a8a',
                    ...(typeof row.layout === 'string' ? JSON.parse(row.layout) : row.layout || {})
                };
            });
            for (let k in YEARBOOK_DATA) delete YEARBOOK_DATA[k];
            Object.assign(YEARBOOK_DATA, formatted);
        }
    } catch (e) { console.error("Error syncing yearbook:", e); }

    // 10. Hero Slides
    try {
        const res = await API.heroSlides.list();
        if (res && res.success && res.data) {
            window.cachedHeroSlides = res.data;
        }
    } catch (e) { console.error("Error syncing hero slides:", e); }

    if (typeof renderSidebar === 'function') {
        renderSidebar();
    }
}

window.applyApiClientOverrides = function() {
    console.log("Applying API client overrides...");
    const apiOverrides = {};

    // Intercept original loadPersistentRecords to use MySQL API.
    loadPersistentRecords = async function() {
    await syncAllDataFromBackend();
    if (typeof renderMain === 'function') {
        renderMain();
    }
};

// Server-backed pages save through API overrides only.
saveStudentRecords = () => {};
saveTeacherRecords = () => {};
saveParentRecords = () => {};
saveAdmissionRecords = () => {};
saveSubjectRecords = () => {};

// ── SUBJECTS ACTIONS OVERRIDES ──────────────────────────
apiOverrides.submitSubjectForm = async function() {
    const icon = document.getElementById('add-subject-icon')?.value?.trim() || '';
    const name = document.getElementById('add-subject-name')?.value?.trim();
    const type = document.getElementById('add-subject-type')?.value;
    const teacherId = document.getElementById('add-subject-teacher')?.value;
    const classId = document.getElementById('add-subject-class-id')?.value;
    const hours = document.getElementById('add-subject-hours')?.value?.trim();
    const desc = document.getElementById('add-subject-desc')?.value?.trim();

    if (!name || !classId || !hours) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    const tId = teacherId ? parseInt(teacherId.replace('T', ''), 10) : null;
    const data = { icon, name, type, teacher_id: tId, class_id: parseInt(classId, 10), hours, description: desc };
    const res = await API.subjects.create(data);
    if (res && res.success) {
        showToast(`Subject "${name}" added successfully`, 'success');
        closeModal();
        await syncAllDataFromBackend();
        renderMain();
    } else {
        showToast(res?.message || 'Failed to add subject', 'error');
    }
};

apiOverrides.saveSubjectChanges = async function(subjectId) {
    const icon = document.getElementById('edit-subject-icon')?.value?.trim() || '';
    const name = document.getElementById('edit-subject-name')?.value?.trim();
    const type = document.getElementById('edit-subject-type')?.value;
    const teacherId = document.getElementById('edit-subject-teacher')?.value;
    const classId = document.getElementById('edit-subject-class-id')?.value;
    const hours = document.getElementById('edit-subject-hours')?.value?.trim();
    const desc = document.getElementById('edit-subject-desc')?.value?.trim();

    if (!name || !classId || !hours) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    const id = parseInt(subjectId.replace('SUB', ''), 10);
    const tId = teacherId ? parseInt(teacherId.replace('T', ''), 10) : null;
    const data = { icon, name, type, teacher_id: tId, class_id: parseInt(classId, 10), hours, description: desc };
    const res = await API.subjects.update(id, data);
    if (res && res.success) {
        showToast('Subject updated successfully', 'success');
        closeModal();
        await syncAllDataFromBackend();
        renderMain();
    } else {
        showToast(res?.message || 'Failed to update subject', 'error');
    }
};

apiOverrides.deleteSubject = async function(subjectId) {
    if (!confirm('Are you sure you want to delete this subject?')) return;
    const id = parseInt(subjectId.replace('SUB', ''), 10);
    const res = await API.subjects.delete(id);
    if (res && res.success) {
        showToast('Subject deleted successfully', 'success');
        await syncAllDataFromBackend();
        renderMain();
    } else {
        showToast(res?.message || 'Failed to delete subject', 'error');
    }
};

// ── TIMETABLE ACTIONS OVERRIDES ─────────────────────────
apiOverrides.saveNewTimetable = async function() {
    const clsEl = document.getElementById('create-tt-class');
    const termEl = document.getElementById('create-tt-term');
    if (!clsEl || !termEl) { showToast('Select class and term', 'error'); return; }
    const cls = clsEl.value, term = termEl.value;
    
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
    
    const res = await API.timetable.save({
        class_name: cls,
        term: term,
        timetable: schedule
    });
    if (res && res.success) {
        closeModal();
        window.selectedTimetableClass = cls;
        window.selectedTimetableTerm = term;
        await syncAllDataFromBackend();
        renderMain();
        showToast('<i class="fas fa-check-circle"></i> Timetable created successfully', 'success');
    } else {
        showToast(res?.message || 'Failed to create timetable', 'error');
    }
};

apiOverrides.saveEditedTimetable = async function(cls, term) {
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
    
    const res = await API.timetable.save({
        class_name: cls,
        term: term,
        timetable: schedule
    });
    if (res && res.success) {
        closeModal();
        await syncAllDataFromBackend();
        refreshTimetableView();
        showToast('<i class="fas fa-check-circle"></i> Timetable updated successfully', 'success');
    } else {
        showToast(res?.message || 'Failed to save timetable changes', 'error');
    }
};

apiOverrides.deleteTimetable = async function() {
    const cls = window.selectedTimetableClass || classesData[0].name;
    const termEl = document.getElementById('tt-term-select');
    const term = termEl ? termEl.value : 'Term 1, 2025';
    if (!timetablesData[cls] || !timetablesData[cls][term]) { showToast('No timetable to delete', 'warning'); return; }
    if (!confirm('Delete timetable for ' + cls + ' · ' + term + '?')) return;
    
    const res = await API.timetable.delete(cls, term);
    if (res && res.success) {
        await syncAllDataFromBackend();
        refreshTimetableView();
        showToast('<i class="fas fa-trash"></i> Timetable deleted', 'success');
    } else {
        showToast(res?.message || 'Failed to delete timetable', 'error');
    }
};

// ── HERO SLIDES ACTIONS OVERRIDES ───────────────────────
apiOverrides.getHeroSlides = function() {
    const slides = Object.values(window.cachedHeroSlides || []);
    return slides.sort((a,b) => (b.status === 'Active') - (a.status === 'Active'));
};

saveHeroSlides = () => {};

apiOverrides.uploadHeroSlide = async function() {
    const title = document.getElementById('hero-slide-title')?.value?.trim() || 'Glory Reign Preparatory School';
    const caption = document.getElementById('hero-slide-caption')?.value?.trim() || 'Nurturing minds, building character, and shaping futures.';
    const file = document.getElementById('hero-slide-file')?.files?.[0];

    if (!file) {
        showToast('<i class="fas fa-exclamation-triangle"></i> Please select a slide image file', 'warning');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(e) {
        const base64Img = e.target.result;
        const res = await API.heroSlides.create({
            title,
            caption,
            image: base64Img,
            status: 'Draft'
        });
        if (res && res.success) {
            showToast('<i class="fas fa-check-circle"></i> Hero slide uploaded', 'success');
            if (document.getElementById('hero-slide-title')) document.getElementById('hero-slide-title').value = '';
            if (document.getElementById('hero-slide-caption')) document.getElementById('hero-slide-caption').value = '';
            if (document.getElementById('hero-slide-file')) document.getElementById('hero-slide-file').value = '';
            
            const slidesRes = await API.heroSlides.list();
            if (slidesRes && slidesRes.success && slidesRes.data) {
                window.cachedHeroSlides = slidesRes.data;
            }
            renderMain();
        } else {
            showToast(res?.message || 'Failed to upload slide', 'error');
        }
    };
    reader.readAsDataURL(file);
};

apiOverrides.setHeroSlideActive = async function(slideId) {
    const res = await API.heroSlides.setActive(slideId);
    if (res && res.success) {
        showToast('<i class="fas fa-check-circle"></i> Hero slide activated', 'success');
        const slidesRes = await API.heroSlides.list();
        if (slidesRes && slidesRes.success && slidesRes.data) {
            window.cachedHeroSlides = slidesRes.data;
        }
        renderMain();
    } else {
        showToast(res?.message || 'Failed to activate slide', 'error');
    }
};

apiOverrides.deleteHeroSlide = async function(slideId) {
    if (!confirm('Are you sure you want to delete this hero slide?')) return;
    const res = await API.heroSlides.delete(slideId);
    if (res && res.success) {
        showToast('<i class="fas fa-check-circle"></i> Hero slide deleted', 'success');
        const slidesRes = await API.heroSlides.list();
        if (slidesRes && slidesRes.success && slidesRes.data) {
            window.cachedHeroSlides = slidesRes.data;
        }
        renderMain();
    } else {
        showToast(res?.message || 'Failed to delete slide', 'error');
    }
};

// ── NEWS ACTIONS OVERRIDES ──────────────────────────────
apiOverrides.publishNews = async function() {
    const title = document.getElementById('blogTitle')?.value?.trim() || '';
    const icon = document.getElementById('blogIcon')?.value?.trim() || '';
    const date = document.getElementById('blogDate')?.value || '';
    const category = document.getElementById('blogCategory')?.value || '';
    const desc = document.getElementById('blogDesc')?.value?.trim() || '';
    const content = document.getElementById('blogContent')?.value?.trim() || '';
    const status = document.getElementById('blogStatus')?.value || 'Published';

    if (!title || !icon || !date || !category || !desc || !content) {
        showToast('<i class="fas fa-exclamation-triangle"></i> Please fill in all required fields (*)', 'warning');
        return;
    }

    if (desc.length < 20) {
        showToast('<i class="fas fa-exclamation-triangle"></i> Description must be at least 20 characters', 'warning');
        return;
    }

    const data = { title, icon, publish_date: date, category, summary: desc, content, status };
    const res = await API.news.create(data);
    if (res && res.success) {
        showToast('<i class="fas fa-check-circle"></i> Article published successfully!', 'success');
        clearNewsForm();
        await syncAllDataFromBackend();
        renderMain();
    } else {
        showToast(res?.message || 'Failed to publish article', 'error');
    }
};

apiOverrides.saveArticleChanges = async function(articleId) {
    const title = document.getElementById('editTitle')?.value?.trim() || '';
    const icon = document.getElementById('editIcon')?.value?.trim() || '';
    const date = document.getElementById('editDate')?.value || '';
    const category = document.getElementById('editCategory')?.value || '';
    const desc = document.getElementById('editDesc')?.value?.trim() || '';
    const content = document.getElementById('editContent')?.value?.trim() || '';
    const status = document.getElementById('editStatus')?.value || 'Published';

    if (!title || !icon || !date || !category || !desc || !content) {
        showToast('<i class="fas fa-exclamation-triangle"></i> Please fill in all required fields', 'warning');
        return;
    }

    const data = { title, icon, publish_date: date, category, summary: desc, content, status };
    const res = await API.news.update(articleId, data);
    if (res && res.success) {
        showToast('<i class="fas fa-check-circle"></i> Article updated successfully!', 'success');
        closeModal();
        await syncAllDataFromBackend();
        renderMain();
    } else {
        showToast(res?.message || 'Failed to update article', 'error');
    }
};

apiOverrides.deleteArticle = async function(articleId) {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) return;
    const res = await API.news.delete(articleId);
    if (res && res.success) {
        showToast('<i class="fas fa-check-circle"></i> Article deleted successfully!', 'success');
        await syncAllDataFromBackend();
        renderMain();
    } else {
        showToast(res?.message || 'Failed to delete article', 'error');
    }
};

// ── YEARBOOK ACTIONS OVERRIDES ──────────────────────────
apiOverrides.adminYearbookModule = function() {
    const ybs = Object.values(YEARBOOK_DATA);
    const rows = ybs.map(yb => `
      <tr>
        <td><strong>${escapeHtml(yb.year)}</strong></td>
        <td>${escapeHtml(yb.title)}</td>
        <td><span class="badge b-${yb.status === 'Published' ? 'success' : 'warning'}">${escapeHtml(yb.status)}</span></td>
        <td>${yb.totalGrads || 0}</td>
        <td>${yb.totalPhotos || 0}</td>
        <td>
          <div style="display:flex;gap:6px">
            <button class="btn btn-secondary btn-xs" onclick="openYearbook('${yb.year}')">Preview</button>
            <button class="btn btn-secondary btn-xs" onclick="showToast('Edit mode enabled via database. Check back soon!', 'info')">Edit Content</button>
            ${yb.status === 'Draft' ? `<button class="btn btn-primary btn-xs" onclick="publishYearbook('${yb.year}')">Publish</button>` : ''}
          </div>
        </td>
      </tr>
    `).join('');

    return hdr('Yearbook Management', 'Create and manage digital yearbooks', 'Admin Yearbook') + `
    <div class="toolbar" style="margin-bottom:20px">
      <button class="btn btn-primary" onclick="openCreateYearbookModal()"><i class="fas fa-plus"></i> Create Yearbook</button>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title">Yearbook Editions</span></div>
      <table class="tbl">
        <thead><tr><th>Academic Year</th><th>Title</th><th>Status</th><th>Graduates</th><th>Photos</th><th>Actions</th></tr></thead>
        <tbody>
          ${rows || '<tr><td colspan="6" style="text-align:center;color:var(--gray-400);padding:24px">No yearbooks found.</td></tr>'}
        </tbody>
      </table>
    </div>`;
};

apiOverrides.openCreateYearbookModal = function() {
    openModal(`
      <div style="padding:24px;width:400px;max-width:90vw">
        <h3 style="margin-top:0;color:var(--blue-dark)"><i class="fas fa-plus-circle"></i> Create New Yearbook</h3>
        <div class="f-field" style="margin-top:20px"><label>Academic Year</label><input type="text" id="new-yb-year" placeholder="e.g. 2028"></div>
        <div class="f-field"><label>Yearbook Title</label><input type="text" id="new-yb-title" placeholder="Class of 2028 Yearbook"></div>
        <div class="f-field"><label>Cover Color Theme</label><input type="color" id="new-yb-theme" value="#1e3a8a" style="padding:0;height:40px;width:100%"></div>
        <div style="display:flex;gap:10px;margin-top:24px">
          <button class="btn btn-primary" style="flex:1" onclick="submitCreateYearbookForm()">Create</button>
          <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        </div>
      </div>
    `, true);
};

apiOverrides.submitCreateYearbookForm = async function() {
    const year = document.getElementById('new-yb-year')?.value?.trim();
    const title = document.getElementById('new-yb-title')?.value?.trim();
    const theme = document.getElementById('new-yb-theme')?.value;
    if (!year || !title) { showToast('Please enter both year and title', 'error'); return; }
    
    const res = await API.yearbook.save({
        year,
        title,
        cover_image: theme,
        status: 'Draft',
        total_graduates: 0,
        total_photos: 0,
        layout: {
            classes: [],
            teachers: [],
            events: [],
            tributes: []
        }
    });
    if (res && res.success) {
        showToast('Yearbook initialized successfully!', 'success');
        closeModal();
        await syncAllDataFromBackend();
        renderMain();
    } else {
        showToast(res?.message || 'Failed to create yearbook', 'error');
    }
};

apiOverrides.publishYearbook = async function(year) {
    const yb = YEARBOOK_DATA[year];
    if (!yb) return;
    const res = await API.yearbook.save({
        year: yb.year,
        title: yb.title,
        cover_image: yb.coverImg,
        status: 'Published',
        total_graduates: yb.totalGrads,
        total_photos: yb.totalPhotos,
        layout: {
            classes: yb.classes || [],
            teachers: yb.teachers || [],
            events: yb.events || [],
            tributes: yb.tributes || []
        }
    });
    if (res && res.success) {
        showToast('Yearbook published successfully!', 'success');
        await syncAllDataFromBackend();
        renderMain();
    } else {
        showToast(res?.message || 'Failed to publish yearbook', 'error');
    }
};

// ── STUDENTS ACTIONS OVERRIDES ──────────────────────────
apiOverrides.submitStudentEnrollment = async function() {
  const name = document.getElementById('std-name')?.value.trim();
  const dob = document.getElementById('std-dob')?.value;
  const gender = document.getElementById('std-gender')?.value;
  const classId = document.getElementById('std-class')?.value;
  const address = document.getElementById('std-address')?.value.trim();
  const parentName = document.getElementById('std-parent-name')?.value.trim();
  const parentPhone = document.getElementById('std-parent-phone')?.value.trim();

  if (!name || !dob || !gender || !classId) {
    showToast('<i class="fas fa-times-circle"></i> Please fill all required fields', 'error');
    return;
  }

  const res = await API.students.create({
    name,
    dob,
    gender,
    class_id: parseInt(classId, 10),
    address,
    guardian_name: parentName,
    guardian_phone: parentPhone,
    status: 'Active'
  });

  if (res && res.success) {
    showToast('<i class="fas fa-check-circle"></i> Student enrolled successfully!', 'success');
    await syncAllDataFromBackend();
    navTo('students');
  } else {
    showToast(res?.message || 'Failed to enroll student', 'error');
  }
};

apiOverrides.saveStudentChanges = async function(studentId) {
  const name = document.getElementById('edit-std-name')?.value.trim();
  const classId = document.getElementById('edit-std-class')?.value;
  const status = document.getElementById('edit-std-status')?.value;
  const address = document.getElementById('edit-std-address')?.value.trim();
  const parentName = document.getElementById('edit-std-parent-name')?.value.trim();
  const parentPhone = document.getElementById('edit-std-parent-phone')?.value.trim();

  if (!name || !classId) {
    showToast('<i class="fas fa-times-circle"></i> Please fill all required fields', 'error');
    return;
  }

  const id = getStudentDbId(studentId);
  if (!id) return;

  const res = await API.students.update(id, {
    name,
    class_id: parseInt(classId, 10),
    status,
    address,
    guardian_name: parentName,
    guardian_phone: parentPhone
  });

  if (res && res.success) {
    showToast('<i class="fas fa-check-circle"></i> Student updated successfully!', 'success');
    await syncAllDataFromBackend();
    viewStudent(studentId);
  } else {
    showToast(res?.message || 'Failed to update student', 'error');
  }
};

apiOverrides.withdrawStudent = async function(studentId) {
  if (!confirm('Are you sure you want to withdraw this student?')) return;
  const id = getStudentDbId(studentId);
  if (!id) return;
  
  const res = await API.students.update(id, { status: 'Withdrawn' });
  if (res && res.success) {
      showToast('<i class="fas fa-check-circle"></i> Student withdrawn', 'success');
      await syncAllDataFromBackend();
      navTo('students');
  } else {
      showToast(res?.message || 'Failed to withdraw student', 'error');
  }
};

apiOverrides.restoreStudent = async function(studentId) {
  const id = getStudentDbId(studentId);
  if (!id) return;
  
  const res = await API.students.update(id, { status: 'Active' });
  if (res && res.success) {
      showToast('<i class="fas fa-check-circle"></i> Student restored', 'success');
      await syncAllDataFromBackend();
      navTo('students');
  } else {
      showToast(res?.message || 'Failed to restore student', 'error');
  }
};

// ── TEACHERS ACTIONS OVERRIDES ──────────────────────────
apiOverrides.submitTeacherForm = async function() {
  const name = document.getElementById('teacher-name')?.value;
  const subject = document.getElementById('teacher-subject')?.value;
  const department = document.getElementById('teacher-department')?.value;
  const experience = document.getElementById('teacher-experience')?.value;
  const email = document.getElementById('teacher-email')?.value;
  const phone = document.getElementById('teacher-phone')?.value;
  const classAssigned = document.getElementById('teacher-class')?.value;
  const schedule = document.getElementById('teacher-schedule')?.value;
  
  const defaultBasic = typeof getTeacherPayrollBasic === 'function' ? getTeacherPayrollBasic({ experience }) : 3000;
  const basicSalary = Number(document.getElementById('teacher-basic')?.value || defaultBasic);

  if (!name || !subject || department === '-- Select --' || !experience || !email || !phone) {
    showToast('Please fill all required fields', 'error');
    return;
  }

  const res = await API.staff.create({
    name,
    email,
    phone,
    gender: 'Male',
    dob: document.getElementById('teacher-dob')?.value || '1990-01-01',
    category: 'Teaching',
    department,
    position: subject,
    qualifications: 'Degree',
    salary_grade: String(basicSalary),
    join_date: new Date().toISOString().split('T')[0],
    address: 'Glory Reign Campus',
    subject,
    class_assigned: classAssigned || 'Not Assigned',
    experience: parseInt(experience, 10),
    schedule: schedule || 'Mon-Fri',
    avatar_color: 'blue',
    status: 'Active'
  });

  if (res && res.success) {
    showToast('<i class="fas fa-check-circle"></i> Teacher added successfully!', 'success');
    await syncAllDataFromBackend();
    const returnToPayroll = window.returnToPayrollAfterTeacherAdd;
    window.returnToPayrollAfterTeacherAdd = false;
    navTo(returnToPayroll ? 'salary' : 'teachers');
  } else {
    showToast(res?.message || 'Failed to add teacher', 'error');
  }
};

apiOverrides.submitEditTeacher = async function(teacherId) {
  const id = getTeacherDbId(teacherId);
  if (!id) return showToast('Teacher not found', 'error');

  const name = document.getElementById('teacher-name')?.value;
  const subject = document.getElementById('teacher-subject')?.value;
  const department = document.getElementById('teacher-department')?.value;
  const experience = document.getElementById('teacher-experience')?.value;
  const email = document.getElementById('teacher-email')?.value;
  const phone = document.getElementById('teacher-phone')?.value;
  const classAssigned = document.getElementById('teacher-class')?.value;
  const schedule = document.getElementById('teacher-schedule')?.value;
  const basicSalary = Number(document.getElementById('teacher-basic')?.value || 3000);
  const status = document.getElementById('teacher-status')?.value || 'Active';

  if (!name || !subject || department === '-- Select --' || !experience || !email || !phone) {
    showToast('Please fill all required fields', 'error');
    return;
  }

  const res = await API.staff.update(id, {
    name,
    email,
    phone,
    department,
    position: subject,
    subject,
    class_assigned: classAssigned || 'Not Assigned',
    experience: parseInt(experience, 10),
    schedule: schedule || 'Mon-Fri',
    salary_grade: String(basicSalary),
    status: status === 'Archived' ? 'Inactive' : status
  });

  if (res && res.success) {
    showToast('<i class="fas fa-check-circle"></i> Teacher updated successfully!', 'success');
    await syncAllDataFromBackend();
    navTo('teachers');
  } else {
    showToast(res?.message || 'Failed to update teacher', 'error');
  }
};

apiOverrides.deleteTeacher = async function(teacherId) {
  if (!confirm('Are you sure you want to delete this teacher? This cannot be undone.')) return;
  const id = getTeacherDbId(teacherId);
  if (!id) return;

  const res = await API.staff.delete(id);
  if (res && res.success) {
    showToast('<i class="fas fa-check-circle"></i> Teacher deleted successfully!', 'success');
    await syncAllDataFromBackend();
    navTo('teachers');
  } else {
    showToast(res?.message || 'Failed to delete teacher', 'error');
  }
};

// Use window.* to guarantee these override the hoisted function declarations in script.js
apiOverrides.archiveTeacher = async function(teacherId) {
  console.log('[API] archiveTeacher called with:', teacherId);
  const id = getTeacherDbId(teacherId);
  if (!id) { console.error('[API] archiveTeacher: could not resolve DB id for', teacherId); return; }

  const res = await API.staff.update(id, { status: 'Inactive' });
  console.log('[API] archiveTeacher PUT result:', res);
  if (res && res.success) {
    showToast('<i class="fas fa-check-circle"></i> Teacher archived successfully!', 'success');
    // Optimistic in-memory update — mark teacher as Archived immediately
    navTo('teachers');
    // Background re-sync to keep data fresh
    syncAllDataFromBackend();
  } else {
    showToast(res?.message || 'Failed to archive teacher', 'error');
  }
};

apiOverrides.restoreTeacher = async function(teacherId) {
  console.log('[API] restoreTeacher called with:', teacherId);
  const id = getTeacherDbId(teacherId);
  if (!id) return;

  const res = await API.staff.update(id, { status: 'Active' });
  if (res && res.success) {
    showToast('<i class="fas fa-check-circle"></i> Teacher restored successfully!', 'success');
    // Optimistic in-memory update — mark teacher as Active immediately
    navTo('teachers');
    // Background re-sync to keep data fresh
    syncAllDataFromBackend();
  } else {
    showToast(res?.message || 'Failed to restore teacher', 'error');
  }
};

// Override viewArchivedTeachers to fetch directly from API — no stale in-memory reliance
apiOverrides.viewArchivedTeachers = async function() {
  document.getElementById('main-content').innerHTML = hdr('Archived Teachers', 'Teachers who have been archived', 'Teachers') +
    '<div class="toolbar"><button class="btn btn-secondary" onclick="navTo(\'teachers\')"><i class="fas fa-arrow-left"></i> Back to Teachers</button></div>' +
    '<div class="card records-table-card"><div class="table-wrapper"><table class="tbl"><thead><tr><th>#</th><th>Teacher</th><th>ID</th><th>Subject</th><th>Department</th><th>Class</th><th>Phone</th><th>Email</th><th>Archived Date</th><th>Actions</th></tr></thead><tbody id="archived-teachers-body"><tr><td colspan="10" style="text-align:center;padding:30px"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr></tbody></table></div></div>';

  const res = await API.staff.list({ limit: 200 });
  const tbody = document.getElementById('archived-teachers-body');
  if (!tbody) return;

  if (!res || !res.success) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;color:red">Failed to load archived teachers</td></tr>';
    return;
  }

  const archived = res.data.filter(t => t.category === 'Teaching' && (t.status === 'Inactive' || t.status === 'Archived'));
  if (!archived.length) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:30px;color:var(--gray-400)">No archived teachers</td></tr>';
    return;
  }

  tbody.innerHTML = archived.map((t, i) => {
    const tid = 'T' + String(t.id).padStart(3, '0');
    return `<tr>
      <td>${i + 1}</td>
      <td>${t.name}</td>
      <td>${tid}</td>
      <td>${t.subject || '-'}</td>
      <td>${t.department || '-'}</td>
      <td>${t.class_assigned || '-'}</td>
      <td>${t.phone || '-'}</td>
      <td>${t.email || '-'}</td>
      <td>${t.archived_at ? String(t.archived_at).split(' ')[0] : 'Not recorded'}</td>
      <td>
        <button class="btn btn-secondary btn-xs" onclick="viewTeacherProfile('${tid}')">View</button>
        <button class="btn btn-primary btn-xs" style="margin-left:6px" onclick="restoreTeacher('${tid}')">Restore</button>
      </td>
    </tr>`;
  }).join('');
};

// ── CLASSES ACTIONS OVERRIDES ───────────────────────────
apiOverrides.createClass = async function() {
  if (currentRole !== 'Admin') {
    showToast('Only administrators can create classes', 'error');
    return;
  }

  const name = document.getElementById('new-class-name')?.value.trim();
  const levelVal = document.getElementById('new-class-level')?.value;
  const stream = document.getElementById('new-class-stream')?.value;
  const teacherId = document.getElementById('new-class-teacher')?.value;
  const capacity = document.getElementById('new-class-capacity')?.value;
  const subjects = Array.from(document.querySelectorAll('input[name="class-subjects"]:checked')).map(el => el.value);

  if (!name || !levelVal || !stream || !capacity) {
    showToast('<i class="fas fa-times-circle"></i> Please fill all required fields', 'error');
    return;
  }

  const teacher = teachersData.find(t => t.teacher_id === teacherId);
  const dbTeacherId = teacher ? teacher.id : null;

  const res = await API.classes.create({
    name,
    level: levelVal,
    stream,
    teacher_id: dbTeacherId,
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
};

apiOverrides.saveClassChanges = async function(classId) {
  if (currentRole !== 'Admin') {
    showToast('Only administrators can manage classes', 'error');
    return;
  }

  const clsObj = classesData.find(c => c.class_id === classId);
  if (!clsObj) {
    showToast('<i class="fas fa-times-circle"></i> Class not found', 'error');
    return;
  }

  const name = document.getElementById('manage-class-name')?.value.trim();
  const levelVal = document.getElementById('manage-class-level')?.value;
  const stream = document.getElementById('manage-class-stream')?.value;
  const teacherId = document.getElementById('manage-class-teacher')?.value;
  const capacity = document.getElementById('manage-class-capacity')?.value;
  const subjects = Array.from(document.querySelectorAll('input[name="class-subjects"]:checked')).map(el => el.value);

  if (!name || !levelVal || !stream || !capacity) {
    showToast('<i class="fas fa-times-circle"></i> Please fill all required fields', 'error');
    return;
  }

  const teacher = teachersData.find(t => t.teacher_id === teacherId);
  const dbTeacherId = teacher ? teacher.id : null;

  const res = await API.classes.update(clsObj.id, {
    name,
    level: levelVal,
    stream,
    teacher_id: dbTeacherId,
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
};

apiOverrides.deleteClass = async function(classId) {
  if (currentRole !== 'Admin') {
    showToast('Only administrators can delete classes', 'error');
    return;
  }

  if (!confirm('Are you sure you want to delete this class? This cannot be undone.')) return;

  const clsObj = classesData.find(c => c.class_id === classId);
  if (!clsObj) {
    showToast('<i class="fas fa-times-circle"></i> Class not found', 'error');
    return;
  }

  const res = await API.classes.delete(clsObj.id);

  if (res && res.success) {
    showToast('<i class="fas fa-check-circle"></i> Class deleted successfully', 'success');
    await syncAllDataFromBackend();
    navTo('classes');
  } else {
    showToast(res?.message || 'Failed to delete class', 'error');
  }
};

// ── ADMISSIONS ACTIONS OVERRIDES ────────────────────────
apiOverrides.approveAdmission = async function(admId, studentName) {
  const id = getAdmissionDbId(admId);
  if (!id) return;
  const res = await API.admissions.updateStatus(id, 'Approved', 'Approved by administrator');
  if (res && res.success) {
      showToast('<i class="fas fa-check-circle"></i> Admission Approved!', 'success');
      await syncAllDataFromBackend();
      renderMain('admissions');
  } else {
      showToast(res?.message || 'Failed to approve admission', 'error');
  }
};

apiOverrides.rejectAdmission = async function(admId) {
  if (!confirm('Are you sure you want to reject this application?')) return;
  const id = getAdmissionDbId(admId);
  if (!id) return;
  const res = await API.admissions.updateStatus(id, 'Rejected', 'Rejected by administrator');
  if (res && res.success) {
      showToast('Application rejected.', 'info');
      await syncAllDataFromBackend();
      renderMain('admissions');
  } else {
      showToast(res?.message || 'Failed to reject admission', 'error');
  }
};

apiOverrides.saveParentChanges = async function(parentId) {
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

  const id = parseInt(String(parentId).replace(/[^0-9]/g, ''), 10);
  if (!id) return showToast('Parent not found', 'error');

  const res = await API.parents.update(id, {
    name,
    contact_person: contactPerson,
    gender,
    phone,
    email,
    occupation,
    address,
    children
  });

  if (res && res.success) {
    showToast('<i class="fas fa-check-circle"></i> Parent updated successfully!', 'success');
    await syncAllDataFromBackend();
    navTo('parents');
  } else {
    showToast(res?.message || 'Failed to update parent', 'error');
  }
};

apiOverrides.deleteRecord = async function(id, type) {
  if (currentRole !== 'Admin') {
    showToast('Only administrators can delete records', 'error', 3000);
    return;
  }

  if (type === 'Teacher') {
    archiveTeacher(id);
    return;
  }

  if (type === 'Student') {
    withdrawStudent(id);
    return;
  }

  if (confirm(`Are you sure you want to delete this ${type}?`)) {
    if (type === 'Parent') {
      const dbId = parseInt(String(id).replace(/[^0-9]/g, ''), 10);
      const res = await API.parents.delete(dbId);
      if (res && res.success) {
        showToast('<i class="fas fa-check-circle"></i> Parent deleted successfully!', 'success');
        await syncAllDataFromBackend();
        navTo('parents');
      } else {
        showToast(res?.message || 'Failed to delete parent', 'error');
      }
    } else if (type === 'Admission') {
      const dbId = getAdmissionDbId(id);
      const res = await API.admissions.updateStatus(dbId, 'Rejected', 'Deleted by Administrator');
      if (res && res.success) {
        showToast('<i class="fas fa-check-circle"></i> Admission record deleted!', 'success');
        await syncAllDataFromBackend();
        navTo('admissions');
      } else {
        showToast(res?.message || 'Failed to delete admission record', 'error');
      }
    } else {
      showToast('<i class="fas fa-check-circle"></i> Record deleted!', 'success');
    }
  }
};

apiOverrides.archiveTeacher = async function(teacherId) {
  const id = getTeacherDbId(teacherId);
  if (!id) return showToast('Teacher not found', 'error');
  const res = await API.staff.update(id, { status: 'Inactive' });
  if (res && res.success) {
    showToast('<i class="fas fa-check-circle"></i> Teacher archived successfully!', 'success');
    await syncAllDataFromBackend();
    navTo('teachers');
  } else {
    showToast(res?.message || 'Failed to archive teacher', 'error');
  }
};

apiOverrides.restoreTeacher = async function(teacherId) {
  const id = getTeacherDbId(teacherId);
  if (!id) return showToast('Teacher not found', 'error');
  const res = await API.staff.update(id, { status: 'Active' });
  if (res && res.success) {
    showToast('<i class="fas fa-check-circle"></i> Teacher restored successfully!', 'success');
    await syncAllDataFromBackend();
    navTo('teachers');
  } else {
    showToast(res?.message || 'Failed to restore teacher', 'error');
  }
};

apiOverrides.viewArchivedTeachers = async function() {
  document.getElementById('main-content').innerHTML = hdr('Archived Teachers', 'Teachers who have been archived', 'Teachers') +
    '<div class="toolbar"><button class="btn btn-secondary" onclick="navTo(\'teachers\')"><i class="fas fa-arrow-left"></i> Back to Teachers</button></div>' +
    '<div class="card records-table-card"><div class="table-wrapper"><table class="tbl"><thead><tr><th>#</th><th>Teacher</th><th>ID</th><th>Subject</th><th>Department</th><th>Class</th><th>Phone</th><th>Email</th><th>Archived Date</th><th>Actions</th></tr></thead><tbody id="archived-teachers-body"><tr><td colspan="10" style="text-align:center;padding:30px"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr></tbody></table></div></div>';

  const res = await API.staff.list({ limit: 200 });
  const tbody = document.getElementById('archived-teachers-body');
  if (!tbody) return;
  if (!res || !res.success) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;color:red">Failed to load archived teachers</td></tr>';
    return;
  }

  teachersData.splice(0, teachersData.length, ...res.data.filter(t => t.category === 'Teaching').map(t => ({
    teacher_id: 'T' + String(t.id).padStart(3, '0'),
    id: t.id,
    name: t.name,
    subject: t.subject || 'General',
    department: t.department || 'Academic',
    experience: String(t.experience || 0),
    email: t.email || '',
    phone: t.phone || '',
    class_assigned: t.class_assigned || 'Not Assigned',
    basicSalary: parseFloat(t.salary_grade) || 3000,
    allowances: Math.round((parseFloat(t.salary_grade) || 3000) * 0.25),
    deductions: Math.round((parseFloat(t.salary_grade) || 3000) * 0.10),
    schedule: t.schedule || 'Mon-Fri',
    gender: t.gender || 'Male',
    avatar_color: t.avatar_color || 'blue',
    dob: t.dob || '1990-01-01',
    address: t.address || '',
    hiring_date: t.join_date || '2020-01-01',
    archived_date: t.archived_at ? t.archived_at.split(' ')[0] : '',
    status: (t.status === 'Inactive' || t.status === 'Archived') ? 'Archived' : (t.status || 'Active')
  })));

  const archived = res.data.filter(t => t.category === 'Teaching' && (t.status === 'Inactive' || t.status === 'Archived'));
  if (!archived.length) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:30px;color:var(--gray-400)">No archived teachers</td></tr>';
    return;
  }

  tbody.innerHTML = archived.map((t, i) => {
    const tid = 'T' + String(t.id).padStart(3, '0');
    const archivedDate = t.archived_at ? String(t.archived_at).split(' ')[0] : 'Not recorded';
    return `<tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(t.name || '')}</td>
      <td>${tid}</td>
      <td>${escapeHtml(t.subject || '-')}</td>
      <td>${escapeHtml(t.department || '-')}</td>
      <td>${escapeHtml(t.class_assigned || '-')}</td>
      <td>${escapeHtml(t.phone || '-')}</td>
      <td>${escapeHtml(t.email || '-')}</td>
      <td>${escapeHtml(archivedDate)}</td>
      <td>
        <button class="btn btn-secondary btn-xs" onclick="viewTeacherProfile('${tid}')">View</button>
        <button class="btn btn-primary btn-xs" style="margin-left:6px" onclick="restoreTeacher('${tid}')">Restore</button>
      </td>
    </tr>`;
  }).join('');
};

    Object.assign(window, apiOverrides);
};

// Run overrides immediately as script is loaded after script.js
window.applyApiClientOverrides();
