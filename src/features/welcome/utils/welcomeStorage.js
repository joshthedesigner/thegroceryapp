// Re-export user preferences functions from consolidated location
export {
  getUserPreferences,
  updateUserPreferences,
  markWelcomeSeen,
  updateWelcomeStep,
  getLocalWelcomeState,
  setLocalWelcomeState,
  hasUserSeenWelcome
} from '../../../services/userPreferences' 