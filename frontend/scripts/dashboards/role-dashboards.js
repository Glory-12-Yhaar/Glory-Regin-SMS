// ADMIN DASHBOARD
// -----------------------------------
function getCurrentDateString() {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  return `${day}, ${date} ${month} ${year}`;
}

function formatDashboardActivityTime(value) {
  if (!value) return '';
  const date = new Date(String(value).replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return String(value);
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

function getDashboardAssignments() {
  return Array.isArray(window.assignmentsData) ? window.assignmentsData : [];
}

function formatDashboardDueDate(value) {
  if (!value) return 'TBD';
  const due = new Date(value);
  if (Number.isNaN(due.getTime())) return value;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diff = Math.round((due - today) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff < 0) return 'Overdue';
  return due.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

function studentHasSubmittedAssignment(assignment, studentId) {
  const id = parseInt(studentId, 10);
  return Array.isArray(assignment.submittedStudentIds) && assignment.submittedStudentIds.includes(id);
}

const ADMIN_DASHBOARD_STATE = {
  loaded: false,
  dashboard: {},
  analytics: {},
  recentStudents: [],
  classesOverview: [],
  subjectPerformance: [],
  finance: {
    payments: [],
    collected: 0,
    outstanding: 0,
    paidCount: 0,
    partialCount: 0,
    pendingCount: 0,
    totalCount: 1
  },
  recentActivity: []
};

function adminDash() {
  const totalStudents = ADMIN_DASHBOARD_STATE.dashboard.total_students ?? '—';
  const totalTeachers = ADMIN_DASHBOARD_STATE.dashboard.total_teachers ?? '—';
  const pendingFees = ADMIN_DASHBOARD_STATE.dashboard.fees_pending_count ?? '—';
  const finance = ADMIN_DASHBOARD_STATE.finance;
  const paidPct = finance.totalCount ? Math.round((finance.paidCount / finance.totalCount) * 100) : 0;
  const partialPct = finance.totalCount ? Math.round((finance.partialCount / finance.totalCount) * 100) : 0;
  const pendingPct = Math.max(0, 100 - paidPct - partialPct);
  const recentStudents = ADMIN_DASHBOARD_STATE.recentStudents.length
    ? ADMIN_DASHBOARD_STATE.recentStudents
    : [{ name: 'Loading student records...', student_class: '', status: 'Loading', fees_status: 'Loading' }];

  const statsCards = [
    statCard('<i class="fas fa-graduation-cap"></i>', '' + totalStudents, 'Total Students', 'Open records', 'up', 'si-blue', true, 'navTo("students")'),
    statCard('<i class="fas fa-chalkboard-user"></i>', '' + totalTeachers, 'Total Teachers', 'Staff records', 'up', 'si-gold', true, 'navTo("teachers")'),
    statCard('<i class="fas fa-money-bill"></i>', 'GH₵' + Number(finance.collected).toLocaleString(), 'Fees Collected', finance.payments.length + ' payments', 'up', 'si-green', true, 'navTo("fees")'),
    statCard('<i class="fas fa-exclamation-triangle"></i>', '' + pendingFees, 'Pending Fees', 'Needs attention', 'dn', 'si-red', true, 'navTo("fees")')
  ].join('');
  const monthlySeries = ADMIN_DASHBOARD_STATE.dashboard.monthly_enrollment_attendance || [];
  const maxEnrollment = Math.max(1, ...monthlySeries.map(row => Number(row.enrollment || 0)));
  const enrollmentBars = (monthlySeries.length ? monthlySeries : [{ month: 'No data', enrollment: 0, attendance: 0 }]).map((row) => {
    const count = Number(row.enrollment || 0);
    const attendance = Number(row.attendance || 0);
    const enrollmentHeight = count ? Math.max(8, Math.round((count / maxEnrollment) * 130)) : 8;
    const attendanceHeight = attendance ? Math.max(8, Math.round((attendance / 100) * 130)) : 8;
    return `
        <div style="flex:1;display:flex;gap:2px;align-items:flex-end">
          <div title="${escapeAttr(row.month || '')} enrollment: ${count}" data-animate-height="${enrollmentHeight}px" style="flex:1;height:${enrollmentHeight}px;background:var(--blue-main);border-radius:3px 3px 0 0;opacity:.85;transition:height .65s ease"></div>
          <div title="${escapeAttr(row.month || '')} attendance: ${attendance}%" data-animate-height="${attendanceHeight}px" style="flex:1;height:${attendanceHeight}px;background:var(--gold);border-radius:3px 3px 0 0;opacity:.75;transition:height .65s ease"></div>
        </div>`;
  }).join('');
  const monthLabels = (monthlySeries.length ? monthlySeries.map(row => row.month) : ['No data'])
    .map(m => `<span>${escapeHtml(m)}</span>`).join('');
  const recentStudentRows = recentStudents.map((student, index) => [student.name, student.student_class || student.class || 'Unassigned', student.status || 'Active', student.fees_status || student.feeStatus || 'Pending', ['blue', 'gold', 'purple', 'green', 'teal'][index % 5]]).map(([n, c, s, f, av]) => `
          <tr style="cursor:pointer" onclick="navTo('students')">
            <td><div style="display:flex;align-items:center;gap:9px"><div class="av av-sm av-${av}">${n[0]}</div><strong>${n}</strong></div></td>
            <td>${c}</td>
            <td><span class="badge b-success">${s}</span></td>
            <td><span class="badge ${f === 'Paid' ? 'b-success' : f === 'Pending' ? 'b-danger' : 'b-warning'}">${f}</span></td>
          </tr>`).join('');
  const activityRows = (ADMIN_DASHBOARD_STATE.recentActivity.length
    ? ADMIN_DASHBOARD_STATE.recentActivity
    : [{ color: 'blue', message: 'No recent database activity yet', activity_time: '' }]
  ).map(({ color: c, message: t, activity_time: time }) => `
        <div class="act-item">
          <div class="act-dot" style="background:var(--${c === 'blue' ? 'blue-main' : c === 'green' ? 'success' : c === 'red' ? 'danger' : c === 'purple' ? 'purple' : 'gold'})"></div>
          <div class="act-content"><div class="act-text">${escapeHtml(t || '')}</div><div class="act-time">${formatDashboardActivityTime(time)}</div></div>
        </div>`).join('');
  const ringCircumference = Math.PI * 100;

  return hdr('Admin Dashboard', 'Welcome back, Administrator · ' + getCurrentDateString()) +
    renderPageTemplate('pages/dashboards/admin/index.html', {
      statsCards,
      enrollmentBars,
      monthLabels,
      calendar: mini_cal(),
      recentStudentRows,
      activityRows,
      classesOverview: getAdminDashboardClassesOverviewHtml(),
      paidPct,
      partialPct,
      pendingPct,
      ringCircumference,
      paidDash: ringCircumference * paidPct / 100,
      partialDash: ringCircumference * partialPct / 100,
      subjectPerformance: getAdminDashboardSubjectPerformanceHtml()
    });
}

function getAdminDashboardClassesOverviewHtml() {
  if (!ADMIN_DASHBOARD_STATE.loaded) {
    return '<div style="padding:24px;text-align:center;color:var(--gray-400)">Loading classes overview...</div>';
  }
  if (!ADMIN_DASHBOARD_STATE.classesOverview.length) {
    return '<div style="padding:24px;text-align:center;color:var(--gray-400)">No classes found.</div>';
  }
  const classes = ADMIN_DASHBOARD_STATE.classesOverview.slice(0, 3);
  return classes.map(cls => {
    const percentage = cls.student_count && cls.student_count > 0 ? Math.min(100, Math.round((cls.student_count / Math.max(cls.student_count, 1)) * 100)) : 0;
    return `
      <div style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px">
          <span style="font-weight:600">${escapeHtml(cls.name)}</span>
          <span style="color:var(--gray-500)">${cls.student_count} students</span>
        </div>
        <div class="prog-bar"><div class="prog-fill pf-blue" style="width:${percentage}%"></div></div>
      </div>`;
  }).join('');
}

function getAdminDashboardSubjectPerformanceHtml() {
  if (!ADMIN_DASHBOARD_STATE.loaded) {
    return '<div style="padding:24px;text-align:center;color:var(--gray-400)">Loading subject performance...</div>';
  }
  if (!ADMIN_DASHBOARD_STATE.subjectPerformance.length) {
    return '<div style="padding:24px;text-align:center;color:var(--gray-400)">No performance analytics available.</div>';
  }
  return ADMIN_DASHBOARD_STATE.subjectPerformance.slice(0, 5).map(sub => `
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
          <span>${escapeHtml(sub.subject)}</span><span style="color:var(--blue-main);font-weight:700">${sub.averageScore}%</span>
        </div>
        <div class="prog-bar"><div class="prog-fill pf-blue" style="width:${Math.min(100, Math.round(sub.averageScore))}%"></div></div>
      </div>`).join('');
}

async function fetchAdminDashboardData() {
  try {
    const [dashboardRes, analyticsRes, studentsRes, classesRes] = await Promise.all([
      API.dashboard(),
      API.analytics(),
      API.students.list({ limit: 5 }),
      API.classes.list()
    ]);

    if (dashboardRes?.success) {
      ADMIN_DASHBOARD_STATE.dashboard = dashboardRes.data || {};
      ADMIN_DASHBOARD_STATE.finance = {
        payments: [],
        collected: dashboardRes.data?.total_fees_collected || 0,
        outstanding: dashboardRes.data?.total_fees_outstanding || 0,
        paidCount: dashboardRes.data?.fees_paid_count || 0,
        partialCount: dashboardRes.data?.fees_partial_count || 0,
        pendingCount: dashboardRes.data?.fees_pending_count || 0,
        totalCount: Math.max(1, (dashboardRes.data?.fees_paid_count || 0) + (dashboardRes.data?.fees_partial_count || 0) + (dashboardRes.data?.fees_pending_count || 0))
      };
      ADMIN_DASHBOARD_STATE.recentActivity = dashboardRes.data?.recent_activity || [];
    }

    if (analyticsRes?.success) {
      ADMIN_DASHBOARD_STATE.analytics = analyticsRes.data?.analytics || {};
      ADMIN_DASHBOARD_STATE.subjectPerformance = Object.entries(ADMIN_DASHBOARD_STATE.analytics.subjectPerformance || {}).map(([subject, data]) => ({
        subject,
        averageScore: Number(data.averageScore || 0)
      })).sort((a, b) => b.averageScore - a.averageScore);
    }

    if (studentsRes?.success) {
      ADMIN_DASHBOARD_STATE.recentStudents = studentsRes.data || [];
    }

    if (classesRes?.success) {
      ADMIN_DASHBOARD_STATE.classesOverview = classesRes.data || [];
    }

    ADMIN_DASHBOARD_STATE.loaded = true;
    if (currentRole === 'Admin' && currentMod === 'dashboard') {
      const main = document.getElementById('main-content');
      if (main) {
        main.innerHTML = adminDash();
        initDashboardInteractivity();
      }
    }
  } catch (err) {
    console.error('Failed to load admin dashboard data', err);
  }
}

// -----------------------------------
// TEACHER DASHBOARD
// -----------------------------------
function teacherDash() {
  const teacher = getCurrentTeacherProfile() || { name: 'Teacher', department: 'Academics', subject: 'Assigned Subjects' };
  const myClasses = getVisibleClassesForRole(classesData);
  const myClassNames = myClasses.map(c => c.name);
  const myStudents = getVisibleStudentsForRole(enrolledStudents);
  const mySubjects = getVisibleSubjectsForRole(subjectsData);
  const attendanceAverage = myClasses.length
    ? Math.round(myClasses.reduce((sum, c) => sum + parseFloat(c.attendance), 0) / myClasses.length)
    : 0;
  const teacherAssignments = getDashboardAssignments().filter(a => myClassNames.includes(a.className || a.class));
  const scheduleRows = mySubjects.slice(0, 5).map((s, i) => [
    ['7:30-8:20', '8:20-9:10', '10:00-10:50', '11:00-11:50', '13:30-14:20'][i] || '14:20-15:10',
    s.name,
    myClassNames[i % Math.max(myClassNames.length, 1)] || s.classes,
    'Room ' + String(8 + i).padStart(2, '0'),
    i < 1 ? 'Done' : i === 1 ? 'Up Next' : 'Upcoming'
  ]);
  const attendanceStudents = myStudents.slice(0, 8);

  const statsCards = [
    statCard('<i class="fas fa-building"></i>', myClasses.length, 'My Classes', 'Assigned only', 'neu', 'si-blue', true, 'navTo("classes")'),
    statCard('<i class="fas fa-graduation-cap"></i>', myStudents.length, 'My Students', 'Assigned classes', 'neu', 'si-green', true, 'navTo("students")'),
    statCard('<i class="fas fa-book"></i>', mySubjects.length, 'My Subjects', teacher.subject, 'neu', 'si-gold', true, 'navTo("subjects")'),
    statCard('<i class="fas fa-check-circle"></i>', attendanceAverage + '%', 'Attendance Rate', 'My classes', 'up', 'si-purple', true, 'navTo("attendance")')
  ].join('');
  const scheduleRowsHtml = scheduleRows.map(([t, s, c, r, st]) => `
          <tr style="cursor:pointer" onclick="viewScheduleDetail('${t}', '${s}', '${c}')">
            <td style="color:var(--blue-main);font-weight:600">${t}</td>
            <td>${s}</td><td>${c}</td><td style="color:var(--gray-500)">${r}</td>
            <td><span class="badge ${st === 'Done' ? 'b-success' : st === 'Up Next' ? 'b-warning' : 'b-info'}">${st}</span></td>
          </tr>`).join('');
  const assignmentCards = teacherAssignments.length ? teacherAssignments.slice(0, 4).map(a => {
        const submitted = parseInt(a.submittedCount || 0, 10);
        const total = parseInt(a.totalStudents || 0, 10) || myStudents.filter(s => s.student_class === (a.className || a.class)).length || 1;
        return `
      <div style="margin-bottom:16px;cursor:pointer;padding:8px;border-radius:6px;transition:all 0.2s" onmouseover="this.style.background='var(--gray-50)'" onmouseout="this.style.background='transparent'" onclick="viewAssignmentSubmissions('${escapeHtml(a.title)}')">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
          <span style="font-size:13px;font-weight:600">${escapeHtml(a.title)}</span>
          <span class="badge b-info">${escapeHtml(formatDashboardDueDate(a.dueDate))}</span>
        </div>
        <div style="font-size:11px;color:var(--gray-500);margin-bottom:6px">${escapeHtml(a.class)} · ${submitted}/${total} submitted</div>
        <div class="prog-bar"><div class="prog-fill pf-gold" style="width:${Math.round(submitted / total * 100)}%"></div></div>
      </div>`}).join('') : '<div style="padding:20px;color:var(--gray-400);text-align:center">No assignments for your assigned classes yet.</div>';
  const messageRows = getTeacherMessages().map(m => `
        <div class="chat-msg ${m.fromTeacher ? 'me' : ''}">
          <div class="av av-sm av-${m.fromTeacher ? 'blue' : 'green'}">${(m.from||' ')[0]}</div>
          <div><div class="chat-bubble ${m.fromTeacher ? 'me-bubble' : 'them'}">${escapeHtml(m.text)}</div><div class="chat-meta ${m.fromTeacher ? 'me' : ''}">${m.fromTeacher ? 'You' : escapeHtml(m.from)} · ${m.time}</div></div>
        </div>`).join('');

  return hdr('Teacher Dashboard', 'Welcome, ' + teacher.name + ' · ' + teacher.department + ' · ' + (myClassNames.join(', ') || 'No assigned class') + ' · ' + getCurrentDateString()) +
    renderPageTemplate('pages/dashboards/teacher/index.html', {
      statsCards,
      scheduleRows: scheduleRowsHtml,
      assignmentCards,
      primaryClass: myClassNames[0] || 'Assigned Class',
      messageRows
    });
}

// -----------------------------------
// STUDENT DASHBOARD
// -----------------------------------

// Calculate class standing based on student performance
function calculateClassStanding(studentName) {
  const student = STUDENTS_DATA[studentName];
  if (!student) return { standing: 'Good Standing', rank: 'Current record', trend: 'neu' };

  // Calculate total score for the student
  function getTotalScore(scores) {
    return Object.values(scores).reduce((sum, { classScore, examScore }) => sum + classScore + examScore, 0);
  }

  const studentTotal = getTotalScore(student.scores);
  const studentClass = student.class;

  // Get all students in the same class and their scores
  const classmates = Object.entries(STUDENTS_DATA)
    .filter(([_, data]) => data.class === studentClass)
    .map(([name, data]) => ({
      name,
      total: getTotalScore(data.scores)
    }))
    .sort((a, b) => b.total - a.total); // Sort descending (highest first)

  // Find student's rank
  const studentRank = classmates.findIndex(c => c.name === studentName) + 1;
  const totalStudents = classmates.length;
  const percentile = Math.round((studentRank / totalStudents) * 100);

  // Determine standing based on percentile
  let standing = 'Average';
  let trend = 'neu';

  if (percentile <= 10) {
    standing = 'Top Performer';
    trend = 'up';
  } else if (percentile <= 25) {
    standing = 'High Achiever';
    trend = 'up';
  } else if (percentile <= 50) {
    standing = 'Good Performance';
    trend = 'up';
  } else if (percentile <= 75) {
    standing = 'Average';
    trend = 'neu';
  } else {
    standing = 'Needs Improvement';
    trend = 'dn';
  }

  return {
    standing,
    rank: `Rank ${studentRank} of ${totalStudents}`,
    trend
  };
}

// Get number of subjects for a student's class
function getStudentSubjectsCount(studentClass) {
  return SUBJECTS_BY_CLASS[studentClass] ? SUBJECTS_BY_CLASS[studentClass].length : 0;
}

// Get student's attendance percentage
function getStudentAttendance(studentName) {
  const student = STUDENTS_DATA[studentName];
  if (student) return student.attendance;
  const currentStudent = getCurrentStudentRecord();
  return parseFloat(currentStudent.attendance) || 0;
}

// Determine attendance trend and description
function getAttendanceTrend(percentage) {
  let trend = 'neu';
  let description = 'Average attendance';

  if (percentage >= 95) {
    trend = 'up';
    description = 'Excellent record';
  } else if (percentage >= 85) {
    trend = 'up';
    description = 'Good record';
  } else if (percentage >= 75) {
    trend = 'neu';
    description = 'Average attendance';
  } else {
    trend = 'dn';
    description = 'Needs improvement';
  }

  return { trend, description };
}

// Get pending tasks count (assignments with Pending or Not Started status)
function getPendingTasksCount() {
  const student = getCurrentStudentRecord();
  return getDashboardAssignments()
    .filter(a => (a.className || a.class) === student.student_class)
    .filter(a => !studentHasSubmittedAssignment(a, student.id))
    .length;
}

function studentDash() {
  const student = getCurrentStudentRecord();
  const studentName = student.name;
  const studentClass = student.student_class;
  const studentId = student.student_id;
  const studentInitials = getInitials(studentName, 'ST');

  // Calculate all dynamic values
  const subjectsCount = getStudentSubjectsCount(studentClass);
  const attendance = getStudentAttendance(studentName);
  const attendanceTrend = getAttendanceTrend(attendance);
  const pendingTasks = getPendingTasksCount();
  const classStanding = calculateClassStanding(studentName);

  const statsCards = [
    statCard('<i class="fas fa-book"></i>', subjectsCount, 'My Subjects', 'This semester', 'neu', 'si-blue', true, 'navTo("subjects")'),
    statCard('<i class="fas fa-check-circle"></i>', attendance + '%', 'My Attendance', attendanceTrend.description, attendanceTrend.trend, 'si-green', true, 'navTo("attendance")'),
    statCard('<i class="fas fa-clipboard-list"></i>', pendingTasks, 'Pending Tasks', 'Due this week', 'dn', 'si-red', true, 'navTo("assignments")'),
    statCard('<i class="fas fa-star"></i>', classStanding.standing, 'Class Standing', classStanding.rank, classStanding.trend, 'si-gold', true, 'navTo("reportcards")')
  ].join('');
  const studentAssignments = getDashboardAssignments().filter(a => (a.className || a.class) === studentClass);
  const assignmentRows = studentAssignments.length ? studentAssignments.slice(0, 5).map(a => {
    const st = studentHasSubmittedAssignment(a, student.id) ? 'Submitted' : 'Pending';
    const d = formatDashboardDueDate(a.dueDate);
    return `
          <tr style="cursor:pointer" onclick="viewAssignment('${a.id}')">
            <td style="font-weight:600">${escapeHtml(a.subject || '')}</td><td>${escapeHtml(a.title)}</td>
            <td style="${d === 'Today' ? 'color:var(--danger);font-weight:700' : 'color:var(--gray-600)'}">${d}</td>
            <td><span class="badge ${st === 'Submitted' ? 'b-success' : st === 'Pending' ? 'b-warning' : st === 'In Progress' ? 'b-info' : 'b-gray'}">${st}</span></td>
          </tr>`;
  }).join('') : '<tr><td colspan="4" style="text-align:center;color:var(--gray-400);padding:14px">No assignments for your class.</td></tr>';
  const performanceRows = [['Mathematics', 88], ['English', 92], ['Science', 85], ['ICT', 95], ['History', 78], ['French', 72]].map(([s, v]) => `
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
          <span>${s}</span><span style="color:var(--blue-main);font-weight:700">${v}%</span>
        </div>
        <div class="prog-bar"><div class="prog-fill ${v >= 90 ? 'pf-green' : v >= 75 ? 'pf-blue' : 'pf-gold'}" style="width:${v}%"></div></div>
      </div>`).join('');
  const timetableRows = [['7:30', 'Mathematics', 'Rm 14', 'Mr. Amponsah'], ['8:20', 'English', 'Rm 02', 'Mrs. Asante'], ['10:00', 'Science', 'Lab 1', 'Mr. Oduro'], ['11:00', 'ICT', 'Lab 2', 'Ms. Frimpong'], ['13:30', 'History', 'Rm 08', 'Mr. Boateng']].map(([t, s, r, tc]) => `
      <div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--gray-100);cursor:pointer" onclick="viewScheduleDetail('${t}', '${s}', '${studentClass}')">
        <div style="font-size:11px;color:var(--blue-main);font-weight:700;min-width:42px">${t}</div>
        <div><div style="font-size:12.5px;font-weight:600">${s}</div><div style="font-size:10px;color:var(--gray-400)">${r} · ${tc}</div></div>
      </div>`).join('');
  const noticeRows = [['<i class="fas fa-file-alt"></i>', 'Exam Schedule Released', 'Check portal for timetable'], ['<i class="fas fa-running"></i>', 'Sports Day - Mar 24', 'All students attend'], ['<i class="fas fa-book"></i>', 'Library Closure', 'March 20 only']].map(([i, t, d]) => `
      <div class="notice-item" style="padding:10px 0">
        <div class="notice-icon" style="background:var(--blue-xpale);width:38px;height:38px;border-radius:9px">${i}</div>
        <div class="notice-content"><h4>${t}</h4><p>${d}</p></div>
      </div>`).join('');

  return hdr('Student Dashboard', 'Welcome, ' + studentName + ' · ' + studentClass + ' · ID No: ' + studentId + ' · ' + getCurrentDateString()) +
    renderPageTemplate('pages/dashboards/student/index.html', {
      avatarColor: student.avatar_color || 'blue',
      studentInitials,
      studentName,
      studentId,
      studentClass,
      statsCards,
      assignmentRows,
      performanceRows,
      timetableRows,
      noticeRows
    });
}

// -----------------------------------
// TEACHER/STUDENT STORAGE & HELPERS
// -----------------------------------
const TEACHERS_KEY = 'gr_teachers';
const STUDENTS_KEY = 'gr_students';
const GRADEBOOK_KEY = 'gr_gradebook';
const TEACHER_MESSAGES_KEY = 'gr_teacher_messages';
const ATTENDANCE_BATCHES_KEY = 'gr_attendance_batches';

function getAssignments() {
  return getDashboardAssignments();
}
function saveAssignments(obj) {
  window.assignmentsData = Array.isArray(obj) ? obj : Object.values(obj || {});
}

function getTeacherMessages() {
  const raw = appMemoryStorage.getItem(TEACHER_MESSAGES_KEY);
  return raw ? JSON.parse(raw) : [];
}
function saveTeacherMessages(arr) {
  appMemoryStorage.setItem(TEACHER_MESSAGES_KEY, JSON.stringify(arr));
}

function sendTeacherChatMessage() {
  const inp = document.querySelector('.chat-inp');
  if (!inp) return showToast('No message box found', 'error');
  const txt = inp.value.trim();
  if (!txt) return showToast('Type a message first', 'error');
  const msgs = getTeacherMessages();
  msgs.push({ from: 'Me', text: txt, time: new Date().toLocaleString(), fromTeacher: true });
  saveTeacherMessages(msgs);
  try{ addMessage({ sender: 'Mr. Amponsah', senderRole: 'teacher', recipient: 'Admin Office', recipientRole: 'admin', subject: '', text: txt }); }catch(e){}
  inp.value = '';
  showToast('<i class="fas fa-check-circle"></i> Message sent', 'success');
  setTimeout(() => renderMain(), 120);
}

function openGradeEntryModal(studentName) {
  const subjects = SUBJECTS_BY_CLASS[(STUDENTS_DATA[studentName]||{}).class] || Object.keys(STUDENTS_DATA[studentName]?.scores||{});
  const subjOptions = (subjects || []).map(s => `<option value="${s}">${s}</option>`).join('');
  const html = `<div style="max-width:520px">
    <h3>Quick Grade Entry — ${studentName}</h3>
    <div style="margin-top:12px">
      <label>Subject</label>
      <select id="grade-subject" style="width:100%;padding:8px;margin:6px 0">${subjOptions}</select>
      <label>Class Score</label>
      <input id="grade-class" type="number" style="width:100%;padding:8px;margin:6px 0" />
      <label>Exam Score</label>
      <input id="grade-exam" type="number" style="width:100%;padding:8px;margin:6px 0" />
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveGradeEntry('${escapeHtml(studentName)}')">Save</button>
      </div>
    </div>
  </div>`;
  openModal(html, true);
}

function saveGradeEntry(studentName) {
  const subj = document.getElementById('grade-subject').value;
  const cls = parseFloat(document.getElementById('grade-class').value) || 0;
  const exam = parseFloat(document.getElementById('grade-exam').value) || 0;
  const gbRaw = appMemoryStorage.getItem(GRADEBOOK_KEY);
  const gb = gbRaw ? JSON.parse(gbRaw) : {};
  gb[studentName] = gb[studentName] || {};
  gb[studentName][subj] = { classScore: cls, examScore: exam, updated: new Date().toISOString() };
  appMemoryStorage.setItem(GRADEBOOK_KEY, JSON.stringify(gb));
  closeModal();
  showToast('Grade saved', 'success');
  setTimeout(() => renderMain(), 120);
}

async function addAssignment() {
  const title = document.getElementById('assign-title').value.trim();
  const subject = document.getElementById('assign-subject').value.trim();
  const cls = document.getElementById('assign-class').value.trim();
  const due = document.getElementById('assign-due').value;
  if (!title) return showToast('Provide a title', 'error');
  const classRecord = classesData.find(c => c.name === cls || String(c.id) === String(cls));
  if (!classRecord) return showToast('Select a valid class', 'error');
  const teacher = getCurrentTeacherProfile ? getCurrentTeacherProfile() : null;
  const res = await API.assignments.create({
    title,
    subject,
    class_id: classRecord.id,
    teacher_id: teacher ? teacher.id : null,
    due_date: due || new Date().toISOString().slice(0, 10),
    created_date: new Date().toISOString().slice(0, 10),
    max_score: 100,
    status: 'Active',
    instructions: ''
  });
  if (!res || !res.success) return showToast(res?.message || 'Failed to create assignment', 'error');
  if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
  showToast('Assignment created', 'success');
  navTo('dashboard');
}

// -----------------------------------
// PARENT DASHBOARD
// -----------------------------------
function parentDash() {
  const parentUser = getSessionUser();
  const students = getParentChildren();
  const childrenStats = students.map(s => `<div style="display:flex;gap:16px;align-items:center;padding:14px;background:var(--gray-50);border-radius:var(--radius-lg);margin-bottom:12px">
    <div class="av av-lg av-${s.color}">${(s.name||' ')[0]}</div>
    <div style="flex:1">
      <div style="font-size:15px;font-weight:700;color:var(--blue-dark)">${escapeHtml(s.name)}</div>
      <div style="font-size:11px;color:var(--gray-500)">${escapeHtml(s.class)} · ${s.studentId}</div>
      <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
        <span class="badge b-success">${s.attendance}% Attendance</span>
        <span class="badge ${s.feeStatus==='Paid' ? 'b-success' : s.feeStatus==='Partial' ? 'b-warning' : 'b-danger'}">Fees ${s.feeStatus}</span>
      </div>
    </div>
    <button class="btn btn-secondary btn-sm" onclick="viewStudentReport('${s.studentId}')"><i class="fas fa-file"></i> Report</button>
    <button class="btn btn-info btn-sm" onclick="viewAttendance('${s.studentId}')"><i class="fas fa-chart-bar"></i> Progress</button>
  </div>`).join('');
  const messages = getParentMessages();
  const messageHtml = messages.length === 0 ? '<div style="text-align:center;color:var(--gray-400);padding:20px"><i class="fas fa-inbox" style="font-size:32px;margin-bottom:8px;display:block"></i> No messages yet</div>' : messages.map(m=>`<div class="chat-msg ${m.fromParent ? 'me' : ''}">
    <div class="av av-sm av-${m.fromParent ? 'blue' : 'green'}">${(m.from||' ')[0]}</div>
    <div><div class="chat-bubble ${m.fromParent ? 'me-bubble' : 'them'}">${escapeHtml(m.text)}</div><div class="chat-meta ${m.fromParent ? 'me' : ''}">${escapeHtml(m.from)} · ${m.time}</div></div>
  </div>`).join('');
  const assignments = getDashboardAssignments().flatMap(a => students
    .filter(child => child.class === (a.className || a.class))
    .map(child => ({
      title: a.title,
      student: child.name,
      dueDate: formatDashboardDueDate(a.dueDate),
      completed: studentHasSubmittedAssignment(a, child.id)
    })));
  const pendingParentAssignments = assignments.filter(a=>!a.completed);
  const assignmentHtml = pendingParentAssignments.length === 0 ? '<div style="text-align:center;color:var(--gray-400);padding:12px">No pending assignments</div>' : pendingParentAssignments.map((a)=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--gray-100)">
    <div style="flex:1"><div style="font-size:12.5px;font-weight:600">${escapeHtml(a.title)}</div><div style="font-size:11px;color:var(--gray-400)">${escapeHtml(a.student)}</div></div>
    <div style="display:flex;gap:6px;align-items:center">
      <span class="badge ${a.dueDate === 'Today' || a.dueDate === 'Overdue' ? 'b-danger' : 'b-info'}">${a.dueDate}</span>
      <span class="badge b-warning">Pending</span>
    </div>
  </div>`).join('');
  const feeSummary = getParentFeeSummary();
  const statsCards = [
    statCard('<i class="fas fa-child"></i>', students.length, 'My Children', 'All active', 'neu', 'si-blue'),
    statCard('<i class="fas fa-check-circle"></i>', students.length > 0 ? students[0].attendance + '%' : '—', 'Avg Attendance', 'Excellent', 'up', 'si-green'),
    statCard('<i class="fas fa-file"></i>', 'A', 'Last Report Grade', 'Term 1, 2025', 'up', 'si-gold'),
    statCard('<i class="fas fa-money-bill"></i>', feeSummary.pending > 0 ? feeSummary.pending + ' Pending' : 'All Paid', 'Fees Status', feeSummary.pending > 0 ? 'Action needed' : 'All clear', feeSummary.pending > 0 ? 'dn' : 'up', feeSummary.pending > 0 ? 'si-red' : 'si-green')
  ].join('');
  const feeCards = students.map(s=>`<div style="padding:12px;background:var(--gray-50);border-radius:var(--radius);margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div style="font-size:12px;font-weight:600">${escapeHtml(s.name)} · ${escapeHtml(s.class)}</div>
          <span class="badge ${s.feeStatus==='Paid' ? 'b-success' : s.feeStatus==='Partial' ? 'b-warning' : 'b-danger'}">${s.feeStatus}</span>
        </div>
        <div style="font-size:18px;font-weight:800;color:var(--blue-dark)">GH₵ ${Number(s.feeAmount||0).toLocaleString()}</div>
        <button class="btn btn-info btn-xs" style="margin-top:8px" onclick="viewPaymentHistory('${s.studentId}')"><i class="fas fa-history"></i> Payment History</button>
      </div>`).join('');
  const eventRows = [['Mar 20', 'PTA Meeting', '3:00 PM School Hall'], ['Mar 24', 'Sports Day', 'All day event'], ['Apr 01', 'Term Exams Begin', '8:00 AM daily']].map(([d, e, t]) => `
      <div style="display:flex;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid var(--gray-100)">
        <div style="min-width:46px;height:46px;background:var(--blue-xpale);border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center">
          <span style="font-size:9px;color:var(--blue-main);font-weight:700">${d.split(' ')[0]}</span>
          <span style="font-size:18px;font-weight:800;color:var(--blue-dark)">${d.split(' ')[1]}</span>
        </div>
        <div><div style="font-size:12.5px;font-weight:600">${e}</div><div style="font-size:11px;color:var(--gray-400)">${t}</div></div>
      </div>`).join('');

  return hdr('Parent Dashboard', 'Welcome, ' + (parentUser?.name || 'Parent') + ' · Parent of ' + students.length + ' student' + (students.length === 1 ? '' : 's') + ' · ' + getCurrentDateString()) +
    renderPageTemplate('pages/dashboards/parent/index.html', {
      statsCards,
      childrenStats,
      messageHtml,
      assignmentHtml,
      feeCards,
      eventRows
    });
}

// -----------------------------------
// ACCOUNTANT DASHBOARD
// -----------------------------------
function accountDash() {
  const sessionUser = getSessionUser();
  const accountantName = sessionUser?.name || 'Accountant';
  const finance = getFinanceSummary();
  const target = Math.max(finance.collected + finance.outstanding, 1);
  const collectedPct = Math.round(finance.collected / target * 100);
  const revenueItems = [
    ['School Fees', finance.collected, collectedPct],
    ['Outstanding Fees', finance.outstanding, Math.round(finance.outstanding / target * 100)],
    ['Operating Expenses', finance.expenses, Math.round(finance.expenses / target * 100)],
    ['Net Balance', finance.net, Math.max(0, Math.round(finance.net / target * 100))]
  ];
  const statsCards = [
    statCard('<i class="fas fa-money-bill"></i>', 'GH₵' + Number(finance.collected).toLocaleString(), 'Total Collected', finance.payments.length + ' records', 'up', 'si-blue', true, 'navTo("payments")'),
    statCard('<i class="fas fa-hourglass-half"></i>', 'GH₵' + Number(finance.outstanding).toLocaleString(), 'Outstanding Fees', finance.pendingCount + ' pending', 'dn', 'si-red', true, 'navTo("debtors")'),
    statCard('<i style="transform:rotate(90deg);display:inline-block" class="fas fa-chart-line"></i>', 'GH₵' + Number(finance.expenses).toLocaleString(), 'Total Expenses', 'Auto budget view', 'neu', 'si-gold', true, 'navTo("expenses")'),
    statCard('<i class="fas fa-chart-bar"></i>', 'GH₵' + Number(finance.net).toLocaleString(), 'Net Balance', finance.net >= 0 ? 'Surplus' : 'Deficit', finance.net >= 0 ? 'up' : 'dn', finance.net >= 0 ? 'si-green' : 'si-red', true, 'navTo("reports")')
  ].join('');
  const revenueRows = revenueItems.map(([c, amount, p]) => `
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
          <span>${c}</span><span style="font-weight:600">GH₵${Number(amount).toLocaleString()}</span>
        </div>
        <div class="prog-bar"><div class="prog-fill pf-blue" style="width:${Math.min(100, p)}%"></div></div>
      </div>`).join('');
  const payrollRows = [['Teaching Staff', '64 staff', 'Mar 28'], ['Admin Staff', '12 staff', 'Mar 28'], ['Support Staff', '18 staff', 'Mar 30']].map(([t, s, d]) => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--gray-100)">
        <div><div style="font-size:12.5px;font-weight:600">${t}</div><div style="font-size:11px;color:var(--gray-400)">${s}</div></div>
        <span class="badge b-warning">Due ${d}</span>
      </div>`).join('');

  return hdr('Accountant Dashboard', `Financial Overview for ${accountantName} · Term 1, 2025 · ` + getCurrentDateString()) +
    renderPageTemplate('pages/dashboards/accountant/index.html', {
      statsCards,
      collectedAmount: Number(finance.collected).toLocaleString(),
      targetAmount: Number(target).toLocaleString(),
      collectedPct,
      debtorNotice: debtorReminderNoticePanel(2, true),
      revenueRows,
      payrollRows,
      calendar: mini_cal()
    });
}

// -----------------------------------
// ALUMNI DASHBOARD
// -----------------------------------
function alumniDash() {
  const alumni = getAlumniList();
  const currentAlumni = getCurrentAlumniProfile();
  const donations = getAlumniDonations();
  const registrations = getAlumniEventRegistrations();
  const totalDonated = donations.filter(d=>d.status==='Completed').reduce((sum,d)=>sum + (d.amount||0), 0);
  const recentDonations = donations.slice(-3).reverse();
  
  const statsCards = [
    statCard('<i class="fas fa-medal"></i>', '1,240', 'Total Alumni', 'Network growing', 'up', 'si-blue'),
    statCard('<i class="fas fa-calendar-alt"></i>', '3', 'Upcoming Events', 'This quarter', 'neu', 'si-gold'),
    statCard('<i class="fas fa-briefcase"></i>', '28', 'Job Listings', 'Posted by alumni', 'up', 'si-green'),
    statCard('<i class="fas fa-hand-holding-heart"></i>', 'GH₵' + Number(totalDonated).toLocaleString(), 'Total Donations', 'This year', 'up', 'si-purple')
  ].join('');
  const announcementRows = getAlumniAnnouncements().slice(0,2).map(a => `
      <div style="display:flex;gap:12px;padding:12px;background:var(--gray-50);border-radius:10px;margin-bottom:10px;border-left:4px solid var(--${a.color||'blue'})">
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--gray-800)">${escapeHtml(a.title)}</div>
          <div style="font-size:11px;color:var(--gray-500);margin-top:4px">${escapeHtml(a.description)}</div>
          <div style="font-size:10px;color:var(--gray-400);margin-top:8px">${a.date}</div>
        </div>
      </div>`).join('');
  const campaignRows = getAlumniCampaigns().slice(0,2).map(c => `
      <div style="padding:12px;border:1.5px solid var(--gray-200);border-radius:10px;margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span style="font-size:13px;font-weight:700;color:var(--gray-800)">${escapeHtml(c.title)}</span>
          <span class="badge b-green">${c.percentage}%</span>
        </div>
        <div style="font-size:11px;color:var(--gray-500);display:flex;justify-content:space-between;margin-bottom:6px">
          <span>Raised: GH₵${Number(c.raised||0).toLocaleString()}</span>
          <span>Goal: GH₵${Number(c.goal||0).toLocaleString()}</span>
        </div>
        <div style="height:6px;background:var(--gray-200);border-radius:4px;overflow:hidden">
          <div style="height:100%;width:${c.percentage}%;background:linear-gradient(90deg, #10b981, #34d399)"></div>
        </div>
        <button class="btn btn-success btn-xs" style="margin-top:8px" onclick="makeDonation('${c.id}')"><i class="fas fa-heart"></i> Donate</button>
      </div>`).join('');
  const eventRows = getAlumniEvents().slice(0,2).map(e => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:var(--gray-50);border-radius:10px;margin-bottom:10px">
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--gray-800)">${escapeHtml(e.title)}</div>
          <div style="font-size:11px;color:var(--gray-500);margin-top:4px"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(e.location)}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:11px;font-weight:600;color:var(--blue-dark)">${e.date}</div>
          <button class="btn ${registrations.find(r=>r.eventId===e.id) ? 'btn-secondary' : 'btn-success'} btn-xs" style="margin-top:6px" onclick="registerForEvent('${e.id}','${escapeHtml(e.title)}')">
            ${registrations.find(r=>r.eventId===e.id) ? 'Registered' : 'Register'}
          </button>
        </div>
      </div>`).join('');
  const donorRows = recentDonations.length === 0 ? '<div style="text-align:center;color:var(--gray-400);padding:20px"><i class="fas fa-heart-broken" style="font-size:24px;margin-bottom:8px;display:block"></i> No donations yet</div>' : recentDonations.map(d => `
      <div style="display:flex;gap:12px;align-items:center;padding:10px;border-bottom:1px solid var(--gray-100)">
        <div class="av av-sm av-gold">${(d.name||' ')[0]}</div>
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between">
            <span style="font-size:12px;font-weight:600;color:var(--gray-800)">${escapeHtml(d.name)}</span>
            <span style="font-size:11px;font-weight:700;color:var(--green-dark)">GH₵${Number(d.amount||0).toLocaleString()}</span>
          </div>
          <div style="font-size:11px;color:var(--gray-500)">${escapeHtml(d.campaign)}</div>
        </div>
      </div>`).join('');

  return renderPageTemplate('pages/dashboards/alumni/index.html', {
    alumniName: escapeHtml(currentAlumni.name || 'Alumni'),
    statsCards,
    announcementRows,
    campaignRows,
    eventRows,
    donorRows
  });
}
