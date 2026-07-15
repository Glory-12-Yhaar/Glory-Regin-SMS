
// VISITOR PAGES
function visitorAbout() {
  return `<div class="visitor-hero" style="margin-bottom:26px">
    <h1>About Glory Reign Preparatory School</h1>
    <p>Established in 1985, nurturing leaders for over 40 years</p>
  </div>
  <div class="g3 mb24">
    ${[['<i class="fas fa-compass"></i>', 'Our Mission', 'To provide a Gracious, Caring, Disciplined and serene Environment that will help build up the Ghanaian Child to Excel academically, Morally, Spiritually and Socially.'],
    ['<i class="fas fa-eye"></i>', 'Our Vision', 'To be an exceptional educational facility that will provide a strong and excellent foundation for the Ghanaian child to become a great future leader.'],
    ['<i class="fas fa-gem"></i>', 'Our Values', 'Excellence, Integrity, Innovation, Teamwork, Service and Respect for diversity and human dignity.']].map(([i, t, d]) => `
    <div class="card" style="text-align:center">
      <div style="font-size:40px;margin-bottom:14px">${i}</div>
      <h3 style="font-size:15px;font-weight:700;color:var(--blue-dark);margin-bottom:8px">${t}</h3>
      <p style="font-size:12.5px;color:var(--gray-500);line-height:1.7">${d}</p>
    </div>`).join('')}
  </div>
  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-scroll"></i> Our History</span></div>
    <p style="font-size:13.5px;color:var(--gray-600);line-height:1.8">Glory Reign Preparatory School was founded in 1985 by the Ghanaian Ministry of Education as a model secondary school for the Greater Accra Region. Starting with just 200 students and 12 teachers, we have grown to over 842 students across 8 classes today. Our alumni span across every continent and include politicians, doctors, engineers, artists and academics. We have consistently maintained a pass rate above 95% and have produced national champions in sports, academics and civic leadership. Today, we continue to invest in world-class facilities, exceptional teaching staff, and an enriching learning environment for every student.</p>
  </div>`;
}

function visitorAdmission() {
  return `<div class="visitor-hero" style="margin-bottom:26px">
    <h1>Admissions 2025/2026</h1>
    <p>Applications for the new academic year are now open. Join a legacy of excellence.</p>
    <div class="hero-btns"><button class="hero-btn-gold" onclick="navTo('admission')">Apply Online Now</button></div>
  </div>
  <div class="g2">
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-clipboard-list"></i> Entry Requirements</span></div>
      ${[['Age Requirement', 'Not more than 18 years at time of admission'], ['Medical Certificate', 'Current health status from a certified physician'], ['Character Reference', 'Letter from primary school headteacher'], ['Passport Photographs', '2 recent passport-sized photographs'], ['Birth Certificate', 'Original and photocopy']].map(([t, d]) => `
      <div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--gray-100)">
        <span style="color:var(--success);font-weight:800;font-size:16px;flex-shrink:0"><i class="fas fa-check"></i></span>
        <div><div style="font-size:13px;font-weight:600">${t}</div><div style="font-size:11px;color:var(--gray-400);margin-top:2px">${d}</div></div>
      </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-file-alt"></i> Application Form</span></div>
      <div class="f-row">
        <div class="f-field"><label>First Name *</label><input id="adm-first-name" placeholder="First name" required></div>
        <div class="f-field"><label>Last Name *</label><input id="adm-last-name" placeholder="Last name" required></div>
      </div>
      <div class="f-row">
        <div class="f-field"><label>Date of Birth *</label><input id="adm-dob" type="date" required></div>
        <div class="f-field">
          <label>Gender *</label>
          <select id="adm-gender" required>
            <option>Female</option>
            <option>Male</option>
          </select>
        </div>
      </div>
      <div class="f-row">
        <div class="f-field">
          <label>Class Applying *</label>
          <select id="adm-class-applying" required>
            <option value="">-- Select Class --</option>
            ${classesData.map(c => `<option value="${escapeAttr(c.name)}">${escapeHtml(c.name)}</option>`).join('')}
          </select>
        </div>
        <div class="f-field"><label>Parent/Guardian Name *</label><input id="adm-parent-name" placeholder="Full name" required></div>
      </div>
      <div class="f-row">
        <div class="f-field"><label>Contact Number *</label><input id="adm-parent-phone" placeholder="+233..." maxlength="13" required></div>
        <div class="f-field"><label>Email Address</label><input id="adm-parent-email" placeholder="email@example.com" type="email"></div>
      </div>
      <button class="btn btn-primary" style="width:100%;margin-top:10px" onclick="submitVisitorAdmission()">Submit Application</button>
    </div>
  </div>`;
}

async function submitVisitorAdmission() {
  const firstName = document.getElementById('adm-first-name')?.value.trim();
  const lastName = document.getElementById('adm-last-name')?.value.trim();
  const dob = document.getElementById('adm-dob')?.value;
  const gender = document.getElementById('adm-gender')?.value;
  const classApplying = document.getElementById('adm-class-applying')?.value;
  const parentName = document.getElementById('adm-parent-name')?.value.trim();
  const parentPhone = document.getElementById('adm-parent-phone')?.value.trim();
  const parentEmail = document.getElementById('adm-parent-email')?.value.trim();

  if (!firstName || !lastName || !dob || !gender || !classApplying || !parentName || !parentPhone) {
    showToast('<i class="fas fa-times-circle"></i> Please fill all required fields.', 'error');
    return;
  }

  if (parentPhone.length > 13) {
    showToast('<i class="fas fa-times-circle"></i> Contact number cannot exceed 13 characters.', 'error');
    return;
  }

  const applicantName = `${firstName} ${lastName}`;

  try {
    const res = await API.admissions.apply({
      applicant_name: applicantName,
      dob: dob,
      gender: gender,
      class_applying: classApplying,
      parent_name: parentName,
      parent_phone: parentPhone,
      parent_email: parentEmail
    });

    if (res && res.success) {
      showToast('<i class="fas fa-check-circle"></i> Application received successfully! Admissions will contact you.', 'success');
      document.getElementById('adm-first-name').value = '';
      document.getElementById('adm-last-name').value = '';
      document.getElementById('adm-dob').value = '';
      document.getElementById('adm-parent-name').value = '';
      document.getElementById('adm-parent-phone').value = '';
      document.getElementById('adm-parent-email').value = '';
    } else {
      showToast(res?.message || 'Failed to submit application. Please try again.', 'error');
    }
  } catch (e) {
    showToast('An error occurred during submission.', 'error');
    console.error(e);
  }
}

function visitorNews() {
  if (!newsArticles.length && typeof API !== 'undefined' && API.news && !window.publicNewsListSyncStarted) {
    window.publicNewsListSyncStarted = true;
    API.news.list().then(res => {
      if (res && res.success && Array.isArray(res.data)) {
        newsArticles.splice(0, newsArticles.length, ...res.data.map(article => ({
          id: parseInt(article.id, 10),
          title: article.title || '',
          icon: article.icon || '<i class="fas fa-newspaper"></i>',
          date: article.date || '',
          category: article.category || 'General',
          desc: article.desc || '',
          content: article.content || '',
          status: article.status || 'Published'
        })));
        if (currentRole === 'Visitor' && currentMod === 'news' && typeof renderMain === 'function') renderMain();
      }
    }).catch(() => {
      window.publicNewsListSyncStarted = false;
    });
  }
  const articlesHTML = newsArticles
    .filter(article => article.status === 'Published')
    .map(article => `
    <div class="card">
      <div style="width:100%;height:100px;background:var(--blue-xpale);border-radius:var(--radius);display:flex;align-items:center;justify-content:center;font-size:42px;margin-bottom:14px">${article.icon}</div>
      <h3 style="font-size:14px;font-weight:700;color:var(--blue-dark);margin-bottom:8px">${escapeHtml(article.title)}</h3>
      <p style="font-size:12px;color:var(--gray-400);line-height:1.6;margin-bottom:10px">${escapeHtml(article.desc)}</p>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:10px;color:var(--gray-400)">${escapeHtml(article.date)}</span>
        <button class="btn btn-secondary btn-xs" onclick="showNewsArticleById(${article.id})">Read More</button>
      </div>
    </div>`).join('');

  return `${hdr('News & Blog', 'Latest news, events and stories from Glory Reign Preparatory School', 'News')}
  <div class="g3">
    ${articlesHTML || '<div class="card" style="text-align:center;color:var(--gray-400);padding:24px">No published news articles yet.</div>'}
  </div>`;
}

function showNewsArticleById(articleId) {
  const article = newsArticles.find(item => item.id === articleId);
  if (!article) return;
  showNewsArticle(article.title, article.content, article);
}

function showNewsArticle(title, content, article = {}) {
  const paragraphs = String(content || '')
    .split(/\n+/)
    .map(part => part.trim())
    .filter(Boolean);
  const modal = `
    <article class="newspaper-article">
      <div class="newspaper-kicker">${escapeHtml(article.category || 'School News')}</div>
      <h1>${escapeHtml(title)}</h1>
      <div class="newspaper-meta">
        <span><i class="fas fa-school"></i> Glory Reign News Desk</span>
        <span><i class="fas fa-calendar"></i> ${escapeHtml(article.date || new Date().toLocaleDateString())}</span>
      </div>
      <div class="newspaper-rule"></div>
      <div class="newspaper-lead">${escapeHtml(article.desc || paragraphs[0] || '')}</div>
      <div class="newspaper-body">
        ${paragraphs.map(part => `<p>${escapeHtml(part)}</p>`).join('')}
      </div>
      <div class="newspaper-footer">
        <button class="btn btn-secondary" onclick="closeModal()"><i class="fas fa-arrow-left"></i> Back to News</button>
      </div>
    </article>
  `;
  openModal(modal);
}

// CONTACT MESSAGES STORAGE
let contactMessages = [];


// NEWS & BLOG ARTICLES CACHE
var newsArticles = window.newsArticles || [];
window.newsArticles = newsArticles;

// NEWS MANAGEMENT MODULE
function newsModule() {
  const articlesHTML = newsArticles.map(article => `
    <div class="card mb16">
      <div style="display:flex;gap:14px">
        <div style="font-size:40px;flex-shrink:0">${article.icon}</div>
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:6px">
            <h4 style="font-size:13px;font-weight:700;color:var(--blue-dark)">${article.title}</h4>
            <span class="badge b-${article.status === 'Published' ? 'success' : 'warning'}">${article.status}</span>
          </div>
          <div style="font-size:11px;color:var(--gray-400);margin-bottom:8px">${article.date} · ${article.category}</div>
          <p style="font-size:12px;color:var(--gray-600);line-height:1.6;margin-bottom:10px">${article.desc}</p>
          <div style="display:flex;gap:6px">
            <button class="btn btn-secondary btn-xs" onclick="editArticleModal(${article.id})"><i class="fas fa-edit"></i> Edit</button>
            <button class="btn btn-danger btn-xs" onclick="deleteArticle(${article.id})"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  return hdr('News & Blog Management', 'Create, edit and publish school news and blog posts', 'News') + `
  <div class="g21">
    <div>
      <div style="font-size:14px;font-weight:700;color:var(--blue-dark);margin-bottom:16px"><i class="fas fa-newspaper"></i> Articles (${newsArticles.length})</div>
      ${articlesHTML}
    </div>
    <div class="card" style="height:fit-content;position:sticky;top:100px">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-pen"></i> Create New Article</span></div>
      <div class="f-field" style="margin-bottom:12px">
        <label>Article Title *</label>
        <input placeholder="Enter article title..." id="blogTitle">
      </div>
      <div class="f-field" style="margin-bottom:12px">
        <label>Icon/Emoji *</label>
        <input placeholder="e.g., ?? or fa-newspaper" id="blogIcon" value="??" maxlength="2">
      </div>
      <div class="f-row">
        <div class="f-field">
          <label>Publish Date *</label>
          <input type="date" id="blogDate">
        </div>
        <div class="f-field">
          <label>Category *</label>
          <select id="blogCategory">
            <option value="">Select Category</option>
            <option>Academic</option>
            <option>Events</option>
            <option>Infrastructure</option>
            <option>Student Achievement</option>
            <option>Community</option>
          </select>
        </div>
      </div>
      <div class="f-field" style="margin-bottom:12px">
        <label>Short Description *</label>
        <input placeholder="Brief summary for listing..." id="blogDesc" maxlength="120">
      </div>
      <div class="f-field" style="margin-bottom:12px">
        <label>Full Content *</label>
        <textarea placeholder="Write the complete article here..." style="min-height:120px;resize:vertical" id="blogContent"></textarea>
      </div>
      <div class="f-field" style="margin-bottom:12px">
        <label>Status</label>
        <select id="blogStatus">
          <option>Draft</option>
          <option selected>Published</option>
        </select>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="publishNews()"><i class="fas fa-upload"></i> Publish Article</button>
        <button class="btn btn-secondary" onclick="clearNewsForm()"><i class="fas fa-sync"></i> Clear</button>
      </div>
    </div>
  </div>`;
}

async function publishNews() {
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

  if (typeof API === 'undefined' || !API.news) {
    showToast('News backend is not available. Article was not saved.', 'error');
    return;
  }

  const res = await API.news.create({ title, icon, date, category, desc, content, status });
  if (res && res.success) {
    showToast('<i class="fas fa-check-circle"></i> Article published successfully!', 'success');
    clearNewsForm();
    if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
    renderMain('news');
  } else {
    showToast(res?.message || 'Failed to publish article', 'error');
  }
}

function clearNewsForm() {
  document.getElementById('blogTitle').value = '';
  document.getElementById('blogIcon').value = '<i class="fas fa-newspaper"></i>';
  document.getElementById('blogDate').value = '';
  document.getElementById('blogCategory').value = '';
  document.getElementById('blogDesc').value = '';
  document.getElementById('blogContent').value = '';
  document.getElementById('blogStatus').value = 'Published';
}

function editArticleModal(articleId) {
  const article = newsArticles.find(a => a.id === articleId);
  if (!article) return;

  const modal = `
    <div style="padding:30px;max-width:850px;max-height:90vh;overflow-y:auto">
      <h2 style="font-size:18px;font-weight:700;color:var(--blue-dark);margin-bottom:20px"><i class="fas fa-edit"></i> Edit Article</h2>
      
      <div class="f-field" style="margin-bottom:12px">
        <label>Article Title</label>
        <input id="editTitle" placeholder="Enter article title..." value="${article.title}">
      </div>
      
      <div class="f-field" style="margin-bottom:12px">
        <label>Icon/Emoji</label>
        <input id="editIcon" placeholder="Choose icon..." value="${article.icon}" maxlength="2">
      </div>
      
      <div class="f-row">
        <div class="f-field">
          <label>Date</label>
          <input type="date" id="editDate" value="${article.date}">
        </div>
        <div class="f-field">
          <label>Category</label>
          <select id="editCategory">
            <option ${article.category === 'Academic' ? 'selected' : ''}>Academic</option>
            <option ${article.category === 'Events' ? 'selected' : ''}>Events</option>
            <option ${article.category === 'Infrastructure' ? 'selected' : ''}>Infrastructure</option>
            <option ${article.category === 'Student Achievement' ? 'selected' : ''}>Student Achievement</option>
            <option ${article.category === 'Community' ? 'selected' : ''}>Community</option>
          </select>
        </div>
      </div>
      
      <div class="f-field" style="margin-bottom:12px">
        <label>Short Description</label>
        <input id="editDesc" placeholder="Brief summary..." value="${article.desc}" maxlength="120">
      </div>
      
      <div class="f-field" style="margin-bottom:12px">
        <label>Full Content</label>
        <textarea id="editContent" style="min-height:150px;resize:vertical">${article.content}</textarea>
      </div>
      
      <div class="f-field" style="margin-bottom:16px">
        <label>Status</label>
        <select id="editStatus">
          <option ${article.status === 'Draft' ? 'selected' : ''}>Draft</option>
          <option ${article.status === 'Published' ? 'selected' : ''}>Published</option>
        </select>
      </div>
      
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="saveArticleChanges(${articleId})"><i class="fas fa-save"></i> Save Changes</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `;
  openModal(modal);
}

