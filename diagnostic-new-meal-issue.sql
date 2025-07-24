-- Diagnostic for new meal and ingredient usage issues
-- Check what's happening when you add ingredients and meals

-- 1. Check current ingredients
SELECT 
  name,
  price,
  amount_purchased,
  amount_used,
  created_at
FROM ingredients 
ORDER BY created_at DESC;

-- 2. Check current meals
SELECT 
  meal_name,
  date_cooked,
  total_cost,
  created_at
FROM meals 
ORDER BY created_at DESC;

-- 3. Check meal_ingredients relationships
SELECT 
  m.meal_name,
  i.name as ingredient_name,
  mi.quantity_used,
  i.amount_purchased,
  i.price,
  (mi.quantity_used / i.amount_purchased) * i.price as calculated_cost
FROM meals m
JOIN meal_ingredients mi ON m.id = mi.meal_id
JOIN ingredients i ON mi.ingredient_id = i.id
ORDER BY m.created_at DESC;

-- 4. Check if trigger is still disabled
SELECT 
  trigger_name,
  CASE 
    WHEN trigger_name IS NOT NULL THEN 'EXISTS'
    ELSE 'NOT FOUND'
  END as trigger_status
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_calculate_meal_cost';

-- 5. Check ingredient usage calculation
SELECT 
  i.name,
  i.amount_purchased,
  i.amount_used,
  COALESCE(SUM(mi.quantity_used), 0) as total_used_in_meals,
  CASE 
    WHEN i.amount_used = COALESCE(SUM(mi.quantity_used), 0) THEN 'CORRECT'
    ELSE 'MISMATCH'
  END as usage_status
FROM ingredients i
LEFT JOIN meal_ingredients mi ON i.id = mi.ingredient_id
GROUP BY i.id, i.name, i.amount_purchased, i.amount_used; 