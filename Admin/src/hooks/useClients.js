import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchClients = async () => {
    setLoading(true)
    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .select('*')
        .neq('role', 'admin')
        .order('created_at', { ascending: false })
      
      if (err) throw err
      setClients(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const createClient = async (clientData) => {
    // Generate a client code if not provided
    const clientCode = `FH-${Math.floor(1000 + Math.random() * 9000)}`
    const { error: err } = await supabase
      .from('profiles')
      .insert([{ ...clientData, role: 'client', client_code: clientCode }])
    
    if (!err) fetchClients()
    return err
  }

  const updateClient = async (id, clientData) => {
    const { error: err } = await supabase
      .from('profiles')
      .update(clientData)
      .eq('id', id)
    
    if (!err) fetchClients()
    return err
  }

  const deleteClient = async (id) => {
    const { error: err } = await supabase.from('profiles').delete().eq('id', id)
    if (!err) fetchClients()
    return err
  }

  return { clients, loading, error, refetch: fetchClients, createClient, updateClient, deleteClient }
}
