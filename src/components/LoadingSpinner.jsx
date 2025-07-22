import React from 'react'
import { Spin, Typography } from 'antd'

const { Text } = Typography

/**
 * Unified Loading Spinner Component
 * Provides consistent loading UI across the entire application
 */
const LoadingSpinner = ({ 
  message = 'Loading...', 
  variant = 'default',
  size = 'large'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'card':
        return {
          container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f5f5f5'
          },
          content: {
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }
        }
      
      case 'padded':
        return {
          container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          },
          content: {
            textAlign: 'center',
            padding: '40px'
          }
        }
      
      case 'default':
      default:
        return {
          container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          },
          content: {
            textAlign: 'center'
          }
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <Spin size={size} />
        <div style={{ marginTop: 16 }}>
          <Text>{message}</Text>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner 