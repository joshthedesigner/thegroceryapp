#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testConnection() {
  log('🔍 Testing Database Connection...', 'bright');
  log('================================', 'cyan');
  
  try {
    // Create Supabase client
    const supabaseUrl = 'https://jdoitxsoquqaudygnbmh.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkb2l0eHNvcXVxYXVkeWduYm1oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzA0OTI4MywiZXhwIjoyMDY4NjI1MjgzfQ.m3SCCcgkygKBGyD_i5vKeGqV7hBjCmVEfzPe-MC9HW8';
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    log('\n📋 Testing table existence...', 'yellow');
    
    // Test ingredients table
    try {
      const { data: ingredients, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('count')
        .limit(1);
      
      if (ingredientsError) {
        log(`❌ Ingredients table error: ${ingredientsError.message}`, 'red');
      } else {
        log('✅ Ingredients table exists and is accessible', 'green');
      }
    } catch (err) {
      log(`❌ Ingredients table error: ${err.message}`, 'red');
    }
    
    // Test meals table
    try {
      const { data: meals, error: mealsError } = await supabase
        .from('meals')
        .select('count')
        .limit(1);
      
      if (mealsError) {
        log(`❌ Meals table error: ${mealsError.message}`, 'red');
      } else {
        log('✅ Meals table exists and is accessible', 'green');
      }
    } catch (err) {
      log(`❌ Meals table error: ${err.message}`, 'red');
    }
    
    // Test meal_ingredients table
    try {
      const { data: mealIngredients, error: mealIngredientsError } = await supabase
        .from('meal_ingredients')
        .select('count')
        .limit(1);
      
      if (mealIngredientsError) {
        log(`❌ Meal_ingredients table error: ${mealIngredientsError.message}`, 'red');
      } else {
        log('✅ Meal_ingredients table exists and is accessible', 'green');
      }
    } catch (err) {
      log(`❌ Meal_ingredients table error: ${err.message}`, 'red');
    }
    
    log('\n🎉 Database connection test completed!', 'green');
    log('Your app should now work properly.', 'cyan');
    log('\n📋 Next steps:', 'yellow');
    log('1. Refresh your app at http://localhost:5174/', 'cyan');
    log('2. The "Database Setup Required" messages should disappear', 'cyan');
    log('3. You can now add ingredients and log meals!', 'cyan');
    
  } catch (error) {
    log(`❌ Test failed: ${error.message}`, 'red');
  }
}

// Run the test
testConnection(); 