// Diagnostic script for loading background color investigation
// Run this in the browser console to understand background color differences

console.log('🔍 Diagnostic: Loading Background Color Investigation...')

// Check current URL and page
console.log('📍 Current URL:', window.location.href)
console.log('📍 Current pathname:', window.location.pathname)

// Check for different background colors
function checkBackgroundColors() {
  console.log('\n🎨 Checking Background Colors...')
  
  // Check for white backgrounds
  const whiteBackgrounds = document.querySelectorAll('div[style*="background: white"], div[style*="background-color: white"]')
  console.log('  - White background divs:', whiteBackgrounds.length)
  
  // Check for gray backgrounds
  const grayBackgrounds = document.querySelectorAll('div[style*="background: #f5f5f5"], div[style*="background-color: #f5f5f5"]')
  console.log('  - Gray background divs (#f5f5f5):', grayBackgrounds.length)
  
  // Check for any other background colors
  const otherBackgrounds = document.querySelectorAll('div[style*="background:"]')
  console.log('  - Other background divs:', otherBackgrounds.length)
  
  // Check for body background
  const bodyStyle = window.getComputedStyle(document.body)
  console.log('  - Body background color:', bodyStyle.backgroundColor)
  
  // Check for html background
  const htmlStyle = window.getComputedStyle(document.documentElement)
  console.log('  - HTML background color:', htmlStyle.backgroundColor)
  
  // Check for app container background
  const appContainer = document.querySelector('.App')
  if (appContainer) {
    const appStyle = window.getComputedStyle(appContainer)
    console.log('  - App container background:', appStyle.backgroundColor)
  }
  
  // Check for any CSS classes that might affect background
  const backgroundClasses = document.querySelectorAll('[class*="background"], [class*="bg-"]')
  console.log('  - Elements with background classes:', backgroundClasses.length)
}

checkBackgroundColors()

// Check for loading states and their backgrounds
function checkLoadingStateBackgrounds() {
  console.log('\n🔄 Checking Loading State Backgrounds...')
  
  // Check for loading spinners
  const spinners = document.querySelectorAll('.ant-spin')
  console.log('  - Loading spinners found:', spinners.length)
  
  // Check for loading containers
  const loadingContainers = document.querySelectorAll('div[style*="display: flex"][style*="justifyContent: center"]')
  console.log('  - Loading containers found:', loadingContainers.length)
  
  // Check each loading container's background
  loadingContainers.forEach((container, index) => {
    const style = window.getComputedStyle(container)
    console.log(`    Container ${index + 1}:`, {
      backgroundColor: style.backgroundColor,
      background: style.background,
      height: style.height,
      minHeight: style.minHeight
    })
  })
  
  // Check for any full-height containers
  const fullHeightContainers = document.querySelectorAll('div[style*="height: 100vh"]')
  console.log('  - Full height containers:', fullHeightContainers.length)
  fullHeightContainers.forEach((container, index) => {
    const style = window.getComputedStyle(container)
    console.log(`    Full height container ${index + 1}:`, {
      backgroundColor: style.backgroundColor,
      height: style.height
    })
  })
}

checkLoadingStateBackgrounds()

// Check for CSS variables or theme colors
function checkThemeColors() {
  console.log('\n🎨 Checking Theme Colors...')
  
  // Check for CSS custom properties
  const rootStyle = window.getComputedStyle(document.documentElement)
  const cssVars = [
    '--background-color',
    '--bg-color',
    '--primary-bg',
    '--secondary-bg'
  ]
  
  cssVars.forEach(varName => {
    const value = rootStyle.getPropertyValue(varName)
    if (value) {
      console.log(`  - CSS Variable ${varName}:`, value)
    }
  })
  
  // Check for Ant Design theme colors
  const antdTheme = document.querySelector('.ant-config-provider')
  if (antdTheme) {
    console.log('  - Ant Design theme provider found')
    const themeStyle = window.getComputedStyle(antdTheme)
    console.log('    Theme background:', themeStyle.backgroundColor)
  }
}

checkThemeColors()

