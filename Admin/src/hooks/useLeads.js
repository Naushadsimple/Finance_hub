import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const { data, error: err } = await supabase
        .from('leads')
        .select('*')
        .order('submitted_at', { ascending: false })
      
      if (err) throw err
      setLeads(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  const updateLead = async (id, leadData) => {
    const { error: err } = await supabase
      .from('leads')
      .update(leadData)
      .eq('id', id)
    
    if (!err) fetchLeads()
    return err
  }

  const deleteLead = async (id) => {
    const { error: err } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)
    
    if (!err) fetchLeads()
    return err
  }

  return { leads, loading, error, refetch: fetchLeads, updateLead, deleteLead }
}
