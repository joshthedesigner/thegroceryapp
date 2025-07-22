// Test Database Schema Utility

import { supabase } from '../../../services/supabase'
import { 
  getUserPreferences, 
  updateUserPreferences, 
  markWelcomeSeen,
  updateWelcomeStep 
} from './welcomeStorage'

/**
 * Test the user_preferences table schema
 * @param {string} userId - Test user ID
 * @returns {Promise<Object>} Test results
 */
export const testUserPreferencesSchema = async (userId) => {
  const results = {
    success: true,
    tests: [],
    errors: []
  }

  try {
    // Test 1: Insert new user preferences
    console.log('🧪 Test 1: Inserting new user preferences...')
    const insertResult = await updateUserPreferences(userId, {
      has_seen_welcome: false,
      welcome_step_completed: 0
    })
    
    if (insertResult) {
      results.tests.push('✅ Insert new user preferences - PASSED')
    } else {
      results.tests.push('❌ Insert new user preferences - FAILED')
      results.success = false
    }

    // Test 2: Read user preferences
    console.log('🧪 Test 2: Reading user preferences...')
    const readResult = await getUserPreferences(userId)
    
    if (readResult && readResult.user_id === userId) {
      results.tests.push('✅ Read user preferences - PASSED')
    } else {
      results.tests.push('❌ Read user preferences - FAILED')
      results.success = false
    }

    // Test 3: Update welcome step
    console.log('🧪 Test 3: Updating welcome step...')
    const stepResult = await updateWelcomeStep(userId, 2)
    
    if (stepResult) {
      results.tests.push('✅ Update welcome step - PASSED')
    } else {
      results.tests.push('❌ Update welcome step - FAILED')
      results.success = false
    }

    // Test 4: Mark welcome as seen
    console.log('🧪 Test 4: Marking welcome as seen...')
    const seenResult = await markWelcomeSeen(userId)
    
    if (seenResult) {
      results.tests.push('✅ Mark welcome as seen - PASSED')
    } else {
      results.tests.push('❌ Mark welcome as seen - FAILED')
      results.success = false
    }

    // Test 5: Verify final state
    console.log('🧪 Test 5: Verifying final state...')
    const finalResult = await getUserPreferences(userId)
    
    if (finalResult && finalResult.has_seen_welcome === true) {
      results.tests.push('✅ Verify final state - PASSED')
    } else {
      results.tests.push('❌ Verify final state - FAILED')
      results.success = false
    }

  } catch (error) {
    console.error('❌ Schema test error:', error)
    results.errors.push(error.message)
    results.success = false
  }

  return results
}

/**
 * Run schema tests
 * @param {string} userId - Test user ID
 */
export const runSchemaTests = async (userId) => {
  console.log('🚀 Starting database schema tests...')
  
  if (!userId) {
    console.error('❌ No user ID provided for testing')
    return
  }

  const results = await testUserPreferencesSchema(userId)
  
  console.log('\n📊 Test Results:')
  results.tests.forEach(test => console.log(test))
  
  if (results.errors.length > 0) {
    console.log('\n❌ Errors:')
    results.errors.forEach(error => console.log(`  - ${error}`))
  }
  
  if (results.success) {
    console.log('\n✅ All schema tests passed!')
  } else {
    console.log('\n❌ Some schema tests failed.')
  }
  
  return results
} 