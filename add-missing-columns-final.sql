-- Add missing columns to ingredients table and set up automatic updates
-- This will fix the meal modal showing "0" for ingredient amounts

-- Step 1: Add missing columns to ingredients table
ALTER TABLE ingredients 
ADD COLUMN IF NOT EXISTS unit VARCHAR(50) DEFAULT 'units',
ADD COLUMN IF NOT EXISTS purchase_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS amount_used DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS amount_remaining DECIMAL(10,2) GENERATED ALWAYS AS (amount_purchased - amount_used) STORED;

-- Step 2: Create function to update ingredient usage when meal_ingredients change
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
    unit,
    purchase_date
FROM ingredients 
LIMIT 5;

-- Step 6: Test the trigger by showing current state
SELECT 
    i.name,
    i.amount_purchased,
    i.amount_used as current_used,
    COALESCE(SUM(mi.quantity_used), 0) as should_be_used,
    CASE 
        WHEN i.amount_used = COALESCE(SUM(mi.quantity_used), 0) 
        THEN '✅ SYNCED'
        ELSE '❌ MISMATCH'
    END as status
FROM ingredients i
LEFT JOIN meal_ingredients mi ON i.id = mi.ingredient_id
GROUP BY i.id, i.name, i.amount_purchased, i.amount_used
ORDER BY status DESC, i.name; 