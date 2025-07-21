#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';

async function debugUIRefresh() {
  console.log('🔍 DEBUGGING UI REFRESH ISSUE');
  console.log('==============================');
  console.log('Timestamp:', new Date().toISOString());
  console.log('');
  
  try {
    const env = loadEnv('development', process.cwd(), '');
    const supabaseUrl = env.VITE_SUPABASE_URL;
    const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('📋 Step 1: Check current authentication...');
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('❌ Auth error:', authError.message);
    } else if (user) {
      console.log('✅ Authenticated user:', user.email);
      console.log('   User ID:', user.id);
    } else {
      console.log('⚠️  No authenticated user');
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
    console.log('📋 Step 3: Check ingredients for different user IDs...');
    
    if (user) {
      console.log(`🔍 Checking ingredients for authenticated user: ${user.id}`);
      const { data: userIngredients, error: userIngError } = await supabase
        .from('ingredients')
        .select('*')
        .eq('user_id', user.id);
      
      if (userIngError) {
        console.log('❌ Could not fetch user ingredients:', userIngError.message);
      } else {
        console.log(`✅ Found ${userIngredients.length} ingredients for authenticated user:`);
        userIngredients.forEach(ing => {
          console.log(`  - ${ing.name}: ${ing.amount_used}/${ing.amount_purchased} ${ing.unit}`);
        });
      }
    }
    
    console.log('');
    console.log('🔍 Checking ingredients for test user: 00000000-0000-0000-0000-000000000001');
    const { data: testUserIngredients, error: testUserIngError } = await supabase
      .from('ingredients')
      .select('*')
      .eq('user_id', '00000000-0000-0000-0000-000000000001');
    
    if (testUserIngError) {
      console.log('❌ Could not fetch test user ingredients:', testUserIngError.message);
    } else {
      console.log(`✅ Found ${testUserIngredients.length} ingredients for test user:`);
      testUserIngredients.forEach(ing => {
        console.log(`  - ${ing.name}: ${ing.amount_used}/${ing.amount_purchased} ${ing.unit}`);
      });
    }
    
    console.log('');
    console.log('📋 Step 4: Check if there are any meals...');
    
    const { data: allMeals, error: mealsError } = await supabase
      .from('meals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (mealsError) {
      console.log('❌ Could not fetch meals:', mealsError.message);
    } else {
      console.log(`✅ Found ${allMeals.length} total meals:`);
      allMeals.forEach(meal => {
        console.log(`  - ${meal.meal_name} (User: ${meal.user_id})`);
      });
    }
    
    console.log('');
    console.log('📋 Step 5: Check meal_ingredients...');
    
    const { data: allMealIngredients, error: miError } = await supabase
      .from('meal_ingredients')
      .select(`
        *,
        meals(meal_name, user_id),
        ingredients(name, user_id)
      `)
      .order('created_at', { ascending: false });
    
    if (miError) {
      console.log('❌ Could not fetch meal_ingredients:', miError.message);
    } else {
      console.log(`✅ Found ${allMealIngredients.length} meal_ingredients:`);
      allMealIngredients.forEach(mi => {
        console.log(`  - ${mi.meals?.meal_name}: ${mi.quantity_used} of ${mi.ingredients?.name}`);
        console.log(`    (Meal User: ${mi.meals?.user_id}, Ingredient User: ${mi.ingredients?.user_id})`);
      });
    }
    
    console.log('');
    console.log('🔧 DIAGNOSIS:');
    console.log('=============');
    
    if (!user) {
      console.log('❌ PROBLEM: No authenticated user');
      console.log('   SOLUTION: The app needs to be authenticated to see data');
      console.log('   The test data was created with a placeholder user ID');
    } else if (userIngredients && userIngredients.length === 0) {
      console.log('❌ PROBLEM: No ingredients for authenticated user');
      console.log('   SOLUTION: Need to create ingredients for the authenticated user');
    } else {
      console.log('✅ Data exists for authenticated user');
      console.log('   The UI should be showing the correct data');
    }
    
    console.log('');
    console.log('🚀 NEXT STEPS:');
    console.log('===============');
    console.log('1. Check if the app is authenticated');
    console.log('2. If authenticated, the UI should show the correct data');
    console.log('3. If not authenticated, the UI will show cached/empty data');
    console.log('4. Try refreshing the browser or clearing cache');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugUIRefresh(); 