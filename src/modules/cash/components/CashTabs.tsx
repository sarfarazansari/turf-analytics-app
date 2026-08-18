"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type CashTab = "daily" | "expenses" | "settlements";

type CashTabsProps = {
  value: CashTab;
  onChange: (value: CashTab) => void;
};

export function CashTabs({
  value,
  onChange,
}: CashTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(value) => onChange(value as CashTab)}
    >
      <TabsList>
        <TabsTrigger value="daily">
          Daily Cash
        </TabsTrigger>

        <TabsTrigger value="expenses">
          Expenses
        </TabsTrigger>

        <TabsTrigger value="settlements">
          Settlements
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}