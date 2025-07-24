-- Phase 2 Task 2.1: Meal Cost Calculation
-- Calculate meal cost using: (quantity_used ÷ amount_purchased) × price

SELECT 
  m.meal_name,
  m.date_cooked,
  SUM((mi.quantity_used / i.amount_purchased) * i.price) as calculated_meal_cost
FROM meals m
JOIN meal_ingredients mi ON m.id = mi.meal_id
JOIN ingredients i ON mi.ingredient_id = i.id
GROUP BY m.id, m.meal_name, m.date_cooked
ORDER BY m.date_cooked DESC; 