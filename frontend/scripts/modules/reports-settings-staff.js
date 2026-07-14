
// Report-card-specific grading thresholds.
function calculateReportGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  if (score >= 50) return 'E';
  return 'F';
}

function generateReportRemark(average) {
  if (average >= 85) return 'Excellent work! Outstanding performance across all subjects.';
  if (average >= 75) return 'Very good performance. Keep up the excellent effort!';
  if (average >= 65) return 'Good performance. Maintain consistency in studies.';
  if (average >= 55) return 'Satisfactory performance. More effort needed in some areas.';
  if (average >= 45) return 'Fair performance. Requires improvement and focused study.';
  return 'Needs improvement. Seek help from teachers and peers.';
}

// Calculate position (placeholder - would sort all students in real system)
function calculatePosition(average) {
  if (average >= 85) return { position: '3rd', total: 40 };
  if (average >= 75) return { position: '8th', total: 40 };
  if (average >= 65) return { position: '15th', total: 40 };
  return { position: '28th', total: 40 };
}

// Process student scores
function processStudentScores(studentId) {
  ensureReportCardScores();
  const student = studentScores[studentId];
  if (!student) return null;

  const processed = {
    ...student,
    studentId,
    processedScores: student.scores.map(score => ({
      ...score,
      total: score.classScore + score.examScore,
      grade: calculateReportGrade(score.classScore + score.examScore)
    }))
  };

  const totalMarks = processed.processedScores.reduce((sum, s) => sum + s.total, 0);
  const average = Math.round((totalMarks / (processed.processedScores.length * 100)) * 100);
  const posData = calculatePosition(average);

  processed.totalMarks = totalMarks;
  processed.average = average;
  processed.position = posData.position;
  processed.totalStudents = posData.total;
  processed.grade = calculateReportGrade(average);
  processed.remark = generateReportRemark(average);

  return processed;
}

function getSubjectsForReportClass(className) {
  const classInfo = classesData.find(c => c.name === className);
  if (classInfo?.subjects?.length) return classInfo.subjects.slice(0, 8);
  if (String(className || '').includes('JHS')) return ['Mathematics', 'Science', 'English', 'Social Studies', 'Computing', 'Career Technology', 'RME', 'Dagaare'];
  return ['Mathematics', 'Science', 'English', 'Social Studies', 'Computing', 'History', 'Creative Art'];
}

function buildGeneratedReportScores(student, index = 0) {
  const base = 64 + ((index * 7 + String(student.name || '').length) % 24);
  return getSubjectsForReportClass(student.student_class).map((subject, subjectIndex) => {
    const total = Math.max(48, Math.min(96, base + ((subjectIndex * 5) % 13) - 6));
    return {
      subject,
      classScore: Math.round(total * 0.45),
      examScore: total - Math.round(total * 0.45),
      totalMarks: 100
    };
  });
}

function ensureReportCardScores() {
  enrolledStudents.forEach((student, index) => {
    if (!studentScores[student.student_id]) {
      studentScores[student.student_id] = {
        name: student.name,
        class: student.student_class,
        classTeacher: getClassTeacherName(student.student_class),
        stream: classesData.find(c => c.name === student.student_class)?.stream || 'General',
        picture: getInitials(student.name, 'ST').slice(0, 1),
        attendance: parseFloat(student.attendance) || 90,
        term: '1st',
        year: '2024/2025',
        scores: buildGeneratedReportScores(student, index)
      };
    }
  });
}

function getClassTeacherName(className) {
  const classInfo = classesData.find(c => c.name === className);
  return classInfo?.teacher || 'Class Teacher';
}

function getReportCardEntriesForRole() {
  ensureReportCardScores();
  let entries = Object.entries(studentScores);
  if (currentRole === 'Student') {
    const currentStudent = getCurrentStudentRecord();
    entries = entries.filter(([id, data]) => id === currentStudent.student_id || data.name === currentStudent.name);
  } else if (currentRole === 'Parent') {
    const children = getParentChildren();
    const childNames = new Set(children.map(c => c.name));
    const childIds = new Set(children.map(c => c.studentId));
    entries = entries.filter(([id, data]) => childIds.has(id) || childNames.has(data.name));
  } else if (currentRole === 'Teacher') {
    const assignedClassNames = getAssignedClassNamesForTeacher();
    entries = entries.filter(([_, data]) => assignedClassNames.includes(data.class));
  }
  return entries;
}

function showReportCard(studentId) {
  const permitted = getReportCardEntriesForRole().some(([id]) => id === studentId);
  if (!permitted) {
    showToast('<i class="fas fa-lock"></i> You cannot view this report card', 'error');
    return;
  }
  const container = document.getElementById('student-report-container');
  if (container) {
    container.innerHTML = generateReportCard(studentId);
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    openModal(generateReportCard(studentId), true);
  }
}

