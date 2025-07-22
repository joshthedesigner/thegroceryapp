// Welcome Guard Component
// Prevents dashboard rendering for new users and shows loading state instead

import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useWelcomeContext } from '../context/WelcomeContext'
import LoadingSpinner from '../../../components/LoadingSpinner'

/**
 * Welcome Guard Component
 * Guards against dashboard flash for new users
 */
const WelcomeGuard = ({ children }) => {
  const { isWelcomeActive, isLoading, hasSeenWelcome } = useWelcomeContext()
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

    // If still loading, don't render anything yet
    if (isLoading) {
      setShouldRender(false)
      return
    }

    // If welcome is active or forced, redirect to welcome
    if (isWelcomeActive || forceWelcome) {
      console.log('WelcomeGuard: Redirecting to welcome page')
      navigate('/welcome')
      setShouldRender(false)
      return
    }

    // If user has seen welcome, allow rendering
    if (hasSeenWelcome === true) {
      console.log('WelcomeGuard: User has seen welcome, allowing dashboard')
      setShouldRender(true)
      return
    }

    // If user hasn't seen welcome but we're not loading, redirect
    if (hasSeenWelcome === false) {
      console.log('WelcomeGuard: User hasn\'t seen welcome, redirecting')
      navigate('/welcome')
      setShouldRender(false)
      return
    }

    // Default: don't render until we know the state
    setShouldRender(false)
  }, [isWelcomeActive, isLoading, hasSeenWelcome, location.pathname, navigate, forceWelcome])

  // Show loading state while determining welcome status
  if (!shouldRender) {
    return <LoadingSpinner message="Loading..." variant="immersive" />
  }

  return children
}

export default WelcomeGuard 