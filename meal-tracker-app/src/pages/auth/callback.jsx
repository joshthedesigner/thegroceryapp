import React, { useEffect } from 'react'
import { Spin, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../../services/supabase'

const { Text } = Typography

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Attempt to fetch the current user and redirect
    const checkAuth = async () => {
      const { user } = await getCurrentUser()
      if (user) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    }
    checkAuth()
  }, [navigate])

  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Spin size="large" />
      <Text style={{ marginTop: 24, color: '#888' }}>Signing you in…</Text>
    </div>
  )
}

export default AuthCallback 