import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useInvestments() {
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchInvestments = async () => {
    setLoading(true)
    try {
      const { data, error: err } = await supabase
        .from('investments')
        .select('*, profiles(full_name, client_code)')
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
  }, [])

  const createInvestment = async (investmentData) => {
    const { error: err } = await supabase
      .from('investments')
      .insert([investmentData])
    
    if (!err) fetchInvestments()
    return err
  }

  const updateInvestment = async (id, investmentData) => {
    const { error: err } = await supabase
      .from('investments')
      .update(investmentData)
      .eq('id', id)
    
    if (!err) fetchInvestments()
    return err
  }

  const deleteInvestment = async (id) => {
    const { error: err } = await supabase
      .from('investments')
      .delete()
      .eq('id', id)
    
    if (!err) fetchInvestments()
    return err
  }

  return { investments, loading, error, refetch: fetchInvestments, createInvestment, updateInvestment, deleteInvestment }
}
