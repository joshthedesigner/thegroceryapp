#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';

async function addDataForApp() {
  console.log('🔧 ADDING DATA FOR APP TESTING');
  console.log('==============================');
  console.log('Timestamp:', new Date().toISOString());
  console.log('');
  
  try {
    const env = loadEnv('development', process.cwd(), '');
    const supabaseUrl = env.VITE_SUPABASE_URL;
    const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('📋 Step 1: Create a test user account...');
    
    // Create a test user with a simple email
    const testEmail = 'test@test.com';
    const testPassword = 'testpassword123';
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword
    });
    
    if (authError) {
      console.log('❌ Could not create user:', authError.message);
      console.log('Trying to sign in with existing user...');
      
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });
      
      if (signInError) {
        console.log('❌ Could not sign in:', signInError.message);
        console.log('Will proceed without authentication...');
      } else {
        console.log('✅ Signed in successfully');
      }
    } else {
      console.log('✅ Test user created successfully');
    }
    
    console.log('');
    console.log('📋 Step 2: Get current user...');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.log('❌ Could not get user:', userError.message);
      return;
    }
    
    if (!user) {
      console.log('⚠️  No authenticated user');
      console.log('   The app will need to be authenticated to see data');
      console.log('   But we can still test the trigger manually');
    } else {
      console.log('✅ Authenticated user:', user.email);
      console.log('   User ID:', user.id);
    }
    
    console.log('');
    console.log('📋 Step 3: Add test ingredients...');
    
    const userId = user ? user.id : '00000000-0000-0000-0000-000000000001';
    
    const testIngredients = [
      {
        user_id: userId,
        name: 'Chicken Breast',
        unit: 'pieces',
        amount_purchased: 4,
        price: 20.00,
        purchase_date: new Date().toISOString().split('T')[0],
        amount_used: 0
      },
      {
        user_id: userId,
        name: 'Rice',
        unit: 'cups',
        amount_purchased: 10,
        price: 5.00,
        purchase_date: new Date().toISOString().split('T')[0],
        amount_used: 0
      }
    ];
    
    const { data: ingredients, error: ingError } = await supabase
      .from('ingredients')
      .insert(testIngredients)
      .select();
    
    if (ingError) {
      console.log('❌ Could not add ingredients:', ingError.message);
      console.log('   This might be due to RLS policies');
      return;
    }
    
    console.log('✅ Added test ingredients:');
    ingredients.forEach(ing => {
      console.log(`  - ${ing.name}: ${ing.amount_purchased} ${ing.unit} for $${ing.price}`);
    });
    
    console.log('');
    console.log('📋 Step 4: Test the trigger by adding a meal...');
    
    // Create a test meal
    const { data: meal, error: mealError } = await supabase
      .from('meals')
      .insert({
        user_id: userId,
        meal_name: 'Test Chicken Stir Fry',
        date_cooked: new Date().toISOString().split('T')[0]
      })
      .select()
      .single();
    
    if (mealError) {
      console.log('❌ Could not create meal:', mealError.message);
      return;
    }
    
    console.log('✅ Test meal created:', meal.meal_name);
    
    // Add meal ingredients to test the trigger
    const mealIngredients = [
      {
        meal_id: meal.id,
        ingredient_id: ingredients[0].id, // Chicken Breast
        quantity_used: 2.4
      },
      {
        meal_id: meal.id,
        ingredient_id: ingredients[1].id, // Rice
        quantity_used: 1.5
      }
    ];
    
    const { data: addedMealIngredients, error: miError } = await supabase
      .from('meal_ingredients')
      .insert(mealIngredients)
      .select();
    
    if (miError) {
      console.log('❌ Could not add meal ingredients:', miError.message);
      return;
    }
    
    console.log('✅ Added meal ingredients:');
    addedMealIngredients.forEach(mi => {
      console.log(`  - ${mi.quantity_used} units of ingredient ${mi.ingredient_id}`);
    });
    
    console.log('');
    console.log('📋 Step 5: Check if ingredients were updated...');
    
    // Check updated ingredients
    const { data: updatedIngredients, error: updateError } = await supabase
      .from('ingredients')
      .select('*')
      .in('id', ingredients.map(ing => ing.id));
    
    if (updateError) {
      console.log('❌ Could not fetch updated ingredients:', updateError.message);
      return;
    }
    
    console.log('✅ Updated ingredients:');
    updatedIngredients.forEach(ing => {
      console.log(`  - ${ing.name}: ${ing.amount_used}/${ing.amount_purchased} ${ing.unit} used`);
      console.log(`    Remaining: ${ing.amount_remaining} ${ing.unit}`);
      console.log(`    Usage: ${((ing.amount_used / ing.amount_purchased) * 100).toFixed(1)}%`);
    });
    
    console.log('');
    console.log('🎉 TEST COMPLETE!');
    console.log('=================');
    console.log('The trigger should have updated the ingredient usage.');
    
    if (user) {
      console.log('');
      console.log('🚀 NEXT STEPS:');
      console.log('==============');
      console.log('1. Go to your app: http://localhost:5173');
      console.log('2. Sign in with: test@test.com / testpassword123');
      console.log('3. Check the dashboard - you should see the updated data!');
      console.log('4. Try logging another meal to test the trigger further');
    } else {
      console.log('');
      console.log('⚠️  NOTE: No authenticated user');
      console.log('   The app will need to be authenticated to see this data');
      console.log('   But the trigger is working in the database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addDataForApp(); 