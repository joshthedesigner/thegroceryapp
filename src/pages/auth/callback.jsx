import React, { useEffect } from 'react'
import { Spin, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'

const { Text } = Typography

function parseHash(hash) {
  return hash
    .substring(1)
    .split('&')
    .reduce((acc, part) => {
      const [key, value] = part.split('=')
      acc[key] = decodeURIComponent(value)
      return acc
    }, {})
}

const AuthCallback = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuth = async () => {
      if (window.location.hash) {
        const params = parseHash(window.location.hash)
        if (params.access_token && params.refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          })
          if (error) {
            console.error('Error setting session:', error)
            navigate('/login', { replace: true })
          } else {
            navigate('/dashboard', { replace: true })
          }
        } else {
          navigate('/login', { replace: true })
        }
      } else {
        navigate('/login', { replace: true })
      }
    }
    handleAuth()
  }, [navigate])

  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Spin size="large" />
      <Text style={{ marginTop: 24, color: '#888' }}>Signing you in…</Text>
    </div>
  )
}

export default AuthCallback 