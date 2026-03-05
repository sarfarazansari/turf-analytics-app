import { AdminBookingFilters } from "@/interfaces";
import { AddPaymentInput } from "@/interfaces/AddPayment";
import { supabase } from "@/lib/supabase";

export async function createBookingWithPayment(payload: any) {

  const { data, error } = await supabase.rpc(
    "create_booking_with_payment",
    payload
  );

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createBookingPayment(payload: AddPaymentInput) {
  

  const { data, error } = await supabase.rpc(
    "add_booking_payment",
    payload
  );

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getAdminBookingDetails(payload: string) {
  

  const { data, error } = await supabase.rpc(
    "get_admin_booking_detail",
    { p_booking_id: payload }
  );

  if (error) {
    throw new Error(error.message);
  }

  return data;
}


export async function getAdminBookings(filters: AdminBookingFilters & { page: number; limit: number; }) {
  

  const { data, error } = await supabase.rpc(
    "get_admin_bookings",
    {
      p_from_date: filters.fromDate,
      p_to_date: filters.toDate,
      p_booking_status: (filters.bookingStatus === "ALL" ? null : filters.bookingStatus),
      p_payment_status: (filters.paymentStatus === "ALL" ? null : filters.paymentStatus),
      p_search: filters.search || null,
      p_page: filters.page,
      p_limit: filters.limit,
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  return data;
}


// try {
//         const response = await withTimeout(
//           (async () => {
//             return await supabase.rpc("create_booking_with_payment", payload);
//           })(),
//           10000
//         );

//         if (response.error) {
//           throw response.error;
//         }

//         return response.data;
//       } catch (err) {
//         throw err;
//       }