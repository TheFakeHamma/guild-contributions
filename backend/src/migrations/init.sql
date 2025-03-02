-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    discord_id VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create recruitments table
CREATE TABLE recruitments (
    id SERIAL PRIMARY KEY,
    recruiter_id INT REFERENCES users(id) ON DELETE CASCADE,
    recruit_name VARCHAR(100) NOT NULL,
    recruit_type VARCHAR(10) CHECK (recruit_type IN ('main', 'alt')) NOT NULL, --
    participated_in_raid BOOLEAN DEFAULT FALSE, --
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contributions table
CREATE TABLE contributions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id) ON DELETE CASCADE,
    item_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    amount INT NOT NULL CHECK (amount > 0),
    points_awarded NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaign progress table
CREATE TABLE campaign_progress (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users (id) ON DELETE CASCADE,
    points NUMERIC(5, 2) DEFAULT 0, -- ✅ Allows decimals for total points
    rewards_claimed JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create history log table
CREATE TABLE history_log (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- ✅ Store event like "Recruited JohnDoe", "Removed recruit JohnDoe"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);