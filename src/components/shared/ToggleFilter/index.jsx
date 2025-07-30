import React from 'react'
import { Card, Button, Space, Typography } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'

const { Text } = Typography

/**
 * Shared toggle filter component that can be used with or without navigation
 * @param {Object} props
 * @param {string} props.value - Current selected value
 * @param {function} props.onChange - Change handler function
 * @param {Array} props.options - Array of { value, label } objects
 * @param {boolean} props.showCard - Whether to wrap in Card component
 * @param {boolean} props.showNavigation - Whether to show navigation buttons
 * @param {string} props.periodDisplay - Text to display for current period
 * @param {function} props.onNavigate - Navigation handler function
 * @param {string} props.label - Optional header text
 * @param {Object} props.style - Custom styles for the toggle container
 */
const ToggleFilter = ({ 
  value,
  onChange,
  options = [],
  showCard = true,
  showNavigation = false,
  periodDisplay = null,
  onNavigate = null,
  label = null,
  style = {}
}) => {
  const handleNavigate = (direction) => {
    if (onNavigate) {
      onNavigate(direction)
    }
  }

  // Custom toggle implementation
  const CustomToggle = (
    <div style={{
      background: 'rgb(228, 230, 235)',
      borderRadius: '16px',
      padding: '6px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      minWidth: 'fit-content',
      maxWidth: '100%',
      overflow: 'hidden',
      ...style
    }}>
      {options.map((option, index) => {
        const isSelected = value === option.value;
        return (
          <div
            key={option.value}
            onClick={() => onChange(option.value)}
            style={{
              backgroundColor: isSelected ? '#ffffff' : 'transparent',
              color: '#000000',
              padding: '8px 16px',
              borderRadius: isSelected ? '8px' : '0',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '24px',
              minWidth: '80px',
              transition: 'background-color 0.2s ease, border-radius 0.2s ease',
              userSelect: 'none',
              boxShadow: isSelected ? '0 1px 2px rgba(0, 0, 0, 0.06)' : 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {option.label}
          </div>
        );
      })}
    </div>
  )

  // Return simple toggle if no card or navigation needed
  if (!showCard && !showNavigation && !label) {
    return CustomToggle
  }

  // Full featured view with card and/or navigation
  const Content = () => (
    <Space direction="vertical" style={{ width: '100%' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong>{label}</Text>
        </div>
      )}
      
      {CustomToggle}
      
      {showNavigation && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button 
            icon={<LeftOutlined />} 
            size="small"
            onClick={() => handleNavigate('prev')}
          >
            Previous
          </Button>
          
          {periodDisplay && (
            <Text strong style={{ fontSize: '14px' }}>
              {periodDisplay}
            </Text>
          )}
          
          <Button 
            icon={<RightOutlined />} 
            size="small"
            onClick={() => handleNavigate('next')}
          >
            Next
          </Button>
        </div>
      )}
    </Space>
  )

  if (showCard) {
    return (
      <Card size="small" style={{ marginBottom: 16, paddingTop: 12, paddingBottom: 12 }}>
        <Content />
      </Card>
    )
  }

  return <Content />
}

export default ToggleFilter 