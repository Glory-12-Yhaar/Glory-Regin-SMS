// LEARNING MATERIALS MODULE
function learningMaterialsModule() {
  return hdr('Learning Materials', 'Upload and manage educational resources for students', 'Materials') + `
  <div class="g21">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-cloud-download-alt"></i> Uploaded Resources</span></div>
      <div class="table-wrapper">
        <table class="tbl">
          <thead><tr><th>Title</th><th>Subject</th><th>Class</th><th>Date</th><th>Type</th><th>Downloads</th><th>Actions</th></tr></thead>
          <tbody id="materials-tbody"></tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-cloud-upload-alt"></i> Upload New Material</span></div>
      <div class="f-field" style="margin-bottom:12px"><label>Material Title</label><input id="mat-title" placeholder="e.g. Past Questions..."></div>
      <div class="f-row">
        <div class="f-field"><label>Subject</label><select id="mat-subject"><option>Mathematics</option><option>English</option><option>Science</option><option>ICT</option></select></div>
        <div class="f-field"><label>Class</label><select id="mat-class"><option>Basic 5</option><option>Basic 6</option><option>JHS 1</option><option>JHS 2</option></select></div>
      </div>
      <div class="f-field" style="margin-bottom:12px;margin-top:12px"><label>Description</label><textarea id="mat-desc" placeholder="Brief description..."></textarea></div>
      <div class="f-field" style="margin-bottom:14px">
        <label>Upload File</label>
        <div id="mat-drop" style="border:2px dashed var(--gray-200);border-radius:var(--radius);padding:20px 14px;text-align:center;cursor:pointer;background:var(--gray-50);display:flex;flex-direction:column;align-items:center;gap:8px">
          <div style="font-size:28px;margin-bottom:2px;color:var(--gray-400)"><i class="fas fa-file-upload"></i></div>
          <div style="font-size:13px;font-weight:600;color:var(--blue-main)">Drop file here or click to browse</div>
          <div style="font-size:11px;color:var(--gray-400);">PDF, DOCX, PPTX, MP4 - Max 50MB</div>
          <input id="mat-file" type="file" accept=".pdf,.docx,.pptx,.mp4" style="display:none">
          <div id="mat-file-name" style="font-size:12px;color:var(--gray-600);margin-top:6px"></div>
        </div>
      </div>
      <button class="btn btn-primary" style="width:100%" onclick="uploadMaterial()"><i class="fas fa-upload"></i> Upload Material</button>
    </div>
  </div>`;
}

// SBA MODULE
let currentSbaView = 'subject';
window.toggleSbaView = function(view) {
  currentSbaView = view;
  navTo('sba');
};

