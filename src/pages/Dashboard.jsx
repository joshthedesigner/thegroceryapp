import React, { useState } from 'react'
import { Typography, Row, Col, Spin, Alert } from 'antd'
import { useIngredients } from '../hooks/useIngredients'
import { useMeals } from '../hooks/useMeals'
import DashboardMetrics from '../components/DashboardMetrics'
import TimeFilter from '../components/TimeFilter'
import TrendsGraph from '../components/TrendsGraph'
import IngredientUsageProgress from '../components/IngredientUsageProgress'
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

  if (error) {
    return (
      <div className="page-container">
        <Alert
          message="Error Loading Dashboard"
          description={error}
          type="error"
          showIcon
        />
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <Title level={2} className="page-title">
          Dashboard
        </Title>
      </div>

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
              ingredients={ingredients}
              meals={meals}
              timeFilter={timeFilter}
              onMetricClick={handleMetricClick}
            />
          </div>

          {/* Main Content Grid */}
          <Row gutter={[24, 24]}>
            {/* Trends Graph */}
            <Col xs={24} lg={16}>
              <TrendsGraph
                ingredients={ingredients}
                meals={meals}
                timeFilter={timeFilter}
                loading={loading}
              />
            </Col>

            {/* Ingredient Usage Progress */}
            <Col xs={24} lg={8}>
              <IngredientUsageProgress
                ingredients={ingredients}
                timeFilter={timeFilter}
                maxDisplay={8}
              />
            </Col>
          </Row>

          {/* Dashboard Table */}
          <div style={{ marginTop: 24 }}>
            <DashboardTable
              ingredients={ingredients}
              meals={meals}
              timeFilter={timeFilter}
              loading={loading}
            />
          </div>

          {/* Quick Actions */}
          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24} md={12}>
              <div style={{ 
                background: '#f5f5f5', 
                padding: '20px', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <Title level={4}>Quick Actions</Title>
                <Typography.Text>
                  Add ingredients and log meals to start tracking your cooking habits and reduce food waste.
                </Typography.Text>
              </div>
            </Col>
            
            <Col xs={24} md={12}>
              <div style={{ 
                background: '#f0f9ff', 
                padding: '20px', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <Title level={4}>Tips</Title>
                <Typography.Text>
                  Monitor your usage efficiency to identify patterns and improve your meal planning.
                </Typography.Text>
              </div>
            </Col>
          </Row>
        </>
      )}

      {/* Metric Details Modal */}
      <MetricDetailsModal
        visible={metricDetailsVisible}
        onCancel={() => setMetricDetailsVisible(false)}
        metricType={selectedMetricType}
        ingredients={ingredients}
        meals={meals}
        timeFilter={timeFilter}
      />
    </div>
  )
}

export default Dashboard 