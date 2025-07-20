#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';

async function addPriceColumn() {
  console.log('🔧 ADDING PRICE COLUMN TO DATABASE');
  console.log('==================================');
  console.log('Timestamp:', new Date().toISOString());
  console.log('');
  
  try {
    const env = loadEnv('development', process.cwd(), '');
    const supabaseUrl = env.VITE_SUPABASE_URL;
    const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.log('❌ Environment variables not found');
      console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'SET' : 'NOT SET');
      console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'NOT SET');
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('📋 Step 1: Checking current schema...');
    
    // First, let's check if the price column already exists
    try {
      const { data: testData, error: testError } = await supabase
        .from('ingredients')
        .select('price')
        .limit(1);
      
      if (testError && testError.message.includes('does not exist')) {
        console.log('✅ Price column does not exist - proceeding with addition');
      } else if (testError) {
        console.log('❌ Error checking schema:', testError.message);
        return;
      } else {
        console.log('⚠️  Price column already exists!');
        console.log('✅ Database schema is already correct');
        return;
      }
    } catch (err) {
      console.log('✅ Price column does not exist - proceeding with addition');
    }
    
    console.log('');
    console.log('📋 Step 2: Adding price column...');
    
    // Add the price column using a raw SQL query
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: `
        ALTER TABLE ingredients 
        ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0.00;
        
        COMMENT ON COLUMN ingredients.price IS 'Total cost of purchasing this ingredient (e.g., $5.99 for 500g flour)';
      `
    });
    
    if (error) {
      console.log('❌ Error adding price column:', error.message);
      console.log('   This might be because the RPC function does not exist');
      console.log('');
      console.log('🔧 Alternative approach: Manual SQL execution required');
      console.log('Please run this SQL in your Supabase SQL Editor:');
      console.log('');
      console.log('ALTER TABLE ingredients ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0.00;');
      console.log('COMMENT ON COLUMN ingredients.price IS \'Total cost of purchasing this ingredient (e.g., $5.99 for 500g flour)\';');
      return;
    }
    
    console.log('✅ Price column added successfully!');
    console.log('');
    
    console.log('📋 Step 3: Verifying the change...');
    
    // Test the new column
    const { data: verifyData, error: verifyError } = await supabase
      .from('ingredients')
      .select('price')
      .limit(1);
    
    if (verifyError) {
      console.log('❌ Error verifying price column:', verifyError.message);
    } else {
      console.log('✅ Price column verified successfully!');
      console.log('   Sample data:', verifyData);
    }
    
    console.log('');
    console.log('🎉 DATABASE UPDATE COMPLETE!');
    console.log('============================');
    console.log('✅ Price column has been added to the ingredients table');
    console.log('✅ Default value: $0.00');
    console.log('✅ Data type: DECIMAL(10,2)');
    console.log('');
    console.log('🚀 Next steps:');
    console.log('1. Refresh your browser');
    console.log('2. The "Database Setup Required" message should disappear');
    console.log('3. You can now add ingredients with prices');
    
  } catch (error) {
    console.log('❌ Script failed:', error.message);
    console.log('');
    console.log('🔧 Manual SQL execution required');
    console.log('Please run this SQL in your Supabase SQL Editor:');
    console.log('');
    console.log('ALTER TABLE ingredients ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0.00;');
    console.log('COMMENT ON COLUMN ingredients.price IS \'Total cost of purchasing this ingredient (e.g., $5.99 for 500g flour)\';');
  }
}

addPriceColumn(); 