-- Fix Meal Cost Calculation Trigger
-- This will ensure meal costs are automatically calculated when ingredients are added

-- Step 1: Drop any existing conflicting triggers
DROP TRIGGER IF EXISTS trigger_calculate_meal_cost ON meal_ingredients;
DROP TRIGGER IF EXISTS trigger_update_meal_cost ON meal_ingredients;

-- Step 2: Create the correct trigger function
CREATE OR REPLACE FUNCTION update_meal_cost()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the meal's total_cost when meal_ingredients change
    UPDATE meals 
    SET total_cost = (
        SELECT COALESCE(SUM(
            (mi.quantity_used / i.amount_purchased) * i.price
        ), 0)
        FROM meal_ingredients mi
        JOIN ingredients i ON mi.ingredient_id = i.id
        WHERE mi.meal_id = COALESCE(NEW.meal_id, OLD.meal_id)
    )
    WHERE id = COALESCE(NEW.meal_id, OLD.meal_id);
    
    -- Return the appropriate record
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Create the trigger
CREATE TRIGGER trigger_update_meal_cost
    AFTER INSERT OR UPDATE OR DELETE ON meal_ingredients
    FOR EACH ROW
    EXECUTE FUNCTION update_meal_cost();

-- Step 4: Update existing meals with their calculated costs
UPDATE meals 
SET total_cost = (
    SELECT COALESCE(SUM(
        (mi.quantity_used / i.amount_purchased) * i.price
    ), 0)
    FROM meal_ingredients mi
    JOIN ingredients i ON mi.ingredient_id = i.id
    WHERE mi.meal_id = meals.id
);

-- Step 5: Verify the trigger is working
SELECT 
    trigger_name,
    event_manipulation,
    action_statement,
    'ENABLED' as status
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_update_meal_cost';

-- Step 6: Show updated meal costs
SELECT 
    meal_name,
    date_cooked,
    total_cost as updated_cost
FROM meals 
ORDER BY date_cooked DESC; 