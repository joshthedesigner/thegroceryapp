-- Simple step-by-step meal cost fix
-- Run each section separately

-- Step 1: Disable the trigger (simple command)
ALTER TABLE meal_ingredients DISABLE TRIGGER trigger_calculate_meal_cost;

-- Step 2: Check which meals need fixing
SELECT 
  meal_name,
  total_cost,
  COUNT(mi.id) as ingredient_count
FROM meals m
LEFT JOIN meal_ingredients mi ON m.id = mi.meal_id
WHERE m.total_cost = 0
GROUP BY m.id, m.meal_name, m.total_cost
ORDER BY m.date_cooked DESC;

-- Step 3: Update one meal at a time (safer approach)
-- First, let's see the calculated cost for PAPRILA
SELECT 
  m.meal_name,
  m.total_cost as current_cost,
  COALESCE(SUM((mi.quantity_used / i.amount_purchased) * i.price), 0) as calculated_cost
FROM meals m
LEFT JOIN meal_ingredients mi ON m.id = mi.meal_id
LEFT JOIN ingredients i ON mi.ingredient_id = i.id
WHERE m.meal_name = 'PAPRILA'
GROUP BY m.id, m.meal_name, m.total_cost; 