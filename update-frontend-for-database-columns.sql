-- Frontend Changes Needed to Use Database Columns
-- After running the database changes above, update these frontend files:

-- 1. src/components/MealForm.jsx
-- Change: Use ing.amount_remaining instead of calculating
-- From: `${ing.amount_remaining || 0} units`
-- To: `${ing.amount_remaining} units`

-- 2. src/components/IngredientsTable.jsx  
-- Change: Use record.amount_used and record.amount_remaining directly
-- From: const remaining = record.amount_purchased - (record.amount_used || 0)
-- To: record.amount_remaining

-- 3. src/components/DashboardTable.jsx
-- Change: Use record.amount_remaining directly
-- From: record.amount_remaining || (record.amount_purchased - (record.amount_used || 0))
-- To: record.amount_remaining

-- 4. src/components/MetricDetailsModal.jsx
-- Change: Use record.amount_used and record.amount_remaining directly
-- From: record.amount_used || 0
-- To: record.amount_used

-- 5. src/components/IngredientUsageProgress.jsx
-- Change: Use ingredient.amount_used and ingredient.amount_remaining directly
-- From: ingredient.amount_used || 0
-- To: ingredient.amount_used

-- 6. src/components/IngredientForm.jsx
-- Change: Add unit and purchase_date fields back
-- Add: Form.Item for unit selection
-- Add: Form.Item for purchase_date picker

-- 7. src/pages/Ingredients.jsx
-- Change: Use purchase_date for filtering instead of created_at
-- From: ing.created_at
-- To: ing.purchase_date

-- 8. src/components/DashboardMetrics.jsx
-- Change: Use purchase_date for filtering
-- From: ing.created_at
-- To: ing.purchase_date

-- 9. src/components/TrendsGraph.jsx
-- Change: Use purchase_date for grouping
-- From: ing.created_at
-- To: ing.purchase_date

-- 10. src/services/supabase.js
-- Change: Ensure select('*') includes all new columns
-- Verify: amount_used, amount_remaining, unit, purchase_date are included 