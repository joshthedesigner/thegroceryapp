import React, { useState } from 'react'
import { Typography, Row, Col, Alert, Button, Space, Tooltip } from 'antd'
import { LeftOutlined, RightOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { useIngredients } from '../hooks/useIngredients'
import { useMeals } from '../hooks/useMeals'
import DashboardMetrics from '../components/DashboardMetrics'
import IngredientsMetrics from '../components/IngredientsMetrics'
import TimeFilter from '../components/TimeFilter'
import TrendsGraph from '../components/TrendsGraph'
import MealSpendingGraph from '../components/MealSpendingGraph'
import MealTypeBreakdownChart from '../components/MealTypeBreakdownChart'
import ViewSelector from '../components/ViewSelector'

import MetricDetailsModal from '../components/MetricDetailsModal'
import dayjs from 'dayjs'
import PeriodSelector from '../components/PeriodSelector'
import LoadingSpinner from '../components/LoadingSpinner'
import { getDateRange } from '../utils/calculationUtils'

const { Title } = Typography



const Dashboard = ({ user }) => {
  const [timeFilter, setTimeFilter] = useState('week')
  const [periodOffset, setPeriodOffset] = useState(0)
  const [viewType, setViewType] = useState('meals')
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
    setPeriodOffset(0) // Reset to current period when changing filter type
  }

  const handleViewTypeChange = (newViewType) => {
    setViewType(newViewType)
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <Title level={2} className="page-title" style={{ margin: 0 }}>
            Dashboard
          </Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <ViewSelector
              value={viewType}
              onChange={handleViewTypeChange}
            />
            <PeriodSelector
              value={timeFilter}
              onChange={handleTimeFilterChange}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                height: 48,
                padding: '0 14px',
                boxShadow: 'none',
                gap: 8,
              }}
            >
              <button
                onClick={() => handleNavigate('prev')}
                style={{
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  margin: 0,
                  cursor: 'pointer',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  height: 48,
                }}
                aria-label="Previous period"
              >
                <LeftOutlined style={{ fontSize: 18, color: '#222' }} />
              </button>
              <span style={{ fontWeight: 500, fontSize: 14, minWidth: 180, textAlign: 'center' }}>
                {(() => {
                  const now = dayjs().utc()
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
              </span>
              <button
                onClick={() => handleNavigate('next')}
                style={{
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  margin: 0,
                  cursor: 'pointer',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  height: 48,
                }}
                aria-label="Next period"
              >
                <RightOutlined style={{ fontSize: 18, color: '#222' }} />
              </button>
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
          {viewType === 'meals' ? (
            <>
              {/* Meals Overview */}
              <div style={{ marginBottom: 36 }}>
                <DashboardMetrics
                  meals={meals || []}
                  timeFilter={timeFilter}
                  periodOffset={periodOffset}
                  getDateRange={getDateRange}
                  onMetricClick={handleMetricClick}
                />
              </div>

              {/* Meal Cost Breakdown */}
              <div style={{ marginBottom: 36 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Title level={4} style={{ margin: 0, color: '#222', fontWeight: 600 }}>
                      Meal Cost Breakdown
                    </Title>
                    <Tooltip title="Shows the breakdown of meal costs by type (home cooked vs restaurant) for each time period, with total cost displayed above each bar.">
                      <QuestionCircleOutlined style={{ color: '#666', fontSize: 16, cursor: 'help' }} />
                    </Tooltip>
                  </div>
                </div>
                
                <MealTypeBreakdownChart
                  meals={meals || []}
                  timeFilter={timeFilter}
                  periodOffset={periodOffset}
                  getDateRange={getDateRange}
                />
              </div>

              {/* Cumulative Meal Spending Over Time */}
              <div style={{ marginBottom: 36 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Title level={4} style={{ margin: 0, color: '#222', fontWeight: 600 }}>
                      Cumulative Meal Spending Over Time
                    </Title>
                    <Tooltip title="Tracking how your spending grows cumulatively over the time period set in the filters, showing your total expense growth.">
                      <QuestionCircleOutlined style={{ color: '#666', fontSize: 16, cursor: 'help' }} />
                    </Tooltip>
                  </div>
                </div>
                
                <MealSpendingGraph
                  meals={meals || []}
                  timeFilter={timeFilter}
                  periodOffset={periodOffset}
                  getDateRange={getDateRange}
                />
              </div>
            </>
          ) : (
            <>
              {/* Ingredients Overview */}
              <div style={{ marginBottom: 36 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Title level={4} style={{ margin: 0, color: '#222', fontWeight: 600 }}>
                    Ingredients Overview
                  </Title>
                </div>
                <IngredientsMetrics
                  ingredients={ingredients || []}
                  meals={meals || []}
                  timeFilter={timeFilter}
                  periodOffset={periodOffset}
                  getDateRange={getDateRange}
                  onMetricClick={handleMetricClick}
                />
              </div>

              {/* Cumulative Ingredient Usage Over Time Section */}
              <div style={{ marginBottom: 36 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Title level={4} style={{ margin: 0, color: '#222', fontWeight: 600 }}>
                      Cumulative Ingredient Usage Over Time
                    </Title>
                    <Tooltip title="Shows how your ingredient values accumulate over time, including total value, consumed value, and unused value based on the selected time period.">
                      <QuestionCircleOutlined style={{ color: '#666', fontSize: 16, cursor: 'help' }} />
                    </Tooltip>
                  </div>
                </div>
                
                {/* Main Content Grid */}
                <Row gutter={[0, 0]}>
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
              </div>
            </>
          )}
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