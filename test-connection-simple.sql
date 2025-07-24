-- Test database connection
SELECT current_database() as current_db;
SELECT current_schema() as current_schema;

-- Test if we can access tables
SELECT COUNT(*) as ingredients_count FROM ingredients;
SELECT COUNT(*) as meals_count FROM meals;
SELECT COUNT(*) as meal_ingredients_count FROM meal_ingredients; 