#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { loadEnv } from 'vite';

async function clearSession() {
  console.log('🧹 Clearing Authentication Session...');
  console.log('=====================================');
  
  try {
    // Load environment variables
    const env = loadEnv('development', process.cwd(), '');
    
    const supabaseUrl = env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Check current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Session error:', sessionError.message);
    } else if (session) {
      console.log('✅ Found active session, signing out...');
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        console.log('❌ Sign out error:', signOutError.message);
      } else {
        console.log('✅ Successfully signed out');
      }
    } else {
      console.log('✅ No active session found');
    }
    
    // Clear local storage (this would be done in the browser)
    console.log('\n💡 To clear browser session:');
    console.log('1. Open browser developer tools (F12)');
    console.log('2. Go to Application/Storage tab');
    console.log('3. Clear Local Storage and Session Storage');
    console.log('4. Or open the app in an incognito window');
    
  } catch (error) {
    console.log('❌ Clear session failed:', error.message);
  }
}

clearSession(); 