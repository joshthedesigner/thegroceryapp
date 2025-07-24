import React from 'react'
import { Row, Col, Card, Statistic, Typography, Space } from 'antd'
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
  // Calculate metrics based on time filter using standardized date range
  const getFilteredData = () => {
    const { start: startDate, end: endDate } = getDateRange()
    
    const filteredIngredients = ingredients.filter(ing => {
      if (!ing.purchase_date) return false
      const purchaseDate = new Date(ing.purchase_date)
      return purchaseDate >= startDate && purchaseDate <= endDate
    })
    
    const filteredMeals = meals.filter(meal => {
      if (!meal.date_cooked) return false
      const mealDate = new Date(meal.date_cooked)
      return mealDate >= startDate && mealDate <= endDate
    })
    
    return { filteredIngredients, filteredMeals }
  }

  const { filteredIngredients: ingredientsData, filteredMeals } = getFilteredData()

  // Calculate metrics
  const totalSpent = ingredientsData.reduce((sum, ing) => sum + ing.price, 0)
  const totalPurchased = ingredientsData.reduce((sum, ing) => sum + ing.amount_purchased, 0)
  const totalUsed = ingredientsData.reduce((sum, ing) => sum + (ing.amount_used || 0), 0)
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

  // Calculate meal metrics
  const totalMeals = filteredMeals.length
  const totalMealCost = filteredMeals.reduce((sum, meal) => sum + (meal.total_cost || 0), 0)
  const averageMealCost = totalMeals > 0 ? totalMealCost / totalMeals : 0

  // Calculate usage efficiency
  const usagePercentage = totalPurchased > 0 ? (totalUsed / totalPurchased) * 100 : 0

  // Calculate ingredient metrics
  const totalIngredients = ingredientsData.length
  const distinctIngredients = new Set(ingredientsData.map(ing => ing.name)).size
  const totalValue = ingredientsData.reduce((sum, ing) => sum + ing.price, 0)
  const unusedValue = ingredientsData.reduce((sum, ing) => {
    const usageRatio = (ing.amount_purchased - (ing.amount_used || 0)) / ing.amount_purchased
    return sum + (ing.price * usageRatio)
  }, 0)

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