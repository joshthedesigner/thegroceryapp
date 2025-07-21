#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';

async function analyzeMealsSchema() {
  console.log('🔍 ANALYZING MEALS TABLE SCHEMA');
  console.log('================================');
  console.log('Timestamp:', new Date().toISOString());
  console.log('');
  
  try {
    const env = loadEnv('development', process.cwd(), '');
    const supabaseUrl = env.VITE_SUPABASE_URL;
    const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('📋 Step 1: Checking meals table structure...');
    
    // Get table information
    const { data: tableInfo, error: tableError } = await supabase
      .from('meals')
      .select('*')
      .limit(0);
    
    if (tableError) {
      console.log('❌ Error accessing meals table:', tableError.message);
      return;
    }
    
    console.log('✅ Meals table accessible');
    
    console.log('');
    console.log('📋 Step 2: Testing specific columns...');
    
    // Test each column that should exist based on different schema files
    const columnsToTest = [
      'id',
      'user_id',
      'meal_name',  // Expected by app
      'name',       // Alternative from some schemas
      'date_cooked', // Expected by app
      'meal_date',   // Alternative from some schemas
      'total_cost',
      'created_at',
      'updated_at'
    ];
    
    for (const column of columnsToTest) {
      try {
        const { data, error } = await supabase
          .from('meals')
          .select(column)
          .limit(1);
        
        if (error) {
          console.log(`❌ Column '${column}': ${error.message}`);
        } else {
          console.log(`✅ Column '${column}': EXISTS`);
        }
      } catch (err) {
        console.log(`❌ Column '${column}': ${err.message}`);
      }
    }
    
    console.log('');
    console.log('📋 Step 3: Testing the exact query from supabase.js...');
    
    // Test the exact query that's used in the app
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
      console.log('❌ Meals query failing:', mealsError.message);
    } else {
      console.log('✅ Meals query working!');
      if (mealsTest && mealsTest.length > 0) {
        console.log('   Available columns:', Object.keys(mealsTest[0]));
      }
    }
    
    console.log('');
    console.log('📋 Step 4: Checking what columns actually exist...');
    
    // Try to get a sample row to see what columns exist
    const { data: sampleData, error: sampleError } = await supabase
      .from('meals')
      .select('*')
      .limit(1);
    
    if (sampleError) {
      console.log('❌ Cannot get sample data:', sampleError.message);
    } else if (sampleData.length > 0) {
      console.log('✅ Sample row columns:', Object.keys(sampleData[0]));
    } else {
      console.log('ℹ️  Table is empty, no sample data available');
    }
    
    console.log('');
    console.log('📋 Step 5: Testing meal creation...');
    
    // Test creating a meal to see what columns are required
    const testMeal = {
      user_id: 'test-user-id',
      meal_name: 'Test Meal',
      date_cooked: '2024-01-01',
      total_cost: 10.50
    };
    
    const { data: createTest, error: createError } = await supabase
      .from('meals')
      .insert([testMeal])
      .select();
    
    if (createError) {
      console.log('❌ Meal creation test failed:', createError.message);
    } else {
      console.log('✅ Meal creation test successful!');
      console.log('   Created meal columns:', Object.keys(createTest[0]));
      
      // Clean up test data
      await supabase
        .from('meals')
        .delete()
        .eq('id', createTest[0].id);
    }
    
  } catch (error) {
    console.log('❌ Schema analysis failed:', error.message);
  }
}

analyzeMealsSchema(); 