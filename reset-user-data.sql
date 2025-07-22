-- Reset User Data for jogold@linkedin.com
-- This script safely removes all user data and resets welcome state
-- Run this in your Supabase SQL Editor

-- Step 1: Find the user ID
SELECT 'Finding user ID for jogold@linkedin.com...' as info;
SELECT id, email, created_at FROM auth.users WHERE email = 'jogold@linkedin.com';

-- Step 2: Delete from user_preferences (welcome screen data)
DO $$
DECLARE
    user_id UUID;
    deleted_count INTEGER;
BEGIN
    -- Get user ID
    SELECT id INTO user_id FROM auth.users WHERE email = 'jogold@linkedin.com';
    
    IF user_id IS NOT NULL THEN
        -- Delete user preferences
        DELETE FROM user_preferences WHERE user_id = user_id;
        GET DIAGNOSTICS deleted_count = ROW_COUNT;
        RAISE NOTICE 'Deleted % records from user_preferences for user %', deleted_count, user_id;
    ELSE
        RAISE NOTICE 'User jogold@linkedin.com not found in auth.users';
    END IF;
END $$;

-- Step 3: Delete from meals (this will cascade to meal_ingredients)
DO $$
DECLARE
    user_id UUID;
    deleted_count INTEGER;
BEGIN
    -- Get user ID
    SELECT id INTO user_id FROM auth.users WHERE email = 'jogold@linkedin.com';
    
    IF user_id IS NOT NULL THEN
        -- Delete meals
        DELETE FROM meals WHERE user_id = user_id;
        GET DIAGNOSTICS deleted_count = ROW_COUNT;
        RAISE NOTICE 'Deleted % records from meals for user %', deleted_count, user_id;
    ELSE
        RAISE NOTICE 'User jogold@linkedin.com not found in auth.users';
    END IF;
END $$;

-- Step 4: Delete from ingredients
DO $$
DECLARE
    user_id UUID;
    deleted_count INTEGER;
BEGIN
    -- Get user ID
    SELECT id INTO user_id FROM auth.users WHERE email = 'jogold@linkedin.com';
    
    IF user_id IS NOT NULL THEN
        -- Delete ingredients
        DELETE FROM ingredients WHERE user_id = user_id;
        GET DIAGNOSTICS deleted_count = ROW_COUNT;
        RAISE NOTICE 'Deleted % records from ingredients for user %', deleted_count, user_id;
    ELSE
        RAISE NOTICE 'User jogold@linkedin.com not found in auth.users';
    END IF;
END $$;

-- Step 5: Verify all data is removed
SELECT 'Verifying data removal...' as info;

SELECT 
    'user_preferences' as table_name,
    COUNT(*) as remaining_records
FROM user_preferences 
WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email = 'jogold@linkedin.com'
)
UNION ALL
SELECT 
    'meals' as table_name,
    COUNT(*) as remaining_records
FROM meals 
WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email = 'jogold@linkedin.com'
)
UNION ALL
SELECT 
    'ingredients' as table_name,
    COUNT(*) as remaining_records
FROM ingredients 
WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email = 'jogold@linkedin.com'
);

-- Step 6: Show final status
SELECT 'Reset complete! User data removed successfully.' as status; 