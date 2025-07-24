-- Check Database Trigger Status
-- This will diagnose why meal costs aren't being calculated

-- 1. Check if the meal cost calculation trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  action_statement,
  CASE 
    WHEN trigger_name IS NOT NULL THEN 'EXISTS'
    ELSE 'NOT FOUND'
  END as trigger_status
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_calculate_meal_cost';

-- 2. Check if the trigger function exists
SELECT 
  routine_name,
  routine_definition
FROM information_schema.routines 
WHERE routine_name LIKE '%calculate_meal_cost%';

-- 3. Check if the trigger is enabled or disabled
SELECT 
  trigger_name,
  CASE 
    WHEN trigger_name IS NOT NULL THEN 'ENABLED'
    ELSE 'NOT FOUND'
  END as trigger_status
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_calculate_meal_cost';

-- 4. Check all triggers on meal_ingredients table
SELECT 
  trigger_name,
  event_manipulation,
  action_statement,
  'EXISTS' as status
FROM information_schema.triggers 
WHERE event_object_table = 'meal_ingredients';

-- 5. Check current meal costs vs calculated costs
SELECT 
  m.meal_name,
  m.date_cooked,
  m.total_cost as stored_cost,
  COUNT(mi.id) as ingredient_count,
  COALESCE(SUM(
    (mi.quantity_used / i.amount_purchased) * i.price
  ), 0) as calculated_cost,
  CASE 
    WHEN m.total_cost = 0 AND COUNT(mi.id) > 0 THEN 'TRIGGER NOT WORKING'
    WHEN m.total_cost = COALESCE(SUM((mi.quantity_used / i.amount_purchased) * i.price), 0) THEN 'CORRECT'
    WHEN m.total_cost > 0 AND COUNT(mi.id) = 0 THEN 'NO INGREDIENTS'
    ELSE 'MISMATCH'
  END as diagnosis
FROM meals m
LEFT JOIN meal_ingredients mi ON m.id = mi.meal_id
LEFT JOIN ingredients i ON mi.ingredient_id = i.id
GROUP BY m.id, m.meal_name, m.date_cooked, m.total_cost
ORDER BY m.date_cooked DESC;

-- 6. Check if there are any meal_ingredients records
SELECT 
  COUNT(*) as total_meal_ingredients,
  COUNT(DISTINCT meal_id) as unique_meals,
  COUNT(DISTINCT ingredient_id) as unique_ingredients
FROM meal_ingredients;

-- 7. Show sample meal_ingredients data
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
ORDER BY m.created_at DESC
LIMIT 10; 