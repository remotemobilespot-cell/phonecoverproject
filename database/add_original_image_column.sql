-- This adds storage for the original uploaded image alongside the edited design_image

-- Add original_image column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS original_image VARCHAR(500);

-- Add case_type column to orders table to store MagSafe vs Regular
ALTER TABLE orders ADD COLUMN IF NOT EXISTS case_type VARCHAR(20) DEFAULT 'regular';

-- Add comment explaining the columns
COMMENT ON COLUMN orders.design_image IS 'URL to the edited/final case design image';
COMMENT ON COLUMN orders.original_image IS 'URL to the original uploaded image before editing';
COMMENT ON COLUMN orders.case_type IS 'Type of case: regular ($20) or magsafe ($30)';

-- Show current structure to verify
SELECT column_name, data_type, character_maximum_length, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('design_image', 'original_image', 'case_type')
ORDER BY ordinal_position;