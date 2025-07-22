// Diagnostic script for welcome redirect issue
// Run this in the browser console

console.log('🔍 Welcome Redirect Diagnostic Starting...')

// Check current URL and path
console.log('📍 Current URL:', window.location.href)
console.log('📍 Current pathname:', window.location.pathname)

// Check for React components
console.log('🔍 Checking React Components...')

// Check for AuthenticationGuard
const authGuard = document.querySelector('[data-testid="auth-guard"]') || 
                 document.querySelector('div[style*="textAlign: center"]')
console.log('🔐 AuthenticationGuard found:', !!authGuard)

// Check for AuthenticatedApp
const authenticatedApp = document.querySelector('[data-testid="authenticated-app"]')
console.log('📱 AuthenticatedApp found:', !!authenticatedApp)

// Check for Layout component
const layout = document.querySelector('.layout-header')
console.log('🏗️ Layout found:', !!layout)

// Check for loading states
const loadingSpinners = document.querySelectorAll('.ant-spin')
console.log('🔄 Loading spinners found:', loadingSpinners.length)

// Check for welcome screen
const welcomeScreen = document.querySelector('[data-testid="welcome-screen"]')
console.log('👋 Welcome screen found:', !!welcomeScreen)

// Check for any error messages
const errorElements = document.querySelectorAll('.ant-alert-error, .ant-message-error, [class*="error"]')
console.log('❌ Error elements found:', errorElements.length)
errorElements.forEach((error, index) => {
  console.log(`  Error ${index + 1}:`, error.textContent)
})

// Check for any console errors
console.log('📝 Checking for console errors...')
const originalError = console.error
const consoleErrors = []
console.error = function(...args) {
  consoleErrors.push(args)
  originalError.apply(console, args)
}

// Check React DevTools if available
if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  console.log('⚛️ React DevTools available')
} else {
  console.log('⚛️ React DevTools not available')
}

// Check for any global errors
window.addEventListener('error', (event) => {
  console.log('🚨 Global error caught:', event.error)
})

// Check for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.log('🚨 Unhandled promise rejection:', event.reason)
})

// Check localStorage for test user
const testUser = localStorage.getItem('test-user')
console.log('🧪 Test user in localStorage:', testUser)

// Check for any Supabase errors
if (window.supabase) {
  console.log('🔌 Supabase client available')
} else {
  console.log('🔌 Supabase client not available')
}

// Check for any routing issues
console.log('🛣️ Current route analysis:')
console.log('  - Pathname:', window.location.pathname)
console.log('  - Search params:', window.location.search)
console.log('  - Hash:', window.location.hash)

// Check for any React Router state
if (window.history && window.history.state) {
  console.log('📚 History state:', window.history.state)
}

// Monitor for changes
console.log('\n🔍 Monitoring for state changes...')
let checkCount = 0
const maxChecks = 15
const checkInterval = setInterval(() => {
  checkCount++
  console.log(`\n🔍 Check ${checkCount}/${maxChecks}:`)
  
  // Check if we're still on loading
  const stillLoading = document.querySelector('.ant-spin')
  const welcomeRedirect = document.querySelector('div')?.textContent?.includes('Redirecting to welcome')
  
  console.log('  - Still loading:', !!stillLoading)
  console.log('  - Welcome redirect message:', !!welcomeRedirect)
  console.log('  - Current pathname:', window.location.pathname)
  
  if (welcomeRedirect) {
    console.log('🚨 STUCK IN WELCOME REDIRECT!')
    console.log('  - This indicates a routing loop or navigation issue')
  }
  
  if (checkCount >= maxChecks) {
    clearInterval(checkInterval)
    console.log('\n🎯 Diagnostic Complete!')
    console.log('📊 Summary:')
    console.log('  - Errors found:', consoleErrors.length)
    console.log('  - Loading spinners:', document.querySelectorAll('.ant-spin').length)
    console.log('  - Current path:', window.location.pathname)
  }
}, 2000)

// Also check immediately
console.log('🔍 Initial diagnostic:')
console.log('  - Loading spinners:', document.querySelectorAll('.ant-spin').length)
console.log('  - Current pathname:', window.location.pathname)
console.log('  - Welcome redirect message:', !!document.querySelector('div')?.textContent?.includes('Redirecting to welcome')) 