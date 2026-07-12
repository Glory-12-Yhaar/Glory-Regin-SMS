<?php
$db = new PDO('mysql:host=localhost;dbname=glory_regin_school', 'root', '');
echo "Sample subjects:\n";
$stmt = $db->query("SELECT s.*, c.name as class_name FROM subjects s LEFT JOIN classes c ON c.id = s.class_id LIMIT 10");
foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
    print_r($row);
}
