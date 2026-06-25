-- Migration script from 2.2.0 to 2.3.0
-- Add call_time column to Events table and prefill with start_time - 10 minutes

ALTER TABLE `Events` ADD COLUMN `call_time` DATETIME;
UPDATE `Events` SET `call_time` = DATE_SUB(`start_time`, INTERVAL 10 MINUTE);
ALTER TABLE `Events` MODIFY COLUMN `call_time` DATETIME NOT NULL;
