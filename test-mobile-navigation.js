// Mobile Navigation Test Script
// Run this in the browser console to test mobile navigation functionality

console.log('🧪 Testing Mobile Navigation...')

// Function to simulate mobile viewport
function testMobileViewport() {
  console.log('📱 Testing mobile viewport (768px width)')
  
  // Simulate mobile viewport
  const originalWidth = window.innerWidth
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 768
  })
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'))
  
  // Check for mobile elements
  const hamburgerButton = document.querySelector('button[aria-label*="menu"], button:has(.anticon-menu)')
  const bottomNav = document.querySelector('.mobile-bottom-nav')
  const drawer = document.querySelector('.ant-drawer')
  
  console.log('  - Hamburger button present:', !!hamburgerButton)
  console.log('  - Bottom navigation present:', !!bottomNav)
  console.log('  - Drawer component present:', !!drawer)
  
  // Restore original width
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: originalWidth
  })
  
  window.dispatchEvent(new Event('resize'))
  
  return {
    hamburgerButton: !!hamburgerButton,
    bottomNav: !!bottomNav,
    drawer: !!drawer
  }
}

// Function to test desktop viewport
function testDesktopViewport() {
  console.log('🖥️  Testing desktop viewport (1200px width)')
  
  // Simulate desktop viewport
  const originalWidth = window.innerWidth
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1200
  })
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'))
  
  // Check for desktop elements
  const horizontalMenu = document.querySelector('.ant-menu-horizontal')
  const userDropdown = document.querySelector('.ant-dropdown-trigger')
  const bottomNav = document.querySelector('.mobile-bottom-nav')
  
  console.log('  - Horizontal menu present:', !!horizontalMenu)
  console.log('  - User dropdown present:', !!userDropdown)
  console.log('  - Bottom navigation hidden:', !bottomNav)
  
  // Restore original width
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: originalWidth
  })
  
  window.dispatchEvent(new Event('resize'))
  
  return {
    horizontalMenu: !!horizontalMenu,
    userDropdown: !!userDropdown,
    bottomNavHidden: !bottomNav
  }
}

// Function to test navigation functionality
function testNavigationFunctionality() {
  console.log('🧭 Testing navigation functionality')
  
  // Check current location
  const currentPath = window.location.pathname
  console.log('  - Current path:', currentPath)
  
  // Check menu items
  const menuItems = document.querySelectorAll('.ant-menu-item, .bottom-nav-item')
  console.log('  - Menu items found:', menuItems.length)
  
  // Check active state
  const activeItems = document.querySelectorAll('.ant-menu-item-selected, .bottom-nav-item.active')
  console.log('  - Active menu items:', activeItems.length)
  
  return {
    currentPath,
    menuItems: menuItems.length,
    activeItems: activeItems.length
  }
}

// Function to test responsive breakpoints
function testResponsiveBreakpoints() {
  console.log('📐 Testing responsive breakpoints')
  
  const breakpoints = [
    { width: 480, name: 'Extra Small' },
    { width: 768, name: 'Mobile' },
    { width: 1024, name: 'Tablet' },
    { width: 1200, name: 'Desktop' }
  ]
  
  const results = {}
  
  breakpoints.forEach(({ width, name }) => {
    const originalWidth = window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width
    })
    
    window.dispatchEvent(new Event('resize'))
    
    const isMobile = width <= 768
    const hamburgerButton = document.querySelector('button:has(.anticon-menu)')
    const horizontalMenu = document.querySelector('.ant-menu-horizontal')
    const bottomNav = document.querySelector('.mobile-bottom-nav')
    
    results[name] = {
      width,
      isMobile,
      hamburgerButton: !!hamburgerButton,
      horizontalMenu: !!horizontalMenu,
      bottomNav: !!bottomNav
    }
    
    console.log(`  - ${name} (${width}px):`, {
      isMobile,
      hamburgerButton: !!hamburgerButton,
      horizontalMenu: !!horizontalMenu,
      bottomNav: !!bottomNav
    })
    
    // Restore original width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalWidth
    })
  })
  
  window.dispatchEvent(new Event('resize'))
  
  return results
}

// Run all tests
function runAllTests() {
  console.log('🚀 Starting Mobile Navigation Tests...')
  console.log('=====================================')
  
  const mobileResults = testMobileViewport()
  console.log('')
  
  const desktopResults = testDesktopViewport()
  console.log('')
  
  const navResults = testNavigationFunctionality()
  console.log('')
  
  const responsiveResults = testResponsiveBreakpoints()
  console.log('')
  
  // Summary
  console.log('📊 Test Summary:')
  console.log('================')
  console.log('Mobile Viewport:', mobileResults)
  console.log('Desktop Viewport:', desktopResults)
  console.log('Navigation:', navResults)
  console.log('Responsive:', responsiveResults)
  
  // Check if tests passed
  const mobilePassed = mobileResults.hamburgerButton && mobileResults.bottomNav
  const desktopPassed = desktopResults.horizontalMenu && desktopResults.userDropdown && desktopResults.bottomNavHidden
  const navPassed = navResults.menuItems > 0 && navResults.activeItems > 0
  
  console.log('')
  console.log('✅ Test Results:')
  console.log('  - Mobile navigation:', mobilePassed ? 'PASS' : 'FAIL')
  console.log('  - Desktop navigation:', desktopPassed ? 'PASS' : 'FAIL')
  console.log('  - Navigation functionality:', navPassed ? 'PASS' : 'FAIL')
  
  return {
    mobilePassed,
    desktopPassed,
    navPassed,
    allPassed: mobilePassed && desktopPassed && navPassed
  }
}

// Export functions for manual testing
window.testMobileNavigation = {
  testMobileViewport,
  testDesktopViewport,
  testNavigationFunctionality,
  testResponsiveBreakpoints,
  runAllTests
}

console.log('✅ Mobile Navigation Test Script Loaded')
console.log('Run window.testMobileNavigation.runAllTests() to test everything') 