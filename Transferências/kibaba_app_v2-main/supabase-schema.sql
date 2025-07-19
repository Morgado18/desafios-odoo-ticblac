-- User profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  preferences JSONB,
  created_at BIGINT,
  updated_at BIGINT,
  is_deleted BOOLEAN DEFAULT FALSE,
  server_updated_at BIGINT DEFAULT 0
);

-- Cycle data table
CREATE TABLE cycle_data (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  cycle_start_date BIGINT,
  cycle_end_date BIGINT,
  cycle_length INTEGER,
  period_length INTEGER,
  notes TEXT,
  created_at BIGINT,
  updated_at BIGINT,
  is_deleted BOOLEAN DEFAULT FALSE,
  server_updated_at BIGINT DEFAULT 0
);

-- Temperature readings table
CREATE TABLE temperature_readings (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  date BIGINT,
  temperature REAL,
  notes TEXT,
  created_at BIGINT,
  updated_at BIGINT,
  is_deleted BOOLEAN DEFAULT FALSE,
  server_updated_at BIGINT DEFAULT 0
);

-- Symptoms table
CREATE TABLE symptoms (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  date BIGINT,
  symptom_type TEXT,
  intensity INTEGER,
  notes TEXT,
  created_at BIGINT,
  updated_at BIGINT,
  is_deleted BOOLEAN DEFAULT FALSE,
  server_updated_at BIGINT DEFAULT 0
);

-- Notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  date BIGINT,
  content TEXT,
  created_at BIGINT,
  updated_at BIGINT,
  is_deleted BOOLEAN DEFAULT FALSE,
  server_updated_at BIGINT DEFAULT 0
);

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT,
  content TEXT,
  post_type TEXT,
  media_urls JSONB,
  created_at BIGINT,
  updated_at BIGINT,
  is_deleted BOOLEAN DEFAULT FALSE,
  server_updated_at BIGINT DEFAULT 0
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  post_id UUID,
  content TEXT,
  parent_comment_id UUID,
  created_at BIGINT,
  updated_at BIGINT,
  is_deleted BOOLEAN DEFAULT FALSE,
  server_updated_at BIGINT DEFAULT 0
);

-- Add Row Level Security (RLS) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE temperature_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies for each table
CREATE POLICY "Users can read their own data" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own data" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own data" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Repeat similar policies for other tables
