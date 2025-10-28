-- Uyum düzeltmeleri: system_parameter kolonları ve ref tabloları

-- 1) system_parameter: display_order ve is_active kolonları
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'system_parameter' AND column_name = 'display_order'
  ) THEN
    ALTER TABLE system_parameter 
      ADD COLUMN display_order INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;

-- "active" -> "is_active" taşıması (varsa kopyala, sonra eski kolonu kaldır)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'system_parameter' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE system_parameter 
      ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'system_parameter' AND column_name = 'active'
  ) THEN
    EXECUTE 'UPDATE system_parameter SET is_active = COALESCE(active, true)';
    ALTER TABLE system_parameter DROP COLUMN active;
  END IF;
END $$;

-- display_name NOT NULL uyumu (boş olanları isimle doldurup NOT NULL yap)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'system_parameter' AND column_name = 'display_name'
  ) THEN
    EXECUTE 'UPDATE system_parameter SET display_name = COALESCE(display_name, param_value)';
    ALTER TABLE system_parameter ALTER COLUMN display_name SET NOT NULL;
  END IF;
END $$;

-- 2) ref_tx_type tablosu
CREATE TABLE IF NOT EXISTS ref_tx_type (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(20) NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(20),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3) ref_tx_category tablosu
CREATE TABLE IF NOT EXISTS ref_tx_category (
  id SERIAL PRIMARY KEY,
  tx_type_id INTEGER NOT NULL,
  code VARCHAR(30) NOT NULL,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(20),
  is_default BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT ref_tx_category_tx_type_fk FOREIGN KEY (tx_type_id) REFERENCES ref_tx_type(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT ref_tx_category_uniq UNIQUE (tx_type_id, code)
);

-- 4) ref_payment_method tablosu
CREATE TABLE IF NOT EXISTS ref_payment_method (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5) period.period_type kolonu zaten mevcut; Prisma eşlemesi düzeltildi

-- 6) transaction.tx_date -> transaction_date kolonu uyumu
DO $$
BEGIN
  -- transaction_date kolonu yoksa oluştur
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'transaction' AND column_name = 'transaction_date'
  ) THEN
    -- Mevcut tx_date varsa transaction_date'e kopyala
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'transaction' AND column_name = 'tx_date'
    ) THEN
      ALTER TABLE transaction 
        ADD COLUMN transaction_date DATE DEFAULT CURRENT_DATE;
      UPDATE transaction 
        SET transaction_date = tx_date 
        WHERE transaction_date IS NULL;
    ELSE
      ALTER TABLE transaction 
        ADD COLUMN transaction_date DATE NOT NULL DEFAULT CURRENT_DATE;
    END IF;
  END IF;
  
  -- Eski tx_date kolonunu kaldır (varsa)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'transaction' AND column_name = 'tx_date'
  ) THEN
    ALTER TABLE transaction DROP COLUMN tx_date;
  END IF;
END $$;

-- 7) period.is_closed kolonu (varsa atla, yoksa ekle)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'period' AND column_name = 'is_closed'
  ) THEN
    ALTER TABLE period 
      ADD COLUMN is_closed BOOLEAN NOT NULL DEFAULT false;
  END IF;
END $$;

-- 8) account.active kolonu (varsa atla, yoksa ekle)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'account' AND column_name = 'active'
  ) THEN
    ALTER TABLE account 
      ADD COLUMN active BOOLEAN NOT NULL DEFAULT true;
  END IF;
END $$;


