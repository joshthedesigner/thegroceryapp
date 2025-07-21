import React, { useMemo } from 'react'
import { 
  Card, 
  Typography, 
  Space, 
  Empty,
  Spin
} from 'antd'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import dayjs from 'dayjs'

const { Title, Text } = Typography

const TrendsGraph = ({ 
  ingredients = [], 
  meals = [], 
  timeFilter = 'all',
  loading = false 
}) => {

  // Debug logging for incoming data
  console.log('TrendsGraph props:', {
    ingredientsCount: ingredients.length,
    mealsCount: meals.length,
    timeFilter,
    loading,
    sampleIngredients: ingredients.slice(0, 2),
    sampleMeals: meals.slice(0, 2)
  })

  // Process data for chart
  const chartData = useMemo(() => {
    if (!ingredients.length && !meals.length) return []

    const now = dayjs()
    let startDate, endDate, interval

    // Determine date range and interval based on time filter
    switch (timeFilter) {
      case 'week':
        startDate = now.subtract(7, 'day')
        endDate = now
        interval = 'day'
        break
      case 'month':
        startDate = now.subtract(30, 'day')
        endDate = now
        interval = 'day'
        break
      case 'year':
        startDate = now.subtract(12, 'month')
        endDate = now
        interval = 'month'
        break
      default:
        startDate = dayjs().subtract(6, 'month')
        endDate = now
        interval = 'month'
    }

    // Generate date points
    const dataPoints = []
    let current = startDate.clone()

    while (current.isBefore(endDate) || current.isSame(endDate, interval)) {
      const dateKey = current.format(interval === 'month' ? 'YYYY-MM' : 'YYYY-MM-DD')
      
      // Filter data for this date point
      const periodIngredients = ingredients.filter(ing => {
        const purchaseDate = dayjs(ing.purchase_date)
        return purchaseDate.isSame(current, interval)
      })

      const periodMeals = meals.filter(meal => {
        const mealDate = dayjs(meal.date_cooked)
        return mealDate.isSame(current, interval)
      })

      // Calculate metrics for this period
      const totalValue = periodIngredients.reduce((sum, ing) => sum + ing.price, 0)
      
      // Calculate used value based on actual meal consumption during this period
      const usedValue = periodMeals.reduce((sum, meal) => {
        return sum + (meal.total_cost || 0)
      }, 0)
      
      const unusedValue = totalValue - usedValue

      const dataPoint = {
        date: current.format(interval === 'month' ? 'MMM YYYY' : 'MMM DD'),
        dateKey,
        totalValue: Math.round(totalValue * 100) / 100,
        usedValue: Math.round(usedValue * 100) / 100,
        unusedValue: Math.round(unusedValue * 100) / 100
      }

      // Debug logging
      console.log(`Period ${dataPoint.date}:`, {
        totalValue: dataPoint.totalValue,
        usedValue: dataPoint.usedValue,
        unusedValue: dataPoint.unusedValue,
        periodMealsCount: periodMeals.length,
        periodIngredientsCount: periodIngredients.length
      })

      dataPoints.push(dataPoint)

      current = current.add(1, interval)
    }

    console.log('Final chartData:', dataPoints)
    return dataPoints
  }, [ingredients, meals, timeFilter])

  const getYAxisLabel = () => {
    return 'Value ($)'
  }

  const getTooltipFormatter = (value, name) => {
    return [`$${value}`, name]
  }

  const getLegendFormatter = (value) => {
    const legendMap = {
      totalValue: 'Purchased Value',
      usedValue: 'Consumed Value',
      unusedValue: 'Wasted Value'
    }
    return legendMap[value] || value
  }

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text>Loading trends data...</Text>
          </div>
        </div>
      </Card>
    )
  }

  if (!chartData.length) {
    return (
      <Card>
        <Empty
          description="No data available for trends"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Text type="secondary">
            Add some ingredients and meals to see trends over time.
          </Text>
        </Empty>
      </Card>
    )
  }

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            Trends Over Time
          </Title>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ 
                value: getYAxisLabel(), 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip 
              formatter={getTooltipFormatter}
              labelFormatter={(label) => `Period: ${label}`}
            />
            <Legend formatter={getLegendFormatter} />
            
            <Line 
              type="monotone" 
              dataKey="totalValue" 
              stroke="#1890ff" 
              strokeWidth={2}
              dot={{ fill: '#1890ff', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="usedValue" 
              stroke="#52c41a" 
              strokeWidth={2}
              dot={{ fill: '#52c41a', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="unusedValue" 
              stroke="#f5222d" 
              strokeWidth={2}
              dot={{ fill: '#f5222d', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Space>
    </Card>
  )
}

export default TrendsGraph 