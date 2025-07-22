import React, { useMemo } from 'react'
import { 
  Card, 
  Typography, 
  Space, 
  Empty
} from 'antd'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import dayjs from 'dayjs'
import LoadingSpinner from './LoadingSpinner'

const { Title, Text } = Typography

// Custom legend for top right
const legendColors = {
  totalValue: '#1890ff',
  usedValue: '#00d084',
  unusedValue: '#f5222d',
}
const legendLabels = {
  totalValue: 'Purchased Value',
  usedValue: 'Consumed Value',
  unusedValue: 'Wasted Value',
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

const TrendsGraph = ({ 
  ingredients = [], 
  meals = [], 
  timeFilter = 'all',
  periodOffset = 0,
  getDateRange,
  loading = false 
}) => {

  // Process data for chart
  const chartData = useMemo(() => {
    if (!ingredients.length && !meals.length) return []

    let startDate, endDate, interval

    // Use standardized date range if available
    if (getDateRange) {
      const dateRange = getDateRange(timeFilter, periodOffset)
      startDate = dateRange.start
      endDate = dateRange.end
    } else {
      // Fallback to old logic
      const now = dayjs()
      
      switch (timeFilter) {
        case 'week':
          startDate = now.subtract(7, 'day')
          endDate = now
          break
        case 'month':
          startDate = now.subtract(30, 'day')
          endDate = now
          break
        case 'year':
          startDate = now.subtract(12, 'month')
          endDate = now
          break
        default:
          startDate = now.subtract(7, 'day')
          endDate = now
      }
    }

    // Determine interval based on time filter
    switch (timeFilter) {
      case 'week':
        interval = 'day'
        break
      case 'month':
        interval = 'day'
        break
      case 'year':
        interval = 'month'
        break
      default:
        interval = 'day'
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

      dataPoints.push(dataPoint)

      current = current.add(1, interval)
    }

    return dataPoints
  }, [ingredients, meals, timeFilter, periodOffset, getDateRange])

  const getYAxisLabel = () => {
    return 'Value ($)'
  }

  const getTooltipFormatter = (value, name) => {
    return [`$${value}`, legendLabels[name] || name]
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
        <LoadingSpinner message="Loading trends data..." variant="immersive" />
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Title level={4} style={{ margin: 0 }}>
            Trends Over Time
          </Title>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <TrendsLegend />
          </div>
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
              stroke="#00d084" 
              strokeWidth={3}
              dot={{ fill: '#00d084', strokeWidth: 3, r: 5 }}
              activeDot={{ r: 8 }}
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