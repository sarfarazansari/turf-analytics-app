"use client";

import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useAdminBookingDetail } from "../hooks/useAdminBookingDetail";
import { useAddPayment } from "../hooks/useAddPayment";
import toast from "react-hot-toast";
import { formatCurrency } from "@/lib/currency-format";

interface Props {
  bookingId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const schema = z.object({
  amount: z.number().positive().int(),
  paymentMode: z.enum(["CASH", "UPI", "ONLINE", "OTHER"]),
}).strict();

type FormValues = z.infer<typeof schema>;


export function BookingDetailsDrawer({
  bookingId,
  isOpen,
  onClose,
}: Props) {
  const { data, isLoading } = useAdminBookingDetail(bookingId);

  const addPayment = useAddPayment();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0,
      paymentMode: "CASH",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!bookingId) return;

    try {
      await addPayment.mutateAsync({
        bookingId,
        amount: values.amount,
        paymentMode: values.paymentMode,
      });

      form.reset({
        amount: 0,
        paymentMode: "CASH",
      });
      addPayment.reset();
      toast.success("Payment added successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add payment"); 
    }
  };
  const amount = form.watch("amount");
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-125 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Booking Details</SheetTitle>
          <SheetDescription className="sr-only">
            description goes here
          </SheetDescription>
        </SheetHeader>

        {isLoading || !data ? (
          <div className="py-10 text-center">
            Loading...
          </div>
        ) : (
          <div className="space-y-6 p-6">
            {/* Booking Info */}
            <div className="space-y-2">
              <div className="font-semibold">
                {data.customer_name}
              </div>
              <div>{data.customer_phone}</div>

              <div className="text-sm text-muted-foreground">
                {dayjs(data.start_datetime).format(
                  "DD MMM YYYY hh:mm A"
                )}{" "}
                –{" "}
                {dayjs(data.end_datetime).format(
                  "hh:mm A"
                )}
              </div>

              <Badge>{data.booking_status}</Badge>
            </div>

            {/* Financial Summary */}
            <div className="border rounded-xl p-4 space-y-2">
              <div>
                Total:{" "}
                <strong>
                  {formatCurrency(data.total_amount)}
                </strong>
              </div>

              <div>
                Paid:{" "}
                <strong>
                  {formatCurrency(
                    data.payments.reduce(
                      (sum, p) => sum + p.amount,
                      0
                    )
                  )}
                </strong>
              </div>
              <div>
                Remaining:{" "}
                <strong>
                  {formatCurrency(data.total_amount - data.payments.reduce((sum, p) => sum + p.amount, 0))}
                </strong>
              </div>
            </div>

            {/* Payments List */}
            <div>
              <h4 className="font-semibold mb-2">
                Payments
              </h4>

              {data.payments.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No payments yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {data.payments.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between text-sm border p-2 rounded-md"
                    >
                      <div>
                        {formatCurrency(p.amount)} —{" "}
                        {p.payment_mode}
                      </div>
                      <div className="text-muted-foreground">
                        {dayjs(p.created_at).format(
                          "DD MMM hh:mm A"
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Payment */}
            { (data.payment_status !== 'FULL_PAID') && (
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                <h4 className="font-semibold">
                Add Payment
              </h4>

              <Input
                type="number"
                placeholder="Amount"
                {...form.register("amount", { valueAsNumber: true })}
              />

              <Select
                value={form.watch("paymentMode")}
                onValueChange={(value) =>
                  form.setValue(
                    "paymentMode",
                    value as any
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">
                    Cash
                  </SelectItem>
                  <SelectItem value="UPI">
                    UPI
                  </SelectItem>
                  <SelectItem value="ONLINE">
                    Online
                  </SelectItem>
                  <SelectItem value="OTHER">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                className="cursor-pointer"
                type="submit"
                disabled={
                  addPayment.isPending ||
                  !amount ||
                  amount <= 10
                }
              >
                Add Payment
              </Button>
            </form>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}