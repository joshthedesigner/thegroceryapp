-- Simple test data for the meal tracker app
-- This script adds basic test data to verify the trigger works

-- Clear any existing test data first
DELETE FROM meal_ingredients WHERE meal_id IN (
  SELECT id FROM meals WHERE meal_name LIKE 'Test%'
);
DELETE FROM meals WHERE meal_name LIKE 'Test%';
DELETE FROM ingredients WHERE name IN ('Test Chicken Breast', 'Test Rice');

-- Add test ingredients
INSERT INTO ingredients (
    user_id,
    name,
    unit,
    amount_purchased,
    price,
    purchase_date,
    amount_used,
    created_at,
    updated_at
) VALUES 
(
    '00000000-0000-0000-0000-000000000001',
    'Test Chicken Breast',
    'pieces',
    4,
    20.00,
    CURRENT_DATE,
    0,
    NOW(),
    NOW()
),
(
    '00000000-0000-0000-0000-000000000001',
    'Test Rice',
    'cups',
    10,
    5.00,
    CURRENT_DATE,
    0,
    NOW(),
    NOW()
);

-- Create a test meal
INSERT INTO meals (
    user_id,
    meal_name,
    date_cooked,
    total_cost,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Test Chicken Stir Fry',
    CURRENT_DATE,
    0,
    NOW(),
    NOW()
);

-- Add meal ingredients to test the trigger
INSERT INTO meal_ingredients (
    meal_id,
    ingredient_id,
    quantity_used,
    created_at
) 
SELECT 
    m.id,
    i.id,
    2.4,
    NOW()
FROM meals m, ingredients i 
WHERE m.meal_name = 'Test Chicken Stir Fry' 
AND i.name = 'Test Chicken Breast'

UNION ALL

SELECT 
    m.id,
    i.id,
    1.5,
    NOW()
FROM meals m, ingredients i 
WHERE m.meal_name = 'Test Chicken Stir Fry' 
AND i.name = 'Test Rice';

-- Show the results
SELECT 'Test Data Added Successfully!' as status;

-- Check the results
SELECT 
    name,
    amount_used,
    amount_purchased,
    amount_remaining,
    ROUND((amount_used / amount_purchased) * 100, 1) as usage_percentage
FROM ingredients
WHERE name LIKE 'Test%'
ORDER BY name; 