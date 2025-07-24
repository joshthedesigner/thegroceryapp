-- Show current ingredient usage state
SELECT 
  i.name,
  i.amount_purchased,
  i.amount_used as current_used,
  COALESCE(SUM(mi.quantity_used), 0) as should_be_used
FROM ingredients i
LEFT JOIN meal_ingredients mi ON i.id = mi.ingredient_id
GROUP BY i.id, i.name, i.amount_purchased, i.amount_used
ORDER BY i.name; 