async function saveArticleChanges(articleId) {
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

  if (typeof API === 'undefined' || !API.news) {
    showToast('News backend is not available. Article was not saved.', 'error');
    return;
  }

  const res = await API.news.update(articleId, { title, icon, date, category, desc, content, status });
  if (res && res.success) {
    showToast('<i class="fas fa-check-circle"></i> Article updated successfully!', 'success');
    closeModal();
    if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
    renderMain('news');
  } else {
    showToast(res?.message || 'Failed to update article', 'error');
  }
}

async function deleteArticle(articleId) {
  if (!confirm('<i class="fas fa-trash"></i> Are you sure you want to delete this article? This action cannot be undone.')) return;

  if (typeof API === 'undefined' || !API.news) {
    showToast('News backend is not available. Article was not deleted.', 'error');
    return;
  }

  const res = await API.news.delete(articleId);
  if (res && res.success) {
    showToast('<i class="fas fa-check-circle"></i> Article deleted successfully!', 'success');
    if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
    renderMain('news');
  } else {
    showToast(res?.message || 'Failed to delete article', 'error');
  }
}

async function saveDraft() {
  const title = document.getElementById('blogTitle')?.value?.trim() || '';
  const icon = document.getElementById('blogIcon')?.value?.trim() || '<i class="fas fa-newspaper"></i>';
  const date = document.getElementById('blogDate')?.value || new Date().toISOString().slice(0, 10);
  const category = document.getElementById('blogCategory')?.value || 'General';
  const desc = document.getElementById('blogDesc')?.value?.trim() || '';
  const content = document.getElementById('blogContent')?.value?.trim() || '';
  if (!title) {
    showToast('<i class="fas fa-exclamation-triangle"></i> Please enter a title', 'warning');
    return;
  }
  if (typeof API === 'undefined' || !API.news) {
    showToast('News backend is not available. Draft was not saved.', 'error');
    return;
  }

  const res = await API.news.create({ title, icon, date, category, desc, content, status: 'Draft' });
  if (res && res.success) {
    showToast('<i class="fas fa-save"></i> Draft saved successfully!', 'success');
    clearNewsForm();
    if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
    renderMain('news');
  } else {
    showToast(res?.message || 'Failed to save draft', 'error');
  }
}

async function sendContactMessage() {
  const nameInput = document.querySelector('.contact-form input[placeholder="Full name"]');
  const emailInput = document.querySelector('.contact-form input[placeholder="your@email.com"]');
  const subjectInput = document.querySelector('.contact-form input[placeholder="What is this about?"]');
  const messageInput = document.querySelector('.contact-form textarea');

  const name = nameInput?.value.trim();
  const email = emailInput?.value.trim();
  const subject = subjectInput?.value.trim();
  const message = messageInput?.value.trim();

  // Validation
  if (!name) { showToast('<i class="fas fa-times-circle"></i> Please enter your name', 'error'); return; }
  if (!email || !email.includes('@')) { showToast('<i class="fas fa-times-circle"></i> Please enter a valid email', 'error'); return; }
  if (!subject) { showToast('<i class="fas fa-times-circle"></i> Please enter a subject', 'error'); return; }
  if (!message) { showToast('<i class="fas fa-times-circle"></i> Please enter your message', 'error'); return; }

  if (typeof API === 'undefined' || !API.contact) {
    showToast('Contact backend is not available. Message was not sent.', 'error');
    return;
  }

  const res = await API.contact.submit({ name, email, subject, message });
  if (!res || !res.success) {
    showToast(res?.message || 'Failed to send message', 'error');
    return;
  }

  // Clear form
  nameInput.value = '';
  emailInput.value = '';
  subjectInput.value = '';
  messageInput.value = '';

  // Notify admin
  showToast('<i class="fas fa-check-circle"></i> Message sent successfully! The admin will respond soon.', 'success');

}

