// Diagnostic script for RLS (Row Level Security) issues
// Run this in the browser console to understand RLS problems

console.log('🔍 Diagnostic: RLS (Row Level Security) Issues Investigation...')

// Check current authentication state
function checkAuthState() {
  console.log('\n🔐 Checking Authentication State...')
  
  // Check if we have a user session
  const hasUser = window.supabase?.auth?.getUser()
  console.log('  - Supabase client available:', !!window.supabase)
  console.log('  - User session check:', hasUser ? 'Has user' : 'No user')
  
  // Check localStorage for auth tokens
  const authToken = localStorage.getItem('sb-auth-token')
  console.log('  - Auth token in localStorage:', !!authToken)
  
  // Check for any auth-related errors in console
  console.log('  - Check console for auth errors above')
}

checkAuthState()

// Check database access patterns
function checkDatabaseAccess() {
  console.log('\n🗄️ Checking Database Access Patterns...')
  
  // Test basic table access
  const testQueries = [
    'ingredients',
    'meals', 
    'meal_ingredients',
    'user_preferences'
  ]
  
  testQueries.forEach(table => {
    console.log(`  - Testing access to ${table} table...`)
    // This will be tested in the browser console
  })
  
  console.log('  - Run these queries in console:')
  console.log('    window.supabase.from("ingredients").select("*").limit(1)')
  console.log('    window.supabase.from("meals").select("*").limit(1)')
  console.log('    window.supabase.from("user_preferences").select("*").limit(1)')
}

checkDatabaseAccess()

// Check for common RLS issues
function checkCommonRLSIssues() {
  console.log('\n🚨 Common RLS Issues to Check...')
  
  console.log('  1. Missing RLS Policies:')
  console.log('     - Tables have RLS enabled but no policies')
  console.log('     - Policies exist but are too restrictive')
  console.log('     - Policies reference non-existent columns')
  
  console.log('  2. Authentication Issues:')
  console.log('     - auth.uid() returns null')
  console.log('     - User not properly authenticated')
  console.log('     - JWT token expired or invalid')
  
  console.log('  3. Policy Logic Issues:')
  console.log('     - Policies use wrong user_id column')
  console.log('     - Policies check wrong conditions')
  console.log('     - Policies missing WITH CHECK clauses')
  
  console.log('  4. Table Structure Issues:')
  console.log('     - user_id column missing or wrong type')
  console.log('     - Foreign key constraints broken')
  console.log('     - Indexes missing on user_id columns')
}

checkCommonRLSIssues()

// Check specific error patterns
function checkErrorPatterns() {
  console.log('\n❌ Common RLS Error Patterns...')
  
  console.log('  Error: "new row violates row-level security policy"')
  console.log('    → INSERT/UPDATE blocked by RLS policy')
  console.log('    → Check WITH CHECK clause in policies')
  
  console.log('  Error: "relation does not exist"')
  console.log('    → Table missing or wrong schema')
  console.log('    → Check table names and schema')
  
  console.log('  Error: "permission denied for table"')
  console.log('    → RLS enabled but no policies')
  console.log('    → Or policies too restrictive')
  
  console.log('  Error: "column does not exist"')
  console.log('    → Policy references wrong column')
  console.log('    → Check user_id column names')
  
  console.log('  Silent failures (no data returned)')
  console.log('    → RLS policy blocks SELECT')
  console.log('    → Check USING clause in policies')
}

checkErrorPatterns()

// Check current app state for RLS symptoms
function checkAppStateForRLS() {
  console.log('\n🔍 Checking App State for RLS Symptoms...')
  
  // Check if data is loading but empty
  const loadingStates = document.querySelectorAll('[class*="loading"], [class*="spinner"]')
  console.log('  - Loading states found:', loadingStates.length)
  
  // Check for empty data states
  const emptyStates = document.querySelectorAll('[class*="empty"], [class*="no-data"]')
  console.log('  - Empty state indicators:', emptyStates.length)
  
  // Check for error messages
  const errorMessages = document.querySelectorAll('[class*="error"], [class*="alert"]')
  console.log('  - Error message elements:', errorMessages.length)
  
  // Check console for specific errors
  console.log('  - Check console above for:')
  console.log('    * "row-level security policy" errors')
  console.log('    * "permission denied" errors')
  console.log('    * "relation does not exist" errors')
  console.log('    * Network errors (403, 401)')
}

