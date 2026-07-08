// ═══════════════════════════════════════════════════════════════
// ANALYTICS & PERFORMANCE DASHBOARD
// ═══════════════════════════════════════════════════════════════

class AnalyticsDashboard {
  constructor() {
    this.students = {};
    this.analytics = {
      performanceTrends: [],
      attendanceStats: {},
      classAnalytics: {},
      subjectPerformance: {}
    };
    this.init();
  }

  init() {
    this.loadData();
    this.generateAnalytics();
    this.renderDashboard();
  }

  loadData() {
    // Load student data
    this.students = SafeStorage.get('students_data') || STUDENTS_DATA || {};
  }

  generateAnalytics() {
    const studentArray = Object.values(this.students);
    
    if (studentArray.length === 0) {
      console.warn('No student data available for analytics');
      return;
    }

    this.analytics = {
      performanceTrends: this.calculatePerformanceTrends(studentArray),
      attendanceStats: this.calculateAttendanceStats(studentArray),
      classAnalytics: this.calculateClassAnalytics(studentArray),
      subjectPerformance: this.calculateSubjectPerformance(studentArray),
      genderAnalytics: this.calculateGenderAnalytics(studentArray),
      topPerformers: this.getTopPerformers(studentArray),
      studentAtRisk: this.getStudentsAtRisk(studentArray)
    };
  }

  calculatePerformanceTrends(students) {
    const trends = {
      excellent: 0,    // 90%+
      veryGood: 0,     // 80-89%
      good: 0,         // 70-79%
      average: 0,      // 60-69%
      needsHelp: 0     // <60%
    };

    students.forEach(student => {
      const average = calculateAverage(student.scores);
      
      if (average >= 90) trends.excellent++;
      else if (average >= 80) trends.veryGood++;
      else if (average >= 70) trends.good++;
      else if (average >= 60) trends.average++;
      else trends.needsHelp++;
    });

    return trends;
  }

  calculateAttendanceStats(students) {
    const stats = {
      excellent: 0,    // 95%+
      good: 0,         // 85-94%
      average: 0,      // 75-84%
      poor: 0,         // <75%
      averageAttendance: 0
    };

    const totalAttendance = students.reduce((sum, student) => {
      const attendance = student.attendance || 85;
      
      if (attendance >= 95) stats.excellent++;
      else if (attendance >= 85) stats.good++;
      else if (attendance >= 75) stats.average++;
      else stats.poor++;

      return sum + attendance;
    }, 0);

    stats.averageAttendance = students.length > 0 ? totalAttendance / students.length : 0;
    
    return stats;
  }

  calculateClassAnalytics(students) {
    const classStats = {};

    students.forEach(student => {
      const className = student.class;
      if (!classStats[className]) {
        classStats[className] = {
          totalStudents: 0,
          averagePerformance: 0,
          averageAttendance: 0,
          maleCount: 0,
          femaleCount: 0,
          scores: []
        };
      }

      classStats[className].totalStudents++;
      classStats[className].scores.push(calculateAverage(student.scores));
      
      if (student.gender === 'Male') classStats[className].maleCount++;
      else classStats[className].femaleCount++;
    });

    // Calculate averages
    Object.keys(classStats).forEach(className => {
      const classData = classStats[className];
      classData.averagePerformance = classData.scores.reduce((a, b) => a + b, 0) / classData.scores.length;
      
      const classStudents = students.filter(s => s.class === className);
      const totalAttendance = classStudents.reduce((sum, s) => sum + (s.attendance || 85), 0);
      classData.averageAttendance = totalAttendance / classStudents.length;
    });

    return classStats;
  }

  calculateSubjectPerformance(students) {
    const subjectStats = {};

    students.forEach(student => {
      if (student.scores) {
        Object.entries(student.scores).forEach(([subject, scores]) => {
          if (!subjectStats[subject]) {
            subjectStats[subject] = {
              totalStudents: 0,
              totalScore: 0,
              averageScore: 0,
              grades: { A: 0, B: 0, C: 0, D: 0, E: 0 }
            };
          }

          const totalScore = calculateTotalScore(scores.classScore, scores.examScore);
          const grade = calculateGrade(totalScore);

          subjectStats[subject].totalStudents++;
          subjectStats[subject].totalScore += totalScore;
          subjectStats[subject].grades[grade]++;
        });
      }
    });

    // Calculate averages
    Object.keys(subjectStats).forEach(subject => {
      const stats = subjectStats[subject];
      stats.averageScore = stats.totalScore / stats.totalStudents;
    });

    return subjectStats;
  }

