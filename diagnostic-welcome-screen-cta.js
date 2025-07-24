// Comprehensive Welcome Screen CTA Diagnostic
// Run this in the browser console to identify the exact issue

console.log('🔍 Welcome Screen CTA Diagnostic - Comprehensive Analysis')

// Step 1: Check Authentication State
function checkAuthenticationState() {
  console.log('\n🔐 Step 1: Authentication State Check')
  
  // Check if user is authenticated
  const user = window.supabase?.auth?.getUser()
  console.log('  - Supabase client available:', !!window.supabase)
  console.log('  - User object:', user)
  
  // Check localStorage for auth tokens
  const authToken = localStorage.getItem('sb-auth-token')
  console.log('  - Auth token exists:', !!authToken)
  
  // Check for user ID
  if (user?.data?.user) {
    console.log('  - User ID:', user.data.user.id)
    console.log('  - User email:', user.data.user.email)
  } else {
    console.log('  - ❌ No authenticated user found')
  }
}

checkAuthenticationState()

// Step 2: Check Welcome Context State
function checkWelcomeContextState() {
  console.log('\n🎯 Step 2: Welcome Context State Check')
  
  // Try to access welcome context
  try {
    // This will only work if we're in a React component
    const welcomeContext = window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers?.get(1)?.getCurrentFiber()
    console.log('  - React context available:', !!welcomeContext)
  } catch (error) {
    console.log('  - React context check failed (normal in console)')
  }
  
  // Check localStorage for welcome state
  const welcomeKeys = Object.keys(localStorage).filter(key => key.includes('welcome'))
  console.log('  - Welcome-related localStorage keys:', welcomeKeys)
  
  welcomeKeys.forEach(key => {
    const value = localStorage.getItem(key)
    console.log(`    ${key}:`, value)
  })
}

checkWelcomeContextState()

// Step 3: Test Database Access Directly
async function testDatabaseAccess() {
  console.log('\n🗄️ Step 3: Database Access Test')
  
  if (!window.supabase) {
    console.log('  - ❌ Supabase client not available')
    return
  }
  
  try {
    // Test 1: Check if user_preferences table is accessible
    console.log('  - Testing user_preferences table access...')
    const { data: preferencesData, error: preferencesError } = await window.supabase
      .from('user_preferences')
      .select('*')
      .limit(1)
    
    if (preferencesError) {
      console.log('  - ❌ user_preferences access error:', preferencesError.message)
      console.log('  - Error code:', preferencesError.code)
    } else {
      console.log('  - ✅ user_preferences table accessible')
      console.log('  - Records found:', preferencesData?.length || 0)
    }
    
    // Test 2: Try to insert a test record
    console.log('  - Testing user_preferences insert...')
    const testUserId = 'test-diagnostic-user'
    const { data: insertData, error: insertError } = await window.supabase
      .from('user_preferences')
      .upsert({
        user_id: testUserId,
        has_seen_welcome: false,
        welcome_step_completed: 0
      })
      .select()
    
    if (insertError) {
      console.log('  - ❌ user_preferences insert error:', insertError.message)
      console.log('  - Error code:', insertError.code)
    } else {
      console.log('  - ✅ user_preferences insert successful')
    }
    
    // Test 3: Try to update a record
    console.log('  - Testing user_preferences update...')
    const { data: updateData, error: updateError } = await window.supabase
      .from('user_preferences')
      .update({
        has_seen_welcome: true,
        welcome_completed_at: new Date().toISOString()
      })
      .eq('user_id', testUserId)
      .select()
    
    if (updateError) {
      console.log('  - ❌ user_preferences update error:', updateError.message)
      console.log('  - Error code:', updateError.code)
    } else {
      console.log('  - ✅ user_preferences update successful')
    }
    
  } catch (error) {
    console.log('  - ❌ Database test failed:', error.message)
  }
}

testDatabaseAccess()

// Step 4: Test the markWelcomeSeen Function
async function testMarkWelcomeSeen() {
  console.log('\n🎯 Step 4: markWelcomeSeen Function Test')
  
  if (!window.supabase) {
    console.log('  - ❌ Supabase client not available')
    return
  }
  
  try {
    // Get current user
    const { data: { user } } = await window.supabase.auth.getUser()
    
    if (!user) {
      console.log('  - ❌ No authenticated user found')
      return
    }
    
    console.log('  - Testing with user ID:', user.id)
    
    // Test the actual function that the CTA button calls
    const { data, error } = await window.supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        has_seen_welcome: true,
        welcome_completed_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.log('  - ❌ markWelcomeSeen simulation failed:', error.message)
      console.log('  - Error code:', error.code)
      
      // Check if it's an RLS issue
      if (error.code === '42501') {
        console.log('  - 🚨 This is a Row Level Security (RLS) issue!')
        console.log('  - The user is being blocked by RLS policies')
      }
    } else {
      console.log('  - ✅ markWelcomeSeen simulation successful')
      console.log('  - Updated record:', data)
    }
    
  } catch (error) {
    console.log('  - ❌ markWelcomeSeen test failed:', error.message)
  }
}

