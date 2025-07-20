#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';

async function checkSchema() {
  console.log('🔍 DATABASE SCHEMA ANALYSIS');
  console.log('==========================');
  console.log('Timestamp:', new Date().toISOString());
  console.log('');
  
  try {
    const env = loadEnv('development', process.cwd(), '');
    const supabaseUrl = env.VITE_SUPABASE_URL;
    const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Check ingredients table schema
    console.log('🗄️  INGREDIENTS TABLE SCHEMA');
    console.log('-----------------------------');
    try {
      const { data: ingredientsSchema, error: ingredientsError } = await supabase
        .from('ingredients')
        .select('*')
        .limit(1);
      
      if (ingredientsError) {
        console.log('❌ Error accessing ingredients table:', ingredientsError.message);
      } else if (ingredientsSchema && ingredientsSchema.length > 0) {
        const columns = Object.keys(ingredientsSchema[0]);
        console.log('✅ Ingredients table columns:', columns);
        
        // Check for expected columns
        const expectedColumns = ['id', 'name', 'category', 'amount_purchased', 'amount_used', 'unit', 'user_id', 'created_at', 'updated_at'];
        console.log('\nExpected columns:', expectedColumns);
        
        const missingColumns = expectedColumns.filter(col => !columns.includes(col));
        const extraColumns = columns.filter(col => !expectedColumns.includes(col));
        
        if (missingColumns.length > 0) {
          console.log('❌ Missing columns:', missingColumns);
        }
        if (extraColumns.length > 0) {
          console.log('⚠️  Extra columns:', extraColumns);
        }
        if (missingColumns.length === 0 && extraColumns.length === 0) {
          console.log('✅ Schema matches expectations');
        }
      } else {
        console.log('ℹ️  Ingredients table is empty');
      }
    } catch (err) {
      console.log('❌ Exception accessing ingredients:', err.message);
    }
    console.log('');
    
    // Check meals table schema
    console.log('🍽️  MEALS TABLE SCHEMA');
    console.log('----------------------');
    try {
      const { data: mealsSchema, error: mealsError } = await supabase
        .from('meals')
        .select('*')
        .limit(1);
      
      if (mealsError) {
        console.log('❌ Error accessing meals table:', mealsError.message);
      } else if (mealsSchema && mealsSchema.length > 0) {
        const columns = Object.keys(mealsSchema[0]);
        console.log('✅ Meals table columns:', columns);
        
        // Check for expected columns
        const expectedColumns = ['id', 'name', 'date', 'user_id', 'created_at', 'updated_at'];
        console.log('\nExpected columns:', expectedColumns);
        
        const missingColumns = expectedColumns.filter(col => !columns.includes(col));
        const extraColumns = columns.filter(col => !expectedColumns.includes(col));
        
        if (missingColumns.length > 0) {
          console.log('❌ Missing columns:', missingColumns);
        }
        if (extraColumns.length > 0) {
          console.log('⚠️  Extra columns:', extraColumns);
        }
        if (missingColumns.length === 0 && extraColumns.length === 0) {
          console.log('✅ Schema matches expectations');
        }
      } else {
        console.log('ℹ️  Meals table is empty');
      }
    } catch (err) {
      console.log('❌ Exception accessing meals:', err.message);
    }
    console.log('');
    
    // Check meal_ingredients table schema
    console.log('🔗 MEAL_INGREDIENTS TABLE SCHEMA');
    console.log('--------------------------------');
    try {
      const { data: mealIngredientsSchema, error: mealIngredientsError } = await supabase
        .from('meal_ingredients')
        .select('*')
        .limit(1);
      
      if (mealIngredientsError) {
        console.log('❌ Error accessing meal_ingredients table:', mealIngredientsError.message);
      } else if (mealIngredientsSchema && mealIngredientsSchema.length > 0) {
        const columns = Object.keys(mealIngredientsSchema[0]);
        console.log('✅ Meal_ingredients table columns:', columns);
        
        // Check for expected columns
        const expectedColumns = ['id', 'meal_id', 'ingredient_id', 'amount_used', 'unit', 'created_at'];
        console.log('\nExpected columns:', expectedColumns);
        
        const missingColumns = expectedColumns.filter(col => !columns.includes(col));
        const extraColumns = columns.filter(col => !expectedColumns.includes(col));
        
        if (missingColumns.length > 0) {
          console.log('❌ Missing columns:', missingColumns);
        }
        if (extraColumns.length > 0) {
          console.log('⚠️  Extra columns:', extraColumns);
        }
        if (missingColumns.length === 0 && extraColumns.length === 0) {
          console.log('✅ Schema matches expectations');
        }
      } else {
        console.log('ℹ️  Meal_ingredients table is empty');
      }
    } catch (err) {
      console.log('❌ Exception accessing meal_ingredients:', err.message);
    }
    console.log('');
    
    // Test the problematic query
    console.log('🔍 TESTING PROBLEMATIC QUERY');
    console.log('----------------------------');
    try {
      const { data: testQuery, error: testError } = await supabase
        .from('meals')
        .select(`
          *,
          meal_ingredients (
            *,
            ingredients (*)
          )
        `)
        .limit(1);
      
      if (testError) {
        console.log('❌ Query error:', testError.message);
        console.log('   Error code:', testError.code);
        console.log('   Details:', testError.details);
      } else {
        console.log('✅ Query successful');
        console.log('   Result structure:', JSON.stringify(testQuery, null, 2));
      }
    } catch (err) {
      console.log('❌ Query exception:', err.message);
    }
    
  } catch (error) {
    console.log('❌ Schema check failed:', error.message);
  }
}

checkSchema(); 