// Check for different loading components
function checkLoadingComponents() {
  console.log('\n🔍 Checking Loading Components...')
  
  // Check for AuthenticationGuard loading
  const authGuardLoading = document.querySelector('div')?.textContent?.includes('Loading...')
  console.log('  - AuthenticationGuard loading active:', !!authGuardLoading)
  
  // Check for AuthenticatedApp loading
  const authAppLoading = document.querySelector('div')?.textContent?.includes('Loading...')
  console.log('  - AuthenticatedApp loading active:', !!authAppLoading)
  
  // Check for Dashboard loading
  const dashboardLoading = document.querySelector('div')?.textContent?.includes('Loading dashboard data')
  console.log('  - Dashboard loading active:', !!dashboardLoading)
  
  // Check for Welcome loading
  const welcomeLoading = document.querySelector('div')?.textContent?.includes('Loading welcome screen')
  console.log('  - Welcome loading active:', !!welcomeLoading)
}

checkLoadingComponents()

// Check for any inline styles that might override backgrounds
function checkInlineStyles() {
  console.log('\n📝 Checking Inline Styles...')
  
  // Check for inline background styles
  const inlineBackgrounds = document.querySelectorAll('div[style*="background"]')
  console.log('  - Divs with inline background styles:', inlineBackgrounds.length)
  
  inlineBackgrounds.forEach((div, index) => {
    const style = div.style
    console.log(`    Div ${index + 1}:`, {
      background: style.background,
      backgroundColor: style.backgroundColor,
      className: div.className,
      id: div.id
    })
  })
}

checkInlineStyles()

// Monitor for background changes during loading
console.log('\n🔍 Monitoring for Background Changes...')
let checkCount = 0
const maxChecks = 10
const checkInterval = setInterval(() => {
  checkCount++
  console.log(`\n🔍 Check ${checkCount}/${maxChecks}:`)
  
  // Check current background state
  const currentWhiteBackgrounds = document.querySelectorAll('div[style*="background: white"]')
  const currentGrayBackgrounds = document.querySelectorAll('div[style*="background: #f5f5f5"]')
  const currentSpinners = document.querySelectorAll('.ant-spin')
  
  console.log('  - White backgrounds:', currentWhiteBackgrounds.length)
  console.log('  - Gray backgrounds:', currentGrayBackgrounds.length)
  console.log('  - Spinners:', currentSpinners.length)
  
  // Check if we're in a loading state
  const isLoading = currentSpinners.length > 0
  console.log('  - Currently loading:', isLoading)
  
  if (isLoading) {
    // Check the background of the loading container
    const loadingContainer = currentSpinners[0]?.closest('div[style*="display: flex"]')
    if (loadingContainer) {
      const style = window.getComputedStyle(loadingContainer)
      console.log('  - Loading container background:', style.backgroundColor)
      console.log('  - Loading container height:', style.height)
    }
  }
  
  if (checkCount >= maxChecks) {
    clearInterval(checkInterval)
    console.log('\n🎯 Diagnostic Complete!')
    console.log('📊 Summary:')
    console.log('  - White backgrounds found:', currentWhiteBackgrounds.length)
    console.log('  - Gray backgrounds found:', currentGrayBackgrounds.length)
    console.log('  - Loading states monitored:', checkCount)
    
    // Provide analysis
    console.log('\n💡 Analysis:')
    if (currentWhiteBackgrounds.length > 0) {
      console.log('  - White backgrounds detected - may be from old card variant remnants')
    }
    if (currentGrayBackgrounds.length > 0) {
      console.log('  - Gray backgrounds detected - this is the correct app background')
    }
    console.log('  - Check if different loading components use different background colors')
  }
}, 2000)

// Also check immediately
console.log('🔍 Initial diagnostic:')
const initialWhiteBackgrounds = document.querySelectorAll('div[style*="background: white"]')
const initialGrayBackgrounds = document.querySelectorAll('div[style*="background: #f5f5f5"]')
console.log('  - Initial white backgrounds:', initialWhiteBackgrounds.length)
console.log('  - Initial gray backgrounds:', initialGrayBackgrounds.length)

// Instructions for testing
console.log('\n📋 Testing Instructions:')
console.log('1. Refresh the page to see the first loading state')
console.log('2. Watch for background color changes during loading')
console.log('3. Note which loading states show white vs gray backgrounds')
console.log('4. Check the console output for background color analysis') 