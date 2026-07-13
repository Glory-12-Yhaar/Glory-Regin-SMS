<?php
/**
 * /api/timetable/index.php
 * GET  - Get timetables for all classes (or ?class_name=X & ?term=Y)
 * POST - Save/replace timetable for a class and term (Admin only)
 * DELETE - Clear timetable for a class and term (Admin only)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';

requireAuth();
$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// Ensure period_label column exists in timetable
try {
    $db->exec("ALTER TABLE timetable ADD COLUMN IF NOT EXISTS period_label VARCHAR(100) DEFAULT NULL");
} catch (PDOException $e) {
    // Ignore if already exists or not supported
}

if ($method === 'GET') {
    $query = "SELECT t.*, c.name AS class_name 
              FROM timetable t 
              LEFT JOIN classes c ON c.id = t.class_id 
              ORDER BY c.name ASC, t.term ASC, t.start_time ASC, t.id ASC";
    
    $stmt = $db->query($query);
    $rows = $stmt->fetchAll();

    $timetables = [];
    $daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    foreach ($rows as $row) {
        $className = $row['class_name'];
        $term      = $row['term'];
        $label     = $row['period_label'] ?: ($row['start_time'] . ' - ' . $row['end_time']);

        if (!isset($timetables[$className])) {
            $timetables[$className] = [];
        }
        if (!isset($timetables[$className][$term])) {
            $timetables[$className][$term] = [];
        }

        // Find or create the period row in the array
        $foundIndex = -1;
        foreach ($timetables[$className][$term] as $index => $pRow) {
            if ($pRow[0] === $label) {
                $foundIndex = $index;
                break;
            }
        }

        if ($foundIndex === -1) {
            $timetables[$className][$term][] = [$label, ['—', '—', '—', '—', '—']];
            $foundIndex = count($timetables[$className][$term]) - 1;
        }

        $dayIndex = array_search($row['day_of_week'], $daysOfWeek);
        if ($dayIndex !== false) {
            $timetables[$className][$term][$foundIndex][1][$dayIndex] = $row['subject'];
        }
    }

    jsonResponse(['success' => true, 'data' => $timetables]);
}

if ($method === 'POST') {
    requireRole(['Admin']);
    $body = getRequestBody();

    if (empty($body['class_name']) || empty($body['term']) || !isset($body['timetable'])) {
        jsonResponse(['success' => false, 'message' => 'class_name, term, and timetable array are required'], 422);
    }

    $className = $body['class_name'];
    $term      = $body['term'];
    $ttData    = $body['timetable'];

    // Resolve class name to class ID
    $cStmt = $db->prepare("SELECT id FROM classes WHERE name = ?");
    $cStmt->execute([$className]);
    $classRow = $cStmt->fetch();
    if (!$classRow) {
        jsonResponse(['success' => false, 'message' => "Class '$className' not found"], 404);
    }
    $classId = (int)$classRow['id'];

    $db->beginTransaction();
    try {
        // Delete existing timetable for this class and term
        $delStmt = $db->prepare("DELETE FROM timetable WHERE class_id = ? AND term = ?");
        $delStmt->execute([$classId, $term]);

        $insStmt = $db->prepare(
            "INSERT INTO timetable (class_id, subject, day_of_week, start_time, end_time, period_label, term) 
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        );

        $daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        foreach ($ttData as $row) {
            if (!is_array($row) || count($row) < 2) continue;
            $label    = $row[0];
            $subjects = $row[1];

            // Parse start and end times from the label
            $startTime = '00:00:00';
            $endTime   = '00:00:00';
            if (preg_match('/(?:(\d{1,2}):(\d{2}))\s*[–-]\s*(?:(\d{1,2}):(\d{2}))/', $label, $matches)) {
                $startTime = sprintf('%02d:%02d:00', $matches[1], $matches[2]);
                $endTime   = sprintf('%02d:%02d:00', $matches[3], $matches[4]);
            }

            foreach ($subjects as $dayIdx => $subject) {
                if (!isset($daysOfWeek[$dayIdx])) continue;
                $dayName = $daysOfWeek[$dayIdx];

                $insStmt->execute([
                    $classId,
                    $subject ?: '—',
                    $dayName,
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
        jsonResponse(['success' => false, 'message' => 'Failed to save timetable: ' . $e->getMessage()], 500);
    }
}

if ($method === 'DELETE') {
    requireRole(['Admin']);
    $className = $_GET['class_name'] ?? '';
    $term      = $_GET['term'] ?? '';

    if (!$className || !$term) {
        jsonResponse(['success' => false, 'message' => 'class_name and term parameters required'], 422);
    }

    $cStmt = $db->prepare("SELECT id FROM classes WHERE name = ?");
    $cStmt->execute([$className]);
    $classRow = $cStmt->fetch();
    if (!$classRow) {
        jsonResponse(['success' => false, 'message' => "Class '$className' not found"], 404);
    }
    $classId = (int)$classRow['id'];

    $delStmt = $db->prepare("DELETE FROM timetable WHERE class_id = ? AND term = ?");
    $delStmt->execute([$classId, $term]);

    jsonResponse(['success' => true, 'message' => 'Timetable deleted successfully']);
}

jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
