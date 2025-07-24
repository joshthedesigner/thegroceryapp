-- Simple fix for ingredient usage
-- Update ingredients table only

UPDATE ingredients 
SET amount_used = 0;

-- Show results
SELECT name, amount_purchased, amount_used FROM ingredients ORDER BY name; 