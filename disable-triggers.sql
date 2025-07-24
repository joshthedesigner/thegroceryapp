-- Temporarily disable triggers that might be causing issues
ALTER TABLE meal_ingredients DISABLE TRIGGER trigger_update_ingredient_usage;
ALTER TABLE meal_ingredients DISABLE TRIGGER trigger_calculate_meal_cost; 