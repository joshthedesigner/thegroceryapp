import React from 'react'
import { Card, Radio, Button, Space, Typography } from 'antd'
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
 * @param {Object} props.style - Custom styles for the Radio.Group container
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

  const Content = () => (
    <Space direction="vertical" style={{ width: '100%', ...style }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong>{label}</Text>
        </div>
      )}
      
      <Radio.Group 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        buttonStyle="solid"
        size="small"
      >
        {options.map(option => (
          <Radio.Button key={option.value} value={option.value}>
            {option.label}
          </Radio.Button>
        ))}
      </Radio.Group>
      
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