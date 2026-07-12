<?php
$db = new PDO('mysql:host=localhost;dbname=glory_regin_school', 'root', '');
echo "STAFF RECORDS IN DATABASE:\n";
foreach ($db->query("SELECT id, name, category, status FROM staff")->fetchAll() as $row) {
    echo " - ID: " . $row['id'] . " | Name: " . $row['name'] . " | Category: " . $row['category'] . " | Status: " . $row['status'] . "\n";
}
