-- List the 4 tables that exist
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check if any of our expected tables exist
SELECT 
  expected_tables.table_name,
  CASE 
    WHEN actual_tables.table_name IS NOT NULL THEN 'EXISTS'
    ELSE 'MISSING'
  END as status
FROM (
  SELECT 'ingredients' as table_name
  UNION SELECT 'meals'
  UNION SELECT 'meal_ingredients' 
  UNION SELECT 'user_preferences'
) expected_tables
LEFT JOIN information_schema.tables actual_tables 
  ON expected_tables.table_name = actual_tables.table_name 
  AND actual_tables.table_schema = 'public'
ORDER BY expected_tables.table_name; 