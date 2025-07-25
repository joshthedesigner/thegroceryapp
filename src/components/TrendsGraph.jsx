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
import { 
  getFilteredDataForDate, 
  getCumulativeDataWithinPeriod,
  calculateTotalValue,
  calculateUsedValue,
  calculateUnusedValue
} from '../utils/calculationUtils'

const { Title, Text } = Typography

// Custom legend for top right
const legendColors = {
  totalValue: '#1890ff',
  usedValue: '#00d084',
  unusedValue: '#f5222d',
}
const legendLabels = {
  totalValue: 'Total Value',
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

  // Create a key that changes when meals data changes to force re-render
  const chartKey = useMemo(() => {
    return `meals-${meals.length}-${meals.map(m => m.id).join('-')}`
  }, [meals])

  // Process ingredients data for the chart
  const processIngredientsData = () => {
    if (!ingredients || ingredients.length === 0) return []

    // Group ingredients by date (using created_at instead of purchase_date)
    const groupedData = ingredients.reduce((acc, ing) => {
      if (!ing.created_at) return acc
      
      const date = dayjs(ing.created_at).format('YYYY-MM-DD')
      if (!acc[date]) {
        acc[date] = {
          date,
          totalSpent: 0,
          totalAmount: 0,
          count: 0
        }
      }
      
      acc[date].totalSpent += ing.price
      acc[date].totalAmount += ing.amount_purchased
      acc[date].count += 1
      
      return acc
    }, {})

    // Convert to array and sort by date
    return Object.values(groupedData)
      .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)))
  }

  // Process data for chart
  const chartData = useMemo(() => {
    if (!ingredients.length && !meals.length) return []

    const { start: startDate, end: endDate } = getDateRange(timeFilter, periodOffset)
    
    // Determine interval based on time filter
    let interval
    switch (timeFilter) {
      case 'year':
        interval = 'month'
        break
      case 'month':
        interval = 'week'
        break
      default:
        interval = 'day'
    }

    // Generate date points
    const dataPoints = []
    let current = startDate.clone()

    while (current.isBefore(endDate) || current.isSame(endDate, interval)) {
      const dateKey = current.format(interval === 'month' ? 'YYYY-MM' : 'YYYY-MM-DD')
      
      // Use the SAME infrastructure as metrics for daily data
      const { filteredIngredients: dailyIngredients, filteredMeals: dailyMeals } = getFilteredDataForDate(
        ingredients, meals, current.toDate()
      )
      
      // Use the NEW infrastructure that respects time filter like metrics
      const cumulativeData = getCumulativeDataWithinPeriod(
        ingredients, meals, timeFilter, periodOffset, getDateRange, current.toDate()
      )
      
      // Calculate daily addition using same calculation function as metrics
      const dailyAdded = calculateTotalValue(dailyIngredients)

      const dataPoint = {
        date: current.format(interval === 'month' ? 'MMM YYYY' : 'MMM DD'),
        dateKey,
        totalValue: Math.round(cumulativeData.totalValue * 100) / 100, // Cumulative total within time period (matches metrics)
        usedValue: Math.round(cumulativeData.usedValue * 100) / 100,   // Cumulative used within time period (matches metrics)
        unusedValue: Math.round(cumulativeData.unusedValue * 100) / 100, // Cumulative unused within time period (matches metrics)
        dailyAdded: Math.round(dailyAdded * 100) / 100 // Daily addition for reference
      }
      
      dataPoints.push(dataPoint)
      current = current.add(1, interval)
    }

    return dataPoints
  }, [ingredients, meals, timeFilter, periodOffset, getDateRange])

  const getYAxisLabel = () => {
    return 'Value ($)'
  }

  const getTooltipFormatter = (value, name, props) => {
    const dailyAdded = props.payload.dailyAdded || 0
    const baseLabel = legendLabels[name] || name
    
    if (name === 'totalValue') {
      return [`$${value}`, `${baseLabel} (Added today: $${dailyAdded})`]
    }
    
    return [`$${value}`, baseLabel]
  }

  const getLegendFormatter = (value) => {
    const legendMap = {
      totalValue: 'Total Value',
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Title level={4} style={{ margin: 0 }}>
            Trends Over Time
          </Title>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <TrendsLegend />
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} key={chartKey}>
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
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="totalValue" 
              stroke="#1890ff" 
              strokeWidth={3}
              dot={{ fill: '#1890ff', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="usedValue" 
              stroke="#00d084" 
              strokeWidth={3}
              dot={{ fill: '#00d084', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="unusedValue" 
              stroke="#f5222d" 
              strokeWidth={3}
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