  calculateGenderAnalytics(students) {
    const genderStats = {
      Male: { count: 0, averagePerformance: 0, averageAttendance: 0, scores: [] },
      Female: { count: 0, averagePerformance: 0, averageAttendance: 0, scores: [] }
    };

    students.forEach(student => {
      const gender = student.gender || 'Male';
      genderStats[gender].count++;
      genderStats[gender].scores.push(calculateAverage(student.scores));
    });

    // Calculate averages
    ['Male', 'Female'].forEach(gender => {
      const stats = genderStats[gender];
      if (stats.count > 0) {
        stats.averagePerformance = stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length;
        
        const genderStudents = students.filter(s => s.gender === gender);
        const totalAttendance = genderStudents.reduce((sum, s) => sum + (s.attendance || 85), 0);
        stats.averageAttendance = totalAttendance / genderStudents.length;
      }
    });

    return genderStats;
  }

  getTopPerformers(students, limit = 5) {
    return students
      .map(student => ({
        ...student,
        average: calculateAverage(student.scores)
      }))
      .sort((a, b) => b.average - a.average)
      .slice(0, limit);
  }

  getStudentsAtRisk(students) {
    return students
      .filter(student => {
        const average = calculateAverage(student.scores);
        const attendance = student.attendance || 85;
        return average < 60 || attendance < 75;
      })
      .map(student => ({
        ...student,
        average: calculateAverage(student.scores),
        riskFactors: this.identifyRiskFactors(student)
      }))
      .sort((a, b) => a.average - b.average);
  }

  identifyRiskFactors(student) {
    const factors = [];
    const average = calculateAverage(student.scores);
    const attendance = student.attendance || 85;

    if (average < 50) factors.push('Critical Performance');
    else if (average < 60) factors.push('Poor Performance');

    if (attendance < 60) factors.push('Critical Attendance');
    else if (attendance < 75) factors.push('Poor Attendance');

    return factors;
  }

  renderDashboard() {
    const container = document.getElementById('analytics-dashboard');
    if (!container) return;

    container.innerHTML = `
      <div class="analytics-header">
        <h2>Performance Analytics Dashboard</h2>
        <div class="dashboard-controls">
          <button class="btn btn-secondary" onclick="analyticsManager.exportReport()">
            <i class="fas fa-download"></i> Export Report
          </button>
          <button class="btn btn-primary" onclick="analyticsManager.refreshData()">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>

      <!-- Key Performance Indicators -->
      <div class="kpi-grid">
        ${this.renderKPICards()}
      </div>

      <!-- Charts Row -->
      <div class="charts-row">
        <div class="chart-container">
          <h3>Performance Distribution</h3>
          ${this.renderPerformanceChart()}
        </div>
        <div class="chart-container">
          <h3>Attendance Overview</h3>
          ${this.renderAttendanceChart()}
        </div>
      </div>

      <!-- Class Analytics -->
      <div class="analytics-section">
        <h3>Class Performance Analysis</h3>
        ${this.renderClassAnalytics()}
      </div>

      <!-- Subject Performance -->
      <div class="analytics-section">
        <h3>Subject Performance Overview</h3>
        ${this.renderSubjectAnalytics()}
      </div>

      <!-- Top Performers & At-Risk Students -->
      <div class="students-overview">
        <div class="top-performers">
          <h3>Top Performers</h3>
          ${this.renderTopPerformers()}
        </div>
        <div class="at-risk-students">
          <h3>Students at Risk</h3>
          ${this.renderAtRiskStudents()}
        </div>
      </div>
    `;
  }

  renderKPICards() {
    const totalStudents = Object.keys(this.students).length;
    const avgPerformance = this.calculateOverallAverage();
    const avgAttendance = this.analytics.attendanceStats.averageAttendance;
    const atRiskCount = this.analytics.studentAtRisk.length;

    return `
      <div class="kpi-card">
        <div class="kpi-icon" style="background: var(--blue-xpale); color: var(--blue-main);">
          <i class="fas fa-users"></i>
        </div>
        <div class="kpi-content">
          <div class="kpi-value">${totalStudents}</div>
          <div class="kpi-label">Total Students</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon" style="background: var(--success-light); color: var(--success);">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="kpi-content">
          <div class="kpi-value">${avgPerformance.toFixed(1)}%</div>
          <div class="kpi-label">Avg Performance</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon" style="background: var(--warning-light); color: var(--warning);">
          <i class="fas fa-calendar-check"></i>
        </div>
        <div class="kpi-content">
          <div class="kpi-value">${avgAttendance.toFixed(1)}%</div>
          <div class="kpi-label">Avg Attendance</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon" style="background: var(--danger-light); color: var(--danger);">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="kpi-content">
          <div class="kpi-value">${atRiskCount}</div>
          <div class="kpi-label">Students at Risk</div>
        </div>
      </div>
    `;
  }

