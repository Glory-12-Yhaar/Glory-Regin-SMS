-- ═══════════════════════════════════════════════════════════════
-- Glory Reign Preparatory School - Database Schema (DDL only)
-- Seed data is handled by setup.php
-- ═══════════════════════════════════════════════════════════════

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- (Database creation and USE handled by setup.php)

-- ───────────────────────────────────────────
-- USERS
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_code` VARCHAR(30) UNIQUE NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `username` VARCHAR(80) UNIQUE NOT NULL,
  `email` VARCHAR(180) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('Admin','Teacher','Student','Parent','Accountant','Alumni','Visitor') NOT NULL,
  `status` ENUM('Active','Inactive','Suspended','Archived') NOT NULL DEFAULT 'Active',
  `avatar` VARCHAR(20) DEFAULT NULL,
  `phone` VARCHAR(40) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `last_login` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role_status` (`role`, `status`),
  INDEX `idx_users_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────
-- CLASSES
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `classes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(80) UNIQUE NOT NULL,
  `level` VARCHAR(80) NOT NULL,
  `teacher_id` INT DEFAULT NULL,
  `class_teacher` VARCHAR(150) DEFAULT NULL,
  `capacity` INT NOT NULL DEFAULT 40,
  `stream` VARCHAR(80) NOT NULL DEFAULT 'General',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_classes_level` (`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────
-- SUBJECTS
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `subjects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `class_id` INT DEFAULT NULL,
  `icon` VARCHAR(100) DEFAULT NULL,
  `teacher_id` INT DEFAULT NULL,
  `type` ENUM('Core', 'Elective', 'Extracurricular') DEFAULT 'Core',
  `classes` VARCHAR(255) DEFAULT NULL,
  `hours` VARCHAR(80) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE,
  INDEX `idx_subjects_class` (`class_id`),
  INDEX `idx_subjects_teacher` (`teacher_id`),
  INDEX `idx_subjects_name` (`name`)
) ENGINE=InnoDB;

-- ───────────────────────────────────────────
-- STUDENTS
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `students` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_code` VARCHAR(30) UNIQUE NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `class_id` INT DEFAULT NULL,
  `stream` VARCHAR(80) NOT NULL DEFAULT 'General',
  `gender` ENUM('Male','Female') NOT NULL,
  `dob` DATE DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `photo` LONGTEXT DEFAULT NULL,
  `attendance` DECIMAL(5,2) NOT NULL DEFAULT 0,
  `status` ENUM('Active','Inactive','Suspended','Graduated','Withdrawn') NOT NULL DEFAULT 'Active',
  `user_id` INT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_students_class_status` (`class_id`, `status`),
  INDEX `idx_students_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────
-- STUDENT SCORES
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `student_scores` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `subject` VARCHAR(150) NOT NULL,
  `class_score` DECIMAL(5,2) NOT NULL DEFAULT 0,
  `exam_score` DECIMAL(5,2) NOT NULL DEFAULT 0,
  `term` VARCHAR(50) NOT NULL DEFAULT '1st Term',
  `academic_year` VARCHAR(20) NOT NULL DEFAULT '2024/2025',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uq_score` (`student_id`, `subject`, `term`, `academic_year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────
-- STAFF
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `staff` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `staff_code` VARCHAR(30) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(180) NOT NULL UNIQUE,
  `phone` VARCHAR(40) DEFAULT NULL,
  `category` ENUM('Teaching','Admin','Support') NOT NULL,
  `department` VARCHAR(120) DEFAULT NULL,
  `position` VARCHAR(120) DEFAULT NULL,
  `qualifications` TEXT DEFAULT NULL,
  `salary_grade` VARCHAR(40) DEFAULT NULL,
  `join_date` DATE DEFAULT NULL,
  `gender` ENUM('Male','Female') NOT NULL,
  `dob` DATE DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `emergency_contact` VARCHAR(150) DEFAULT NULL,
  `emergency_phone` VARCHAR(40) DEFAULT NULL,
  `performance` VARCHAR(40) DEFAULT NULL,
  `status` ENUM('Active','Inactive','On Leave','Archived') NOT NULL DEFAULT 'Active',
  `avatar` VARCHAR(20) DEFAULT NULL,
  `user_id` INT DEFAULT NULL,
  `archived_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_staff_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_staff_category_status` (`category`, `status`),
  INDEX `idx_staff_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────
-- TEACHERS (extended view of staff)
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `teachers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `staff_id` INT NOT NULL UNIQUE,
  `subject` VARCHAR(150) DEFAULT NULL,
  `class_assigned` VARCHAR(80) DEFAULT 'Not Assigned',
  `experience` INT NOT NULL DEFAULT 0,
  `schedule` TEXT DEFAULT NULL,
  `avatar_color` VARCHAR(30) DEFAULT 'blue',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────
