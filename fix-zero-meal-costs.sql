-- Fix meals that have $0.00 total_cost but have ingredients
-- This will update the meal costs for meals that should have costs

-- First, show meals with $0.00 cost that have ingredients
SELECT 
  m.id,
  m.meal_name,
  m.date_cooked,
  m.total_cost as current_cost,
  COUNT(mi.id) as ingredient_count,
  COALESCE(SUM(
    (mi.quantity_used / i.amount_purchased) * i.price
  ), 0) as calculated_cost
FROM meals m
LEFT JOIN meal_ingredients mi ON m.id = mi.meal_id
LEFT JOIN ingredients i ON mi.ingredient_id = i.id
WHERE m.total_cost = 0 AND mi.id IS NOT NULL
GROUP BY m.id, m.meal_name, m.date_cooked, m.total_cost
ORDER BY m.date_cooked DESC;

-- Update meals with $0.00 cost to their correct calculated cost
UPDATE meals 
SET total_cost = (
  SELECT COALESCE(SUM(
    (mi.quantity_used / i.amount_purchased) * i.price
  ), 0)
  FROM meal_ingredients mi
  JOIN ingredients i ON mi.ingredient_id = i.id
  WHERE mi.meal_id = meals.id
)
WHERE total_cost = 0;

-- Verify the fix worked
SELECT 
  m.id,
  m.meal_name,
  m.date_cooked,
  m.total_cost as updated_cost,
  COUNT(mi.id) as ingredient_count
FROM meals m
LEFT JOIN meal_ingredients mi ON m.id = mi.meal_id
GROUP BY m.id, m.meal_name, m.date_cooked, m.total_cost
ORDER BY m.date_cooked DESC; 