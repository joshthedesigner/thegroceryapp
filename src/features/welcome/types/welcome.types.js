// Welcome Screen Types and Interfaces

/**
 * User preferences interface for welcome screen state
 */
export const UserPreferences = {
  id: 'string',
  user_id: 'string',
  welcome_completed: 'boolean',
  time_filter: 'string',
  period_offset: 'number',
  created_at: 'string',
  updated_at: 'string'
}

/**
 * Welcome step interface
 */
export const WelcomeStep = {
  stepNumber: 'number',
  title: 'string',
  description: 'string',
  isActive: 'boolean',
  isCompleted: 'boolean'
}

/**
 * Welcome context interface
 */
export const WelcomeContextType = {
  hasSeenWelcome: 'boolean',
  currentStep: 'number',
  totalSteps: 'number',
  isWelcomeActive: 'boolean',
  markWelcomeSeen: 'function',
  completeStep: 'function',
  skipWelcome: 'function'
}

/**
 * Welcome screen props interface
 */
export const WelcomeScreenProps = {
  onComplete: 'function',
  onSkip: 'function'
}

/**
 * Welcome step props interface
 */
export const WelcomeStepProps = {
  step: 'WelcomeStep',
  isActive: 'boolean',
  onComplete: 'function'
}

/**
 * Welcome navigation props interface
 */
export const WelcomeNavigationProps = {
  currentStep: 'number',
  totalSteps: 'number',
  onNext: 'function',
  onPrevious: 'function',
  onComplete: 'function'
}

/**
 * Welcome progress props interface
 */
export const WelcomeProgressProps = {
  currentStep: 'number',
  totalSteps: 'number',
  steps: 'WelcomeStep[]'
} 