#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';

async function checkDatabaseDirectly() {
  console.log('🔍 CHECKING DATABASE DIRECTLY');
  console.log('=============================');
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
    
    console.log('📋 Step 1: Check ingredients table directly...');
    
    // Try to get all ingredients without any filters
    const { data: ingredients, error: ingError } = await supabase
      .from('ingredients')
      .select('*');
    
    if (ingError) {
      console.log('❌ Could not fetch ingredients:', ingError.message);
      console.log('   This might be due to RLS policies');
    } else {
      console.log(`✅ Found ${ingredients.length} ingredients:`);
      ingredients.forEach(ing => {
        console.log(`  - ${ing.name}: ${ing.amount_used}/${ing.amount_purchased} ${ing.unit} (User: ${ing.user_id})`);
      });
    }
    
    console.log('');
    console.log('📋 Step 2: Check meals table directly...');
    
    const { data: meals, error: mealsError } = await supabase
      .from('meals')
      .select('*');
    
    if (mealsError) {
      console.log('❌ Could not fetch meals:', mealsError.message);
    } else {
      console.log(`✅ Found ${meals.length} meals:`);
      meals.forEach(meal => {
        console.log(`  - ${meal.meal_name} (User: ${meal.user_id})`);
      });
    }
    
    console.log('');
    console.log('📋 Step 3: Check meal_ingredients table directly...');
    
    const { data: mealIngredients, error: miError } = await supabase
      .from('meal_ingredients')
      .select('*');
    
    if (miError) {
      console.log('❌ Could not fetch meal_ingredients:', miError.message);
    } else {
      console.log(`✅ Found ${mealIngredients.length} meal_ingredients:`);
      mealIngredients.forEach(mi => {
        console.log(`  - Meal ${mi.meal_id}: ${mi.quantity_used} of ingredient ${mi.ingredient_id}`);
      });
    }
    
    console.log('');
    console.log('📋 Step 4: Try to bypass RLS with service role...');
    console.log('   (This will show if data exists but is blocked by RLS)');
    
    // Try to use a different approach - check if tables exist
    const { data: tableCheck, error: tableError } = await supabase
      .from('ingredients')
      .select('count')
      .limit(1);
    
    if (tableError) {
      console.log('❌ Table access error:', tableError.message);
      console.log('   This suggests RLS is blocking access');
    } else {
      console.log('✅ Table access successful');
    }
    
    console.log('');
    console.log('🔧 CONCLUSION:');
    console.log('==============');
    
    if (ingredients && ingredients.length === 0 && 
        meals && meals.length === 0 && 
        mealIngredients && mealIngredients.length === 0) {
      console.log('❌ The database is empty or RLS is blocking access');
      console.log('');
      console.log('🚀 POSSIBLE SOLUTIONS:');
      console.log('======================');
      console.log('1. The SQL script may not have executed properly');
      console.log('2. RLS policies are blocking access to the data');
      console.log('3. The data was cleared or never inserted');
      console.log('');
      console.log('🔧 NEXT STEPS:');
      console.log('==============');
      console.log('1. Re-run the SQL script in Supabase dashboard');
      console.log('2. Check if RLS policies are too restrictive');
      console.log('3. Try creating data through the app interface');
    } else {
      console.log('✅ Data exists in the database');
      console.log('   The issue is likely with authentication or RLS');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkDatabaseDirectly(); 