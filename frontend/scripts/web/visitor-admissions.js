
// -----------------------------------
// VISITOR HOME
// -----------------------------------
let publicNewsSyncStarted = false;
let publicEventsSyncStarted = false;
let publicNoticesSyncStarted = false;

function getHeroSlides() {
  return Object.values(window.cachedHeroSlides || {})
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || Number(b.id || 0) - Number(a.id || 0));
}

function getActiveHeroSlide() {
  const slides = getPublishedHeroSlides();
  return slides.find(slide => slide.status === 'Active') || slides[0] || null;
}

function getPublishedHeroSlides() {
  return getHeroSlides().filter(slide => (slide.status || 'Active') === 'Active');
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
          <span class="badge b-info">${escapeHtml(slide.created_at || slide.created || '')}</span>
        </div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end">
        ${slide.status === 'Active'
          ? `<button class="btn btn-secondary btn-xs" onclick="setHeroSlideDraft(${slide.id})"><i class="fas fa-eye-slash"></i> Draft</button>`
          : `<button class="btn btn-secondary btn-xs" onclick="setHeroSlideActive(${slide.id})"><i class="fas fa-check"></i> Publish</button>`}
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
      <div class="f-row">
        <div class="f-field"><label>Status</label><select id="hero-slide-status"><option value="Active">Publish</option><option value="Draft">Draft</option></select></div>
        <div class="f-field"><label>Order</label><input id="hero-slide-order" type="number" value="${slides.length + 1}" min="0"></div>
      </div>
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

async function uploadHeroSlide() {
  const title = document.getElementById('hero-slide-title')?.value?.trim() || 'Glory Reign Preparatory School';
  const caption = document.getElementById('hero-slide-caption')?.value?.trim() || 'Nurturing minds, building character, and shaping futures.';
  const status = document.getElementById('hero-slide-status')?.value || 'Active';
  const sortOrder = parseInt(document.getElementById('hero-slide-order')?.value || '0', 10);
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
  reader.onload = async function (event) {
    const res = await API.heroSlides.create({
      title,
      caption,
      image: event.target.result,
      status,
      sort_order: sortOrder
    });
    if (!res || !res.success) {
      showToast(res?.message || 'Failed to upload slide', 'error');
      return;
    }
    if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
    showToast('<i class="fas fa-check-circle"></i> Hero slide uploaded', 'success');
    renderMain();
  };
  reader.readAsDataURL(file);
}

async function setHeroSlideActive(slideId) {
  const res = await API.heroSlides.setActive(slideId);
  if (!res || !res.success) return showToast(res?.message || 'Failed to publish slide', 'error');
  if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
  showToast('<i class="fas fa-check-circle"></i> Hero slide published', 'success');
  renderMain();
}

async function setHeroSlideDraft(slideId) {
  const res = await API.heroSlides.setDraft(slideId);
  if (!res || !res.success) return showToast(res?.message || 'Failed to draft slide', 'error');
  if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
  showToast('<i class="fas fa-check-circle"></i> Hero slide moved to draft', 'success');
  renderMain();
}

async function deleteHeroSlide(slideId) {
  if (!confirm('Delete this hero background image?')) return;
  const res = await API.heroSlides.delete(slideId);
  if (!res || !res.success) return showToast(res?.message || 'Failed to delete slide', 'error');
  if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
  showToast('<i class="fas fa-check-circle"></i> Hero slide deleted', 'success');
  renderMain();
}

let heroCarouselIndex = 0;
let heroCarouselTimer = null;

function setHeroCarouselSlide(index) {
  const root = document.querySelector('[data-hero-carousel]');
  if (!root) return;
  const slides = Array.from(root.querySelectorAll('[data-hero-slide]'));
  const copies = Array.from(root.querySelectorAll('[data-hero-copy]'));
  const dots = Array.from(root.querySelectorAll('.hero-carousel-dot'));
  if (!slides.length) return;
  heroCarouselIndex = ((index % slides.length) + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === heroCarouselIndex));
  copies.forEach((copy, i) => copy.classList.toggle('active', i === heroCarouselIndex));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === heroCarouselIndex));
}

function changeHeroSlide(delta) {
  setHeroCarouselSlide(heroCarouselIndex + delta);
  startHeroCarousel();
}

function goToHeroSlide(index) {
  setHeroCarouselSlide(index);
  startHeroCarousel();
}

