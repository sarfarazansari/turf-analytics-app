-- Cash tracking: runtime expenses + cash settlements

-- ============================================
-- 1. Cash Expenses
-- ============================================

CREATE TABLE public.cash_expenses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    business_date date NOT NULL,

    amount numeric(12,2) NOT NULL
        CHECK (amount > 0),

    description text NOT NULL,

    bill_available boolean NOT NULL DEFAULT false,

    notes text,

    created_by uuid NOT NULL
        REFERENCES public.profiles(id),

    created_at timestamptz NOT NULL DEFAULT now(),

    updated_at timestamptz NOT NULL DEFAULT now()
);


-- ============================================
-- 2. Cash Settlements
-- ============================================

CREATE TABLE public.cash_settlements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    business_date date NOT NULL,

    settlement_amount numeric(12,2) NOT NULL
        CHECK (settlement_amount > 0),

    settlement_date date NOT NULL,

    notes text,

    created_by uuid NOT NULL
        REFERENCES public.profiles(id),

    created_at timestamptz NOT NULL DEFAULT now(),

    updated_at timestamptz NOT NULL DEFAULT now()
);


-- ============================================
-- 3. Indexes
-- ============================================

CREATE INDEX idx_cash_expenses_business_date
    ON public.cash_expenses (business_date);

CREATE INDEX idx_cash_settlements_business_date
    ON public.cash_settlements (business_date);


-- ============================================
-- 4. Updated-at triggers
-- ============================================

CREATE TRIGGER update_cash_expenses_updated_at
    BEFORE UPDATE ON public.cash_expenses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cash_settlements_updated_at
    BEFORE UPDATE ON public.cash_settlements
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================
-- 5. Row Level Security
-- ============================================

ALTER TABLE public.cash_expenses ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.cash_settlements ENABLE ROW LEVEL SECURITY;


-- ============================================
-- 6. Cash Expenses Policies
-- ============================================

CREATE POLICY "Allow authenticated users to read cash expenses"
    ON public.cash_expenses
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert cash expenses"
    ON public.cash_expenses
    FOR INSERT
    TO authenticated
    WITH CHECK (created_by = auth.uid());

CREATE POLICY "Allow authenticated users to update cash expenses"
    ON public.cash_expenses
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);


-- ============================================
-- 7. Cash Settlements Policies
-- ============================================

CREATE POLICY "Allow authenticated users to read cash settlements"
    ON public.cash_settlements
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert cash settlements"
    ON public.cash_settlements
    FOR INSERT
    TO authenticated
    WITH CHECK (created_by = auth.uid());

CREATE POLICY "Allow authenticated users to update cash settlements"
    ON public.cash_settlements
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);