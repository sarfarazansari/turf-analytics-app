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
      <TabsList className="grid h-auto w-full grid-cols-3">
        <TabsTrigger value="daily" className="px-2 text-xs sm:text-sm">
          Daily Cash
        </TabsTrigger>

        <TabsTrigger value="expenses" className="px-2 text-xs sm:text-sm">
          Expenses
        </TabsTrigger>

        <TabsTrigger value="settlements" className="px-2 text-xs sm:text-sm">
          Settlements
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}