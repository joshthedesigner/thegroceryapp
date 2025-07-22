// Diagnostic script for Card wrapper persistence
// Run this in the browser console to investigate why Card is still appearing

console.log('🔍 Diagnostic: Card Wrapper Persistence Investigation...')

// Check current URL and page
console.log('📍 Current URL:', window.location.href)
console.log('📍 Current pathname:', window.location.pathname)

// Check for all loading spinners
const allSpinners = document.querySelectorAll('.ant-spin')
console.log('🔄 Total spinners found:', allSpinners.length)

// Check for Card wrapper elements
const cardWrappers = document.querySelectorAll('div[style*="background: white"]')
const cardShadows = document.querySelectorAll('div[style*="boxShadow"]')
const cardBorders = document.querySelectorAll('div[style*="borderRadius"]')
const cardPadding = document.querySelectorAll('div[style*="padding: 2rem"]')

console.log('📦 Card wrapper elements found:')
console.log('  - White background divs:', cardWrappers.length)
console.log('  - Shadow divs:', cardShadows.length)
console.log('  - Border radius divs:', cardBorders.length)
console.log('  - 2rem padding divs:', cardPadding.length)

// Check for immersive container
const immersiveContainers = document.querySelectorAll('div[style*="minHeight: 400px"]')
console.log('🎯 Immersive containers found:', immersiveContainers.length)

// Check for loading text
const loadingTexts = Array.from(document.querySelectorAll('*')).filter(el => 
  el.textContent && el.textContent.toLowerCase().includes('loading')
)
console.log('📝 Loading text elements found:', loadingTexts.length)

// Check which variant is being used
function checkVariantUsage() {
  console.log('\n🔍 Checking LoadingSpinner Variant Usage...')
  
  // Check for card variant indicators
  const cardVariantIndicators = document.querySelectorAll('div[style*="backgroundColor: #f5f5f5"]')
  console.log('  - Card variant containers (gray background):', cardVariantIndicators.length)
  
  // Check for immersive variant indicators
  const immersiveVariantIndicators = document.querySelectorAll('div[style*="minHeight: 400px"]')
  console.log('  - Immersive variant containers:', immersiveVariantIndicators.length)
  
  // Check for default variant indicators
  const defaultVariantIndicators = document.querySelectorAll('div[style*="height: 100vh"]')
  console.log('  - Default variant containers (100vh):', defaultVariantIndicators.length)
  
  // Check for padded variant indicators
  const paddedVariantIndicators = document.querySelectorAll('div[style*="padding: 40px"]')
  console.log('  - Padded variant containers:', paddedVariantIndicators.length)
}

checkVariantUsage()

// Check for any React components that might be using card variant
console.log('\n🔍 Checking Component Usage...')

// Check if we're on dashboard
if (window.location.pathname === '/dashboard') {
  console.log('✅ On dashboard page')
  
  // Check for dashboard loading state
  const dashboardLoading = document.querySelector('div')?.textContent?.includes('Loading dashboard data')
  console.log('  - Dashboard loading active:', !!dashboardLoading)
  
  // Check for trends loading state
  const trendsLoading = document.querySelector('div')?.textContent?.includes('Loading trends data')
  console.log('  - Trends loading active:', !!trendsLoading)
  
  // Check for any Card components from Ant Design
  const antCards = document.querySelectorAll('.ant-card')
  console.log('  - Ant Design Card components:', antCards.length)
  
  // Check for any custom card styling
  const customCards = document.querySelectorAll('[class*="card"], [style*="card"]')
  console.log('  - Custom card elements:', customCards.length)
}

// Check for any cached or old components
console.log('\n🔍 Checking for Cached/Old Components...')

// Check if there are multiple LoadingSpinner instances
const loadingSpinnerContainers = document.querySelectorAll('div[style*="display: flex"][style*="justifyContent: center"]')
console.log('  - LoadingSpinner containers found:', loadingSpinnerContainers.length)

// Check for any inline styles that might override our changes
const inlineCardStyles = document.querySelectorAll('div[style*="background: white"][style*="borderRadius"]')
console.log('  - Inline card styles found:', inlineCardStyles.length)

// Check for any CSS classes that might be applying card styling
const cardClasses = document.querySelectorAll('[class*="card"], [class*="Card"]')
console.log('  - Elements with card classes:', cardClasses.length)

// Check for any parent containers that might be wrapping the spinner
console.log('\n🔍 Checking Parent Containers...')

// Find the LoadingSpinner component and trace its parents
const spinner = document.querySelector('.ant-spin')
if (spinner) {
  console.log('  - Spinner found, tracing parents...')
  let parent = spinner.parentElement
  let level = 0
  while (parent && level < 10) {
    console.log(`    Level ${level}:`, parent.tagName, parent.className, parent.style.cssText)
    parent = parent.parentElement
    level++
  }
}

// Check for any React state that might be causing re-renders
console.log('\n🔍 Checking for React State Issues...')

// Check if there are any console errors
const originalError = console.error
const errors = []
console.error = function(...args) {
  errors.push(args)
  originalError.apply(console, args)
}

// Check for any global errors
window.addEventListener('error', (event) => {
  console.log('🚨 Global error caught:', event.error)
})

// Check for any unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.log('🚨 Unhandled promise rejection:', event.reason)
})

// Monitor for changes
console.log('\n🔍 Monitoring for State Changes...')
let checkCount = 0
const maxChecks = 8
const checkInterval = setInterval(() => {
  checkCount++
  console.log(`\n🔍 Check ${checkCount}/${maxChecks}:`)
  
  // Check current state
  const currentCardWrappers = document.querySelectorAll('div[style*="background: white"]')
  const currentImmersiveContainers = document.querySelectorAll('div[style*="minHeight: 400px"]')
  const currentSpinners = document.querySelectorAll('.ant-spin')
  
  console.log('  - Card wrappers:', currentCardWrappers.length)
  console.log('  - Immersive containers:', currentImmersiveContainers.length)
  console.log('  - Spinners:', currentSpinners.length)
  
  if (checkCount >= maxChecks) {
    clearInterval(checkInterval)
    console.log('\n🎯 Diagnostic Complete!')
    console.log('📊 Summary:')
    console.log('  - Total errors found:', errors.length)
    console.log('  - Card wrappers found:', currentCardWrappers.length)
    console.log('  - Immersive containers found:', currentImmersiveContainers.length)
    
    // Provide recommendations
    console.log('\n💡 Possible Issues:')
    if (currentCardWrappers.length > 0) {
      console.log('  - Card wrappers still present - check if changes were applied')
      console.log('  - May need to refresh the page or clear cache')
    }
    if (currentImmersiveContainers.length === 0) {
      console.log('  - No immersive containers found - variant may not be applied')
    }
    if (errors.length > 0) {
      console.log('  - Console errors detected - may be affecting rendering')
    }
  }
}, 3000)

// Also check immediately
console.log('🔍 Initial diagnostic:')
console.log('  - Card wrappers:', cardWrappers.length)
console.log('  - Immersive containers:', immersiveContainers.length)
console.log('  - Loading texts:', loadingTexts.length) 