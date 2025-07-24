-- Update meal costs to fix line graph
UPDATE meals 
SET total_cost = (
  SELECT COALESCE(SUM(
    (mi.quantity_used / i.amount_purchased) * i.price
  ), 0)
  FROM meal_ingredients mi
  JOIN ingredients i ON mi.ingredient_id = i.id
  WHERE mi.meal_id = meals.id
);

-- Show updated meal costs
SELECT 
  m.meal_name,
  m.date_cooked,
  m.total_cost
FROM meals m
ORDER BY m.date_cooked DESC; 