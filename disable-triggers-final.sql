-- Disable triggers that are causing INSERT/DELETE issues
ALTER TABLE meal_ingredients DISABLE TRIGGER trigger_update_ingredient_usage;
ALTER TABLE meal_ingredients DISABLE TRIGGER trigger_calculate_meal_cost; 