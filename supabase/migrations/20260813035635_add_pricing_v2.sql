-- ============================================================
-- Turf Analytics V2 Pricing
-- V2 effective: 2026-08-15 00:00:00 IST
-- ============================================================


-- ============================================================
-- 1. Pricing versions
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pricing_versions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    effective_from timestamptz NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,

    CONSTRAINT pricing_versions_pkey PRIMARY KEY (id),
    CONSTRAINT pricing_versions_name_key UNIQUE (name),
    CONSTRAINT pricing_versions_effective_from_key UNIQUE (effective_from)
);

ALTER TABLE public.pricing_versions OWNER TO postgres;


-- ============================================================
-- 2. Add version reference to pricing slabs
-- ============================================================

ALTER TABLE public.pricing_slabs
ADD COLUMN IF NOT EXISTS pricing_version_id uuid;


-- ============================================================
-- 3. Create V1
-- ============================================================

INSERT INTO public.pricing_versions (
    name,
    effective_from,
    is_active
)
VALUES (
    'V1',
    '1970-01-01 00:00:00+00',
    true
)
ON CONFLICT (name) DO NOTHING;


-- ============================================================
-- 4. Attach existing production slabs to V1
-- ============================================================

UPDATE public.pricing_slabs
SET pricing_version_id = (
    SELECT id
    FROM public.pricing_versions
    WHERE name = 'V1'
)
WHERE pricing_version_id IS NULL;


-- ============================================================
-- 5. Make version mandatory
-- ============================================================

ALTER TABLE public.pricing_slabs
ALTER COLUMN pricing_version_id SET NOT NULL;


-- ============================================================
-- 6. Foreign key
-- ============================================================

ALTER TABLE public.pricing_slabs
ADD CONSTRAINT pricing_slabs_pricing_version_id_fkey
FOREIGN KEY (pricing_version_id)
REFERENCES public.pricing_versions(id);


-- ============================================================
-- 7. Prevent duplicate slabs within a version
-- ============================================================

ALTER TABLE public.pricing_slabs
ADD CONSTRAINT pricing_slabs_version_start_end_unique
UNIQUE (
    pricing_version_id,
    start_time,
    end_time
);


-- ============================================================
-- 8. Create V2
-- ============================================================

INSERT INTO public.pricing_versions (
    name,
    effective_from,
    is_active
)
VALUES (
    'V2',
    '2026-08-15 00:00:00+05:30',
    true
)
ON CONFLICT (name) DO NOTHING;


-- ============================================================
-- 9. V2 slabs
-- ============================================================

INSERT INTO public.pricing_slabs (
    pricing_version_id,
    start_time,
    end_time,
    rate_per_hour,
    is_active
)
SELECT
    pv.id,
    v.start_time,
    v.end_time,
    v.rate_per_hour,
    true
FROM public.pricing_versions pv
CROSS JOIN (
    VALUES
        ('00:00:00'::time, '06:00:00'::time, 650.00::numeric),
        ('06:00:00'::time, '17:00:00'::time, 400.00::numeric),
        ('17:00:00'::time, '23:59:59'::time, 650.00::numeric)
) AS v(start_time, end_time, rate_per_hour)
WHERE pv.name = 'V2'
ON CONFLICT (
    pricing_version_id,
    start_time,
    end_time
) DO NOTHING;

-- ============================================================
-- 10. Update pricing slab read policy
-- ============================================================

CREATE OR REPLACE VIEW public.current_pricing_slabs AS
SELECT
    ps.id,
    ps.start_time,
    ps.end_time,
    ps.rate_per_hour,
    ps.is_active
FROM public.pricing_slabs ps
JOIN public.pricing_versions pv
    ON pv.id = ps.pricing_version_id
WHERE pv.is_active = true
  AND pv.effective_from <= now()
  AND ps.is_active = true;


-- ============================================================
-- 10. Index pricing version lookup
-- ============================================================

CREATE INDEX IF NOT EXISTS pricing_versions_effective_from_idx
ON public.pricing_versions (effective_from DESC)
WHERE is_active = true;


-- ============================================================
-- 11. RLS
-- ============================================================

ALTER TABLE public.pricing_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read pricing versions"
ON public.pricing_versions
FOR SELECT
TO authenticated
USING (true);


-- ============================================================
-- 12. Replace booking creation RPC
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_booking_with_payment(
    p_customer_name text,
    p_phone text,
    p_start timestamptz,
    p_end timestamptz,
    p_payment_amount numeric,
    p_payment_mode text,
    p_notes text,
    p_created_by uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total numeric := 0;
    v_current timestamptz;
    v_rate numeric;
    v_booking_id uuid;
    v_pricing_version_id uuid;
BEGIN

    IF p_end <= p_start THEN
        RAISE EXCEPTION 'End time must be greater than start time';
    END IF;

    v_current := p_start;

    WHILE v_current < p_end LOOP

        -- Find pricing version for this hour
        SELECT id
        INTO v_pricing_version_id
        FROM public.pricing_versions
        WHERE is_active = true
          AND effective_from <= v_current
        ORDER BY effective_from DESC
        LIMIT 1;

        IF v_pricing_version_id IS NULL THEN
            RAISE EXCEPTION
                'No pricing version found for time %',
                v_current;
        END IF;

        -- Find rate for this hour
        SELECT rate_per_hour
        INTO v_rate
        FROM public.pricing_slabs
        WHERE pricing_version_id = v_pricing_version_id
          AND is_active = true
          AND (v_current AT TIME ZONE 'Asia/Kolkata')::time >= start_time
          AND (v_current AT TIME ZONE 'Asia/Kolkata')::time < end_time
        LIMIT 1;

        IF v_rate IS NULL THEN
            RAISE EXCEPTION
                'No pricing slab found for time %',
                v_current;
        END IF;

        v_total := v_total + v_rate;

        v_current := v_current + interval '1 hour';

    END LOOP;

    INSERT INTO public.bookings (
        customer_name,
        customer_phone,
        start_datetime,
        end_datetime,
        total_amount,
        booking_status,
        created_by,
        notes
    )
    VALUES (
        p_customer_name,
        p_phone,
        p_start,
        p_end,
        v_total,
        'BOOKED',
        p_created_by,
        p_notes
    )
    RETURNING id INTO v_booking_id;

    IF p_payment_amount > 0 THEN
        INSERT INTO public.payments (
            booking_id,
            amount,
            payment_mode,
            created_by,
            notes
        )
        VALUES (
            v_booking_id,
            p_payment_amount,
            p_payment_mode::public.payment_mode,
            p_created_by,
            p_notes
        );
    END IF;

    RETURN json_build_object(
        'booking_id', v_booking_id,
        'total_amount', v_total
    );

END;
$$;

ALTER FUNCTION public.create_booking_with_payment(
    text,
    text,
    timestamptz,
    timestamptz,
    numeric,
    text,
    text,
    uuid
) OWNER TO postgres;