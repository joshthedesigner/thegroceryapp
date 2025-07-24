// Shared calculation utilities for dashboard components
// Ensures consistent calculations across metrics and graphs

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
 * Calculate total value of ingredients
 * @param {Array} ingredients - Array of ingredient objects
 * @returns {number} Total value
 */
export const calculateTotalValue = (ingredients) => {
  return ingredients.reduce((sum, ing) => sum + ing.price, 0)
}

/**
 * Calculate unused value of ingredients
 * @param {Array} ingredients - Array of ingredient objects
 * @returns {number} Unused value
 */
export const calculateUnusedValue = (ingredients) => {
  return ingredients.reduce((sum, ing) => {
    const usageRatio = (ing.amount_purchased - (ing.amount_used || 0)) / ing.amount_purchased
    return sum + (ing.price * usageRatio)
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