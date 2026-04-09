import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/authStore'
import { BUCKET_NAME } from '../constants'

export function useCertificates() {
  const { user } = useAuthStore()
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCertificates = async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error: err } = await supabase
        .from('certificates')
        .select('*, investments(principal, status)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (err) throw err
      setCertificates(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCertificates()
  }, [user])

  const downloadCertificate = async (filePath) => {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 3600) // 60 min expiry
    if (error) throw error
    window.open(data.signedUrl, '_blank')
  }

  return { certificates, loading, error, downloadCertificate, refetch: fetchCertificates }
}