function visitorContact() {
  return `<div class="visitor-hero" style="margin-bottom:26px">
    <h1>Contact Us</h1>
    <p>We would love to hear from you. Get in touch with Glory Reign Preparatory School.</p>
  </div>
  <div class="g2">
    <div>
      ${[['<i class="fas fa-map-pin"></i>', 'Address', 'P.O. Box 42, Jirapa\nUpper West Region, Ghana'],
    ['<i class="fas fa-phone"></i>', 'Phone', '0243611971 /\n0205096091'],
    ['<i class="fas fa-envelope"></i>', 'Email', SCHOOL_EMAIL],
    ['<i class="fas fa-clock"></i>', 'Office Hours', 'Monday–Friday: 7:00 AM – 5:00 PM']].map(([i, l, v]) => `
      <div class="card mb16" style="display:flex;gap:16px;align-items:flex-start">
        <div class="notice-icon" style="background:var(--blue-xpale)">${i}</div>
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--blue-dark);margin-bottom:6px">${l}</div>
          <div style="font-size:12.5px;color:var(--gray-600);line-height:1.7">${v}</div>
        </div>
      </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-envelope"></i> Send Us a Message</span></div>
      <div class="contact-form">
        <div class="f-row"><div class="f-field"><label>Your Name</label><input placeholder="Full name"></div><div class="f-field"><label>Email</label><input placeholder="your@email.com"></div></div>
        <div class="f-field" style="margin-bottom:12px"><label>Subject</label><input placeholder="What is this about?"></div>
        <div class="f-field" style="margin-bottom:14px"><label>Message</label><textarea placeholder="Your message..." style="min-height:140px"></textarea></div>
        <button class="btn btn-primary" style="width:100%" onclick="sendContactMessage()">Send Message <i class="fas fa-paper-plane"></i></button>
      </div>
    </div>
  </div>`;
}

function visitorGallery() {
  return hdr('School Gallery', 'A visual journey through life at Glory Reign Preparatory School', 'Gallery') + `
  <div class="gal-grid">
    ${[['<i class="fas fa-running"></i>', 'Sports Day 2024', '#dbeafe'],
    ['<i class="fas fa-graduation-cap"></i>', 'Prize Giving Ceremony', '#fef3c7'],
    ['<i class="fas fa-book"></i>', 'School Library', '#ede9fe'],
    ['<i class="fas fa-theater-masks"></i>', 'Drama & Arts Club', '#e0f2fe'],
    ['<i class="fas fa-leaf"></i>', 'Beautiful Campus', '#d1fae5'],
    ['<i class="fas fa-user"></i><i class="fas fa-laptop" style="margin-left:6px"></i>', 'ICT Laboratory', '#dbeafe'],
    ['<i class="fas fa-palette"></i>', 'Art Exhibition', '#fef3c7'],
    ['<i class="fas fa-trophy"></i>', 'Champions Cup 2024', '#fef3c7'],
    ['<i class="fas fa-music"></i>', 'School Choir', '#ede9fe'],
    ['<i class="fas fa-globe"></i>', 'Field Trip', '#d1fae5']].map(([icon, label, bg]) => `
    <div class="gal-item" style="background:${bg}">
      <div class="gi-icon">${icon}</div>
      <div class="gi-label">${label}</div>
    </div>`).join('')}
  </div>`;
}

// -----------------------------------
// ALUMNI GALLERY MODULE
// -----------------------------------
function galleryModule() {
  return hdr('Alumni Gallery', 'Relive memories from school events, graduations, and reunions', 'Gallery') + `
  <div class="toolbar" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px">
    <div class="search-bar" style="flex:1;min-width:200px"><span><i class="fas fa-search"></i></span><input id="gallery-search" placeholder="Search albums..." ></div>
    <select class="select-sm"><option>All Categories</option><option>Graduations</option><option>Reunions</option><option>Sports</option><option>School Events</option></select>
    <select class="select-sm"><option>All Years</option><option>2024</option><option>2023</option><option>2022</option><option>Older</option></select>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:20px;">
    ${[
      { title: 'Class of 2024 Graduation', category: 'Graduations', year: '2024', items: 124, icon: 'fa-graduation-cap', bg: 'linear-gradient(135deg, #3b82f6, #1e3a5f)' },
      { title: 'Alumni Reunion Dinner', category: 'Reunions', year: '2023', items: 85, icon: 'fa-glass-cheers', bg: 'linear-gradient(135deg, #f59e0b, #d97706)' },
      { title: 'Inter-House Sports Meet', category: 'Sports', year: '2024', items: 210, icon: 'fa-running', bg: 'linear-gradient(135deg, #10b981, #047857)' },
      { title: '10th Anniversary Gala', category: 'School Events', year: '2022', items: 150, icon: 'fa-star', bg: 'linear-gradient(135deg, #8b5cf6, #5b21b6)' },
      { title: 'Class of 2018 Get-together', category: 'Reunions', year: '2023', items: 42, icon: 'fa-users', bg: 'linear-gradient(135deg, #ef4444, #b91c1c)' },
      { title: 'Science Fair Exhibition', category: 'School Events', year: '2023', items: 68, icon: 'fa-flask', bg: 'linear-gradient(135deg, #06b6d4, #0369a1)' }
    ].map(album => `
    <div class="card" style="padding:0;overflow:hidden;transition:transform 0.2s, box-shadow 0.2s;cursor:pointer;" onmouseover="this.style.transform='translateY(-5px)';this.style.boxShadow='0 15px 30px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='none';this.style.boxShadow='var(--shadow)'" onclick="openAlbumView('${album.title}', '${album.icon}', '${album.bg}')">
      <div style="height:160px;background:${album.bg};display:flex;align-items:center;justify-content:center;color:white;font-size:48px;position:relative">
        <i class="fas ${album.icon}"></i>
        <div style="position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,0.5);padding:4px 10px;border-radius:12px;font-size:11px;font-weight:600"><i class="fas fa-camera"></i> ${album.items}</div>
      </div>
      <div style="padding:16px;">
        <h3 style="margin:0 0 4px 0;font-size:16px;font-weight:700;color:var(--gray-800)">${album.title}</h3>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
          <span class="badge b-info">${album.category}</span>
          <span style="font-size:12px;color:var(--gray-500)"><i class="fas fa-calendar"></i> ${album.year}</span>
        </div>
      </div>
    </div>`).join('')}
  </div>`;
}

function openAlbumView(title, icon, bg) {
  let photosHtml = '';
  // Generate 12 mock photos
  for(let i=1; i<=12; i++) {
    let delay = i * 0.05;
    photosHtml += `
    <div style="background:var(--gray-100);border-radius:8px;aspect-ratio:1;display:flex;align-items:center;justify-content:center;color:var(--gray-300);font-size:32px;animation:fade-in 0.3s ease-out ${delay}s both;position:relative;overflow:hidden;cursor:zoom-in" onclick="this.style.transform='scale(1.05)';setTimeout(()=>this.style.transform='scale(1)', 200)">
      <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:${bg};opacity:0.1"></div>
      <i class="fas ${icon}"></i>
      <div style="position:absolute;bottom:8px;left:8px;font-size:10px;font-weight:600;color:var(--gray-500);background:rgba(255,255,255,0.8);padding:2px 6px;border-radius:4px">IMG_${1000 + i}.jpg</div>
    </div>`;
  }
  
  openModal(`
    <div style="padding:24px;width:900px;max-width:95vw;max-height:90vh;display:flex;flex-direction:column">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;border-bottom:1px solid var(--gray-200);padding-bottom:16px">
        <div>
          <h2 style="margin:0;font-size:24px;color:var(--blue-dark);display:flex;align-items:center;gap:12px"><i class="fas ${icon}" style="color:var(--gold)"></i> ${title}</h2>
          <div style="font-size:13px;color:var(--gray-500);margin-top:6px">12 Photos</div>
        </div>
        <button class="btn btn-secondary" onclick="closeModal()"><i class="fas fa-arrow-left"></i> Back to Gallery</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(180px, 1fr));gap:16px;overflow-y:auto;padding-right:8px;padding-bottom:20px">
        ${photosHtml}
      </div>
    </div>
  `, true);
}


// -----------------------------------
// TRANSPORT TRACKING MODULE (PARENT)
// -----------------------------------
const TRANSPORT_DATA = [
  { id: 1, student: 'Ama Serwaa', bus: 'Bus A1', driver: 'Mr. Mensah', phone: '+233-543-123-456', route: 'East Ridge - Tunga', pickupTime: '7:30 AM', dropoffTime: '3:45 PM', status: 'Active', currentLocation: 'Tunga Junction', gpsTracking: true, stops: 4 },
  { id: 2, student: 'Kweku Serwaa', bus: 'Bus B2', driver: 'Mr. Kofi Adu', phone: '+233-544-567-890', route: 'West Gate - Town Center', pickupTime: '7:15 AM', dropoffTime: '3:30 PM', status: 'Active', currentLocation: 'Market Street', gpsTracking: true, stops: 5 }
];

function transportModule() {
  const linkedChildNames = new Set(
    (typeof getParentChildren === 'function' ? getParentChildren() : [])
      .map(child => normalizeIdentity(child.name))
  );
  const assignedBuses = TRANSPORT_DATA.filter(bus => linkedChildNames.has(normalizeIdentity(bus.student)));
  const trackedBuses = assignedBuses.filter(bus => bus.gpsTracking);
  const availableDrivers = new Set(assignedBuses.map(bus => bus.driver)).size;
  const allAssignedBusesActive = assignedBuses.length > 0 && assignedBuses.every(bus => bus.status === 'Active');
  let html = hdr('Transport Tracking', 'Monitor school bus schedules and real-time location tracking', 'Transport');
  
  html += `
  <div class="stats-row" style="margin-bottom:20px">
    ${statCard('<i class="fas fa-bus"></i>', assignedBuses.length, 'Assigned Buses', allAssignedBusesActive ? 'All active' : assignedBuses.length ? 'Check status' : 'None assigned', allAssignedBusesActive ? 'up' : 'neu', 'si-blue')}
    ${statCard('<i class="fas fa-map-marker-alt"></i>', trackedBuses.length, 'GPS Tracking', trackedBuses.length ? 'Real-time' : 'Unavailable', trackedBuses.length ? 'up' : 'neu', 'si-green')}
    ${statCard('<i class="fas fa-user-tie"></i>', availableDrivers, 'Drivers Available', availableDrivers ? 'All verified' : 'None assigned', 'neu', 'si-gold')}
    ${statCard('<i class="fas fa-check-circle"></i>', assignedBuses.length ? '100%' : 'N/A', 'Safety Rating', assignedBuses.length ? 'Excellent' : 'No assigned buses', assignedBuses.length ? 'up' : 'neu', 'si-green')}
  </div>

  <div class="g2" style="margin-bottom:20px">
    <div class="card">
      <div class="card-hdr">
        <span class="card-title"><i class="fas fa-bus"></i> My Children's Bus Assignments</span>
        <button class="btn btn-secondary btn-sm" onclick="refreshTransportData()" style="cursor:pointer"><i class="fas fa-sync"></i> Refresh</button>
      </div>
      <div style="max-height:500px;overflow-y:auto">
        ${assignedBuses.map(bus => `
        <div style="padding:16px;border:1.5px solid var(--gray-200);border-radius:12px;margin-bottom:12px;background:var(--gray-50)">
          <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px">
            <div>
              <div style="font-size:14px;font-weight:700;color:var(--blue-dark)">${escapeHtml(bus.student)}</div>
              <div style="font-size:12px;color:var(--gray-500)">${escapeHtml(bus.bus)} · Route: ${escapeHtml(bus.route)}</div>
            </div>
            <span class="badge ${bus.status === 'Active' ? 'b-success' : 'b-warning'}"><i class="fas fa-circle" style="font-size:8px;margin-right:4px"></i>${escapeHtml(bus.status)}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:10px">
            <div style="padding:10px;background:white;border-radius:8px">
              <div style="font-size:11px;color:var(--gray-500);text-transform:uppercase;font-weight:600;margin-bottom:4px">Pickup Time</div>
              <div style="font-size:14px;font-weight:700;color:var(--blue-main)">${bus.pickupTime}</div>
            </div>
            <div style="padding:10px;background:white;border-radius:8px">
              <div style="font-size:11px;color:var(--gray-500);text-transform:uppercase;font-weight:600;margin-bottom:4px">Dropoff Time</div>
              <div style="font-size:14px;font-weight:700;color:var(--blue-main)">${bus.dropoffTime}</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:10px">
            <div style="padding:10px;background:white;border-radius:8px">
              <div style="font-size:11px;color:var(--gray-500);text-transform:uppercase;font-weight:600;margin-bottom:4px">Driver</div>
              <div style="font-size:13px;font-weight:600;color:var(--gray-800)">${escapeHtml(bus.driver)}</div>
            </div>
            <div style="padding:10px;background:white;border-radius:8px">
              <div style="font-size:11px;color:var(--gray-500);text-transform:uppercase;font-weight:600;margin-bottom:4px">Contact</div>
              <div style="font-size:13px;font-weight:600;color:var(--blue-main);cursor:pointer" onclick="callDriver('${bus.phone}')">${bus.phone}</div>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
            <div style="padding:10px;background:white;border-radius:8px">
              <div style="font-size:11px;color:var(--gray-500);text-transform:uppercase;font-weight:600;margin-bottom:4px">Current Location</div>
              <div style="font-size:12px;font-weight:600;color:var(--green)">${escapeHtml(bus.currentLocation)}</div>
            </div>
            <div style="padding:10px;background:white;border-radius:8px">
              <div style="font-size:11px;color:var(--gray-500);text-transform:uppercase;font-weight:600;margin-bottom:4px">Scheduled Stops</div>
              <div style="font-size:12px;font-weight:600">${bus.stops} stops on route</div>
            </div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-primary btn-sm" onclick="viewGPSTracking(${bus.id})" style="flex:1;cursor:pointer"><i class="fas fa-map"></i> View GPS Map</button>
            <button class="btn btn-secondary btn-sm" onclick="notifyDriver(${bus.id})" style="flex:1;cursor:pointer"><i class="fas fa-bell"></i> Notify Driver</button>
            <button class="btn btn-info btn-sm" onclick="busDetails(${bus.id})" style="flex:1;cursor:pointer"><i class="fas fa-info-circle"></i> Details</button>
          </div>
        </div>
        `).join('') || '<div style="padding:28px;text-align:center;color:var(--gray-500)">No bus assignment is linked to your children.</div>'}
      </div>
    </div>
    <div class="card">
      <div class="card-hdr"><span class="card-title"><i class="fas fa-route"></i> Bus Routes & Schedules</span></div>
      <table class="tbl" style="font-size:12px">
        <thead><tr><th>Bus</th><th>Route</th><th>Driver</th><th>Stops</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          ${assignedBuses.map(bus => `
          <tr>
            <td><strong>${escapeHtml(bus.bus)}</strong></td>
            <td>${escapeHtml(bus.route)}</td>
            <td>${escapeHtml(bus.driver)}</td>
            <td>${bus.stops}</td>
            <td><span class="badge ${bus.status === 'Active' ? 'b-success' : 'b-warning'}">${escapeHtml(bus.status)}</span></td>
            <td><button class="btn btn-secondary btn-xs" onclick="busDetails(${bus.id})" style="cursor:pointer">Details</button></td>
          </tr>
          `).join('') || '<tr><td colspan="6" style="padding:24px;text-align:center;color:var(--gray-500)">No assigned route available.</td></tr>'}
        </tbody>
      </table>
      <div style="margin-top:12px;padding:12px;background:var(--blue-xpale);border-radius:8px">
        <div style="font-size:12px;color:var(--blue-main);font-weight:600"><i class="fas fa-lightbulb"></i> Tip</div>
        <div style="font-size:11px;color:var(--blue-dark);margin-top:4px">Check real-time GPS tracking to see exactly where the bus is at any moment during transit.</div>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-hdr"><span class="card-title"><i class="fas fa-lock"></i> Safety & Emergency</span></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div style="padding:14px;background:var(--success-light);border-radius:10px;border:1px solid var(--success)">
        <div style="font-size:12px;font-weight:600;color:var(--success);margin-bottom:6px"><i class="fas fa-heartbeat"></i> Safety Status</div>
        <div style="font-size:14px;font-weight:700;color:var(--success)">All Clear</div>
        <div style="font-size:11px;color:var(--gray-600);margin-top:4px">No safety incidents reported</div>
        <button class="btn btn-success btn-sm" onclick="viewSafetyReport()" style="margin-top:8px;width:100%;cursor:pointer"><i class="fas fa-shield-alt"></i> View Safety Report</button>
      </div>
      <div style="padding:14px;background:var(--info-light);border-radius:10px;border:1px solid var(--info)">
        <div style="font-size:12px;font-weight:600;color:var(--blue-main);margin-bottom:6px"><i class="fas fa-sos"></i> Emergency Contacts</div>
        <div style="font-size:14px;font-weight:700;color:var(--blue-main)">+233-500-911-911</div>
        <div style="font-size:11px;color:var(--gray-600);margin-top:4px">School Transport Emergency Hotline</div>
        <button class="btn btn-info btn-sm" onclick="showEmergencyContacts()" style="margin-top:8px;width:100%;cursor:pointer"><i class="fas fa-phone"></i> More Contacts</button>
      </div>
    </div>
  </div>`;

  return html;
}

// Transport module functions
function viewGPSTracking(busId) {
  showToast('<i class="fas fa-map"></i> Opening GPS Tracking Map...', 'info');
  console.log('GPS Tracking for bus:', busId);
}

function notifyDriver(busId) {
  showToast('<i class="fas fa-bell"></i> Notification sent to driver!', 'success');
  console.log('Notified driver of bus:', busId);
}

function busDetails(busId) {
  const bus = TRANSPORT_DATA.find(b => b.id === busId);
  if (bus) {
    showToast(`<i class="fas fa-info-circle"></i> Bus ${bus.bus} - Driver: ${bus.driver}`, 'info');
  }
}

function refreshTransportData() {
  showToast('<i class="fas fa-sync"></i> Refreshing transport data...', 'info');
  setTimeout(() => {
    showToast('<i class="fas fa-check"></i> Data refreshed!', 'success');
    renderMain();
  }, 1500);
}

function editRoute(busId) {
  showToast('<i class="fas fa-edit"></i> Edit route feature coming soon!', 'info');
}

function callDriver(phone) {
  showToast(`<i class="fas fa-phone"></i> Calling ${phone}...`, 'info');
}

function viewSafetyReport() {
  showToast('<i class="fas fa-file"></i> Safety Report: All buses pass safety inspections. Last inspection: March 10, 2025', 'info');
}

function showEmergencyContacts() {
  showToast('<i class="fas fa-phone"></i> Emergency: +233-500-911-911 | School: +233-123-456-789 | Bus Dispatcher: +233-555-789-012', 'info');
}

// Parent module helper functions
function requestLeaveExcuse() {
  showToast('<i class="fas fa-envelope"></i> Leave request submitted to class teacher. You will receive a response within 24 hours.', 'success');
}

function downloadPaymentReceipt() {
  showToast('<i class="fas fa-download"></i> Downloading payment receipt...', 'info');
  setTimeout(() => showToast('<i class="fas fa-check"></i> Receipt downloaded!', 'success'), 1500);
}

function makePayment() {
  showToast('<i class="fas fa-money-bill"></i> Payment gateway integration - Coming soon!', 'info');
}

function viewGeneralPaymentHistory() {
  showToast('<i class="fas fa-history"></i> Opening full payment history...', 'info');
}

function openTeacherShortcut(teacherId) {
  navTo('teachers');
  showToast('<i class="fas fa-chalkboard-teacher"></i> Opening teacher details...', 'info');
}

function viewAssignmentDetails(assignmentId) {
  const title = String(assignmentId || '');
  const assignment = (window.assignmentsData || []).find(a => String(a.id) === title || a.title === title);
  if (!assignment) {
    showToast('<i class="fas fa-info-circle"></i> Open assignments to view current records', 'info');
    navTo('assignments');
    return;
  }
  const el = document.getElementById('main-content');
  if (!el) return;
  currentMod = 'dashboard';
  el.innerHTML = hdr('Assignment Details', escapeHtml(assignment.title), 'Dashboard') + `
    <div class="card" style="max-width:760px">
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:16px 0">
        <div style="background:var(--blue-xpale);padding:12px;border-radius:8px"><div style="font-size:10px;color:var(--gray-500);font-weight:700">SUBJECT</div><div style="font-size:13px;font-weight:700">${escapeHtml(assignment.subject || 'General')}</div></div>
        <div style="background:var(--gray-50);padding:12px;border-radius:8px"><div style="font-size:10px;color:var(--gray-500);font-weight:700">CLASS</div><div style="font-size:13px;font-weight:700">${escapeHtml(assignment.className || assignment.class || 'All')}</div></div>
        <div style="background:var(--gold-xlight);padding:12px;border-radius:8px"><div style="font-size:10px;color:var(--gray-500);font-weight:700">DUE</div><div style="font-size:13px;font-weight:700">${escapeHtml(assignment.dueDate || assignment.due_date || 'TBD')}</div></div>
      </div>
      <p style="font-size:13px;color:var(--gray-600);line-height:1.7">${escapeHtml(assignment.instructions || 'Complete the work and submit through the assignments module.')}</p>
      <div style="display:flex;gap:8px;margin-top:18px">
        <button class="btn btn-primary" onclick="navTo('assignments')" style="flex:1"><i class="fas fa-upload"></i> Open Assignments</button>
        <button class="btn btn-secondary" onclick="submitAssignmentQuery()" style="flex:1"><i class="fas fa-question-circle"></i> Ask Teacher</button>
      </div>
    </div>
  `;
  window.scrollTo(0, 0);
}

function submitAssignmentQuery() {
  showToast('<i class="fas fa-question-circle"></i> Your query has been sent to the teacher!', 'success');
}

function startVoiceCall(contactName) {
  const safeName = contactName || 'this contact';
  openModal(`
    <div style="padding:22px;max-width:420px;text-align:center">
      <div style="width:56px;height:56px;border-radius:50%;background:var(--blue-xpale);color:var(--blue-main);display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:24px"><i class="fas fa-phone"></i></div>
      <h3 style="margin:0 0 8px;color:var(--blue-dark)">Call ${escapeHtml(safeName)}</h3>
      <p style="font-size:13px;color:var(--gray-600);line-height:1.6;margin-bottom:18px">Use the school office line or continue the conversation in Messages. The call request is logged for follow-up.</p>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary" style="flex:1" onclick="closeModal();showToast('<i class=\\'fas fa-check-circle\\'></i> Call request logged for ${escapeHtml(safeName)}', 'success')">Log Call Request</button>
        <button class="btn btn-secondary" style="flex:1" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

// -----------------------------------
// BUTTON HANDLERS & UTILITIES
// -----------------------------------

// Generic form save handler
function saveForm(message = 'Saved successfully!') {
  showToast('<i class="fas fa-check-circle"></i> ' + message, 'success');
}

// Save attendance
function saveAttendance() {
  if (currentRole !== 'Teacher') {
    showToast('<i class="fas fa-times-circle"></i> Only class teachers can mark attendance', 'error');
    return;
  }

  const className = document.getElementById('attendance-class')?.value || getAssignedClassNamesForTeacher()[0];
  const date = document.getElementById('attendance-date')?.value || new Date().toISOString().slice(0, 10);
  if (!className || !getAssignedClassNamesForTeacher().includes(className)) {
    showToast('<i class="fas fa-times-circle"></i> Select one of your assigned classes', 'error');
    return;
  }

  const records = Array.from(document.querySelectorAll('.attendance-row')).map(row => {
    const checked = row.querySelector('input[type="radio"]:checked');
    return {
      studentId: row.dataset.studentId || '',
      student: row.dataset.studentName || '',
      status: checked?.value || 'P'
    };
  });

  if (records.length === 0) {
    showToast('<i class="fas fa-times-circle"></i> Please mark attendance for at least one student', 'error');
    return;
  }

  const teacher = getCurrentTeacherProfile();
  const teacherName = teacher?.name || getSessionUser()?.name || 'Class Teacher';
  const present = records.filter(r => r.status === 'P').length;
  const absent = records.filter(r => r.status === 'A').length;
  const batch = {
    id: Date.now(),
    date,
    className,
    teacherId: getCurrentTeacherId(),
    teacherName,
    submittedAt: new Date().toISOString(),
    present,
    absent,
    late: 0,
    records
  };
  const batches = getAttendanceBatches().filter(b => !(b.className === className && b.date === date));
  batches.unshift(batch);
  saveAttendanceBatches(batches);
  showToast('<i class="fas fa-check-circle"></i> Attendance successfully recorded for ' + className + ' on ' + formatAttendanceDate(date) + '.', 'success', 5000);
  renderMain();
}

// TEACHER DASHBOARD INTERACTIVE FUNCTIONS
function viewScheduleDetail(time, subject, className) {
  const modal = `
    <div style="padding:20px;max-width:600px">
      <h2 style="color:var(--blue-dark);margin-bottom:16px"><i class="fas fa-calendar"></i> Class Details</h2>
      <div style="background:var(--blue-xpale);padding:16px;border-radius:8px;margin-bottom:16px;border-left:4px solid var(--blue-main)">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;font-size:13px">
          <div><div style="color:var(--gray-500);font-size:11px;margin-bottom:4px">TIME</div><div style="font-weight:700;font-size:16px">${time}</div></div>
          <div><div style="color:var(--gray-500);font-size:11px;margin-bottom:4px">SUBJECT</div><div style="font-weight:700;font-size:16px">${subject}</div></div>
          <div><div style="color:var(--gray-500);font-size:11px;margin-bottom:4px">CLASS</div><div style="font-weight:700">${className}</div></div>
          <div><div style="color:var(--gray-500);font-size:11px;margin-bottom:4px">ROOM</div><div style="font-weight:700">Room 14</div></div>
        </div>
      </div>
      <div style="margin-bottom:16px">
        <label style="font-weight:600;margin-bottom:8px;display:block">Quick Notes</label>
        <textarea placeholder="Add notes for this class..." style="width:100%;padding:10px;border:1px solid var(--border);border-radius:6px;font-family:Poppins,sans-serif;min-height:100px"></textarea>
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
        <button class="btn btn-primary" onclick="saveClassNotes('${subject}', '${className}'); closeModal();">Save Notes</button>
      </div>
    </div>
  `;
  openModal(modal);
}

