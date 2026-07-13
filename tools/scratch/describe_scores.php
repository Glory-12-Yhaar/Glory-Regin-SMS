<?php
$db = new PDO('mysql:host=localhost;dbname=glory_regin_school', 'root', '');
echo "student_scores columns:\n";
foreach ($db->query("DESCRIBE student_scores")->fetchAll() as $r) {
    echo " {$r['Field']} | {$r['Type']}\n";
}
echo "\nSample data:\n";
foreach ($db->query("SELECT * FROM student_scores LIMIT 3")->fetchAll() as $r) {
    echo print_r($r, true);
}
