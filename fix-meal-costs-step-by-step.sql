-- Fix meal costs step by step
-- Update each meal individually to avoid connection issues

-- Step 1: Update PAPRILA meal cost
UPDATE meals 
SET total_cost = (
  SELECT COALESCE(SUM((mi.quantity_used / i.amount_purchased) * i.price), 0)
  FROM meal_ingredients mi
  JOIN ingredients i ON mi.ingredient_id = i.id
  WHERE mi.meal_id = meals.id
)
WHERE meal_name = 'PAPRILA';

-- Step 2: Update "final test" meal cost
UPDATE meals 
SET total_cost = (
  SELECT COALESCE(SUM((mi.quantity_used / i.amount_purchased) * i.price), 0)
  FROM meal_ingredients mi
  JOIN ingredients i ON mi.ingredient_id = i.id
  WHERE mi.meal_id = meals.id
)
WHERE meal_name = 'final test';

-- Step 3: Update "test-josh" meal cost
UPDATE meals 
SET total_cost = (
  SELECT COALESCE(SUM((mi.quantity_used / i.amount_purchased) * i.price), 0)
  FROM meal_ingredients mi
  JOIN ingredients i ON mi.ingredient_id = i.id
  WHERE mi.meal_id = meals.id
)
WHERE meal_name = 'test-josh';

-- Step 4: Verify the fix worked
SELECT 
  meal_name,
  total_cost as updated_cost
FROM meals 
WHERE meal_name IN ('PAPRILA', 'final test', 'test-josh')
ORDER BY meal_name; 