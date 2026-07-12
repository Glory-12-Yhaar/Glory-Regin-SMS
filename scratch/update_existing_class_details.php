<?php
try {
    $db = new PDO('mysql:host=localhost;dbname=glory_regin_school', 'root', '');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Update JHS
    $db->exec("UPDATE classes SET stream = 'Mixed', capacity = 50 WHERE name LIKE 'JHS%'");
    // Update Basic
    $db->exec("UPDATE classes SET stream = 'General', capacity = 45 WHERE name LIKE 'Basic%'");
    // Update Creche
    $db->exec("UPDATE classes SET stream = 'General', capacity = 30 WHERE name LIKE 'Creche%'");
    // Update Nursery
    $db->exec("UPDATE classes SET stream = 'General', capacity = 35 WHERE name LIKE 'Nursery%'");
    // Update KG
    $db->exec("UPDATE classes SET stream = 'General', capacity = 40 WHERE name LIKE 'KG%'");

    echo "Successfully updated existing classes with default capacity and streams.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
