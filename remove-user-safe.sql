-- Safe script to remove user data for jogold@linkedin.com
-- This script handles cases where tables might not exist

-- Step 1: Find the user ID
SELECT id, email FROM auth.users WHERE email = 'jogold@linkedin.com';

-- Step 2: Delete from user_preferences (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_preferences') THEN
        DELETE FROM user_preferences 
        WHERE user_id IN (
            SELECT id FROM auth.users 
            WHERE email = 'jogold@linkedin.com'
        );
        RAISE NOTICE 'Deleted from user_preferences';
    ELSE
        RAISE NOTICE 'user_preferences table does not exist, skipping';
    END IF;
END $$;

-- Step 3: Delete from meals (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'meals') THEN
        DELETE FROM meals 
        WHERE user_id IN (
            SELECT id FROM auth.users 
            WHERE email = 'jogold@linkedin.com'
        );
        RAISE NOTICE 'Deleted from meals';
    ELSE
        RAISE NOTICE 'meals table does not exist, skipping';
    END IF;
END $$;

-- Step 4: Delete from ingredients (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ingredients') THEN
        DELETE FROM ingredients 
        WHERE user_id IN (
            SELECT id FROM auth.users 
            WHERE email = 'jogold@linkedin.com'
        );
        RAISE NOTICE 'Deleted from ingredients';
    ELSE
        RAISE NOTICE 'ingredients table does not exist, skipping';
    END IF;
END $$;

-- Step 5: Verify what tables exist and their data
SELECT 'Tables that exist:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_preferences', 'meals', 'ingredients')
ORDER BY table_name; 