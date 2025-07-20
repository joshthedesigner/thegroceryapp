-- Verify current database schema
-- Run this in your Supabase SQL editor to see the current structure

-- Check ingredients table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'ingredients' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check meals table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'meals' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check meal_ingredients table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'meal_ingredients' 
AND table_schema = 'public'
ORDER BY ordinal_position; 