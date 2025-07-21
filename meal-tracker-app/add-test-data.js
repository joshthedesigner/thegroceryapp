#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';

async function addTestData() {
  console.log('🔧 ADDING TEST DATA TO DATABASE');
  console.log('================================');
  console.log('Timestamp:', new Date().toISOString());
  console.log('');
  
  try {
    const env = loadEnv('development', process.cwd(), '');
    const supabaseUrl = env.VITE_SUPABASE_URL;
    const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('📋 Step 1: Create a test user...');
    
    // First, let's sign up a test user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123'
    });
    
    if (authError) {
      console.log('❌ Could not create test user:', authError.message);
      console.log('Trying to sign in with existing user...');
      
      // Try to sign in instead
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword123'
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
    console.log('📋 Step 2: Add test ingredients...');
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('⚠️  No authenticated user, will use a placeholder user_id');
      // Use a placeholder UUID for testing
      const testUserId = '00000000-0000-0000-0000-000000000000';
      
      // Add test ingredients
      const testIngredients = [
        {
          user_id: testUserId,
          name: 'Chicken Breast',
          unit: 'pieces',
          amount_purchased: 4,
          price: 20.00,
          purchase_date: new Date().toISOString().split('T')[0],
          amount_used: 0
        },
        {
          user_id: testUserId,
          name: 'Rice',
          unit: 'cups',
          amount_purchased: 10,
          price: 5.00,
          purchase_date: new Date().toISOString().split('T')[0],
          amount_used: 0
        },
        {
          user_id: testUserId,
          name: 'Broccoli',
          unit: 'heads',
          amount_purchased: 3,
          price: 6.00,
          purchase_date: new Date().toISOString().split('T')[0],
          amount_used: 0
        }
      ];
      
      const { data: ingredients, error: ingError } = await supabase
        .from('ingredients')
        .insert(testIngredients)
        .select();
      
      if (ingError) {
        console.log('❌ Could not add test ingredients:', ingError.message);
        return;
      }
      
      console.log('✅ Added test ingredients:');
      ingredients.forEach(ing => {
        console.log(`  - ${ing.name}: ${ing.amount_purchased} ${ing.unit} for $${ing.price}`);
      });
      
      console.log('');
      console.log('📋 Step 3: Test the trigger by adding a meal...');
      
      // Create a test meal
      const { data: meal, error: mealError } = await supabase
        .from('meals')
        .insert({
          user_id: testUserId,
          meal_name: 'Test Chicken Stir Fry',
          date_cooked: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();
      
      if (mealError) {
        console.log('❌ Could not create test meal:', mealError.message);
        return;
      }
      
      console.log('✅ Test meal created:', meal.meal_name);
      
      // Add meal ingredients to test the trigger
      const mealIngredients = [
        {
          meal_id: meal.id,
          ingredient_id: ingredients[0].id, // Chicken Breast
          quantity_used: 2
        },
        {
          meal_id: meal.id,
          ingredient_id: ingredients[1].id, // Rice
          quantity_used: 1.5
        },
        {
          meal_id: meal.id,
          ingredient_id: ingredients[2].id, // Broccoli
          quantity_used: 1
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
      console.log('📋 Step 4: Check if ingredients were updated...');
      
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
      });
      
      console.log('');
      console.log('🎉 TEST COMPLETE!');
      console.log('=================');
      console.log('The trigger should have updated the ingredient usage.');
      console.log('Now you can test the app and see if the dashboard updates correctly.');
      
    } else {
      console.log(`✅ Using authenticated user: ${user.email}`);
      
      // Add test ingredients for the authenticated user
      const testIngredients = [
        {
          user_id: user.id,
          name: 'Chicken Breast',
          unit: 'pieces',
          amount_purchased: 4,
          price: 20.00,
          purchase_date: new Date().toISOString().split('T')[0],
          amount_used: 0
        },
        {
          user_id: user.id,
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
        console.log('❌ Could not add test ingredients:', ingError.message);
        return;
      }
      
      console.log('✅ Added test ingredients for authenticated user');
      console.log('Now you can test the app with real authentication!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addTestData(); 