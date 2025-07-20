// Environment configuration
export const config = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'your-supabase-project-url',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key',
}

// Validate required environment variables
export const validateEnv = () => {
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']
  const missing = required.filter(key => !import.meta.env[key])
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing)
    console.warn('Using placeholder values for testing - please create a .env.local file with actual Supabase credentials')
  }
} 