function publicNavToSection(sectionId) {
  if (currentRole !== 'Visitor') {
    navTo(sectionId.replace('-section', '') || 'dashboard');
    return;
  }
  if (currentMod !== 'dashboard') {
    currentMod = 'dashboard';
    renderPublicNavbar();
    renderMain();
  }
  setTimeout(() => {
    const target = document.getElementById(sectionId);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 40);
}

function getReportStudentRecord(studentId, studentName) {
  const enrolled = enrolledStudents.find(s => s.student_id === studentId || s.name === studentName);
  const admission = admissionsData.find((a, index) =>
    a.name === studentName ||
    generateStudentID(a.class_applying || '', String(index)) === studentId
  );
  return { enrolled, admission };
}

function getReportStudentPhoto(studentId, studentName) {
  const { enrolled, admission } = getReportStudentRecord(studentId, studentName);
  return enrolled?.picture || admission?.picture || null;
}

function getSubjectPosition(total) {
  if (total >= 90) return '1st';
  if (total >= 80) return '4th';
  if (total >= 70) return '12th';
  if (total >= 60) return '24th';
  return '31st';
}

function getReportRemark(grade) {
  if (grade === 'A') return 'Excellent';
  if (grade === 'B') return 'Very Good';
  if (grade === 'C') return 'Good';
  if (grade === 'D') return 'Credit';
  return 'Needs Improvement';
}

// Generate report card HTML
function generateReportCard(studentId) {
  const student = processStudentScores(studentId);
  if (!student) return '<div class="card"><p>Student not found</p></div>';

  const maxMarks = student.processedScores.length * 100;
  const { enrolled, admission } = getReportStudentRecord(studentId, student.name);
  const photo = getReportStudentPhoto(studentId, student.name);
  const attendance = parseFloat(student.attendance) || 0;
  const attendanceOutOf = 68;
  const attendancePresent = Math.round(attendanceOutOf * attendance / 100);
  const promotedTo = student.class && student.class.includes('JHS 3') ? 'Completed' : student.class || 'Next Class';
  const totalFees = Number(enrolled?.feeAmount || 2400);
  const arrears = enrolled?.fees_status === 'Paid' ? 0 : Math.round(totalFees * 0.35);
  const paidFees = totalFees - arrears;
  const balance = Math.max(0, totalFees - paidFees);
  const conduct = student.average >= 80 ? 'Excellent' : student.average >= 70 ? 'Very Good' : 'Good';
  const interest = student.processedScores[0]?.subject || 'Reading';
  const photoHTML = photo
    ? `<img src="${photo}" alt="${escapeHtml(student.name)}" style="width:86px;height:104px;object-fit:cover;border:1.5px solid #7b4b3f">`
    : `<div style="width:86px;height:104px;border:1.5px dashed #9b6b5c;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:#7b4b3f;background:#f8ede6">${getInitials(student.name, 'ST')}</div>`;
  const rows = student.processedScores.map((s, index) => {
    const remark = getReportRemark(s.grade);
    return `
      <tr>
        <td class="rc-index">${index + 1}</td>
        <td class="rc-subject">${escapeHtml(s.subject)}</td>
        <td>${s.classScore}</td>
        <td>${s.examScore}</td>
        <td class="rc-total">${s.total}</td>
        <td>${getSubjectPosition(s.total)}</td>
        <td class="rc-grade">${s.grade}</td>
        <td>${remark}</td>
      </tr>`;
  }).join('');

  return `
  <style>
    .report-card-container.paper-style { background:#f4ded2; padding:18px; border-radius:4px; margin:20px 0; color:#4a2b24; }
    .rc-paper { max-width:1120px; margin:0 auto; background:#f7e4d8; border:4px double #5f352c; padding:10px; font-family:"Times New Roman", serif; box-shadow:0 8px 24px rgba(0,0,0,.12); }
    .rc-paper table { border-collapse:collapse; width:100%; }
    .rc-paper td, .rc-paper th { border:1px solid #75483d; padding:4px 5px; font-size:12px; line-height:1.15; }
    .rc-title { display:grid; grid-template-columns:110px 1fr 100px; gap:10px; align-items:center; border:1px solid #75483d; padding:6px; margin-bottom:6px; }
    .rc-school { text-align:center; text-transform:uppercase; font-weight:800; font-size:18px; letter-spacing:.5px; }
    .rc-subline { text-align:center; font-size:11px; margin-top:2px; text-transform:none; font-weight:600; }
    .rc-photo { display:flex; flex-direction:column; align-items:center; gap:3px; font-size:9px; text-align:center; }
    .rc-meta { display:grid; grid-template-columns:1.5fr 1fr 1fr 1fr; gap:0; margin-bottom:6px; border-left:1px solid #75483d; border-top:1px solid #75483d; }
    .rc-meta div { border-right:1px solid #75483d; border-bottom:1px solid #75483d; padding:5px; min-height:24px; font-size:12px; }
    .rc-meta strong { font-size:11px; text-transform:uppercase; margin-right:4px; }
    .rc-score th { font-size:11px; text-transform:uppercase; text-align:center; background:#efd0c2; }
    .rc-score td { text-align:center; height:24px; }
    .rc-score .rc-index { width:26px; color:#8a5b50; }
    .rc-score .rc-subject { text-align:left; font-weight:700; min-width:190px; }
    .rc-score .rc-total, .rc-score .rc-grade { font-weight:800; color:#b91c1c; font-size:14px; }
    .rc-lower { display:grid; grid-template-columns:1.25fr 1fr 1fr; gap:6px; margin-top:6px; }
    .rc-box { border:1px solid #75483d; min-height:128px; padding:6px; font-size:12px; }
    .rc-box h4 { margin:0 0 6px 0; font-size:12px; text-transform:uppercase; text-align:center; border-bottom:1px solid #75483d; padding-bottom:3px; }
    .rc-line { display:flex; justify-content:space-between; gap:10px; border-bottom:1px dotted #8b5e54; padding:3px 0; min-height:19px; }
    .rc-scale { display:grid; grid-template-columns:repeat(5,1fr); gap:3px; font-size:10px; margin:6px 0; text-align:center; }
    .rc-sign { display:grid; grid-template-columns:1fr 1fr 1fr; gap:18px; margin-top:14px; font-size:11px; text-align:center; }
    .rc-sign div { border-top:1px solid #75483d; padding-top:4px; }
    .rc-actions { display:flex; justify-content:center; gap:10px; margin-top:14px; }
    @media print {
      body { margin: 0; padding: 0; background:#fff !important; }
      body.printing-report-card * { visibility: hidden !important; }
      body.printing-report-card .report-card-container,
      body.printing-report-card .report-card-container * { visibility: visible !important; }
      body.printing-report-card .report-card-container {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
      }
      .report-card-container.paper-style { margin: 0; padding: 0; background:#fff; }
      .btn { display: none !important; }
      .rc-paper { box-shadow:none; max-width:none; border-color:#000; }
      @page { size: A4 landscape; margin: 8mm; }
    }
  </style>
  <div class="report-card-container paper-style" data-report-student-id="${escapeAttr(studentId)}">
    <div class="rc-paper">
      <div class="rc-title">
        <div style="text-align:center"><img src="assets/images/Logo.png" alt="Logo" style="width:58px;height:58px;object-fit:contain"><div style="font-size:9px">School Logo</div></div>
        <div>
          <div class="rc-school">Glory Reign Preparatory School</div>
          <div class="rc-subline">Terminal Report Card Â· ${student.term} Term Â· ${student.year}</div>
          <div class="rc-subline">P.O. Box AN 1234, Accra North Â· Tel: +233-123-456-789</div>
        </div>
        <div class="rc-photo">${photoHTML}<span>Student Photo</span></div>
      </div>

      <div class="rc-meta">
        <div><strong>Name:</strong> ${escapeHtml(student.name)}</div>
        <div><strong>Class:</strong> ${escapeHtml(student.class)}</div>
        <div><strong>Position:</strong> ${student.position} out of ${student.totalStudents}</div>
        <div><strong>Promoted to:</strong> ${escapeHtml(promotedTo)}</div>
        <div><strong>Student ID:</strong> ${escapeHtml(student.studentId)}</div>
        <div><strong>Date of Vacation:</strong> ${new Date().toLocaleDateString()}</div>
        <div><strong>Date of Next Term:</strong> ${new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()}</div>
        <div><strong>Attendance:</strong> ${attendancePresent} out of ${attendanceOutOf}</div>
      </div>

      <table class="rc-score">
        <thead>
          <tr>
            <th>#</th>
            <th>Subjects</th>
            <th>SBA 50%</th>
            <th>Exams 50%</th>
            <th>Total 100%</th>
            <th>Position in Subject</th>
            <th>Grade</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr>
            <td></td>
            <td class="rc-subject">Total</td>
            <td></td>
            <td></td>
            <td class="rc-total">${student.totalMarks}</td>
            <td colspan="3">Average: ${student.average}% Â· Overall Grade: ${student.grade} Â· Max: ${maxMarks}</td>
          </tr>
        </tbody>
      </table>

      <div class="rc-scale">
        <div>A: 80 - 100% Excellent</div>
        <div>B: 70 - 79% Very Good</div>
        <div>C: 60 - 69% Good</div>
        <div>D: 50 - 59% Credit</div>
        <div>E: 0 - 49% Fail</div>
      </div>

      <div class="rc-lower">
        <div class="rc-box">
          <h4>Attendance / Conduct</h4>
          <div class="rc-line"><span>Attendance</span><strong>${attendancePresent} / ${attendanceOutOf}</strong></div>
          <div class="rc-line"><span>Conduct</span><strong>${conduct}</strong></div>
          <div class="rc-line"><span>Interest</span><strong>${escapeHtml(interest)}</strong></div>
          <div class="rc-line"><span>Attitude</span><strong>${student.average >= 70 ? 'Respectful' : 'Improving'}</strong></div>
          <div class="rc-line"><span>Class Teacher</span><strong>${escapeHtml(student.classTeacher)}</strong></div>
        </div>
        <div class="rc-box">
          <h4>Class Teacher's Remarks</h4>
          <div style="min-height:54px;border-bottom:1px dotted #8b5e54;padding:4px">${escapeHtml(student.remark)}</div>
          <div class="rc-line"><span>Headmaster / Mistress</span><strong>Approved</strong></div>
          <div class="rc-line"><span>Signature</span><strong></strong></div>
        </div>
        <div class="rc-box">
          <h4>School Fees / Next Term</h4>
          <div class="rc-line"><span>Arrears from Last Term</span><strong>GH₵ ${arrears.toLocaleString()}</strong></div>
          <div class="rc-line"><span>Fees Paid</span><strong>GH₵ ${paidFees.toLocaleString()}</strong></div>
          <div class="rc-line"><span>Balance Fee</span><strong>GH₵ ${balance.toLocaleString()}</strong></div>
          <div class="rc-line"><span>Books / PTA / Other</span><strong>GH₵ 0</strong></div>
          <div class="rc-line"><span>Total</span><strong>GH₵ ${balance.toLocaleString()}</strong></div>
        </div>
      </div>

      <div class="rc-sign">
        <div>Bursar</div>
        <div>Class Teacher</div>
        <div>Head Master Signature</div>
      </div>

      <div class="rc-actions">
        <button class="btn btn-secondary btn-sm" onclick="printReportCardPaper('${studentId}')"><i class="fas fa-print"></i> Print</button>
        <button class="btn btn-primary btn-sm" onclick="downloadReportCardPDF('${studentId}')"><i class="fas fa-download"></i> Download PDF</button>
        <button class="btn btn-secondary btn-sm" onclick="closeModal(); if(currentMod==='reportcards') renderMain();">Close</button>
      </div>
    </div>
  </div>`;
}

function getReportPrintDocument(studentId, titlePrefix) {
  const reportHtml = generateReportCard(studentId);
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>${titlePrefix} - ${studentId}</title>
    <link href="styles/style.css" rel="stylesheet">
    <style>
      body { margin: 0; background: #fff; }
      .report-card-container.paper-style { margin: 0; padding: 0; background: #fff; }
      .rc-actions, .btn { display: none !important; }
      .rc-paper { box-shadow: none !important; max-width: none !important; }
      @page { size: A4 landscape; margin: 8mm; }
    </style>
  </head>
  <body>${reportHtml}</body>
  </html>`;
}

function openReportPrintWindow(studentId, titlePrefix, autoPrint) {
  const printWindow = window.open('', '_blank', 'height=900,width=1200');
  if (!printWindow) {
    showToast('<i class="fas fa-times-circle"></i> Please allow pop-ups to print this report card', 'error');
    return;
  }
  printWindow.document.open();
  printWindow.document.write(getReportPrintDocument(studentId, titlePrefix));
  printWindow.document.close();
  if (autoPrint) {
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 350);
  }
}

function printReportCardPaper(studentId) {
  let report = document.querySelector(`.report-card-container[data-report-student-id="${CSS.escape(studentId)}"]`);
  if (!report) {
    const container = document.getElementById('student-report-container');
    if (container) {
      container.innerHTML = generateReportCard(studentId);
      report = container.querySelector(`.report-card-container[data-report-student-id="${CSS.escape(studentId)}"]`);
    }
  }
  if (!report) {
    showToast('<i class="fas fa-times-circle"></i> Report card not found', 'error');
    return;
  }
  document.body.classList.add('printing-report-card');
  setTimeout(() => {
    window.print();
    setTimeout(() => document.body.classList.remove('printing-report-card'), 500);
  }, 50);
}

function reportCardsModule() {
  const visibleScores = getReportCardEntriesForRole();

  const title = currentRole === 'Student' ? 'My Report Card' : currentRole === 'Parent' ? 'Children Report Cards' : 'Report Cards';
  const subtitle = currentRole === 'Admin' ? 'View and generate student report cards' : 'View permitted report cards only';

  return hdr(title, subtitle, 'Report Cards') + `
  <div class="g21 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-clipboard-list"></i> Select Student Report Card</span></div>
      <div class="f-row">
        <div class="f-field">
          <label>Select Student</label>
          <select id="student-select" onchange="if(this.value) showReportCard(this.value)" style="padding:10px;border:1px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;width:100%">
            <option value="">Choose a student...</option>
            ${visibleScores.map(([id, data]) => `<option value="${id}">${data.name} (${data.class})</option>`).join('')}
          </select>
        </div>
        <div class="f-field">
          <label>Term</label>
          <select style="padding:10px;border:1px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif">
            <option>1st Term</option>
            <option>2nd Term</option>
            <option>3rd Term</option>
          </select>
        </div>
      </div>
      <div style="padding:14px;background:var(--blue-xpale);border-radius:6px;margin-top:12px">
        <p style="margin:0;font-size:12px;color:var(--blue-dark)">
          <strong><i class="fas fa-thumbtack"></i> Tip:</strong> Select a permitted student above to view their complete report card with all subjects, scores, grades, and remarks.
        </p>
      </div>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-bar"></i> Student Report Summary</span></div>
      <table class="tbl">
        <thead><tr><th>Student</th><th>Class</th><th>Total Marks</th><th>Average</th><th>Grade</th><th>Position</th><th>Action</th></tr></thead>
        <tbody>
          ${visibleScores.length ? visibleScores.map(([id, student]) => {
    const processed = processStudentScores(id);
    return `
            <tr>
              <td><div style="display:flex;align-items:center;gap:8px"><div class="av av-sm av-blue">${student.picture}</div><strong>${student.name}</strong></div></td>
              <td>${student.class}</td>
              <td><strong>${processed.totalMarks}</strong></td>
              <td><strong>${processed.average}%</strong></td>
              <td><span style="display:inline-block;padding:4px 10px;border-radius:4px;font-weight:700;color:white;background:${processed.grade === 'A' ? 'var(--success)' : processed.grade === 'B' ? 'var(--info)' : 'var(--warning)'}">${processed.grade}</span></td>
              <td><strong>${processed.position}</strong></td>
              <td><button class="btn btn-primary btn-xs" onclick="showReportCard('${id}')"><i class="fas fa-file"></i> View Report</button></td>
            </tr>
            `;
  }).join('') : '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--gray-400)">No report cards available for your account.</td></tr>'}
        </tbody>
      </table>
    </div>
  </div>
  <div id="student-report-container" style="margin-top:30px"></div>`;
}

// ASSIGNMENTS MODULE
function getAssignmentRecords() {
  return Array.isArray(window.assignmentsData) ? window.assignmentsData : [];
}

function findAssignmentRecord(assignmentId) {
  const id = parseInt(assignmentId, 10);
  return getAssignmentRecords().find(a => parseInt(a.id, 10) === id) || null;
}

function formatAssignmentDate(value) {
  if (!value) return 'TBD';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getAssignmentStatusBadge(status) {
  if (status === 'Closed') return 'b-gray';
  if (status === 'Upcoming') return 'b-info';
  return 'b-success';
}

function assignmentsModule() {
  const isTeacher = currentRole === 'Teacher';
  const isAdmin = currentRole === 'Admin';
  const isStudent = currentRole === 'Student';
  const isParent = currentRole === 'Parent';
  const studentClass = getCurrentStudentRecord().student_class;
  const teacherClassNames = getAssignedClassNamesForTeacher();

  if (isParent) {
    const children = getParentChildren();
    const childClasses = new Set(children.map(c => c.class));
    const parentAssignments = getAssignmentRecords()
      .filter(a => childClasses.has(a.className || a.class))
      .flatMap(a => children
        .filter(child => child.class === (a.className || a.class))
        .map(child => ({
          ...a,
          student: child.name,
          completed: Array.isArray(a.submittedStudentIds) && a.submittedStudentIds.includes(parseInt(child.id, 10))
        })));
    return hdr('Assignment Tracking', 'Assignments for your child or children', 'Assignments') + `
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-clipboard-list"></i> My Children Assignments</span></div>
      <table class="tbl">
        <thead><tr><th>Child</th><th>Assignment</th><th>Due Date</th><th>Status</th></tr></thead>
        <tbody>
          ${parentAssignments.map(a => `<tr><td>${escapeHtml(a.student)}</td><td style="font-weight:600">${escapeHtml(a.title)}</td><td>${escapeHtml(formatAssignmentDate(a.dueDate))}</td><td><span class="badge ${a.completed ? 'b-success' : 'b-warning'}">${a.completed ? 'Submitted' : 'Pending'}</span></td></tr>`).join('') || '<tr><td colspan="4" style="text-align:center;padding:24px;color:var(--gray-400)">No assignments found for your children.</td></tr>'}
        </tbody>
      </table>
    </div>`;
  }

  let assignmentsList = getAssignmentRecords();

  // Filter assignments for students - only show assignments for their class
  if (isStudent) {
    assignmentsList = assignmentsList.filter(assignment => (assignment.className || assignment.class) === studentClass);
  } else if (isTeacher) {
    assignmentsList = assignmentsList.filter(assignment => teacherClassNames.includes(assignment.className || assignment.class));
  }

  const submitCount = (assignment) => parseInt(assignment.submittedCount || 0, 10);

  const createButtonHTML = (isTeacher || isAdmin) ? `<button class="btn btn-primary btn-sm" onclick="openCreateAssignmentForm()">+ New Assignment</button>` : '';

  let html = hdr('Assignments Module', isTeacher ? 'Assignments for your assigned classes' : isStudent ? 'Your class assignments' : 'Create and manage class assignments', 'Assignments') + `
  <div class="g21 assignments-layout">
    <div class="card assignments-list-card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-clipboard-list"></i> ${isStudent ? 'My Assignments' : 'All Assignments'}</span>${createButtonHTML}</div>
      <div class="table-wrapper"><table class="tbl assignments-table">
        <thead><tr><th>Title</th><th>Subject</th>${!isStudent ? '<th>Class</th>' : ''}<th>Due Date</th><th>Submitted</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>`;

  if (assignmentsList.length === 0) {
    html += `<tr><td colspan="${!isStudent ? '7' : '6'}" style="text-align:center;padding:20px;color:var(--gray-600)"><i class="fas fa-inbox"></i> No assignments available</td></tr>`;
  } else {
    assignmentsList.forEach(assignment => {
      const submittedCount = submitCount(assignment);
      const totalStudents = parseInt(assignment.totalStudents || 0, 10);
      const dueDate = formatAssignmentDate(assignment.dueDate);
      const statusBadge = getAssignmentStatusBadge(assignment.status);

      html += `
      <tr>
        <td style="font-weight:600">${escapeHtml(assignment.title)}</td>
        <td>${escapeHtml(assignment.subject || '')}</td>
        ${!isStudent ? `<td>${escapeHtml(assignment.className || assignment.class || '')}</td>` : ''}
        <td style="color:var(--blue-main);font-weight:600">${dueDate}</td>
        <td>${submittedCount}/${totalStudents}</td>
        <td><span class="badge ${statusBadge}">${escapeHtml(assignment.status || 'Active')}</span></td>
        <td><div style="display:flex;gap:4px">
          <button class="btn btn-secondary btn-xs" onclick="viewAssignment('${assignment.id}')">View</button>
          ${(isTeacher || isAdmin) ? `<button class="btn btn-primary btn-xs" onclick="gradeAssignment('${assignment.id}')">Grade</button>` : ''}
        </div></td>
      </tr>`;
    });
  }

  html += `</tbody></table></div></div>`;

  // Create Assignment Form
  if (isTeacher || isAdmin) {
    const classChoices = isTeacher ? classesData.filter(c => teacherClassNames.includes(c.name)) : classesData;
    const subjectChoices = isTeacher ? getVisibleSubjectsForRole(subjectsData) : subjectsData;
    html += `
    <div class="card assignment-form-card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-plus"></i> Create New Assignment</span></div>
      <form id="create-assignment-form" onsubmit="createAssignment(event)">
        <div class="f-field" style="margin-bottom:12px">
          <label>Assignment Title</label>
          <input type="text" id="asg-title" placeholder="Assignment title" required>
        </div>
        <div class="f-row">
          <div class="f-field">
            <label>Subject</label>
            <select id="asg-subject" required>
              ${subjectChoices.map(s => `<option>${escapeHtml(s.name)}</option>`).join('')}
            </select>
          </div>
          <div class="f-field">
            <label>Class</label>
            <select id="asg-class" required>
              ${classChoices.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="f-row">
          <div class="f-field">
            <label>Due Date</label>
            <input type="date" id="asg-duedate" required>
          </div>
          <div class="f-field">
            <label>Max Score</label>
            <input type="number" id="asg-maxscore" value="50" min="10" max="100" required>
          </div>
        </div>
        <div class="f-field" style="margin-bottom:14px">
          <label>Instructions</label>
          <textarea id="asg-instructions" placeholder="Describe the assignment, requirements, and submission guidelines..." style="min-height:100px"></textarea>
        </div>
        <div class="f-field" style="margin-bottom:14px">
          <label>Attachment (Optional)</label>
          <input type="file" id="asg-attachment">
          <div style="font-size:11px;color:var(--gray-500);margin-top:4px"><i class="fas fa-paperclip"></i> Supported: PDF, DOC, DOCX, PNG, JPG (Max 10MB)</div>
        </div>
        <div style="display:flex;gap:8px">
          <button type="submit" class="btn btn-primary">Publish Assignment</button>
          <button type="button" class="btn btn-secondary" onclick="saveDraftAssignment()">Save as Draft</button>
        </div>
      </form>
    </div>`;
  }

  html += `</div>`;
  return html;
}

function openCreateAssignmentForm() {
  const form = document.getElementById('create-assignment-form');
  if (form) {
    form.scrollIntoView({ behavior: 'smooth' });
  } else {
    showToast('<i class="fas fa-times-circle"></i> Form not available', 'error');
  }
}

function viewAssignment(assignmentId) {
  const assignment = findAssignmentRecord(assignmentId);
  if (!assignment) {
    showToast('<i class="fas fa-times-circle"></i> Assignment not found', 'error');
    return;
  }
  if (currentRole === 'Teacher' && !getAssignedClassNamesForTeacher().includes(assignment.className || assignment.class)) {
    showToast('<i class="fas fa-lock"></i> You can only view assignments for your assigned classes', 'error');
    return;
  }
  if (currentRole === 'Student' && (assignment.className || assignment.class) !== getCurrentStudentRecord().student_class) {
    showToast('<i class="fas fa-lock"></i> You can only view assignments for your class', 'error');
    return;
  }

  const html = `
    <div style="background:var(--blue-main);color:white;padding:40px 20px;margin-bottom:30px;border-radius:8px">
      <div style="max-width:1200px;margin:0 auto">
        <h1 style="margin:0 0 12px 0;font-size:32px">${assignment.title}</h1>
        <p style="margin:0;font-size:16px;opacity:0.9"><i class="fas fa-book"></i> ${assignment.subject} â€¢ ${assignment.class}</p>
      </div>
    </div>
    
    <div style="max-width:1200px;margin:0 auto">
      <div style="margin-bottom:30px;padding:24px;background:var(--blue-xpale);border-radius:8px;border-left:4px solid var(--blue-main)">
        <h3 style="margin:0 0 16px 0;color:var(--blue-dark);font-size:16px;font-weight:700"><i class="fas fa-clipboard-list"></i> Assignment Details</h3>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:24px;font-size:14px">
          <div>
            <span style="color:var(--gray-600);font-size:12px;font-weight:600;text-transform:uppercase">Due Date</span>
            <div style="margin-top:6px;font-weight:600;font-size:16px">${escapeHtml(formatAssignmentDate(assignment.dueDate))}</div>
          </div>
          <div>
            <span style="color:var(--gray-600);font-size:12px;font-weight:600;text-transform:uppercase">Max Score</span>
            <div style="margin-top:6px;font-weight:600;font-size:16px">${escapeHtml(String(assignment.maxScore || 0))}</div>
          </div>
          <div>
            <span style="color:var(--gray-600);font-size:12px;font-weight:600;text-transform:uppercase">Created</span>
            <div style="margin-top:6px;font-weight:600;font-size:16px">${escapeHtml(formatAssignmentDate(assignment.createdDate))}</div>
          </div>
          <div>
            <span style="color:var(--gray-600);font-size:12px;font-weight:600;text-transform:uppercase">Status</span>
            <div style="margin-top:6px"><span style="padding:6px 12px;background:${assignment.status === 'Active' ? 'var(--success)' : 'var(--info)'};color:white;border-radius:4px;font-weight:700;font-size:12px">${escapeHtml(assignment.status || 'Active')}</span></div>
          </div>
        </div>
      </div>
      
      <div style="margin-bottom:30px;padding:24px;background:white;border-radius:8px;border:1px solid var(--gray-200)">
        <h3 style="margin:0 0 16px 0;color:var(--gray-800);font-size:16px;font-weight:700"><i class="fas fa-file-alt"></i> Instructions</h3>
        <p style="margin:0 0 16px 0;font-size:14px;line-height:1.8;color:var(--gray-700)">${escapeHtml(assignment.instructions || 'No instructions provided.')}</p>
        ${assignment.attachment ? `<div style="padding:12px;background:var(--gray-50);border-radius:6px;border-left:4px solid var(--blue-main);font-size:13px"><strong><i class="fas fa-paperclip"></i> Attachment:</strong> ${escapeHtml(assignment.attachment)}</div>` : ''}
      </div>
      
      <div style="display:flex;gap:12px;margin-bottom:30px">
        <button class="btn btn-secondary" onclick="currentMod='assignments';renderMain()"><i class="fas fa-arrow-left"></i> Back to Assignments</button>
        ${(currentRole === 'Teacher' || currentRole === 'Admin') ? `<button class="btn btn-primary" onclick="gradeAssignment('${assignmentId}')"><i class="fas fa-pen-fancy"></i> Grade Submissions</button>` : ''}
      </div>
    </div>
  `;

  document.getElementById('main-content').innerHTML = html;
  document.getElementById('main-content').scrollTop = 0;
}

async function gradeAssignment(assignmentId) {
  const assignment = findAssignmentRecord(assignmentId);
  if (!assignment) {
    showToast('<i class="fas fa-times-circle"></i> Assignment not found', 'error');
    return;
  }

  // Check if user is teacher
  if (currentRole !== 'Teacher' && currentRole !== 'Admin') {
    showToast('<i class="fas fa-times-circle"></i> Only teachers and admins can grade assignments', 'error');
    return;
  }
  if (currentRole === 'Teacher' && !getAssignedClassNamesForTeacher().includes(assignment.className || assignment.class)) {
    showToast('<i class="fas fa-lock"></i> You can only grade assignments for your assigned classes', 'error');
    return;
  }

  const res = await API.assignments.submissions(assignment.id);
  if (!res || !res.success) {
    showToast(res?.message || 'Unable to load submissions', 'error');
    return;
  }
  const submissions = res.data || [];
  const graded = submissions.filter(sub => sub.score !== null && sub.score !== undefined && sub.score !== '');
  const pending = submissions.filter(sub => sub.score === null || sub.score === undefined || sub.score === '');

  let gradingHTML = `
    <div style="max-width:900px;background:white;border-radius:12px">
      <div style="padding:20px;background:var(--blue-main);color:white">
        <h2 style="margin:0">${escapeHtml(assignment.title)} - Grading Interface</h2>
        <p style="margin:4px 0;font-size:13px;opacity:0.9">${escapeHtml(assignment.className || assignment.class || '')}</p>
      </div>
      
      <div style="padding:20px">
        <div style="margin-bottom:20px;padding:12px;background:var(--gold-light);border-radius:6px">
          <span style="font-size:12px;color:var(--gray-700)"><strong><i class="fas fa-book"></i> Max Score:</strong> ${assignment.maxScore} | <strong>Graded:</strong> ${graded.length} | <strong>Pending:</strong> ${pending.length}</span>
        </div>
        
        <h3 style="margin:20px 0 12px 0;color:var(--gray-800);font-size:13px;font-weight:700"><i class="fas fa-check-circle"></i> Already Graded</h3>
        <div style="margin-bottom:20px">
          ${graded.map(data => `
            <div style="padding:12px;background:var(--gray-50);border-radius:6px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center">
              <div>
                <strong>${escapeHtml(data.student_name)}</strong>
                <div style="font-size:11px;color:var(--gray-500);margin-top:2px">Scored: ${data.score}/${assignment.maxScore}</div>
              </div>
              <button class="btn btn-secondary btn-xs" onclick="openGradeSubmissionForm('${assignmentId}', '${data.student_id}')">Edit</button>
            </div>
          `).join('') || '<div style="padding:12px;color:var(--gray-400)">No graded submissions yet.</div>'}
        </div>
        
        ${pending.length > 0 ? `
        <h3 style="margin:20px 0 12px 0;color:var(--gray-800);font-size:13px;font-weight:700"><i class="fas fa-file-alt"></i> Pending Grading (${pending.length})</h3>
        <div style="margin-bottom:20px">
          ${pending.map((sub) => `
            <div style="padding:12px;background:var(--warning-light);border-radius:6px;margin-bottom:8px;border-left:4px solid var(--warning)">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <div>
                  <strong>${escapeHtml(sub.student_name)}</strong>
                  <div style="font-size:11px;color:var(--gray-600);margin-top:2px">${sub.submitted_at ? 'Submitted: ' + escapeHtml(formatAssignmentDate(sub.submitted_at)) : 'No submission date recorded'}</div>
                </div>
                <button class="btn btn-primary btn-xs" onclick="openGradeSubmissionForm('${assignmentId}', '${sub.student_id}')">Grade Now</button>
              </div>
            </div>
          `).join('')}
        </div>` : ''}
      </div>
      
      <div style="padding:16px;background:var(--gray-50);border-top:1px solid var(--gray-200);text-align:right">
        <button class="btn btn-secondary" onclick="closeModal()">Done Grading</button>
      </div>
    </div>
  `;

  openModal(gradingHTML);
}

async function createAssignment(event) {
  event.preventDefault();

  if (currentRole !== 'Teacher' && currentRole !== 'Admin') {
    showToast('<i class="fas fa-times-circle"></i> Only teachers and admins can create assignments', 'error');
    return;
  }

  const title = document.getElementById('asg-title').value;
  const subject = document.getElementById('asg-subject').value;
  const classId = parseInt(document.getElementById('asg-class').value, 10);
  const dueDate = document.getElementById('asg-duedate').value;
  const maxScore = document.getElementById('asg-maxscore').value;
  const instructions = document.getElementById('asg-instructions').value;
  const classRecord = classesData.find(c => parseInt(c.id, 10) === classId);
  const allowedClasses = getAssignedClassNamesForTeacher();
  const allowedSubjects = getVisibleSubjectsForRole(subjectsData).map(s => s.name);

  if (!title || !subject || !classId || !dueDate || !maxScore || !instructions) {
    showToast('<i class="fas fa-times-circle"></i> Please fill in all required fields', 'error');
    return;
  }

  if (currentRole === 'Teacher' && (!allowedClasses.includes(classRecord?.name) || !allowedSubjects.includes(subject))) {
    showToast('<i class="fas fa-lock"></i> You can only create assignments for your assigned classes and subjects', 'error');
    return;
  }

  const teacher = currentRole === 'Teacher' ? getCurrentTeacherProfile() : null;
  const attachment = document.getElementById('asg-attachment').files.length > 0 ? document.getElementById('asg-attachment').files[0].name : null;
  const res = await API.assignments.create({
    title,
    subject,
    class_id: classId,
    teacher_id: teacher ? teacher.id : null,
    due_date: dueDate,
    created_date: new Date().toISOString().split('T')[0],
    max_score: parseInt(maxScore, 10),
    status: 'Active',
    instructions,
    attachment
  });
  if (!res || !res.success) {
    showToast(res?.message || 'Failed to create assignment', 'error');
    return;
  }

  // Clear form
  document.getElementById('create-assignment-form').reset();
  if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();

  showToast('<i class="fas fa-check-circle"></i> Assignment created and published successfully!', 'success');

  // Refresh the page  
  setTimeout(() => {
    renderMain();
  }, 1500);
}

async function saveDraftAssignment() {
  const title = document.getElementById('asg-title').value;
  const subject = document.getElementById('asg-subject').value;
  const classId = parseInt(document.getElementById('asg-class').value, 10);
  const dueDate = document.getElementById('asg-duedate').value;
  if (!title || !subject || !classId || !dueDate) {
    showToast('<i class="fas fa-times-circle"></i> Title, subject, class, and due date are required for a draft', 'error');
    return;
  }
  const teacher = currentRole === 'Teacher' ? getCurrentTeacherProfile() : null;
  const res = await API.assignments.create({
    title,
    subject,
    class_id: classId,
    teacher_id: teacher ? teacher.id : null,
    due_date: dueDate,
    created_date: new Date().toISOString().split('T')[0],
    max_score: parseInt(document.getElementById('asg-maxscore').value || '50', 10),
    status: 'Upcoming',
    instructions: document.getElementById('asg-instructions').value || ''
  });
  if (!res || !res.success) {
    showToast(res?.message || 'Failed to save draft assignment', 'error');
    return;
  }
  document.getElementById('create-assignment-form').reset();
  if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
  showToast('<i class="fas fa-save"></i> Assignment saved as draft', 'info');
  renderMain();
}

async function openGradeSubmissionForm(assignmentId, studentId) {
  const assignment = findAssignmentRecord(assignmentId);
  const res = await API.assignments.submissions(assignmentId);
  if (!assignment || !res || !res.success) {
    showToast(res?.message || 'Unable to load student submission', 'error');
    return;
  }
  const sub = (res.data || []).find(row => parseInt(row.student_id, 10) === parseInt(studentId, 10));
  if (!sub) {
    showToast('<i class="fas fa-times-circle"></i> Student is not in this assignment class', 'error');
    return;
  }

  const formHTML = `
    <div style="max-width:600px;background:white;border-radius:12px;overflow:hidden">
      <div style="padding:20px;background:var(--blue-main);color:white">
        <h2 style="margin:0">Grade Submission</h2>
        <p style="margin:8px 0 0 0;font-size:13px;opacity:0.9">${escapeHtml(sub.student_name)}</p>
      </div>
      
      <form onsubmit="submitGrade(event, '${assignmentId}', '${sub.student_id}')">
        <div style="padding:20px">
          <div class="f-field" style="margin-bottom:16px">
            <label>Raw Score</label>
            <div style="position:relative">
              <input type="number" id="grade-score" min="0" max="${assignment.maxScore}" placeholder="0" value="${sub.score !== null && sub.score !== undefined ? sub.score : ''}" required style="font-size:24px;padding:12px;text-align:center;font-weight:700">
              <div style="position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:14px;color:var(--gray-500)">/ ${assignment.maxScore}</div>
            </div>
          </div>
          
          <div class="f-field" style="margin-bottom:16px">
            <label>Feedback for Student</label>
            <textarea id="grade-feedback" placeholder="Provide constructive feedback..." style="min-height:100px">${escapeHtml(sub.feedback || '')}</textarea>
          </div>
          
          <div style="padding:12px;background:var(--blue-xpale);border-radius:6px;border-left:4px solid var(--blue-main);margin-bottom:16px;font-size:12px;color:var(--blue-dark)">
            <strong><i class="fas fa-lightbulb"></i> Tip:</strong> Be specific and encouraging in your feedback. Students value comments on what they did well and what to improve.
          </div>
        </div>
        
        <div style="padding:16px;background:var(--gray-50);border-top:1px solid var(--gray-200);display:flex;gap:8px;justify-content:flex-end">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Submit Grade</button>
        </div>
      </form>
    </div>
  `;

  openModal(formHTML);
}

async function submitGrade(event, assignmentId, studentId) {
  event.preventDefault();

  const score = parseFloat(document.getElementById('grade-score').value);
  const feedback = document.getElementById('grade-feedback').value;
  const assignment = findAssignmentRecord(assignmentId);

  if (score < 0 || score > assignment.maxScore) {
    showToast('<i class="fas fa-times-circle"></i> Score must be between 0 and ' + assignment.maxScore, 'error');
    return;
  }

  const res = await API.assignments.grade({
    assignment_id: parseInt(assignmentId, 10),
    student_id: parseInt(studentId, 10),
    submitted_at: new Date().toISOString().split('T')[0],
    score,
    feedback
  });
  if (!res || !res.success) {
    showToast(res?.message || 'Failed to save grade', 'error');
    return;
  }

  closeModal();
  if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
  showToast('<i class="fas fa-check-circle"></i> Grade submitted and feedback sent to student!', 'success');

  setTimeout(() => {
    gradeAssignment(assignmentId);
  }, 1500);
}

// FEES MODULE (Enhanced for Parents)
function getFeeRecords() {
  return Array.isArray(window.feesData) ? window.feesData : [];
}

function getPaymentRecords() {
  return Array.isArray(window.paymentsData) ? window.paymentsData : [];
}

function formatMoney(amount) {
  return 'GH₵' + Number(amount || 0).toLocaleString();
}

function feeStatusClass(status) {
  return status === 'Paid' ? 'b-success' : status === 'Partial' ? 'b-warning' : 'b-danger';
}

function getFeeRowsForStudent(studentId) {
  const id = parseInt(studentId, 10);
  return getFeeRecords().filter(f => parseInt(f.student_id, 10) === id);
}

function getPaymentsForStudent(studentId) {
  const id = parseInt(studentId, 10);
  return getPaymentRecords().filter(p => parseInt(p.student_id, 10) === id);
}

function latestPaymentForStudent(studentId) {
  return getPaymentsForStudent(studentId)[0] || null;
}

function renderPaymentRowsForStudent(studentId) {
  const rows = getPaymentsForStudent(studentId);
  return rows.length ? rows.map(p => `<tr><td>${escapeHtml(p.date || '')}</td><td>${escapeHtml(p.term || 'Fee Payment')}</td><td style="color:var(--success);font-weight:700">${formatMoney(p.amount)}</td><td><button class="btn btn-secondary btn-xs" onclick="generateReceiptById(${p.id})"><i class="fas fa-download"></i> Receipt</button></td></tr>`).join('') : '<tr><td colspan="4" style="text-align:center;color:var(--gray-400);padding:14px">No payment records found.</td></tr>';
}

function generateReceiptById(paymentId) {
  const payment = getPaymentRecords().find(p => parseInt(p.id, 10) === parseInt(paymentId, 10));
  if (!payment) return showToast('Receipt not found', 'error');
  const index = getFilteredPayments ? getFilteredPayments().findIndex(p => parseInt(p.id, 10) === parseInt(paymentId, 10)) : -1;
  if (index >= 0 && typeof generatePaymentReceipt === 'function') return generatePaymentReceipt(index);
  openModal(`<div style="padding:30px;width:560px">
    <h2 style="margin:0;color:var(--blue-dark)">Glory Reign Preparatory School</h2>
    <div style="font-size:12px;color:var(--gray-600);margin-bottom:18px">Official Payment Receipt</div>
    <div style="border:1px solid var(--gray-200);border-radius:8px;padding:18px">
      <div><strong>Receipt:</strong> ${escapeHtml(payment.receipt || 'N/A')}</div>
      <div><strong>Student:</strong> ${escapeHtml(payment.student || '')}</div>
      <div><strong>Amount:</strong> ${formatMoney(payment.amount)}</div>
      <div><strong>Date:</strong> ${escapeHtml(payment.date || '')}</div>
      <div><strong>Method:</strong> ${escapeHtml(payment.method || '')}</div>
    </div>
    <button class="btn btn-secondary" style="margin-top:16px" onclick="closeModal()">Close</button>
  </div>`);
}

function feesModule() {
  const isParent = currentRole === 'Parent';
  const isAdmin = currentRole === 'Admin';
  const isStudent = currentRole === 'Student';
  const isAccountant = currentRole === 'Accountant';

  if (isStudent) {
    const student = getCurrentStudentRecord();
    const feeRows = getFeeRowsForStudent(student.id);
    const activeFee = feeRows[0] || { amountDue: student.feeAmount || 0, amountPaid: 0, balance: student.feeAmount || 0, status: student.fees_status || 'Pending', term: 'Current Term', academic_year: '' };
    const latestPayment = latestPaymentForStudent(student.id);
    const statusClass = feeStatusClass(activeFee.status);
    return hdr('My Fees Status', 'View your own fee balance and receipts', 'Fees') + `
    <div class="stats-row" style="margin-bottom:20px">
      ${statCard('<i class="fas fa-money-bill"></i>', formatMoney(activeFee.amountDue), 'Term Fee', `${activeFee.term || 'Current Term'} ${activeFee.academic_year || ''}`, 'neu', 'si-blue')}
      ${statCard('<i class="fas fa-check-circle"></i>', activeFee.status, 'Payment Status', 'Your account only', activeFee.status === 'Paid' ? 'up' : 'dn', activeFee.status === 'Paid' ? 'si-green' : 'si-red')}
      ${statCard('<i class="fas fa-receipt"></i>', latestPayment?.receipt || 'None', 'Latest Receipt', latestPayment ? 'Available' : 'No payment yet', 'neu', 'si-gold')}
      ${statCard('<i class="fas fa-hourglass-half"></i>', formatMoney(activeFee.balance), 'Outstanding', activeFee.balance > 0 ? 'Balance due' : 'All clear', activeFee.balance > 0 ? 'dn' : 'up', activeFee.balance > 0 ? 'si-red' : 'si-green')}
    </div>
    <div class="g2">
      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-user-graduate"></i> Fee Summary</span></div>
        <div style="padding:16px;background:${activeFee.status === 'Paid' ? 'var(--success-light)' : 'var(--warning-light)'};border-radius:10px;border-left:4px solid ${activeFee.status === 'Paid' ? 'var(--success)' : 'var(--warning)'};margin-bottom:14px">
          <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px">
            <div>
              <div style="font-size:12px;color:var(--gray-600)">${escapeHtml(activeFee.term || 'Current Term')} ${escapeHtml(activeFee.academic_year || '')}</div>
              <div style="font-size:24px;font-weight:800;color:var(--blue-dark)">${formatMoney(activeFee.amountDue)}</div>
            </div>
            <span class="badge ${statusClass}">${escapeHtml(activeFee.status)}</span>
          </div>
        </div>
        <table class="tbl" style="font-size:12px">
          <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Receipt</th></tr></thead>
          <tbody>
            ${renderPaymentRowsForStudent(student.id)}
          </tbody>
        </table>
      </div>
      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-info-circle"></i> Payment Note</span></div>
        <div style="font-size:12px;color:var(--gray-600);line-height:1.7">Students can view only their own fee status and receipts. For corrections or payment issues, contact the accountant or your parent/guardian.</div>
      </div>
    </div>`;
  }

  if (isParent) {
    const children = getParentChildren();
    const childIds = new Set(children.map(c => parseInt(c.id, 10)).filter(Boolean));
    const childFees = getFeeRecords().filter(f => childIds.has(parseInt(f.student_id, 10)));
    const childPayments = getPaymentRecords().filter(p => childIds.has(parseInt(p.student_id, 10)));
    const totalDue = childFees.reduce((sum, f) => sum + Number(f.amountDue || 0), 0);
    const totalPaid = childFees.reduce((sum, f) => sum + Number(f.amountPaid || 0), 0);
    const totalBalance = childFees.reduce((sum, f) => sum + Number(f.balance || 0), 0);
    const feeCards = children.map(child => {
      const fee = childFees.find(f => parseInt(f.student_id, 10) === parseInt(child.id, 10)) || { amountDue: 0, amountPaid: 0, balance: 0, status: 'Pending', term: 'Current Term', academic_year: '' };
      const statusClass = feeStatusClass(fee.status);
      return `<div class="card">
        <div class="card-hdr">
          <span class="card-title"><i class="fas fa-child"></i> ${escapeHtml(child.name)} - Fees Summary</span>
          <span class="card-act"><span class="badge ${statusClass}">${escapeHtml(fee.status)}</span></span>
        </div>
        <div style="padding:16px;background:${fee.status === 'Paid' ? 'var(--success-light)' : 'var(--warning-light)'};border-radius:10px;border-left:4px solid ${fee.status === 'Paid' ? 'var(--success)' : 'var(--warning)'};margin-bottom:14px">
          <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px">
            <div>
              <div style="font-size:12px;color:var(--gray-600)">${escapeHtml(fee.term || 'Current Term')} ${escapeHtml(fee.academic_year || '')}</div>
              <div style="font-size:24px;font-weight:800;color:var(--blue-dark)">${formatMoney(fee.amountDue)}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:12px;color:var(--success);font-weight:700">Paid ${formatMoney(fee.amountPaid)}</div>
              <div style="font-size:11px;color:var(--gray-600)">Balance ${formatMoney(fee.balance)}</div>
            </div>
          </div>
        </div>
        <table class="tbl" style="font-size:12px">
          <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Receipt</th></tr></thead>
          <tbody>${renderPaymentRowsForStudent(child.id)}</tbody>
        </table>
      </div>`;
    }).join('') || '<div class="card"><div style="padding:20px;color:var(--gray-400);text-align:center">No child fee records found.</div></div>';
    const historyRows = childPayments.slice(0, 5).map(p => `<div style="padding:10px;background:var(--gray-50);border-radius:8px;font-size:12px;border-left:3px solid var(--success)">
      <div style="font-weight:600;color:var(--success)">${formatMoney(p.amount)} - ${escapeHtml(p.student || '')} ${escapeHtml(p.term || '')}</div>
      <div style="color:var(--gray-500);font-size:11px">${escapeHtml(p.date || '')} | Receipt: ${escapeHtml(p.receipt || 'N/A')}</div>
    </div>`).join('') || '<div style="padding:12px;color:var(--gray-400);font-size:12px">No payment history found.</div>';
    return hdr('Fees & Payments', 'Manage your children\'s school fees and payment history', 'Fees') + `
    <div class="stats-row" style="margin-bottom:20px">
      ${statCard('<i class="fas fa-money-bill"></i>', formatMoney(totalDue), 'Total Fees Due', children.length + ' child records', 'neu', 'si-blue')}
      ${statCard('<i class="fas fa-check-circle"></i>', formatMoney(totalPaid), 'Total Paid', totalDue ? Math.round(totalPaid / totalDue * 100) + '%' : '0%', 'up', 'si-green')}
      ${statCard('<i class="fas fa-hourglass-half"></i>', formatMoney(totalBalance), 'Outstanding Balance', totalBalance > 0 ? 'Action needed' : 'All Clear', totalBalance > 0 ? 'dn' : 'up', totalBalance > 0 ? 'si-red' : 'si-gold')}
      ${statCard('<i class="fas fa-receipt"></i>', childPayments.length, 'Receipts', 'Database records', 'neu', 'si-purple')}
    </div>

    <div class="g2" style="margin-bottom:20px">${feeCards}</div>

    <div class="g2">
      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-credit-card"></i> Payment Methods</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <button class="btn btn-primary" style="padding:14px;cursor:pointer" onclick="makePayment()"><i class="fas fa-mobile-alt"></i> Mobile Money</button>
          <button class="btn btn-primary" style="padding:14px;cursor:pointer" onclick="makePayment()"><i class="fas fa-university"></i> Bank Transfer</button>
          <button class="btn btn-primary" style="padding:14px;cursor:pointer" onclick="makePayment()"><i class="fas fa-money-bill"></i> Cash Payment</button>
          <button class="btn btn-primary" style="padding:14px;cursor:pointer" onclick="makePayment()"><i class="fas fa-credit-card"></i> Card Payment</button>
        </div>
        <div style="margin-top:12px;padding:12px;background:var(--blue-xpale);border-radius:8px;font-size:12px;color:var(--blue-dark)">
          <strong><i class="fas fa-info-circle"></i> Note:</strong> All payments are shown from database records.
        </div>
      </div>

      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-history"></i> Payment History</span></div>
        <button class="btn btn-secondary btn-sm" style="width:100%;margin-bottom:12px;cursor:pointer" onclick="viewGeneralPaymentHistory()"><i class="fas fa-eye"></i> View Full History</button>
        <div style="display:flex;flex-direction:column;gap:8px">${historyRows}</div>
      </div>
    </div>

    <div style="margin-top:20px;padding:14px;background:var(--warning-light);border-radius:8px;border-left:4px solid var(--warning)">
      <div style="font-size:13px;font-weight:600;color:var(--warning);margin-bottom:4px"><i class="fas fa-lightbulb"></i> Payment Tips</div>
      <ul style="font-size:12px;color:var(--gray-700);padding-left:20px;margin:8px 0 0 0;line-height:1.6">
        <li>Pay fees before the deadline to avoid penalties</li>
        <li>Keep receipts for your records and verification</li>
        <li>Contact the school accountant if you encounter payment issues</li>
        <li>Scholarship requests can be made through the school office</li>
      </ul>
    </div>`;
  }

  if (!isAdmin && !isAccountant) {
    return accessDeniedModule('fees');
  }

  // Admin/Accountant view: Show all students fees
  const recordPaymentBtn = (isAdmin || isAccountant) ? `<button class="btn btn-gold btn-sm" onclick="navTo('payments')">+ Record Payment</button>` : '';
  const feeRecords = getFeeRecords();
  const totalDue = feeRecords.reduce((sum, f) => sum + Number(f.amountDue || 0), 0);
  const totalPaid = feeRecords.reduce((sum, f) => sum + Number(f.amountPaid || 0), 0);
  const totalOutstanding = feeRecords.reduce((sum, f) => sum + Number(f.balance || 0), 0);
  const paidCount = feeRecords.filter(f => f.status === 'Paid').length;
  const defaulters = feeRecords.filter(f => f.status !== 'Paid').length;
  const classOptions = [...new Set(feeRecords.map(f => f.className).filter(Boolean))].map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
  const feeRows = feeRecords.map(record => {
    const statusColor = feeStatusClass(record.status);
    return `
      <tr class="fee-row" data-student="${escapeAttr((record.student || '').toLowerCase())}" data-class="${escapeAttr(record.className || '')}" data-status="${escapeAttr(record.status || '')}">
        <td><div style="display:flex;align-items:center;gap:8px"><div class="av av-sm av-blue">${escapeHtml((record.student || 'S')[0])}</div>${escapeHtml(record.student || '')}</div></td>
        <td>${escapeHtml(record.className || '')}</td>
        <td>${formatMoney(record.amountDue)}</td>
        <td style="color:var(--success);font-weight:700">${formatMoney(record.amountPaid)}</td>
        <td style="color:${Number(record.balance || 0) <= 0 ? 'var(--success)' : 'var(--danger)'};font-weight:700">${formatMoney(record.balance)}</td>
        <td>${escapeHtml(record.paymentDate || '')}</td>
        <td style="color:var(--blue-main)">${escapeHtml(record.receipt || '')}</td>
        <td><span class="badge ${statusColor}">${escapeHtml(record.status || 'Pending')}</span></td>
      </tr>`;
  }).join('') || '<tr><td colspan="8" style="text-align:center;color:var(--gray-400);padding:18px">No fee records found.</td></tr>';
  const structureRows = classesData.map(c => {
    const fee = (window.feeStructureData || []).find(f => Number(f.classId) === Number(c.id));
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--gray-100)">
      <span style="font-size:13px;font-weight:600">${escapeHtml(c.name)}</span>
      <span style="font-size:16px;font-weight:800;color:var(--blue-dark)">${fee ? formatMoney(fee.amount) : 'Not set'}</span>
    </div>`;
  }).join('') || '<div style="padding:12px;color:var(--gray-400)">No class fee structure found.</div>';

  let html = hdr('Fees & Payments', 'Student fee management and payment records', 'Fees') + `
  <div class="stats-row">
    ${statCard('<i class="fas fa-money-bill"></i>', formatMoney(totalPaid), 'Total Collected', totalDue ? Math.round(totalPaid / totalDue * 100) + '% of due' : 'No fees due', 'up', 'si-blue')}
    ${statCard('<i class="fas fa-hourglass-half"></i>', formatMoney(totalOutstanding), 'Outstanding', defaulters + ' students', totalOutstanding > 0 ? 'dn' : 'up', 'si-red')}
    ${statCard('<i class="fas fa-check-circle"></i>', paidCount, 'Paid Students', feeRecords.length ? Math.round(paidCount / feeRecords.length * 100) + '%' : '0%', 'up', 'si-green')}
    ${statCard('<i class="fas fa-exclamation-triangle"></i>', defaulters, 'Defaulters', defaulters ? 'Action needed' : 'All clear', defaulters ? 'dn' : 'up', 'si-gold')}
  </div>
  <div class="g21">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-credit-card"></i> Payment Records</span>
        <div style="display:flex;gap:8px">
          ${recordPaymentBtn}
          <button class="btn btn-secondary btn-sm" onclick="exportPaymentData()"><i class="fas fa-download"></i> Export</button>
        </div>
      </div>
      <div class="toolbar">
        <div class="search-bar"><span><i class="fas fa-search"></i></span><input id="fee-search" placeholder="Search student..." onkeyup="filterFeeRecords()"></div>
        <select id="fee-class-filter" class="select-sm" onchange="filterFeeRecords()">
          <option value="">All Classes</option>
          ${classOptions}
        </select>
        <select id="fee-status-filter" class="select-sm" onchange="filterFeeRecords()">
          <option value="">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
      <table class="tbl">
        <thead><tr><th>Student</th><th>Class</th><th>Term Fee</th><th>Paid</th><th>Balance</th><th>Date</th><th>Receipt</th><th>Status</th></tr></thead>
        <tbody id="fee-records-table">${feeRows}</tbody>
      </table>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:18px;padding-top:14px;border-top:1px solid var(--gray-200)">
        <span style="font-size:12px;color:var(--gray-500)">Showing ${feeRecords.length} database fee records</span>
      </div>
    </div>
    <div>
      <div class="fee-hero mb16">
        <h3>Collected This Term</h3>
        <div class="amount">${formatMoney(totalPaid)}</div>
        <div class="sub">Due: ${formatMoney(totalDue)}</div>
        <div style="margin-top:12px;background:rgba(255,255,255,.15);border-radius:4px;height:8px">
          <div style="width:${totalDue ? Math.min(100, Math.round(totalPaid / totalDue * 100)) : 0}%;background:var(--gold);height:8px;border-radius:4px"></div>
        </div>
        <div style="font-size:11px;opacity:.65;margin-top:6px">${totalDue ? Math.round(totalPaid / totalDue * 100) : 0}% of due fees collected</div>
      </div>
      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-building"></i> Fee Structure</span><span class="card-act" onclick="navTo('feestructure')">Edit</span></div>
        ${structureRows}
        <button class="btn btn-primary" style="width:100%;margin-top:14px" onclick="navTo('feestructure')">View Full Structure</button>
      </div>
    </div>
  </div>`;
  return html;
}

function filterFeeRecords() {
  const searchVal = document.getElementById('fee-search').value.toLowerCase();
  const classVal = document.getElementById('fee-class-filter').value.toLowerCase();
  const statusVal = document.getElementById('fee-status-filter').value.toLowerCase();

  document.querySelectorAll('.fee-row').forEach(row => {
    const student = row.getAttribute('data-student');
    const feeClass = row.getAttribute('data-class').toLowerCase();
    const status = row.getAttribute('data-status').toLowerCase();

    const matchesSearch = student.includes(searchVal);
    const matchesClass = !classVal || feeClass === classVal;
    const matchesStatus = !statusVal || status === statusVal;

    row.style.display = (matchesSearch && matchesClass && matchesStatus) ? '' : 'none';
  });

  showToast('<i class="fas fa-check-circle"></i> Records filtered', 'success');
}

function exportPaymentData() {
  const records = document.querySelectorAll('.fee-row');
  let csv = 'Student,Class,Term Fee,Paid,Balance,Date,Receipt,Status\n';

  records.forEach(row => {
    if (row.style.display !== 'none') {
      const cells = row.querySelectorAll('td');
      const data = [
        cells[0].textContent.trim(),
        cells[1].textContent.trim(),
        cells[2].textContent.trim(),
        cells[3].textContent.trim(),
        cells[4].textContent.trim(),
        cells[5].textContent.trim(),
        cells[6].textContent.trim(),
        cells[7].textContent.trim()
      ];
      csv += data.map(d => `"${d}"`).join(',') + '\n';
    }
  });

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', 'payment-records-' + new Date().toISOString().slice(0, 10) + '.csv');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

  showToast('<i class="fas fa-check-circle"></i> Payment records exported as CSV', 'success');
}


// PAYMENTS MODULE (Accountant)
function paymentsModule() {
  if (!['Admin', 'Accountant'].includes(currentRole)) return accessDeniedModule('payments');

  const today = new Date().toISOString().slice(0, 10);
  const studentOptions = getActiveStudents(enrolledStudents).map(s => `<option value="${s.id}">${escapeHtml(s.name)} (${escapeHtml(s.student_id || '')}) - ${escapeHtml(s.student_class || '')}</option>`).join('');
  const todayPayments = getPaymentRecords().filter(p => p.date === today);
  const todayTotal = todayPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const todayRows = todayPayments.slice(0, 8).map(p => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--gray-100)">
        <div style="font-size:11px;color:var(--gray-400);min-width:55px">${escapeHtml(p.date || '')}</div>
        <div style="flex:1"><div style="font-size:12.5px;font-weight:600">${escapeHtml(p.student || '')}</div><div style="font-size:10px;color:var(--gray-400)">${escapeHtml(p.receipt || '')}</div></div>
        <div style="font-size:13px;font-weight:700;color:var(--success)">${formatMoney(p.amount)}</div>
      </div>`).join('') || '<div style="padding:12px;color:var(--gray-400);font-size:12px">No payments recorded today.</div>';

  return hdr('Cash Payments', 'Record and manage cash fee payments', 'Payments') + `
  <div class="g21">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-dollar-sign"></i> Record Cash Payment</span></div>
      <form onsubmit="recordPayment(event)">
        <div class="f-row">
          <div class="f-field"><label>Student</label><select id="pay-student" required>${studentOptions}</select></div>
          <div class="f-field"><label>Method</label><select id="pay-method" required><option>Cash</option><option>Mobile Money</option><option>Bank Transfer</option><option>Cheque</option><option>Paystack</option></select></div>
        </div>
        <div class="f-row">
          <div class="f-field"><label>Amount Paying</label><input type="number" id="pay-amount" placeholder="0.00" min="1" step="0.01" required></div>
          <div class="f-field"><label>Term</label><select id="pay-term" required><option>1st Term</option><option>2nd Term</option><option>3rd Term</option></select></div>
        </div>
        <div class="f-row">
          <div class="f-field"><label>Academic Year</label><input id="pay-year" value="2024/2025" required></div>
          <div class="f-field"><label>Payment Date</label><input type="date" id="pay-date" value="${today}" required></div>
        </div>
        <div class="f-row">
          <div class="f-field"><label>Received By</label><input id="pay-received-by" value="${escapeHtml(getSessionUser()?.name || 'Accountant')}"></div>
          <div class="f-field"><label>Receipt No. Optional</label><input id="pay-receipt" placeholder="Auto-generated if empty"></div>
        </div>
        <div class="f-field" style="margin-bottom:14px"><label>Remarks / Notes</label><textarea id="pay-remarks" placeholder="Optional notes..."></textarea></div>
        <div style="padding:14px;background:var(--gold-xlight);border-radius:var(--radius);border:1px solid var(--gold-light);margin-bottom:14px">
          <div style="font-size:12px;color:var(--gray-600);margin-bottom:6px"><i class="fas fa-exclamation-triangle"></i> Payments are written directly to the database.</div>
          <div style="font-size:12px;color:var(--gray-600)">Receipts are generated by the backend and linked to the student fee record.</div>
        </div>
        <div style="display:flex;gap:8px">
          <button type="submit" class="btn btn-gold"><i class="fas fa-dollar-sign"></i> Record & Issue Receipt</button>
          <button type="button" class="btn btn-secondary" onclick="navTo('fees')">Cancel</button>
        </div>
      </form>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-bar"></i> Today's Collections</span></div>
      <div class="fee-hero" style="margin-bottom:16px">
        <h3>Today - ${today}</h3>
        <div class="amount">${formatMoney(todayTotal)}</div>
        <div class="sub">${todayPayments.length} payments processed today</div>
      </div>
      ${todayRows}
    </div>
  </div>`;
}

async function recordPayment(event) {
  event.preventDefault();
  if (!['Admin', 'Accountant'].includes(currentRole)) {
    showToast('<i class="fas fa-lock"></i> Only finance staff can record payments', 'error');
    return;
  }

  const studentId = parseInt(document.getElementById('pay-student').value, 10);
  const amount = parseFloat(document.getElementById('pay-amount').value);
  const term = document.getElementById('pay-term').value;
  const academicYear = document.getElementById('pay-year').value;
  const date = document.getElementById('pay-date').value;
  const method = document.getElementById('pay-method').value;
  const remarks = document.getElementById('pay-remarks').value;
  let receiptNo = document.getElementById('pay-receipt').value.trim();
  const receivedBy = document.getElementById('pay-received-by').value.trim();

  if (!studentId || !amount || amount <= 0 || !term || !academicYear || !date) {
    showToast('<i class="fas fa-times-circle"></i> Please fill in all required fields correctly', 'error');
    return;
  }

  if (method === 'Paystack') {
    const transaction = await openPaystackCheckout(amount);
    if (!transaction) return;
    receiptNo = transaction.reference || transaction.trxref || receiptNo;
  }

  const res = await API.fees.recordPayment({
    student_id: studentId,
    amount,
    term,
    academic_year: academicYear,
    payment_date: date,
    method,
    receipt_no: receiptNo || undefined,
    received_by: receivedBy || undefined,
    remarks
  });
  if (!res || !res.success) {
    showToast(res?.message || 'Payment could not be recorded', 'error');
    return;
  }

  if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
  showToast(`<i class="fas fa-check-circle"></i> Payment processed. Receipt ${res.receipt_no} issued`, 'success');
  event.target.reset();
  setTimeout(() => navTo('fees'), 800);
}

const PAYSTACK_PUBLIC_KEY = 'pk_live_3ea0367bf3251d4990bd3a9d6e513103ad62df0e';
function openPaystackCheckout(amount) {
  return new Promise(resolve => {
    if (typeof PaystackPop === 'undefined') {
      showToast('Paystack could not load. Check your connection and try again.', 'error');
      return resolve(null);
    }
    const user = getSessionUser() || {};
    const reference = 'GRPS-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    new PaystackPop().newTransaction({
      key: PAYSTACK_PUBLIC_KEY,
      email: user.email || 'payments@gloryreign.edu.gh',
      amount: Math.round(Number(amount) * 100),
      currency: 'GHS',
      reference,
      onSuccess: transaction => resolve(transaction || { reference }),
      onCancel: () => { showToast('Paystack payment cancelled', 'info'); resolve(null); },
      onError: error => { showToast(error?.message || 'Paystack payment failed', 'error'); resolve(null); }
    });
  });
}


function viewArchivedTeachers() {
  const archived = getArchivedTeachers();
  const rows = archived.length ? archived.map((t, i) => '<tr><td>' + (i + 1) + '</td><td>' + escapeHtml(t.name || '') + '</td><td>' + escapeHtml(t.teacher_id || '') + '</td><td>' + escapeHtml(t.subject || '') + '</td><td>' + escapeHtml(t.department || '') + '</td><td>' + escapeHtml(t.class_assigned || '') + '</td><td>' + escapeHtml(t.phone || '') + '</td><td>' + escapeHtml(t.email || '') + '</td><td>' + escapeHtml(t.archived_date || '') + '</td><td><button class="btn btn-secondary btn-xs" onclick="viewTeacherProfile(\'' + escapeAttr(t.teacher_id) + '\')">View</button><button class="btn btn-primary btn-xs" onclick="restoreTeacher(\'' + escapeAttr(t.teacher_id) + '\')" style="margin-left:6px">Restore</button></td></tr>').join('') : '<tr><td colspan="10" style="text-align:center;padding:30px;color:var(--gray-400)">No archived teachers</td></tr>';
  document.getElementById('main-content').innerHTML = hdr('Archived Teachers', 'Teachers who no longer work at the school', 'Teachers') + `
  <div class="toolbar"><button class="btn btn-secondary" onclick="navTo('teachers')"><i class="fas fa-arrow-left"></i> Back to Teachers</button></div>
  <div class="card records-table-card">
    <div class="table-wrapper records-table-wrapper">
    <table class="tbl records-table archived-teachers-table">
      <thead><tr><th>#</th><th>Teacher</th><th>ID</th><th>Subject</th><th>Department</th><th>Class</th><th>Phone</th><th>Email</th><th>Archived Date</th><th>Actions</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    </div>
  </div>`;
}


function filterNotices() {
  const searchTerm = (document.getElementById('notice-search')?.value || '').toLowerCase();
  const noticeItems = document.querySelectorAll('.notice-item');

  noticeItems.forEach(item => {
    const title = item.dataset.title || '';
    const audience = item.dataset.audience || '';
    const activeFilter = document.querySelector('.filter-btn.active');
    const audienceFilter = activeFilter ? activeFilter.dataset.audience : 'All';

    const matchesSearch = title.includes(searchTerm);
    const matchesAudience = audienceFilter === 'All' || audience === audienceFilter;

    item.style.display = matchesSearch && matchesAudience ? 'block' : 'none';
  });
}

function filterByAudience(audience) {
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`.filter-btn[data-audience="${audience}"]`);
  if (activeBtn) activeBtn.classList.add('active');
  filterNotices();
}

async function publishNotice(event) {
  event.preventDefault();

  const title    = document.getElementById('notice-title').value.trim();
  const audience = document.getElementById('notice-audience').value;
  const priority = document.getElementById('notice-priority').value;
  const message  = document.getElementById('notice-message').value.trim();

  if (!title || !message) {
    showToast('<i class="fas fa-times-circle"></i> Please fill all required fields', 'error');
    return;
  }

  const btn = event.target.querySelector('[type=submit]') || event.target.querySelector('.btn-primary');
  if (btn) { btn.disabled = true; btn.textContent = 'Publishing...'; }

  const res = await API.notices.create({ title, audience, priority, message,
    posted_by: currentRole, notice_date: new Date().toISOString().split('T')[0] });

  if (btn) { btn.disabled = false; btn.textContent = 'Publish Notice'; }

  if (!res || !res.success) {
    showToast('<i class="fas fa-times-circle"></i> ' + (res?.message || 'Failed to publish'), 'error');
    return;
  }

  event.target.reset();
  showToast(`<i class="fas fa-check-circle"></i> Notice "${title}" published!`, 'success');
  setTimeout(() => renderMain(), 1200);
}

function draftNotice() {
  const title = document.getElementById('notice-title').value;

  if (!title) {
    showToast('<i class="fas fa-times-circle"></i> Please enter a title for your draft', 'error');
    return;
  }

  showToast(`<i class="fas fa-file-alt"></i> Draft "${title}" saved to your account`, 'info');
  document.querySelector('form[onsubmit="publishNotice(event)"]').reset();
}

function editNotice(noticeId) {
  const notice = NOTICES_DATA.find(n => n.id === noticeId);
  if (!notice) {
    showToast('<i class="fas fa-times-circle"></i> Notice not found', 'error');
    return;
  }

  const formHTML = `
    <div style="max-width:850px;background:white;border-radius:12px;overflow:hidden">
      <div style="padding:20px;background:var(--blue-main);color:white">
        <h2 style="margin:0">Edit Notice</h2>
        <p style="margin:8px 0 0 0;font-size:13px;opacity:0.9">${notice.title}</p>
      </div>
      
      <form onsubmit="saveEditNotice(event, ${noticeId})" style="padding:20px">
        <div class="f-field" style="margin-bottom:12px">
          <label>Notice Title</label>
          <input type="text" id="edit-notice-title" value="${notice.title}" required>
        </div>
        
        <div class="f-field" style="margin-bottom:12px">
          <label>Target Audience</label>
          <select id="edit-notice-audience" required>
            <option value="All" ${notice.audience === 'All' ? 'selected' : ''}>All</option>
            <option value="Students" ${notice.audience === 'Students' ? 'selected' : ''}>Students</option>
            <option value="Staff" ${notice.audience === 'Staff' ? 'selected' : ''}>Staff</option>
            <option value="Teachers" ${notice.audience === 'Teachers' ? 'selected' : ''}>Teachers</option>
            <option value="Parents" ${notice.audience === 'Parents' ? 'selected' : ''}>Parents</option>
            <option value="Form 3" ${notice.audience === 'Form 3' ? 'selected' : ''}>Form 3 Only</option>
          </select>
        </div>
        
        <div class="f-field" style="margin-bottom:12px">
          <label>Priority</label>
          <select id="edit-notice-priority" required>
            <option value="Normal" ${notice.priority === 'Normal' ? 'selected' : ''}>Normal</option>
            <option value="Important" ${notice.priority === 'Important' ? 'selected' : ''}>Important</option>
            <option value="Urgent" ${notice.priority === 'Urgent' ? 'selected' : ''}>Urgent</option>
          </select>
        </div>
        
        <div class="f-field" style="margin-bottom:12px">
          <label>Message</label>
          <textarea id="edit-notice-message" style="min-height:120px" required>${notice.message}</textarea>
        </div>
        
        <div style="display:flex;gap:8px;margin-top:20px;justify-content:flex-end">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  `;

  openModal(formHTML);
}

function saveEditNotice(event, noticeId) {
  event.preventDefault();

  const notice = NOTICES_DATA.find(n => n.id === noticeId);
  if (!notice) {
    showToast('<i class="fas fa-times-circle"></i> Notice not found', 'error');
    return;
  }

  notice.title = document.getElementById('edit-notice-title').value;
  notice.audience = document.getElementById('edit-notice-audience').value;
  notice.priority = document.getElementById('edit-notice-priority').value;
  notice.message = document.getElementById('edit-notice-message').value;

  closeModal();
  showToast('<i class="fas fa-check-circle"></i> Notice updated successfully!', 'success');

  setTimeout(() => {
    renderMain();
  }, 1500);
}

function deleteNotice(noticeId) {
  const notice = NOTICES_DATA.find(n => n.id === noticeId);
  if (!notice) {
    showToast('<i class="fas fa-times-circle"></i> Notice not found', 'error');
    return;
  }

  if (confirm(`Are you sure you want to delete "${notice.title}"? This action cannot be undone.`)) {
    NOTICES_DATA.splice(NOTICES_DATA.indexOf(notice), 1);
    showToast('<i class="fas fa-check-circle"></i> Notice deleted successfully!', 'success');

    setTimeout(() => {
      renderMain();
    }, 1500);
  }
}

// MESSAGING MODULE
function messagingModule() {
  // Route to role-specific messaging interface
  if (currentRole === 'Student') return studentMessagingModule();
  if (currentRole === 'Parent') return parentMessagingModule();
  if (currentRole === 'Teacher') return teacherMessagingModule();
  if (currentRole === 'Admin') return adminMessagingModule();

  // Default fallback
  return defaultMessagingModule();
}

// GET CONTACT INFO 
const contactInfo = {
  'Ama Osei': { name: 'Ama Osei', role: 'Student', avatar: 'purple', status: 'Online' },
  'Mr. Amponsah': { name: 'Mr. Kweku Amponsah', role: 'Teacher', avatar: 'blue', status: 'Online' },
  'Mrs. Asante': { name: 'Mrs. Adwoa Asante', role: 'Teacher', avatar: 'purple', status: 'Away' },
  'Mr. Oduro': { name: 'Mr. Samuel Oduro', role: 'Teacher', avatar: 'green', status: 'Offline' },
  'Parent Serwaa': { name: 'Parent Serwaa', role: 'Parent', avatar: 'gold', status: 'Offline' },
  'Admin Office': { name: 'Admin Office', role: 'Admin', avatar: 'blue', status: 'Online' }
};


// DEFAULT MESSAGING MODULE
function defaultMessagingModule() {
  return hdr('Messages', 'Communication system', 'Messages') + `
  <div class="card" style="text-align:center;padding:40px">
    <div style="font-size:48px;margin-bottom:16px"><i class="fas fa-inbox" style="color:var(--gray-300)"></i></div>
    <p style="color:var(--gray-400);font-size:14px">Messaging module is not available for your role.</p>
  </div>`;
}

function getChatSelf() {
  if (currentRole === 'Student') {
    const student = getCurrentStudentRecord();
    return { name: student.name || getSessionUser()?.name || 'Student', role: 'student', avatar: student.avatar_color || 'purple' };
  }
  if (currentRole === 'Parent') {
    const user = getSessionUser();
    return { name: user?.name || getParentProfileForSession()?.contact_person || 'Parent', role: 'parent', avatar: 'gold' };
  }
  if (currentRole === 'Teacher') {
    const teacher = getCurrentTeacherProfile();
    return { name: teacher?.name || getSessionUser()?.name || 'Teacher', role: 'teacher', avatar: teacher?.avatar_color || 'blue' };
  }
  if (currentRole === 'Admin') return { name: 'Admin Office', role: 'admin', avatar: 'blue' };
  if (currentRole === 'Accountant') return { name: getSessionUser()?.name || 'Accounts Office', role: 'accountant', avatar: 'teal' };
  return { name: getSessionUser()?.name || currentRole, role: String(currentRole || '').toLowerCase(), avatar: 'blue' };
}

function getChatContactMeta(name) {
  if (contactInfo[name]) return contactInfo[name];
  const teacher = teachersData.find(t => t.name === name || name.includes(t.name) || t.name.includes(name));
  if (teacher) return { name: teacher.name, role: 'Teacher', avatar: teacher.avatar_color || 'blue', status: 'Available' };
  const student = enrolledStudents.find(s => s.name === name);
  if (student) return { name: student.name, role: 'Student', avatar: student.avatar_color || 'purple', status: student.student_class };
  const parent = parentsData.find(p => [p.name, p.contact_person].includes(name));
  if (parent) return { name: parent.contact_person || parent.name, role: 'Parent', avatar: parent.avatar_color || 'gold', status: 'Guardian' };
  return { name: name || 'Contact', role: 'Contact', avatar: 'blue', status: 'Available' };
}

function getParentTeacherContacts() {
  const childClasses = getParentChildren().map(child => child.class);
  const teacherIds = new Set();
  classesData.forEach(c => {
    if (childClasses.includes(c.name) && c.teacher_id) teacherIds.add(c.teacher_id);
  });
  subjectsData.forEach(subject => {
    childClasses.forEach(className => {
      if (subjectAppliesToClass(subject, className) && subject.teacher_id) teacherIds.add(subject.teacher_id);
    });
  });
  return teachersData.filter(t => teacherIds.has(t.teacher_id));
}

function isParentAllowedTeacherName(name) {
  return getParentTeacherContacts().some(t => t.name === name);
}

function viewTeacherProfileByName(name) {
  const teacher = getParentTeacherContacts().find(t => t.name === name) || teachersData.find(t => t.name === name);
  if (!teacher) {
    showToast('<i class="fas fa-times-circle"></i> Teacher profile not found', 'error');
    return;
  }
  viewTeacherProfile(teacher.teacher_id);
}

function getAvailableChatContacts() {
  if (currentRole === 'Student') {
    const cls = getCurrentStudentRecord().student_class;
    const classInfo = classesData.find(c => c.name === cls);
    const teachers = teachersData.filter(t => t.teacher_id === classInfo?.teacher_id || (classInfo?.subjects || []).includes(t.subject));
    return teachers.length ? teachers : teachersData.slice(0, 3);
  }
  if (currentRole === 'Parent') {
    return getParentTeacherContacts();
  }
  if (currentRole === 'Teacher') {
    const classes = getAssignedClassNamesForTeacher();
    const students = enrolledStudents.filter(s => classes.includes(s.student_class)).slice(0, 12);
    const parentNames = getParentContactsForClasses(classes);
    return [
      ...students.map(s => ({ name: s.name, role: 'Student', avatar_color: s.avatar_color, status: s.student_class })),
      ...parentNames,
      { name: 'Admin Office', role: 'Admin', avatar_color: 'blue', status: 'Online' }
    ];
  }
  if (currentRole === 'Admin' || currentRole === 'Accountant') {
    return [
      ...teachersData.map(t => ({ name: t.name, role: 'Teacher', avatar_color: t.avatar_color, status: t.subject })),
      ...parentsData.map(p => ({ name: p.contact_person || p.name, role: 'Parent', avatar_color: p.avatar_color, status: p.children })),
      ...enrolledStudents.slice(0, 8).map(s => ({ name: s.name, role: 'Student', avatar_color: s.avatar_color, status: s.student_class }))
    ];
  }
  return [];
}

function getParentContactsForClasses(classNames) {
  return parentsData.filter(parent => classNames.some(cls => String(parent.children || '').includes(cls))).map(parent => ({
    name: parent.contact_person || parent.name,
    role: 'Parent',
    avatar_color: parent.avatar_color || 'gold',
    status: parent.children
  }));
}

function renderRoleChatModule(title, subtitle) {
  const self = getChatSelf();
  const contacts = getAvailableChatContacts();
  const conversations = {};

  contacts.forEach(contact => {
    const meta = getChatContactMeta(contact.name);
    conversations[contact.name] = {
      name: contact.name,
      info: { ...meta, role: contact.role || meta.role, avatar: contact.avatar_color || meta.avatar, status: contact.status || meta.status },
      lastMsg: 'Start a conversation',
      time: ''
    };
  });

  allMessages.filter(m => m.sender === self.name || m.recipient === self.name).forEach(msg => {
    const otherPerson = msg.sender === self.name ? msg.recipient : msg.sender;
    if (currentRole === 'Parent' && !contacts.some(contact => contact.name === otherPerson)) return;
    const meta = getChatContactMeta(otherPerson);
    conversations[otherPerson] = {
      name: otherPerson,
      info: conversations[otherPerson]?.info || meta,
      lastMsg: msg.text,
      time: msg.time || ''
    };
  });

  const names = Object.keys(conversations);
  if (!names.includes(currentChat)) currentChat = names[0] || null;
  if (currentChat) markConversationReadSilent(self.name, currentChat);

  const chatMessages = currentChat ? allMessages.filter(m =>
    (m.sender === self.name && m.recipient === currentChat) ||
    (m.sender === currentChat && m.recipient === self.name)
  ).sort((a, b) => (a.id || 0) - (b.id || 0)) : [];

  const conversationsList = Object.entries(conversations).map(([name, conv]) => {
    const isActive = name === currentChat;
    const unread = getUnreadCount(self.name, name);
    return `
      <div class="sb-item chat-contact-item${isActive ? ' active' : ''}" style="padding:10px 8px;border-radius:10px;cursor:pointer;margin-bottom:3px;transition:all .2s" onclick="openConversation('${escapeAttr(self.name)}','${escapeAttr(name)}')">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">
          <div class="av av-sm av-${conv.info.avatar || 'blue'}">${getInitials(name, 'C').slice(0, 1)}</div>
          <span style="font-size:12px;font-weight:600;flex:1;color:${isActive ? 'white' : 'var(--gray-700)'}">${escapeHtml(name)}${unread ? ` <span class="badge b-danger" style="font-size:10px;margin-left:6px">${unread}</span>` : ''}</span>
          <span style="font-size:10px;color:${isActive ? 'rgba(255,255,255,.7)' : 'var(--gray-400)'}">${escapeHtml(conv.time || '')}</span>
        </div>
        <div style="font-size:11px;color:${isActive ? 'rgba(255,255,255,.8)' : 'var(--gray-400)'};padding-left:34px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(conv.lastMsg || '')}</div>
      </div>`;
  }).join('');

  const currentContact = currentChat ? getChatContactMeta(currentChat) : null;
  const messagesHTML = chatMessages.map(msg => {
    const isSender = msg.sender === self.name;
    const avatar = isSender ? self.avatar : (currentContact?.avatar || 'blue');
    return `
      <div class="chat-msg${isSender ? ' me' : ''}">
        <div class="av av-sm av-${avatar}">${getInitials(msg.sender, 'U').slice(0, 1)}</div>
        <div>
          <div class="chat-bubble${isSender ? ' me-bubble' : ' them'}">${escapeHtml(msg.text)}</div>
          <div class="chat-meta${isSender ? ' me' : ''}" style="${isSender ? 'text-align:right' : ''}">${isSender ? 'You' : escapeHtml(msg.sender)} Â· ${escapeHtml(msg.time || '')}</div>
        </div>
      </div>`;
  }).join('');

  return hdr(title, subtitle, 'Messages') + `
  <div class="g21">
    <div class="card">
      <div style="display:flex;gap:0;height:480px">
        <div style="width:230px;border-right:1px solid var(--gray-200);padding-right:14px;overflow-y:auto;flex-shrink:0">
          <div style="font-size:10px;font-weight:700;color:var(--gray-400);text-transform:uppercase;margin-bottom:10px;letter-spacing:.6px">Contacts</div>
          ${conversationsList || '<div style="color:var(--gray-400);font-size:12px;padding:10px">No available contacts</div>'}
        </div>
        <div style="flex:1;padding-left:16px;display:flex;flex-direction:column;min-width:0">
          ${currentChat && currentContact ? `
          <div style="display:flex;align-items:center;gap:10px;padding-bottom:12px;border-bottom:1px solid var(--gray-200);margin-bottom:12px">
            <div class="av av-sm av-${currentContact.avatar || 'blue'}">${getInitials(currentChat, 'C').slice(0, 1)}</div>
            <div>
              <div style="font-size:13px;font-weight:700">${escapeHtml(currentContact.name || currentChat)}</div>
              <div style="font-size:11px;color:var(--gray-400)">${escapeHtml(currentContact.role || 'Contact')} Â· ${escapeHtml(currentContact.status || 'Available')}</div>
            </div>
            <div style="margin-left:auto;display:flex;gap:8px">
              ${currentRole === 'Parent' && currentContact.role === 'Teacher' ? `<button class="btn btn-secondary btn-xs" onclick="viewTeacherProfileByName('${escapeAttr(currentChat)}')"><i class="fas fa-user"></i> Profile</button>` : ''}
              <button class="btn btn-secondary btn-xs" onclick="markConversationRead('${escapeAttr(self.name)}','${escapeAttr(currentChat)}')">Mark Read</button>
              <button class="btn btn-danger btn-xs" onclick="deleteConversation('${escapeAttr(self.name)}','${escapeAttr(currentChat)}')"><i class="fas fa-trash"></i></button>
            </div>
          </div>
          <div class="chat-msgs" style="flex:1;overflow-y:auto;padding-right:8px">${messagesHTML || '<div style="height:100%;display:flex;align-items:center;justify-content:center;color:var(--gray-400);font-size:13px">No messages yet. Send the first message.</div>'}</div>
          <div class="chat-input-row">
            <textarea id="role-chat-input" class="chat-inp" placeholder="Type your message..." onkeydown="handleChatTextareaKey(event, '${escapeAttr(self.name)}', '${escapeAttr(currentChat)}', 'role-chat-input')"></textarea>
            <button class="chat-send" onclick="sendChatFromTextarea('${escapeAttr(self.name)}', '${escapeAttr(currentChat)}', 'role-chat-input')"><i class="fa-regular fa-paper-plane"></i></button>
          </div>` : '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--gray-400)">No conversations available</div>'}
        </div>
      </div>
    </div>
  </div>`;
}

function studentMessagingModule() { return renderRoleChatModule('Messages', 'Talk with your teachers and school office'); }
function parentMessagingModule() { return renderRoleChatModule('Messages', 'Talk with your childrenâ€™s teachers and school office'); }
function teacherMessagingModule() { return renderRoleChatModule('Messages', 'Talk with your assigned students, parents, and administration'); }
function adminMessagingModule() { return renderRoleChatModule('Messages', 'Manage school communications'); }

function sendChatFromTextarea(sender, recipient, inputId) {
  const input = document.getElementById(inputId);
  const text = input?.value.trim();
  if (!text) return showToast('<i class="fas fa-times-circle"></i> Please type a message', 'error');
  sendChatMessage(sender, recipient, text);
  if (input) input.value = '';
}

function handleChatTextareaKey(event, sender, recipient, inputId) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendChatFromTextarea(sender, recipient, inputId);
  }
}

// SEND CHAT MESSAGE
function sendChatMessage(sender, recipient, message) {
  if (!message.trim()) {
    showToast('<i class="fas fa-times-circle"></i> Please type a message', 'error');
    return;
  }
  if (currentRole === 'Parent' && !isParentAllowedTeacherName(recipient)) {
    showToast('<i class="fas fa-lock"></i> Parents can only message their childrenâ€™s teachers', 'error');
    return;
  }

  try{
    const recipientMeta = getChatContactMeta(recipient);
    addMessage({ sender, senderRole: currentRole.toLowerCase(), recipient, recipientRole: String(recipientMeta.role || '').toLowerCase(), subject: 'Message', text: message });
    showToast('<i class="fas fa-check-circle"></i> Message sent!', 'success');
    renderMain();
  }catch(e){
    showToast('<i class="fas fa-times-circle"></i> Failed to send', 'error');
  }
}

function markConversationReadSilent(userName, otherName){
  let changed = false;
  allMessages.forEach(m => {
    if(m.recipient === userName && m.sender === otherName && !m.read){ m.read = true; changed = true; }
  });

  let notifChanged = false;
  APP_NOTIFICATIONS.forEach(n => {
    const isConversationNotice = n.recipient === userName &&
      n.actionLink === 'messaging' &&
      typeof n.fullMsg === 'string' &&
      n.fullMsg.startsWith(otherName + ':');
    if(isConversationNotice && !n.read){
      n.read = true;
      notifChanged = true;
    }
  });

  if(changed) saveAllMessages();
  if(notifChanged) {
    saveAppNotifications();
    updateNotificationBadge();
  }
  return changed || notifChanged;
}

function openConversation(userName, otherName){
  currentChat = otherName;
  markConversationReadSilent(userName, otherName);
  renderMain();
}

function markConversationRead(userName, otherName){
  const changed = markConversationReadSilent(userName, otherName);
  if(changed) {
    showToast('<i class="fas fa-check-circle"></i> Conversation marked read', 'success');
    renderMain();
  }
}

function deleteConversation(userName, otherName){
  if(!confirm(`Delete conversation between ${userName} and ${otherName}?`)) return;
  allMessages = allMessages.filter(m => !((m.sender===userName && m.recipient===otherName) || (m.sender===otherName && m.recipient===userName)));
  saveAllMessages();
  showToast('<i class="fas fa-check-circle"></i> Conversation deleted', 'success');
  renderMain();
}

// Self-test utility for messaging flows (call from console)
function runMessagingSelfTest() {
  console.group('Messaging Self Test');
  try{
    // clean test messages
    const before = allMessages.length;
    console.log('messages before:', before);

    // add message from student to teacher
    const m1 = addMessage({ sender: 'Ama Osei', senderRole: 'student', recipient: 'Mr. Amponsah', recipientRole: 'teacher', subject: 'Test', text: 'Hello teacher (test)' });
    console.log('added m1', m1);

    // ensure unread shows up
    const unread1 = getUnreadCount('Mr. Amponsah', 'Ama Osei');
    console.log('unread for Mr. Amponsah from Ama Osei:', unread1);

    // mark read
    markConversationRead('Mr. Amponsah', 'Ama Osei');
    const unread2 = getUnreadCount('Mr. Amponsah', 'Ama Osei');
    console.log('after mark read:', unread2);

    // add teacher reply
    const m2 = addMessage({ sender: 'Mr. Amponsah', senderRole: 'teacher', recipient: 'Ama Osei', recipientRole: 'student', subject: 'Re:Test', text: 'Thanks, received.' });
    console.log('added m2', m2);

    // delete conversation
    deleteConversation('Ama Osei', 'Mr. Amponsah');
    const after = allMessages.length;
    console.log('messages after delete:', after);

    showToast('<i class="fas fa-check-circle"></i> Messaging self-test completed (check console).', 'success', 4000);
  }catch(e){
    console.error(e);
    showToast('<i class="fas fa-times-circle"></i> Self-test failed (see console)', 'error', 4000);
  }
  console.groupEnd();
}

// SWITCH BETWEEN CONVERSATIONS
function switchChat(chatName) {
  currentChat = chatName;
  renderMain();
}

// SEND MESSAGE IN CURRENT CONVERSATION - LEGACY (kept for compatibility)
function sendMessage(btn) {
  const input = typeof btn === 'string' ? document.getElementById('msg-input') : btn?.previousElementSibling;
  const message = input?.value.trim();

  if (!message) {
    showToast('<i class="fas fa-times-circle"></i> Please type a message', 'error');
    return;
  }

  const self = getChatSelf();
  const recipient = typeof btn === 'string' ? btn : currentChat;
  sendChatMessage(self.name, recipient, message);
  input.value = '';
  input.focus();
}

// CONTACT MESSAGES MODULE
function contactMessagesModule() {
  const unreadCount = contactMessages.filter(m => !m.read).length;
  const messagesHTML = contactMessages.length === 0 ? `
    <div style="text-align:center;padding:40px 20px;color:var(--gray-400)">
      <div style="font-size:48px;margin-bottom:12px"><i class="fas fa-envelope" style="color:var(--gray-300)"></i></div>
      <p style="font-size:14px">No messages yet. When visitors contact you, they'll appear here.</p>
    </div>
  ` : contactMessages.slice().reverse().map(msg => `
    <div class="card mb12" style="border-left:3px solid ${msg.read ? 'var(--gray-200)' : 'var(--blue-main)'};background:${msg.read ? 'var(--gray-50)' : 'var(--blue-xpale)'}">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px">
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            <h4 style="font-size:13px;font-weight:700;color:var(--gray-800)">${msg.name}</h4>
            ${msg.read ? '' : '<span class="badge b-success" style="font-size:10px">New</span>'}
          </div>
          <div style="font-size:11px;color:var(--gray-500)"><strong>${msg.email}</strong> Â· ${msg.date} at ${msg.time}</div>
        </div>
        <button class="btn btn-icon danger" onclick="deleteContactMessage(${msg.id})"><i class="fas fa-trash"></i></button>
      </div>
      <div style="margin-bottom:8px">
        <div style="font-size:12px;font-weight:600;color:var(--blue-dark);margin-bottom:4px">Subject: ${msg.subject}</div>
        <div style="font-size:12.5px;color:var(--gray-700);line-height:1.6;background:white;padding:10px 12px;border-radius:6px;border:1px solid var(--gray-200)">${msg.message}</div>
      </div>
      <div style="display:flex;gap:6px">
        <button class="btn ${msg.read ? 'btn-secondary' : 'btn-primary'} btn-xs" onclick="markMessageAs(${msg.id}, ${!msg.read})">${msg.read ? '<i class="fas fa-book-open"></i> Mark Unread' : '? Mark Read'}</button>
        <button class="btn btn-secondary btn-xs" onclick="replyToMessage(${msg.id})"><i class="fas fa-reply"></i> Reply</button>
      </div>
    </div>
  `).join('');

  return hdr('Contact Messages', `${contactMessages.length} total â€¢ ${unreadCount} unread`, 'Contact Messages') + `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
    <div style="display:flex;gap:8px">
      <button class="btn btn-secondary btn-sm" onclick="markAllAsRead()">Mark All Read</button>
      <button class="btn btn-secondary btn-sm" onclick="deleteAllMessages()" style="color:var(--danger)">Delete All</button>
    </div>
    <div style="font-size:12px;color:var(--gray-500)">${contactMessages.length} messages Â· ${unreadCount} unread</div>
  </div>
  ${messagesHTML}`;
}

function markMessageAs(id, read) {
  const msg = contactMessages.find(m => m.id === id);
  if (msg) {
    msg.read = read;
    renderSidebar();
    renderMain();
    showToast(`<i class="fas fa-check-circle"></i> Message marked as ${read ? 'read' : 'unread'}`, 'success');
  }
}

function markAllAsRead() {
  contactMessages.forEach(m => m.read = true);
  renderSidebar();
  renderMain();
  showToast('<i class="fas fa-check-circle"></i> All messages marked as read', 'success');
}

function deleteContactMessage(id) {
  if (confirm('Delete this message?')) {
    contactMessages = contactMessages.filter(m => m.id !== id);
    renderSidebar();
    renderMain();
    showToast('<i class="fas fa-check-circle"></i> Message deleted', 'success');
  }
}

function deleteAllMessages() {
  if (contactMessages.length === 0) {
    showToast('<i class="fas fa-times-circle"></i> No messages to delete', 'warning');
    return;
  }
  if (confirm(`Delete all ${contactMessages.length} messages? This cannot be undone.`)) {
    contactMessages = [];
    renderSidebar();
    renderMain();
    showToast('<i class="fas fa-check-circle"></i> All messages deleted', 'success');
  }
}

function replyToMessage(id) {
  const msg = contactMessages.find(m => m.id === id);
  if (!msg) return;

  openModal(`
    <div style="padding:20px;min-width:500px">
      <div style="font-size:16px;font-weight:700;margin-bottom:16px">Reply to ${msg.name}</div>
      <div style="background:var(--gray-50);padding:12px;border-radius:6px;margin-bottom:16px;border-left:3px solid var(--blue-main)">
        <div style="font-size:11px;color:var(--gray-500);margin-bottom:4px"><strong>${msg.email}</strong></div>
        <div style="font-size:12px;color:var(--gray-700)"><strong>Re: ${msg.subject}</strong></div>
        <div style="font-size:12px;color:var(--gray-600);margin-top:8px;font-style:italic">"${msg.message}"</div>
      </div>
      <div class="f-field" style="margin-bottom:12px">
        <label>Your Reply</label>
        <textarea class="reply-textarea" placeholder="Type your reply..." style="min-height:140px"></textarea>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-primary" onclick="sendReply('${msg.id}', '${msg.email}')">Send Reply</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

function sendReply(msgId, recipientEmail) {
  const textarea = document.querySelector('.reply-textarea');
  const reply = textarea?.value.trim();

  if (!reply) {
    showToast('<i class="fas fa-times-circle"></i> Please type a reply', 'error');
    return;
  }

  const msg = contactMessages.find(m => m.id == msgId);
  if (msg) {
    const subject = encodeURIComponent("Re: " + msg.subject);
    const body = encodeURIComponent(reply + "\n\n---\nOriginal Message from " + msg.name + ":\n" + msg.message);
    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    msg.read = true;
  }

  showToast(`<i class="fas fa-envelope-open-text"></i> Opening email client to reply to ${recipientEmail}...`, 'success');
  closeModal();

  renderSidebar();
  renderMain();
}

function getReportsDashboardInsights() {
  const students = enrolledStudents.map(s => ({ ...s, attendanceValue: parseFloat(String(s.attendance || '0').replace('%', '')) || 0 }));
  const scoreRows = Object.entries(STUDENTS_DATA).flatMap(([studentName, record]) =>
    Object.entries(record.scores || {}).map(([subject, scores]) => {
      const sba = Number(scores.classScore) || 0;
      const exam = Number(scores.examScore) || 0;
      const total = sba + exam;
      return { studentName, subject, className: record.class, sba, exam, total };
    })
  );
  const avgAttendance = students.length ? Math.round(students.reduce((sum, s) => sum + s.attendanceValue, 0) / students.length) : 0;
  const avgSba = scoreRows.length ? Math.round(scoreRows.reduce((sum, r) => sum + r.sba, 0) / scoreRows.length) : 0;
  const avgAcademic = scoreRows.length ? Math.round(scoreRows.reduce((sum, r) => sum + r.total, 0) / scoreRows.length) : 0;
  const passRate = scoreRows.length ? Math.round(scoreRows.filter(r => r.total >= 50).length / scoreRows.length * 100) : 0;
  const finance = getFinanceSummary();
  const feesCollection = finance.totalCount ? Math.round(finance.paidCount / finance.totalCount * 100) : 0;
  const topStudent = Object.entries(STUDENTS_DATA).map(([name, record]) => {
    const totals = Object.values(record.scores || {}).map(scores => (Number(scores.classScore) || 0) + (Number(scores.examScore) || 0));
    const average = totals.length ? Math.round(totals.reduce((sum, n) => sum + n, 0) / totals.length) : 0;
    return { name, className: record.class, average };
  }).sort((a, b) => b.average - a.average)[0];
  return {
    students,
    scoreRows,
    avgAttendance,
    avgSba,
    avgAcademic,
    passRate,
    feesCollection,
    topStudent,
    enrollmentTotal: students.length,
    activeStudents: students.filter(s => (s.status || 'Active') === 'Active').length
  };
}

function openReportPage(type) {
  const destinations = {
    Academic: 'reportcards',
    Attendance: 'attendance',
    Financial: 'fees',
    Enrollment: 'students',
    'Exam Results': 'exams',
    'Top Performers': 'reportcards'
  };
  navTo(destinations[type] || 'reports');
}

// REPORTS MODULE
function reportsModule() {
  if (currentRole === 'Accountant') {
    const payments = getPayments();
    const collected = payments.filter(p => p.status === 'Paid' || p.status === 'Partial').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const pending = payments.filter(p => p.status === 'Pending').length;
    return hdr('Financial Reports', 'Revenue, collections, outstanding fees, and payroll summaries', 'Reports') + `
    <div class="stats-row">
      ${statCard('<i class="fas fa-money-bill"></i>', 'GH₵' + Number(collected).toLocaleString(), 'Collected', 'Recorded payments', 'up', 'si-blue')}
      ${statCard('<i class="fas fa-hourglass-half"></i>', pending, 'Pending Accounts', 'Need follow-up', pending ? 'dn' : 'up', pending ? 'si-red' : 'si-green')}
      ${statCard('<i class="fas fa-receipt"></i>', payments.length, 'Receipts', 'Generated records', 'neu', 'si-gold')}
      ${statCard('<i class="fas fa-briefcase"></i>', 'Payroll', 'Next Run', 'Month end', 'neu', 'si-purple')}
    </div>
    <div class="g2">
      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-bar"></i> Payment Status</span></div>
        ${['Paid', 'Partial', 'Pending'].map(status => {
          const count = payments.filter(p => p.status === status).length;
          const pct = payments.length ? Math.round(count / payments.length * 100) : 0;
          return `<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px"><span>${status}</span><strong>${count}</strong></div><div class="prog-bar"><div class="prog-fill ${status === 'Paid' ? 'pf-green' : status === 'Pending' ? 'pf-red' : 'pf-gold'}" style="width:${pct}%"></div></div></div>`;
        }).join('')}
      </div>
      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-download"></i> Finance Actions</span></div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <button class="btn btn-primary" onclick="navTo('payments')"><i class="fas fa-money-bill"></i> Record Payment</button>
          <button class="btn btn-secondary" onclick="exportPaymentsCSV()"><i class="fas fa-download"></i> Export Payments CSV</button>
          <button class="btn btn-secondary" onclick="navTo('receipts')"><i class="fas fa-receipt"></i> Receipts</button>
          <button class="btn btn-secondary" onclick="navTo('salary')"><i class="fas fa-briefcase"></i> Payroll</button>
        </div>
      </div>
    </div>`;
  }

  const insights = getReportsDashboardInsights();
  return hdr('Reports & Analytics', 'School performance data and comprehensive reports', 'Reports') + `
  <div class="stats-row">
    ${statCard('<i class="fas fa-chart-bar"></i>', insights.passRate + '%', 'Avg Pass Rate', 'From SBA + exams', 'up', 'si-blue', true, 'openReportPage("Academic")')}
    ${statCard('<i class="fas fa-check-circle"></i>', insights.avgAttendance + '%', 'Avg Attendance', 'Student profiles', 'up', 'si-green', true, 'openReportPage("Attendance")')}
    ${statCard('<i class="fas fa-money-bill"></i>', insights.feesCollection + '%', 'Fees Collection', 'Payment status', 'up', 'si-gold', true, 'openReportPage("Financial")')}
    ${statCard('<i class="fas fa-trophy"></i>', insights.avgAcademic + '%', 'Academic Performance', 'SBA avg ' + insights.avgSba, 'up', 'si-purple', true, 'openReportPage("Academic")')}
  </div>
  <div class="mod-tabs" id="report-tabs">
    ${['Overview', 'Academic', 'Attendance', 'Financial', 'Enrollment'].map((t, i) => `<div class="mod-tab ${i === 0 ? 'active' : ''}" onclick="switchReportTab(this,${i})">${t}</div>`).join('')}
  </div>

  <!-- OVERVIEW TAB -->
  <div class="report-tab-content active" data-tab="0">
    <div class="g2 mb20">
      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-line"></i> 12-Month Performance Trend</span></div>
        <div style="display:flex;gap:5px;align-items:flex-end;height:150px;padding:10px 0">
          ${[[70, 80], [72, 82], [68, 79], [75, 85], [78, 88], [80, 90], [82, 88], [85, 91], [83, 89], [86, 92], [88, 93], [87, 92]].map(([t, e]) => `
          <div style="flex:1;display:flex;gap:2px;align-items:flex-end">
            <div style="flex:1;background:var(--blue-main);opacity:.8;border-radius:3px 3px 0 0;height:${t * 1.4}px"></div>
            <div style="flex:1;background:var(--gold);opacity:.75;border-radius:3px 3px 0 0;height:${e * 1.4}px"></div>
          </div>`).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--gray-400);padding:0 2px">
          ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => `<span>${m}</span>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-clipboard-list"></i> Quick Reports</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${[['Academic', '<i class="fas fa-chart-bar"></i>'], ['Attendance', '<i class="fas fa-check-circle"></i>'], ['Financial', '<i class="fas fa-money-bill"></i>'], ['Enrollment', '<i class="fas fa-graduation-cap"></i>'], ['Exam Results', '<i class="fas fa-chart-line"></i>'], ['Top Performers', '<i class="fas fa-trophy"></i>']].map(([name, icon]) => `
          <button class="btn btn-secondary" style="font-size:11px;padding:12px;min-width:0;white-space:normal" onclick="openReportPage('${name}')"><span style="font-size:14px;margin-right:4px">${icon}</span>${name}</button>`).join('')}
        </div>
      </div>
    </div>
  </div>

  <!-- ACADEMIC TAB -->
  <div class="report-tab-content" data-tab="1">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-bar"></i> Academic Performance Report</span></div>
      <div style="display:flex;gap:10px;margin-bottom:15px;flex-wrap:wrap">
        <div class="search-bar" style="flex:1;min-width:200px"><span><i class="fas fa-search"></i></span><input placeholder="Search by class or subject..." id="academic-search" onkeyup="filterReportTab('academic')"></div>
        <select id="academic-filter" class="select-sm" onchange="filterReportTab('academic')"><option value="">All Classes</option><option value="JHS 1">JHS 1</option><option value="JHS 2">JHS 2</option><option value="JHS 3">JHS 3</option></select>
        <button class="btn btn-primary" onclick="generateReportPDF('Academic')"><i class="fas fa-download"></i> Export PDF</button>
      </div>
      <table class="tbl" id="academic-table">
        <thead><tr><th>Class</th><th>Subject</th><th>Pass Rate</th><th>Avg Score</th><th>Grade A</th><th>Grade B</th><th>Grade C</th></tr></thead>
        <tbody id="academic-tbody">
          <tr class="academic-row" data-class="JHS 1" data-search="jhs 1 mathematics"><td>JHS 1</td><td>Mathematics</td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">92%</span></td><td>78</td><td>18</td><td>22</td><td>10</td></tr>
          <tr class="academic-row" data-class="JHS 1" data-search="jhs 1 english"><td>JHS 1</td><td>English</td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">88%</span></td><td>75</td><td>15</td><td>24</td><td>11</td></tr>
          <tr class="academic-row" data-class="JHS 2" data-search="jhs 2 mathematics"><td>JHS 2</td><td>Mathematics</td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">85%</span></td><td>72</td><td>12</td><td>28</td><td>14</td></tr>
          <tr class="academic-row" data-class="JHS 2" data-search="jhs 2 science"><td>JHS 2</td><td>Science</td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">90%</span></td><td>76</td><td>20</td><td>20</td><td>6</td></tr>
          <tr class="academic-row" data-class="JHS 3" data-search="jhs 3 mathematics"><td>JHS 3</td><td>Mathematics</td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">88%</span></td><td>74</td><td>16</td><td>26</td><td>12</td></tr>
          <tr class="academic-row" data-class="JHS 3" data-search="jhs 3 english"><td>JHS 3</td><td>English</td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">85%</span></td><td>71</td><td>14</td><td>24</td><td>16</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- ATTENDANCE TAB -->
  <div class="report-tab-content" data-tab="2">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-check-circle"></i> Attendance Summary Report</span></div>
      <div style="display:flex;gap:10px;margin-bottom:15px;flex-wrap:wrap">
        <div class="search-bar" style="flex:1;min-width:200px"><span><i class="fas fa-search"></i></span><input placeholder="Search by student name..." id="attendance-search" onkeyup="filterReportTab('attendance')"></div>
        <select id="attendance-filter" class="select-sm" onchange="filterReportTab('attendance')"><option value="">All Periods</option><option value="First">First Term</option><option value="Second">Second Term</option><option value="Third">Third Term</option></select>
        <button class="btn btn-primary" onclick="generateReportPDF('Attendance')"><i class="fas fa-download"></i> Export PDF</button>
      </div>
      <table class="tbl" id="attendance-table">
        <thead><tr><th>Student</th><th>Class</th><th>Present</th><th>Absent</th><th>Late</th><th>Attendance %</th><th>Status</th></tr></thead>
        <tbody id="attendance-tbody">
          <tr class="attendance-row" data-student="ama serwaa" data-period="First"><td>Ama Serwaa</td><td>JHS 1</td><td>168</td><td>2</td><td>0</td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">98%</span></td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">Excellent</span></td></tr>
          <tr class="attendance-row" data-student="kwame mensah" data-period="First"><td>Kwame Mensah</td><td>JHS 1</td><td>165</td><td>4</td><td>1</td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">96%</span></td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">Very Good</span></td></tr>
          <tr class="attendance-row" data-student="nana yaa" data-period="First"><td>Nana Yaa</td><td>JHS 2</td><td>162</td><td>6</td><td>2</td><td><span class="badge b-warning" style="background:#fef3c7;color:#92400e">94%</span></td><td><span class="badge b-warning" style="background:#fef3c7;color:#92400e">Good</span></td></tr>
          <tr class="attendance-row" data-student="kofi asante" data-period="First"><td>Kofi Asante</td><td>JHS 2</td><td>170</td><td>0</td><td>0</td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">98%</span></td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">Excellent</span></td></tr>
          <tr class="attendance-row" data-student="afua owusu" data-period="First"><td>Afua Owusu</td><td>JHS 3</td><td>168</td><td>3</td><td>1</td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">97%</span></td><td><span class="badge b-success" style="background:#d1fae5;color:#065f46">Excellent</span></td></tr>
          <tr class="attendance-row" data-student="yaw boateng" data-period="First"><td>Yaw Boateng</td><td>JHS 3</td><td>165</td><td>5</td><td>2</td><td><span class="badge b-warning" style="background:#fef3c7;color:#92400e">95%</span></td><td><span class="badge b-warning" style="background:#fef3c7;color:#92400e">Good</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- FINANCIAL TAB -->
  <div class="report-tab-content" data-tab="3">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-money-bill"></i> Financial Summary Report</span></div>
      <div style="display:flex;gap:10px;margin-bottom:15px;flex-wrap:wrap">
        <select id="financial-filter" class="select-sm" onchange="filterReportTab('financial')"><option value="">All Months</option><option value="January">January</option><option value="February">February</option><option value="March">March</option><option value="April">April</option></select>
        <button class="btn btn-primary" onclick="generateReportPDF('Financial')"><i class="fas fa-download"></i> Export PDF</button>
      </div>
      ${(() => {
        const finance = typeof getFinanceSummary === 'function' ? getFinanceSummary() : { totalIncome: 0, totalExpenditure: 0, netSurplus: 0, incomeBreakdown: [], expenseBreakdown: [] };
        const incomeRows = finance.incomeBreakdown.map(row => `<tr><td>${escapeHtml(row.source || 'Income')}</td><td>${money(row.amount || 0)}</td><td>${financePct(row.amount, finance.totalIncome)}</td></tr>`).join('') || '<tr><td colspan="3" style="text-align:center;color:var(--gray-400)">No income records</td></tr>';
        const expenseRows = finance.expenseBreakdown.map(row => `<tr><td>${escapeHtml(row.category || 'Expense')}</td><td>${money(row.amount || 0)}</td><td>${financePct(row.amount, finance.totalExpenditure)}</td></tr>`).join('') || '<tr><td colspan="3" style="text-align:center;color:var(--gray-400)">No expenditure records</td></tr>';
        return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-bottom:20px;max-width:100%">
        <div style="background:linear-gradient(135deg,var(--blue-main),#2563eb);border-radius:8px;min-width:0"><div style="color:#fff;padding:15px"><div style="font-size:11px;opacity:.8;margin-bottom:5px">TOTAL INCOME</div><div style="font-size:24px;font-weight:700">${money(finance.totalIncome)}</div><div style="font-size:10px;opacity:.7;margin-top:8px">Database finance records</div></div></div>
        <div style="background:linear-gradient(135deg,var(--danger),#dc2626);border-radius:8px;min-width:0"><div style="color:#fff;padding:15px"><div style="font-size:11px;opacity:.8;margin-bottom:5px">TOTAL EXPENDITURE</div><div style="font-size:24px;font-weight:700">${money(finance.totalExpenditure)}</div><div style="font-size:10px;opacity:.7;margin-top:8px">Expenses and payroll</div></div></div>
        <div style="background:linear-gradient(135deg,var(--success),#10b981);border-radius:8px;min-width:0"><div style="color:#fff;padding:15px"><div style="font-size:11px;opacity:.8;margin-bottom:5px">NET SURPLUS</div><div style="font-size:24px;font-weight:700">${money(finance.netSurplus)}</div><div style="font-size:10px;opacity:.7;margin-top:8px">After all expenses</div></div></div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:15px">
        <div><div style="font-weight:600;margin-bottom:10px;font-size:13px">Income Breakdown</div><table class="tbl" style="font-size:12px"><thead><tr><th>Source</th><th>Amount</th><th>%</th></tr></thead><tbody>${incomeRows}</tbody></table></div>
        <div><div style="font-weight:600;margin-bottom:10px;font-size:13px">Expenditure Breakdown</div><table class="tbl" style="font-size:12px"><thead><tr><th>Category</th><th>Amount</th><th>%</th></tr></thead><tbody>${expenseRows}</tbody></table></div>
      </div>`;
      })()}
  </div>

  <!-- ENROLLMENT TAB -->
  <div class="report-tab-content" data-tab="4">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-graduation-cap"></i> Enrollment Statistics Report</span></div>
      <div style="display:flex;gap:10px;margin-bottom:15px;flex-wrap:wrap">
        <select id="enrollment-class-filter" class="select-sm" onchange="filterReportTab('enrollment')"><option value="">All Classes</option><option value="JHS 1">JHS 1</option><option value="JHS 2">JHS 2</option><option value="JHS 3">JHS 3</option></select>
        <select id="enrollment-gender-filter" class="select-sm" onchange="filterReportTab('enrollment')"><option value="">All Genders</option><option value="Male">Male</option><option value="Female">Female</option></select>
        <button class="btn btn-primary" onclick="generateReportPDF('Enrollment')"><i class="fas fa-download"></i> Export PDF</button>
      </div>
      <table class="tbl" id="enrollment-table">
        <thead><tr><th>Class</th><th>Total</th><th>Male</th><th>Female</th><th>New Students</th><th>Returning</th><th>Avg Age</th></tr></thead>
        <tbody id="enrollment-tbody">
          <tr class="enrollment-row" data-class="JHS 1" data-gender=""><td>JHS 1</td><td>140</td><td><span style="color:var(--blue-main);font-weight:600">68</span></td><td><span style="color:var(--purple);font-weight:600">72</span></td><td>28</td><td>112</td><td>13.2</td></tr>
          <tr class="enrollment-row" data-class="JHS 2" data-gender=""><td>JHS 2</td><td>135</td><td><span style="color:var(--blue-main);font-weight:600">64</span></td><td><span style="color:var(--purple);font-weight:600">71</span></td><td>15</td><td>120</td><td>14.1</td></tr>
          <tr class="enrollment-row" data-class="JHS 3" data-gender=""><td>JHS 3</td><td>125</td><td><span style="color:var(--blue-main);font-weight:600">61</span></td><td><span style="color:var(--purple);font-weight:600">64</span></td><td>8</td><td>117</td><td>15.3</td></tr>
        </tbody>
      </table>
    </div>
  </div>`;
}

// REPORT TAB SWITCHING
function switchReportTab(element, tabIndex) {
  document.querySelectorAll('#report-tabs .mod-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.report-tab-content').forEach(c => c.classList.remove('active'));
  element.classList.add('active');
  document.querySelector(`.report-tab-content[data-tab="${tabIndex}"]`).classList.add('active');
}

// FILTER REPORTS
function filterReportTab(tabType) {
  if (tabType === 'academic') {
    const search = document.getElementById('academic-search').value.toLowerCase();
    const filter = document.getElementById('academic-filter').value;
    document.querySelectorAll('.academic-row').forEach(row => {
      const matches = (!search || row.getAttribute('data-search').includes(search)) && (!filter || row.getAttribute('data-class') === filter);
      row.style.display = matches ? '' : 'none';
    });
  }
  else if (tabType === 'attendance') {
    const search = document.getElementById('attendance-search').value.toLowerCase();
    const filter = document.getElementById('attendance-filter').value;
    document.querySelectorAll('.attendance-row').forEach(row => {
      const matches = (!search || row.getAttribute('data-student').includes(search)) && (!filter || row.getAttribute('data-period') === filter);
      row.style.display = matches ? '' : 'none';
    });
  }
  else if (tabType === 'enrollment') {
    const classFilter = document.getElementById('enrollment-class-filter').value;
    const genderFilter = document.getElementById('enrollment-gender-filter').value;
    document.querySelectorAll('.enrollment-row').forEach(row => {
      const matches = (!classFilter || row.getAttribute('data-class') === classFilter);
      row.style.display = matches ? '' : 'none';
    });
  }
}

// GENERATE REPORT PDF
function generateReportPDF(reportType) {
  showToast('Generating ' + reportType + ' Report...', 'info');

  let html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + reportType + ' Report</title><style>';
  html += 'body{font-family:Arial,sans-serif;margin:20px;background:#f5f5f5}';
  html += '.header{text-align:center;margin-bottom:30px;border-bottom:3px solid #1a56db;padding-bottom:15px}';
  html += '.header h1{color:#1a56db;margin:0;font-size:24px}';
  html += '.header p{color:#666;margin:5px 0;font-size:12px}';
  html += '.content{background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)}';
  html += '.section{margin-bottom:25px}';
  html += '.section-title{font-size:16px;font-weight:700;color:#1a56db;margin-bottom:12px;border-left:4px solid #1a56db;padding-left:10px}';
  html += 'table{width:100%;border-collapse:collapse;margin-top:10px}';
  html += 'th{background:#1a56db;color:#fff;padding:10px;text-align:left;font-size:12px;font-weight:700}';
  html += 'td{padding:10px;border-bottom:1px solid #ddd;font-size:12px}';
  html += 'tr:nth-child(even){background:#f9f9f9}';
  html += '.stat{display:inline-block;margin:10px 20px 10px 0}';
  html += '.stat-value{font-size:24px;font-weight:700;color:#1a56db}';
  html += '.stat-label{font-size:12px;color:#666;margin-top:5px}';
  html += '.badge{display:inline-block;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:700;background:#d1fae5;color:#065f46}';
  html += '.footer{margin-top:30px;text-align:center;color:#999;font-size:11px;border-top:1px solid #ddd;padding-top:15px}';
  html += '@media print{body{margin:0;background:#fff}}';
  html += '</style></head><body>';
  html += '<div class="header"><h1><img src="assets/images/Logo.png" alt="Logo" style="width:30px;height:30px;object-fit:contain;margin-right:8px;display:inline-block;color:#1a56db"> Glory Reign Preparatory School</h1><p>' + reportType + ' Report</p><p>Generated: ' + new Date().toLocaleString() + '</p></div>';
  html += '<div class="content">';

  if (reportType === 'Academic') {
    html += '<div class="section"><div class="section-title"><i class="fas fa-chart-bar"></i> Academic Performance Report</div>';
    html += '<div class="stat"><div class="stat-value">88.7%</div><div class="stat-label">Pass Rate</div></div>';
    html += '<div class="stat"><div class="stat-value">75.3</div><div class="stat-label">Avg Score</div></div>';
    html += '<div class="stat"><div class="stat-value">92%</div><div class="stat-label">Top Subject</div></div></div>';
    html += '<div class="section"><div class="section-title">Performance by Class & Subject</div><table>';
    html += '<tr><th>Class</th><th>Subject</th><th>Pass Rate</th><th>Avg Score</th><th>Grade A</th><th>Grade B</th></tr>';
    document.querySelectorAll('.academic-row:not([style*="display: none"])').forEach(row => {
      const cells = row.querySelectorAll('td');
      html += '<tr>';
      cells.forEach(cell => html += '<td>' + cell.innerText + '</td>');
      html += '</tr>';
    });
    html += '</table></div>';
  }
  else if (reportType === 'Attendance') {
    html += '<div class="section"><div class="section-title"><i class="fas fa-clipboard-list"></i> Attendance Summary Report</div>';
    html += '<div class="stat"><div class="stat-value">94.2%</div><div class="stat-label">Avg Attendance</div></div>';
    html += '<div class="stat"><div class="stat-value">4,856</div><div class="stat-label">Present Days</div></div></div>';
    html += '<div class="section"><div class="section-title">Student Attendance Records</div><table>';
    html += '<tr><th>Student</th><th>Class</th><th>Present</th><th>Absent</th><th>Late</th><th>Attendance %</th></tr>';
    document.querySelectorAll('.attendance-row:not([style*="display: none"])').forEach(row => {
      const cells = row.querySelectorAll('td');
      html += '<tr>';
      cells.forEach(cell => html += '<td>' + cell.innerText + '</td>');
      html += '</tr>';
    });
    html += '</table></div>';
  }
  else if (reportType === 'Financial') {
    const finance = typeof getFinanceSummary === 'function'
      ? getFinanceSummary()
      : { totalIncome: 0, totalExpenditure: 0, netSurplus: 0, incomeBreakdown: [] };
    html += '<div class="section"><div class="section-title"><i class="fas fa-money-bill"></i> Financial Summary Report</div>';
    html += '<div class="stat"><div class="stat-value">' + money(finance.totalIncome) + '</div><div class="stat-label">Total Income</div></div>';
    html += '<div class="stat"><div class="stat-value">' + money(finance.totalExpenditure) + '</div><div class="stat-label">Expenditure</div></div>';
    html += '<div class="stat"><div class="stat-value">' + money(finance.netSurplus) + '</div><div class="stat-label">Surplus</div></div></div>';
    html += '<div class="section"><div class="section-title">Income Sources</div><table>';
    html += '<tr><th>Source</th><th>Amount</th><th>Percentage</th></tr>';
    (finance.incomeBreakdown || []).forEach(row => {
      html += '<tr><td>' + escapeHtml(row.source || 'Income') + '</td><td>' + money(row.amount || 0) + '</td><td>' + financePct(row.amount, finance.totalIncome) + '</td></tr>';
    });
    if (!(finance.incomeBreakdown || []).length) html += '<tr><td colspan="3">No income records found</td></tr>';
    html += '</table></div>';
  }  else if (reportType === 'Enrollment') {
    html += '<div class="section"><div class="section-title"><i class="fas fa-users"></i> Enrollment Statistics Report</div>';
    html += '<div class="stat"><div class="stat-value">400</div><div class="stat-label">Total Students</div></div>';
    html += '<div class="stat"><div class="stat-value">193</div><div class="stat-label">Male</div></div>';
    html += '<div class="stat"><div class="stat-value">207</div><div class="stat-label">Female</div></div></div>';
    html += '<div class="section"><div class="section-title">Enrollment by Class</div><table>';
    html += '<tr><th>Class</th><th>Total</th><th>Male</th><th>Female</th><th>New</th><th>Returning</th></tr>';
    document.querySelectorAll('.enrollment-row:not([style*="display: none"])').forEach(row => {
      const cells = row.querySelectorAll('td');
      html += '<tr>';
      for (let i = 0; i < Math.min(6, cells.length); i++) html += '<td>' + cells[i].innerText + '</td>';
      html += '</tr>';
    });
    html += '</table></div>';
  }

  html += '</div><div class="footer"><p>This report was automatically generated by Glory Reign School Management System</p>';
  html += '<p>Â© 2026 Glory Reign Preparatory School. All rights reserved.</p></div></body></html>';

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = reportType.toLowerCase() + '_report_' + new Date().toISOString().slice(0, 10) + '.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast('<i class="fas fa-check"></i> ' + reportType + ' report generated', 'success');
}

const SETTINGS_DATA = {
  schoolInfo: {    schoolName: 'Glory Reign Preparatory School',
    schoolCode: 'SCH-0024',
    schoolMotto: 'Excellence, Integrity & Service',
    schoolLogo: 'Logo.png',
    region: 'Upper West',
    district: 'Jirapa',
    phone: '0243611971 / 0205096091',
    email: SCHOOL_EMAIL,
    address: 'P.O. Box 42, Jirapa, Upper West Region, Ghana',
    website: 'www.excellence.edu.gh'
  },
  academic: {
    academicYear: '2024/2025',
    currentTerm: 'Term 1',
    termStartDate: '2025-01-13',
    termEndDate: '2025-04-11',
    academicYears: '2024/2025,2025/2026,2026/2027'
  },
  system: {
    maintenanceMode: false,
    backupFrequency: 'Daily',
    maxUploadSize: '50MB',
    language: 'English'
  },
  security: {
    passwordPolicy: 'Strong',
    sessionTimeout: '30 minutes',
    twoFactorAuth: true,
    apiKeyRotation: '90 days'
  },
  appearance: {
    theme: 'Light',
    accentColor: 'Blue',
    fontSize: 'Normal',
    compactMode: false
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    dailyDigest: true
  }
};

// SETTINGS DATA IS SERVER/AUTHORITY OWNED
function saveSettingsToStorage() {
}

function loadSettingsFromStorage() {
  if (SETTINGS_DATA.schoolInfo) {
    SETTINGS_DATA.schoolInfo.email = SCHOOL_EMAIL;
  }
}

// Load settings on initialization
loadSettingsFromStorage();

function settingsModule() {
  if (currentRole !== 'Admin') {
    return hdr('Account Settings', 'Manage your personal preferences and security', 'Settings') + `
    <div class="g2">
      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-user-cog"></i> Preferences</span></div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px"><input type="checkbox" checked id="pref-email"> <label for="pref-email" style="font-size:13px">Email notifications</label></div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px"><input type="checkbox" checked id="pref-portal"> <label for="pref-portal" style="font-size:13px">Portal alerts</label></div>
        <div style="display:flex;align-items:center;gap:12px"><input type="checkbox" id="pref-sms"> <label for="pref-sms" style="font-size:13px">SMS reminders</label></div>
        <button class="btn btn-primary" style="margin-top:18px" onclick="showToast('Preferences saved', 'success')"><i class="fas fa-check"></i> Save Preferences</button>
      </div>
      ${profileSecurityCard()}
    </div>`;
  }

  return hdr('System Settings', 'Configure school information and system preferences', 'Settings') + `
  <div class="mod-tabs" id="settings-tabs">
    ${['School Info', 'Academic', 'System', 'Security', 'Appearance', 'Notifications'].map((t, i) => `<div class="mod-tab ${i === 0 ? 'active' : ''}" onclick="switchSettingsTab(${i})">${t}</div>`).join('')}
  </div>

  <!-- SCHOOL INFO TAB -->
  <div class="settings-tab-content active" data-tab="0">
    <div class="g2">
      <div class="card">
        <div class="card-hdr"><span class="card-title"><img src="assets/images/Logo.png" alt="Logo" style="width:24px;height:24px;object-fit:contain;margin-right:8px;display:inline-block"> School Logo & Motto</span></div>
        <div style="display:grid;grid-template-columns:auto 1fr;gap:20px;align-items:center;padding-bottom:20px;border-bottom:1.5px solid var(--gray-200);margin-bottom:20px">
          <div class="school-logo-container" id="school-logo-display" style="width:120px;height:120px;background:var(--gray-100);border-radius:10px;display:flex;align-items:center;justify-content:center;overflow:hidden">
            <div style="text-align:center">
              <div style="font-size:40px"><i class="fas fa-image"></i></div>
              <div style="font-size:10px;color:var(--gray-400);margin-top:6px">No logo</div>
            </div>
          </div>
          <div style="flex:1">
            <div class="f-field"><label>School Logo (Image)</label><input type="file" id="school-logo-input" accept="image/*" onchange="previewSchoolLogo()"></div>
            <div style="font-size:11px;color:var(--gray-500);margin-top:6px">Recommended: PNG/JPG, 500x500px, max 2MB</div>
          </div>
        </div>
        <div class="f-field" style="margin-bottom:16px"><label>School Motto</label><input id="school-motto" placeholder="e.g., Excellence, Integrity & Service" value="${SETTINGS_DATA.schoolInfo.schoolMotto}"></div>
        <div style="display:flex;gap:8px"><button class="btn btn-primary" onclick="saveSchoolBrand()"><i class="fas fa-check"></i> Save Logo & Motto</button><button class="btn btn-secondary" onclick="resetBrandForm()">Reset</button></div>
      </div>

      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-building"></i> School Information</span></div>
        <div class="f-row"><div class="f-field"><label>School Name</label><input id="school-name" value="${SETTINGS_DATA.schoolInfo.schoolName}"></div><div class="f-field"><label>School Code</label><input id="school-code" value="${SETTINGS_DATA.schoolInfo.schoolCode}" readonly></div></div>
        <div class="f-row"><div class="f-field"><label>Region</label><select id="school-region">${['Greater Accra', 'Ashanti', 'Western', 'Northern', 'Upper West', 'Upper East', 'Volta', 'Eastern', 'Central', 'Oti', 'Savannah', 'North East'].map(r => `<option ${r === SETTINGS_DATA.schoolInfo.region ? 'selected' : ''}>${r}</option>`).join('')}</select></div><div class="f-field"><label>District</label><input id="school-district" value="${SETTINGS_DATA.schoolInfo.district}"></div></div>
        <div class="f-row"><div class="f-field"><label>Phone Number</label><input id="school-phone" value="${SETTINGS_DATA.schoolInfo.phone}"></div><div class="f-field"><label>Email Address</label><input id="school-email" value="${SETTINGS_DATA.schoolInfo.email}"></div></div>
        <div class="f-field" style="margin-bottom:14px"><label>Physical Address</label><textarea id="school-address" style="min-height:60px">${SETTINGS_DATA.schoolInfo.address}</textarea></div>
        <div class="f-field" style="margin-bottom:14px"><label>School Website</label><input id="school-website" value="${SETTINGS_DATA.schoolInfo.website}"></div>
        <div style="display:flex;gap:8px"><button class="btn btn-primary" onclick="saveSchoolInfo()"><i class="fas fa-check"></i> Save Changes</button><button class="btn btn-secondary" onclick="resetSchoolForm()">Reset</button></div>
      </div>

      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-calendar-alt"></i> Academic Calendar</span></div>
        <div class="f-row"><div class="f-field"><label>Academic Year</label><select id="academic-year">${(SETTINGS_DATA.academic.academicYears || '2024/2025,2025/2026,2026/2027').split(',').map(y => `<option ${y === SETTINGS_DATA.academic.academicYear ? 'selected' : ''}>${y}</option>`).join('')}</select></div><div class="f-field"><label>Current Term</label><select id="current-term">${['Term 1', 'Term 2', 'Term 3'].map(t => `<option ${t === SETTINGS_DATA.academic.currentTerm ? 'selected' : ''}\>${t}</option>`).join('')}</select></div></div>
        <div class="f-row"><div class="f-field"><label>Term Start Date</label><input type="date" id="term-start-date" value="${SETTINGS_DATA.academic.termStartDate}"></div><div class="f-field"><label>Term End Date</label><input type="date" id="term-end-date" value="${SETTINGS_DATA.academic.termEndDate}"></div></div>
        <div style="margin-bottom:14px">
          <label style="font-size:11px;font-weight:600;color:var(--gray-600);display:block;margin-bottom:8px;text-transform:uppercase;letter-spacing:.4px">Grading Scale</label>
          ${[['A', '80â€“100', 'Excellent'], ['B', '70â€“79', 'Very Good'], ['C', '60â€“69', 'Good'], ['D', '50â€“59', 'Average'], ['F', '0â€“49', 'Fail']].map(([g, r, l]) => `
          <div style="display:flex;gap:12px;align-items:center;padding:6px 0;border-bottom:1px solid var(--gray-100)">
            <div class="grade-pill g${g}">${g}</div>
            <span style="font-size:12px;flex:1">${r}</span>
            <span style="font-size:11px;color:var(--gray-400)">${l}</span>
          </div>`).join('')}
        </div>
        <div style="display:flex;gap:8px"><button class="btn btn-primary" onclick="saveAcademicCalendar()"><i class="fas fa-check"></i> Update Calendar</button><button class="btn btn-secondary" onclick="resetAcademicForm()">Reset</button></div>
      </div>

      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-edit"></i> Manage Academic Years</span></div>
        <div style="margin-bottom:14px">
          <label style="font-size:11px;font-weight:600;color:var(--gray-600);display:block;margin-bottom:8px;text-transform:uppercase;letter-spacing:.4px">Active Academic Years</label>
          <div id="settings-academic-years-list" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px">
            ${(SETTINGS_DATA.academic.academicYears || '2024/2025,2025/2026,2026/2027').split(',').map(y => `
              <span class="badge b-info" style="display:inline-flex;align-items:center;gap:6px;padding:6px 10px;font-size:12px">
                ${escapeHtml(y)}
                <i class="fas fa-times" style="cursor:pointer;color:var(--danger)" onclick="deleteAcademicYear('${escapeAttr(y)}')"></i>
              </span>
            `).join('')}
          </div>
          <div class="f-row" style="align-items: flex-end; gap: 8px;">
            <div class="f-field" style="margin-bottom:0; flex: 1;">
              <input type="text" id="new-academic-year-input" placeholder="e.g. 2027/2028" style="margin-bottom:0">
            </div>
            <button class="btn btn-primary" onclick="addAcademicYear()"><i class="fas fa-plus"></i> Add Year</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- SYSTEM TAB -->
  <div class="settings-tab-content" data-tab="1">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-cogs"></i> System Settings</span></div>
      <div class="f-row">
        <div class="f-field"><label>Maintenance Mode</label>
          <select id="maintenance-mode">
            <option value="false" ${SETTINGS_DATA.system.maintenanceMode === false || SETTINGS_DATA.system.maintenanceMode === 'false' ? 'selected' : ''}>Disabled</option>
            <option value="true" ${SETTINGS_DATA.system.maintenanceMode === true || SETTINGS_DATA.system.maintenanceMode === 'true' ? 'selected' : ''}>Enabled</option>
          </select>
        </div>
        <div class="f-field"><label>Backup Frequency</label>
          <select id="backup-frequency">
            ${['Hourly', 'Daily', 'Weekly', 'Monthly'].map(f => `<option ${f === SETTINGS_DATA.system.backupFrequency ? 'selected' : ''}>${f}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="f-row">
        <div class="f-field"><label>Max Upload Size</label>
          <select id="max-upload">
            ${['10MB', '50MB', '100MB', '500MB'].map(s => `<option ${s === SETTINGS_DATA.system.maxUploadSize ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
        <div class="f-field"><label>System Language</label>
          <select id="system-language">
            ${['English', 'Twi', 'Ga', 'French'].map(l => `<option ${l === SETTINGS_DATA.system.language ? 'selected' : ''}>${l}</option>`).join('')}
          </select>
        </div>
      </div>
      <div style="display:flex;gap:8px"><button class="btn btn-primary" onclick="saveSystemSettings()"><i class="fas fa-check"></i> Save System Settings</button><button class="btn btn-secondary" onclick="resetSystemForm()">Reset</button></div>
    </div>
  </div>

  <!-- SECURITY TAB -->
  <div class="settings-tab-content" data-tab="2">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-lock"></i> Security Settings</span></div>
      <div class="f-row">
        <div class="f-field"><label>Password Policy</label>
          <select id="password-policy">
            ${['Weak', 'Medium', 'Strong', 'Very Strong'].map(p => `<option ${p === SETTINGS_DATA.security.passwordPolicy ? 'selected' : ''}>${p}</option>`).join('')}
          </select>
        </div>
        <div class="f-field"><label>Session Timeout</label>
          <select id="session-timeout">
            ${['15 minutes', '30 minutes', '1 hour', '2 hours'].map(t => `<option ${t === SETTINGS_DATA.security.sessionTimeout ? 'selected' : ''}>${t}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="f-row">
        <div class="f-field"><label>Two-Factor Authentication</label>
          <select id="two-factor">
            <option value="true" ${SETTINGS_DATA.security.twoFactorAuth === true || SETTINGS_DATA.security.twoFactorAuth === 'true' ? 'selected' : ''}>Enabled</option>
            <option value="false" ${SETTINGS_DATA.security.twoFactorAuth === false || SETTINGS_DATA.security.twoFactorAuth === 'false' ? 'selected' : ''}>Disabled</option>
          </select>
        </div>
        <div class="f-field"><label>API Key Rotation</label>
          <select id="api-rotation">
            ${['30 days', '60 days', '90 days', '180 days'].map(r => `<option ${r === SETTINGS_DATA.security.apiKeyRotation ? 'selected' : ''}>${r}</option>`).join('')}
          </select>
        </div>
      </div>
      <div style="display:flex;gap:8px"><button class="btn btn-primary" onclick="saveSecuritySettings()"><i class="fas fa-check"></i> Save Security Settings</button><button class="btn btn-secondary" onclick="resetSecurityForm()">Reset</button></div>
    </div>
  </div>

  <!-- APPEARANCE TAB -->
  <div class="settings-tab-content" data-tab="3">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-palette"></i> Appearance Settings</span></div>
      <div class="f-row">
        <div class="f-field"><label>Theme</label>
          <select id="theme-select">
            ${['Light', 'Dark', 'Auto'].map(t => `<option ${t === SETTINGS_DATA.appearance.theme ? 'selected' : ''}>${t}</option>`).join('')}
          </select>
        </div>
        <div class="f-field"><label>Accent Color</label>
          <select id="accent-color">
            ${['Blue', 'Purple', 'Green', 'Orange'].map(c => `<option ${c === SETTINGS_DATA.appearance.accentColor ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="f-row">
        <div class="f-field"><label>Font Size</label>
          <select id="font-size">
            ${['Small', 'Normal', 'Large', 'Extra Large'].map(f => `<option ${f === SETTINGS_DATA.appearance.fontSize ? 'selected' : ''}>${f}</option>`).join('')}
          </select>
        </div>
        <div class="f-field"><label>Compact Mode</label>
          <select id="compact-mode">
            <option value="false" ${SETTINGS_DATA.appearance.compactMode === false || SETTINGS_DATA.appearance.compactMode === 'false' ? 'selected' : ''}>Disabled</option>
            <option value="true" ${SETTINGS_DATA.appearance.compactMode === true || SETTINGS_DATA.appearance.compactMode === 'true' ? 'selected' : ''}>Enabled</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:8px"><button class="btn btn-primary" onclick="saveAppearanceSettings()"><i class="fas fa-check"></i> Save Appearance Settings</button><button class="btn btn-secondary" onclick="resetAppearanceForm()">Reset</button></div>
    </div>
  </div>

  <!-- NOTIFICATIONS TAB -->
  <div class="settings-tab-content" data-tab="4">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-bell"></i> Notification Preferences</span></div>
      <div style="display:grid;gap:12px">
        <div style="display:flex;align-items:center;padding:12px;background:var(--gray-50);border-radius:8px">
          <input type="checkbox" id="email-notif" ${SETTINGS_DATA.notifications.emailNotifications ? 'checked' : ''} style="width:20px;height:20px;cursor:pointer">
          <label style="flex:1;margin-left:12px;cursor:pointer">Email Notifications</label>
        </div>
        <div style="display:flex;align-items:center;padding:12px;background:var(--gray-50);border-radius:8px">
          <input type="checkbox" id="sms-notif" ${SETTINGS_DATA.notifications.smsNotifications ? 'checked' : ''} style="width:20px;height:20px;cursor:pointer">
          <label style="flex:1;margin-left:12px;cursor:pointer">SMS Notifications</label>
        </div>
        <div style="display:flex;align-items:center;padding:12px;background:var(--gray-50);border-radius:8px">
          <input type="checkbox" id="push-notif" ${SETTINGS_DATA.notifications.pushNotifications ? 'checked' : ''} style="width:20px;height:20px;cursor:pointer">
          <label style="flex:1;margin-left:12px;cursor:pointer">Push Notifications</label>
        </div>
        <div style="display:flex;align-items:center;padding:12px;background:var(--gray-50);border-radius:8px">
          <input type="checkbox" id="daily-digest" ${SETTINGS_DATA.notifications.dailyDigest ? 'checked' : ''} style="width:20px;height:20px;cursor:pointer">
          <label style="flex:1;margin-left:12px;cursor:pointer">Daily Digest Email</label>
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:20px"><button class="btn btn-primary" onclick="saveNotificationSettings()"><i class="fas fa-check"></i> Save Notification Settings</button><button class="btn btn-secondary" onclick="resetNotificationForm()">Reset</button></div>
    </div>
  </div>`;
}

// SETTINGS FUNCTIONS
function switchSettingsTab(tabIndex) {
  document.querySelectorAll('#settings-tabs .mod-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.settings-tab-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('#settings-tabs .mod-tab')[tabIndex].classList.add('active');
  document.querySelector(`.settings-tab-content[data-tab="${tabIndex}"]`).classList.add('active');
}

function previewSchoolLogo() {
  const input = document.getElementById('school-logo-input');
  if (!input.files[0]) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const display = document.getElementById('school-logo-display');
    display.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover">`;
    SETTINGS_DATA.schoolInfo.schoolLogo = e.target.result;
  };
  reader.readAsDataURL(input.files[0]);
}

function saveSchoolBrand() {
  SETTINGS_DATA.schoolInfo.schoolMotto = document.getElementById('school-motto').value;
  saveSettingsToStorage();
  showToast('<i class="fas fa-check-circle"></i> School logo and motto saved successfully!', 'success');
}

function resetBrandForm() {
  document.getElementById('school-motto').value = SETTINGS_DATA.schoolInfo.schoolMotto;
  if (SETTINGS_DATA.schoolInfo.schoolLogo) {
    document.getElementById('school-logo-display').innerHTML = `<img src="${SETTINGS_DATA.schoolInfo.schoolLogo}" style="width:100%;height:100%;object-fit:cover">`;
  } else {
    document.getElementById('school-logo-display').innerHTML = `<div style="text-align:center"><div style="font-size:40px"><i class="fas fa-image"></i></div><div style="font-size:10px;color:var(--gray-400);margin-top:6px">No logo</div></div>`;
  }
  document.getElementById('school-logo-input').value = '';
  showToast('Form reset to saved values', 'info');
}

function saveSchoolInfo() {
  SETTINGS_DATA.schoolInfo = {
    schoolName: document.getElementById('school-name').value,
    schoolCode: document.getElementById('school-code').value,
    region: document.getElementById('school-region').value,
    district: document.getElementById('school-district').value,
    phone: document.getElementById('school-phone').value,
    email: document.getElementById('school-email').value,
    address: document.getElementById('school-address').value,
    website: document.getElementById('school-website').value
  };
  saveSettingsToStorage();
  showToast('<i class="fas fa-check-circle"></i> School information saved successfully!', 'success');
}

function resetSchoolForm() {
  document.getElementById('school-name').value = SETTINGS_DATA.schoolInfo.schoolName;
  document.getElementById('school-region').value = SETTINGS_DATA.schoolInfo.region;
  document.getElementById('school-district').value = SETTINGS_DATA.schoolInfo.district;
  document.getElementById('school-phone').value = SETTINGS_DATA.schoolInfo.phone;
  document.getElementById('school-email').value = SETTINGS_DATA.schoolInfo.email;
  document.getElementById('school-address').value = SETTINGS_DATA.schoolInfo.address;
  document.getElementById('school-website').value = SETTINGS_DATA.schoolInfo.website;
  showToast('Form reset to saved values', 'info');
}

function saveAcademicCalendar() {
  SETTINGS_DATA.academic = {
    academicYear: document.getElementById('academic-year').value,
    currentTerm: document.getElementById('current-term').value,
    termStartDate: document.getElementById('term-start-date').value,
    termEndDate: document.getElementById('term-end-date').value,
    academicYears: SETTINGS_DATA.academic.academicYears
  };
  saveSettingsToStorage();
  showToast('<i class="fas fa-check-circle"></i> Academic calendar updated successfully!', 'success');
}

function resetAcademicForm() {
  document.getElementById('academic-year').value = SETTINGS_DATA.academic.academicYear;
  document.getElementById('current-term').value = SETTINGS_DATA.academic.currentTerm;
  document.getElementById('term-start-date').value = SETTINGS_DATA.academic.termStartDate;
  document.getElementById('term-end-date').value = SETTINGS_DATA.academic.termEndDate;
  showToast('Form reset to saved values', 'info');
}

async function addAcademicYear() {
  const input = document.getElementById('new-academic-year-input');
  if (!input) return;
  const val = input.value.trim();
  if (!val) {
    showToast('Please enter an academic year.', 'error');
    return;
  }
  
  const regex = /^\d{4}\/\d{4}$/;
  if (!regex.test(val)) {
    showToast('Invalid format. Please use YYYY/YYYY (e.g. 2025/2026)', 'error');
    return;
  }

  let years = (SETTINGS_DATA.academic.academicYears || '').split(',').map(y => y.trim()).filter(Boolean);
  if (years.includes(val)) {
    showToast('This academic year already exists.', 'error');
    return;
  }

  years.push(val);
  SETTINGS_DATA.academic.academicYears = years.join(',');
  
  if (typeof saveSettingsToStorage === 'function') {
    await saveSettingsToStorage();
  }
  showToast('<i class="fas fa-check-circle"></i> Academic year added!', 'success');
  navTo('settings');
}

async function deleteAcademicYear(year) {
  if (!confirm(`Are you sure you want to delete the academic year ${year}?`)) return;

  let years = (SETTINGS_DATA.academic.academicYears || '').split(',').map(y => y.trim()).filter(Boolean);
  const index = years.indexOf(year);
  if (index === -1) return;

  years.splice(index, 1);
  SETTINGS_DATA.academic.academicYears = years.join(',');

  if (SETTINGS_DATA.academic.academicYear === year) {
    SETTINGS_DATA.academic.academicYear = years[0] || '';
  }

  if (typeof saveSettingsToStorage === 'function') {
    await saveSettingsToStorage();
  }
  showToast('<i class="fas fa-check-circle"></i> Academic year deleted!', 'success');
  navTo('settings');
}

function saveSystemSettings() {
  SETTINGS_DATA.system = {
    maintenanceMode: document.getElementById('maintenance-mode').value === 'true',
    backupFrequency: document.getElementById('backup-frequency').value,
    maxUploadSize: document.getElementById('max-upload').value,
    language: document.getElementById('system-language').value
  };
  saveSettingsToStorage();
  showToast('<i class="fas fa-check-circle"></i> System settings saved successfully!', 'success');
}

function resetSystemForm() {
  document.getElementById('maintenance-mode').value = SETTINGS_DATA.system.maintenanceMode;
  document.getElementById('backup-frequency').value = SETTINGS_DATA.system.backupFrequency;
  document.getElementById('max-upload').value = SETTINGS_DATA.system.maxUploadSize;
  document.getElementById('system-language').value = SETTINGS_DATA.system.language;
  showToast('Form reset to saved values', 'info');
}

function saveSecuritySettings() {
  SETTINGS_DATA.security = {
    passwordPolicy: document.getElementById('password-policy').value,
    sessionTimeout: document.getElementById('session-timeout').value,
    twoFactorAuth: document.getElementById('two-factor').value === 'true',
    apiKeyRotation: document.getElementById('api-rotation').value
  };
  saveSettingsToStorage();
  showToast('<i class="fas fa-check-circle"></i> Security settings saved successfully!', 'success');
}

function resetSecurityForm() {
  document.getElementById('password-policy').value = SETTINGS_DATA.security.passwordPolicy;
  document.getElementById('session-timeout').value = SETTINGS_DATA.security.sessionTimeout;
  document.getElementById('two-factor').value = SETTINGS_DATA.security.twoFactorAuth;
  document.getElementById('api-rotation').value = SETTINGS_DATA.security.apiKeyRotation;
  showToast('Form reset to saved values', 'info');
}

function saveAppearanceSettings() {
  const selectedTheme = document.getElementById('theme-select').value;
  SETTINGS_DATA.appearance = {
    theme: selectedTheme,
    accentColor: document.getElementById('accent-color').value,
    fontSize: document.getElementById('font-size').value,
    compactMode: document.getElementById('compact-mode').value === 'true'
  };
  // Apply theme immediately if it changed
  darkMode = selectedTheme === 'Dark';
  applyTheme();
  saveSettingsToStorage();
  showToast('<i class="fas fa-check-circle"></i> Appearance settings saved successfully!', 'success');
}

function resetAppearanceForm() {
  document.getElementById('theme-select').value = SETTINGS_DATA.appearance.theme;
  document.getElementById('accent-color').value = SETTINGS_DATA.appearance.accentColor;
  document.getElementById('font-size').value = SETTINGS_DATA.appearance.fontSize;
  document.getElementById('compact-mode').value = SETTINGS_DATA.appearance.compactMode;
  showToast('Form reset to saved values', 'info');
}

function saveNotificationSettings() {
  SETTINGS_DATA.notifications = {
    emailNotifications: document.getElementById('email-notif').checked,
    smsNotifications: document.getElementById('sms-notif').checked,
    pushNotifications: document.getElementById('push-notif').checked,
    dailyDigest: document.getElementById('daily-digest').checked
  };
  saveSettingsToStorage();
  showToast('<i class="fas fa-check-circle"></i> Notification preferences saved successfully!', 'success');
}

function resetNotificationForm() {
  document.getElementById('email-notif').checked = SETTINGS_DATA.notifications.emailNotifications;
  document.getElementById('sms-notif').checked = SETTINGS_DATA.notifications.smsNotifications;
  document.getElementById('push-notif').checked = SETTINGS_DATA.notifications.pushNotifications;
  document.getElementById('daily-digest').checked = SETTINGS_DATA.notifications.dailyDigest;
  showToast('Form reset to saved values', 'info');
}

// ROLES MODULE
function rolesModule() {
  const rolesRows = [['Admin', '3', 'Full System Access', 'Admin', 'Active', 'danger'], ['Accountant', '2', 'Financial Modules', 'Accountant', 'Active', 'warning'], ['Teacher', '64', 'Academic Modules', 'Teacher', 'Active', 'info'], ['Student', '842', 'Student View Only', 'Student', 'Active', 'success'], ['Parent', '520', 'Parent View Only', 'Parent', 'Active', 'info'], ['Alumni', '1,240', 'Alumni Portal', 'Alumni', 'Active', 'purple'], ['Visitor', '-', 'Public Pages Only', 'Visitor', 'Active', 'gray']].map(([r, u, a, d, s, c]) => `
    <tr>
      <td style="font-weight:700">${r}</td>
      <td>${u}</td>
      <td><span class="badge b-${c}">${a}</span></td>
      <td><span class="badge b-gray">${d}</span></td>
      <td><span class="badge b-success">${s}</span></td>
      <td><div style="display:flex;gap:4px"><button class="btn btn-secondary btn-xs" onclick="alert('Editing role')">Edit</button><button class="btn btn-primary btn-xs" onclick="alert('Managing permissions')">Perms</button></div></td>
    </tr>`).join('');

  const permissionsRows = ['Students', 'Teachers', 'Classes', 'Fees', 'Reports', 'Settings', 'Users', 'Notices', 'Events'].map(m => `
    <tr>
      <td style="font-weight:600">${m}</td>
      ${[true, true, true, m !== 'Settings' && m !== 'Reports'].map(p => `<td style="text-align:center;font-size:16px;color:${p ? 'var(--success)' : 'var(--danger)'}">${p ? '?' : '?'}</td>`).join('')}
    </tr>`).join('');

  return hdr('Roles & Permissions', 'Manage user roles and access control', 'Roles') +
    renderPageTemplate('pages/admin/roles/index.html', { rolesRows, permissionsRows });
}

// USERS MODULE
function usersModule() {
  // Fetch live data after render
  setTimeout(refreshUsersTable, 50);

  return hdr('User Accounts', 'Manage all system user accounts', 'User Accounts') +
    renderPageTemplate('pages/admin/users/index.html');
}

// Refresh users table from API
async function refreshUsersTable() {
  const search     = document.getElementById('user-search')?.value?.trim() || '';
  const roleFilter = document.getElementById('user-role-filter')?.value || '';
  const params     = { limit: 200 };
  if (search) params.search = search;
  if (roleFilter && roleFilter !== 'All Roles') params.role = roleFilter;

  const res = await API.users.list(params);
  const loading = document.getElementById('users-loading');
  if (loading) loading.style.display = 'none';

  const tbody = document.getElementById('users-table-body');
  if (!tbody) return;

  if (!res || !res.success || !res.data.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--gray-400);padding:20px">No users found</td></tr>';
    return;
  }

  const roleColors = { Admin: 'danger', Teacher: 'info', Student: 'success', Accountant: 'warning', Parent: 'purple', Alumni: 'teal', Visitor: 'gray' };

  tbody.innerHTML = res.data.map((u, i) => `
    <tr>
      <td style="color:var(--gray-400)">${i + 1}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="av av-sm av-${u.role.toLowerCase()}">${u.avatar || u.name.slice(0,2).toUpperCase()}</div>
          <div>
            <div style="font-weight:600;font-size:12px">${u.name}</div>
            <div style="font-size:10px;color:var(--gray-500)">${u.user_code}</div>
          </div>
        </div>
      </td>
      <td style="color:var(--blue-main)">@${u.username}</td>
      <td style="font-size:11px;color:var(--gray-600)">${u.email}</td>
      <td><span class="badge b-${roleColors[u.role] || 'gray'}">${u.role}</span></td>
      <td style="font-size:11px;color:var(--gray-400)">${u.last_login ? new Date(u.last_login).toLocaleString() : 'Never'}</td>
      <td><span class="badge b-${u.status === 'Active' ? 'success' : 'danger'}">${u.status}</span></td>
      <td>
        <div style="display:flex;gap:4px">
          <button class="btn btn-secondary btn-xs" onclick="editUser(${u.id})">Edit</button>
          <button class="btn btn-${u.status === 'Active' ? 'danger' : 'warning'} btn-xs"
            onclick="toggleUserStatus(${u.id},'${u.status}')">
            ${u.status === 'Active' ? 'Disable' : 'Enable'}
          </button>
          <button class="btn btn-danger btn-xs" onclick="deleteUserAccount(${u.id},'${u.name.replace(/'/g,"\\'")}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>`).join('');
}

// USER MANAGEMENT FUNCTIONS
function toggleUserForm(resetEdit = true) {
  const form = document.getElementById('user-form-wrap');
  if (!form) return;
  if (form.style.display === 'none' || !form.style.display) {
    if (resetEdit) {
      ['user-name','user-username','user-email','user-password'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
      });
      const roleEl = document.getElementById('user-role');
      if (roleEl) roleEl.value = 'Teacher';
      const btn = document.getElementById('save-user-btn');
      if (btn) btn.textContent = 'Create Account';
      const title = document.getElementById('form-title');
      if (title) title.textContent = 'Create New User Account';
      delete document.getElementById('user-form-wrap').dataset.userId;
    }
    form.style.display = 'block';
    document.getElementById('user-name')?.focus();
  } else {
    form.style.display = 'none';
  }
}

function filterUsers() {
  refreshUsersTable();
}

async function saveUser() {
  const name     = document.getElementById('user-name').value.trim();
  const username = document.getElementById('user-username').value.trim();
  const email    = document.getElementById('user-email').value.trim();
  const role     = document.getElementById('user-role').value;
  const password = document.getElementById('user-password').value;
  const saveBtn  = document.getElementById('save-user-btn');
  const isEdit   = saveBtn?.textContent === 'Update Account';
  const editId   = document.getElementById('user-form-wrap')?.dataset?.userId;

  if (!name || !username || !email) {
    showToast('Please fill in all required fields', 'warning'); return;
  }
  if (!isEdit && !password) {
    showToast('Password is required for new accounts', 'warning'); return;
  }
  if (password && password.length < 6) {
    showToast('Password must be at least 6 characters', 'warning'); return;
  }
  if (!email.includes('@')) {
    showToast('Please enter a valid email address', 'warning'); return;
  }

  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving...'; }

  let res;
  if (isEdit && editId) {
    const data = { name, username, email, role };
    if (password) data.password = password;
    res = await API.users.update(editId, data);
  } else {
    res = await API.users.create({ name, username, email, role, password });
  }

  if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = isEdit ? 'Update Account' : 'Create Account'; }

  if (!res || !res.success) {
    showToast('<i class="fas fa-times-circle"></i> ' + (res?.message || 'Failed to save user'), 'error'); return;
  }

  showToast(`<i class="fas fa-check-circle"></i> User account ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
  document.getElementById('user-form-wrap').style.display = 'none';
  await refreshUsersTable();
}

async function editUser(userId) {
  const res = await API.users.get(userId);
  if (!res || !res.success) { showToast('Failed to load user', 'error'); return; }
  const u = res.data;

  const form = document.getElementById('user-form-wrap');
  if (!form) { showToast('User form not found â€” navigate to User Accounts first', 'warning'); return; }

  document.getElementById('user-name').value     = u.name;
  document.getElementById('user-username').value  = u.username;
  document.getElementById('user-email').value     = u.email;
  document.getElementById('user-role').value      = u.role;
  document.getElementById('user-password').value  = '';   // never pre-fill password
  document.getElementById('save-user-btn').textContent = 'Update Account';
  document.getElementById('form-title').textContent    = 'Edit User Account';
  form.dataset.userId = userId;
  form.style.display  = 'block';
  document.getElementById('user-name').focus();
}

async function toggleUserStatus(userId, currentStatus) {
  const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
  const res = await API.users.update(userId, { status: newStatus });
  if (!res || !res.success) {
    showToast('<i class="fas fa-times-circle"></i> Failed to update status', 'error'); return;
  }
  showToast(`<i class="fas fa-check-circle"></i> User ${newStatus === 'Active' ? 'enabled' : 'disabled'}`, 'success');
  await refreshUsersTable();
}

async function deleteUserAccount(userId, name) {
  if (!confirm(`Delete account for "${name}"? This cannot be undone.`)) return;
  const res = await API.users.delete(userId);
  if (!res || !res.success) {
    showToast('<i class="fas fa-times-circle"></i> ' + (res?.message || 'Delete failed'), 'error'); return;
  }
  showToast(`<i class="fas fa-check-circle"></i> Account deleted`, 'success');
  await refreshUsersTable();
}

// STAFF MODULE
function staffModule() {
  // Start with in-memory stats, then fetch live data and update the table
  const totalStaff    = Object.keys(STAFF_DATA).length;
  const teachingStaff = Object.values(STAFF_DATA).filter(s => s.category === 'Teaching').length;
  const adminStaff    = Object.values(STAFF_DATA).filter(s => s.category === 'Admin').length;
  const supportStaff  = Object.values(STAFF_DATA).filter(s => s.category === 'Support').length;

  // Kick off API load after render
  setTimeout(refreshStaffTable, 50);

  return hdr('Staff Management', 'Manage school staff - teaching, admin and support personnel', 'Staff') + `
  <div class="stats-row">
    ${statCard('<i class="fas fa-users"></i>', '<span id="stat-staff-total">' + totalStaff + '</span>', 'Total Staff', 'All categories', 'neu', 'si-blue')}
    ${statCard('<i class="fas fa-chalkboard-user"></i>', '' + teachingStaff, 'Teaching Staff', 'Academic staff', 'neu', 'si-gold')}
    ${statCard('<i class="fas fa-building"></i>', '' + adminStaff, 'Admin Staff', 'Administrative team', 'neu', 'si-green')}
    ${statCard('<i class="fas fa-wrench"></i>', '' + supportStaff, 'Support Staff', 'Support services', 'neu', 'si-purple')}
  </div>
  
  <div class="toolbar" style="margin-bottom:20px;display:flex;gap:10px;flex-wrap:wrap">
    <button class="btn btn-primary" onclick="toggleStaffForm()"><i class="fas fa-plus"></i> Add Staff Member</button>
    <button class="btn btn-secondary" onclick="showStaffStatistics()"><i class="fas fa-chart-bar"></i> Statistics</button>
    <button class="btn btn-secondary" onclick="exportStaffToCSV()"><i class="fas fa-download"></i> Export CSV</button>
    <button class="btn btn-secondary" onclick="exportStaffToExcel()"><i class="fas fa-table"></i> Export Excel</button>
    <div class="search-bar" style="flex:1;min-width:200px"><span><i class="fas fa-search"></i></span><input id="staff-search" placeholder="Search staff by name or ID..." onkeyup="filterStaffList()"></div>
    <select id="staff-category-filter" class="select-sm" onchange="filterStaffList()"><option value="">All Categories</option><option value="Teaching">Teaching</option><option value="Admin">Admin</option><option value="Support">Support</option></select>
  </div>
  
  <!-- ADD STAFF FORM -->
  <div id="staff-form-wrap" style="display:none;margin-bottom:20px">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-user-plus"></i> Add New Staff Member</span></div>
      <div class="form-grid">
        <div class="form-field"><label>Full Name *</label><input type="text" id="staff-name" placeholder="Full name"></div>
        <div class="form-field"><label>Email Address *</label><input type="email" id="staff-email" placeholder="email@school.edu.gh"></div>
        <div class="form-field"><label>Phone Number *</label><input type="tel" id="staff-phone" placeholder="+233 XXX XXX XXXX"></div>
        <div class="form-field"><label>Gender *</label><select id="staff-gender"><option>-- Select --</option><option>Male</option><option>Female</option></select></div>
        <div class="form-field"><label>Date of Birth *</label><input type="date" id="staff-dob"></div>
        <div class="form-field"><label>Category *</label><select id="staff-category"><option>-- Select --</option><option>Teaching</option><option>Admin</option><option>Support</option></select></div>
        <div class="form-field"><label>Department *</label><input type="text" id="staff-department" placeholder="e.g., Mathematics, Finance"></div>
        <div class="form-field"><label>Position/Title *</label><input type="text" id="staff-position" placeholder="e.g., Senior Teacher, Accountant"></div>
        <div class="form-field" style="grid-column:1/-1"><label>Qualifications *</label><textarea id="staff-qualifications" placeholder="Education and certifications..." style="min-height:60px;font-family:Poppins,sans-serif;border:1.5px solid var(--gray-200);border-radius:6px;padding:8px;font-size:12px"></textarea></div>
        <div class="form-field"><label>Salary Grade *</label><input type="text" id="staff-salary-grade" placeholder="e.g., Grade 8, Admin A"></div>
        <div class="form-field"><label>Join Date *</label><input type="date" id="staff-join-date"></div>
        <div class="form-field"><label>Address</label><input type="text" id="staff-address" placeholder="Residential address"></div>
        <div class="form-field"><label>Emergency Contact Name</label><input type="text" id="staff-emergency-contact" placeholder="Name"></div>
        <div class="form-field"><label>Emergency Contact Phone</label><input type="tel" id="staff-emergency-phone" placeholder="+233 XXX XXX XXXX"></div>
        <div class="form-field" style="grid-column:1/-1"><label>Assignments/Roles (comma-separated)</label><input type="text" id="staff-assignments" placeholder="e.g., JHS 1 Math, Math Coordinator"></div>
        <div style="grid-column:1/-1;display:flex;gap:8px">
          <button class="btn btn-primary" style="flex:1" onclick="submitStaffForm()"><i class="fas fa-check"></i> Add Staff</button>
          <button class="btn btn-secondary" style="flex:1" onclick="toggleStaffForm()">Cancel</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- STAFF LIST TABLE -->
  <div class="card">
    <div class="card-hdr">
      <span class="card-title"><i class="fas fa-list"></i> Staff Directory</span>
      <span id="staff-loading" style="font-size:12px;color:var(--gray-400)"><i class="fas fa-spinner fa-spin"></i> Loading...</span>
    </div>
    <table class="tbl">
      <thead><tr><th>#</th><th>Staff Name</th><th>Category</th><th>Department</th><th>Position</th><th>Phone</th><th>Join Date</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody id="staff-list-body">
        ${Object.values(STAFF_DATA).map((staff, i) => `
        <tr class="staff-row" data-category="${staff.category}" data-name="${staff.name.toLowerCase()}" style="cursor:pointer" onclick="if(!event.target.closest('button')) viewStaffDetail('${staff.id}')">
          <td style="color:var(--gray-400);font-size:11px">${i + 1}</td>
          <td>
            <div style="display:flex;align-items:center;gap:8px">
              <div class="av av-sm av-${['blue','purple','gold','green','teal'][i%5]}">${staff.avatar}</div>
              <div><div style="font-weight:600;font-size:12px">${staff.name}</div><div style="font-size:10px;color:var(--gray-500)">${staff.id}</div></div>
            </div>
          </td>
          <td><span class="badge ${staff.category==='Teaching'?'b-info':(staff.category==='Admin'?'b-success':'b-warning')}">${staff.category}</span></td>
          <td style="font-size:11px">${staff.department}</td>
          <td style="font-size:11px;color:var(--gray-600)">${staff.position}</td>
          <td style="font-size:10px">${staff.phone}</td>
          <td style="font-size:10px;color:var(--gray-500)">${new Date(staff.joinDate).toLocaleDateString()}</td>
          <td><span class="badge ${staff.status==='Active'?'b-success':'b-danger'}">${staff.status}</span></td>
          <td>
            <div style="display:flex;gap:3px;justify-content:center">
              <button class="btn btn-secondary btn-xs" onclick="viewStaffDetail('${staff.id}')" title="View"><i class="fas fa-eye"></i></button>
              <button class="btn btn-primary btn-xs" onclick="editStaff('${staff.id}')" title="Edit"><i class="fas fa-edit"></i></button>
              <button class="btn btn-danger btn-xs" onclick="deleteStaff('${staff.id}')" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

// STAFF MANAGEMENT FUNCTIONS
function toggleStaffForm() {
  const form = document.getElementById('staff-form-wrap');
  if (form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

async function submitStaffForm() {
  const name         = document.getElementById('staff-name')?.value.trim();
  const email        = document.getElementById('staff-email')?.value.trim();
  const phone        = document.getElementById('staff-phone')?.value.trim();
  const gender       = document.getElementById('staff-gender')?.value;
  const dob          = document.getElementById('staff-dob')?.value;
  const category     = document.getElementById('staff-category')?.value;
  const department   = document.getElementById('staff-department')?.value.trim();
  const position     = document.getElementById('staff-position')?.value.trim();
  const qualifications = document.getElementById('staff-qualifications')?.value.trim();
  const salaryGrade  = document.getElementById('staff-salary-grade')?.value.trim();
  const joinDate     = document.getElementById('staff-join-date')?.value;
  const address      = document.getElementById('staff-address')?.value.trim();
  const emergencyContact = document.getElementById('staff-emergency-contact')?.value.trim();
  const emergencyPhone   = document.getElementById('staff-emergency-phone')?.value.trim();

  if (!name || !email || !phone || !gender || gender === '-- Select --' ||
      !dob || !category || category === '-- Select --' ||
      !department || !position || !qualifications || !salaryGrade || !joinDate) {
    showToast('<i class="fas fa-times-circle"></i> Please fill in all required fields (marked with *)', 'error');
    return;
  }

  const btn = document.querySelector('#staff-form-wrap .btn-primary');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...'; }

  const res = await API.staff.create({
    name, email, phone, gender, dob, category, department, position,
    qualifications, salary_grade: salaryGrade, join_date: joinDate,
    address, emergency_contact: emergencyContact, emergency_phone: emergencyPhone,
    status: 'Active'
  });

  if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-check"></i> Add Staff'; }

  if (!res || !res.success) {
    showToast('<i class="fas fa-times-circle"></i> ' + (res?.message || 'Failed to save staff'), 'error');
    return;
  }

  // Also update in-memory so stats stay accurate until next full reload
  STAFF_DATA[res.staff_code] = {
    id: res.staff_code, name, email, phone, gender, dob, category,
    department, position, qualifications, salaryGrade, joinDate,
    address, emergencyContact, emergencyPhone,
    assignments: [], status: 'Active', performance: '4.0/5',
    avatar: name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  };

  showToast('<i class="fas fa-check-circle"></i> ' + name + ' added (ID: ' + res.staff_code + ')', 'success', 4000);

  // Clear form and refresh table
  ['staff-name','staff-email','staff-phone','staff-dob','staff-department',
   'staff-position','staff-qualifications','staff-salary-grade','staff-join-date',
   'staff-address','staff-emergency-contact','staff-emergency-phone','staff-assignments']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.getElementById('staff-gender').value    = '-- Select --';
  document.getElementById('staff-category').value  = '-- Select --';
  document.getElementById('staff-form-wrap').style.display = 'none';

  // Reload the staff table from the API
  await refreshStaffTable();
}

// Reload staff table rows from the API without re-rendering the whole page
async function refreshStaffTable() {
  const res = await API.staff.list({ limit: 200 });
  const loading = document.getElementById('staff-loading');
  if (loading) loading.style.display = 'none';
  if (!res || !res.success) return;

  const tbody = document.getElementById('staff-list-body');
  if (!tbody) { renderMain(); return; }

  const colors = ['blue','purple','gold','green','teal'];
  tbody.innerHTML = res.data.map((s, i) => `
    <tr class="staff-row" data-category="${s.category}" data-name="${s.name.toLowerCase()}" style="cursor:pointer" onclick="if(!event.target.closest('button')) viewStaffDetailAPI(${s.id})">
      <td style="color:var(--gray-400);font-size:11px">${i + 1}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <div class="av av-sm av-${colors[i % 5]}">${s.avatar || s.name.slice(0,2).toUpperCase()}</div>
          <div>
            <div style="font-weight:600;font-size:12px">${s.name}</div>
            <div style="font-size:10px;color:var(--gray-500)">${s.staff_code}</div>
          </div>
        </div>
      </td>
      <td><span class="badge ${s.category === 'Teaching' ? 'b-info' : (s.category === 'Admin' ? 'b-success' : 'b-warning')}">${s.category}</span></td>
      <td style="font-size:11px">${s.department || ''}</td>
      <td style="font-size:11px;color:var(--gray-600)">${s.position || ''}</td>
      <td style="font-size:10px">${s.phone || ''}</td>
      <td style="font-size:10px;color:var(--gray-500)">${s.join_date ? new Date(s.join_date).toLocaleDateString() : ''}</td>
      <td><span class="badge ${s.status === 'Active' ? 'b-success' : 'b-danger'}">${s.status}</span></td>
      <td>
        <div style="display:flex;gap:3px;justify-content:center">
          <button class="btn btn-secondary btn-xs" onclick="viewStaffDetailAPI(${s.id})" title="View"><i class="fas fa-eye"></i></button>
          <button class="btn btn-primary btn-xs" onclick="editStaffAPI(${s.id})" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger btn-xs" onclick="deleteStaffAPI(${s.id},'${s.name.replace(/'/g,"\\'")}');" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');

  // Update total stat card
  const totalEl = document.getElementById('stat-staff-total');
  if (totalEl) totalEl.textContent = res.total || res.data.length;
}

async function deleteStaffAPI(id, name) {
  if (!confirm('Delete ' + name + '? This cannot be undone.')) return;
  const res = await API.staff.delete(id);
  if (!res || !res.success) {
    showToast('<i class="fas fa-times-circle"></i> ' + (res?.message || 'Delete failed'), 'error');
    return;
  }
  showToast('<i class="fas fa-check-circle"></i> ' + name + ' deleted', 'success');
  await refreshStaffTable();
}

async function editStaffAPI(id) {
  const res = await API.staff.get(id);
  if (!res || !res.success) { showToast('Failed to load staff details', 'error'); return; }
  const s = res.data;

  const html = hdr('Edit Staff Member', 'Update staff information', 'Staff') + `
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-edit"></i> Edit Staff Details</span></div>
    <div class="form-grid">
      <div class="form-field"><label>Full Name *</label><input type="text" id="edit-staff-name" value="${s.name}"></div>
      <div class="form-field"><label>Email *</label><input type="email" id="edit-staff-email" value="${s.email}"></div>
      <div class="form-field"><label>Phone</label><input type="tel" id="edit-staff-phone" value="${s.phone || ''}"></div>
      <div class="form-field"><label>Category *</label>
        <select id="edit-staff-category">
          <option ${s.category==='Teaching'?'selected':''}>Teaching</option>
          <option ${s.category==='Admin'?'selected':''}>Admin</option>
          <option ${s.category==='Support'?'selected':''}>Support</option>
        </select>
      </div>
      <div class="form-field"><label>Department</label><input type="text" id="edit-staff-department" value="${s.department || ''}"></div>
      <div class="form-field"><label>Position</label><input type="text" id="edit-staff-position" value="${s.position || ''}"></div>
      <div class="form-field"><label>Salary Grade</label><input type="text" id="edit-staff-salary-grade" value="${s.salary_grade || ''}"></div>
      <div class="form-field"><label>Status</label>
        <select id="edit-staff-status">
          <option ${s.status==='Active'?'selected':''}>Active</option>
          <option ${s.status==='On Leave'?'selected':''}>On Leave</option>
          <option ${s.status==='Inactive'?'selected':''}>Inactive</option>
        </select>
      </div>
      <div class="form-field" style="grid-column:1/-1"><label>New Login Password</label><input type="password" id="edit-staff-password" minlength="6" placeholder="Leave blank to keep the current password"></div>
      <div style="grid-column:1/-1;display:flex;gap:8px;margin-top:8px">
        <button class="btn btn-primary" style="flex:1" onclick="submitEditStaffAPI(${s.id})"><i class="fas fa-check"></i> Save Changes</button>
        <button class="btn btn-secondary" style="flex:1" onclick="navTo('staff')">Cancel</button>
      </div>
    </div>
  </div>`;
  document.getElementById('main-content').innerHTML = html;
}

async function submitEditStaffAPI(id) {
  const data = {
    name:         document.getElementById('edit-staff-name')?.value.trim(),
    email:        document.getElementById('edit-staff-email')?.value.trim(),
    phone:        document.getElementById('edit-staff-phone')?.value.trim(),
    category:     document.getElementById('edit-staff-category')?.value,
    department:   document.getElementById('edit-staff-department')?.value.trim(),
    position:     document.getElementById('edit-staff-position')?.value.trim(),
    salary_grade: document.getElementById('edit-staff-salary-grade')?.value.trim(),
    status:       document.getElementById('edit-staff-status')?.value,
    password:     document.getElementById('edit-staff-password')?.value || undefined,
  };

  const res = await API.staff.update(id, data);
  if (!res || !res.success) {
    showToast('<i class="fas fa-times-circle"></i> ' + (res?.message || 'Update failed'), 'error');
    return;
  }
  showToast('<i class="fas fa-check-circle"></i> Staff updated successfully', 'success');
  navTo('staff');
}

async function viewStaffDetailAPI(id) {
  const res = await API.staff.get(id);
  if (!res || !res.success) { showToast('Failed to load staff details', 'error'); return; }
  viewStaffDetail_render(res.data);
}

function viewStaffDetail_render(s) {
  // Map API field names to the shape viewStaffDetail expects
  const mapped = {
    id: s.staff_code, name: s.name, email: s.email, phone: s.phone,
    gender: s.gender, dob: s.dob, category: s.category, department: s.department,
    position: s.position, qualifications: s.qualifications, salaryGrade: s.salary_grade,
    joinDate: s.join_date, address: s.address, emergencyContact: s.emergency_contact,
    emergencyPhone: s.emergency_phone, assignments: [], status: s.status,
    performance: s.performance || '4.0/5',
    avatar: s.avatar || s.name.slice(0,2).toUpperCase()
  };
  // Temporarily put in STAFF_DATA so the original viewStaffDetail can render it
  STAFF_DATA[mapped.id] = mapped;
  viewStaffDetail(mapped.id);
}

function viewStaffDetail(staffId) {
  const staff = STAFF_DATA[staffId];
  if (!staff) return;

  let html = hdr('Staff Profile', 'View complete staff member details', 'Staff') + `
  <div class="g2 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-user"></i> Personal Information</span></div>
      <div style="display:flex;gap:20px;align-items:center;margin-bottom:20px">
        <div class="av av-xl av-blue">${staff.avatar}</div>
        <div>
          <div style="font-size:16px;font-weight:700;color:var(--blue-dark)">${staff.name}</div>
          <div style="font-size:12px;color:var(--gray-500);margin-top:4px">ID: ${staff.id}</div>
          <div style="margin-top:8px;display:flex;gap:8px">
            <span class="badge ${staff.category === 'Teaching' ? 'b-info' : (staff.category === 'Admin' ? 'b-success' : 'b-warning')}">${staff.category}</span>
            <span class="badge b-success">${staff.status}</span>
          </div>
        </div>
      </div>
      <div style="border-top:1px solid var(--gray-200);padding-top:12px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:12px">
          <div>
            <div style="color:var(--gray-500);font-size:11px">Gender</div>
            <div style="font-weight:600;margin-top:4px">${staff.gender}</div>
          </div>
          <div>
            <div style="color:var(--gray-500);font-size:11px">Date of Birth</div>
            <div style="font-weight:600;margin-top:4px">${new Date(staff.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <div>
            <div style="color:var(--gray-500);font-size:11px">Email Address</div>
            <div style="font-weight:600;margin-top:4px;color:var(--blue-main)">${staff.email}</div>
          </div>
          <div>
            <div style="color:var(--gray-500);font-size:11px">Phone Number</div>
            <div style="font-weight:600;margin-top:4px">${staff.phone}</div>
          </div>
          <div style="grid-column:1/-1">
            <div style="color:var(--gray-500);font-size:11px">Residential Address</div>
            <div style="font-weight:600;margin-top:4px">${staff.address}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-briefcase"></i> Employment Information</span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:12px">
        <div>
          <div style="color:var(--gray-500);font-size:11px">Category</div>
          <div style="font-weight:600;margin-top:4px">${staff.category}</div>
        </div>
        <div>
          <div style="color:var(--gray-500);font-size:11px">Department</div>
          <div style="font-weight:600;margin-top:4px">${staff.department}</div>
        </div>
        <div>
          <div style="color:var(--gray-500);font-size:11px">Position/Title</div>
          <div style="font-weight:600;margin-top:4px">${staff.position}</div>
        </div>
        <div>
          <div style="color:var(--gray-500);font-size:11px">Salary Grade</div>
          <div style="font-weight:600;margin-top:4px">${staff.salaryGrade}</div>
        </div>
        <div>
          <div style="color:var(--gray-500);font-size:11px">Join Date</div>
          <div style="font-weight:600;margin-top:4px">${new Date(staff.joinDate).toLocaleDateString()}</div>
        </div>
        <div>
          <div style="color:var(--gray-500);font-size:11px">Tenure</div>
          <div style="font-weight:600;margin-top:4px">${Math.floor((new Date() - new Date(staff.joinDate)) / (365 * 24 * 60 * 60 * 1000))} years</div>
        </div>
        <div style="grid-column:1/-1">
          <div style="color:var(--gray-500);font-size:11px">Qualifications</div>
          <div style="font-weight:600;margin-top:4px">${staff.qualifications}</div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="g2 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-phone"></i> Emergency Contact</span></div>
      <div style="font-size:12px">
        <div style="margin-bottom:12px">
          <div style="color:var(--gray-500);font-size:11px">Contact Person</div>
          <div style="font-weight:600;margin-top:4px">${staff.emergencyContact}</div>
        </div>
        <div>
          <div style="color:var(--gray-500);font-size:11px">Phone Number</div>
          <div style="font-weight:600;margin-top:4px">${staff.emergencyPhone}</div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-star"></i> Performance & Assignments</span></div>
      <div style="font-size:12px;margin-bottom:12px">
        <div style="color:var(--gray-500);font-size:11px;margin-bottom:4px">Performance Rating</div>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="flex:1">
            <div class="prog-bar"><div class="prog-fill pf-blue" style="width:${parseFloat(staff.performance) * 20}%"></div></div>
          </div>
          <div style="font-weight:700;color:var(--blue-main)">${staff.performance}</div>
        </div>
      </div>
      <div style="border-top:1px solid var(--gray-200);padding-top:12px">
        <div style="color:var(--gray-500);font-size:11px;margin-bottom:8px">Current Assignments/Roles</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${staff.assignments.map(a => '<span class="badge b-info" style="font-size:11px">' + a + '</span>').join('')}
        </div>
      </div>
    </div>
  </div>
  
  <div style="display:flex;gap:10px">
    <button class="btn btn-primary" onclick="editStaff('${staff.id}')"><i class="fas fa-edit"></i> Edit Staff</button>
    <button class="btn btn-secondary" onclick="navTo('staff')"><i class="fas fa-arrow-left"></i> Back to List</button>
  </div>`;

  document.getElementById('main-content').innerHTML = html;
}

function editStaff(staffId) {
  const staff = STAFF_DATA[staffId];
  if (!staff) return;

  let html = hdr('Edit Staff Member', 'Update staff information', 'Staff') + `
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-edit"></i> Edit Staff Details</span></div>
    <div class="form-grid">
      <div class="form-field">
        <label>Full Name *</label>
        <input type="text" id="edit-staff-name" placeholder="Full name" value="${staff.name}">
      </div>
      <div class="form-field">
        <label>Email Address *</label>
        <input type="email" id="edit-staff-email" placeholder="email@school.edu.gh" value="${staff.email}">
      </div>
      <div class="form-field">
        <label>Phone Number *</label>
        <input type="tel" id="edit-staff-phone" placeholder="+233 XXX XXX XXXX" value="${staff.phone}">
      </div>
      <div class="form-field">
        <label>Category *</label>
        <select id="edit-staff-category"><option value="Teaching" ${staff.category === 'Teaching' ? 'selected' : ''}>Teaching</option><option value="Admin" ${staff.category === 'Admin' ? 'selected' : ''}>Admin</option><option value="Support" ${staff.category === 'Support' ? 'selected' : ''}>Support</option></select>
      </div>
      <div class="form-field">
        <label>Department *</label>
        <input type="text" id="edit-staff-department" placeholder="Department" value="${staff.department}">
      </div>
      <div class="form-field">
        <label>Position/Title *</label>
        <input type="text" id="edit-staff-position" placeholder="Position" value="${staff.position}">
      </div>
      <div class="form-field">
        <label>Salary Grade *</label>
        <input type="text" id="edit-staff-salary-grade" placeholder="Salary Grade" value="${staff.salaryGrade}">
      </div>
      <div class="form-field">
        <label>Status</label>
        <select id="edit-staff-status"><option value="Active" ${staff.status === 'Active' ? 'selected' : ''}>Active</option><option value="On Leave">On Leave</option><option value="Retired">Retired</option></select>
      </div>
      <div class="form-field" style="grid-column:1/-1">
        <label>Assignments/Roles (comma-separated)</label>
        <input type="text" id="edit-staff-assignments" placeholder="Assignments" value="${staff.assignments.join(', ')}">
      </div>
      <div style="grid-column:1/-1;display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="submitEditStaff('${staff.id}')"><i class="fas fa-check"></i> Save Changes</button>
        <button class="btn btn-secondary" style="flex:1" onclick="navTo('staff')">Cancel</button>
      </div>
    </div>
  </div>`;

  document.getElementById('main-content').innerHTML = html;
}

function submitEditStaff(staffId) {
  // Delegate to API version
  const numId = parseInt(staffId);
  if (!isNaN(numId)) { submitEditStaffAPI(numId); return; }
  // Legacy in-memory fallback
  const staff = STAFF_DATA[staffId];
  if (!staff) return;
  staff.name       = document.getElementById('edit-staff-name')?.value.trim();
  staff.email      = document.getElementById('edit-staff-email')?.value.trim();
  staff.phone      = document.getElementById('edit-staff-phone')?.value.trim();
  staff.category   = document.getElementById('edit-staff-category')?.value;
  staff.department = document.getElementById('edit-staff-department')?.value.trim();
  staff.position   = document.getElementById('edit-staff-position')?.value.trim();
  staff.salaryGrade= document.getElementById('edit-staff-salary-grade')?.value.trim();
  staff.status     = document.getElementById('edit-staff-status')?.value;
  staff.assignments= document.getElementById('edit-staff-assignments')?.value.split(',').map(s => s.trim()).filter(s => s);
  showToast('<i class="fas fa-check-circle"></i> Staff information updated!', 'success', 3000);
  setTimeout(() => navTo('staff'), 1500);
}

function deleteStaff(staffId) {
  // If it's a numeric DB id, use the API
  const numId = parseInt(staffId);
  const staff = STAFF_DATA[staffId];
  if (!isNaN(numId) && !staff) {
    deleteStaffAPI(numId, 'this staff member');
    return;
  }
  if (!staff) return;
  if (confirm('Delete ' + staff.name + '? This cannot be undone.')) {
    delete STAFF_DATA[staffId];
    showToast('<i class="fas fa-check-circle"></i> Staff member deleted', 'success');
    renderMain();
  }
}

function filterStaffList() {
  const searchTerm = document.getElementById('staff-search')?.value.toLowerCase() || '';
  const categoryFilter = document.getElementById('staff-category-filter')?.value || '';

  const rows = document.querySelectorAll('.staff-row');
  rows.forEach(row => {
    const name = row.dataset.name || '';
    const category = row.dataset.category || '';

    const matchesSearch = name.includes(searchTerm);
    const matchesCategory = !categoryFilter || category === categoryFilter;

    row.style.display = (matchesSearch && matchesCategory) ? '' : 'none';
  });
}

function showStaffStatistics() {
  const totalStaff = Object.keys(STAFF_DATA).length;
  const teachingStaff = Object.values(STAFF_DATA).filter(s => s.category === 'Teaching').length;
  const adminStaff = Object.values(STAFF_DATA).filter(s => s.category === 'Admin').length;
  const supportStaff = Object.values(STAFF_DATA).filter(s => s.category === 'Support').length;
  const activeStaff = Object.values(STAFF_DATA).filter(s => s.status === 'Active').length;

  // Calculate average performance
  const avgPerformance = (Object.values(STAFF_DATA).reduce((sum, s) => sum + parseFloat(s.performance), 0) / totalStaff).toFixed(1);

  // Get departments
  const depts = {};
  Object.values(STAFF_DATA).forEach(s => {
    depts[s.department] = (depts[s.department] || 0) + 1;
  });

  let html = hdr('Staff Statistics & Reports', 'Comprehensive staff analysis', 'Staff') + `
  <div class="stats-row">
    ${statCard('<i class="fas fa-users"></i>', '' + totalStaff, 'Total Staff', 'All staff', 'neu', 'si-blue')}
    ${statCard('<i class="fas fa-check-circle"></i>', '' + activeStaff, 'Active Staff', 'Currently employed', 'neu', 'si-green')}
    ${statCard('<i class="fas fa-star"></i>', '' + avgPerformance, 'Avg Performance', 'Overall rating', 'neu', 'si-gold')}
    ${statCard('<i class="fas fa-building"></i>', '' + Object.keys(depts).length, 'Departments', 'Total categories', 'neu', 'si-purple')}
  </div>
  
  <div class="g3 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-pie"></i> Staff by Category</span></div>
      <div style="padding:20px;text-align:center">
        <div style="margin-bottom:20px">
          <div style="font-size:24px;font-weight:700;color:var(--blue-main)">${teachingStaff}</div>
          <div style="font-size:12px;color:var(--gray-500);margin-top:4px">Teaching Staff</div>
          <div style="font-size:11px;color:var(--gray-400)">'+((teachingStaff/totalStaff)*100).toFixed(0)+'%</div>
        </div>
      </div>
      <div class="prog-bar" style="margin-bottom:12px"><div class="prog-fill pf-blue" style="width:'+((teachingStaff/totalStaff)*100)+'%"></div></div>
      <div style="padding:0 12px;padding-bottom:12px;border-bottom:1px solid var(--gray-200)">
        <div style="font-size:11px;color:var(--gray-500)">Total: '+teachingStaff+' of '+totalStaff+'</div>
      </div>
      <div style="padding-top:12px">
        <div style="margin-bottom:12px">
          <div style="font-size:14px;font-weight:700;color:var(--blue-main)">${adminStaff}</div>
          <div style="font-size:12px;color:var(--gray-500);margin-top:2px">Admin Staff ('+((adminStaff/totalStaff)*100).toFixed(0)+'%)</div>
        </div>
        <div class="prog-bar" style="margin-bottom:12px"><div class="prog-fill pf-green" style="width:'+((adminStaff/totalStaff)*100)+'%"></div></div>
        <div style="margin-bottom:12px">
          <div style="font-size:14px;font-weight:700;color:var(--gold)">${supportStaff}</div>
          <div style="font-size:12px;color:var(--gray-500);margin-top:2px">Support Staff ('+((supportStaff/totalStaff)*100).toFixed(0)+'%)</div>
        </div>
        <div class="prog-bar"><div class="prog-fill pf-gold" style="width:'+((supportStaff/totalStaff)*100)+'%"></div></div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-building"></i> Staff by Department</span></div>
      <div style="font-size:12px">
        ${Object.entries(depts).sort((a, b) => b[1] - a[1]).map(([dept, count]) => `
        <div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px">
            <span style="font-weight:600">${dept}</span>
            <span style="color:var(--blue-main);font-weight:700">${count}</span>
          </div>
          <div class="prog-bar"><div class="prog-fill pf-blue" style="width:${(count / totalStaff) * 100}%"></div></div>
        </div>`).join('')}
      </div>
    </div>
    
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-rankings"></i> Salary Grades Distribution</span></div>
      ${(() => {
      const salaryGrades = {};
      Object.values(STAFF_DATA).forEach(s => {
        salaryGrades[s.salaryGrade] = (salaryGrades[s.salaryGrade] || 0) + 1;
      });
      return Object.entries(salaryGrades).sort((a, b) => b[1] - a[1]).map(([grade, count]) => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--gray-100);font-size:12px">
          <span style="font-weight:600">${grade}</span>
          <span style="padding:4px 10px;background:var(--blue-main);color:white;border-radius:12px;font-size:11px">${count}</span>
        </div>`).join('');
    })()}
    </div>
  </div>
  
  <div class="card mb20">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-table"></i> All Staff Summary</span></div>
    <table class="tbl" style="font-size:11px">
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Department</th>
          <th>Position</th>
          <th>Salary Grade</th>
          <th>Join Date</th>
          <th>Tenure</th>
          <th>Performance</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${Object.values(STAFF_DATA).map(s => `
        <tr>
          <td style="font-weight:600">${s.name}</td>
          <td><span class="badge ${s.category === 'Teaching' ? 'b-info' : (s.category === 'Admin' ? 'b-success' : 'b-warning')}">${s.category}</span></td>
          <td>${s.department}</td>
          <td>${s.position}</td>
          <td>${s.salaryGrade}</td>
          <td>${new Date(s.joinDate).toLocaleDateString()}</td>
          <td>${Math.floor((new Date() - new Date(s.joinDate)) / (365 * 24 * 60 * 60 * 1000))} yrs</td>
          <td>
            <div style="display:flex;align-items:center;gap:4px">
              <div style="flex:1;height:6px;background:var(--gray-200);border-radius:3px"><div style="width:${parseFloat(s.performance) * 20}%;height:100%;background:var(--blue-main);border-radius:3px"></div></div>
              <span style="font-weight:600;font-size:10px;color:var(--blue-main)">${s.performance}</span>
            </div>
          </td>
          <td><span class="badge ${s.status === 'Active' ? 'b-success' : 'b-danger'}">${s.status}</span></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
  
  <div style="display:flex;gap:10px">
    <button class="btn btn-secondary" onclick="navTo('staff')"><i class="fas fa-arrow-left"></i> Back to Staff List</button>
  </div>`;

  document.getElementById('main-content').innerHTML = html;
}

function exportStaffToCSV() {
  let csv = 'Staff Directory Export\n';
  csv += 'Generated: ' + new Date().toLocaleDateString() + '\n\n';

  csv += 'ID,Name,Category,Department,Position,Email,Phone,Salary Grade,Join Date,Status,Performance\n';
  Object.values(STAFF_DATA).forEach(s => {
    csv += `"${s.id}","${s.name}","${s.category}","${s.department}","${s.position}","${s.email}","${s.phone}","${s.salaryGrade}","${s.joinDate}","${s.status}","${s.performance}"\n`;
  });

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', 'Staff_Directory_' + new Date().toISOString().slice(0, 10) + '.csv');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('<i class="fas fa-check-circle"></i> Staff directory exported to CSV', 'success', 3000);
}

function exportStaffToExcel() {
  let html = '<table border="1"><tr><th>ID</th><th>Name</th><th>Category</th><th>Department</th><th>Position</th><th>Email</th><th>Phone</th><th>Salary Grade</th><th>Join Date</th><th>Status</th><th>Performance</th></tr>';
  Object.values(STAFF_DATA).forEach(s => {
    html += '<tr><td>' + s.id + '</td><td>' + s.name + '</td><td>' + s.category + '</td><td>' + s.department + '</td><td>' + s.position + '</td><td>' + s.email + '</td><td>' + s.phone + '</td><td>' + s.salaryGrade + '</td><td>' + s.joinDate + '</td><td>' + s.status + '</td><td>' + s.performance + '</td></tr>';
  });
  html += '</table>';

  const element = document.createElement('a');
  element.setAttribute('href', 'data:application/vnd.ms-excel,' + encodeURIComponent(html));
  element.setAttribute('download', 'Staff_Directory_' + new Date().toISOString().slice(0, 10) + '.xls');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('<i class="fas fa-check-circle"></i> Staff directory exported to Excel', 'success', 3000);
}

// ALUMNI MODULE (Admin view)
function alumniModule() {
  return hdr('Alumni Module', 'Manage alumni records and engagement', 'Alumni') + `
  <div class="stats-row">
    ${statCard('<i class="fas fa-medal"></i>', '1,240', 'Total Alumni', 'Class 1985â€“2024', 'neu', 'si-blue')}
    ${statCard('<i class="fas fa-globe"></i>', '48', 'Countries', 'Alumni worldwide', 'neu', 'si-gold')}
    ${statCard('<i class="fas fa-handshake"></i>', 'GH₵42K', 'Donations', 'This year', 'up', 'si-green')}
    ${statCard('<i class="fas fa-file-alt"></i>', '14', 'Pending Requests', 'Certificates etc', 'dn', 'si-red')}
  </div>
  ${alumniDirectory()}`;
}

// ALUMNI MODULE FUNCTIONS
function toggleAddAlumniForm() {
  const form = document.getElementById('alumni-form-wrap');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function submitAlumni() {
  const name = document.getElementById('alumni-name').value;
  const year = document.getElementById('alumni-year').value;
  const profession = document.getElementById('alumni-profession').value;
  const location = document.getElementById('alumni-location').value;
  const email = document.getElementById('alumni-email').value;
  const phone = document.getElementById('alumni-phone').value;

  if (!name || !year || !profession || !location || !email || !phone) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  const id = 'ALM' + String(Object.keys(ALUMNI_DATA).length + 1).padStart(3, '0');
  ALUMNI_DATA[id] = {
    id, name, classYear: parseInt(year), profession, location, avatar: name.substring(0, 2).toUpperCase(),
    avatarColor: ['purple', 'blue', 'green', 'gold', 'teal', 'orange', 'pink'][Object.keys(ALUMNI_DATA).length % 7],
    bio: document.getElementById('alumni-bio').value || 'Alumni member',
    email, phone,
    instagram: document.getElementById('alumni-instagram').value,
    linkedin: document.getElementById('alumni-linkedin').value,
    twitter: document.getElementById('alumni-twitter').value,
    facebook: document.getElementById('alumni-facebook').value
  };

  showToast('Alumni member added successfully!', 'success');
  toggleAddAlumniForm();
  navTo('alumni');
}

function filterAlumni() {
  const search = document.getElementById('alumni-search').value.toLowerCase();
  const yearFilter = document.getElementById('alumni-year-filter').value;
  const profFilter = document.getElementById('alumni-profession-filter').value.toLowerCase();

  document.querySelectorAll('.alumni-card').forEach(card => {
    const name = card.getAttribute('data-name');
    const year = card.getAttribute('data-year');
    const prof = card.getAttribute('data-profession');

    const matchesSearch = name.includes(search);
    const matchesYear = !yearFilter || year === yearFilter;
    const matchesProf = !profFilter || prof.includes(profFilter);

    card.style.display = (matchesSearch && matchesYear && matchesProf) ? '' : 'none';
  });
}

function showAlumniProfile(alumniId) {
  const alumni = ALUMNI_DATA[alumniId];
  if (!alumni) return;

  const modalHtml = `
    <div class="modal-overlay" onclick="document.querySelector('.modal-overlay')?.remove()">
      <div class="card" style="max-width:600px;margin:auto" onclick="event.stopPropagation()">
        <div class="card-hdr" style="display:flex;justify-content:space-between;align-items:center">
          <span class="card-title"><i class="fas fa-user"></i> Alumni Profile</span>
          <button class="btn btn-icon" onclick="document.querySelector('.modal-overlay')?.remove()"><i class="fas fa-times"></i></button>
        </div>
        <div style="padding:20px">
          <div style="display:flex;gap:20px;margin-bottom:20px">
            <div class="av av-xl av-${alumni.avatarColor}">${alumni.avatar}</div>
            <div style="flex:1">
              <div style="font-size:18px;font-weight:700;margin-bottom:4px">${alumni.name}</div>
              <span class="badge b-info" style="margin-bottom:12px;display:block">Class of ${alumni.classYear}</span>
              <div style="font-size:13px;font-weight:600;color:var(--blue-main);margin-bottom:8px">${alumni.profession}</div>
              <div style="font-size:11px;color:var(--gray-500)"><i class="fas fa-map-pin"></i> ${alumni.location}</div>
            </div>
          </div>
          <div style="background:var(--blue-xpale);padding:15px;border-radius:8px;margin-bottom:20px">
            <div style="font-size:12px;font-weight:600;margin-bottom:8px">Bio</div>
            <div style="font-size:12px;color:var(--gray-700)">${alumni.bio}</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px">
            <div><div style="font-size:11px;color:var(--gray-500);margin-bottom:4px">Email</div><div style="font-size:12px;color:var(--blue-main)">${alumni.email}</div></div>
            <div><div style="font-size:11px;color:var(--gray-500);margin-bottom:4px">Phone</div><div style="font-size:12px">${alumni.phone}</div></div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-primary" style="flex:1" onclick="showConnectModal('${alumniId}');document.querySelector('.modal-overlay')?.remove()"><i class="fas fa-paper-plane"></i> Connect</button>
            <button class="btn btn-secondary" onclick="document.querySelector('.modal-overlay')?.remove()">Close</button>
          </div>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function showConnectModal(alumniId) {
  const alumni = ALUMNI_DATA[alumniId];
  if (!alumni) return;

  const modalHtml = `
    <div class="modal-overlay" onclick="document.querySelector('.modal-overlay')?.remove()">
      <div class="card" style="max-width:600px;margin:auto" onclick="event.stopPropagation()">
        <div class="card-hdr" style="display:flex;justify-content:space-between;align-items:center">
          <span class="card-title"><i class="fas fa-share-alt"></i> Connect with ${alumni.name}</span>
          <button class="btn btn-icon" onclick="document.querySelector('.modal-overlay')?.remove()"><i class="fas fa-times"></i></button>
        </div>
        <div style="padding:20px">
          <div style="margin-bottom:20px">
            <div style="font-size:12px;font-weight:600;color:var(--gray-600);margin-bottom:12px;text-transform:uppercase;letter-spacing:.5px">Social Media Handles</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              ${alumni.instagram ? `<a href="https://instagram.com/${alumni.instagram.replace('@', '')}" target="_blank" class="btn btn-secondary" style="text-align:center"><i class="fab fa-instagram"></i> ${alumni.instagram}</a>` : ''}
              ${alumni.twitter ? `<a href="https://twitter.com/${alumni.twitter.replace('@', '')}" target="_blank" class="btn btn-secondary" style="text-align:center"><i class="fab fa-twitter"></i> ${alumni.twitter}</a>` : ''}
              ${alumni.linkedin ? `<a href="https://${alumni.linkedin}" target="_blank" class="btn btn-secondary" style="text-align:center"><i class="fab fa-linkedin"></i> LinkedIn</a>` : ''}
              ${alumni.facebook ? `<a href="https://${alumni.facebook}" target="_blank" class="btn btn-secondary" style="text-align:center"><i class="fab fa-facebook"></i> Facebook</a>` : ''}
            </div>
          </div>
          
          <div style="background:var(--gray-50);padding:15px;border-radius:8px;margin-bottom:20px">
            <div style="font-size:12px;font-weight:600;color:var(--gray-600);margin-bottom:12px">Send Message to Alumni</div>
            <textarea id="alumni-message" placeholder="Type your message..." style="width:100%;min-height:100px;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;font-size:12px;resize:vertical"></textarea>
          </div>
          
          <div style="display:flex;gap:8px">
            <button class="btn btn-primary" style="flex:1" onclick="sendMessageToAlumni('${alumniId}')"><i class="fas fa-paper-plane"></i> Send Message</button>
            <button class="btn btn-secondary" onclick="document.querySelector('.modal-overlay')?.remove()">Cancel</button>
          </div>
        </div>
      </div>
    </div>`;

  const existing = document.querySelector('.modal-overlay');
  if (existing) existing.remove();
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function sendMessageToAlumni(alumniId) {
  const alumni = ALUMNI_DATA[alumniId];
  const message = document.getElementById('alumni-message').value;

  if (!message.trim()) {
    showToast('Please type a message', 'error');
    return;
  }

  showToast('Message sent to ' + alumni.name + '!', 'success');

  // Store message in messaging system (would connect to backend in real app)
  const msgId = 'MSG' + Date.now();
  const timestamp = new Date().toLocaleString();

  console.log('Message sent to:', alumni.name);
  console.log('Message:', message);
  console.log('Time:', timestamp);

  document.querySelector('.modal-overlay')?.remove();
}

// VISITOR MANAGEMENT MODULE
// BACKUP MODULE
// BACKUPS DATA
const BACKUPS_DATA = [
  { date: 'Mar 17, 2025 2:00 AM', size: '2.4 GB', type: 'Auto', status: 'Success', id: 'BK001' },
  { date: 'Mar 16, 2025 2:00 AM', size: '2.3 GB', type: 'Auto', status: 'Success', id: 'BK002' },
  { date: 'Mar 15, 2025 2:00 AM', size: '2.3 GB', type: 'Manual', status: 'Success', id: 'BK003' },
  { date: 'Mar 14, 2025 2:00 AM', size: '2.2 GB', type: 'Auto', status: 'Success', id: 'BK004' },
  { date: 'Mar 13, 2025 2:00 AM', size: '2.2 GB', type: 'Auto', status: 'Success', id: 'BK005' },
  { date: 'Mar 12, 2025 2:00 AM', size: '2.1 GB', type: 'Auto', status: 'Success', id: 'BK006' }
];

const SYSTEM_LOGS = [
  { level: 'INFO', message: 'User admin logged in', time: '2025-03-17 08:00:12', type: 'login' },
  { level: 'INFO', message: 'Student enrollment: Ama Serwaa', time: '2025-03-17 08:05:33', type: 'enrollment' },
  { level: 'WARNING', message: 'Failed login attempt', time: '2025-03-17 08:10:45', type: 'security' },
  { level: 'INFO', message: 'Fee payment recorded - GHS 5,000', time: '2025-03-17 08:30:12', type: 'payment' },
  { level: 'INFO', message: 'Notice published: School Holiday', time: '2025-03-17 09:00:00', type: 'admin' },
  { level: 'ERROR', message: 'Backup storage 80% full', time: '2025-03-17 09:15:22', type: 'system' },
  { level: 'INFO', message: 'Timetable updated for Form 3', time: '2025-03-17 10:00:00', type: 'academic' },
  { level: 'INFO', message: 'Academic Report generated', time: '2025-03-17 10:30:00', type: 'report' },
  { level: 'WARNING', message: 'Database query slow - 5.2s', time: '2025-03-17 11:00:00', type: 'performance' },
  { level: 'INFO', message: 'User Teacher logged in', time: '2025-03-17 11:15:00', type: 'login' }
];

function backupModule() {
  const latestBackup = BACKUPS_DATA[0] || { date: 'Never', size: '0 MB' };
  const backupRows = BACKUPS_DATA.map(b => `
    <tr class="backup-row" data-date="${b.date.toLowerCase()}" data-size="${b.size.toLowerCase()}">
      <td>${b.date}</td>
      <td>${b.size}</td>
      <td><span class="badge ${b.type === 'Auto' ? 'b-info' : 'b-warning'}">${b.type}</span></td>
      <td><span class="badge b-success">${b.status}</span></td>
      <td><div style="display:flex;gap:4px"><button class="btn btn-secondary btn-xs" onclick="downloadBackup('${b.id}')"><i class="fas fa-download"></i> Download</button></div></td>
    </tr>`).join('');
  const systemLogRows = SYSTEM_LOGS.map((log) => {
    const color = log.level === 'INFO' ? 'b-info' : (log.level === 'WARNING' ? 'b-warning' : 'b-danger');
    return `<div class="system-log" data-level="${log.level}" data-type="${log.type}" data-message="${log.message.toLowerCase()}" style="display:flex;gap:10px;padding:10px;border-bottom:1px solid var(--gray-100);font-size:11px;align-items:flex-start">
      <span class="badge ${color}" style="font-size:9px;height:fit-content;white-space:nowrap">${log.level}</span>
      <div style="flex:1">
        <div style="font-weight:600;color:var(--gray-700);margin-bottom:4px">${log.message}</div>
        <div style="color:var(--gray-400)">${log.time}</div>
      </div>
    </div>`;
  }).join('');

  return hdr('Backup & System Logs', 'Data backup management and activity logs', 'Backup & Logs') +
    renderPageTemplate('pages/admin/backup/index.html', {
      lastBackupDate: latestBackup.date,
      lastBackupSize: latestBackup.size,
      backupRows,
      systemLogRows
    });
}

// BACKUP FUNCTIONS
function performBackup() {
  showToast('Starting backup process...', 'info');
  const loader = setTimeout(() => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' }) + ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    BACKUPS_DATA.unshift({
      date: dateStr + ' AM',
      size: Math.random() > 0.5 ? '2.5 GB' : '2.4 GB',
      type: 'Manual',
      status: 'Success',
      id: 'BK' + String(Math.random()).slice(2, 5)
    });

    showToast('<i class="fas fa-check-circle"></i> Backup completed successfully!', 'success');
    navTo('backup');
  }, 2000);
}

function downloadLatestBackup() {
  const latest = BACKUPS_DATA[0];
  if (!latest) return;
  downloadBackup(latest.id);
}

function downloadBackup(backupId) {
  const backup = BACKUPS_DATA.find(b => b.id === backupId);
  if (!backup) return;

  showToast('Downloading backup: ' + backup.date, 'info');
  setTimeout(() => {
    const link = document.createElement('a');
    link.href = 'data:application/zip;base64,UEsDBAoAAAAAAM8EwFYAAAAAAAAAAAAAAAAJAAAAZGF0YS9QSwECLQAKAAAAAA==';
    link.download = 'backup_' + backup.id + '.zip';
    link.click();
    showToast('Backup downloaded successfully!', 'success');
  }, 1000);
}

function syncToCloud() {
  showToast('Syncing to cloud...', 'info');
  setTimeout(() => {
    showToast('? Cloud sync completed! All backups synced to cloud storage.', 'success');
  }, 2000);
}

function filterBackups() {
  const search = document.getElementById('backup-search').value.toLowerCase();
  document.querySelectorAll('.backup-row').forEach(row => {
    const date = row.getAttribute('data-date');
    const size = row.getAttribute('data-size');
    const matches = date.includes(search) || size.includes(search);
    row.style.display = matches ? '' : 'none';
  });
}

function filterLogs() {
  const search = document.getElementById('logs-search').value.toLowerCase();
  const levelFilter = document.getElementById('logs-filter').value;
  const typeFilter = document.getElementById('logs-type-filter').value;

  document.querySelectorAll('.system-log').forEach(log => {
    const level = log.getAttribute('data-level');
    const type = log.getAttribute('data-type');
    const message = log.getAttribute('data-message');

    const matchesSearch = message.includes(search);
    const matchesLevel = !levelFilter || level === levelFilter;
    const matchesType = !typeFilter || type === typeFilter;

    log.style.display = (matchesSearch && matchesLevel && matchesType) ? '' : 'none';
  });
}

function exportLogs() {
  const logs = SYSTEM_LOGS.map(l => `[${l.time}] ${l.level}: ${l.message}`).join('\n');
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(logs));
  element.setAttribute('download', 'system_logs_' + new Date().toISOString().split('T')[0] + '.txt');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('System logs exported successfully!', 'success');
}

// PROFILE MODULE
function profileModule() {
  if (currentRole === 'Alumni') {
    const alumni = getCurrentAlumniProfile();
    const nameParts = String(alumni.name || '').split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ');
    return hdr('Alumni Profile', 'Manage your alumni directory listing and preferences', 'Profile') + `
    <div class="g21">
      <div class="card">
        <div style="display:flex;gap:20px;align-items:flex-start;margin-bottom:22px;padding-bottom:18px;border-bottom:1.5px solid var(--gray-200)">
          <div class="av av-xl av-${alumni.avatar || 'teal'}" style="font-size:30px">${getInitials(alumni.name, 'AL')}</div>
          <div style="flex:1">
            <div style="font-size:20px;font-weight:800;color:var(--blue-dark)">${escapeHtml(alumni.name)}</div>
            <div style="font-size:12px;color:var(--gray-400)">${escapeHtml(alumni.profession || 'Alumni Association Member')}</div>
            <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
              <span class="badge b-info">Class of ${escapeHtml(alumni.gradYear || 'N/A')}</span>
              <span class="badge b-purple">${escapeHtml(alumni.location || 'Ghana')}</span>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="showToast('Photo upload dialog opened', 'info')"><i class="fas fa-edit"></i> Change Photo</button>
        </div>
        <div class="f-row"><div class="f-field"><label>First Name</label><input value="${escapeHtml(firstName)}"></div><div class="f-field"><label>Last Name</label><input value="${escapeHtml(lastName)}"></div></div>
        <div class="f-row"><div class="f-field"><label>Graduation Year</label><input type="number" value="${escapeHtml(alumni.gradYear || '')}"></div><div class="f-field"><label>Occupation</label><input value="${escapeHtml(alumni.profession || '')}"></div></div>
        <div class="f-row"><div class="f-field"><label>Phone</label><input value="${escapeHtml(alumni.phone || '')}"></div><div class="f-field"><label>Email</label><input value="${escapeHtml(alumni.email || '')}"></div></div>
        <div class="f-field" style="margin-bottom:16px"><label>Address / Location</label><textarea style="min-height:60px">${escapeHtml(alumni.location || '')}</textarea></div>
        <div style="display:flex;gap:8px"><button class="btn btn-primary" onclick="showToast('Profile settings saved successfully!', 'success')">Save Profile</button><button class="btn btn-secondary" onclick="navTo('dashboard')">Cancel</button></div>
      </div>
      <div>
        <div class="card mb16">
          <div class="card-hdr"><span class="card-title"><i class="fas fa-bell"></i> Preferences</span></div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px"><input type="checkbox" checked id="pref-events"> <label for="pref-events" style="font-size:13px">Receive Reunion Invites</label></div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px"><input type="checkbox" checked id="pref-newsletter"> <label for="pref-newsletter" style="font-size:13px">Monthly Newsletter</label></div>
          <div style="display:flex;align-items:center;gap:12px"><input type="checkbox" id="pref-donations"> <label for="pref-donations" style="font-size:13px">Donation Campaign Updates</label></div>
        </div>
        ${profileSecurityCard()}
      </div>
    </div>`;
  }

  // All other roles: render a shell then load real user data from the API
  const roleLabels = {
    Admin:      { icon: 'fa-shield-halved', color: 'blue',   label: 'System Administrator' },
    Teacher:    { icon: 'fa-chalkboard-user', color: 'gold', label: 'Teaching Staff' },
    Student:    { icon: 'fa-graduation-cap', color: 'green', label: 'Student' },
    Parent:     { icon: 'fa-hands-holding-child', color: 'purple', label: 'Parent / Guardian' },
    Accountant: { icon: 'fa-briefcase', color: 'teal',       label: 'Accountant' },
  };
  const meta = roleLabels[currentRole] || { icon: 'fa-user', color: 'blue', label: currentRole };
  const user = getSessionUser() || {};

  setTimeout(loadProfileFromAPI, 50);

  return hdr('My Profile', 'View and update your personal information', 'Profile') + `
  <div id="profile-content">
    <div style="display:flex;align-items:center;justify-content:center;padding:60px;color:var(--gray-400)">
      <i class="fas fa-spinner fa-spin" style="font-size:24px;margin-right:12px"></i> Loading profile...
    </div>
  </div>`;
}

// Shared security card HTML
function profileSecurityCard() {
  return `
  <div class="card mb16">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-lock"></i> Security</span></div>
    <div class="f-field" style="margin-bottom:10px"><label>Current Password</label><input type="password" id="prof-cur-pass" placeholder="Current password"></div>
    <div class="f-field" style="margin-bottom:10px"><label>New Password</label><input type="password" id="prof-new-pass" placeholder="Min. 6 characters"></div>
    <div class="f-field" style="margin-bottom:14px"><label>Confirm New Password</label><input type="password" id="prof-conf-pass" placeholder="Repeat new password"></div>
    <button class="btn btn-primary" style="width:100%" onclick="updateProfilePassword()">Update Password</button>
  </div>`;
}

function updateStoredUserPassword(sessionUser, currentPassword, newPassword) {
  if (!sessionUser) return { success: false, message: 'Session error - please log in again' };
  const users = getUsers();
  const role = normalizeRoleName(sessionUser.role || currentRole);
  const legacyAdminPassword = role === 'Admin' && currentPassword === '12345';
  const sessionKeys = [sessionUser.id, sessionUser.username, sessionUser.email, sessionUser.name].map(normalizeIdentity);
  let idx = users.findIndex(user => normalizeIdentity(user.id) && normalizeIdentity(user.id) === normalizeIdentity(sessionUser.id));
  if (idx < 0) {
    idx = users.findIndex(user =>
      normalizeRoleName(user.role) === role &&
      [user.username, user.email, user.name].map(normalizeIdentity).some(value => value && sessionKeys.includes(value))
    );
  }

  if (idx >= 0) {
    if (users[idx].password && users[idx].password !== currentPassword && !legacyAdminPassword) {
      return { success: false, message: 'Current password is incorrect' };
    }
    users[idx] = { ...users[idx], password: newPassword, passwordUpdatedAt: new Date().toISOString() };
    saveUsers(users);
    setSessionUser({ ...sessionUser, ...users[idx], password: newPassword, passwordUpdatedAt: users[idx].passwordUpdatedAt });
    return { success: true, user: users[idx] };
  }

  if (sessionUser.password && sessionUser.password !== currentPassword && !legacyAdminPassword) {
    return { success: false, message: 'Current password is incorrect' };
  }

  const createdUser = {
    ...sessionUser,
    id: sessionUser.id || 'local-' + role.toLowerCase(),
    role,
    password: newPassword,
    passwordUpdatedAt: new Date().toISOString(),
    status: sessionUser.status || 'Active',
    createdDate: sessionUser.createdDate || new Date().toISOString().slice(0, 10),
    avatar: sessionUser.avatar || getInitials(sessionUser.name, role)
  };
  users.unshift(createdUser);
  saveUsers(users);
  setSessionUser(createdUser);
  return { success: true, user: createdUser };
}

async function updateProfilePassword() {
  const cur  = document.getElementById('prof-cur-pass')?.value;
  const nw   = document.getElementById('prof-new-pass')?.value;
  const conf = document.getElementById('prof-conf-pass')?.value;
  if (!cur || !nw || !conf) { showToast('Please fill in all password fields', 'warning'); return; }
  if (nw.length < 6) { showToast('New password must be at least 6 characters', 'warning'); return; }
  if (nw !== conf) { showToast('New passwords do not match', 'error'); return; }

  const sessionUser = getSessionUser();
  const userId = sessionUser?.id;
  if (!userId) { showToast('Session error â€” please log in again', 'error'); return; }
  const localOnlySession = String(userId).startsWith('local-') || Object.prototype.hasOwnProperty.call(USERS_DATA, userId);
  if (localOnlySession || typeof API === 'undefined') {
    const result = updateStoredUserPassword(sessionUser, cur, nw);
    if (!result.success) { showToast(result.message, 'error'); return; }
    showToast('<i class="fas fa-check-circle"></i> Password updated and saved successfully!', 'success');
    ['prof-cur-pass','prof-new-pass','prof-conf-pass'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
    return;
  }

  // Re-verify current password by attempting login
  const verif = await API.login(sessionUser.username || sessionUser.email, cur);
  if (!verif || !verif.success) { showToast('Current password is incorrect', 'error'); return; }

  const res = await API.users.update(userId, { password: nw });
  if (!res || !res.success) { showToast(res?.message || 'Failed to update password', 'error'); return; }
  updateStoredUserPassword(sessionUser, cur, nw);
  showToast('<i class="fas fa-check-circle"></i> Password updated successfully!', 'success');
  ['prof-cur-pass','prof-new-pass','prof-conf-pass'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
}

function renderSessionProfile(container, sessionUser) {
  if (!container || !sessionUser) {
    if (container) container.innerHTML = '<div class="card" style="padding:24px;color:var(--danger)">Session expired. Please log in again.</div>';
    return;
  }

  const role = normalizeRoleName(sessionUser.role || currentRole);
  const roleColors = { Admin:'blue', Teacher:'gold', Student:'green', Parent:'purple', Accountant:'teal', Alumni:'purple' };
  const color = roleColors[role] || 'blue';
  let displayUser = { ...sessionUser };
  let details = '';

  if (role === 'Student') {
    const student = getCurrentStudentRecord();
    displayUser = { ...displayUser, name: student.name || displayUser.name, email: student.email || displayUser.email, phone: student.phone || displayUser.phone, address: student.address || displayUser.address, user_code: student.student_id || displayUser.user_code };
    details = `
      <div style="display:flex;justify-content:space-between"><span style="color:var(--gray-500)">Student ID</span><strong>${escapeHtml(student.student_id || displayUser.user_code || 'N/A')}</strong></div>
      <div style="display:flex;justify-content:space-between"><span style="color:var(--gray-500)">Class</span><strong>${escapeHtml(student.student_class || 'Unassigned')}</strong></div>
      <div style="display:flex;justify-content:space-between"><span style="color:var(--gray-500)">Attendance</span><strong>${escapeHtml(student.attendance || 'N/A')}</strong></div>`;
  } else if (role === 'Teacher') {
    const teacher = getCurrentTeacherProfile();
    const classes = getAssignedClassNamesForTeacher();
    displayUser = { ...displayUser, name: teacher?.name || displayUser.name, email: teacher?.email || displayUser.email, phone: teacher?.phone || displayUser.phone, user_code: teacher?.teacher_id || displayUser.user_code };
    details = `
      <div style="display:flex;justify-content:space-between"><span style="color:var(--gray-500)">Staff ID</span><strong>${escapeHtml(teacher?.teacher_id || displayUser.user_code || 'N/A')}</strong></div>
      <div style="display:flex;justify-content:space-between"><span style="color:var(--gray-500)">Subject</span><strong>${escapeHtml(teacher?.subject || 'Assigned subjects')}</strong></div>
      <div style="display:flex;justify-content:space-between"><span style="color:var(--gray-500)">Classes</span><strong>${escapeHtml(classes.join(', ') || 'No assigned classes')}</strong></div>`;
  } else if (role === 'Parent') {
    const children = getParentChildren();
    details = `
      <div style="display:flex;justify-content:space-between"><span style="color:var(--gray-500)">Linked Children</span><strong>${children.length}</strong></div>
      ${children.map(child => `<div style="display:flex;justify-content:space-between"><span style="color:var(--gray-500)">${escapeHtml(child.name)}</span><strong>${escapeHtml(child.class || 'Unassigned')}</strong></div>`).join('')}`;
  } else if (role === 'Alumni') {
    const alumni = getCurrentAlumniProfile();
    displayUser = { ...displayUser, ...alumni, user_code: alumni.alumni_id || displayUser.user_code };
    details = `
      <div style="display:flex;justify-content:space-between"><span style="color:var(--gray-500)">Alumni ID</span><strong>${escapeHtml(alumni.alumni_id || displayUser.user_code || 'N/A')}</strong></div>
      <div style="display:flex;justify-content:space-between"><span style="color:var(--gray-500)">Class Of</span><strong>${escapeHtml(alumni.gradYear || 'N/A')}</strong></div>
      <div style="display:flex;justify-content:space-between"><span style="color:var(--gray-500)">Profession</span><strong>${escapeHtml(alumni.profession || 'N/A')}</strong></div>`;
  } else {
    details = `
      <div style="display:flex;justify-content:space-between"><span style="color:var(--gray-500)">Account ID</span><strong>${escapeHtml(displayUser.user_code || displayUser.id || 'N/A')}</strong></div>
      <div style="display:flex;justify-content:space-between"><span style="color:var(--gray-500)">Access Level</span><strong>${escapeHtml(role)}</strong></div>`;
  }

  const name = displayUser.name || role;
  const username = displayUser.username || displayUser.email || '';
  container.innerHTML = `
  <div class="g21">
    <div class="card">
      <div style="display:flex;gap:20px;align-items:flex-start;margin-bottom:22px;padding-bottom:18px;border-bottom:1.5px solid var(--gray-200)">
        <div class="av av-xl av-${color}" style="font-size:26px">${getInitials(name, role)}</div>
        <div style="flex:1">
          <div style="font-size:20px;font-weight:800;color:var(--blue-dark)">${escapeHtml(name)}</div>
          <div style="font-size:12px;color:var(--gray-400);margin-top:2px">${escapeHtml(role)}${username ? ' Â· @' + escapeHtml(username) : ''}</div>
          <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap"><span class="badge b-success">${escapeHtml(displayUser.status || 'Active')}</span><span class="badge b-info">${escapeHtml(role)}</span></div>
        </div>
      </div>
      <div class="f-row">
        <div class="f-field"><label>Full Name *</label><input id="prof-name" value="${escapeHtml(name)}"></div>
        <div class="f-field"><label>Username</label><input id="prof-username" value="${escapeHtml(username)}"></div>
      </div>
      <div class="f-row">
        <div class="f-field"><label>Email Address</label><input type="email" id="prof-email" value="${escapeHtml(displayUser.email || '')}"></div>
        <div class="f-field"><label>Phone Number</label><input id="prof-phone" value="${escapeHtml(displayUser.phone || '')}"></div>
      </div>
      <div class="f-field" style="margin-bottom:16px"><label>Address</label><input id="prof-address" value="${escapeHtml(displayUser.address || displayUser.location || '')}"></div>
      <div style="display:flex;gap:8px"><button class="btn btn-primary" onclick="saveLocalProfileChanges()"><i class="fas fa-save"></i> Save Changes</button><button class="btn btn-secondary" onclick="navTo('dashboard')">Cancel</button></div>
    </div>
    <div>
      ${profileSecurityCard()}
      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-info-circle"></i> My Account Details</span></div>
        <div style="font-size:13px;display:grid;gap:10px">
          ${details}
          <div style="display:flex;justify-content:space-between"><span style="color:var(--gray-500)">Last Login</span><strong>${escapeHtml(displayUser.lastLogin || displayUser.last_login || 'Current session')}</strong></div>
        </div>
      </div>
    </div>
  </div>`;
}

function saveLocalProfileChanges() {
  const sessionUser = getSessionUser();
  if (!sessionUser) { showToast('Session error â€” please log in again', 'error'); return; }
  const updated = {
    ...sessionUser,
    name: document.getElementById('prof-name')?.value.trim() || sessionUser.name,
    username: document.getElementById('prof-username')?.value.trim() || sessionUser.username,
    email: document.getElementById('prof-email')?.value.trim() || sessionUser.email,
    phone: document.getElementById('prof-phone')?.value.trim() || sessionUser.phone,
    address: document.getElementById('prof-address')?.value.trim() || sessionUser.address
  };
  setSessionUser(updated);
  const nameEl = document.getElementById('top-av');
  if (nameEl) nameEl.textContent = getInitials(updated.name, updated.role);
  showToast('<i class="fas fa-check-circle"></i> Profile saved for this session', 'success');
}

async function loadProfileFromAPI() {
  const container = document.getElementById('profile-content');
  if (!container) return;

  const sessionUser = getSessionUser();
  const userId = sessionUser?.id;
  const localOnlySession = !userId || String(userId).startsWith('local-') || Object.prototype.hasOwnProperty.call(USERS_DATA, userId);
  if (localOnlySession || typeof API === 'undefined' || !API.users?.get) {
    renderSessionProfile(container, sessionUser);
    return;
  }

  const res = await API.users.get(userId);
  if (!res || !res.success) {
    renderSessionProfile(container, sessionUser);
    return;
  }

  const u = res.data;
  const initials = u.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
  const roleColors = { Admin:'blue', Teacher:'gold', Student:'green', Parent:'purple', Accountant:'teal' };
  const color = roleColors[u.role] || 'blue';

  // Role-specific extra fields
  let extraFields = '';
  let childrenSection = '';

  if (u.role === 'Parent') {
    // Load linked children
    const pRes = await API.parents.list({ search: '' });
    const parentRecord = pRes?.data?.find(p => p.id === u.id);
    const children = parentRecord?.children || [];

    childrenSection = `
    <div class="card" style="margin-top:20px">
      <div class="card-hdr">
        <span class="card-title"><i class="fas fa-child"></i> Linked Children</span>
      </div>
      ${children.length ? `
      <table class="tbl">
        <thead><tr><th>Student</th><th>Class</th><th>Student Code</th></tr></thead>
        <tbody>
          ${children.map(c => `
          <tr>
            <td><div style="display:flex;align-items:center;gap:8px">
              <div class="av av-sm av-blue">${c.student_name.slice(0,2).toUpperCase()}</div>
              <strong>${c.student_name}</strong>
            </div></td>
            <td>${c.class_name || 'â€”'}</td>
            <td style="color:var(--gray-500);font-size:12px">${c.student_code}</td>
          </tr>`).join('')}
        </tbody>
      </table>` : `
      <div style="padding:20px;text-align:center;color:var(--gray-400)">
        <i class="fas fa-info-circle"></i> No children linked yet. Ask the admin to link your child's record.
      </div>`}
    </div>`;

    extraFields = `
    <div class="f-row">
      <div class="f-field"><label>Phone Number</label><input id="prof-phone" value="${u.phone || ''}" placeholder="+233 XX XXX XXXX"></div>
      <div class="f-field"><label>Relationship to Student</label><select id="prof-relation"><option>Father</option><option>Mother</option><option>Guardian</option></select></div>
    </div>`;
  }

  if (u.role === 'Teacher' || u.role === 'Admin' || u.role === 'Accountant') {
    extraFields = `
    <div class="f-row">
      <div class="f-field"><label>Phone Number</label><input id="prof-phone" value="${u.phone || ''}" placeholder="+233 XX XXX XXXX"></div>
      <div class="f-field"><label>Role / Position</label><input value="${u.role}" disabled style="opacity:0.6;cursor:not-allowed"></div>
    </div>`;
  }

  if (u.role === 'Student') {
    extraFields = `
    <div class="f-row">
      <div class="f-field"><label>Phone Number</label><input id="prof-phone" value="${u.phone || ''}" placeholder="+233 XX XXX XXXX"></div>
      <div class="f-field"><label>Student Code</label><input value="${u.user_code}" disabled style="opacity:0.6;cursor:not-allowed"></div>
    </div>`;
  }

  container.innerHTML = `
  <div class="g21">
    <div>
      <div class="card">
        <div style="display:flex;gap:20px;align-items:flex-start;margin-bottom:22px;padding-bottom:18px;border-bottom:1.5px solid var(--gray-200)">
          <div class="av av-xl av-${color}" style="font-size:26px">${initials}</div>
          <div style="flex:1">
            <div style="font-size:20px;font-weight:800;color:var(--blue-dark)">${u.name}</div>
            <div style="font-size:12px;color:var(--gray-400);margin-top:2px">${u.role} Â· @${u.username}</div>
            <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
              <span class="badge b-${u.status === 'Active' ? 'success' : 'danger'}">${u.status}</span>
              <span class="badge b-info">${u.role}</span>
            </div>
          </div>
        </div>

        <div class="f-row">
          <div class="f-field"><label>Full Name *</label><input id="prof-name" value="${u.name}"></div>
          <div class="f-field"><label>Username</label><input id="prof-username" value="${u.username}"></div>
        </div>
        <div class="f-field" style="margin-bottom:14px"><label>Email Address *</label><input type="email" id="prof-email" value="${u.email}"></div>
        ${extraFields}
        <div class="f-field" style="margin-bottom:16px"><label>Address</label><input id="prof-address" value="${u.address || ''}" placeholder="Residential address"></div>

        <div style="display:flex;gap:8px">
          <button class="btn btn-primary" onclick="saveProfileChanges(${u.id})"><i class="fas fa-save"></i> Save Changes</button>
          <button class="btn btn-secondary" onclick="navTo('dashboard')">Cancel</button>
        </div>
      </div>
      ${childrenSection}
    </div>

    <div>
      ${profileSecurityCard()}
      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-info-circle"></i> Account Info</span></div>
        <div style="font-size:13px;display:grid;gap:10px">
          <div style="display:flex;justify-content:space-between"><span style="color:var(--gray-500)">Account ID</span><strong>${u.user_code}</strong></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--gray-500)">Role</span><strong>${u.role}</strong></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--gray-500)">Last Login</span><strong>${u.last_login ? new Date(u.last_login).toLocaleString() : 'First login'}</strong></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--gray-500)">Member Since</span><strong>${new Date(u.created_at).toLocaleDateString()}</strong></div>
        </div>
      </div>
    </div>
  </div>`;
}

async function saveProfileChanges(userId) {
  const data = {
    name:    document.getElementById('prof-name')?.value.trim(),
    email:   document.getElementById('prof-email')?.value.trim(),
    username:document.getElementById('prof-username')?.value.trim(),
    phone:   document.getElementById('prof-phone')?.value.trim() || null,
    address: document.getElementById('prof-address')?.value.trim() || null,
  };

  if (!data.name || !data.email) { showToast('Name and email are required', 'warning'); return; }

  const res = await API.users.update(userId, data);
  if (!res || !res.success) { showToast(res?.message || 'Failed to save changes', 'error'); return; }

  // Update session name if changed
  const sessionUser = getSessionUser();
  if (sessionUser) setSessionUser({ ...sessionUser, ...data });
  const nameEl = document.getElementById('top-av');
  if (nameEl) nameEl.textContent = getInitials(data.name, currentRole);

  showToast('<i class="fas fa-check-circle"></i> Profile updated successfully!', 'success');
}




