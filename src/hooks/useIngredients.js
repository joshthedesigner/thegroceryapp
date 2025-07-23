import { useState, useEffect } from 'react'
import { 
  getIngredients, 
  createIngredient, 
  updateIngredient, 
  deleteIngredient 
} from '../services/supabase'

export const useIngredients = (userId) => {
  const [ingredients, setIngredients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch ingredients
  const fetchIngredients = async () => {
    if (!userId) return
    
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await getIngredients(userId)
      
      if (error) {
        setError(error.message)
      } else {
        setIngredients(data || [])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Add ingredient
  const addIngredient = async (ingredientData) => {
    if (!userId) return { error: 'User not authenticated' }
    
    try {
      setError(null)
      const { data, error } = await createIngredient({
        ...ingredientData,
        user_id: userId
      })
      
      if (error) {
        setError(error.message)
        return { error: error.message }
      } else {
        setIngredients(prev => [data[0], ...prev])
        return { data: data[0] }
      }
    } catch (err) {
      setError(err.message)
      return { error: err.message }
    }
  }

  // Update ingredient
  const updateIngredientById = async (id, ingredientData) => {
    try {
      setError(null)
      const { data, error } = await updateIngredient(id, ingredientData)
      
      if (error) {
        setError(error.message)
        return { error: error.message }
      } else {
        setIngredients(prev => 
          prev.map(ingredient => 
            ingredient.id === id ? data[0] : ingredient
          )
        )
        return { data: data[0] }
      }
    } catch (err) {
      setError(err.message)
      return { error: err.message }
    }
  }

  // Delete ingredient
  const deleteIngredientById = async (id) => {
    try {
      setError(null)
      const { error } = await deleteIngredient(id)
      
      if (error) {
        setError(error.message)
        return { error: error.message }
      } else {
        setIngredients(prev => prev.filter(ingredient => ingredient.id !== id))
        return { success: true }
      }
    } catch (err) {
      setError(err.message)
      return { error: err.message }
    }
  }

  // Calculate usage percentage
  const getUsagePercentage = (ingredient) => {
    if (!ingredient.amount_purchased || ingredient.amount_purchased === 0) return 0
    // Use amount_used if available, otherwise calculate from meal data
    const usedAmount = ingredient.amount_used || 0
    return Math.round((usedAmount / ingredient.amount_purchased) * 100)
  }

  // Get usage status
  const getUsageStatus = (ingredient) => {
    const percentage = getUsagePercentage(ingredient)
    if (percentage >= 80) return 'success' // Green - mostly used
    if (percentage >= 30) return 'warning' // Yellow - partially used
    return 'exception' // Red - barely used
  }

  // Filter ingredients by status
  const getIngredientsByStatus = (status) => {
    return ingredients.filter(ingredient => getUsageStatus(ingredient) === status)
  }

  // Search ingredients by name
  const searchIngredients = (searchTerm) => {
    if (!searchTerm) return ingredients
    return ingredients.filter(ingredient => 
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  useEffect(() => {
    fetchIngredients()
  }, [userId])

  return {
    ingredients,
    loading,
    error,
    addIngredient,
    updateIngredient: updateIngredientById,
    deleteIngredient: deleteIngredientById,
    refreshIngredients: fetchIngredients,
    getUsagePercentage,
    getUsageStatus,
    getIngredientsByStatus,
    searchIngredients
  }
} 