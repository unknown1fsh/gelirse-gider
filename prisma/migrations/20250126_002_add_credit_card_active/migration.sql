-- Add credit_card.active column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'credit_card' AND column_name = 'active'
  ) THEN
    ALTER TABLE credit_card 
      ADD COLUMN active BOOLEAN NOT NULL DEFAULT true;
  END IF;
END $$;

