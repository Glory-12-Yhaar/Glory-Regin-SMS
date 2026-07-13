
// -----------------------------------
// VISITOR HOME
// -----------------------------------
const HERO_SLIDES_KEY = 'gr_hero_slides';

function getHeroSlides() {
  try {
    const saved = localStorage.getItem(HERO_SLIDES_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return [
    {
      id: 1,
      title: 'Glory Reign Preparatory School',
      caption: 'Nurturing minds, building character, and shaping futures.',
      image: 'assets/images/Hero.jpeg',
      status: 'Active',
      created: '2026-07-06'
    }
  ];
}

function saveHeroSlides(slides) {
  localStorage.setItem(HERO_SLIDES_KEY, JSON.stringify(slides));
}

function getActiveHeroSlide() {
  const slides = getHeroSlides();
  return slides.find(slide => slide.status === 'Active') || slides[0] || null;
}

function heroSlidesModule() {
  const slides = getHeroSlides();
  const rows = slides.map(slide => `
    <div class="hero-slide-item">
      <div class="hero-slide-thumb" style="background-image:url('${escapeAttr(slide.image)}')"></div>
      <div class="hero-slide-meta">
        <div style="font-size:14px;font-weight:800;color:var(--blue-dark)">${escapeHtml(slide.title)}</div>
        <div style="font-size:12px;color:var(--gray-500);line-height:1.5">${escapeHtml(slide.caption || '')}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
          <span class="badge b-${slide.status === 'Active' ? 'success' : 'warning'}">${escapeHtml(slide.status || 'Draft')}</span>
          <span class="badge b-info">${escapeHtml(slide.created || '')}</span>
        </div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end">
        <button class="btn btn-secondary btn-xs" onclick="setHeroSlideActive(${slide.id})"><i class="fas fa-check"></i> Use</button>
        <button class="btn btn-danger btn-xs" onclick="deleteHeroSlide(${slide.id})"><i class="fas fa-trash"></i> Delete</button>
      </div>
    </div>
  `).join('');

  return hdr('Hero Slide Management', 'Upload and delete visitor homepage background images', 'Hero Slides') + `
  <div class="g21">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-images"></i> Homepage Background Images</span></div>
      ${rows || '<div style="padding:26px;text-align:center;color:var(--gray-400)">No hero slides uploaded yet.</div>'}
    </div>
    <div class="card" style="height:fit-content;position:sticky;top:100px">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-upload"></i> Upload Hero Image</span></div>
      <div class="f-field" style="margin-bottom:12px"><label>Slide Title</label><input id="hero-slide-title" placeholder="Homepage headline"></div>
      <div class="f-field" style="margin-bottom:12px"><label>Caption</label><textarea id="hero-slide-caption" style="min-height:80px" placeholder="Short welcome message"></textarea></div>
      <div class="f-field" style="margin-bottom:12px"><label>Background Image</label><input id="hero-slide-file" type="file" accept="image/*"></div>
      <button class="btn btn-primary" style="width:100%" onclick="uploadHeroSlide()"><i class="fas fa-cloud-upload-alt"></i> Upload Slide</button>
    </div>
  </div>`;
}

function getFinanceSummary() {
  const payments = (typeof getPayments === 'function') ? getPayments() : [];
  const collected = payments
    .filter(p => ['Paid', 'Partial'].includes(p.status))
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const outstandingRecords = payments.filter(p => p.status === 'Pending');
  const partialRecords = payments.filter(p => p.status === 'Partial');
  const paidRecords = payments.filter(p => p.status === 'Paid');
  const averageFee = payments.length
    ? Math.max(...payments.map(p => Number(p.amount) || 0), 2400)
    : 2400;
  const outstanding = outstandingRecords.length * averageFee + partialRecords.reduce((sum, p) => {
    return sum + Math.max(averageFee - (Number(p.amount) || 0), 0);
  }, 0);
  const expenses = Math.round(collected * 0.36);
  return {
    payments,
    collected,
    outstanding,
    expenses,
    net: collected - expenses,
    paidCount: paidRecords.length,
    partialCount: partialRecords.length,
    pendingCount: outstandingRecords.length,
    totalCount: payments.length || 1
  };
}

function initDashboardInteractivity() {
  const root = document.getElementById('main-content');
  if (!root) return;
  root.querySelectorAll('.prog-fill').forEach(fill => {
    if (fill.dataset.animated === '1') return;
    const targetWidth = fill.style.width || fill.getAttribute('data-width') || '0%';
    fill.dataset.animated = '1';
    fill.style.width = '0%';
    requestAnimationFrame(() => { fill.style.width = targetWidth; });
  });
  root.querySelectorAll('[data-animate-height]').forEach(bar => {
    if (bar.dataset.animated === '1') return;
    const targetHeight = bar.dataset.animateHeight || bar.style.height || '0px';
    bar.dataset.animated = '1';
    bar.style.height = '0px';
    requestAnimationFrame(() => { bar.style.height = targetHeight; });
  });
  root.querySelectorAll('[data-ring-value]').forEach(ring => {
    if (ring.dataset.animated === '1') return;
    const value = Math.max(0, Math.min(100, Number(ring.dataset.ringValue) || 0));
    const circumference = Number(ring.dataset.ringCircumference) || 314;
    ring.dataset.animated = '1';
    ring.style.strokeDasharray = `0 ${circumference}`;
    requestAnimationFrame(() => {
      ring.style.strokeDasharray = `${circumference * value / 100} ${circumference}`;
    });
  });
}

function uploadHeroSlide() {
  const title = document.getElementById('hero-slide-title')?.value?.trim() || 'Glory Reign Preparatory School';
  const caption = document.getElementById('hero-slide-caption')?.value?.trim() || 'Nurturing minds, building character, and shaping futures.';
  const file = document.getElementById('hero-slide-file')?.files?.[0];
  if (!file) {
    showToast('<i class="fas fa-exclamation-triangle"></i> Please choose an image to upload', 'warning');
    return;
  }
  if (!file.type.startsWith('image/')) {
    showToast('<i class="fas fa-exclamation-triangle"></i> Only image files are allowed', 'warning');
    return;
  }
  const reader = new FileReader();
  reader.onload = function (event) {
    const slides = getHeroSlides().map(slide => ({ ...slide, status: 'Draft' }));
    slides.unshift({
      id: Date.now(),
      title,
      caption,
      image: event.target.result,
      status: 'Active',
      created: new Date().toISOString().split('T')[0]
    });
    saveHeroSlides(slides);
    showToast('<i class="fas fa-check-circle"></i> Hero slide uploaded', 'success');
    renderMain();
  };
  reader.readAsDataURL(file);
}

function setHeroSlideActive(slideId) {
  const slides = getHeroSlides().map(slide => ({ ...slide, status: slide.id === slideId ? 'Active' : 'Draft' }));
  saveHeroSlides(slides);
  showToast('<i class="fas fa-check-circle"></i> Homepage hero updated', 'success');
  renderMain();
}

function deleteHeroSlide(slideId) {
  if (!confirm('Delete this hero background image?')) return;
  const slides = getHeroSlides().filter(slide => slide.id !== slideId);
  if (slides.length && !slides.some(slide => slide.status === 'Active')) slides[0].status = 'Active';
  saveHeroSlides(slides);
  showToast('<i class="fas fa-check-circle"></i> Hero slide deleted', 'success');
  renderMain();
}

function visitorHome() {
  const hero = getActiveHeroSlide();
  const heroStyle = hero?.image ? ` style="background-image:linear-gradient(135deg,rgba(10,34,64,.82),rgba(26,86,219,.62)),url('${escapeAttr(hero.image)}')"` : '';
  const sourceArticles = (typeof newsArticles === 'undefined') ? [] : newsArticles;
  const publishedArticles = sourceArticles.filter(article => article.status === 'Published').slice(0, 3);
  const schoolInfo = (typeof SETTINGS_DATA === 'undefined') ? {} : (SETTINGS_DATA.schoolInfo || {});
  const schoolPhone = schoolInfo.phone || '0243611971 / 0205096091';
  const schoolEmail = schoolInfo.email || SCHOOL_EMAIL;
  const schoolAddress = schoolInfo.address || 'P.O. Box 42, Jirapa, Upper West Region, Ghana';
  return `<section id="home-section" class="public-section">
  <div class="visitor-hero visitor-hero-photo"${heroStyle}>
    <h1>${escapeHtml(hero?.title || 'Glory Reign Preparatory School')}</h1>
    <p>${escapeHtml(hero?.caption || 'Nurturing minds, building character, and shaping futures since 1985. A premier educational institution in Ghana known for academic excellence and holistic development.')}</p>
    <div class="hero-btns">
      <button class="hero-btn-gold" onclick="publicNavToSection('admission-section')">Apply for Admission</button>
      <button class="hero-btn-outline" onclick="publicNavToSection('about-section')">Learn More About Us</button>
      <button class="hero-btn-outline" onclick="logout()"><i class="fas fa-lock"></i> Login to Portal</button>
    </div>
  </div>
  </section>
  <div class="stats-row mb24">
    ${statCard('<i class="fas fa-graduation-cap"></i>', '5,200+', 'Alumni Worldwide', 'And growing', 'up', 'si-blue')}
    ${statCard('<i class="fas fa-chalkboard-user"></i>', '64', 'Expert Teachers', 'Dedicated faculty', 'neu', 'si-gold')}
    ${statCard('<i class="fas fa-trophy"></i>', '98%', 'Pass Rate', 'Consistent excellence', 'up', 'si-green')}
    ${statCard('<i class="fas fa-calendar-alt"></i>', '40', 'Years of Excellence', 'Since 1985', 'neu', 'si-purple')}
  </div>
  <section id="about-section" class="public-section">
    <div class="section-title"><h2>About Our School</h2><p>Our mission, vision, values and story in one place.</p></div>
    <div class="g3 mb24">
      ${[['<i class="fas fa-compass"></i>', 'Our Mission', 'To provide a gracious, caring, disciplined and serene environment that helps the Ghanaian child excel academically, morally, spiritually and socially.'], ['<i class="fas fa-eye"></i>', 'Our Vision', 'To provide a strong and excellent foundation for every child to become a great future leader.'], ['<i class="fas fa-gem"></i>', 'Our Values', 'Excellence, integrity, innovation, teamwork, service, respect and human dignity.']].map(([i, t, d]) => `
      <div class="card" style="text-align:center">
        <div style="font-size:40px;margin-bottom:14px;color:var(--blue-main)">${i}</div>
        <h3 style="font-size:15px;font-weight:700;color:var(--blue-dark);margin-bottom:8px">${t}</h3>
        <p style="font-size:12.5px;color:var(--gray-500);line-height:1.7">${d}</p>
      </div>`).join('')}
    </div>
    <div class="card"><div class="card-hdr"><span class="card-title"><i class="fas fa-scroll"></i> Our History</span></div><p style="font-size:13.5px;color:var(--gray-600);line-height:1.8">Glory Reign Preparatory School has grown into a respected learning community with dedicated teachers, strong family partnerships, and a consistent focus on academic and character formation.</p></div>
  </section>
  <section id="admission-section" class="public-section">
    <div class="section-title"><h2>Admissions</h2><p>Applications are open for the 2025/2026 academic year.</p></div>
    <div class="g2">
      <div class="card"><div class="card-hdr"><span class="card-title"><i class="fas fa-clipboard-list"></i> Entry Requirements</span></div>${[['Birth Certificate', 'Original and photocopy'], ['Passport Photographs', '2 recent passport-sized photographs'], ['Medical Certificate', 'Current health status from a certified physician'], ['Character Reference', 'Letter from previous school or guardian']].map(([t, d]) => `<div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--gray-100)"><span style="color:var(--success);font-weight:800"><i class="fas fa-check"></i></span><div><div style="font-size:13px;font-weight:600">${t}</div><div style="font-size:11px;color:var(--gray-400)">${d}</div></div></div>`).join('')}</div>
      <div class="card"><div class="card-hdr"><span class="card-title"><i class="fas fa-file-alt"></i> Quick Application</span></div><div class="f-row"><div class="f-field"><label>First Name</label><input placeholder="First name"></div><div class="f-field"><label>Last Name</label><input placeholder="Last name"></div></div><div class="f-row"><div class="f-field"><label>Parent/Guardian</label><input placeholder="Full name"></div><div class="f-field"><label>Contact</label><input placeholder="+233..."></div></div><div class="f-field" style="margin-bottom:12px"><label>Email</label><input placeholder="email@example.com"></div><button class="btn btn-primary" style="width:100%" onclick="showToast('<i class=\\'fas fa-check-circle\\'></i> Application received. Admissions will contact you.', 'success')">Submit Application</button></div>
    </div>
  </section>
  <section id="gallery-section" class="public-section">
    <div class="section-title"><h2>Gallery</h2><p>A quick look at school life, learning and celebrations.</p></div>
    <div class="g3">${['assets/images/student.jpeg', 'assets/images/teacher.jpeg', 'assets/images/Hero.jpeg'].map((img, i) => `<div class="public-gallery-tile" style="background-image:url('${img}')"><span>${['Students', 'Teachers', 'Campus Life'][i]}</span></div>`).join('')}</div>
  </section>
  <section id="news-section" class="public-section">
    <div class="section-title"><h2>News</h2><p>Latest stories from Glory Reign Preparatory School.</p></div>
    <div class="g3">${publishedArticles.map(article => `<div class="card"><div class="news-card-icon">${article.icon}</div><h3 style="font-size:14px;font-weight:700;color:var(--blue-dark);margin-bottom:8px">${escapeHtml(article.title)}</h3><p style="font-size:12px;color:var(--gray-500);line-height:1.6;margin-bottom:10px">${escapeHtml(article.desc)}</p><button class="btn btn-secondary btn-xs" onclick="showNewsArticleById(${article.id})">Read More</button></div>`).join('')}</div>
  </section>
  <section id="contact-section" class="public-section">
    <div class="section-title"><h2>Contact</h2><p>Reach the school office for admissions, visits and general enquiries.</p></div>
    <div class="g2"><div class="card"><div class="card-hdr"><span class="card-title"><i class="fas fa-phone"></i> School Office</span></div><p style="font-size:13px;color:var(--gray-600);line-height:1.8">Phone: ${escapeHtml(schoolPhone)}<br>Email: ${escapeHtml(schoolEmail)}<br>Location: ${escapeHtml(schoolAddress)}</p></div><div class="card contact-form"><div class="f-field" style="margin-bottom:10px"><label>Full Name</label><input placeholder="Full name"></div><div class="f-field" style="margin-bottom:10px"><label>Email</label><input placeholder="your@email.com"></div><div class="f-field" style="margin-bottom:10px"><label>Subject</label><input placeholder="What is this about?"></div><div class="f-field" style="margin-bottom:12px"><label>Message</label><textarea placeholder="Type your message"></textarea></div><button class="btn btn-primary" onclick="sendContactMessage()">Send Message</button></div></div>
  </section>`;
}


// -----------------------------------
// ADMISSIONS MODULE
// -----------------------------------
function admissionsModule() {
  const approved = admissionsData.filter(a => a.status === 'Approved').length;
  const pending = admissionsData.filter(a => a.status === 'Pending').length;
  const rejected = admissionsData.filter(a => a.status === 'Rejected').length;
  return hdr('Admissions Module', 'Process new student admissions and generate student IDs', 'Admissions') + `
  <div class="stats-row">
    ${statCard('<i class="fas fa-clipboard-list"></i>', '12', 'Total Applications', 'This academic year', 'neu', 'si-blue')}
    ${statCard('<i class="fas fa-check-circle"></i>', '' + approved, 'Approved', 'Ready for enrollment', 'up', 'si-green')}
    ${statCard('<i class="fas fa-hourglass-half"></i>', '' + pending, 'Pending', 'Awaiting review', 'neu', 'si-gold')}
    ${statCard('<i class="fas fa-times-circle"></i>', '' + rejected, 'Rejected', 'Did not meet criteria', 'dn', 'si-red')}
  </div>
  <div class="toolbar">
    <button class="btn btn-primary" onclick="toggleAdmForm()"><i class="fas fa-plus"></i> New Admission Form</button>
    <button class="btn btn-secondary" onclick="showAdmissionStatistics()"><i class="fas fa-chart-bar"></i> Statistics</button>
    <button class="btn btn-secondary" onclick="exportAdmissionsToCSV()" style="cursor:pointer"><i class="fas fa-download"></i> CSV</button>
    <button class="btn btn-secondary" onclick="exportAdmissionsToExcel()" style="cursor:pointer"><i class="fas fa-chart-bar"></i> Excel</button>
    <button class="btn btn-secondary" onclick="downloadAdmissionsPDF()" style="cursor:pointer"><i class="fas fa-file-pdf"></i> PDF</button>
    <div class="search-bar"><span><i class="fas fa-magnifying-glass"></i></span><input id="adm-search" placeholder="Search by name or ID..." onkeyup="filterAdmissions()" style="cursor:text"></div>
  </div>
  
  <!-- FORM -->
  <div id="adm-form-wrap" style="display:none;margin-bottom:20px">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-file-alt"></i> New Admission Form</span></div>
      <div class="form-grid">
        <div style="grid-column:1/-1">
          <h3 style="color:var(--blue-dark);font-size:14px;font-weight:700;margin-bottom:12px"><i class="fas fa-user"></i> Student Personal Details</h3>
        </div>
        <div class="form-field">
          <label>Full Name *</label>
          <input type="text" id="adm-name" placeholder="Enter full name as on birth certificate">
        </div>
        <div class="form-field">
          <label>Date of Birth *</label>
          <input type="date" id="adm-dob">
        </div>
        <div class="form-field">
          <label>Gender *</label>
          <select id="adm-gender">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div class="form-field">
          <label>Class Applying For *</label>
          <select id="adm-class">
            <option value="Early Childhood">Early Childhood</option>
            <option value="Primary 1">Primary 1</option>
            <option value="Primary 2">Primary 2</option>
            <option value="Primary 3">Primary 3</option>
            <option value="Primary 4">Primary 4</option>
            <option value="Primary 5">Primary 5</option>
            <option value="Primary 6">Primary 6</option>
            <option value="JHS 1">JHS 1</option>
            <option value="JHS 2">JHS 2</option>
            <option value="JHS 3">JHS 3</option>
          </select>
        </div>
        <div class="form-field">
          <label>Previous School (If any)</label>
          <input type="text" id="adm-prev-school" placeholder="Name of previous school attended">
        </div>
        
        <div style="grid-column:1/-1;margin-top:10px">
          <h3 style="color:var(--blue-dark);font-size:14px;font-weight:700;margin-bottom:12px"><i class="fas fa-users"></i> Parent / Guardian Details</h3>
        </div>
        <div class="form-field">
          <label>Parent/Guardian Full Name *</label>
          <input type="text" id="adm-parent-name" placeholder="Enter parent full name">
        </div>
        <div class="form-field">
          <label>Contact Phone Number *</label>
          <input type="tel" id="adm-parent-phone" placeholder="e.g. +233 24 000 0000">
        </div>
        <div class="form-field">
          <label>Email Address</label>
          <input type="email" id="adm-parent-email" placeholder="e.g. parent@email.com">
        </div>
        <div class="form-field">
          <label>Residential Address</label>
          <input type="text" id="adm-parent-address" placeholder="Enter house number / area">
        </div>
        <div class="form-field" style="display:flex;align-items:center;gap:12px;margin-top:16px">
          <div>
            <label style="cursor:pointer;background:var(--gray-100);padding:8px 16px;border-radius:6px;font-size:12px;font-weight:600;color:var(--blue-dark);border:1.5px dashed var(--gray-300)" for="adm-pic-input"><i class="fas fa-upload"></i> Upload Passport Photo</label>
            <input type="file" id="adm-pic-input" accept="image/*" style="display:none" onchange="previewAdmPic(event)">
          </div>
          <div>
            <div id="adm-pic-preview" style="width:80px;height:100px;background:var(--gray-100);border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--gray-400);font-size:32px;overflow:hidden;flex-shrink:0"><i class="fas fa-camera"></i></div>
          </div>
        </div>
        <div class="form-field" style="grid-column:1/-1">
          <label>Medical Conditions / Special Needs</label>
          <textarea id="adm-medical" placeholder="Any health issues or special requirements?" style="min-height:60px;font-family:Poppins,sans-serif;border:1.5px solid var(--gray-200);border-radius:6px;padding:8px;font-size:12px"></textarea>
        </div>
        
        <div style="grid-column:1/-1;display:flex;gap:8px;margin-top:16px">
          <button class="btn btn-primary" style="flex:1" onclick="submitAdmission()"><i class="fas fa-check"></i> Submit Application</button>
          <button class="btn btn-secondary" style="flex:1" onclick="toggleAdmForm()">Cancel</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- PENDING ADMISSIONS -->
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-hourglass-half"></i> Pending Admissions</span></div>
    <table class="tbl" style="font-size:12px">
      <thead>
        <tr>
          <th>#</th>
          <th>Application No.</th>
          <th>Student Name</th>
          <th>DOB</th>
          <th>Class Applying</th>
          <th>Parent</th>
          <th>Date Applied</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="pending-admissions-tbody">
        ${admissionsData.filter(a => a.status === 'Pending').map((a, i) => '<tr style="cursor:pointer" onclick="if(!event.target.closest(\'button\')) viewAdmissionDetail(\'' + a.adm_id + '\')"><td style="color:var(--gray-400)">' + ((i + 1)) + '</td><td style="font-weight:600;color:var(--blue-dark)">' + a.adm_id + '</td><td>' + a.name + '</td><td style="font-size:11px">' + a.dob + '</td><td><span class="badge b-info">' + a.class_applying + '</span></td><td style="font-size:11px">' + a.parent_name + '</td><td style="font-size:11px;color:var(--gray-500)">' + a.created + '</td><td><span class="badge b-warning"><i class=\"fas fa-hourglass-half\"></i> Pending</span></td><td><div style="display:flex;gap:4px"><button class="btn btn-primary btn-xs" onclick="approveAdmission(\'' + a.adm_id + '\', \'' + a.name + '\')"><i class=\"fas fa-check\"></i> Approve</button><button class="btn btn-danger btn-xs" onclick="rejectAdmission(\'' + a.adm_id + '\')"><i class=\"fas fa-times\"></i> Reject</button></div></td></tr>').join('')}
      </tbody>
    </table>
  </div>
  
  <!-- APPROVED ADMISSIONS (READY FOR ENROLLMENT) -->
  <div class="card" style="margin-top:20px">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-check-circle"></i> Approved Admissions (Ready for Enrollment)</span></div>
    <table class="tbl" style="font-size:12px">
      <thead>
        <tr>
          <th>#</th>
          <th>Application No.</th>
          <th>Generated Student ID</th>
          <th>Student Name</th>
          <th>Class</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="approved-admissions-tbody">
        ${admissionsData.filter(a => a.status === 'Approved').map((a, i) => '<tr style="cursor:pointer" onclick="if(!event.target.closest(\'button\')) viewAdmissionDetail(\'' + a.adm_id + '\')"><td style="color:var(--gray-400)">' + ((i + 1)) + '</td><td style="font-weight:600;color:var(--blue-dark)">' + a.adm_id + '</td><td style="font-weight:700;color:var(--success)">' + generateStudentID(a.class_applying, '' + admissionsData.indexOf(a)) + '</td><td>' + a.name + '</td><td><span class="badge b-info">' + a.class_applying + '</span></td><td><span class="badge b-success"><i class=\"fas fa-check-circle\"></i> Approved</span></td><td><div style="display:flex;gap:4px"><button class="btn btn-secondary btn-xs" onclick="alert(\'Printing admission slip for ' + a.name + '...\')"><i class=\"fas fa-print\"></i> Print Slip</button><button class="btn btn-primary btn-xs" onclick="enrollStudent(\'' + a.adm_id + '\')"><i class=\"fas fa-book\"></i> Enroll</button></div></td></tr>').join('')}
      </tbody>
    </table>
  </div>
  
  <!-- REJECTED & WITHDRAWN -->
  <div class="card" style="margin-top:20px">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-times-circle"></i> Rejected / Withdrawn</span></div>
    <table class="tbl" style="font-size:12px">
      <thead>
        <tr>
          <th>#</th>
          <th>Application No.</th>
          <th>Student Name</th>
          <th>Class Applied</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody id="rejected-admissions-tbody">
        ${admissionsData.filter(a => a.status === 'Rejected').map((a, i) => '<tr style="cursor:pointer" onclick="viewAdmissionDetail(\'' + a.adm_id + '\')"><td style="color:var(--gray-400)">' + ((i + 1)) + '</td><td style="font-weight:600;color:var(--blue-dark)">' + a.adm_id + '</td><td>' + a.name + '</td><td><span class="badge b-secondary">' + a.class_applying + '</span></td><td><span class="badge b-danger"><i class=\"fas fa-times-circle\"></i> Rejected</span></td><td style="font-size:11px;color:var(--gray-500)">' + a.created + '</td></tr>').join('')}
      </tbody>
    </table>
  </div>
  `;
}

function toggleAdmForm() {
  const form = document.getElementById('adm-form-wrap');
  if (form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function filterAdmissions() {
  const searchInput = document.getElementById('adm-search');
  const searchText = (searchInput ? searchInput.value : '').toLowerCase();

  const pendingTbody = document.getElementById('pending-admissions-tbody');
  const approvedTbody = document.getElementById('approved-admissions-tbody');
  const rejectedTbody = document.getElementById('rejected-admissions-tbody');

  const pending = admissionsData.filter(a => a.status === 'Pending' && (!searchText || a.name.toLowerCase().includes(searchText) || a.adm_id.toLowerCase().includes(searchText) || (a.parent_name && a.parent_name.toLowerCase().includes(searchText))));
  const approved = admissionsData.filter(a => a.status === 'Approved' && (!searchText || a.name.toLowerCase().includes(searchText) || a.adm_id.toLowerCase().includes(searchText) || (a.parent_name && a.parent_name.toLowerCase().includes(searchText))));
  const rejected = admissionsData.filter(a => a.status === 'Rejected' && (!searchText || a.name.toLowerCase().includes(searchText) || a.adm_id.toLowerCase().includes(searchText) || (a.parent_name && a.parent_name.toLowerCase().includes(searchText))));

  if (pendingTbody) {
    pendingTbody.innerHTML = pending.length === 0 ? '<tr><td colspan="9" style="text-align:center;padding:20px;color:var(--gray-400)">No pending applications found</td></tr>' :
      pending.map((a, i) => '<tr style="cursor:pointer" onclick="if(!event.target.closest(\'button\')) viewAdmissionDetail(\'' + a.adm_id + '\')"><td style="color:var(--gray-400)">' + ((i + 1)) + '</td><td style="font-weight:600;color:var(--blue-dark)">' + a.adm_id + '</td><td>' + a.name + '</td><td style="font-size:11px">' + a.dob + '</td><td><span class="badge b-info">' + a.class_applying + '</span></td><td>' + a.parent_name + '</td><td style="font-size:11px;color:var(--gray-500)">' + a.created + '</td><td><span class="badge b-warning"><i class="fas fa-hourglass-half"></i> Pending</span></td><td><div style="display:flex;gap:4px"><button class="btn btn-primary btn-xs" onclick="approveAdmission(\'' + a.adm_id + '\', \'' + a.name + '\')"><i class="fas fa-check"></i> Approve</button><button class="btn btn-danger btn-xs" onclick="rejectAdmission(\'' + a.adm_id + '\')"><i class="fas fa-times"></i> Reject</button></div></td></tr>').join('');
  }

  if (approvedTbody) {
    approvedTbody.innerHTML = approved.length === 0 ? '<tr><td colspan="7" style="text-align:center;padding:20px;color:var(--gray-400)">No approved applications found</td></tr>' :
      approved.map((a, i) => '<tr style="cursor:pointer" onclick="if(!event.target.closest(\'button\')) viewAdmissionDetail(\'' + a.adm_id + '\')"><td style="color:var(--gray-400)">' + ((i + 1)) + '</td><td style="font-weight:600;color:var(--blue-dark)">' + a.adm_id + '</td><td style="font-weight:700;color:var(--success)">' + generateStudentID(a.class_applying, '' + admissionsData.indexOf(a)) + '</td><td>' + a.name + '</td><td><span class="badge b-info">' + a.class_applying + '</span></td><td><span class="badge b-success"><i class="fas fa-check-circle"></i> Approved</span></td><td><div style="display:flex;gap:4px"><button class="btn btn-secondary btn-xs" onclick="alert(\'Printing admission slip for ' + a.name + '...\')"><i class="fas fa-print"></i> Print Slip</button><button class="btn btn-primary btn-xs" onclick="enrollStudent(\'' + a.adm_id + '\')"><i class="fas fa-book"></i> Enroll</button></div></td></tr>').join('');
  }

  if (rejectedTbody) {
    rejectedTbody.innerHTML = rejected.length === 0 ? '<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--gray-400)">No rejected applications found</td></tr>' :
      rejected.map((a, i) => '<tr style="cursor:pointer" onclick="viewAdmissionDetail(\'' + a.adm_id + '\')"><td style="color:var(--gray-400)">' + ((i + 1)) + '</td><td style="font-weight:600;color:var(--blue-dark)">' + a.adm_id + '</td><td>' + a.name + '</td><td><span class="badge b-secondary">' + a.class_applying + '</span></td><td><span class="badge b-danger"><i class="fas fa-times-circle"></i> Rejected</span></td><td style="font-size:11px;color:var(--gray-500)">' + a.created + '</td></tr>').join('');
  }
}

function generateStudentID(classApplying, index) {
  const year = new Date().getFullYear();
  const prefix = classApplying.includes('JHS') ? 'JHS' : 'FORM';
  const seq = String(index).padStart(3, '0');
  return prefix + year + '-' + seq;
}

function submitAdmission() {
  const name = document.getElementById('adm-name').value.trim();
  const dob = document.getElementById('adm-dob').value;
  const gender = document.getElementById('adm-gender').value;
  const phone = document.getElementById('adm-phone').value;
  const address = document.getElementById('adm-address').value.trim();
  const parentName = document.getElementById('adm-parent-name').value.trim();
  const parentPhone = document.getElementById('adm-parent-phone').value;
  const parentEmail = document.getElementById('adm-parent-email').value.trim();
  const parentGender = document.getElementById('adm-parent-gender').value;
  const contactPerson = document.getElementById('adm-contact-person').value.trim();
  const relationship = document.getElementById('adm-relationship').value;
  const occupation = document.getElementById('adm-occupation').value;
  const school = document.getElementById('adm-school').value.trim();
  const lastClass = document.getElementById('adm-last-class').value;
  const classApplying = document.getElementById('adm-class').value;
  const house = document.getElementById('adm-house').value;
  const academicYear = document.getElementById('adm-year').value;
  const picture = window.admPictureData || null;

  if (!name || !dob || !gender || !address || !parentName || !parentPhone || !parentEmail || !parentGender || !contactPerson || !relationship || !school || !classApplying) {
    alert('Please fill in all required fields (marked with *)');
    return;
  }

  const today = new Date().toISOString().split('T')[0];
  const admNo = 'ADM' + today.slice(0, 4) + '-' + String(admissionsData.length + 1).padStart(3, '0');

  const newAdmission = {
    adm_id: admNo,
    name: name,
    dob: dob,
    gender: gender,
    address: address,
    phone: phone,
    school: school,
    class_applying: classApplying,
    house: house !== '-- Select House --' ? house : null,
    academic_year: academicYear,
    status: 'Pending',
    parent_name: parentName,
    parent_phone: parentPhone,
    parent_email: parentEmail,
    parent_gender: parentGender,
    parent_contact_person: contactPerson,
    parent_relationship: relationship,
    parent_occupation: occupation,
    picture: picture,
    created: today
  };

  admissionsData.push(newAdmission);
  saveAdmissionRecords();
  showToast('<i class="fas fa-check-circle"></i> Application submitted!<br/>Application #: ' + admNo + '<br/>Status: Pending Review', 'success', 4000);

  // Clear form
  document.getElementById('adm-form-wrap').style.display = 'none';
  document.getElementById('adm-name').value = '';
  document.getElementById('adm-dob').value = '';
  document.getElementById('adm-gender').value = '';
  document.getElementById('adm-phone').value = '';
  document.getElementById('adm-address').value = '';
  document.getElementById('adm-parent-name').value = '';
  document.getElementById('adm-parent-phone').value = '';
  document.getElementById('adm-parent-email').value = '';
  document.getElementById('adm-parent-gender').value = '';
  document.getElementById('adm-contact-person').value = '';
  document.getElementById('adm-relationship').value = '';
  document.getElementById('adm-occupation').value = '';
  document.getElementById('adm-school').value = '';
  document.getElementById('adm-last-class').value = '';
  document.getElementById('adm-class').value = '-- Select Class --';
  document.getElementById('adm-house').value = '-- Select House --';
  document.getElementById('adm-picture').value = '';
  document.getElementById('adm-pic-preview').innerHTML = '<i class="fas fa-camera" style="color:var(--gray-400)"></i>';
  window.admPictureData = null;

  // Refresh module
  renderMain('admissions');
}

function approveAdmission(admId, studentName) {
  const adm = admissionsData.find(a => a.adm_id === admId);
  if (adm) {
    adm.status = 'Approved';
    saveAdmissionRecords();
    const studentID = generateStudentID(adm.class_applying, admissionsData.indexOf(adm));
    showToast('<i class="fas fa-check-circle"></i> Admission Approved!<br/>Student: ' + studentName + '<br/>Student ID: ' + studentID, 'success', 4000);
    renderMain('admissions');
  }
  // Initialize alumni dashboard
  if (m === 'dashboard' && r === 'Alumni') {
    setTimeout(() => { try{ getAlumniList(); getAlumniDonations(); getAlumniEventRegistrations(); } catch(e){} }, 80);
  }
}

function rejectAdmission(admId) {
  const adm = admissionsData.find(a => a.adm_id === admId);
  if (adm) {
    if (confirm('Are you sure you want to reject this application?')) {
      adm.status = 'Rejected';
      saveAdmissionRecords();
      alert('<i class="fas fa-times-circle"></i> Application has been rejected.');
      renderMain('admissions');
    }
  }
}

function enrollStudent(admissionId) {
  const admission = admissionsData.find(a => a.adm_id === admissionId);
  if (!admission) {
    alert('<i class="fas fa-times-circle"></i> Admission record not found');
    return;
  }

  const studentID = generateStudentID(admission.class_applying, admissionsData.indexOf(admission));
  const avatarColors = ['blue', 'gold', 'purple', 'green', 'teal', 'orange', 'pink', 'red'];
  const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

  const newStudent = {
    student_id: studentID,
    name: admission.name,
    student_class: admission.class_applying,
    gender: admission.gender,
    dob: admission.dob,
    attendance: '0%',
    fees_status: 'Pending',
    status: 'Active',
    avatar_color: randomColor,
    gender_abbr: admission.gender[0],
    parent_name: admission.parent_name,
    parent_phone: admission.parent_phone,
    house: admission.house || 'Not Assigned',
    picture: admission.picture,
    enrolled_date: new Date().toISOString().split('T')[0]
  };

  enrolledStudents.push(newStudent);
  admission.status = 'Enrolled';
  saveAdmissionRecords();
  saveStudentRecords();
  createOrUpdateParentFromAdmission(admission, newStudent);

  showToast('<i class="fas fa-check-circle"></i> Student Enrolled Successfully!<br/>Name: ' + admission.name + '<br/>ID: ' + studentID + '<br/>Parent account updated', 'success', 4000);

  renderMain('admissions');
}

function showAdmissionStatistics() {
  const total = admissionsData.length;
  const approved = admissionsData.filter(a => a.status === 'Approved').length;
  const pending = admissionsData.filter(a => a.status === 'Pending').length;
  const rejected = admissionsData.filter(a => a.status === 'Rejected').length;
  const enrolled = admissionsData.filter(a => a.status === 'Enrolled').length;

  const byClass = {};
  admissionsData.forEach(a => {
    byClass[a.class_applying] = (byClass[a.class_applying] || 0) + 1;
  });

  const maleCount = admissionsData.filter(a => a.gender === 'Male').length;
  const femaleCount = admissionsData.filter(a => a.gender === 'Female').length;

  const statusData = [
    { status: 'Pending', count: pending, color: 'var(--gold)', percentage: Math.round((pending / total) * 100) },
    { status: 'Approved', count: approved, color: 'var(--success)', percentage: Math.round((approved / total) * 100) },
    { status: 'Enrolled', count: enrolled, color: 'var(--blue-main)', percentage: Math.round((enrolled / total) * 100) },
    { status: 'Rejected', count: rejected, color: 'var(--danger)', percentage: Math.round((rejected / total) * 100) }
  ];

  let html = hdr('Admission Statistics Report', 'Comprehensive analysis of admission applications', 'Statistics');

  html += '<div class=\"stats-row\" style=\"margin-bottom:24px\">';
  html += statCard('<i class="fas fa-clipboard-list"></i>', total, 'Total Applications', 'Academic Year 2025/2026', 'neu', 'si-blue');
  html += statCard('<i class="fas fa-hourglass-half"></i>', pending, 'Pending Applications', 'Awaiting review', 'neu', 'si-gold');
  html += statCard('<i class="fas fa-check-circle"></i>', approved, 'Approved Applications', 'Ready for enrollment', 'up', 'si-green');
  html += statCard('<i class="fas fa-book"></i>', enrolled, 'Enrolled Students', 'Successfully enrolled', 'up', 'si-purple');
  html += '</div>';

  html += '<div class=\"g2 mb20\"><div class=\"card\"><div class=\"card-hdr\"><span class=\"card-title\"><i class=\"fas fa-chart-bar\"></i> Status Distribution</span></div><div style=\"padding:20px\">';
  statusData.forEach(s => {
    const pct = Math.round((s.count / total) * 100);
    html += '<div style=\"margin-bottom:16px\"><div style=\"display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px\"><span style=\"font-weight:600\">' + s.status + '</span><span style=\"color:var(--gray-500)\">' + s.count + ' (' + pct + '%)</span></div>';
    html += '<div style=\"height:20px;background:var(--gray-100);border-radius:10px;overflow:hidden\"><div style=\"height:100%;background:' + s.color + ';width:' + pct + '%;transition:width 0.3s\"></div></div></div>';
  });
  html += '</div></div>';

  html += '<div class=\"card\"><div class=\"card-hdr\"><span class=\"card-title\"><i class="fas fa-users"></i> Gender Breakdown</span></div><div style=\"padding:20px;text-align:center\">';
  html += '<div style=\"display:flex;gap:20px;justify-content:center;margin-bottom:16px\">';
  html += '<div><div style=\"font-size:28px;font-weight:700;color:var(--blue-main)\">' + maleCount + '</div><div style=\"font-size:12px;color:var(--gray-500);margin-top:4px\">Male Students</div><div style=\"font-size:11px;color:var(--gray-400);margin-top:4px\">' + Math.round((maleCount / total) * 100) + '%</div></div>';
  html += '<div style=\"border-left:1px solid var(--gray-200)\"></div>';
  html += '<div><div style=\"font-size:28px;font-weight:700;color:var(--purple)\">' + femaleCount + '</div><div style=\"font-size:12px;color:var(--gray-500);margin-top:4px\">Female Students</div><div style=\"font-size:11px;color:var(--gray-400);margin-top:4px\">' + Math.round((femaleCount / total) * 100) + '%</div></div>';
  html += '</div></div></div></div>';

  html += '<div class=\"card mb20\"><div class=\"card-hdr\"><span class=\"card-title\"><i class=\"fas fa-building\"></i> Applications by Class</span></div>';
  html += '<table class=\"tbl\" style=\"font-size:12px\"><thead><tr><th>Class</th><th>Applications</th><th>Percentage</th><th>Bar</th></tr></thead><tbody>';
  Object.entries(byClass).sort((a, b) => b[1] - a[1]).forEach(([cls, count]) => {
    const pct = Math.round((count / total) * 100);
    html += '<tr><td style=\"font-weight:600\">' + cls + '</td><td>' + count + '</td><td style=\"font-size:11px;color:var(--gray-500)\">' + pct + '%</td>';
    html += '<td><div style=\"height:6px;background:var(--gray-100);border-radius:3px;overflow:hidden;width:100px\"><div style=\"height:100%;background:var(--blue-main);width:' + pct + '%\"></div></div></td></tr>';
  });
  html += '</tbody></table></div>';

  html += '<div class=\"g2 mb20\"><div class=\"card\"><div class=\"card-hdr\"><span class=\"card-title\"><i class=\"fas fa-chart-line\"></i> Success Metrics</span></div><div style=\"padding:20px\">';
  html += '<div style=\"display:flex;align-items:center;padding:12px;background:var(--gray-50);border-radius:6px;margin-bottom:12px\"><div style=\"font-size:24px;color:var(--success)\"><i class=\"fas fa-check-circle\"></i></div><div style=\"flex:1;margin-left:12px\"><div style=\"font-size:12px;color:var(--gray-500)\">Approval Rate</div><div style=\"font-size:18px;font-weight:700;color:var(--success)\">' + Math.round((approved / total) * 100) + '%</div></div></div>';
  html += '<div style=\"display:flex;align-items:center;padding:12px;background:var(--gray-50);border-radius:6px;margin-bottom:12px\"><div style=\"font-size:24px;color:var(--blue-main)\"><i class=\"fas fa-book\"></i></div><div style=\"flex:1;margin-left:12px\"><div style=\"font-size:12px;color:var(--gray-500)\">Enrollment Rate</div><div style=\"font-size:18px;font-weight:700;color:var(--blue-main)\">' + Math.round((enrolled / (approved || 1)) * 100) + '%</div></div></div>';
  html += '<div style=\"display:flex;align-items:center;padding:12px;background:var(--gray-50);border-radius:6px;\"><div style=\"font-size:24px;color:var(--danger)\"><i class=\"fas fa-times-circle\"></i></div><div style=\"flex:1;margin-left:12px\"><div style=\"font-size:12px;color:var(--gray-500)\">Rejection Rate</div><div style=\"font-size:18px;font-weight:700;color:var(--danger)\">' + Math.round((rejected / total) * 100) + '%</div></div></div>';
  html += '</div></div>';

  html += '<div class=\"card\"><div class=\"card-hdr\"><span class=\"card-title\"><i class=\"fas fa-calendar-alt\"></i> Academic Year</span></div><div style=\"padding:20px\"><div style=\"text-align:center;padding:20px\">';
  html += '<div style=\"font-size:32px;font-weight:700;color:var(--blue-dark)\">2025/2026</div><div style=\"font-size:12px;color:var(--gray-500);margin-top:8px\">Current Academic Year</div>';
  html += '<div style=\"display:flex;gap:8px;margin-top:16px;justify-content:center\"><span class=\"badge b-info\">' + total + ' Applicants</span><span class=\"badge b-success\">' + enrolled + ' Enrolled</span></div>';
  html += '</div></div></div></div>';

  html += '<div class=\"card\"><div class=\"card-hdr\"><span class=\"card-title\"><i class=\"fas fa-clipboard-list\"></i> Recent Activity</span></div>';
  html += '<table class=\"tbl\" style=\"font-size:11px\"><thead><tr><th>Date</th><th>Student</th><th>Status</th><th>Class</th><th>Action</th></tr></thead><tbody>';
  admissionsData.slice().reverse().slice(0, 8).forEach((a) => {
    const badgeClass = a.status === 'Approved' ? 'b-success' : (a.status === 'Pending' ? 'b-warning' : (a.status === 'Enrolled' ? 'b-info' : 'b-danger'));
    html += '<tr><td style=\"color:var(--gray-500)\">' + a.created + '</td><td style=\"font-weight:600\">' + a.name + '</td><td><span class=\"badge ' + badgeClass + '\">' + a.status + '</span></td><td style=\"font-size:10px\">' + a.class_applying + '</td><td><span style=\"font-size:10px;color:var(--gray-400)\">Applied on ' + a.created + '</span></td></tr>';
  });
  html += '</tbody></table></div>';

  document.getElementById('main-content').innerHTML = html;
}

function previewAdmPicture(input) {
  const preview = document.getElementById('adm-pic-preview');
  if (input.files && input.files[0]) {
    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB. Please choose a smaller image.');
      input.value = '';
      preview.innerHTML = '<i class="fas fa-camera" style="color:var(--gray-400)"></i>';
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.innerHTML = '<img src="' + e.target.result + '" style="width:100%;height:100%;object-fit:cover">';
      window.admPictureData = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    preview.innerHTML = '<i class="fas fa-camera" style="color:var(--gray-400)"></i>';
    window.admPictureData = null;
  }
}

// -----------------------------------
// REPORT GENERATION FUNCTIONS
// -----------------------------------

// -----------------------------------
// USER ACCOUNTS (Admin Create / Edit / Disable)
// -----------------------------------

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"'`]/g, function (s) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' })[s];
  });
}

function escapeAttr(str) {
  return escapeHtml(str);
}

