-- Phase 2 Task 2.3: Dashboard Metrics
-- All dashboard calculations in one query

SELECT 
  'Total Value Purchased' as metric,
  SUM(price * amount_purchased) as value
FROM ingredients

UNION ALL

SELECT 
  'Total Value Consumed' as metric,
  COALESCE(SUM((mi.quantity_used / i.amount_purchased) * i.price), 0) as value
FROM meal_ingredients mi
JOIN ingredients i ON mi.ingredient_id = i.id

UNION ALL

SELECT 
  'Unused Value' as metric,
  (SELECT SUM(price * amount_purchased) FROM ingredients) - 
  COALESCE(SUM((mi.quantity_used / i.amount_purchased) * i.price), 0) as value
FROM meal_ingredients mi
JOIN ingredients i ON mi.ingredient_id = i.id

UNION ALL

SELECT 
  'Average Meal Cost' as metric,
  COALESCE(
    SUM((mi.quantity_used / i.amount_purchased) * i.price) / 
    (SELECT COUNT(DISTINCT m.id) FROM meals m), 0
  ) as value
FROM meal_ingredients mi
JOIN ingredients i ON mi.ingredient_id = i.id; 