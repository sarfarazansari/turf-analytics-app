-- Fix daily cash settlement to include completed bookings.
-- Only cancelled bookings should be excluded.

CREATE OR REPLACE FUNCTION public.get_daily_cash_settlement(
    p_business_date date
)
RETURNS TABLE (
    business_date date,
    total_revenue numeric,
    cash_collected numeric,
    online_collected numeric,
    cash_expenses numeric,
    total_settled numeric,
    cash_in_hand numeric
)
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
    WITH daily_payments AS (
        SELECT
            COALESCE(SUM(p.amount), 0)::numeric AS total_revenue,

            COALESCE(
                SUM(p.amount) FILTER (
                    WHERE p.payment_mode = 'CASH'
                ),
                0
            )::numeric AS cash_collected,

            COALESCE(
                SUM(p.amount) FILTER (
                    WHERE p.payment_mode <> 'CASH'
                ),
                0
            )::numeric AS online_collected

        FROM public.payments p

        INNER JOIN public.bookings b
            ON b.id = p.booking_id

        WHERE
            p.voided_at IS NULL
            AND b.booking_status != 'CANCELLED'
            AND (
                b.start_datetime AT TIME ZONE 'Asia/Kolkata'
            )::date = p_business_date
    ),

    daily_expenses AS (
        SELECT
            COALESCE(SUM(amount), 0)::numeric AS cash_expenses
        FROM public.cash_expenses
        WHERE business_date = p_business_date
    ),

    daily_settlements AS (
        SELECT
            COALESCE(SUM(settlement_amount), 0)::numeric AS total_settled
        FROM public.cash_settlements
        WHERE business_date = p_business_date
    )

    SELECT
        p_business_date,
        dp.total_revenue,
        dp.cash_collected,
        dp.online_collected,
        de.cash_expenses,
        ds.total_settled,
        (
            dp.cash_collected
            - de.cash_expenses
            - ds.total_settled
        )::numeric AS cash_in_hand

    FROM daily_payments dp
    CROSS JOIN daily_expenses de
    CROSS JOIN daily_settlements ds;
$$;