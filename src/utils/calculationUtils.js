// Shared calculation utilities for dashboard components
// Ensures consistent calculations across metrics and graphs
import dayjs from 'dayjs'

/**
 * Get filtered data for a specific time period
 * @param {Array} ingredients - Array of ingredient objects
 * @param {Array} meals - Array of meal objects
 * @param {string} timeFilter - Time filter ('week', 'month', 'year')
 * @param {number} periodOffset - Period offset (0 = current, 1 = previous, etc.)
 * @param {Function} getDateRange - Function to get date range for filtering
 * @returns {Object} Object containing filteredIngredients and filteredMeals
 */
export const getFilteredDataForPeriod = (ingredients, meals, timeFilter, periodOffset, getDateRange) => {
  const { start: startDate, end: endDate } = getDateRange(timeFilter, periodOffset)
  
  const filteredIngredients = ingredients.filter(ing => {
    if (!ing.purchase_date) return false
    const purchaseDate = new Date(ing.purchase_date)
    return purchaseDate >= startDate && purchaseDate <= endDate
  })
  
  const filteredMeals = meals.filter(meal => {
    if (!meal.date_cooked) return false
    const mealDate = new Date(meal.date_cooked)
    return mealDate >= startDate && mealDate <= endDate
  })
  
  return { filteredIngredients, filteredMeals }
}

/**
 * Calculate total value of ingredients (price is already total cost)
 * @param {Array} ingredients - Array of ingredient objects
 * @returns {number} Total value
 */
export const calculateTotalValue = (ingredients) => {
  return ingredients.reduce((sum, ing) => sum + ing.price, 0)
}

/**
 * Calculate used value from meal costs (authoritative source)
 * @param {Array} meals - Array of meal objects
 * @returns {number} Total used value
 */
export const calculateUsedValue = (meals) => {
  return meals.reduce((sum, meal) => sum + calculateMealCost(meal), 0)
}

/**
 * Calculate unused value using per-ingredient calculation (respects time filters)
 * @param {Array} ingredients - Array of ingredient objects
 * @param {Array} meals - Array of meal objects (not used in this calculation)
 * @returns {number} Unused value
 */
export const calculateUnusedValue = (ingredients, meals) => {
  return ingredients.reduce((sum, ing) => {
    // Calculate unused portion for this ingredient
    const amountUsed = ing.amount_used || 0
    const amountPurchased = ing.amount_purchased || 0
    
    if (amountPurchased === 0) return sum
    
    // Calculate unused ratio and multiply by price
    const unusedRatio = (amountPurchased - amountUsed) / amountPurchased
    const unusedValue = ing.price * unusedRatio
    
    return sum + unusedValue
  }, 0)
}

/**
 * Calculate total amount purchased
 * @param {Array} ingredients - Array of ingredient objects
 * @returns {number} Total amount purchased
 */
export const calculateTotalPurchased = (ingredients) => {
  return ingredients.reduce((sum, ing) => sum + ing.amount_purchased, 0)
}

/**
 * Calculate total amount used
 * @param {Array} ingredients - Array of ingredient objects
 * @returns {number} Total amount used
 */
export const calculateTotalUsed = (ingredients) => {
  return ingredients.reduce((sum, ing) => sum + (ing.amount_used || 0), 0)
}

/**
 * Calculate usage percentage
 * @param {Array} ingredients - Array of ingredient objects
 * @returns {number} Usage percentage (0-100)
 */
export const calculateUsagePercentage = (ingredients) => {
  const totalPurchased = calculateTotalPurchased(ingredients)
  const totalUsed = calculateTotalUsed(ingredients)
  return totalPurchased > 0 ? (totalUsed / totalPurchased) * 100 : 0
}

/**
 * Calculate total meal cost
 * @param {Array} meals - Array of meal objects
 * @returns {number} Total meal cost
 */
export const calculateTotalMealCost = (meals) => {
  return meals.reduce((sum, meal) => sum + (meal.total_cost || 0), 0)
}

/**
 * Calculate average meal cost
 * @param {Array} meals - Array of meal objects
 * @returns {number} Average meal cost
 */
export const calculateAverageMealCost = (meals) => {
  return meals.length > 0 ? calculateTotalMealCost(meals) / meals.length : 0
}

/**
 * Get filtered data for a specific date (using same logic as metrics)
 * @param {Array} ingredients - Array of ingredient objects
 * @param {Array} meals - Array of meal objects
 * @param {Date} targetDate - Target date to filter for
 * @returns {Object} Object containing filteredIngredients and filteredMeals for that date
 */
