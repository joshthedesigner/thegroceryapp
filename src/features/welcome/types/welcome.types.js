// Welcome Screen Types and Interfaces

/**
 * User preferences interface for welcome screen state
 */
export const UserPreferences = {
  id: 'string',
  user_id: 'string',
  has_seen_welcome: 'boolean',
  welcome_completed_at: 'string | null',
  welcome_step_completed: 'number',
  created_at: 'string',
  updated_at: 'string'
}

/**
 * Welcome step interface
 */
export const WelcomeStep = {
  id: 'number',
  title: 'string',
  description: 'string',
  icon: 'string',
  action: 'string | null',
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