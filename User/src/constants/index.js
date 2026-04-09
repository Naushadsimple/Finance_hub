export const MONTHLY_RATE = parseFloat(import.meta.env.VITE_MONTHLY_RATE) || 0.01
export const BUCKET_NAME = import.meta.env.VITE_STORAGE_BUCKET || 'certificates'
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Finance Hub'
export const SESSION_TIMEOUT_USER = 3600 // 60 minutes in seconds
export const SESSION_TIMEOUT_ADMIN = 1800 // 30 minutes in seconds
