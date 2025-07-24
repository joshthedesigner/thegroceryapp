-- Test connection stability
-- Run this to understand why complex queries fail

-- Test 1: Simple query (should work)
SELECT 'Test 1: Simple query' as test;
SELECT COUNT(*) as meals_count FROM meals;

-- Test 2: Slightly complex query (should work)
SELECT 'Test 2: Join query' as test;
SELECT m.meal_name, COUNT(mi.id) as ingredient_count
FROM meals m
LEFT JOIN meal_ingredients mi ON m.id = mi.meal_id
GROUP BY m.id, m.meal_name
LIMIT 3;

-- Test 3: Complex query (might fail)
SELECT 'Test 3: Complex calculation' as test;
SELECT 
  m.meal_name,
  m.total_cost,
  COALESCE(SUM((mi.quantity_used / i.amount_purchased) * i.price), 0) as calculated_cost
FROM meals m
LEFT JOIN meal_ingredients mi ON m.id = mi.meal_id
LEFT JOIN ingredients i ON mi.ingredient_id = i.id
GROUP BY m.id, m.meal_name, m.total_cost
LIMIT 3;

-- Test 4: Check current session
SELECT 'Test 4: Session info' as test;
SELECT 
  current_database() as db,
  current_schema() as schema,
  current_user as user,
  session_user as session_user; 