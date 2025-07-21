import React from 'react'
import { Row, Col, Card, Statistic, Typography, Space } from 'antd'
import { 
  ShoppingCartOutlined, 
  DollarOutlined, 
  PieChartOutlined,
  FireOutlined,
  ClockCircleOutlined,
  TrophyOutlined
} from '@ant-design/icons'

const { Text } = Typography

const DashboardMetrics = ({ 
  ingredients = [], 
  meals = [], 
  timeFilter = 'all',
  onMetricClick 
}) => {
  // Calculate metrics based on time filter
  const getFilteredData = () => {
    const now = new Date()
    let startDate = new Date(0) // Beginning of time
    
    switch (timeFilter) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(0)
    }
    
    const filteredIngredients = ingredients.filter(ing => 
      new Date(ing.purchase_date) >= startDate
    )
    
    const filteredMeals = meals.filter(meal => 
      new Date(meal.date_cooked) >= startDate
    )
    
    return { filteredIngredients, filteredMeals }
  }

  const { filteredIngredients, filteredMeals } = getFilteredData()

  // Calculate ingredient metrics
  const totalIngredients = filteredIngredients.length
  const distinctIngredients = new Set(filteredIngredients.map(ing => ing.name)).size
  const totalValue = filteredIngredients.reduce((sum, ing) => sum + ing.price, 0)
  const totalUsed = filteredIngredients.reduce((sum, ing) => sum + ing.amount_used, 0)
  const totalUnused = filteredIngredients.reduce((sum, ing) => sum + ing.amount_remaining, 0)
  const unusedValue = filteredIngredients.reduce((sum, ing) => {
    const usageRatio = ing.amount_remaining / ing.amount_purchased
    return sum + (ing.price * usageRatio)
  }, 0)

  // Calculate meal metrics
  const totalMeals = filteredMeals.length
  const totalMealCost = filteredMeals.reduce((sum, meal) => sum + (meal.total_cost || 0), 0)
  const averageMealCost = totalMeals > 0 ? totalMealCost / totalMeals : 0

  // Calculate usage efficiency
  const totalPurchased = filteredIngredients.reduce((sum, ing) => sum + ing.amount_purchased, 0)
  const usagePercentage = totalPurchased > 0 ? (totalUsed / totalPurchased) * 100 : 0

  const metrics = [
    {
      title: 'Total Ingredients',
      value: totalIngredients,
      prefix: <ShoppingCartOutlined />,
      suffix: 'items',
      color: '#1890ff',
      description: 'Ingredients purchased',
      type: 'totalIngredients'
    },
    {
      title: 'Distinct Ingredients',
      value: distinctIngredients,
      prefix: <PieChartOutlined />,
      suffix: 'types',
      color: '#52c41a',
      description: 'Unique ingredient types',
      type: 'distinctIngredients'
    },
    {
      title: 'Ingredients Used',
      value: totalUsed,
      prefix: <FireOutlined />,
      suffix: 'units',
      color: '#13c2c2',
      description: 'Total amount consumed',
      type: 'ingredientsUsed'
    },
    {
      title: 'Usage Efficiency',
      value: usagePercentage,
      prefix: <TrophyOutlined />,
      suffix: '%',
      color: '#722ed1',
      description: 'Percentage of ingredients used',
      formatter: (value) => `${value.toFixed(1)}%`,
      type: 'usageEfficiency'
    },
    {
      title: 'Unused Value',
      value: unusedValue,
      prefix: <ClockCircleOutlined />,
      suffix: '',
      color: '#f5222d',
      description: 'Value of unused ingredients',
      formatter: (value) => `$${value.toFixed(2)}`,
      type: 'unusedValue'
    },
    {
      title: 'Meals Logged',
      value: totalMeals,
      prefix: <FireOutlined />,
      suffix: 'meals',
      color: '#eb2f96',
      description: 'Total meals prepared',
      type: 'mealsLogged'
    },
    {
      title: 'Average Meal Cost',
      value: averageMealCost,
      prefix: <DollarOutlined />,
      suffix: '',
      color: '#fa8c16',
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
              hoverable 
              style={{ 
                height: '100%',
                borderLeft: `4px solid ${metric.color}`,
                cursor: 'pointer'
              }}
              onClick={() => onMetricClick && onMetricClick(metric.type)}
            >
              <Statistic
                title={
                  <Space direction="vertical" size={0} style={{ width: '100%' }}>
                    <Text strong style={{ color: metric.color }}>
                      {metric.title}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {metric.description}
                    </Text>
                  </Space>
                }
                value={metric.value}
                prefix={metric.prefix}
                suffix={metric.suffix}
                valueStyle={{ 
                  color: metric.color,
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