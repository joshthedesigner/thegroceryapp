#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';

async function checkGoogleAuth() {
  console.log('🔍 CHECKING GOOGLE AUTHENTICATION');
  console.log('==================================');
  console.log('Timestamp:', new Date().toISOString());
  console.log('');
  
  try {
    const env = loadEnv('development', process.cwd(), '');
    const supabaseUrl = env.VITE_SUPABASE_URL;
    const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('📋 Step 1: Check current authentication status...');
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('❌ Auth error:', authError.message);
      console.log('   This suggests you might not be authenticated in the script context');
    } else if (user) {
      console.log('✅ Authenticated user found:');
      console.log(`   Email: ${user.email}`);
      console.log(`   User ID: ${user.id}`);
      console.log(`   Provider: ${user.app_metadata?.provider || 'unknown'}`);
      console.log(`   Created: ${user.created_at}`);
    } else {
      console.log('⚠️  No authenticated user found');
      console.log('   This means the script is not authenticated');
      console.log('   But your browser app might be authenticated');
    }
    
    console.log('');
    console.log('📋 Step 2: Check all ingredients in database...');
    
    const { data: allIngredients, error: ingError } = await supabase
      .from('ingredients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (ingError) {
      console.log('❌ Could not fetch ingredients:', ingError.message);
      return;
    }
    
    console.log(`✅ Found ${allIngredients.length} total ingredients:`);
    allIngredients.forEach(ing => {
      console.log(`  - ${ing.name}: ${ing.amount_used}/${ing.amount_purchased} ${ing.unit} (User: ${ing.user_id})`);
    });
    
    console.log('');
    console.log('📋 Step 3: Check ingredients for authenticated user...');
    
    if (user) {
      const { data: userIngredients, error: userIngError } = await supabase
        .from('ingredients')
        .select('*')
        .eq('user_id', user.id);
      
      if (userIngError) {
        console.log('❌ Could not fetch user ingredients:', userIngError.message);
      } else {
        console.log(`✅ Found ${userIngredients.length} ingredients for your Google account:`);
        userIngredients.forEach(ing => {
          console.log(`  - ${ing.name}: ${ing.amount_used}/${ing.amount_purchased} ${ing.unit}`);
          console.log(`    Usage: ${((ing.amount_used / ing.amount_purchased) * 100).toFixed(1)}%`);
        });
      }
    }
    
    console.log('');
    console.log('📋 Step 4: Check meals for authenticated user...');
    
    if (user) {
      const { data: userMeals, error: userMealsError } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id);
      
      if (userMealsError) {
        console.log('❌ Could not fetch user meals:', userMealsError.message);
      } else {
        console.log(`✅ Found ${userMeals.length} meals for your Google account:`);
        userMeals.forEach(meal => {
          console.log(`  - ${meal.meal_name} (${meal.date_cooked})`);
        });
      }
    }
    
    console.log('');
    console.log('🔧 DIAGNOSIS:');
    console.log('=============');
    
    if (!user) {
      console.log('❌ PROBLEM: Script is not authenticated');
      console.log('   SOLUTION: The script runs in a different context than your browser');
      console.log('   Your browser app is authenticated, but this script is not');
    } else if (userIngredients && userIngredients.length === 0) {
      console.log('❌ PROBLEM: No ingredients for your Google account');
      console.log('   SOLUTION: You need to add ingredients through the app interface');
      console.log('   The test data was created with a different user ID');
    } else {
      console.log('✅ Data exists for your Google account');
      console.log('   The UI should be showing the correct data');
      console.log('   If it\'s not, try refreshing the browser or clearing cache');
    }
    
    console.log('');
    console.log('🚀 NEXT STEPS:');
    console.log('==============');
    console.log('1. Go to your app: http://localhost:5173');
    console.log('2. Make sure you\'re signed in with Google');
    console.log('3. Try adding an ingredient through the app interface');
    console.log('4. Then log a meal to test the trigger');
    console.log('5. Check if the dashboard updates correctly');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkGoogleAuth(); 