-- ═══════════════════════════════════════════════════════════
-- Migration: Simplify parents — remove redundant parents table
-- Run once via phpMyAdmin or setup_migrate.php
-- ═══════════════════════════════════════════════════════════
USE `glory_regin_school`;

-- 1. Add phone + address to users (extra contact info for parents/staff)
ALTER TABLE `users`
  ADD COLUMN IF NOT EXISTS `phone`   VARCHAR(30)  DEFAULT NULL AFTER `avatar`,
  ADD COLUMN IF NOT EXISTS `address` VARCHAR(255) DEFAULT NULL AFTER `phone`;

-- 2. Recreate parent_student to reference users directly (not parents)
DROP TABLE IF EXISTS `parent_student`;

CREATE TABLE `parent_student` (
  `user_id`    INT NOT NULL,   -- references users.id (role=Parent)
  `student_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `student_id`),
  FOREIGN KEY (`user_id`)    REFERENCES `users`(`id`)    ON DELETE CASCADE,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Drop the redundant parents table
DROP TABLE IF EXISTS `parents`;

-- 4. Seed the parent-student link for existing seed data
--    user005 = serwaa.parent  →  student id 1 (Ama Serwaa)
INSERT IGNORE INTO `parent_student` (`user_id`, `student_id`)
SELECT u.id, s.id
FROM users u, students s
WHERE u.username = 'serwaa.parent' AND s.student_code = '2024-38';
