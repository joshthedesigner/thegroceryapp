// Debug script for meal creation process
// This will add detailed logging to the meal creation process

console.log('🔍 Debug: Meal Creation Process...')

// Override the meal creation functions to add detailed logging
function addMealCreationLogging() {
  // Find the useMeals hook
  const useMealsScript = `
    // Add this to src/hooks/useMeals.js in the createMeal function
    console.log('🔍 createMeal called with:', { mealData, ingredientSelections })
    
    // Log the meal insert attempt
    console.log('🔍 Attempting meal insert:', mealData)
    const { data: meal, error: mealError } = await supabase
      .from('meals')
      .insert(mealData)
      .select()
    
    if (mealError) {
      console.log('❌ Meal insert failed:', mealError)
      console.log('Error details:', {
        code: mealError.code,
        message: mealError.message,
        details: mealError.details,
        hint: mealError.hint
      })
      throw mealError
    }
    
    console.log('✅ Meal created successfully:', meal[0])
    
    // Log meal ingredients insert
    console.log('🔍 Attempting meal ingredients insert:', mealIngredientsData)
    const { data: mealIngredients, error: mealIngredientsError } = await supabase
      .from('meal_ingredients')
      .insert(mealIngredientsData)
      .select()
    
    if (mealIngredientsError) {
      console.log('❌ Meal ingredients insert failed:', mealIngredientsError)
      console.log('Error details:', {
        code: mealIngredientsError.code,
        message: mealIngredientsError.message,
        details: mealIngredientsError.details,
        hint: mealIngredientsError.hint
      })
      throw mealIngredientsError
    }
    
    console.log('✅ Meal ingredients created successfully:', mealIngredients)
  `
  
  console.log('📝 Add this logging to src/hooks/useMeals.js:')
  console.log(useMealsScript)
}

// Check current meal creation process
function checkCurrentMealCreation() {
  console.log('🔍 Checking current meal creation process...')
  
  // Check if useMeals hook exists
  if (window.useMeals) {
    console.log('✅ useMeals hook found')
  } else {
    console.log('❌ useMeals hook not found in global scope')
  }
  
  // Check if supabase client is available
  if (window.supabase) {
    console.log('✅ Supabase client available')
  } else {
    console.log('❌ Supabase client not found')
  }
}

// Monitor network requests for meal creation
function monitorMealRequests() {
  console.log('🔍 Monitoring network requests for meal creation...')
  
  // Override fetch to monitor requests
  const originalFetch = window.fetch
  window.fetch = function(...args) {
    const url = args[0]
    if (typeof url === 'string' && url.includes('meals')) {
      console.log('🔍 Meal-related request:', {
        url: url,
        method: args[1]?.method || 'GET',
        body: args[1]?.body
      })
    }
    return originalFetch.apply(this, args)
  }
  
  console.log('✅ Network monitoring enabled for meal requests')
}

// Instructions for manual testing
console.log('\n📋 Manual Testing Instructions:')
console.log('1. Open the browser console')
console.log('2. Run: addMealCreationLogging()')
console.log('3. Run: checkCurrentMealCreation()')
console.log('4. Run: monitorMealRequests()')
console.log('5. Try to create a meal in the app')
console.log('6. Check the console for detailed logs')

// Export functions
window.addMealCreationLogging = addMealCreationLogging
window.checkCurrentMealCreation = checkCurrentMealCreation
window.monitorMealRequests = monitorMealRequests

console.log('✅ Debug script loaded. Run the functions above to start debugging.') 