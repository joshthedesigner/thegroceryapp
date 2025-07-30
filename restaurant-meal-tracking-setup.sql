-- Restaurant Meal Tracking Feature Setup
-- This file contains all the database changes needed for the restaurant meal tracking feature

-- 1. Create meal type enum (with proper error handling)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'meal_type') THEN
        CREATE TYPE meal_type AS ENUM ('home_cooked', 'restaurant');
    END IF;
END $$;

-- 2. Add new columns to meals table (with proper error handling)
DO $$ 
BEGIN
    -- Add meal_type column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'meals' 
        AND column_name = 'meal_type'
    ) THEN
        ALTER TABLE meals ADD COLUMN meal_type meal_type DEFAULT 'home_cooked';
    END IF;
    
    -- Add restaurant_name column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'meals' 
        AND column_name = 'restaurant_name'
    ) THEN
        ALTER TABLE meals ADD COLUMN restaurant_name VARCHAR(255);
    END IF;
    
    -- Add restaurant_cost column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'meals' 
        AND column_name = 'restaurant_cost'
    ) THEN
        ALTER TABLE meals ADD COLUMN restaurant_cost DECIMAL(10,2);
    END IF;
END $$;

-- 3. Set existing meals to home_cooked type
UPDATE meals SET meal_type = 'home_cooked' WHERE meal_type IS NULL;

-- 4. Add constraints for data integrity (with proper error handling)
DO $$ 
BEGIN
    -- Add restaurant meal requirements constraint
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'restaurant_meal_requirements'
    ) THEN
        ALTER TABLE meals 
        ADD CONSTRAINT restaurant_meal_requirements 
        CHECK (
          meal_type != 'restaurant' OR 
          (restaurant_name IS NOT NULL AND restaurant_cost > 0)
        );
    END IF;
    
    -- Add home cooked meal requirements constraint
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'home_cooked_meal_requirements'
    ) THEN
        ALTER TABLE meals 
        ADD CONSTRAINT home_cooked_meal_requirements 
        CHECK (
          meal_type != 'home_cooked' OR 
          (restaurant_name IS NULL AND restaurant_cost IS NULL)
        );
    END IF;
END $$;

-- 5. Add indexes for performance (with proper error handling)
DO $$ 
BEGIN
    -- Add meal type index
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_meals_meal_type'
    ) THEN
        CREATE INDEX idx_meals_meal_type ON meals(meal_type);
    END IF;
    
    -- Add restaurant cost index
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_meals_restaurant_cost'
    ) THEN
        CREATE INDEX idx_meals_restaurant_cost ON meals(restaurant_cost) WHERE meal_type = 'restaurant';
    END IF;
    
    -- Add meal type and date index
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_meals_type_date'
    ) THEN
        CREATE INDEX idx_meals_type_date ON meals(meal_type, date_cooked);
    END IF;
END $$;

-- 6. Update the cost calculation function to handle restaurant meals
CREATE OR REPLACE FUNCTION calculate_meal_cost()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE meals 
    SET total_cost = CASE 
        WHEN meal_type = 'restaurant' THEN restaurant_cost
        ELSE (
            SELECT COALESCE(SUM(
                (mi.quantity_used / i.amount_purchased) * i.price
            ), 0)
            FROM meal_ingredients mi
            JOIN ingredients i ON mi.ingredient_id = i.id
            WHERE mi.meal_id = NEW.meal_id
        )
    END
    WHERE id = NEW.meal_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create a function to handle restaurant meal creation
CREATE OR REPLACE FUNCTION create_restaurant_meal(
    p_user_id UUID,
    p_restaurant_name VARCHAR(255),
    p_restaurant_cost DECIMAL(10,2),
    p_date_cooked DATE DEFAULT CURRENT_DATE
)
RETURNS UUID AS $$
DECLARE
    v_meal_id UUID;
BEGIN
    INSERT INTO meals (
        user_id, 
        meal_name, 
        date_cooked, 
        meal_type, 
        restaurant_name, 
        restaurant_cost, 
        total_cost
    ) VALUES (
        p_user_id, 
        p_restaurant_name, 
        p_date_cooked, 
        'restaurant', 
        p_restaurant_name, 
        p_restaurant_cost, 
        p_restaurant_cost
    ) RETURNING id INTO v_meal_id;
    
    RETURN v_meal_id;
END;
$$ LANGUAGE plpgsql;

-- 8. Create a function to get meal spending breakdown
CREATE OR REPLACE FUNCTION get_meal_spending_breakdown(
    p_user_id UUID,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS TABLE (
    meal_type meal_type,
    meal_count BIGINT,
    total_spent DECIMAL(10,2),
    avg_cost DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.meal_type,
        COUNT(*) as meal_count,
        SUM(m.total_cost) as total_spent,
        AVG(m.total_cost) as avg_cost
    FROM meals m
    WHERE m.user_id = p_user_id
      AND m.date_cooked BETWEEN p_start_date AND p_end_date
    GROUP BY m.meal_type
    ORDER BY m.meal_type;
END;
$$ LANGUAGE plpgsql;

-- 9. Create a function to get spending trends over time
CREATE OR REPLACE FUNCTION get_meal_spending_trends(
    p_user_id UUID,
    p_start_date DATE,
    p_end_date DATE,
    p_group_by TEXT DEFAULT 'day'
)
RETURNS TABLE (
    date_group DATE,
    total_spent DECIMAL(10,2),
    home_cooked_spent DECIMAL(10,2),
    restaurant_spent DECIMAL(10,2),
    meal_count INTEGER,
    home_cooked_count INTEGER,
    restaurant_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE 
            WHEN p_group_by = 'week' THEN DATE_TRUNC('week', m.date_cooked)::DATE
            WHEN p_group_by = 'month' THEN DATE_TRUNC('month', m.date_cooked)::DATE
            ELSE m.date_cooked
        END as date_group,
        SUM(m.total_cost) as total_spent,
        SUM(CASE WHEN m.meal_type = 'home_cooked' THEN m.total_cost ELSE 0 END) as home_cooked_spent,
        SUM(CASE WHEN m.meal_type = 'restaurant' THEN m.total_cost ELSE 0 END) as restaurant_spent,
        COUNT(*) as meal_count,
        COUNT(CASE WHEN m.meal_type = 'home_cooked' THEN 1 END) as home_cooked_count,
        COUNT(CASE WHEN m.meal_type = 'restaurant' THEN 1 END) as restaurant_count
    FROM meals m
    WHERE m.user_id = p_user_id
      AND m.date_cooked BETWEEN p_start_date AND p_end_date
    GROUP BY date_group
    ORDER BY date_group;
END;
$$ LANGUAGE plpgsql;

-- 10. Verify the setup
SELECT 'Database setup completed successfully' as status;

-- Show current meals table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'meals' 
ORDER BY ordinal_position; 