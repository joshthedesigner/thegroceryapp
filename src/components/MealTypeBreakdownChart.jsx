import React, { useMemo } from 'react'
import { Card, Typography, Empty } from 'antd'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  LabelList
} from 'recharts'
import dayjs from 'dayjs'
import { getDateRange } from '../utils/calculationUtils'

const { Title } = Typography

const MealTypeBreakdownChart = ({ 
  meals = [], 
  timeFilter = 'week',
  periodOffset = 0,
  getDateRange 
}) => {
  // Create a key that changes when meals data changes to force re-render
  const chartKey = useMemo(() => {
    return `meal-type-breakdown-${meals.length}-${meals.map(m => m.id).join('-')}`
  }, [meals])

  // Process data for chart using useMemo for performance
  const { dataPoints: chartData, maxTotal } = useMemo(() => {
    if (!meals.length) return []

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

    // Generate data points for each period
    const dataPoints = []
    let current = startDate.clone()
    let maxTotal = 0

    while (current.isBefore(endDate) || current.isSame(endDate, interval)) {
      const dateKey = current.format(interval === 'month' ? 'YYYY-MM' : 'YYYY-MM-DD')
      
      // Filter meals for this specific period
      const periodMeals = meals.filter(meal => {
        const mealDate = dayjs(meal.date_cooked).format(interval === 'month' ? 'YYYY-MM' : 'YYYY-MM-DD')
        return mealDate === dateKey
      })
      
      // Calculate costs by meal type
      let homeCookedCost = 0
      let restaurantCost = 0
      
      periodMeals.forEach(meal => {
        const cost = meal.total_cost || 0
        if (meal.meal_type === 'restaurant') {
          restaurantCost += cost
        } else {
          homeCookedCost += cost
        }
      })

      const totalCost = homeCookedCost + restaurantCost
      maxTotal = Math.max(maxTotal, totalCost)

      const dataPoint = {
        period: current.format(interval === 'month' ? 'MMM YYYY' : 'MMM DD'),
        dateKey,
        homeCooked: Math.round(homeCookedCost * 100) / 100,
        restaurant: Math.round(restaurantCost * 100) / 100,
        breakdown: Math.round(totalCost * 100) / 100,
        total: Math.round(totalCost * 100) / 100
      }
      
      dataPoints.push(dataPoint)
      current = current.add(1, interval)
    }

    return { dataPoints, maxTotal }
  }, [meals, timeFilter, periodOffset, getDateRange]) || { dataPoints: [], maxTotal: 0 }

  // Legend configuration
  const legendColors = {
    homeCooked: '#1890ff',
    restaurant: '#096dd9'
  }
  const legendLabels = {
    homeCooked: 'Home Cooked',
    restaurant: 'Restaurant'
  }

  // Custom legend component
  const MealTypeLegend = () => (
    <div style={{ display: 'flex', gap: 18, alignItems: 'center', justifyContent: 'flex-end', marginBottom: 28, marginTop: 12 }}>
      {Object.keys(legendLabels).map(key => (
        <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 14, height: 4, borderRadius: 2, background: legendColors[key] }} />
          <span style={{ fontSize: 13, color: '#555' }}>{legendLabels[key]}</span>
        </span>
      ))}
    </div>
  )

  // Calculate y-axis domain based on max value with proper increments
  const calculateYAxisDomain = (maxValue) => {
    if (maxValue <= 0) return [0, 100]
    
    // Determine appropriate increment based on the magnitude of the max value
    let increment
    if (maxValue <= 10) {
      increment = 1
    } else if (maxValue <= 50) {
      increment = 5
    } else if (maxValue <= 100) {
      increment = 10
    } else if (maxValue <= 500) {
      increment = 50
    } else if (maxValue <= 1000) {
      increment = 100
    } else if (maxValue <= 5000) {
      increment = 500
    } else if (maxValue <= 10000) {
      increment = 1000
    } else {
      increment = Math.pow(10, Math.floor(Math.log10(maxValue)))
    }
    
    // Calculate the next increment above the max value
    const nextIncrement = Math.ceil(maxValue / increment) * increment
    // Add one more increment for breathing room
    const maxDomain = nextIncrement + increment
    
    return [0, maxDomain]
  }
  
  const yAxisDomain = calculateYAxisDomain(maxTotal)

  // Custom tooltip formatter
  const getTooltipFormatter = (value, name) => {
    return [`$${value}`, legendLabels[name] || name]
  }

  if (!chartData.length) {
    return (
      <Card>
        <Empty
          description="No meal data available"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    )
  }

  return (
    <Card bodyStyle={{ padding: '16px 28px 16px 28px' }}>
      <MealTypeLegend />
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} key={chartKey} barGap={8} barCategoryGap={16}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="period" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            domain={yAxisDomain}
            tick={{ fontSize: 12 }}
            label={{ 
              value: 'Cost ($)', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }}
          />
          <Tooltip 
            formatter={getTooltipFormatter}
            labelFormatter={(label) => `Period: ${label}`}
          />
          <Bar 
            dataKey="homeCooked" 
            fill="#1890ff" 
            name="Home Cooked"
            stackId="a"
          />
          <Bar 
            dataKey="restaurant" 
            fill="#096dd9" 
            name="Restaurant"
            stackId="a"
          >
            <LabelList 
              dataKey="total" 
              position="top" 
              formatter={(value) => `Total: $${value}`}
              style={{ fontSize: 12, fontWeight: 500, fill: '#333' }}
              offset={15}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default MealTypeBreakdownChart 