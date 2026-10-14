-- Migration script from 2.5.0 to 2.6.0
-- Track which semester each member's current rotation status belongs to

ALTER TABLE `Members`
ADD COLUMN `rotation_term` VARCHAR(20) NULL;

UPDATE `Members`
SET `rotation_term` = 'fall-2026'
WHERE `id` > 0
  AND `rotation_term` IS NULL;