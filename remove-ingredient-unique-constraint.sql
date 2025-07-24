-- Remove Unique Constraint on Ingredients Table
-- This allows users to add multiple entries of the same ingredient name
-- (e.g., multiple "Eggs" entries with different purchase dates, prices, amounts)

-- Step 1: Check if the constraint exists
SELECT 
    'Checking for unique constraint on ingredients table' as info,
    constraint_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_schema = 'public' 
    AND table_name = 'ingredients' 
    AND constraint_type = 'UNIQUE';

-- Step 2: Drop the unique constraint if it exists
-- Note: PostgreSQL automatically names unique constraints, so we need to find the actual name
DO $$
DECLARE
    constraint_name text;
BEGIN
    -- Find the constraint name for the unique constraint on (user_id, name)
    SELECT conname INTO constraint_name
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE n.nspname = 'public'
        AND t.relname = 'ingredients'
        AND c.contype = 'u'
        AND array_length(c.conkey, 1) = 2
        AND EXISTS (
            SELECT 1 FROM pg_attribute a
            WHERE a.attrelid = t.oid
                AND a.attname = 'user_id'
                AND a.attnum = ANY(c.conkey)
        )
        AND EXISTS (
            SELECT 1 FROM pg_attribute a
            WHERE a.attrelid = t.oid
                AND a.attname = 'name'
                AND a.attnum = ANY(c.conkey)
        );
    
    -- Drop the constraint if found
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE ingredients DROP CONSTRAINT ' || constraint_name;
        RAISE NOTICE 'Dropped unique constraint: %', constraint_name;
    ELSE
        RAISE NOTICE 'No unique constraint found on (user_id, name)';
    END IF;
END $$;

-- Step 3: Verify the constraint was removed
SELECT 
    'Verification: Unique constraints remaining on ingredients table' as info,
    constraint_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_schema = 'public' 
    AND table_name = 'ingredients' 
    AND constraint_type = 'UNIQUE';

-- Step 4: Test that we can now insert duplicate ingredient names
-- (This is just a verification query, not an actual insert)
SELECT 
    'Test Query: Checking if duplicate names are now allowed' as info,
    COUNT(*) as total_ingredients,
    COUNT(DISTINCT name) as unique_names,
    COUNT(*) - COUNT(DISTINCT name) as potential_duplicates
FROM ingredients
WHERE user_id = auth.uid();

-- Step 5: Show current ingredients for reference
SELECT 
    'Current ingredients for user' as info,
    name,
    COUNT(*) as entry_count,
    MIN(purchase_date) as first_purchase,
    MAX(purchase_date) as last_purchase
FROM ingredients
WHERE user_id = auth.uid()
GROUP BY name
ORDER BY name; 