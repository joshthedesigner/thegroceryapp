-- Check which database and schema we're connected to
SELECT current_database() as current_db;
SELECT current_schema() as current_schema;

-- Check if meals table exists in current schema
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = current_schema()
    AND table_name = 'meals'
) as meals_exists_in_current_schema;

-- List all tables in current schema
SELECT table_name, table_schema
FROM information_schema.tables 
WHERE table_schema = current_schema()
ORDER BY table_name;

-- Check if meals table exists in public schema specifically
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = 'meals'
) as meals_exists_in_public_schema; 