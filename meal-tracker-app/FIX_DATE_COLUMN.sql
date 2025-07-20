-- Fix meals table date column name
-- The app expects 'date_cooked' but the database has 'meal_date'

-- Step 1: Rename the column from meal_date to date_cooked
ALTER TABLE meals RENAME COLUMN meal_date TO date_cooked;

-- Step 2: Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'meals' 
AND column_name IN ('date_cooked', 'meal_date')
ORDER BY column_name;

-- Step 3: Test the query that was failing
SELECT * FROM meals LIMIT 1; 