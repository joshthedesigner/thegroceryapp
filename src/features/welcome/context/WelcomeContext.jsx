// Welcome Context for Global State Management

import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { useWelcomeState } from '../hooks/useWelcomeState'

// Initial state
const initialState = {
  hasSeenWelcome: false,
  currentStep: 1,
  isLoading: true,
  error: null,
  isWelcomeActive: false
}

// Action types
const WELCOME_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_WELCOME_SEEN: 'SET_WELCOME_SEEN',
  SET_CURRENT_STEP: 'SET_CURRENT_STEP',
  SET_WELCOME_ACTIVE: 'SET_WELCOME_ACTIVE',
  RESET_WELCOME: 'RESET_WELCOME'
}

// Reducer function
const welcomeReducer = (state, action) => {
  switch (action.type) {
    case WELCOME_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }
    
    case WELCOME_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    
    case WELCOME_ACTIONS.SET_WELCOME_SEEN:
      return {
        ...state,
        hasSeenWelcome: action.payload,
        isWelcomeActive: !action.payload
      }
    
    case WELCOME_ACTIONS.SET_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.payload
      }
    
    case WELCOME_ACTIONS.SET_WELCOME_ACTIVE:
      return {
        ...state,
        isWelcomeActive: action.payload
      }
    
    case WELCOME_ACTIONS.RESET_WELCOME:
      return {
        ...initialState,
        isLoading: false
      }
    
    default:
      return state
  }
}

// Create context
const WelcomeContext = createContext()

/**
 * Welcome Provider Component
 * Provides welcome screen state and actions to the app
 */
export const WelcomeProvider = ({ children, userId }) => {
  // Use the welcome state hook
  const welcomeState = useWelcomeState(userId)
  
  // Create context value
  const contextValue = {
    // State
    hasSeenWelcome: welcomeState.hasSeenWelcome,
    currentStep: welcomeState.currentStep,
    isLoading: welcomeState.isLoading,
    error: welcomeState.error,
    isWelcomeActive: welcomeState.isWelcomeActive,
    totalSteps: welcomeState.totalSteps,
    progress: welcomeState.progress,
    canGoBack: welcomeState.canGoBack,
    canGoNext: welcomeState.canGoNext,
    isLastStep: welcomeState.isLastStep,

    // Actions
    markWelcomeSeen: welcomeState.markWelcomeSeen,
    completeStep: welcomeState.completeStep,
    goToNextStep: welcomeState.goToNextStep,
    goToPreviousStep: welcomeState.goToPreviousStep,
    skipWelcome: welcomeState.skipWelcome,
    resetWelcome: welcomeState.resetWelcome
  }

  return (
    <WelcomeContext.Provider value={contextValue}>
      {children}
    </WelcomeContext.Provider>
  )
}

/**
 * Custom hook to use welcome context
 * @returns {Object} Welcome context value
 */
export const useWelcomeContext = () => {
  const context = useContext(WelcomeContext)
  
  if (!context) {
    throw new Error('useWelcomeContext must be used within a WelcomeProvider')
  }
  
  return context
}

export default WelcomeContext 