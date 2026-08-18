"use client";

import { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { CashHeader } from "./CashHeader";
import { CashTabs } from "./CashTabs";
import { CashSummaryCards } from "./CashSummaryCards";
import { CashSettlementSummary } from "./CashSettlementSummary";
import { CashExpensesTable } from "./CashExpensesTable";
import { CashSettlementsTable } from "./CashSettlementsTable";
import { AddExpenseDrawer } from "./AddExpenseDrawer";
import { AddSettlementDrawer } from "./AddSettlementDrawer";

import { useDailyCashSettlement } from "../hooks/useDailyCashSettlement";
import { useCashExpenses } from "../hooks/useCashExpenses";
import { useCashSettlements } from "../hooks/useCashSettlements";


type CashTab = "daily" | "expenses" | "settlements";

export function CashPageComponent() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [activeTab, setActiveTab] = useState<CashTab>("daily");

  const [isExpenseDrawerOpen, setIsExpenseDrawerOpen] = useState(false);

  const [isSettlementDrawerOpen, setIsSettlementDrawerOpen] = useState(false);

  const {
    data: dailyCash,
    isLoading,
    isError,
    isPending,
    refetch: refetchDailyCash,
  } = useDailyCashSettlement(selectedDate);

  const {
    data: expenses = [],
    isLoading: isExpensesLoading,
    isError: isExpensesError,
    refetch: refetchExpenses,
  } = useCashExpenses(selectedDate, activeTab === "expenses");

  const {
    data: settlements = [],
    isLoading: isSettlementsLoading,
    isError: isSettlementsError,
    refetch: refetchSettlements,
  } = useCashSettlements(selectedDate, activeTab === "settlements");


  if (isError) {
    return <div>Error loading cash data.</div>;
  }

  const cashAvailable =
  (dailyCash?.cashCollected ?? 0) -
  (dailyCash?.cashExpenses ?? 0);

  return (
    <div className="space-y-6 p-6">
      {/* Row 1 — Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Cash</h1>

        <p className="text-sm text-muted-foreground">
          Track daily cash, expenses, and settlements.
        </p>
      </div>

      {/* Row 2 — Date Controls */}
      <CashHeader
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onRefresh={() => {
          refetchDailyCash();
          refetchExpenses();
          refetchSettlements();
        }}
      />

      {/* Row 3 — Tabs */}
      <CashTabs
        value={activeTab}
        onChange={setActiveTab}
      />

      {/* Row 4 — Selected Tab Content */}

      {activeTab === "daily" && (
        <div className="space-y-4">
          <CashSummaryCards
            totalRevenue={dailyCash?.totalRevenue ?? 0}
            cashCollected={dailyCash?.cashCollected ?? 0}
            onlineCollected={dailyCash?.onlineCollected ?? 0}
            cashExpenses={dailyCash?.cashExpenses ?? 0}
            cashInHand={dailyCash?.cashInHand ?? 0}
          />

          <CashSettlementSummary
            cashAvailable={cashAvailable}
            totalSettled={dailyCash?.totalSettled ?? 0}
            onAddSettlement={() => setIsSettlementDrawerOpen(true)}
          />

          <AddSettlementDrawer
            businessDate={selectedDate}
            remainingCash={dailyCash?.cashInHand ?? 0}
            isOpen={isSettlementDrawerOpen}
            onClose={() => setIsSettlementDrawerOpen(false)}
          />

          <CashSettlementsTable settlements={[]} onAddSettlement={() => setIsSettlementDrawerOpen(true)} />
        </div>
      )}

      {activeTab === "expenses" && (
        <div className="space-y-4">
          
          {isExpensesLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : isExpensesError ? (
            <div className="text-sm text-destructive">
              Error loading expenses.
            </div>
          ) : (
            <CashExpensesTable expenses={expenses} onAddExpense={() => setIsExpenseDrawerOpen(true)} />
          )}

          <AddExpenseDrawer
            selectedDate={selectedDate}
            isOpen={isExpenseDrawerOpen}
            onClose={() => setIsExpenseDrawerOpen(false)}
          />
        </div>
      )}

      {activeTab === "settlements" && (
        <div className="space-y-4">
          {isSettlementsLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : isSettlementsError ? (
            <div className="text-sm text-destructive">
              Error loading settlements.
            </div>
          ) : (
            <CashSettlementsTable settlements={settlements} onAddSettlement={() => setIsSettlementDrawerOpen(true)} />
          )}
        </div>
      )}
    </div>
  );
}