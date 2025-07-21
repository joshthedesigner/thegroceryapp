import React, { useState } from 'react'
import { Typography, Row, Col, Spin, Alert } from 'antd'
import { useIngredients } from '../hooks/useIngredients'
import { useMeals } from '../hooks/useMeals'
import DashboardMetrics from '../components/DashboardMetrics'
import TimeFilter from '../components/TimeFilter'
import TrendsGraph from '../components/TrendsGraph'
import DashboardTable from '../components/DashboardTable'
import MetricDetailsModal from '../components/MetricDetailsModal'

const { Title } = Typography

const Dashboard = ({ user }) => {
  const [timeFilter, setTimeFilter] = useState('all')
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

  const handleTimeFilterChange = (newFilter) => {
    setTimeFilter(newFilter)
  }

  const handleNavigate = (direction) => {
    // TODO: Implement navigation logic for different time periods
    console.log('Navigate:', direction)
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
          />

          {/* Metrics Cards */}
          <div style={{ marginBottom: 24 }}>
            <DashboardMetrics
              ingredients={ingredients || []}
              meals={meals || []}
              timeFilter={timeFilter}
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
              />
            </Col>
          </Row>

          {/* Dashboard Table */}
          <div style={{ marginTop: 24 }}>
            <DashboardTable
              ingredients={ingredients || []}
              meals={meals || []}
              timeFilter={timeFilter}
            />
          </div>
        </>
      )}

      {/* Metric Details Modal */}
      <MetricDetailsModal
        visible={metricDetailsVisible}
        metricType={selectedMetricType}
        ingredients={ingredients || []}
        meals={meals || []}
        timeFilter={timeFilter}
        onClose={() => setMetricDetailsVisible(false)}
      />
    </div>
  )
}

export default Dashboard 