-- Diagnostic Script: Value Discrepancy Between Metrics and Graph
-- This will help identify why Total Value metric differs from Graph Total Value Added

-- Step 1: Check all ingredients and their purchase dates
SELECT 
    'Step 1: All ingredients with purchase dates' as info,
    name,
    price,
    purchase_date,
    created_at,
    amount_purchased,
    amount_used
FROM ingredients
WHERE user_id = auth.uid()
ORDER BY purchase_date;

-- Step 2: Calculate what the metrics should show (filtered by current week)
-- This simulates the DashboardMetrics calculation
WITH current_week_range AS (
    SELECT 
        NOW() - INTERVAL '7 days' as week_start,
        NOW() as week_end
)
SELECT 
    'Step 2: Metrics calculation (current week only)' as info,
    COUNT(*) as ingredient_count,
    SUM(price) as total_value,
    ROUND(SUM(price)::numeric, 2) as total_value_rounded
FROM ingredients, current_week_range
WHERE user_id = auth.uid()
    AND purchase_date >= current_week_range.week_start
    AND purchase_date <= current_week_range.week_end;

-- Step 3: Calculate what the graph should show (cumulative up to today)
-- This simulates the TrendsGraph calculation
SELECT 
    'Step 3: Graph calculation (cumulative up to today)' as info,
    COUNT(*) as ingredient_count,
    SUM(price) as cumulative_total_value,
    ROUND(SUM(price)::numeric, 2) as cumulative_total_rounded
FROM ingredients
WHERE user_id = auth.uid()
    AND purchase_date <= CURRENT_DATE;

-- Step 4: Show ingredients by purchase date to understand the difference
SELECT 
    'Step 4: Ingredients grouped by purchase date' as info,
    purchase_date,
    COUNT(*) as ingredient_count,
    SUM(price) as daily_total,
    ROUND(SUM(price)::numeric, 2) as daily_total_rounded
FROM ingredients
WHERE user_id = auth.uid()
GROUP BY purchase_date
ORDER BY purchase_date;

-- Step 5: Check if there are ingredients outside the current week
SELECT 
    'Step 5: Ingredients outside current week' as info,
    name,
    price,
    purchase_date,
    CASE 
        WHEN purchase_date < NOW() - INTERVAL '7 days' THEN 'OLDER THAN WEEK'
        WHEN purchase_date > NOW() THEN 'FUTURE DATE'
        ELSE 'WITHIN WEEK'
    END as date_status
FROM ingredients
WHERE user_id = auth.uid()
    AND (purchase_date < NOW() - INTERVAL '7 days' OR purchase_date > NOW())
ORDER BY purchase_date;

-- Step 6: Summary of the discrepancy
SELECT 
    'Step 6: Discrepancy Summary' as info,
    'Metrics show filtered data (current week only)' as metrics_logic,
    'Graph shows cumulative data (all time up to today)' as graph_logic,
    'This explains the difference in values' as explanation; 