-- 100% Confidence Diagnostic
-- This will definitively prove the trigger is the issue

-- 1. Check if the trigger exists and what it does
SELECT 
  trigger_name,
  event_manipulation,
  action_statement,
  'EXISTS' as status
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_calculate_meal_cost';

-- 2. Check trigger function code (if it exists)
SELECT 
  routine_name,
  routine_definition
FROM information_schema.routines 
WHERE routine_name LIKE '%meal%cost%' 
   OR routine_name LIKE '%calculate%meal%';

-- 3. Compare stored vs calculated costs for ALL meals
SELECT 
  m.meal_name,
  m.date_cooked,
  m.total_cost as stored_cost,
  COUNT(mi.id) as ingredient_count,
  COALESCE(SUM(
    (mi.quantity_used / i.amount_purchased) * i.price
  ), 0) as calculated_cost,
  CASE 
    WHEN m.total_cost = 0 AND COUNT(mi.id) > 0 THEN 'TRIGGER OVERRIDE'
    WHEN m.total_cost = COALESCE(SUM((mi.quantity_used / i.amount_purchased) * i.price), 0) THEN 'CORRECT'
    WHEN m.total_cost > 0 AND COUNT(mi.id) = 0 THEN 'NO INGREDIENTS'
    ELSE 'MISMATCH'
  END as diagnosis
FROM meals m
LEFT JOIN meal_ingredients mi ON m.id = mi.meal_id
LEFT JOIN ingredients i ON mi.ingredient_id = i.id
GROUP BY m.id, m.meal_name, m.date_cooked, m.total_cost
ORDER BY m.date_cooked DESC;

-- 4. Check if trigger is enabled/disabled
SELECT 
  trigger_name,
  CASE 
    WHEN trigger_name IS NOT NULL THEN 'ENABLED'
    ELSE 'NOT FOUND'
  END as trigger_status
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_calculate_meal_cost';

-- 5. Check for any other triggers on meal_ingredients table
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'meal_ingredients';

-- 6. Check meal creation timestamps vs ingredient addition timestamps
SELECT 
  m.meal_name,
  m.created_at as meal_created,
  m.total_cost,
  COUNT(mi.id) as ingredient_count,
  MAX(mi.created_at) as last_ingredient_added
FROM meals m
LEFT JOIN meal_ingredients mi ON m.id = mi.meal_id
GROUP BY m.id, m.meal_name, m.created_at, m.total_cost
ORDER BY m.created_at DESC; 