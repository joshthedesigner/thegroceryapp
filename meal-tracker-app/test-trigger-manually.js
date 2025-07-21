#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';

async function testTriggerManually() {
  console.log('🔍 MANUALLY TESTING INGREDIENT USAGE TRIGGER');
  console.log('============================================');
  console.log('Timestamp:', new Date().toISOString());
  console.log('');
  
  try {
    const env = loadEnv('development', process.cwd(), '');
    const supabaseUrl = env.VITE_SUPABASE_URL;
    const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('📋 Step 1: Check existing ingredients...');
    
    const { data: ingredients, error: ingError } = await supabase
      .from('ingredients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (ingError) {
      console.log('❌ Could not fetch ingredients:', ingError.message);
      return;
    }
    
    console.log(`✅ Found ${ingredients.length} ingredients:`);
    ingredients.forEach(ing => {
      console.log(`  - ${ing.name}: ${ing.amount_used}/${ing.amount_purchased} ${ing.unit} (${ing.amount_remaining} remaining)`);
    });
    
    console.log('');
    console.log('📋 Step 2: Check existing meals...');
    
    const { data: meals, error: mealsError } = await supabase
      .from('meals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (mealsError) {
      console.log('❌ Could not fetch meals:', mealsError.message);
      return;
    }
    
    console.log(`✅ Found ${meals.length} meals:`);
    meals.forEach(meal => {
      console.log(`  - ${meal.meal_name} (${meal.date_cooked}) - Cost: $${meal.total_cost}`);
    });
    
    console.log('');
    console.log('📋 Step 3: Check existing meal_ingredients...');
    
    const { data: mealIngredients, error: miError } = await supabase
      .from('meal_ingredients')
      .select(`
        *,
        meals(meal_name),
        ingredients(name, amount_purchased, amount_used, amount_remaining)
      `)
      .order('created_at', { ascending: false });
    
    if (miError) {
      console.log('❌ Could not fetch meal_ingredients:', miError.message);
      return;
    }
    
    console.log(`✅ Found ${mealIngredients.length} meal_ingredients:`);
    mealIngredients.forEach(mi => {
      console.log(`  - ${mi.meals?.meal_name}: ${mi.quantity_used} ${mi.ingredients?.unit} of ${mi.ingredients?.name}`);
      console.log(`    (Ingredient shows: ${mi.ingredients?.amount_used}/${mi.ingredients?.amount_purchased} used)`);
    });
    
    console.log('');
    console.log('📋 Step 4: Test trigger manually...');
    
    if (ingredients.length === 0) {
      console.log('❌ No ingredients found to test with');
      return;
    }
    
    const testIngredient = ingredients[0];
    console.log(`📦 Testing with ingredient: ${testIngredient.name}`);
    console.log(`   Current state: ${testIngredient.amount_used}/${testIngredient.amount_purchased} used`);
    
    // Create a test meal
    const { data: testMeal, error: mealError } = await supabase
      .from('meals')
      .insert({
        user_id: testIngredient.user_id,
        meal_name: 'Manual Trigger Test',
        date_cooked: new Date().toISOString().split('T')[0]
      })
      .select()
      .single();
    
    if (mealError) {
      console.log('❌ Could not create test meal:', mealError.message);
      return;
    }
    
    console.log('✅ Test meal created:', testMeal.id);
    
    // Add a meal ingredient to test the trigger
    const testQuantity = 2.0;
    const { data: testMealIngredient, error: miTestError } = await supabase
      .from('meal_ingredients')
      .insert({
        meal_id: testMeal.id,
        ingredient_id: testIngredient.id,
        quantity_used: testQuantity
      })
      .select()
      .single();
    
    if (miTestError) {
      console.log('❌ Could not create test meal_ingredient:', miTestError.message);
      return;
    }
    
    console.log('✅ Test meal_ingredient created:', testMealIngredient.id);
    
    // Check if the ingredient was updated
    const { data: updatedIngredient, error: updateError } = await supabase
      .from('ingredients')
      .select('*')
      .eq('id', testIngredient.id)
      .single();
    
    if (updateError) {
      console.log('❌ Could not fetch updated ingredient:', updateError.message);
      return;
    }
    
    console.log('');
    console.log('📊 TRIGGER TEST RESULTS:');
    console.log('========================');
    console.log(`Before: ${testIngredient.amount_used}/${testIngredient.amount_purchased} used`);
    console.log(`After:  ${updatedIngredient.amount_used}/${updatedIngredient.amount_purchased} used`);
    console.log(`Added:  ${testQuantity} ${testIngredient.unit}`);
    
    const expectedUsed = testIngredient.amount_used + testQuantity;
    const wasUpdated = updatedIngredient.amount_used === expectedUsed;
    
    console.log(`Expected: ${expectedUsed}`);
    console.log(`Actual:   ${updatedIngredient.amount_used}`);
    console.log(`Trigger working: ${wasUpdated ? '✅ YES' : '❌ NO'}`);
    
    if (!wasUpdated) {
      console.log('');
      console.log('🔧 TROUBLESHOOTING:');
      console.log('===================');
      console.log('The trigger is not working. Possible issues:');
      console.log('1. Trigger function not created properly');
      console.log('2. Trigger not attached to meal_ingredients table');
      console.log('3. RLS policies blocking the trigger');
      console.log('4. Database permissions issue');
    }
    
    // Clean up test data
    console.log('');
    console.log('🧹 Cleaning up test data...');
    
    await supabase.from('meal_ingredients').delete().eq('id', testMealIngredient.id);
    await supabase.from('meals').delete().eq('id', testMeal.id);
    
    console.log('✅ Test data cleaned up');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testTriggerManually(); 