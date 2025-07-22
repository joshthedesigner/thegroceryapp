// Quick Welcome Screen Fix
// Run this in browser console to immediately fix the welcome screen

console.log('🚀 Quick Welcome Screen Fix...');

// Function to force welcome screen immediately
function forceWelcomeNow() {
  console.log('  🎯 Forcing welcome screen...');
  
  // Clear any localStorage that might interfere
  localStorage.removeItem('test-user');
  
  // Clear any welcome-related localStorage
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('welcome_') || key.includes('welcome'))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  console.log(`  ✅ Cleared ${keysToRemove.length} localStorage items`);
  
  // Force redirect to welcome page
  window.location.href = '/welcome?welcome=true&force=true';
}

// Function to check current state
function checkCurrentState() {
  console.log('  📊 Current state:');
  console.log(`    URL: ${window.location.href}`);
  console.log(`    Pathname: ${window.location.pathname}`);
  console.log(`    Test user: ${localStorage.getItem('test-user')}`);
  
  // Check for welcome-related localStorage
  const welcomeItems = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('welcome_') || key.includes('welcome'))) {
      welcomeItems.push(key);
    }
  }
  console.log(`    Welcome localStorage items: ${welcomeItems.length}`);
}

// Main fix function
function quickFix() {
  console.log('🔧 Running quick welcome screen fix...\n');
  
  // Check current state
  checkCurrentState();
  
  // Force welcome screen
  forceWelcomeNow();
}

// Export for use
window.quickWelcomeFix = quickFix;

// Auto-run fix
quickFix(); 