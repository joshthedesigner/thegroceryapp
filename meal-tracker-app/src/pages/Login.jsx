import React from 'react'
import { Card, Button, Typography, Space, Divider } from 'antd'
import { GoogleOutlined } from '@ant-design/icons'
import { signInWithGoogle } from '../services/supabase'

const { Title, Text } = Typography

const Login = () => {
  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        console.error('Login error:', error)
      }
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px'
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
              Meal Tracker
            </Title>
            <Text type="secondary">
              Track your ingredients, meals, and reduce food waste
            </Text>
          </div>

          <Divider />

          <div>
            <Title level={4} style={{ margin: '0 0 16px 0' }}>
              Welcome Back
            </Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
              Sign in to continue tracking your meals and ingredients
            </Text>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<GoogleOutlined />}
            onClick={handleGoogleLogin}
            style={{
              width: '100%',
              height: '48px',
              fontSize: '16px',
              borderRadius: '8px'
            }}
          >
            Continue with Google
          </Button>

          <div style={{ marginTop: '24px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  )
}

export default Login 