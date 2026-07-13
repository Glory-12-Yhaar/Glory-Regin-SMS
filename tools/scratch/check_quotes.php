<?php
$sql = file_get_contents('c:/xampp/htdocs/Glory-Regin-SMS/database/schema.sql');
$pos = strpos($sql, 'CREATE TABLE IF NOT EXISTS `yearbooks`');
$chunk = substr($sql, $pos, 350);
for ($i = 0; $i < strlen($chunk); $i++) {
    $c = $chunk[$i];
    $o = ord($c);
    if ($o >= 32 && $o <= 126) {
        echo "$c: " . dechex($o) . "\n";
    } else {
        echo "NON-ASCII (" . dechex($o) . ")\n";
    }
}
