// Diagnostic script for meal insertion issues
// Run this in the browser console to test meal creation

console.log('🔍 Diagnostic: Meal Insertion Testing...')

// Test 1: Check current user and authentication
console.log('\n📋 Test 1: Authentication Check')
console.log('Current user:', window.supabase?.auth?.user())
console.log('Session:', window.supabase?.auth?.session())

// Test 2: Check meals table schema
console.log('\n📋 Test 2: Meals Table Schema Check')
async function checkMealsSchema() {
  try {
    const { data, error } = await window.supabase
      .from('meals')
      .select('*')
      .limit(1)
    
    console.log('Meals table accessible:', !error)
    if (error) {
      console.log('Meals table error:', error)
    } else {
      console.log('Meals table structure:', Object.keys(data[0] || {}))
    }
  } catch (err) {
    console.log('Meals schema check failed:', err)
  }
}

// Test 3: Check meal_ingredients table schema
console.log('\n📋 Test 3: Meal Ingredients Table Schema Check')
async function checkMealIngredientsSchema() {
  try {
    const { data, error } = await window.supabase
      .from('meal_ingredients')
      .select('*')
      .limit(1)
    
    console.log('Meal ingredients table accessible:', !error)
    if (error) {
      console.log('Meal ingredients table error:', error)
    } else {
      console.log('Meal ingredients table structure:', Object.keys(data[0] || {}))
    }
  } catch (err) {
    console.log('Meal ingredients schema check failed:', err)
  }
}

// Test 4: Check RLS policies
console.log('\n📋 Test 4: RLS Policies Check')
async function checkRLSPolicies() {
  try {
    // Test meals table RLS
    const { data: mealsData, error: mealsError } = await window.supabase
      .from('meals')
      .select('count')
      .limit(1)
    
    console.log('Meals RLS working:', !mealsError)
    if (mealsError) console.log('Meals RLS error:', mealsError)
    
    // Test meal_ingredients table RLS
    const { data: miData, error: miError } = await window.supabase
      .from('meal_ingredients')
      .select('count')
      .limit(1)
    
    console.log('Meal ingredients RLS working:', !miError)
    if (miError) console.log('Meal ingredients RLS error:', miError)
    
  } catch (err) {
    console.log('RLS check failed:', err)
  }
}

// Test 5: Test meal insert with minimal data
console.log('\n📋 Test 5: Minimal Meal Insert Test')
async function testMinimalMealInsert() {
  try {
    const testMeal = {
      meal_name: 'Test Meal',
      date_cooked: new Date().toISOString().split('T')[0],
      total_cost: 0,
      user_id: window.supabase?.auth?.user()?.id
    }
    
    console.log('Attempting to insert test meal:', testMeal)
    
    const { data, error } = await window.supabase
      .from('meals')
      .insert(testMeal)
      .select()
    
    if (error) {
      console.log('❌ Meal insert failed:', error)
      console.log('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
    } else {
      console.log('✅ Meal insert successful:', data)
    }
  } catch (err) {
    console.log('❌ Meal insert exception:', err)
  }
}

// Test 6: Test meal_ingredients insert
console.log('\n📋 Test 6: Meal Ingredients Insert Test')
async function testMealIngredientsInsert() {
  try {
    // First get an ingredient
    const { data: ingredients } = await window.supabase
      .from('ingredients')
      .select('id')
      .limit(1)
    
    if (!ingredients || ingredients.length === 0) {
      console.log('❌ No ingredients found for testing')
      return
    }
    
    const testMealIngredient = {
      meal_id: null, // Will be set after meal insert
      ingredient_id: ingredients[0].id,
      quantity_used: 1,
      user_id: window.supabase?.auth?.user()?.id
    }
    
    console.log('Test meal ingredient data:', testMealIngredient)
    console.log('Note: This test requires a valid meal_id')
    
  } catch (err) {
    console.log('❌ Meal ingredients test failed:', err)
  }
}

// Test 7: Check current ingredients
console.log('\n📋 Test 7: Current Ingredients Check')
async function checkCurrentIngredients() {
  try {
    const { data, error } = await window.supabase
      .from('ingredients')
      .select('*')
    
    if (error) {
      console.log('❌ Ingredients fetch failed:', error)
    } else {
      console.log('✅ Ingredients found:', data.length)
      console.log('Sample ingredient:', data[0])
    }
  } catch (err) {
    console.log('❌ Ingredients check failed:', err)
  }
}

// Test 8: Simulate the exact meal creation process
console.log('\n📋 Test 8: Full Meal Creation Simulation')
async function simulateMealCreation() {
  try {
    // Get ingredients
    const { data: ingredients } = await window.supabase
      .from('ingredients')
      .select('*')
    
    if (!ingredients || ingredients.length === 0) {
      console.log('❌ No ingredients available for testing')
      return
    }
    
    console.log('Available ingredients:', ingredients.length)
    
    // Simulate meal data
    const mealData = {
      meal_name: 'Test Meal',
      date_cooked: new Date().toISOString().split('T')[0],
      total_cost: 0,
      user_id: window.supabase?.auth?.user()?.id
    }
    
    console.log('Attempting meal insert with:', mealData)
    
    const { data: meal, error: mealError } = await window.supabase
      .from('meals')
      .insert(mealData)
      .select()
    
    if (mealError) {
      console.log('❌ Meal insert failed:', mealError)
      return
    }
    
    console.log('✅ Meal created:', meal[0])
    
    // Now try to add meal ingredients
    const mealIngredientData = {
      meal_id: meal[0].id,
      ingredient_id: ingredients[0].id,
      quantity_used: 1,
      user_id: window.supabase?.auth?.user()?.id
    }
    
    console.log('Attempting meal ingredient insert with:', mealIngredientData)
    
    const { data: mi, error: miError } = await window.supabase
      .from('meal_ingredients')
      .insert(mealIngredientData)
      .select()
    
    if (miError) {
      console.log('❌ Meal ingredient insert failed:', miError)
    } else {
      console.log('✅ Meal ingredient created:', mi[0])
    }
    
  } catch (err) {
    console.log('❌ Full simulation failed:', err)
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting comprehensive meal insertion diagnostics...')
  
  await checkMealsSchema()
  await checkMealIngredientsSchema()
  await checkRLSPolicies()
  await checkCurrentIngredients()
  await testMinimalMealInsert()
  await testMealIngredientsInsert()
  await simulateMealCreation()
  
  console.log('\n🎯 Diagnostic complete! Check the results above.')
}

// Instructions
console.log('\n📋 Instructions:')
console.log('1. Make sure you are logged in')
console.log('2. Run: runAllTests()')
console.log('3. Check the console output for any errors')
console.log('4. Look for specific error codes and messages')

// Export the test function
window.runAllTests = runAllTests
console.log('✅ Diagnostic script loaded. Run runAllTests() to start testing.') 