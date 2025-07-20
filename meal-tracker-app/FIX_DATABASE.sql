-- 🔧 FIX DATABASE SCHEMA - COPY AND PASTE THIS IN SUPABASE SQL EDITOR
-- This will add the missing price column and fix the "Database Setup Required" error

-- Add price column to ingredients table
ALTER TABLE ingredients 
ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- Add documentation comment
COMMENT ON COLUMN ingredients.price IS 'Total cost of purchasing this ingredient (e.g., $5.99 for 500g flour)';

-- Verify the change
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'ingredients' 
AND column_name = 'price';
