-- Restaurant Meal Tracking Feature Setup (Simplified Version)
-- This file contains all the database changes needed for the restaurant meal tracking feature

-- 1. Create meal type enum (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'meal_type') THEN
        CREATE TYPE meal_type AS ENUM ('home_cooked', 'restaurant');
    END IF;
END $$;

-- 2. Add new columns to meals table (one by one to avoid errors)
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
END $$;

DO $$ 
BEGIN
    -- Add restaurant_name column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'meals' 
        AND column_name = 'restaurant_name'
    ) THEN
        ALTER TABLE meals ADD COLUMN restaurant_name VARCHAR(255);
    END IF;
END $$;

DO $$ 
BEGIN
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

-- 4. Add constraints for data integrity
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
END $$;

DO $$ 
BEGIN
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

-- 5. Add indexes for performance
DO $$ 
BEGIN
    -- Add meal type index
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_meals_meal_type'
    ) THEN
        CREATE INDEX idx_meals_meal_type ON meals(meal_type);
    END IF;
END $$;

DO $$ 
BEGIN
    -- Add restaurant cost index
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_meals_restaurant_cost'
    ) THEN
        CREATE INDEX idx_meals_restaurant_cost ON meals(restaurant_cost) WHERE meal_type = 'restaurant';
    END IF;
END $$;

DO $$ 
BEGIN
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

-- 7. Verify the setup
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