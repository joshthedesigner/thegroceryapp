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
  Progress,
  Empty
} from 'antd'
import { 
  SearchOutlined, 
  EyeOutlined,
  DollarOutlined,
  CalendarOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { 
  getFilteredDataForPeriod, 
  calculateTotalValue, 
  calculateUnusedValue,
  calculateUsedValue,
  calculateTotalPurchased,
  calculateTotalUsed,
  calculateUsagePercentage,
  calculateTotalMealCost,
  calculateAverageMealCost,
  getIngredientUsagePercentage,
  getIngredientUsageStatus,
  getStatusColor,
  getStatusText,
  formatDate
} from '../utils/calculationUtils'

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

  // Get filtered data using shared utility
  const { filteredIngredients, filteredMeals } = getFilteredDataForPeriod(
    ingredients, meals, timeFilter, periodOffset, getDateRange
  )

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
  const getUsagePercentage = getIngredientUsagePercentage
  const getUsageStatus = getIngredientUsageStatus

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
        <Text style={{ color: '#222', fontWeight: 400 }}>{formatDate(date)}</Text>
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
                <Empty
                  description={viewMode === 'ingredients' ? 'You haven’t added any ingredients yet.' : 'You haven’t logged any meals yet.'}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  <Text type="secondary">
                    {viewMode === 'ingredients'
                      ? 'Start by adding your first ingredient to track your groceries!'
                      : 'Start by logging your first meal to track your cooking!'}
                  </Text>
                </Empty>
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
                <p><strong>Name:</strong> {selectedRecord.name}</p>
                <p><strong>Amount Purchased:</strong> {selectedRecord.amount_purchased}{selectedRecord.unit || ' units'}</p>
                <p><strong>Amount Used:</strong> {selectedRecord.amount_used}{selectedRecord.unit || ' units'}</p>
                <p><strong>Amount Remaining:</strong> {selectedRecord.amount_remaining}{selectedRecord.unit || ' units'}</p>
                <p><strong>Price:</strong> ${selectedRecord.price.toFixed(2)}</p>
                <p><strong>Created:</strong> {formatDate(selectedRecord.created_at)}</p>
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
                          {ingredient.ingredient_name} - {ingredient.quantity_used} units
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