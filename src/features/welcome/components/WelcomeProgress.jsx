// Welcome Progress Component

import React from 'react'
import { WELCOME_STEPS } from '../utils/welcomeSteps'

/**
 * Welcome Progress Component
 * Shows step indicators and progress bar
 */
const WelcomeProgress = ({ currentStep, totalSteps, progress }) => {
  return (
    <div style={{
      marginBottom: '2rem',
      padding: '0 1rem'
    }}>
      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: '4px',
        backgroundColor: '#e2e8f0',
        borderRadius: '2px',
        marginBottom: '1rem',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: '#10b981',
          borderRadius: '2px',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Step Indicators */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem'
      }}>
        {WELCOME_STEPS.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep
          
          return (
            <div
              key={step.id}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: isCompleted 
                  ? '#10b981' 
                  : isActive 
                    ? '#10b981' 
                    : '#e2e8f0',
                border: isActive ? '2px solid #059669' : 'none',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              {/* Tooltip for step name */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#1e293b',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                opacity: isActive ? 1 : 0,
                transition: 'opacity 0.2s ease',
                pointerEvents: 'none',
                zIndex: 10
              }}>
                {step.title}
              </div>
            </div>
          )
        })}
      </div>

      {/* Step Counter */}
      <div style={{
        textAlign: 'center',
        marginTop: '0.5rem',
        fontSize: '14px',
        color: '#64748b'
      }}>
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  )
}

export default WelcomeProgress 