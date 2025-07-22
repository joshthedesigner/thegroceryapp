import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useWelcomeContext } from '../features/welcome/context/WelcomeContext'
import LoadingSpinner from './LoadingSpinner'

/**
 * Authentication Guard Component
 * Combines authentication loading with welcome status check
 * to eliminate multiple loading spinners for existing users
 */
const AuthenticationGuard = ({ children, user, authLoading }) => {
  const { isWelcomeActive, isLoading: welcomeLoading, hasSeenWelcome } = useWelcomeContext()
  const navigate = useNavigate()
  const location = useLocation()
  const [shouldRender, setShouldRender] = useState(false)

  // Debug: Force welcome screen for testing
  const forceWelcome = new URLSearchParams(window.location.search).get('welcome') === 'true'

  useEffect(() => {
    // Don't guard if we're already on the welcome page
    if (location.pathname === '/welcome') {
      setShouldRender(false)
      return
    }

    // Don't guard if we're on login or auth pages
    if (location.pathname === '/login' || location.pathname.startsWith('/auth/')) {
      setShouldRender(true)
      return
    }

    // If still loading authentication, don't render anything yet
    if (authLoading) {
      setShouldRender(false)
      return
    }

    // If welcome is still loading, don't render anything yet
    if (welcomeLoading) {
      setShouldRender(false)
      return
    }

    // If welcome is active or forced, redirect to welcome
    if (isWelcomeActive || forceWelcome) {
      console.log('AuthenticationGuard: Redirecting to welcome page')
      navigate('/welcome')
      setShouldRender(false)
      return
    }

    // If user has seen welcome, allow rendering
    if (hasSeenWelcome === true) {
      console.log('AuthenticationGuard: User has seen welcome, allowing dashboard')
      setShouldRender(true)
      return
    }

    // If user hasn't seen welcome but we're not loading, redirect
    if (hasSeenWelcome === false) {
      console.log('AuthenticationGuard: User hasn\'t seen welcome, redirecting')
      navigate('/welcome')
      setShouldRender(false)
      return
    }

    // Default: don't render until we know the state
    setShouldRender(false)
  }, [isWelcomeActive, welcomeLoading, hasSeenWelcome, location.pathname, navigate, forceWelcome, authLoading])

  // Show loading state while determining authentication and welcome status
  if (!shouldRender) {
    return <LoadingSpinner message="Loading..." variant="card" />
  }

  return children
}

export default AuthenticationGuard 