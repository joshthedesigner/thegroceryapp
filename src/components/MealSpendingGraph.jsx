import React, { useMemo } from 'react'
import { Card, Typography, Empty } from 'antd'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { 
  getCumulativeMealSpendingData,
  getMealSpendingLegendConfig,
  createMealSpendingTooltipFormatter
} from '../utils/calculationUtils'
import dayjs from 'dayjs'

const { Title } = Typography

const MealSpendingGraph = ({ 
  meals = [], 
  timeFilter = 'week',
  periodOffset = 0,
  getDateRange 
}) => {
  // Create a key that changes when meals data changes to force re-render
  const chartKey = useMemo(() => {
    return `meals-spending-${meals.length}-${meals.map(m => m.id).join('-')}`
  }, [meals])

  // Process data for chart using useMemo for performance
  const chartData = useMemo(() => {
    return getCumulativeMealSpendingData(meals, timeFilter, periodOffset, getDateRange)
  }, [meals, timeFilter, periodOffset, getDateRange])

  // Get legend configuration
  const { colors: legendColors, labels: legendLabels } = getMealSpendingLegendConfig()

  // Custom legend component
  const SpendingLegend = () => (
    <div style={{ display: 'flex', gap: 18, alignItems: 'center', justifyContent: 'flex-end', marginBottom: 28, marginTop: 12 }}>
      {Object.keys(legendLabels).map(key => (
        <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 14, height: 4, borderRadius: 2, background: legendColors[key] }} />
          <span style={{ fontSize: 13, color: '#555' }}>{legendLabels[key]}</span>
        </span>
      ))}
    </div>
  )

  const getTooltipFormatter = createMealSpendingTooltipFormatter(legendLabels)

  if (!chartData.length) {
    return (
      <Card>
        <Empty
          description="No meal spending data available"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    )
  }

  return (
    <Card bodyStyle={{ padding: '16px 28px 16px 28px' }}>
      <SpendingLegend />
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} key={chartKey}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            label={{ 
              value: 'Cumulative Spending ($)', 
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
            dataKey="totalSpent" 
            stroke="#1890ff" 
            strokeWidth={3}
            dot={{ fill: '#1890ff', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="homeCookedSpent" 
            stroke="#52c41a" 
            strokeWidth={3}
            dot={{ fill: '#52c41a', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="restaurantSpent" 
            stroke="#fa8c16" 
            strokeWidth={3}
            dot={{ fill: '#fa8c16', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}

export default MealSpendingGraph 