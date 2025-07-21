import React, { useState, useMemo } from 'react'
import { 
  Card, 
  Table, 
  Radio, 
  Input, 
  Space, 
  Typography, 
  Tag, 
  Tooltip,
  Button,
  Modal,
  Progress
} from 'antd'
import { 
  SearchOutlined, 
  EyeOutlined,
  DollarOutlined,
  CalendarOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Search } = Input
const { Text, Title } = Typography

const DashboardTable = ({ 
  ingredients = [], 
  meals = [], 
  timeFilter = 'all',
  periodOffset = 0,
  getDateRange,
  loading = false 
}) => {
  const [viewMode, setViewMode] = useState('ingredients') // 'ingredients' or 'meals'
  const [searchText, setSearchText] = useState('')
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)

  // Filter data based on time filter using standardized date range
  const getFilteredData = () => {
    if (!getDateRange) {
      // Fallback to old logic if getDateRange is not provided
      const now = new Date()
      let startDate = new Date(0)
      
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
          // Default to week if unknown
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      }
      
      const filteredIngredients = ingredients.filter(ing => 
        new Date(ing.purchase_date) >= startDate
      )
      
      const filteredMeals = meals.filter(meal => 
        new Date(meal.date_cooked) >= startDate
      )
      
      return { filteredIngredients, filteredMeals }
    }

    // Use standardized date range
    const { start, end } = getDateRange(timeFilter, periodOffset)
    
    const filteredIngredients = ingredients.filter(ing => {
      const purchaseDate = new Date(ing.purchase_date)
      return purchaseDate >= start.toDate() && purchaseDate <= end.toDate()
    })
    
    const filteredMeals = meals.filter(meal => {
      const mealDate = new Date(meal.date_cooked)
      return mealDate >= start.toDate() && mealDate <= end.toDate()
    })
    
    return { filteredIngredients, filteredMeals }
  }

  const { filteredIngredients, filteredMeals } = getFilteredData()

  // Filter data based on search text
  const getFilteredIngredients = () => {
    if (!searchText) return filteredIngredients
    
    return filteredIngredients.filter(ing =>
      ing.name.toLowerCase().includes(searchText.toLowerCase())
    )
  }

  const getFilteredMeals = () => {
    if (!searchText) return filteredMeals
    
    return filteredMeals.filter(meal =>
      meal.meal_name.toLowerCase().includes(searchText.toLowerCase())
    )
  }

  const handleViewDetails = (record) => {
    setSelectedRecord(record)
    setDetailsVisible(true)
  }

  // Helper functions for usage calculations
  const getUsagePercentage = (ingredient) => {
    if (!ingredient.amount_purchased || ingredient.amount_purchased === 0) return 0
    return Math.round((ingredient.amount_used / ingredient.amount_purchased) * 100)
  }

  // Helper for status (copy from IngredientsTable)
  const getUsageStatus = (ingredient) => {
    if (!ingredient.amount_used || ingredient.amount_used === 0) return 'notused'
    const percentage = getUsagePercentage(ingredient)
    if (percentage === 100) return 'finished'
    if (percentage >= 80) return 'success' // Green - mostly used
    if (percentage >= 30) return 'warning' // Orange - partially used
    return 'exception' // Red - barely used
  }
  const getStatusColor = (status) => {
    switch (status) {
      case 'notused': return 'default'
      case 'finished': return 'blue'
      case 'success': return 'green'
      case 'warning': return 'orange'
      case 'exception': return 'red'
      default: return 'default'
    }
  }
  const getStatusText = (status) => {
    switch (status) {
      case 'notused': return 'Not Used'
      case 'finished': return 'Finished'
      case 'success': return 'Mostly Used'
      case 'warning': return 'Partially Used'
      case 'exception': return 'Barely Used'
      default: return 'Unknown'
    }
  }

  // Ingredients table columns
  const ingredientColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>,
      sorter: (a, b) => a.name.localeCompare(b.name),
      filterable: true
    },
    {
      title: 'Total Value',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <Text style={{ fontWeight: 400 }}>${price.toFixed(2)}</Text>
      ),
      sorter: (a, b) => a.price - b.price
    },
    {
      title: 'Percent Used',
      key: 'percent_used',
      align: 'left',
      render: (_, record) => {
        const percentage = getUsagePercentage(record)
        const status = getUsageStatus(record)
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 160 }}>
            <span style={{ minWidth: 38, fontWeight: 400 }}>{percentage}%</span>
            <Progress 
              percent={percentage} 
              status={status}
              size="small"
              format={() => null}
              style={{ width: 80 }}
            />
          </div>
        )
      },
      sorter: (a, b) => {
        const aPercent = getUsagePercentage(a)
        const bPercent = getUsagePercentage(b)
        return aPercent - bPercent
      }
    },
    {
      title: 'Remaining Value',
      key: 'remaining_value',
      render: (_, record) => {
        const usageRatio = record.amount_remaining / record.amount_purchased
        const remainingValue = record.price * usageRatio
        return (
          <Text style={{ color: '#222', fontWeight: 400 }}>${remainingValue.toFixed(2)}</Text>
        )
      },
      sorter: (a, b) => {
        const aRatio = a.amount_remaining / a.amount_purchased
        const bRatio = b.amount_remaining / b.amount_purchased
        return (a.price * aRatio) - (b.price * bRatio)
      }
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const status = getUsageStatus(record)
        return (
          <Tag color={getStatusColor(status)}>
            {getStatusText(status)}
          </Tag>
        )
      },
      filters: [
        { text: 'Not Used', value: 'notused' },
        { text: 'Finished', value: 'finished' },
        { text: 'Mostly Used', value: 'success' },
        { text: 'Partially Used', value: 'warning' },
        { text: 'Barely Used', value: 'exception' }
      ],
      onFilter: (value, record) => getUsageStatus(record) === value
    }
  ]

  // Meals table columns
  const mealColumns = [
    {
      title: 'Meal Name',
      dataIndex: 'meal_name',
      key: 'meal_name',
      render: (text) => <Text strong>{text}</Text>,
      sorter: (a, b) => a.meal_name.localeCompare(b.meal_name),
      filterable: true
    },
    {
      title: 'Date Cooked',
      dataIndex: 'date_cooked',
      key: 'date_cooked',
      render: (date) => (
        <Text style={{ color: '#222', fontWeight: 400 }}>{dayjs(date).format('MMM DD, YYYY')}</Text>
      ),
      sorter: (a, b) => dayjs(a.date_cooked).unix() - dayjs(b.date_cooked).unix(),
      defaultSortOrder: 'descend'
    },
    {
      title: 'Ingredients Used',
      key: 'ingredients_used',
      render: (_, record) => {
        if (!record.meal_ingredients || record.meal_ingredients.length === 0) {
          return <Text style={{ color: '#222', fontWeight: 400 }}>No ingredients</Text>
        }
        return (
          <span>
            {record.meal_ingredients.slice(0, 2).map((ing, idx) => (
              <Tag key={idx} color="blue" style={{ marginRight: 4, marginBottom: 2 }}>
                {ing.ingredients?.name || ''}
              </Tag>
            ))}
            {record.meal_ingredients.length > 2 && (
              <Tag color="blue">+{record.meal_ingredients.length - 2} more</Tag>
            )}
          </span>
        )
      }
    },
    {
      title: 'Total Cost',
      dataIndex: 'total_cost',
      key: 'total_cost',
      render: (cost) => (
        <Text style={{ color: '#222', fontWeight: 400 }}>${cost ? cost.toFixed(2) : '0.00'}</Text>
      ),
      sorter: (a, b) => (a.total_cost || 0) - (b.total_cost || 0)
    }
  ]

  const currentData = viewMode === 'ingredients' ? getFilteredIngredients() : getFilteredMeals()
  const currentColumns = viewMode === 'ingredients' ? ingredientColumns : mealColumns

  return (
    <>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          {/* Restore previous working header row layout */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16,
              marginBottom: 20,
              width: '100%',
            }}
          >
            <Title level={4} style={{ margin: 0, minWidth: 180, textAlign: 'left' }}>
              {viewMode === 'ingredients' ? 'Ingredients' : 'Meals'} Overview
            </Title>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <Search
                placeholder={`Search ${viewMode}...`}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 250, minWidth: 150, padding: '6px 12px' }}
                allowClear
              />
              <Radio.Group
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                buttonStyle="solid"
                size="small"
                style={{ minWidth: 180, padding: '6px 12px' }}
              >
                <Radio.Button value="ingredients">Ingredients</Radio.Button>
                <Radio.Button value="meals">Meals</Radio.Button>
              </Radio.Group>
            </div>
          </div>

          {/* Table */}
          <Table
            dataSource={currentData}
            columns={currentColumns}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} ${viewMode}`
            }}
            locale={{
              emptyText: (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Text type="secondary">
                    No {viewMode} found for the selected time period.
                  </Text>
                </div>
              )
            }}
          />
        </Space>
      </Card>

      {/* Details Modal */}
      <Modal
        title={`${viewMode === 'ingredients' ? 'Ingredient' : 'Meal'} Details`}
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailsVisible(false)}>
            Close
          </Button>
        ]}
        width={600}
      >
        {selectedRecord && (
          <div>
            {viewMode === 'ingredients' ? (
              // Ingredient details
              <div>
                <Title level={4}>{selectedRecord.name}</Title>
                <p><strong>Total Value:</strong> ${selectedRecord.price.toFixed(2)}</p>
                <p><strong>Amount Purchased:</strong> {selectedRecord.amount_purchased}{selectedRecord.unit}</p>
                <p><strong>Amount Used:</strong> {selectedRecord.amount_used}{selectedRecord.unit}</p>
                <p><strong>Amount Remaining:</strong> {selectedRecord.amount_remaining}{selectedRecord.unit}</p>
                <p><strong>Usage Percentage:</strong> {
                  selectedRecord.amount_purchased > 0 
                    ? ((selectedRecord.amount_used / selectedRecord.amount_purchased) * 100).toFixed(1)
                    : 0
                }%</p>
                <p><strong>Purchase Date:</strong> {dayjs(selectedRecord.purchase_date).format('MMM DD, YYYY')}</p>
              </div>
            ) : (
              // Meal details
              <div>
                <Title level={4}>{selectedRecord.meal_name}</Title>
                <p><strong>Date Cooked:</strong> {dayjs(selectedRecord.date_cooked).format('MMM DD, YYYY')}</p>
                <p><strong>Total Cost:</strong> ${selectedRecord.total_cost?.toFixed(2) || '0.00'}</p>
                
                {selectedRecord.meal_ingredients && selectedRecord.meal_ingredients.length > 0 ? (
                  <div>
                    <Title level={5}>Ingredients Used:</Title>
                    <ul>
                      {selectedRecord.meal_ingredients.map((ingredient, index) => (
                        <li key={index}>
                          {ingredient.ingredient_name} - {ingredient.quantity_used} {ingredient.unit}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No ingredients recorded for this meal.</p>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}

export default DashboardTable 