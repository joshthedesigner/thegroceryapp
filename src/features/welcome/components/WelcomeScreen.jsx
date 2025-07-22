// Welcome Screen Component

import React, { useEffect } from 'react'
import { Button, Avatar, Dropdown } from 'antd'
import { useWelcomeContext } from '../context/WelcomeContext'
import WelcomeStep from './WelcomeStep'
import { signOut } from '../../../services/supabase'
import LoadingSpinner from '../../../components/LoadingSpinner'

/**
 * Main Welcome Screen Component
 * Standalone page that appears only on first login
 */
const WelcomeScreen = ({ user }) => {
  const {
    isLoading,
    error,
    currentStep,
    skipWelcome,
    markWelcomeSeen,
    resetWelcome
  } = useWelcomeContext()

  // This is now a dedicated page, so we don't need conditional rendering
  console.log('Welcome screen page loaded')

  // Debug: Check for reset parameter
  useEffect(() => {
    const resetWelcome = new URLSearchParams(window.location.search).get('reset') === 'true'
    if (resetWelcome) {
      console.log('Resetting welcome state from URL parameter')
      resetWelcome()
    }
  }, [resetWelcome])

  // Show loading state
  if (isLoading) {
    return <LoadingSpinner message="Loading welcome screen..." variant="immersive" />
  }

  // Show error state
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div>Error: {error}</div>
          <Button 
            onClick={skipWelcome}
            style={{ marginTop: '1rem' }}
          >
            Skip Welcome
          </Button>
        </div>
      </div>
    )
  }

  const handleComplete = async () => {
    console.log('Get Started button clicked, currentStep:', currentStep)
    
    // Since there's only 1 step, always complete the welcome
    const success = await markWelcomeSeen()
    if (success) {
      console.log('Welcome screen completed')
      // Clear test user session if it exists
      if (localStorage.getItem('test-user') === 'true') {
        localStorage.removeItem('test-user')
      }
      // Navigate to dashboard
      window.location.href = '/dashboard'
    } else {
      console.error('Failed to mark welcome as seen')
    }
  }

  const handleSkipWelcome = async () => {
    if (!skipWelcome) {
      console.error('skipWelcome function not available')
      return
    }
    
    const success = await skipWelcome()
    if (success) {
      console.log('Welcome screen skipped')
      // Clear test user session if it exists
      if (localStorage.getItem('test-user') === 'true') {
        localStorage.removeItem('test-user')
      }
      // Navigate to dashboard
      window.location.href = '/dashboard'
    }
  }

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profile',
    },
    {
      key: 'logout',
      label: 'Logout',
      onClick: async () => {
        try {
          const { error } = await signOut()
          if (error) {
            console.error('Logout error:', error)
          } else {
            window.location.href = '/login'
          }
        } catch (error) {
          console.error('Logout error:', error)
        }
      },
    },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Navigation Bar */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        height: '64px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ 
              color: '#1890ff', 
              margin: 0, 
              marginRight: 48,
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              Grocery Tracker
            </h1>
          </div>
          
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
            trigger={['click']}
            overlayStyle={{ marginTop: -4 }}
          >
            <Button 
              type="text" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8,
                height: 'auto',
                padding: '8px 12px',
                background: 'none',
                boxShadow: 'none',
                outline: 'none',
                border: 'none',
                transition: 'none',
              }}
            >
              <Avatar 
                size="small" 
                src={user?.user_metadata?.avatar_url}
                style={{ backgroundColor: '#1890ff', color: '#fff', fontWeight: 600 }}
              >
                {user?.user_metadata?.full_name
                  ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
                  : user?.email?.[0]?.toUpperCase()}
              </Avatar>
              <span>{user?.user_metadata?.full_name || user?.email}</span>
              <span style={{ fontSize: 12, marginLeft: 4, color: '#888' }}>▼</span>
            </Button>
          </Dropdown>
        </div>
      </div>

      {/* Welcome Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        maxWidth: '1000px',
        margin: '0 auto',
        minHeight: 'calc(100vh - 64px)',
        textAlign: 'center',
        width: '100%'
      }}>
        {/* Step Content */}
        <WelcomeStep 
          stepNumber={currentStep}
          isActive={true}
          onComplete={handleComplete}
        />
      </div>
    </div>
  )
}

export default WelcomeScreen 