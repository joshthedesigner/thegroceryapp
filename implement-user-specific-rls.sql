-- Implement User-Specific RLS Policies
-- WARNING: Only run this AFTER testing with permissive policies
-- This script replaces permissive policies with user-specific ones

-- Step 1: Verify we're ready to implement user-specific policies
SELECT 'Pre-Implementation Check' as step;
SELECT 
  'Before implementing user-specific policies, verify:' as check_item
UNION ALL
SELECT 
  '- Your app works perfectly with permissive policies' as check_item
UNION ALL
SELECT 
  '- Authentication is working properly' as check_item
UNION ALL
SELECT 
  '- All CRUD operations work as expected' as check_item
UNION ALL
SELECT 
  '- You have tested all app functionality' as check_item;

-- Step 2: Drop permissive policies
SELECT 'Dropping permissive policies...' as step;

DROP POLICY IF EXISTS "Allow all operations on ingredients" ON ingredients;
DROP POLICY IF EXISTS "Allow all operations on meals" ON meals;
DROP POLICY IF EXISTS "Allow all operations on meal_ingredients" ON meal_ingredients;
DROP POLICY IF EXISTS "Allow all operations on user_preferences" ON user_preferences;

-- Step 3: Create user-specific policies for ingredients
SELECT 'Creating user-specific policies for ingredients...' as step;

CREATE POLICY "Users can view their own ingredients" ON ingredients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ingredients" ON ingredients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ingredients" ON ingredients
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ingredients" ON ingredients
    FOR DELETE USING (auth.uid() = user_id);

-- Step 4: Create user-specific policies for meals
SELECT 'Creating user-specific policies for meals...' as step;

CREATE POLICY "Users can view their own meals" ON meals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meals" ON meals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals" ON meals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals" ON meals
    FOR DELETE USING (auth.uid() = user_id);

-- Step 5: Create user-specific policies for meal_ingredients
SELECT 'Creating user-specific policies for meal_ingredients...' as step;

-- For meal_ingredients, we need to check that the user owns the meal
CREATE POLICY "Users can view meal ingredients for their meals" ON meal_ingredients
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM meals 
            WHERE meals.id = meal_ingredients.meal_id 
            AND meals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert meal ingredients for their meals" ON meal_ingredients
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM meals 
            WHERE meals.id = meal_ingredients.meal_id 
            AND meals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update meal ingredients for their meals" ON meal_ingredients
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM meals 
            WHERE meals.id = meal_ingredients.meal_id 
            AND meals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete meal ingredients for their meals" ON meal_ingredients
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM meals 
            WHERE meals.id = meal_ingredients.meal_id 
            AND meals.user_id = auth.uid()
        )
    );

-- Step 6: Create user-specific policies for user_preferences
SELECT 'Creating user-specific policies for user_preferences...' as step;

CREATE POLICY "Users can view their own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences" ON user_preferences
    FOR DELETE USING (auth.uid() = user_id);

-- Step 7: Verify all policies are created
SELECT 'Verifying user-specific policies...' as step;
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

-- Step 8: Test data access with user-specific policies
SELECT 'Testing data access with user-specific policies...' as step;

-- This will only return data for the authenticated user
SELECT 
  'User-Specific Data Access Test' as test,
  'ingredients' as table_name,
  COUNT(*) as record_count
FROM ingredients
UNION ALL
SELECT 
  'User-Specific Data Access Test' as test,
  'meals' as table_name,
  COUNT(*) as record_count
FROM meals
UNION ALL
SELECT 
  'User-Specific Data Access Test' as test,
  'meal_ingredients' as table_name,
  COUNT(*) as record_count
FROM meal_ingredients
UNION ALL
SELECT 
  'User-Specific Data Access Test' as test,
  'user_preferences' as table_name,
  COUNT(*) as record_count
FROM user_preferences;

-- Step 9: Provide rollback instructions
SELECT 'Rollback Instructions' as step;
SELECT 
  'If user-specific policies break your app, run this to rollback:' as instruction
UNION ALL
SELECT 
  '-- DROP POLICY "Users can view their own ingredients" ON ingredients;' as rollback_sql
UNION ALL
SELECT 
  '-- DROP POLICY "Users can insert their own ingredients" ON ingredients;' as rollback_sql
UNION ALL
SELECT 
  '-- DROP POLICY "Users can update their own ingredients" ON ingredients;' as rollback_sql
UNION ALL
SELECT 
  '-- DROP POLICY "Users can delete their own ingredients" ON ingredients;' as rollback_sql
UNION ALL
SELECT 
  '-- (Repeat for all other tables)' as rollback_sql
UNION ALL
SELECT 
  '-- CREATE POLICY "Allow all operations on ingredients" ON ingredients FOR ALL USING (true) WITH CHECK (true);' as rollback_sql
UNION ALL
SELECT 
  '-- (Repeat for all other tables)' as rollback_sql;

-- Step 10: Final status check
SELECT 'Final Status Check' as step;
SELECT 
  'User-Specific RLS Implementation Complete' as status,
  tablename,
  CASE 
    WHEN rowsecurity THEN 'RLS ENABLED'
    ELSE 'RLS DISABLED'
  END as rls_status,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = t.tablename) as policy_count,
  CASE 
    WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = t.tablename) >= 4 THEN 'USER-SPECIFIC POLICIES'
    WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = t.tablename) > 0 THEN 'SOME POLICIES'
    ELSE 'NO POLICIES - WILL BLOCK ACCESS'
  END as policy_status
FROM pg_tables t
WHERE schemaname = 'public'
AND tablename IN ('ingredients', 'meals', 'meal_ingredients', 'user_preferences')
ORDER BY tablename; 