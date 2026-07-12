<?php
/**
 * Glory Reign School — One-Click Database Setup
 * Visit: http://localhost/SCH/setup.php  then delete this file.
 */

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');   // default XAMPP: empty

$log = [];   // [ ['ok'|'err', 'message'] ]

function ok(string $msg)  { global $log; $log[] = ['ok',  $msg]; }
function err(string $msg) { global $log; $log[] = ['err', $msg]; }
try {
    // 1. Connect (no DB selected yet)
    $pdo = new PDO("mysql:host=".DB_HOST.";charset=utf8mb4", DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    ok('Connected to MySQL.');

    // 2. Drop & recreate database
    $pdo->exec("DROP DATABASE IF EXISTS `glory_regin_school`");
    $pdo->exec("CREATE DATABASE `glory_regin_school` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `glory_regin_school`");
    ok('Database glory_regin_school created.');

    // 3. Run DDL from schema.sql
    $sql = file_get_contents(__DIR__ . '/database/schema.sql');
    if (!$sql) throw new RuntimeException('Cannot read database/schema.sql');

    // Strip UTF-8 BOM if present
    if (substr($sql, 0, 3) === "\xEF\xBB\xBF") {
        $sql = substr($sql, 3);
    }

    // Strip -- line comments, then split on semicolons
    $clean = preg_replace('/--[^\n]*/m', '', $sql);
    $stmts = array_filter(array_map('trim', explode(';', $clean)), fn($s) => strlen($s) > 5);
    $ddlCount = 0;
    foreach ($stmts as $stmt) {
        $pdo->exec($stmt);
        $ddlCount++;
    }
    ok("DDL executed: $ddlCount table definitions created.");

    // ── SEED DATA (all via PHP PDO — no SQL file parsing) ─────

    // 4. Users (bcrypt hashed in PHP)
    $users = [
        ['user001','System Admin',   'admin',         'admin@gloryreign.edu.gh',        'admin123',   'Admin',      'SA'],
        ['user002','Mr. Amponsah',   'k.amponsah',    'k.amponsah@gloryreign.edu.gh',   'teacher123', 'Teacher',    'MA'],
        ['user003','Ama Serwaa',     'ama.serwaa',    'ama@student.gloryreign.edu.gh',  'student123', 'Student',    'AS'],
        ['user004','Mr. Kojo Mensah','k.accountant',  'accountant@gloryreign.edu.gh',   'acct123',    'Accountant', 'KA'],
        ['user005','Mr. Serwaa',     'serwaa.parent', 'parent@gloryreign.edu.gh',       'parent123',  'Parent',     'SP'],
    ];
    $ins = $pdo->prepare("INSERT INTO users (user_code,name,username,email,password_hash,role,status,avatar) VALUES (?,?,?,?,?,?,'Active',?)");
    foreach ($users as [$code,$name,$uname,$email,$pw,$role,$av]) {
        $ins->execute([$code,$name,$uname,$email,password_hash($pw,PASSWORD_BCRYPT,['cost'=>10]),$role,$av]);
    }
    $adminId = $pdo->lastInsertId() - 4; // first user's ID
    // Fetch real admin id
    $adminId = (int)$pdo->query("SELECT id FROM users WHERE username='admin'")->fetchColumn();
    ok('Users seeded (5 accounts with bcrypt hashes).');

    // 5. Classes
    $classes = [
        ['Creche',   'Early Childhood', 'Ms. Doe'],
        ['Nursery',  'Early Childhood', 'Ms. Amoah'],
        ['KG 1',     'Early Childhood', 'Ms. Boateng'],
        ['KG 2',     'Early Childhood', 'Mrs. Darko'],
        ['Basic 1',  'Primary',         'Mr. Quaye'],
        ['Basic 2',  'Primary',         'Mrs. Brew'],
        ['Basic 3',  'Primary',         'Mr. Nkrumah'],
        ['Basic 4',  'Primary',         'Mrs. Asante'],
        ['Basic 5',  'Primary',         'Mrs. Asante'],
        ['Basic 6',  'Primary',         'Mr. Boateng Sr.'],
        ['JHS 1',    'Junior High',     'Ms. Mensah'],
        ['JHS 2',    'Junior High',     'Mr. Owusu'],
        ['JHS 3',    'Junior High',     'Mr. Amponsah'],
    ];
    $ins = $pdo->prepare("INSERT INTO classes (name,level,class_teacher) VALUES (?,?,?)");
    foreach ($classes as $c) $ins->execute($c);
    ok('Classes seeded (13 classes).');

    // 6. Subjects
    $subjectsByClass = [
        1  => ['Numeracy','Literacy','Creative Art','Writing','Environmental Studies'],
        2  => ['Numeracy','Literacy','Creative Art','Writing','Environmental Studies'],
        3  => ['Numeracy','Literacy','Creative Art','Writing','Environmental Studies'],
        4  => ['Numeracy','Literacy','Creative Art','Writing','Environmental Studies'],
        5  => ['Mathematics','Science','English','Dagaare','Computing','History','RME','Creative Art'],
        6  => ['Mathematics','Science','English','Dagaare','Computing','History','RME','Creative Art'],
        7  => ['Mathematics','Science','English','Dagaare','Computing','History','RME','Creative Art'],
        8  => ['Mathematics','Science','English','Dagaare','Computing','History','RME','Creative Art'],
        9  => ['Mathematics','Science','English','Dagaare','Computing','History','RME','Creative Art'],
        10 => ['Mathematics','Science','English','Dagaare','Computing','History','RME','Creative Art'],
        11 => ['Mathematics','Science','English','Social Studies','Computing','Career Technology','RME','Creative Art','Dagaare'],
        12 => ['Mathematics','Science','English','Social Studies','Computing','Career Technology','RME','Creative Art','Dagaare'],
        13 => ['Mathematics','Science','English','Social Studies','Computing','Career Technology','RME','Creative Art','Dagaare'],
    ];
    $ins = $pdo->prepare("INSERT INTO subjects (name,class_id) VALUES (?,?)");
    $subCount = 0;
    foreach ($subjectsByClass as $classId => $subs) {
        foreach ($subs as $s) { $ins->execute([$s,$classId]); $subCount++; }
    }
    ok("Subjects seeded ($subCount subjects).");

    // 7. Staff
    $staff = [
        ['KWA001','Mr. Kweku Amponsah','kweku.amponsah@gloryreign.edu.gh','+233 24 100 0001','Teaching','Mathematics','Senior Teacher','B.Sc Mathematics (Legon), Diploma in Education','Grade 8','2013-01-15','Male','1985-05-22','123 Education Street, Accra','Ama Amponsah','+233 244 567 890','4.8/5','Active','KA'],
        ['AKA002','Mrs. Akua Asante','akua.asante@gloryreign.edu.gh','+233 24 100 0002','Teaching','Languages','Senior Teacher','B.A English (UCC), Diploma in Education','Grade 7','2017-03-10','Female','1988-07-14','456 Learning Street, Accra','Kwame Asante','+233 245 678 901','4.6/5','Active','AA'],
        ['KMN003','Mr. Kojo Mensah','kojo.mensah@gloryreign.edu.gh','+233 24 100 0003','Admin','Finance','Accounts Officer','HND Accounting','Admin A','2015-06-20','Male','1982-09-03','789 Finance Lane, Accra','Abena Mensah','+233 246 789 012','4.5/5','Active','KM'],
        ['ABO004','Ms. Abena Ofori','abena.ofori@gloryreign.edu.gh','+233 24 100 0004','Admin','Front Office','Receptionist','Diploma in Secretarial Studies','Admin B','2020-09-15','Female','1995-02-11','321 Office Avenue, Accra','John Ofori','+233 247 890 123','4.3/5','Active','AO'],
        ['KWO005','Mr. Kwame Oti','kwame.oti@gloryreign.edu.gh','+233 24 100 0005','Support','Maintenance','Maintenance Supervisor','Technical Certificate in Building Maintenance','Support','2018-01-08','Male','1980-11-30','654 Support Road, Accra','Ama Oti','+233 248 901 234','4.4/5','Active','KO'],
        ['FPA006','Ms. Freda Poku','freda.poku@gloryreign.edu.gh','+233 24 100 0006','Teaching','ICT','Teacher','B.Tech ICT (KNUST)','Grade 6','2019-08-25','Female','1992-04-18','987 Tech Street, Accra','Ernest Poku','+233 249 012 345','4.7/5','Active','FP'],
        ['YOB007','Mr. Yaw Boateng Sr.','yaw.boateng@gloryreign.edu.gh','+233 24 100 0007','Teaching','Social Studies','Teacher','B.A History (UG)','Grade 6','2016-09-12','Male','1986-03-25','159 History Street, Accra','Grace Boateng','+233 240 123 456','4.5/5','Active','YB'],
        ['NYS008','Mrs. Nana Yaa Sekyere','nana.sekyere@gloryreign.edu.gh','+233 24 100 0008','Teaching','Science','Science Coordinator','B.Sc Biology (KNUST), Diploma in Education','Grade 7','2014-02-01','Female','1987-06-09','357 Science Park, Accra','Samuel Sekyere','+233 241 234 567','4.8/5','Active','NS'],
        ['ABD009','Mr. Abdul Hassan','abdul.hassan@gloryreign.edu.gh','+233 24 100 0009','Support','Security','Security Officer','National Security Certificate','Support','2017-07-10','Male','1979-08-15','741 Security Lane, Accra','Zainab Hassan','+233 242 345 678','4.2/5','Active','AH'],
        ['RSO010','Ms. Rose Sarbah','rose.sarbah@gloryreign.edu.gh','+233 24 100 0010','Admin','Registrar','Registrar','Diploma in Educational Management','Admin A','2012-08-20','Female','1981-10-05','852 Admin Street, Accra','Daniel Sarbah','+233 243 456 789','4.9/5','Active','RS'],
    ];
    $ins = $pdo->prepare("INSERT INTO staff (staff_code,name,email,phone,category,department,position,qualifications,salary_grade,join_date,gender,dob,address,emergency_contact,emergency_phone,performance,status,avatar) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
    foreach ($staff as $s) $ins->execute($s);
    ok('Staff seeded (10 members).');

    // 8. Teachers (staff_id = row position, staff inserted in order)
    $teacherLinks = [
        [1,'Mathematics','JHS 1',  13,'blue'],
        [2,'English',    'JHS 1',  9, 'green'],
        [6,'ICT',        'Basic 5',7, 'purple'],
        [7,'Social Studies','Basic 6',10,'gold'],
        [8,'Science',    'Basic 4',12,'teal'],
    ];
    $ins = $pdo->prepare("INSERT INTO teachers (staff_id,subject,class_assigned,experience,avatar_color) VALUES (?,?,?,?,?)");
    foreach ($teacherLinks as $t) $ins->execute($t);
    ok('Teacher links seeded.');

    // 9. Students (user_id for Ama Serwaa filled after lookup)
    $amaId = (int)$pdo->query("SELECT id FROM users WHERE username='ama.serwaa'")->fetchColumn();
    $students = [
        ['2024-38','Ama Serwaa',    11,'Female','2010-05-15',92.00, $amaId],
        ['2024-39','Akosua Darko',  11,'Female','2010-01-12',97.00, null],
        ['2024-41','Kwame Asante',  10,'Male',  '2011-03-22',88.00, null],
        ['2024-42','Abena Mensah',  10,'Female','2011-07-10',95.00, null],
        ['2024-43','Kofi Boateng',  10,'Male',  '2011-09-18',81.00, null],
        ['2024-44','Yaw Mensah',    9, 'Male',  '2011-11-08',90.00, null],
        ['2024-45','Adwoa Frimpong',9, 'Female','2011-04-20',93.00, null],
        ['2024-46','Kweku Ofori',   12,'Male',  '2009-12-05',79.00, null],
    ];
    $ins = $pdo->prepare("INSERT INTO students (student_code,name,class_id,gender,dob,attendance,user_id) VALUES (?,?,?,?,?,?,?)");
    foreach ($students as $s) $ins->execute($s);
    ok('Students seeded (8 students).');

    // 10. Student Scores (student_id by insertion order: 1-8)
    $scores = [
        [1,'Mathematics',      45,39],[1,'English Language',  48,42],
        [1,'Integrated Science',46,44],[1,'Social Studies',    44,40],[1,'Computing',45,38],
        [2,'Mathematics',      49,48],[2,'English Language',  50,48],
        [2,'Integrated Science',49,47],[2,'Social Studies',    48,46],[2,'Computing',48,47],
        [3,'Mathematics',      35,32],[3,'English Language',  42,40],
        [3,'History',          44,42],[3,'Science',            40,38],[3,'Computing',38,36],
        [4,'Mathematics',      48,43],[4,'English Language',  49,45],
        [4,'History',          47,44],[4,'Science',            45,42],[4,'Computing',46,41],
        [5,'Mathematics',      28,25],[5,'English Language',  36,34],
        [5,'History',          38,36],[5,'Science',            35,32],[5,'Computing',32,30],
        [6,'Mathematics',      41,39],[6,'English Language',  43,41],[6,'Science',42,40],
        [7,'Mathematics',      45,42],[7,'English Language',  46,44],[7,'Science',44,42],
        [8,'Mathematics',      30,28],[8,'English Language',  34,32],[8,'Social Studies',35,33],
    ];
    $ins = $pdo->prepare("INSERT INTO student_scores (student_id,subject,class_score,exam_score,term,academic_year) VALUES (?,?,'1st Term','2024/2025')");
    // PDO positional — need 4 params
    $ins2 = $pdo->prepare("INSERT INTO student_scores (student_id,subject,class_score,exam_score,term,academic_year) VALUES (?,?,?,?,'1st Term','2024/2025')");
    foreach ($scores as [$sid,$sub,$cs,$es]) $ins2->execute([$sid,$sub,$cs,$es]);
    ok('Student scores seeded ('.count($scores).' rows).');

    // 11. Fees
    $fees = [
        [1,'1st Term','2024/2025',2500.00,2500.00,'RCP-0038','2025-01-10','Paid'],
        [2,'1st Term','2024/2025',2500.00,2500.00,'RCP-0039','2025-01-09','Paid'],
        [3,'1st Term','2024/2025',2300.00,2300.00,'RCP-0041','2025-01-08','Paid'],
        [4,'1st Term','2024/2025',2300.00,1500.00,'RCP-0042','2025-01-11','Partial'],
        [5,'1st Term','2024/2025',2300.00,0.00,   null,       null,       'Pending'],
        [6,'1st Term','2024/2025',2300.00,2300.00,'RCP-0044','2025-01-07','Paid'],
        [7,'1st Term','2024/2025',2300.00,2300.00,'RCP-0045','2025-01-06','Paid'],
        [8,'1st Term','2024/2025',2700.00,1000.00,'RCP-0046','2025-01-12','Partial'],
    ];
    $ins = $pdo->prepare("INSERT INTO fees (student_id,term,academic_year,amount_due,amount_paid,receipt_no,payment_date,status) VALUES (?,?,?,?,?,?,?,?)");
    foreach ($fees as $f) $ins->execute($f);
    ok('Fees seeded (8 records).');

    // 12. Events
    $events = [
        ['End of Term Exams', '2025-03-21','08:00:00',1,'All',    'Final exams for all classes.'],
        ['PTA Meeting',       '2025-03-28','14:00:00',0,'Parents','Parents and Teachers Association meeting.'],
        ['Sports Day',        '2025-04-05','08:00:00',1,'All',    'Annual inter-house sports competition.'],
        ['Prize Giving Day',  '2025-04-12','10:00:00',0,'All',    'Annual prize giving and graduation ceremony.'],
        ['Vacation',          '2025-04-15','00:00:00',1,'All',    'School closes for 2nd Term vacation.'],
        ['New Term Begins',   '2025-05-05','07:30:00',0,'All',    '3rd Term begins. All students report by 7:30 AM.'],
    ];
    $ins = $pdo->prepare("INSERT INTO events (title,event_date,event_time,all_day,audience,description,created_by) VALUES (?,?,?,?,?,?,?)");
    foreach ($events as $e) { $e[] = $adminId; $ins->execute($e); }
    ok('Events seeded (6 events).');

    // 13. Notices
    $notices = [
        ['End of Term Examination Timetable','All',    'Admin',     '2025-03-10','The end of term examination timetable is now available. Exams begin March 21st.','Important'],
        ['Fees Payment Deadline',            'Parents','Accountant','2025-03-08','All outstanding fees must be paid by March 15th.','Urgent'],
        ['Sports Day Preparation',           'All',    'Admin',     '2025-03-05','Sports Day is April 5th. House captains should begin organising their teams.','Normal'],
        ['New Library Books Available',      'Students','Librarian','2025-03-03','New textbooks added to the school library.','Normal'],
        ['JHS 3 Mock Exam Results',          'JHS 3',  'Admin',     '2025-03-01','JHS 3 mock exam results are ready. See your class teacher.','Important'],
    ];
    $ins = $pdo->prepare("INSERT INTO notices (title,audience,posted_by,notice_date,message,priority) VALUES (?,?,?,?,?,?)");
    foreach ($notices as $n) $ins->execute($n);
    ok('Notices seeded (5 notices).');

    // 14. Alumni
    $alumni = [
        ['ALM001','Abena Owusu', 2018,'Software Engineer','Accra · Google Ghana','Working as Senior Developer at Google Ghana','abena.owusu@gmail.com','+233 24 111 0001','@abenaotech','linkedin.com/in/abenaowusu','@abenaotech','facebook.com/abena.owusu','AO','purple'],
        ['ALM002','Kwabena Asare',2016,'Medical Doctor','London · NHS','Consultant Physician at London NHS Hospital','kwabena.asare@nhs.uk','+44 7911 123456','@kwabenadr','linkedin.com/in/kwabenaasare','@kwabenaasare','facebook.com/kwabena.asare','KA','blue'],
        ['ALM003','Esi Mensah',  2020,'Teacher','Kumasi · College','Secondary School Teacher - English & Literature','esi.mensah@college.edu.gh','+233 24 222 0003','@esimenteach','linkedin.com/in/esimensah','@esiteacher','facebook.com/esi.mensah','EM','green'],
        ['ALM004','Yaw Boateng', 2015,'Lawyer','Toronto · Law Firm','Senior Associate at Toronto Law Partnership','yaw.boateng@lawfirm.ca','+1 416 987 6543','@yawlawyer','linkedin.com/in/yawboateng','@yawboatenglaw','facebook.com/yaw.boateng','YB','gold'],
        ['ALM005','Akua Adjei',  2019,'Nurse','Accra · Korle Bu','Registered Nurse at Korle Bu Teaching Hospital','akua.adjei@korlebu.org','+233 24 333 0005','@akuanurse','linkedin.com/in/akuaadjei','@akuahealth','facebook.com/akua.adjei','AA','teal'],
    ];
    $ins = $pdo->prepare("INSERT INTO alumni (alumni_code,name,class_year,profession,location,bio,email,phone,instagram,linkedin,twitter,facebook,avatar,avatar_color) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
    foreach ($alumni as $a) $ins->execute($a);
    ok('Alumni seeded (5 records).');

    // 15. Settings
    $settings = [
        'school_name'    => 'Glory Reign Preparatory School',
        'school_code'    => 'SCH-0024',
        'motto'          => 'Excellence in Learning',
        'region'         => 'Upper West Region',
        'district'       => 'Jirapa',
        'phone'          => '+233 24 000 0000',
        'email'          => 'gloryreign2011@gmail.com',
        'address'        => 'Jirapa, Upper West Region, Ghana',
        'website'        => 'www.gloryreign.edu.gh',
        'academic_year'  => '2024/2025',
        'current_term'   => '1st Term',
        'term_start_date'=> '2025-01-06',
        'term_end_date'  => '2025-04-15',
        'maintenance_mode'=>'0',
        'max_upload_size'=> '10',
        'language'       => 'English',
    ];
    $ins = $pdo->prepare("INSERT INTO settings (setting_key,setting_value) VALUES (?,?)");
    foreach ($settings as $k => $v) $ins->execute([$k,$v]);
    ok('Settings seeded ('.count($settings).' keys).');

    // 15b. Seed Hero Slides
    $slides = [
        ['Glory Reign Preparatory School', 'Nurturing minds, building character, and shaping futures.', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><rect width="800" height="400" fill="%231e3a8a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="28" fill="%23ffffff">Welcome to Glory Reign School</text></svg>', 'Active']
    ];
    $insSlides = $pdo->prepare("INSERT INTO hero_slides (title, caption, image, status) VALUES (?,?,?,?)");
    foreach ($slides as $s) $insSlides->execute($s);
    ok('Hero slides seeded.');

    // 15c. Seed News Articles
    $news = [
        ['📰', 'Glory Reign Launches Digital Campus Portal', 'Announcements', '2025-03-01', 'We are thrilled to launch our new fully persistent MySQL digital database portal supporting student enrollment and administration.', 'Published']
    ];
    $insNews = $pdo->prepare("INSERT INTO news_articles (icon, title, category, date, `desc`, status) VALUES (?,?,?,?,?,?)");
    foreach ($news as $n) $insNews->execute($n);
    ok('News articles seeded.');

    // 15d. Seed Yearbooks
    $yearbooks = [
        ['2025', 'Class of 2025 Graduation', '#1e3a8a', 'Published', 52, 120, '{"classes":[],"teachers":[],"leaders":[],"achievements":[],"events":[],"tributes":[]}']
    ];
    $insYb = $pdo->prepare("INSERT INTO yearbooks (year, title, cover_img, status, total_grads, total_photos, data) VALUES (?,?,?,?,?,?,?)");
    foreach ($yearbooks as $y) $insYb->execute($y);
    ok('Yearbooks seeded.');

    // 15e. Seed Parents
    $parentUserId = (int)$pdo->query("SELECT id FROM users WHERE username='serwaa.parent'")->fetchColumn();
    $amaStudentId = (int)$pdo->query("SELECT id FROM students WHERE name='Ama Serwaa'")->fetchColumn();
    if ($parentUserId && $amaStudentId) {
        $pdo->prepare("INSERT INTO parents (name, email, phone, address, user_id) VALUES (?, ?, ?, ?, ?)")
            ->execute(['Mr. Serwaa', 'parent@gloryreign.edu.gh', '0241234567', 'Jirapa, Upper West', $parentUserId]);
        $parentId = $pdo->lastInsertId();
        $pdo->prepare("INSERT INTO parent_student (parent_id, student_id) VALUES (?, ?)")
            ->execute([$parentId, $amaStudentId]);
        ok('Parents and parent student links seeded.');
    }

    // 15f. Seed Admissions
    $admissions = [
        ['Kofi Mensah', '2016-04-12', 'Male', 'Primary 1', 'Kwabena Mensah', '0245551234', 'kwabena@gmail.com', 'Jirapa', 'Jirapa Nursery', 'Pending', 'Awaiting document verification'],
        ['Yaa Asantewaa', '2015-08-20', 'Female', 'Primary 2', 'Akua Asantewaa', '0245555678', 'akua@gmail.com', 'Wa', 'Methodist Primary', 'Approved', 'Excellent exam performance'],
        ['Yaw Kyeremeh', '2014-11-05', 'Male', 'JHS 1', 'Kofi Kyeremeh', '0245559012', 'kofi@gmail.com', 'Jirapa', 'Roman Catholic', 'Rejected', 'Class is full']
    ];
    $insAdm = $pdo->prepare("INSERT INTO admissions (applicant_name, dob, gender, class_applying, parent_name, parent_phone, parent_email, address, previous_school, status, notes) VALUES (?,?,?,?,?,?,?,?,?,?,?)");
    foreach ($admissions as $a) $insAdm->execute($a);
    ok('Admissions seeded.');


    // 16. Unique constraints for upserts
    $pdo->exec("ALTER TABLE student_scores ADD UNIQUE KEY uq_score (student_id, subject(100), term, academic_year)");
    $pdo->exec("ALTER TABLE attendance ADD UNIQUE KEY uq_attendance (student_id, attendance_date)");
    $pdo->exec("ALTER TABLE assignment_submissions ADD UNIQUE KEY uq_submission (assignment_id, student_id)");
    ok('Unique constraints added.');

    // 17. Row counts
    $counts = [];
    foreach (['users','classes','subjects','staff','students','student_scores','fees','events','notices','alumni','settings','hero_slides','news_articles','yearbooks','parents','parent_student','admissions'] as $t) {
        $counts[$t] = (int)$pdo->query("SELECT COUNT(*) FROM `$t`")->fetchColumn();
    }

} catch (Throwable $e) {
    err('FATAL: ' . $e->getMessage());
    $counts = [];
}

if (isset($_GET['delete'])) { @unlink(__FILE__); }
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Glory Reign — Setup</title>
<style>
*{box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;max-width:740px;margin:50px auto;padding:0 20px;background:#f0f4f8;color:#1e293b}
h1{color:#1a56db}h2{font-size:17px;margin-top:0}
.card{background:#fff;border-radius:12px;padding:24px;box-shadow:0 4px 20px rgba(0,0,0,.08);margin-bottom:18px}
.ok{color:#16a34a;background:#f0fdf4;padding:9px 14px;border-radius:8px;margin:5px 0;border-left:4px solid #16a34a;font-size:14px}
.err{color:#dc2626;background:#fef2f2;padding:9px 14px;border-radius:8px;margin:5px 0;border-left:4px solid #dc2626;font-size:13px;font-weight:600}
a.btn{display:inline-block;background:#1a56db;color:#fff;padding:11px 26px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:14px;margin-right:8px}
a.btn:hover{background:#1e40af}a.btn.red{background:#dc2626}a.btn.red:hover{background:#b91c1c}
table{width:100%;border-collapse:collapse;font-size:14px}th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #e2e8f0}
th{background:#f8fafc;font-weight:600;color:#475569}code{background:#f1f5f9;padding:2px 7px;border-radius:4px;font-family:monospace;font-size:13px}
.badge{background:#dbeafe;color:#1e40af;padding:2px 9px;border-radius:10px;font-size:12px;font-weight:700}
</style>
</head>
<body>
<?php if(isset($_GET['delete'])&&!file_exists(__FILE__)): ?>
<div class="card" style="border-left:4px solid #dc2626"><p style="color:#dc2626;font-weight:700;margin:0">🗑 setup.php deleted. System secured.</p></div>
<?php else: ?>
<h1>🏫 Glory Reign — Database Setup</h1>
<div class="card">
  <h2>Setup Log</h2>
  <?php foreach($log as [$type,$msg]): ?>
    <div class="<?=$type?>"><?=htmlspecialchars($msg)?></div>
  <?php endforeach ?>
</div>
<?php if(!empty($counts)): ?>
<div class="card">
  <h2>Records Seeded</h2>
  <table>
    <tr><th>Table</th><th>Rows</th></tr>
    <?php foreach($counts as $t=>$n): ?>
    <tr><td><?=$t?></td><td><span class="badge"><?=$n?></span></td></tr>
    <?php endforeach ?>
  </table>
</div>
<div class="card">
  <h2>Default Login Credentials</h2>
  <table>
    <tr><th>Role</th><th>Username</th><th>Password</th></tr>
    <tr><td>Admin</td>     <td><code>admin</code></td>        <td><code>admin123</code>&nbsp;or&nbsp;<code>12345</code></td></tr>
    <tr><td>Teacher</td>   <td><code>k.amponsah</code></td>   <td><code>teacher123</code></td></tr>
    <tr><td>Student</td>   <td><code>ama.serwaa</code></td>   <td><code>student123</code></td></tr>
    <tr><td>Accountant</td><td><code>k.accountant</code></td> <td><code>acct123</code></td></tr>
    <tr><td>Parent</td>    <td><code>serwaa.parent</code></td><td><code>parent123</code></td></tr>
  </table>
  <p style="color:#64748b;font-size:13px;margin-top:12px">⚠ Change passwords after first login via Settings → User Accounts.</p>
  <a href="Index.html" class="btn">🚀 Open School Portal</a>
  <a href="?delete=1" class="btn red" onclick="return confirm('Delete setup.php?')">🗑 Delete setup.php</a>
</div>
<?php endif ?>
<?php endif ?>
</body>
</html>
