-- Test meal data retrieval to see if the issue is in the data or frontend
-- This will help us understand why the line graph shows 0

-- Check all meals with their costs
SELECT 
  m.id,
  m.meal_name,
  m.date_cooked,
  m.total_cost,
  COUNT(mi.id) as ingredient_count,
  COALESCE(SUM(
    (mi.quantity_used / i.amount_purchased) * i.price
  ), 0) as calculated_cost
FROM meals m
LEFT JOIN meal_ingredients mi ON m.id = mi.meal_id
LEFT JOIN ingredients i ON mi.ingredient_id = i.id
GROUP BY m.id, m.meal_name, m.date_cooked, m.total_cost
ORDER BY m.date_cooked DESC;

-- Check recent meals specifically
SELECT 
  m.meal_name,
  m.date_cooked,
  m.total_cost,
  COUNT(mi.id) as ingredients_used
FROM meals m
LEFT JOIN meal_ingredients mi ON m.id = mi.meal_id
WHERE m.date_cooked >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY m.id, m.meal_name, m.date_cooked, m.total_cost
ORDER BY m.date_cooked DESC;

-- Check if any meals have 0 cost but have ingredients
SELECT 
  m.meal_name,
  m.date_cooked,
  m.total_cost,
  COUNT(mi.id) as ingredient_count
FROM meals m
LEFT JOIN meal_ingredients mi ON m.id = mi.meal_id
WHERE m.total_cost = 0 AND mi.id IS NOT NULL
GROUP BY m.id, m.meal_name, m.date_cooked, m.total_cost; 