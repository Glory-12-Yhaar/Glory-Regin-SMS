// ═══════════════════════════════════════════════════════════════
// ENHANCED STUDENT MANAGEMENT SYSTEM
// ═══════════════════════════════════════════════════════════════

class EnhancedStudentManager {
  constructor() {
    this.students = this.loadStudents();
    this.searchEngine = new SmartSearch(Object.values(this.students), {
      keys: ['name', 'id', 'class', 'classTeacher', 'gender'],
      threshold: 0.3
    });
    this.paginator = new Paginator(Object.values(this.students), 10);
    this.filters = {
      class: '',
      gender: '',
      attendance: ''
    };
    this.sortBy = 'name';
    this.sortOrder = 'asc';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderStudentTable();
    this.initializeFormValidation();
  }

  loadStudents() {
    // Load from existing STUDENTS_DATA or localStorage
    const saved = SafeStorage.get('students_data');
    return saved || STUDENTS_DATA || {};
  }

  saveStudents() {
    SafeStorage.set('students_data', this.students);
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('student-search');
    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        this.performSearch(e.target.value);
      }, 300));
    }

    // Filter functionality
    const classFilter = document.getElementById('class-filter');
    const genderFilter = document.getElementById('gender-filter');
    const attendanceFilter = document.getElementById('attendance-filter');

    [classFilter, genderFilter, attendanceFilter].forEach(filter => {
      if (filter) {
        filter.addEventListener('change', () => this.applyFilters());
      }
    });

    // Sort functionality
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('sortable')) {
        const column = e.target.dataset.column;
        this.sortStudents(column);
      }
    });
  }

  performSearch(query) {
    const allStudents = Object.values(this.students);
    
    if (!query.trim()) {
      this.updateDisplayedStudents(allStudents);
      return;
    }

    // Update search engine data
    this.searchEngine.data = allStudents;
    const results = this.searchEngine.search(query);
    this.updateDisplayedStudents(results);
  }

  applyFilters() {
    let filtered = Object.values(this.students);

    // Class filter
    const classFilter = document.getElementById('class-filter');
    if (classFilter && classFilter.value) {
      filtered = filtered.filter(student => student.class === classFilter.value);
    }

    // Gender filter
    const genderFilter = document.getElementById('gender-filter');
    if (genderFilter && genderFilter.value) {
      filtered = filtered.filter(student => student.gender === genderFilter.value);
    }

    // Attendance filter
    const attendanceFilter = document.getElementById('attendance-filter');
    if (attendanceFilter && attendanceFilter.value) {
      const attendanceThreshold = parseInt(attendanceFilter.value);
      filtered = filtered.filter(student => {
        if (attendanceFilter.value === 'high') return student.attendance >= 90;
        if (attendanceFilter.value === 'medium') return student.attendance >= 70 && student.attendance < 90;
        if (attendanceFilter.value === 'low') return student.attendance < 70;
        return true;
      });
    }

    this.updateDisplayedStudents(filtered);
  }

  sortStudents(column) {
    const allStudents = [...this.paginator.data];
    
    // Toggle sort order if same column
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }

    allStudents.sort((a, b) => {
      let aVal = this.getNestedValue(a, column);
      let bVal = this.getNestedValue(b, column);

      // Handle different data types
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (typeof aVal === 'number') {
        return this.sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      // String comparison
      const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return this.sortOrder === 'asc' ? result : -result;
    });

    this.updateDisplayedStudents(allStudents);
    this.updateSortIndicators(column);
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  updateSortIndicators(activeColumn) {
    // Remove all existing sort indicators
    document.querySelectorAll('.sort-indicator').forEach(el => el.remove());

    // Add new sort indicator
    const header = document.querySelector(`[data-column="${activeColumn}"]`);
    if (header) {
      const indicator = document.createElement('span');
      indicator.className = 'sort-indicator';
      indicator.innerHTML = this.sortOrder === 'asc' ? ' ↑' : ' ↓';
      header.appendChild(indicator);
    }
  }

  updateDisplayedStudents(students) {
    this.paginator.updateData(students);
    this.renderStudentTable();
  }

  renderStudentTable() {
    const tableContainer = document.getElementById('students-table-container');
    if (!tableContainer) return;

    const currentPageData = this.paginator.getCurrentPageData();
    const pageInfo = this.paginator.getPageInfo();

    tableContainer.innerHTML = `
      <div class="table-header">
        <div class="table-controls">
          <div class="search-container">
            <input type="text" id="student-search" class="search-input" placeholder="Search students...">
            <i class="fas fa-search search-icon"></i>
          </div>
          <div class="filter-controls">
            <select id="class-filter" class="filter-select">
              <option value="">All Classes</option>
              ${Object.keys(SUBJECTS_BY_CLASS).map(className => 
                `<option value="${className}">${className}</option>`
              ).join('')}
            </select>
            <select id="gender-filter" class="filter-select">
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select id="attendance-filter" class="filter-select">
              <option value="">All Attendance</option>
              <option value="high">High (90%+)</option>
              <option value="medium">Medium (70-89%)</option>
              <option value="low">Low (<70%)</option>
            </select>
          </div>
          <button class="btn btn-primary" onclick="studentManager.openAddStudentModal()">
            <i class="fas fa-plus"></i> Add Student
          </button>
        </div>
      </div>

      <div class="table-container">
        <table class="enhanced-table">
          <thead>
            <tr>
              <th class="sortable" data-column="name">
                Name <i class="fas fa-sort text-xs"></i>
              </th>
              <th class="sortable" data-column="id">
                Student ID <i class="fas fa-sort text-xs"></i>
              </th>
              <th class="sortable" data-column="class">
                Class <i class="fas fa-sort text-xs"></i>
              </th>
              <th class="sortable" data-column="gender">
                Gender <i class="fas fa-sort text-xs"></i>
              </th>
              <th class="sortable" data-column="attendance">
                Attendance <i class="fas fa-sort text-xs"></i>
              </th>
              <th>Performance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${currentPageData.length === 0 ? 
              `<tr><td colspan="7" style="text-align: center; padding: 40px; color: var(--gray-500);">
                <i class="fas fa-search" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
                No students found
              </td></tr>` 
              : 
              currentPageData.map(student => this.renderStudentRow(student)).join('')
            }
          </tbody>
        </table>
      </div>

      <div id="pagination-container"></div>
    `;

    // Re-setup event listeners for new elements
    this.setupEventListeners();
    
    // Render pagination
    this.paginator.renderPagination('pagination-container', 'studentManager.renderStudentTable');

    // Update student count
    this.updateStudentCount(pageInfo.totalItems);
  }

  renderStudentRow(student) {
    const average = calculateAverage(student.scores);
    const performance = this.getPerformanceCategory(average);
    const attendanceStatus = this.getAttendanceStatus(student.attendance);

    return `
      <tr data-student-id="${student.id}">
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="av av-sm av-${this.getAvatarColor(student.name)}">${this.getInitials(student.name)}</div>
            <div>
              <div style="font-weight: 600; color: var(--gray-800);">${student.name}</div>
              <div style="font-size: 11px; color: var(--gray-500);">${student.classTeacher}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="badge b-gray">${student.id}</span>
        </td>
        <td>
          <span class="badge b-info">${student.class}</span>
        </td>
        <td>${student.gender}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="prog-bar" style="width: 60px; height: 8px;">
              <div class="prog-fill pf-${attendanceStatus.color}" style="width: ${student.attendance}%"></div>
            </div>
            <span style="font-size: 12px; font-weight: 600; color: var(--${attendanceStatus.color});">${student.attendance}%</span>
          </div>
        </td>
        <td>
          <span class="badge b-${performance.color}">${performance.label}</span>
          <div style="font-size: 11px; color: var(--gray-500); margin-top: 2px;">Avg: ${average.toFixed(1)}%</div>
        </td>
        <td>
          <div style="display: flex; gap: 4px;">
            <button class="btn btn-xs btn-secondary" onclick="studentManager.viewStudent('${student.name}')" title="View Details">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-xs btn-secondary" onclick="studentManager.editStudent('${student.name}')" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-xs" style="background: var(--danger); color: white;" onclick="studentManager.deleteStudent('${student.name}')" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }

  getPerformanceCategory(average) {
    if (average >= 90) return { label: 'Excellent', color: 'success' };
    if (average >= 80) return { label: 'Very Good', color: 'info' };
    if (average >= 70) return { label: 'Good', color: 'warning' };
    if (average >= 60) return { label: 'Average', color: 'gray' };
    return { label: 'Needs Help', color: 'danger' };
  }

  getAttendanceStatus(attendance) {
    if (attendance >= 90) return { color: 'green' };
    if (attendance >= 70) return { color: 'gold' };
    return { color: 'red' };
  }

  getAvatarColor(name) {
    const colors = ['blue', 'green', 'gold', 'purple', 'teal', 'red'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }

  getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  updateStudentCount(count) {
    const countElement = document.getElementById('students-count');
    if (countElement) {
      countElement.textContent = count;
    }
  }

  // Modal and form methods
  openAddStudentModal() {
    const modal = this.createStudentModal();
    openModal(modal, true);
  }

  editStudent(studentName) {
    const student = this.students[studentName];
    if (!student) return;

    const modal = this.createStudentModal(student);
    openModal(modal, true);
  }

  createStudentModal(student = null) {
    const isEdit = student !== null;
    const title = isEdit ? 'Edit Student' : 'Add New Student';

    return `
      <div class="modal-backdrop" onclick="closeModal()">
        <div class="modal-content" onclick="event.stopPropagation()" style="width: 600px;">
          <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
            <button class="modal-close" onclick="closeModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body">
            <form id="student-form">
              <div class="form-field">
                <label for="student-name">Full Name *</label>
                <input type="text" id="student-name" name="name" value="${student?.name || ''}" required>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-field">
                  <label for="student-id">Student ID *</label>
                  <input type="text" id="student-id" name="id" value="${student?.id || ''}" placeholder="2024-001" required>
                </div>

                <div class="form-field">
                  <label for="student-class">Class *</label>
                  <select id="student-class" name="class" required>
                    <option value="">Select Class</option>
                    ${Object.keys(SUBJECTS_BY_CLASS).map(className => 
                      `<option value="${className}" ${student?.class === className ? 'selected' : ''}>${className}</option>`
                    ).join('')}
                  </select>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-field">
                  <label for="student-gender">Gender *</label>
                  <select id="student-gender" name="gender" required>
                    <option value="">Select Gender</option>
                    <option value="Male" ${student?.gender === 'Male' ? 'selected' : ''}>Male</option>
                    <option value="Female" ${student?.gender === 'Female' ? 'selected' : ''}>Female</option>
                  </select>
                </div>

                <div class="form-field">
                  <label for="student-dob">Date of Birth *</label>
                  <input type="date" id="student-dob" name="dob" value="${student?.dob || ''}" required>
                </div>
              </div>

              <div class="form-field">
                <label for="class-teacher">Class Teacher</label>
                <input type="text" id="class-teacher" name="classTeacher" value="${student?.classTeacher || ''}" placeholder="e.g., Ms. Mensah">
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-field">
                  <label for="student-stream">Stream</label>
                  <select id="student-stream" name="stream">
                    <option value="General" ${student?.stream === 'General' ? 'selected' : ''}>General</option>
                    <option value="Science" ${student?.stream === 'Science' ? 'selected' : ''}>Science</option>
                    <option value="Arts" ${student?.stream === 'Arts' ? 'selected' : ''}>Arts</option>
                  </select>
                </div>

                <div class="form-field">
                  <label for="student-attendance">Current Attendance (%)</label>
                  <input type="number" id="student-attendance" name="attendance" min="0" max="100" value="${student?.attendance || 85}">
                </div>
              </div>
            </form>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="studentManager.saveStudent(${isEdit})">
              ${isEdit ? 'Update Student' : 'Add Student'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  initializeFormValidation() {
    // This will be called after modal is created
    setTimeout(() => {
      const form = document.getElementById('student-form');
      if (form) {
        const validator = new FormValidator(form);
        
        validator
          .addRule('name', [
            { type: 'required' },
            { type: 'minLength', value: 2 }
          ])
          .addRule('id', [
            { type: 'required' },
            { type: 'custom', validator: (value) => ({
                valid: DataValidator.validateStudentId(value),
                message: 'Student ID must be in format: YYYY-NN (e.g., 2024-01)'
              })
            }
          ])
          .addRule('class', [{ type: 'required' }])
          .addRule('gender', [{ type: 'required' }])
          .addRule('dob', [{ type: 'required' }]);

        validator.onSubmitSuccess = (formData) => {
          this.saveStudent(false, formData);
        };
      }
    }, 100);
  }

  saveStudent(isEdit = false, formData = null) {
    if (!formData) {
      const form = document.getElementById('student-form');
      if (!form) return;
      formData = new FormData(form);
    }

    const studentData = {
      name: DataValidator.sanitizeString(formData.get('name')),
      id: formData.get('id').trim(),
      class: formData.get('class'),
      gender: formData.get('gender'),
      dob: formData.get('dob'),
      classTeacher: DataValidator.sanitizeString(formData.get('classTeacher')) || 'TBD',
      stream: formData.get('stream') || 'General',
      attendance: parseInt(formData.get('attendance')) || 85,
      term: '1st Term',
      academicYear: '2024/2025',
      scores: {}
    };

    // Validate required fields
    if (!studentData.name || !studentData.id || !studentData.class || !studentData.gender || !studentData.dob) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    // Check for duplicate ID (only for new students)
    if (!isEdit && Object.values(this.students).some(s => s.id === studentData.id)) {
      showToast('Student ID already exists', 'error');
      return;
    }

    // Save student
    this.students[studentData.name] = studentData;
    this.saveStudents();

    // Update displays
    this.searchEngine.data = Object.values(this.students);
    this.updateDisplayedStudents(Object.values(this.students));

    // Close modal and show success
    closeModal();
    showToast(`Student ${isEdit ? 'updated' : 'added'} successfully!`, 'success');
  }

  viewStudent(studentName) {
    const student = this.students[studentName];
    if (!student) return;

    const scores = getStudentScoresWithGrades(studentName);
    const average = calculateAverage(student.scores);
    const position = calculateClassPosition(studentName, student.class);

    const modal = `
      <div class="modal-backdrop" onclick="closeModal()">
        <div class="modal-content" onclick="event.stopPropagation()" style="width: 700px; max-width: 95vw;">
          <div class="modal-header">
            <h3 class="modal-title">Student Details</h3>
            <button class="modal-close" onclick="closeModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body">
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 24px; margin-bottom: 24px;">
              <div style="text-align: center;">
                <div class="av av-xl av-${this.getAvatarColor(student.name)}" style="margin: 0 auto 16px;">
                  ${this.getInitials(student.name)}
                </div>
                <h4 style="margin: 0 0 8px; color: var(--blue-dark);">${student.name}</h4>
                <p style="color: var(--gray-500); margin: 0;">${student.id}</p>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 13px;">
                <div><strong>Class:</strong> ${student.class}</div>
                <div><strong>Gender:</strong> ${student.gender}</div>
                <div><strong>Date of Birth:</strong> ${new Date(student.dob).toLocaleDateString()}</div>
                <div><strong>Class Teacher:</strong> ${student.classTeacher}</div>
                <div><strong>Stream:</strong> ${student.stream}</div>
                <div><strong>Attendance:</strong> ${student.attendance}%</div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
              <div class="stat-card" style="text-align: center; padding: 16px;">
                <div style="font-size: 24px; font-weight: 800; color: var(--blue-main);">${average.toFixed(1)}%</div>
                <div style="font-size: 11px; color: var(--gray-500);">Overall Average</div>
              </div>
              <div class="stat-card" style="text-align: center; padding: 16px;">
                <div style="font-size: 24px; font-weight: 800; color: var(--gold);">${position.position}</div>
                <div style="font-size: 11px; color: var(--gray-500);">Class Position</div>
              </div>
              <div class="stat-card" style="text-align: center; padding: 16px;">
                <div style="font-size: 24px; font-weight: 800; color: var(--success);">${student.attendance}%</div>
                <div style="font-size: 11px; color: var(--gray-500);">Attendance</div>
              </div>
            </div>

            ${scores && Object.keys(scores).length > 0 ? `
              <h5 style="margin-bottom: 16px;">Academic Performance</h5>
              <div class="table-container" style="max-height: 300px; overflow-y: auto;">
                <table class="enhanced-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Class Score</th>
                      <th>Exam Score</th>
                      <th>Total</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${Object.entries(scores).map(([subject, data]) => `
                      <tr>
                        <td style="font-weight: 600;">${subject}</td>
                        <td>${data.classScore}/50</td>
                        <td>${data.examScore}/50</td>
                        <td style="font-weight: 600;">${data.total}/100</td>
                        <td><span class="badge b-${this.getGradeBadgeColor(data.grade)}">${data.grade}</span></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : '<p style="text-align: center; color: var(--gray-500); padding: 40px;">No academic records available</p>'}
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal()">Close</button>
            <button class="btn btn-primary" onclick="studentManager.editStudent('${student.name}')">
              <i class="fas fa-edit"></i> Edit Student
            </button>
          </div>
        </div>
      </div>
    `;

    openModal(modal, true);
  }

  getGradeBadgeColor(grade) {
    const colors = {
      'A': 'success',
      'B': 'info',
      'C': 'warning',
      'D': 'gray',
      'E': 'danger'
    };
    return colors[grade] || 'gray';
  }

  deleteStudent(studentName) {
    if (!confirm(`Are you sure you want to delete ${studentName}? This action cannot be undone.`)) {
      return;
    }

    delete this.students[studentName];
    this.saveStudents();

    // Update displays
    this.searchEngine.data = Object.values(this.students);
    this.updateDisplayedStudents(Object.values(this.students));

    showToast('Student deleted successfully', 'success');
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  if (typeof window !== 'undefined') {
    window.studentManager = new EnhancedStudentManager();
  }
});