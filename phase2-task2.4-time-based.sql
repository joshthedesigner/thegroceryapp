-- Phase 2 Task 2.4: Time-based Calculations
-- Daily consumption for line graph

SELECT 
  m.date_cooked,
  SUM((mi.quantity_used / i.amount_purchased) * i.price) as daily_consumption
FROM meals m
JOIN meal_ingredients mi ON m.id = mi.meal_id
JOIN ingredients i ON mi.ingredient_id = i.id
GROUP BY m.date_cooked
ORDER BY m.date_cooked DESC; 