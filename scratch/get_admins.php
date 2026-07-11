<?php
$db = new PDO('mysql:host=localhost;dbname=glory_regin_school', 'root', '');
echo "USERS:\n";
foreach ($db->query("SELECT id, username, role, email FROM users")->fetchAll() as $row) {
    echo " - " . $row['username'] . " (" . $row['role'] . ") | Email: " . $row['email'] . "\n";
}
