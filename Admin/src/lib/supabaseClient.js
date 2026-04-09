import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Optional: Service role client for specific admin operations (use with caution)
// export const supabaseAdmin = createClient(supabaseUrl, import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY)
