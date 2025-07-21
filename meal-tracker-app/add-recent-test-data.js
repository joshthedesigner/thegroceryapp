#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';
import dayjs from 'dayjs';

async function addRecentTestData() {
  console.log('🔧 ADDING RECENT TEST DATA FOR TIME FILTERING');
  console.log('=============================================');
  console.log('Timestamp:', new Date().toISOString());
  console.log('');
  
  try {
    const env = loadEnv('development', process.cwd(), '');
    const supabaseUrl = env.VITE_SUPABASE_URL;
    const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('📋 Step 1: Check if we can connect...');
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
    
    console.log('📋 Step 2: Add test ingredients with recent dates...');
    
    // Create test data with dates spread across different time periods
    const now = dayjs();
    const testIngredients = [
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        name: 'Chicken Breast (Today)',
        unit: 'pieces',
        amount_purchased: 4,
        price: 20.00,
        purchase_date: now.format('YYYY-MM-DD'),
        amount_used: 2,
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      },
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        name: 'Rice (3 days ago)',
        unit: 'cups',
        amount_purchased: 10,
        price: 5.00,
        purchase_date: now.subtract(3, 'day').format('YYYY-MM-DD'),
        amount_used: 1.5,
        created_at: now.subtract(3, 'day').toISOString(),
        updated_at: now.subtract(3, 'day').toISOString()
      },
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        name: 'Broccoli (1 week ago)',
        unit: 'heads',
        amount_purchased: 3,
        price: 6.00,
        purchase_date: now.subtract(7, 'day').format('YYYY-MM-DD'),
        amount_used: 1,
        created_at: now.subtract(7, 'day').toISOString(),
        updated_at: now.subtract(7, 'day').toISOString()
      },
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        name: 'Pasta (2 weeks ago)',
        unit: 'boxes',
        amount_purchased: 2,
        price: 8.00,
        purchase_date: now.subtract(14, 'day').format('YYYY-MM-DD'),
        amount_used: 1,
        created_at: now.subtract(14, 'day').toISOString(),
        updated_at: now.subtract(14, 'day').toISOString()
      },
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        name: 'Tomatoes (1 month ago)',
        unit: 'pounds',
        amount_purchased: 5,
        price: 12.00,
        purchase_date: now.subtract(30, 'day').format('YYYY-MM-DD'),
        amount_used: 3,
        created_at: now.subtract(30, 'day').toISOString(),
        updated_at: now.subtract(30, 'day').toISOString()
      },
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        name: 'Olive Oil (6 months ago)',
        unit: 'bottles',
        amount_purchased: 1,
        price: 15.00,
        purchase_date: now.subtract(6, 'month').format('YYYY-MM-DD'),
        amount_used: 0.3,
        created_at: now.subtract(6, 'month').toISOString(),
        updated_at: now.subtract(6, 'month').toISOString()
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
      console.log(`  - ${ing.name}: ${ing.amount_used}/${ing.amount_purchased} ${ing.unit} (${ing.purchase_date})`);
    });
    
    console.log('');
    console.log('📋 Step 3: Add test meals with recent dates...');
    
    const testMeals = [
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        meal_name: 'Chicken Stir Fry (Today)',
        date_cooked: now.format('YYYY-MM-DD'),
        total_cost: 12.50,
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      },
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        meal_name: 'Rice Bowl (2 days ago)',
        date_cooked: now.subtract(2, 'day').format('YYYY-MM-DD'),
        total_cost: 8.75,
        created_at: now.subtract(2, 'day').toISOString(),
        updated_at: now.subtract(2, 'day').toISOString()
      },
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        meal_name: 'Pasta Dinner (1 week ago)',
        date_cooked: now.subtract(7, 'day').format('YYYY-MM-DD'),
        total_cost: 10.25,
        created_at: now.subtract(7, 'day').toISOString(),
        updated_at: now.subtract(7, 'day').toISOString()
      },
      {
        user_id: '00000000-0000-0000-0000-000000000001',
        meal_name: 'Tomato Soup (3 weeks ago)',
        date_cooked: now.subtract(21, 'day').format('YYYY-MM-DD'),
        total_cost: 6.50,
        created_at: now.subtract(21, 'day').toISOString(),
        updated_at: now.subtract(21, 'day').toISOString()
      }
    ];
    
    const { data: meals, error: mealsError } = await supabase
      .from('meals')
      .insert(testMeals)
      .select();
    
    if (mealsError) {
      console.log('❌ Could not add test meals:', mealsError.message);
      return;
    }
    
    console.log('✅ Added test meals:');
    meals.forEach(meal => {
      console.log(`  - ${meal.meal_name}: $${meal.total_cost} (${meal.date_cooked})`);
    });
    
    console.log('');
    console.log('🎉 TEST DATA ADDED SUCCESSFULLY!');
    console.log('================================');
    console.log('Now you can test the time filtering:');
    console.log('- Week view: Should show 3 ingredients and 3 meals');
    console.log('- Month view: Should show 5 ingredients and 4 meals');
    console.log('- Year view: Should show all 6 ingredients and 4 meals');
    console.log('- All Time view: Should show all data');
    console.log('');
    console.log('Go to your app and test the time range toggles!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addRecentTestData(); 