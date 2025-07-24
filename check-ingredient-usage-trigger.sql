-- Check if ingredient usage trigger is working
-- This will help us understand why ingredient usage isn't being tracked

-- Check if the trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_update_ingredient_usage';

-- Check current ingredient usage vs what it should be
SELECT 
  i.id,
  i.name,
  i.amount_purchased,
  i.amount_used as current_amount_used,
  i.amount_remaining,
  COALESCE(SUM(mi.quantity_used), 0) as calculated_amount_used,
  CASE 
    WHEN i.amount_used != COALESCE(SUM(mi.quantity_used), 0) 
    THEN 'MISMATCH'
    ELSE 'CORRECT'
  END as status
FROM ingredients i
LEFT JOIN meal_ingredients mi ON i.id = mi.ingredient_id
GROUP BY i.id, i.name, i.amount_purchased, i.amount_used, i.amount_remaining
ORDER BY status DESC, i.name;

-- Show ingredients with usage mismatches
SELECT 
  i.name,
  i.amount_purchased,
  i.amount_used as current_used,
  COALESCE(SUM(mi.quantity_used), 0) as should_be_used,
  (i.amount_used - COALESCE(SUM(mi.quantity_used), 0)) as difference
FROM ingredients i
LEFT JOIN meal_ingredients mi ON i.id = mi.ingredient_id
GROUP BY i.id, i.name, i.amount_purchased, i.amount_used
HAVING i.amount_used != COALESCE(SUM(mi.quantity_used), 0)
ORDER BY ABS(i.amount_used - COALESCE(SUM(mi.quantity_used), 0)) DESC; 