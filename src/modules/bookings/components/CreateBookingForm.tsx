"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { bookingFormSchema } from "../bookingFormSchema"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "react-hot-toast"
import { format } from "date-fns"
import { DATE_FORMAT_CALENDAR } from "@/constants"
import dayjs from "dayjs"
import { useAuth } from "@/context/AuthContext"
import { calculateBookingTotal } from "@/lib/calculate-price"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useCreateBooking } from "../hooks/create-booking"
import { usePricingSlabs } from "../hooks/usePricingSlabs"
import { supabase } from "@/lib/supabase"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCustomerSearch } from "../hooks/useCustomerSearch"

export default function CreateBookingForm() {
  const createBooking = useCreateBooking()
  const { user } = useAuth()

  const [successState, setSuccessState] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const defaultValues = {
    advance_amount: 0,
    booking_date: new Date(),
    customer_name: "",
    customer_phone: "",
    start_time: "",
    end_time: "",
    payment_mode: "CASH",
    notes: "",
    start_datetime: null,
    end_datetime: null,
  }

  const form = useForm<any>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues,
  })

  const {
    watch,
    formState: { isSubmitting },
  } = form

  /* =========================
     CUSTOMER SEARCH (FIXED)
  ========================== */

  const { data: suggestions, loading } = useCustomerSearch(searchValue)

  useEffect(() => {
    if (searchValue.length >= 3 && suggestions.length > 0) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [searchValue, suggestions])

  function handleSelectSuggestion(item: any) {
    form.setValue("customer_name", item.name)
    form.setValue("customer_phone", item.phone)

    // 🔥 important (next-level UX)
    if (item.last_start) {
      form.setValue("start_time", dayjs(item.last_start).format("HH:mm"))
    }
    if (item.last_end) {
      form.setValue("end_time", dayjs(item.last_end).format("HH:mm"))
    }

    setSearchValue("") // 🔥 prevents API retrigger
    setShowSuggestions(false)
  }

  /* =========================
     TIME BUILD LOGIC
  ========================== */

  const watchedDate = watch("booking_date")
  const startTime = watch("start_time")
  const endTime = watch("end_time")

  useEffect(() => {
    if (!watchedDate || !startTime || !endTime) return

    const start = buildDateTime(watchedDate, startTime)
    const end = buildDateTime(watchedDate, endTime, startTime)

    form.setValue("start_datetime", start)
    form.setValue("end_datetime", end)

  }, [watchedDate, startTime, endTime])

  /* =========================
     PRICING
  ========================== */

  const { data: slabs } = usePricingSlabs()

  const startDateTime = watch("start_datetime")
  const endDateTime = watch("end_datetime")

  const total = useMemo(() => {
    if (!slabs || !startDateTime || !endDateTime) return 0

    return calculateBookingTotal(
      dayjs(startDateTime),
      dayjs(endDateTime),
      slabs
    )
  }, [slabs, startDateTime, endDateTime])

  /* =========================
     SESSION FIX
  ========================== */

  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") {
        supabase.auth.getSession();
      }
    }

    document.addEventListener("visibilitychange", handler)
    return () => document.removeEventListener("visibilitychange", handler)
  }, [])

  /* =========================
     SUBMIT
  ========================== */

  function onSubmit(values: any) {
    if (!values.start_datetime || !values.end_datetime) {
      toast.error("Invalid time selection")
      return
    }

    const payload: any = {
      p_customer_name: values.customer_name,
      p_phone: values.customer_phone,
      p_start: values.start_datetime.toISOString(),
      p_end: values.end_datetime.toISOString(),
      p_payment_amount: values.advance_amount || 0,
      p_payment_mode: values.payment_mode,
      p_notes: values.notes || null,
      p_created_by: user?.id,
    }

    createBooking.mutate(payload, {
      onError: (error: any) => {
        toast.error(error?.message || "Server error")
        createBooking.reset()
      },
      onSuccess: () => {
        toast.success("Booking created successfully!")
        createBooking.reset()
        form.reset(defaultValues)
        setSuccessState(true)
        setTimeout(() => setSuccessState(false), 3000)
      }
    })
  }

  /* =========================
     UI
  ========================== */

  return (
    <div className="relative grid md:grid-cols-2 gap-12">

      {successState && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="bg-white p-8 rounded-xl shadow-xl text-xl font-semibold">
            ✅ Booking Created Successfully
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-6 space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              <div className="grid grid-cols-2 gap-4 relative">

                {/* NAME FIELD */}
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          autoComplete="off"
                          onChange={(e) => {
                            field.onChange(e)
                            setSearchValue(e.target.value)
                          }}
                        />
                      </FormControl>

                      {showSuggestions && (
                        <div className="absolute z-50 top-full mt-2 w-full bg-white border rounded-md shadow-lg">

                          {loading && (
                            <div className="p-2 text-sm text-gray-500">
                              Searching...
                            </div>
                          )}

                          {!loading && suggestions.length === 0 && (
                            <div className="p-2 text-sm text-gray-500">
                              No results
                            </div>
                          )}

                          {!loading && suggestions.map((item, idx) => (
                            <div
                              key={idx}
                              onMouseDown={() => handleSelectSuggestion(item)}
                              className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                            >
                              <div className="font-medium">{item.name}</div>
                              <div className="text-gray-500 text-xs">{item.phone}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* PHONE */}
                <FormField
                  control={form.control}
                  name="customer_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>

              {/* REST SAME */}

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="booking_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="py-1">Date</FormLabel>
                      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline" className="pl-3 text-left font-normal">
                              {field.value ? format(field.value, DATE_FORMAT_CALENDAR) : "Pick a date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date)
                              setIsPopoverOpen(false)
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <TimeSelect name="start_time" label="Start Time" form={form} />
                <TimeSelect name="end_time" label="End Time" form={form} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="payment_mode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Mode</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CASH">Cash</SelectItem>
                          <SelectItem value="UPI">UPI</SelectItem>
                          <SelectItem value="ONLINE">Online</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="advance_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount Paid</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.value === "" ? "" : Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting || createBooking.isPending}
                className="w-full"
              >
                {createBooking.isPending ? "Creating..." : "Create Booking"}
              </Button>

            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Booking Summary</h2>
          <div>
            Duration: {startDateTime && endDateTime
              ? dayjs(endDateTime).diff(dayjs(startDateTime), "hour", true)
              : 0} hour(s)
          </div>
          <div>Total: ₹ {total}</div>
        </CardContent>
      </Card>
    </div>
  )
}

/* =========================
   TIME SELECT
========================== */

function TimeSelect({ name, label, form }: any) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <ScrollArea className="h-60">
                {Array.from({ length: 24 }, (_, i) => (
                  <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                    {dayjs().hour(i).minute(0).format("hh:mm A")}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

/* =========================
   MIDNIGHT LOGIC
========================== */

function buildDateTime(date: Date, time: string, startTimeString?: string) {
  const [hours, minutes] = time.split(":").map(Number)
  const dt = dayjs(date).hour(hours).minute(minutes).second(0).millisecond(0)

  if (startTimeString) {
    const [startHours, startMins] = startTimeString.split(":").map(Number)

    if (hours < startHours || (hours === startHours && minutes < startMins)) {
      return dt.add(1, "day").toDate()
    }
  }

  return dt.toDate()
}