function renderSbaContent() {
  const teacher = getCurrentTeacherProfile() || { name: 'Subject Teacher', subject: 'Mathematics' };
  const assignedClasses = getAssignedClassNamesForTeacher();
  const selectedClass = assignedClasses[0] || 'JHS 1';
  const subjectName = (teacher.subject || 'Mathematics').split('&')[0].trim();
  const classStudents = enrolledStudents.filter(s => (s.student_class || s.class) === selectedClass);
  const sourceStudents = classStudents.length ? classStudents : enrolledStudents.slice(0, 5);
  const sbaRows = sourceStudents.map((student, idx) => {
    const profileScore = STUDENTS_DATA[student.name]?.scores?.[subjectName] || Object.values(STUDENTS_DATA[student.name]?.scores || {})[0];
    const exercise = Math.min(20, Math.max(10, Math.round((profileScore?.classScore || 35) * 0.35)));
    const quiz = Math.min(20, Math.max(10, Math.round((profileScore?.classScore || 35) * 0.32)));
    const project = Math.min(10, Math.max(5, Math.round((profileScore?.classScore || 35) * 0.18)));
    const total = exercise + quiz + project;
    return { student, exercise, quiz, project, total, percentage: Math.round(total / 50 * 100), rank: idx + 1 };
  }).sort((a, b) => b.total - a.total).map((row, idx) => ({ ...row, rank: idx + 1 }));
  const submittedSubjects = [
    ['English', 'Mrs. Akua Asante', 'Submitted', 74],
    ['Mathematics', 'Mr. Kweku Amponsah', 'Submitted', 71],
    ['Science', 'Mr. Samuel Oduro', 'Pending', null],
    ['Computing', 'Ms. Grace Frimpong', 'Returned for Correction', 63],
    ['RME', 'Mrs. Esi Aidoo', 'Approved', 76]
  ];
  const submittedCount = submittedSubjects.filter(([, , status]) => ['Submitted', 'Approved'].includes(status)).length;
  const pendingCount = submittedSubjects.filter(([, , status]) => status === 'Pending').length;
  const approvedCount = submittedSubjects.filter(([, , status]) => status === 'Approved').length;
  const totals = sbaRows.map(r => r.total);
  const avg = totals.length ? Math.round(totals.reduce((sum, n) => sum + n, 0) / totals.length) : 0;
  const high = totals.length ? Math.max(...totals) : 0;
  const low = totals.length ? Math.min(...totals) : 0;

  if (currentSbaView === 'subject') {
    return `
      <div class="stats-row mt-3">
        ${statCard('<i class="fas fa-file-alt"></i>', '6', 'Assessments Created', 'This term', 'neu', 'si-blue')}
        ${statCard('<i class="fas fa-calculator"></i>', avg + '/50', 'Average SBA', selectedClass, 'up', 'si-green')}
        ${statCard('<i class="fas fa-trophy"></i>', high + '/50', 'Highest Score', 'Subject ranking', 'up', 'si-gold')}
        ${statCard('<i class="fas fa-paper-plane"></i>', 'Pending', 'Submission Status', 'Editable before submit', 'neu', 'si-purple')}
      </div>
      <div class="g21 mt-3">
      <div class="card">
        <div class="card-hdr" style="text-align:center;display:block">
          <div style="font-size:16px;font-weight:700">Subject Teacher SBA Workspace</div>
          <div style="font-size:14px;font-weight:600;color:var(--gray-600)">Create assessments, enter scores, calculate SBA, then submit to class teacher</div>
        </div>
        <div class="f-row" style="margin-top:16px;padding-bottom:16px;border-bottom:2px solid var(--gray-200)">
          <div class="f-field"><label>Assessment Type</label><select><option>Class Exercise</option><option>Quiz</option><option>Homework</option><option>Project</option><option>Practical Work</option><option>Class Participation</option></select></div>
          <div class="f-field"><label>Subject</label><select><option>${escapeHtml(subjectName)}</option><option>Mathematics</option><option>Science</option><option>English</option></select></div>
          <div class="f-field"><label>Class</label><select>${(assignedClasses.length ? assignedClasses : ['JHS 1', 'JHS 2']).map(c => `<option>${escapeHtml(c)}</option>`).join('')}</select></div>
          <div class="f-field"><label>Term</label><select><option>Term 1</option><option>Term 2</option><option>Term 3</option></select></div>
        </div>
        <div class="f-row" style="margin-top:16px;margin-bottom:16px">
          <div class="f-field" style="flex:2"><label>Teacher</label><input type="text" value="${escapeHtml(teacher.name)}" disabled style="padding:10px;border:none;background:transparent;border-bottom:1px dotted #000;font-weight:600;width:100%"></div>
          <div class="f-field" style="flex:1"><label>No. on Roll</label><input type="text" value="${sourceStudents.length}" disabled style="padding:10px;border:none;background:transparent;border-bottom:1px dotted #000;font-weight:600;width:100%"></div>
          <div class="f-field" style="flex:1"><label>Status</label><input type="text" value="Pending Review" disabled style="padding:10px;border:none;background:transparent;border-bottom:1px dotted #000;font-weight:600;width:100%"></div>
        </div>
        <div style="overflow-x:auto">
          <table class="tbl mt-3" style="border:2px solid #000;white-space:nowrap;font-size:12px">
            <thead>
              <tr style="border-bottom:2px solid #000">
                <th style="border-right:1px solid #000;text-align:center">NO.</th>
                <th style="border-right:1px solid #000">NAME OF STUDENT</th>
                <th style="border-right:1px solid #000;text-align:center">Exercise /20</th>
                <th style="border-right:1px solid #000;text-align:center">Quiz /20</th>
                <th style="border-right:2px solid #000;text-align:center">Project /10</th>
                <th style="border-right:2px solid #000;text-align:center">Total SBA /50</th>
                <th style="border-right:1px solid #000;text-align:center">Percentage</th>
                <th style="text-align:center">Subject Rank</th>
              </tr>
            </thead>
            <tbody>
              ${sbaRows.map((row, i) => `
              <tr style="border-bottom:1px solid #000">
                <td style="border-right:1px solid #000;text-align:center">${i + 1}</td>
                <td style="border-right:1px solid #000;font-weight:600">${escapeHtml(row.student.name)}</td>
                <td style="border-right:1px solid #000;padding:4px"><input type="number" value="${row.exercise}" style="width:58px;border:none;text-align:center;background:transparent"></td>
                <td style="border-right:1px solid #000;padding:4px"><input type="number" value="${row.quiz}" style="width:58px;border:none;text-align:center;background:transparent"></td>
                <td style="border-right:2px solid #000;padding:4px"><input type="number" value="${row.project}" style="width:58px;border:none;text-align:center;background:transparent"></td>
                <td style="border-right:2px solid #000;text-align:center;font-weight:700">${row.total}</td>
                <td style="border-right:1px solid #000;text-align:center;font-weight:700;color:var(--blue-dark)">${row.percentage}%</td>
                <td style="text-align:center">${row.rank}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div style="display:flex;gap:10px;margin-top:20px;justify-content:flex-end">
          <button class="btn btn-secondary" onclick="showToast('SBA Register saved locally', 'info')"><i class="fas fa-save"></i> Save Draft</button>
          <button class="btn btn-primary" onclick="showToast('Termly SBA Register submitted to Class Teacher!', 'success')"><i class="fas fa-paper-plane"></i> Submit SBA to Class Teacher</button>
        </div>
      </div>
      <div class="card">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-line"></i> SBA Analysis</span></div>
        ${[['Class Average', avg + '/50'], ['Highest Score', high + '/50'], ['Lowest Score', low + '/50'], ['Submission Status', 'Pending Review']].map(([label, value]) => `
          <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--gray-100);font-size:13px"><span>${label}</span><strong>${value}</strong></div>`).join('')}
        <div style="margin-top:16px">
          <div style="font-size:12px;font-weight:700;color:var(--gray-600);margin-bottom:8px">Workflow</div>
          ${['Create SBA', 'Enter Scores', 'Review Scores', 'Submit SBA'].map((step, i) => `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:12px"><span class="badge ${i < 2 ? 'b-success' : 'b-warning'}">${i + 1}</span>${step}</div>`).join('')}
        </div>
      </div>
      </div>
    `;
  } else {
    // Class Teacher View
    return `
      <div class="stats-row mt-3">
        ${statCard('<i class="fas fa-inbox"></i>', submittedCount + '/' + submittedSubjects.length, 'Subjects Received', selectedClass, 'neu', 'si-blue')}
        ${statCard('<i class="fas fa-tasks"></i>', pendingCount, 'Pending Subjects', 'Awaiting submission', 'neu', 'si-gold')}
        ${statCard('<i class="fas fa-user-check"></i>', approvedCount, 'Approved Subjects', 'Ready for reports', 'up', 'si-green')}
        ${statCard('<i class="fas fa-chart-line"></i>', avg + '/50', 'Class SBA Avg', 'Across students', 'up', 'si-purple')}
      </div>
      <div class="card mt-3">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-inbox"></i> SBA Collection Center (Class Teacher - ${escapeHtml(selectedClass)})</span></div>
        <table class="tbl">
          <thead><tr><th>Subject</th><th>Teacher</th><th>Status</th><th>Class Average</th><th>Actions</th></tr></thead>
          <tbody>
            ${submittedSubjects.map(([subject, teacherName, status, subjectAvg]) => `
            <tr><td style="font-weight:600;color:var(--blue-dark)">${subject}</td><td>${teacherName}</td><td><span class="badge ${status === 'Approved' ? 'b-success' : status === 'Pending' ? 'b-warning' : status === 'Returned for Correction' ? 'b-danger' : 'b-info'}">${status}</span></td><td>${subjectAvg ? subjectAvg + '%' : '-'}</td>
              <td><div style="display:flex;gap:4px">
                ${status === 'Pending' ? '<span style="font-size:11px;color:var(--gray-500)">Waiting</span>' : `<button class="btn btn-primary btn-xs" onclick="showToast('SBA Approved for Compilation', 'success')"><i class="fas fa-check"></i> Approve</button><button class="btn btn-danger btn-xs" onclick="showToast('Returned to subject teacher with comments', 'info')"><i class="fas fa-undo"></i> Return</button>`}
              </div></td>
            </tr>`).join('')}
          </tbody>
        </table>
        <div style="margin-top:20px;text-align:right">
          <button class="btn btn-gold" onclick="showToast('Compilation started!', 'success')"><i class="fas fa-cogs"></i> Compile Final Results</button>
        </div>
      </div>
      <div class="card mt-3">
        <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-line"></i> Student SBA Summary</span></div>
        <table class="tbl">
          <thead><tr><th>Student</th><th>Math</th><th>English</th><th>Science</th><th>Overall Average</th></tr></thead>
          <tbody>
            ${sbaRows.slice(0, 6).map(row => `<tr><td style="font-weight:600;color:var(--blue-dark)">${escapeHtml(row.student.name)}</td><td>${row.total}</td><td>${Math.max(30, row.total - 2)}</td><td>${Math.max(30, row.total - 4)}</td><td style="font-weight:700">${Math.round((row.total + Math.max(30, row.total - 2) + Math.max(30, row.total - 4)) / 3)}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}

function sbaModule() {
  return hdr('School-Based Assessment (SBA)', 'Manage, enter, and review continuous assessment scores', 'SBA Module') + `
  <div style="display:flex;gap:10px;margin-bottom:10px;padding:14px;background:var(--blue-xpale);border-radius:8px;border:1px solid var(--blue-light)">
    <button class="btn ${currentSbaView === 'subject' ? 'btn-primary' : 'btn-secondary'}" onclick="toggleSbaView('subject')"><i class="fas fa-chalkboard-teacher"></i> View as Subject Teacher</button>
    <button class="btn ${currentSbaView === 'class' ? 'btn-primary' : 'btn-secondary'}" onclick="toggleSbaView('class')"><i class="fas fa-users"></i> View as Class Teacher</button>
  </div>
  ${renderSbaContent()}
  `;
}

// Learning Materials storage and handlers
const MATERIALS_KEY = 'gr_materials';
function getMaterials(){
  try{ return JSON.parse(appMemoryStorage.getItem(MATERIALS_KEY) || '[]'); }catch(e){return []}
}
function saveMaterials(list){ appMemoryStorage.setItem(MATERIALS_KEY, JSON.stringify(list)); }

function renderMaterialsTable(){
  const tbody = document.getElementById('materials-tbody');
  if(!tbody) return;
  const list = getMaterials();
  if(list.length===0){
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--gray-600)">No materials uploaded yet.</td></tr>';
    return;
  }
  tbody.innerHTML = list.map((m, idx) => `
    <tr>
      <td style="font-weight:600;color:var(--blue-dark)">${escapeHtml(m.title)}</td>
      <td>${escapeHtml(m.subject)}</td>
      <td>${escapeHtml(m.className)}</td>
      <td>${escapeHtml(m.date)}</td>
      <td><span class="badge b-info">${escapeHtml(m.type)}</span></td>
      <td style="font-weight:700">${m.downloads||0}</td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-primary btn-xs" onclick="downloadMaterial(${idx})"><i class="fas fa-download"></i></button>
          <button class="btn btn-secondary btn-xs" onclick="editMaterial(${idx})"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger btn-xs" onclick="deleteMaterial(${idx})"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');
}

function uploadMaterial(){
  const title = (document.getElementById('mat-title')||{}).value||'';
  const subject = (document.getElementById('mat-subject')||{}).value||'';
  const className = (document.getElementById('mat-class')||{}).value||'';
  const desc = (document.getElementById('mat-desc')||{}).value||'';
  const fileInput = document.getElementById('mat-file');
  const file = fileInput && fileInput.files && fileInput.files[0];
  clearFieldErrors();
  if(!title.trim()){ showFieldError('mat-title','Title is required'); return; }
  if(!file){ showFieldError('mat-file-name','Please choose a file to upload'); return; }
  const allowed = ['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.presentationml.presentation','video/mp4'];
  if(!allowed.includes(file.type) && !['.pdf','.docx','.pptx','.mp4'].some(ext=>file.name.toLowerCase().endsWith(ext))){ showToast('Unsupported file type','error'); return; }
  const max = 50 * 1024 * 1024;
  if(file.size > max){ showToast('File exceeds 50MB limit','error'); return; }
  // Read file as DataURL (for demo only)
  const reader = new FileReader();
  reader.onload = function(e){
    const list = getMaterials();
    const now = new Date();
    const item = {
      title: title.trim(), subject, className, desc, type: file.name.split('.').pop().toUpperCase(),
      date: now.toLocaleDateString(), downloads:0, dataUrl: e.target.result, filename: file.name, size: file.size
    };
    list.unshift(item);
    saveMaterials(list);
    renderMaterialsTable();
    // clear form
    document.getElementById('mat-title').value='';
    document.getElementById('mat-desc').value='';
    document.getElementById('mat-file').value='';
    document.getElementById('mat-file-name').textContent='';
    showToast('<i class="fas fa-check-circle"></i> Material uploaded and shared with students!', 'success');
  };
  reader.readAsDataURL(file);
}

function downloadMaterial(idx){
  const list = getMaterials();
  const it = list[idx]; if(!it) return;
  // increment downloads
  it.downloads = (it.downloads||0) + 1;
  saveMaterials(list);
  renderMaterialsTable();
  const a = document.createElement('a');
  a.href = it.dataUrl;
  a.download = it.filename || ('material.' + (it.type||'bin'));
  document.body.appendChild(a); a.click(); a.remove();
}

function deleteMaterial(idx){
  if(!confirm('Delete this material?')) return;
  const list = getMaterials(); list.splice(idx,1); saveMaterials(list); renderMaterialsTable();
}

function editMaterial(idx){
  const list = getMaterials(); const it = list[idx]; if(!it) return;
  // Open modal with pre-filled values (reuse openModal)
  const content = `
    <div class="card">
      <div class="card-hdr"><span class="card-title">Edit Material</span></div>
      <div class="f-field"><label>Title</label><input id="edit-mat-title" value="${escapeHtml(it.title)}"></div>
      <div class="f-row"><div class="f-field"><label>Subject</label><input id="edit-mat-subject" value="${escapeHtml(it.subject)}"></div><div class="f-field"><label>Class</label><input id="edit-mat-class" value="${escapeHtml(it.className)}"></div></div>
      <div class="f-field"><label>Description</label><textarea id="edit-mat-desc">${escapeHtml(it.desc||'')}</textarea></div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px"><button class="btn btn-secondary" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="saveMaterialEdits(${idx})">Save</button></div>
    </div>`;
  openModal(content,true);
}

function saveMaterialEdits(idx){
  const list = getMaterials(); const it = list[idx]; if(!it) return;
  it.title = (document.getElementById('edit-mat-title')||{}).value||it.title;
  it.subject = (document.getElementById('edit-mat-subject')||{}).value||it.subject;
  it.className = (document.getElementById('edit-mat-class')||{}).value||it.className;
  it.desc = (document.getElementById('edit-mat-desc')||{}).value||it.desc;
  saveMaterials(list); renderMaterialsTable(); closeModal(); showToast('Material updated','success');
}

// wire up drag/drop and file input interactions
function initMaterialsUI(){
  const drop = document.getElementById('mat-drop');
  const fileInput = document.getElementById('mat-file');
  const fname = document.getElementById('mat-file-name');
  if(!drop || !fileInput) return;
  drop.addEventListener('click', ()=> fileInput.click());
  fileInput.addEventListener('change', ()=>{ fname.textContent = fileInput.files[0] ? fileInput.files[0].name : ''; });
  drop.addEventListener('dragover', (e)=>{ e.preventDefault(); drop.style.background='rgba(0,0,0,0.03)'; });
  drop.addEventListener('dragleave', ()=>{ drop.style.background='var(--gray-50)'; });
  drop.addEventListener('drop', (e)=>{ e.preventDefault(); drop.style.background='var(--gray-50)'; const f = e.dataTransfer.files && e.dataTransfer.files[0]; if(f){ fileInput.files = e.dataTransfer.files; fname.textContent = f.name; } });
  renderMaterialsTable();
}

// initialize materials UI when DOM ready or after navigation
window.initMaterialsUI = initMaterialsUI;

// PAYMENTS (Accountant) helpers
function getPayments(){
  return Array.isArray(window.paymentsData) ? window.paymentsData : [];
}
function savePayments(list){ window.paymentsData = Array.isArray(list) ? list : []; }

function performDeletePayment(idx){
  closeModal();
  showToast('<i class="fas fa-lock"></i> Payment deletion is disabled for database audit integrity', 'error');
}

function openDeletePaymentModal(idx) {
  const payment = getFilteredPayments()[idx];
  if (!payment) return;
  openModal(`
    <div style="padding:22px;max-width:420px">
      <h3 style="margin-top:0;color:var(--danger)"><i class="fas fa-trash"></i> Delete Payment</h3>
      <p style="font-size:13px;color:var(--gray-600);line-height:1.6">Receipt <strong>${escapeHtml(payment.receipt || 'N/A')}</strong> for <strong>${escapeHtml(payment.student || '')}</strong> is a database audit record and cannot be deleted from this screen.</p>
      <div style="display:flex;gap:8px;margin-top:16px">
        <button class="btn btn-danger" style="flex:1" onclick="performDeletePayment(${idx})">Close</button>
        <button class="btn btn-secondary" style="flex:1" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}


function getFilteredPayments(){
  const list = getPayments();
  const search = (document.getElementById('payments-search')||{}).value||'';
  const status = (document.getElementById('payments-status')||{}).value||'';
  const dateFrom = (document.getElementById('payments-date-from')||{}).value||'';
  const dateTo = (document.getElementById('payments-date-to')||{}).value||'';
  return list.filter(p=>{
    const s = (p.student||'') + ' ' + (p.receipt||'');
    const matchSearch = !search || s.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !status || (p.status||'').toLowerCase() === status.toLowerCase();
    const pDate = p.date||'';
    const matchFrom = !dateFrom || (pDate >= dateFrom);
    const matchTo = !dateTo || (pDate <= dateTo);
    return matchSearch && matchStatus && matchFrom && matchTo;
  });
}

let currentPaymentsPage = 1;
const PAYMENTS_PER_PAGE = 5;

function renderRecentPaymentsTable(){
  const tbody = document.getElementById('payments-tbody'); if(!tbody) return;
  const filtered = getFilteredPayments();
  const totalPages = Math.ceil(filtered.length / PAYMENTS_PER_PAGE);
  const startIdx = (currentPaymentsPage - 1) * PAYMENTS_PER_PAGE;
  const endIdx = startIdx + PAYMENTS_PER_PAGE;
  const pageData = filtered.slice(startIdx, endIdx);
  if(pageData.length===0){ tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--gray-600);padding:18px">No payment records found.</td></tr>'; }
  else { tbody.innerHTML = pageData.map((p, i)=>`<tr>
    <td><div style="display:flex;align-items:center;gap:8px"><div class="av av-sm av-gold">${(p.student||' ')[0]||''}</div>${escapeHtml(p.student||'')}</div></td>
    <td style="font-weight:700;color:var(--blue-dark)">${p.amount?('GHâ‚µ' + Number(p.amount).toLocaleString()):'â€”'}</td>
    <td>${p.date||'â€”'}</td>
    <td style="color:var(--blue-main)">${p.receipt||'â€”'}</td>
    <td>${p.method||'â€”'}</td>
    <td><span class="badge ${p.status==='Paid' ? 'b-success' : p.status==='Pending' ? 'b-danger' : 'b-warning'}">${p.status||'â€”'}</span></td>
    <td><div style="display:flex;gap:4px"><button class="btn btn-info btn-xs" onclick="generatePaymentReceipt(${startIdx + i})"><i class="fas fa-receipt"></i></button></div></td>
  </tr>`).join(''); }
  const infoEl = document.getElementById('payments-info');
  if(infoEl) infoEl.textContent = `Showing ${pageData.length > 0 ? startIdx + 1 : 0}â€“${Math.min(endIdx, filtered.length)} of ${filtered.length} payments`;
  const paginationEl = document.getElementById('payments-pagination');
  if(paginationEl){
    let html = '';
    if(currentPaymentsPage > 1) html += `<button class="btn btn-sm" onclick="currentPaymentsPage--;renderRecentPaymentsTable()">? Prev</button>`;
    for(let p = 1; p <= totalPages; p++){ html += `<button class="btn btn-sm ${p===currentPaymentsPage ? 'btn-primary' : 'btn-secondary'}" onclick="currentPaymentsPage=${p};renderRecentPaymentsTable()">${p}</button>`; }
    if(currentPaymentsPage < totalPages) html += `<button class="btn btn-sm" onclick="currentPaymentsPage++;renderRecentPaymentsTable()">Next ?</button>`;
    paginationEl.innerHTML = html;
  }
}

function editPayment(idx){
  if (!['Admin', 'Accountant'].includes(currentRole)) {
    showToast('<i class="fas fa-lock"></i> Only finance staff can edit payments', 'error');
    return;
  }

  const list = getFilteredPayments();
  const p = list[idx]; if(!p) return;
  const html = `
    <div style="padding:18px;min-width:420px">
      <h3 style="margin-top:0">Edit Payment</h3>
      <div class="f-field"><label>Student</label><input id="edit-pay-student" value="${escapeHtml(p.student||'')}" required></div>
      <div class="f-row">
        <div class="f-field"><label>Amount (GHâ‚µ)</label><input id="edit-pay-amount" type="number" value="${p.amount||0}" required></div>
        <div class="f-field"><label>Date</label><input id="edit-pay-date" type="date" value="${p.date||''}" required></div>
      </div>
      <div class="f-row">
        <div class="f-field"><label>Receipt</label><input id="edit-pay-receipt" value="${escapeHtml(p.receipt||'')}" required></div>
        <div class="f-field"><label>Status</label><select id="edit-pay-status"><option value="Paid" ${p.status==='Paid'?'selected':''}>Paid</option><option value="Partial" ${p.status==='Partial'?'selected':''}>Partial</option><option value="Pending" ${p.status==='Pending'?'selected':''}>Pending</option></select></div>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn btn-primary" onclick="savePaymentEdit(${idx})">Save</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `;
  openModal(html, true);
}

function savePaymentEdit(idx){
  if (!['Admin', 'Accountant'].includes(currentRole)) {
    showToast('<i class="fas fa-lock"></i> Only finance staff can edit payments', 'error');
    return;
  }

  const list = getPayments();
  const originalIdx = list.findIndex(p => p === getFilteredPayments()[idx]);
  if(originalIdx === -1) return;
  list[originalIdx].student = document.getElementById('edit-pay-student').value;
  list[originalIdx].amount = parseFloat(document.getElementById('edit-pay-amount').value) || 0;
  list[originalIdx].date = document.getElementById('edit-pay-date').value;
  list[originalIdx].receipt = document.getElementById('edit-pay-receipt').value;
  list[originalIdx].status = document.getElementById('edit-pay-status').value;
  savePayments(list);
  closeModal();
  renderRecentPaymentsTable();
  showToast('<i class="fas fa-check-circle"></i> Payment updated', 'success');
}

function deletePayment(idx){
  if (!['Admin', 'Accountant'].includes(currentRole)) {
    showToast('<i class="fas fa-lock"></i> Only finance staff can delete payments', 'error');
    return;
  }

  openDeletePaymentModal(idx);
}

function generatePaymentReceipt(idx){
  const list = getFilteredPayments();
  const p = list[idx]; if(!p) return;
  const html = `
    <div style="padding:30px;width:600px;font-family:Arial,sans-serif">
      <div style="text-align:center;margin-bottom:24px">
        <h2 style="margin:0;color:var(--blue-dark)">Glory Reign Preparatory School</h2>
        <div style="font-size:12px;color:var(--gray-600)">Official Payment Receipt</div>
      </div>
      <div style="border:2px solid var(--blue-light);border-radius:8px;padding:20px;margin-bottom:20px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
          <div><div style="font-size:11px;color:var(--gray-600);font-weight:600">RECEIPT NO.</div><div style="font-size:16px;font-weight:700;color:var(--blue-dark)">${escapeHtml(p.receipt||'N/A')}</div></div>
          <div><div style="font-size:11px;color:var(--gray-600);font-weight:600">DATE</div><div style="font-size:16px;font-weight:700;color:var(--blue-dark)">${p.date||'N/A'}</div></div>
        </div>
        <div style="border-top:1px solid var(--gray-200);padding-top:12px">
          <div style="font-size:11px;color:var(--gray-600);font-weight:600;margin-bottom:4px">STUDENT NAME</div>
          <div style="font-size:14px;font-weight:700;color:var(--gray-800)">${escapeHtml(p.student||'')}</div>
        </div>
      </div>
      <div style="background:var(--blue-xpale);border-radius:8px;padding:16px;margin-bottom:20px">
        <div style="display:flex;justify-content:space-between;margin-bottom:12px">
          <span style="font-size:12px;color:var(--gray-600)">Amount Paid:</span>
          <span style="font-size:18px;font-weight:700;color:var(--blue-dark)">GHâ‚µ ${Number(p.amount||0).toLocaleString()}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:12px">
          <span style="font-size:12px;color:var(--gray-600)">Payment Method:</span>
          <span style="font-size:12px;font-weight:600;color:var(--blue-dark)">${escapeHtml(p.method||'Cash')}</span>
        </div>
        <div style="display:flex;justify-content:space-between">
          <span style="font-size:12px;color:var(--gray-600)">Status:</span>
          <span class="badge ${p.status==='Paid' ? 'b-success' : 'b-warning'}" style="font-weight:600">${p.status||'Pending'}</span>
        </div>
      </div>
      <div style="border-top:1px solid var(--gray-200);padding-top:12px;margin-bottom:20px;text-align:center">
        <div style="font-size:10px;color:var(--gray-500)">Received by: Accountant</div>
        <div style="font-size:10px;color:var(--gray-500)">Date Processed: ${new Date().toLocaleDateString()}</div>
        <div style="font-size:10px;color:var(--gray-500);margin-top:8px">This is an automated receipt. Keep for your records.</div>
      </div>
      <div style="display:flex;gap:8px;margin-top:16px">
        <button class="btn btn-primary" style="flex:1" onclick="printPaymentReceipt()"><i class="fas fa-print"></i> Print</button>
        <button class="btn btn-secondary" style="flex:1" onclick="downloadPaymentReceiptPDF('${escapeHtml(p.receipt||'receipt')}')"><i class="fas fa-download"></i> Download PDF</button>
        <button class="btn btn-secondary" style="flex:1" onclick="closeModal()">Close</button>
      </div>
    </div>
  `;
  openModal(html, true);
  window.currentReceiptData = p;
}

function printPaymentReceipt(){
  const p = window.currentReceiptData;
  if(!p) return;
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Receipt ${p.receipt}</title><style>body{font-family:Arial;margin:20px;color:#333}h2{margin:0;color:#004;}.info{border:2px solid #bbb;padding:20px;margin:20px 0}table{width:100%;margin:20px 0}th,td{text-align:left;padding:8px;border-bottom:1px solid #ddd}.amount{font-size:24px;font-weight:bold;color:#004;text-align:right}.small{font-size:10px;color:#666}</style></head><body><div style="text-align:center;margin-bottom:20px"><h2>Glory Reign Preparatory School</h2><p class="small">Official Payment Receipt</p></div><div class="info"><table><tr><td><strong>Receipt No.:</strong> ${p.receipt}</td><td><strong>Date:</strong> ${p.date}</td></tr><tr><td colspan="2"><strong>Student:</strong> ${p.student}</td></tr></table></div><table><tr><th>Description</th><th style="text-align:right">Amount</th></tr><tr><td>Payment Received</td><td class="amount">GHâ‚µ ${Number(p.amount||0).toLocaleString()}</td></tr></table><div class="small" style="margin-top:20px"><p>Method: ${p.method||'Cash'}</p><p>Status: ${p.status}</p><p>Processed: ${new Date().toLocaleDateString()}</p><p style="margin-top:20px">Please keep this receipt for your records.</p></div></body></html>`;
  const w = window.open('', '', 'width=800,height=600');
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 250);
}

function downloadPaymentReceiptPDF(filename){
  const p = window.currentReceiptData;
  if(!p) return;
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Receipt ${p.receipt}</title><style>body{font-family:Arial;margin:20px;color:#333}h2{margin:0;color:#004}.info{border:2px solid #bbb;padding:20px;margin:20px 0}table{width:100%;margin:20px 0}th,td{text-align:left;padding:8px;border-bottom:1px solid #ddd}.amount{font-size:24px;font-weight:bold;color:#004;text-align:right}.small{font-size:10px;color:#666}</style></head><body><div style="text-align:center;margin-bottom:20px"><h2>Glory Reign Preparatory School</h2><p class="small">Official Payment Receipt</p></div><div class="info"><table><tr><td><strong>Receipt No.:</strong> ${p.receipt}</td><td><strong>Date:</strong> ${p.date}</td></tr><tr><td colspan="2"><strong>Student:</strong> ${p.student}</td></tr></table></div><table><tr><th>Description</th><th style="text-align:right">Amount</th></tr><tr><td>Payment Received</td><td class="amount">GHâ‚µ ${Number(p.amount||0).toLocaleString()}</td></tr></table><div class="small" style="margin-top:20px"><p>Method: ${p.method||'Cash'}</p><p>Status: ${p.status}</p><p>Processed: ${new Date().toLocaleDateString()}</p><p style="margin-top:20px">Please keep this receipt for your records.</p></div></body></html>`;
  const a = document.createElement('a');
  a.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
  a.download = (filename || 'receipt') + '_' + new Date().toISOString().slice(0,10) + '.pdf.html';
  document.body.appendChild(a);
  a.click();
  a.remove();
  showToast('<i class="fas fa-download"></i> Receipt downloaded', 'success');
}

function exportPaymentsCSV(){
  const filtered = getFilteredPayments();
  let csv = 'Student,Amount,Date,Receipt,Method,Status\n';
  filtered.forEach(p=>{ csv += `"${(p.student||'')}","${p.amount||''}","${p.date||''}","${p.receipt||''}","${p.method||''}","${p.status||''}"\n`; });
  const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'payments_' + new Date().toISOString().slice(0,10) + '.csv'; document.body.appendChild(a); a.click(); a.remove();
  showToast('<i class="fas fa-file-csv"></i> Payments exported', 'success');
}

// -----------------------------------
// PARENT DASHBOARD HELPERS
// -----------------------------------
const PARENT_CHILDREN_KEY = 'gr_parent_children';
const PARENT_MESSAGES_KEY = 'gr_parent_messages';
const PARENT_ASSIGNMENTS_KEY = 'gr_parent_assignments';

function userScopedKey(baseKey) {
  const user = getSessionUser();
  return baseKey + '_' + (user?.id || user?.username || user?.email || currentRole || 'local');
}

function getParentProfileForSession() {
  const user = getSessionUser();
  const identity = [user?.username, user?.email, user?.name].map(normalizeIdentity).filter(Boolean);
  return parentsData.find(parent => {
    const haystack = [parent.parent_id, parent.email, parent.name, parent.contact_person, parent.phone].map(normalizeIdentity);
    return identity.some(id => haystack.includes(id) || haystack.some(v => v.includes(id) || id.includes(v)));
  }) || null;
}

function getParentChildrenFromProfile() {
  const parent = getParentProfileForSession();
  if (!parent?.children) return [];
  return parent.children.split(',').map((entry, index) => {
    const match = entry.trim().match(/^(.+?)\s*\((.+?)\)$/);
    const name = match ? match[1].trim() : entry.trim();
    const className = match ? match[2].trim() : 'Unassigned';
    const enrolled = enrolledStudents.find(s => normalizeIdentity(s.name) === normalizeIdentity(name));
    return {
      name,
      studentId: enrolled?.student_id || 'CHILD-' + String(index + 1).padStart(3, '0'),
      class: enrolled?.student_class || className,
      attendance: parseFloat(enrolled?.attendance) || 90,
      feeStatus: enrolled?.fees_status || parent.fees_status || 'Pending',
      feeAmount: enrolled?.feeAmount || 2400,
      color: enrolled?.avatar_color || ['blue', 'purple', 'green'][index % 3]
    };
  }).filter(child => child.name);
}

function getParentChildren(){
  try{
    const key = userScopedKey(PARENT_CHILDREN_KEY);
    const raw = appMemoryStorage.getItem(key);
    if(raw) return JSON.parse(raw);
    const profileChildren = getParentChildrenFromProfile();
    const sample = profileChildren.length ? profileChildren : [
      {name:'Ama Serwaa', studentId:'2024-0042', class:'JHS 1', attendance:96, feeStatus:'Paid', feeAmount:2400, color:'blue'},
      {name:'Kweku Serwaa', studentId:'2024-0143', class:'Basic 3', attendance:91, feeStatus:'Paid', feeAmount:2200, color:'purple'}
    ];
    appMemoryStorage.setItem(key, JSON.stringify(sample));
    return sample;
  }catch(e){return []}
}

function saveParentChildren(list){ appMemoryStorage.setItem(userScopedKey(PARENT_CHILDREN_KEY), JSON.stringify(list)); }

function getParentMessages(){
  try{
    const key = userScopedKey(PARENT_MESSAGES_KEY);
    const raw = appMemoryStorage.getItem(key);
    if(raw) return JSON.parse(raw);
    const children = getParentChildren();
    const sample = [
      {from:'Mr. Amponsah', text:(children[0]?.name || 'Your child') + ' has shown great improvement in Mathematics this term. Excellent student!', time:'9:00 AM', fromParent:false},
      {from:'Parent', text:'Thank you for the update. We will keep encouraging her!', time:'9:15 AM', fromParent:true}
    ];
    appMemoryStorage.setItem(key, JSON.stringify(sample));
    return sample;
  }catch(e){return []}
}

function saveParentMessages(list){ appMemoryStorage.setItem(userScopedKey(PARENT_MESSAGES_KEY), JSON.stringify(list)); }

function sendParentMessage(){
  const input = document.getElementById('parent-msg-input');
  if(!input || !input.value.trim()) return;
  const self = getChatSelf();
  const contacts = getAvailableChatContacts();
  const recipient = contacts[0]?.name || 'Admin Office';
  const messages = getParentMessages();
  messages.push({from:self.name || 'Parent', text:input.value, time:new Date().toLocaleTimeString().slice(0,5), fromParent:true});
  saveParentMessages(messages);
  try{ addMessage({ sender: self.name, senderRole: self.role, recipient, recipientRole: getChatContactMeta(recipient).role, subject: '', text: input.value }); }catch(e){}
  input.value = '';
  renderMain();
  showToast('<i class="fas fa-paper-plane"></i> Message sent', 'success');
}

function sendTeacherChatButton() {
  const self = getChatSelf();
  const input = document.getElementById('teacher-chat-input') || document.querySelector('.chat-inp');
  const text = input?.value.trim();
  if (!text) return showToast('<i class="fas fa-times-circle"></i> Please type a message', 'error');
  const recipient = currentChat || 'Admin Office';
  sendChatMessage(self.name, recipient, text);
  if (input) input.value = '';
}

function getParentAssignments(){
  try{
    const key = userScopedKey(PARENT_ASSIGNMENTS_KEY);
    const raw = appMemoryStorage.getItem(key);
    if(raw) return JSON.parse(raw);
    const children = getParentChildren();
    const sample = children.flatMap(child => [
      {title:'Math HW', student:child.name, dueDate:'Today', completed:false},
      {title:'English Essay', student:child.name, dueDate:'Mar 20', completed:false}
    ]);
    appMemoryStorage.setItem(key, JSON.stringify(sample));
    return sample;
  }catch(e){return []}
}

function saveParentAssignments(list){ appMemoryStorage.setItem(userScopedKey(PARENT_ASSIGNMENTS_KEY), JSON.stringify(list)); }

function markAssignmentDone(idx, title){
  const list = getParentAssignments();
  if (typeof idx === 'string') {
    const found = list.find(item => item.student === idx && item.title === title);
    if (found) found.completed = true;
  } else if(list[idx]) {
    list[idx].completed = true;
  }
  saveParentAssignments(list);
  renderMain();
  showToast('<i class="fas fa-check-circle"></i> Assignment marked done', 'success');
}

function getParentFeeSummary(){
  const children = getParentChildren();
  const pending = children.filter(c=>c.feeStatus!=='Paid').length;
  const total = children.reduce((sum,c)=>sum + (c.feeAmount||0), 0);
  return {pending, total};
}

function viewStudentReport(studentId){
  const permitted = getReportCardEntriesForRole().some(([id]) => id === studentId);
  if (!permitted) return showToast('<i class="fas fa-lock"></i> Report card is not available for this account', 'error');
  const el = document.getElementById('main-content');
  if (!el) return;
  currentMod = 'dashboard';
  el.innerHTML = hdr('Student Report Card', 'Review academic report details', 'Dashboard') + `
    <div style="display:flex;justify-content:flex-end;margin-bottom:12px"><button class="btn btn-secondary" onclick="navTo('dashboard')"><i class="fas fa-arrow-left"></i> Back</button></div>
    ${generateReportCard(studentId)}`;
  window.scrollTo(0, 0);
}

function viewAttendance(studentId){
  const children = getParentChildren();
  const student = children.find(c=>c.studentId===studentId);
  if(!student) return;
  const el = document.getElementById('main-content');
  if (!el) return;
  currentMod = 'dashboard';
  el.innerHTML = hdr('Attendance Progress', `${escapeHtml(student.name)} attendance details`, 'Dashboard') + `
    <div class="card" style="max-width:760px">
      <div style="background:var(--green-xpale);padding:20px;border-radius:8px;margin-bottom:20px;text-align:center">
        <div style="font-size:48px;font-weight:800;color:var(--green-dark)">${student.attendance}%</div>
        <div style="font-size:14px;color:var(--green-dark);margin-top:6px">Current Attendance Rate</div>
      </div>
      <div style="margin-bottom:16px">
        <div style="font-size:12px;font-weight:600;margin-bottom:8px">Monthly Breakdown</div>
        ${['January', 'February', 'March'].map((m,i)=>{
          const att = [92, 94, 96][i];
          return `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--gray-100)">
            <span style="font-size:12px">${m}</span>
            <div style="display:flex;align-items:center;gap:8px">
              <div style="width:100px;height:6px;background:var(--gray-200);border-radius:3px;overflow:hidden"><div style="width:${att}%;height:100%;background:var(--green-main)"></div></div>
              <span style="font-size:12px;font-weight:600;min-width:35px">${att}%</span>
            </div>
          </div>`;
        }).join('')}
      </div>
      <button class="btn btn-secondary" style="width:100%" onclick="navTo('dashboard')"><i class="fas fa-arrow-left"></i> Back to Dashboard</button>
    </div>
  `;
  window.scrollTo(0, 0);
}

function viewPaymentHistory(studentId){
  const children = getParentChildren();
  const student = children.find(c=>c.studentId===studentId);
  if(!student) return;
  const el = document.getElementById('main-content');
  if (!el) return;
  currentMod = 'dashboard';
  el.innerHTML = hdr('Payment History', `${escapeHtml(student.name)} fee payment records`, 'Dashboard') + `
    <div class="card" style="max-width:780px">
      <div style="background:var(--blue-xpale);padding:16px;border-radius:8px;margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;margin-bottom:12px">
          <span style="font-size:12px;color:var(--gray-600)">Total Due:</span>
          <span style="font-size:18px;font-weight:700;color:var(--blue-dark)">GHâ‚µ ${Number(student.feeAmount||0).toLocaleString()}</span>
        </div>
        <div style="display:flex;justify-content:space-between">
          <span style="font-size:12px;color:var(--gray-600)">Status:</span>
          <span class="badge ${student.feeStatus==='Paid' ? 'b-success' : 'b-warning'}">${student.feeStatus}</span>
        </div>
      </div>
      <table class="tbl" style="font-size:12px">
        <thead><tr><th>Date</th><th>Amount</th><th>Receipt</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>Mar 15, 2025</td><td>GHâ‚µ 1,200</td><td>#R-2425-001</td><td><span class="badge b-success">Paid</span></td></tr>
          <tr><td>Mar 22, 2025</td><td>GHâ‚µ 1,200</td><td>#R-2425-002</td><td><span class="badge b-success">Paid</span></td></tr>
        </tbody>
      </table>
      <button class="btn btn-secondary" style="margin-top:12px;width:100%" onclick="navTo('dashboard')"><i class="fas fa-arrow-left"></i> Back to Dashboard</button>
    </div>
  `;
  window.scrollTo(0, 0);
}

function openParentMessenger(){
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
  const teacherOptions = teachersData
    .filter(t => visibleTeacherIds.has(t.teacher_id))
    .map(t => `<option value="${escapeHtml(t.name)}">${escapeHtml(t.name)} (${escapeHtml(t.subject)})</option>`)
    .join('');
  const el = document.getElementById('main-content');
  if (!el) return;
  currentMod = 'dashboard';
  el.innerHTML = hdr('Send Message to Teacher', 'Contact a teacher connected to your child', 'Dashboard') + `
    <div class="card" style="max-width:720px">
      <div class="f-field"><label>Select Teacher</label><select id="msg-teacher-select" style="padding:8px;border:1px solid var(--gray-200);border-radius:6px;width:100%">
        <option value="">Choose a teacher...</option>
        ${teacherOptions}
      </select></div>
      <div class="f-field"><label>Message</label><textarea id="msg-text-area" placeholder="Write your message here..." style="padding:8px;border:1px solid var(--gray-200);border-radius:6px;width:100%;min-height:120px;font-family:Arial"></textarea></div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn btn-primary" style="flex:1" onclick="sendParentTeacherMessage()">Send</button>
        <button class="btn btn-secondary" style="flex:1" onclick="navTo('dashboard')">Cancel</button>
      </div>
    </div>
  `;
  window.scrollTo(0, 0);
}

function sendParentTeacherMessage(){
  const teacher = document.getElementById('msg-teacher-select').value;
  const text = document.getElementById('msg-text-area').value;
  if(!teacher || !text.trim()) { showToast('<i class="fas fa-exclamation-circle"></i> Please fill in all fields', 'error'); return; }
  const messages = getParentMessages();
  messages.push({from:'Parent', text:text.trim(), time:new Date().toLocaleTimeString().slice(0,5), fromParent:true});
  saveParentMessages(messages);
  navTo('dashboard');
  showToast(`<i class="fas fa-paper-plane"></i> Message sent to ${teacher}`, 'success');
}

// -----------------------------------
// ALUMNI DASHBOARD HELPERS
// -----------------------------------
const ALUMNI_LIST_KEY = 'gr_alumni_list';
const ALUMNI_DONATIONS_KEY = 'gr_alumni_donations';
const ALUMNI_EVENTS_KEY = 'gr_alumni_events';
const ALUMNI_REGISTRATIONS_KEY = 'gr_alumni_registrations';

function getAlumniList(){
  try{
    const raw = appMemoryStorage.getItem(ALUMNI_LIST_KEY);
    if(raw) return JSON.parse(raw);
    const sample = [
      {id:'A001', name:'Samuel Amponsah', gradYear:2015, profession:'Software Engineer', location:'Accra', bio:'Working at tech startup', avatar:'blue'},
      {id:'A002', name:'Grace Mensah', gradYear:2018, profession:'Banker', location:'Kumasi', bio:'Senior Associate at GCB', avatar:'gold'},
      {id:'A003', name:'David Boateng', gradYear:2020, profession:'Doctor', location:'Takoradi', bio:'Medical resident at Korle-Bu', avatar:'green'}
    ];
    appMemoryStorage.setItem(ALUMNI_LIST_KEY, JSON.stringify(sample));
    return sample;
  }catch(e){return []}
}

function getCurrentAlumniProfile() {
  const user = getSessionUser();
  const list = getAlumniList();
  const identity = [user?.username, user?.email, user?.name].map(normalizeIdentity).filter(Boolean);
  const matched = list.find(a => {
    const haystack = [a.id, a.email, a.name].map(normalizeIdentity);
    return identity.some(id => haystack.includes(id) || haystack.some(v => v && (v.includes(id) || id.includes(v))));
  });
  if (matched) return matched;
  return {
    id: user?.id || 'A-ME',
    name: user?.name || 'Alumni Member',
    gradYear: user?.gradYear || 2015,
    profession: user?.profession || 'Alumni Association Member',
    location: user?.location || 'Ghana',
    bio: user?.bio || 'Proud Glory Reign alumnus.',
    email: user?.email || '',
    avatar: 'teal'
  };
}

function getAlumniAnnouncements(){
  const notices = (typeof getNoticesData === 'function' ? getNoticesData() : (window.noticesData || []))
    .filter(n => ['All', 'Alumni', 'Public'].includes(n.audience || 'All'));
  return notices.map(n => ({
    title: n.title || '',
    description: n.message || '',
    date: n.notice_date || n.date || '',
    color: n.priority === 'Urgent' ? 'danger' : n.priority === 'Important' ? 'gold' : 'blue'
  }));
}

function getAlumniCampaigns(){
  return [
    {id:'C001', title:'New Science Lab Equipment', goal:50000, raised:15000, percentage:30, description:'Upgrade our science lab with modern equipment'},
    {id:'C002', title:'2026 Scholarship Fund', goal:20000, raised:18500, percentage:92, description:'Help deserving students with financial aid'},
    {id:'C003', title:'Campus WiFi Upgrade', goal:30000, raised:12000, percentage:40, description:'High-speed internet for all campus buildings'}
  ];
}

function getAlumniEvents(){
  return getUpcomingEvents('Alumni').map(ev => {
    const parts = formatEventDateParts(ev.date);
    return {
      id: ev.id,
      title: ev.title,
      location: ev.location || ev.audience || 'School Campus',
      date: parts.long || ev.date,
      time: formatEventTime(ev),
      description: ev.description || ''
    };
  });
}

function getAlumniDonations(){
  try{
    const raw = appMemoryStorage.getItem(ALUMNI_DONATIONS_KEY);
    if(raw) return JSON.parse(raw);
    const sample = [
      {id:'D001', name:'Samuel Amponsah', amount:500, campaign:'Science Lab', date:'Mar 15, 2025', status:'Completed', method:'Bank Transfer'},
      {id:'D002', name:'Grace Mensah', amount:1000, campaign:'Scholarship Fund', date:'Mar 10, 2025', status:'Completed', method:'Mobile Money'},
      {id:'D003', name:'David Boateng', amount:250, campaign:'WiFi Upgrade', date:'Mar 8, 2025', status:'Completed', method:'Card'}
    ];
    appMemoryStorage.setItem(ALUMNI_DONATIONS_KEY, JSON.stringify(sample));
    return sample;
  }catch(e){return []}
}

function saveAlumniDonations(list){ appMemoryStorage.setItem(ALUMNI_DONATIONS_KEY, JSON.stringify(list)); }

function getAlumniEventRegistrations(){
  try{
    const raw = appMemoryStorage.getItem(ALUMNI_REGISTRATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){return []}
}

function saveAlumniEventRegistrations(list){ appMemoryStorage.setItem(ALUMNI_REGISTRATIONS_KEY, JSON.stringify(list)); }

function openAlumniDirectory(){
  const alumni = getAlumniList();
  const el = document.getElementById('main-content');
  if (!el) return;
  currentMod = 'dashboard';
  el.innerHTML = hdr('Alumni Directory', 'Browse and connect with alumni', 'Dashboard') + `
    <div class="card">
      <input id="alumni-search" type="text" placeholder="Search by name, profession, or year..." style="padding:10px;border:1px solid var(--gray-200);border-radius:6px;width:100%;margin-bottom:16px;font-size:12px" onkeyup="filterAlumniDirectory()">
      <div id="alumni-list" style="display:grid;gap:12px">
        ${alumni.map(a=>`<div class="alumni-card" style="padding:14px;border:1px solid var(--gray-200);border-radius:8px;display:flex;gap:12px;align-items:start">
          <div class="av av-lg av-${a.avatar}">${(a.name||' ')[0]}</div>
          <div style="flex:1">
            <div style="font-size:14px;font-weight:700;color:var(--blue-dark)">${escapeHtml(a.name)}</div>
            <div style="font-size:11px;color:var(--gray-500);margin-top:2px">${escapeHtml(a.profession)} Â· Class of ${a.gradYear}</div>
            <div style="font-size:11px;color:var(--gray-500);margin-top:2px"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(a.location)}</div>
            <div style="font-size:12px;color:var(--gray-600);margin-top:6px;font-style:italic">"${escapeHtml(a.bio)}"</div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="connectWithAlumni('${a.id}')"><i class="fas fa-user-plus"></i> Connect</button>
        </div>`).join('')}
      </div>
      <button class="btn btn-secondary" style="margin-top:16px" onclick="navTo('dashboard')"><i class="fas fa-arrow-left"></i> Back</button>
    </div>
  `;
  window.scrollTo(0, 0);
}

function filterAlumniDirectory(){
  const query = (document.getElementById('alumni-search')||{}).value.toLowerCase();
  const alumni = getAlumniList();
  const filtered = alumni.filter(a => 
    (a.name||'').toLowerCase().includes(query) ||
    (a.profession||'').toLowerCase().includes(query) ||
    (a.location||'').toLowerCase().includes(query) ||
    (a.gradYear||'').toString().includes(query)
  );
  const html = filtered.map(a=>`<div class="alumni-card" style="padding:14px;border:1px solid var(--gray-200);border-radius:8px;display:flex;gap:12px;align-items:start">
    <div class="av av-lg av-${a.avatar}">${(a.name||' ')[0]}</div>
    <div style="flex:1">
      <div style="font-size:14px;font-weight:700;color:var(--blue-dark)">${escapeHtml(a.name)}</div>
      <div style="font-size:11px;color:var(--gray-500);margin-top:2px">${escapeHtml(a.profession)} Â· Class of ${a.gradYear}</div>
      <div style="font-size:11px;color:var(--gray-500);margin-top:2px"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(a.location)}</div>
      <div style="font-size:12px;color:var(--gray-600);margin-top:6px;font-style:italic">"${escapeHtml(a.bio)}"</div>
    </div>
    <button class="btn btn-primary btn-sm" onclick="connectWithAlumni('${a.id}')"><i class="fas fa-user-plus"></i> Connect</button>
  </div>`).join('');
  document.getElementById('alumni-list').innerHTML = html || '<div style="text-align:center;color:var(--gray-400);padding:20px">No alumni found</div>';
}

function connectWithAlumni(alumniId){
  showToast('<i class="fas fa-check-circle"></i> Connection request sent', 'success');
}

function openAlumniJobs(){
  const el = document.getElementById('main-content');
  if (!el) return;
  currentMod = 'dashboard';
  el.innerHTML = hdr('Job Opportunities', 'Alumni career postings and applications', 'Dashboard') + `
    <div class="card">
      <button class="btn btn-success" style="margin-bottom:16px" onclick="postNewJob()"><i class="fas fa-briefcase"></i> Post a Job</button>
      <div style="display:grid;gap:12px">
        ${[
          {title:'Software Developer', company:'TechHub Solutions', location:'Accra', type:'Full-time', posted:'2 days ago'},
          {title:'Accountant', company:'Finance Pro', location:'Kumasi', type:'Full-time', posted:'5 days ago'},
          {title:'Nurse', company:'Korle-Bu Hospital', location:'Accra', type:'Contract', posted:'1 week ago'},
          {title:'Teacher', company:'Education Plus', location:'Takoradi', type:'Full-time', posted:'1 week ago'}
        ].map(j => `<div style="padding:14px;border:1px solid var(--gray-200);border-radius:8px">
          <div style="display:flex;justify-content:space-between;align-items:start">
            <div>
              <div style="font-size:14px;font-weight:700;color:var(--blue-dark)">${escapeHtml(j.title)}</div>
              <div style="font-size:12px;color:var(--gray-500);margin-top:4px">${escapeHtml(j.company)} Â· ${escapeHtml(j.location)}</div>
              <div style="display:flex;gap:8px;margin-top:8px">
                <span class="badge b-info">${j.type}</span>
                <span style="font-size:11px;color:var(--gray-400)">${j.posted}</span>
              </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="applyForJob('${j.title}')"><i class="fas fa-check"></i> Apply</button>
          </div>
        </div>`).join('')}
      </div>
      <button class="btn btn-secondary" style="margin-top:16px" onclick="navTo('dashboard')"><i class="fas fa-arrow-left"></i> Back</button>
    </div>
  `;
  window.scrollTo(0, 0);
}

function postNewJob(){
  const el = document.getElementById('main-content');
  if (!el) return;
  currentMod = 'dashboard';
  el.innerHTML = hdr('Post a Job Opening', 'Share an opportunity with the alumni network', 'Dashboard') + `
    <div class="card" style="max-width:760px">
      <div class="f-field"><label>Job Title</label><input id="job-title" placeholder="e.g. Software Developer"></div>
      <div class="f-field"><label>Company</label><input id="job-company" placeholder="Your company name"></div>
      <div class="f-field"><label>Location</label><input id="job-location" placeholder="City or Remote"></div>
      <div class="f-field"><label>Job Type</label><select id="job-type" style="padding:8px;border:1px solid var(--gray-200);border-radius:6px;width:100%">
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
        <option value="Contract">Contract</option>
        <option value="Internship">Internship</option>
      </select></div>
      <div class="f-field"><label>Description</label><textarea id="job-desc" placeholder="Job description..." style="padding:8px;border:1px solid var(--gray-200);border-radius:6px;width:100%;min-height:100px"></textarea></div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn btn-success" style="flex:1" onclick="submitJobPosting()">Post Job</button>
        <button class="btn btn-secondary" style="flex:1" onclick="openAlumniJobs()">Cancel</button>
      </div>
    </div>
  `;
  window.scrollTo(0, 0);
}

function submitJobPosting(){
  const title = document.getElementById('job-title').value;
  const company = document.getElementById('job-company').value;
  if(!title || !company) { showToast('<i class="fas fa-exclamation-circle"></i> Please fill in all fields', 'error'); return; }
  showToast('<i class="fas fa-briefcase"></i> Job posted successfully', 'success');
  openAlumniJobs();
}

function applyForJob(jobTitle){
  showToast(`<i class="fas fa-paper-plane"></i> Application sent for ${jobTitle}`, 'success');
}

function openDonationHub(){
  const campaigns = getAlumniCampaigns();
  const el = document.getElementById('main-content');
  if (!el) return;
  currentMod = 'dashboard';
  el.innerHTML = hdr('Donation Campaigns', 'Support active school projects', 'Dashboard') + `
    <div class="card">
      <div style="display:grid;gap:14px">
        ${campaigns.map(c => `<div style="padding:16px;border:1.5px solid var(--gray-200);border-radius:8px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <span style="font-size:14px;font-weight:700;color:var(--blue-dark)">${escapeHtml(c.title)}</span>
            <span class="badge b-success">${c.percentage}%</span>
          </div>
          <div style="font-size:12px;color:var(--gray-600);margin-bottom:10px">${escapeHtml(c.description)}</div>
          <div style="font-size:11px;color:var(--gray-500);display:flex;justify-content:space-between;margin-bottom:8px">
            <span>Raised: GHâ‚µ${Number(c.raised||0).toLocaleString()}</span>
            <span>Goal: GHâ‚µ${Number(c.goal||0).toLocaleString()}</span>
          </div>
          <div style="height:6px;background:var(--gray-200);border-radius:4px;overflow:hidden;margin-bottom:12px">
            <div style="height:100%;width:${c.percentage}%;background:linear-gradient(90deg, #10b981, #34d399)"></div>
          </div>
          <button class="btn btn-success" style="width:100%" onclick="makeDonation('${c.id}')"><i class="fas fa-heart"></i> Donate Now</button>
        </div>`).join('')}
      </div>
      <button class="btn btn-secondary" style="margin-top:16px" onclick="navTo('dashboard')"><i class="fas fa-arrow-left"></i> Back</button>
    </div>
  `;
  window.scrollTo(0, 0);
}

function makeDonation(campaignId){
  const campaign = getAlumniCampaigns().find(c => c.id === campaignId);
  if(!campaign) return;
  const el = document.getElementById('main-content');
  if (!el) return;
  currentMod = 'dashboard';
  el.innerHTML = hdr('Make Donation', `Donate to ${escapeHtml(campaign.title)}`, 'Dashboard') + `
    <div class="card" style="max-width:680px">
      <div style="background:var(--blue-xpale);padding:14px;border-radius:8px;margin-bottom:16px">
        <div style="font-size:12px;color:var(--gray-600);margin-bottom:4px">Campaign Goal</div>
        <div style="font-size:18px;font-weight:700;color:var(--blue-dark)">GHâ‚µ ${Number(campaign.goal||0).toLocaleString()}</div>
        <div style="font-size:11px;color:var(--gray-600);margin-top:6px">Already raised: GHâ‚µ ${Number(campaign.raised||0).toLocaleString()} (${campaign.percentage}%)</div>
      </div>
      <div class="f-field"><label>Your Name</label><input id="donor-name" placeholder="Full name" value="Alumni User"></div>
      <div class="f-field"><label>Donation Amount (GHâ‚µ)</label><input id="donor-amount" type="number" placeholder="Enter amount" value="250" min="10"></div>
      <div class="f-field"><label>Payment Method</label><select id="donor-method" style="padding:8px;border:1px solid var(--gray-200);border-radius:6px;width:100%">
        <option value="Card">Credit/Debit Card</option>
        <option value="Mobile Money">Mobile Money</option>
        <option value="Bank Transfer">Bank Transfer</option>
      </select></div>
      <div style="display:flex;gap:8px;margin-top:16px">
        <button class="btn btn-success" style="flex:1" onclick="processDonation('${campaignId}')"><i class="fas fa-heart"></i> Donate</button>
        <button class="btn btn-secondary" style="flex:1" onclick="openDonationHub()">Cancel</button>
      </div>
    </div>
  `;
  window.scrollTo(0, 0);
}

function processDonation(campaignId){
  const name = document.getElementById('donor-name').value;
  const amount = parseFloat(document.getElementById('donor-amount').value);
  if(!name || !amount || amount < 10) { showToast('<i class="fas fa-exclamation-circle"></i> Please enter valid donation details', 'error'); return; }
  const donations = getAlumniDonations();
  donations.push({id:'D' + Date.now(), name:name, amount:amount, campaign:getAlumniCampaigns().find(c=>c.id===campaignId)?.title||'', date:new Date().toLocaleDateString(), status:'Completed', method:document.getElementById('donor-method').value});
  saveAlumniDonations(donations);
  showToast(`<i class="fas fa-heart"></i> Thank you for your donation of GHâ‚µ${Number(amount).toLocaleString()}!`, 'success');
  openDonationHub();
}

function registerForEvent(eventId, eventTitle){
  const registrations = getAlumniEventRegistrations();
  if(registrations.find(r => r.eventId === eventId)) { showToast('Already registered for this event', 'info'); return; }
  registrations.push({id:'R' + Date.now(), eventId:eventId, title:eventTitle, date:new Date().toLocaleDateString(), status:'Registered'});
  saveAlumniEventRegistrations(registrations);
  renderMain();
  showToast(`<i class="fas fa-check-circle"></i> Registered for ${eventTitle}`, 'success');
}

function viewAllEvents(){
  const events = getAlumniEvents();
  const registrations = getAlumniEventRegistrations();
  const el = document.getElementById('main-content');
  if (!el) return;
  currentMod = 'dashboard';
  el.innerHTML = hdr('Alumni Events', 'Register for upcoming alumni activities', 'Dashboard') + `
    <div class="card">
      <div style="display:grid;gap:12px">
        ${events.map(e => `<div style="padding:14px;border:1px solid var(--gray-200);border-radius:8px">
          <div style="display:flex;justify-content:space-between;align-items:start">
            <div>
              <div style="font-size:14px;font-weight:700;color:var(--blue-dark)">${escapeHtml(e.title)}</div>
              <div style="font-size:12px;color:var(--gray-500);margin-top:4px"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(e.location)}</div>
              <div style="font-size:12px;color:var(--gray-500);margin-top:2px"><i class="fas fa-clock"></i> ${e.date} at ${e.time}</div>
              <div style="font-size:12px;color:var(--gray-600);margin-top:8px">${escapeHtml(e.description)}</div>
            </div>
            <button class="btn ${registrations.find(r=>r.eventId===e.id) ? 'btn-secondary' : 'btn-success'} btn-sm" onclick="registerForEvent('${e.id}','${escapeHtml(e.title).replace(/'/g, "\\'")}')">${registrations.find(r=>r.eventId===e.id) ? 'Registered' : 'Register'}</button>
          </div>
        </div>`).join('')}
      </div>
      <button class="btn btn-secondary" style="margin-top:16px" onclick="navTo('dashboard')"><i class="fas fa-arrow-left"></i> Back</button>
    </div>
  `;
  window.scrollTo(0, 0);
}

function viewDonationHistory(){
  const donations = getAlumniDonations();
  const el = document.getElementById('main-content');
  if (!el) return;
  currentMod = 'dashboard';
  el.innerHTML = hdr('Donation History', 'Your recent alumni giving records', 'Dashboard') + `
    <div class="card">
      <div style="display:grid;gap:10px">
        ${donations.length === 0 ? '<div style="text-align:center;color:var(--gray-400);padding:40px"><i class="fas fa-heart-broken" style="font-size:48px;margin-bottom:12px;display:block"></i> No donations yet</div>' : donations.map(d => `<div style="padding:12px;border:1px solid var(--gray-200);border-radius:8px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span style="font-size:12px;font-weight:700;color:var(--gray-800)">${escapeHtml(d.name)}</span>
            <span style="font-size:12px;font-weight:700;color:var(--green-dark)">GHâ‚µ ${Number(d.amount||0).toLocaleString()}</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--gray-500)">
            <span>${escapeHtml(d.campaign)} â€¢ ${d.date}</span>
            <span class="badge b-success">${d.status}</span>
          </div>
        </div>`).join('')}
      </div>
      <button class="btn btn-secondary" style="margin-top:16px" onclick="navTo('dashboard')"><i class="fas fa-arrow-left"></i> Back</button>
    </div>
  `;
  window.scrollTo(0, 0);
}

function showAllAnnouncements(){
  const announcements = getAlumniAnnouncements();
  const el = document.getElementById('main-content');
  if (!el) return;
  currentMod = 'dashboard';
  el.innerHTML = hdr('Alumni Announcements', 'News and updates for alumni', 'Dashboard') + `
    <div class="card">
      <div style="display:grid;gap:12px">
        ${announcements.map(a => `<div style="padding:14px;background:var(--gray-50);border-left:4px solid var(--${a.color});border-radius:6px">
          <div style="font-size:14px;font-weight:700;color:var(--gray-800)">${escapeHtml(a.title)}</div>
          <div style="font-size:12px;color:var(--gray-600);margin-top:6px">${escapeHtml(a.description)}</div>
          <div style="font-size:11px;color:var(--gray-400);margin-top:8px">${a.date}</div>
        </div>`).join('')}
      </div>
      <button class="btn btn-secondary" style="margin-top:16px" onclick="navTo('dashboard')"><i class="fas fa-arrow-left"></i> Back</button>
    </div>
  `;
  window.scrollTo(0, 0);
}


function childrenModule() {
  return hdr('My Children', 'Monitor your children\'s school activities', 'My Children') + `
  <div class="g2">
    ${[['Ama Serwaa', 'JHS 1', '2024-0042', ['96% Attendance', 'Fees: Paid', 'Rank: 3/40'], 'blue'], ['Kweku Serwaa', 'Basic 3', '2024-0143', ['91% Attendance', 'Fees: Paid', 'Rank: 8/38'], 'purple']].map(([n, c, r, stats, av]) => `
    <div class="card">
      <div style="display:flex;gap:16px;margin-bottom:18px;padding-bottom:16px;border-bottom:1.5px solid var(--gray-200)">
        <div class="av av-xl av-${av}">${n[0]}</div>
        <div>
          <div style="font-size:18px;font-weight:800;color:var(--blue-dark)">${n}</div>
          <div style="font-size:12px;color:var(--gray-400)">${c} Â· Roll: ${r}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px">
        ${stats.map(s => `<div style="padding:10px;background:var(--gray-50);border-radius:var(--radius);font-size:12px;font-weight:600;text-align:center;color:var(--blue-dark)">${s}</div>`).join('')}
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-secondary btn-sm" style="flex:1" onclick="navTo('reportcards')"><i class="fas fa-scroll"></i> Report Card</button>
        <button class="btn btn-primary btn-sm" style="flex:1" onclick="navTo('attendance')"><i class="fas fa-check-circle"></i> Attendance</button>
        <button class="btn btn-secondary btn-sm" style="flex:1" onclick="navTo('assignments')"><i class="fas fa-clipboard-list"></i> Assignments</button>
      </div>
    </div>`).join('')}
  </div>`;
}

// SALARY MODULE
function getTeacherPayrollGrade(teacher) {
  const years = Number(teacher.experience || 0);
  if (years >= 10) return 'Grade 8';
  if (years >= 7) return 'Grade 7';
  if (years >= 4) return 'Grade 6';
  return 'Grade 5';
}

function getTeacherPayrollBasic(teacher) {
  if (Number(teacher.basicSalary) > 0) return Number(teacher.basicSalary);
  if (Number(teacher.salary_grade) > 0) return Number(teacher.salary_grade);
  const grade = getTeacherPayrollGrade(teacher);
  const basicByGrade = { 'Grade 8': 3200, 'Grade 7': 3000, 'Grade 6': 2800, 'Grade 5': 2500 };
  return basicByGrade[grade] || 2500;
}

function buildPayrollRows() {
  const teacherIds = new Set();
  const teacherRows = teachersData
    .filter(t => (t.status || 'Active') !== 'Inactive')
    .map((teacher, index) => {
      teacherIds.add(String(teacher.staff_id || teacher.id || teacher.teacher_id || teacher.email || teacher.name));
      const basic = getTeacherPayrollBasic(teacher);
      const allowance = Number(teacher.allowances ?? Math.round(basic * 0.25));
      const deduction = Number(teacher.deductions ?? Math.round(basic * 0.10));
      return {
        name: teacher.name,
        role: 'Teacher',
        grade: getTeacherPayrollGrade(teacher),
        basic,
        allowance,
        deduction,
        net: basic + allowance - deduction,
        status: index < 2 ? 'Paid' : 'Pending'
      };
    });
  const supportRows = (window.staffData || [])
    .filter(staff => (staff.status || 'Active') !== 'Inactive')
    .filter(staff => !teacherIds.has(String(staff.staff_id || staff.id || staff.teacher_id || staff.email || staff.name)))
    .map(staff => {
      const basic = Number(staff.basicSalary || staff.base_salary || staff.salary_grade || 0);
      const allowance = Number(staff.allowances || 0);
      const deduction = Number(staff.deductions || 0);
      return {
        name: staff.name,
        role: staff.position || staff.role || staff.category || 'Staff',
        grade: staff.salary_grade || staff.grade || 'Staff',
        basic,
        allowance,
        deduction,
        net: Number(staff.net_salary || (basic + allowance - deduction)),
        status: staff.salary_status || staff.payroll_status || 'Pending'
      };
    });
  return [...teacherRows, ...supportRows];
}

function salaryModule() {
  const payrollRows = buildPayrollRows();
  const finance = getFinanceSummary();
  const financePeriod = [finance.term, finance.academicYear].filter(Boolean).join(' ') || 'Current Period';
  const monthlyPayroll = payrollRows.reduce((sum, row) => sum + Number(row.net || 0), 0);
  const pendingCount = payrollRows.filter(row => row.status !== 'Paid').length;
  const statsCards = [
    statCard('<i class="fas fa-briefcase"></i>', String(payrollRows.length), 'Total Staff', 'For payroll', 'neu', 'si-blue'),
    statCard('<i class="fas fa-money-bill"></i>', 'GHâ‚µ' + Number(monthlyPayroll).toLocaleString(), 'Monthly Payroll', 'Total outgoing', 'neu', 'si-gold'),
    statCard('<i class="fas fa-check-circle"></i>', String(pendingCount), 'Pending', pendingCount ? 'Needs processing' : 'All current', pendingCount ? 'dn' : 'up', pendingCount ? 'si-red' : 'si-green'),
    statCard('<i class="fas fa-calendar-alt"></i>', financePeriod, 'Payroll Period', 'From backend settings', 'neu', 'si-purple')
  ].join('');
  const payrollRowsHtml = payrollRows.map(({name: n, role: r, grade: g, basic: b, allowance: al, deduction: d, net, status: s}) => `
        <tr>
          <td><div style="display:flex;align-items:center;gap:8px"><div class="av av-sm av-blue">${n[0]}</div>${n}</div></td>
          <td>${r}</td><td><span class="badge b-gray">${g}</span></td>
          <td>GHâ‚µ${Number(b).toLocaleString()}</td>
          <td style="color:var(--success);font-weight:600">+GHâ‚µ${Number(al).toLocaleString()}</td>
          <td style="color:var(--danger);font-weight:600">-GHâ‚µ${Number(d).toLocaleString()}</td>
          <td style="font-weight:800;color:var(--blue-dark)">GHâ‚µ${Number(net).toLocaleString()}</td>
          <td><span class="badge ${s === 'Paid' ? 'b-success' : 'b-warning'}">${s}</span></td>
          <td><button class="btn btn-secondary btn-xs" onclick="openPayslipPage('${escapeAttr(n).replace(/'/g, "\\'")}', '${escapeAttr(r).replace(/'/g, "\\'")}', '${escapeAttr(g).replace(/'/g, "\\'")}', '${Number(net).toLocaleString()}')">Slip</button></td>
        </tr>`).join('');

  return hdr('Salary & Payroll', 'Staff salary management and payroll processing', 'Payroll') +
    renderPageTemplate('pages/finance/salary/index.html', { statsCards, payrollRows: payrollRowsHtml });
}

function processAllPayroll() {
  openPayrollProcessPage();
}

function openPayrollProcessPage() {
  currentMod = 'salary';
  const el = document.getElementById('main-content');
  if (!el) return;
  const payrollRows = buildPayrollRows();
  const finance = getFinanceSummary();
  const financePeriod = [finance.term, finance.academicYear].filter(Boolean).join(' ') || 'Current Period';
  const payrollTotal = payrollRows.reduce((sum, row) => sum + Number(row.net || 0), 0);
  const teachingCount = payrollRows.filter(row => String(row.role || '').toLowerCase().includes('teacher')).length;
  const adminCount = payrollRows.filter(row => String(row.role || '').toLowerCase().includes('admin') || String(row.role || '').toLowerCase().includes('account')).length;
  const supportCount = Math.max(0, payrollRows.length - teachingCount - adminCount);
  el.innerHTML = hdr('Process Payroll', 'Review and process the current month payroll batch', 'Payroll') + `
    <div class="card" style="max-width:780px">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-briefcase"></i> ${escapeHtml(financePeriod)} Payroll Batch</span></div>
      <p style="font-size:13px;color:var(--gray-600);line-height:1.7;margin-bottom:16px">This page marks all pending payroll rows as processed and creates a payroll batch record for the accountant dashboard.</p>
      <div class="g3" style="margin-bottom:18px">
        ${statCard('<i class="fas fa-users"></i>', String(payrollRows.length), 'Staff Included', 'All departments', 'neu', 'si-blue')}
        ${statCard('<i class="fas fa-money-bill"></i>', 'GHâ‚µ' + Number(payrollTotal).toLocaleString(), 'Estimated Payroll', financePeriod, 'neu', 'si-gold')}
        ${statCard('<i class="fas fa-calendar"></i>', financePeriod, 'Payroll Period', 'Scheduled', 'up', 'si-green')}
      </div>
      <div style="background:var(--gold-xlight);border:1px solid var(--gold-light);border-radius:8px;padding:14px;margin-bottom:18px">
        <div style="display:flex;justify-content:space-between;font-size:13px"><span>Teaching staff</span><strong>${teachingCount}</strong></div>
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-top:8px"><span>Admin staff</span><strong>${adminCount}</strong></div>
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-top:8px"><span>Support staff</span><strong>${supportCount}</strong></div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="confirmPayrollBatch()"><i class="fas fa-check"></i> Confirm Process</button>
        <button class="btn btn-secondary" onclick="navTo('salary')"><i class="fas fa-arrow-left"></i> Back to Payroll</button>
      </div>
    </div>`;
  window.scrollTo(0, 0);
}

function confirmPayrollBatch() {
  try {
    const key = 'gr_payroll_batches';
    const batches = JSON.parse(appMemoryStorage.getItem(key) || '[]');
    const payrollRows = buildPayrollRows();
    const finance = getFinanceSummary();
    const financePeriod = [finance.term, finance.academicYear].filter(Boolean).join(' ') || 'Current Period';
    const payrollTotal = payrollRows.reduce((sum, row) => sum + Number(row.net || 0), 0);
    batches.unshift({ id: Date.now(), month: financePeriod, staff: payrollRows.length, amount: payrollTotal, processedAt: new Date().toISOString() });
    appMemoryStorage.setItem(key, JSON.stringify(batches.slice(0, 24)));
  } catch(e) {}
  closeModal();
  showToast('<i class="fas fa-check-circle"></i> Payroll batch processed successfully', 'success');
  if (currentRole === 'Accountant' || currentRole === 'Admin') navTo('salary');
}

function generatePayslip(name, role, grade, netPay) {
  openPayslipPage(name, role, grade, netPay);
}

function openPayslipPage(name, role, grade, netPay) {
  currentMod = 'salary';
  const el = document.getElementById('main-content');
  if (!el) return;
  const finance = getFinanceSummary();
  const financePeriod = [finance.term, finance.academicYear].filter(Boolean).join(' ') || 'Current Period';
  el.innerHTML = hdr('Staff Payslip', 'Generated payroll slip for ' + financePeriod, 'Payroll') + `
    <div class="card" style="max-width:680px">
      <div style="text-align:center;margin-bottom:18px">
        <h3 style="margin:0;color:var(--blue-dark)">Glory Reign Preparatory School</h3>
        <div style="font-size:12px;color:var(--gray-500)">Staff Payslip Â· ${escapeHtml(financePeriod)}</div>
      </div>
      <div style="border:1.5px solid var(--gray-200);border-radius:8px;padding:16px;margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span>Staff</span><strong>${escapeHtml(name)}</strong></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span>Role</span><strong>${escapeHtml(role)}</strong></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span>Grade</span><strong>${escapeHtml(grade)}</strong></div>
        <div style="display:flex;justify-content:space-between;font-size:18px;color:var(--blue-dark)"><span>Net Pay</span><strong>GHâ‚µ${escapeHtml(netPay)}</strong></div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="printDocument()"><i class="fas fa-print"></i> Print</button>
        <button class="btn btn-secondary" style="flex:1" onclick="navTo('salary')"><i class="fas fa-arrow-left"></i> Back to Payroll</button>
      </div>
    </div>`;
  window.scrollTo(0, 0);
}

// FEE STRUCTURE DATA
const FEE_STRUCTURE_DATA = {
  items: [
    { id: 1, name: 'Tuition Fee', basic4: 1200, basic5: 1250, basic6: 1300, jhs1: 1400, jhs2: 1450, jhs3: 1500, frequency: 'Per Term', mandatory: true },
    { id: 2, name: 'Examination Fee', basic4: 200, basic5: 200, basic6: 200, jhs1: 200, jhs2: 200, jhs3: 200, frequency: 'Per Term', mandatory: true },
    { id: 3, name: 'Sports Levy', basic4: 80, basic5: 80, basic6: 80, jhs1: 80, jhs2: 80, jhs3: 80, frequency: 'Per Term', mandatory: true },
    { id: 4, name: 'Laboratory Fee', basic4: 100, basic5: 100, basic6: 120, jhs1: 120, jhs2: 120, jhs3: 120, frequency: 'Per Term', mandatory: false },
    { id: 5, name: 'Textbook/Stationery', basic4: 280, basic5: 300, basic6: 320, jhs1: 350, jhs2: 350, jhs3: 400, frequency: 'Annually', mandatory: true },
    { id: 6, name: 'ICT Fee', basic4: 80, basic5: 80, basic6: 80, jhs1: 80, jhs2: 80, jhs3: 80, frequency: 'Per Term', mandatory: false },
    { id: 7, name: 'NHIS / Insurance', basic4: 50, basic5: 50, basic6: 50, jhs1: 50, jhs2: 50, jhs3: 50, frequency: 'Annually', mandatory: false },
    { id: 8, name: 'PTA Levy', basic4: 80, basic5: 80, basic6: 80, jhs1: 80, jhs2: 80, jhs3: 80, frequency: 'Annually', mandatory: true },
    { id: 9, name: 'WASSCE Registration', basic4: 0, basic5: 0, basic6: 0, jhs1: 0, jhs2: 0, jhs3: 220, frequency: 'Once', mandatory: false }
  ]
};

// FEE STRUCTURE MODULE
function feeStructModule() {
  const isAdmin = currentRole === 'Admin';
  const addItemBtn = isAdmin ? `<button class="btn btn-primary btn-sm" onclick="openAddFeeItemForm()">+ Add Item</button>` : '';

  let html = hdr('Fee Structure', 'Configure and manage school fee schedules', 'Fee Structure') + `
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-building"></i> Fee Schedule â€” Academic Year 2024/2025</span>
      <div style="display:flex;gap:8px">
        ${addItemBtn}
        <button class="btn btn-secondary btn-sm" onclick="exportFeeStructure()"><i class="fas fa-download"></i> Export</button>
      </div>
    </div>
    <div style="overflow-x:auto">
      <table class="tbl">
        <thead><tr><th>Fee Item</th><th>Basic 4 (GHâ‚µ)</th><th>Basic 5 (GHâ‚µ)</th><th>Basic 6 (GHâ‚µ)</th><th>JHS 1 (GHâ‚µ)</th><th>JHS 2 (GHâ‚µ)</th><th>JHS 3 (GHâ‚µ)</th><th>Frequency</th><th>Mandatory</th><th>Actions</th></tr></thead>
        <tbody id="fee-items-table">`;

  FEE_STRUCTURE_DATA.items.forEach(item => {
    html += `
      <tr class="fee-item-row" data-id="${item.id}">
        <td style="font-weight:600">${item.name}</td>
        <td>${item.basic4 > 0 ? item.basic4.toLocaleString() : 'â€”'}</td>
        <td>${item.basic5 > 0 ? item.basic5.toLocaleString() : 'â€”'}</td>
        <td>${item.basic6 > 0 ? item.basic6.toLocaleString() : 'â€”'}</td>
        <td>${item.jhs1 > 0 ? item.jhs1.toLocaleString() : 'â€”'}</td>
        <td>${item.jhs2 > 0 ? item.jhs2.toLocaleString() : 'â€”'}</td>
        <td>${item.jhs3 > 0 ? item.jhs3.toLocaleString() : 'â€”'}</td>
        <td><span class="badge b-info">${item.frequency}</span></td>
        <td><span class="badge ${item.mandatory ? 'b-success' : 'b-gray'}">${item.mandatory ? 'Yes' : 'No'}</span></td>
        <td><div style="display:flex;gap:4px">
          ${isAdmin ? `<button class="btn btn-secondary btn-xs" onclick="editFeeItem(${item.id})">Edit</button>
          <button class="btn btn-danger btn-xs" onclick="deleteFeeItem(${item.id})">Del</button>` : '<span style="font-size:10px;color:var(--gray-500)">View only</span>'}
        </div></td>
      </tr>`;
  });

  // Calculate totals for per-term items
  const termItems = FEE_STRUCTURE_DATA.items.filter(i => i.frequency === 'Per Term');
  const totalBasic4 = termItems.reduce((sum, item) => sum + item.basic4, 0);
  const totalBasic5 = termItems.reduce((sum, item) => sum + item.basic5, 0);
  const totalBasic6 = termItems.reduce((sum, item) => sum + item.basic6, 0);
  const totalJHS1 = termItems.reduce((sum, item) => sum + item.jhs1, 0);
  const totalJHS2 = termItems.reduce((sum, item) => sum + item.jhs2, 0);
  const totalJHS3 = termItems.reduce((sum, item) => sum + item.jhs3, 0);

  html += `
        <tr style="background:var(--blue-xpale)">
          <td style="font-weight:800">Total (Per Term)</td>
          <td style="font-weight:800;color:var(--blue-dark)">GHâ‚µ${totalBasic4.toLocaleString()}</td>
          <td style="font-weight:800;color:var(--blue-dark)">GHâ‚µ${totalBasic5.toLocaleString()}</td>
          <td style="font-weight:800;color:var(--blue-dark)">GHâ‚µ${totalBasic6.toLocaleString()}</td>
          <td style="font-weight:800;color:var(--blue-dark)">GHâ‚µ${totalJHS1.toLocaleString()}</td>
          <td style="font-weight:800;color:var(--blue-dark)">GHâ‚µ${totalJHS2.toLocaleString()}</td>
          <td style="font-weight:800;color:var(--blue-dark)">GHâ‚µ${totalJHS3.toLocaleString()}</td>
          <td colspan="3"></td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>`;

  // Add form for admins only
  if (isAdmin) {
    html += `
    <div class="card" style="margin-top:20px">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-plus"></i> Add New Fee Item</span></div>
      <form onsubmit="addNewFeeItem(event)">
        <div class="f-field" style="margin-bottom:12px">
          <label>Fee Item Name</label>
          <input type="text" id="fee-item-name" placeholder="e.g., Library Fee" required>
        </div>
        <div class="f-row">
          <div class="f-field"><label>Basic 4 (GHâ‚µ)</label><input type="number" id="fee-basic4" value="0" min="0"></div>
          <div class="f-field"><label>Basic 5 (GHâ‚µ)</label><input type="number" id="fee-basic5" value="0" min="0"></div>
          <div class="f-field"><label>Basic 6 (GHâ‚µ)</label><input type="number" id="fee-basic6" value="0" min="0"></div>
        </div>
        <div class="f-row">
          <div class="f-field"><label>JHS 1 (GHâ‚µ)</label><input type="number" id="fee-jhs1" value="0" min="0"></div>
          <div class="f-field"><label>JHS 2 (GHâ‚µ)</label><input type="number" id="fee-jhs2" value="0" min="0"></div>
          <div class="f-field"><label>JHS 3 (GHâ‚µ)</label><input type="number" id="fee-jhs3" value="0" min="0"></div>
        </div>
        <div class="f-row">
          <div class="f-field">
            <label>Frequency</label>
            <select id="fee-frequency" required>
              <option>Per Term</option>
              <option>Annually</option>
              <option>Once</option>
            </select>
          </div>
          <div class="f-field">
            <label>Mandatory</label>
            <select id="fee-mandatory" required>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>
        <div style="display:flex;gap:8px">
          <button type="submit" class="btn btn-primary">Add Fee Item</button>
          <button type="button" class="btn btn-secondary" onclick="resetFeeForm()">Clear</button>
        </div>
      </form>
    </div>`;
  }

  return html;
}

function openAddFeeItemForm() {
  const form = document.querySelector('form[onsubmit="addNewFeeItem(event)"]');
  if (form) {
    form.scrollIntoView({ behavior: 'smooth' });
  } else {
    showToast('<i class="fas fa-times-circle"></i> Form not available', 'error');
  }
}

function addNewFeeItem(event) {
  event.preventDefault();

  const name = document.getElementById('fee-item-name').value;
  const basic4 = parseInt(document.getElementById('fee-basic4').value) || 0;
  const basic5 = parseInt(document.getElementById('fee-basic5').value) || 0;
  const basic6 = parseInt(document.getElementById('fee-basic6').value) || 0;
  const jhs1 = parseInt(document.getElementById('fee-jhs1').value) || 0;
  const jhs2 = parseInt(document.getElementById('fee-jhs2').value) || 0;
  const jhs3 = parseInt(document.getElementById('fee-jhs3').value) || 0;
  const frequency = document.getElementById('fee-frequency').value;
  const mandatory = document.getElementById('fee-mandatory').value === 'true';

  if (!name) {
    showToast('<i class="fas fa-times-circle"></i> Please enter fee item name', 'error');
    return;
  }

  const newId = Math.max(...FEE_STRUCTURE_DATA.items.map(i => i.id)) + 1;

  FEE_STRUCTURE_DATA.items.push({
    id: newId,
    name,
    basic4,
    basic5,
    basic6,
    jhs1,
    jhs2,
    jhs3,
    frequency,
    mandatory
  });

  showToast(`<i class="fas fa-check-circle"></i> Fee item "${name}" added successfully!`, 'success');

  // Clear form
  event.target.reset();

  // Refresh page
  setTimeout(() => {
    renderMain();
  }, 1500);
}

function resetFeeForm() {
  document.querySelector('form[onsubmit="addNewFeeItem(event)"]').reset();
  showToast('<i class="fas fa-sync"></i> Form cleared', 'info');
}

function editFeeItem(itemId) {
  const item = FEE_STRUCTURE_DATA.items.find(i => i.id === itemId);
  if (!item) {
    showToast('<i class="fas fa-times-circle"></i> Item not found', 'error');
    return;
  }

  const formHTML = `
    <div style="max-width:850px;background:white;border-radius:12px;overflow:hidden">
      <div style="padding:20px;background:var(--blue-main);color:white">
        <h2 style="margin:0">Edit Fee Item</h2>
        <p style="margin:8px 0 0 0;font-size:13px;opacity:0.9">${item.name}</p>
      </div>
      
      <form onsubmit="saveEditedFeeItem(event, ${itemId})" style="padding:20px">
        <div class="f-field" style="margin-bottom:12px">
          <label>Fee Item Name</label>
          <input type="text" id="edit-fee-name" value="${item.name}" required>
        </div>
        
        <div style="margin-bottom:16px">
          <h4 style="margin:0 0 12px 0;color:var(--gray-800);font-size:13px;font-weight:700">Amounts by Class</h4>
          <div class="f-row">
            <div class="f-field"><label>Basic 4</label><input type="number" id="edit-basic4" value="${item.basic4}" min="0"></div>
            <div class="f-field"><label>Basic 5</label><input type="number" id="edit-basic5" value="${item.basic5}" min="0"></div>
            <div class="f-field"><label>Basic 6</label><input type="number" id="edit-basic6" value="${item.basic6}" min="0"></div>
          </div>
          <div class="f-row">
            <div class="f-field"><label>JHS 1</label><input type="number" id="edit-jhs1" value="${item.jhs1}" min="0"></div>
            <div class="f-field"><label>JHS 2</label><input type="number" id="edit-jhs2" value="${item.jhs2}" min="0"></div>
            <div class="f-field"><label>JHS 3</label><input type="number" id="edit-jhs3" value="${item.jhs3}" min="0"></div>
          </div>
        </div>
        
        <div class="f-row">
          <div class="f-field">
            <label>Frequency</label>
            <select id="edit-frequency">
              <option ${item.frequency === 'Per Term' ? 'selected' : ''}>Per Term</option>
              <option ${item.frequency === 'Annually' ? 'selected' : ''}>Annually</option>
              <option ${item.frequency === 'Once' ? 'selected' : ''}>Once</option>
            </select>
          </div>
          <div class="f-field">
            <label>Mandatory</label>
            <select id="edit-mandatory">
              <option value="true" ${item.mandatory ? 'selected' : ''}>Yes</option>
              <option value="false" ${!item.mandatory ? 'selected' : ''}>No</option>
            </select>
          </div>
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

function saveEditedFeeItem(event, itemId) {
  event.preventDefault();

  const item = FEE_STRUCTURE_DATA.items.find(i => i.id === itemId);
  if (!item) return;

  item.name = document.getElementById('edit-fee-name').value;
  item.basic4 = parseInt(document.getElementById('edit-basic4').value) || 0;
  item.basic5 = parseInt(document.getElementById('edit-basic5').value) || 0;
  item.basic6 = parseInt(document.getElementById('edit-basic6').value) || 0;
  item.jhs1 = parseInt(document.getElementById('edit-jhs1').value) || 0;
  item.jhs2 = parseInt(document.getElementById('edit-jhs2').value) || 0;
  item.jhs3 = parseInt(document.getElementById('edit-jhs3').value) || 0;
  item.frequency = document.getElementById('edit-frequency').value;
  item.mandatory = document.getElementById('edit-mandatory').value === 'true';

  closeModal();
  showToast('<i class="fas fa-check-circle"></i> Fee item updated successfully!', 'success');

  setTimeout(() => {
    renderMain();
  }, 1500);
}

function deleteFeeItem(itemId) {
  const item = FEE_STRUCTURE_DATA.items.find(i => i.id === itemId);
  if (!item) {
    showToast('<i class="fas fa-times-circle"></i> Item not found', 'error');
    return;
  }

  if (confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
    FEE_STRUCTURE_DATA.items = FEE_STRUCTURE_DATA.items.filter(i => i.id !== itemId);
    showToast('<i class="fas fa-check-circle"></i> Fee item deleted successfully!', 'success');

    setTimeout(() => {
      renderMain();
    }, 1500);
  }
}

function exportFeeStructure() {
  let csv = 'Fee Item,Basic 4 (GHâ‚µ),Basic 5 (GHâ‚µ),Basic 6 (GHâ‚µ),JHS 1 (GHâ‚µ),JHS 2 (GHâ‚µ),JHS 3 (GHâ‚µ),Frequency,Mandatory\n';

  FEE_STRUCTURE_DATA.items.forEach(item => {
    csv += `"${item.name}",${item.basic4},${item.basic5},${item.basic6},${item.jhs1},${item.jhs2},${item.jhs3},"${item.frequency}","${item.mandatory ? 'Yes' : 'No'}"\n`;
  });

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', 'fee-structure-' + new Date().toISOString().slice(0, 10) + '.csv');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

  showToast('<i class="fas fa-check-circle"></i> Fee structure exported as CSV', 'success');
}

// EVENTS & CALENDAR DATA
const EVENTS_DATA = window.eventsData || [];

function getEventsData() {
  return Array.isArray(window.eventsData) ? window.eventsData : EVENTS_DATA;
}

function getUpcomingEvents(audience = '', options = {}) {
  const today = new Date().toISOString().slice(0, 10);
  const scope = String(audience || '').toLowerCase();
  return getEventsData()
    .filter(ev => ev.date >= today)
    .filter(ev => options.includeUnpublished || (ev.status || 'Published') === 'Published')
    .filter(ev => {
      const target = String(ev.audience || 'All').toLowerCase();
      return !scope || target === 'all' || target.includes(scope) || scope.includes(target);
    })
    .sort((a, b) => String(a.date).localeCompare(String(b.date)) || String(a.time || '').localeCompare(String(b.time || '')));
}

function formatEventDateParts(dateValue) {
  const date = new Date(dateValue + 'T00:00:00');
  if (Number.isNaN(date.getTime())) return { month: '--', day: '--', long: '' };
  return {
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    day: date.toLocaleDateString('en-US', { day: '2-digit' }),
    long: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  };
}

function formatEventTime(ev) {
  if (ev.allDay || ev.all_day) return 'All Day';
  if (!ev.time) return 'Time not set';
  return new Date(`${ev.date}T${ev.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

// EVENTS MODULE
function eventsModule() {
  const isTeacherOrAdmin = ['Teacher', 'Admin'].includes(currentRole);
  const addEventBtn = isTeacherOrAdmin ? `<button class="btn btn-primary btn-sm" onclick="openAddEventForm()">+ Add Event</button>` : '';

  const sortedEvents = getUpcomingEvents('', { includeUnpublished: isTeacherOrAdmin });

  let html = hdr('Events & Calendar', 'School events, holidays and important dates', 'Events & Calendar') + `
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-calendar-alt"></i> Upcoming Events</span>
      <div style="display:flex;gap:8px">
        ${addEventBtn}
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr;gap:12px" id="upcoming-events">`;

  if (!sortedEvents.length) {
    html += '<div style="text-align:center;color:var(--gray-400);padding:24px">No upcoming events found.</div>';
  }

  sortedEvents.forEach(event => {
    const formattedDate = formatEventDateParts(event.date).long || event.date;
    const timeStr = formatEventTime(event);

    html += `
      <div style="border:1px solid var(--border);border-radius:12px;padding:16px;background:rgba(26,86,219,0.03)" onclick="viewEvent(${event.id})">
        <div style="display:flex;justify-content:space-between;align-items:start">
          <div>
            <h3 style="margin:0 0 8px 0;font-size:16px;font-weight:600">${escapeHtml(event.title)}</h3>
            <p style="margin:0 0 6px 0;font-size:14px;color:var(--gray-600)"><strong>${timeStr}</strong></p>
            <p style="margin:0 0 8px 0;font-size:13px;color:var(--gray-600)"><i class="fas fa-map-pin"></i> ${escapeHtml(formattedDate)} Â· ${escapeHtml(event.location || event.audience || 'School Campus')}</p>
            ${isTeacherOrAdmin ? `<p style="margin:0 0 8px 0;font-size:12px;color:var(--gray-500)">Audience: ${escapeHtml(event.audience || 'All')} Â· Status: ${escapeHtml(event.status || 'Published')}</p>` : ''}
            <p style="margin:0;font-size:13px;color:var(--gray-700)">${escapeHtml(event.description || '')}</p>
          </div>
          ${isTeacherOrAdmin ? `<div style="display:flex;gap:4px;min-width:fit-content">
            <button class="btn btn-secondary btn-xs" onclick="event.stopPropagation();editEvent(${event.id})">Edit</button>
            <button class="btn btn-danger btn-xs" onclick="event.stopPropagation();deleteEvent(${event.id})">Del</button>
          </div>` : ''}
        </div>
      </div>`;
  });

  html += `</div>
  </div>
  
  <div class="card" style="margin-top:20px">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-calendar-alt"></i> Calendar</span>
      <div id="calendar-nav" style="display:flex;gap:8px;align-items:center">
        <button class="btn btn-secondary btn-xs" onclick="prevMonth()" style="padding:6px 10px">â€¹</button>
        <span id="calendar-month" style="font-weight:600;min-width:150px;text-align:center"></span>
        <button class="btn btn-secondary btn-xs" onclick="nextMonth()" style="padding:6px 10px">â€º</button>
      </div>
    </div>
    <div style="padding:16px">
      <div id="calendar-grid" style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px"></div>
    </div>
  </div>`;

  return html;
}

function renderCalendar(year = new Date().getFullYear(), month = new Date().getMonth()) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  document.getElementById('calendar-month').textContent = monthNames[month] + ' ' + year;

  let grid = '';
  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Day labels
  dayLabels.forEach(label => {
    grid += `<div style="text-align:center;font-weight:600;padding:8px;font-size:12px;color:var(--gray-600)">${label}</div>`;
  });

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    grid += `<div></div>`;
  }

  // Days of month
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(year, month, day);
    const hasEvent = getEventsData().some(e => e.date === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    const isToday = cellDate.toDateString() === today.toDateString();

    let cellStyle = 'padding:8px;border-radius:8px;text-align:center;cursor:pointer;border:1px solid transparent;font-weight:500;';
    if (hasEvent) cellStyle += 'background:var(--blue-xpale);border-color:var(--blue-main);color:var(--blue-dark);font-weight:700;';
    if (isToday) cellStyle += 'background:var(--blue-main);color:white;';

    grid += `<div style="${cellStyle};">${day}</div>`;
  }

  document.getElementById('calendar-grid').innerHTML = grid;
}

let currentCalendarYear = new Date().getFullYear(), currentCalendarMonth = new Date().getMonth();

function nextMonth() {
  currentCalendarMonth++;
  if (currentCalendarMonth > 11) {
    currentCalendarMonth = 0;
    currentCalendarYear++;
  }
  renderCalendar(currentCalendarYear, currentCalendarMonth);
}

function prevMonth() {
  currentCalendarMonth--;
  if (currentCalendarMonth < 0) {
    currentCalendarMonth = 11;
    currentCalendarYear--;
  }
  renderCalendar(currentCalendarYear, currentCalendarMonth);
}

function openAddEventForm() {
  const formHTML = `
    <div style="max-width:850px;background:white;border-radius:12px;overflow:hidden">
      <div style="padding:20px;background:var(--blue-main);color:white">
        <h2 style="margin:0">Add New Event</h2>
        <p style="margin:8px 0 0 0;font-size:13px;opacity:0.9">Create a new school event</p>
      </div>
      
      <form onsubmit="addNewEvent(event)" style="padding:20px">
        <div class="f-field" style="margin-bottom:12px">
          <label>Event Title</label>
          <input type="text" id="event-title" placeholder="e.g., Sports Day" required>
        </div>
        
        <div class="f-row">
          <div class="f-field">
            <label>Date</label>
            <input type="date" id="event-date" required>
          </div>
          <div class="f-field">
            <label>Time</label>
            <input type="time" id="event-time" required>
          </div>
          <div class="f-field">
            <label>All Day Event</label>
            <input type="checkbox" id="event-allday" style="width:auto;margin-top:8px">
          </div>
        </div>
        
        <div class="f-field" style="margin-bottom:12px">
          <label>Audience</label>
          <input type="text" id="event-audience" placeholder="e.g., All Students & Staff" required>
        </div>

        <div class="f-row">
          <div class="f-field">
            <label>Location</label>
            <input type="text" id="event-location" placeholder="e.g., School Hall">
          </div>
          <div class="f-field">
            <label>Status</label>
            <select id="event-status"><option>Published</option><option>Draft</option><option>Cancelled</option></select>
          </div>
        </div>
        
        <div class="f-field" style="margin-bottom:12px">
          <label>Description</label>
          <textarea id="event-description" placeholder="Event details..." rows="4" required></textarea>
        </div>
        
        <div style="display:flex;gap:8px;margin-top:20px;justify-content:flex-end">
          <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">Create Event</button>
        </div>
      </form>
    </div>
  `;

  openModal(formHTML);
}

async function addNewEvent(event) {
  event.preventDefault();

  const title = document.getElementById('event-title').value;
  const date = document.getElementById('event-date').value;
  const time = document.getElementById('event-time').value;
  const allDay = document.getElementById('event-allday').checked;
  const audience = document.getElementById('event-audience').value;
  const location = document.getElementById('event-location').value;
  const status = document.getElementById('event-status').value;
  const description = document.getElementById('event-description').value;

  if (!title || !date || (!allDay && !time) || !audience || !description) {
    showToast('<i class="fas fa-times-circle"></i> Please fill all fields', 'error');
    return;
  }

  const payload = {
    title,
    event_date: date,
    event_time: allDay ? null : time,
    all_day: allDay ? 1 : 0,
    location,
    audience,
    description,
    status
  };

  try {
    const res = await API.events.create(payload);
    if (!res || !res.success) throw new Error(res?.message || 'Failed to create event');
    if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
    closeModal();
    showToast(`<i class="fas fa-check-circle"></i> Event "${escapeHtml(title)}" created successfully!`, 'success');
    renderMain();
    renderCalendar(currentCalendarYear, currentCalendarMonth);
  } catch (err) {
    showToast(`<i class="fas fa-times-circle"></i> ${escapeHtml(err.message || 'Failed to create event')}`, 'error');
  }
}

function viewEvent(eventId) {
  const event = getEventsData().find(e => Number(e.id) === Number(eventId));
  if (!event) {
    showToast('<i class="fas fa-times-circle"></i> Event not found', 'error');
    return;
  }

  const formattedDate = formatEventDateParts(event.date).long || event.date;
  const timeStr = formatEventTime(event);

  const detailHTML = `
    <div style="max-width:850px;background:white;border-radius:12px;overflow:hidden">
      <div style="padding:20px;background:var(--blue-main);color:white">
        <h2 style="margin:0">${escapeHtml(event.title)}</h2>
      </div>
      
      <div style="padding:20px">
        <div style="margin-bottom:16px">
          <h4 style="margin:0 0 8px 0;font-size:12px;font-weight:700;color:var(--gray-600);text-transform:uppercase">Date & Time</h4>
          <p style="margin:0;font-size:15px">${escapeHtml(formattedDate)} Â· ${escapeHtml(timeStr)}</p>
        </div>
        
        <div style="margin-bottom:16px">
          <h4 style="margin:0 0 8px 0;font-size:12px;font-weight:700;color:var(--gray-600);text-transform:uppercase">Audience</h4>
          <p style="margin:0;font-size:15px">${escapeHtml(event.audience || 'All')}</p>
        </div>

        <div style="margin-bottom:16px">
          <h4 style="margin:0 0 8px 0;font-size:12px;font-weight:700;color:var(--gray-600);text-transform:uppercase">Location</h4>
          <p style="margin:0;font-size:15px">${escapeHtml(event.location || 'School Campus')}</p>
        </div>

        ${['Teacher', 'Admin'].includes(currentRole) ? `<div style="margin-bottom:16px">
          <h4 style="margin:0 0 8px 0;font-size:12px;font-weight:700;color:var(--gray-600);text-transform:uppercase">Status</h4>
          <p style="margin:0;font-size:15px">${escapeHtml(event.status || 'Published')}</p>
        </div>` : ''}
        
        <div style="margin-bottom:16px">
          <h4 style="margin:0 0 8px 0;font-size:12px;font-weight:700;color:var(--gray-600);text-transform:uppercase">Description</h4>
          <p style="margin:0;font-size:14px;line-height:1.6">${escapeHtml(event.description || '')}</p>
        </div>
        
        <div style="display:flex;gap:8px;margin-top:24px;justify-content:flex-end">
          ${['Teacher', 'Admin'].includes(currentRole) ? `
            <button class="btn btn-secondary" onclick="closeModal();editEvent(${event.id})">Edit</button>
            <button class="btn btn-danger" onclick="closeModal();deleteEvent(${event.id})">Delete</button>
          ` : ''}
          <button class="btn btn-primary" onclick="closeModal()">Close</button>
        </div>
      </div>
    </div>
  `;

  openModal(detailHTML);
}

function editEvent(eventId) {
  const event = getEventsData().find(e => Number(e.id) === Number(eventId));
  if (!event) {
    showToast('<i class="fas fa-times-circle"></i> Event not found', 'error');
    return;
  }

  const formHTML = `
    <div style="max-width:850px;background:white;border-radius:12px;overflow:hidden">
      <div style="padding:20px;background:var(--blue-main);color:white">
        <h2 style="margin:0">Edit Event</h2>
        <p style="margin:8px 0 0 0;font-size:13px;opacity:0.9">${escapeHtml(event.title)}</p>
      </div>
      
      <form onsubmit="saveEditEvent(event, ${eventId})" style="padding:20px">
        <div class="f-field" style="margin-bottom:12px">
          <label>Event Title</label>
          <input type="text" id="edit-event-title" value="${escapeAttr(event.title)}" required>
        </div>
        
        <div class="f-row">
          <div class="f-field">
            <label>Date</label>
            <input type="date" id="edit-event-date" value="${event.date}" required>
          </div>
          <div class="f-field">
            <label>Time</label>
            <input type="time" id="edit-event-time" value="${escapeAttr(event.time || '')}">
          </div>
          <div class="f-field">
            <label>All Day Event</label>
            <input type="checkbox" id="edit-event-allday" ${event.allDay ? 'checked' : ''} style="width:auto;margin-top:8px">
          </div>
        </div>
        
        <div class="f-field" style="margin-bottom:12px">
          <label>Audience</label>
          <input type="text" id="edit-event-audience" value="${escapeAttr(event.audience || 'All')}" required>
        </div>

        <div class="f-row">
          <div class="f-field">
            <label>Location</label>
            <input type="text" id="edit-event-location" value="${escapeAttr(event.location || '')}">
          </div>
          <div class="f-field">
            <label>Status</label>
            <select id="edit-event-status">
              ${['Published', 'Draft', 'Cancelled'].map(status => `<option ${status === (event.status || 'Published') ? 'selected' : ''}>${status}</option>`).join('')}
            </select>
          </div>
        </div>
        
        <div class="f-field" style="margin-bottom:12px">
          <label>Description</label>
          <textarea id="edit-event-description" rows="4" required>${escapeHtml(event.description || '')}</textarea>
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

async function saveEditEvent(eventElement, eventId) {
  if (eventElement && eventElement.preventDefault) {
    eventElement.preventDefault();
  }

  const event = getEventsData().find(e => Number(e.id) === Number(eventId));
  if (!event) {
    showToast('<i class="fas fa-times-circle"></i> Event not found', 'error');
    return;
  }

  const allDay = document.getElementById('edit-event-allday').checked;
  const payload = {
    title: document.getElementById('edit-event-title').value,
    event_date: document.getElementById('edit-event-date').value,
    event_time: allDay ? null : document.getElementById('edit-event-time').value,
    all_day: allDay ? 1 : 0,
    location: document.getElementById('edit-event-location').value,
    audience: document.getElementById('edit-event-audience').value,
    description: document.getElementById('edit-event-description').value,
    status: document.getElementById('edit-event-status').value
  };

  try {
    const res = await API.events.update(eventId, payload);
    if (!res || !res.success) throw new Error(res?.message || 'Failed to update event');
    if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
    closeModal();
    showToast('<i class="fas fa-check-circle"></i> Event updated successfully!', 'success');
    renderMain();
    renderCalendar(currentCalendarYear, currentCalendarMonth);
  } catch (err) {
    showToast(`<i class="fas fa-times-circle"></i> ${escapeHtml(err.message || 'Failed to update event')}`, 'error');
  }
}

async function deleteEvent(eventId) {
  const event = getEventsData().find(e => Number(e.id) === Number(eventId));
  if (!event) {
    showToast('<i class="fas fa-times-circle"></i> Event not found', 'error');
    return;
  }

  if (confirm(`Are you sure you want to delete "${event.title}"? This action cannot be undone.`)) {
    try {
      const res = await API.events.delete(eventId);
      if (!res || !res.success) throw new Error(res?.message || 'Failed to delete event');
      if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
      closeModal();
      showToast('<i class="fas fa-check-circle"></i> Event deleted successfully!', 'success');
      renderMain();
      renderCalendar(currentCalendarYear, currentCalendarMonth);
    } catch (err) {
      showToast(`<i class="fas fa-times-circle"></i> ${escapeHtml(err.message || 'Failed to delete event')}`, 'error');
    }
  }
}

// RECEIPTS MODULE
function receiptsModule() {
  const receiptRows = getPayments().filter(p => p.receipt).slice(0, 10);
  return hdr('Invoice & Receipts', 'Generate and manage invoices and payment receipts', 'Invoice & Receipts') +
    renderPageTemplate('pages/finance/receipts/index.html', { receiptRows: renderReceiptRows(receiptRows) });
}

function renderReceiptRows(rows) {
  if (!rows.length) return '<tr><td colspan="8" style="text-align:center;padding:22px;color:var(--gray-400)">No receipts found.</td></tr>';
  return rows.map((p, idx) => {
    const student = enrolledStudents.find(s => s.name === p.student);
    return `
      <tr data-receipt-row="${escapeAttr((p.receipt || '') + ' ' + (p.student || ''))}">
        <td style="color:var(--blue-main);font-weight:700">${escapeHtml(p.receipt || 'N/A')}</td>
        <td>${escapeHtml(p.student || '')}</td>
        <td>${escapeHtml(student?.student_class || student?.class || 'N/A')}</td>
        <td style="font-weight:700;color:var(--success)">GHâ‚µ${Number(p.amount || 0).toLocaleString()}</td>
        <td>Term 1</td><td>${escapeHtml(p.date || new Date().toISOString().slice(0, 10))}</td><td>${escapeHtml(getSessionUser()?.name || 'Accountant')}</td>
        <td><div style="display:flex;gap:4px"><button class="btn btn-secondary btn-xs" onclick="openReceiptByNumber('${escapeAttr(p.receipt || '')}')"><i class="fas fa-print"></i> Print</button><button class="btn btn-primary btn-xs" onclick="downloadReceiptByNumber('${escapeAttr(p.receipt || '')}')"><i class="fas fa-download"></i> PDF</button></div></td>
      </tr>`;
  }).join('');
}

function openReceiptByNumber(receiptNo) {
  const idx = getFilteredPayments().findIndex(p => p.receipt === receiptNo);
  const fallbackIdx = getPayments().findIndex(p => p.receipt === receiptNo);
  if (idx >= 0) generatePaymentReceipt(idx);
  else if (fallbackIdx >= 0) {
    const payment = getPayments()[fallbackIdx];
    openModal(`
      <div style="padding:26px;max-width:560px">
        <h3 style="margin-top:0;color:var(--blue-dark)">Receipt ${escapeHtml(payment.receipt)}</h3>
        <div style="display:grid;gap:10px;font-size:13px">
          <div style="display:flex;justify-content:space-between"><span>Student</span><strong>${escapeHtml(payment.student)}</strong></div>
          <div style="display:flex;justify-content:space-between"><span>Amount</span><strong>GHâ‚µ${Number(payment.amount || 0).toLocaleString()}</strong></div>
          <div style="display:flex;justify-content:space-between"><span>Date</span><strong>${escapeHtml(payment.date || '')}</strong></div>
          <div style="display:flex;justify-content:space-between"><span>Method</span><strong>${escapeHtml(payment.method || 'Cash')}</strong></div>
        </div>
        <div style="display:flex;gap:8px;margin-top:18px">
          <button class="btn btn-primary" onclick="printDocument()" style="flex:1"><i class="fas fa-print"></i> Print</button>
          <button class="btn btn-secondary" onclick="closeModal()" style="flex:1">Close</button>
        </div>
      </div>
    `);
  }
}

function downloadReceiptByNumber(receiptNo) {
  openReceiptByNumber(receiptNo);
  showToast('<i class="fas fa-download"></i> Receipt opened. Use Print to save as PDF.', 'info');
}

function filterReceiptsTable() {
  const query = (document.getElementById('receipt-search')?.value || '').toLowerCase();
  document.querySelectorAll('[data-receipt-row]').forEach(row => {
    row.style.display = row.dataset.receiptRow.toLowerCase().includes(query) ? '' : 'none';
  });
}

function openReceiptIssueModal() {
  openReceiptIssuePage();
}

function openReceiptIssuePage() {
  const students = enrolledStudents.map(s => `<option value="${escapeAttr(s.name)}">${escapeHtml(s.name)} (${escapeHtml(s.student_class || s.class || 'Class')})</option>`).join('');
  currentMod = 'receipts';
  const el = document.getElementById('main-content');
  if (!el) return;
  el.innerHTML = hdr('Issue New Receipt', 'Create a payment receipt for any typed student name', 'Receipts') + `
    <div class="card" style="max-width:720px">
      <h3 style="margin-top:0;color:var(--blue-dark)"><i class="fas fa-receipt"></i> Issue New Receipt</h3>
      <div class="f-field">
        <label>Student</label>
        <input id="new-receipt-student" list="receipt-student-list" placeholder="Type student name..." autocomplete="off">
        <datalist id="receipt-student-list">${students}</datalist>
      </div>
      <div class="f-row">
        <div class="f-field"><label>Amount (GHâ‚µ)</label><input id="new-receipt-amount" type="number" value="2400" min="1"></div>
        <div class="f-field"><label>Method</label><select id="new-receipt-method"><option>Cash</option><option>Mobile Money</option><option>Bank Transfer</option><option>Card</option></select></div>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn btn-primary" style="flex:1" onclick="issueReceiptFromPage()">Issue Receipt</button>
        <button class="btn btn-secondary" style="flex:1" onclick="navTo('receipts')">Cancel</button>
      </div>
    </div>`;
  window.scrollTo(0, 0);
}

function issueReceiptFromModal() {
  issueReceiptFromPage();
}

function issueReceiptFromPage() {
  const student = document.getElementById('new-receipt-student')?.value || '';
  const amount = Number(document.getElementById('new-receipt-amount')?.value || 0);
  const method = document.getElementById('new-receipt-method')?.value || 'Cash';
  if (!student || amount <= 0) {
    showToast('<i class="fas fa-exclamation-triangle"></i> Type a student name and enter a valid amount', 'warning');
    return;
  }
  const payments = getPayments();
  const receipt = '#R-' + String(Date.now()).slice(-5);
  payments.unshift({ student, amount, date: new Date().toISOString().slice(0, 10), receipt, method, status: 'Paid' });
  savePayments(payments);
  closeModal();
  showToast(`<i class="fas fa-check-circle"></i> Receipt ${receipt} issued`, 'success');
  navTo('receipts');
}

// SCHOLARSHIPS / DISCOUNTS MODULE
function scholarshipsModule() {
  const statsCards = [
    statCard('<i class="fas fa-gift"></i>', '24', 'Active Scholarships', 'This term', 'neu', 'si-blue'),
    statCard('<i class="fas fa-users"></i>', '15', 'Sibling Discounts', 'Applied automatically', 'neu', 'si-gold'),
    statCard('<i class="fas fa-chalkboard-teacher"></i>', '8', 'Staff Discounts', 'For staff dependents', 'neu', 'si-green')
  ].join('');
  const grantRows = [['Kwame Nkrumah', 'JHS 3', 'Academic Scholarship', '100% Tuition', 'Active'],
             ['Ama Serwaa', 'JHS 1', 'Sibling Discount', '20% Tuition', 'Active'],
             ['Kofi Owusu', 'Basic 6', 'Staff Dependent', '50% Tuition', 'Active'],
             ['Esi Appiah', 'Primary 6', 'Sports Bursary', '50% Full Fee', 'Pending Review']].map(([n, c, t, v, s]) => `
          <tr>
            <td style="font-weight:600;color:var(--blue-dark)">${n}</td>
            <td>${c}</td><td><span class="badge b-info">${t}</span></td>
            <td style="font-weight:700;color:var(--gold)">${v}</td>
            <td><span class="badge ${s === 'Active' ? 'b-success' : 'b-warning'}">${s}</span></td>
            <td><button class="btn btn-secondary btn-xs" onclick="showToast('Edit grant dialog opened', 'info')"><i class="fas fa-edit"></i> Edit</button></td>
          </tr>`).join('');

  return hdr('Scholarships & Discounts', 'Manage fee reductions and special waivers', 'Grants') +
    renderPageTemplate('pages/finance/scholarships/index.html', { statsCards, grantRows });
}

// DEBTORS LIST MODULE
const DEBTOR_REMINDERS_KEY = 'gr_debtor_reminders';

function getDebtors() {
  return (window.feesData || [])
    .filter(f => Number(f.balance || 0) > 0)
    .map(f => {
      const student = enrolledStudents.find(s => parseInt(s.id, 10) === parseInt(f.student_id, 10)) || {};
      return {
        id: 'F' + f.id,
        student: f.student || student.name || '',
        className: f.className || student.student_class || '',
        parent: student.parent_name || '',
        contact: student.parent_phone || '',
        balance: Number(f.balance || 0),
        days: f.paymentDate ? Math.max(0, Math.floor((Date.now() - new Date(f.paymentDate).getTime()) / 86400000)) : 0
      };
    });
}

function saveDebtors(list) {
  window.feesData = Array.isArray(window.feesData) ? window.feesData : [];
}

function getDebtorReminderLogs() {
  try {
    return JSON.parse(appMemoryStorage.getItem(DEBTOR_REMINDERS_KEY) || '[]');
  } catch(e) {
    return [];
  }
}

function formatReminderTime(sentAt) {
  const date = sentAt ? new Date(sentAt) : new Date();
  if (Number.isNaN(date.getTime())) return 'Just now';
  return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function debtorReminderNoticePanel(limit = 3, compact = false) {
  const reminders = getDebtorReminderLogs().slice(0, limit);
  return `
    <div class="card" style="margin-bottom:16px">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-bell"></i> Reminder Notifications</span></div>
      ${reminders.length ? reminders.map(r => `
        <div style="display:flex;gap:12px;align-items:flex-start;padding:${compact ? '10px 0' : '12px'};border-bottom:1px solid var(--gray-100)">
          <div style="width:36px;height:36px;border-radius:10px;background:${r.channel === 'SMS' ? 'var(--blue-xpale)' : 'var(--gold-xlight)'};color:${r.channel === 'SMS' ? 'var(--blue-main)' : 'var(--gold-dark)'};display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="fas ${r.channel === 'SMS' ? 'fa-sms' : 'fa-paper-plane'}"></i></div>
          <div style="flex:1">
            <div style="font-size:13px;font-weight:800;color:var(--blue-dark)">${escapeHtml(r.channel || 'Reminder')} sent to ${escapeHtml(r.parent || 'Parent')}</div>
            ${compact ? '' : `<div style="font-size:12px;color:var(--gray-600);line-height:1.5;margin-top:3px">${escapeHtml(r.message || '')}</div>`}
            <div style="font-size:11px;color:var(--gray-400);margin-top:6px">${escapeHtml(r.contact || '')} Â· GHâ‚µ ${Number(r.balance || 0).toLocaleString()} Â· ${formatReminderTime(r.sentAt)}</div>
          </div>
        </div>`).join('') : '<div style="padding:18px;color:var(--gray-400);font-size:13px">No reminder notifications yet.</div>'}
    </div>`;
}

function debtorsModule() {
  const debtors = getDebtors();
  const classes = ['All Classes', ...Array.from(new Set(debtors.map(d => d.className)))];
  return hdr('Debtors List', 'Monitor outstanding fee balances and recovery', 'Debtors') +
    renderPageTemplate('pages/finance/debtors/index.html', {
      reminderNotice: debtorReminderNoticePanel(),
      classOptions: classes.map(c => `<option>${escapeHtml(c)}</option>`).join(''),
      debtorRows: renderDebtorRows(debtors)
    });
}

function getFinanceSummary() {
  const payments = getPayments();
  const fees = window.feesData || [];
  const apiSummary = window.financeReportData || {};
  const totalIncome = Number(apiSummary.total_income ?? payments.reduce((sum, p) => sum + Number(p.amount || 0), 0));
  const totalFeesDue = Number(apiSummary.total_fees_due ?? fees.reduce((sum, f) => sum + Number(f.amountDue || 0), 0));
  const totalOutstanding = Number(apiSummary.total_fees_outstanding ?? fees.reduce((sum, f) => sum + Number(f.balance || 0), 0));
  const expenseBreakdown = Array.isArray(apiSummary.expense_breakdown) ? apiSummary.expense_breakdown : [];
  const recentExpenses = Array.isArray(apiSummary.recent_expenses) ? apiSummary.recent_expenses : [];
  const totalExpenditure = Number(apiSummary.total_expenditure ?? expenseBreakdown.reduce((sum, row) => sum + Number(row.amount || 0), 0));
  const salaryTotal = Number(apiSummary.salary_total ?? expenseBreakdown.filter(row => row.category === 'Staff Salaries').reduce((sum, row) => sum + Number(row.amount || 0), 0));
  return {
    term: apiSummary.term || 'Current Term',
    academicYear: apiSummary.academic_year || '',
    totalIncome,
    totalFeesDue,
    totalOutstanding,
    totalExpenditure,
    netSurplus: Number(apiSummary.net_surplus ?? (totalIncome - totalExpenditure)),
    salaryTotal,
    incomeBreakdown: Array.isArray(apiSummary.income_breakdown) ? apiSummary.income_breakdown : [{ source: 'School Fees', amount: totalIncome }],
    expenseBreakdown,
    recentExpenses
  };
}

function financePct(amount, total) {
  return total ? Math.round((Number(amount || 0) / total) * 100) + '%' : '0%';
}

function getFilteredDebtors() {
  const query = (document.getElementById('debtor-search')?.value || '').toLowerCase();
  const classFilter = document.getElementById('debtor-class-filter')?.value || 'All Classes';
  const overdueFilter = document.getElementById('debtor-overdue-filter')?.value || 'All Debtors';
  return getDebtors().filter(d => {
    const matchesQuery = !query || `${d.student} ${d.parent} ${d.contact}`.toLowerCase().includes(query);
    const matchesClass = classFilter === 'All Classes' || d.className === classFilter;
    const matchesOverdue = overdueFilter === 'All Debtors' || (overdueFilter.includes('60') ? d.days > 60 : d.days > 30);
    return matchesQuery && matchesClass && matchesOverdue;
  });
}

function renderDebtorRows(rows) {
  if (!rows.length) return '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--gray-400)">No debtors match your filter.</td></tr>';
  return rows.map(d => `
    <tr>
      <td style="font-weight:600;color:var(--blue-dark)">${escapeHtml(d.student)}</td><td>${escapeHtml(d.className)}</td>
      <td>${escapeHtml(d.parent)}</td><td><i class="fas fa-phone-alt" style="color:var(--gray-400);font-size:10px"></i> ${escapeHtml(d.contact)}</td>
      <td style="font-weight:700;color:var(--danger)">GHâ‚µ ${Number(d.balance).toLocaleString()}</td>
      <td><span class="badge ${d.days > 30 ? 'b-danger' : 'b-warning'}"><i class="fas fa-clock"></i> ${d.days} Days</span></td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-primary btn-xs" onclick="openDebtorReminderPage('${escapeAttr(d.id)}')"><i class="fas fa-bell"></i> Remind</button>
          <button class="btn btn-secondary btn-xs" onclick="openDebtorPaymentPage('${escapeAttr(d.id)}')">Receive Pay</button>
        </div>
      </td>
    </tr>`).join('');
}

function renderDebtorsTable() {
  const tbody = document.getElementById('debtors-tbody');
  if (tbody) tbody.innerHTML = renderDebtorRows(getFilteredDebtors());
}

function saveDebtorReminderLog(debtor, message, channel = 'Reminder') {
  try {
    const reminders = getDebtorReminderLogs();
    const reminder = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      debtorId: debtor.id,
      parent: debtor.parent,
      contact: debtor.contact,
      sentAt: new Date().toISOString(),
      balance: debtor.balance,
      channel,
      message
    };
    reminders.unshift(reminder);
    appMemoryStorage.setItem(DEBTOR_REMINDERS_KEY, JSON.stringify(reminders.slice(0, 100)));
    addAppNotification({
      icon: channel === 'SMS' ? '<i class="fas fa-sms"></i>' : '<i class="fas fa-bell"></i>',
      title: channel === 'SMS' ? 'SMS Reminder Sent' : 'Debtor Reminder Sent',
      msg: `${channel} sent to ${debtor.parent} about GHâ‚µ ${Number(debtor.balance).toLocaleString()}`,
      fullMsg: `${escapeHtml(channel)} sent to ${escapeHtml(debtor.parent)} (${escapeHtml(debtor.contact)}).<br><br>${escapeHtml(message)}`,
      action: 'View Debtors',
      actionLink: 'debtors'
    });
  } catch(e) {}
}

function openDebtorReminderPage(debtorId) {
  const debtor = getDebtors().find(d => d.id === debtorId);
  if (!debtor) return;
  currentMod = 'debtors';
  const el = document.getElementById('main-content');
  if (!el) return;
  const message = `Dear ${debtor.parent}, our records show an outstanding fee balance of GHâ‚µ ${Number(debtor.balance).toLocaleString()} for ${debtor.student}. Please make payment at the school office.`;
  el.innerHTML = hdr('Send Fee Reminder', 'Prepare and send a payment reminder to a parent', 'Debtors') + `
    <div class="card" style="max-width:760px">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-bell"></i> ${escapeHtml(debtor.parent)}</span></div>
      <div class="g2" style="margin-bottom:16px">
        <div style="background:var(--gray-50);padding:14px;border-radius:8px"><div style="font-size:10px;color:var(--gray-500);font-weight:700">STUDENT</div><strong>${escapeHtml(debtor.student)}</strong><div style="font-size:12px;color:var(--gray-500);margin-top:4px">${escapeHtml(debtor.className)} Â· ${debtor.days} days overdue</div></div>
        <div style="background:var(--gold-xlight);padding:14px;border-radius:8px"><div style="font-size:10px;color:var(--gray-500);font-weight:700">CONTACT</div><strong>${escapeHtml(debtor.contact)}</strong><div style="font-size:12px;color:var(--gray-500);margin-top:4px">Balance: GHâ‚µ ${Number(debtor.balance).toLocaleString()}</div></div>
      </div>
      <div class="f-field" style="margin-bottom:14px"><label>Reminder Message</label><textarea id="debtor-reminder-message" style="min-height:130px">${escapeHtml(message)}</textarea></div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="sendDebtorReminder('${escapeAttr(debtor.id)}', 'Reminder')"><i class="fas fa-paper-plane"></i> Send Reminder</button>
        <button class="btn btn-gold" style="flex:1" onclick="sendDebtorReminder('${escapeAttr(debtor.id)}', 'SMS')"><i class="fas fa-sms"></i> Send SMS</button>
        <button class="btn btn-secondary" style="flex:1" onclick="navTo('debtors')">Cancel</button>
      </div>
    </div>`;
  window.scrollTo(0, 0);
}

function sendDebtorReminder(debtorId, channel = 'Reminder') {
  const debtor = getDebtors().find(d => d.id === debtorId);
  if (!debtor) return;
  const message = document.getElementById('debtor-reminder-message')?.value?.trim() || '';
  if (!message) {
    showToast('<i class="fas fa-exclamation-triangle"></i> Type a reminder message first', 'warning');
    return;
  }
  saveDebtorReminderLog(debtor, message, channel);
  showToast(`<i class="fas ${channel === 'SMS' ? 'fa-sms' : 'fa-bell'}"></i> ${channel} sent to ${debtor.parent}`, 'success');
  navTo('debtors');
}

function openBulkDebtorReminderPage() {
  const rows = getFilteredDebtors();
  currentMod = 'debtors';
  const el = document.getElementById('main-content');
  if (!el) return;
  const total = rows.reduce((sum, d) => sum + Number(d.balance || 0), 0);
  const message = 'Dear Parent/Guardian, please note that your ward has an outstanding school fee balance. Kindly make payment at the school office or contact accounts for support.';
  el.innerHTML = hdr('Bulk Fee Reminders', 'Send reminders to the currently filtered debtor list', 'Debtors') + `
    <div class="card" style="max-width:860px">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-sms"></i> ${rows.length} Parent${rows.length === 1 ? '' : 's'} Selected</span></div>
      <div class="g2" style="margin-bottom:16px">
        <div style="background:var(--gray-50);padding:14px;border-radius:8px"><div style="font-size:10px;color:var(--gray-500);font-weight:700">TOTAL OUTSTANDING</div><strong style="color:var(--danger);font-size:20px">GHâ‚µ ${total.toLocaleString()}</strong></div>
        <div style="background:var(--blue-xpale);padding:14px;border-radius:8px"><div style="font-size:10px;color:var(--gray-500);font-weight:700">RECIPIENTS</div><strong>${rows.map(d => escapeHtml(d.parent)).join(', ') || 'None'}</strong></div>
      </div>
      <div class="f-field" style="margin-bottom:14px"><label>Bulk Reminder Message</label><textarea id="bulk-debtor-reminder-message" style="min-height:130px">${escapeHtml(message)}</textarea></div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="sendBulkDebtorReminders('${escapeAttr(rows.map(d => d.id).join(','))}', 'Reminder')"><i class="fas fa-paper-plane"></i> Send Bulk Reminders</button>
        <button class="btn btn-gold" style="flex:1" onclick="sendBulkDebtorReminders('${escapeAttr(rows.map(d => d.id).join(','))}', 'SMS')"><i class="fas fa-sms"></i> Send Bulk SMS</button>
        <button class="btn btn-secondary" style="flex:1" onclick="navTo('debtors')">Cancel</button>
      </div>
    </div>`;
  window.scrollTo(0, 0);
}

function sendBulkDebtorReminders(debtorIds = '', channel = 'Reminder') {
  const selectedIds = debtorIds ? debtorIds.split(',').filter(Boolean) : [];
  const rows = selectedIds.length ? getDebtors().filter(d => selectedIds.includes(d.id)) : getFilteredDebtors();
  const message = document.getElementById('bulk-debtor-reminder-message')?.value?.trim() || '';
  if (!rows.length) {
    showToast('<i class="fas fa-exclamation-triangle"></i> No debtors selected for reminders', 'warning');
    return;
  }
  if (!message) {
    showToast('<i class="fas fa-exclamation-triangle"></i> Type a reminder message first', 'warning');
    return;
  }
  rows.forEach(d => saveDebtorReminderLog(d, message, channel));
  showToast(`<i class="fas ${channel === 'SMS' ? 'fa-sms' : 'fa-bell'}"></i> Bulk ${channel.toLowerCase()} sent to ${rows.length} parent${rows.length === 1 ? '' : 's'}`, 'success');
  navTo('debtors');
}

function openDebtorPaymentPage(debtorId) {
  const debtor = getDebtors().find(d => d.id === debtorId);
  if (!debtor) return;
  currentMod = 'debtors';
  const el = document.getElementById('main-content');
  if (!el) return;
  el.innerHTML = hdr('Receive Debtor Payment', 'Record a payment against an outstanding balance', 'Debtors') + `
    <div class="card" style="max-width:720px">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-money-bill"></i> ${escapeHtml(debtor.student)}</span></div>
      <div class="g2" style="margin-bottom:16px">
        <div style="background:var(--gray-50);padding:14px;border-radius:8px"><div style="font-size:10px;color:var(--gray-500);font-weight:700">PARENT</div><strong>${escapeHtml(debtor.parent)}</strong><div style="font-size:12px;color:var(--gray-500);margin-top:4px">${escapeHtml(debtor.contact)}</div></div>
        <div style="background:var(--danger-light);padding:14px;border-radius:8px"><div style="font-size:10px;color:var(--gray-500);font-weight:700">OUTSTANDING</div><strong style="color:var(--danger);font-size:20px">GHâ‚µ ${Number(debtor.balance).toLocaleString()}</strong><div style="font-size:12px;color:var(--gray-500);margin-top:4px">${debtor.days} days overdue</div></div>
      </div>
      <div class="f-row">
        <div class="f-field"><label>Amount Received (GHâ‚µ)</label><input id="debtor-pay-amount" type="number" min="1" max="${debtor.balance}" value="${debtor.balance}"></div>
        <div class="f-field"><label>Method</label><select id="debtor-pay-method"><option>Cash</option><option>Mobile Money</option><option>Bank Transfer</option><option>Card</option></select></div>      </div>
      <div style="display:flex;gap:8px;margin-top:16px">
        <button class="btn btn-primary" onclick="processDebtorPayment('${escapeAttr(debtor.id)}')"><i class="fas fa-check"></i> Record Payment</button>
        <button class="btn btn-secondary" onclick="navTo('debtors')">Cancel</button>
      </div>
    </div>`;
  window.scrollTo(0, 0);
}

async function processDebtorPayment(debtorId) {
  const debtor = getDebtors().find(d => d.id === debtorId);
  if (!debtor) return;
  const amount = Number(document.getElementById('debtor-pay-amount')?.value || 0);
  const method = document.getElementById('debtor-pay-method')?.value || 'Cash';
  if (!amount || amount <= 0) {
    showToast('<i class="fas fa-exclamation-triangle"></i> Enter a valid payment amount', 'warning');
    return;
  }
  if (amount > Number(debtor.balance || 0)) {
    showToast('<i class="fas fa-exclamation-triangle"></i> Payment cannot exceed outstanding balance', 'warning');
    return;
  }

  const feeId = String(debtor.id || '').startsWith('F') ? parseInt(String(debtor.id).slice(1), 10) : Number(debtor.id);
  const fee = (window.feesData || []).find(f => Number(f.id) === feeId);
  if (!fee || !fee.student_id) {
    showToast('<i class="fas fa-exclamation-triangle"></i> Fee record not found in backend data', 'error');
    return;
  }

  const btn = event?.target?.closest('button');
  if (btn) btn.disabled = true;
  try {
    const res = await API.fees.recordPayment({
      student_id: fee.student_id,
      amount,
      term: fee.term,
      academic_year: fee.academic_year,
      payment_date: new Date().toISOString().slice(0, 10),
      method,
      received_by: getSessionUser()?.name || 'Accountant',
      remarks: 'Debtor payment'
    });
    if (!res || !res.success) throw new Error(res?.message || 'Payment failed');
    if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
    showToast(`<i class="fas fa-check"></i> Payment recorded. Receipt: ${escapeHtml(res.receipt_number || 'Generated')}`, 'success');
    navTo('debtors');
  } catch (err) {
    showToast(`<i class="fas fa-exclamation-triangle"></i> ${escapeHtml(err.message || 'Unable to record payment')}`, 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

// EXPENSES MODULE
function expensesModule() {
  const finance = getFinanceSummary();
  const operatingExpenses = Math.max(0, finance.totalExpenditure - finance.salaryTotal);
  const otherExpenses = finance.expenseBreakdown
    .filter(row => row.category !== 'Staff Salaries')
    .reduce((sum, row) => sum + Number(row.amount || 0), 0);
  const statsCards = [
    statCard('<i class="fas fa-chart-line"></i>', money(finance.totalExpenditure), 'Total Expenses', finance.term, 'neu', 'si-red'),
    statCard('<i class="fas fa-briefcase"></i>', money(finance.salaryTotal), 'Staff Salaries', financePct(finance.salaryTotal, finance.totalExpenditure), 'neu', 'si-blue'),
    statCard('<i class="fas fa-wrench"></i>', money(operatingExpenses), 'Operations', financePct(operatingExpenses, finance.totalExpenditure), 'neu', 'si-gold'),
    statCard('<i class="fas fa-chart-bar"></i>', money(otherExpenses), 'Other', financePct(otherExpenses, finance.totalExpenditure), 'neu', 'si-green')
  ].join('');
  const expenseRows = finance.recentExpenses.length ? finance.recentExpenses.map(row => `
          <tr>
            <td>${escapeHtml(row.expense_date || '')}</td><td>${escapeHtml(row.description || '')}</td>
            <td><span class="badge b-info">${escapeHtml(row.category || 'Other')}</span></td>
            <td style="font-weight:700;color:var(--danger)">${money(row.amount || 0)}</td>
            <td>${escapeHtml(row.recorded_by || '')}</td>
            <td><span class="badge b-success">Recorded</span></td>
          </tr>`).join('') : '<tr><td colspan="6" style="text-align:center;color:var(--gray-400);padding:18px">No expense records found.</td></tr>';

  return hdr('Expenses', 'Record and manage school expenditure', 'Expenses') +
    renderPageTemplate('pages/finance/expenses/index.html', { statsCards, expenseRows });
}

// BALANCE SHEET
function balanceSheetModule() {
  const finance = getFinanceSummary();
  const incomeRows = finance.incomeBreakdown.map(row => `
          <tr><td>${escapeHtml(row.source || 'Income')}</td><td style="font-weight:700;color:var(--success)">${money(row.amount || 0)}</td><td><span class="badge b-info">${financePct(row.amount, finance.totalIncome)}</span></td></tr>`).join('') || '<tr><td colspan="3" style="text-align:center;color:var(--gray-400);padding:12px">No income records found.</td></tr>';
  const expenditureRows = finance.expenseBreakdown.map(row => `
          <tr><td>${escapeHtml(row.category || 'Expense')}</td><td style="font-weight:700;color:var(--danger)">${money(row.amount || 0)}</td><td><span class="badge b-gray">${financePct(row.amount, finance.totalExpenditure)}</span></td></tr>`).join('') || '<tr><td colspan="3" style="text-align:center;color:var(--gray-400);padding:12px">No expenditure records found.</td></tr>';
  return hdr('Balance Sheet', 'Financial position of the school', 'Balance Sheet') + `
  <div class="g2 mb20">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-money-bill"></i> Income - ${escapeHtml(finance.term)} ${escapeHtml(finance.academicYear)}</span></div>
      <table class="tbl">
        <thead><tr><th>Source</th><th>Amount</th><th>%</th></tr></thead>
        <tbody>
          ${incomeRows}
          <tr style="background:var(--blue-xpale)"><td style="font-weight:800">TOTAL INCOME</td><td style="font-weight:800;color:var(--blue-dark)">${money(finance.totalIncome)}</td><td>100%</td></tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-chart-line"></i> Expenditure - ${escapeHtml(finance.term)} ${escapeHtml(finance.academicYear)}</span></div>
      <table class="tbl">
        <thead><tr><th>Category</th><th>Amount</th><th>%</th></tr></thead>
        <tbody>
          ${expenditureRows}
          <tr style="background:#fff1f2"><td style="font-weight:800">TOTAL EXPENDITURE</td><td style="font-weight:800;color:var(--danger)">${money(finance.totalExpenditure)}</td><td>100%</td></tr>
        </tbody>
      </table>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">
    <div class="fee-hero">
      <h3>Total Income</h3>
      <div class="amount">${money(finance.totalIncome)}</div>
      <div class="sub">${escapeHtml(finance.term)} ${escapeHtml(finance.academicYear)}</div>
    </div>
    <div class="fee-hero" style="background:linear-gradient(135deg,#991b1b,var(--danger))">
      <h3>Total Expenditure</h3>
      <div class="amount">${money(finance.totalExpenditure)}</div>
      <div class="sub">${escapeHtml(finance.term)} ${escapeHtml(finance.academicYear)}</div>
    </div>
    <div class="fee-hero" style="background:linear-gradient(135deg,#065f46,var(--success))">
      <h3>Net Surplus</h3>
      <div class="amount">${money(finance.netSurplus)}</div>
      <div class="sub">After all expenses</div>
    </div>
  </div>`;
}

// ALUMNI DIRECTORY
function alumniDirectory() {
  return `<div class="toolbar">
    <button class="btn btn-primary" onclick="toggleAddAlumniForm()"><i class="fas fa-plus"></i> Add Alumni</button>
    <div class="search-bar" style="flex:1;min-width:200px"><span><i class="fas fa-search"></i></span><input id="alumni-search" placeholder="Search alumni..." onkeyup="filterAlumni()"></div>
    <select id="alumni-year-filter" class="select-sm" onchange="filterAlumni()"><option value="">All Years</option><option value="2021">Class of 2021</option><option value="2020">Class of 2020</option><option value="2019">Class of 2019</option><option value="2018">Class of 2018</option><option value="2017">Class of 2017</option><option value="2016">Class of 2016</option><option value="2015">Class of 2015</option><option value="2014">Class of 2014</option><option value="2013">Class of 2013</option><option value="2012">Class of 2012</option></select>
    <select id="alumni-profession-filter" class="select-sm" onchange="filterAlumni()"><option value="">All Professions</option><option value="Software Engineer">Engineering</option><option value="Medical Doctor">Medicine</option><option value="Lawyer">Law</option><option value="Teacher">Education</option><option value="Nurse">Healthcare</option><option value="Business">Business</option></select>
  </div>

  <!-- ADD ALUMNI FORM -->
  <div id="alumni-form-wrap" style="display:none;margin-bottom:20px">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-user-plus"></i> Add New Alumni</span></div>
      <div class="form-grid">
        <div class="form-field"><label>Full Name *</label><input type="text" id="alumni-name" placeholder="Full name"></div>
        <div class="form-field"><label>Class Year *</label><input type="number" id="alumni-year" placeholder="2020" min="1985" max="2024"></div>
        <div class="form-field"><label>Profession *</label><input type="text" id="alumni-profession" placeholder="e.g., Software Engineer"></div>
        <div class="form-field"><label>Location *</label><input type="text" id="alumni-location" placeholder="City Â· Organization"></div>
        <div class="form-field"><label>Email *</label><input type="email" id="alumni-email" placeholder="email@example.com"></div>
        <div class="form-field"><label>Phone *</label><input type="tel" id="alumni-phone" placeholder="+233 XXX XXX XXXX"></div>
        <div class="form-field"><label>Instagram Handle</label><input type="text" id="alumni-instagram" placeholder="@username"></div>
        <div class="form-field"><label>LinkedIn Profile</label><input type="text" id="alumni-linkedin" placeholder="linkedin.com/in/username"></div>
        <div class="form-field"><label>Twitter Handle</label><input type="text" id="alumni-twitter" placeholder="@username"></div>
        <div class="form-field"><label>Facebook URL</label><input type="text" id="alumni-facebook" placeholder="facebook.com/username"></div>
        <div class="form-field" style="grid-column:1/-1"><label>Bio</label><textarea id="alumni-bio" placeholder="Brief biography..." style="min-height:60px;font-family:Poppins,sans-serif;border:1.5px solid var(--gray-200);border-radius:6px;padding:8px;font-size:12px"></textarea></div>
        <div style="grid-column:1/-1;display:flex;gap:8px">
          <button class="btn btn-primary" style="flex:1" onclick="submitAlumni()"><i class="fas fa-check"></i> Add Alumni Member</button>
          <button class="btn btn-secondary" style="flex:1" onclick="toggleAddAlumniForm()">Cancel</button>
        </div>
      </div>
    </div>
  </div>

  <div class="g3" id="alumni-grid">
    ${Object.values(ALUMNI_DATA).map(a => `
    <div class="card alumni-card" data-name="${a.name.toLowerCase()}" data-year="${a.classYear}" data-profession="${a.profession.toLowerCase()}" style="cursor:pointer" onclick="if(!event.target.closest('button')) showAlumniProfile('${a.id}')">
      <div style="display:flex;gap:12px;margin-bottom:14px">
        <div class="av av-lg av-${a.avatarColor}">${a.avatar}</div>
        <div><div style="font-size:14px;font-weight:700;color:var(--blue-dark)">${a.name}</div>
        <span class="badge b-info" style="margin-top:4px">Class of ${a.classYear}</span></div>
      </div>
      <div style="font-size:13px;font-weight:600;margin-bottom:4px">${a.profession}</div>
      <div style="font-size:11px;color:var(--gray-400);margin-bottom:14px"><i class="fas fa-map-pin"></i> ${a.location}</div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-secondary btn-xs" style="flex:1" onclick="showAlumniProfile('${a.id}')">Profile</button>
        <button class="btn btn-primary btn-xs" style="flex:1" onclick="showConnectModal('${a.id}')">Connect</button>
      </div>
    </div>`).join('')}
  </div>`;
}

// DONATIONS MODULE
function donationsModule() {
  return hdr('Donations', 'Alumni and external donations to the school', 'Donations') + `
  <div class="stats-row">
    ${statCard('<i class="fas fa-handshake"></i>', 'GHâ‚µ42K', 'Total Donations', 'This year', 'up', 'si-blue')}
    ${statCard('<i class="fas fa-users"></i>', '48', 'Total Donors', 'Alumni donors', 'up', 'si-gold')}
    ${statCard('<i class="fas fa-target"></i>', 'GHâ‚µ100K', 'Annual Target', '42% achieved', 'neu', 'si-green')}
    ${statCard('<i class="fas fa-calendar-alt"></i>', '3', 'Active Campaigns', 'Current drives', 'neu', 'si-purple')}
  </div>
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-handshake"></i> Donation Records</span><button class="btn btn-primary btn-sm">+ Record Donation</button></div>
    <table class="tbl">
      <thead><tr><th>Donor</th><th>Class</th><th>Amount</th><th>Campaign</th><th>Date</th><th>Status</th></tr></thead>
      <tbody>
        ${[['Abena Owusu', 'Class 2018', 'GHâ‚µ5,000', 'Library Fund', 'Mar 10', 'Received'], ['Kwabena Asare', 'Class 2016', 'GHâ‚µ10,000', 'Scholarship Fund', 'Mar 5', 'Received'], ['Anonymous Alumni', 'â€”', 'GHâ‚µ2,000', 'General Fund', 'Feb 28', 'Received'], ['Kofi Antwi', 'Class 2014', 'GHâ‚µ3,500', 'ICT Lab', 'Feb 20', 'Received']].map(([n, c, a, camp, d, s]) => `
        <tr>
          <td><strong>${n}</strong></td>
          <td><span class="badge b-info">${c}</span></td>
          <td style="font-weight:700;color:var(--success)">${a}</td>
          <td>${camp}</td><td>${d}</td>
          <td><span class="badge b-success">${s}</span></td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

// JOB BOARD
function jobBoardModule() {
  return hdr('Job Board', 'Career opportunities from the alumni network', 'Job Board') + `
  <div class="toolbar">
    <button class="btn btn-primary">+ Post Job</button>
    <div class="search-bar"><span><i class="fas fa-search"></i></span><input placeholder="Search jobs..."></div>
    <select class="select-sm"><option>All Industries</option><option>Tech</option><option>Health</option><option>Education</option></select>
  </div>
  <div style="display:flex;flex-direction:column;gap:14px">
    ${[['Software Developer Intern', 'Accra Â· Remote possible', '0â€“2 years', 'Technology', 'GHâ‚µ1,500/mo', 'Today', 'Abena Owusu (Class 2018)'], ['Medical Resident', 'Korle Bu Teaching Hospital, Accra', 'Graduate', 'Healthcare', 'Competitive', '2 days ago', 'Kwabena Asare (Class 2016)'], ['Junior Secondary School Teacher', 'Kumasi Â· Full Time', 'PGDE required', 'Education', 'GHâ‚µ2,800/mo', '1 week ago', 'Esi Mensah (Class 2020)'], ['Civil Engineering Graduate Trainee', 'Takoradi Â· Full Time', '0â€“2 years', 'Engineering', 'GHâ‚µ4,000/mo', '2 weeks ago', 'Kofi Antwi (Class 2014)']].map(([t, l, exp, ind, sal, d, poster]) => `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px">
        <div style="flex:1">
          <div style="font-size:15px;font-weight:800;color:var(--blue-dark);margin-bottom:8px">${t}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">
            <span class="badge b-info"><i class="fas fa-map-pin"></i> ${l}</span>
            <span class="badge b-gray"><i class="fas fa-stopwatch"></i> ${exp}</span>
            <span class="badge b-success"><i class="fas fa-money-bill"></i> ${sal}</span>
            <span class="badge b-warning">${ind}</span>
          </div>
          <div style="font-size:11px;color:var(--gray-400)">Posted by ${poster} Â· ${d}</div>
        </div>
        <div style="display:flex;gap:6px;flex-shrink:0">
          <button class="btn btn-secondary btn-sm">Details</button>
          <button class="btn btn-primary btn-sm" onclick="applyJob(this)">Apply</button>
        </div>
      </div>
    </div>`).join('')}
  </div>`;
}

function applyJob(btn) {
  btn.innerHTML = '<i class="fas fa-check"></i> Applied';
  btn.className = 'btn btn-outline btn-sm';
  btn.disabled = true;
  showToast('<i class="fas fa-file-upload"></i> Application Submitted Successfully!', 'success');
}

// CERTIFICATES MODULE
function certificatesModule() {
  return hdr('Certificate Requests', 'Request and track official school certificates', 'Certificates') + `
  <div class="g21">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-scroll"></i> My Requests</span></div>
      <table class="tbl">
        <thead><tr><th>Certificate Type</th><th>Purpose</th><th>Date Requested</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          ${[['WASSCE Result Slip', 'Job Application', 'Mar 10, 2025', 'Ready', 'download'], ['Transcript', 'University Admission', 'Mar 5, 2025', 'Processing', 'â€”'], ['Character Reference', 'Visa Application', 'Feb 28, 2025', 'Ready', 'download']].map(([t, p, d, s, a]) => `
          <tr>
            <td style="font-weight:600">${t}</td><td>${p}</td><td>${d}</td>
            <td><span class="badge ${s === 'Ready' ? 'b-success' : 'b-warning'}">${s}</span></td>
            <td>${a === 'download' ? `<button class="btn btn-primary btn-xs"><i class="fas fa-download"></i> Download</button>` : 'Awaiting'}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-plus"></i> New Request</span></div>
      <div class="f-field" style="margin-bottom:12px"><label>Certificate Type</label><select><option>WASSCE Result Slip</option><option>Transcript</option><option>Character Reference</option><option>Graduation Certificate</option></select></div>
      <div class="f-field" style="margin-bottom:12px"><label>Purpose / Reason</label><input placeholder="e.g. Job application, University admission..."></div>
      <div class="f-field" style="margin-bottom:12px"><label>Urgency</label><select><option>Normal (5-7 business days)</option><option>Urgent (2-3 business days)</option></select></div>
      <div class="f-field" style="margin-bottom:14px"><label>Additional Notes</label><textarea placeholder="Any special instructions..."></textarea></div>
      <button class="btn btn-primary" style="width:100%">Submit Request</button>
    </div>
  </div>`;
}

// ALUMNI PUBLIC MODULE
function alumniPubModule() {
  return `<div class="visitor-hero" style="margin-bottom:26px">
    <h1><i class="fas fa-medal"></i> Our Distinguished Alumni</h1>
    <p>Glory Reign Preparatory School alumni are making their mark across Ghana and around the world. Join our growing network of over 5,200 graduates.</p>
    <div class="hero-btns">
      <button class="hero-btn-gold" onclick="openAlumniDirectory()">Connect with Alumni</button>
      <button class="hero-btn-outline" onclick="showToast('<i class=\\'fas fa-check-circle\\'></i> Alumni association details opened', 'success')">Alumni Association</button>
    </div>
  </div>`+ alumniDirectory();
}




