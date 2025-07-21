-- Add missing columns to ingredients table
-- This script adds the columns that the application expects but are missing from the database

-- Step 1: Add amount_purchased column (quantity purchased)
ALTER TABLE ingredients 
ADD COLUMN amount_purchased DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- Step 2: Add purchase_date column (when ingredient was purchased)
ALTER TABLE ingredients 
ADD COLUMN purchase_date DATE NOT NULL DEFAULT CURRENT_DATE;

-- Step 3: Add amount_used column (quantity used in meals)
ALTER TABLE ingredients 
ADD COLUMN amount_used DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- Step 4: Add amount_remaining column (calculated field for remaining quantity)
ALTER TABLE ingredients 
ADD COLUMN amount_remaining DECIMAL(10,2) GENERATED ALWAYS AS (amount_purchased - amount_used) STORED;

-- Step 5: Add comments to document the columns
COMMENT ON COLUMN ingredients.amount_purchased IS 'Total quantity of ingredient purchased';
COMMENT ON COLUMN ingredients.purchase_date IS 'Date when ingredient was purchased';
COMMENT ON COLUMN ingredients.amount_used IS 'Total quantity of ingredient used in meals';
COMMENT ON COLUMN ingredients.amount_remaining IS 'Calculated remaining quantity (purchased - used)';

-- Step 6: Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'ingredients' 
AND column_name IN ('amount_purchased', 'purchase_date', 'amount_used', 'amount_remaining')
ORDER BY column_name;

-- Step 7: Test the table structure
SELECT * FROM ingredients LIMIT 1; 