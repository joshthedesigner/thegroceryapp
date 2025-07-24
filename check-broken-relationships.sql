-- Check for broken meal-ingredient relationships
-- This will help us identify why meal costs might be 0

-- 1. Check if meal_ingredients can properly join with ingredients
SELECT 
  COUNT(*) as total_meal_ingredients,
  COUNT(CASE WHEN i.id IS NOT NULL THEN 1 END) as valid_ingredients,
  COUNT(CASE WHEN i.id IS NULL THEN 1 END) as broken_ingredients
FROM meal_ingredients mi
LEFT JOIN ingredients i ON mi.ingredient_id = i.id;

-- 2. Show specific broken relationships
SELECT 
  mi.id as meal_ingredient_id,
  mi.meal_id,
  mi.ingredient_id,
  mi.quantity_used,
  CASE 
    WHEN i.id IS NULL THEN 'BROKEN - INGREDIENT NOT FOUND'
    WHEN i.name IS NULL THEN 'BROKEN - INGREDIENT NAME NULL'
    ELSE 'VALID'
  END as status
FROM meal_ingredients mi
LEFT JOIN ingredients i ON mi.ingredient_id = i.id
WHERE i.id IS NULL OR i.name IS NULL;

-- 3. Check meal costs calculation with current data
SELECT 
  m.id,
  m.meal_name,
  m.date_cooked,
  m.total_cost as current_cost,
  COUNT(mi.id) as total_ingredients,
  COUNT(CASE WHEN i.id IS NOT NULL THEN 1 END) as valid_ingredients,
  COALESCE(SUM(
    CASE WHEN i.id IS NOT NULL 
    THEN (mi.quantity_used / i.amount_purchased) * i.price 
    ELSE 0 END
  ), 0) as calculated_cost
FROM meals m
LEFT JOIN meal_ingredients mi ON m.id = mi.meal_id
LEFT JOIN ingredients i ON mi.ingredient_id = i.id
GROUP BY m.id, m.meal_name, m.date_cooked, m.total_cost
ORDER BY m.date_cooked DESC;

-- 4. Show meals with their ingredients and costs
SELECT 
  m.meal_name,
  m.date_cooked,
  m.total_cost as meal_cost,
  i.name as ingredient_name,
  mi.quantity_used,
  i.unit,
  i.price as ingredient_price,
  CASE 
    WHEN i.id IS NOT NULL 
    THEN (mi.quantity_used / i.amount_purchased) * i.price 
    ELSE 0 
  END as ingredient_cost
FROM meals m
JOIN meal_ingredients mi ON m.id = mi.meal_id
LEFT JOIN ingredients i ON mi.ingredient_id = i.id
ORDER BY m.date_cooked DESC, m.meal_name; 