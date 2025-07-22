-- Check User Preferences for jogold@linkedin.com
-- Run this in Supabase SQL Editor to see current state

-- Step 1: Find the user ID
SELECT 'Finding user ID for jogold@linkedin.com...' as info;
SELECT id, email, created_at FROM auth.users WHERE email = 'jogold@linkedin.com';

-- Step 2: Check user preferences
SELECT 'Checking user preferences...' as info;
SELECT 
    up.*,
    u.email
FROM user_preferences up
JOIN auth.users u ON up.user_id = u.id
WHERE u.email = 'jogold@linkedin.com';

-- Step 3: Check if user preferences exist
SELECT 'Checking if user preferences exist...' as info;
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM user_preferences up
            JOIN auth.users u ON up.user_id = u.id
            WHERE u.email = 'jogold@linkedin.com'
        ) THEN 'User preferences EXIST'
        ELSE 'User preferences DO NOT EXIST'
    END as status;

-- Step 4: Show all user preferences for this user
SELECT 'All user preferences for this user:' as info;
SELECT 
    up.user_id,
    up.has_seen_welcome,
    up.welcome_completed_at,
    up.welcome_step_completed,
    up.created_at,
    up.updated_at
FROM user_preferences up
JOIN auth.users u ON up.user_id = u.id
WHERE u.email = 'jogold@linkedin.com'; 