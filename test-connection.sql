-- Test database connection and schema
SELECT current_database() as current_db;
SELECT current_schema() as current_schema;

-- Test if we can access any tables
SELECT COUNT(*) as total_tables 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Test if meals table exists in public schema
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'meals'
) as meals_exists;

-- Try a simple query on meals table
SELECT COUNT(*) as meals_count FROM meals; 