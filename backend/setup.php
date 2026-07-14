<?php
/**
 * Glory Reign School - destructive database rebuild setup.
 *
 * This script drops and recreates DB_NAME, then creates all tables,
 * relationships, indexes, and baseline seed data expected by backend/api.
 * Run it intentionally, then delete it from production.
 */

declare(strict_types=1);

define('DB_HOST', 'localhost');
define('DB_NAME', 'glory_regin_school');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

$log = [];
$counts = [];

function ok(string $message): void
{
    global $log;
    $log[] = ['ok', $message];
}

function fail_log(string $message): void
{
    global $log;
    $log[] = ['err', $message];
}

function execStatements(PDO $pdo, array $statements, string $label): void
{
    foreach ($statements as $statement) {
        $pdo->exec($statement);
    }
    ok($label . ': ' . count($statements) . ' statements executed.');
}

function insertRows(PDO $pdo, string $sql, array $rows): void
{
    $stmt = $pdo->prepare($sql);
    foreach ($rows as $row) {
        $stmt->execute($row);
    }
}

try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';charset=' . DB_CHARSET,
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

    ok('Connected to MySQL.');

    $pdo->exec('SET FOREIGN_KEY_CHECKS = 0');
    $pdo->exec('DROP DATABASE IF EXISTS `' . DB_NAME . '`');
    $pdo->exec('CREATE DATABASE `' . DB_NAME . '` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    $pdo->exec('USE `' . DB_NAME . '`');
    $pdo->exec('SET FOREIGN_KEY_CHECKS = 1');
    ok('Database dropped and recreated: ' . DB_NAME);

    $ddl = [
        <<<'SQL'
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_code VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  username VARCHAR(80) NOT NULL UNIQUE,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('Admin','Teacher','Student','Parent','Accountant','Alumni','Visitor') NOT NULL,
  status ENUM('Active','Inactive','Suspended','Archived') NOT NULL DEFAULT 'Active',
  avatar VARCHAR(20) DEFAULT NULL,
  phone VARCHAR(40) DEFAULT NULL,
  address TEXT DEFAULT NULL,
  last_login DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role_status (role, status),
  INDEX idx_users_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_code VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  phone VARCHAR(40) DEFAULT NULL,
  category ENUM('Teaching','Admin','Support') NOT NULL,
  department VARCHAR(120) DEFAULT NULL,
  position VARCHAR(120) DEFAULT NULL,
  qualifications TEXT DEFAULT NULL,
  salary_grade VARCHAR(40) DEFAULT NULL,
  join_date DATE DEFAULT NULL,
  gender ENUM('Male','Female') NOT NULL,
  dob DATE DEFAULT NULL,
  address TEXT DEFAULT NULL,
  emergency_contact VARCHAR(150) DEFAULT NULL,
  emergency_phone VARCHAR(40) DEFAULT NULL,
  performance VARCHAR(40) DEFAULT NULL,
  status ENUM('Active','Inactive','On Leave','Archived') NOT NULL DEFAULT 'Active',
  avatar VARCHAR(20) DEFAULT NULL,
  user_id INT DEFAULT NULL,
  archived_at DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_staff_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_staff_category_status (category, status),
  INDEX idx_staff_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  level VARCHAR(80) NOT NULL,
  teacher_id INT DEFAULT NULL,
  class_teacher VARCHAR(150) DEFAULT NULL,
  capacity INT NOT NULL DEFAULT 40,
  stream VARCHAR(80) NOT NULL DEFAULT 'General',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_classes_teacher FOREIGN KEY (teacher_id) REFERENCES staff(id) ON DELETE SET NULL,
  INDEX idx_classes_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  class_id INT DEFAULT NULL,
  icon VARCHAR(100) DEFAULT NULL,
  teacher_id INT DEFAULT NULL,
  type ENUM('Core','Elective','Extracurricular') NOT NULL DEFAULT 'Core',
  classes VARCHAR(255) DEFAULT NULL,
  hours VARCHAR(80) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_subjects_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  CONSTRAINT fk_subjects_teacher FOREIGN KEY (teacher_id) REFERENCES staff(id) ON DELETE SET NULL,
  INDEX idx_subjects_class (class_id),
  INDEX idx_subjects_teacher (teacher_id),
  INDEX idx_subjects_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_code VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  class_id INT DEFAULT NULL,
  stream VARCHAR(80) NOT NULL DEFAULT 'General',
  gender ENUM('Male','Female') NOT NULL,
  dob DATE DEFAULT NULL,
  address TEXT DEFAULT NULL,
  photo LONGTEXT DEFAULT NULL,
  attendance DECIMAL(5,2) NOT NULL DEFAULT 0,
  status ENUM('Active','Inactive','Suspended','Graduated','Withdrawn') NOT NULL DEFAULT 'Active',
  user_id INT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_students_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
  CONSTRAINT fk_students_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_students_class_status (class_id, status),
  INDEX idx_students_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE parents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(180) DEFAULT NULL,
  phone VARCHAR(40) DEFAULT NULL,
  address TEXT DEFAULT NULL,
  contact_person VARCHAR(150) DEFAULT NULL,
  gender ENUM('Male','Female') DEFAULT NULL,
  occupation VARCHAR(120) DEFAULT NULL,
  avatar_color VARCHAR(30) DEFAULT 'gold',
  user_id INT DEFAULT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_parents_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_parents_phone (phone),
  INDEX idx_parents_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE parent_student (
  parent_id INT NOT NULL,
  student_id INT NOT NULL,
  relationship VARCHAR(80) DEFAULT 'Guardian',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (parent_id, student_id),
  CONSTRAINT fk_parent_student_parent FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE CASCADE,
  CONSTRAINT fk_parent_student_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  INDEX idx_parent_student_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT NOT NULL UNIQUE,
  subject VARCHAR(150) DEFAULT NULL,
  class_assigned VARCHAR(80) DEFAULT 'Not Assigned',
  experience INT NOT NULL DEFAULT 0,
  schedule TEXT DEFAULT NULL,
  avatar_color VARCHAR(30) DEFAULT 'blue',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_teachers_staff FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE student_scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  subject VARCHAR(150) NOT NULL,
  class_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  exam_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  term VARCHAR(50) NOT NULL DEFAULT '1st Term',
  academic_year VARCHAR(20) NOT NULL DEFAULT '2024/2025',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_scores_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY uq_score (student_id, subject, term, academic_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(220) NOT NULL,
  subject VARCHAR(150) DEFAULT NULL,
  class_id INT DEFAULT NULL,
  teacher_id INT DEFAULT NULL,
  due_date DATE DEFAULT NULL,
  created_date DATE DEFAULT NULL,
  max_score INT NOT NULL DEFAULT 100,
  status ENUM('Active','Upcoming','Closed') NOT NULL DEFAULT 'Active',
  instructions TEXT DEFAULT NULL,
  attachment VARCHAR(255) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_assignments_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL,
  CONSTRAINT fk_assignments_teacher FOREIGN KEY (teacher_id) REFERENCES staff(id) ON DELETE SET NULL,
  INDEX idx_assignments_class_status (class_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE exams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject VARCHAR(150) NOT NULL,
  class_id INT NOT NULL,
  exam_date DATE NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 120,
  venue VARCHAR(120) DEFAULT NULL,
  invigilator_id INT DEFAULT NULL,
  term VARCHAR(50) NOT NULL DEFAULT '1st Term',
  academic_year VARCHAR(20) NOT NULL DEFAULT '2024/2025',
  status ENUM('Scheduled','Completed','Cancelled') NOT NULL DEFAULT 'Scheduled',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_exams_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  CONSTRAINT fk_exams_invigilator FOREIGN KEY (invigilator_id) REFERENCES staff(id) ON DELETE SET NULL,
  INDEX idx_exams_class_date (class_id, exam_date),
  INDEX idx_exams_term_year (term, academic_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE assignment_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assignment_id INT NOT NULL,
  student_id INT NOT NULL,
  submitted_at DATE DEFAULT NULL,
  score DECIMAL(5,2) DEFAULT NULL,
  feedback TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_submissions_assignment FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  CONSTRAINT fk_submissions_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY uq_submission (assignment_id, student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE fees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  term VARCHAR(50) NOT NULL DEFAULT '1st Term',
  academic_year VARCHAR(20) NOT NULL DEFAULT '2024/2025',
  amount_due DECIMAL(10,2) NOT NULL DEFAULT 0,
  amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
  receipt_no VARCHAR(80) DEFAULT NULL,
  payment_date DATE DEFAULT NULL,
  status ENUM('Paid','Partial','Pending') NOT NULL DEFAULT 'Pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_fees_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY uq_fees_student_term_year (student_id, term, academic_year),
  INDEX idx_fees_term_year_status (term, academic_year, status),
  INDEX idx_fees_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE fee_structure (
  id INT AUTO_INCREMENT PRIMARY KEY,
  class_id INT NOT NULL,
  term VARCHAR(50) NOT NULL DEFAULT '1st Term',
  academic_year VARCHAR(20) NOT NULL DEFAULT '2024/2025',
  amount DECIMAL(10,2) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_fee_structure_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  UNIQUE KEY uq_fee_structure (class_id, term, academic_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  term VARCHAR(50) NOT NULL DEFAULT '1st Term',
  academic_year VARCHAR(20) NOT NULL DEFAULT '2024/2025',
  payment_date DATE NOT NULL,
  method ENUM('Cash','Mobile Money','Bank Transfer','Cheque') NOT NULL DEFAULT 'Cash',
  receipt_no VARCHAR(80) DEFAULT NULL UNIQUE,
  received_by VARCHAR(150) DEFAULT NULL,
  remarks TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  INDEX idx_payments_date (payment_date),
  INDEX idx_payments_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(120) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  amount DECIMAL(10,2) NOT NULL,
  expense_date DATE NOT NULL,
  recorded_by VARCHAR(150) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_expenses_date (expense_date),
  INDEX idx_expenses_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE salary (
  id INT AUTO_INCREMENT PRIMARY KEY,
  staff_id INT NOT NULL,
  grade VARCHAR(40) DEFAULT NULL,
  base_salary DECIMAL(10,2) NOT NULL DEFAULT 0,
  allowances DECIMAL(10,2) NOT NULL DEFAULT 0,
  deductions DECIMAL(10,2) NOT NULL DEFAULT 0,
  net_salary DECIMAL(10,2) NOT NULL DEFAULT 0,
  pay_date DATE DEFAULT NULL,
  term VARCHAR(50) DEFAULT '1st Term',
  academic_year VARCHAR(20) DEFAULT '2024/2025',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_salary_staff FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
  INDEX idx_salary_pay_date (pay_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  attendance_date DATE NOT NULL,
  status ENUM('Present','Absent','Late','Excused') NOT NULL DEFAULT 'Present',
  remarks VARCHAR(255) DEFAULT NULL,
  recorded_by INT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  CONSTRAINT fk_attendance_recorded_by FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY uq_attendance (student_id, attendance_date),
  INDEX idx_attendance_date (attendance_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE timetable (
  id INT AUTO_INCREMENT PRIMARY KEY,
  class_id INT NOT NULL,
  subject VARCHAR(150) NOT NULL,
  teacher_id INT DEFAULT NULL,
  day_of_week ENUM('Monday','Tuesday','Wednesday','Thursday','Friday') NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room VARCHAR(80) DEFAULT NULL,
  period_label VARCHAR(100) DEFAULT NULL,
  term VARCHAR(80) NOT NULL DEFAULT 'Term 1, 2025',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_timetable_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  CONSTRAINT fk_timetable_teacher FOREIGN KEY (teacher_id) REFERENCES staff(id) ON DELETE SET NULL,
  INDEX idx_timetable_class_term (class_id, term)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(220) NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME DEFAULT NULL,
  all_day TINYINT(1) NOT NULL DEFAULT 0,
  location VARCHAR(255) DEFAULT NULL,
  audience VARCHAR(120) NOT NULL DEFAULT 'All',
  description TEXT DEFAULT NULL,
  status ENUM('Published','Draft','Cancelled') NOT NULL DEFAULT 'Published',
  created_by INT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_events_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_events_date (event_date),
  INDEX idx_events_status_date (status, event_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE notices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(100) DEFAULT NULL,
  title VARCHAR(220) NOT NULL,
  audience VARCHAR(120) NOT NULL DEFAULT 'All',
  posted_by VARCHAR(150) DEFAULT NULL,
  notice_date DATE DEFAULT NULL,
  message TEXT DEFAULT NULL,
  priority ENUM('Normal','Important','Urgent') NOT NULL DEFAULT 'Normal',
  attachment VARCHAR(255) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_notices_date (notice_date),
  INDEX idx_notices_audience (audience)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  subject VARCHAR(220) DEFAULT NULL,
  body TEXT NOT NULL,
  sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at DATETIME DEFAULT NULL,
  CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_messages_receiver FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_messages_sender (sender_id, sent_at),
  INDEX idx_messages_receiver (receiver_id, sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(180) DEFAULT NULL,
  subject VARCHAR(220) DEFAULT NULL,
  message TEXT NOT NULL,
  sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  INDEX idx_contact_read (is_read, sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE alumni (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alumni_code VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  class_year YEAR DEFAULT NULL,
  profession VARCHAR(150) DEFAULT NULL,
  location VARCHAR(220) DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  email VARCHAR(180) DEFAULT NULL,
  phone VARCHAR(40) DEFAULT NULL,
  instagram VARCHAR(120) DEFAULT NULL,
  linkedin VARCHAR(220) DEFAULT NULL,
  twitter VARCHAR(120) DEFAULT NULL,
  facebook VARCHAR(220) DEFAULT NULL,
  avatar VARCHAR(20) DEFAULT NULL,
  avatar_color VARCHAR(30) DEFAULT NULL,
  user_id INT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_alumni_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_alumni_year (class_year),
  INDEX idx_alumni_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(120) NOT NULL UNIQUE,
  setting_value TEXT DEFAULT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE admissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  applicant_name VARCHAR(150) NOT NULL,
  dob DATE DEFAULT NULL,
  gender ENUM('Male','Female') DEFAULT NULL,
  class_applying VARCHAR(80) DEFAULT NULL,
  parent_name VARCHAR(150) DEFAULT NULL,
  parent_phone VARCHAR(40) DEFAULT NULL,
  parent_email VARCHAR(180) DEFAULT NULL,
  address TEXT DEFAULT NULL,
  previous_school VARCHAR(220) DEFAULT NULL,
  photo LONGTEXT DEFAULT NULL,
  status ENUM('Pending','Approved','Rejected','Enrolled') NOT NULL DEFAULT 'Pending',
  applied_date DATE NOT NULL DEFAULT (CURRENT_DATE),
  notes TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_admissions_status (status),
  INDEX idx_admissions_applicant (applicant_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE hero_slides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  caption TEXT DEFAULT NULL,
  image LONGTEXT NOT NULL,
  status ENUM('Active','Draft') NOT NULL DEFAULT 'Active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_hero_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE news_articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(100) DEFAULT NULL,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(120) DEFAULT NULL,
  date DATE DEFAULT NULL,
  `desc` TEXT DEFAULT NULL,
  status ENUM('Published','Draft') NOT NULL DEFAULT 'Published',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_news_date (date),
  INDEX idx_news_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
        <<<'SQL'
CREATE TABLE yearbooks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  year VARCHAR(10) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  cover_img VARCHAR(255) DEFAULT '#1e3a8a',
  status ENUM('Published','Draft') NOT NULL DEFAULT 'Draft',
  total_grads INT NOT NULL DEFAULT 0,
  total_photos INT NOT NULL DEFAULT 0,
  data LONGTEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
SQL,
    ];

    execStatements($pdo, $ddl, 'DDL');

    $passwordOptions = ['cost' => 10];
    insertRows($pdo, "INSERT INTO users (user_code,name,username,email,password_hash,role,status,avatar,phone,address) VALUES (?,?,?,?,?,?,?,?,?,?)", [
        ['user001', 'System Admin', 'admin', 'admin@gloryreign.edu.gh', password_hash('admin123', PASSWORD_BCRYPT, $passwordOptions), 'Admin', 'Active', 'SA', '+233 24 000 0000', 'Jirapa, Upper West Region'],
        ['user002', 'Mr. Kweku Amponsah', 'k.amponsah', 'k.amponsah@gloryreign.edu.gh', password_hash('teacher123', PASSWORD_BCRYPT, $passwordOptions), 'Teacher', 'Active', 'KA', '+233 24 100 0001', 'Accra'],
        ['user003', 'Ama Serwaa', 'ama.serwaa', 'ama@student.gloryreign.edu.gh', password_hash('student123', PASSWORD_BCRYPT, $passwordOptions), 'Student', 'Active', 'AS', null, null],
        ['user004', 'Mr. Kojo Mensah', 'k.accountant', 'accountant@gloryreign.edu.gh', password_hash('acct123', PASSWORD_BCRYPT, $passwordOptions), 'Accountant', 'Active', 'KM', '+233 24 100 0003', 'Accra'],
        ['user005', 'Mr. Serwaa', 'serwaa.parent', 'parent@gloryreign.edu.gh', password_hash('parent123', PASSWORD_BCRYPT, $passwordOptions), 'Parent', 'Active', 'SP', '0241234567', 'Jirapa, Upper West'],
        ['user006', 'Abena Owusu', 'abena.alumni', 'abena.owusu@gmail.com', password_hash('alumni123', PASSWORD_BCRYPT, $passwordOptions), 'Alumni', 'Active', 'AO', '+233 24 111 0001', 'Accra'],
    ]);
    ok('Seeded users.');

    insertRows($pdo, "INSERT INTO staff (staff_code,name,email,phone,category,department,position,qualifications,salary_grade,join_date,gender,dob,address,emergency_contact,emergency_phone,performance,status,avatar,user_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [
        ['KWA001','Mr. Kweku Amponsah','kweku.amponsah@gloryreign.edu.gh','+233 24 100 0001','Teaching','Mathematics','Senior Teacher','B.Sc Mathematics, Diploma in Education','Grade 8','2013-01-15','Male','1985-05-22','123 Education Street, Accra','Ama Amponsah','+233 244 567 890','4.8/5','Active','KA',2],
        ['AKA002','Mrs. Akua Asante','akua.asante@gloryreign.edu.gh','+233 24 100 0002','Teaching','Languages','Senior Teacher','B.A English, Diploma in Education','Grade 7','2017-03-10','Female','1988-07-14','456 Learning Street, Accra','Kwame Asante','+233 245 678 901','4.6/5','Active','AA',null],
        ['KMN003','Mr. Kojo Mensah','kojo.mensah@gloryreign.edu.gh','+233 24 100 0003','Admin','Finance','Accounts Officer','HND Accounting','Admin A','2015-06-20','Male','1982-09-03','789 Finance Lane, Accra','Abena Mensah','+233 246 789 012','4.5/5','Active','KM',4],
        ['FPA004','Ms. Freda Poku','freda.poku@gloryreign.edu.gh','+233 24 100 0004','Teaching','ICT','Teacher','B.Tech ICT','Grade 6','2019-08-25','Female','1992-04-18','987 Tech Street, Accra','Ernest Poku','+233 249 012 345','4.7/5','Active','FP',null],
        ['NYS005','Mrs. Nana Yaa Sekyere','nana.sekyere@gloryreign.edu.gh','+233 24 100 0005','Teaching','Science','Science Coordinator','B.Sc Biology, Diploma in Education','Grade 7','2014-02-01','Female','1987-06-09','357 Science Park, Accra','Samuel Sekyere','+233 241 234 567','4.8/5','Active','NS',null],
        ['RSO006','Ms. Rose Sarbah','rose.sarbah@gloryreign.edu.gh','+233 24 100 0006','Admin','Registrar','Registrar','Diploma in Educational Management','Admin A','2012-08-20','Female','1981-10-05','852 Admin Street, Accra','Daniel Sarbah','+233 243 456 789','4.9/5','Active','RS',null],
    ]);
    ok('Seeded staff.');

    insertRows($pdo, "INSERT INTO classes (name,level,teacher_id,class_teacher,capacity,stream) VALUES (?,?,?,?,?,?)", [
        ['Creche','Early Childhood',null,'Ms. Doe',30,'General'],
        ['Nursery','Early Childhood',null,'Ms. Amoah',30,'General'],
        ['KG 1','Early Childhood',null,'Ms. Boateng',30,'General'],
        ['KG 2','Early Childhood',null,'Mrs. Darko',30,'General'],
        ['Basic 1','Primary',null,'Mr. Quaye',40,'General'],
        ['Basic 2','Primary',null,'Mrs. Brew',40,'General'],
        ['Basic 3','Primary',null,'Mr. Nkrumah',40,'General'],
        ['Basic 4','Primary',5,'Mrs. Nana Yaa Sekyere',40,'General'],
        ['Basic 5','Primary',4,'Ms. Freda Poku',40,'General'],
        ['Basic 6','Primary',null,'Mr. Boateng Sr.',40,'General'],
        ['JHS 1','Junior High',1,'Mr. Kweku Amponsah',45,'General'],
        ['JHS 2','Junior High',2,'Mrs. Akua Asante',45,'General'],
        ['JHS 3','Junior High',1,'Mr. Kweku Amponsah',45,'General'],
    ]);
    ok('Seeded classes.');

    insertRows($pdo, "INSERT INTO teachers (staff_id,subject,class_assigned,experience,schedule,avatar_color) VALUES (?,?,?,?,?,?)", [
        [1,'Mathematics','JHS 1',13,'Mon-Fri','blue'],
        [2,'English','JHS 2',9,'Mon-Fri','green'],
        [4,'ICT','Basic 5',7,'Mon-Fri','purple'],
        [5,'Science','Basic 4',12,'Mon-Fri','teal'],
    ]);
    ok('Seeded teacher profiles.');

    $subjectSeed = [
        [11,'Mathematics',1,'Core','JHS 1-3','5 hrs/week'],
        [11,'English',2,'Core','JHS 1-3','5 hrs/week'],
        [11,'Science',5,'Core','JHS 1-3','4 hrs/week'],
        [11,'Computing',4,'Core','JHS 1-3','3 hrs/week'],
        [9,'Mathematics',1,'Core','Basic 4-6','5 hrs/week'],
        [9,'ICT',4,'Core','Basic 4-6','3 hrs/week'],
        [8,'Science',5,'Core','Basic 4-6','4 hrs/week'],
    ];
    $subjectStmt = $pdo->prepare("INSERT INTO subjects (class_id,name,teacher_id,type,classes,hours,icon,description) VALUES (?,?,?,?,?,?,?,?)");
    foreach ($subjectSeed as [$classId, $name, $teacherId, $type, $classes, $hours]) {
        $subjectStmt->execute([$classId, $name, $teacherId, $type, $classes, $hours, '<i class=\"fas fa-book\"></i>', $name . ' curriculum']);
    }
    ok('Seeded subjects.');

    insertRows($pdo, "INSERT INTO students (student_code,name,class_id,stream,gender,dob,attendance,status,user_id) VALUES (?,?,?,?,?,?,?,?,?)", [
        ['2024-38','Ama Serwaa',11,'General','Female','2010-05-15',92.00,'Active',3],
        ['2024-39','Akosua Darko',11,'General','Female','2010-01-12',97.00,'Active',null],
        ['2024-41','Kwame Asante',10,'General','Male','2011-03-22',88.00,'Active',null],
        ['2024-42','Abena Mensah',10,'General','Female','2011-07-10',95.00,'Active',null],
        ['2024-43','Kofi Boateng',10,'General','Male','2011-09-18',81.00,'Active',null],
        ['2024-44','Yaw Mensah',9,'General','Male','2011-11-08',90.00,'Active',null],
        ['2024-45','Adwoa Frimpong',9,'General','Female','2011-04-20',93.00,'Active',null],
        ['2024-46','Kweku Ofori',12,'General','Male','2009-12-05',79.00,'Active',null],
    ]);
    ok('Seeded students.');

    insertRows($pdo, "INSERT INTO parents (name,email,phone,address,contact_person,gender,occupation,avatar_color,user_id) VALUES (?,?,?,?,?,?,?,?,?)", [
        ['Mr. Serwaa','parent@gloryreign.edu.gh','0241234567','Jirapa, Upper West','Mr. Serwaa','Male','Business','gold',5],
        ['Mrs. Darko','darko.parent@example.com','0245556789','Wa, Upper West','Mrs. Darko','Female','Nurse','purple',null],
    ]);
    insertRows($pdo, "INSERT INTO parent_student (parent_id,student_id,relationship) VALUES (?,?,?)", [
        [1,1,'Father'],
        [2,2,'Mother'],
    ]);
    ok('Seeded parents and links.');

    insertRows($pdo, "INSERT INTO student_scores (student_id,subject,class_score,exam_score,term,academic_year) VALUES (?,?,?,?,?,?)", [
        [1,'Mathematics',45,39,'1st Term','2024/2025'],
        [1,'English',48,42,'1st Term','2024/2025'],
        [1,'Science',46,44,'1st Term','2024/2025'],
        [2,'Mathematics',49,48,'1st Term','2024/2025'],
        [2,'English',50,48,'1st Term','2024/2025'],
        [3,'Mathematics',35,32,'1st Term','2024/2025'],
        [4,'Mathematics',48,43,'1st Term','2024/2025'],
        [5,'Science',35,32,'1st Term','2024/2025'],
    ]);
    ok('Seeded scores.');

    insertRows($pdo, "INSERT INTO exams (subject,class_id,exam_date,duration_minutes,venue,invigilator_id,term,academic_year,status) VALUES (?,?,?,?,?,?,?,?,?)", [
        ['Mathematics',11,'2025-04-01',120,'Hall A',1,'1st Term','2024/2025','Scheduled'],
        ['English',11,'2025-04-02',120,'Hall A',2,'1st Term','2024/2025','Scheduled'],
        ['Science',11,'2025-04-03',90,'Hall A',5,'1st Term','2024/2025','Scheduled'],
        ['Mathematics',10,'2025-04-01',120,'Classroom',1,'1st Term','2024/2025','Scheduled'],
        ['Science',9,'2025-04-03',90,'Classroom',5,'1st Term','2024/2025','Scheduled'],
    ]);
    ok('Seeded exams.');

    insertRows($pdo, "INSERT INTO fees (student_id,term,academic_year,amount_due,amount_paid,receipt_no,payment_date,status) VALUES (?,?,?,?,?,?,?,?)", [
        [1,'1st Term','2024/2025',2500,2500,'RCP-0038','2025-01-10','Paid'],
        [2,'1st Term','2024/2025',2500,2500,'RCP-0039','2025-01-09','Paid'],
        [3,'1st Term','2024/2025',2300,2300,'RCP-0041','2025-01-08','Paid'],
        [4,'1st Term','2024/2025',2300,1500,'RCP-0042','2025-01-11','Partial'],
        [5,'1st Term','2024/2025',2300,0,null,null,'Pending'],
        [8,'1st Term','2024/2025',2700,1000,'RCP-0046','2025-01-12','Partial'],
    ]);
    insertRows($pdo, "INSERT INTO payments (student_id,amount,term,academic_year,payment_date,method,receipt_no,received_by,remarks) VALUES (?,?,?,?,?,?,?,?,?)", [
        [1,2500,'1st Term','2024/2025','2025-01-10','Cash','RCP-0038','Mr. Kojo Mensah','Full payment'],
        [4,1500,'1st Term','2024/2025','2025-01-11','Mobile Money','RCP-0042','Mr. Kojo Mensah','Part payment'],
        [8,1000,'1st Term','2024/2025','2025-01-12','Cash','RCP-0046','Mr. Kojo Mensah','Part payment'],
    ]);
    ok('Seeded fees and payments.');

    insertRows($pdo, "INSERT INTO fee_structure (class_id,term,academic_year,amount) VALUES (?,?,?,?)", [
        [11,'1st Term','2024/2025',2500],
        [10,'1st Term','2024/2025',2300],
        [9,'1st Term','2024/2025',2300],
        [12,'1st Term','2024/2025',2700],
    ]);

    insertRows($pdo, "INSERT INTO events (title,event_date,event_time,all_day,location,audience,description,status,created_by) VALUES (?,?,?,?,?,?,?,?,?)", [
        ['End of Term Exams','2026-08-21','08:00:00',1,'School Campus','All','Final exams for all classes.','Published',1],
        ['PTA Meeting','2026-08-28','14:00:00',0,'School Hall','Parents','Parents and Teachers Association meeting.','Published',1],
        ['Sports Day','2026-09-05','08:00:00',1,'Sports Field','All','Annual inter-house sports competition.','Published',1],
    ]);
    insertRows($pdo, "INSERT INTO notices (icon,title,audience,posted_by,notice_date,message,priority,attachment) VALUES (?,?,?,?,?,?,?,?)", [
        ['<i class=\"fas fa-file-alt\"></i>','End of Term Examination Timetable','All','Admin','2025-03-10','The end of term examination timetable is now available.','Important',null],
        ['<i class=\"fas fa-money-bill\"></i>','Fees Payment Deadline','Parents','Accountant','2025-03-08','All outstanding fees must be paid by March 15th.','Urgent',null],
    ]);
    ok('Seeded events and notices.');

    insertRows($pdo, "INSERT INTO assignments (title,subject,class_id,teacher_id,due_date,created_date,max_score,status,instructions,attachment) VALUES (?,?,?,?,?,?,?,?,?,?)", [
        ['Chapter 5 Problems','Mathematics',11,1,'2025-03-20','2025-03-10',100,'Active','Complete all questions.',null],
        ['Essay on Climate','English',11,2,'2025-03-22','2025-03-11',100,'Active','Write two pages.',null],
    ]);
    insertRows($pdo, "INSERT INTO assignment_submissions (assignment_id,student_id,submitted_at,score,feedback) VALUES (?,?,?,?,?)", [
        [1,1,'2025-03-18',88,'Good work'],
    ]);

    insertRows($pdo, "INSERT INTO attendance (student_id,attendance_date,status,remarks,recorded_by) VALUES (?,?,?,?,?)", [
        [1,'2025-03-17','Present','',2],
        [2,'2025-03-17','Present','',2],
        [3,'2025-03-17','Absent','Sick',2],
    ]);

    insertRows($pdo, "INSERT INTO salary (staff_id,grade,base_salary,allowances,deductions,net_salary,pay_date,term,academic_year) VALUES (?,?,?,?,?,?,?,?,?)", [
        [1,'Grade 8',3500,400,150,3750,'2025-03-28','1st Term','2024/2025'],
        [2,'Grade 7',3200,350,120,3430,'2025-03-28','1st Term','2024/2025'],
        [3,'Admin A',2800,300,100,3000,'2025-03-28','1st Term','2024/2025'],
    ]);
    insertRows($pdo, "INSERT INTO expenses (category,description,amount,expense_date,recorded_by) VALUES (?,?,?,?,?)", [
        ['Utilities','Electricity Bill - March',4200,'2025-03-17','Principal'],
        ['Admin','Stationery Supplies',1800,'2025-03-15','Accountant'],
    ]);

    insertRows($pdo, "INSERT INTO messages (sender_id,receiver_id,subject,body) VALUES (?,?,?,?)", [
        [1,2,'Welcome','Welcome to the new portal.'],
        [2,1,'Re: Welcome','Thank you.'],
    ]);
    insertRows($pdo, "INSERT INTO contact_messages (name,email,subject,message,is_read) VALUES (?,?,?,?,?)", [
        ['Prospective Parent','prospect@example.com','Admission inquiry','Please send admission details.',0],
    ]);

    insertRows($pdo, "INSERT INTO alumni (alumni_code,name,class_year,profession,location,bio,email,phone,instagram,linkedin,twitter,facebook,avatar,avatar_color,user_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [
        ['ALM001','Abena Owusu',2018,'Software Engineer','Accra - Google Ghana','Senior Developer at Google Ghana','abena.owusu@gmail.com','+233 24 111 0001','@abenaotech','linkedin.com/in/abenaowusu','@abenaotech','facebook.com/abena.owusu','AO','purple',6],
        ['ALM002','Kwabena Asare',2016,'Medical Doctor','London - NHS','Consultant Physician','kwabena.asare@nhs.uk','+44 7911 123456','@kwabenadr','linkedin.com/in/kwabenaasare','@kwabenaasare','facebook.com/kwabena.asare','KA','blue',null],
    ]);

    insertRows($pdo, "INSERT INTO settings (setting_key,setting_value) VALUES (?,?)", [
        ['school_name','Glory Reign Preparatory School'],
        ['school_code','SCH-0024'],
        ['motto','Excellence in Learning'],
        ['region','Upper West Region'],
        ['district','Jirapa'],
        ['phone','+233 24 000 0000'],
        ['email','gloryreign2011@gmail.com'],
        ['address','Jirapa, Upper West Region, Ghana'],
        ['website','www.gloryreign.edu.gh'],
        ['academic_year','2024/2025'],
        ['current_term','1st Term'],
        ['term_start_date','2025-01-06'],
        ['term_end_date','2025-04-15'],
        ['maintenance_mode','0'],
        ['max_upload_size','10MB'],
        ['language','English'],
    ]);

    insertRows($pdo, "INSERT INTO admissions (applicant_name,dob,gender,class_applying,parent_name,parent_phone,parent_email,address,previous_school,status,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?)", [
        ['Kofi Mensah','2016-04-12','Male','Primary 1','Kwabena Mensah','0245551234','kwabena@gmail.com','Jirapa','Jirapa Nursery','Pending','Awaiting document verification'],
        ['Yaa Asantewaa','2015-08-20','Female','Primary 2','Akua Asantewaa','0245555678','akua@gmail.com','Wa','Methodist Primary','Approved','Excellent exam performance'],
    ]);

    insertRows($pdo, "INSERT INTO hero_slides (title,caption,image,status) VALUES (?,?,?,?)", [
        ['Glory Reign Preparatory School','Nurturing minds, building character, and shaping futures.','assets/images/Hero.jpeg','Active'],
    ]);
    insertRows($pdo, "INSERT INTO news_articles (icon,title,category,date,`desc`,status) VALUES (?,?,?,?,?,?)", [
        ['<i class=\"fas fa-newspaper\"></i>','Glory Reign Launches Digital Campus Portal','Announcements','2025-03-01','Our new persistent database-backed campus portal is live.','Published'],
    ]);
    insertRows($pdo, "INSERT INTO yearbooks (year,title,cover_img,status,total_grads,total_photos,data) VALUES (?,?,?,?,?,?,?)", [
        ['2025','Class of 2025 Graduation','#1e3a8a','Published',52,120,'{"classes":[],"teachers":[],"leaders":[],"achievements":[],"events":[],"tributes":[]}'],
    ]);
    ok('Seeded academic, finance, content, and portal data.');

    $tables = [
        'users','staff','classes','subjects','students','parents','parent_student','teachers',
        'student_scores','exams','assignments','assignment_submissions','fees','fee_structure','payments',
        'expenses','salary','attendance','timetable','events','notices','messages','contact_messages',
        'alumni','settings','admissions','hero_slides','news_articles','yearbooks'
    ];
    foreach ($tables as $table) {
        $counts[$table] = (int)$pdo->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
    }
} catch (Throwable $e) {
    fail_log('FATAL: ' . $e->getMessage());
}

if (isset($_GET['delete'])) {
    @unlink(__FILE__);
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Glory Reign - Database Setup</title>
  <style>
    body{font-family:Segoe UI,Arial,sans-serif;max-width:920px;margin:40px auto;padding:0 20px;background:#f4f7fb;color:#172033}
    .card{background:#fff;border-radius:12px;padding:22px;margin:16px 0;box-shadow:0 8px 24px rgba(15,23,42,.08)}
    .ok,.err{padding:9px 12px;border-radius:8px;margin:6px 0;font-size:14px}.ok{background:#ecfdf5;color:#047857}.err{background:#fef2f2;color:#b91c1c}
    table{width:100%;border-collapse:collapse}th,td{padding:9px 10px;border-bottom:1px solid #e5e7eb;text-align:left}th{background:#f8fafc}
    code{background:#eef2ff;padding:2px 6px;border-radius:5px}.btn{display:inline-block;background:#1d4ed8;color:#fff;text-decoration:none;border-radius:8px;padding:10px 16px;margin-right:8px}.danger{background:#dc2626}
  </style>
</head>
<body>
  <h1>Glory Reign Database Setup</h1>
  <div class="card">
    <h2>Rebuild Log</h2>
    <?php foreach ($log as [$type, $message]): ?>
      <div class="<?= htmlspecialchars($type) ?>"><?= htmlspecialchars($message) ?></div>
    <?php endforeach; ?>
  </div>

  <?php if ($counts): ?>
  <div class="card">
    <h2>Created Tables</h2>
    <table>
      <thead><tr><th>Table</th><th>Rows</th></tr></thead>
      <tbody>
      <?php foreach ($counts as $table => $count): ?>
        <tr><td><?= htmlspecialchars($table) ?></td><td><?= (int)$count ?></td></tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  </div>
  <div class="card">
    <h2>Default Logins</h2>
    <table>
      <thead><tr><th>Role</th><th>Username</th><th>Password</th></tr></thead>
      <tbody>
        <tr><td>Admin</td><td><code>admin</code></td><td><code>admin123</code></td></tr>
        <tr><td>Teacher</td><td><code>k.amponsah</code></td><td><code>teacher123</code></td></tr>
        <tr><td>Student</td><td><code>ama.serwaa</code></td><td><code>student123</code></td></tr>
        <tr><td>Accountant</td><td><code>k.accountant</code></td><td><code>acct123</code></td></tr>
        <tr><td>Parent</td><td><code>serwaa.parent</code></td><td><code>parent123</code></td></tr>
        <tr><td>Alumni</td><td><code>abena.alumni</code></td><td><code>alumni123</code></td></tr>
      </tbody>
    </table>
    <p>This setup is destructive: it drops and recreates <code><?= htmlspecialchars(DB_NAME) ?></code> every time it runs.</p>
    <a class="btn" href="../frontend/index.html">Open Portal</a>
    <a class="btn danger" href="?delete=1" onclick="return confirm('Delete setup.php?')">Delete setup.php</a>
  </div>
  <?php endif; ?>
</body>
</html>
