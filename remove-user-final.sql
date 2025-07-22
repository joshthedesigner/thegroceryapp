-- Final script to remove user data for jogold@linkedin.com
-- Based on your existing tables: ingredients, meal_ingredients, meals

-- Step 1: Find the user ID
SELECT id, email FROM auth.users WHERE email = 'jogold@linkedin.com';

-- Step 2: Delete from meals (this will cascade to meal_ingredients)
DELETE FROM meals 
WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email = 'jogold@linkedin.com'
);

-- Step 3: Delete from ingredients
DELETE FROM ingredients 
WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email = 'jogold@linkedin.com'
);

-- Step 4: Create user_preferences table for welcome screen functionality
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    has_seen_welcome BOOLEAN DEFAULT FALSE,
    welcome_completed_at TIMESTAMP WITH TIME ZONE,
    welcome_step_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_preferences
CREATE POLICY "Users can view their own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences" ON user_preferences
    FOR DELETE USING (auth.uid() = user_id);

-- Step 5: Verify deletion
SELECT 'ingredients' as table_name, COUNT(*) as remaining_records
FROM ingredients 
WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email = 'jogold@linkedin.com'
)
UNION ALL
SELECT 'meals' as table_name, COUNT(*) as remaining_records
FROM meals 
WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email = 'jogold@linkedin.com'
)
UNION ALL
SELECT 'user_preferences' as table_name, COUNT(*) as remaining_records
FROM user_preferences 
WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email = 'jogold@linkedin.com'
); 