-- PARENTS
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `parents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(180) DEFAULT NULL,
  `phone` VARCHAR(40) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `contact_person` VARCHAR(150) DEFAULT NULL,
  `gender` ENUM('Male','Female') DEFAULT NULL,
  `occupation` VARCHAR(120) DEFAULT NULL,
  `avatar_color` VARCHAR(30) DEFAULT 'gold',
  `user_id` INT DEFAULT NULL UNIQUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_parents_phone` (`phone`),
  INDEX `idx_parents_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `parent_student` (
  `parent_id` INT NOT NULL,
  `student_id` INT NOT NULL,
  `relationship` VARCHAR(80) DEFAULT 'Guardian',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`parent_id`,`student_id`),
  FOREIGN KEY (`parent_id`) REFERENCES `parents`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  INDEX `idx_parent_student_student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────
-- ASSIGNMENTS
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `assignments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `subject` VARCHAR(100),
  `class_id` INT,
  `teacher_id` INT,
  `due_date` DATE,
  `created_date` DATE,
  `max_score` INT DEFAULT 100,
  `status` ENUM('Active','Upcoming','Closed') DEFAULT 'Active',
  `instructions` TEXT,
  `attachment` VARCHAR(255),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`teacher_id`) REFERENCES `staff`(`id`) ON DELETE SET NULL,
  INDEX `idx_assignments_class_status` (`class_id`, `status`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `exams` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `subject` VARCHAR(150) NOT NULL,
  `class_id` INT NOT NULL,
  `exam_date` DATE NOT NULL,
  `duration_minutes` INT NOT NULL DEFAULT 120,
  `venue` VARCHAR(120) DEFAULT NULL,
  `invigilator_id` INT DEFAULT NULL,
  `term` VARCHAR(50) NOT NULL DEFAULT '1st Term',
  `academic_year` VARCHAR(20) NOT NULL DEFAULT '2024/2025',
  `status` ENUM('Scheduled','Completed','Cancelled') NOT NULL DEFAULT 'Scheduled',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`invigilator_id`) REFERENCES `staff`(`id`) ON DELETE SET NULL,
  INDEX `idx_exams_class_date` (`class_id`, `exam_date`),
  INDEX `idx_exams_term_year` (`term`, `academic_year`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `assignment_submissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `assignment_id` INT NOT NULL,
  `student_id` INT NOT NULL,
  `submitted_at` DATE DEFAULT NULL,
  `score` DECIMAL(5,2) DEFAULT NULL,
  `feedback` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`assignment_id`) REFERENCES `assignments`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uq_submission` (`assignment_id`, `student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────
