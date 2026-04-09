import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useCertificates() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCertificates = async () => {
    setLoading(true)
    try {
      const { data, error: err } = await supabase
        .from('certificates')
        .select(`
          *,
          user:profiles!certificates_user_id_fkey(full_name),
          admin:profiles!certificates_uploaded_by_fkey(full_name),
          investments(principal)
        `)
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
  }, [])

  const deleteCertificate = async (id, filePath) => {
    // 1. Delete from storage
    if (filePath) {
      await supabase.storage.from('certificates').remove([filePath])
    }
    
    // 2. Delete from DB
    const { error: err } = await supabase
      .from('certificates')
      .delete()
      .eq('id', id)
    
    if (!err) fetchCertificates()
    return err
  }

  return { certificates, loading, error, refetch: fetchCertificates, deleteCertificate }
}
