import React from 'react'
import { Row, Col, Card, Statistic, Typography, Space } from 'antd'
import { 
  getFilteredDataForPeriod, 
  calculateTotalValue, 
  calculateUnusedValue,
  calculateTotalPurchased,
  calculateTotalUsed,
  calculateUsagePercentage,
  calculateTotalMealCost,
  calculateAverageMealCost
} from '../utils/calculationUtils'
// Removed all icon imports

const { Text } = Typography

const DashboardMetrics = ({ 
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

  // Get recent purchases (last 7 days)
  const recentPurchases = ingredientsData.filter(ing => {
    if (!ing.purchase_date) return false
    const purchaseDate = new Date(ing.purchase_date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return purchaseDate >= weekAgo
  })

  // Calculate meal metrics using shared utilities
  const totalMeals = filteredMeals.length
  const totalMealCost = calculateTotalMealCost(filteredMeals)
  const averageMealCost = calculateAverageMealCost(filteredMeals)

  // Calculate usage efficiency using shared utility
  const usagePercentage = calculateUsagePercentage(ingredientsData)

  // Calculate ingredient metrics using shared utilities
  const totalIngredients = ingredientsData.length
  const distinctIngredients = new Set(ingredientsData.map(ing => ing.name)).size
  const totalValue = calculateTotalValue(ingredientsData)
  const unusedValue = calculateUnusedValue(ingredientsData)

  const metrics = [
    {
      title: 'Total Ingredients',
      value: totalIngredients,
      suffix: 'items',
      description: 'Ingredients purchased',
      type: 'totalIngredients'
    },
    {
      title: 'Distinct Ingredients',
      value: distinctIngredients,
      suffix: 'types',
      description: 'Unique ingredient types',
      type: 'distinctIngredients'
    },
    {
      title: 'Ingredients Used',
      value: totalUsed,
      suffix: 'units',
      description: 'Total amount consumed',
      type: 'ingredientsUsed'
    },
    {
      title: 'Usage Efficiency',
      value: usagePercentage,
      suffix: '%',
      description: 'Percentage of ingredients used',
      formatter: (value) => `${value.toFixed(1)}%`,
      type: 'usageEfficiency'
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
      title: 'Unused Value',
      value: unusedValue,
      suffix: '',
      description: 'Value of unused ingredients',
      formatter: (value) => `$${value.toFixed(2)}`,
      type: 'unusedValue'
    },
    {
      title: 'Meals Logged',
      value: totalMeals,
      suffix: 'meals',
      description: 'Total meals prepared',
      type: 'mealsLogged'
    },
    {
      title: 'Average Meal Cost',
      value: averageMealCost,
      suffix: '',
      description: 'Average cost per meal',
      formatter: (value) => `$${value.toFixed(2)}`,
      type: 'averageMealCost'
    }
  ]

  return (
    <div className="dashboard-metrics">
      <Row gutter={[16, 16]}>
        {metrics.map((metric, index) => (
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

export default DashboardMetrics 