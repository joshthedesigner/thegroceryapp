-- Remove user data for jogold@linkedin.com
-- This script will delete all data associated with this user

-- First, find the user ID for jogold@linkedin.com
-- Note: You'll need to replace 'USER_ID_HERE' with the actual UUID from your database

-- Delete from user_preferences (welcome screen data)
DELETE FROM user_preferences 
WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email = 'jogold@linkedin.com'
);

-- Delete from meal_ingredients (this will cascade from meals)
-- No need to delete directly as it will be handled by CASCADE

-- Delete from meals (this will cascade to meal_ingredients)
DELETE FROM meals 
WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email = 'jogold@linkedin.com'
);

-- Delete from ingredients
DELETE FROM ingredients 
WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email = 'jogold@linkedin.com'
);

-- Optional: Delete the user from auth.users (if you want to completely remove the user)
-- WARNING: This will completely remove the user account
-- DELETE FROM auth.users WHERE email = 'jogold@linkedin.com';

-- Verify deletion
SELECT 
    'ingredients' as table_name,
    COUNT(*) as remaining_records
FROM ingredients 
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
    'user_preferences' as table_name,
    COUNT(*) as remaining_records
FROM user_preferences 
WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email = 'jogold@linkedin.com'
); 