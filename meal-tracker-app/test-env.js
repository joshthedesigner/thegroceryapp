#!/usr/bin/env node

import { loadEnv } from 'vite';

async function testEnv() {
  console.log('🔍 Testing Environment Variables...');
  console.log('===================================');
  
  try {
    // Load environment variables like Vite does
    const env = loadEnv('development', process.cwd(), '');
    
    console.log('\n📋 Environment Variables:');
    console.log('VITE_SUPABASE_URL:', env.VITE_SUPABASE_URL || 'NOT SET');
    console.log('VITE_SUPABASE_ANON_KEY:', env.VITE_SUPABASE_ANON_KEY ? 'SET (length: ' + env.VITE_SUPABASE_ANON_KEY.length + ')' : 'NOT SET');
    
    if (env.VITE_SUPABASE_URL && env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co') {
      console.log('\n✅ Environment variables are loaded correctly!');
      console.log('🎯 Supabase URL:', env.VITE_SUPABASE_URL);
    } else {
      console.log('\n❌ Environment variables are not loaded correctly');
      console.log('💡 Make sure .env.local exists in the meal-tracker-app directory');
    }
    
    // Test the actual file content
    console.log('\n📁 Checking .env.local file...');
    const fs = await import('fs');
    const path = await import('path');
    
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      console.log('✅ .env.local file exists');
      console.log('📄 Content:');
      console.log(content);
    } else {
      console.log('❌ .env.local file not found');
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testEnv(); 