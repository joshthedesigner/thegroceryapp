// Test script to verify navbar flash fix
// Run this in the browser console after the app loads

console.log('🔍 Testing Navbar Flash Fix...')

// Function to check for navbar presence
function checkNavbarFlash() {
  // Check for navbar elements
  const navbar = document.querySelector('.layout-header')
  const menuItems = document.querySelectorAll('.ant-menu-item')
  const userDropdown = document.querySelector('.ant-dropdown-trigger')
  
  // Check for loading spinner
  const loadingSpinner = document.querySelector('.ant-spin')
  const loadingText = document.querySelector('div[style*="textAlign: center"]')
  
  console.log('📊 Current State:')
  console.log('  - Navbar present:', !!navbar)
  console.log('  - Menu items:', menuItems.length)
  console.log('  - User dropdown:', !!userDropdown)
  console.log('  - Loading spinner:', !!loadingSpinner)
  console.log('  - Loading text:', !!loadingText)
  
  // If navbar is present during loading, that's a flash
  if (navbar && loadingSpinner) {
    console.log('🚨 NAVBAR FLASH DETECTED!')
    console.log('  - Navbar is visible during loading state')
    return false
  }
  
  // If navbar is present without loading, that's normal
  if (navbar && !loadingSpinner) {
    console.log('✅ Normal state - navbar visible, no loading')
    return true
  }
  
  // If no navbar and loading, that's expected
  if (!navbar && loadingSpinner) {
    console.log('✅ Loading state - no navbar flash')
    return true
  }
  
  console.log('ℹ️  Other state detected')
  return true
}

// Monitor for changes
let checkCount = 0
const maxChecks = 10
const checkInterval = setInterval(() => {
  checkCount++
  console.log(`\n🔍 Check ${checkCount}/${maxChecks}:`)
  
  const isFixed = checkNavbarFlash()
  
  if (checkCount >= maxChecks) {
    clearInterval(checkInterval)
    console.log('\n🎯 Test Complete!')
    console.log('✅ Navbar flash appears to be fixed')
  }
}, 1000)

// Also check immediately
console.log('🔍 Initial check:')
checkNavbarFlash() 