function saveClassNotes(subject, className) {
  showToast('<i class="fas fa-check-circle"></i> Notes saved for ' + subject + ' - ' + className, 'success');
}

function viewStatDetail(statType) {
  let content = '';
  if (statType === 'students') {
    content = '<h3>My Students (38)</h3><p>2 new students joined this term</p><button class="btn btn-primary" style="margin-top:10px">View All Students</button>';
  } else if (statType === 'subjects') {
    content = '<h3>Subjects Teaching (5)</h3><p>This semester</p><ul style="list-style:none;padding:0"><li><i class="fas fa-book"></i> Mathematics</li><li><i class="fas fa-book"></i> Further Maths</li><li><i class="fas fa-book"></i> Core Maths</li><li><i class="fas fa-book"></i> Statistics</li><li><i class="fas fa-book"></i> Algebra</li></ul>';
  } else if (statType === 'attendance') {
    content = '<h3>Attendance Rate (94%)</h3><p>Above average performance</p><div class="prog-bar"><div class="prog-fill pf-green" style="width:94%"></div></div>';
  } else if (statType === 'grades') {
    content = '<h3>Pending Grades (8)</h3><p>Need grading this week</p><button class="btn btn-warning" style="margin-top:10px">Grade Now</button>';
  }

  openModal(`<div style="padding:20px;text-align:center">${content}</div>`);
}

async function viewAssignmentSubmissions(assignmentName) {
  const assignment = (window.assignmentsData || []).find(a => a.title === assignmentName || String(a.id) === String(assignmentName));
  if (!assignment) {
    showToast('<i class="fas fa-times-circle"></i> Assignment not found', 'error');
    return;
  }
  const res = await API.assignments.submissions(assignment.id);
  if (!res || !res.success) {
    showToast(res?.message || 'Unable to load submissions', 'error');
    return;
  }
  const rows = res.data || [];
  const modal = `
    <div style="padding:20px;max-width:700px;max-height:80vh;overflow-y:auto">
      <h2 style="color:var(--blue-dark);margin-bottom:16px"><i class="fas fa-file-upload"></i> ${escapeHtml(assignment.title)} - Submissions</h2>
      <table class="tbl" style="font-size:12px">
        <thead><tr><th>Student</th><th>Status</th><th>Submitted</th><th>Grade</th><th>Action</th></tr></thead>
        <tbody>
          ${rows.map(row => {
            const submitted = !!row.submitted_at || row.score !== null;
            const st = submitted ? 'Submitted' : 'Pending';
            return `
          <tr>
            <td style="font-weight:600">${escapeHtml(row.student_name)}</td>
            <td><span class="badge ${st === 'Submitted' ? 'b-success' : 'b-warning'}">${st}</span></td>
            <td>${row.submitted_at ? escapeHtml(row.submitted_at) : '-'}</td>
            <td>${row.score !== null && row.score !== undefined ? escapeHtml(String(row.score)) : '-'}</td>
            <td><button class="btn btn-secondary btn-xs" onclick="openGradeSubmissionForm('${assignment.id}', '${row.student_id}')">${submitted ? 'Review' : 'Grade'}</button></td>
          </tr>`;
          }).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--gray-400);padding:16px">No students found for this assignment class.</td></tr>'}
        </tbody>
      </table>
      <div style="margin-top:16px;display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      </div>
    </div>
  `;
  openModal(modal);
}

function gradeAssignmentSubmission(studentName, assignmentName) {
  const modal = `
    <div style="padding:20px;max-width:500px">
      <h2 style="color:var(--blue-dark);margin-bottom:16px"><i class="fas fa-star"></i> Grade ${studentName}</h2>
      <div style="background:var(--gray-50);padding:12px;border-radius:6px;margin-bottom:16px">
        <div style="font-size:12px;color:var(--gray-600)">Assignment: <strong>${assignmentName}</strong></div>
      </div>
      <div style="margin-bottom:12px">
        <label style="font-weight:600;display:block;margin-bottom:6px">Grade (A-F)</label>
        <select id="grade-select" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:6px;font-family:Poppins,sans-serif">
          <option value="">Select Grade</option>
          <option value="A">A (90-100)</option>
          <option value="B+">B+ (85-89)</option>
          <option value="B">B (80-84)</option>
          <option value="C+">C+ (75-79)</option>
          <option value="C">C (70-74)</option>
          <option value="D">D (60-69)</option>
          <option value="F">F (Below 60)</option>
        </select>
      </div>
      <div style="margin-bottom:16px">
        <label style="font-weight:600;display:block;margin-bottom:6px">Feedback</label>
        <textarea placeholder="Add feedback for the student..." style="width:100%;padding:10px;border:1px solid var(--border);border-radius:6px;font-family:Poppins,sans-serif;min-height:100px"></textarea>
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="submitGradeForStudent('${studentName}'); closeModal();">Submit Grade</button>
      </div>
    </div>
  `;
  openModal(modal);
}

function submitGradeForStudent(studentName) {
  const gradeSelect = document.getElementById('grade-select');
  const grade = gradeSelect?.value;

  if (!grade) {
    showToast('<i class="fas fa-times-circle"></i> Please select a grade', 'error');
    return;
  }

  showToast(`<i class="fas fa-check-circle"></i> Grade ${grade} submitted for ${studentName}`, 'success');
  renderMain();
}

function openAddAssignmentForm() {
  const el = document.getElementById('main-content');
  if (!el) return;
  currentMod = 'dashboard';
  el.innerHTML = hdr('Create New Assignment', 'Assign work to one of your classes', 'Dashboard') + `
    <div class="card" style="max-width:720px">
      <div class="f-field" style="margin-bottom:12px">
        <label>Assignment Title *</label>
        <input id="assign-title" placeholder="e.g., Chapter 5 Homework" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:6px;font-family:Poppins,sans-serif">
      </div>
      <div class="f-field" style="margin-bottom:12px">
        <label>Class *</label>
        <select id="assign-class" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:6px;font-family:Poppins,sans-serif">
          <option value="">Select Class</option>
          <option value="JHS 1">JHS 1</option>
          <option value="JHS 2">JHS 2</option>
          <option value="Basic 6">Basic 6</option>
        </select>
      </div>
      <div class="f-row" style="gap:12px;margin-bottom:12px">
        <div class="f-field" style="flex:1">
          <label>Due Date *</label>
          <input type="date" id="assign-duedate" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:6px;font-family:Poppins,sans-serif">
        </div>
        <div class="f-field" style="flex:1">
          <label>Total Points</label>
          <input type="number" id="assign-points" value="100" min="10" max="200" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:6px;font-family:Poppins,sans-serif">
        </div>
      </div>
      <div class="f-field" style="margin-bottom:16px">
        <label>Description *</label>
        <textarea id="assign-desc" placeholder="Assignment details and instructions..." style="width:100%;padding:10px;border:1px solid var(--border);border-radius:6px;font-family:Poppins,sans-serif;min-height:100px"></textarea>
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-secondary" onclick="navTo('dashboard')">Cancel</button>
        <button class="btn btn-primary" onclick="createNewAssignment()">Create Assignment</button>
      </div>
    </div>
  `;
  window.scrollTo(0, 0);
}

function createNewAssignment() {
  const title = document.getElementById('assign-title')?.value.trim();
  const className = document.getElementById('assign-class')?.value;
  const dueDate = document.getElementById('assign-duedate')?.value;
  const points = document.getElementById('assign-points')?.value;
  const desc = document.getElementById('assign-desc')?.value.trim();

  if (!title || !className || !dueDate || !desc) {
    showToast('<i class="fas fa-times-circle"></i> Please fill in all required fields', 'error');
    return;
  }

  const assignments = getAssignments();
  const id = 'A' + Date.now();
  assignments[id] = { id, title, subject: 'General', class: className, dueDate, createdDate: new Date().toISOString().slice(0,10), maxScore: Number(points || 100), status: 'Active', instructions: desc, submissions: {} };
  saveAssignments(assignments);
  showToast(`<i class="fas fa-check-circle"></i> Assignment "${title}" created for ${className}!`, 'success');
  navTo('dashboard');
}

// -----------------------------------
// EXAMS MODULE FUNCTIONS
// -----------------------------------
function switchExamTab(tabIndex) {
  // Hide all tabs
  document.querySelectorAll('.exam-tab-content').forEach(tab => tab.style.display = 'none');
  // Show selected tab
  document.getElementById('exam-tab-' + tabIndex).style.display = 'block';
  // Update active tab indicator
  document.querySelectorAll('.mod-tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === tabIndex);
  });
}

function filterExamTable() {
  const searchValue = document.getElementById('exam-search').value.toLowerCase();
  document.querySelectorAll('.exam-row').forEach(row => {
    const subject = row.getAttribute('data-subject');
    const classVal = row.getAttribute('data-class');
    const matches = subject.includes(searchValue) || classVal.includes(searchValue);
    row.style.display = matches ? '' : 'none';
  });
}

function openScheduleExamForm() {
  currentMod = 'exams';
  const el = document.getElementById('main-content');
  if (!el) return;
  el.innerHTML = hdr('Schedule Exam', 'Create a class examination timetable', 'Exams') + `
    <div class="card">
      <h2 style="margin:0 0 20px 0;color:var(--blue-dark);font-size:22px"><i class="fas fa-clipboard-list"></i> Exam Timetable Scheduler</h2>
      
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px;margin-bottom:20px">
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">Class</label>
          <select id="exam-tt-class" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;cursor:pointer;font-size:13px">
            <option>Creche</option><option>Nursery</option><option>KG 1</option><option>KG 2</option><option>Basic 1</option><option>Basic 2</option><option>Basic 3</option><option>Basic 4</option><option>Basic 5</option><option>Basic 6</option><option>JHS 1</option><option>JHS 2</option><option>JHS 3</option>
          </select>
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">Start Date</label>
          <input type="date" id="exam-tt-start-date" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;font-size:13px">
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">Duration (Days)</label>
          <input type="number" id="exam-tt-duration" value="5" min="1" max="20" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;font-size:13px">
        </div>
      </div>
      
      <div style="background:var(--gray-50);padding:15px;border-radius:8px;margin-bottom:20px;border:1px solid var(--gray-200)">
        <div style="font-weight:600;color:var(--gray-800);margin-bottom:12px;font-size:13px"><i class="fas fa-calendar-alt"></i> Exam Schedule (Two Papers Per Day)</div>
        
        <table style="width:100%;border-collapse:collapse;font-size:12px">
          <thead>
            <tr style="background:var(--blue-main);color:white">
              <th style="padding:12px;text-align:left;border:1px solid var(--blue-dark)">Day</th>
              <th style="padding:12px;text-align:left;border:1px solid var(--blue-dark)"><i class="fas fa-map-pin"></i> Paper 1 (Morning)</th>
              <th style="padding:12px;text-align:left;border:1px solid var(--blue-dark)">Paper 1 Details</th>
              <th style="padding:12px;text-align:left;border:1px solid var(--blue-dark)"><i class="fas fa-map-pin"></i> Paper 2 (Afternoon)</th>
              <th style="padding:12px;text-align:left;border:1px solid var(--blue-dark)">Paper 2 Details</th>
            </tr>
          </thead>
          <tbody>
            ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, i) => '<tr style="border:1px solid var(--gray-200)"><td style="padding:10px;border-right:1px solid var(--gray-200);font-weight:600;background:var(--gray-100)">' + day + '</td><td style="padding:10px;border-right:1px solid var(--gray-200)"><select class="exam-paper-select" style="width:100%;padding:6px;border:1px solid var(--gray-300);border-radius:4px;font-family:Poppins,sans-serif;font-size:11px"><option>Mathematics</option><option>English</option><option>Science</option><option>ICT</option><option>Social Studies</option></select></td><td style="padding:10px;border-right:1px solid var(--gray-200)"><input type="text" placeholder="Venue, Time" style="width:100%;padding:6px 8px;border:1px solid var(--gray-300);border-radius:4px;font-family:Poppins,sans-serif;font-size:11px"></td><td style="padding:10px;border-right:1px solid var(--gray-200)"><select class="exam-paper-select" style="width:100%;padding:6px;border:1px solid var(--gray-300);border-radius:4px;font-family:Poppins,sans-serif;font-size:11px"><option>French</option><option>CRK/Islamic</option><option>Physical Ed</option><option>Arts</option><option>Music</option></select></td><td style="padding:10px"><input type="text" placeholder="Venue, Time" style="width:100%;padding:6px 8px;border:1px solid var(--gray-300);border-radius:4px;font-family:Poppins,sans-serif;font-size:11px"></td></tr>').join('')}
          </tbody>
        </table>
      </div>
      
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-primary btn-sm" onclick="saveExamTimetable()"><i class="fas fa-check-circle"></i> Create Exam Schedule</button>
        <button class="btn btn-secondary btn-sm" onclick="navTo('exams')">Cancel</button>
      </div>
    </div>
  `;
  window.scrollTo(0, 0);
}

function saveNewExam() {
  const subject = document.getElementById('new-exam-subject').value;
  const classVal = document.getElementById('new-exam-class').value;
  const date = document.getElementById('new-exam-date').value;
  const duration = document.getElementById('new-exam-duration').value;
  const venue = document.getElementById('new-exam-venue').value;
  const invigilator = document.getElementById('new-exam-invigilator').value;

  if (!date || !duration || !venue || !invigilator) {
    showToast('<i class="fas fa-exclamation-triangle"></i> Please fill all fields', 'warning');
    return;
  }

  closeModal();
  showToast('<i class="fas fa-check-circle"></i> Exam scheduled: ' + subject + ' on ' + date, 'success');
}

function saveExamTimetable() {
  const classVal = document.getElementById('exam-tt-class').value;
  const startDate = document.getElementById('exam-tt-start-date').value;
  const duration = document.getElementById('exam-tt-duration').value;

  if (!classVal || !startDate || !duration) {
    showToast('<i class="fas fa-exclamation-triangle"></i> Please fill all fields', 'warning');
    return;
  }

  showToast('<i class="fas fa-check-circle"></i> Exam timetable created for ' + classVal + ' starting ' + startDate + ' (' + duration + ' days)', 'success');
  navTo('exams');
}

