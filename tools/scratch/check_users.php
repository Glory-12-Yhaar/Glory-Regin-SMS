<?php
$db = new PDO('mysql:host=localhost;dbname=glory_regin_school', 'root', '');
echo "USERS TABLE COLUMNS:\n";
foreach ($db->query('DESCRIBE users')->fetchAll() as $row) {
    echo " - " . $row['Field'] . " (" . $row['Type'] . ")\n";
}
echo "\nPARENTS TABLE COLUMNS:\n";
foreach ($db->query('DESCRIBE parents')->fetchAll() as $row) {
    echo " - " . $row['Field'] . " (" . $row['Type'] . ")\n";
}
