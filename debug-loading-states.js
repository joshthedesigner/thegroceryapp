// Debug Loading States
// Run this in the browser console to identify the two loading states

console.log('🔍 Diagnosing Loading States...')

// Check current URL and state
console.log('Current URL:', window.location.href)
console.log('Current pathname:', window.location.pathname)

// Check if we're on dashboard
if (window.location.pathname === '/dashboard') {
  console.log('✅ On dashboard page')
  
  // Check for App.jsx loading state
  const appLoading = document.querySelector('div[style*="height: 100vh"]')
  if (appLoading) {
    console.log('🚨 App.jsx Loading State Found:')
    console.log('  - Element:', appLoading)
    console.log('  - Text:', appLoading.textContent)
  }
  
  // Check for WelcomeGuard loading state
  const welcomeGuardLoading = document.querySelector('div[style*="background: white"]')
  if (welcomeGuardLoading) {
    console.log('🚨 WelcomeGuard Loading State Found:')
    console.log('  - Element:', welcomeGuardLoading)
    console.log('  - Text:', welcomeGuardLoading.textContent)
  }
  
  // Check for Dashboard loading state
  const dashboardLoading = document.querySelector('div[style*="textAlign: center"]')
  if (dashboardLoading) {
    console.log('🚨 Dashboard Loading State Found:')
    console.log('  - Element:', dashboardLoading)
    console.log('  - Text:', dashboardLoading.textContent)
  }
  
  // Check for Spin components
  const spinComponents = document.querySelectorAll('.ant-spin')
  console.log('🔄 Spin components found:', spinComponents.length)
  spinComponents.forEach((spin, index) => {
    console.log(`  Spin ${index + 1}:`, spin)
  })
  
  // Check for loading text
  const loadingTexts = Array.from(document.querySelectorAll('*')).filter(el => 
    el.textContent && el.textContent.toLowerCase().includes('loading')
  )
  console.log('📝 Loading text elements found:', loadingTexts.length)
  loadingTexts.forEach((el, index) => {
    console.log(`  Loading text ${index + 1}:`, el.textContent.trim())
  })
  
} else {
  console.log('❌ Not on dashboard page')
}

// Check React state
console.log('🔍 Checking React state...')
console.log('localStorage test-user:', localStorage.getItem('test-user'))

// Monitor for loading state changes
let loadingStateCount = 0
const originalConsoleLog = console.log
console.log = function(...args) {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('loading')) {
    loadingStateCount++
    originalConsoleLog(`🔄 Loading State ${loadingStateCount}:`, ...args)
  } else {
    originalConsoleLog(...args)
  }
}

// Check for any global errors
window.addEventListener('error', (event) => {
  console.log('🚨 Global error:', event.error)
})

console.log('✅ Loading state diagnosis complete')
console.log('💡 Expected loading states:')
console.log('  1. App.jsx initial loading (authentication)')
console.log('  2. WelcomeGuard loading (checking welcome status)')
console.log('  3. Dashboard loading (fetching ingredients/meals data)') 