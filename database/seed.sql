-- Seed Players
INSERT INTO players (player_id, name, role, team, email, password, created_at) VALUES
('PLR001', 'Virat Kohli', 'batsman', 'India', 'virat@example.com', '$2a$10$demo_hash_password', NOW()),
('PLR002', 'Rohit Sharma', 'batsman', 'India', 'rohit@example.com', '$2a$10$demo_hash_password', NOW()),
('PLR003', 'Jasprit Bumrah', 'bowler', 'India', 'bumrah@example.com', '$2a$10$demo_hash_password', NOW()),
('PLR004', 'Kane Williamson', 'batsman', 'New Zealand', 'kane@example.com', '$2a$10$demo_hash_password', NOW()),
('PLR005', 'Trent Boult', 'bowler', 'New Zealand', 'boult@example.com', '$2a$10$demo_hash_password', NOW());

-- Note: Password for all demo players is 'demo123'
-- Hash generated with: bcrypt.hash('demo123', 10)

-- Seed Matches
INSERT INTO matches (match_id, team1, team2, venue, match_date, match_type, created_at) VALUES
('M001', 'India', 'Australia', 'Melbourne Cricket Ground', NOW() + INTERVAL '5 days', 'T20', NOW()),
('M002', 'England', 'Pakistan', 'Lord''s', NOW() + INTERVAL '7 days', 'ODI', NOW()),
('M003', 'New Zealand', 'South Africa', 'Eden Park', NOW() + INTERVAL '10 days', 'T20', NOW()),
('M004', 'India', 'England', 'Wankhede Stadium', NOW() + INTERVAL '12 days', 'T20', NOW()),
('M005', 'Australia', 'Pakistan', 'SCG', NOW() + INTERVAL '15 days', 'ODI', NOW());

-- Seed Badges
INSERT INTO badges (name, description, icon_url, criteria) VALUES
('Streak Master', 'Login for 7 consecutive days', '🔥', '{"type": "streak", "value": 7}'),
('Prophet', 'Make 10 correct predictions in a row', '🔮', '{"type": "predictions", "value": 10}'),
('Superfan', 'Earn 1000 leaderboard points', '⭐', '{"type": "points", "value": 1000}'),
('Elite Member', 'Reach top 50 on leaderboard', '👑', '{"type": "rank", "value": 50}'),
('Century', 'Earn 100 predictions', '💯', '{"type": "predictions", "value": 100}');

-- Seed Tasks
INSERT INTO tasks (title, description, task_type, points, correct_answer, active, created_at) VALUES
('Cricket Trivia #1', 'Who hit 6 sixes in an over in T20 World Cup?', 'trivia', 50, 'Yuvraj Singh', true, NOW()),
('Cricket Trivia #2', 'Which country won the first Cricket World Cup?', 'trivia', 50, 'West Indies', true, NOW()),
('Cricket Trivia #3', 'What is the highest individual score in ODI cricket?', 'trivia', 75, '264', true, NOW()),
('Daily Prediction', 'Make a prediction for any upcoming match', 'prediction', 30, NULL, true, NOW()),
('Share Your Best Catch', 'Upload a video of your best catch', 'content_upload', 100, NULL, true, NOW());

-- Seed some demo users (fans)
INSERT INTO users (email, name, google_id, leaderboard_points, current_streak, created_at) VALUES
('fan1@example.com', 'Cricket Fan 1', 'google_id_1', 950, 5, NOW()),
('fan2@example.com', 'Cricket Fan 2', 'google_id_2', 875, 3, NOW()),
('fan3@example.com', 'Cricket Fan 3', 'google_id_3', 820, 7, NOW()),
('fan4@example.com', 'Cricket Fan 4', 'google_id_4', 780, 2, NOW()),
('fan5@example.com', 'Cricket Fan 5', 'google_id_5', 720, 4, NOW());

-- Seed some player stats
INSERT INTO player_stats (player_id, match_id, runs, balls_faced, wickets, overs_bowled, catches, phase) VALUES
(1, 1, 87, 52, 0, 0, 1, 'middle'),
(1, 2, 45, 38, 0, 0, 0, 'powerplay'),
(2, 1, 102, 68, 0, 0, 2, 'death'),
(3, 1, 8, 6, 3, 4.0, 0, 'powerplay'),
(3, 2, 12, 9, 2, 3.5, 1, 'death');

-- Seed practice drills
INSERT INTO practice_drills (player_id, drill_type, description, video_url, weakness_identified, assigned_at) VALUES
(1, 'Cover Drive Practice', 'Work on cover drives against off-spin - current success rate only 40%', 'https://example.com/drill1', 'Cover drives vs spin', NOW()),
(2, 'Pull Shot Drill', 'Practice pull shots against short pitch deliveries', 'https://example.com/drill2', 'Short ball handling', NOW()),
(3, 'Yorker Practice', 'Improve yorker accuracy at death - current accuracy 75%', 'https://example.com/drill3', 'Death over yorkers', NOW());
