-- Check user_preferences RLS Policy Status
-- Run this in Supabase SQL Editor to see what's blocking the welcome screen

-- Step 1: Check if user_preferences table exists and RLS status
SELECT 
  'user_preferences table status' as check_type,
  tablename,
  rowsecurity as rls_enabled,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'user_preferences') as policy_count
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'user_preferences';

-- Step 2: Check what policies exist on user_preferences
SELECT 
  'user_preferences policies' as check_type,
  policyname,
  permissive,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename = 'user_preferences'
ORDER BY policyname;

-- Step 3: Test if we can access user_preferences (this will show RLS blocking)
SELECT 
  'user_preferences access test' as check_type,
  COUNT(*) as record_count
FROM user_preferences;

-- Step 4: Check if there are any user_preferences records
SELECT 
  'user_preferences data check' as check_type,
  user_id,
  has_seen_welcome,
  welcome_completed_at,
  created_at
FROM user_preferences
LIMIT 5;

-- Step 5: Test authentication function
SELECT 
  'auth.uid() function test' as check_type,
  CASE 
    WHEN auth.uid() IS NOT NULL THEN 'auth.uid() returns: ' || auth.uid()::text
    ELSE 'auth.uid() returns NULL'
  END as auth_result;

-- Step 6: Provide fix if needed
SELECT 
  'recommendation' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename = 'user_preferences'
      AND rowsecurity = true
      AND NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'user_preferences'
      )
    ) THEN 'IMMEDIATE FIX NEEDED: RLS enabled but no policies - this blocks all access'
    WHEN EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename = 'user_preferences'
      AND rowsecurity = false
    ) THEN 'SAFE: RLS disabled - no security restrictions'
    ELSE 'CHECK: RLS enabled with policies - verify policy logic'
  END as recommendation; 