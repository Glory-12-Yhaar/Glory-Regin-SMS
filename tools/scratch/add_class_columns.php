<?php
try {
    $db = new PDO('mysql:host=localhost;dbname=glory_regin_school', 'root', '');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. Add capacity column if not exists
    $q = $db->query("SHOW COLUMNS FROM classes LIKE 'capacity'");
    if (!$q->fetch()) {
        $db->exec("ALTER TABLE classes ADD COLUMN capacity INT DEFAULT 40");
        echo "Added capacity column to classes table.\n";
    } else {
        echo "capacity column already exists in classes table.\n";
    }

    // 2. Add stream column if not exists
    $q = $db->query("SHOW COLUMNS FROM classes LIKE 'stream'");
    if (!$q->fetch()) {
        $db->exec("ALTER TABLE classes ADD COLUMN stream VARCHAR(50) DEFAULT 'General'");
        echo "Added stream column to classes table.\n";
    } else {
        echo "stream column already exists in classes table.\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
