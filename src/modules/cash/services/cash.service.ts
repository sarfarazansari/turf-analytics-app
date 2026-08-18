import { supabase } from "@/lib/supabase";

export interface DailyCashSettlement {
  businessDate: string;
  totalRevenue: number;
  cashCollected: number;
  onlineCollected: number;
  cashExpenses: number;
  totalSettled: number;
  cashInHand: number;
}

export async function getDailyCashSettlement(
  businessDate: string
): Promise<DailyCashSettlement> {
  const { data, error } = await supabase.rpc(
    "get_daily_cash_settlement",
    {
      p_business_date: businessDate,
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  const result = data?.[0];

  if (!result) {
    return {
      businessDate,
      totalRevenue: 0,
      cashCollected: 0,
      onlineCollected: 0,
      cashExpenses: 0,
      totalSettled: 0,
      cashInHand: 0,
    };
  }

  return {
    businessDate: result.business_date,
    totalRevenue: Number(result.total_revenue ?? 0),
    cashCollected: Number(result.cash_collected ?? 0),
    onlineCollected: Number(result.online_collected ?? 0),
    cashExpenses: Number(result.cash_expenses ?? 0),
    totalSettled: Number(result.total_settled ?? 0),
    cashInHand: Number(result.cash_in_hand ?? 0),
  };
}

export interface CashExpense {
  id: string;
  businessDate: string;
  amount: number;
  description: string;
  billAvailable: boolean;
  notes: string | null;
}

export async function getCashExpenses(
  businessDate: string
): Promise<CashExpense[]> {
  const { data, error } = await supabase
    .from("cash_expenses")
    .select(
      "id, business_date, amount, description, bill_available, notes"
    )
    .eq("business_date", businessDate)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    data?.map((expense) => ({
      id: expense.id,
      businessDate: expense.business_date,
      amount: Number(expense.amount),
      description: expense.description,
      billAvailable: expense.bill_available,
      notes: expense.notes,
    })) ?? []
  );
}


export interface CashSettlement {
  id: string;
  businessDate: string;
  settlementDate: string;
  amount: number;
  notes: string | null;
}

export async function getCashSettlements(
  businessDate: string
): Promise<CashSettlement[]> {
  const { data, error } = await supabase
    .from("cash_settlements")
    .select(
      "id, business_date, settlement_date, settlement_amount, notes"
    )
    .eq("business_date", businessDate)
    .order("settlement_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    data?.map((settlement) => ({
      id: settlement.id,
      businessDate: settlement.business_date,
      settlementDate: settlement.settlement_date,
      amount: Number(settlement.settlement_amount),
      notes: settlement.notes,
    })) ?? []
  );
}


export async function createCashExpense({
  businessDate,
  amount,
  description,
  billAvailable,
  notes,
  createdBy,
}: {
  businessDate: string;
  amount: number;
  description: string;
  billAvailable: boolean;
  notes?: string | null;
  createdBy: string;
}) {
  const { data, error } = await supabase
    .from("cash_expenses")
    .insert({
      business_date: businessDate,
      amount,
      description,
      bill_available: billAvailable,
      notes: notes || null,
      created_by: createdBy,
    })
    .select(
      "id, business_date, amount, description, bill_available, notes, created_at"
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: data.id,
    businessDate: data.business_date,
    amount: Number(data.amount),
    description: data.description,
    billAvailable: data.bill_available,
    notes: data.notes,
    createdAt: data.created_at,
  };
}

export async function createCashSettlement({
  businessDate,
  settlementDate,
  amount,
  notes,
  createdBy,
}: {
  businessDate: string;
  settlementDate: string;
  amount: number;
  notes?: string | null;
  createdBy: string;
}) {
  const { data, error } = await supabase
    .from("cash_settlements")
    .insert({
      business_date: businessDate,
      settlement_date: settlementDate,
      settlement_amount: amount,
      notes: notes || null,
      created_by: createdBy,
    })
    .select(
      "id, business_date, settlement_date, settlement_amount, notes, created_at"
    )
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: data.id,
    businessDate: data.business_date,
    settlementDate: data.settlement_date,
    amount: Number(data.settlement_amount),
    notes: data.notes,
    createdAt: data.created_at,
  };
}