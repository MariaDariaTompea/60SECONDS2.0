-- 60Seconds2.0 Database Schema Initialization
-- Target: Supabase (PostgreSQL)

-- 1. Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Characters Definition Table
CREATE TABLE neighborhood_roster (
    char_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    base_iq INTEGER DEFAULT 5,
    base_strength INTEGER DEFAULT 5,
    base_patience INTEGER DEFAULT 5,
    perk_id VARCHAR(50),
    unlocked_by_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Narrative Story Pool
CREATE TABLE story_pool (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    requirements JSONB DEFAULT '{}',
    outcomes JSONB DEFAULT '{}',
    category VARCHAR(50),
    rarity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Active Game States
CREATE TABLE game_states (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    current_day INTEGER DEFAULT 0,
    inventory JSONB DEFAULT '{}',
    characters JSONB DEFAULT '[]', -- List of CharacterInstance objects
    log JSONB DEFAULT '[]',        -- Daily journal history
    entropy_weight FLOAT DEFAULT 1.0,
    is_active BOOLEAN DEFAULT true,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Global Achievements & Meta-Progression
CREATE TABLE achievements (
    slug VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    requirement_type VARCHAR(50),
    reward_tokens INTEGER DEFAULT 0
);

-- 6. User Progress (Tokens and Unlocks)
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    tokens INTEGER DEFAULT 0,
    unlocked_chars TEXT[] DEFAULT '{}',
    completed_achievements TEXT[] DEFAULT '{}'
);

-- 7. Insert Initial Neighborhood Roster
INSERT INTO neighborhood_roster (char_id, name, base_iq, base_strength, base_patience, unlocked_by_default) VALUES
('arthur_miller', 'Arthur Miller', 8, 4, 3, true),
('dolores_gray', 'Dolores Gray', 5, 5, 8, true),
('mary_jane', 'Mary Jane', 4, 7, 5, true),
('timmy_miller', 'Timmy Miller', 3, 3, 4, true),
('sam_neighborhood', 'Sam (The Neighbor)', 9, 2, 6, false);

-- Enable Row Level Security (RLS)
ALTER TABLE game_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Owner-only access)
CREATE POLICY "Users can view own game states" ON game_states 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own game states" ON game_states 
    FOR UPDATE USING (auth.uid() = user_id);
