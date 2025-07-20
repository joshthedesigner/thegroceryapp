#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

async function debugUser() {
  console.log('🔍 Debugging User Authentication...');
  console.log('====================================');
  
  try {
    // Create Supabase client with anon key (not service role)
    const supabaseUrl = 'https://jdoitxsoquqaudygnbmh.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impkb2l0eHNvcXVxYXVkeWduYm1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwNDkyODMsImV4cCI6MjA2ODYyNTI4M30.aGXcN99QlWp52AC0QNgKH2ILjHfQkvUmrrBZmozCGD8';
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Session error:', sessionError.message);
    } else if (session) {
      console.log('✅ User is authenticated');
      console.log('👤 User ID:', session.user.id);
      console.log('📧 Email:', session.user.email);
      console.log('🔑 Provider:', session.user.app_metadata?.provider);
    } else {
      console.log('❌ No active session - user needs to log in');
    }
    
    // Test ingredients query with a dummy user ID
    console.log('\n📋 Testing ingredients query...');
    const testUserId = '00000000-0000-0000-0000-000000000000'; // Dummy UUID
    
    const { data: ingredients, error: ingredientsError } = await supabase
      .from('ingredients')
      .select('*')
      .eq('user_id', testUserId)
      .limit(1);
    
    if (ingredientsError) {
      console.log('❌ Ingredients query error:', ingredientsError.message);
    } else {
      console.log('✅ Ingredients query successful (no data expected for dummy user)');
    }
    
    console.log('\n💡 Solution:');
    console.log('1. Make sure you are logged in to the app');
    console.log('2. Check that the .env.local file has the correct VITE_SUPABASE_ANON_KEY');
    console.log('3. The anon key should be different from the service role key');
    
  } catch (error) {
    console.log('❌ Debug failed:', error.message);
  }
}

debugUser(); 