import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"

const PAGE_SIZE = 20;

export function useCustomers({
  from,
  to,
  page,
}: {
  from: number;
  to: number;
  page: number;
}) {

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!from || !to) return;

    const fetchData = async () => {
      setLoading(true);

      const { data, error } = await supabase.rpc(
        "get_slot_customers",
        {
          start_hour: from,
          end_hour: to,
          page_size: PAGE_SIZE,
          page_offset: (page - 1) * PAGE_SIZE,
        }
      );

      if (error) {
        setError(error);
      } else {
        setData(data || []);
      }

      setLoading(false);
    };

    fetchData();
  }, [from, to, page]);

  return { data, loading, error };
}