  calculateOverallAverage() {
    const students = Object.values(this.students);
    if (students.length === 0) return 0;

    const totalAverage = students.reduce((sum, student) => {
      return sum + calculateAverage(student.scores);
    }, 0);

    return totalAverage / students.length;
  }

  renderPerformanceChart() {
    const trends = this.analytics.performanceTrends;
    const total = Object.values(trends).reduce((a, b) => a + b, 0);

    if (total === 0) {
      return '<div class="no-data">No performance data available</div>';
    }

    return `
      <div class="chart-bars">
        <div class="chart-bar">
          <div class="bar-fill" style="height: ${(trends.excellent / total) * 100}%; background: var(--success);"></div>
          <div class="bar-label">Excellent<br>${trends.excellent}</div>
        </div>
        <div class="chart-bar">
          <div class="bar-fill" style="height: ${(trends.veryGood / total) * 100}%; background: var(--info);"></div>
          <div class="bar-label">Very Good<br>${trends.veryGood}</div>
        </div>
        <div class="chart-bar">
          <div class="bar-fill" style="height: ${(trends.good / total) * 100}%; background: var(--warning);"></div>
          <div class="bar-label">Good<br>${trends.good}</div>
        </div>
        <div class="chart-bar">
          <div class="bar-fill" style="height: ${(trends.average / total) * 100}%; background: var(--gray-400);"></div>
          <div class="bar-label">Average<br>${trends.average}</div>
        </div>
        <div class="chart-bar">
          <div class="bar-fill" style="height: ${(trends.needsHelp / total) * 100}%; background: var(--danger);"></div>
          <div class="bar-label">Needs Help<br>${trends.needsHelp}</div>
        </div>
      </div>
    `;
  }

  renderAttendanceChart() {
    const stats = this.analytics.attendanceStats;
    const total = stats.excellent + stats.good + stats.average + stats.poor;

    if (total === 0) {
      return '<div class="no-data">No attendance data available</div>';
    }

    return `
      <div class="attendance-stats">
        <div class="attendance-item">
          <div class="attendance-bar">
            <div class="attendance-fill" style="width: ${(stats.excellent / total) * 100}%; background: var(--success);"></div>
          </div>
          <div class="attendance-info">
            <span class="attendance-label">Excellent (95%+)</span>
            <span class="attendance-count">${stats.excellent} students</span>
          </div>
        </div>
        <div class="attendance-item">
          <div class="attendance-bar">
            <div class="attendance-fill" style="width: ${(stats.good / total) * 100}%; background: var(--info);"></div>
          </div>
          <div class="attendance-info">
            <span class="attendance-label">Good (85-94%)</span>
            <span class="attendance-count">${stats.good} students</span>
          </div>
        </div>
        <div class="attendance-item">
          <div class="attendance-bar">
            <div class="attendance-fill" style="width: ${(stats.average / total) * 100}%; background: var(--warning);"></div>
          </div>
          <div class="attendance-info">
            <span class="attendance-label">Average (75-84%)</span>
            <span class="attendance-count">${stats.average} students</span>
          </div>
        </div>
        <div class="attendance-item">
          <div class="attendance-bar">
            <div class="attendance-fill" style="width: ${(stats.poor / total) * 100}%; background: var(--danger);"></div>
          </div>
          <div class="attendance-info">
            <span class="attendance-label">Poor (<75%)</span>
            <span class="attendance-count">${stats.poor} students</span>
          </div>
        </div>
      </div>
    `;
  }

