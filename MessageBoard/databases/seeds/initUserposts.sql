CREATE TABLE IF NOT EXISTS userposts (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    text TEXT,
    username VARCHAR(255),
    added DATE
);

INSERT INTO userposts (text, username, added) 
VALUES
    ('Hi there!', 'Amando', '2022-01-14'),
    ('Hello Gooners!', 'Charles', '2023-06-23'),
    ('What a beautiful day!', 'Jane', '2021-04-15'),
    ('Sliding into DMs is fun!', 'Dave', '2022-11-27'),
    ('Hilfe, verliebt in Rias Gremory 😭', 'Maria', '2023-08-09'),
    ('Exploring the world of beserk!', 'Albert', '2022-06-05'),
    ('Just finished Attack on Titan 💃', 'Sophie', '2023-09-15'),
    ('Liverpool vs Arsenal tonight! ⚽', 'Marcus', '2023-12-23'),
    ('Finally reached Diamond in League! 🎮', 'Alex', '2023-10-30'),
    ('Working on my coding project 💻', 'Linda', '2024-01-05'),
    ('One Piece chapter 1054 was amazing! 🏴‍☠️', 'Kai', '2023-07-21'),
    ('Missing summer days ☀️', 'Emma', '2023-11-12'),
    ('Who else loves Chainsaw Man? 🪚', 'Tyler', '2024-02-01'),
    ('Just got a new gaming PC setup! 🖥️', 'Ryan', '2023-08-28'),
    ('Heute ist ein schöner Tag! 🌞', 'Hans', '2023-12-05'),
    ('Anyone watching the new anime season? 📺', 'Nina', '2024-01-15')
    ;

ALTER TABLE userposts ADD COLUMN likes INTEGER DEFAULT 0;