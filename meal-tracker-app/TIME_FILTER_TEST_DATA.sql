-- Add test data for time filtering functionality
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

-- Step 2: Add test ingredients with varied dates
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
-- Today
(
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000001',
    'Chicken Breast (Today)',
    'pieces',
    4,
    20.00,
    CURRENT_DATE,
    2,
    NOW(),
    NOW()
),
-- 3 days ago
(
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000001',
    'Rice (3 days ago)',
    'cups',
    10,
    5.00,
    CURRENT_DATE - INTERVAL '3 days',
    1.5,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
),
-- 1 week ago
(
    '33333333-3333-3333-3333-333333333333',
    '00000000-0000-0000-0000-000000000001',
    'Broccoli (1 week ago)',
    'heads',
    3,
    6.00,
    CURRENT_DATE - INTERVAL '7 days',
    1,
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '7 days'
),
-- 2 weeks ago
(
    '44444444-4444-4444-4444-444444444444',
    '00000000-0000-0000-0000-000000000001',
    'Pasta (2 weeks ago)',
    'boxes',
    2,
    8.00,
    CURRENT_DATE - INTERVAL '14 days',
    1,
    NOW() - INTERVAL '14 days',
    NOW() - INTERVAL '14 days'
),
-- 1 month ago
(
    '55555555-5555-5555-5555-555555555555',
    '00000000-0000-0000-0000-000000000001',
    'Tomatoes (1 month ago)',
    'pounds',
    5,
    12.00,
    CURRENT_DATE - INTERVAL '30 days',
    3,
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '30 days'
),
-- 6 months ago
(
    '66666666-6666-6666-6666-666666666666',
    '00000000-0000-0000-0000-000000000001',
    'Olive Oil (6 months ago)',
    'bottles',
    1,
    15.00,
    CURRENT_DATE - INTERVAL '6 months',
    0.3,
    NOW() - INTERVAL '6 months',
    NOW() - INTERVAL '6 months'
) ON CONFLICT (id) DO NOTHING;

-- Step 3: Create test meals with varied dates
INSERT INTO meals (
    id,
    user_id,
    meal_name,
    date_cooked,
    total_cost,
    created_at,
    updated_at
) VALUES 
-- Today
(
    '77777777-7777-7777-7777-777777777777',
    '00000000-0000-0000-0000-000000000001',
    'Chicken Stir Fry (Today)',
    CURRENT_DATE,
    12.50,
    NOW(),
    NOW()
),
-- 2 days ago
(
    '88888888-8888-8888-8888-888888888888',
    '00000000-0000-0000-0000-000000000001',
    'Rice Bowl (2 days ago)',
    CURRENT_DATE - INTERVAL '2 days',
    8.75,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
),
-- 1 week ago
(
    '99999999-9999-9999-9999-999999999999',
    '00000000-0000-0000-0000-000000000001',
    'Pasta Dinner (1 week ago)',
    CURRENT_DATE - INTERVAL '7 days',
    10.25,
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '7 days'
),
-- 3 weeks ago
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '00000000-0000-0000-0000-000000000001',
    'Tomato Soup (3 weeks ago)',
    CURRENT_DATE - INTERVAL '21 days',
    6.50,
    NOW() - INTERVAL '21 days',
    NOW() - INTERVAL '21 days'
) ON CONFLICT (id) DO NOTHING;

-- Step 4: Add meal ingredients to test the trigger
INSERT INTO meal_ingredients (
    id,
    meal_id,
    ingredient_id,
    quantity_used,
    created_at
) VALUES 
-- Today's meal
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '77777777-7777-7777-7777-777777777777',
    '11111111-1111-1111-1111-111111111111',
    2,
    NOW()
),
-- 2 days ago meal
(
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '88888888-8888-8888-8888-888888888888',
    '22222222-2222-2222-2222-222222222222',
    1.5,
    NOW() - INTERVAL '2 days'
),
-- 1 week ago meal
(
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '99999999-9999-9999-9999-999999999999',
    '44444444-4444-4444-4444-444444444444',
    1,
    NOW() - INTERVAL '7 days'
),
-- 3 weeks ago meal
(
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '55555555-5555-5555-5555-555555555555',
    2,
    NOW() - INTERVAL '21 days'
) ON CONFLICT (id) DO NOTHING;

-- Step 5: Verify the data was added
SELECT 'Ingredients' as table_name, COUNT(*) as count FROM ingredients
UNION ALL
SELECT 'Meals' as table_name, COUNT(*) as count FROM meals
UNION ALL
SELECT 'Meal_ingredients' as table_name, COUNT(*) as count FROM meal_ingredients;

-- Step 6: Show the data with dates for verification
SELECT 
    'Ingredients' as type,
    name,
    purchase_date,
    amount_used,
    amount_purchased
FROM ingredients
ORDER BY purchase_date DESC;

SELECT 
    'Meals' as type,
    meal_name,
    date_cooked,
    total_cost
FROM meals
ORDER BY date_cooked DESC; 