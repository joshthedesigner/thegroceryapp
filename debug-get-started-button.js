// Debug Get Started Button
// Run this in the browser console to diagnose the button issue

console.log('🔍 Diagnosing Get Started Button...')

// Check if we're on the welcome page
if (window.location.pathname === '/welcome') {
  console.log('✅ On welcome page')
  
  // Check if WelcomeStep component exists
  const welcomeStep = document.querySelector('[data-testid="welcome-step"]') || 
                     document.querySelector('button[type="primary"]')
  
  if (welcomeStep) {
    console.log('✅ Found Get Started button')
    console.log('Button text:', welcomeStep.textContent)
    console.log('Button disabled:', welcomeStep.disabled)
    console.log('Button onclick:', welcomeStep.onclick)
    
    // Test click
    console.log('🔄 Testing button click...')
    welcomeStep.click()
    
    // Check for any errors
    setTimeout(() => {
      console.log('⏰ After click - checking for navigation...')
      console.log('Current URL:', window.location.href)
    }, 1000)
  } else {
    console.log('❌ Get Started button not found')
  }
  
  // Check React context
  if (window.React) {
    console.log('✅ React is available')
  }
  
  // Check for any console errors
  const originalError = console.error
  console.error = function(...args) {
    console.log('🚨 Console error detected:', ...args)
    originalError.apply(console, args)
  }
  
} else {
  console.log('❌ Not on welcome page')
  console.log('Current path:', window.location.pathname)
}

// Check welcome context state
console.log('🔍 Checking welcome context...')
console.log('localStorage test-user:', localStorage.getItem('test-user'))
console.log('localStorage welcome state:', localStorage.getItem('welcome_test-user'))

// Check for any global errors
window.addEventListener('error', (event) => {
  console.log('🚨 Global error:', event.error)
})

console.log('✅ Diagnosis complete') 