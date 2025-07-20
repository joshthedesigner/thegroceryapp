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
  Modal
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
  loading = false 
}) => {
  const [viewMode, setViewMode] = useState('ingredients') // 'ingredients' or 'meals'
  const [searchText, setSearchText] = useState('')
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)

  // Filter data based on time filter
  const getFilteredData = () => {
    const now = dayjs()
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
        startDate = new Date(0)
    }
    
    const filteredIngredients = ingredients.filter(ing => 
      new Date(ing.purchase_date) >= startDate
    )
    
    const filteredMeals = meals.filter(meal => 
      new Date(meal.date_cooked) >= startDate
    )
    
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
        <Space>
          <DollarOutlined />
          <Text strong>${price.toFixed(2)}</Text>
        </Space>
      ),
      sorter: (a, b) => a.price - b.price
    },
    {
      title: 'Amount Used',
      key: 'amount_used',
      render: (_, record) => (
        <Text>
          {record.amount_used}{record.unit} / {record.amount_purchased}{record.unit}
        </Text>
      ),
      sorter: (a, b) => a.amount_used - b.amount_used
    },
    {
      title: 'Percent Used',
      key: 'percent_used',
      render: (_, record) => {
        const percentage = record.amount_purchased > 0 
          ? (record.amount_used / record.amount_purchased) * 100 
          : 0
        return <Text>{percentage.toFixed(1)}%</Text>
      },
      sorter: (a, b) => {
        const aPercent = a.amount_purchased > 0 ? (a.amount_used / a.amount_purchased) * 100 : 0
        const bPercent = b.amount_purchased > 0 ? (b.amount_used / b.amount_purchased) * 100 : 0
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
          <Space>
            <DollarOutlined />
            <Text type="danger">${remainingValue.toFixed(2)}</Text>
          </Space>
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
        const percentage = record.amount_purchased > 0 
          ? (record.amount_used / record.amount_purchased) * 100 
          : 0
        
        let color, text
        if (percentage >= 80) {
          color = 'success'
          text = 'Fully Used'
        } else if (percentage >= 50) {
          color = 'warning'
          text = 'Partially Used'
        } else {
          color = 'error'
          text = 'Unused'
        }
        
        return <Tag color={color}>{text}</Tag>
      },
      filters: [
        { text: 'Fully Used', value: 'fully' },
        { text: 'Partially Used', value: 'partial' },
        { text: 'Unused', value: 'unused' }
      ],
      onFilter: (value, record) => {
        const percentage = record.amount_purchased > 0 
          ? (record.amount_used / record.amount_purchased) * 100 
          : 0
        
        switch (value) {
          case 'fully':
            return percentage >= 80
          case 'partial':
            return percentage >= 50 && percentage < 80
          case 'unused':
            return percentage < 50
          default:
            return true
        }
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          />
        </Tooltip>
      )
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
        <Space>
          <CalendarOutlined />
          <Text>{dayjs(date).format('MMM DD, YYYY')}</Text>
        </Space>
      ),
      sorter: (a, b) => dayjs(a.date_cooked).unix() - dayjs(b.date_cooked).unix(),
      defaultSortOrder: 'descend'
    },
    {
      title: 'Ingredients Used',
      key: 'ingredients_used',
      render: (_, record) => {
        if (!record.meal_ingredients || record.meal_ingredients.length === 0) {
          return <Text type="secondary">No ingredients</Text>
        }
        
        const ingredientList = record.meal_ingredients
          .slice(0, 2)
          .map(ing => `${ing.quantity_used}${ing.unit} ${ing.ingredient_name}`)
          .join(', ')
        
        return (
          <Tooltip 
            title={
              record.meal_ingredients.map(ing => 
                `${ing.quantity_used}${ing.unit} ${ing.ingredient_name}`
              ).join(', ')
            }
          >
            <Text>
              {ingredientList}
              {record.meal_ingredients.length > 2 && ` +${record.meal_ingredients.length - 2} more`}
            </Text>
          </Tooltip>
        )
      }
    },
    {
      title: 'Total Cost',
      dataIndex: 'total_cost',
      key: 'total_cost',
      render: (cost) => (
        <Space>
          <DollarOutlined />
          <Text strong type="success">${cost ? cost.toFixed(2) : '0.00'}</Text>
        </Space>
      ),
      sorter: (a, b) => (a.total_cost || 0) - (b.total_cost || 0)
    },
    {
      title: 'Average Cost',
      key: 'average_cost',
      render: (_, record) => {
        const avgCost = record.total_cost || 0
        return (
          <Space>
            <DollarOutlined />
            <Text type="secondary">${avgCost.toFixed(2)}</Text>
          </Space>
        )
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          />
        </Tooltip>
      )
    }
  ]

  const currentData = viewMode === 'ingredients' ? getFilteredIngredients() : getFilteredMeals()
  const currentColumns = viewMode === 'ingredients' ? ingredientColumns : mealColumns

  return (
    <>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          {/* Header with toggle and search */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>
              {viewMode === 'ingredients' ? 'Ingredients' : 'Meals'} Overview
            </Title>
            
            <Space>
              <Search
                placeholder={`Search ${viewMode}...`}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 250 }}
                allowClear
              />
              
              <Radio.Group 
                value={viewMode} 
                onChange={(e) => setViewMode(e.target.value)}
                buttonStyle="solid"
                size="small"
              >
                <Radio.Button value="ingredients">Ingredients</Radio.Button>
                <Radio.Button value="meals">Meals</Radio.Button>
              </Radio.Group>
            </Space>
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