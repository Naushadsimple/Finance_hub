import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/authStore'

export function useProfile() {
  const { user, profile, fetchProfile } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateProfile = async (updates) => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const { error: err } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
      if (err) throw err
      await fetchProfile(user.id)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { profile, loading, error, updateProfile }
}
