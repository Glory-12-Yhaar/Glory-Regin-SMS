<?php
$db = new PDO('mysql:host=localhost;dbname=glory_regin_school', 'root', '');
echo "ALL STAFF:\n";
$staff = $db->query("SELECT id, name, category, status FROM staff")->fetchAll(PDO::FETCH_ASSOC);
foreach ($staff as $s) {
    echo "  Staff ID: {$s['id']} | Name: '{$s['name']}' | Cat: {$s['category']} | Status: {$s['status']}\n";
}
