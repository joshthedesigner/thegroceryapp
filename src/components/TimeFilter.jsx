import React from 'react'
import dayjs from 'dayjs'
import ToggleFilter from './shared/ToggleFilter'

const TimeFilter = ({ 
  timeFilter = 'all', 
  onTimeFilterChange, 
  onNavigate,
  currentPeriod = 0 
}) => {
  const getPeriodDisplay = () => {
    const now = dayjs().utc()
    
    switch (timeFilter) {
      case 'week':
        const weekStart = now.subtract(7 * currentPeriod, 'day').startOf('week')
        const weekEnd = now.subtract(7 * currentPeriod, 'day').endOf('week')
        return `${weekStart.format('MMM DD')} - ${weekEnd.format('MMM DD, YYYY')}`
      case 'month':
        const monthDate = now.subtract(30 * currentPeriod, 'day')
        return monthDate.format('MMMM YYYY')
      case 'year':
        const yearDate = now.subtract(12 * currentPeriod, 'month')
        return yearDate.format('YYYY')
      default:
        return ''
    }
  }

  const options = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' }
  ]

  return (
    <ToggleFilter
      value={timeFilter}
      onChange={onTimeFilterChange}
      options={options}
      showCard={true}
      showNavigation={true}
      periodDisplay={getPeriodDisplay()}
      onNavigate={onNavigate}
      label="Time Period"
    />
  )
}

export default TimeFilter 