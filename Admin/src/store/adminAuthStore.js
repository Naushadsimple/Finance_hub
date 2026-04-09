import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

export const useAdminAuthStore = create((set, get) => ({
  session: null,
  user: null,
  profile: null,
  loading: true,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      try {
        const profile = await get().fetchProfile(session.user.id)
        if (profile?.role === 'admin') {
          set({ session, user: session.user, profile, loading: false })
        } else {
          await supabase.auth.signOut()
          set({ session: null, user: null, profile: null, loading: false })
        }
      } catch (err) {
        await supabase.auth.signOut()
        set({ session: null, user: null, profile: null, loading: false })
      }
    } else {
      set({ session: null, user: null, profile: null, loading: false })
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        try {
          const profile = await get().fetchProfile(session.user.id)
          if (profile?.role === 'admin') {
            set({ session, user: session.user, profile })
          } else {
            await supabase.auth.signOut()
            set({ session: null, user: null, profile: null })
          }
        } catch (err) {
          await supabase.auth.signOut()
          set({ session: null, user: null, profile: null })
        }
      } else {
        set({ session: null, user: null, profile: null })
      }
    })
  },

  fetchProfile: async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    return data
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    
    // Immediate role check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle()
    
    if (profile?.role !== 'admin') {
      await supabase.auth.signOut()
      throw new Error('Unauthorized: Admin access only')
    }
    
    return data
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ session: null, user: null, profile: null })
  },
}))
