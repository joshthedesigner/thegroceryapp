import React from 'react'
import { Row, Col, Card, Statistic, Typography, Space } from 'antd'
import { 
  getFilteredDataForPeriod, 
  calculateMealSpendingByType
} from '../utils/calculationUtils'
import dayjs from 'dayjs'
// Removed all icon imports

const { Text, Title } = Typography

const DashboardMetrics = ({ 
  meals = [], 
  timeFilter = 'all',
  periodOffset = 0,
  getDateRange,
  onMetricClick 
}) => {
  // Get filtered data using shared utility
  const { filteredMeals } = getFilteredDataForPeriod(
    [], meals, timeFilter, periodOffset, getDateRange
  )

  // Calculate restaurant meal metrics using reusable utility
  const restaurantMeals = filteredMeals.filter(meal => meal.meal_type === 'restaurant')
  const homeCookedMeals = filteredMeals.filter(meal => meal.meal_type === 'home_cooked')
  const { restaurantSpent: totalRestaurantSpent, homeCookedSpent: totalHomeCookedSpent } = calculateMealSpendingByType(filteredMeals)

  const mealMetrics = [
    {
      title: 'Total Meals',
      value: filteredMeals.length,
      suffix: 'meals',
      description: 'home cooked + restaurant meals',
      type: 'totalMeals'
    },
    {
      title: 'Total Meal Cost',
      value: totalHomeCookedSpent + totalRestaurantSpent,
      suffix: '',
      description: 'Total cost of all meals',
      formatter: (value) => `$${value.toFixed(2)}`,
      type: 'totalMealCost'
    },
    {
      title: 'Home Cooked Meals Total',
      value: homeCookedMeals.length,
      suffix: 'meals',
      description: 'Total home cooked meals logged',
      type: 'homeCookedMealsTotal'
    },
    {
      title: 'Home Cooked Meals Cost',
      value: totalHomeCookedSpent,
      suffix: '',
      description: 'Total cost of home cooked meals',
      formatter: (value) => `$${value.toFixed(2)}`,
      type: 'homeCookedMealsCost'
    },
    {
      title: 'Restaurant Meals Total',
      value: restaurantMeals.length,
      suffix: 'meals',
      description: 'Total restaurant meals logged',
      type: 'restaurantMealsTotal'
    },
    {
      title: 'Restaurant Meals Cost',
      value: totalRestaurantSpent,
      suffix: '',
      description: 'Total cost of restaurant meals',
      formatter: (value) => `$${value.toFixed(2)}`,
      type: 'restaurantMealsCost'
    }
  ]

  return (
    <div className="dashboard-metrics">
      {/* Meals Section */}
      <div>
        <Title level={4} style={{ marginBottom: 16, color: '#222', fontWeight: 600 }}>
          Meals Overview
        </Title>
        <Row gutter={[16, 16]}>
          {mealMetrics.map((metric, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card 
                style={{ 
                  height: '100%',
                  cursor: 'default',
                  background: '#fff',
                }}
              >
                <Statistic
                  title={
                    <Space direction="vertical" size={0} style={{ width: '100%' }}>
                      <Text strong style={{ color: '#222' }}>
                        {metric.title}
                      </Text>
                      <Text type="secondary" style={{ fontSize: '12px', color: '#888' }}>
                        {metric.description}
                      </Text>
                    </Space>
                  }
                  value={metric.value}
                  suffix={metric.suffix}
                  valueStyle={{ 
                    color: '#222',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}
                  formatter={metric.formatter}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

export default DashboardMetrics 