testMarkWelcomeSeen()

// Step 5: Check RLS Policies
async function checkRLSPolicies() {
  console.log('\n🛡️ Step 5: RLS Policy Check')
  
  if (!window.supabase) {
    console.log('  - ❌ Supabase client not available')
    return
  }
  
  try {
    // Test if we can access user_preferences with current user
    const { data: { user } } = await window.supabase.auth.getUser()
    
    if (!user) {
      console.log('  - ❌ No authenticated user for RLS test')
      return
    }
    
    console.log('  - Testing RLS with user ID:', user.id)
    
    // Test SELECT with user-specific query
    const { data: selectData, error: selectError } = await window.supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (selectError) {
      console.log('  - ❌ SELECT blocked by RLS:', selectError.message)
    } else {
      console.log('  - ✅ SELECT allowed by RLS')
      console.log('  - Current preferences:', selectData)
    }
    
    // Test INSERT with user-specific data
    const { data: insertData, error: insertError } = await window.supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        has_seen_welcome: true,
        welcome_completed_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (insertError) {
      console.log('  - ❌ INSERT blocked by RLS:', insertError.message)
    } else {
      console.log('  - ✅ INSERT allowed by RLS')
      console.log('  - Inserted data:', insertData)
    }
    
  } catch (error) {
    console.log('  - ❌ RLS test failed:', error.message)
  }
}

checkRLSPolicies()

// Step 6: Check Button Event Handlers
function checkButtonEventHandlers() {
  console.log('\n🔘 Step 6: Button Event Handler Check')
  
  // Look for the CTA button
  const ctaButtons = document.querySelectorAll('button')
  console.log('  - Total buttons found:', ctaButtons.length)
  
  // Look for buttons with specific text
  const getStartedButtons = Array.from(ctaButtons).filter(btn => 
    btn.textContent?.toLowerCase().includes('get started') ||
    btn.textContent?.toLowerCase().includes('let\'s get started')
  )
  
  console.log('  - "Get Started" buttons found:', getStartedButtons.length)
  
  getStartedButtons.forEach((btn, index) => {
    console.log(`    Button ${index + 1}:`, {
      text: btn.textContent,
      disabled: btn.disabled,
      onClick: !!btn.onclick,
      hasEventListener: btn.onclick !== null
    })
  })
  
  // Check for any disabled buttons
  const disabledButtons = Array.from(ctaButtons).filter(btn => btn.disabled)
  console.log('  - Disabled buttons found:', disabledButtons.length)
  
  // Check for any error states
  const errorElements = document.querySelectorAll('[class*="error"], [class*="alert"]')
  console.log('  - Error elements found:', errorElements.length)
}

checkButtonEventHandlers()

// Step 7: Check Console for Errors
function checkConsoleErrors() {
  console.log('\n❌ Step 7: Console Error Check')
  
  console.log('  - Check the console above for any errors')
  console.log('  - Look for:')
  console.log('    * Network errors (403, 401, 500)')
  console.log('    * RLS policy violations')
  console.log('    * Authentication errors')
  console.log('    * JavaScript errors')
  console.log('    * React errors')
}

checkConsoleErrors()

// Step 8: Provide Solutions Based on Findings
function provideSolutions() {
  console.log('\n💡 Step 8: Potential Solutions')
  
  console.log('  Based on the diagnostic results, here are likely solutions:')
  console.log('')
  console.log('  🚨 If RLS is blocking access:')
  console.log('    - Run the permissive RLS policy fix')
  console.log('    - Check if user_preferences table has correct policies')
  console.log('')
  console.log('  🔐 If authentication is the issue:')
  console.log('    - Re-authenticate the user')
  console.log('    - Check if user ID is being passed correctly')
  console.log('')
  console.log('  🗄️ If database access is the issue:')
  console.log('    - Check if user_preferences table exists')
  console.log('    - Verify table structure and columns')
  console.log('')
  console.log('  🔘 If button handler is the issue:')
  console.log('    - Check if onClick is properly bound')
  console.log('    - Verify the function is being called')
  console.log('')
  console.log('  📱 If it\'s a UI issue:')
  console.log('    - Check if button is disabled')
  console.log('    - Verify button is clickable')
  console.log('    - Check for CSS issues')
}

provideSolutions()

// Instructions for testing
console.log('\n📋 Testing Instructions:')
console.log('1. Run this diagnostic in the browser console')
console.log('2. Check each step\'s output for issues')
console.log('3. Look for error messages and failed tests')
console.log('4. Note which step reveals the problem')
console.log('5. Apply the appropriate solution based on findings')

console.log('\n🎯 Next Steps:')
console.log('- Run this diagnostic and share the results')
console.log('- Focus on Steps 3, 4, and 5 (database and RLS)')
console.log('- Check for any error messages in the console')
console.log('- Test the CTA button while monitoring the console') 