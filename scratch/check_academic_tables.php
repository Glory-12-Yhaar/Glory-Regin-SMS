<?php
$db = new PDO('mysql:host=localhost;dbname=glory_regin_school', 'root', '');
echo "TABLES IN DATABASE:\n";
foreach ($db->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN) as $t) {
    echo " - $t\n";
}
echo "\nGRADES TABLE CHECK:\n";
$exists = $db->query("SHOW TABLES LIKE 'grades'")->fetchColumn();
echo $exists ? "grades table EXISTS\n" : "grades table DOES NOT EXIST\n";

echo "\nASSIGNMENTS COUNT:\n";
echo $db->query("SELECT COUNT(*) FROM assignments")->fetchColumn() . " assignments\n";

echo "\nATTENDANCE COUNT:\n";
echo $db->query("SELECT COUNT(*) FROM attendance")->fetchColumn() . " attendance records\n";

echo "\nCLASSES:\n";
foreach ($db->query("SELECT id, name FROM classes ORDER BY id")->fetchAll() as $r) {
    echo " - ID: {$r['id']} | {$r['name']}\n";
}

echo "\nSUBJECTS COUNT:\n";
echo $db->query("SELECT COUNT(*) FROM subjects")->fetchColumn() . " subjects\n";
