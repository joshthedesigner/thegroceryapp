-- Remove Unique Constraint on Meals Table
-- This allows users to create multiple meals with the same name and date
-- (e.g., multiple "Breakfast" meals on different days)

-- Step 1: Check if the constraint exists
SELECT 
    'Checking for unique constraint on meals table' as info,
    constraint_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_schema = 'public' 
    AND table_name = 'meals' 
    AND constraint_type = 'UNIQUE';

-- Step 2: Drop the unique constraint if it exists
DO $$
DECLARE
    constraint_name text;
BEGIN
    -- Find the constraint name for the unique constraint on (user_id, meal_name, date_cooked)
    SELECT conname INTO constraint_name
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE n.nspname = 'public'
        AND t.relname = 'meals'
        AND c.contype = 'u'
        AND array_length(c.conkey, 1) = 3
        AND EXISTS (
            SELECT 1 FROM pg_attribute a
            WHERE a.attrelid = t.oid
                AND a.attname = 'user_id'
                AND a.attnum = ANY(c.conkey)
        )
        AND EXISTS (
            SELECT 1 FROM pg_attribute a
            WHERE a.attrelid = t.oid
                AND a.attname = 'meal_name'
                AND a.attnum = ANY(c.conkey)
        )
        AND EXISTS (
            SELECT 1 FROM pg_attribute a
            WHERE a.attrelid = t.oid
                AND a.attname = 'date_cooked'
                AND a.attnum = ANY(c.conkey)
        );
    
    -- Drop the constraint if found
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE meals DROP CONSTRAINT ' || constraint_name;
        RAISE NOTICE 'Dropped unique constraint: %', constraint_name;
    ELSE
        RAISE NOTICE 'No unique constraint found on (user_id, meal_name, date_cooked)';
    END IF;
END $$;

-- Step 3: Verify the constraint was removed
SELECT 
    'Verification: Unique constraints remaining on meals table' as info,
    constraint_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_schema = 'public' 
    AND table_name = 'meals' 
    AND constraint_type = 'UNIQUE';

-- Step 4: Test that we can now create duplicate meals
-- (This will be done manually in the app)
SELECT 'Constraint removed successfully. You can now create multiple meals with the same name and date.' as status; 