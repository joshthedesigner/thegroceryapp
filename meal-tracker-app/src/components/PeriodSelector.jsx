import React from 'react'

const periods = [
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
]

const PeriodSelector = ({ value, onChange }) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        background: '#e4e6eb', // Slightly lighter accessible grey
        borderRadius: 12,
        padding: 4,
        alignItems: 'center',
      }}
    >
      {periods.map(period => (
        <button
          key={period.value}
          type="button"
          onClick={() => onChange && onChange(period.value)}
          style={{
            padding: '12px 16px', // 10px + 2px top/bottom
            border: 'none',
            borderRadius: 8,
            background: value === period.value ? '#fff' : 'transparent',
            color: '#222',
            fontWeight: 500,
            fontSize: value === period.value ? 15 : 15,
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
            outline: 'none',
            boxShadow: value === period.value ? '0 1px 4px rgba(0,0,0,0.03)' : 'none',
          }}
        >
          {period.label}
        </button>
      ))}
    </div>
  )
}

export default PeriodSelector 