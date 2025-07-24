-- Re-enable RLS on all tables with proper policies
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_ingredients ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate them to be more permissive
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

-- Create more permissive policies that allow all operations
CREATE POLICY "Allow all operations on ingredients" ON ingredients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on meals" ON meals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on meal_ingredients" ON meal_ingredients FOR ALL USING (true) WITH CHECK (true); 