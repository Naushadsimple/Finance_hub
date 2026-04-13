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

  const createService = async (serviceData) => {
    const { error: err } = await supabase
      .from('services')
      .insert([serviceData])
    
    if (!err) fetchServices()
    return err
  }

  const updateService = async (id, serviceData) => {
    const { error: err } = await supabase
      .from('services')
      .update(serviceData)
      .eq('id', id)
    
    if (!err) fetchServices()
    return err
  }

  const deleteService = async (id) => {
    const { error: err } = await supabase
      .from('services')
      .delete()
      .eq('id', id)
    
    if (!err) fetchServices()
    return err
  }

  return { services, loading, error, refetch: fetchServices, createService, updateService, deleteService }
}