function startHeroCarousel() {
  if (heroCarouselTimer) clearInterval(heroCarouselTimer);
  const root = document.querySelector('[data-hero-carousel]');
  if (!root || root.querySelectorAll('[data-hero-slide]').length < 2) return;
  heroCarouselTimer = setInterval(() => setHeroCarouselSlide(heroCarouselIndex + 1), 6500);
}

function visitorHome() {
  if (!Array.isArray(window.newsArticles)) window.newsArticles = [];
  if (!Array.isArray(window.eventsData)) window.eventsData = [];
  if (!Array.isArray(window.noticesData)) window.noticesData = [];
  if ((!window.cachedHeroSlides || !Object.values(window.cachedHeroSlides).length) && typeof API !== 'undefined' && API.heroSlides) {
    API.heroSlides.list().then(res => {
      if (res && res.success && Array.isArray(res.data)) {
        window.cachedHeroSlides = res.data;
        if (currentRole === 'Visitor' && typeof renderMain === 'function') renderMain();
      }
    }).catch(() => {});
  }
  if (!publicEventsSyncStarted && typeof API !== 'undefined' && API.events) {
    publicEventsSyncStarted = true;
    API.events.list({ from: new Date().toISOString().slice(0, 10), limit: 6 }).then(res => {
      if (res && res.success && Array.isArray(res.data) && Array.isArray(window.eventsData)) {
        window.eventsData.splice(0, window.eventsData.length, ...res.data.map(ev => ({
          id: parseInt(ev.id, 10),
          title: ev.title || '',
          date: ev.event_date || ev.date || '',
          event_date: ev.event_date || ev.date || '',
          time: (ev.event_time || ev.time || '').slice(0, 5),
          event_time: ev.event_time || ev.time || '',
          allDay: ev.all_day === true || ev.all_day === 1 || ev.all_day === '1',
          all_day: ev.all_day === true || ev.all_day === 1 || ev.all_day === '1' ? 1 : 0,
          location: ev.location || '',
          audience: ev.audience || 'All',
          description: ev.description || '',
          status: ev.status || 'Published'
        })));
        if (currentRole === 'Visitor' && typeof renderMain === 'function') renderMain();
      }
    }).catch(() => {
      publicEventsSyncStarted = false;
    });
  }
  if (!publicNoticesSyncStarted && typeof API !== 'undefined' && API.notices) {
    publicNoticesSyncStarted = true;
    API.notices.list({ limit: 6 }).then(res => {
      if (res && res.success && Array.isArray(res.data) && Array.isArray(window.noticesData)) {
        window.noticesData.splice(0, window.noticesData.length, ...res.data.map(n => ({
          id: parseInt(n.id, 10),
          icon: n.icon || '<i class="fas fa-bullhorn"></i>',
          title: n.title || '',
          audience: n.audience || 'All',
          posted_by: n.posted_by || '',
          notice_date: n.notice_date || '',
          date: n.notice_date || '',
          message: n.message || '',
          priority: n.priority || 'Normal',
          status: n.status || 'Published',
          attachment: n.attachment || ''
        })));
        if (currentRole === 'Visitor' && typeof renderMain === 'function') renderMain();
      }
    }).catch(() => {
      publicNoticesSyncStarted = false;
    });
  }
  if (!publicNewsSyncStarted && (!window.newsArticles || !window.newsArticles.length) && typeof API !== 'undefined' && API.news) {
    publicNewsSyncStarted = true;
    API.news.list().then(res => {
      if (res && res.success && Array.isArray(res.data) && Array.isArray(window.newsArticles)) {
        window.newsArticles.splice(0, window.newsArticles.length, ...res.data.map(article => ({
          id: parseInt(article.id, 10),
          title: article.title || '',
          icon: article.icon || '<i class="fas fa-newspaper"></i>',
          date: article.date || '',
          category: article.category || 'General',
          desc: article.desc || '',
          content: article.content || '',
          status: article.status || 'Published'
        })));
        if (currentRole === 'Visitor' && typeof renderMain === 'function') renderMain();
      }
    }).catch(() => {
      publicNewsSyncStarted = false;
    });
  }
  setTimeout(startHeroCarousel, 0);
  const sourceArticles = (typeof newsArticles === 'undefined') ? [] : newsArticles;
  const publishedArticles = sourceArticles.filter(article => article.status === 'Published').slice(0, 3);
  const schoolInfo = (typeof SETTINGS_DATA === 'undefined') ? {} : (SETTINGS_DATA.schoolInfo || {});
  const schoolPhone = schoolInfo.phone || '0243611971 / 0205096091';
  const schoolEmail = schoolInfo.email || SCHOOL_EMAIL;
  const schoolAddress = schoolInfo.address || 'P.O. Box 42, Jirapa, Upper West Region, Ghana';
  const heroSlides = getPublishedHeroSlides();
  const carouselSlides = (heroSlides.length ? heroSlides : [{
    id: 0,
    title: 'Glory Reign Preparatory School',
    caption: 'Nurturing minds, building character, and shaping futures since 1985. A premier educational institution in Ghana known for academic excellence and holistic development.',
    image: 'assets/images/Hero.jpeg',
    status: 'Active'
  }]).slice(0, 10);
  const publicEvents = (typeof getUpcomingEvents === 'function' ? getUpcomingEvents() : []).slice(0, 3);
  const publicNotices = (typeof getNoticesData === 'function' ? getNoticesData() : (window.noticesData || []).filter(n => (n.status || 'Published') === 'Published')).slice(0, 3);
  const eventCards = publicEvents.map(ev => {
    const parts = typeof formatEventDateParts === 'function' ? formatEventDateParts(ev.date) : { month: '', day: '', long: ev.date };
    const time = typeof formatEventTime === 'function' ? formatEventTime(ev) : (ev.time || 'Time not set');
    return `<div class="card">
      <div style="display:flex;gap:14px;align-items:flex-start">
        <div style="min-width:54px;height:54px;background:var(--blue-xpale);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center">
          <span style="font-size:10px;color:var(--blue-main);font-weight:800">${escapeHtml(parts.month)}</span>
          <span style="font-size:20px;font-weight:900;color:var(--blue-dark)">${escapeHtml(parts.day)}</span>
        </div>
        <div>
          <h3 style="font-size:14px;font-weight:700;color:var(--blue-dark);margin-bottom:6px">${escapeHtml(ev.title)}</h3>
          <p style="font-size:12px;color:var(--gray-500);line-height:1.6;margin-bottom:8px">${escapeHtml(time)} · ${escapeHtml(ev.audience || 'All')}</p>
          <p style="font-size:12px;color:var(--gray-600);line-height:1.6;margin:0">${escapeHtml(ev.description || '')}</p>
        </div>
      </div>
    </div>`;
  }).join('');
  const noticeCards = publicNotices.map(n => `<div class="card">
    <div style="display:flex;gap:12px;align-items:flex-start">
      <div style="width:42px;height:42px;border-radius:8px;background:var(--blue-xpale);display:flex;align-items:center;justify-content:center;color:var(--blue-main)">${n.icon || '<i class="fas fa-bullhorn"></i>'}</div>
      <div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:6px">
          <h3 style="font-size:14px;font-weight:700;color:var(--blue-dark);margin:0">${escapeHtml(n.title || '')}</h3>
          <span class="badge ${n.priority === 'Urgent' ? 'b-danger' : n.priority === 'Important' ? 'b-warning' : 'b-info'}">${escapeHtml(n.priority || 'Normal')}</span>
        </div>
        <p style="font-size:12px;color:var(--gray-500);line-height:1.6;margin-bottom:8px">${escapeHtml(n.notice_date || n.date || '')} &middot; ${escapeHtml(n.audience || 'All')}</p>
        <p style="font-size:12px;color:var(--gray-600);line-height:1.6;margin:0">${escapeHtml(n.message || '')}</p>
      </div>
    </div>
  </div>`).join('');
  return `<section id="home-section" class="public-section">
  <div class="visitor-hero visitor-hero-photo visitor-hero-carousel" data-hero-carousel="1">
    ${carouselSlides.map((slide, index) => `<div class="hero-carousel-slide ${index === 0 ? 'active' : ''}" data-hero-slide="${index}" style="background-image:linear-gradient(135deg,rgba(10,34,64,.82),rgba(26,86,219,.62)),url('${escapeAttr(slide.image)}')"></div>`).join('')}
    <div class="hero-carousel-content">
      ${carouselSlides.map((slide, index) => `<div class="hero-carousel-copy ${index === 0 ? 'active' : ''}" data-hero-copy="${index}">
        <h1>${escapeHtml(slide.title || 'Glory Reign Preparatory School')}</h1>
        <p>${escapeHtml(slide.caption || '')}</p>
      </div>`).join('')}
      <div class="hero-btns">
        <button class="hero-btn-gold" onclick="publicNavToSection('admission-section')">Apply for Admission</button>
        <button class="hero-btn-outline" onclick="publicNavToSection('about-section')">Learn More About Us</button>
        <button class="hero-btn-outline" onclick="logout()"><i class="fas fa-lock"></i> Login to Portal</button>
      </div>
    </div>
    ${carouselSlides.length > 1 ? `<button class="hero-carousel-nav hero-carousel-prev" onclick="changeHeroSlide(-1)" aria-label="Previous slide"><i class="fas fa-chevron-left"></i></button>
    <button class="hero-carousel-nav hero-carousel-next" onclick="changeHeroSlide(1)" aria-label="Next slide"><i class="fas fa-chevron-right"></i></button>
    <div class="hero-carousel-dots">${carouselSlides.map((_, index) => `<button class="hero-carousel-dot ${index === 0 ? 'active' : ''}" onclick="goToHeroSlide(${index})" aria-label="Go to slide ${index + 1}"></button>`).join('')}</div>` : ''}
  </div>
  </section>
  <div class="stats-row mb24">
    ${statCard('<i class="fas fa-graduation-cap"></i>', Object.values(ALUMNI_DATA || {}).filter(a => (a.status || 'Published') === 'Published').length, 'Published Alumni', 'From database', 'up', 'si-blue')}
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
    <div class="g3">${publishedArticles.map(article => `<div class="card"><div class="news-card-icon">${article.icon}</div><h3 style="font-size:14px;font-weight:700;color:var(--blue-dark);margin-bottom:8px">${escapeHtml(article.title)}</h3><p style="font-size:12px;color:var(--gray-500);line-height:1.6;margin-bottom:10px">${escapeHtml(article.desc)}</p><button class="btn btn-secondary btn-xs" onclick="showNewsArticleById(${article.id})">Read More</button></div>`).join('') || '<div class="card" style="text-align:center;color:var(--gray-400);padding:24px">No published news articles yet.</div>'}</div>
  </section>
  <section id="contact-section" class="public-section">
    <div class="section-title"><h2>Contact</h2><p>Reach the school office for admissions, visits and general enquiries.</p></div>
    <div class="g2"><div class="card"><div class="card-hdr"><span class="card-title"><i class="fas fa-phone"></i> School Office</span></div><p style="font-size:13px;color:var(--gray-600);line-height:1.8">Phone: ${escapeHtml(schoolPhone)}<br>Email: ${escapeHtml(schoolEmail)}<br>Location: ${escapeHtml(schoolAddress)}</p></div><div class="card contact-form"><div class="f-field" style="margin-bottom:10px"><label>Full Name</label><input placeholder="Full name"></div><div class="f-field" style="margin-bottom:10px"><label>Email</label><input placeholder="your@email.com"></div><div class="f-field" style="margin-bottom:10px"><label>Subject</label><input placeholder="What is this about?"></div><div class="f-field" style="margin-bottom:12px"><label>Message</label><textarea placeholder="Type your message"></textarea></div><button class="btn btn-primary" onclick="sendContactMessage()">Send Message</button></div></div>
  </section>`;
}