export const getFilteredDataForDate = (ingredients, meals, targetDate) => {
  // Use the SAME filtering logic as metrics, but for a single date
  const startDate = dayjs(targetDate).startOf('day')
  const endDate = dayjs(targetDate).endOf('day')
  
  const filteredIngredients = ingredients.filter(ing => {
    if (!ing.purchase_date) return false
    const purchaseDate = new Date(ing.purchase_date)
    return purchaseDate >= startDate.toDate() && purchaseDate <= endDate.toDate()
  })
  
  const filteredMeals = meals.filter(meal => {
    if (!meal.date_cooked) return false
    const mealDate = new Date(meal.date_cooked)
    return mealDate >= startDate.toDate() && mealDate <= endDate.toDate()
  })
  
  return { filteredIngredients, filteredMeals }
}

/**
 * Get cumulative data up to a specific date (using same logic as metrics)
 * @param {Array} ingredients - Array of ingredient objects
 * @param {Array} meals - Array of meal objects
 * @param {Date} targetDate - Target date to calculate cumulative totals up to
 * @returns {Object} Object containing cumulative totals
 */
export const getCumulativeDataUpToDate = (ingredients, meals, targetDate) => {
  // Use the SAME filtering logic as metrics, but up to the target date
  const endDate = dayjs(targetDate).endOf('day')
  
  const filteredIngredients = ingredients.filter(ing => {
    if (!ing.purchase_date) return false
    const purchaseDate = new Date(ing.purchase_date)
    return purchaseDate <= endDate.toDate()
  })
  
  const filteredMeals = meals.filter(meal => {
    if (!meal.date_cooked) return false
    const mealDate = new Date(meal.date_cooked)
    return mealDate <= endDate.toDate()
  })
  
  // Use the SAME calculation functions as metrics for consistency
  const totalValue = calculateTotalValue(filteredIngredients)
  const usedValue = calculateUsedValue(filteredMeals)
  const unusedValue = calculateUnusedValue(filteredIngredients, filteredMeals)
  
  return {
    totalValue,
    usedValue,
    unusedValue,
    ingredientCount: filteredIngredients.length,
    mealCount: filteredMeals.length
  }
}

/**
 * Get cumulative data within a time period (respects time filter like metrics)
 * @param {Array} ingredients - Array of ingredient objects
 * @param {Array} meals - Array of meal objects
 * @param {string} timeFilter - Time filter ('week', 'month', 'year')
 * @param {number} periodOffset - Period offset (0 = current, 1 = previous, etc.)
 * @param {Function} getDateRange - Function to get date range for filtering
 * @param {Date} targetDate - Target date to calculate cumulative totals up to
 * @returns {Object} Object containing cumulative totals within the time period
 */
export const getCumulativeDataWithinPeriod = (ingredients, meals, timeFilter, periodOffset, getDateRange, targetDate) => {
  // Get the date range for the time filter
  const { start: periodStart, end: periodEnd } = getDateRange(timeFilter, periodOffset)
  
  // Filter ingredients within the time period AND up to the target date
  const filteredIngredients = ingredients.filter(ing => {
    if (!ing.purchase_date) return false
    const purchaseDate = new Date(ing.purchase_date)
    const targetEndDate = dayjs(targetDate).endOf('day').toDate()
    
    // Must be within the time period AND up to the target date
    return purchaseDate >= periodStart && purchaseDate <= periodEnd && purchaseDate <= targetEndDate
  })
  
  // Filter meals within the time period AND up to the target date
  const filteredMeals = meals.filter(meal => {
    if (!meal.date_cooked) return false
    const mealDate = new Date(meal.date_cooked)
    const targetEndDate = dayjs(targetDate).endOf('day').toDate()
    
    // Must be within the time period AND up to the target date
    return mealDate >= periodStart && mealDate <= periodEnd && mealDate <= targetEndDate
  })
  
  // Use the SAME calculation functions as metrics for consistency
  const totalValue = calculateTotalValue(filteredIngredients)
  const usedValue = calculateUsedValue(filteredMeals)
  const unusedValue = calculateUnusedValue(filteredIngredients, filteredMeals)
  
  return {
    totalValue,
    usedValue,
    unusedValue,
    ingredientCount: filteredIngredients.length,
    mealCount: filteredMeals.length
  }
}

/**
 * Calculate total cost of ingredients in a meal
 * @param {Object} meal - Meal object with meal_ingredients array
 * @returns {number} Total cost of the meal
 */
export const calculateMealCost = (meal) => {
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