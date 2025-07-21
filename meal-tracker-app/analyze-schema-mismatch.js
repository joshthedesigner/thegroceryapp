#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import { loadEnv } from 'vite'

async function analyzeSchemaMismatch() {
  console.log('🔍 ANALYZING DATABASE SCHEMA MISMATCH')
  console.log('=====================================')
  console.log('Timestamp:', new Date().toISOString())
  console.log('')
  
  try {
    const env = loadEnv('development', process.cwd(), '')
    const supabaseUrl = env.VITE_SUPABASE_URL
    const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    console.log('📋 Step 1: Checking current ingredients table schema...')
    
    // Get table information
    const { data: tableInfo, error: tableError } = await supabase
      .from('ingredients')
      .select('*')
      .limit(0)
    
    if (tableError) {
      console.log('❌ Table access error:', tableError.message)
      return
    }
    
    console.log('✅ Table accessible')
    
    console.log('')
    console.log('📋 Step 2: Getting detailed column information...')
    
    // Query information_schema to get column details
    const { data: columns, error: columnsError } = await supabase
      .rpc('exec_sql', {
        sql_query: `
          SELECT 
            column_name, 
            data_type, 
            is_nullable,
            column_default
          FROM information_schema.columns 
          WHERE table_name = 'ingredients' 
          ORDER BY ordinal_position
        `
      })
    
    if (columnsError) {
      console.log('❌ Column query error:', columnsError.message)
      console.log('📋 Trying alternative method...')
      
      // Try a different approach to get schema info
      const { data: sampleData, error: sampleError } = await supabase
        .from('ingredients')
        .select('*')
        .limit(1)
      
      if (sampleError) {
        console.log('❌ Sample data error:', sampleError.message)
        return
      }
      
      console.log('📋 Available columns (from sample query):')
      if (sampleData && sampleData.length > 0) {
        Object.keys(sampleData[0]).forEach(key => {
          console.log(`  - ${key}`)
        })
      } else {
        console.log('  (No data in table to determine columns)')
      }
    } else {
      console.log('📋 Current table columns:')
      columns.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`)
      })
    }
    
    console.log('')
    console.log('📋 Step 3: Application expected columns (from code analysis)...')
    console.log('  - id (primary key)')
    console.log('  - name (ingredient name)')
    console.log('  - unit (measurement unit)')
    console.log('  - amount_purchased (quantity purchased)')
    console.log('  - price (cost)')
    console.log('  - purchase_date (when purchased)')
    console.log('  - amount_used (quantity used in meals)')
    console.log('  - amount_remaining (calculated field)')
    console.log('  - user_id (foreign key)')
    console.log('  - created_at (timestamp)')
    console.log('  - updated_at (timestamp)')
    
    console.log('')
    console.log('📋 Step 4: Testing specific column access...')
    
    // Test each expected column
    const expectedColumns = [
      'id', 'name', 'unit', 'amount_purchased', 'price', 
      'purchase_date', 'amount_used', 'amount_remaining', 
      'user_id', 'created_at', 'updated_at'
    ]
    
    for (const column of expectedColumns) {
      try {
        const { data, error } = await supabase
          .from('ingredients')
          .select(column)
          .limit(1)
        
        if (error) {
          console.log(`❌ Column '${column}': ${error.message}`)
        } else {
          console.log(`✅ Column '${column}': EXISTS`)
        }
      } catch (err) {
        console.log(`❌ Column '${column}': ${err.message}`)
      }
    }
    
    console.log('')
    console.log('🎯 ANALYSIS COMPLETE')
    console.log('==================')
    console.log('The error suggests that the database schema is missing')
    console.log('some columns that the application expects.')
    console.log('')
    console.log('Next steps:')
    console.log('1. Identify which columns are missing')
    console.log('2. Create SQL to add missing columns')
    console.log('3. Execute the schema update')
    
  } catch (error) {
    console.log('❌ Analysis failed:', error.message)
  }
}

analyzeSchemaMismatch() 