-- Check if ingredient usage trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_update_ingredient_usage';

-- Check current ingredient usage vs what it should be
SELECT 
  i.name,
  i.amount_purchased,
  i.amount_used as current_used,
  COALESCE(SUM(mi.quantity_used), 0) as should_be_used
FROM ingredients i
LEFT JOIN meal_ingredients mi ON i.id = mi.ingredient_id
GROUP BY i.id, i.name, i.amount_purchased, i.amount_used
ORDER BY i.name; 