
# Meal Tracker Database & Frontend Implementation Task List

## **Phase 1: Database Setup**

### **Task 1.1: Create Clean Tables**
- [ ] Create `ingredients` table with minimal fields (id, user_id, name, price, amount_purchased, created_at)
- [ ] Create `meals` table with minimal fields (id, user_id, meal_name, date_cooked, created_at)
- [ ] Create `meal_ingredients` table with minimal fields (id, meal_id, ingredient_id, quantity_used, created_at)
- [ ] Add proper foreign key constraints and unique constraints
- [ ] Create indexes for performance (user_id, meal_id, ingredient_id)

### **Task 1.2: Add Sample Data**
- [ ] Insert test ingredients with realistic prices and amounts
- [ ] Insert test meals with different dates
- [ ] Insert test meal_ingredients relationships
- [ ] Verify data integrity and constraints work

## **Phase 2: Core Calculations Implementation**

### **Task 2.1: Meal Cost Calculation**
- [x] Create SQL query: `(quantity_used ÷ amount_purchased) × price` for each ingredient
- [x] Sum all ingredients for each meal to get total meal cost
- [x] Test with sample data to verify calculations

### **Task 2.2: Ingredient Usage Tracking**
- [x] Create SQL query to sum `quantity_used` for each ingredient across all meals
- [x] Calculate remaining amount: `amount_purchased - total_used`
- [x] Calculate usage percentage: `(total_used ÷ amount_purchased) × 100`

### **Task 2.3: Dashboard Metrics**
- [x] **Total Value Purchased**: Sum `(price × amount_purchased)` from ingredients
- [x] **Total Value Consumed**: Sum all calculated meal costs
- [x] **Unused Value**: `total_purchased - total_consumed`
- [x] **Average Meal Cost**: `sum(meal_costs) ÷ count(meals)`

### **Task 2.4: Time-based Calculations**
- [x] Group meals by `date_cooked`
- [x] Calculate daily consumption totals
- [x] Create cumulative consumption over time periods
- [x] Support different time filters (week, month, year)

## **Phase 3: Frontend Integration**

### **Task 3.1: Update Database Queries**
- [x] Review existing `useIngredients.js` hook
- [x] Review existing `useMeals.js` hook
- [x] Update queries to use new table structure
- [x] Remove any references to old fields (total_cost, amount_used, etc.)

### **Task 3.2: Update Components**
- [x] **MealForm**: Update to calculate meal costs in frontend
- [x] **MealsTable**: Display calculated meal costs instead of stored values
- [x] **IngredientsTable**: Show calculated usage instead of stored amount_used
- [x] **DashboardMetrics**: Use new calculation queries
- [x] **TrendsGraph**: Update to use new time-based calculations

### **Task 3.3: Real-time Calculations**
- [ ] Implement frontend calculation functions for meal costs
- [ ] Update components to recalculate when data changes
- [ ] Ensure all displays use same calculation logic
- [ ] Add loading states for calculations

## **Phase 4: Testing & Validation**

### **Task 4.1: Data Integrity**
- [ ] Test all calculations with known values
- [ ] Verify no duplicate entries can be created
- [ ] Test foreign key constraints work properly
- [ ] Verify user isolation (users can't see each other's data)

### **Task 4.2: Performance**
- [ ] Test with larger datasets
- [ ] Optimize queries with proper indexes
- [ ] Ensure calculations don't slow down the app
- [ ] Add caching if needed

### **Task 4.3: User Experience**
- [ ] Test adding ingredients and meals
- [ ] Verify meal costs display correctly
- [ ] Test dashboard metrics update properly
- [ ] Test line graph shows correct consumption data

## **Phase 5: Cleanup & Documentation**

### **Task 5.1: Code Cleanup**
- [ ] Remove any old database triggers or functions
- [ ] Clean up unused frontend code
- [ ] Remove references to old table fields
- [ ] Update any hardcoded values

### **Task 5.2: Documentation**
- [ ] Document the calculation formulas
- [ ] Document the table structure
- [ ] Create troubleshooting guide
- [ ] Document how to add new calculations

## **Success Criteria:**
- [ ] All calculations derive from same data points
- [ ] No duplicate data stored
- [ ] Meal costs calculate correctly
- [ ] Dashboard metrics match line graph
- [ ] No infinite re-rendering
- [ ] Clean, maintainable code structure

## **Table Structure (Minimal):**

### **ingredients table**
- `id` (UUID, Primary Key)
- `user_id` (UUID, NOT NULL)
- `name` (TEXT, NOT NULL)
- `price` (DECIMAL(10,2), NOT NULL)
- `amount_purchased` (DECIMAL(10,2), NOT NULL)
- `created_at` (TIMESTAMP WITH TIME ZONE)
- **Constraints**: UNIQUE(user_id, name)

### **meals table**
- `id` (UUID, Primary Key)
- `user_id` (UUID, NOT NULL)
- `meal_name` (TEXT, NOT NULL)
- `date_cooked` (DATE, NOT NULL)
- `created_at` (TIMESTAMP WITH TIME ZONE)
- **Constraints**: UNIQUE(user_id, meal_name, date_cooked)

### **meal_ingredients table**
- `id` (UUID, Primary Key)
- `meal_id` (UUID, Foreign Key to meals.id)
- `ingredient_id` (UUID, Foreign Key to ingredients.id)
- `quantity_used` (DECIMAL(10,2), NOT NULL)
- `created_at` (TIMESTAMP WITH TIME ZONE)
- **Constraints**: UNIQUE(meal_id, ingredient_id)

## **Core Calculation Formula:**
**Meal Cost = Σ(quantity_used ÷ amount_purchased × price)**

All other calculations are variations of this basic formula. 