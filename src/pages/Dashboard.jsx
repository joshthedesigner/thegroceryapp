import React, { useState } from 'react'
import { Typography, Row, Col, Alert, Button } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useIngredients } from '../hooks/useIngredients'
import { useMeals } from '../hooks/useMeals'
import DashboardMetrics from '../components/DashboardMetrics'
import TimeFilter from '../components/TimeFilter'
import TrendsGraph from '../components/TrendsGraph'
import DashboardTable from '../components/DashboardTable'
import MetricDetailsModal from '../components/MetricDetailsModal'
import dayjs from 'dayjs'
import PeriodSelector from '../components/PeriodSelector'
import LoadingSpinner from '../components/LoadingSpinner'

const { Title } = Typography

const Dashboard = ({ user }) => {
  const [timeFilter, setTimeFilter] = useState('week')
  const [periodOffset, setPeriodOffset] = useState(0)
  const [metricDetailsVisible, setMetricDetailsVisible] = useState(false)
  const [selectedMetricType, setSelectedMetricType] = useState(null)
  
  const { 
    ingredients, 
    loading: ingredientsLoading, 
    error: ingredientsError 
  } = useIngredients(user?.id)
  
  const { 
    meals, 
    loading: mealsLoading, 
    error: mealsError 
  } = useMeals(user?.id)

  const loading = ingredientsLoading || mealsLoading
  const error = ingredientsError || mealsError

  // Standardized date range calculation
  const getDateRange = (timeFilter, offset = 0) => {
    const now = dayjs()
    
    let start, end
    
    switch (timeFilter) {
      case 'week':
        // For week: show last 7 days, with offset for previous weeks
        end = now.subtract(7 * offset, 'day')
        start = end.subtract(7, 'day')
        break
      case 'month':
        // For month: show last 30 days, with offset for previous months
        end = now.subtract(30 * offset, 'day')
        start = end.subtract(30, 'day')
        break
      case 'year':
        // For year: show last 12 months, with offset for previous years
        end = now.subtract(12 * offset, 'month')
        start = end.subtract(12, 'month')
        break
      default:
        // Default to week if unknown
        end = now.subtract(7 * offset, 'day')
        start = end.subtract(7, 'day')
    }

    return { start, end }
  }

  const handleTimeFilterChange = (newFilter) => {
    setTimeFilter(newFilter)
    setPeriodOffset(0) // Reset to current period when changing filter type
  }

  const handleNavigate = (direction) => {
    if (direction === 'prev') {
      setPeriodOffset(prev => prev + 1)
    } else if (direction === 'next') {
      setPeriodOffset(prev => Math.max(0, prev - 1))
    } else if (direction === 'reset') {
      setPeriodOffset(0)
    }
  }

  const handleMetricClick = (metricType) => {
    setSelectedMetricType(metricType)
    setMetricDetailsVisible(true)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
          <Title level={2} className="page-title" style={{ margin: 0 }}>
            Dashboard
          </Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <PeriodSelector
              value={timeFilter}
              onChange={handleTimeFilterChange}
            />
            <div
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Button
                icon={<LeftOutlined />}
                size="small"
                onClick={() => handleNavigate('prev')}
                style={{ background: 'none', border: 'none', boxShadow: 'none' }}
              />
              <Typography.Text strong style={{ fontSize: 14, minWidth: 180, textAlign: 'center' }}>
                {(() => {
                  const now = dayjs()
                  if (timeFilter === 'week') {
                    const weekStart = now.subtract(7 * periodOffset, 'day').startOf('week')
                    const weekEnd = now.subtract(7 * periodOffset, 'day').endOf('week')
                    return `${weekStart.format('MMM DD')} - ${weekEnd.format('MMM DD, YYYY')}`
                  } else if (timeFilter === 'month') {
                    const monthDate = now.subtract(30 * periodOffset, 'day')
                    return monthDate.format('MMMM YYYY')
                  } else if (timeFilter === 'year') {
                    const yearDate = now.subtract(12 * periodOffset, 'month')
                    return yearDate.format('YYYY')
                  }
                  return ''
                })()}
              </Typography.Text>
              <Button
                icon={<RightOutlined />}
                size="small"
                onClick={() => handleNavigate('next')}
                style={{ background: 'none', border: 'none', boxShadow: 'none' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Show errors if any */}
      {error && (
        <Alert
          message="Error Loading Dashboard"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {loading ? (
        <LoadingSpinner message="Loading dashboard data..." variant="immersive" />
      ) : (
        <>
          {/* Metrics Cards */}
          <div style={{ marginBottom: 24, background: 'transparent', boxShadow: 'none' }}>
            <DashboardMetrics
              ingredients={ingredients || []}
              meals={meals || []}
              timeFilter={timeFilter}
              periodOffset={periodOffset}
              getDateRange={getDateRange}
              onMetricClick={handleMetricClick}
            />
          </div>

          {/* Main Content Grid */}
          <Row gutter={[24, 24]}>
            {/* Trends Graph */}
            <Col xs={24}>
              <TrendsGraph
                ingredients={ingredients || []}
                meals={meals || []}
                timeFilter={timeFilter}
                periodOffset={periodOffset}
                getDateRange={getDateRange}
              />
            </Col>
          </Row>

          {/* Dashboard Table */}
          <div style={{ marginTop: 24 }}>
            <DashboardTable
              ingredients={ingredients || []}
              meals={meals || []}
              timeFilter={timeFilter}
              periodOffset={periodOffset}
              getDateRange={getDateRange}
            />
          </div>
        </>
      )}

      {/* Metric Details Modal */}
      <MetricDetailsModal
        visible={metricDetailsVisible}
        onCancel={() => setMetricDetailsVisible(false)}
        metricType={selectedMetricType}
        ingredients={ingredients || []}
        meals={meals || []}
        timeFilter={timeFilter}
        periodOffset={periodOffset}
        getDateRange={getDateRange}
      />
    </div>
  )
}

export default Dashboard 