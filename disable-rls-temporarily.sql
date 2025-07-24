-- Temporarily disable RLS to test if that fixes the GET issue
-- This will help us determine if RLS is blocking the meal data retrieval

-- Disable RLS on meals table
ALTER TABLE meals DISABLE ROW LEVEL SECURITY;

-- Disable RLS on meal_ingredients table  
ALTER TABLE meal_ingredients DISABLE ROW LEVEL SECURITY;

-- Disable RLS on ingredients table
ALTER TABLE ingredients DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('meals', 'meal_ingredients', 'ingredients')
AND schemaname = 'public'; 