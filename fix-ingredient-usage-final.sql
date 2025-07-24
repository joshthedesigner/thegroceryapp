-- Fix ingredient usage tracking by adding missing columns
-- This provides the most scalable solution for all calculations

-- Step 1: Add missing columns to ingredients table
ALTER TABLE ingredients 
ADD COLUMN IF NOT EXISTS amount_used DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS amount_remaining DECIMAL(10,2) GENERATED ALWAYS AS (amount_purchased - amount_used) STORED;

-- Step 2: Create a function to update ingredient usage when meal_ingredients change
CREATE OR REPLACE FUNCTION update_ingredient_usage()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT (new meal ingredient)
    IF TG_OP = 'INSERT' THEN
        UPDATE ingredients 
        SET amount_used = amount_used + NEW.quantity_used
        WHERE id = NEW.ingredient_id;
        RETURN NEW;
    
    -- Handle UPDATE (modified meal ingredient)
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE ingredients 
        SET amount_used = amount_used - OLD.quantity_used + NEW.quantity_used
        WHERE id = NEW.ingredient_id;
        RETURN NEW;
    
    -- Handle DELETE (removed meal ingredient)
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE ingredients 
        SET amount_used = amount_used - OLD.quantity_used
        WHERE id = OLD.ingredient_id;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Create trigger to automatically update ingredient usage
DROP TRIGGER IF EXISTS trigger_update_ingredient_usage ON meal_ingredients;
CREATE TRIGGER trigger_update_ingredient_usage
    AFTER INSERT OR UPDATE OR DELETE ON meal_ingredients
    FOR EACH ROW
    EXECUTE FUNCTION update_ingredient_usage();

-- Step 4: Initialize current usage data (backfill existing data)
UPDATE ingredients 
SET amount_used = (
    SELECT COALESCE(SUM(quantity_used), 0)
    FROM meal_ingredients 
    WHERE ingredient_id = ingredients.id
);

-- Step 5: Verify the changes
SELECT 
    id,
    name,
    amount_purchased,
    amount_used,
    amount_remaining,
    (amount_purchased - amount_used) as calculated_remaining
FROM ingredients 
LIMIT 5; 