<?php
try {
    $db = new PDO('mysql:host=localhost;dbname=glory_regin_school', 'root', '');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. Check if teacher_id column exists, if not add it
    $q = $db->query("SHOW COLUMNS FROM classes LIKE 'teacher_id'");
    if (!$q->fetch()) {
        $db->exec("ALTER TABLE classes ADD COLUMN teacher_id INT DEFAULT NULL");
        echo "Added teacher_id column to classes table.\n";
    } else {
        echo "teacher_id column already exists in classes table.\n";
    }

    // 2. Add foreign key constraint if not exists
    try {
        $db->exec("ALTER TABLE classes ADD CONSTRAINT fk_classes_teacher FOREIGN KEY (teacher_id) REFERENCES staff(id) ON DELETE SET NULL");
        echo "Added foreign key constraint fk_classes_teacher to classes table.\n";
    } catch (PDOException $ex) {
        if (strpos($ex->getMessage(), 'Constraint already exists') !== false || strpos($ex->getMessage(), 'Duplicate key name') !== false) {
            echo "Foreign key constraint already exists.\n";
        } else {
            throw $ex;
        }
    }

    // 3. Map existing class_teacher string values to teacher_id
    // Mr. Amponsah -> 1
    // Mrs. Asante -> 2
    // Mr. Boateng Sr. -> 7
    $mappings = [
        'Mr. Amponsah' => 1,
        'Mrs. Asante' => 2,
        'Mr. Boateng Sr.' => 7
    ];
    foreach ($mappings as $stringVal => $idVal) {
        $stmt = $db->prepare("UPDATE classes SET teacher_id = ? WHERE class_teacher = ? AND teacher_id IS NULL");
        $stmt->execute([$idVal, $stringVal]);
        echo "Mapped '{$stringVal}' to ID {$idVal}.\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