function editExam(subject, classVal) {
  const formContent = `
    <div style="padding:20px;width:100%;max-width:850px">
      <h2 style="margin:0 0 20px 0;color:var(--blue-dark);font-size:22px"><i class="fas fa-edit"></i> Edit Exam: ${subject}</h2>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px">
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">Subject</label>
          <input type="text" value="${subject}" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif">
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">Class</label>
          <select style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif;cursor:pointer">
            <option selected>${classVal}</option>
            <option>Creche</option><option>Nursery</option><option>KG 1</option><option>KG 2</option>
            <option>Basic 1</option><option>Basic 2</option><option>Basic 3</option><option>Basic 4</option>
            <option>Basic 5</option><option>Basic 6</option><option>JHS 1</option><option>JHS 2</option><option>JHS 3</option>
          </select>
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">Date</label>
          <input type="date" value="2025-04-01" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif">
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">Duration</label>
          <input type="text" value="2 hrs" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif">
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">Venue</label>
          <input type="text" value="Hall A" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif">
        </div>
        <div>
          <label style="display:block;margin-bottom:8px;font-weight:600;font-size:13px">Invigilator</label>
          <input type="text" value="Mr. Amponsah" style="width:100%;padding:10px;border:1.5px solid var(--gray-200);border-radius:6px;font-family:Poppins,sans-serif">
        </div>
      </div>
      
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-primary btn-sm" onclick="saveEditedExam('${subject}')" style="padding:10px 20px"><i class="fas fa-check-circle"></i> Save Changes</button>
        <button class="btn btn-secondary btn-sm" onclick="closeModal()" style="padding:10px 20px">Cancel</button>
      </div>
    </div>
  `;
  openModal(formContent);
}

function saveEditedExam(subject) {
  closeModal();
  showToast('<i class="fas fa-check-circle"></i> Exam updated: ' + subject, 'success');
}

function deleteExam(subject) {
  if (confirm('Are you sure you want to delete the exam: ' + subject + '? This action cannot be undone.')) {
    showToast('<i class="fas fa-check-circle"></i> Exam deleted: ' + subject, 'success');
  }
}

function loadStudentsForGrades() {
  const selectedClass = document.getElementById('grades-class').value;
  showToast('<i class="fas fa-book"></i> Loaded students from ' + selectedClass, 'info');
}

function saveExamGrades() {
  if (currentRole !== 'Teacher') {
    showToast('<i class="fas fa-times-circle"></i> Only teachers can save grades', 'error');
    return;
  }

  const subject = document.getElementById('grades-subject').value;
  const classVal = document.getElementById('grades-class').value;
  const scores = [];

  document.querySelectorAll('.score-input').forEach(input => {
    scores.push(input.value);
  });

  // Send to class teacher for review
  showToast('<i class="fas fa-upload"></i> Submitting ' + subject + ' scores for ' + classVal + ' to class teacher...', 'info');

  setTimeout(() => {
    showToast('<i class="fas fa-check-circle"></i> Scores submitted! Class teacher will review and generate report cards', 'success');
  }, 1500);
}

function generateExamsReport(type) {
  const reportContent = `
    <div style="padding:20px;max-width:900px">
      <div style="text-align:center;margin-bottom:20px">
        <h2 style="margin:0;color:var(--blue-dark)"><i class="fas fa-chart-bar"></i> '+type+' Report</h2>
        <p style="margin:5px 0;color:var(--gray-600);font-size:12px">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px">
        <div style="padding:12px;background:var(--success-light);border-radius:8px;text-align:center">
          <div style="font-size:20px;font-weight:bold;color:var(--success)">92.5%</div>
          <div style="font-size:11px;color:var(--gray-600)">Average Score</div>
        </div>
        <div style="padding:12px;background:var(--info-light);border-radius:8px;text-align:center">
          <div style="font-size:20px;font-weight:bold;color:var(--info)">123</div>
          <div style="font-size:11px;color:var(--gray-600)">Total Students</div>
        </div>
        <div style="padding:12px;background:var(--warning-light);border-radius:8px;text-align:center">
          <div style="font-size:20px;font-weight:bold;color:var(--warning)">18</div>
          <div style="font-size:11px;color:var(--gray-600)">Excellent (A)</div>
        </div>
        <div style="padding:12px;background:var(--danger-light);border-radius:8px;text-align:center">
          <div style="font-size:20px;font-weight:bold;color:var(--danger)">8</div>
          <div style="font-size:11px;color:var(--gray-600)">Below Average</div>
        </div>
      </div>
      
      <div style="text-align:center;gap:8px;display:flex;justify-content:center">
        <button class="btn btn-primary btn-sm" onclick="window.print()"><i class="fas fa-print"></i> Print</button>
        <button class="btn btn-secondary btn-sm" onclick="downloadGradesCSV()"><i class="fas fa-download"></i> Download CSV</button>
        <button class="btn btn-secondary btn-sm" onclick="closeModal()">Close</button>
      </div>
    </div>
  `;
  openModal(reportContent);
}

function downloadGradesCSV() {
  let csv = 'Grades Report\n';
  csv += 'Generated: ' + new Date().toLocaleDateString() + '\n\n';
  csv += 'Student Name,Subject,Score,Grade\n';
  csv += 'Ama Serwaa,Mathematics,88,A\n';
  csv += 'Kwame Asante,Mathematics,72,B\n';
  csv += 'Abena Mensah,Mathematics,91,A\n';
  csv += 'Kofi Boateng,Mathematics,64,C\n';
  csv += 'Akosua Darko,Mathematics,95,A\n';

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', 'grades_report_' + new Date().toISOString().slice(0, 10) + '.csv');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('<i class="fas fa-check-circle"></i> Report downloaded!', 'success');
}

function exportGradesData() {
  showToast('<i class="fas fa-download"></i> Exporting grades data...', 'info');
  setTimeout(() => showToast('<i class="fas fa-check-circle"></i> Export completed!', 'success'), 1500);
}

function filterReportCards() {
  const classFilter = document.getElementById('report-class-filter').value.toLowerCase();
  const searchValue = document.getElementById('report-student-search').value.toLowerCase();

  document.querySelectorAll('.report-row').forEach(row => {
    const student = row.getAttribute('data-student');
    const classVal = row.getAttribute('data-class').toLowerCase();

    const matchesClass = !classFilter || classVal.includes(classFilter);
    const matchesStudent = student.includes(searchValue);

    row.style.display = (matchesClass && matchesStudent) ? '' : 'none';
  });
}

function viewReportCard(studentName) {
  ensureReportCardScores();
  const entry = getReportCardEntriesForRole().find(([id, data]) => id === studentName || data.name === studentName);
  if (entry) {
    openModal(generateReportCard(entry[0]), true);
    return;
  }

  const student = STUDENTS_DATA[studentName];
  if (!student) {
    showToast('<i class="fas fa-times-circle"></i> Student not found', 'error');
    return;
  }

  const term = document.getElementById('report-term-selector')?.value || student.term;
  const subjectScores = getStudentScoresWithGrades(studentName);
  const totalMarks = calculateTotalMarks(student.scores);
  const average = calculateAverage(student.scores);
  const overallGrade = calculateGrade(average);
  const { position, totalInClass } = calculateClassPosition(studentName, student.class);
  const remark = generateRemark(average);

  const subjectsHTML = Object.entries(subjectScores).map(([subject, scores]) => `
    <tr>
      <td style="padding:6px;border-bottom:1px solid var(--gray-300);color:var(--gray-700);font-size:11px">${subject}</td>
      <td style="padding:6px;text-align:center;border-bottom:1px solid var(--gray-300);color:var(--gray-700);font-weight:600;font-size:11px">${scores.classScore}</td>
      <td style="padding:6px;text-align:center;border-bottom:1px solid var(--gray-300);color:var(--gray-700);font-weight:600;font-size:11px">${scores.examScore}</td>
      <td style="padding:6px;text-align:center;border-bottom:1px solid var(--gray-300);color:var(--blue-main);font-weight:700;font-size:12px">${scores.total}</td>
      <td style="padding:6px;text-align:center;border-bottom:1px solid var(--gray-300)"><span style="padding:2px 6px;background:${scores.grade === 'A' ? 'var(--success)' : scores.grade === 'B' ? 'var(--info)' : scores.grade === 'C' ? 'var(--warning)' : 'var(--danger)'};color:white;border-radius:4px;font-weight:700;font-size:10px">${scores.grade}</span></td>
    </tr>
  `).join('');

  const reportContent = `
    <div id="report-card-content" style="padding:15px;max-width:900px;background:white;font-family:Poppins,sans-serif;line-height:1.4">
      
      <!-- TOP HEADER LAYOUT: Logo (Left) | School Info (Center) | Student Pic (Right) -->
      <div style="display:grid;grid-template-columns:1fr 2fr 1fr;gap:10px;align-items:start;margin-bottom:12px;padding-bottom:10px;border-bottom:4px solid var(--blue-main)">
        
        <!-- LEFT: SCHOOL LOGO -->
        <div style="text-align:center">
          <div style="font-size:35px;margin-bottom:4px;display:flex;align-items:center;justify-content:center"><img src="assets/images/Logo.png" alt="Logo" style="width:40px;height:40px;object-fit:contain"></div>
          <p style="margin:0;font-size:9px;color:var(--gray-600);font-weight:600">LOGO</p>
        </div>

        <!-- CENTER: SCHOOL INFORMATION -->
        <div style="text-align:center">
          <h1 style="margin:0 0 2px 0;color:var(--blue-dark);font-size:18px;font-weight:700">Glory Reign Preparatory School</h1>
          <p style="margin:2px 0;font-size:9px;color:var(--gray-600)">Nurturing Excellence Since 1985</p>
          <p style="margin:2px 0;font-size:9px;color:var(--gray-500)">P.O. Box AN 1234, Main School Street</p>
          <p style="margin:2px 0;font-size:9px;color:var(--gray-500)">Accra North | Tel: +233-123-456-789</p>
          <div style="margin-top:4px;font-size:13px;font-weight:700;color:var(--blue-main)"><i class="fas fa-clipboard-list"></i> REPORT CARD</div>
        </div>

        <!-- RIGHT: STUDENT PICTURE -->
        <div style="text-align:center">
          <div style="width:90px;height:110px;margin:0 auto 4px;padding:6px;background:var(--gray-100);border:2px dashed var(--gray-300);border-radius:6px;display:flex;align-items:center;justify-content:center">
            <div style="font-size:35px"><i class="fas fa-camera"></i></div>
          </div>
          <p style="margin:2px 0;font-size:9px;color:var(--gray-600);font-weight:600">Student Photograph</p>
          <p style="margin:2px 0;font-size:8px;color:var(--gray-500)">(Attached during registration)</p>
        </div>

      </div>

      <!-- STUDENT INFO SECTION -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
        <!-- Left Column: Student Details -->
        <div>
          <h3 style="margin:0 0 8px 0;color:var(--blue-dark);font-size:12px;font-weight:700;border-bottom:2px solid var(--blue-main);padding-bottom:4px">Student Information</h3>
          <table style="width:100%;font-size:11px">
            <tbody>
              <tr><td style="padding:4px;font-weight:600;color:var(--gray-600);width:40%">Name:</td><td style="padding:4px;color:var(--blue-dark);font-weight:700">${studentName}</td></tr>
              <tr><td style="padding:4px;font-weight:600;color:var(--gray-600)">Student ID:</td><td style="padding:4px;color:var(--blue-dark);font-weight:700">${student.id}</td></tr>
              <tr><td style="padding:4px;font-weight:600;color:var(--gray-600)">Class:</td><td style="padding:4px;color:var(--blue-dark);font-weight:700">${student.class}</td></tr>
            </tbody>
          </table>
        </div>
        
        <!-- Right Column: Period Info -->
        <div>
          <h3 style="margin:0 0 8px 0;color:var(--blue-dark);font-size:12px;font-weight:700;border-bottom:2px solid var(--blue-main);padding-bottom:4px">Term Details</h3>
          <table style="width:100%;font-size:11px">
            <tbody>
              <tr><td style="padding:4px;font-weight:600;color:var(--gray-600);width:40%">Term:</td><td style="padding:4px;color:var(--blue-dark);font-weight:700">${term}</td></tr>
              <tr><td style="padding:4px;font-weight:600;color:var(--gray-600)">Academic Year:</td><td style="padding:4px;color:var(--blue-dark);font-weight:700">${student.academicYear}</td></tr>
              <tr><td style="padding:4px;font-weight:600;color:var(--gray-600)">Attendance:</td><td style="padding:4px;color:${student.attendance >= 90 ? 'var(--success)' : student.attendance >= 80 ? 'var(--info)' : 'var(--warning)'};font-weight:700">${student.attendance}%</td></tr>
              <tr><td style="padding:4px;font-weight:600;color:var(--gray-600)">Status:</td><td style="padding:4px;color:var(--success);font-weight:700">? Promoted</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ACADEMIC PERFORMANCE TABLE -->
      <h3 style="margin:0 0 8px 0;color:var(--blue-dark);font-size:12px;font-weight:700;border-bottom:2px solid var(--blue-main);padding-bottom:4px">Academic Performance</h3>
      <table style="width:100%;border-collapse:collapse;border:1px solid var(--gray-300);margin-bottom:12px;font-size:11px">
        <thead>
          <tr style="background:var(--blue-main);color:white">
            <th style="padding:6px;text-align:left;border-right:1px solid var(--blue-dark);font-weight:700">Subject</th>
            <th style="padding:6px;text-align:center;border-right:1px solid var(--blue-dark);font-weight:700">Class (50)</th>
            <th style="padding:6px;text-align:center;border-right:1px solid var(--blue-dark);font-weight:700">Exam (50)</th>
            <th style="padding:6px;text-align:center;border-right:1px solid var(--blue-dark);font-weight:700">Total (100)</th>
            <th style="padding:6px;text-align:center;font-weight:700">Grade</th>
          </tr>
        </thead>
        <tbody>
          ${subjectsHTML}
        </tbody>
      </table>

      <!-- PERFORMANCE SUMMARY CARDS -->
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:12px;font-size:10px">
        <div style="padding:10px;background:var(--blue-xpale);border-radius:8px;border-left:4px solid var(--blue-main);text-align:center">
          <div style="font-size:9px;color:var(--gray-600);margin-bottom:3px;font-weight:600">TOTAL MARKS</div>
          <div style="font-size:18px;font-weight:700;color:var(--blue-dark)">${totalMarks}</div>
          <div style="font-size:8px;color:var(--gray-600);margin-top:2px">out of ${Object.keys(subjectScores).length * 100}</div>
        </div>
        <div style="padding:10px;background:var(--info-light);border-radius:8px;border-left:4px solid var(--info);text-align:center">
          <div style="font-size:9px;color:var(--gray-600);margin-bottom:3px;font-weight:600">AVERAGE</div>
          <div style="font-size:18px;font-weight:700;color:var(--info)">${average}%</div>
          <div style="font-size:8px;color:var(--gray-600);margin-top:2px">Class Performance</div>
        </div>
        <div style="padding:10px;background:${overallGrade === 'A' ? 'var(--success-light)' : overallGrade === 'B' ? 'var(--info-light)' : overallGrade === 'C' ? 'var(--warning-light)' : 'var(--danger-light)'};border-radius:8px;border-left:4px solid ${overallGrade === 'A' ? 'var(--success)' : overallGrade === 'B' ? 'var(--info)' : overallGrade === 'C' ? 'var(--warning)' : 'var(--danger)'};text-align:center">
          <div style="font-size:9px;color:var(--gray-600);margin-bottom:3px;font-weight:600">GRADE</div>
          <div style="font-size:22px;font-weight:700;color:${overallGrade === 'A' ? 'var(--success)' : overallGrade === 'B' ? 'var(--info)' : overallGrade === 'C' ? 'var(--warning)' : 'var(--danger)'}">${overallGrade}</div>
          <div style="font-size:8px;color:var(--gray-600);margin-top:2px">Overall Grade</div>
        </div>
        <div style="padding:10px;background:var(--warning-light);border-radius:8px;border-left:4px solid var(--warning);text-align:center">
          <div style="font-size:9px;color:var(--gray-600);margin-bottom:3px;font-weight:600">POSITION</div>
          <div style="font-size:18px;font-weight:700;color:var(--warning)">${position}</div>
          <div style="font-size:8px;color:var(--gray-600);margin-top:2px">of ${totalInClass}</div>
        </div>
        <div style="padding:10px;background:var(--success-light);border-radius:8px;border-left:4px solid var(--success);text-align:center">
          <div style="font-size:9px;color:var(--gray-600);margin-bottom:3px;font-weight:600">ATTENDANCE</div>
          <div style="font-size:18px;font-weight:700;color:var(--success)">${student.attendance}%</div>
          <div style="font-size:8px;color:var(--gray-600);margin-top:2px">Present</div>
        </div>
      </div>

      <!-- TEACHER'S REMARK -->
      <div style="padding:10px;background:var(--blue-xpale);border-radius:8px;border-left:5px solid var(--blue-main);margin-bottom:12px">
        <h4 style="margin:0 0 6px 0;color:var(--blue-dark);font-size:11px;font-weight:700"><i class="fas fa-chalkboard-user"></i> Class Teacher's Remark</h4>
        <p style="margin:0;font-size:10px;color:var(--gray-700);line-height:1.5">${remark}</p>
      </div>

      <!-- SIGNATURES SECTION -->
      <div style="margin-bottom:10px;padding-top:10px;border-top:2px solid var(--gray-300)">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px;font-size:10px">
          <div style="text-align:center">
            <div style="height:35px;border-bottom:1px solid var(--gray-700);margin-bottom:4px"></div>
            <div style="font-weight:700;color:var(--gray-800);font-size:10px">Class Teacher</div>
            <div style="color:var(--gray-600);font-size:9px">${student.classTeacher}</div>
          </div>
          <div style="text-align:center">
            <div style="height:35px;border-bottom:1px solid var(--gray-700);margin-bottom:4px"></div>
            <div style="font-weight:700;color:var(--gray-800);font-size:10px">School Administrator</div>
            <div style="color:var(--gray-600);font-size:9px">Authorized Officer</div>
          </div>
          <div style="text-align:center">
            <div style="height:35px;border-bottom:1px solid var(--gray-700);margin-bottom:4px"></div>
            <div style="font-weight:700;color:var(--gray-800);font-size:10px">Headteacher</div>
            <div style="color:var(--gray-600);font-size:9px">School Principal</div>
          </div>
        </div>
      </div>


    </div>

    <!-- ACTION BUTTONS -->
    <div style="display:flex;gap:10px;justify-content:center;margin-top:10px;padding:12px;background:var(--gray-50);border-top:1px solid var(--gray-200);border-radius:0 0 8px 8px">
      <button class="btn btn-primary" onclick="printReportCard('${studentName}')" style="padding:8px 16px;font-weight:600;font-size:11px"><i class="fas fa-print"></i> Print Report Card</button>
      <button class="btn btn-primary" onclick="downloadReportCardPDF('${studentName}')" style="padding:8px 16px;font-weight:600;font-size:11px"><i class="fas fa-download"></i> Download as PDF</button>
      <button class="btn btn-secondary" onclick="closeModal()" style="padding:8px 16px;font-weight:600;font-size:11px">Close</button>
    </div>
  `;

  openModal(reportContent);
}

