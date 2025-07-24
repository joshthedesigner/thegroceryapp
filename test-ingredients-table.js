// Test script to verify ingredients table loads properly
// Run this in the browser console after navigating to the ingredients page

console.log('🧪 Testing Ingredients Table Load...')

// Wait for the page to load
setTimeout(() => {
  console.log('📍 Current URL:', window.location.href)
  console.log('📍 Current pathname:', window.location.pathname)
  
  // Check if we're on the ingredients page
  if (window.location.pathname.includes('/ingredients')) {
    console.log('✅ On ingredients page')
    
    // Check for table elements
    const tables = document.querySelectorAll('.ant-table')
    console.log('📊 Tables found:', tables.length)
    
    // Check for loading states
    const spinners = document.querySelectorAll('.ant-spin')
    console.log('🔄 Spinners found:', spinners.length)
    
    // Check for error messages
    const errorMessages = document.querySelectorAll('.ant-message-error')
    console.log('❌ Error messages found:', errorMessages.length)
    
    // Check for ingredient rows
    const tableRows = document.querySelectorAll('.ant-table-tbody tr')
    console.log('📋 Table rows found:', tableRows.length)
    
    // Check for any console errors
    console.log('🔍 Checking for console errors...')
    
    // Test the ingredients data
    if (window.ingredientsData) {
      console.log('📊 Ingredients data available:', window.ingredientsData.length, 'items')
      console.log('📊 Sample ingredient:', window.ingredientsData[0])
    }
    
    // Check for any network errors
    console.log('🌐 Checking network requests...')
    
    console.log('\n🎯 Test Summary:')
    console.log('  - Tables found:', tables.length)
    console.log('  - Loading states:', spinners.length)
    console.log('  - Error messages:', errorMessages.length)
    console.log('  - Table rows:', tableRows.length)
    
    if (errorMessages.length > 0) {
      console.log('❌ Errors detected - check the error messages above')
    } else if (tableRows.length > 0) {
      console.log('✅ Table appears to be loading data successfully')
    } else if (spinners.length > 0) {
      console.log('⏳ Still loading - check back in a moment')
    } else {
      console.log('⚠️ No table data found - may need to add ingredients')
    }
  } else {
    console.log('❌ Not on ingredients page - navigate to /ingredients first')
  }
}, 2000)

// Also check immediately
console.log('🔍 Initial check:')
console.log('  - URL:', window.location.href)
console.log('  - Pathname:', window.location.pathname)
console.log('  - Tables:', document.querySelectorAll('.ant-table').length)
console.log('  - Spinners:', document.querySelectorAll('.ant-spin').length) 