import React, { useState } from 'react'
import { Typography, Row, Col, Alert, Button, Space } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useIngredients } from '../hooks/useIngredients'
import { useMeals } from '../hooks/useMeals'
import DashboardMetrics from '../components/DashboardMetrics'
import IngredientsMetrics from '../components/IngredientsMetrics'
import TimeFilter from '../components/TimeFilter'
import TrendsGraph from '../components/TrendsGraph'
import MealSpendingGraph from '../components/MealSpendingGraph'

import MetricDetailsModal from '../components/MetricDetailsModal'
import dayjs from 'dayjs'
import PeriodSelector from '../components/PeriodSelector'
import LoadingSpinner from '../components/LoadingSpinner'
import { getDateRange } from '../utils/calculationUtils'

const { Title } = Typography

// Custom legend for top right
const legendColors = {
  totalValue: '#1890ff',
  usedValue: '#00d084',
  unusedValue: '#f5222d',
}
const legendLabels = {
  totalValue: 'Total Value',
  usedValue: 'Consumed Value',
  unusedValue: 'Unused Value',
}

function TrendsLegend() {
  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'center', justifyContent: 'flex-end' }}>
      {Object.keys(legendLabels).map(key => (
        <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 14, height: 4, borderRadius: 2, background: legendColors[key] }} />
          <span style={{ fontSize: 13, color: '#555' }}>{legendLabels[key]}</span>
        </span>
      ))}
    </div>
  )
}

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
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

          {/* Meal Spending Breakdown */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0, color: '#222', fontWeight: 600 }}>
                Meal Spending Breakdown
              </Title>
            </div>
            
            <MealSpendingGraph
              meals={meals || []}
              timeFilter={timeFilter}
              periodOffset={periodOffset}
              getDateRange={getDateRange}
            />
          </div>

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

          {/* Trends Section */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0, color: '#222', fontWeight: 600 }}>
                Trends Over Time
              </Title>
              <TrendsLegend />
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