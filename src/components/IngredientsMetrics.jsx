import React from 'react'
import { Row, Col, Card, Statistic, Typography, Space } from 'antd'
import { 
  getFilteredDataForPeriod, 
  calculateTotalValue, 
  calculateUnusedValue,
  calculateUsedValue,
  calculateTotalPurchased,
  calculateTotalUsed,
  calculateUsagePercentage
} from '../utils/calculationUtils'
import dayjs from 'dayjs'

const { Text, Title } = Typography

const IngredientsMetrics = ({ 
  ingredients = [], 
  meals = [], 
  timeFilter = 'all',
  periodOffset = 0,
  getDateRange,
  onMetricClick 
}) => {
  // Get filtered data using shared utility
  const { filteredIngredients: ingredientsData, filteredMeals } = getFilteredDataForPeriod(
    ingredients, meals, timeFilter, periodOffset, getDateRange
  )

  // Calculate metrics using shared utilities
  const totalSpent = calculateTotalValue(ingredientsData)
  const totalPurchased = calculateTotalPurchased(ingredientsData)
  const totalUsed = calculateTotalUsed(ingredientsData)
  const totalRemaining = totalPurchased - totalUsed

  // Calculate waste percentage
  const wastePercentage = totalPurchased > 0 ? ((totalRemaining / totalPurchased) * 100) : 0

  // Get recent purchases using shared utility (last 7 days)
  const { filteredIngredients: recentPurchases } = getFilteredDataForPeriod(
    ingredientsData, [], 'week', 0, (timeFilter, offset) => {
      const now = dayjs()
      const end = now
      const start = now.subtract(7, 'day')
      return { start, end }
    }
  )

  // Calculate usage efficiency using shared utility
  const usagePercentage = calculateUsagePercentage(ingredientsData)

  // Calculate ingredient metrics using shared utilities
  const totalIngredients = ingredientsData.length
  const totalValue = calculateTotalValue(ingredientsData)
  const usedValue = calculateUsedValue(filteredMeals)
  const unusedValue = calculateUnusedValue(ingredientsData, filteredMeals)

  const ingredientMetrics = [
    {
      title: 'Total Ingredients',
      value: totalIngredients,
      suffix: 'items',
      description: 'Ingredients purchased',
      type: 'totalIngredients'
    },
    {
      title: 'Total Value',
      value: totalValue,
      suffix: '',
      description: 'Total value of ingredients',
      formatter: (value) => `$${value.toFixed(2)}`,
      type: 'totalValue'
    },
    {
      title: 'Used Value',
      value: usedValue,
      suffix: '',
      description: 'Value of ingredients consumed in meals',
      formatter: (value) => `$${value.toFixed(2)}`,
      type: 'usedValue'
    },
    {
      title: 'Unused Value',
      value: unusedValue,
      suffix: '',
      description: 'Value of unused ingredients',
      formatter: (value) => `$${value.toFixed(2)}`,
      type: 'unusedValue'
    }
  ]

  return (
    <div className="ingredients-metrics">
      <Row gutter={[16, 16]}>
        {ingredientMetrics.map((metric, index) => (
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
  )
}

export default IngredientsMetrics 