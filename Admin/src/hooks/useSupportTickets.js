import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useSupportTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const { data, error: err } = await supabase
        .from('support_tickets')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email,
            client_code
          )
        `)
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
  }, [])

  const updateTicketStatus = async (id, status) => {
    const { error: err } = await supabase
      .from('support_tickets')
      .update({ status })
      .eq('id', id)
    
    if (!err) fetchTickets()
    return err
  }

  const replyToTicket = async (id, reply) => {
    const { error: err } = await supabase
      .from('support_tickets')
      .update({ 
        admin_reply: reply,
        status: 'resolved'
      })
      .eq('id', id)
    
    if (!err) fetchTickets()
    return err
  }

  return { tickets, loading, error, refetch: fetchTickets, updateTicketStatus, replyToTicket }
}
