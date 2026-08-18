"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { format } from "date-fns";
import dayjs from "@/lib/dayjs";

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

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { DATE_FORMAT_CALENDAR } from "@/constants";
import {
  cashSettlementSchema,
  CashSettlementFormValues,
} from "../schema/cashSettlementSchema";

import { useCreateCashSettlement } from "../hooks/useCreateCashSettlement";
import { useAuth } from "@/context/AuthContext";

interface Props {
  businessDate: Date;
  remainingCash: number;
  isOpen: boolean;
  onClose: () => void;
}

export function AddSettlementDrawer({
  businessDate,
  remainingCash,
  isOpen,
  onClose,
}: Props) {
  const { user } = useAuth();
  const createSettlement = useCreateCashSettlement();

  const form = useForm<CashSettlementFormValues>({
    resolver: zodResolver(cashSettlementSchema),
    defaultValues: {
      amount: 0,
      settlementDate: new Date(),
      notes: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        amount: remainingCash > 0 ? remainingCash : 0,
        settlementDate: new Date(),
        notes: "",
      });
    }
  }, [isOpen, remainingCash, form]);

  const onSubmit = async (values: CashSettlementFormValues) => {
    if (!user?.id) {
      toast.error("User session not found");
      return;
    }

    if (values.amount > remainingCash) {
      toast.error("Settlement amount cannot exceed remaining cash");
      return;
    }

    try {
      await createSettlement.mutateAsync({
        businessDate: dayjs(businessDate).format("YYYY-MM-DD"),
        settlementDate: dayjs(values.settlementDate).format("YYYY-MM-DD"),
        amount: values.amount,
        notes: values.notes || null,
        createdBy: user.id,
      });

      toast.success("Settlement added successfully");

      form.reset();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to add settlement");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-125 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add Settlement</SheetTitle>

          <SheetDescription>
            Record cash handed over for the selected business date.
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
                        max={remainingCash}
                        {...field}
                        onChange={(event) =>
                          field.onChange(event.target.valueAsNumber)
                        }
                      />
                    </FormControl>

                    <p className="text-sm text-muted-foreground">
                      Remaining cash: {remainingCash}
                    </p>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="settlementDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Settlement Date</FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            {field.value
                              ? format(
                                  field.value,
                                  DATE_FORMAT_CALENDAR
                                )
                              : "Pick a date"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      <PopoverContent
                        className="w-auto p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
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
                  disabled={
                    createSettlement.isPending ||
                    !remainingCash
                  }
                >
                  {createSettlement.isPending
                    ? "Adding..."
                    : "Add Settlement"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}