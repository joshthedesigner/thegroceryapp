-- Simple script to remove user data for jogold@linkedin.com
-- Run this in your Supabase SQL Editor

-- Step 1: Find the user ID
SELECT id, email FROM auth.users WHERE email = 'jogold@linkedin.com';

-- Step 2: Delete user preferences (welcome screen data)
DELETE FROM user_preferences 
WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email = 'jogold@linkedin.com'
);

-- Step 3: Delete meals (this will cascade to meal_ingredients)
DELETE FROM meals 
WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email = 'jogold@linkedin.com'
);

-- Step 4: Delete ingredients
DELETE FROM ingredients 
WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email = 'jogold@linkedin.com'
);

-- Step 5: Verify all data is removed
SELECT 'user_preferences' as table_name, COUNT(*) as count FROM user_preferences WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'jogold@linkedin.com')
UNION ALL
SELECT 'meals' as table_name, COUNT(*) as count FROM meals WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'jogold@linkedin.com')
UNION ALL
SELECT 'ingredients' as table_name, COUNT(*) as count FROM ingredients WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'jogold@linkedin.com'); 