checkAppStateForRLS()

// Provide RLS testing steps
function provideRLSTestingSteps() {
  console.log('\n🧪 RLS Testing Steps...')
  
  console.log('  1. Test with RLS Disabled:')
  console.log('     - Temporarily disable RLS on tables')
  console.log('     - See if app works without RLS')
  console.log('     - If yes, RLS policies are the issue')
  
  console.log('  2. Test with Permissive Policies:')
  console.log('     - Create policies that allow all operations')
  console.log('     - Example: FOR ALL USING (true) WITH CHECK (true)')
  console.log('     - See if app works with permissive policies')
  
  console.log('  3. Test Authentication:')
  console.log('     - Check if user is properly authenticated')
  console.log('     - Verify auth.uid() returns valid user ID')
  console.log('     - Check JWT token validity')
  
  console.log('  4. Test Table Structure:')
  console.log('     - Verify user_id columns exist')
  console.log('     - Check foreign key relationships')
  console.log('     - Ensure indexes are created')
}

provideRLSTestingSteps()

// Check if RLS is safe to implement
function checkRLSSafety() {
  console.log('\n🛡️ RLS Safety Assessment...')
  
  console.log('  ✅ Safe RLS Implementation:')
  console.log('    - User authentication is working')
  console.log('    - Tables have user_id columns')
  console.log('    - Policies reference correct columns')
  console.log('    - Policies allow all necessary operations')
  console.log('    - Test with permissive policies first')
  
  console.log('  ⚠️ RLS Implementation Risks:')
  console.log('    - Breaking existing functionality')
  console.log('    - Blocking legitimate user access')
  console.log('    - Complex policy logic errors')
  console.log('    - Performance impact on queries')
  
  console.log('  🚨 When RLS Breaks Apps:')
  console.log('    - No policies created after enabling RLS')
  console.log('    - Policies too restrictive')
  console.log('    - Authentication not working')
  console.log('    - Wrong column references in policies')
  console.log('    - Missing WITH CHECK clauses for INSERT/UPDATE')
}

checkRLSSafety()

// Provide specific recommendations
function provideRecommendations() {
  console.log('\n💡 RLS Implementation Recommendations...')
  
  console.log('  1. Start with Permissive Policies:')
  console.log('     CREATE POLICY "Allow all" ON table_name FOR ALL USING (true) WITH CHECK (true);')
  
  console.log('  2. Test Each Table Individually:')
  console.log('     - Enable RLS on one table at a time')
  console.log('     - Test all CRUD operations')
  console.log('     - Verify data access works')
  
  console.log('  3. Use Proper Policy Structure:')
  console.log('     - Separate policies for SELECT, INSERT, UPDATE, DELETE')
  console.log('     - Use auth.uid() = user_id for user isolation')
  console.log('     - Include both USING and WITH CHECK clauses')
  
  console.log('  4. Monitor and Debug:')
  console.log('     - Check Supabase logs for policy violations')
  console.log('     - Use browser console to test queries')
  console.log('     - Verify authentication state')
  
  console.log('  5. Gradual Implementation:')
  console.log('     - Start with permissive policies')
  console.log('     - Gradually restrict access')
  console.log('     - Test thoroughly at each step')
}

provideRecommendations()

// Instructions for testing
console.log('\n📋 Testing Instructions:')
console.log('1. Run this diagnostic in browser console')
console.log('2. Check for RLS-related errors in console')
console.log('3. Test database access with window.supabase.from("table").select("*")')
console.log('4. Verify authentication state')
console.log('5. Check if app works with RLS disabled')
console.log('6. Implement RLS gradually with permissive policies first')

console.log('\n🎯 Next Steps:')
console.log('- Check console for specific error messages')
console.log('- Test database access patterns')
console.log('- Verify authentication is working')
console.log('- Consider starting with permissive RLS policies')
console.log('- Monitor app functionality after RLS changes') 