function onStudentSelected() {
  const studentName = document.getElementById('report-student-selector').value;
  const previewSection = document.getElementById('selected-report-preview');
  const summarySection = document.getElementById('report-summary-section');

  if (studentName && STUDENTS_DATA[studentName]) {
    const student = STUDENTS_DATA[studentName];
    const average = calculateAverage(student.scores);
    const { position, totalInClass } = calculateClassPosition(studentName, student.class);

    previewSection.innerHTML = `
      <div style="display:flex;gap:20px;align-items:center;padding:15px;background:var(--blue-xpale);border-radius:8px">
        <div style="flex:1">
          <h4 style="margin:0 0 10px 0;color:var(--blue-dark);font-weight:700">${studentName}</h4>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;font-size:12px">
            <div><span style="color:var(--gray-600)">Class:</span> <span style="font-weight:600;color:var(--blue-dark)">${student.class}</span></div>
            <div><span style="color:var(--gray-600)">Average:</span> <span style="font-weight:600;color:var(--info)">${average}%</span></div>
            <div><span style="color:var(--gray-600)">Position:</span> <span style="font-weight:600;color:var(--warning)">${position} of ${totalInClass}</span></div>
            <div><span style="color:var(--gray-600)">Attendance:</span> <span style="font-weight:600;color:var(--success)">${student.attendance}%</span></div>
          </div>
        </div>
        <button class="btn btn-primary" onclick="viewReportCard('${studentName}')" style="padding:12px 24px;white-space:nowrap"><i class="fas fa-file"></i> View Full Report</button>
      </div>
    `;
    summarySection.style.display = 'block';
    filterReportCards();
  } else {
    previewSection.innerHTML = '<i class="fas fa-thumbtack"></i> Tip: Select a student above to view their complete report card with all subjects, scores, grades, and remarks.';
    summarySection.style.display = 'none';
  }
}

function printReportCard(studentName) {
  const reportContent = document.getElementById('report-card-content');

  if (!reportContent) {
    showToast('<i class="fas fa-times-circle"></i> Report card not found', 'error');
    return;
  }

  // Create a new window for printing
  const printWindow = window.open('', '', 'height=900,width=1200');

  // Add print styles
  const printStyles = `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Poppins', sans-serif; line-height: 1.6; }
      @media print {
        body { margin: 0; padding: 20px; }
        .no-print { display: none !important; }
        table { page-break-inside: avoid; }
        tr { page-break-inside: avoid; }
      }
      :root {
        --blue-dark: #1a56db;
        --blue-main: #1a56db;
        --blue-xpale: #e0e7ff;
        --success: #30b981;
        --success-light: #d1fae5;
        --info: #3b82f6;
        --info-light: #dbeafe;
        --warning: #f59e0b;
        --warning-light: #fef3c7;
        --danger: #ef4444;
        --gray-50: #f9fafb;
        --gray-100: #f3f4f6;
        --gray-200: #e5e7eb;
        --gray-300: #d1d5db;
        --gray-500: #6b7280;
        --gray-600: #4b5563;
        --gray-700: #374151;
        --gray-800: #1f2937;
      }
    </style>
  `;

  printWindow.document.write('<!DOCTYPE html>');
  printWindow.document.write('<html>');
  printWindow.document.write('<head>');
  printWindow.document.write('<meta charset="UTF-8">');
  printWindow.document.write('<title>Report Card - ' + studentName + '</title>');
  printWindow.document.write(printStyles);
  printWindow.document.write('</head>');
  printWindow.document.write('<body>');
  printWindow.document.write(reportContent.innerHTML);
  printWindow.document.write('</body>');
  printWindow.document.write('</html>');
  printWindow.document.close();

  // Wait for content to load then print
  setTimeout(() => {
    printWindow.print();
    showToast('<i class="fas fa-print"></i> Opening print dialog...', 'info');
  }, 250);
}

function downloadReportCardPDF(studentName) {
  ensureReportCardScores();
  const entry = getReportCardEntriesForRole().find(([id, data]) => id === studentName || data.name === studentName);
  if (!entry) {
    showToast('<i class="fas fa-times-circle"></i> Report card not found', 'error');
    return;
  }
  printReportCardPaper(entry[0]);
  showToast('<i class="fas fa-download"></i> In the print dialog, choose "Save as PDF".', 'info');
}

function updateAnalysis() {
  const subject = document.getElementById('analysis-subject').value;
  const classVal = document.getElementById('analysis-class').value || 'All Classes';

  // Update statistics based on selection
  const stats = {
    average: subject === 'All Subjects' || subject === 'Mathematics' ? '92.5%' : subject === 'English Language' ? '88.3%' : '85.6%',
    passRate: subject === 'All Subjects' || subject === 'Mathematics' ? '78%' : '75%',
    aGrades: subject === 'All Subjects' || subject === 'Mathematics' ? '45' : '38',
    bGrades: subject === 'All Subjects' || subject === 'Mathematics' ? '62' : '55',
    belowAvg: subject === 'All Subjects' || subject === 'Mathematics' ? '22%' : '25%'
  };

  showToast('<i class="fas fa-chart-bar"></i> Analysis updated for ' + subject + ' - ' + classVal, 'info');
}

// Generate attendance report
function generateAttendanceReport() {
  const reportContent = `
    <div style="padding:20px;max-width:800px">
      <div style="text-align:center;margin-bottom:20px">
        <h2 style="margin:0;color:var(--blue-dark)"><i class="fas fa-chart-bar"></i> Daily Attendance Report</h2>
        <p style="margin:5px 0;color:var(--gray-600);font-size:12px">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      
      <div style="background:var(--blue-xpale);padding:15px;border-radius:8px;margin-bottom:20px">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:15px">
          <div style="text-align:center">
            <div style="font-size:24px;font-weight:bold;color:var(--success)">798</div>
            <div style="font-size:12px;color:var(--gray-600)">Present</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:24px;font-weight:bold;color:var(--danger)">37</div>
            <div style="font-size:12px;color:var(--gray-600)">Absent</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:24px;font-weight:bold;color:var(--warning)">7</div>
            <div style="font-size:12px;color:var(--gray-600)">Late</div>
          </div>
        </div>
      </div>
      
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <thead>
          <tr style="background:var(--blue-main);color:white">
            <th style="padding:10px;text-align:left">Class</th>
            <th style="padding:10px;text-align:center">Present</th>
            <th style="padding:10px;text-align:center">Total</th>
            <th style="padding:10px;text-align:center">Absent</th>
            <th style="padding:10px;text-align:center">%</th>
          </tr>
        </thead>
        <tbody>
          ${[['Creche', 26, 28, 2], ['Nursery', 31, 32, 1], ['KG 1', 33, 35, 2], ['KG 2', 35, 36, 1], ['Basic 1', 36, 38, 2], ['Basic 2', 38, 40, 2], ['Basic 3', 40, 42, 2], ['Basic 4', 35, 38, 3], ['Basic 5', 39, 40, 1], ['Basic 6', 34, 36, 2], ['JHS 1', 40, 42, 2], ['JHS 2', 37, 40, 3], ['JHS 3', 37, 39, 2]].map(([c, p, t, a]) => {
    const pct = Math.round(p / t * 100);
    return '<tr style="border-bottom:1px solid var(--gray-200)"><td style="padding:10px">' + c + '</td><td style="padding:10px;text-align:center;font-weight:600;color:var(--success)">' + p + '</td><td style="padding:10px;text-align:center">' + t + '</td><td style="padding:10px;text-align:center;color:var(--danger)">' + a + '</td><td style="padding:10px;text-align:center;font-weight:600">' + pct + '%</td></tr>';
  }).join('')}
        </tbody>
      </table>
      
      <div style="text-align:center;gap:8px;display:flex;justify-content:center">
        <button class="btn btn-primary btn-sm" onclick="window.print()"><i class="fas fa-print"></i> Print Report</button>
        <button class="btn btn-secondary btn-sm" onclick="downloadAttendanceReportCSV()"><i class="fas fa-download"></i> Download CSV</button>
        <button class="btn btn-secondary btn-sm" onclick="closeModal()">Close</button>
      </div>
    </div>
  `;
  openModal(reportContent);
}

// Download attendance report as CSV
function downloadAttendanceReportCSV() {
  let csv = 'Attendance Report\n';
  csv += 'Generated: ' + new Date().toLocaleDateString() + '\n\n';
  csv += 'Class,Present,Total,Absent,Percentage\n';

  const classData = [['Creche', 26, 28, 2], ['Nursery', 31, 32, 1], ['KG 1', 33, 35, 2], ['KG 2', 35, 36, 1], ['Basic 1', 36, 38, 2], ['Basic 2', 38, 40, 2], ['Basic 3', 40, 42, 2], ['Basic 4', 35, 38, 3], ['Basic 5', 39, 40, 1], ['Basic 6', 34, 36, 2], ['JHS 1', 40, 42, 2], ['JHS 2', 37, 40, 3], ['JHS 3', 37, 39, 2]];

  classData.forEach(([c, p, t, a]) => {
    const pct = Math.round(p / t * 100);
    csv += c + ',' + p + ',' + t + ',' + a + ',' + pct + '%\n';
  });

  csv += '\n\nSummary\n';
  csv += 'Total Students,842\n';
  csv += 'Present,798\n';
  csv += 'Absent,37\n';
  csv += 'Late,7\n';
  csv += 'Average Attendance,94.2%\n';

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', 'attendance_report_' + new Date().toISOString().slice(0, 10) + '.csv');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('<i class="fas fa-check-circle"></i> Report downloaded!', 'success');
}

// Save grades
function saveGrades() {
  showToast('<i class="fas fa-check-circle"></i> Grades saved!', 'success');
}

// Update profile
function updateProfile() {
  showToast('<i class="fas fa-check-circle"></i> Profile updated!', 'success');
}

// Update password
function updatePassword() {
  const currentPass = document.querySelector('input[placeholder="Current password"]')?.value;
  const newPass = document.querySelector('input[placeholder="••••••••"]')?.value;
  const confirmPass = document.querySelectorAll('input[placeholder="••••••••"]')[1]?.value;

  if (!currentPass || !newPass || !confirmPass) {
    showToast('<i class="fas fa-exclamation-triangle"></i> Please fill all password fields', 'warning');
    return;
  }
  if (newPass !== confirmPass) {
    showToast('<i class="fas fa-times-circle"></i> New passwords do not match', 'error');
    return;
  }
  showToast('<i class="fas fa-check-circle"></i> Password updated!', 'success');
}

// Create/Edit record
function createRecord(type) {
  const title = type.charAt(0).toUpperCase() + type.slice(1);
  const confirmed = prompt(`Enter details for new ${type}:`, '');
  if (confirmed !== null) {
    showToast(`<i class="fas fa-check-circle"></i> ${title} created!`, 'success');
    location.reload();
  }
}

// Edit record
function editRecord(id, type) {
  let defaultVal = '';
  if (type === 'Student') {
    const student = enrolledStudents.find(s => s.student_id === id);
    if (student) defaultVal = student.name;
  } else if (type === 'Teacher') {
    const teacher = teachersData.find(t => t.teacher_id === id);
    if (teacher) defaultVal = teacher.name;
  } else if (type === 'Parent') {
    const parent = parentsData.find(p => p.parent_id === id);
    if (parent) defaultVal = parent.name;
  } else if (type === 'Class') {
    const cls = classesData.find(c => c.class_id === id);
    if (cls) defaultVal = cls.name;
  } else if (type === 'Subject') {
    const subj = subjectsData.find(s => s.subject_id === id);
    if (subj) defaultVal = subj.name;
  } else if (type === 'Admission') {
    const adm = admissionsData.find(a => a.adm_id === id);
    if (adm) defaultVal = adm.name;
  }

  const currentValue = prompt(`Edit ${type}:`, defaultVal);
  if (currentValue !== null) {
    showToast(`<i class="fas fa-check-circle"></i> ${type} updated!`, 'success');
    location.reload();
  }
}

