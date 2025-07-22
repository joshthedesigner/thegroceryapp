// Welcome Redirect Component

import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useWelcomeContext } from '../context/WelcomeContext'

/**
 * Welcome Redirect Component
 * Handles routing logic for welcome screen
 */
const WelcomeRedirect = ({ children }) => {
  const { isWelcomeActive, isLoading } = useWelcomeContext()
  const navigate = useNavigate()
  const location = useLocation()

  // Debug: Force welcome screen for testing
  const forceWelcome = new URLSearchParams(window.location.search).get('welcome') === 'true'

  useEffect(() => {
    // Don't redirect if we're already on the welcome page
    if (location.pathname === '/welcome') {
      return
    }

    // Don't redirect if we're on login or auth pages
    if (location.pathname === '/login' || location.pathname.startsWith('/auth/')) {
      return
    }

    // If welcome is active and we're not on the welcome page, redirect
    if ((isWelcomeActive || forceWelcome) && !isLoading) {
      console.log('Redirecting to welcome page')
      navigate('/welcome')
      return
    }

    // If welcome is not active and we're on the welcome page, redirect to dashboard
    if (!isWelcomeActive && !isLoading && location.pathname === '/welcome') {
      console.log('Redirecting to dashboard')
      navigate('/dashboard')
      return
    }
  }, [isWelcomeActive, isLoading, location.pathname, navigate, forceWelcome])

  // If we're on the welcome page, don't render children
  if (location.pathname === '/welcome') {
    return null
  }

  return children
}

export default WelcomeRedirect 