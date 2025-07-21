-- Add test data to the database for testing the ingredient usage trigger
-- This script bypasses RLS policies for testing purposes

-- Step 1: Create a test user (if not exists)
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'test@example.com',
    crypt('testpassword123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Step 2: Add test ingredients
INSERT INTO ingredients (
    id,
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
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000001',
    'Chicken Breast',
    'pieces',
    4,
    20.00,
    CURRENT_DATE,
    0,
    NOW(),
    NOW()
),
(
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000001',
    'Rice',
    'cups',
    10,
    5.00,
    CURRENT_DATE,
    0,
    NOW(),
    NOW()
),
(
    '33333333-3333-3333-3333-333333333333',
    '00000000-0000-0000-0000-000000000001',
    'Broccoli',
    'heads',
    3,
    6.00,
    CURRENT_DATE,
    0,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Step 3: Create a test meal
INSERT INTO meals (
    id,
    user_id,
    meal_name,
    date_cooked,
    total_cost,
    created_at,
    updated_at
) VALUES (
    '44444444-4444-4444-4444-444444444444',
    '00000000-0000-0000-0000-000000000001',
    'Test Chicken Stir Fry',
    CURRENT_DATE,
    0,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Step 4: Add meal ingredients to test the trigger
INSERT INTO meal_ingredients (
    id,
    meal_id,
    ingredient_id,
    quantity_used,
    created_at
) VALUES 
(
    '55555555-5555-5555-5555-555555555555',
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    2,
    NOW()
),
(
    '66666666-6666-6666-6666-666666666666',
    '44444444-4444-4444-4444-444444444444',
    '22222222-2222-2222-2222-222222222222',
    1.5,
    NOW()
),
(
    '77777777-7777-7777-7777-777777777777',
    '44444444-4444-4444-4444-444444444444',
    '33333333-3333-3333-3333-333333333333',
    1,
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Step 5: Verify the data was added
SELECT 'Ingredients' as table_name, COUNT(*) as count FROM ingredients
UNION ALL
SELECT 'Meals' as table_name, COUNT(*) as count FROM meals
UNION ALL
SELECT 'Meal_ingredients' as table_name, COUNT(*) as count FROM meal_ingredients;

-- Step 6: Check if the trigger worked
SELECT 
    name,
    amount_used,
    amount_purchased,
    amount_remaining,
    ROUND((amount_used / amount_purchased) * 100, 1) as usage_percentage
FROM ingredients
ORDER BY name; 