-- FEES
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `fee_structure` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `class_id` INT NOT NULL,
  `term` VARCHAR(50) NOT NULL DEFAULT '1st Term',
  `academic_year` VARCHAR(20) NOT NULL DEFAULT '2024/2025',
  `amount` DECIMAL(10,2) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_fee_structure` (`class_id`, `term`, `academic_year`),
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `fees` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `term` VARCHAR(50) NOT NULL DEFAULT '1st Term',
  `academic_year` VARCHAR(20) NOT NULL DEFAULT '2024/2025',
  `amount_due` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `amount_paid` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `receipt_no` VARCHAR(80),
  `payment_date` DATE,
  `status` ENUM('Paid','Partial','Pending') DEFAULT 'Pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uq_fees_student_term_year` (`student_id`, `term`, `academic_year`),
  INDEX `idx_fees_term_year_status` (`term`, `academic_year`, `status`),
  INDEX `idx_fees_student` (`student_id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `term` VARCHAR(50) NOT NULL DEFAULT '1st Term',
  `academic_year` VARCHAR(20) NOT NULL DEFAULT '2024/2025',
  `payment_date` DATE NOT NULL,
  `method` ENUM('Cash','Mobile Money','Bank Transfer','Cheque') DEFAULT 'Cash',
  `receipt_no` VARCHAR(80),
  `received_by` VARCHAR(150),
  `remarks` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `uq_payments_receipt` (`receipt_no`),
  INDEX `idx_payments_date` (`payment_date`),
  INDEX `idx_payments_student` (`student_id`)
) ENGINE=InnoDB;

-- ───────────────────────────────────────────
-- EXPENSES & SALARY
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `expenses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category` VARCHAR(100),
  `description` TEXT,
  `amount` DECIMAL(10,2) NOT NULL,
  `expense_date` DATE NOT NULL,
  `recorded_by` VARCHAR(100),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `salary` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `staff_id` INT NOT NULL,
  `grade` VARCHAR(30),
  `base_salary` DECIMAL(10,2) DEFAULT 0,
  `allowances` DECIMAL(10,2) DEFAULT 0,
  `deductions` DECIMAL(10,2) DEFAULT 0,
  `net_salary` DECIMAL(10,2) DEFAULT 0,
  `pay_date` DATE,
  `term` ENUM('1st Term','2nd Term','3rd Term'),
  `academic_year` VARCHAR(20) DEFAULT '2024/2025',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ───────────────────────────────────────────
-- EVENTS
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `events` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `event_date` DATE NOT NULL,
  `event_time` TIME,
  `all_day` TINYINT(1) DEFAULT 0,
  `location` VARCHAR(255) DEFAULT NULL,
  `audience` VARCHAR(100) DEFAULT 'All',
  `description` TEXT,
  `status` ENUM('Published','Draft','Cancelled') NOT NULL DEFAULT 'Published',
  `created_by` INT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_events_date` (`event_date`),
  INDEX `idx_events_status_date` (`status`, `event_date`)
) ENGINE=InnoDB;

-- ───────────────────────────────────────────
-- NOTICES
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `notices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `icon` VARCHAR(100),
  `title` VARCHAR(200) NOT NULL,
  `audience` VARCHAR(100) DEFAULT 'All',
  `posted_by` VARCHAR(100),
  `notice_date` DATE,
  `message` TEXT,
  `priority` ENUM('Normal','Important','Urgent') DEFAULT 'Normal',
  `status` ENUM('Published','Draft','Archived') NOT NULL DEFAULT 'Published',
  `attachment` VARCHAR(255),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_notices_date` (`notice_date`),
  INDEX `idx_notices_audience` (`audience`),
  INDEX `idx_notices_status_date` (`status`, `notice_date`)
) ENGINE=InnoDB;

-- ───────────────────────────────────────────
-- MESSAGES
-- ───────────────────────────────────────────
-- ───────────────────────────────────────────
-- CONTACT MESSAGES (public)
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(180) DEFAULT NULL,
  `subject` VARCHAR(220) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `sent_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  INDEX `idx_contact_read` (`is_read`, `sent_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────
-- ALUMNI
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `alumni` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `alumni_code` VARCHAR(20) UNIQUE NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `class_year` YEAR,
  `profession` VARCHAR(100),
  `location` VARCHAR(200),
  `bio` TEXT,
  `email` VARCHAR(150),
  `phone` VARCHAR(30),
  `instagram` VARCHAR(100),
  `linkedin` VARCHAR(200),
  `twitter` VARCHAR(100),
  `facebook` VARCHAR(200),
  `avatar` VARCHAR(10),
  `avatar_color` VARCHAR(30),
  `status` ENUM('Published','Draft','Archived') NOT NULL DEFAULT 'Published',
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  `user_id` INT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_alumni_status` (`status`, `featured`)
) ENGINE=InnoDB;

-- ───────────────────────────────────────────
-- ATTENDANCE
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `attendance` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `attendance_date` DATE NOT NULL,
  `status` ENUM('Present','Absent','Late','Excused') DEFAULT 'Present',
  `remarks` VARCHAR(255),
  `recorded_by` INT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`recorded_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ───────────────────────────────────────────
