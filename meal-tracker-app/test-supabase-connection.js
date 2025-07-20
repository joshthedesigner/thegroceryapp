#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...');
  console.log('==================================');
  
  try {
    // Load environment variables like Vite does
    const env = loadEnv('development', process.cwd(), '');
    
    console.log('\n📋 Using Environment Variables:');
    console.log('URL:', env.VITE_SUPABASE_URL);
    console.log('Key length:', env.VITE_SUPABASE_ANON_KEY ? env.VITE_SUPABASE_ANON_KEY.length : 'NOT SET');
    
    // Create Supabase client with the same logic as the app
    const supabaseUrl = env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';
    
    console.log('\n🔗 Creating Supabase client with:');
    console.log('URL:', supabaseUrl);
    console.log('Key:', supabaseAnonKey.substring(0, 20) + '...');
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test connection
    console.log('\n🧪 Testing connection...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('❌ Connection error:', error.message);
    } else {
      console.log('✅ Connection successful!');
      console.log('📊 Session data:', data.session ? 'Active session' : 'No session');
    }
    
    // Test a simple query
    console.log('\n📋 Testing database query...');
    const { data: testData, error: testError } = await supabase
      .from('ingredients')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.log('❌ Query error:', testError.message);
    } else {
      console.log('✅ Database query successful!');
    }
    
    console.log('\n🎉 Test completed!');
    console.log('💡 If you see "placeholder.supabase.co" in the URL above, the environment variables are not being loaded correctly.');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testSupabaseConnection(); 