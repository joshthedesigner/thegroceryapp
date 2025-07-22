-- Fix Welcome Screen for jogold@linkedin.com
-- This script specifically targets the welcome screen issue

-- Step 1: Find the user ID
SELECT 'Finding user ID for jogold@linkedin.com...' as info;
SELECT id, email, created_at FROM auth.users WHERE email = 'jogold@linkedin.com';

-- Step 2: Delete user preferences (this will reset welcome screen)
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
        RAISE NOTICE 'Deleted % user preferences records for user %', deleted_count, user_id;
        
        -- Verify deletion
        IF deleted_count > 0 THEN
            RAISE NOTICE '✅ User preferences deleted successfully';
        ELSE
            RAISE NOTICE 'ℹ️ No user preferences found to delete';
        END IF;
    ELSE
        RAISE NOTICE '❌ User jogold@linkedin.com not found in auth.users';
    END IF;
END $$;

-- Step 3: Verify user preferences are gone
SELECT 'Verifying user preferences are deleted...' as info;
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM user_preferences up
            JOIN auth.users u ON up.user_id = u.id
            WHERE u.email = 'jogold@linkedin.com'
        ) THEN '❌ User preferences still exist'
        ELSE '✅ User preferences successfully deleted'
    END as verification_result;

-- Step 4: Show final status
SELECT 'Fix complete! Welcome screen should now appear on next login.' as status; 