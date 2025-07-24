-- Phase 2 Task 2.2: Ingredient Usage Tracking
-- Calculate total usage and remaining amount for each ingredient

SELECT 
  i.name,
  i.amount_purchased,
  i.price,
  COALESCE(SUM(mi.quantity_used), 0) as total_used,
  (i.amount_purchased - COALESCE(SUM(mi.quantity_used), 0)) as remaining,
  CASE 
    WHEN i.amount_purchased > 0 THEN 
      (COALESCE(SUM(mi.quantity_used), 0) / i.amount_purchased * 100)
    ELSE 0 
  END as usage_percentage
FROM ingredients i
LEFT JOIN meal_ingredients mi ON i.id = mi.ingredient_id
GROUP BY i.id, i.name, i.amount_purchased, i.price
ORDER BY usage_percentage DESC; 