<?php
/**
 * /api/reports/analytics.php
 * GET - returns analytics data for dashboards (students, performance, attendance, subject aggregates)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

$user = requireAuth();
$db   = getDB();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

// Term and year (allow override via query for testing)
$term = $_GET['term'] ?? (
    ($db->query("SELECT setting_value FROM settings WHERE setting_key = 'current_term' LIMIT 1")->fetchColumn()) ?: '1st Term'
);
$year = $_GET['academic_year'] ?? (
    ($db->query("SELECT setting_value FROM settings WHERE setting_key = 'academic_year' LIMIT 1")->fetchColumn()) ?: '2024/2025'
);

// Fetch active students
$stmt = $db->prepare(
    "SELECT s.id, s.student_code, s.name, s.gender, s.attendance, s.status, c.name AS class_name
     FROM students s
     LEFT JOIN classes c ON c.id = s.class_id
     WHERE s.status = 'Active'"
);
$stmt->execute();
$studentsRaw = $stmt->fetchAll();

// Fetch scores for the term/year
$scoreStmt = $db->prepare(
    "SELECT student_id, subject, class_score, exam_score
     FROM student_scores
     WHERE term = ? AND academic_year = ?"
);
$scoreStmt->execute([$term, $year]);
$scoresRaw = $scoreStmt->fetchAll();

// Helper: grade
function gradeFromTotal(float $total): string {
    if ($total >= 90) return 'A';
    if ($total >= 80) return 'B';
    if ($total >= 70) return 'C';
    if ($total >= 60) return 'D';
    return 'E';
}

// Build students map and attach scores
$students = [];
foreach ($studentsRaw as $s) {
    $students[$s['id']] = [
        'id' => (int)$s['id'],
        'student_code' => $s['student_code'],
        'name' => $s['name'],
        'gender' => $s['gender'],
        'attendance' => (float)($s['attendance'] ?? 0),
        'class_name' => $s['class_name'] ?? null,
        'scores' => new stdClass(), // will be replaced with associative array if scores exist
    ];
}

// Organize scores per student
$byStudent = [];
foreach ($scoresRaw as $r) {
    $sid = (int)$r['student_id'];
    if (!isset($byStudent[$sid])) $byStudent[$sid] = [];
    $byStudent[$sid][] = $r;
}

// Analytics containers
$analytics = [
    'performanceTrends' => ['excellent'=>0,'veryGood'=>0,'good'=>0,'average'=>0,'needsHelp'=>0],
    'attendanceStats' => ['excellent'=>0,'good'=>0,'average'=>0,'poor'=>0,'averageAttendance'=>0],
    'classAnalytics' => [],
    'subjectPerformance' => [],
    'genderAnalytics' => ['Male'=>['count'=>0,'scores'=>[]],'Female'=>['count'=>0,'scores'=>[]]],
    'topPerformers' => [],
    'studentAtRisk' => [],
    'avgPerformance' => 0
];

$totalPerformanceSum = 0;
$studentCountWithScores = 0;

// Process each student to compute averages and attach scores
foreach ($students as $id => &$stu) {
    $scoresArr = [];
    if (!empty($byStudent[$id])) {
        foreach ($byStudent[$id] as $r) {
            $sub = $r['subject'];
            $scoresArr[$sub] = [
                'classScore' => (float)$r['class_score'],
                'examScore'  => (float)$r['exam_score']
            ];
            // Subject aggregates
            if (!isset($analytics['subjectPerformance'][$sub])) {
                $analytics['subjectPerformance'][$sub] = ['totalStudents'=>0,'totalScore'=>0,'grades'=>['A'=>0,'B'=>0,'C'=>0,'D'=>0,'E'=>0]];
            }
            $total = $r['class_score'] + $r['exam_score'];
            $analytics['subjectPerformance'][$sub]['totalStudents']++;
            $analytics['subjectPerformance'][$sub]['totalScore'] += $total;
            $analytics['subjectPerformance'][$sub]['grades'][gradeFromTotal($total)]++;
        }
    }

    // Attach scores object
    $stuScores = (object)$scoresArr;
    $stu['scores'] = $scoresArr;

    // Compute average
    if (count($scoresArr) > 0) {
        $totals = array_map(function($s){ return $s['classScore'] + $s['examScore']; }, $scoresArr);
        $average = round(array_sum($totals) / count($totals), 1);
        $stu['average'] = $average;
        $totalPerformanceSum += $average;
        $studentCountWithScores++;

        // Performance trend
        if ($average >= 90) $analytics['performanceTrends']['excellent']++;
        elseif ($average >= 80) $analytics['performanceTrends']['veryGood']++;
        elseif ($average >= 70) $analytics['performanceTrends']['good']++;
        elseif ($average >= 60) $analytics['performanceTrends']['average']++;
        else $analytics['performanceTrends']['needsHelp']++;

        // Gender analytics
        $gender = $stu['gender'] ?? 'Male';
        if (!isset($analytics['genderAnalytics'][$gender])) $analytics['genderAnalytics'][$gender] = ['count'=>0,'scores'=>[]];
        $analytics['genderAnalytics'][$gender]['count']++;
        $analytics['genderAnalytics'][$gender]['scores'][] = $average;
    } else {
        $stu['average'] = 0;
    }

    // Class analytics - collect scores per class
    $class = $stu['class_name'] ?? 'Unassigned';
    if (!isset($analytics['classAnalytics'][$class])) {
        $analytics['classAnalytics'][$class] = ['totalStudents'=>0,'scores'=>[],'attendanceSum'=>0,'maleCount'=>0,'femaleCount'=>0];
    }
    $analytics['classAnalytics'][$class]['totalStudents']++;
    if ($stu['average']) $analytics['classAnalytics'][$class]['scores'][] = $stu['average'];
    $analytics['classAnalytics'][$class]['attendanceSum'] += $stu['attendance'] ?? 0;
    if (($stu['gender'] ?? '') === 'Male') $analytics['classAnalytics'][$class]['maleCount']++;
    else $analytics['classAnalytics'][$class]['femaleCount']++;

    // Identify at-risk
    if ($stu['average'] < 60 || ($stu['attendance'] ?? 0) < 75) {
        $stuRisk = $stu;
        $stuRisk['riskFactors'] = [];
        if ($stu['average'] < 50) $stuRisk['riskFactors'][] = 'Critical Performance';
        elseif ($stu['average'] < 60) $stuRisk['riskFactors'][] = 'Poor Performance';
        if (($stu['attendance'] ?? 0) < 60) $stuRisk['riskFactors'][] = 'Critical Attendance';
        elseif (($stu['attendance'] ?? 0) < 75) $stuRisk['riskFactors'][] = 'Poor Attendance';
        $analytics['studentAtRisk'][] = $stuRisk;
    }
}
unset($stu);

// Finalize subject averages
foreach ($analytics['subjectPerformance'] as $sub => &$sdata) {
    if ($sdata['totalStudents'] > 0) {
        $sdata['averageScore'] = round($sdata['totalScore'] / $sdata['totalStudents'], 1);
    } else {
        $sdata['averageScore'] = 0;
    }
}

// Finalize class averages and attendance
foreach ($analytics['classAnalytics'] as $cls => &$cdata) {
    $cdata['averagePerformance'] = count($cdata['scores']) ? round(array_sum($cdata['scores']) / count($cdata['scores']), 1) : 0;
    $cdata['averageAttendance'] = $cdata['totalStudents'] ? round($cdata['attendanceSum'] / $cdata['totalStudents'], 1) : 0;
    unset($cdata['scores']);
}

// Attendance stats
$attCount = ['excellent'=>0,'good'=>0,'average'=>0,'poor'=>0];
$attendanceSum = 0;
$totStud = count($students);
foreach ($students as $s) {
    $att = $s['attendance'] ?? 0;
    $attendanceSum += $att;
    if ($att >= 95) $attCount['excellent']++;
    elseif ($att >= 85) $attCount['good']++;
    elseif ($att >= 75) $attCount['average']++;
    else $attCount['poor']++;
}
$analytics['attendanceStats'] = $attCount;
$analytics['attendanceStats']['averageAttendance'] = $totStud ? round($attendanceSum / $totStud, 1) : 0;

// Top performers
$allStudents = array_values($students);
usort($allStudents, function($a, $b){ return ($b['average'] <=> $a['average']); });
$analytics['topPerformers'] = array_slice($allStudents, 0, 10);

// Average performance overall
$analytics['avgPerformance'] = $studentCountWithScores ? round($totalPerformanceSum / $studentCountWithScores, 1) : 0;

// Return payload
jsonResponse(['success' => true, 'data' => ['students' => array_values($students), 'analytics' => $analytics, 'term' => $term, 'academic_year' => $year]]);
