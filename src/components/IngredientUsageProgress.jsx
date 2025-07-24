import React from 'react'
import { Card, Progress, Typography, Space, Tooltip, Row, Col } from 'antd'
import { 
  CheckCircleOutlined, 
  ExclamationCircleOutlined, 
  CloseCircleOutlined 
} from '@ant-design/icons'
import { 
  getIngredientUsagePercentage,
  getIngredientUsageStatus,
  getStatusColor,
  getStatusText
} from '../utils/calculationUtils'

const { Text, Title } = Typography

const IngredientUsageProgress = ({ 
  ingredients = [], 
  timeFilter = 'all',
  maxDisplay = 10 
}) => {
  const getUsagePercentage = getIngredientUsagePercentage

  const getStatusIcon = (percentage) => {
    if (percentage >= 80) return <CheckCircleOutlined style={{ color: '#52c41a' }} />
    if (percentage >= 50) return <ExclamationCircleOutlined style={{ color: '#faad14' }} />
    return <CloseCircleOutlined style={{ color: '#f5222d' }} />
  }

  const getRemainingValue = (ingredient) => {
    const usageRatio = ingredient.amount_remaining / ingredient.amount_purchased
    return ingredient.price * usageRatio
  }

  // Sort ingredients by usage percentage (lowest first to highlight waste)
  const sortedIngredients = [...ingredients]
    .sort((a, b) => getUsagePercentage(a) - getUsagePercentage(b))
    .slice(0, maxDisplay)

  if (!sortedIngredients.length) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Text type="secondary">No ingredients to display</Text>
        </div>
      </Card>
    )
  }

  return (
    <Card title="Ingredient Usage Progress">
      <Space direction="vertical" style={{ width: '100%' }}>
        {sortedIngredients.map((ingredient) => {
          const percentage = getUsagePercentage(ingredient)
          const status = getIngredientUsageStatus(ingredient)
          const remainingValue = getRemainingValue(ingredient)

          return (
            <div key={ingredient.id} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Space>
                  {getStatusIcon(percentage)}
                  <Text strong>{ingredient.name}</Text>
                  <Text type="secondary">
                    ({ingredient.amount_used} / {ingredient.amount_purchased} {ingredient.unit || 'units'})
                  </Text>
                </Space>
                <Space>
                  <Text type="secondary">
                    ${remainingValue.toFixed(2)} remaining
                  </Text>
                  <Text strong style={{ color: status === 'success' ? '#52c41a' : status === 'warning' ? '#faad14' : '#f5222d' }}>
                    {getStatusText(status)}
                  </Text>
                </Space>
              </div>
              
              <Tooltip
                title={
                  <div>
                    <div><strong>Usage:</strong> {ingredient.amount_used} / {ingredient.amount_purchased} {ingredient.unit || 'units'}</div>
                    <div><strong>Remaining:</strong> {ingredient.amount_remaining} {ingredient.unit || 'units'}</div>
                    <div><strong>Total Cost:</strong> ${ingredient.price.toFixed(2)}</div>
                    <div><strong>Remaining Value:</strong> ${remainingValue.toFixed(2)}</div>
                    <div><strong>Usage Rate:</strong> {percentage.toFixed(1)}%</div>
                  </div>
                }
                placement="top"
              >
                <Progress
                  percent={percentage}
                  status={status}
                  strokeColor={{
                    '0%': status === 'success' ? '#52c41a' : status === 'warning' ? '#faad14' : '#f5222d',
                    '100%': status === 'success' ? '#52c41a' : status === 'warning' ? '#faad14' : '#f5222d',
                  }}
                  showInfo={false}
                  style={{ cursor: 'pointer' }}
                />
              </Tooltip>
            </div>
          )
        })}
        
        {ingredients.length > maxDisplay && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Text type="secondary">
              Showing top {maxDisplay} ingredients. 
              {ingredients.length - maxDisplay} more ingredients available.
            </Text>
          </div>
        )}
      </Space>
    </Card>
  )
}

export default IngredientUsageProgress 