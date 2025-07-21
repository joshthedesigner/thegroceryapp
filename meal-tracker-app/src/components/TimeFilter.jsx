import React from 'react'
import { Card, Radio, Button, Space, Typography } from 'antd'
import { LeftOutlined, RightOutlined, ReloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const { Text } = Typography

const TimeFilter = ({ 
  timeFilter = 'all', 
  onTimeFilterChange, 
  onNavigate,
  currentPeriod = 0 
}) => {
  const getPeriodDisplay = () => {
    const now = dayjs()
    
    switch (timeFilter) {
      case 'week':
        const weekStart = now.subtract(7 * currentPeriod, 'day').startOf('week')
        const weekEnd = now.subtract(7 * currentPeriod, 'day').endOf('week')
        return `${weekStart.format('MMM DD')} - ${weekEnd.format('MMM DD, YYYY')}`
      case 'month':
        const monthDate = now.subtract(30 * currentPeriod, 'day')
        return monthDate.format('MMMM YYYY')
      case 'year':
        const yearDate = now.subtract(12 * currentPeriod, 'month')
        return yearDate.format('YYYY')
      default:
        return 'All Time'
    }
  }

  const handleNavigate = (direction) => {
    if (onNavigate) {
      onNavigate(direction)
    }
  }

  const handleReset = () => {
    if (onNavigate) {
      onNavigate('reset')
    }
  }

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong>Time Period</Text>
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              size="small"
              onClick={handleReset}
              disabled={timeFilter === 'all'}
            >
              Reset
            </Button>
          </Space>
        </div>
        
        <Radio.Group 
          value={timeFilter} 
          onChange={(e) => onTimeFilterChange(e.target.value)}
          buttonStyle="solid"
          size="small"
        >
          <Radio.Button value="week">Week</Radio.Button>
          <Radio.Button value="month">Month</Radio.Button>
          <Radio.Button value="year">Year</Radio.Button>
          <Radio.Button value="all">All Time</Radio.Button>
        </Radio.Group>
        
        {timeFilter !== 'all' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button 
              icon={<LeftOutlined />} 
              size="small"
              onClick={() => handleNavigate('prev')}
            >
              Previous
            </Button>
            
            <Text strong style={{ fontSize: '14px' }}>
              {getPeriodDisplay()}
            </Text>
            
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
    </Card>
  )
}

export default TimeFilter 