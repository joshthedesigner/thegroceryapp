// Welcome Screen Storage Utilities

import { supabase } from '../../../services/supabase'

/**
 * Get user preferences from database
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} User preferences object
 */
export const getUserPreferences = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching user preferences:', error)
      return null
    }

    return data || {
      user_id: userId,
      welcome_completed: false,
      time_filter: 'week',
      period_offset: 0
    }
  } catch (error) {
    console.error('Error in getUserPreferences:', error)
    return null
  }
}

/**
 * Update user preferences in database
 * @param {string} userId - The user ID
 * @param {Object} preferences - Preferences to update
 * @returns {Promise<Object>} Updated preferences
 */
export const updateUserPreferences = async (userId, preferences) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error updating user preferences:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in updateUserPreferences:', error)
    return null
  }
}

/**
 * Mark welcome screen as seen
 * @param {string} userId - The user ID
 * @returns {Promise<boolean>} Success status
 */
export const markWelcomeSeen = async (userId) => {
  try {
    const result = await updateUserPreferences(userId, {
      welcome_completed: true
    })

    return !!result
  } catch (error) {
    console.error('Error marking welcome as seen:', error)
    return false
  }
}

/**
 * Update welcome step completion
 * @param {string} userId - The user ID
 * @param {number} stepNumber - The step number completed
 * @returns {Promise<boolean>} Success status
 */
export const updateWelcomeStep = async (userId, stepNumber) => {
  try {
    // Since we don't have welcome_step_completed column, we'll use welcome_completed
    // to track completion status
    const result = await updateUserPreferences(userId, {
      welcome_completed: stepNumber > 0
    })

    return !!result
  } catch (error) {
    console.error('Error updating welcome step:', error)
    return false
  }
}

/**
 * Get welcome screen state from localStorage (fallback)
 * @param {string} userId - The user ID
 * @returns {Object} Local storage preferences
 */
export const getLocalWelcomeState = (userId) => {
  try {
    const key = `welcome_${userId}`
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return null
  }
}

/**
 * Set welcome screen state in localStorage (fallback)
 * @param {string} userId - The user ID
 * @param {Object} state - State to store
 */
export const setLocalWelcomeState = (userId, state) => {
  try {
    const key = `welcome_${userId}`
    localStorage.setItem(key, JSON.stringify(state))
  } catch (error) {
    console.error('Error writing to localStorage:', error)
  }
}

/**
 * Check if user has seen welcome screen
 * @param {string} userId - The user ID
 * @returns {Promise<boolean>} Whether user has seen welcome
 */
export const hasUserSeenWelcome = async (userId) => {
  try {
    const preferences = await getUserPreferences(userId)
    return preferences?.welcome_completed || false
  } catch (error) {
    console.error('Error checking welcome status:', error)
    return false
  }
} 