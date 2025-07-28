-- Fix Ingredient Usage Trigger - Final Solution
-- This will re-enable and fix the trigger that updates ingredient usage

-- Step 1: Check current trigger status
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  CASE 
    WHEN trigger_name IS NOT NULL THEN 'EXISTS'
    ELSE 'NOT FOUND'
  END as trigger_status
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_update_ingredient_usage';

-- Step 2: Drop and recreate the trigger function with improved logic
CREATE OR REPLACE FUNCTION update_ingredient_usage()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT (new meal ingredient)
    IF TG_OP = 'INSERT' THEN
        UPDATE ingredients 
        SET amount_used = COALESCE(amount_used, 0) + NEW.quantity_used
        WHERE id = NEW.ingredient_id;
        RETURN NEW;
    
    -- Handle UPDATE (modified meal ingredient)
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE ingredients 
        SET amount_used = COALESCE(amount_used, 0) - COALESCE(OLD.quantity_used, 0) + NEW.quantity_used
        WHERE id = NEW.ingredient_id;
        RETURN NEW;
    
    -- Handle DELETE (removed meal ingredient)
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE ingredients 
        SET amount_used = COALESCE(amount_used, 0) - OLD.quantity_used
        WHERE id = OLD.ingredient_id;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_update_ingredient_usage ON meal_ingredients;

-- Step 4: Create the trigger with proper event handling
CREATE TRIGGER trigger_update_ingredient_usage
    AFTER INSERT OR UPDATE OR DELETE ON meal_ingredients
    FOR EACH ROW
    EXECUTE FUNCTION update_ingredient_usage();

-- Step 5: Initialize current usage data (backfill existing data)
UPDATE ingredients 
SET amount_used = (
    SELECT COALESCE(SUM(quantity_used), 0)
    FROM meal_ingredients 
    WHERE ingredient_id = ingredients.id
);

-- Step 6: Verify the trigger is working
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  'ENABLED' as status
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_update_ingredient_usage';

-- Step 7: Show current ingredient usage vs what it should be
SELECT 
  i.name,
  i.amount_purchased,
  i.amount_used as current_used,
  COALESCE(SUM(mi.quantity_used), 0) as should_be_used,
  CASE 
    WHEN i.amount_used = COALESCE(SUM(mi.quantity_used), 0) THEN 'CORRECT'
    ELSE 'MISMATCH'
  END as status
FROM ingredients i
LEFT JOIN meal_ingredients mi ON i.id = mi.ingredient_id
GROUP BY i.id, i.name, i.amount_purchased, i.amount_used
ORDER BY status DESC, i.name;

-- Step 8: Show ingredients with usage mismatches (if any)
SELECT 
  i.name,
  i.amount_purchased,
  i.amount_used as current_used,
  COALESCE(SUM(mi.quantity_used), 0) as should_be_used,
  (i.amount_used - COALESCE(SUM(mi.quantity_used), 0)) as difference
FROM ingredients i
LEFT JOIN meal_ingredients mi ON i.id = mi.ingredient_id
GROUP BY i.id, i.name, i.amount_purchased, i.amount_used
HAVING i.amount_used != COALESCE(SUM(mi.quantity_used), 0)
ORDER BY ABS(i.amount_used - COALESCE(SUM(mi.quantity_used), 0)) DESC; 