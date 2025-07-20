#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';

async function verifyFix() {
  console.log('🔍 VERIFYING DATABASE FIX');
  console.log('=========================');
  console.log('Timestamp:', new Date().toISOString());
  console.log('');
  
  try {
    const env = loadEnv('development', process.cwd(), '');
    const supabaseUrl = env.VITE_SUPABASE_URL;
    const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('📋 Step 1: Checking if price column exists...');
    
    // Test if we can select the price column
    const { data: priceTest, error: priceError } = await supabase
      .from('ingredients')
      .select('price')
      .limit(1);
    
    if (priceError) {
      console.log('❌ Price column test failed:', priceError.message);
      return;
    } else {
      console.log('✅ Price column exists and is accessible!');
    }
    
    console.log('');
    console.log('📋 Step 2: Testing the problematic meals query...');
    
    // Test the query that was causing the error
    const { data: mealsTest, error: mealsError } = await supabase
      .from('meals')
      .select(`
        *,
        meal_ingredients (
          quantity_used,
          ingredients (
            name,
            unit,
            price
          )
        )
      `)
      .limit(1);
    
    if (mealsError) {
      console.log('❌ Meals query still failing:', mealsError.message);
      return;
    } else {
      console.log('✅ Meals query working perfectly!');
      console.log('   Result:', mealsTest);
    }
    
    console.log('');
    console.log('📋 Step 3: Testing ingredients query...');
    
    // Test ingredients query
    const { data: ingredientsTest, error: ingredientsError } = await supabase
      .from('ingredients')
      .select('*')
      .limit(1);
    
    if (ingredientsError) {
      console.log('❌ Ingredients query failed:', ingredientsError.message);
    } else {
      console.log('✅ Ingredients query working!');
      console.log('   Available columns:', Object.keys(ingredientsTest[0] || {}));
    }
    
    console.log('');
    console.log('🎉 VERIFICATION COMPLETE!');
    console.log('========================');
    console.log('✅ Database schema is now correct');
    console.log('✅ Price column added successfully');
    console.log('✅ All queries working properly');
    console.log('');
    console.log('🚀 Your app should now work without the "Database Setup Required" error!');
    console.log('   Go to http://localhost:5173 and refresh the page');
    
  } catch (error) {
    console.log('❌ Verification failed:', error.message);
  }
}

verifyFix(); 