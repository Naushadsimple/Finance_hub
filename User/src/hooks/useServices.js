import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchServices = async () => {
    setLoading(true)
    try {
      const { data, error: err } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })
      
      if (err) throw err
      setServices(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  return { services, loading, error, refetch: fetchServices }
}
