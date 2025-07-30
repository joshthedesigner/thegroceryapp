import React from 'react'

const views = [
  { value: 'meals', label: 'Meals' },
  { value: 'ingredients', label: 'Ingredients' },
]

const ViewSelector = ({ value, onChange }) => {
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
      {views.map(view => (
        <button
          key={view.value}
          type="button"
          onClick={() => onChange && onChange(view.value)}
          style={{
            padding: '12px 16px', // 10px + 2px top/bottom
            border: 'none',
            borderRadius: 8,
            background: value === view.value ? '#fff' : 'transparent',
            color: '#222',
            fontWeight: 500,
            fontSize: value === view.value ? 15 : 15,
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
            outline: 'none',
            boxShadow: value === view.value ? '0 1px 4px rgba(0,0,0,0.03)' : 'none',
          }}
        >
          {view.label}
        </button>
      ))}
    </div>
  )
}

export default ViewSelector 