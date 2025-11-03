-- Add missing columns to make production DB match schema

-- 1. period.description
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'period' AND column_name = 'description'
  ) THEN
    ALTER TABLE period 
      ADD COLUMN description TEXT;
  END IF;
END $$;

-- 2. credit_card missing columns
DO $$
BEGIN
  -- available_limit
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'credit_card' AND column_name = 'available_limit'
  ) THEN
    ALTER TABLE credit_card 
      ADD COLUMN available_limit DECIMAL(15,2);
    
    -- Copy from limit_amount if exists and set NOT NULL after
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'credit_card' AND column_name = 'limit_amount'
    ) THEN
      UPDATE credit_card 
        SET available_limit = COALESCE(limit_amount, 0)
        WHERE available_limit IS NULL;
    ELSE
      UPDATE credit_card 
        SET available_limit = 0
        WHERE available_limit IS NULL;
    END IF;
    
    ALTER TABLE credit_card 
      ALTER COLUMN available_limit SET NOT NULL,
      ALTER COLUMN available_limit SET DEFAULT 0;
  END IF;
  
  -- statement_day
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'credit_card' AND column_name = 'statement_day'
  ) THEN
    ALTER TABLE credit_card 
      ADD COLUMN statement_day INTEGER NOT NULL DEFAULT 1;
  END IF;
  
  -- due_day
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'credit_card' AND column_name = 'due_day'
  ) THEN
    ALTER TABLE credit_card 
      ADD COLUMN due_day INTEGER NOT NULL DEFAULT 15;
  END IF;
  
  -- min_payment_percent
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'credit_card' AND column_name = 'min_payment_percent'
  ) THEN
    ALTER TABLE credit_card 
      ADD COLUMN min_payment_percent DECIMAL(5,2) NOT NULL DEFAULT 3.0;
  END IF;
  
  -- Fix bank_id NOT NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'credit_card' AND column_name = 'bank_id' AND is_nullable = 'YES'
  ) THEN
    -- Set NULL bank_ids to first bank if exists
    IF EXISTS (SELECT 1 FROM ref_bank LIMIT 1) THEN
      UPDATE credit_card 
        SET bank_id = (SELECT id FROM ref_bank LIMIT 1)
        WHERE bank_id IS NULL;
    END IF;
    ALTER TABLE credit_card 
      ALTER COLUMN bank_id SET NOT NULL;
  END IF;
END $$;

