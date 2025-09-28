-- GiderSE-Gelir PostgreSQL Schema
-- DB-First yaklaşımı ile oluşturulmuştur

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Functions
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Reference Tables

-- Para birimleri
CREATE TABLE ref_currency (
    id SERIAL PRIMARY KEY,
    code VARCHAR(3) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    symbol VARCHAR(5) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hesap türleri
CREATE TABLE ref_account_type (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İşlem türleri
CREATE TABLE ref_tx_type (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(20) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İşlem kategorileri
CREATE TABLE ref_tx_category (
    id SERIAL PRIMARY KEY,
    tx_type_id INTEGER REFERENCES ref_tx_type(id),
    code VARCHAR(30) NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tx_type_id, code)
);

-- Ödeme yöntemleri
CREATE TABLE ref_payment_method (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Altın türleri
CREATE TABLE ref_gold_type (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Altın ayarları
CREATE TABLE ref_gold_purity (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(20) NOT NULL,
    purity DECIMAL(3,1) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bankalar
CREATE TABLE ref_bank (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    ascii_name VARCHAR(100) NOT NULL,
    swift_bic VARCHAR(11),
    bank_code VARCHAR(10),
    website VARCHAR(100),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Main Tables

-- Hesaplar
CREATE TABLE account (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    account_type_id INTEGER REFERENCES ref_account_type(id),
    bank_id INTEGER REFERENCES ref_bank(id),
    currency_id INTEGER REFERENCES ref_currency(id),
    balance DECIMAL(15,2) DEFAULT 0,
    account_number VARCHAR(50),
    iban VARCHAR(34),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kredi kartları
CREATE TABLE credit_card (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    bank_id INTEGER REFERENCES ref_bank(id),
    currency_id INTEGER REFERENCES ref_currency(id),
    limit_amount DECIMAL(15,2) NOT NULL,
    available_limit DECIMAL(15,2) NOT NULL,
    statement_day INTEGER NOT NULL CHECK (statement_day >= 1 AND statement_day <= 31),
    due_day INTEGER NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
    min_payment_percent DECIMAL(5,2) DEFAULT 3.0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İşlemler
CREATE TABLE transaction (
    id SERIAL PRIMARY KEY,
    tx_type_id INTEGER REFERENCES ref_tx_type(id),
    category_id INTEGER REFERENCES ref_tx_category(id),
    payment_method_id INTEGER REFERENCES ref_payment_method(id),
    account_id INTEGER REFERENCES account(id),
    credit_card_id INTEGER REFERENCES credit_card(id),
    amount DECIMAL(15,2) NOT NULL,
    currency_id INTEGER REFERENCES ref_currency(id),
    transaction_date DATE NOT NULL,
    description TEXT,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (account_id IS NOT NULL OR credit_card_id IS NOT NULL)
);

-- Otomatik ödemeler
CREATE TABLE auto_payment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency_id INTEGER REFERENCES ref_currency(id),
    account_id INTEGER REFERENCES account(id),
    credit_card_id INTEGER REFERENCES credit_card(id),
    payment_method_id INTEGER REFERENCES ref_payment_method(id),
    category_id INTEGER REFERENCES ref_tx_category(id),
    cron_schedule VARCHAR(100) NOT NULL,
    next_payment_date DATE,
    active BOOLEAN DEFAULT true,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (account_id IS NOT NULL OR credit_card_id IS NOT NULL)
);

-- Altın/ziynet eşyaları
CREATE TABLE gold_item (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gold_type_id INTEGER REFERENCES ref_gold_type(id),
    gold_purity_id INTEGER REFERENCES ref_gold_purity(id),
    weight_grams DECIMAL(8,3) NOT NULL,
    purchase_price DECIMAL(15,2) NOT NULL,
    purchase_date DATE NOT NULL,
    current_value_try DECIMAL(15,2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Döviz kurları
CREATE TABLE fx_rate (
    id SERIAL PRIMARY KEY,
    from_currency_id INTEGER REFERENCES ref_currency(id),
    to_currency_id INTEGER REFERENCES ref_currency(id),
    rate DECIMAL(15,6) NOT NULL,
    rate_date DATE NOT NULL,
    source VARCHAR(50) DEFAULT 'TCMB',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(from_currency_id, to_currency_id, rate_date)
);

-- Portföy anlık görüntüleri
CREATE TABLE portfolio_snapshot (
    id SERIAL PRIMARY KEY,
    snapshot_date DATE NOT NULL,
    total_assets DECIMAL(15,2) NOT NULL,
    total_liabilities DECIMAL(15,2) NOT NULL,
    net_worth DECIMAL(15,2) NOT NULL,
    breakdown JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(snapshot_date)
);

-- Views

-- Son 30 gün KPI'ları
CREATE VIEW v_kpi_last_30d AS
SELECT 
    COALESCE(SUM(CASE WHEN tt.code = 'GELIR' THEN t.amount ELSE 0 END), 0) as total_income,
    COALESCE(SUM(CASE WHEN tt.code = 'GIDER' THEN t.amount ELSE 0 END), 0) as total_expense,
    COALESCE(SUM(CASE WHEN tt.code = 'GELIR' THEN t.amount ELSE -t.amount END), 0) as net_amount,
    COUNT(CASE WHEN tt.code = 'GELIR' THEN 1 END) as income_count,
    COUNT(CASE WHEN tt.code = 'GIDER' THEN 1 END) as expense_count
FROM transaction t
JOIN ref_tx_type tt ON t.tx_type_id = tt.id
WHERE t.transaction_date >= CURRENT_DATE - INTERVAL '30 days';

-- Yaklaşan kart ödemeleri
CREATE VIEW v_card_dues_next AS
SELECT 
    cc.id,
    cc.name,
    b.name as bank_name,
    cc.limit_amount,
    cc.available_limit,
    cc.due_day,
    CASE 
        WHEN EXTRACT(DAY FROM CURRENT_DATE) <= cc.due_day 
        THEN DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day' + INTERVAL '1 day' * cc.due_day
        ELSE DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '2 month' - INTERVAL '1 day' + INTERVAL '1 day' * cc.due_day
    END as next_due_date,
    (cc.limit_amount - cc.available_limit) as current_debt,
    ((cc.limit_amount - cc.available_limit) * cc.min_payment_percent / 100) as min_payment
FROM credit_card cc
JOIN ref_bank b ON cc.bank_id = b.id
WHERE cc.active = true;

-- Yaklaşan otomatik ödemeler
CREATE VIEW v_upcoming_autopayments AS
SELECT 
    ap.id,
    ap.name,
    ap.amount,
    c.name as currency_name,
    ap.next_payment_date,
    CASE 
        WHEN ap.account_id IS NOT NULL THEN a.name
        WHEN ap.credit_card_id IS NOT NULL THEN cc.name
    END as payment_source
FROM auto_payment ap
JOIN ref_currency c ON ap.currency_id = c.id
LEFT JOIN account a ON ap.account_id = a.id
LEFT JOIN credit_card cc ON ap.credit_card_id = cc.id
WHERE ap.active = true 
AND ap.next_payment_date IS NOT NULL
AND ap.next_payment_date <= CURRENT_DATE + INTERVAL '7 days';

-- Aylık nakit akışı
CREATE MATERIALIZED VIEW mv_cashflow_monthly AS
SELECT 
    DATE_TRUNC('month', t.transaction_date) as month,
    COALESCE(SUM(CASE WHEN tt.code = 'GELIR' THEN t.amount ELSE 0 END), 0) as monthly_income,
    COALESCE(SUM(CASE WHEN tt.code = 'GIDER' THEN t.amount ELSE 0 END), 0) as monthly_expense,
    COALESCE(SUM(CASE WHEN tt.code = 'GELIR' THEN t.amount ELSE -t.amount END), 0) as monthly_net,
    SUM(COALESCE(SUM(CASE WHEN tt.code = 'GELIR' THEN t.amount ELSE -t.amount END), 0)) 
        OVER (ORDER BY DATE_TRUNC('month', t.transaction_date)) as cumulative_net
FROM transaction t
JOIN ref_tx_type tt ON t.tx_type_id = tt.id
GROUP BY DATE_TRUNC('month', t.transaction_date)
ORDER BY month;

-- Triggers

-- Updated_at triggers
CREATE TRIGGER tr_ref_currency_updated_at BEFORE UPDATE ON ref_currency FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tr_ref_account_type_updated_at BEFORE UPDATE ON ref_account_type FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tr_ref_tx_type_updated_at BEFORE UPDATE ON ref_tx_type FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tr_ref_tx_category_updated_at BEFORE UPDATE ON ref_tx_category FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tr_ref_payment_method_updated_at BEFORE UPDATE ON ref_payment_method FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tr_ref_gold_type_updated_at BEFORE UPDATE ON ref_gold_type FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tr_ref_gold_purity_updated_at BEFORE UPDATE ON ref_gold_purity FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tr_ref_bank_updated_at BEFORE UPDATE ON ref_bank FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tr_account_updated_at BEFORE UPDATE ON account FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tr_credit_card_updated_at BEFORE UPDATE ON credit_card FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tr_transaction_updated_at BEFORE UPDATE ON transaction FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tr_auto_payment_updated_at BEFORE UPDATE ON auto_payment FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER tr_gold_item_updated_at BEFORE UPDATE ON gold_item FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Transaction triggers for balance updates
CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.account_id IS NOT NULL THEN
        UPDATE account 
        SET balance = balance + CASE 
            WHEN (SELECT code FROM ref_tx_type WHERE id = NEW.tx_type_id) = 'GELIR' 
            THEN NEW.amount 
            ELSE -NEW.amount 
        END
        WHERE id = NEW.account_id;
    END IF;
    
    IF NEW.credit_card_id IS NOT NULL THEN
        UPDATE credit_card 
        SET available_limit = available_limit - CASE 
            WHEN (SELECT code FROM ref_tx_type WHERE id = NEW.tx_type_id) = 'GIDER' 
            THEN NEW.amount 
            ELSE -NEW.amount 
        END
        WHERE id = NEW.credit_card_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_transaction_balance_update 
    AFTER INSERT ON transaction 
    FOR EACH ROW EXECUTE FUNCTION update_account_balance();

-- Functions

-- Döviz dönüşüm fonksiyonu
CREATE OR REPLACE FUNCTION fx_convert(
    amount DECIMAL(15,2),
    from_code VARCHAR(3),
    to_code VARCHAR(3),
    at_date DATE DEFAULT CURRENT_DATE
)
RETURNS DECIMAL(15,2) AS $$
DECLARE
    from_currency_id INTEGER;
    to_currency_id INTEGER;
    rate_value DECIMAL(15,6);
BEGIN
    -- Aynı para birimi ise dönüşüm yok
    IF from_code = to_code THEN
        RETURN amount;
    END IF;
    
    -- Para birimi ID'lerini al
    SELECT id INTO from_currency_id FROM ref_currency WHERE code = from_code;
    SELECT id INTO to_currency_id FROM ref_currency WHERE code = to_code;
    
    -- Kur bilgisini al
    SELECT rate INTO rate_value 
    FROM fx_rate 
    WHERE from_currency_id = fx_convert.from_currency_id 
    AND to_currency_id = fx_convert.to_currency_id 
    AND rate_date = at_date
    ORDER BY created_at DESC LIMIT 1;
    
    -- Kur bulunamazsa hata
    IF rate_value IS NULL THEN
        RAISE EXCEPTION 'Exchange rate not found for % to % on %', from_code, to_code, at_date;
    END IF;
    
    RETURN amount * rate_value;
END;
$$ LANGUAGE plpgsql;

-- Altın değerleme fonksiyonu
CREATE OR REPLACE FUNCTION fn_valuation_gold_item(item_id INTEGER)
RETURNS DECIMAL(15,2) AS $$
DECLARE
    item_weight DECIMAL(8,3);
    item_purity DECIMAL(3,1);
    gold_rate_try DECIMAL(15,6);
    calculated_value DECIMAL(15,2);
BEGIN
    -- Altın eşya bilgilerini al
    SELECT gi.weight_grams, gp.purity 
    INTO item_weight, item_purity
    FROM gold_item gi
    JOIN ref_gold_purity gp ON gi.gold_purity_id = gp.id
    WHERE gi.id = item_id;
    
    -- Güncel altın kurunu al (TRY cinsinden)
    SELECT rate INTO gold_rate_try
    FROM fx_rate 
    WHERE from_currency_id = (SELECT id FROM ref_currency WHERE code = 'XAU')
    AND to_currency_id = (SELECT id FROM ref_currency WHERE code = 'TRY')
    AND rate_date = CURRENT_DATE
    ORDER BY created_at DESC LIMIT 1;
    
    -- Değer hesapla
    calculated_value := item_weight * item_purity / 24.0 * gold_rate_try;
    
    -- Değeri güncelle
    UPDATE gold_item 
    SET current_value_try = calculated_value
    WHERE id = item_id;
    
    RETURN calculated_value;
END;
$$ LANGUAGE plpgsql;

-- Portföy anlık görüntü oluşturma fonksiyonu
CREATE OR REPLACE FUNCTION fn_build_portfolio_snapshot(at_date DATE DEFAULT CURRENT_DATE)
RETURNS JSONB AS $$
DECLARE
    total_assets DECIMAL(15,2) := 0;
    total_liabilities DECIMAL(15,2) := 0;
    breakdown JSONB;
BEGIN
    -- Toplam varlıklar
    SELECT COALESCE(SUM(balance), 0) INTO total_assets
    FROM account 
    WHERE active = true;
    
    -- Toplam borçlar (kredi kartı limitleri - kullanılabilir limitler)
    SELECT COALESCE(SUM(limit_amount - available_limit), 0) INTO total_liabilities
    FROM credit_card 
    WHERE active = true;
    
    -- Altın değerlerini ekle
    SELECT COALESCE(SUM(current_value_try), 0) INTO total_assets
    FROM gold_item;
    
    -- Breakdown oluştur
    breakdown := jsonb_build_object(
        'accounts', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'name', a.name,
                    'balance', a.balance,
                    'currency', c.code
                )
            )
            FROM account a
            JOIN ref_currency c ON a.currency_id = c.id
            WHERE a.active = true
        ),
        'credit_cards', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'name', cc.name,
                    'debt', cc.limit_amount - cc.available_limit,
                    'currency', c.code
                )
            )
            FROM credit_card cc
            JOIN ref_currency c ON cc.currency_id = c.id
            WHERE cc.active = true
        ),
        'gold_items', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'name', gi.name,
                    'value_try', gi.current_value_try
                )
            )
            FROM gold_item gi
        )
    );
    
    -- Anlık görüntüyü kaydet
    INSERT INTO portfolio_snapshot (snapshot_date, total_assets, total_liabilities, net_worth, breakdown)
    VALUES (at_date, total_assets, total_liabilities, total_assets - total_liabilities, breakdown)
    ON CONFLICT (snapshot_date) 
    DO UPDATE SET 
        total_assets = EXCLUDED.total_assets,
        total_liabilities = EXCLUDED.total_liabilities,
        net_worth = EXCLUDED.net_worth,
        breakdown = EXCLUDED.breakdown;
    
    RETURN breakdown;
END;
$$ LANGUAGE plpgsql;