-- SETTINGS
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(120) UNIQUE NOT NULL,
  `setting_value` LONGTEXT,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ───────────────────────────────────────────
-- ADMISSIONS
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `admissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `applicant_name` VARCHAR(100) NOT NULL,
  `dob` DATE,
  `gender` ENUM('Male','Female'),
  `class_applying` VARCHAR(50),
  `parent_name` VARCHAR(100),
  `parent_phone` VARCHAR(30),
  `parent_email` VARCHAR(150),
  `address` TEXT,
  `previous_school` VARCHAR(200),
  `photo` LONGTEXT,
  `status` ENUM('Pending','Approved','Rejected','Enrolled') DEFAULT 'Pending',
  `applied_date` DATE DEFAULT (CURDATE()),
  `notes` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `timetable` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `class_id` INT NOT NULL,
  `subject` VARCHAR(150) NOT NULL,
  `teacher_id` INT DEFAULT NULL,
  `day_of_week` ENUM('Monday','Tuesday','Wednesday','Thursday','Friday') NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `room` VARCHAR(80) DEFAULT NULL,
  `period_label` VARCHAR(100) DEFAULT NULL,
  `term` VARCHAR(80) NOT NULL DEFAULT 'Term 1, 2025',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`teacher_id`) REFERENCES `staff`(`id`) ON DELETE SET NULL,
  INDEX `idx_timetable_class_term` (`class_id`, `term`)
) ENGINE=InnoDB;

-- ───────────────────────────────────────────
-- HERO SLIDES
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `hero_slides` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `caption` TEXT,
  `image` LONGTEXT NOT NULL,
  `status` ENUM('Active', 'Draft') DEFAULT 'Active',
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_hero_status` (`status`),
  INDEX `idx_hero_sort` (`status`, `sort_order`)
) ENGINE=InnoDB;

-- ───────────────────────────────────────────
-- NEWS ARTICLES
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `news_articles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `icon` VARCHAR(100),
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(120),
  `date` DATE,
  `desc` TEXT,
  `content` LONGTEXT,
  `status` ENUM('Published', 'Draft') NOT NULL DEFAULT 'Published',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_news_date` (`date`),
  INDEX `idx_news_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────
-- YEARBOOKS
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `yearbooks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `year` VARCHAR(10) UNIQUE NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `cover_img` VARCHAR(255) DEFAULT '#1e3a8a',
  `pdf_url` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('Published', 'Draft') DEFAULT 'Draft',
  `total_grads` INT DEFAULT 0,
  `total_photos` INT DEFAULT 0,
  `data` LONGTEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_yearbooks_status_year` (`status`, `year`),
  INDEX `idx_yearbooks_year` (`year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────
-- SCHOLARSHIPS
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `scholarships` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `grant_type` VARCHAR(120) NOT NULL,
  `discount_value` VARCHAR(120) NOT NULL,
  `status` ENUM('Active','Pending Review','Inactive') NOT NULL DEFAULT 'Active',
  `remarks` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  INDEX `idx_scholarships_student` (`student_id`),
  INDEX `idx_scholarships_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────
-- DONATION CAMPAIGNS
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `donation_campaigns` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `goal` DECIMAL(12,2) NOT NULL DEFAULT 0,
  `status` ENUM('Active','Closed','Archived') NOT NULL DEFAULT 'Active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_dc_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────
-- DONATIONS
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `donations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `campaign_id` INT DEFAULT NULL,
  `donor_name` VARCHAR(150) NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `method` VARCHAR(80) DEFAULT 'Card',
  `status` ENUM('Completed','Pending','Refunded') NOT NULL DEFAULT 'Completed',
  `user_id` INT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`campaign_id`) REFERENCES `donation_campaigns`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_donations_campaign` (`campaign_id`),
  INDEX `idx_donations_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────
