-- ============================================================================
-- PROJECT CHAKRAVEK - DEFENCE PROCUREMENT FRAUD DETECTION SYSTEM
-- SUPABASE POSTGRESQL SCHEMA WITH ROW-LEVEL SECURITY (RLS) & AUDIT SEED DATA
-- ============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'Auditor' CHECK (role IN ('Auditor', 'Caudit', 'Super Admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. VENDORS TABLE
CREATE TABLE IF NOT EXISTS public.vendors (
    id VARCHAR(50) PRIMARY KEY, -- e.g. V-101
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    risk_score INT DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    flagged_contracts_count INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Flagged', 'Blacklisted', 'Under Investigation')),
    registered_at DATE NOT NULL,
    tax_id VARCHAR(100) UNIQUE NOT NULL,
    owner_nationality VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    matches_peps BOOLEAN DEFAULT FALSE,
    connected_vendors TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- 3. CONTRACTS TABLE
CREATE TABLE IF NOT EXISTS public.contracts (
    id VARCHAR(50) PRIMARY KEY, -- e.g. C-7310
    title VARCHAR(255) NOT NULL,
    vendor_id VARCHAR(50) REFERENCES public.vendors(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL, -- Core cost in Crores (INR)
    department VARCHAR(100) NOT NULL, -- e.g., Navy, Army, IAF, DRDO
    category VARCHAR(100) NOT NULL, -- e.g., Ammunition, Logistics, Combat Tech
    status VARCHAR(50) DEFAULT 'Executed' CHECK (status IN ('Draft', 'Approved', 'Executed', 'Suspended', 'Under Audit')),
    risk_score INT DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    flag_reasons TEXT[] DEFAULT ARRAY[]::TEXT[],
    flagged_count INT DEFAULT 0,
    anomaly_score INT DEFAULT 0 CHECK (anomaly_score >= 0 AND anomaly_score <= 100),
    unit_price_deviation NUMERIC(6, 2) DEFAULT 0.0,
    registered_date DATE NOT NULL,
    evidence TEXT[] DEFAULT ARRAY[]::TEXT[],
    ai_explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- 4. RISK SCORES BREAKDOWN TABLE
CREATE TABLE IF NOT EXISTS public.risk_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id VARCHAR(50) REFERENCES public.contracts(id) ON DELETE CASCADE UNIQUE,
    overall_risk INT DEFAULT 0,
    vendor_risk INT DEFAULT 0,
    direct_flag_risk INT DEFAULT 0,
    price_risk INT DEFAULT 0,
    entity_network_risk INT DEFAULT 0,
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.risk_scores ENABLE ROW LEVEL SECURITY;

-- 5. AUDIT REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.audit_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    contract_id VARCHAR(50) REFERENCES public.contracts(id) ON DELETE CASCADE,
    generated_content TEXT NOT NULL,
    generated_by VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Finalized')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.audit_reports ENABLE ROW LEVEL SECURITY;

-- 6. AUDIT OBSERVATIONS TABLE
CREATE TABLE IF NOT EXISTS public.audit_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id VARCHAR(50) REFERENCES public.contracts(id) ON DELETE CASCADE,
    vendor_id VARCHAR(50) REFERENCES public.vendors(id) ON DELETE CASCADE,
    formal_title VARCHAR(255) NOT NULL,
    regulatory_reference TEXT NOT NULL,
    observation_text TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.audit_observations ENABLE ROW LEVEL SECURITY;

-- 7. CHAT HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    citation JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- 8. UPLOADED_FILES TABLE
CREATE TABLE IF NOT EXISTS public.uploaded_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Success', 'Failed')),
    row_count INT,
    metadata JSONB DEFAULT '{}'::JSONB,
    indexed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;

-- 9. INVESTIGATIONS TABLE
CREATE TABLE IF NOT EXISTS public.investigations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id VARCHAR(50) REFERENCES public.contracts(id) ON DELETE CASCADE,
    investigator_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Open' CHECK (status IN ('Open', 'Resolved', 'Escalated')),
    notes TEXT NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.investigations ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- RLS POLICIES (Example for standard authenticated read-write audits)
-- ============================================================================

CREATE POLICY "Allow public read access for vendors" ON public.vendors
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access for contracts" ON public.contracts
    FOR SELECT USING (true);

CREATE POLICY "Allow full access for authenticated users on reports" ON public.audit_reports
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow full access for authenticated users on observations" ON public.audit_observations
    FOR ALL TO authenticated USING (true);


-- ============================================================================
-- HIGH-FIDELITY DEFENCE PROCUREMENTS MOCK DATA / SEED VALUES 
-- ============================================================================

-- VENDORS
INSERT INTO public.vendors (id, name, category, risk_score, flagged_contracts_count, status, registered_at, tax_id, owner_nationality, address, matches_peps, connected_vendors) VALUES
('V-101', 'AeroDef Jet Technologies', 'Jet Propulsion & Spares', 24, 0, 'Active', '2019-04-12', 'TAX-IN-AA0101', 'India', 'Bengaluru Defense Cluster, Sector 4, KA', false, ARRAY[]::TEXT[]),
('V-102', 'Zenith Armaments Corp', 'Infantry Ballistics', 87, 2, 'Flagged', '2023-01-15', 'TAX-IN-BA8829', 'Foreign Offshore Shell Corp', 'Grand Cayman Suite 402, British West Indies', true, ARRAY['V-104']),
('V-103', 'Kalyani Tactical Armor', 'Heavy Combat vehicles', 15, 0, 'Active', '2017-08-11', 'TAX-IN-CK9928', 'India', 'Industrial Zone, Pune, MH', false, ARRAY[]::TEXT[]),
('V-104', 'Apex Shell Solutions', 'Logistic Supplies', 93, 2, 'Under Investigation', '2022-11-20', 'TAX-IN-DF2210', 'Offshore Entity', 'Kingston Highway 11, Jamaica', true, ARRAY['V-102', 'V-105']),
('V-105', 'NovaTech Intelligence Systems', 'Radar & Microwave Sensors', 65, 1, 'Flagged', '2021-03-30', 'TAX-IN-ET9921', 'Israel-India Joint', 'Tech Park Electronic City, Bengaluru', false, ARRAY['V-104']);

-- CONTRACTS
INSERT INTO public.contracts (id, title, vendor_id, description, amount, department, category, status, risk_score, flag_reasons, flagged_count, anomaly_score, unit_price_deviation, registered_date, evidence, ai_explanation) VALUES
('C-7310', 'S-Band Air Surveillance Microwave Receiver Modules', 'V-105', 'Strategic procurement of 45 modern high-band microwave alert receiver panels for installation in coastal RADAR networks.', 48.50, 'DRDO / IAF', 'Radar & Sensors', 'Under Audit', 68, ARRAY['High Vendor Network Risk', '140% deviation from international supply averages', 'Registered near military base but with offshore parent shares'], 3, 74, 140.20, '2024-02-14', ARRAY['Discrepancy in Custom Declaration forms - V42', 'Price quote exceeds standard catalog by INR 28 Cr', 'Audit flag generated internally by Project Chakravek Engine'], 'AI Intelligence flags contract C-7310 due to an unexplainable 140.20% price inflation tier compared to analogous parts sourced by friendly nations, combined with V-105’s shared shell roots with V-104.'),
('C-6288', 'Medium Calibre Tracer Ammunition Shells - 50,000 Units', 'V-102', 'Supply of anti-tank trace rounds with enhanced secondary detonator mechanisms.', 8.20, 'Infantry Command / Army', 'Ammunition', 'Suspended', 91, ARRAY['Offshore Shell Corp Ownership', 'Matches Politically Exposed Persons list', 'Vendor register date is less than 3 months before tender award'], 3, 94, 12.50, '2023-06-18', ARRAY['Vendor awarded contract on sole-source bid justification', 'PEPs linkage identified to shell directors'], 'This contract exposes critical threat flags. Awarded to an offshore foreign entity V-102 registered in Grand Cayman with only 5 months of ledger history. Matches PEP lists in dynamic regulatory graphs.'),
('C-8511', 'Multi-role Heavy Combat Armored Plates', 'V-103', 'Indigenous manufacture and test cycle of blast-proof hull composites for Next-Gen Infantry transport vehicles.', 112.00, 'Heavy Combat Command', 'Combat Armor', 'Executed', 14, ARRAY[]::TEXT[], 0, 8, -4.50, '2024-01-05', ARRAY['No anomalies registered', 'Standard multiple-bids evaluation approved by CAG'], 'The procurement displays standard compliance structures. Highly recommended as template for general combat purchases.'),
('C-1090', 'Emergency Combat Medical Kits and Logistics Packs', 'V-104', 'Procurement of rapid deployment field surgical kits on single-source justification.', 15.60, 'Medical Services / Navy', 'Logistic Supplies', 'Under Audit', 85, ARRAY['Double-billing detected on multiple kits', 'Direct administrative links to blacklisted ballistics vendor V-102'], 2, 89, 78.40, '2024-05-12', ARRAY['Incomplete tracking codes', 'Owner connected to V-102 Cayman shells'], 'Vendor V-104 displays repetitive billing anomalies. Price points are significantly inflated (+78.4%) from past average Indian Army contract records.');

-- RISK SCORES BREAKDOWN
INSERT INTO public.risk_scores (contract_id, overall_risk, vendor_risk, direct_flag_risk, price_risk, entity_network_risk) VALUES
('C-7310', 68, 65, 55, 95, 82),
('C-6288', 91, 87, 98, 75, 90),
('C-8511', 14, 15, 5, 2, 10),
('C-1090', 85, 93, 85, 80, 78);
