-- Fix meal total_cost calculations
-- This script checks and recalculates meal costs based on their ingredients

-- 1. First, let's see the current state of meal costs
SELECT 
  m.id,
  m.meal_name,
  m.date_cooked,
  m.total_cost as current_total_cost,
  COUNT(mi.id) as ingredient_count,
  COALESCE(SUM(mi.quantity_used), 0) as total_quantity_used
FROM meals m
LEFT JOIN meal_ingredients mi ON m.id = mi.meal_id
GROUP BY m.id, m.meal_name, m.date_cooked, m.total_cost
ORDER BY m.date_cooked DESC;

-- 2. Calculate what the total_cost should be for each meal
SELECT 
  m.id,
  m.meal_name,
  m.date_cooked,
  m.total_cost as current_cost,
  COALESCE(SUM(
    (mi.quantity_used / i.amount_purchased) * i.price
  ), 0) as calculated_cost,
  CASE 
    WHEN m.total_cost != COALESCE(SUM((mi.quantity_used / i.amount_purchased) * i.price), 0) 
    THEN 'MISMATCH'
    ELSE 'CORRECT'
  END as status
FROM meals m
LEFT JOIN meal_ingredients mi ON m.id = mi.meal_id
LEFT JOIN ingredients i ON mi.ingredient_id = i.id
GROUP BY m.id, m.meal_name, m.date_cooked, m.total_cost
ORDER BY m.date_cooked DESC;

-- 3. Update all meal costs to their correct calculated values
UPDATE meals 
SET total_cost = (
  SELECT COALESCE(SUM(
    (mi.quantity_used / i.amount_purchased) * i.price
  ), 0)
  FROM meal_ingredients mi
  JOIN ingredients i ON mi.ingredient_id = i.id
  WHERE mi.meal_id = meals.id
);

-- 4. Verify the fix worked
SELECT 
  m.id,
  m.meal_name,
  m.date_cooked,
  m.total_cost as updated_total_cost,
  COUNT(mi.id) as ingredient_count,
  COALESCE(SUM(mi.quantity_used), 0) as total_quantity_used
FROM meals m
LEFT JOIN meal_ingredients mi ON m.id = mi.meal_id
GROUP BY m.id, m.meal_name, m.date_cooked, m.total_cost
ORDER BY m.date_cooked DESC;

-- 5. Show meals with their ingredients and costs
SELECT 
  m.meal_name,
  m.date_cooked,
  m.total_cost as meal_cost,
  i.name as ingredient_name,
  mi.quantity_used,
  i.unit,
  i.price as ingredient_price,
  (mi.quantity_used / i.amount_purchased) * i.price as ingredient_cost
FROM meals m
JOIN meal_ingredients mi ON m.id = mi.meal_id
JOIN ingredients i ON mi.ingredient_id = i.id
ORDER BY m.date_cooked DESC, m.meal_name; 