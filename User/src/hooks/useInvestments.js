import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/authStore'

export function useInvestments() {
  const { user } = useAuthStore()
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchInvestments = async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error: err } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (err) throw err
      setInvestments(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvestments()
  }, [user])

  const totalPrincipal = investments.reduce((sum, inv) => sum + parseFloat(inv.principal), 0)
  const activeInvestments = investments.filter(inv => inv.status === 'active')

  const createRequest = async (principal, tenureMonths, notes = '') => {
    if (!user) return
    const { error: err } = await supabase.from('investments').insert({
      user_id: user.id,
      principal: parseFloat(principal),
      tenure_months: parseInt(tenureMonths),
      status: 'pending',
      start_date: new Date().toISOString().split('T')[0], // Default to today
      notes
    })
    if (err) throw err
    await fetchInvestments()
  }

  return { investments, loading, error, totalPrincipal, activeInvestments, refetch: fetchInvestments, createRequest }
}
