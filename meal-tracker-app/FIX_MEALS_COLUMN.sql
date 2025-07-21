-- Fix meals table column name mismatch
-- The app expects 'meal_name' but the database has 'name'

-- Step 1: Rename the column from name to meal_name
ALTER TABLE meals RENAME COLUMN name TO meal_name;

-- Step 2: Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'meals' 
AND column_name IN ('meal_name', 'name')
ORDER BY column_name;

-- Step 3: Test the table structure
SELECT * FROM meals LIMIT 1; 