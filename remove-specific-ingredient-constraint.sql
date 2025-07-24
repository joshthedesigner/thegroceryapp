-- Remove Specific Ingredient Constraint: ingredients_user_id_name_key
-- This script targets the exact constraint that's preventing duplicate ingredients

-- Step 1: Verify the constraint exists
SELECT 
    'Checking for constraint: ingredients_user_id_name_key' as info,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_constraint c
            JOIN pg_class t ON c.conrelid = t.oid
            JOIN pg_namespace n ON t.relnamespace = n.oid
            WHERE n.nspname = 'public'
                AND t.relname = 'ingredients'
                AND c.conname = 'ingredients_user_id_name_key'
        ) THEN 'CONSTRAINT EXISTS - Will remove it'
        ELSE 'CONSTRAINT DOES NOT EXIST - Nothing to remove'
    END as status;

-- Step 2: Remove the specific constraint
DO $$
BEGIN
    -- Check if the constraint exists before trying to drop it
    IF EXISTS (
        SELECT 1 FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        JOIN pg_namespace n ON t.relnamespace = n.oid
        WHERE n.nspname = 'public'
            AND t.relname = 'ingredients'
            AND c.conname = 'ingredients_user_id_name_key'
    ) THEN
        -- Drop the constraint
        ALTER TABLE ingredients DROP CONSTRAINT ingredients_user_id_name_key;
        RAISE NOTICE 'Successfully dropped constraint: ingredients_user_id_name_key';
    ELSE
        RAISE NOTICE 'Constraint ingredients_user_id_name_key does not exist';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error dropping constraint: %', SQLERRM;
END $$;

-- Step 3: Verify the constraint was removed
SELECT 
    'Verification: Checking if constraint was removed' as info,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_constraint c
            JOIN pg_class t ON c.conrelid = t.oid
            JOIN pg_namespace n ON t.relnamespace = n.oid
            WHERE n.nspname = 'public'
                AND t.relname = 'ingredients'
                AND c.conname = 'ingredients_user_id_name_key'
        ) THEN 'CONSTRAINT STILL EXISTS - Removal failed'
        ELSE 'CONSTRAINT REMOVED SUCCESSFULLY'
    END as status;

-- Step 4: Show remaining unique constraints on ingredients table
SELECT 
    'Remaining unique constraints on ingredients table' as info,
    tc.constraint_name,
    string_agg(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) as columns
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.table_schema = 'public' 
    AND tc.table_name = 'ingredients'
    AND tc.constraint_type = 'UNIQUE'
GROUP BY tc.constraint_name, tc.constraint_type;

-- Step 5: Test that duplicate names are now allowed (verification query)
SELECT 
    'Test: Current ingredients with potential duplicates' as info,
    name,
    COUNT(*) as entry_count,
    MIN(purchase_date) as first_purchase,
    MAX(purchase_date) as last_purchase
FROM ingredients
WHERE user_id = auth.uid()
GROUP BY name
HAVING COUNT(*) > 1
ORDER BY name; 