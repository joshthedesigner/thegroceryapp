// Welcome State Management Hook

import { useState, useEffect, useCallback } from 'react'
import { 
  getUserPreferences, 
  markWelcomeSeen, 
  updateWelcomeStep,
  hasUserSeenWelcome 
} from '../utils/welcomeStorage'

/**
 * Custom hook for managing welcome screen state
 * @param {string} userId - The user ID
 * @returns {Object} Welcome state and actions
 */
export const useWelcomeState = (userId) => {
  // State management
  const [hasSeenWelcome, setHasSeenWelcome] = useState(null) // null = not loaded yet
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load initial state
  useEffect(() => {
    const loadWelcomeState = async () => {
      // Check if this is a test user
      const isTestUser = localStorage.getItem('test-user') === 'true'
      
      if (!userId && !isTestUser) {
        console.log('No user ID and not test user, setting loading to false')
        setIsLoading(false)
        return
      }

      try {
        console.log('Loading welcome state...')
        setIsLoading(true)
        setError(null)

        // Handle test users
        if (isTestUser) {
          console.log('Loading welcome state for test user')
          setHasSeenWelcome(false)
          setCurrentStep(1)
          setIsLoading(false)
          return
        }

        // Check if user has seen welcome screen
        console.log(`Checking welcome state for user: ${userId}`)
        const seenWelcome = await hasUserSeenWelcome(userId)
        console.log(`User ${userId} has seen welcome:`, seenWelcome)
        setHasSeenWelcome(seenWelcome)

        // If not seen, load user preferences for step tracking
        if (!seenWelcome) {
          const preferences = await getUserPreferences(userId)
          if (preferences?.welcome_step_completed) {
            setCurrentStep(Math.max(1, preferences.welcome_step_completed + 1))
          }
        }
      } catch (err) {
        console.error('Error loading welcome state:', err)
        setError('Failed to load welcome screen state')
      } finally {
        console.log('Welcome state loading complete')
        setIsLoading(false)
      }
    }

    loadWelcomeState()
  }, [userId])

  // Mark welcome as seen
  const markWelcomeSeenHandler = useCallback(async () => {
    // Check if this is a test user
    const isTestUser = localStorage.getItem('test-user') === 'true'
    
    if (isTestUser) {
      console.log('Test user marking welcome as seen')
      setHasSeenWelcome(true)
      return true
    }
    
    if (!userId) return false

    try {
      const success = await markWelcomeSeen(userId)
      if (success) {
        setHasSeenWelcome(true)
      }
      return success
    } catch (err) {
      console.error('Error marking welcome as seen:', err)
      return false
    }
  }, [userId])

  // Complete current step
  const completeStep = useCallback(async (stepNumber) => {
    if (!userId) return false

    try {
      const success = await updateWelcomeStep(userId, stepNumber)
      if (success) {
        setCurrentStep(stepNumber + 1)
      }
      return success
    } catch (err) {
      console.error('Error completing step:', err)
      return false
    }
  }, [userId])

  // Navigate to next step
  const goToNextStep = useCallback(async () => {
    const success = await completeStep(currentStep)
    return success
  }, [currentStep, completeStep])

  // Navigate to previous step
  const goToPreviousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(1, prev - 1))
  }, [])

  // Skip welcome screen
  const skipWelcome = useCallback(async () => {
    // Check if this is a test user
    const isTestUser = localStorage.getItem('test-user') === 'true'
    
    if (isTestUser) {
      console.log('Test user skipping welcome')
      setHasSeenWelcome(true)
      return true
    }
    
    return await markWelcomeSeenHandler()
  }, [markWelcomeSeenHandler])

  // Reset welcome state (for testing)
  const resetWelcome = useCallback(async () => {
    if (!userId) return false

    try {
      const success = await updateWelcomeStep(userId, 0)
      if (success) {
        setHasSeenWelcome(false)
        setCurrentStep(1)
      }
      return success
    } catch (err) {
      console.error('Error resetting welcome:', err)
      return false
    }
  }, [userId])

  return {
    // State
    hasSeenWelcome,
    currentStep,
    isLoading,
    error,
    // Only show welcome if explicitly not seen AND not loading
    isWelcomeActive: hasSeenWelcome === false && !isLoading,

    // Actions
    markWelcomeSeen: markWelcomeSeenHandler,
    completeStep,
    goToNextStep,
    goToPreviousStep,
    skipWelcome,
    resetWelcome,

    // Computed values
    totalSteps: 1,
    progress: Math.round((currentStep / 1) * 100),
    canGoBack: false,
    canGoNext: false,
    isLastStep: currentStep === 1
  }
} 