import React, { useState } from 'react'
import { Typography, Row, Col, Spin, Alert } from 'antd'
import { useIngredients } from '../hooks/useIngredients'
import { useMeals } from '../hooks/useMeals'
import DashboardMetrics from '../components/DashboardMetrics'
import TimeFilter from '../components/TimeFilter'
import TrendsGraph from '../components/TrendsGraph'
import DashboardTable from '../components/DashboardTable'
import MetricDetailsModal from '../components/MetricDetailsModal'
import dayjs from 'dayjs'

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
        <Title level={2} className="page-title">
          Dashboard
        </Title>
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
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Typography.Text>Loading dashboard data...</Typography.Text>
          </div>
        </div>
      ) : (
        <>
          {/* Time Filter */}
          <TimeFilter
            timeFilter={timeFilter}
            onTimeFilterChange={handleTimeFilterChange}
            onNavigate={handleNavigate}
            currentPeriod={periodOffset}
          />

          {/* Metrics Cards */}
          <div style={{ marginBottom: 24 }}>
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