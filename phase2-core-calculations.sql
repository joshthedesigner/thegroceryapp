-- Phase 2: Core Calculations Implementation
-- All calculations derive from the same data points

-- Task 2.1: Meal Cost Calculation
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

-- Task 2.2: Ingredient Usage Tracking
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

-- Task 2.3: Dashboard Metrics
-- Total Value Purchased
SELECT 
  'Total Value Purchased' as metric,
  SUM(price * amount_purchased) as value
FROM ingredients;

-- Total Value Consumed (sum of all meal costs)
SELECT 
  'Total Value Consumed' as metric,
  COALESCE(SUM((mi.quantity_used / i.amount_purchased) * i.price), 0) as value
FROM meal_ingredients mi
JOIN ingredients i ON mi.ingredient_id = i.id;

-- Unused Value
SELECT 
  'Unused Value' as metric,
  (SELECT SUM(price * amount_purchased) FROM ingredients) - 
  COALESCE(SUM((mi.quantity_used / i.amount_purchased) * i.price), 0) as value
FROM meal_ingredients mi
JOIN ingredients i ON mi.ingredient_id = i.id;

-- Average Meal Cost
SELECT 
  'Average Meal Cost' as metric,
  COALESCE(
    SUM((mi.quantity_used / i.amount_purchased) * i.price) / 
    (SELECT COUNT(DISTINCT m.id) FROM meals m), 0
  ) as value
FROM meal_ingredients mi
JOIN ingredients i ON mi.ingredient_id = i.id;

-- Task 2.4: Time-based Calculations
-- Daily consumption for line graph
SELECT 
  m.date_cooked,
  SUM((mi.quantity_used / i.amount_purchased) * i.price) as daily_consumption
FROM meals m
JOIN meal_ingredients mi ON m.id = mi.meal_id
JOIN ingredients i ON mi.ingredient_id = i.id
GROUP BY m.date_cooked
ORDER BY m.date_cooked DESC; 