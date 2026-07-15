// ═══════════════════════════════════════════════════════════════
// MODERN IMPROVEMENTS FOR SCHOOL MANAGEMENT SYSTEM
// ═══════════════════════════════════════════════════════════════

// ═══════════════════ UTILITY FUNCTIONS ═══════════════════
window.appMemoryStorage = window.appMemoryStorage || (() => {
  const store = Object.create(null);
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      Object.keys(store).forEach(key => delete store[key]);
    }
  };
})();

/**
 * Debounce function for search optimization
 */
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

/**
 * Throttle function for performance optimization
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

const SafeStorage = {
  set(key, value, expiry = null) {
    return true;
  },

  get(key) {
    return null;
  },

  remove(key) {
    return true;
  },

  clear() {
    return true;
  }
};

// ═══════════════════ FORM VALIDATION SYSTEM ═══════════════════
class FormValidator {
  constructor(formElement) {
    this.form = formElement;
    this.rules = {};
    this.messages = {};
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      this.form.addEventListener('input', (e) => this.handleInput(e));
    }
  }

  addRule(fieldName, rules, messages = {}) {
    this.rules[fieldName] = rules;
    this.messages[fieldName] = messages;
    return this;
  }

  validateField(fieldName, value) {
    const rules = this.rules[fieldName];
    if (!rules) return { valid: true, message: '' };

    for (const rule of rules) {
      const result = this.applyRule(rule, value, fieldName);
      if (!result.valid) {
        return result;
      }
    }

    return { valid: true, message: '' };
  }

  applyRule(rule, value, fieldName) {
    const messages = this.messages[fieldName] || {};

    switch (rule.type) {
      case 'required':
        if (!value || value.trim() === '') {
          return { valid: false, message: messages.required || `${fieldName} is required` };
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          return { valid: false, message: messages.email || 'Please enter a valid email' };
        }
        break;

      case 'minLength':
        if (value && value.length < rule.value) {
          return { valid: false, message: messages.minLength || `Minimum ${rule.value} characters required` };
        }
        break;

      case 'maxLength':
        if (value && value.length > rule.value) {
          return { valid: false, message: messages.maxLength || `Maximum ${rule.value} characters allowed` };
        }
        break;

      case 'phone':
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        if (value && !phoneRegex.test(value)) {
          return { valid: false, message: messages.phone || 'Please enter a valid phone number' };
        }
        break;

      case 'number':
        if (value && isNaN(value)) {
          return { valid: false, message: messages.number || 'Please enter a valid number' };
        }
        break;

      case 'range':
        const num = parseFloat(value);
        if (value && (num < rule.min || num > rule.max)) {
          return { valid: false, message: messages.range || `Value must be between ${rule.min} and ${rule.max}` };
        }
        break;

      case 'custom':
        const customResult = rule.validator(value);
        if (!customResult.valid) {
          return { valid: false, message: customResult.message || messages.custom || 'Validation failed' };
        }
        break;
    }

    return { valid: true, message: '' };
  }

  handleInput(e) {
    const field = e.target;
    const fieldName = field.name || field.id;
    
    if (fieldName && this.rules[fieldName]) {
      const result = this.validateField(fieldName, field.value);
      this.showFieldValidation(field, result);
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(this.form);
    let isValid = true;
    const errors = {};

    // Validate all fields
    for (const fieldName in this.rules) {
      const value = formData.get(fieldName) || '';
      const result = this.validateField(fieldName, value);
      
      if (!result.valid) {
        isValid = false;
        errors[fieldName] = result.message;
        
        const field = this.form.querySelector(`[name="${fieldName}"], [id="${fieldName}"]`);
        if (field) {
          this.showFieldValidation(field, result);
        }
      }
    }

    if (isValid) {
      this.onSubmitSuccess(formData);
    } else {
      this.onSubmitError(errors);
    }
  }

  showFieldValidation(field, result) {
    // Remove existing error styling
    field.classList.remove('error', 'success');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }

    if (!result.valid) {
      // Add error styling
      field.classList.add('error');
      
      // Add error message
      const errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.textContent = result.message;
      field.parentNode.appendChild(errorElement);
    } else if (field.value.trim() !== '') {
      // Add success styling for non-empty valid fields
      field.classList.add('success');
    }
  }

  onSubmitSuccess(formData) {
    showToast('Form submitted successfully!', 'success');
    // Override this method in implementation
  }

  onSubmitError(errors) {
    showToast('Please fix the errors and try again', 'error');
    console.error('Form validation errors:', errors);
  }
}

// ═══════════════════ LOADING STATE MANAGER ═══════════════════
class LoadingManager {
  static show(element, message = 'Loading...') {
    if (!element) return;

    // Create loading overlay
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <div class="loading-message">${message}</div>
      </div>
    `;

    // Position overlay
    const rect = element.getBoundingClientRect();
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      border-radius: inherit;
    `;

    // Make element relative if not already positioned
    const computedStyle = getComputedStyle(element);
    if (computedStyle.position === 'static') {
      element.style.position = 'relative';
    }

    element.appendChild(overlay);
    element.setAttribute('data-loading', 'true');
  }

  static hide(element) {
    if (!element) return;

    const overlay = element.querySelector('.loading-overlay');
    if (overlay) {
      overlay.remove();
    }
    element.removeAttribute('data-loading');
  }

  static async wrap(element, asyncFunction, message = 'Loading...') {
    this.show(element, message);
    try {
      const result = await asyncFunction();
      return result;
    } catch (error) {
      console.error('Async operation failed:', error);
      showToast('Operation failed. Please try again.', 'error');
      throw error;
    } finally {
      this.hide(element);
    }
  }
}

// ═══════════════════ DATA VALIDATION & SANITIZATION ═══════════════════
class DataValidator {
  static sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/[<>]/g, '');
  }

  static sanitizeEmail(email) {
    if (typeof email !== 'string') return '';
    return email.toLowerCase().trim();
  }

  static sanitizePhone(phone) {
    if (typeof phone !== 'string') return '';
    return phone.replace(/[^\d\+\-\(\)\s]/g, '').trim();
  }

  static validateStudentId(id) {
    const pattern = /^\d{4}-\d{2,3}$/;
    return pattern.test(id);
  }

  static validateScore(score, min = 0, max = 100) {
    const num = parseFloat(score);
    return !isNaN(num) && num >= min && num <= max;
  }

  static validateDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }

  static validateClass(className) {
    const validClasses = Object.keys(SUBJECTS_BY_CLASS);
    return validClasses.includes(className);
  }
}

// ═══════════════════ ENHANCED SEARCH FUNCTIONALITY ═══════════════════
class SmartSearch {
  constructor(data, options = {}) {
    this.data = data;
    this.options = {
      keys: options.keys || [],
      threshold: options.threshold || 0.3,
      caseSensitive: options.caseSensitive || false,
      includeScore: options.includeScore || false,
      ...options
    };
    this.debouncedSearch = debounce(this.performSearch.bind(this), 300);
  }

  search(query, limit = 50) {
    if (!query || query.trim() === '') {
      return this.data;
    }

    const results = this.performSearch(query.trim());
    return limit ? results.slice(0, limit) : results;
  }

  performSearch(query) {
    const searchTerms = query.toLowerCase().split(/\s+/);
    const results = [];

    for (const item of this.data) {
      let score = 0;
      let matches = 0;

      for (const term of searchTerms) {
        const itemScore = this.scoreItem(item, term);
        if (itemScore > 0) {
          matches++;
          score += itemScore;
        }
      }

      if (matches === searchTerms.length) {
        results.push({
          item: item,
          score: score / searchTerms.length
        });
      }
    }

    // Sort by score (highest first)
    results.sort((a, b) => b.score - a.score);

    return this.options.includeScore ? results : results.map(r => r.item);
  }

  scoreItem(item, term) {
    let maxScore = 0;

    for (const key of this.options.keys) {
      const value = this.getNestedValue(item, key);
      if (value) {
        const stringValue = String(value).toLowerCase();
        const score = this.calculateStringScore(stringValue, term);
        maxScore = Math.max(maxScore, score);
      }
    }

    return maxScore;
  }

  calculateStringScore(text, term) {
    if (text.includes(term)) {
      // Exact match gets highest score
      if (text === term) return 1.0;
      
      // Word boundary match gets high score
      const wordBoundaryRegex = new RegExp(`\\b${term}\\b`);
      if (wordBoundaryRegex.test(text)) return 0.9;
      
      // Starts with term gets good score
      if (text.startsWith(term)) return 0.8;
      
      // Contains term gets moderate score
      return 0.6;
    }

    // Fuzzy matching for typos
    const distance = this.levenshteinDistance(text, term);
    const maxLength = Math.max(text.length, term.length);
    const similarity = 1 - (distance / maxLength);
    
    return similarity > this.options.threshold ? similarity * 0.5 : 0;
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

// ═══════════════════ PAGINATION SYSTEM ═══════════════════
class Paginator {
  constructor(data, itemsPerPage = 10) {
    this.data = data;
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.totalPages = Math.ceil(data.length / itemsPerPage);
  }

  getCurrentPageData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.data.slice(startIndex, endIndex);
  }

  goToPage(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      return true;
    }
    return false;
  }

  nextPage() {
    return this.goToPage(this.currentPage + 1);
  }

  previousPage() {
    return this.goToPage(this.currentPage - 1);
  }

  updateData(newData) {
    this.data = newData;
    this.totalPages = Math.ceil(newData.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  getPageInfo() {
    const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
    const endItem = Math.min(this.currentPage * this.itemsPerPage, this.data.length);
    
    return {
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      totalItems: this.data.length,
      startItem: startItem,
      endItem: endItem,
      hasNext: this.currentPage < this.totalPages,
      hasPrevious: this.currentPage > 1
    };
  }

  renderPagination(containerId, onPageChange) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const info = this.getPageInfo();
    
    container.innerHTML = `
      <div class="pagination-wrapper">
        <div class="pagination-info">
          Showing ${info.startItem}-${info.endItem} of ${info.totalItems} items
        </div>
        <div class="pagination-controls">
          <button class="page-btn" ${!info.hasPrevious ? 'disabled' : ''} onclick="paginator.previousPage() && ${onPageChange}()">
            <i class="fas fa-chevron-left"></i>
          </button>
          
          ${this.renderPageNumbers(onPageChange)}
          
          <button class="page-btn" ${!info.hasNext ? 'disabled' : ''} onclick="paginator.nextPage() && ${onPageChange}()">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    `;
  }

  renderPageNumbers(onPageChange) {
    const info = this.getPageInfo();
    let pages = '';
    
    // Always show first page
    if (info.totalPages > 0) {
      pages += `<button class="page-num ${info.currentPage === 1 ? 'active' : ''}" onclick="paginator.goToPage(1) && ${onPageChange}()">1</button>`;
    }
    
    // Show ellipsis if needed
    if (info.currentPage > 3) {
      pages += '<span class="page-ellipsis">...</span>';
    }
    
    // Show pages around current page
    const start = Math.max(2, info.currentPage - 1);
    const end = Math.min(info.totalPages - 1, info.currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== info.totalPages) {
        pages += `<button class="page-num ${info.currentPage === i ? 'active' : ''}" onclick="paginator.goToPage(${i}) && ${onPageChange}()">${i}</button>`;
      }
    }
    
    // Show ellipsis if needed
    if (info.currentPage < info.totalPages - 2) {
      pages += '<span class="page-ellipsis">...</span>';
    }
    
    // Always show last page
    if (info.totalPages > 1) {
      pages += `<button class="page-num ${info.currentPage === info.totalPages ? 'active' : ''}" onclick="paginator.goToPage(${info.totalPages}) && ${onPageChange}()">${info.totalPages}</button>`;
    }
    
    return pages;
  }
}

// Export for use in other files
if (typeof window !== 'undefined') {
  window.FormValidator = FormValidator;
  window.LoadingManager = LoadingManager;
  window.DataValidator = DataValidator;
  window.SmartSearch = SmartSearch;
  window.Paginator = Paginator;
  window.SafeStorage = SafeStorage;
  window.debounce = debounce;
  window.throttle = throttle;
}
