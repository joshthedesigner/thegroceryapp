import React from 'react'
import { Button } from 'antd'
import { GoogleOutlined } from '@ant-design/icons'
import { signInWithGoogle } from '../services/supabase'

const VALUE_PROPS = [
  {
    icon: '📊',
    title: 'Visualize your ingredient costs',
    desc: 'Track spend trends and optimize your grocery budget.'
  },
  {
    icon: '🛒',
    title: 'Reduce waste',
    desc: 'Spot unused ingredients before they expire.'
  },
  {
    icon: '📈',
    title: 'Optimize meals',
    desc: 'Connect purchases to real impact.'
  },
]

const Login = () => {
  React.useEffect(() => {
    document.body.style.background = '#fff';
    return () => { document.body.style.background = '' }
  }, [])

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
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, Satoshi, DM Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        background: '#fff',
        transition: 'background 0.3s',
        padding: '0 12px',
      }}
    >
      {/* Hero Card */}
      <div
        style={{
          background: '#fff',
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
          borderRadius: 32,
          border: '1.5px solid #F1F5F9',
          padding: '56px 40px 40px 40px',
          minWidth: 340,
          maxWidth: 420,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 48,
          marginBottom: 32,
          animation: 'fadeInUp 1s cubic-bezier(.4,0,.2,1)',
        }}
      >
        {/* Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, background: '#fff', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(34,197,94,0.10)', border: '2.5px solid #22C55E' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              {/* Circle background */}
              <circle cx="16" cy="16" r="14" fill="#fff" stroke="#22C55E" strokeWidth="2.5"/>
              {/* Cart body */}
              <rect x="9" y="15" width="14" height="7" rx="3.5" fill="none" stroke="#22C55E" strokeWidth="2"/>
              {/* Cart handle */}
              <path d="M9 15c0-3 14-3 14 0" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"/>
              {/* Wheels */}
              <circle cx="12" cy="24" r="1.2" fill="#22C55E"/>
              <circle cx="20" cy="24" r="1.2" fill="#22C55E"/>
              {/* Checkmark inside cart */}
              <path d="M13.5 18.5l2 2 4-4" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontWeight: 900, fontSize: 32, color: '#232946', letterSpacing: -1 }}>GroceryTracker</span>
        </div>
        {/* Headline */}
        <h1
          style={{
            fontWeight: 900,
            fontSize: 38,
            color: '#232946',
            marginBottom: 12,
            letterSpacing: -2,
            lineHeight: 1.1,
            textAlign: 'center',
          }}
        >
          Turn your groceries<br />into insight.
        </h1>
        <p
          style={{
            color: '#6B7280',
            fontSize: 20,
            fontWeight: 500,
            marginBottom: 36,
            textAlign: 'center',
            maxWidth: 340,
          }}
        >
          Track ingredient usage, cost, and impact — all in one place.
        </p>
        {/* Google Login Button */}
        <Button
          type="primary"
          size="large"
          icon={<GoogleOutlined />}
          onClick={handleGoogleLogin}
          style={{
            background: '#22C55E',
            border: 'none',
            color: '#fff',
            fontWeight: 700,
            fontSize: 18,
            borderRadius: 999,
            padding: '0 44px',
            boxShadow: '0 2px 12px rgba(34,197,94,0.10)',
            transition: 'transform 0.15s, box-shadow 0.15s, background 0.2s',
            height: 56,
            outline: 'none',
            marginBottom: 8,
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'scale(1.045)';
            e.currentTarget.style.background = '#16A34A';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = '#22C55E';
          }}
        >
          Sign in with Google
        </Button>
      </div>
      {/* Value Props Section */}
      <div style={{
        display: 'flex',
        gap: 32,
        marginBottom: 32,
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 900,
        animation: 'fadeInUp 1.2s cubic-bezier(.4,0,.2,1)',
      }}>
        {VALUE_PROPS.map((prop, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              minWidth: 180,
              maxWidth: 260,
              background: '#fff',
              borderRadius: 20,
              boxShadow: '0 2px 12px rgba(31,38,135,0.06)',
              padding: '28px 18px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '1px solid #F1F5F9',
              marginBottom: 6,
              fontSize: 16,
              textAlign: 'center',
            }}
          >
            <div style={{ marginBottom: 12, fontSize: 28 }}>{prop.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 17, color: '#232946', marginBottom: 6 }}>{prop.title}</div>
            <div style={{ color: '#6B7280', fontSize: 15 }}>{prop.desc}</div>
          </div>
        ))}
      </div>
      {/* Animations and Responsive Styles */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          div[style*='max-width: 900px'] {
            flex-direction: column !important;
            gap: 18px !important;
            align-items: center !important;
          }
        }
        @media (max-width: 600px) {
          div[style*='min-width: 340px'] {
            min-width: 0 !important;
            max-width: 98vw !important;
            padding: 32px 6vw 24px 6vw !important;
          }
          h1 {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Login 