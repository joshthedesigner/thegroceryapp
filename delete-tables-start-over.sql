-- Delete all tables and start from scratch
-- This will completely remove everything and create a clean, simple structure

-- Step 1: Drop all tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS meal_ingredients CASCADE;
DROP TABLE IF EXISTS meals CASCADE;
DROP TABLE IF EXISTS ingredients CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;

-- Step 2: Drop any triggers or functions
DROP TRIGGER IF EXISTS trigger_calculate_meal_cost ON meal_ingredients;
DROP FUNCTION IF EXISTS calculate_meal_cost() CASCADE;

-- Step 3: Create simple, clean tables
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  amount_purchased DECIMAL(10,2) NOT NULL,
  amount_used DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  meal_name TEXT NOT NULL,
  description TEXT,
  date_cooked DATE NOT NULL,
  meal_type TEXT,
  total_cost DECIMAL(10,2) DEFAULT 0,
  rating INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE meal_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity_used DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(meal_id, ingredient_id)
);

CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  time_filter TEXT DEFAULT 'week',
  period_offset INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create simple indexes
CREATE INDEX idx_ingredients_user_id ON ingredients(user_id);
CREATE INDEX idx_meals_user_id ON meals(user_id);
CREATE INDEX idx_meal_ingredients_meal_id ON meal_ingredients(meal_id);
CREATE INDEX idx_meal_ingredients_ingredient_id ON meal_ingredients(ingredient_id);

-- Step 5: Verify tables are created
SELECT 
  table_name,
  'CREATED' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('ingredients', 'meals', 'meal_ingredients', 'user_preferences')
ORDER BY table_name; 