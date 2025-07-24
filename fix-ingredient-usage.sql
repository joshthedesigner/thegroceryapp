-- Fix ingredient usage tracking
-- Update all ingredient amount_used to the correct calculated values

-- First, show what will be updated
SELECT 
  i.name,
  i.amount_purchased,
  i.amount_used as current_used,
  COALESCE(SUM(mi.quantity_used), 0) as should_be_used,
  (COALESCE(SUM(mi.quantity_used), 0) - i.amount_used) as difference
FROM ingredients i
LEFT JOIN meal_ingredients mi ON i.id = mi.ingredient_id
GROUP BY i.id, i.name, i.amount_purchased, i.amount_used
HAVING i.amount_used != COALESCE(SUM(mi.quantity_used), 0)
ORDER BY ABS(COALESCE(SUM(mi.quantity_used), 0) - i.amount_used) DESC;

-- Update all ingredient usage to correct values
UPDATE ingredients 
SET amount_used = (
  SELECT COALESCE(SUM(mi.quantity_used), 0)
  FROM meal_ingredients mi
  WHERE mi.ingredient_id = ingredients.id
);

-- Verify the fix worked
SELECT 
  i.name,
  i.amount_purchased,
  i.amount_used as updated_used,
  COALESCE(SUM(mi.quantity_used), 0) as should_be_used,
  CASE 
    WHEN i.amount_used = COALESCE(SUM(mi.quantity_used), 0) 
    THEN 'FIXED'
    ELSE 'STILL WRONG'
  END as status
FROM ingredients i
LEFT JOIN meal_ingredients mi ON i.id = mi.ingredient_id
GROUP BY i.id, i.name, i.amount_purchased, i.amount_used
ORDER BY i.name; 