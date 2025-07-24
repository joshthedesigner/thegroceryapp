-- Simple check of what tables exist
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check for our specific tables
SELECT 'ingredients' as table_name, 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ingredients') 
            THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 'meals' as table_name, 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'meals') 
            THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 'meal_ingredients' as table_name, 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'meal_ingredients') 
            THEN 'EXISTS' ELSE 'MISSING' END as status
UNION ALL
SELECT 'user_preferences' as table_name, 
       CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_preferences') 
            THEN 'EXISTS' ELSE 'MISSING' END as status
ORDER BY table_name; 