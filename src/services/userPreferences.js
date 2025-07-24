import { supabase } from './supabase'

/**
 * Default user preferences
 */
const DEFAULT_PREFERENCES = {
  welcome_completed: false,
  time_filter: 'week',
  period_offset: 0
}

/**
 * Get user preferences from database with fallback to defaults
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
      return { data: null, error }
    }

    // Return data with defaults if not found
    return {
      data: data || {
        user_id: userId,
        ...DEFAULT_PREFERENCES
      },
      error: null
    }
  } catch (error) {
    console.error('Error in getUserPreferences:', error)
    return { data: null, error }
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
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error in updateUserPreferences:', error)
    return { data: null, error }
  }
}

/**
 * Mark welcome screen as seen
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} Updated preferences
 */
export const markWelcomeSeen = async (userId) => {
  return updateUserPreferences(userId, {
    welcome_completed: true
  })
}

/**
 * Update welcome step completion
 * @param {string} userId - The user ID
 * @param {number} stepNumber - The step number completed
 * @returns {Promise<Object>} Updated preferences
 */
export const updateWelcomeStep = async (userId, stepNumber) => {
  return updateUserPreferences(userId, {
    welcome_completed: stepNumber > 0
  })
}

/**
 * Check if user has seen welcome screen
 * @param {string} userId - The user ID
 * @returns {Promise<boolean>} Whether user has seen welcome
 */
export const hasUserSeenWelcome = async (userId) => {
  const { data, error } = await getUserPreferences(userId)
  if (error || !data) return false
  return data.welcome_completed || false
}

// Local storage fallback functions
const STORAGE_PREFIX = 'grocery_app_'

/**
 * Get welcome screen state from localStorage (fallback)
 * @param {string} userId - The user ID
 * @returns {Object|null} Local storage preferences
 */
export const getLocalWelcomeState = (userId) => {
  try {
    const key = `${STORAGE_PREFIX}welcome_${userId}`
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
    const key = `${STORAGE_PREFIX}welcome_${userId}`
    localStorage.setItem(key, JSON.stringify(state))
  } catch (error) {
    console.error('Error writing to localStorage:', error)
  }
} 