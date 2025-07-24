-- Phase 1 Task 1.2: Add Sample Data
-- Inserting test data to verify table structure and constraints

-- Step 1: Insert test ingredients (using a test user_id)
INSERT INTO ingredients (user_id, name, price, amount_purchased) VALUES
('11111111-1111-1111-1111-111111111111', 'Chicken Breast', 12.99, 2.0),
('11111111-1111-1111-1111-111111111111', 'Rice', 3.99, 5.0),
('11111111-1111-1111-1111-111111111111', 'Broccoli', 2.49, 1.5),
('11111111-1111-1111-1111-111111111111', 'Olive Oil', 8.99, 1.0),
('11111111-1111-1111-1111-111111111111', 'Garlic', 1.99, 0.5);

-- Step 2: Insert test meals
INSERT INTO meals (user_id, meal_name, date_cooked) VALUES
('11111111-1111-1111-1111-111111111111', 'Chicken Stir Fry', '2025-07-23'),
('11111111-1111-1111-1111-111111111111', 'Rice Bowl', '2025-07-22'),
('11111111-1111-1111-1111-111111111111', 'Simple Pasta', '2025-07-21');

-- Step 3: Insert test meal_ingredients relationships
-- Chicken Stir Fry ingredients
INSERT INTO meal_ingredients (meal_id, ingredient_id, quantity_used) 
SELECT m.id, i.id, 0.5
FROM meals m, ingredients i 
WHERE m.meal_name = 'Chicken Stir Fry' AND i.name = 'Chicken Breast';

INSERT INTO meal_ingredients (meal_id, ingredient_id, quantity_used) 
SELECT m.id, i.id, 0.25
FROM meals m, ingredients i 
WHERE m.meal_name = 'Chicken Stir Fry' AND i.name = 'Rice';

INSERT INTO meal_ingredients (meal_id, ingredient_id, quantity_used) 
SELECT m.id, i.id, 0.5
FROM meals m, ingredients i 
WHERE m.meal_name = 'Chicken Stir Fry' AND i.name = 'Broccoli';

-- Rice Bowl ingredients
INSERT INTO meal_ingredients (meal_id, ingredient_id, quantity_used) 
SELECT m.id, i.id, 0.5
FROM meals m, ingredients i 
WHERE m.meal_name = 'Rice Bowl' AND i.name = 'Rice';

-- Simple Pasta ingredients
INSERT INTO meal_ingredients (meal_id, ingredient_id, quantity_used) 
SELECT m.id, i.id, 0.25
FROM meals m, ingredients i 
WHERE m.meal_name = 'Simple Pasta' AND i.name = 'Olive Oil';

-- Step 4: Verify data integrity and constraints work
SELECT 'Ingredients count:' as info, COUNT(*) as count FROM ingredients
UNION ALL
SELECT 'Meals count:', COUNT(*) FROM meals
UNION ALL
SELECT 'Meal ingredients count:', COUNT(*) FROM meal_ingredients;

-- Step 5: Test unique constraints (should fail)
-- This should fail due to unique constraint
-- INSERT INTO ingredients (user_id, name, price, amount_purchased) VALUES
-- ('11111111-1111-1111-1111-111111111111', 'Chicken Breast', 15.99, 3.0); 