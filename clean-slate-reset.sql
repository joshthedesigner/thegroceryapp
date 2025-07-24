-- Clean slate reset - Delete all data and start fresh
-- This will remove all data but keep the table structure

-- Step 1: Disable triggers temporarily to avoid interference
ALTER TABLE meal_ingredients DISABLE TRIGGER trigger_calculate_meal_cost;

-- Step 2: Delete all data from all tables (in correct order due to foreign keys)
DELETE FROM meal_ingredients;
DELETE FROM meals;
DELETE FROM ingredients;
DELETE FROM user_preferences;

-- Step 3: Reset any auto-increment sequences (if any)
-- Note: UUID tables don't need sequence resets

-- Step 4: Verify all tables are empty
SELECT 'meals' as table_name, COUNT(*) as row_count FROM meals
UNION ALL
SELECT 'ingredients' as table_name, COUNT(*) as row_count FROM ingredients
UNION ALL
SELECT 'meal_ingredients' as table_name, COUNT(*) as row_count FROM meal_ingredients
UNION ALL
SELECT 'user_preferences' as table_name, COUNT(*) as row_count FROM user_preferences;

-- Step 5: Re-enable triggers (optional - you can leave disabled if you prefer)
-- ALTER TABLE meal_ingredients ENABLE TRIGGER trigger_calculate_meal_cost; 