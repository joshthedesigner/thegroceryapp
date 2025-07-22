// Clear User Storage Utility
// Run this in your browser console to clear all user-related storage

console.log('🧹 Clearing user storage for jogold@linkedin.com...');

// Function to clear localStorage items
function clearLocalStorage() {
  console.log('📦 Clearing localStorage...');
  
  // Clear test user flag
  localStorage.removeItem('test-user');
  console.log('✅ Removed test-user flag');
  
  // Clear any welcome state for the user
  // Note: We don't know the exact user ID, so we'll clear all welcome-related items
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('welcome_') || key.includes('welcome'))) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`✅ Removed localStorage key: ${key}`);
  });
  
  console.log(`📦 Cleared ${keysToRemove.length} welcome-related localStorage items`);
}

// Function to clear sessionStorage
function clearSessionStorage() {
  console.log('📦 Clearing sessionStorage...');
  sessionStorage.clear();
  console.log('✅ Cleared all sessionStorage');
}

// Function to clear Supabase session cookies
function clearSupabaseCookies() {
  console.log('🍪 Clearing Supabase cookies...');
  
  // Get all cookies
  const cookies = document.cookie.split(';');
  
  // Clear Supabase-related cookies
  cookies.forEach(cookie => {
    const [name] = cookie.trim().split('=');
    if (name && (name.includes('supabase') || name.includes('sb-'))) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      console.log(`✅ Cleared cookie: ${name}`);
    }
  });
  
  console.log('🍪 Cleared Supabase authentication cookies');
}

// Function to clear all storage
function clearAllUserStorage() {
  console.log('🚀 Starting complete user storage cleanup...');
  
  try {
    clearLocalStorage();
    clearSessionStorage();
    clearSupabaseCookies();
    
    console.log('✅ All user storage cleared successfully!');
    console.log('🔄 Please refresh the page to complete the reset.');
    
    // Optional: Reload the page
    const shouldReload = confirm('Storage cleared! Would you like to reload the page now?');
    if (shouldReload) {
      window.location.reload();
    }
    
  } catch (error) {
    console.error('❌ Error clearing storage:', error);
  }
}

// Function to check current storage state
function checkStorageState() {
  console.log('🔍 Checking current storage state...');
  
  console.log('📦 localStorage items:');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(`  ${key}: ${value}`);
  }
  
  console.log('📦 sessionStorage items:');
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const value = sessionStorage.getItem(key);
    console.log(`  ${key}: ${value}`);
  }
  
  console.log('🍪 Cookies:');
  console.log(document.cookie);
}

// Export functions for use
window.clearUserStorage = {
  clearAll: clearAllUserStorage,
  clearLocalStorage,
  clearSessionStorage,
  clearSupabaseCookies,
  checkState: checkStorageState
};

console.log('📋 Available functions:');
console.log('  - clearUserStorage.clearAll() - Clear all user storage');
console.log('  - clearUserStorage.checkState() - Check current storage state');
console.log('  - clearUserStorage.clearLocalStorage() - Clear localStorage only');
console.log('  - clearUserStorage.clearSessionStorage() - Clear sessionStorage only');
console.log('  - clearUserStorage.clearSupabaseCookies() - Clear Supabase cookies only');

// Auto-run check
checkStorageState(); 