// Delete record with confirmation
async function deleteRecord(id, type) {
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
      const index = parentsData.findIndex(p => p.parent_id === id);
      if (index !== -1) parentsData.splice(index, 1);
      saveParentRecords();
      showToast('<i class="fas fa-check-circle"></i> Parent deleted!', 'success', 3000);
    } else if (type === 'Admission') {
      const adm = admissionsData.find(a => a.adm_id === id || a.id == id);
      const dbId = adm?.id || (/^ADM\d+$/.test(String(id)) ? Number(String(id).replace('ADM', '')) : Number(id));
      if (typeof API !== 'undefined' && API.admissions && dbId) {
        const res = await API.admissions.updateStatus(dbId, 'Rejected', 'Deleted by administrator');
        if (!res || !res.success) {
          showToast(res?.message || 'Failed to delete admission record', 'error', 3000);
          return;
        }
        if (typeof syncAllDataFromBackend === 'function') await syncAllDataFromBackend();
      } else if (adm) {
        adm.status = 'Rejected';
      }
      showToast('<i class="fas fa-check-circle"></i> Admission record deleted!', 'success', 3000);
    } else {
      showToast('<i class="fas fa-check-circle"></i> Record deleted!', 'success', 3000);
    }

    setTimeout(() => {
      navTo(type.toLowerCase() + 's');
    }, 1500);
  }
}


// Generate report
function generateReport(type) {
  showToast(`<i class="fas fa-chart-line"></i> Generating ${type} report...`, 'info');
  navTo('reports');
}

// Export data
// -----------------------------------
// ADMISSIONS EXPORT FUNCTIONS
// -----------------------------------
function exportAdmissionsToCSV() {
  let csv = 'Admissions Data Report\n';
  csv += 'Generated: ' + new Date().toLocaleDateString() + '\n\n';

  csv += 'Application ID,Student Name,DOB,Gender,Phone,Address,School,Class Applying,Academic Year,Status,Parent Name,Parent Phone,Occupation,Applied Date\n';
  admissionsData.forEach((a) => {
    csv += a.adm_id + ',' + a.name + ',' + a.dob + ',' + a.gender + ',' + a.phone + ',' + a.address + ',' + a.school + ',' + a.class_applying + ',' + a.academic_year + ',' + a.status + ',' + a.parent_name + ',' + a.parent_phone + ',' + a.parent_occupation + ',' + a.created + '\n';
  });

  csv += '\n\nSummary\n';
  csv += 'Total Applications,' + (admissionsData.length) + '\n';
  csv += 'Pending,' + (admissionsData.filter(a => a.status === 'Pending').length) + '\n';
  csv += 'Approved,' + (admissionsData.filter(a => a.status === 'Approved').length) + '\n';
  csv += 'Rejected,' + (admissionsData.filter(a => a.status === 'Rejected').length) + '\n';

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', 'Admissions_Data_' + new Date().toISOString().slice(0, 10) + '.csv');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('<i class="fas fa-check-circle"></i> Admissions data exported to CSV!', 'success', 3000);
}

function exportAdmissionsToExcel() {
  let csv = 'Application ID\tStudent Name\tDOB\tGender\tPhone\tAddress\tSchool\tClass Applying\tAcademic Year\tStatus\tParent Name\tParent Phone\tOccupation\tApplied Date\n';
  admissionsData.forEach((a) => {
    csv += a.adm_id + '\t' + a.name + '\t' + a.dob + '\t' + a.gender + '\t' + a.phone + '\t' + a.address + '\t' + a.school + '\t' + a.class_applying + '\t' + a.academic_year + '\t' + a.status + '\t' + a.parent_name + '\t' + a.parent_phone + '\t' + a.parent_occupation + '\t' + a.created + '\n';
  });

  const element = document.createElement('a');
  element.setAttribute('href', 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', 'Admissions_Data_' + new Date().toISOString().slice(0, 10) + '.xls');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('<i class="fas fa-check-circle"></i> Admissions data exported to Excel!', 'success', 3000);
}

function downloadAdmissionsPDF() {
  let html = '<html><head><meta charset="UTF-8"><style>';
  html += 'body{font-family:Arial,sans-serif;margin:15px;color:#333;font-size:12px}';
  html += 'h1{font-size:18px;margin:0 0 8px 0;color:#0066cc}h2{font-size:13px;margin:12px 0 8px 0;border-bottom:2px solid #0066cc;padding-bottom:4px}';
  html += 'table{width:100%;border-collapse:collapse;margin:10px 0}th,td{border:1px solid #ddd;padding:6px;text-align:left;font-size:11px}';
  html += 'th{background:#0066cc;color:white;font-weight:bold}.summary{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:15px 0}';
  html += '.stat-box{padding:10px;border:1px solid #ddd;text-align:center;border-radius:4px}.stat-num{font-size:18px;font-weight:bold;color:#0066cc}';
  html += '.page-break{page-break-after:always;margin:20px 0}';
  html += '</style></head><body>';

  html += '<h1><i class="fas fa-clipboard-list"></i> Admissions Data Report</h1>';
  html += '<div style="color:#666;font-size:10px;margin-bottom:15px">Generated on ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + '</div>';

  const pending = admissionsData.filter(a => a.status === 'Pending').length;
  const approved = admissionsData.filter(a => a.status === 'Approved').length;
  const rejected = admissionsData.filter(a => a.status === 'Rejected').length;
  const enrolled = admissionsData.filter(a => a.status === 'Enrolled').length;

  html += '<div class="summary">';
  html += '<div class="stat-box"><div class="stat-num">' + admissionsData.length + '</div><div>Total Applications</div></div>';
  html += '<div class="stat-box"><div class="stat-num">' + pending + '</div><div>Pending</div></div>';
  html += '<div class="stat-box"><div class="stat-num">' + approved + '</div><div>Approved</div></div>';
  html += '<div class="stat-box"><div class="stat-num">' + rejected + '</div><div>Rejected</div></div>';
  html += '</div>';

  html += '<h2>All Applications</h2>';
  html += '<table>';
  html += '<tr><th>App No.</th><th>Student Name</th><th>DOB</th><th>Gender</th><th>Class</th><th>School</th><th>Parent</th><th>Status</th><th>Date</th></tr>';
  admissionsData.forEach((a) => {
    const statusColor = a.status === 'Pending' ? '#f59e0b' : (a.status === 'Approved' ? '#10b981' : (a.status === 'Enrolled' ? '#3b82f6' : '#ef4444'));
    html += '<tr><td><strong>' + a.adm_id + '</strong></td><td>' + a.name + '</td><td>' + a.dob + '</td><td>' + a.gender + '</td><td>' + a.class_applying + '</td><td>' + a.school + '</td><td>' + a.parent_name + '</td><td style="color:white;background:' + statusColor + ';font-weight:bold;text-align:center;padding:4px">' + a.status + '</td><td>' + a.created + '</td></tr>';
  });
  html += '</table>';

  html += '<div class="page-break"></div>';
  html += '<h2>Pending Applications</h2>';
  html += '<table>';
  html += '<tr><th>App No.</th><th>Student</th><th>Class</th><th>Parent</th><th>Phone</th><th>Applied</th></tr>';
  admissionsData.filter(a => a.status === 'Pending').forEach((a) => {
    html += '<tr><td>' + a.adm_id + '</td><td>' + a.name + '</td><td>' + a.class_applying + '</td><td>' + a.parent_name + '</td><td>' + a.parent_phone + '</td><td>' + a.created + '</td></tr>';
  });
  html += '</table>';

  html += '<div class="page-break"></div>';
  html += '<h2>Approved Applications</h2>';
  html += '<table>';
  html += '<tr><th>App No.</th><th>Student</th><th>Class</th><th>Parent</th><th>Phone</th><th>Status</th></tr>';
  admissionsData.filter(a => a.status === 'Approved').forEach((a) => {
    html += '<tr><td>' + a.adm_id + '</td><td>' + a.name + '</td><td>' + a.class_applying + '</td><td>' + a.parent_name + '</td><td>' + a.parent_phone + '</td><td>Ready for Enrollment</td></tr>';
  });
  html += '</table>';

  html += '</body></html>';

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(html));
  element.setAttribute('download', 'Admissions_Data_' + new Date().toISOString().slice(0, 10) + '.pdf.html');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  showToast('<i class="fas fa-check-circle"></i> PDF generated!<br/>File: Admissions_Data_' + new Date().toISOString().slice(0, 10) + '.pdf.html', 'success', 3000);
}

function exportData(type = 'admissions') {
  if (type === 'admissions') {
    exportAdmissionsToCSV();
    return;
  }
  showToast('<i class="fas fa-download"></i> Export started', 'success');
}

// Print document
function printDocument() {
  window.print();
}

// Process action
function processAction(action) {
  showToast(`<i class="fas fa-check-circle"></i> ${action} processed!`, 'success');
}

// Handle pagination
function goToPage(page) {
  if (page === '…') return;
  showToast('<i class="fas fa-file"></i> Loading page ' + page, 'info');
}

// Initialize button handlers dynamically
function initButtonHandlers() {
  // Save attendance buttons
  document.querySelectorAll('.card-hdr').forEach(hdr => {
    if (hdr.innerHTML.includes('Attendance')) {
      const btn = hdr.querySelector('button');
      if (btn && btn.innerHTML.includes('Save')) {
        btn.onclick = saveAttendance;
      }
    }
  });

  // Generic save buttons
  document.querySelectorAll('.btn').forEach(btn => {
    const text = btn.innerHTML;
    if (text.includes('Save') && !btn.onclick && !btn.parentElement.innerHTML.includes('onclick')) {
      btn.onclick = function () {
        if (text.includes('Attendance')) saveAttendance();
        else if (text.includes('Grades')) saveGrades();
        else if (text.includes('Profile')) updateProfile();
        else saveForm();
      };
    }
    if (text.includes('Publish') && !btn.onclick) {
      btn.onclick = function () { showToast('<i class="fas fa-check-circle"></i> Published!', 'success'); };
    }
    if (text.includes('Cancel') && !btn.onclick) {
      btn.onclick = function () { location.reload(); };
    }
    if (text.includes('Update') && text.includes('Password') && !btn.onclick) {
      btn.onclick = updatePassword;
    }
    if (text.includes('<i class="fas fa-print"></i>') && !btn.onclick) {
      btn.onclick = printDocument;
    }
    if (text.includes('Upload') && !btn.onclick) {
      btn.onclick = function () { showToast('<i class="fas fa-check-circle"></i> File uploaded!', 'success'); };
    }
    if (text.includes('Create') && !btn.onclick) {
      btn.onclick = function () { showToast('<i class="fas fa-check-circle"></i> Record created!', 'success'); };
    }
  });

  // Pagination buttons
  document.querySelectorAll('.pg-btn').forEach(btn => {
    if (!btn.onclick) {
      btn.onclick = function () { goToPage(this.innerHTML); };
    }
  });

  // View/Edit/Delete buttons on tables
  document.querySelectorAll('.btn.btn-secondary.btn-xs, .btn.btn-primary.btn-xs, .btn.btn-danger.btn-xs').forEach(btn => {
    if (!btn.onclick && !btn.parentElement.innerHTML.includes('onclick')) {
      const text = btn.innerHTML;
      if (text.includes('View')) {
        btn.onclick = function () { showToast('<i class="fas fa-eye"></i> Opening record details', 'info'); };
      }
      if (text.includes('Edit')) {
        btn.onclick = function () { showToast('<i class="fas fa-edit"></i> Edit panel opened', 'info'); };
      }
      if (text.includes('Delete') || text.includes('Del')) {
        btn.onclick = function () { deleteRecord(1, 'Record'); };
      }
      if (text.includes('Message')) {
        btn.onclick = function () { navTo('contact'); };
      }
      if (text.includes('Grade')) {
        btn.onclick = function () { navTo('exams'); };
      }
      if (text.includes('Connect')) {
        btn.onclick = function () { showToast('<i class="fas fa-check-circle"></i> Connection request sent', 'success'); };
      }
      if (text.includes('Apply')) {
        btn.onclick = function () { showToast('<i class="fas fa-check-circle"></i> Application submitted', 'success'); };
      }
      if (text.includes('Profile')) {
        btn.onclick = function () { navTo('profile'); };
      }
      if (text.includes('Call')) {
        btn.onclick = function () { startVoiceCall('selected contact'); };
      }
      if (text.includes('Slip')) {
        btn.onclick = function () { showToast('<i class="fas fa-receipt"></i> Payslip generated', 'success'); };
      }
      if (text.includes('Perms')) {
        btn.onclick = function () { showToast('<i class="fas fa-shield"></i> Permissions panel opened', 'info'); };
      }
      if (text.includes('Disable')) {
        btn.onclick = function () { showToast('<i class="fas fa-ban"></i> Account disabled', 'warning'); };
      }
      if (text.includes('Generate')) {
        btn.onclick = function () { showToast('<i class="fas fa-cog"></i> Generating document', 'info'); };
      }
      if (text.includes('Print') || text.includes('<i class="fas fa-download"></i>')) {
        btn.onclick = printDocument;
      }
    }
  });

  // Toolbar buttons without onclick
  document.querySelectorAll('.toolbar .btn').forEach(btn => {
    if (!btn.onclick && !btn.parentElement.innerHTML.includes('onclick')) {
      const text = btn.innerHTML;
      if (text.includes('Enroll') || text.includes('Add')) {
        btn.onclick = function () { createRecord(text.split(/\s+/)[1] || 'Record'); };
      }
      if (text.includes('Import')) {
        btn.onclick = function () { showToast('<i class="fas fa-file-import"></i> Import tool opened', 'info'); };
      }
      if (text.includes('Export')) {
        btn.onclick = function () { exportData(); };
      }
      if (text.includes('Print')) {
        btn.onclick = printDocument;
      }
      if (text.includes('Edit')) {
        btn.onclick = function () { showToast('<i class="fas fa-edit"></i> Editor opened', 'info'); };
      }
    }
  });

  // Hero buttons
  document.querySelectorAll('.hero-btn-gold, .hero-btn-outline').forEach(btn => {
    if (!btn.onclick && !btn.parentElement.innerHTML.includes('onclick')) {
      const text = btn.innerHTML;
      if (text.includes('Browse')) {
        btn.onclick = function () { navTo('directory'); };
      }
      if (text.includes('Admission')) {
        btn.onclick = function () { navTo('admission'); };
      }
      if (text.includes('Learn')) {
        btn.onclick = function () { navTo('about'); };
      }
    }
  });

  // Send message buttons
  document.querySelectorAll('.btn').forEach(btn => {
    if (btn.innerHTML.includes('Send Message') && !btn.onclick) {
      btn.onclick = function () { showToast('<i class="fas fa-check-circle"></i> Message sent!', 'success'); };
    }
  });

  // Process/Backup buttons
  document.querySelectorAll('.btn').forEach(btn => {
    if ((btn.innerHTML.includes('Backup') || btn.innerHTML.includes('Process') ||
      btn.innerHTML.includes('Download') || btn.innerHTML.includes('Cloud')) && !btn.onclick) {
      btn.onclick = function () { showToast('<i class="fas fa-check-circle"></i> Action started', 'success'); };
    }
  });
}

