// Shared calculation utilities for dashboard components
// Ensures consistent calculations across metrics and graphs
import dayjs from 'dayjs'
import { 
  isInPeriod, 
  isBeforeOrEqual, 
  startOfDay, 
  endOfDay, 
  formatDate as formatDateFromUtils, 
  formatDateRange as formatDateRangeFromUtils, 
  getDateRange as getDateRangeFromUtils,
  getWeekRange as getWeekRangeFromUtils
} from './dateUtils'

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
    if (!ing.purchase_date) {
      return false
    }
    
    const inPeriod = isInPeriod(ing.purchase_date, startDate, endDate)
    return inPeriod
  })
  
  const filteredMeals = meals.filter(meal => {
    if (!meal.date_cooked) {
      return false
    }
    
    const inPeriod = isInPeriod(meal.date_cooked, startDate, endDate)
    return inPeriod
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
 * Calculate remaining value for a single ingredient
 * @param {Object} ingredient - Ingredient object with amount_purchased, amount_used, and price
 * @returns {number} Remaining value in dollars
 */
export const calculateIngredientRemainingValue = (ingredient) => {
  const amountUsed = ingredient.amount_used || 0
  const amountPurchased = ingredient.amount_purchased || 0
  if (amountPurchased === 0) return 0
  const unusedRatio = (amountPurchased - amountUsed) / amountPurchased
  return ingredient.price * unusedRatio
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
  // Use UTC boundaries to avoid timezone issues
  const startDate = startOfDay(targetDate)
  const endDate = endOfDay(targetDate)
  
  const filteredIngredients = ingredients.filter(ing => {
    if (!ing.purchase_date) return false
    return isInPeriod(ing.purchase_date, startDate, endDate)
  })
  
  const filteredMeals = meals.filter(meal => {
    if (!meal.date_cooked) return false
    return isInPeriod(meal.date_cooked, startDate, endDate)
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
  // Use UTC boundaries to avoid timezone issues
  const endDate = endOfDay(targetDate)
  
  const filteredIngredients = ingredients.filter(ing => {
    if (!ing.purchase_date) return false
    return isBeforeOrEqual(ing.purchase_date, endDate)
  })
  
  const filteredMeals = meals.filter(meal => {
    if (!meal.date_cooked) return false
    return isBeforeOrEqual(meal.date_cooked, endDate)
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
    const targetEndDate = endOfDay(targetDate)
    
    // Must be within the time period AND up to the target date
    return isInPeriod(ing.purchase_date, periodStart, periodEnd) && 
           isBeforeOrEqual(ing.purchase_date, targetEndDate)
  })
  
  // Filter meals within the time period AND up to the target date
  const filteredMeals = meals.filter(meal => {
    if (!meal.date_cooked) return false
    const targetEndDate = endOfDay(targetDate)
    
    // Must be within the time period AND up to the target date
    return isInPeriod(meal.date_cooked, periodStart, periodEnd) && 
           isBeforeOrEqual(meal.date_cooked, targetEndDate)
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

/**
 * Calculate usage percentage for a single ingredient
 * @param {Object} ingredient - Ingredient object with amount_purchased and amount_used
 * @returns {number} Usage percentage (0-100)
 */
export const getIngredientUsagePercentage = (ingredient) => {
  if (!ingredient.amount_purchased || ingredient.amount_purchased === 0) return 0
  const usedAmount = ingredient.amount_used || 0
  return Math.round((usedAmount / ingredient.amount_purchased) * 100)
}

/**
 * Get usage status for an ingredient
 * @param {Object} ingredient - Ingredient object with amount_purchased and amount_used
 * @returns {string} Status code: 'notused', 'finished', 'success', 'warning', or 'exception'
 */
export const getIngredientUsageStatus = (ingredient) => {
  if (!ingredient.amount_used || ingredient.amount_used === 0) return 'notused'
  const percentage = getIngredientUsagePercentage(ingredient)
  if (percentage === 100) return 'finished'
  if (percentage >= 80) return 'success' // Green - mostly used
  if (percentage >= 30) return 'warning' // Orange - partially used
  return 'exception' // Red - barely used
}

/**
 * Get color for a usage status
 * @param {string} status - Status code from getIngredientUsageStatus
 * @returns {string} Color code for the status
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'notused': return 'default'
    case 'finished': return 'blue'
    case 'success': return 'green'
    case 'warning': return 'orange'
    case 'exception': return 'red'
    default: return 'default'
  }
}

/**
 * Get display text for a usage status
 * @param {string} status - Status code from getIngredientUsageStatus
 * @returns {string} Human-readable status text
 */
export const getStatusText = (status) => {
  switch (status) {
    case 'notused': return 'Not Used'
    case 'finished': return 'Finished'
    case 'success': return 'Mostly Used'
    case 'warning': return 'Partially Used'
    case 'exception': return 'Barely Used'
    default: return 'Unknown'
  }
}

/**
 * Get date range for a specific time period
 * @param {string} timeFilter - Time filter ('week', 'month', 'year')
 * @param {number} offset - Period offset (0 = current, 1 = previous, etc.)
 * @returns {Object} Object containing start and end dates as dayjs objects
 */
export const getDateRange = (timeFilter, offset = 0) => {
  return getDateRangeFromUtils(timeFilter, offset)
}

/**
 * Get week range for a specific date
 * @param {Date|string} date - Date to get week range for
 * @returns {Object} Object containing start and end dates as dayjs objects
 */
export const getWeekRange = (date) => {
  return getWeekRangeFromUtils(date)
}

/**
 * Format a date range as a string
 * @param {Object} start - Start date (dayjs object)
 * @param {Object} end - End date (dayjs object)
 * @returns {string} Formatted date range string
 */
export const formatDateRange = (start, end) => {
  return formatDateRangeFromUtils(start, end)
}

/**
 * Format a date consistently across the app
 * @param {Date|string|dayjs.Dayjs} date - Date to format
 * @returns {string} Formatted date string in 'MMM DD, YYYY' format
 */
export const formatDate = (date) => {
  return formatDateFromUtils(date)
}

/**
 * Filter data array by search text
 * @param {Array} data - Array of objects to filter
 * @param {string} searchText - Text to search for
 * @param {string} field - Field name to search in
 * @returns {Array} Filtered data
 */
export const filterDataBySearch = (data, searchText, field = 'name') => {
  if (!searchText || !data) return data || []
  return data.filter(item => 
    item[field]?.toLowerCase().includes(searchText.toLowerCase())
  )
} 