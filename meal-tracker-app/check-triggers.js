#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';

async function checkTriggers() {
  console.log('🔍 CHECKING DATABASE TRIGGERS');
  console.log('==============================');
  console.log('Timestamp:', new Date().toISOString());
  console.log('');
  
  try {
    const env = loadEnv('development', process.cwd(), '');
    const supabaseUrl = env.VITE_SUPABASE_URL;
    const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('📋 Step 1: Checking if triggers exist...');
    
    // Check if the trigger function exists
    const { data: functions, error: funcError } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT routine_name, routine_type 
          FROM information_schema.routines 
          WHERE routine_name = 'update_ingredient_usage'
        `
      });
    
    if (funcError) {
      console.log('❌ Could not check functions:', funcError.message);
      console.log('Trying alternative approach...');
      
      // Try to check triggers directly
      const { data: triggers, error: triggerError } = await supabase
        .rpc('exec_sql', {
          sql: `
            SELECT trigger_name, event_manipulation, action_statement
            FROM information_schema.triggers 
            WHERE trigger_name = 'trigger_update_ingredient_usage'
          `
        });
      
      if (triggerError) {
        console.log('❌ Could not check triggers:', triggerError.message);
        console.log('Will create the missing trigger...');
      } else {
        console.log('✅ Triggers found:', triggers);
      }
    } else {
      console.log('✅ Functions found:', functions);
    }
    
    console.log('');
    console.log('📋 Step 2: Testing ingredient usage update...');
    
    // Get a sample ingredient to test with
    const { data: ingredients, error: ingError } = await supabase
      .from('ingredients')
      .select('*')
      .limit(1);
    
    if (ingError) {
      console.log('❌ Could not fetch ingredients:', ingError.message);
      return;
    }
    
    if (!ingredients || ingredients.length === 0) {
      console.log('❌ No ingredients found to test with');
      return;
    }
    
    const testIngredient = ingredients[0];
    console.log('📦 Test ingredient:', {
      id: testIngredient.id,
      name: testIngredient.name,
      amount_purchased: testIngredient.amount_purchased,
      amount_used: testIngredient.amount_used,
      amount_remaining: testIngredient.amount_remaining
    });
    
    console.log('');
    console.log('📋 Step 3: Creating test meal and meal_ingredient...');
    
    // Create a test meal
    const { data: meal, error: mealError } = await supabase
      .from('meals')
      .insert({
        user_id: testIngredient.user_id,
        meal_name: 'Test Meal for Trigger Check',
        date_cooked: new Date().toISOString().split('T')[0]
      })
      .select()
      .single();
    
    if (mealError) {
      console.log('❌ Could not create test meal:', mealError.message);
      return;
    }
    
    console.log('✅ Test meal created:', meal.id);
    
    // Create a test meal_ingredient
    const testQuantity = 1.5;
    const { data: mealIngredient, error: miError } = await supabase
      .from('meal_ingredients')
      .insert({
        meal_id: meal.id,
        ingredient_id: testIngredient.id,
        quantity_used: testQuantity
      })
      .select()
      .single();
    
    if (miError) {
      console.log('❌ Could not create test meal_ingredient:', miError.message);
      return;
    }
    
    console.log('✅ Test meal_ingredient created:', mealIngredient.id);
    
    console.log('');
    console.log('📋 Step 4: Checking if ingredient usage was updated...');
    
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
    
    console.log('📦 Updated ingredient:', {
      id: updatedIngredient.id,
      name: updatedIngredient.name,
      amount_purchased: updatedIngredient.amount_purchased,
      amount_used: updatedIngredient.amount_used,
      amount_remaining: updatedIngredient.amount_remaining
    });
    
    const expectedUsed = testIngredient.amount_used + testQuantity;
    const wasUpdated = updatedIngredient.amount_used === expectedUsed;
    
    console.log('');
    console.log('📊 RESULTS:');
    console.log('===========');
    console.log(`Expected amount_used: ${expectedUsed}`);
    console.log(`Actual amount_used: ${updatedIngredient.amount_used}`);
    console.log(`Trigger working: ${wasUpdated ? '✅ YES' : '❌ NO'}`);
    
    if (!wasUpdated) {
      console.log('');
      console.log('🔧 SOLUTION:');
      console.log('============');
      console.log('The trigger is not working. We need to create it.');
    }
    
    // Clean up test data
    console.log('');
    console.log('🧹 Cleaning up test data...');
    
    await supabase.from('meal_ingredients').delete().eq('id', mealIngredient.id);
    await supabase.from('meals').delete().eq('id', meal.id);
    
    console.log('✅ Test data cleaned up');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTriggers(); 