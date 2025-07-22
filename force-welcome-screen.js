// Force Welcome Screen Script
// Run this in browser console to force the welcome screen to appear

console.log('🎯 Forcing Welcome Screen...');

// Function to force welcome screen via URL
function forceWelcomeViaURL() {
  console.log('  🌐 Redirecting to welcome page with force parameter...');
  window.location.href = '/welcome?welcome=true&force=true';
}

// Function to clear user preferences and force new user state
async function clearUserPreferences() {
  console.log('  🗑️ Clearing user preferences...');
  
  try {
    const { data: { user }, error } = await window.supabase.auth.getUser();
    if (user) {
      console.log(`  👤 Found user: ${user.email}`);
      
      // Delete user preferences
      const { error: deleteError } = await window.supabase
        .from('user_preferences')
        .delete()
        .eq('user_id', user.id);
      
      if (deleteError) {
        console.log(`  ❌ Error deleting preferences: ${deleteError.message}`);
      } else {
        console.log('  ✅ User preferences cleared');
      }
    } else {
      console.log('  ❌ No authenticated user');
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
  }
}

// Function to set test user mode
function setTestUserMode() {
  console.log('  🧪 Setting test user mode...');
  localStorage.setItem('test-user', 'true');
  console.log('  ✅ Test user mode activated');
}

// Function to clear all storage
function clearAllStorage() {
  console.log('  🧹 Clearing all storage...');
  
  // Clear localStorage
  localStorage.clear();
  console.log('  ✅ localStorage cleared');
  
  // Clear sessionStorage
  sessionStorage.clear();
  console.log('  ✅ sessionStorage cleared');
  
  // Clear Supabase cookies
  const cookies = document.cookie.split(';');
  cookies.forEach(cookie => {
    const [name] = cookie.trim().split('=');
    if (name && (name.includes('supabase') || name.includes('sb-'))) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      console.log(`  ✅ Cleared cookie: ${name}`);
    }
  });
}

// Function to force complete reset
async function forceCompleteReset() {
  console.log('🚀 Forcing complete welcome screen reset...\n');
  
  // Clear all storage
  clearAllStorage();
  
  // Clear user preferences
  await clearUserPreferences();
  
  // Set test user mode
  setTestUserMode();
  
  // Force welcome via URL
  forceWelcomeViaURL();
}

// Function to just force welcome screen (minimal approach)
function forceWelcomeMinimal() {
  console.log('🎯 Minimal welcome screen force...');
  forceWelcomeViaURL();
}

// Export functions
window.forceWelcome = {
  complete: forceCompleteReset,
  minimal: forceWelcomeMinimal,
  clearStorage: clearAllStorage,
  clearPreferences: clearUserPreferences,
  setTestUser: setTestUserMode
};

console.log('📋 Available functions:');
console.log('  - forceWelcome.complete() - Full reset and force welcome');
console.log('  - forceWelcome.minimal() - Just force welcome via URL');
console.log('  - forceWelcome.clearStorage() - Clear all storage');
console.log('  - forceWelcome.clearPreferences() - Clear user preferences');
console.log('  - forceWelcome.setTestUser() - Set test user mode');

// Auto-run minimal force
console.log('\n🎯 Running minimal welcome force...');
forceWelcomeMinimal(); 