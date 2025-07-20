# 🚀 Quick Database Setup Guide

## Step 1: Open Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click on your project: **jdoitxsoquqaudygnbmh**

## Step 2: Open SQL Editor
1. In the left sidebar, click **SQL Editor**
2. Click **New Query**

## Step 3: Copy and Paste This SQL Script

```sql
-- Meal Tracker Database Setup Script
-- Copy and paste this entire script into the SQL Editor

-- Create ingredients table
CREATE TABLE IF NOT EXISTS public.ingredients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    unit TEXT NOT NULL,
    cost_per_unit DECIMAL(10,2) DEFAULT 0,
    current_stock DECIMAL(10,2) DEFAULT 0,
    min_stock_level DECIMAL(10,2) DEFAULT 0,
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meals table
CREATE TABLE IF NOT EXISTS public.meals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    meal_date DATE NOT NULL,
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    total_cost DECIMAL(10,2) DEFAULT 0,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create meal_ingredients junction table
CREATE TABLE IF NOT EXISTS public.meal_ingredients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    meal_id UUID REFERENCES public.meals(id) ON DELETE CASCADE,
    ingredient_id UUID REFERENCES public.ingredients(id) ON DELETE CASCADE,
    quantity_used DECIMAL(10,2) NOT NULL,
    cost_contribution DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(meal_id, ingredient_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_ingredients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for ingredients
CREATE POLICY "Users can view their own ingredients" ON public.ingredients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ingredients" ON public.ingredients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ingredients" ON public.ingredients
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ingredients" ON public.ingredients
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for meals
CREATE POLICY "Users can view their own meals" ON public.meals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meals" ON public.meals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals" ON public.meals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals" ON public.meals
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for meal_ingredients
CREATE POLICY "Users can view meal ingredients for their meals" ON public.meal_ingredients
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.meals 
            WHERE meals.id = meal_ingredients.meal_id 
            AND meals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert meal ingredients for their meals" ON public.meal_ingredients
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.meals 
            WHERE meals.id = meal_ingredients.meal_id 
            AND meals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update meal ingredients for their meals" ON public.meal_ingredients
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.meals 
            WHERE meals.id = meal_ingredients.meal_id 
            AND meals.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete meal ingredients for their meals" ON public.meal_ingredients
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.meals 
            WHERE meals.id = meal_ingredients.meal_id 
            AND meals.user_id = auth.uid()
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ingredients_user_id ON public.ingredients(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON public.meals(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_date ON public.meals(meal_date);
CREATE INDEX IF NOT EXISTS idx_meal_ingredients_meal_id ON public.meal_ingredients(meal_id);
CREATE INDEX IF NOT EXISTS idx_meal_ingredients_ingredient_id ON public.meal_ingredients(ingredient_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_ingredients_updated_at BEFORE UPDATE ON public.ingredients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meals_updated_at BEFORE UPDATE ON public.meals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Step 4: Run the Script
1. Click the **Run** button (or press Ctrl+Enter)
2. Wait for all commands to execute successfully

## Step 5: Verify Setup
1. Go to **Table Editor** in the left sidebar
2. You should see 3 new tables:
   - `ingredients`
   - `meals` 
   - `meal_ingredients`

## Step 6: Test Your App
1. Refresh your app at **http://localhost:5174/**
2. The "Database Setup Required" messages should disappear
3. You can now add ingredients and log meals! 🎉

---

**Need help?** The script is safe to run multiple times - it uses `IF NOT EXISTS` so it won't create duplicate tables. 