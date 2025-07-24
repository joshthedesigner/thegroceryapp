-- Add missing total_cost column to meals table
-- This will fix the meal creation error

-- Check if total_cost column exists
SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'meals' 
    AND column_name = 'total_cost'
) as total_cost_exists;

-- Add total_cost column if it doesn't exist
ALTER TABLE meals 
ADD COLUMN IF NOT EXISTS total_cost DECIMAL(10,2) DEFAULT 0;

-- Verify the column was added
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'meals' 
AND column_name = 'total_cost';

-- Update existing meals with calculated costs
UPDATE meals 
SET total_cost = (
    SELECT COALESCE(SUM(
        (mi.quantity_used / i.amount_purchased) * i.price
    ), 0)
    FROM meal_ingredients mi
    JOIN ingredients i ON mi.ingredient_id = i.id
    WHERE mi.meal_id = meals.id
);

-- Show updated meals
SELECT 
    meal_name,
    date_cooked,
    total_cost
FROM meals 
ORDER BY date_cooked DESC; 