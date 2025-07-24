-- Fix ingredient usage tracking
-- Update all ingredient amount_used to the correct calculated values

UPDATE ingredients 
SET amount_used = (
  SELECT COALESCE(SUM(mi.quantity_used), 0)
  FROM meal_ingredients mi
  WHERE mi.ingredient_id = ingredients.id
);

-- Show the results
SELECT 
  i.name,
  i.amount_purchased,
  i.amount_used as updated_used,
  COALESCE(SUM(mi.quantity_used), 0) as should_be_used
FROM ingredients i
LEFT JOIN meal_ingredients mi ON i.id = mi.ingredient_id
GROUP BY i.id, i.name, i.amount_purchased, i.amount_used
ORDER BY i.name; 