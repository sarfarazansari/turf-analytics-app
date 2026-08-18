"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Switch } from "@/components/ui/switch";

import {
  cashExpenseSchema,
  CashExpenseFormValues,
} from "../schema/cashExpenseSchema";

import { useCreateCashExpense } from "../hooks/useCreateCashExpense";

import { useAuth } from "@/context/AuthContext";
import dayjs from "@/lib/dayjs";

interface Props {
  selectedDate: Date;
  isOpen: boolean;
  onClose: () => void;
}

export function AddExpenseDrawer({
  selectedDate,
  isOpen,
  onClose,
}: Props) {
  const { user } = useAuth();
  const createExpense = useCreateCashExpense();

  const form = useForm<CashExpenseFormValues>({
    resolver: zodResolver(cashExpenseSchema),
    defaultValues: {
      amount: 0,
      description: "",
      billAvailable: false,
      notes: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        amount: 0,
        description: "",
        billAvailable: false,
        notes: "",
      });
    }
  }, [isOpen, form]);

  const onSubmit = async (values: CashExpenseFormValues) => {
    if (!user?.id) {
      toast.error("User session not found");
      return;
    }

    try {
      await createExpense.mutateAsync({
        businessDate: dayjs(selectedDate).format("YYYY-MM-DD"),
        amount: values.amount,
        description: values.description,
        billAvailable: values.billAvailable,
        notes: values.notes || null,
        createdBy: user.id,
      });

      toast.success("Expense added successfully");

      form.reset();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to add expense");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-125 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Expense</SheetTitle>

          <SheetDescription>
            Record a cash expense for the selected business date.
          </SheetDescription>
        </SheetHeader>

        <div className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(event) =>
                          field.onChange(
                            event.target.valueAsNumber
                          )
                        }
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="e.g. Electricity"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billAvailable"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <FormLabel>Bill Available</FormLabel>

                      <p className="text-sm text-muted-foreground">
                        Is there a bill or receipt for this expense?
                      </p>
                    </div>

                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>

                    <FormControl>
                      <Textarea
                        placeholder="Optional notes"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={createExpense.isPending}
                >
                  {createExpense.isPending
                    ? "Adding..."
                    : "Add Expense"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}