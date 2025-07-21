#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';

async function checkActualData() {
  console.log('🔍 CHECKING ACTUAL DATABASE DATA');
  console.log('=================================');
  console.log('Timestamp:', new Date().toISOString());
  console.log('');
  
  try {
    const env = loadEnv('development', process.cwd(), '');
    const supabaseUrl = env.VITE_SUPABASE_URL;
    const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
    
    console.log('📋 Environment Variables:');
    console.log('=========================');
    console.log('VITE_SUPABASE_URL:', supabaseUrl);
    console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey.substring(0, 20) + '...');
    console.log('');
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('📋 Step 1: Check if we can connect to the database...');
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('ingredients')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.log('❌ Database connection failed:', testError.message);
      return;
    }
    
    console.log('✅ Database connection successful');
    console.log('');
    
    console.log('📋 Step 2: Check all tables for data...');
    
    // Check ingredients table
    const { data: ingredients, error: ingError } = await supabase
      .from('ingredients')
      .select('*');
    
    if (ingError) {
      console.log('❌ Could not fetch ingredients:', ingError.message);
    } else {
      console.log(`📦 Ingredients table: ${ingredients.length} records`);
      if (ingredients.length > 0) {
        ingredients.forEach(ing => {
          console.log(`  - ${ing.name}: ${ing.amount_used}/${ing.amount_purchased} ${ing.unit}`);
        });
      }
    }
    
    // Check meals table
    const { data: meals, error: mealsError } = await supabase
      .from('meals')
      .select('*');
    
    if (mealsError) {
      console.log('❌ Could not fetch meals:', mealsError.message);
    } else {
      console.log(`🍽️  Meals table: ${meals.length} records`);
      if (meals.length > 0) {
        meals.forEach(meal => {
          console.log(`  - ${meal.meal_name} (${meal.date_cooked})`);
        });
      }
    }
    
    // Check meal_ingredients table
    const { data: mealIngredients, error: miError } = await supabase
      .from('meal_ingredients')
      .select('*');
    
    if (miError) {
      console.log('❌ Could not fetch meal_ingredients:', miError.message);
    } else {
      console.log(`🔗 Meal_ingredients table: ${mealIngredients.length} records`);
      if (mealIngredients.length > 0) {
        mealIngredients.forEach(mi => {
          console.log(`  - Meal ${mi.meal_id}: ${mi.quantity_used} of ingredient ${mi.ingredient_id}`);
        });
      }
    }
    
    console.log('');
    console.log('📋 Step 3: Check if there are any users...');
    
    // Check auth.users (this might be restricted)
    const { data: users, error: usersError } = await supabase.auth.getUser();
    
    if (usersError) {
      console.log('❌ Could not check current user:', usersError.message);
    } else {
      console.log('✅ Current user check successful');
      if (users.user) {
        console.log(`  - User ID: ${users.user.id}`);
        console.log(`  - Email: ${users.user.email}`);
      } else {
        console.log('  - No authenticated user');
      }
    }
    
    console.log('');
    console.log('📋 Step 4: Check table structure...');
    
    // Try to get table info
    const { data: tableInfo, error: tableError } = await supabase
      .from('ingredients')
      .select('*')
      .limit(0);
    
    if (tableError) {
      console.log('❌ Could not get table structure:', tableError.message);
    } else {
      console.log('✅ Table structure check successful');
    }
    
    console.log('');
    console.log('📋 CONCLUSION:');
    console.log('==============');
    
    if (ingredients && ingredients.length === 0 && 
        meals && meals.length === 0 && 
        mealIngredients && mealIngredients.length === 0) {
      console.log('❌ The database is completely empty!');
      console.log('');
      console.log('🔧 NEXT STEPS:');
      console.log('==============');
      console.log('1. The UI is showing data from somewhere else (cached/local storage)');
      console.log('2. We need to add some test data to verify the trigger works');
      console.log('3. Or check if the app is connecting to a different database');
    } else {
      console.log('✅ Found data in the database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkActualData(); 