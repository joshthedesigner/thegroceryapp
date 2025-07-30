// Welcome Step Component

import React from 'react'
import { Tag, Button, Card } from 'antd'
import { ShoppingCartOutlined, CoffeeOutlined, DashboardOutlined } from '@ant-design/icons'
import { WELCOME_STEPS, getStepById } from '../utils/welcomeSteps'

/**
 * Individual Welcome Step Component
 * Displays step content with center-aligned layout
 */
const WelcomeStep = ({ stepNumber, isActive, onComplete, isMobile = false }) => {
  const step = getStepById(stepNumber)
  
  if (!step) {
    return (
      <div style={{ textAlign: 'center', padding: isMobile ? '1rem' : '2rem' }}>
        <p>Step not found</p>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: isMobile ? '1rem 0' : '2rem 0',
      minHeight: isMobile ? '300px' : '400px',
      justifyContent: 'center'
    }}>


      {/* Header */}
      <h2 style={{
        fontSize: isMobile ? '2rem' : '2.5rem',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '1rem',
        animation: isActive ? 'fadeInUp 0.6s ease-out' : 'none'
      }}>
        {step.title}
      </h2>

      {/* Subheader */}
      <p style={{
        fontSize: isMobile ? '1rem' : '1.2rem',
        color: '#64748b',
        marginBottom: '2.5rem',
        lineHeight: '1.6',
        maxWidth: '700px',
        animation: isActive ? 'fadeInUp 0.6s ease-out 0.1s both' : 'none'
      }}>
        {step.description}
      </p>

      {/* Simplified Guidance */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '1rem' : '2rem',
        marginBottom: isMobile ? '2rem' : '3rem',
        maxWidth: '1000px',
        animation: isActive ? 'fadeInUp 0.6s ease-out 0.2s both' : 'none',
        justifyContent: 'center'
      }}>
        <Card 
          style={{ 
            width: isMobile ? '280px' : '308px',
            height: isMobile ? '220px' : '248px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            background: '#fff',
            padding: '12px'
          }}
        >
          <Tag 
            color="blue" 
            style={{ 
              marginBottom: '1rem',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}
          >
            Step 1
          </Tag>
          <h3 style={{
            fontSize: isMobile ? '1rem' : '1.1rem',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0 0 1rem 0',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <ShoppingCartOutlined style={{ fontSize: '1.5rem', color: '#6b7280' }} />
            Add your Ingredients
          </h3>
          <p style={{
            fontSize: isMobile ? '0.85rem' : '0.95rem',
            color: '#475569',
            lineHeight: '1.5',
            margin: 0,
            textAlign: 'center'
          }}>
            Go to the <strong>Ingredients tab</strong> and add any ingredients you purchased this week with their costs.
          </p>
        </Card>
        
        <Card 
          style={{ 
            width: isMobile ? '280px' : '308px',
            height: isMobile ? '220px' : '248px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            background: '#fff',
            padding: '12px'
          }}
        >
          <Tag 
            color="green" 
            style={{ 
              marginBottom: '1rem',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}
          >
            Step 2
          </Tag>
          <h3 style={{
            fontSize: isMobile ? '1rem' : '1.1rem',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0 0 1rem 0',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <CoffeeOutlined style={{ fontSize: '1.5rem', color: '#6b7280' }} />
            Log your Meals
          </h3>
          <p style={{
            fontSize: isMobile ? '0.85rem' : '0.95rem',
            color: '#475569',
            lineHeight: '1.5',
            margin: 0,
            textAlign: 'center'
          }}>
            Once you have ingredients, log your first meal in the <strong>Meals page</strong> to track usage.
          </p>
        </Card>
        
        <Card 
          style={{ 
            width: isMobile ? '280px' : '308px',
            height: isMobile ? '240px' : '248px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            background: '#fff',
            padding: '12px 12px 20px 12px'
          }}
        >
          <Tag 
            color="orange" 
            style={{ 
              marginBottom: '1rem',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}
          >
            Step 3
          </Tag>
          <h3 style={{
            fontSize: isMobile ? '1rem' : '1.1rem',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0 0 1rem 0',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <DashboardOutlined style={{ fontSize: '1.5rem', color: '#6b7280' }} />
            Explore your Dashboard
          </h3>
          <p style={{
            fontSize: isMobile ? '0.85rem' : '0.95rem',
            color: '#475569',
            lineHeight: '1.5',
            margin: 0,
            textAlign: 'center'
          }}>
            Check the <strong>Dashboard</strong> to see your spending and usage patterns. More entries = better insights.
          </p>
        </Card>
      </div>

      {/* Main CTA Button */}
      <Button
        type="primary"
        size="large"
        onClick={onComplete}
        style={{
          padding: '0 32px',
          fontSize: isMobile ? '1rem' : '1.1rem',
          fontWeight: '700',
          height: '48px',
          animation: isActive ? 'fadeInUp 0.6s ease-out 0.3s both' : 'none'
        }}
      >
        Get Started
      </Button>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default WelcomeStep 