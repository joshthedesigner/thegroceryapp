import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Authentication helpers
export const signInWithGoogle = async () => {
  try {
    console.log('Starting Google OAuth sign in...')
    console.log('Current origin:', window.location.origin)
    console.log('Current URL:', window.location.href)
    console.log('Environment:', import.meta.env.MODE)
    
    // Always use current origin for redirect - this works with any Site URL
    const redirectUrl = `${window.location.origin}/auth/callback`
    console.log('Redirect URL:', redirectUrl)
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })
    
    if (error) {
      console.error('OAuth error:', error)
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        name: error.name
      })
      return { data: null, error }
    }
    
    console.log('OAuth initiated successfully:', data)
    console.log('OAuth URL:', data?.url)
    return { data, error }
  } catch (error) {
    console.error('Authentication error:', error)
    return { data: null, error: { message: 'OAuth authentication failed. Please check your Supabase OAuth settings.' } }
  }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  } catch (error) {
    console.warn('Get current user error (likely due to missing Supabase credentials):', error)
    return { user: null, error: { message: 'Please configure Supabase credentials' } }
  }
}

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// Database helpers - Ingredients CRUD
export const getIngredients = async (userId) => {
  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const getIngredient = async (id) => {
  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .eq('id', id)
    .single()
  
  return { data, error }
}

export const createIngredient = async (ingredientData) => {
  const { data, error } = await supabase
    .from('ingredients')
    .insert([ingredientData])
    .select()
  
  return { data, error }
}

export const updateIngredient = async (id, ingredientData) => {
  const { data, error } = await supabase
    .from('ingredients')
    .update(ingredientData)
    .eq('id', id)
    .select()
  
  return { data, error }
}

export const deleteIngredient = async (id) => {
  const { error } = await supabase
    .from('ingredients')
    .delete()
    .eq('id', id)
  
  return { error }
}

// Database helpers - Meals CRUD
export const getMeals = async (userId) => {
  const { data, error } = await supabase
    .from('meals')
    .select(`
      *,
      meal_ingredients (
        quantity_used,
        ingredients (
          name,
          unit,
          price,
          amount_purchased
        )
      )
    `)
    .eq('user_id', userId)
    .order('date_cooked', { ascending: false })
  
  return { data, error }
}

export const getMeal = async (id) => {
  const { data, error } = await supabase
    .from('meals')
    .select(`
      *,
      meal_ingredients (
        quantity_used,
        ingredients (
          name,
          unit,
          price,
          amount_purchased
        )
      )
    `)
    .eq('id', id)
    .single()
  
  return { data, error }
}

export const createMeal = async (mealData) => {
  const { data, error } = await supabase
    .from('meals')
    .insert([mealData])
    .select()
  
  return { data, error }
}

export const updateMeal = async (id, mealData) => {
  const { data, error } = await supabase
    .from('meals')
    .update(mealData)
    .eq('id', id)
    .select()
  
  return { data, error }
}

export const deleteMeal = async (id) => {
  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', id)
  
  return { error }
}

// Database helpers - Meal Ingredients CRUD
export const createMealIngredient = async (mealIngredientData) => {
  const { data, error } = await supabase
    .from('meal_ingredients')
    .insert([mealIngredientData])
    .select()
  
  return { data, error }
}

export const updateMealIngredient = async (id, mealIngredientData) => {
  const { data, error } = await supabase
    .from('meal_ingredients')
    .update(mealIngredientData)
    .eq('id', id)
    .select()
  
  return { data, error }
}

export const deleteMealIngredient = async (id) => {
  const { error } = await supabase
    .from('meal_ingredients')
    .delete()
    .eq('id', id)
  
  return { error }
} 