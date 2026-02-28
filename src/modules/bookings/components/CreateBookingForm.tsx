"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { bookingFormSchema } from "../schema"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "react-hot-toast";

export default function CreateBookingForm() {
  const [loading, setLoading] = useState(false)
  const [successState, setSuccessState] = useState(false)

  const form = useForm<any>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      amount_paid: 0,
    },
  })

  const { watch, reset } = form

  const watchedDate = watch("date")
  const startTime = watch("start_time")
  const endTime = watch("end_time")

  const { duration, total } = useMemo(() => {
    if (!watchedDate || !startTime || !endTime) {
      return { duration: 0, total: 0 }
    }

    const start = buildDateTime(watchedDate, startTime)
    const end = buildDateTime(watchedDate, endTime, true)

    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

    const ratePerHour = 800 // 🔥 replace later with DB pricing slab
    return {
      duration: hours > 0 ? hours : 0,
      total: hours > 0 ? hours * ratePerHour : 0,
    }
  }, [watchedDate, startTime, endTime])

  async function onSubmit(values: any) {
    try {
      setLoading(true)

      const start_datetime = buildDateTime(values.date, values.start_time)
      const end_datetime = buildDateTime(values.date, values.end_time, true)

      const { error } = await supabase.from("bookings").insert({
        customer_name: values.customer_name,
        customer_phone: values.customer_phone,
        start_datetime,
        end_datetime,
        payment_mode: values.payment_mode,
        amount_paid: values.amount_paid,
        notes: values.notes,
        booking_status: "BOOKED",
      })

      if (error) throw error

      setSuccessState(true)
      reset()

      setTimeout(() => {
        setSuccessState(false)
      }, 30000)

      toast.success("Booking created successfully")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (successState) {
    return (
      <Card className="p-10 text-center text-xl font-semibold">
        ✅ Booking Created Successfully
        <p className="text-sm text-muted-foreground mt-4">
          Form will reappear shortly...
        </p>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* LEFT FORM */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <div>
              <Label>Name</Label>
              <Input {...form.register("customer_name")} />
            </div>

            <div>
              <Label>Phone</Label>
              <Input {...form.register("customer_phone")} />
            </div>

            <div>
              <Label>Date</Label>
              <Calendar
                mode="single"
                selected={watchedDate}
                onSelect={(date) => form.setValue("date", date!)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input type="time" {...form.register("start_time")} />
              </div>
              <div>
                <Label>End Time</Label>
                <Input type="time" {...form.register("end_time")} />
              </div>
            </div>

            <div>
              <Label>Payment Mode</Label>
              <Select onValueChange={(v) => form.setValue("payment_mode", v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="ONLINE">Online</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Amount Paid</Label>
              <Input
                type="number"
                {...form.register("amount_paid", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea {...form.register("notes")} />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create Booking"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* RIGHT SUMMARY */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Booking Summary</h2>
          <div>Duration: {duration} hour(s)</div>
          <div>Total: ₹ {total}</div>
          <div className="text-sm text-muted-foreground">
            * Final total will be recalculated by backend
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// midnight logic
function buildDateTime(date: Date, time: string, allowMidnight = false) {
  const [hours, minutes] = time.split(":").map(Number)
  const dt = new Date(date)
  dt.setHours(hours, minutes, 0, 0)

  if (allowMidnight && dt < new Date(date.setHours(hours))) {
    dt.setDate(dt.getDate() + 1)
  }

  return dt
}