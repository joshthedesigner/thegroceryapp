-- Create trigger to automatically update ingredient usage when meal_ingredients are added/updated/deleted
-- This trigger ensures that amount_used and amount_remaining are always accurate

-- Step 1: Create the trigger function
CREATE OR REPLACE FUNCTION update_ingredient_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- When a new meal_ingredient is added, increase the amount_used
        UPDATE ingredients 
        SET amount_used = amount_used + NEW.quantity_used
        WHERE id = NEW.ingredient_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- When a meal_ingredient is updated, adjust the amount_used
        UPDATE ingredients 
        SET amount_used = amount_used - OLD.quantity_used + NEW.quantity_used
        WHERE id = NEW.ingredient_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- When a meal_ingredient is deleted, decrease the amount_used
        UPDATE ingredients 
        SET amount_used = amount_used - OLD.quantity_used
        WHERE id = OLD.ingredient_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Create the trigger
DROP TRIGGER IF EXISTS trigger_update_ingredient_usage ON meal_ingredients;
CREATE TRIGGER trigger_update_ingredient_usage
    AFTER INSERT OR UPDATE OR DELETE ON meal_ingredients
    FOR EACH ROW EXECUTE FUNCTION update_ingredient_usage();

-- Step 3: Create trigger to calculate meal total cost
CREATE OR REPLACE FUNCTION calculate_meal_cost()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE meals 
    SET total_cost = (
        SELECT COALESCE(SUM(
            (mi.quantity_used / i.amount_purchased) * i.price
        ), 0)
        FROM meal_ingredients mi
        JOIN ingredients i ON mi.ingredient_id = i.id
        WHERE mi.meal_id = NEW.meal_id
    )
    WHERE id = NEW.meal_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create trigger for meal cost calculation
DROP TRIGGER IF EXISTS trigger_calculate_meal_cost ON meal_ingredients;
CREATE TRIGGER trigger_calculate_meal_cost
    AFTER INSERT OR UPDATE OR DELETE ON meal_ingredients
    FOR EACH ROW EXECUTE FUNCTION calculate_meal_cost();

-- Step 5: Verify the triggers were created
SELECT 
    trigger_name, 
    event_manipulation, 
    action_statement
FROM information_schema.triggers 
WHERE trigger_name IN ('trigger_update_ingredient_usage', 'trigger_calculate_meal_cost')
ORDER BY trigger_name;

-- Step 6: Test the trigger function
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name IN ('update_ingredient_usage', 'calculate_meal_cost')
ORDER BY routine_name; 