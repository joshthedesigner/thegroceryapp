// Debug Welcome Screen Script
// Run this in browser console to diagnose welcome screen issues

console.log('🔍 Debugging Welcome Screen Issues...');

// Function to check current user state
async function checkUserState() {
  console.log('\n👤 User State Check:');
  
  try {
    // Check if Supabase is available
    if (typeof window.supabase !== 'undefined') {
      const { data: { user }, error } = await window.supabase.auth.getUser();
      if (user) {
        console.log(`  ✅ Authenticated user: ${user.email}`);
        console.log(`  User ID: ${user.id}`);
        console.log(`  Provider: ${user.app_metadata?.provider}`);
        return user;
      } else {
        console.log('  ❌ No authenticated user');
        return null;
      }
    } else {
      console.log('  ❌ Supabase client not available');
      return null;
    }
  } catch (error) {
    console.log(`  ❌ Auth check error: ${error.message}`);
    return null;
  }
}

// Function to check user preferences in database
async function checkUserPreferences(userId) {
  console.log('\n📊 Database Preferences Check:');
  
  if (!userId) {
    console.log('  ❌ No user ID provided');
    return null;
  }
  
  try {
    const { data, error } = await window.supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('  ✅ No user preferences found (user is new)');
        console.log('  Expected: has_seen_welcome should be false');
        return {
          user_id: userId,
          has_seen_welcome: false,
          welcome_completed_at: null,
          welcome_step_completed: 0
        };
      } else {
        console.log(`  ❌ Database error: ${error.message}`);
        return null;
      }
    }
    
    console.log('  📊 User preferences found:');
    console.log(`    has_seen_welcome: ${data.has_seen_welcome}`);
    console.log(`    welcome_completed_at: ${data.welcome_completed_at}`);
    console.log(`    welcome_step_completed: ${data.welcome_step_completed}`);
    return data;
  } catch (error) {
    console.log(`  ❌ Preferences check error: ${error.message}`);
    return null;
  }
}

// Function to check localStorage state
function checkLocalStorage() {
  console.log('\n📦 localStorage Check:');
  
  const testUser = localStorage.getItem('test-user');
  console.log(`  test-user: ${testUser}`);
  
  // Check for welcome-related items
  const welcomeItems = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('welcome_') || key.includes('welcome'))) {
      welcomeItems.push(key);
    }
  }
  console.log(`  welcome-related items: ${welcomeItems.length}`);
  welcomeItems.forEach(key => {
    console.log(`    ${key}: ${localStorage.getItem(key)}`);
  });
}

// Function to check current URL and routing
function checkRouting() {
  console.log('\n🌐 Routing Check:');
  console.log(`  Current URL: ${window.location.href}`);
  console.log(`  Pathname: ${window.location.pathname}`);
  console.log(`  Search params: ${window.location.search}`);
  
  const welcomeParam = new URLSearchParams(window.location.search).get('welcome');
  console.log(`  Welcome parameter: ${welcomeParam}`);
  
  const isWelcomePage = window.location.pathname === '/welcome';
  console.log(`  On welcome page: ${isWelcomePage}`);
}

// Function to check React component state
function checkReactState() {
  console.log('\n⚛️ React State Check:');
  
  // Try to access welcome context if available
  if (window.welcomeContext) {
    console.log('  Welcome context available:', window.welcomeContext);
  } else {
    console.log('  ❌ Welcome context not accessible from console');
  }
  
  // Check if we can find welcome-related elements
  const welcomeElements = document.querySelectorAll('[data-testid*="welcome"], [class*="welcome"], [id*="welcome"]');
  console.log(`  Welcome-related DOM elements: ${welcomeElements.length}`);
}

// Function to simulate welcome screen logic
async function simulateWelcomeLogic(userId) {
  console.log('\n🧮 Welcome Logic Simulation:');
  
  if (!userId) {
    console.log('  ❌ No user ID for simulation');
    return;
  }
  
  try {
    // Simulate the hasUserSeenWelcome function
    const preferences = await checkUserPreferences(userId);
    const hasSeenWelcome = preferences?.has_seen_welcome || false;
    
    console.log(`  Simulated hasSeenWelcome: ${hasSeenWelcome}`);
    console.log(`  Should show welcome: ${!hasSeenWelcome}`);
    
    if (!hasSeenWelcome) {
      console.log('  ✅ User should see welcome screen');
    } else {
      console.log('  ❌ User has already seen welcome screen');
    }
    
    return !hasSeenWelcome;
  } catch (error) {
    console.log(`  ❌ Simulation error: ${error.message}`);
    return false;
  }
}

// Function to provide recommendations
function provideRecommendations(userId, shouldShowWelcome) {
  console.log('\n💡 Recommendations:');
  
  if (!userId) {
    console.log('  ❌ No authenticated user - sign in first');
    return;
  }
  
  if (shouldShowWelcome) {
    console.log('  ✅ User should see welcome screen');
    console.log('  🔧 If welcome screen is not showing:');
    console.log('     1. Check browser console for errors');
    console.log('     2. Verify user_preferences table exists');
    console.log('     3. Try force welcome: ?welcome=true');
    console.log('     4. Clear browser cache and reload');
  } else {
    console.log('  ❌ User has already seen welcome screen');
    console.log('  🔧 To reset welcome screen:');
    console.log('     1. Run reset-user-data.sql in Supabase');
    console.log('     2. Clear localStorage: clearUserStorage.clearAll()');
    console.log('     3. Sign out and sign back in');
  }
}

// Main debug function
async function debugWelcomeScreen() {
  console.log('🚀 Starting comprehensive welcome screen debug...\n');
  
  // Check user authentication
  const user = await checkUserState();
  
  // Check localStorage
  checkLocalStorage();
  
  // Check routing
  checkRouting();
  
  // Check React state
  checkReactState();
  
  // Simulate welcome logic
  const shouldShowWelcome = await simulateWelcomeLogic(user?.id);
  
  // Provide recommendations
  provideRecommendations(user?.id, shouldShowWelcome);
  
  console.log('\n✅ Debug complete!');
  console.log('\n📋 Quick Actions:');
  console.log('  - Force welcome: window.location.href = "/welcome?welcome=true"');
  console.log('  - Check storage: clearUserStorage.checkState()');
  console.log('  - Clear storage: clearUserStorage.clearAll()');
}

// Export for use
window.debugWelcomeScreen = debugWelcomeScreen;

// Auto-run debug
debugWelcomeScreen(); 