  renderClassAnalytics() {
    const classStats = this.analytics.classAnalytics;

    if (Object.keys(classStats).length === 0) {
      return '<div class="no-data">No class data available</div>';
    }

    return `
      <div class="class-analytics-table">
        <table class="enhanced-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Students</th>
              <th>Male/Female</th>
              <th>Avg Performance</th>
              <th>Avg Attendance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(classStats).map(([className, stats]) => `
              <tr>
                <td><strong>${className}</strong></td>
                <td>${stats.totalStudents}</td>
                <td>${stats.maleCount}M / ${stats.femaleCount}F</td>
                <td>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="prog-bar" style="width: 60px;">
                      <div class="prog-fill pf-${this.getPerformanceColor(stats.averagePerformance)}" 
                           style="width: ${stats.averagePerformance}%;"></div>
                    </div>
                    <span>${stats.averagePerformance.toFixed(1)}%</span>
                  </div>
                </td>
                <td>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="prog-bar" style="width: 60px;">
                      <div class="prog-fill pf-${this.getAttendanceColor(stats.averageAttendance)}" 
                           style="width: ${stats.averageAttendance}%;"></div>
                    </div>
                    <span>${stats.averageAttendance.toFixed(1)}%</span>
                  </div>
                </td>
                <td>
                  <span class="badge b-${this.getClassStatusColor(stats.averagePerformance, stats.averageAttendance)}">
                    ${this.getClassStatus(stats.averagePerformance, stats.averageAttendance)}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderSubjectAnalytics() {
    const subjectStats = this.analytics.subjectPerformance;

    if (Object.keys(subjectStats).length === 0) {
      return '<div class="no-data">No subject performance data available</div>';
    }

    return `
      <div class="subject-analytics-grid">
        ${Object.entries(subjectStats).map(([subject, stats]) => `
          <div class="subject-card">
            <div class="subject-header">
              <h4>${subject}</h4>
              <span class="subject-average">${stats.averageScore.toFixed(1)}%</span>
            </div>
            <div class="grade-distribution">
              ${Object.entries(stats.grades).map(([grade, count]) => `
                <div class="grade-item">
                  <span class="grade-label">${grade}</span>
                  <div class="grade-bar">
                    <div class="grade-fill" 
                         style="width: ${(count / stats.totalStudents) * 100}%; background: var(--${this.getGradeColor(grade)});">
                    </div>
                  </div>
                  <span class="grade-count">${count}</span>
                </div>
              `).join('')}
            </div>
            <div class="subject-footer">
              <small>${stats.totalStudents} students</small>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderTopPerformers() {
    const topPerformers = this.analytics.topPerformers;

    if (topPerformers.length === 0) {
      return '<div class="no-data">No performance data available</div>';
    }

    return `
      <div class="performers-list">
        ${topPerformers.map((student, index) => `
          <div class="performer-item">
            <div class="performer-rank">#${index + 1}</div>
            <div class="performer-info">
              <div class="performer-name">${student.name}</div>
              <div class="performer-class">${student.class}</div>
            </div>
            <div class="performer-score">
              <div class="score-value">${student.average.toFixed(1)}%</div>
              <div class="score-attendance">${student.attendance || 85}% attendance</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderAtRiskStudents() {
    const atRiskStudents = this.analytics.studentAtRisk;

    if (atRiskStudents.length === 0) {
      return '<div class="no-data-positive">All students are performing well! 🎉</div>';
    }

    return `
      <div class="at-risk-list">
        ${atRiskStudents.map(student => `
          <div class="at-risk-item">
            <div class="at-risk-info">
              <div class="at-risk-name">${student.name}</div>
              <div class="at-risk-class">${student.class}</div>
            </div>
            <div class="at-risk-factors">
              ${student.riskFactors.map(factor => `
                <span class="risk-factor badge b-danger">${factor}</span>
              `).join('')}
            </div>
            <div class="at-risk-scores">
              <div class="risk-score">${student.average.toFixed(1)}% avg</div>
              <div class="risk-attendance">${student.attendance || 85}% attendance</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Helper methods
  getPerformanceColor(score) {
    if (score >= 80) return 'green';
    if (score >= 70) return 'blue';
    if (score >= 60) return 'gold';
    return 'red';
  }

  getAttendanceColor(attendance) {
    if (attendance >= 90) return 'green';
    if (attendance >= 80) return 'gold';
    return 'red';
  }

  getClassStatus(performance, attendance) {
    if (performance >= 80 && attendance >= 90) return 'Excellent';
    if (performance >= 70 && attendance >= 80) return 'Good';
    if (performance >= 60 && attendance >= 70) return 'Average';
    return 'Needs Attention';
  }

  getClassStatusColor(performance, attendance) {
    if (performance >= 80 && attendance >= 90) return 'success';
    if (performance >= 70 && attendance >= 80) return 'info';
    if (performance >= 60 && attendance >= 70) return 'warning';
    return 'danger';
  }

  getGradeColor(grade) {
    const colors = { 'A': 'success', 'B': 'info', 'C': 'warning', 'D': 'gray-400', 'E': 'danger' };
    return colors[grade] || 'gray-400';
  }

  // Public methods
  refreshData() {
    LoadingManager.show(document.getElementById('analytics-dashboard'), 'Refreshing analytics...');
    
    setTimeout(() => {
      this.loadData();
      this.generateAnalytics();
      this.renderDashboard();
      LoadingManager.hide(document.getElementById('analytics-dashboard'));
      showToast('Analytics refreshed successfully!', 'success');
    }, 1000);
  }

  exportReport() {
    const report = {
      generatedAt: new Date().toISOString(),
      totalStudents: Object.keys(this.students).length,
      analytics: this.analytics
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `analytics-report-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    showToast('Analytics report exported successfully!', 'success');
  }
}

// Initialize analytics dashboard
if (typeof window !== 'undefined') {
  window.analyticsManager = new AnalyticsDashboard();
}