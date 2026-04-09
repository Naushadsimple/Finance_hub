import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/authStore'

export function useSupport() {
  const { user } = useAuthStore()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTickets = async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error: err } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (err) throw err
      setTickets(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [user])

  const createTicket = async (subject, message) => {
    if (!user) return
    const { error: err } = await supabase.from('support_tickets').insert({
      user_id: user.id,
      subject,
      message,
    })
    if (err) throw err
    await fetchTickets()
  }

  return { tickets, loading, error, createTicket, refetch: fetchTickets }
}
