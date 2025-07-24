-- Check Current RLS Status and Identify Issues
-- Run this in your Supabase SQL Editor to understand your current RLS setup

-- Step 1: Check which tables exist and their RLS status
SELECT 
  'Table Status' as info,
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity THEN 'RLS ENABLED'
    ELSE 'RLS DISABLED'
  END as status
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('ingredients', 'meals', 'meal_ingredients', 'user_preferences')
ORDER BY tablename;

-- Step 2: Check RLS policies for each table
SELECT 
  'RLS Policies' as info,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('ingredients', 'meals', 'meal_ingredients', 'user_preferences')
ORDER BY tablename, policyname;

-- Step 3: Check table structure for user_id columns
SELECT 
  'Table Structure' as info,
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
AND table_name IN ('ingredients', 'meals', 'meal_ingredients', 'user_preferences')
AND column_name = 'user_id'
ORDER BY table_name;

-- Step 4: Test data access (this will show if RLS is blocking access)
SELECT 
  'Data Access Test' as info,
  'ingredients' as table_name,
  COUNT(*) as record_count
FROM ingredients
UNION ALL
SELECT 
  'Data Access Test' as info,
  'meals' as table_name,
  COUNT(*) as record_count
FROM meals
UNION ALL
SELECT 
  'Data Access Test' as info,
  'meal_ingredients' as table_name,
  COUNT(*) as record_count
FROM meal_ingredients
UNION ALL
SELECT 
  'Data Access Test' as info,
  'user_preferences' as table_name,
  COUNT(*) as record_count
FROM user_preferences;

-- Step 5: Check for potential RLS issues
SELECT 
  'RLS Issue Analysis' as info,
  tablename,
  CASE 
    WHEN rowsecurity AND NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename = t.tablename
    ) THEN 'RLS ENABLED BUT NO POLICIES - THIS WILL BLOCK ALL ACCESS'
    WHEN rowsecurity AND EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename = t.tablename
    ) THEN 'RLS ENABLED WITH POLICIES - CHECK POLICY LOGIC'
    WHEN NOT rowsecurity THEN 'RLS DISABLED - NO SECURITY RESTRICTIONS'
    ELSE 'UNKNOWN STATUS'
  END as issue
FROM pg_tables t
WHERE schemaname = 'public'
AND tablename IN ('ingredients', 'meals', 'meal_ingredients', 'user_preferences');

-- Step 6: Check authentication function availability
SELECT 
  'Auth Function Test' as info,
  'auth.uid() function available' as test,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc 
      WHERE proname = 'uid' 
      AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'auth')
    ) THEN 'YES'
    ELSE 'NO - THIS WILL BREAK RLS POLICIES'
  END as result;

-- Step 7: Provide recommendations based on findings
SELECT 
  'Recommendations' as info,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('ingredients', 'meals', 'meal_ingredients', 'user_preferences')
      AND rowsecurity = true
      AND NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = pg_tables.tablename
      )
    ) THEN 'IMMEDIATE ACTION NEEDED: RLS enabled but no policies - app will be broken'
    WHEN EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('ingredients', 'meals', 'meal_ingredients', 'user_preferences')
      AND rowsecurity = false
    ) THEN 'SAFE: RLS disabled - app should work normally'
    ELSE 'CHECK: RLS enabled with policies - verify policy logic'
  END as recommendation; 