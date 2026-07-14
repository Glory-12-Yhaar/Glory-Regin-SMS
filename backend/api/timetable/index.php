<?php
/**
 * /api/timetable/index.php
 * GET    - Get timetables grouped by class and term
 * POST   - Save/replace timetable for a class and term (Admin only)
 * DELETE - Clear timetable for a class and term (Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

requireAuth();
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

$db->exec("ALTER TABLE timetable ADD COLUMN IF NOT EXISTS period_label VARCHAR(100) DEFAULT NULL");
$db->exec("ALTER TABLE timetable ADD COLUMN IF NOT EXISTS teacher_id INT DEFAULT NULL");
$db->exec("ALTER TABLE timetable ADD COLUMN IF NOT EXISTS room VARCHAR(80) DEFAULT NULL");

function resolveTimetableClassId(PDO $db, string $className): int {
    $stmt = $db->prepare("SELECT id FROM classes WHERE name = ? LIMIT 1");
    $stmt->execute([trim($className)]);
    $classId = (int)($stmt->fetchColumn() ?: 0);
    if (!$classId) {
        jsonResponse(['success' => false, 'message' => "Class '$className' not found"], 404);
    }
    return $classId;
}

function resolveTimetableTeacherId(PDO $db, int $classId, string $subject): ?int {
    $subject = trim($subject);
    if ($subject === '' || $subject === '-') return null;

    $stmt = $db->prepare(
        "SELECT teacher_id
         FROM subjects
         WHERE class_id = ? AND LOWER(name) = LOWER(?)
         ORDER BY id ASC
         LIMIT 1"
    );
    $stmt->execute([$classId, $subject]);
    $teacherId = $stmt->fetchColumn();
    return $teacherId ? (int)$teacherId : null;
}

function parseTimetablePeriodTimes(string $label): array {
    if (preg_match('/(\d{1,2}):(\d{2}).*?(\d{1,2}):(\d{2})/', $label, $matches)) {
        return [
            sprintf('%02d:%02d:00', (int)$matches[1], (int)$matches[2]),
            sprintf('%02d:%02d:00', (int)$matches[3], (int)$matches[4]),
        ];
    }
    if (preg_match('/(\d{1,2}):(\d{2})/', $label, $matches)) {
        $time = sprintf('%02d:%02d:00', (int)$matches[1], (int)$matches[2]);
        return [$time, $time];
    }
    return ['00:00:00', '00:00:00'];
}

if ($method === 'GET') {
    $stmt = $db->query(
        "SELECT t.*, c.name AS class_name
         FROM timetable t
         INNER JOIN classes c ON c.id = t.class_id
         ORDER BY c.name ASC, t.term ASC, t.start_time ASC, t.id ASC"
    );
    $rows = $stmt->fetchAll();

    $timetables = [];
    $daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    foreach ($rows as $row) {
        $className = $row['class_name'];
        $term = $row['term'];
        $label = $row['period_label'] ?: ($row['start_time'] . ' - ' . $row['end_time']);

        if (!isset($timetables[$className])) $timetables[$className] = [];
        if (!isset($timetables[$className][$term])) $timetables[$className][$term] = [];

        $foundIndex = -1;
        foreach ($timetables[$className][$term] as $index => $periodRow) {
            if ($periodRow[0] === $label) {
                $foundIndex = $index;
                break;
            }
        }

        if ($foundIndex === -1) {
            $timetables[$className][$term][] = [$label, ['-', '-', '-', '-', '-']];
            $foundIndex = count($timetables[$className][$term]) - 1;
        }

        $dayIndex = array_search($row['day_of_week'], $daysOfWeek, true);
        if ($dayIndex !== false) {
            $timetables[$className][$term][$foundIndex][1][$dayIndex] = $row['subject'];
        }
    }

    jsonResponse(['success' => true, 'data' => $timetables]);
}

if ($method === 'POST') {
    requireRole(['Admin']);
    $body = getRequestBody();
    $schedule = $body['timetable'] ?? $body['schedule'] ?? null;

    if (empty($body['class_name']) || empty($body['term']) || !is_array($schedule)) {
        jsonResponse(['success' => false, 'message' => 'class_name, term, and timetable array are required'], 422);
    }

    $className = trim((string)$body['class_name']);
    $term = htmlspecialchars(trim((string)$body['term']), ENT_QUOTES);
    $classId = resolveTimetableClassId($db, $className);

    $db->beginTransaction();
    try {
        $db->prepare("DELETE FROM timetable WHERE class_id = ? AND term = ?")->execute([$classId, $term]);

        $insert = $db->prepare(
            "INSERT INTO timetable (class_id, subject, teacher_id, day_of_week, start_time, end_time, period_label, term)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        foreach ($schedule as $periodRow) {
            if (!is_array($periodRow) || count($periodRow) < 2 || !is_array($periodRow[1])) continue;

            $label = htmlspecialchars(trim((string)$periodRow[0]), ENT_QUOTES);
            [$startTime, $endTime] = parseTimetablePeriodTimes($label);

            foreach ($periodRow[1] as $dayIndex => $subject) {
                if (!isset($daysOfWeek[$dayIndex])) continue;

                $subjectText = htmlspecialchars(trim((string)$subject), ENT_QUOTES) ?: '-';
                $teacherId = resolveTimetableTeacherId($db, $classId, $subjectText);
                $insert->execute([
                    $classId,
                    $subjectText,
                    $teacherId,
                    $daysOfWeek[$dayIndex],
                    $startTime,
                    $endTime,
                    $label,
                    $term
                ]);
            }
        }

        $db->commit();
        jsonResponse(['success' => true, 'message' => 'Timetable saved successfully']);
    } catch (PDOException $e) {
        $db->rollBack();
        jsonResponse(['success' => false, 'message' => 'Failed to save timetable'], 500);
    }
}

if ($method === 'DELETE') {
    requireRole(['Admin']);
    $className = trim((string)($_GET['class_name'] ?? ''));
    $term = trim((string)($_GET['term'] ?? ''));

    if (!$className || !$term) {
        jsonResponse(['success' => false, 'message' => 'class_name and term parameters required'], 422);
    }

    $classId = resolveTimetableClassId($db, $className);
    $db->prepare("DELETE FROM timetable WHERE class_id = ? AND term = ?")->execute([$classId, $term]);

    jsonResponse(['success' => true, 'message' => 'Timetable deleted successfully']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
