-- Meal Tracker Web Application Database Schema
-- Supabase PostgreSQL Schema

-- Enable Row Level Security (RLS)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types if needed
CREATE TYPE unit_type AS ENUM ('g', 'kg', 'items', 'lbs', 'oz', 'ml', 'l');

-- 1. Ingredients Table
CREATE TABLE ingredients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    amount_purchased DECIMAL(10,2) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    amount_used DECIMAL(10,2) DEFAULT 0,
    amount_remaining DECIMAL(10,2) GENERATED ALWAYS AS (amount_purchased - amount_used) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Meals Table
CREATE TABLE meals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    meal_name VARCHAR(255) NOT NULL,
    date_cooked DATE NOT NULL DEFAULT CURRENT_DATE,
    total_cost DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Meal_Ingredients Table (Many-to-Many Relationship)
CREATE TABLE meal_ingredients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meal_id UUID REFERENCES meals(id) ON DELETE CASCADE NOT NULL,
    ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE NOT NULL,
    quantity_used DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(meal_id, ingredient_id)
);

-- 4. User_Preferences Table (Welcome Screen & User Settings)
CREATE TABLE user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    has_seen_welcome BOOLEAN DEFAULT FALSE,
    welcome_completed_at TIMESTAMP WITH TIME ZONE,
    welcome_step_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_ingredients_user_id ON ingredients(user_id);
CREATE INDEX idx_ingredients_name ON ingredients(name);
CREATE INDEX idx_meals_user_id ON meals(user_id);
CREATE INDEX idx_meals_date_cooked ON meals(date_cooked);
CREATE INDEX idx_meal_ingredients_meal_id ON meal_ingredients(meal_id);
CREATE INDEX idx_meal_ingredients_ingredient_id ON meal_ingredients(ingredient_id);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_ingredients_updated_at BEFORE UPDATE ON ingredients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meals_updated_at BEFORE UPDATE ON meals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meal_ingredients_updated_at BEFORE UPDATE ON meal_ingredients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ingredients
CREATE POLICY "Users can view their own ingredients" ON ingredients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ingredients" ON ingredients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ingredients" ON ingredients
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ingredients" ON ingredients
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for meals
CREATE POLICY "Users can view their own meals" ON meals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meals" ON meals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals" ON meals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals" ON meals
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for meal_ingredients
CREATE POLICY "Users can view meal ingredients for their meals" ON meal_ingredients
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM meals 
            WHERE meals.id = meal_ingredients.meal_id 
            AND meals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert meal ingredients for their meals" ON meal_ingredients
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM meals 
            WHERE meals.id = meal_ingredients.meal_id 
            AND meals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update meal ingredients for their meals" ON meal_ingredients
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM meals 
            WHERE meals.id = meal_ingredients.meal_id 
            AND meals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete meal ingredients for their meals" ON meal_ingredients
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM meals 
            WHERE meals.id = meal_ingredients.meal_id 
            AND meals.user_id = auth.uid()
        )
    );

-- Create RLS policies for user_preferences
CREATE POLICY "Users can view their own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences" ON user_preferences
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to update ingredient usage when meal_ingredients are added/updated/deleted
CREATE OR REPLACE FUNCTION update_ingredient_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE ingredients 
        SET amount_used = amount_used + NEW.quantity_used
        WHERE id = NEW.ingredient_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE ingredients 
        SET amount_used = amount_used - OLD.quantity_used + NEW.quantity_used
        WHERE id = NEW.ingredient_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE ingredients 
        SET amount_used = amount_used - OLD.quantity_used
        WHERE id = OLD.ingredient_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for ingredient usage updates
CREATE TRIGGER trigger_update_ingredient_usage
    AFTER INSERT OR UPDATE OR DELETE ON meal_ingredients
    FOR EACH ROW EXECUTE FUNCTION update_ingredient_usage();

-- Create function to calculate meal total cost
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

-- Create trigger for meal cost calculation
CREATE TRIGGER trigger_calculate_meal_cost
    AFTER INSERT OR UPDATE OR DELETE ON meal_ingredients
    FOR EACH ROW EXECUTE FUNCTION calculate_meal_cost(); 

-- Create cleanup function for orphaned meal_ingredients
CREATE OR REPLACE FUNCTION cleanup_orphaned_meal_ingredients()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    SET search_path = '';
    
    DELETE FROM meal_ingredients 
    WHERE ingredient_id NOT IN (SELECT id FROM ingredients);
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql; 