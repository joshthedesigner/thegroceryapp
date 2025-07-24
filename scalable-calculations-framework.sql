-- Scalable Database-First Calculations Framework
-- This provides a comprehensive approach for all app calculations

-- ========================================
-- 1. MEAL COST CALCULATIONS
-- ========================================

-- Add total_cost column to meals if it doesn't exist
ALTER TABLE meals 
ADD COLUMN IF NOT EXISTS total_cost DECIMAL(10,2) DEFAULT 0;

-- Function to calculate meal cost based on ingredient usage
CREATE OR REPLACE FUNCTION calculate_meal_cost(meal_id_param UUID)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    calculated_cost DECIMAL(10,2);
BEGIN
    SELECT COALESCE(SUM(
        (mi.quantity_used / i.amount_purchased) * i.price
    ), 0)
    INTO calculated_cost
    FROM meal_ingredients mi
    JOIN ingredients i ON mi.ingredient_id = i.id
    WHERE mi.meal_id = meal_id_param;
    
    RETURN calculated_cost;
END;
$$ LANGUAGE plpgsql;

-- Function to update meal cost when meal_ingredients change
CREATE OR REPLACE FUNCTION update_meal_cost()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE meals 
        SET total_cost = calculate_meal_cost(NEW.meal_id)
        WHERE id = NEW.meal_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE meals 
        SET total_cost = calculate_meal_cost(NEW.meal_id)
        WHERE id = NEW.meal_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE meals 
        SET total_cost = calculate_meal_cost(OLD.meal_id)
        WHERE id = OLD.meal_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for meal cost updates
DROP TRIGGER IF EXISTS trigger_update_meal_cost ON meal_ingredients;
CREATE TRIGGER trigger_update_meal_cost
    AFTER INSERT OR UPDATE OR DELETE ON meal_ingredients
    FOR EACH ROW
    EXECUTE FUNCTION update_meal_cost();

-- ========================================
-- 2. INGREDIENT USAGE CALCULATIONS
-- ========================================

-- Function to calculate ingredient usage percentage
CREATE OR REPLACE FUNCTION calculate_usage_percentage(ingredient_id_param UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    usage_percentage DECIMAL(5,2);
BEGIN
    SELECT CASE 
        WHEN amount_purchased > 0 THEN 
            (amount_used / amount_purchased) * 100
        ELSE 0
    END
    INTO usage_percentage
    FROM ingredients
    WHERE id = ingredient_id_param;
    
    RETURN usage_percentage;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 3. USER METRICS CALCULATIONS
-- ========================================

-- Function to calculate total spent by user in date range
CREATE OR REPLACE FUNCTION calculate_user_spending(
    user_id_param UUID,
    start_date DATE,
    end_date DATE
)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    total_spent DECIMAL(10,2);
BEGIN
    SELECT COALESCE(SUM(price), 0)
    INTO total_spent
    FROM ingredients
    WHERE user_id = user_id_param
    AND created_at::DATE BETWEEN start_date AND end_date;
    
    RETURN total_spent;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate meal costs by user in date range
CREATE OR REPLACE FUNCTION calculate_user_meal_costs(
    user_id_param UUID,
    start_date DATE,
    end_date DATE
)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    total_meal_costs DECIMAL(10,2);
BEGIN
    SELECT COALESCE(SUM(total_cost), 0)
    INTO total_meal_costs
    FROM meals
    WHERE user_id = user_id_param
    AND date_cooked::DATE BETWEEN start_date AND end_date;
    
    RETURN total_meal_costs;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 4. EFFICIENCY CALCULATIONS
-- ========================================

-- Function to calculate ingredient efficiency (usage vs cost)
CREATE OR REPLACE FUNCTION calculate_ingredient_efficiency(ingredient_id_param UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    efficiency DECIMAL(5,2);
    total_cost DECIMAL(10,2);
    used_cost DECIMAL(10,2);
BEGIN
    -- Get total cost of ingredient
    SELECT price INTO total_cost
    FROM ingredients
    WHERE id = ingredient_id_param;
    
    -- Calculate cost of used portion
    SELECT (amount_used / amount_purchased) * price
    INTO used_cost
    FROM ingredients
    WHERE id = ingredient_id_param;
    
    -- Calculate efficiency percentage
    efficiency := CASE 
        WHEN total_cost > 0 THEN (used_cost / total_cost) * 100
        ELSE 0
    END;
    
    RETURN efficiency;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 5. TREND CALCULATIONS
-- ========================================

-- Function to get daily spending trends
CREATE OR REPLACE FUNCTION get_daily_spending_trends(
    user_id_param UUID,
    days_back INTEGER DEFAULT 30
)
RETURNS TABLE(
    date DATE,
    total_spent DECIMAL(10,2),
    ingredient_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        created_at::DATE as date,
        SUM(price) as total_spent,
        COUNT(*) as ingredient_count
    FROM ingredients
    WHERE user_id = user_id_param
    AND created_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
    GROUP BY created_at::DATE
    ORDER BY date;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 6. INITIALIZATION AND VERIFICATION
-- ========================================

-- Initialize all meal costs
UPDATE meals 
SET total_cost = calculate_meal_cost(id);

-- Initialize all ingredient usage
UPDATE ingredients 
SET amount_used = (
    SELECT COALESCE(SUM(quantity_used), 0)
    FROM meal_ingredients 
    WHERE ingredient_id = ingredients.id
);

-- Verification queries
SELECT 'Meal Costs' as metric, COUNT(*) as count, AVG(total_cost) as avg_cost
FROM meals
UNION ALL
SELECT 'Ingredient Usage' as metric, COUNT(*) as count, AVG(amount_used) as avg_used
FROM ingredients
WHERE amount_used > 0; 