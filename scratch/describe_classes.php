<?php
$db = new PDO('mysql:host=localhost;dbname=glory_regin_school', 'root', '');
echo "classes columns:\n";
foreach ($db->query("DESCRIBE classes")->fetchAll() as $r) {
    echo " {$r['Field']} | {$r['Type']}\n";
}
echo "\nforeign keys on classes/subjects:\n";
// we can check FK by querying INFORMATION_SCHEMA
$stmt = $db->query("SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE REFERENCED_TABLE_SCHEMA = 'glory_regin_school' AND TABLE_NAME IN ('classes', 'subjects')");
foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
    print_r($row);
}
