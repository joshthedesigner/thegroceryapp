import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useWelcomeContext } from '../features/welcome/context/WelcomeContext'
import LoadingSpinner from './LoadingSpinner'
import Layout from './Layout'
import Dashboard from '../pages/Dashboard'
import Ingredients from '../pages/Ingredients'
import Meals from '../pages/Meals'

/**
 * Authenticated App Component
 * Handles routing for authenticated users and prevents Layout flash during loading
 */
const AuthenticatedApp = ({ user, authLoading }) => {
  const { isLoading: welcomeLoading } = useWelcomeContext()

  // Show loading state while determining authentication and welcome status
  if (authLoading || welcomeLoading) {
    return <LoadingSpinner message="Loading..." variant="immersive" />
  }

  // AuthenticationGuard handles all redirects, so we can just render the main app
  return (
    <Layout user={user}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/ingredients" element={<Ingredients user={user} />} />
        <Route path="/meals" element={<Meals user={user} />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  )
}

export default AuthenticatedApp 