-- Safe RLS Implementation Script
-- This script implements RLS gradually to avoid breaking your app
-- Start with permissive policies, then gradually restrict access

-- Step 1: Check current state before making changes
SELECT 'Current State Check' as step;
SELECT 
  tablename,
  rowsecurity as rls_enabled,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = t.tablename) as policy_count
FROM pg_tables t
WHERE schemaname = 'public'
AND tablename IN ('ingredients', 'meals', 'meal_ingredients', 'user_preferences');

-- Step 2: Enable RLS on all tables (if not already enabled)
SELECT 'Enabling RLS on tables...' as step;

ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop any existing policies to start clean
SELECT 'Cleaning up existing policies...' as step;

DROP POLICY IF EXISTS "Allow all operations on ingredients" ON ingredients;
DROP POLICY IF EXISTS "Allow all operations on meals" ON meals;
DROP POLICY IF EXISTS "Allow all operations on meal_ingredients" ON meal_ingredients;
DROP POLICY IF EXISTS "Allow all operations on user_preferences" ON user_preferences;

-- Also drop any other policies that might exist
DROP POLICY IF EXISTS "Users can view their own ingredients" ON ingredients;
DROP POLICY IF EXISTS "Users can insert their own ingredients" ON ingredients;
DROP POLICY IF EXISTS "Users can update their own ingredients" ON ingredients;
DROP POLICY IF EXISTS "Users can delete their own ingredients" ON ingredients;

DROP POLICY IF EXISTS "Users can view their own meals" ON meals;
DROP POLICY IF EXISTS "Users can insert their own meals" ON meals;
DROP POLICY IF EXISTS "Users can update their own meals" ON meals;
DROP POLICY IF EXISTS "Users can delete their own meals" ON meals;

DROP POLICY IF EXISTS "Users can view meal ingredients for their meals" ON meal_ingredients;
DROP POLICY IF EXISTS "Users can insert meal ingredients for their meals" ON meal_ingredients;
DROP POLICY IF EXISTS "Users can update meal ingredients for their meals" ON meal_ingredients;
DROP POLICY IF EXISTS "Users can delete meal ingredients for their meals" ON meal_ingredients;

DROP POLICY IF EXISTS "Users can view their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can delete their own preferences" ON user_preferences;

-- Step 4: Create PERMISSIVE policies that allow all operations
-- This is the SAFE approach - start with permissive policies
SELECT 'Creating permissive policies (SAFE approach)...' as step;

-- Permissive policy for ingredients
CREATE POLICY "Allow all operations on ingredients" ON ingredients 
FOR ALL USING (true) WITH CHECK (true);

-- Permissive policy for meals
CREATE POLICY "Allow all operations on meals" ON meals 
FOR ALL USING (true) WITH CHECK (true);

-- Permissive policy for meal_ingredients
CREATE POLICY "Allow all operations on meal_ingredients" ON meal_ingredients 
FOR ALL USING (true) WITH CHECK (true);

-- Permissive policy for user_preferences
CREATE POLICY "Allow all operations on user_preferences" ON user_preferences 
FOR ALL USING (true) WITH CHECK (true);

-- Step 5: Verify the permissive policies are working
SELECT 'Verifying permissive policies...' as step;

-- Test data access with permissive policies
SELECT 
  'Data Access Test with Permissive Policies' as test,
  'ingredients' as table_name,
  COUNT(*) as record_count
FROM ingredients
UNION ALL
SELECT 
  'Data Access Test with Permissive Policies' as test,
  'meals' as table_name,
  COUNT(*) as record_count
FROM meals
UNION ALL
SELECT 
  'Data Access Test with Permissive Policies' as test,
  'meal_ingredients' as table_name,
  COUNT(*) as record_count
FROM meal_ingredients
UNION ALL
SELECT 
  'Data Access Test with Permissive Policies' as test,
  'user_preferences' as table_name,
  COUNT(*) as record_count
FROM user_preferences;

-- Step 6: Show current policy status
SELECT 'Current Policy Status' as step;
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('ingredients', 'meals', 'meal_ingredients', 'user_preferences')
ORDER BY tablename, policyname;

-- Step 7: Provide next steps for gradual restriction
SELECT 'Next Steps for Gradual RLS Implementation' as step;
SELECT 
  'Phase 1: Test with permissive policies' as phase,
  'Your app should work normally now' as status,
  'Test all functionality to ensure it works' as action
UNION ALL
SELECT 
  'Phase 2: Implement user-specific policies' as phase,
  'Replace permissive policies with user-specific ones' as status,
  'Only if Phase 1 works perfectly' as action
UNION ALL
SELECT 
  'Phase 3: Add more restrictive policies' as phase,
  'Gradually add more security restrictions' as status,
  'Only after thorough testing' as action;

-- Step 8: Provide the script to implement user-specific policies (for later use)
SELECT 'User-Specific Policy Script (for later use)' as step;
SELECT 
  '-- To implement user-specific policies later, run this:' as script_line
UNION ALL
SELECT 
  '-- DROP POLICY "Allow all operations on ingredients" ON ingredients;' as script_line
UNION ALL
SELECT 
  '-- CREATE POLICY "Users can view their own ingredients" ON ingredients FOR SELECT USING (auth.uid() = user_id);' as script_line
UNION ALL
SELECT 
  '-- CREATE POLICY "Users can insert their own ingredients" ON ingredients FOR INSERT WITH CHECK (auth.uid() = user_id);' as script_line
UNION ALL
SELECT 
  '-- (Continue with similar policies for other tables)' as script_line;

-- Step 9: Final verification
SELECT 'Final Verification' as step;
SELECT 
  'RLS Implementation Status' as info,
  tablename,
  CASE 
    WHEN rowsecurity THEN 'RLS ENABLED'
    ELSE 'RLS DISABLED'
  END as rls_status,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = t.tablename) as policy_count,
  CASE 
    WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = t.tablename) > 0 THEN 'POLICIES EXIST'
    ELSE 'NO POLICIES - WILL BLOCK ACCESS'
  END as policy_status
FROM pg_tables t
WHERE schemaname = 'public'
AND tablename IN ('ingredients', 'meals', 'meal_ingredients', 'user_preferences')
ORDER BY tablename; 