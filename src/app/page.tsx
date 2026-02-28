'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  useEffect(() => {
    async function test() {
      const { data, error } = await supabase.from('bookings').select('*')
      console.log(data, error)
    }

    test()
  }, [])

  return <div className="p-10 text-xl">Turf Analytics Ready</div>
}