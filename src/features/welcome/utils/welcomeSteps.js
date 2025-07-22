// Welcome Steps Configuration

/**
 * Single welcome screen configuration
 * All content displayed in one step
 */
export const WELCOME_STEPS = [
  {
    id: 1,
    title: 'Welcome to your Grocery Tracker',
    description: 'Track your ingredient spending, usage, and waste—automatically.',
    icon: '🛒',
    action: 'ingredients',
    isCompleted: false
  }
]

/**
 * Get step by ID
 * @param {number} stepId - The step ID
 * @returns {Object|null} Step object or null
 */
export const getStepById = (stepId) => {
  return WELCOME_STEPS.find(step => step.id === stepId) || null
}

/**
 * Get current step index
 * @param {number} currentStep - Current step number
 * @returns {number} Step index (0-based)
 */
export const getStepIndex = (currentStep) => {
  return Math.max(0, currentStep - 1)
}

/**
 * Check if step is valid
 * @param {number} stepId - The step ID
 * @returns {boolean} Whether step is valid
 */
export const isValidStep = (stepId) => {
  return stepId >= 1 && stepId <= WELCOME_STEPS.length
}

/**
 * Get total number of steps
 * @returns {number} Total steps
 */
export const getTotalSteps = () => {
  return WELCOME_STEPS.length
}

/**
 * Get step progress percentage
 * @param {number} currentStep - Current step number
 * @returns {number} Progress percentage (0-100)
 */
export const getStepProgress = (currentStep) => {
  const total = getTotalSteps()
  return Math.round((currentStep / total) * 100)
}

/**
 * Check if welcome is complete
 * @param {number} currentStep - Current step number
 * @returns {boolean} Whether welcome is complete
 */
export const isWelcomeComplete = (currentStep) => {
  return currentStep > getTotalSteps()
}

/**
 * Get next step number
 * @param {number} currentStep - Current step number
 * @returns {number} Next step number
 */
export const getNextStep = (currentStep) => {
  return Math.min(currentStep + 1, getTotalSteps() + 1)
}

/**
 * Get previous step number
 * @param {number} currentStep - Current step number
 * @returns {number} Previous step number
 */
export const getPreviousStep = (currentStep) => {
  return Math.max(currentStep - 1, 1)
}

/**
 * Get step navigation state
 * @param {number} currentStep - Current step number
 * @returns {Object} Navigation state
 */
export const getStepNavigationState = (currentStep) => {
  return {
    canGoBack: currentStep > 1,
    canGoNext: currentStep < getTotalSteps(),
    canComplete: currentStep === getTotalSteps(),
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === getTotalSteps()
  }
} 