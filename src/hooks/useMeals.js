import { useState, useEffect } from 'react'
import { 
  getMeals, 
  getMeal,
  createMeal, 
  updateMeal, 
  deleteMeal,
  createMealIngredient,
  updateMealIngredient,
  deleteMealIngredient
} from '../services/supabase'

export const useMeals = (userId) => {
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch meals
  const fetchMeals = async () => {
    if (!userId) return
    
    try {
      setLoading(true)
      setError(null)
      console.log('🔍 Fetching meals for user:', userId)
      const { data, error } = await getMeals(userId)
      
      console.log('🔍 getMeals response:', { data, error })
      
      if (error) {
        console.error('❌ getMeals error:', error)
        setError(error.message)
      } else {
        console.log('✅ getMeals success, meals count:', data?.length)
        if (data && data.length > 0) {
          console.log('📊 First meal data:', data[0])
          console.log('📊 First meal ingredients:', data[0].meal_ingredients)
        }
        setMeals(data || [])
      }
    } catch (err) {
      console.error('❌ getMeals exception:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Add meal
  const addMeal = async (mealData) => {
    if (!userId) return { error: 'User not authenticated' }
    
    try {
      setError(null)
      const { data, error } = await createMeal({
        ...mealData,
        user_id: userId
      })
      
      if (error) {
        setError(error.message)
        return { error: error.message }
      } else {
        setMeals(prev => [data[0], ...prev])
        return { data: data[0] }
      }
    } catch (err) {
      setError(err.message)
      return { error: err.message }
    }
  }

  // Update meal
  const updateMealById = async (id, mealData) => {
    try {
      setError(null)
      const { data, error } = await updateMeal(id, mealData)
      
      if (error) {
        setError(error.message)
        return { error: error.message }
      } else {
        setMeals(prev => 
          prev.map(meal => 
            meal.id === id ? data[0] : meal
          )
        )
        return { data: data[0] }
      }
    } catch (err) {
      setError(err.message)
      return { error: err.message }
    }
  }

  // Delete meal
  const deleteMealById = async (id) => {
    try {
      setError(null)
      const { error } = await deleteMeal(id)
      
      if (error) {
        setError(error.message)
        return { error: error.message }
      } else {
        setMeals(prev => prev.filter(meal => meal.id !== id))
        return { success: true }
      }
    } catch (err) {
      setError(err.message)
      return { error: err.message }
    }
  }

  // Add ingredient to meal
  const addIngredientToMeal = async (mealId, ingredientId, quantityUsed) => {
    try {
      setError(null)
      const { data, error } = await createMealIngredient({
        meal_id: mealId,
        ingredient_id: ingredientId,
        quantity_used: quantityUsed
      })
      
      if (error) {
        setError(error.message)
        return { error: error.message }
      } else {
        // Refresh meals to get updated data
        await fetchMeals()
        return { data: data[0] }
      }
    } catch (err) {
      setError(err.message)
      return { error: err.message }
    }
  }

  // Update meal ingredient
  const updateMealIngredientById = async (id, quantityUsed) => {
    try {
      setError(null)
      const { data, error } = await updateMealIngredient(id, {
        quantity_used: quantityUsed
      })
      
      if (error) {
        setError(error.message)
        return { error: error.message }
      } else {
        // Refresh meals to get updated data
        await fetchMeals()
        return { data: data[0] }
      }
    } catch (err) {
      setError(err.message)
      return { error: err.message }
    }
  }

  // Delete meal ingredient
  const deleteMealIngredientById = async (id) => {
    try {
      setError(null)
      const { error } = await deleteMealIngredient(id)
      
      if (error) {
        setError(error.message)
        return { error: error.message }
      } else {
        // Refresh meals to get updated data
        await fetchMeals()
        return { success: true }
      }
    } catch (err) {
      setError(err.message)
      return { error: err.message }
    }
  }

  // Get meal by ID
  const getMealById = async (id) => {
    try {
      const { data, error } = await getMeal(id)
      if (error) {
        setError(error.message)
        return { error: error.message }
      }
      return { data }
    } catch (err) {
      setError(err.message)
      return { error: err.message }
    }
  }

  // Calculate total cost of ingredients in a meal
  const calculateMealCost = (meal) => {
    if (!meal.meal_ingredients || meal.meal_ingredients.length === 0) {
      return 0
    }

    return meal.meal_ingredients.reduce((total, mealIngredient) => {
      const ingredient = mealIngredient.ingredients
      if (!ingredient) return total
      
      // Calculate proportional cost based on quantity used
      const proportion = mealIngredient.quantity_used / ingredient.amount_purchased
      return total + (ingredient.price * proportion)
    }, 0)
  }

  // Get ingredients used in a meal
  const getMealIngredients = (meal) => {
    if (!meal.meal_ingredients) return []
    
    return meal.meal_ingredients.map(mealIngredient => ({
      id: mealIngredient.id,
      ingredient: mealIngredient.ingredients,
      quantityUsed: mealIngredient.quantity_used
    }))
  }

  // Search meals by name
  const searchMeals = (searchTerm) => {
    if (!searchTerm) return meals
    return meals.filter(meal => 
      meal.meal_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Filter meals by date range
  const filterMealsByDateRange = (startDate, endDate) => {
    return meals.filter(meal => {
      const mealDate = new Date(meal.date_cooked)
      return mealDate >= startDate && mealDate <= endDate
    })
  }

  useEffect(() => {
    fetchMeals()
  }, [userId])

  return {
    meals,
    loading,
    error,
    addMeal,
    updateMeal: updateMealById,
    deleteMeal: deleteMealById,
    addIngredientToMeal,
    updateMealIngredient: updateMealIngredientById,
    deleteMealIngredient: deleteMealIngredientById,
    getMealById,
    refreshMeals: fetchMeals,
    calculateMealCost,
    getMealIngredients,
    searchMeals,
    filterMealsByDateRange
  }
} 