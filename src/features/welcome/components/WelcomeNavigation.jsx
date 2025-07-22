// Welcome Navigation Component

import React from 'react'

/**
 * Welcome Navigation Component
 * Handles step navigation and main CTA
 */
const WelcomeNavigation = ({
  currentStep,
  totalSteps,
  canGoBack,
  canGoNext,
  isLastStep,
  onNext,
  onPrevious,
  onComplete,
  onSkip
}) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 0',
      marginTop: '2rem',
      borderTop: '1px solid #e2e8f0'
    }}>
      {/* Left side - Back button */}
      <div style={{ flex: 1 }}>
        {canGoBack && (
          <button
            onClick={onPrevious}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              color: '#64748b',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f8fafc'
              e.currentTarget.style.borderColor = '#9ca3af'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = '#d1d5db'
            }}
          >
            ← Back
          </button>
        )}
      </div>

      {/* Center - Skip button */}
      <div style={{ flex: 1, textAlign: 'center' }}>
        <button
          onClick={onSkip}
          style={{
            padding: '8px 16px',
            background: 'transparent',
            color: '#64748b',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            textDecoration: 'underline',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#374151'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#64748b'
          }}
        >
          Skip
        </button>
      </div>

      {/* Right side - Next/Complete button */}
      <div style={{ flex: 1, textAlign: 'right' }}>
        {isLastStep ? (
          // Main CTA for last step
          <button
            onClick={onComplete}
            style={{
              padding: '12px 24px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#059669'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#10b981'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            Let's Get Started
          </button>
        ) : (
          // Next button for other steps
          <button
            onClick={onNext}
            disabled={!canGoNext}
            style={{
              padding: '8px 16px',
              background: canGoNext ? '#10b981' : '#e2e8f0',
              color: canGoNext ? 'white' : '#9ca3af',
              border: 'none',
              borderRadius: '6px',
              cursor: canGoNext ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (canGoNext) {
                e.currentTarget.style.background = '#059669'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={(e) => {
              if (canGoNext) {
                e.currentTarget.style.background = '#10b981'
                e.currentTarget.style.transform = 'translateY(0)'
              }
            }}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}

export default WelcomeNavigation 