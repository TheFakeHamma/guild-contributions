-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    discord_id VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recruitment table
CREATE TABLE IF NOT EXISTS recruitments (
    id SERIAL PRIMARY KEY,
    recruiter_id INT REFERENCES users(id) ON DELETE CASCADE,
    recruit_name VARCHAR(50) NOT NULL,
    recruit_level INT CHECK (recruit_level = 80),
    points_awarded INT DEFAULT 2,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contributions table
CREATE TABLE IF NOT EXISTS contributions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    item_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    points_awarded FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaign progress table
CREATE TABLE IF NOT EXISTS campaign_progress (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE, -- Make user_id UNIQUE
    points INT DEFAULT 0,
    rewards_claimed JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
