-- Diagnostic Script: Identify Ingredient Table Constraints
-- This will help us understand what constraints exist on the ingredients table

-- Step 1: Check all constraints on the ingredients table
SELECT 
    'All Constraints on Ingredients Table' as info,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    tc.is_deferrable,
    tc.initially_deferred
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.table_schema = 'public' 
    AND tc.table_name = 'ingredients'
ORDER BY tc.constraint_type, tc.constraint_name, kcu.ordinal_position;

-- Step 2: Check specifically for unique constraints
SELECT 
    'Unique Constraints on Ingredients Table' as info,
    tc.constraint_name,
    tc.constraint_type,
    string_agg(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) as columns
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.table_schema = 'public' 
    AND tc.table_name = 'ingredients'
    AND tc.constraint_type = 'UNIQUE'
GROUP BY tc.constraint_name, tc.constraint_type;

-- Step 3: Check PostgreSQL system catalogs for more detailed constraint info
SELECT 
    'PostgreSQL System Catalog - Constraints' as info,
    c.conname as constraint_name,
    c.contype as constraint_type,
    array_to_string(c.conkey, ',') as column_positions,
    pg_get_constraintdef(c.oid) as constraint_definition
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
JOIN pg_namespace n ON t.relnamespace = n.oid
WHERE n.nspname = 'public'
    AND t.relname = 'ingredients'
ORDER BY c.contype, c.conname;

-- Step 4: Check if the specific constraint "ingredients_user_id_name_key" exists
SELECT 
    'Checking for specific constraint: ingredients_user_id_name_key' as info,
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

-- Step 5: Show table structure for reference
SELECT 
    'Ingredients Table Structure' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name = 'ingredients'
ORDER BY ordinal_position;

-- Step 6: Check if there are any triggers that might be enforcing uniqueness
SELECT 
    'Triggers on Ingredients Table' as info,
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public'
    AND event_object_table = 'ingredients'
ORDER BY trigger_name; 