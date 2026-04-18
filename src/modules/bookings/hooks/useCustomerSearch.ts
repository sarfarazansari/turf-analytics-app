import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export function useCustomerSearch(query: string, skip?: boolean) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (skip) return

    if (!query || query.length < 3) {
      setData([])
      return
    }

    const timeout = setTimeout(async () => {
      setLoading(true)

      const { data, error } = await supabase.rpc("search_customers", {
        search_text: query,
      })

      if (!error && data) {
        setData(data)
      }

      setLoading(false)
    }, 300)

    return () => clearTimeout(timeout)
  }, [query, skip])

  // 👇 expose reset
  const reset = () => setData([])

  return { data, loading, reset }
}