-- JOB POSTINGS
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `job_postings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `company` VARCHAR(180) DEFAULT NULL,
  `location` VARCHAR(180) DEFAULT NULL,
  `job_type` ENUM('Full-time','Part-time','Contract','Internship','Remote') NOT NULL DEFAULT 'Full-time',
  `industry` VARCHAR(120) DEFAULT NULL,
  `salary_range` VARCHAR(120) DEFAULT NULL,
  `experience` VARCHAR(120) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `status` ENUM('Open','Closed') NOT NULL DEFAULT 'Open',
  `posted_by_name` VARCHAR(150) DEFAULT NULL,
  `posted_by_class` VARCHAR(80) DEFAULT NULL,
  `user_id` INT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_jobs_status` (`status`),
  INDEX `idx_jobs_industry` (`industry`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────
-- GALLERY ALBUMS
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `gallery_albums` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(120) DEFAULT NULL,
  `year` VARCHAR(10) DEFAULT NULL,
  `item_count` INT NOT NULL DEFAULT 0,
  `icon` VARCHAR(80) DEFAULT 'fa-images',
  `bg_color` VARCHAR(120) DEFAULT 'linear-gradient(135deg, #3b82f6, #1e3a5f)',
  `cover_img` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('Published','Draft') NOT NULL DEFAULT 'Published',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_gallery_category` (`category`),
  INDEX `idx_gallery_year` (`year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────
-- ADDITIONAL RELATIONSHIPS
-- ───────────────────────────────────────────
ALTER TABLE `subjects` ADD CONSTRAINT `fk_subjects_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `staff`(`id`) ON DELETE SET NULL;
ALTER TABLE `classes` ADD CONSTRAINT `fk_classes_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `staff`(`id`) ON DELETE SET NULL;

-- ───────────────────────────────────────────
-- GALLERY ITEMS (individual photos per album)
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `gallery_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `album_id` INT NOT NULL,
  `caption` VARCHAR(255) DEFAULT NULL,
  `image` LONGTEXT NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`album_id`) REFERENCES `gallery_albums`(`id`) ON DELETE CASCADE,
  INDEX `idx_gallery_items_album` (`album_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────
-- REPORT CARDS
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `report_cards` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `class_id` INT DEFAULT NULL,
  `term` VARCHAR(50) NOT NULL DEFAULT '1st Term',
  `academic_year` VARCHAR(20) NOT NULL DEFAULT '2024/2025',
  `total_score` DECIMAL(7,2) DEFAULT 0,
  `average_score` DECIMAL(5,2) DEFAULT 0,
  `position` INT DEFAULT NULL,
  `total_in_class` INT DEFAULT NULL,
  `attendance_pct` DECIMAL(5,2) DEFAULT 0,
  `conduct` ENUM('Excellent','Very Good','Good','Fair','Poor') DEFAULT 'Good',
  `class_teacher_remarks` TEXT DEFAULT NULL,
  `head_teacher_remarks` TEXT DEFAULT NULL,
  `promoted` TINYINT(1) DEFAULT NULL,
  `next_class` VARCHAR(80) DEFAULT NULL,
  `generated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE SET NULL,
  UNIQUE KEY `uq_report_card` (`student_id`, `term`, `academic_year`),
  INDEX `idx_report_term_year` (`term`, `academic_year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ───────────────────────────────────────────
-- ALUMNI MESSAGES (internal alumni network)
-- ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `alumni_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sender_id` INT NOT NULL,
  `receiver_id` INT NOT NULL,
  `subject` VARCHAR(220) DEFAULT '(No Subject)',
  `body` TEXT NOT NULL,
  `sent_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `read_at` DATETIME DEFAULT NULL,
  FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_alumni_msg_receiver` (`receiver_id`, `sent_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- End of DDL. Seed data is inserted by setup.php.
