import { createClient } from '@supabase/supabase-js'
import { calculateMealCost } from '../utils/calculationUtils'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Authentication helpers (unchanged)
export const signInWithGoogle = async () => {
  try {
    console.log('Starting Google OAuth sign in...')
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
      return { data: null, error }
    }
    
    console.log('OAuth initiated successfully:', data)
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

// Database helpers - Ingredients CRUD (updated for clean structure)
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

// Database helpers - Meals CRUD (updated for clean structure)
export const getMeals = async (userId) => {
  const { data, error } = await supabase
    .from('meals')
    .select(`
      *,
      meal_ingredients (
        id,
        quantity_used,
        ingredients (
          id,
          name,
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
        id,
        quantity_used,
        ingredients (
          id,
          name,
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
  console.log('🔍 createMeal called with:', mealData)
  
  // Remove total_cost from mealData if it exists (let database calculate it)
  const { total_cost, ...mealDataWithoutCost } = mealData
  
  // Insert the meal and return the created data
  const { data, error } = await supabase
    .from('meals')
    .insert([mealDataWithoutCost])
    .select()
  
  if (error) {
    console.log('❌ Meal insert failed:', error)
    return { data: null, error }
  }
  
  console.log('✅ Meal insert successful, data:', data)
  return { data, error: null }
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

// Calculation functions (new)
export const calculateIngredientUsage = (ingredient, mealIngredients) => {
  const totalUsed = mealIngredients
    .filter(mi => mi.ingredient_id === ingredient.id)
    .reduce((sum, mi) => sum + mi.quantity_used, 0)
  
  const remaining = ingredient.amount_purchased - totalUsed
  const usagePercentage = ingredient.amount_purchased > 0 
    ? (totalUsed / ingredient.amount_purchased) * 100 
    : 0
  
  return {
    totalUsed,
    remaining,
    usagePercentage
  }
}

export const calculateDashboardMetrics = async (userId) => {
  // Get all ingredients for total purchased
  const { data: ingredients, error: ingredientsError } = await getIngredients(userId)
  if (ingredientsError) return { error: ingredientsError }
  
  // Get all meals with ingredients for total consumed
  const { data: meals, error: mealsError } = await getMeals(userId)
  if (mealsError) return { error: mealsError }
  
  // Calculate metrics
  const totalPurchased = ingredients.reduce((sum, i) => sum + (i.price * i.amount_purchased), 0)
  const totalConsumed = meals.reduce((sum, meal) => sum + calculateMealCost(meal), 0)
  const unusedValue = totalPurchased - totalConsumed
  const averageMealCost = meals.length > 0 ? totalConsumed / meals.length : 0
  
  return {
    data: {
      totalPurchased,
      totalConsumed,
      unusedValue,
      averageMealCost
    },
    error: null
  }
}

export const calculateTimeBasedData = async (userId, startDate, endDate) => {
  const { data: meals, error } = await supabase
    .from('meals')
    .select(`
      date_cooked,
      meal_ingredients (
        quantity_used,
        ingredients (
          price,
          amount_purchased
        )
      )
    `)
    .eq('user_id', userId)
    .gte('date_cooked', startDate)
    .lte('date_cooked', endDate)
    .order('date_cooked', { ascending: true })
  
  if (error) return { error }
  
  // Group by date and calculate daily consumption
  const dailyData = meals.reduce((acc, meal) => {
    const date = meal.date_cooked
    const dailyCost = meal.meal_ingredients.reduce((sum, mi) => {
      if (mi.ingredients && mi.quantity_used && mi.ingredients.amount_purchased && mi.ingredients.price) {
        const proportion = mi.quantity_used / mi.ingredients.amount_purchased
        return sum + (mi.ingredients.price * proportion)
      }
      return sum
    }, 0)
    
    if (acc[date]) {
      acc[date] += dailyCost
    } else {
      acc[date] = dailyCost
    }
    
    return acc
  }, {})
  
  return { data: dailyData, error: null }
}

// User Preferences helpers (for welcome screen)
export const getUserPreferences = async (userId) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  return { data, error }
}

export const createUserPreferences = async (userPreferencesData) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .insert([userPreferencesData])
    .select()
  
  return { data, error }
}

export const updateUserPreferences = async (userId, userPreferencesData) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .update(userPreferencesData)
    .eq('user_id', userId)
    .select()
  
  return { data, error }
}

export const markWelcomeCompleted = async (userId) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert([{
      user_id: userId,
      welcome_completed: true,
      time_filter: 'week',
      period_offset: 0
    }])
    .select()
  
  return { data, error }
} 