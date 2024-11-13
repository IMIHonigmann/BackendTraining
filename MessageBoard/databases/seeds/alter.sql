-- ALTER TABLE threads ADD COLUMN message_ids INTEGER[] DEFAULT '{}';
UPDATE threads SET message_ids = ARRAY[3, 2, 1, 5] WHERE id = 1;
UPDATE threads SET message_ids = ARRAY[4, 6, 7] WHERE id = 2;
UPDATE threads SET message_ids = ARRAY[8, 10, 13, 15, 14] WHERE id = 3;
UPDATE threads SET message_ids = ARRAY[9, 11, 12] WHERE id = 4;