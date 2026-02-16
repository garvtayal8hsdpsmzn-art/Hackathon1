-- Create database
CREATE DATABASE cricvibe;

-- Connect to database
\\c cricvibe;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users (Fans) Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    google_id VARCHAR(255) UNIQUE,
    leaderboard_points INT DEFAULT 0,
    current_streak INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Players Table
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    player_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50), -- batsman, bowler, all-rounder, wicket-keeper
    team VARCHAR(100),
    avatar_url TEXT,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Matches Table
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    match_id VARCHAR(100) UNIQUE NOT NULL,
    team1 VARCHAR(100) NOT NULL,
    team2 VARCHAR(100) NOT NULL,
    venue VARCHAR(255),
    match_date TIMESTAMP,
    match_type VARCHAR(50), -- T20, ODI, Test
    result TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Player Stats Table
CREATE TABLE player_stats (
    id SERIAL PRIMARY KEY,
    player_id INT REFERENCES players(id) ON DELETE CASCADE,
    match_id INT REFERENCES matches(id) ON DELETE CASCADE,
    runs INT DEFAULT 0,
    balls_faced INT DEFAULT 0,
    wickets INT DEFAULT 0,
    overs_bowled DECIMAL(4,1) DEFAULT 0,
    catches INT DEFAULT 0,
    phase VARCHAR(50), -- powerplay, middle, death
    created_at TIMESTAMP DEFAULT NOW()
);

-- Predictions Table
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    match_id INT REFERENCES matches(id) ON DELETE CASCADE,
    prediction_type VARCHAR(50), -- winner, top_scorer, mom
    prediction_value TEXT,
    is_correct BOOLEAN,
    points_earned INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Fantasy Teams Table
CREATE TABLE fantasy_teams (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    match_id INT REFERENCES matches(id) ON DELETE CASCADE,
    team_name VARCHAR(255),
    player_ids INT[],
    total_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Badges Table
CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    criteria JSONB -- {type: 'streak', value: 7}
);

-- User Badges Table
CREATE TABLE user_badges (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    badge_id INT REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Leaderboard History Table
CREATE TABLE leaderboard_history (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    points INT NOT NULL,
    rank INT NOT NULL,
    period VARCHAR(50), -- weekly, monthly, all-time
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- Chat Messages Table
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    sender_id INT,
    sender_type VARCHAR(20), -- 'fan' or 'player'
    receiver_id INT,
    message TEXT NOT NULL,
    is_group_chat BOOLEAN DEFAULT FALSE,
    group_id INT,
    sent_at TIMESTAMP DEFAULT NOW()
);

-- Tasks/Trivia Table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(50), -- trivia, prediction, content_upload
    points INT NOT NULL,
    correct_answer TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Tasks Table
CREATE TABLE user_tasks (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
    answer TEXT,
    is_correct BOOLEAN,
    points_earned INT DEFAULT 0,
    completed_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, task_id)
);

-- Practice Drills Table
CREATE TABLE practice_drills (
    id SERIAL PRIMARY KEY,
    player_id INT REFERENCES players(id) ON DELETE CASCADE,
    drill_type VARCHAR(100),
    description TEXT,
    video_url TEXT,
    weakness_identified VARCHAR(255),
    assigned_at TIMESTAMP DEFAULT NOW()
);

-- Opposition Dossiers Table
CREATE TABLE opposition_dossiers (
    id SERIAL PRIMARY KEY,
    player_id INT REFERENCES players(id) ON DELETE CASCADE,
    opponent_player_id INT,
    opponent_team VARCHAR(100),
    insights JSONB, -- {bowling_tendencies: [], batting_weaknesses: []}
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX idx_users_points ON users(leaderboard_points DESC);
CREATE INDEX idx_predictions_user ON predictions(user_id);
CREATE INDEX idx_predictions_match ON predictions(match_id);
CREATE INDEX idx_fantasy_teams_user ON fantasy_teams(user_id);
CREATE INDEX idx_player_stats_player ON player_stats(player_id);
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_user_badges_user ON user_badges(user_id);
