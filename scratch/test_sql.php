<?php
require_once 'c:/xampp/htdocs/Glory-Regin-SMS/api/config/database.php';
$db = getDB();

$sqls = [
"CREATE TABLE IF NOT EXISTS `hero_slides` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `caption` TEXT,
  `image` LONGTEXT NOT NULL,
  `status` ENUM('Active', 'Draft') DEFAULT 'Active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB",

"CREATE TABLE IF NOT EXISTS `news_articles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `icon` VARCHAR(10),
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100),
  `date` DATE,
  `desc` TEXT,
  `status` ENUM('Published', 'Draft') DEFAULT 'Published',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB",

"CREATE TABLE IF NOT EXISTS `yearbooks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `year` VARCHAR(10) UNIQUE NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `cover_img` VARCHAR(255) DEFAULT 'var(--blue-main)',
  `status` ENUM('Published', 'Draft') DEFAULT 'Draft',
  `total_grads` INT DEFAULT 0,
  `total_photos` INT DEFAULT 0,
  `data` LONGTEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB"
];

foreach ($sqls as $idx => $sql) {
    try {
        $db->exec($sql);
        echo "Query $idx succeeded.\n";
    } catch (Exception $e) {
        echo "Query $idx failed: " . $e->getMessage() . "\n";
    }
}
