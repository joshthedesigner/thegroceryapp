-- Check RLS policies that might be blocking meal data retrieval
-- This will help us understand why GET operations are failing

-- Check if RLS is enabled on tables
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('meals', 'meal_ingredients', 'ingredients')
AND schemaname = 'public';

-- Check RLS policies on meals table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'meals'
AND schemaname = 'public';

-- Check RLS policies on meal_ingredients table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'meal_ingredients'
AND schemaname = 'public';

-- Check RLS policies on ingredients table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'ingredients'
AND schemaname = 'public';

-- Test if we can access meals data directly
SELECT COUNT(*) as meals_count FROM meals;

-- Test if we can access meal_ingredients data directly
SELECT COUNT(*) as meal_ingredients_count FROM meal_ingredients;

-- Test if we can access ingredients data directly
SELECT COUNT(*) as ingredients_count FROM ingredients; 