// -----------------------------------
// ADMISSIONS MODULE
// -----------------------------------
function getAdmissionsCounts() {
  const fallbackCounts = admissionsData.reduce((counts, admission) => {
    const status = admission.status || 'Pending';
    counts[status] = (counts[status] || 0) + 1;
    counts.total += 1;
    return counts;
  }, { total: 0, Pending: 0, Approved: 0, Rejected: 0, Enrolled: 0 });
  return { ...fallbackCounts, ...(window.ADMISSIONS_COUNTS || {}) };
}

function admissionsModule() {
  const counts = getAdmissionsCounts();
  const statsCards = [
    statCard('<i class="fas fa-clipboard-list"></i>', String(counts.total || 0), 'Total Applications', 'This academic year', 'neu', 'si-blue'),
    statCard('<i class="fas fa-check-circle"></i>', String(counts.Approved || 0), 'Approved', 'Ready for enrollment', 'up', 'si-green'),
    statCard('<i class="fas fa-hourglass-half"></i>', String(counts.Pending || 0), 'Pending', 'Awaiting review', 'neu', 'si-gold'),
    statCard('<i class="fas fa-times-circle"></i>', String(counts.Rejected || 0), 'Rejected', 'Did not meet criteria', 'dn', 'si-red')
  ].join('');
  const pendingRows = admissionsData.filter(a => a.status === 'Pending').map((a, i) => '<tr style="cursor:pointer" onclick="if(!event.target.closest(\'button\')) viewAdmissionDetail(\'' + a.adm_id + '\')"><td style="color:var(--gray-400)">' + ((i + 1)) + '</td><td style="font-weight:600;color:var(--blue-dark)">' + a.adm_id + '</td><td>' + a.name + '</td><td style="font-size:11px">' + a.dob + '</td><td><span class="badge b-info">' + a.class_applying + '</span></td><td style="font-size:11px">' + a.parent_name + '</td><td style="font-size:11px;color:var(--gray-500)">' + a.created + '</td><td><span class="badge b-warning"><i class=\"fas fa-hourglass-half\"></i> Pending</span></td><td><div style="display:flex;gap:4px"><button class="btn btn-primary btn-xs" onclick="approveAdmission(\'' + a.adm_id + '\', \'' + a.name + '\')"><i class=\"fas fa-check\"></i> Approve</button><button class="btn btn-danger btn-xs" onclick="rejectAdmission(\'' + a.adm_id + '\')"><i class=\"fas fa-times\"></i> Reject</button></div></td></tr>').join('') || '<tr><td colspan="9" style="text-align:center;padding:20px;color:var(--gray-400)">No pending applications found</td></tr>';
  const approvedRows = admissionsData.filter(a => a.status === 'Approved').map((a, i) => '<tr style="cursor:pointer" onclick="if(!event.target.closest(\'button\')) viewAdmissionDetail(\'' + a.adm_id + '\')"><td style="color:var(--gray-400)">' + ((i + 1)) + '</td><td style="font-weight:600;color:var(--blue-dark)">' + a.adm_id + '</td><td style="font-weight:700;color:var(--success)">' + generateStudentID(a.class_applying, '' + admissionsData.indexOf(a)) + '</td><td>' + a.name + '</td><td><span class="badge b-info">' + a.class_applying + '</span></td><td><span class="badge b-success"><i class=\"fas fa-check-circle\"></i> Approved</span></td><td><div style="display:flex;gap:4px"><button class="btn btn-secondary btn-xs" onclick="alert(\'Printing admission slip for ' + a.name + '...\')"><i class=\"fas fa-print\"></i> Print Slip</button><button class="btn btn-primary btn-xs" onclick="enrollStudent(\'' + a.adm_id + '\')"><i class=\"fas fa-book\"></i> Enroll</button></div></td></tr>').join('') || '<tr><td colspan="7" style="text-align:center;padding:20px;color:var(--gray-400)">No approved applications found</td></tr>';
  const rejectedRows = admissionsData.filter(a => a.status === 'Rejected').map((a, i) => '<tr style="cursor:pointer" onclick="viewAdmissionDetail(\'' + a.adm_id + '\')"><td style="color:var(--gray-400)">' + ((i + 1)) + '</td><td style="font-weight:600;color:var(--blue-dark)">' + a.adm_id + '</td><td>' + a.name + '</td><td><span class="badge b-secondary">' + a.class_applying + '</span></td><td><span class="badge b-danger"><i class=\"fas fa-times-circle\"></i> Rejected</span></td><td style="font-size:11px;color:var(--gray-500)">' + a.created + '</td></tr>').join('') || '<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--gray-400)">No rejected applications found</td></tr>';

  return hdr('Admissions Module', 'Process new student admissions and generate student IDs', 'Admissions') +
    renderPageTemplate('pages/admin/admissions/index.html', { statsCards, pendingRows, approvedRows, rejectedRows });
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

async function submitAdmission() {
  const name = document.getElementById('adm-name')?.value.trim();
  const dob = document.getElementById('adm-dob')?.value;
  const gender = document.getElementById('adm-gender')?.value;
  const classApplying = document.getElementById('adm-class')?.value;
  const previousSchool = document.getElementById('adm-prev-school')?.value.trim();
  const parentName = document.getElementById('adm-parent-name')?.value.trim();
  const parentPhone = document.getElementById('adm-parent-phone')?.value.trim();
  const parentEmail = document.getElementById('adm-parent-email')?.value.trim();
  const parentGender = document.getElementById('adm-parent-gender')?.value;
  const parentOccupation = document.getElementById('adm-parent-occupation')?.value.trim();
  const address = document.getElementById('adm-parent-address')?.value.trim();
  const notes = document.getElementById('adm-medical')?.value.trim();
  const photo = window.admPictureData || null;

  if (!name || !dob || !gender || !classApplying || !parentName || !parentPhone) {
    showToast('<i class="fas fa-exclamation-triangle"></i> Please fill in all required fields', 'warning');
    return;
  }
  if (!/^\d{1,15}$/.test(parentPhone)) {
    showToast('<i class="fas fa-exclamation-triangle"></i> Phone number must contain numbers only and be no more than 15 digits', 'warning');
    return;
  }

  try {
    const res = await API.admissions.apply({
      applicant_name: name,
      dob,
      gender,
      class_applying: classApplying,
      previous_school: previousSchool,
      parent_name: parentName,
      parent_phone: parentPhone,
      parent_email: parentEmail,
      parent_gender: parentGender,
      parent_occupation: parentOccupation,
      address,
      photo,
      notes
    });
    if (!res || !res.success) {
      showToast('<i class="fas fa-times-circle"></i> ' + (res?.message || 'Unable to submit application'), 'error');
      return;
    }
    showToast('<i class="fas fa-check-circle"></i> Application submitted and saved to database', 'success', 4000);
    if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
    renderMain('admissions');
  } catch (error) {
    console.error('Admission submission failed:', error);
    showToast('<i class="fas fa-times-circle"></i> Unable to submit application', 'error');
  }
}

async function approveAdmission(admId, studentName) {
  const adm = admissionsData.find(a => a.adm_id === admId);
  if (!adm) return;
  try {
    if (typeof API !== 'undefined' && API.admissions && adm.id) {
      const res = await API.admissions.updateStatus(adm.id, 'Approved', 'Approved by administrator');
      if (!res || !res.success) {
        showToast('<i class="fas fa-times-circle"></i> ' + (res?.message || 'Unable to approve admission'), 'error');
        return;
      }
      if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
    } else {
      adm.status = 'Approved';
    }
    const studentID = generateStudentID(adm.class_applying, admissionsData.indexOf(adm));
    showToast('<i class="fas fa-check-circle"></i> Admission Approved!<br/>Student: ' + studentName + '<br/>Student ID: ' + studentID, 'success', 4000);
    renderMain('admissions');
  } catch (error) {
    console.error('Admission approval failed:', error);
    showToast('<i class="fas fa-times-circle"></i> Unable to approve admission', 'error');
  }
}

async function rejectAdmission(admId) {
  const adm = admissionsData.find(a => a.adm_id === admId);
  if (!adm || !confirm('Are you sure you want to reject this application?')) return;
  try {
    if (typeof API !== 'undefined' && API.admissions && adm.id) {
      const res = await API.admissions.updateStatus(adm.id, 'Rejected', 'Rejected by administrator');
      if (!res || !res.success) {
        showToast('<i class="fas fa-times-circle"></i> ' + (res?.message || 'Unable to reject admission'), 'error');
        return;
      }
      if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
    } else {
      adm.status = 'Rejected';
    }
    showToast('<i class="fas fa-times-circle"></i> Application has been rejected.', 'success');
    renderMain('admissions');
  } catch (error) {
    console.error('Admission rejection failed:', error);
    showToast('<i class="fas fa-times-circle"></i> Unable to reject admission', 'error');
  }
}

async function enrollStudent(admissionId) {
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
    photo: admission.photo || admission.picture || null,
    picture: admission.photo || admission.picture || null,
    enrolled_date: new Date().toISOString().split('T')[0]
  };

  try {
    if (typeof API === 'undefined' || !API.admissions || !admission.id) {
      showToast('<i class="fas fa-times-circle"></i> Backend admission record is required before enrollment', 'error');
      return;
    }
    const res = API.admissions.enroll
      ? await API.admissions.enroll(admission.id, 'Enrolled by administrator')
      : await API.admissions.updateStatus(admission.id, 'Enrolled', 'Enrolled by administrator');
    if (!res || !res.success) {
      showToast('<i class="fas fa-times-circle"></i> ' + (res?.message || 'Unable to enroll student'), 'error');
      return;
    }
    if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
    showToast('<i class="fas fa-check-circle"></i> Student marked as enrolled<br/>Name: ' + admission.name + '<br/>ID: ' + studentID, 'success', 4000);
    renderMain('admissions');
  } catch (error) {
    console.error('Enrollment failed:', error);
    showToast('<i class="fas fa-times-circle"></i> Unable to enroll student', 'error');
  }
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

function previewAdmPic(event) {
  previewAdmPicture(event?.target || event);
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

