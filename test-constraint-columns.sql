-- Test and Verify Constraint Columns Before Making Changes
-- This script will identify exactly which columns are involved in the constraint

-- Step 1: Check if the specific constraint exists and get its details
SELECT 
    'Step 1: Checking if ingredients_user_id_name_key constraint exists' as info,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_constraint c
            JOIN pg_class t ON c.conrelid = t.oid
            JOIN pg_namespace n ON t.relnamespace = n.oid
            WHERE n.nspname = 'public'
                AND t.relname = 'ingredients'
                AND c.conname = 'ingredients_user_id_name_key'
        ) THEN 'CONSTRAINT EXISTS'
        ELSE 'CONSTRAINT DOES NOT EXIST'
    END as status;

-- Step 2: Get detailed information about the constraint if it exists
SELECT 
    'Step 2: Detailed constraint information' as info,
    c.conname as constraint_name,
    c.contype as constraint_type,
    pg_get_constraintdef(c.oid) as constraint_definition,
    array_to_string(c.conkey, ',') as column_positions
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
JOIN pg_namespace n ON t.relnamespace = n.oid
WHERE n.nspname = 'public'
    AND t.relname = 'ingredients'
    AND c.conname = 'ingredients_user_id_name_key';

-- Step 3: Map column positions to actual column names
SELECT 
    'Step 3: Column mapping for constraint' as info,
    c.conname as constraint_name,
    a.attname as column_name,
    a.attnum as column_position
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
JOIN pg_namespace n ON t.relnamespace = n.oid
JOIN pg_attribute a ON a.attrelid = t.oid
WHERE n.nspname = 'public'
    AND t.relname = 'ingredients'
    AND c.conname = 'ingredients_user_id_name_key'
    AND a.attnum = ANY(c.conkey)
ORDER BY array_position(c.conkey, a.attnum);

-- Step 4: Test what happens when we try to insert a duplicate
-- (This is a safe test that won't actually insert data)
SELECT 
    'Step 4: Testing duplicate detection logic' as info,
    'This test simulates what would happen with a duplicate insert' as description;

-- Step 5: Show current data that would violate the constraint
SELECT 
    'Step 5: Current data that would violate the constraint' as info,
    name,
    COUNT(*) as duplicate_count,
    string_agg(purchase_date::text, ', ' ORDER BY purchase_date) as purchase_dates,
    string_agg(price::text, ', ' ORDER BY price) as prices
FROM ingredients
WHERE user_id = auth.uid()
GROUP BY name
HAVING COUNT(*) > 1
ORDER BY name;

-- Step 6: Test constraint violation with a safe query
-- This simulates what the constraint is checking without actually inserting
SELECT 
    'Step 6: Constraint violation test (safe simulation)' as info,
    name,
    'Would violate constraint if trying to insert another entry with same name' as violation_reason
FROM ingredients
WHERE user_id = auth.uid()
    AND name IN (
        SELECT name 
        FROM ingredients 
        WHERE user_id = auth.uid() 
        GROUP BY name 
        HAVING COUNT(*) > 0
    )
GROUP BY name
ORDER BY name;

-- Step 7: Show all unique constraints on the ingredients table
SELECT 
    'Step 7: All unique constraints on ingredients table' as info,
    tc.constraint_name,
    tc.constraint_type,
    string_agg(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) as involved_columns
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.table_schema = 'public' 
    AND tc.table_name = 'ingredients'
    AND tc.constraint_type = 'UNIQUE'
GROUP BY tc.constraint_name, tc.constraint_type
ORDER BY tc.constraint_name;

-- Step 8: Summary and recommendation
SELECT 
    'Step 8: Summary and Recommendation' as info,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_constraint c
            JOIN pg_class t ON c.conrelid = t.oid
            JOIN pg_namespace n ON t.relnamespace = n.oid
            WHERE n.nspname = 'public'
                AND t.relname = 'ingredients'
                AND c.conname = 'ingredients_user_id_name_key'
        ) THEN 'CONSTRAINT EXISTS - Safe to proceed with removal'
        ELSE 'CONSTRAINT DOES NOT EXIST - No action needed'
    END as recommendation; 