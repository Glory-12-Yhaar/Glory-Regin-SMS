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
  }
};

function adminDash() {
  const totalStudents = ADMIN_DASHBOARD_STATE.dashboard.total_students ?? 'â€”';
  const totalTeachers = ADMIN_DASHBOARD_STATE.dashboard.total_teachers ?? 'â€”';
  const pendingFees = ADMIN_DASHBOARD_STATE.dashboard.fees_pending_count ?? 'â€”';
  const finance = ADMIN_DASHBOARD_STATE.finance;
  const paidPct = finance.totalCount ? Math.round((finance.paidCount / finance.totalCount) * 100) : 0;
  const partialPct = finance.totalCount ? Math.round((finance.partialCount / finance.totalCount) * 100) : 0;
  const pendingPct = Math.max(0, 100 - paidPct - partialPct);
  const recentStudents = ADMIN_DASHBOARD_STATE.recentStudents.length
    ? ADMIN_DASHBOARD_STATE.recentStudents
    : [{ name: 'Loading student records...', student_class: '', status: 'Loading', fees_status: 'Loading' }];

  return hdr('Admin Dashboard', 'Welcome back, Administrator Â· ' + getCurrentDateString()) + `
  <div class="stats-row">
    ${statCard('<i class="fas fa-graduation-cap"></i>', '' + totalStudents, 'Total Students', 'Open records', 'up', 'si-blue', true, 'navTo("students")')}
    ${statCard('<i class="fas fa-chalkboard-user"></i>', '' + totalTeachers, 'Total Teachers', 'Staff records', 'up', 'si-gold', true, 'navTo("teachers")')}
    ${statCard('<i class="fas fa-money-bill"></i>', 'GHâ‚µ' + Number(finance.collected).toLocaleString(), 'Fees Collected', finance.payments.length + ' payments', 'up', 'si-green', true, 'navTo("fees")')}
    ${statCard('<i class="fas fa-exclamation-triangle"></i>', '' + pendingFees, 'Pending Fees', 'Needs attention', 'dn', 'si-red', true, 'navTo("fees")')}
  </div>
  <div class="g21 mb20">
    <div class="card">
      <div class="card-hdr">
        <span class="card-title"><i class="fas fa-chart-line"></i> Monthly Enrollment & Attendance</span>
        <span class="card-act" onclick="showMonthlyEnrollmentAttendanceReport()" style="cursor:pointer">Full Report</span>
      </div>
      <div style="display:flex;gap:4px;align-items:flex-end;height:140px">
        ${[80, 65, 90, 75, 88, 72, 95, 85, 70, 92, 80, 60].map((h, i) => `
        <div style="flex:1;display:flex;gap:2px;align-items:flex-end">
          <div data-animate-height="${Math.round(h * 1.3)}px" style="flex:1;height:${Math.round(h * 1.3)}px;background:var(--blue-main);border-radius:3px 3px 0 0;opacity:.85;transition:height .65s ease"></div>
          <div data-animate-height="${Math.round(h * .9)}px" style="flex:1;height:${Math.round(h * .9)}px;background:var(--gold);border-radius:3px 3px 0 0;opacity:.75;transition:height .65s ease"></div>
        </div>`).join('')}
      </div>
      <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--gray-400);margin-top:6px;padding:0 2px">
        ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => `<span>${m}</span>`).join('')}
      </div>
      <div style="display:flex;gap:16px;margin-top:10px">
        <span style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--gray-600)"><span style="width:10px;height:10px;background:var(--blue-main);border-radius:2px;display:inline-block"></span>Enrollment</span>
        <span style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--gray-600)"><span style="width:10px;height:10px;background:var(--gold);border-radius:2px;display:inline-block"></span>Attendance</span>
      </div>
    </div>
    <div class="card">${mini_cal()}</div>
  </div>
  <div class="g2 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-graduation-cap"></i> Recent Students</span><span class="card-act" onclick="navTo('students')">View All</span></div>
      <table class="tbl">
        <thead><tr><th>Student</th><th>Class</th><th>Status</th><th>Fees</th></tr></thead>
        <tbody>
          ${recentStudents.map((student, index) => [student.name, student.student_class || student.class || 'Unassigned', student.status || 'Active', student.fees_status || student.feeStatus || 'Pending', ['blue', 'gold', 'purple', 'green', 'teal'][index % 5]]).map(([n, c, s, f, av]) => `
          <tr style="cursor:pointer" onclick="navTo('students')">
            <td><div style="display:flex;align-items:center;gap:9px"><div class="av av-sm av-${av}">${n[0]}</div><strong>${n}</strong></div></td>
            <td>${c}</td>
            <td><span class="badge b-success">${s}</span></td>
            <td><span class="badge ${f === 'Paid' ? 'b-success' : f === 'Pending' ? 'b-danger' : 'b-warning'}">${f}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-bell"></i> Recent Activity</span></div>
      <div class="activity">
        ${[['blue', 'New student enrolled â€” Ama Serwaa', '5 min ago'], ['gold', 'Assignment submitted by Basic 6', '12 min ago'], ['green', 'Fee payment received â€” GHâ‚µ800', '30 min ago'], ['red', '3 students absent in Creche', '1 hr ago'], ['blue', 'Notice published: Sports Day', '2 hrs ago'], ['green', 'Timetable updated for JHS 1', '3 hrs ago'], ['purple', 'New teacher profile created', '4 hrs ago']].map(([c, t, time]) => `
        <div class="act-item">
          <div class="act-dot" style="background:var(--${c === 'blue' ? 'blue-main' : c === 'green' ? 'success' : c === 'red' ? 'danger' : c === 'purple' ? 'purple' : 'gold'})"></div>
          <div class="act-content"><div class="act-text">${t}</div><div class="act-time">${time}</div></div>
        </div>`).join('')}
      </div>
    </div>
  </div>
  <div class="g3">
    <div class="card" style="cursor:pointer" onclick="navTo('classes')">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-building"></i> Classes Overview</span></div>
      ${getAdminDashboardClassesOverviewHtml()}
    </div>
    <div class="card" style="cursor:pointer" onclick="navTo('fees')">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-money-bill"></i> Fees Status</span></div>
      <div style="display:flex;justify-content:center;margin:10px 0">
        <svg viewBox="0 0 120 120" width="120" height="120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="var(--gray-200)" stroke-width="14"/>
          <circle data-ring-value="${paidPct}" data-ring-circumference="${Math.PI * 100}" cx="60" cy="60" r="50" fill="none" stroke="var(--blue-main)" stroke-width="14"
            stroke-dasharray="${Math.PI * 100 * paidPct / 100} ${Math.PI * 100}" stroke-linecap="round"
            transform="rotate(-90 60 60)"/>
          <circle cx="60" cy="60" r="50" fill="none" stroke="var(--gold)" stroke-width="14"
            stroke-dasharray="${Math.PI * 100 * partialPct / 100} ${Math.PI * 100}" stroke-linecap="round"
            stroke-dashoffset="-${Math.PI * 100 * paidPct / 100}" transform="rotate(-90 60 60)"/>
          <text x="60" y="64" text-anchor="middle" font-size="16" font-weight="800" fill="var(--blue-dark)">${paidPct}%</text>
        </svg>
      </div>
      <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
        <span style="font-size:11px;display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;background:var(--blue-main);border-radius:2px;display:inline-block"></span>Paid ${paidPct}%</span>
        <span style="font-size:11px;display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;background:var(--gold);border-radius:2px;display:inline-block"></span>Partial ${partialPct}%</span>
        <span style="font-size:11px;display:flex;align-items:center;gap:4px"><span style="width:8px;height:8px;background:var(--gray-200);border-radius:2px;display:inline-block"></span>Unpaid ${pendingPct}%</span>
      </div>
    </div>
    <div class="card" style="cursor:pointer" onclick="navTo('subjects')">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-trophy"></i> Subject Performance</span></div>
      ${getAdminDashboardSubjectPerformanceHtml()}
    </div>
  </div>`;
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
        partialCount: 0,
        pendingCount: dashboardRes.data?.fees_pending_count || 0,
        totalCount: Math.max(1, (dashboardRes.data?.fees_paid_count || 0) + (dashboardRes.data?.fees_pending_count || 0))
      };
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
  const teacherAssignments = Object.values(ASSIGNMENTS_DATA).filter(a => myClassNames.includes(a.class));
  const scheduleRows = mySubjects.slice(0, 5).map((s, i) => [
    ['7:30-8:20', '8:20-9:10', '10:00-10:50', '11:00-11:50', '13:30-14:20'][i] || '14:20-15:10',
    s.name,
    myClassNames[i % Math.max(myClassNames.length, 1)] || s.classes,
    'Room ' + String(8 + i).padStart(2, '0'),
    i < 1 ? 'Done' : i === 1 ? 'Up Next' : 'Upcoming'
  ]);
  const attendanceStudents = myStudents.slice(0, 8);

  return hdr('Teacher Dashboard', 'Welcome, ' + teacher.name + ' Â· ' + teacher.department + ' Â· ' + (myClassNames.join(', ') || 'No assigned class') + ' Â· ' + getCurrentDateString()) + `
  <div class="stats-row">
    ${statCard('<i class="fas fa-building"></i>', myClasses.length, 'My Classes', 'Assigned only', 'neu', 'si-blue', true, 'navTo("classes")')}
    ${statCard('<i class="fas fa-graduation-cap"></i>', myStudents.length, 'My Students', 'Assigned classes', 'neu', 'si-green', true, 'navTo("students")')}
    ${statCard('<i class="fas fa-book"></i>', mySubjects.length, 'My Subjects', teacher.subject, 'neu', 'si-gold', true, 'navTo("subjects")')}
    ${statCard('<i class="fas fa-check-circle"></i>', attendanceAverage + '%', 'Attendance Rate', 'My classes', 'up', 'si-purple', true, 'navTo("attendance")')}
  </div>
  <div class="card mb20">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-balance-scale"></i> SBA Module</span><span class="card-act" onclick="navTo('sba')">Open SBA</span></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px">
      <button class="btn btn-secondary" style="justify-content:flex-start;white-space:normal;text-align:left" onclick="currentSbaView='subject';navTo('sba')"><i class="fas fa-chalkboard-teacher"></i> Subject Teacher SBA</button>
      <button class="btn btn-secondary" style="justify-content:flex-start;white-space:normal;text-align:left" onclick="currentSbaView='class';navTo('sba')"><i class="fas fa-users"></i> Class Teacher SBA</button>
    </div>
  </div>
  <div class="g21 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-calendar"></i> Today's Schedule</span><span class="card-act" onclick="navTo('timetable')">Full Timetable</span></div>
      <table class="tbl">
        <thead><tr><th>Time</th><th>Subject</th><th>Class</th><th>Room</th><th>Status</th></tr></thead>
        <tbody>
          ${scheduleRows.map(([t, s, c, r, st]) => `
          <tr style="cursor:pointer" onclick="viewScheduleDetail('${t}', '${s}', '${c}')">
            <td style="color:var(--blue-main);font-weight:600">${t}</td>
            <td>${s}</td><td>${c}</td><td style="color:var(--gray-500)">${r}</td>
            <td><span class="badge ${st === 'Done' ? 'b-success' : st === 'Up Next' ? 'b-warning' : 'b-info'}">${st}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-clipboard-list"></i> Assignments</span><span class="card-act" onclick="openAddAssignmentForm()">Add New</span></div>
      ${teacherAssignments.length ? teacherAssignments.slice(0, 4).map(a => {
        const submitted = Object.keys(a.submissions || {}).length;
        const total = myStudents.filter(s => s.student_class === a.class).length || 1;
        return `
      <div style="margin-bottom:16px;cursor:pointer;padding:8px;border-radius:6px;transition:all 0.2s" onmouseover="this.style.background='var(--gray-50)'" onmouseout="this.style.background='transparent'" onclick="viewAssignmentSubmissions('${escapeHtml(a.title)}')">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
          <span style="font-size:13px;font-weight:600">${escapeHtml(a.title)}</span>
          <span class="badge b-info">${escapeHtml(a.dueDate || 'TBD')}</span>
        </div>
        <div style="font-size:11px;color:var(--gray-500);margin-bottom:6px">${escapeHtml(a.class)} Â· ${submitted}/${total} submitted</div>
        <div class="prog-bar"><div class="prog-fill pf-gold" style="width:${Math.round(submitted / total * 100)}%"></div></div>
      </div>`}).join('') : '<div style="padding:20px;color:var(--gray-400);text-align:center">No assignments for your assigned classes yet.</div>'}
    </div>
  </div>
  <div class="g2">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-check-circle"></i> Class Attendance</span><span class="card-act" onclick="navTo('attendance')">Open Module</span></div>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px;background:var(--gray-50);border-radius:8px">
        <div>
          <div style="font-weight:700;color:var(--blue-dark);font-size:14px">${myClassNames[0] || 'Assigned Class'}</div>
          <div style="font-size:12px;color:var(--gray-500);margin-top:4px">Record today's attendance from the Attendance Module.</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="navTo('attendance')"><i class="fas fa-clipboard-check"></i> Mark Attendance</button>
      </div>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-comments"></i> Messages</span><span class="card-act" onclick="navTo('messaging')">Open Chat</span></div>
      <div class="chat-msgs">
        ${getTeacherMessages().map(m => `
        <div class="chat-msg ${m.fromTeacher ? 'me' : ''}">
          <div class="av av-sm av-${m.fromTeacher ? 'blue' : 'green'}">${(m.from||' ')[0]}</div>
          <div><div class="chat-bubble ${m.fromTeacher ? 'me-bubble' : 'them'}">${escapeHtml(m.text)}</div><div class="chat-meta ${m.fromTeacher ? 'me' : ''}">${m.fromTeacher ? 'You' : escapeHtml(m.from)} Â· ${m.time}</div></div>
        </div>`).join('')}
      </div>
      <div class="chat-input-row">
        <textarea id="teacher-chat-input" class="chat-inp" placeholder="Type your message..." onkeydown="handleChatTextareaKey(event, 'Mr. Amponsah', 'Admin Office', 'teacher-chat-input')"></textarea>
        <button class="chat-send" onclick="sendTeacherChatButton()"><i class="fa-regular fa-paper-plane"></i></button>
      </div>
    </div>
  </div>`;
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
  const assignments = [
    ['Mathematics', 'Chapter 5 Problems', 'Today', 'Pending'],
    ['English', 'Essay on Climate', 'Mar 20', 'Submitted'],
    ['Science', 'Lab Report', 'Mar 22', 'Pending'],
    ['ICT', 'Database Project', 'Mar 25', 'In Progress'],
    ['History', 'WWII Essay', 'Mar 28', 'Not Started']
  ];
  return assignments.filter(([_, _2, _3, status]) => status === 'Pending' || status === 'Not Started').length;
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

  return hdr('Student Dashboard', 'Welcome, ' + studentName + ' Â· ' + studentClass + ' Â· ID No: ' + studentId + ' Â· ' + getCurrentDateString()) + `
  <div class="student-profile-card">
    <div class="profile-left">
      <div class="profile-avatar av av-xl av-${student.avatar_color || 'blue'}">${studentInitials}</div>
      <div class="profile-info">
        <h3 class="profile-name">${studentName}</h3>
        <p class="profile-id">ID: ${studentId}</p>
        <p class="profile-class">${studentClass} Â· General</p>
      </div>
    </div>
    <button class="profile-idcard-btn" onclick="showStudentIDCard()" title="View ID Card">
      <i class="fas fa-id-card"></i>
    </button>
  </div>
  <div class="stats-row">
    ${statCard('<i class="fas fa-book"></i>', subjectsCount, 'My Subjects', 'This semester', 'neu', 'si-blue', true, 'navTo("subjects")')}
    ${statCard('<i class="fas fa-check-circle"></i>', attendance + '%', 'My Attendance', attendanceTrend.description, attendanceTrend.trend, 'si-green', true, 'navTo("attendance")')}
    ${statCard('<i class="fas fa-clipboard-list"></i>', pendingTasks, 'Pending Tasks', 'Due this week', 'dn', 'si-red', true, 'navTo("assignments")')}
    ${statCard('<i class="fas fa-star"></i>', classStanding.standing, 'Class Standing', classStanding.rank, classStanding.trend, 'si-gold', true, 'navTo("reportcards")')}
  </div>
  <div class="g21 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-file-alt"></i> My Assignments</span><span class="card-act" onclick="navTo('assignments')">All Assignments</span></div>
      <table class="tbl">
        <thead><tr><th>Subject</th><th>Assignment</th><th>Due Date</th><th>Status</th></tr></thead>
        <tbody>
          ${[['Mathematics', 'Chapter 5 Problems', 'Today', 'Pending'], ['English', 'Essay on Climate', 'Mar 20', 'Submitted'], ['Science', 'Lab Report', 'Mar 22', 'Pending'], ['ICT', 'Database Project', 'Mar 25', 'In Progress'], ['History', 'WWII Essay', 'Mar 28', 'Not Started']].map(([s, t, d, st]) => `
          <tr style="cursor:pointer" onclick="viewAssignmentDetails('${t.replace(/'/g, "\\'")}')">
            <td style="font-weight:600">${s}</td><td>${t}</td>
            <td style="${d === 'Today' ? 'color:var(--danger);font-weight:700' : 'color:var(--gray-600)'}">${d}</td>
            <td><span class="badge ${st === 'Submitted' ? 'b-success' : st === 'Pending' ? 'b-warning' : st === 'In Progress' ? 'b-info' : 'b-gray'}">${st}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-target"></i> My Performance</span></div>
      ${[['Mathematics', 88], ['English', 92], ['Science', 85], ['ICT', 95], ['History', 78], ['French', 72]].map(([s, v]) => `
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
          <span>${s}</span><span style="color:var(--blue-main);font-weight:700">${v}%</span>
        </div>
        <div class="prog-bar"><div class="prog-fill ${v >= 90 ? 'pf-green' : v >= 75 ? 'pf-blue' : 'pf-gold'}" style="width:${v}%"></div></div>
      </div>`).join('')}
    </div>
  </div>
  <div class="g3">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-calendar"></i> Today's Timetable</span></div>
      ${[['7:30', 'Mathematics', 'Rm 14', 'Mr. Amponsah'], ['8:20', 'English', 'Rm 02', 'Mrs. Asante'], ['10:00', 'Science', 'Lab 1', 'Mr. Oduro'], ['11:00', 'ICT', 'Lab 2', 'Ms. Frimpong'], ['13:30', 'History', 'Rm 08', 'Mr. Boateng']].map(([t, s, r, tc]) => `
      <div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--gray-100);cursor:pointer" onclick="viewScheduleDetail('${t}', '${s}', '${studentClass}')">
        <div style="font-size:11px;color:var(--blue-main);font-weight:700;min-width:42px">${t}</div>
        <div><div style="font-size:12.5px;font-weight:600">${s}</div><div style="font-size:10px;color:var(--gray-400)">${r} Â· ${tc}</div></div>
      </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-bullhorn"></i> Notices</span></div>
      ${[['<i class="fas fa-file-alt"></i>', 'Exam Schedule Released', 'Check portal for timetable'], ['<i class="fas fa-running"></i>', 'Sports Day â€” Mar 24', 'All students attend'], ['<i class="fas fa-book"></i>', 'Library Closure', 'March 20 only']].map(([i, t, d]) => `
      <div class="notice-item" style="padding:10px 0">
        <div class="notice-icon" style="background:var(--blue-xpale);width:38px;height:38px;border-radius:9px">${i}</div>
        <div class="notice-content"><h4>${t}</h4><p>${d}</p></div>
      </div>`).join('')}
    </div>
    <div class="card" style="cursor:pointer" onclick="navTo('fees')">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-money-bill"></i> Fees Status</span></div>
      <div class="fee-hero" style="margin-bottom:12px">
        <h3>Term 1, 2025</h3>
        <div class="amount">GHâ‚µ 2,400</div>
        <div class="sub">Fully Paid Â· March 15, 2025</div>
      </div>
      <div style="font-size:12px;color:var(--gray-600);text-align:center;padding:8px 0">
        <span class="badge b-success" style="font-size:12px;padding:6px 16px"><i class="fas fa-check-circle"></i> All Fees Cleared</span>
      </div>
    </div>
  </div>`;
}

// -----------------------------------
// TEACHER/STUDENT STORAGE & HELPERS
// -----------------------------------
const TEACHERS_KEY = 'gr_teachers';
const STUDENTS_KEY = 'gr_students';
const GRADEBOOK_KEY = 'gr_gradebook';
const ASSIGNMENTS_KEY = 'gr_assignments';
const TEACHER_MESSAGES_KEY = 'gr_teacher_messages';
const ATTENDANCE_BATCHES_KEY = 'gr_attendance_batches';

function getAssignments() {
  const raw = localStorage.getItem(ASSIGNMENTS_KEY);
  return raw ? JSON.parse(raw) : ASSIGNMENTS_DATA;
}
function saveAssignments(obj) {
  localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(obj));
}

function getTeacherMessages() {
  const raw = localStorage.getItem(TEACHER_MESSAGES_KEY);
  return raw ? JSON.parse(raw) : [];
}
function saveTeacherMessages(arr) {
  localStorage.setItem(TEACHER_MESSAGES_KEY, JSON.stringify(arr));
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
    <h3>Quick Grade Entry â€” ${studentName}</h3>
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
  const gbRaw = localStorage.getItem(GRADEBOOK_KEY);
  const gb = gbRaw ? JSON.parse(gbRaw) : {};
  gb[studentName] = gb[studentName] || {};
  gb[studentName][subj] = { classScore: cls, examScore: exam, updated: new Date().toISOString() };
  localStorage.setItem(GRADEBOOK_KEY, JSON.stringify(gb));
  closeModal();
  showToast('Grade saved', 'success');
  setTimeout(() => renderMain(), 120);
}

function addAssignment() {
  const title = document.getElementById('assign-title').value.trim();
  const subject = document.getElementById('assign-subject').value.trim();
  const cls = document.getElementById('assign-class').value.trim();
  const due = document.getElementById('assign-due').value;
  if (!title) return showToast('Provide a title', 'error');
  const assigns = getAssignments();
  const id = String(Date.now());
  assigns[id] = { id, title, subject, class: cls, dueDate: due || 'TBD', createdDate: new Date().toISOString().slice(0,10), maxScore: 100, status: 'Active', instructions: '', submissions: {} };
  saveAssignments(assigns);
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
      <div style="font-size:11px;color:var(--gray-500)">${escapeHtml(s.class)} Â· ${s.studentId}</div>
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
    <div><div class="chat-bubble ${m.fromParent ? 'me-bubble' : 'them'}">${escapeHtml(m.text)}</div><div class="chat-meta ${m.fromParent ? 'me' : ''}">${escapeHtml(m.from)} Â· ${m.time}</div></div>
  </div>`).join('');
  const assignments = getParentAssignments();
  const pendingParentAssignments = assignments.filter(a=>!a.completed);
  const assignmentHtml = pendingParentAssignments.length === 0 ? '<div style="text-align:center;color:var(--gray-400);padding:12px">No pending assignments</div>' : pendingParentAssignments.map((a)=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--gray-100)">
    <div style="flex:1"><div style="font-size:12.5px;font-weight:600">${escapeHtml(a.title)}</div><div style="font-size:11px;color:var(--gray-400)">${escapeHtml(a.student)}</div></div>
    <div style="display:flex;gap:6px;align-items:center">
      <span class="badge ${a.dueDate === 'Today' ? 'b-danger' : a.dueDate.includes('Mar 2') ? 'b-warning' : 'b-info'}">${a.dueDate}</span>
      <button class="btn btn-success btn-xs" onclick="markAssignmentDone('${String(a.student).replace(/'/g, "\\'")}','${String(a.title).replace(/'/g, "\\'")}')"><i class="fas fa-check"></i></button>
    </div>
  </div>`).join('');
  const feeSummary = getParentFeeSummary();
  return hdr('Parent Dashboard', 'Welcome, ' + (parentUser?.name || 'Parent') + ' Â· Parent of ' + students.length + ' student' + (students.length === 1 ? '' : 's') + ' Â· ' + getCurrentDateString()) + `
  <div class="stats-row">
    ${statCard('<i class="fas fa-child"></i>', students.length, 'My Children', 'All active', 'neu', 'si-blue')}
    ${statCard('<i class="fas fa-check-circle"></i>', students.length > 0 ? students[0].attendance + '%' : 'â€”', 'Avg Attendance', 'Excellent', 'up', 'si-green')}
    ${statCard('<i class="fas fa-file"></i>', 'A', 'Last Report Grade', 'Term 1, 2025', 'up', 'si-gold')}
    ${statCard('<i class="fas fa-money-bill"></i>', feeSummary.pending > 0 ? feeSummary.pending + ' Pending' : 'All Paid', 'Fees Status', feeSummary.pending > 0 ? 'Action needed' : 'All clear', feeSummary.pending > 0 ? 'dn' : 'up', feeSummary.pending > 0 ? 'si-red' : 'si-green')}
  </div>
  <div class="g2 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-child"></i> My Children</span></div>
      ${childrenStats}
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-comments"></i> Teacher Messages</span><span class="card-act" onclick="openParentMessenger()">Send Message</span></div>
      <div class="chat-msgs" style="max-height:300px;overflow-y:auto">
        ${messageHtml}
      </div>
      <div class="chat-input-row">
        <textarea id="parent-msg-input" class="chat-inp" placeholder="Message a teacher..." onkeydown="handleChatTextareaKey(event, 'Parent Serwaa', 'Mr. Amponsah', 'parent-msg-input')"></textarea>
        <button class="chat-send" onclick="sendParentMessage()"><i class="fas fa-paper-plane"></i></button>
      </div>
    </div>
  </div>
  <div class="g3">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-clipboard-list"></i> Assignments Due</span></div>
      ${assignmentHtml}
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-money-bill"></i> Fee Payment Status</span></div>
      ${students.map(s=>`<div style="padding:12px;background:var(--gray-50);border-radius:var(--radius);margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div style="font-size:12px;font-weight:600">${escapeHtml(s.name)} Â· ${escapeHtml(s.class)}</div>
          <span class="badge ${s.feeStatus==='Paid' ? 'b-success' : s.feeStatus==='Partial' ? 'b-warning' : 'b-danger'}">${s.feeStatus}</span>
        </div>
        <div style="font-size:18px;font-weight:800;color:var(--blue-dark)">GHâ‚µ ${Number(s.feeAmount||0).toLocaleString()}</div>
        <button class="btn btn-info btn-xs" style="margin-top:8px" onclick="viewPaymentHistory('${s.studentId}')"><i class="fas fa-history"></i> Payment History</button>
      </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-calendar-alt"></i> School Events</span></div>
      ${[['Mar 20', 'PTA Meeting', '3:00 PM School Hall'], ['Mar 24', 'Sports Day', 'All day event'], ['Apr 01', 'Term Exams Begin', '8:00 AM daily']].map(([d, e, t]) => `
      <div style="display:flex;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid var(--gray-100)">
        <div style="min-width:46px;height:46px;background:var(--blue-xpale);border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center">
          <span style="font-size:9px;color:var(--blue-main);font-weight:700">${d.split(' ')[0]}</span>
          <span style="font-size:18px;font-weight:800;color:var(--blue-dark)">${d.split(' ')[1]}</span>
        </div>
        <div><div style="font-size:12.5px;font-weight:600">${e}</div><div style="font-size:11px;color:var(--gray-400)">${t}</div></div>
      </div>`).join('')}
    </div>
  </div>`;
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
  return hdr('Accountant Dashboard', `Financial Overview for ${accountantName} Â· Term 1, 2025 Â· ` + getCurrentDateString()) + `
  <div class="stats-row">
    ${statCard('<i class="fas fa-money-bill"></i>', 'GHâ‚µ' + Number(finance.collected).toLocaleString(), 'Total Collected', finance.payments.length + ' records', 'up', 'si-blue', true, 'navTo("payments")')}
    ${statCard('<i class="fas fa-hourglass-half"></i>', 'GHâ‚µ' + Number(finance.outstanding).toLocaleString(), 'Outstanding Fees', finance.pendingCount + ' pending', 'dn', 'si-red', true, 'navTo("debtors")')}
    ${statCard('<i style="transform:rotate(90deg);display:inline-block" class="fas fa-chart-line"></i>', 'GHâ‚µ' + Number(finance.expenses).toLocaleString(), 'Total Expenses', 'Auto budget view', 'neu', 'si-gold', true, 'navTo("expenses")')}
    ${statCard('<i class="fas fa-chart-bar"></i>', 'GHâ‚µ' + Number(finance.net).toLocaleString(), 'Net Balance', finance.net >= 0 ? 'Surplus' : 'Deficit', finance.net >= 0 ? 'up' : 'dn', finance.net >= 0 ? 'si-green' : 'si-red', true, 'navTo("reports")')}
  </div>
  <div class="g21 mb20 accountant-dashboard-grid" style="align-items:start">
    <div class="card accountant-payments-card" style="align-self:start;height:auto">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-credit-card"></i> Recent Payments</span><button class="btn btn-gold btn-sm" onclick="navTo('payments')">+ Record Payment</button></div>
      <div class="payments-filter-bar">
        <input id="payments-search" placeholder="Search student or receipt..." style="padding:8px 10px;border:1px solid var(--gray-200);border-radius:6px;flex:1;min-width:180px;font-size:12px">
        <select id="payments-status" style="padding:8px 10px;border:1px solid var(--gray-200);border-radius:6px;font-size:12px"><option value="">All Status</option><option value="Paid">Paid</option><option value="Partial">Partial</option><option value="Pending">Pending</option></select>
        <input id="payments-date-from" type="date" style="padding:8px 10px;border:1px solid var(--gray-200);border-radius:6px;font-size:12px">
        <input id="payments-date-to" type="date" style="padding:8px 10px;border:1px solid var(--gray-200);border-radius:6px;font-size:12px">
        <button class="btn btn-sm" onclick="renderRecentPaymentsTable()"><i class="fas fa-filter"></i> Filter</button>
        <button class="btn btn-gold btn-sm" onclick="exportPaymentsCSV()"><i class="fas fa-download"></i> CSV</button>
      </div>
      <div class="table-wrapper">
        <table class="tbl">
          <thead><tr><th>Student</th><th>Amount</th><th>Date</th><th>Receipt</th><th>Method</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="payments-tbody"></tbody>
        </table>
      </div>
      <div class="payments-table-footer">
        <div id="payments-info" style="color:var(--gray-600)">Loading...</div>
        <div style="display:flex;gap:6px" id="payments-pagination"></div>
      </div>
    </div>
    <div>
      <div class="fee-hero mb16">
        <h3>Total Collected â€” Term 1, 2025</h3>
        <div class="amount">GHâ‚µ ${Number(finance.collected).toLocaleString()}</div>
        <div class="sub">Target: GHâ‚µ${Number(target).toLocaleString()} Â· ${collectedPct}% achieved</div>
        <div style="margin-top:12px;background:rgba(255,255,255,.15);border-radius:4px;height:8px">
          <div class="prog-fill" style="width:${collectedPct}%;background:var(--gold);height:8px;border-radius:4px"></div>
        </div>
      </div>
      ${debtorReminderNoticePanel(2, true)}
      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-bolt"></i> Quick Actions</span></div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <button class="btn btn-primary" onclick="navTo('payments')"><i class="fas fa-money-bill"></i> Record Cash Payment</button>
          <button class="btn btn-secondary" onclick="openReceiptIssuePage()"><i class="fas fa-receipt"></i> Issue Receipt</button>
          <button class="btn btn-gold" onclick="navTo('reports')"><i class="fas fa-chart-line"></i> Financial Report</button>
          <button class="btn btn-secondary" onclick="navTo('expenses')"><i class="fas fa-chart-line"></i> Add Expense</button>
        </div>
      </div>
    </div>
  </div>
  <div class="g3">
    <div class="card" style="cursor:pointer" onclick="navTo('fees')">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-bar"></i> Revenue Breakdown</span></div>
      ${revenueItems.map(([c, amount, p]) => `
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
          <span>${c}</span><span style="font-weight:600">GHâ‚µ${Number(amount).toLocaleString()}</span>
        </div>
        <div class="prog-bar"><div class="prog-fill pf-blue" style="width:${Math.min(100, p)}%"></div></div>
      </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-briefcase"></i> Payroll Status</span></div>
      ${[['Teaching Staff', '64 staff', 'Mar 28'], ['Admin Staff', '12 staff', 'Mar 28'], ['Support Staff', '18 staff', 'Mar 30']].map(([t, s, d]) => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--gray-100)">
        <div><div style="font-size:12.5px;font-weight:600">${t}</div><div style="font-size:11px;color:var(--gray-400)">${s}</div></div>
        <span class="badge b-warning">Due ${d}</span>
      </div>`).join('')}
      <button class="btn btn-primary btn-sm" style="width:100%;margin-top:12px" onclick="navTo('salary')">Process Payroll</button>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-calendar-alt"></i> Calendar</span></div>
      ${mini_cal()}
    </div>
  </div>`;
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
  
  return `<div class="visitor-hero" style="margin-bottom:26px">
    <h1><i class="fas fa-graduation-cap"></i> Welcome, ${escapeHtml(currentAlumni.name || 'Alumni')}</h1>
    <p>Stay connected with your alma mater, reconnect with classmates, and give back to Glory Reign Preparatory School</p>
    <div class="hero-btns">
      <button class="hero-btn-gold" onclick="openAlumniDirectory()"><i class="fas fa-users"></i> Browse Directory</button>
      <button class="hero-btn-outline" onclick="openAlumniJobs()"><i class="fas fa-briefcase"></i> Job Listings</button>
      <button class="hero-btn-outline" onclick="openDonationHub()"><i class="fas fa-hand-holding-heart"></i> Donate</button>
    </div>
  </div>
  <div class="stats-row">
    ${statCard('<i class="fas fa-medal"></i>', '1,240', 'Total Alumni', 'Network growing', 'up', 'si-blue')}
    ${statCard('<i class="fas fa-calendar-alt"></i>', '3', 'Upcoming Events', 'This quarter', 'neu', 'si-gold')}
    ${statCard('<i class="fas fa-briefcase"></i>', '28', 'Job Listings', 'Posted by alumni', 'up', 'si-green')}
    ${statCard('<i class="fas fa-hand-holding-heart"></i>', 'GHâ‚µ' + Number(totalDonated).toLocaleString(), 'Total Donations', 'This year', 'up', 'si-purple')}
  </div>
  <div class="g2 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-bullhorn"></i> Announcements</span><span class="card-act" onclick="showAllAnnouncements()">View All</span></div>
      ${getAlumniAnnouncements().slice(0,2).map(a => `
      <div style="display:flex;gap:12px;padding:12px;background:var(--gray-50);border-radius:10px;margin-bottom:10px;border-left:4px solid var(--${a.color||'blue'})">
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--gray-800)">${escapeHtml(a.title)}</div>
          <div style="font-size:11px;color:var(--gray-500);margin-top:4px">${escapeHtml(a.description)}</div>
          <div style="font-size:10px;color:var(--gray-400);margin-top:8px">${a.date}</div>
        </div>
      </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-hand-holding-heart"></i> Donation Campaigns</span><span class="card-act" onclick="openDonationHub()">Donate</span></div>
      ${getAlumniCampaigns().slice(0,2).map(c => `
      <div style="padding:12px;border:1.5px solid var(--gray-200);border-radius:10px;margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span style="font-size:13px;font-weight:700;color:var(--gray-800)">${escapeHtml(c.title)}</span>
          <span class="badge b-green">${c.percentage}%</span>
        </div>
        <div style="font-size:11px;color:var(--gray-500);display:flex;justify-content:space-between;margin-bottom:6px">
          <span>Raised: GHâ‚µ${Number(c.raised||0).toLocaleString()}</span>
          <span>Goal: GHâ‚µ${Number(c.goal||0).toLocaleString()}</span>
        </div>
        <div style="height:6px;background:var(--gray-200);border-radius:4px;overflow:hidden">
          <div style="height:100%;width:${c.percentage}%;background:linear-gradient(90deg, #10b981, #34d399)"></div>
        </div>
        <button class="btn btn-success btn-xs" style="margin-top:8px" onclick="makeDonation('${c.id}')"><i class="fas fa-heart"></i> Donate</button>
      </div>`).join('')}
    </div>
  </div>
  <div class="g2 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-calendar-alt"></i> Upcoming Events</span><span class="card-act" onclick="viewAllEvents()">Calendar</span></div>
      ${getAlumniEvents().slice(0,2).map(e => `
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
      </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-gift"></i> Recent Donors</span><span class="card-act" onclick="viewDonationHistory()">History</span></div>
      ${recentDonations.length === 0 ? '<div style="text-align:center;color:var(--gray-400);padding:20px"><i class="fas fa-heart-broken" style="font-size:24px;margin-bottom:8px;display:block"></i> No donations yet</div>' : recentDonations.map(d => `
      <div style="display:flex;gap:12px;align-items:center;padding:10px;border-bottom:1px solid var(--gray-100)">
        <div class="av av-sm av-gold">${(d.name||' ')[0]}</div>
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between">
            <span style="font-size:12px;font-weight:600;color:var(--gray-800)">${escapeHtml(d.name)}</span>
            <span style="font-size:11px;font-weight:700;color:var(--green-dark)">GHâ‚µ${Number(d.amount||0).toLocaleString()}</span>
          </div>
          <div style="font-size:11px;color:var(--gray-500)">${escapeHtml(d.campaign)}</div>
        </div>
      </div>`).join('')}
    </div>
  </div>`;
}
