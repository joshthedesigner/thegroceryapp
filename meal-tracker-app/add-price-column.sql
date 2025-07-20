-- Add price column to ingredients table
-- This column stores the total cost of purchasing an ingredient

ALTER TABLE ingredients 
ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- Add a comment to document the column
COMMENT ON COLUMN ingredients.price IS 'Total cost of purchasing this ingredient (e.g., $5.99 for 500g flour)';

-- Update any existing ingredients to have a default price of 0.00
-- (This ensures the NOT NULL constraint is satisfied)
UPDATE ingredients SET price = 0.00 WHERE price IS NULL; 