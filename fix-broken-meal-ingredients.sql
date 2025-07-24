-- Fix broken meal-ingredient relationships
-- This script cleans up orphaned meal_ingredients and ensures proper data integrity

-- 1. First, let's see what broken relationships exist
SELECT 
  mi.id as meal_ingredient_id,
  mi.meal_id,
  mi.ingredient_id,
  m.meal_name,
  i.name as ingredient_name,
  CASE 
    WHEN i.id IS NULL THEN 'INGREDIENT_DELETED'
    WHEN m.id IS NULL THEN 'MEAL_DELETED'
    ELSE 'VALID'
  END as status
FROM meal_ingredients mi
LEFT JOIN meals m ON mi.meal_id = m.id
LEFT JOIN ingredients i ON mi.ingredient_id = i.id
WHERE i.id IS NULL OR m.id IS NULL;

-- 2. Delete orphaned meal_ingredients (ingredients that no longer exist)
DELETE FROM meal_ingredients 
WHERE ingredient_id NOT IN (SELECT id FROM ingredients);

-- 3. Delete orphaned meal_ingredients (meals that no longer exist)
DELETE FROM meal_ingredients 
WHERE meal_id NOT IN (SELECT id FROM meals);

-- 4. Verify the cleanup worked
SELECT 
  COUNT(*) as total_meal_ingredients,
  COUNT(CASE WHEN i.id IS NOT NULL THEN 1 END) as valid_ingredients,
  COUNT(CASE WHEN m.id IS NOT NULL THEN 1 END) as valid_meals
FROM meal_ingredients mi
LEFT JOIN meals m ON mi.meal_id = m.id
LEFT JOIN ingredients i ON mi.ingredient_id = i.id;

-- 5. Show remaining meal_ingredients with their ingredient details
SELECT 
  mi.id,
  mi.meal_id,
  mi.ingredient_id,
  mi.quantity_used,
  m.meal_name,
  i.name as ingredient_name,
  i.unit as ingredient_unit
FROM meal_ingredients mi
JOIN meals m ON mi.meal_id = m.id
JOIN ingredients i ON mi.ingredient_id = i.id
ORDER BY m.date_cooked DESC, m.meal_name; 