-- Test Ingredient Usage Trigger
-- This will verify that the trigger is working correctly

-- Step 1: Check current state before test
SELECT 
  'BEFORE TEST' as test_phase,
  i.name,
  i.amount_purchased,
  i.amount_used,
  COALESCE(SUM(mi.quantity_used), 0) as total_used_in_meals
FROM ingredients i
LEFT JOIN meal_ingredients mi ON i.id = mi.ingredient_id
GROUP BY i.id, i.name, i.amount_purchased, i.amount_used
ORDER BY i.name;

-- Step 2: Test the trigger by adding a meal ingredient
-- (This will be done manually in the app to test the trigger)

-- Step 3: Check state after adding a meal ingredient
SELECT 
  'AFTER TEST' as test_phase,
  i.name,
  i.amount_purchased,
  i.amount_used,
  COALESCE(SUM(mi.quantity_used), 0) as total_used_in_meals,
  CASE 
    WHEN i.amount_used = COALESCE(SUM(mi.quantity_used), 0) THEN 'TRIGGER WORKING'
    ELSE 'TRIGGER NOT WORKING'
  END as trigger_status
FROM ingredients i
LEFT JOIN meal_ingredients mi ON i.id = mi.ingredient_id
GROUP BY i.id, i.name, i.amount_purchased, i.amount_used
ORDER BY i.name;

-- Step 4: Show recent meal ingredients to verify data
SELECT 
  m.meal_name,
  i.name as ingredient_name,
  mi.quantity_used,
  i.amount_used as current_ingredient_used,
  i.amount_purchased,
  ROUND((i.amount_used / i.amount_purchased) * 100, 1) as usage_percentage
FROM meals m
JOIN meal_ingredients mi ON m.id = mi.meal_id
JOIN ingredients i ON mi.ingredient_id = i.id
ORDER BY m.created_at DESC
LIMIT 10; 