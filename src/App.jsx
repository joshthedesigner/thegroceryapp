import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { supabase, getCurrentUser } from './services/supabase'
import { validateEnv } from './config/env'
import LoadingSpinner from './components/LoadingSpinner'
import { WelcomeProvider } from './features/welcome/context/WelcomeContext'
import AuthenticationGuard from './components/AuthenticationGuard'
import AuthenticatedApp from './components/AuthenticatedApp'

// Force deployment to clear caching issues - API now working with ingredients - Meal costs fixed - Line graph should show consumed values - Ingredient usage needs fixing

// Import pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Ingredients from './pages/Ingredients'
import Meals from './pages/Meals'
import Layout from './components/Layout'

// Import welcome feature
import WelcomeScreen from './features/welcome/components/WelcomeScreen'

// Import styles
import 'antd/dist/reset.css'
import './styles/App.css'

// OAuth Callback Component
const AuthCallback = () => {
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Auth callback error:', error)
        }
        // The auth state will be updated automatically by the listener in App.jsx
      } catch (error) {
        console.error('Auth callback error:', error)
      }
    }

    handleAuthCallback()
  }, [])

  return (
    <div style={{ 
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
      width: '100%'
    }}>
      <LoadingSpinner message="Completing authentication..." variant="immersive" />
    </div>
  )
}

// Error Boundary Component
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const handleError = (error) => {
      console.error('App error:', error)
      setError(error)
      setHasError(true)
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleError)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleError)
    }
  }, [])

  if (hasError) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2>Something went wrong</h2>
        <p>Please check your environment configuration and try again.</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '10px 20px',
            background: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reload Page
        </button>
      </div>
    )
  }

  return children
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [envError, setEnvError] = useState(false)

  // Debug log to verify component is rendering
  console.log('App component rendering - user:', user, 'loading:', loading)

  // Check for test user session
  const isTestUser = localStorage.getItem('test-user') === 'true'

  useEffect(() => {
    // Validate environment variables
    try {
      const envValid = validateEnv()
      if (!envValid) {
        console.warn('Environment validation failed, but continuing in development mode')
      }
    } catch (error) {
      console.error('Environment validation error:', error)
      setEnvError(true)
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        // Check for test user first
        if (isTestUser) {
          console.log('Test user session detected')
          setUser({ id: 'test-user', email: 'test@example.com' })
          setLoading(false)
          return
        }
        
        const { user } = await getCurrentUser()
        setUser(user)
      } catch (error) {
        console.warn('Authentication error:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes (only if not test user)
    if (!isTestUser) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null)
          setLoading(false)
        }
      )
      return () => subscription.unsubscribe()
    }
  }, [])

  // Loading is now handled by AuthenticationGuard for authenticated users
  // Only show loading for unauthenticated users
  if (loading && !user) {
    return (
      <div style={{ 
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        width: '100%'
      }}>
        <LoadingSpinner message="Loading..." variant="immersive" />
      </div>
    )
  }

  if (envError) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2>Configuration Error</h2>
        <p>Missing required environment variables. Please check your Supabase configuration.</p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
        </p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
          },
        }}
      >
        <WelcomeProvider userId={user?.id}>
          <Router>
            <div className="App">
              {user ? (
                <Routes>
                  {/* Welcome Screen Route */}
                  <Route path="/welcome" element={<WelcomeScreen user={user} />} />
                  
                  {/* Main App Routes - Use AuthenticatedApp to prevent Layout flash */}
                  <Route path="/*" element={
                    <AuthenticationGuard user={user} authLoading={loading}>
                      <AuthenticatedApp user={user} authLoading={loading} />
                    </AuthenticationGuard>
                  } />
                </Routes>
              ) : (
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              )}
            </div>
          </Router>
        </WelcomeProvider>
      </ConfigProvider>
    </ErrorBoundary>
  )
}

export default App 