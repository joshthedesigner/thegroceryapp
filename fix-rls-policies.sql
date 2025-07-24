-- Re-enable RLS with permissive policies
-- This is similar to what we did before to fix the GET/INSERT problem

-- Re-enable RLS on all tables
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_ingredients ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate them to be permissive
DROP POLICY IF EXISTS "Allow all operations on ingredients" ON ingredients;
DROP POLICY IF EXISTS "Allow all operations on meals" ON meals;
DROP POLICY IF EXISTS "Allow all operations on meal_ingredients" ON meal_ingredients;

-- Create permissive policies that allow all operations
CREATE POLICY "Allow all operations on ingredients" ON ingredients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on meals" ON meals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on meal_ingredients" ON meal_ingredients FOR ALL USING (true) WITH CHECK (true);

-- Verify RLS is enabled with policies
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('meals', 'meal_ingredients', 'ingredients')
AND schemaname = 'public'; 