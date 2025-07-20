import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { supabase, getCurrentUser } from './services/supabase'
import { validateEnv } from './config/env'

// Import pages (we'll create these next)
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Ingredients from './pages/Ingredients'
import Meals from './pages/Meals'
import Layout from './components/Layout'

// Import styles
import 'antd/dist/reset.css'
import './styles/App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Validate environment variables
    validateEnv()

    // Get initial session
    const getInitialSession = async () => {
      const { user } = await getCurrentUser()
      setUser(user)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  // Demo mode for testing without Supabase credentials
  const isDemoMode = false // Disabled since real credentials are available

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <Router>
        <div className="App">
          {user ? (
            <Layout user={user}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard user={user} />} />
                <Route path="/ingredients" element={<Ingredients user={user} />} />
                <Route path="/meals" element={<Meals user={user} />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          )}
        </div>
      </Router>
    </ConfigProvider>
  )
}

export default App 