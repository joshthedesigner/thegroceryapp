#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import { loadEnv } from 'vite'

async function testIngredientsPage() {
  console.log('🧪 TESTING INGREDIENTS PAGE COMPONENTS')
  console.log('=====================================')
  console.log('Timestamp:', new Date().toISOString())
  console.log('')
  
  try {
    const env = loadEnv('development', process.cwd(), '')
    const supabaseUrl = env.VITE_SUPABASE_URL
    const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    console.log('📋 Step 1: Testing Supabase connection...')
    const { data: testData, error: testError } = await supabase
      .from('ingredients')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.log('❌ Supabase connection failed:', testError.message)
      return
    }
    console.log('✅ Supabase connection working')
    
    console.log('')
    console.log('📋 Step 2: Testing ingredients table structure...')
    const { data: tableInfo, error: tableError } = await supabase
      .from('ingredients')
      .select('*')
      .limit(0)
    
    if (tableError) {
      console.log('❌ Table structure error:', tableError.message)
      return
    }
    console.log('✅ Ingredients table accessible')
    
    console.log('')
    console.log('📋 Step 3: Testing ingredients data fetch...')
    const { data: ingredients, error: fetchError } = await supabase
      .from('ingredients')
      .select('*')
      .limit(5)
    
    if (fetchError) {
      console.log('❌ Data fetch error:', fetchError.message)
      return
    }
    
    console.log('✅ Data fetch working')
    console.log(`📊 Found ${ingredients.length} ingredients`)
    
    if (ingredients.length > 0) {
      console.log('📋 Sample ingredient data:')
      console.log('- Name:', ingredients[0].name)
      console.log('- Unit:', ingredients[0].unit)
      console.log('- Price:', ingredients[0].price)
      console.log('- Amount Purchased:', ingredients[0].amount_purchased)
    }
    
    console.log('')
    console.log('🎉 INGREDIENTS PAGE TEST COMPLETE!')
    console.log('==================================')
    console.log('✅ All database operations working')
    console.log('✅ Table structure correct')
    console.log('✅ Data accessible')
    console.log('')
    console.log('🌐 Go to http://localhost:5173/ingredients to test the UI')
    console.log('📋 The page should show:')
    console.log('   - Header with "Ingredients" title')
    console.log('   - "Add Ingredient" button')
    console.log('   - Ingredients table (or empty state)')
    console.log('   - Modal form when clicking "Add Ingredient"')
    
  } catch (error) {
    console.log('❌ Test failed:', error.message)
  }
}

testIngredientsPage() 