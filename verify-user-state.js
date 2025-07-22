// Verify User State Script
// Run this in browser console to check current user state

console.log('🔍 Verifying user state for jogold@linkedin.com...');

// Function to check localStorage
function checkLocalStorage() {
  console.log('\n📦 localStorage check:');
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

// Function to check sessionStorage
function checkSessionStorage() {
  console.log('\n📦 sessionStorage check:');
  console.log(`  Total items: ${sessionStorage.length}`);
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    console.log(`    ${key}: ${sessionStorage.getItem(key)}`);
  }
}

// Function to check cookies
function checkCookies() {
  console.log('\n🍪 Cookies check:');
  const cookies = document.cookie.split(';');
  const supabaseCookies = cookies.filter(cookie => {
    const [name] = cookie.trim().split('=');
    return name && (name.includes('supabase') || name.includes('sb-'));
  });
  console.log(`  Supabase cookies: ${supabaseCookies.length}`);
  supabaseCookies.forEach(cookie => {
    console.log(`    ${cookie.trim()}`);
  });
}

// Function to check current URL and page state
function checkPageState() {
  console.log('\n🌐 Page state check:');
  console.log(`  Current URL: ${window.location.href}`);
  console.log(`  Pathname: ${window.location.pathname}`);
  console.log(`  Search params: ${window.location.search}`);
  
  // Check if we're on welcome page
  const isWelcomePage = window.location.pathname === '/welcome';
  console.log(`  On welcome page: ${isWelcomePage}`);
  
  // Check for welcome parameter
  const welcomeParam = new URLSearchParams(window.location.search).get('welcome');
  console.log(`  Welcome parameter: ${welcomeParam}`);
}

// Function to check if user is authenticated
async function checkAuthentication() {
  console.log('\n🔐 Authentication check:');
  
  try {
    // Check if Supabase is available
    if (typeof window.supabase !== 'undefined') {
      const { data: { user }, error } = await window.supabase.auth.getUser();
      if (user) {
        console.log(`  Authenticated user: ${user.email}`);
        console.log(`  User ID: ${user.id}`);
        console.log(`  Provider: ${user.app_metadata?.provider}`);
      } else {
        console.log('  No authenticated user');
      }
      if (error) {
        console.log(`  Auth error: ${error.message}`);
      }
    } else {
      console.log('  Supabase client not available');
    }
  } catch (error) {
    console.log(`  Auth check error: ${error.message}`);
  }
}

// Function to provide recommendations
function provideRecommendations() {
  console.log('\n💡 Recommendations:');
  
  const testUser = localStorage.getItem('test-user');
  if (testUser === 'true') {
    console.log('  ⚠️  Test user mode is active - clear localStorage');
  }
  
  const welcomeParam = new URLSearchParams(window.location.search).get('welcome');
  if (welcomeParam === 'true') {
    console.log('  ⚠️  Welcome parameter is set - this forces welcome screen');
  }
  
  if (window.location.pathname === '/welcome') {
    console.log('  ✅ Currently on welcome page');
  }
  
  console.log('\n  To reset user state:');
  console.log('    1. Run: clearUserStorage.clearAll()');
  console.log('    2. Execute reset-user-data.sql in Supabase');
  console.log('    3. Sign out and sign back in');
}

// Main verification function
async function verifyUserState() {
  console.log('🔍 Starting user state verification...\n');
  
  checkLocalStorage();
  checkSessionStorage();
  checkCookies();
  checkPageState();
  await checkAuthentication();
  provideRecommendations();
  
  console.log('\n✅ Verification complete!');
}

// Export for use
window.verifyUserState = verifyUserState;

// Auto-run verification
verifyUserState(); 