// -----------------------------------
// INIT
// -----------------------------------
document.getElementById('role-fab')?.style.setProperty('display', 'none');

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
  if (typeof loadPersistentRecords === 'function') loadPersistentRecords();
  const savedNav = typeof getSavedNavigationState === 'function' ? getSavedNavigationState() : null;
  const sessionUser = getSessionUser();
  const savedRole = savedNav?.role || sessionUser?.role || 'Visitor';
  switchRole(savedRole, savedNav?.mod || 'dashboard');
  initButtonHandlers();
  initMobileSidebarHandlers();
});

// -----------------------------------
// MOBILE SIDEBAR EVENT HANDLERS
// -----------------------------------
function initMobileSidebarHandlers() {
  const sidebar = document.getElementById('sidebar');
  const sidebarItems = document.querySelectorAll('.sb-item');

  if (!sidebar) return;

  // Close sidebar when clicking on any sidebar item
  sidebarItems.forEach(item => {
    item.addEventListener('click', closeMobileSidebar);
  });

  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', function (event) {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebar-toggle');

    if (!sidebar || !toggle) return;

    const isClickInSidebar = sidebar.contains(event.target);
    const isClickOnToggle = toggle.contains(event.target);

    if (!isClickInSidebar && !isClickOnToggle && sidebar.classList.contains('open')) {
      closeMobileSidebar();
    }
  });

  // Handle window resize - close sidebar if resizing to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      closeMobileSidebar();
    }
  });

  // Wrap all tables with responsive wrapper
  wrapTablesForResponsiveness();
}

// -----------------------------------
// DIGITAL YEARBOOK DATA
// -----------------------------------
const YEARBOOK_DATA = {};

let currentYearbookYear = null;
let currentYearbookTab = 'dashboard';

// -----------------------------------
// PUBLIC YEARBOOK MODULE
// -----------------------------------
function yearbookModule() {
  if (!currentYearbookYear) {
    return renderYearbookDashboard();
  }
  return renderYearbookView(currentYearbookYear);
}

function renderYearbookDashboard() {
  let html = hdr('Digital Yearbook', 'Explore and download past yearbooks', 'Yearbooks');
  const yearbooks = Object.values(YEARBOOK_DATA)
    .filter(yb => currentRole !== 'Visitor' || yb.status === 'Published')
    .sort((a, b) => String(b.year || '').localeCompare(String(a.year || '')));

  if (!yearbooks.length) {
    return html + `<div class="card" style="margin-top:20px;text-align:center;color:var(--gray-500);padding:32px">
      <i class="fas fa-book-open" style="font-size:32px;color:var(--gray-300);margin-bottom:12px"></i>
      <div style="font-weight:700;color:var(--blue-dark);margin-bottom:6px">No published yearbooks yet</div>
      <div style="font-size:13px">Published yearbook editions will appear here from the database.</div>
    </div>`;
  }

  html += `<div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));gap:20px;margin-top:20px">`;
  
  yearbooks.forEach(yb => {
    html += `
    <div class="card" style="padding:0;overflow:hidden;cursor:pointer;transition:transform 0.2s" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='none'" onclick="openYearbook('${yb.year}')">
      <div style="height:140px;background:${yb.coverImg};display:flex;align-items:center;justify-content:center;color:white;font-size:32px;font-weight:800;position:relative">
        ${yb.year}
        <div style="position:absolute;bottom:10px;right:10px;font-size:12px;background:rgba(255,255,255,0.2);padding:4px 8px;border-radius:4px"><i class="fas fa-camera"></i> ${yb.totalPhotos} Photos</div>
      </div>
      <div style="padding:20px">
        <h3 style="margin:0 0 8px 0;font-size:18px;color:var(--blue-dark)">${yb.title}</h3>
        <div style="display:flex;justify-content:space-between;color:var(--gray-500);font-size:13px">
          <span><i class="fas fa-user-graduate"></i> ${yb.totalGrads} Graduates</span>
        </div>
        <button class="btn btn-primary btn-sm" style="width:100%;margin-top:16px">View Yearbook</button>
      </div>
    </div>`;
  });
  
  html += `</div>`;
  return html;
}

function openYearbook(year) {
  currentYearbookYear = year;
  currentYearbookTab = 'classes';
  renderMain();
}

function closeYearbook() {
  currentYearbookYear = null;
  renderMain();
}

function renderYearbookView(year) {
  const yb = YEARBOOK_DATA[year];
  if (!yb) {
    return hdr('Digital Yearbook', 'Explore and download past yearbooks', 'Yearbooks') + `<div class="card" style="margin-top:20px;text-align:center;color:var(--gray-500);padding:32px">
      <div style="font-weight:700;color:var(--blue-dark);margin-bottom:8px">Yearbook not found</div>
      <button class="btn btn-secondary btn-sm" onclick="closeYearbook()">Back to Yearbooks</button>
    </div>`;
  }
  yb.classes = yb.classes || {};
  yb.teachers = yb.teachers || [];
  yb.leaders = yb.leaders || [];
  yb.achievements = yb.achievements || [];
  yb.events = yb.events || [];
  yb.tributes = yb.tributes || [];
  const tabs = [
    { id: 'classes', icon: 'fa-users', lbl: 'Graduating Classes' },
    { id: 'teachers', icon: 'fa-chalkboard-teacher', lbl: 'Teachers' },
    { id: 'leaders', icon: 'fa-star', lbl: 'Leaders & Awards' },
    { id: 'events', icon: 'fa-camera-retro', lbl: 'Events & Memories' },
    { id: 'tributes', icon: 'fa-envelope-open-text', lbl: 'Tributes' }
  ];

  let html = `
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;flex-wrap:wrap">
    <button class="btn btn-icon" onclick="closeYearbook()"><i class="fas fa-arrow-left"></i></button>
    <h1 style="margin:0;font-size:24px;color:var(--blue-dark)">${yb.title}</h1>
    ${yb.pdfUrl ? `<div style="margin-left:auto;display:flex;gap:10px">
      <button class="btn btn-secondary btn-sm" onclick="openPdfViewerModal()"><i class="fas fa-file-pdf"></i> View PDF</button>
      <a class="btn btn-primary btn-sm" href="${yb.pdfUrl}" download><i class="fas fa-download"></i> Download</a>
    </div>` : ''}
  </div>
  
  <div class="tabs">
    ${tabs.map(t => `<div class="tab${currentYearbookTab === t.id ? ' active' : ''}" onclick="currentYearbookTab='${t.id}';renderMain()"><i class="fas ${t.icon}"></i> ${t.lbl}</div>`).join('')}
  </div>
  
  <div style="margin-top:20px">`;

  if (currentYearbookTab === 'classes') {
    const classNames = Object.keys(yb.classes);
    if (!classNames.length) {
      html += `<div class="card" style="text-align:center;color:var(--gray-500);padding:28px">No graduating class profiles have been added for this yearbook.</div>`;
    }
    classNames.forEach(cls => {
      html += `<div class="card mb20">
        <div class="card-hdr"><span class="card-title">${cls}</span></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(250px, 1fr));gap:16px">`;
      yb.classes[cls].forEach(st => {
        html += `<div style="border:1px solid var(--gray-200);border-radius:8px;padding:16px;text-align:center">
          <div class="av av-xl av-${st.color}" style="margin:0 auto 12px auto">${st.avatar}</div>
          <div style="font-weight:700;font-size:16px;color:var(--blue-dark)">${st.name}</div>
          <div style="font-size:12px;color:var(--gold);font-weight:600;margin-bottom:12px">${st.ambition}</div>
          <div style="font-size:12px;color:var(--gray-500);font-style:italic">"${st.quote}"</div>
          ${st.awards.length ? `<div style="margin-top:12px"><span class="badge b-purple"><i class="fas fa-trophy"></i> ${st.awards[0]}</span></div>` : ''}
        </div>`;
      });
      html += `</div></div>`;
    });
  } else if (currentYearbookTab === 'teachers') {
    if (!yb.teachers.length) {
      html += `<div class="card" style="text-align:center;color:var(--gray-500);padding:28px">No teacher messages have been added for this yearbook.</div>`;
    } else {
    html += `<div class="g3">`;
    yb.teachers.forEach(tc => {
      html += `<div class="card" style="text-align:center">
        <div class="av av-xl av-gray" style="margin:0 auto 12px auto">${tc.avatar}</div>
        <div style="font-weight:700;font-size:16px;color:var(--blue-dark)">${tc.name}</div>
        <div style="font-size:12px;color:var(--blue-main);font-weight:600;margin-bottom:8px">${tc.subject}</div>
        <div style="font-size:11px;color:var(--gray-500);margin-bottom:12px"><i class="fas fa-clock"></i> ${tc.service}</div>
        <div style="font-size:13px;color:var(--gray-600);background:var(--gray-50);padding:12px;border-radius:8px;border-left:3px solid var(--gold);text-align:left">"${tc.message}"</div>
      </div>`;
    });
    html += `</div>`;
    }
  } else if (currentYearbookTab === 'leaders') {
    html += `<div class="g2"><div class="card"><div class="card-hdr"><span class="card-title">School Leaders</span></div>`;
    html += `<ul style="list-style:none;padding:0;margin:0">`;
    if (!yb.leaders.length) {
      html += `<li style="padding:16px 0;color:var(--gray-500)">No leaders have been added.</li>`;
    }
    yb.leaders.forEach(ld => {
      html += `<li style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--gray-100)">
        <span style="font-weight:600;color:var(--gray-800)">${ld.role}</span>
        <span style="color:var(--blue-main);font-weight:600">${ld.name}</span>
      </li>`;
    });
    html += `</ul></div>`;
    
    html += `<div class="card"><div class="card-hdr"><span class="card-title">Achievements</span></div>`;
    html += `<ul style="list-style:none;padding:0;margin:0">`;
    if (!yb.achievements.length) {
      html += `<li style="padding:16px 0;color:var(--gray-500)">No achievements have been added.</li>`;
    }
    yb.achievements.forEach(ac => {
      html += `<li style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--gray-100)">
        <span style="font-weight:600;color:var(--gray-800)"><i class="fas fa-trophy" style="color:var(--gold);margin-right:8px"></i>${ac.title}</span>
        <span style="color:var(--purple);font-weight:600">${ac.winner}</span>
      </li>`;
    });
    html += `</ul></div></div>`;
  } else if (currentYearbookTab === 'events') {
    if (!yb.events.length) {
      html += `<div class="card" style="text-align:center;color:var(--gray-500);padding:28px">No event galleries have been added for this yearbook.</div>`;
    } else {
    html += `<div class="g3">`;
    yb.events.forEach(ev => {
      html += `<div class="card" style="text-align:center;cursor:pointer" onclick="openAlbumView('${ev.name}', '${ev.icon}', '${ev.bg}')">
        <div style="height:100px;background:${ev.bg};border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:36px;color:rgba(0,0,0,0.2);margin-bottom:16px"><i class="fas ${ev.icon}"></i></div>
        <div style="font-weight:700;font-size:15px;color:var(--blue-dark);margin-bottom:8px">${ev.name}</div>
        <div style="font-size:12px;color:var(--gray-500)">${ev.desc}</div>
        <button class="btn btn-secondary btn-sm" style="margin-top:16px;width:100%">View Gallery</button>
      </div>`;
    });
    html += `</div>`;
    }
  } else if (currentYearbookTab === 'tributes') {
    if (!yb.tributes.length) {
      html += `<div class="card" style="text-align:center;color:var(--gray-500);padding:28px">No tributes have been added for this yearbook.</div>`;
    } else {
    html += `<div class="g2">`;
    yb.tributes.forEach(tr => {
      html += `<div class="card">
        <div style="font-size:16px;font-style:italic;color:var(--gray-600);line-height:1.5;margin-bottom:16px">"${tr.text}"</div>
        <div style="font-weight:700;color:var(--blue-dark);text-align:right">- ${tr.author}</div>
      </div>`;
    });
    html += `</div>`;
    }
  }

  html += `</div>`;
  return html;
}

// -----------------------------------
// ADMIN YEARBOOK MODULE
// -----------------------------------
function adminYearbookModule() {
  const yearbooks = Object.values(YEARBOOK_DATA)
    .sort((a, b) => String(b.year || '').localeCompare(String(a.year || '')));
  const rows = yearbooks.map(yb => `
    <tr>
      <td><strong>${yb.year}</strong></td>
      <td>${yb.title}</td>
      <td><span class="badge b-${yb.status === 'Published' ? 'success' : 'warning'}">${yb.status}</span></td>
      <td>${yb.totalGrads || 0}</td>
      <td>${yb.totalPhotos || 0}</td>
      <td>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn btn-secondary btn-xs" onclick="openYearbook('${yb.year}')">Preview</button>
          ${yb.status === 'Draft' ? `<button class="btn btn-primary btn-xs" onclick="publishYearbook('${yb.year}')">Publish</button>` : ''}
          <button class="btn btn-danger btn-xs" onclick="deleteYearbook('${yb.year}')">Delete</button>
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
}

function openPdfViewerModal() {
  const yb = YEARBOOK_DATA[currentYearbookYear] || {};
  if (!yb.pdfUrl) {
    showToast('No PDF has been uploaded for this yearbook.', 'warning');
    return;
  }
  openModal(`
    <div style="width:900px;max-width:95vw;height:80vh;display:flex;flex-direction:column;background:#333;color:white;border-radius:8px;overflow:hidden">
      <div style="padding:16px;background:#222;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #444">
        <div style="font-size:16px;font-weight:600"><i class="fas fa-file-pdf" style="color:var(--red)"></i> ${yb.title || 'Yearbook'}${yb.year ? ' - ' + yb.year : ''}</div>
        <div style="display:flex;gap:12px">
          <a class="btn btn-icon" style="color:white" href="${yb.pdfUrl}" download><i class="fas fa-download"></i></a>
          <button class="btn btn-icon" style="color:white" onclick="closeModal()"><i class="fas fa-times"></i></button>
        </div>
      </div>
      <iframe src="${yb.pdfUrl}" title="${yb.title || 'Yearbook'}" style="flex:1;border:0;background:white"></iframe>
    </div>
  `, true);
}

function openCreateYearbookModal() {
  openModal(`
    <div style="padding:24px;width:400px;max-width:90vw">
      <h3 style="margin-top:0;color:var(--blue-dark)"><i class="fas fa-plus-circle"></i> Create New Yearbook</h3>
      <div class="f-field" style="margin-top:20px"><label>Academic Year</label><input type="text" id="new-yb-year" placeholder="e.g. 2028"></div>
      <div class="f-field"><label>Yearbook Title</label><input type="text" id="new-yb-title" placeholder="Class of 2028 Yearbook"></div>
      <div class="f-field"><label>Cover Color Theme</label><input type="color" id="new-yb-theme" value="#1e3a8a" style="padding:0;height:40px;width:100%"></div>
      <div class="f-field"><label>PDF URL</label><input type="text" id="new-yb-pdf" placeholder="assets/yearbooks/class-of-2028.pdf"></div>
      <div style="display:flex;gap:10px;margin-top:24px">
        <button class="btn btn-primary" style="flex:1" onclick="submitCreateYearbookForm()">Create</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `, true);
}

// -----------------------------------
// RESPONSIVE TABLE WRAPPER
// -----------------------------------
function wrapTablesForResponsiveness() {
  const tables = document.querySelectorAll('.card .tbl, .main-wrap .tbl');
  tables.forEach(table => {
    // Check if table is already wrapped
    if (table.parentElement && table.parentElement.classList.contains('table-wrapper')) {
      return;
    }

    // Create wrapper div
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';

    // Wrap the table
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });
}









