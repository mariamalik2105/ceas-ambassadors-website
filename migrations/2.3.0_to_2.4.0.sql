-- Migration script from 2.3.0 to 2.4.0
-- Add points column to Events table and prefill with start/end duration in hours

ALTER TABLE `Events` ADD COLUMN `points` DOUBLE NOT NULL DEFAULT 0;
UPDATE `Events` SET `points` = TIMESTAMPDIFF(SECOND, start_time, end_time) / 3600 WHERE meeting = 0;
