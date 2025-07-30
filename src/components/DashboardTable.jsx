import React, { useState, useEffect, useRef } from 'react'
import { Card, Table, Space, Typography, Tag, Progress, Button, Empty, Input, Modal } from 'antd'
import { 
  DollarOutlined, 
  ShoppingCartOutlined, 
  FireOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  SearchOutlined, 
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { 
  getFilteredDataForPeriod, 
  calculateIngredientRemainingValue,
  getIngredientUsagePercentage,
  getIngredientUsageStatus,
  getStatusColor,
  getStatusText,
  formatDate
} from '../utils/calculationUtils'
import ToggleFilter from './shared/ToggleFilter'
import IngredientTags from './IngredientTags'

const { Title, Text } = Typography

const DashboardTable = ({ 
  ingredients = [], 
  meals = [], 
  timeFilter = 'all',
  periodOffset = 0,
  getDateRange,
  loading = false 
}) => {
  const [viewMode, setViewMode] = useState('ingredients')
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const scrollPositionRef = useRef(0)

  // Check screen size on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Check for extra small screens
  const isExtraSmall = window.innerWidth <= 480

  // Get filtered data using shared utility
  const { filteredIngredients, filteredMeals } = getFilteredDataForPeriod(
    ingredients, meals, timeFilter, periodOffset, getDateRange
  )

  // Use filtered data directly since search is removed
  const tableData = viewMode === 'ingredients' ? filteredIngredients : filteredMeals

  // Save scroll position before any content change
  useEffect(() => {
    const handleScroll = () => {
      scrollPositionRef.current = window.scrollY
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Restore scroll position after content changes
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, scrollPositionRef.current)
    }, 0)
    return () => clearTimeout(timer)
  }, [viewMode])

  const handleViewDetails = (record) => {
    setSelectedRecord(record)
    setDetailsVisible(true)
  }

  const viewOptions = [
    { value: 'ingredients', label: 'Ingredients' },
    { value: 'meals', label: 'Meals' }
  ]

  // Helper functions for usage calculations
  const getUsagePercentage = getIngredientUsagePercentage
  const getUsageStatus = getIngredientUsageStatus

  // Mobile ingredients table columns
  const mobileIngredientColumns = [
    {
      title: '',
      key: 'mobile_content',
      render: (_, record) => {
        const percentage = getUsagePercentage(record)
        const status = getUsageStatus(record)
        const remainingValue = calculateIngredientRemainingValue(record)
        
        return (
          <div style={{ padding: '0 0 16px 0' }}>
            {/* Header Row */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '12px',
              paddingLeft: '8px',
              paddingRight: '8px',
              minWidth: 0,
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                <Text strong style={{ fontSize: '16px' }}>
                  {record.name}
                </Text>
                <Tag color={getStatusColor(status)}>
                  {getStatusText(status)}
                </Tag>
              </div>
            </div>
            
            {/* Stacked Data */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '8px', paddingRight: '8px' }}>
              <div>
                <Text strong style={{ marginRight: '8px' }}>Value:</Text>
                <Text>${record.price.toFixed(2)}</Text>
              </div>
              <div>
                <Text strong style={{ marginRight: '8px' }}>Used:</Text>
                <Text>{percentage}%</Text>
              </div>
              <div>
                <Text strong style={{ marginRight: '8px' }}>Remaining:</Text>
                <Text>${remainingValue.toFixed(2)}</Text>
              </div>
            </div>
          </div>
        )
      }
    }
  ]

  // Mobile meals table columns
  const mobileMealColumns = [
    {
      title: '',
      key: 'mobile_content',
      render: (_, record) => {
        return (
          <div style={{ padding: '0 0 16px 0' }}>
            {/* Header Row */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '12px',
              paddingLeft: '8px',
              paddingRight: '8px',
              minWidth: 0,
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                <Text strong style={{ fontSize: '16px' }}>
                  {record.meal_name}
                </Text>
              </div>
            </div>
            
            {/* Stacked Data */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '8px', paddingRight: '8px' }}>
              <div>
                <Text strong style={{ marginRight: '8px' }}>Date:</Text>
                <Text>{formatDate(record.date_cooked)}</Text>
              </div>
              <div>
                <Text strong style={{ marginRight: '8px' }}>Cost:</Text>
                <Text>${record.total_cost ? record.total_cost.toFixed(2) : '0.00'}</Text>
              </div>
              <div>
                <Text strong style={{ marginRight: '8px' }}>Ingredients:</Text>
                <IngredientTags mealIngredients={record.meal_ingredients} options={{ showAll: true, wrap: true }} />
              </div>
            </div>
          </div>
        )
      }
    }
  ]

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
        const remainingValue = calculateIngredientRemainingValue(record)
        return (
          <Text style={{ color: '#222', fontWeight: 400 }}>${remainingValue.toFixed(2)}</Text>
        )
      },
      sorter: (a, b) => {
        const aValue = calculateIngredientRemainingValue(a)
        const bValue = calculateIngredientRemainingValue(b)
        return aValue - bValue
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
      sorter: (a, b) => dayjs(a.date_cooked).utc().unix() - dayjs(b.date_cooked).utc().unix(),
      defaultSortOrder: 'descend'
    },
    {
      title: 'Ingredients Used',
      key: 'ingredients_used',
      render: (_, record) => {
        return <IngredientTags mealIngredients={record.meal_ingredients} options={{ maxDisplay: 2, tagColor: 'blue' }} />
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

  return (
    <>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16,
              marginBottom: 16,
              width: '100%',
            }}
          >
            <Title level={4} style={{ 
              margin: 0, 
              textAlign: 'left',
              fontSize: isMobile ? '16px' : '20px'
            }}>
              {viewMode === 'ingredients' ? 'Ingredients' : 'Meals'} Overview
            </Title>
          </div>

          <Table
            dataSource={tableData}
            columns={viewMode === 'ingredients' 
              ? (isMobile ? mobileIngredientColumns : ingredientColumns)
              : (isMobile ? mobileMealColumns : mealColumns)
            }
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true
            }}
            locale={{
              emptyText: (
                <Empty
                  description={viewMode === 'ingredients' ? 'You haven\'t added any ingredients yet.' : 'You haven\'t logged any meals yet.'}
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
            // Mobile-specific table props
            {...(isMobile && {
              showHeader: false,
              style: { paddingTop: 0 }
            })}
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
                <p><strong>Date Cooked:</strong> {dayjs(selectedRecord.date_cooked).utc().format('MMM DD, YYYY')}</p>
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