import React, { useState, useEffect } from 'react'
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Popconfirm, 
  Typography, 
  Empty,
  Dropdown
} from 'antd'
import { 
  EditOutlined, 
  DeleteOutlined, 
  MoreOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { formatDate } from '../utils/calculationUtils'
import IngredientTags from './IngredientTags'

const { Text, Title } = Typography

const MealsTable = ({ 
  meals, 
  loading, 
  onEdit, 
  onDelete
}) => {
  // Add debugging
  console.log('MealsTable received meals:', meals);
  console.log('MealsTable meals length:', meals?.length);
  if (meals && meals.length > 0) {
    console.log('First meal ingredients:', meals[0].meal_ingredients);
  }

  const [isMobile, setIsMobile] = useState(false)

  // Check screen size on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Mobile table columns
  const mobileColumns = [
    {
      title: '',
      key: 'mobile_content',
      render: (_, record) => {
        const menuItems = [
          {
            key: 'delete',
            label: 'Delete',
            onClick: () => {
              // Use Popconfirm logic
              if (window.confirm('Delete this meal? This action cannot be undone. All ingredient usage data will be lost.')) {
                onDelete(record.id)
              }
            }
          }
        ]

        return (
          <div style={{ padding: '0 0 16px 0' }}>
            {/* Header Row */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '4px',
              paddingTop: '4px',
              paddingLeft: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Text strong style={{ fontSize: '16px' }}>
                  {record.meal_name}
                </Text>
                {record.meal_type === 'restaurant' && (
                  <Tag color="orange" style={{ fontSize: '10px' }}>
                    Restaurant
                  </Tag>
                )}
              </div>
              <Dropdown
                menu={{ items: menuItems }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Button
                  type="text"
                  icon={<MoreOutlined />}
                  style={{ 
                    padding: '8px 12px',
                    height: 'auto',
                    color: '#666',
                    fontSize: '18px'
                  }}
                />
              </Dropdown>
            </div>
            
            {/* Stacked Data */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '12px' }}>
              <div>
                <Text strong style={{ marginRight: '8px', color: '#666' }}>Date:</Text>
                <Text>{formatDate(record.date_cooked)}</Text>
              </div>
              <div>
                <Text strong style={{ marginRight: '8px', color: '#666' }}>Total Cost:</Text>
                <Text>${record.total_cost ? record.total_cost.toFixed(2) : '0.00'}</Text>
              </div>
              <div>
                <Text strong style={{ marginRight: '8px', color: '#666' }}>Ingredients:</Text>
                {record.meal_type === 'restaurant' ? (
                  <Tag color="gray">No Ingredients</Tag>
                ) : (
                  <IngredientTags mealIngredients={record.meal_ingredients} options={{ showAll: true, wrap: true }} />
                )}
              </div>
            </div>
          </div>
        )
      }
    }
  ]

  // Desktop table columns
  const desktopColumns = [
    {
      title: 'Meal Name',
      dataIndex: 'meal_name',
      key: 'meal_name',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          {record.meal_type === 'restaurant' && (
            <Tag color="orange" style={{ marginLeft: 8, fontSize: '11px' }}>
              Restaurant
            </Tag>
          )}
        </div>
      ),
      sorter: (a, b) => a.meal_name.localeCompare(b.meal_name),
      filterable: true
    },
    {
      title: 'Date',
      dataIndex: 'date_cooked',
      key: 'date_cooked',
      render: (date) => (
        <Text>{formatDate(date)}</Text>
      ),
      sorter: (a, b) => dayjs(a.date_cooked).utc().unix() - dayjs(b.date_cooked).utc().unix(),
      defaultSortOrder: 'descend'
    },
    {
      title: 'Ingredients',
      dataIndex: 'meal_ingredients',
      key: 'ingredients_count',
      render: (ingredients, record) => {
        if (record.meal_type === 'restaurant') {
          return <Tag color="gray">No Ingredients</Tag>
        }
        return <IngredientTags mealIngredients={ingredients} options={{ maxDisplay: 2, tagColor: 'blue' }} />
      }
    },
    {
      title: 'Total Cost',
      dataIndex: 'total_cost',
      key: 'total_cost',
      render: (cost) => (
        <Text style={{ color: '#222', fontWeight: 400 }}>
          ${cost ? cost.toFixed(2) : '0.00'}
        </Text>
      ),
      sorter: (a, b) => (a.total_cost || 0) - (b.total_cost || 0)
    },
    {
      title: '',
      key: 'actions',
      width: 200,
      align: 'right',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Delete this meal?"
            description="This action cannot be undone. All ingredient usage data will be lost."
            onConfirm={() => onDelete(record.id)}
            okText="Yes, delete"
            cancelText="Cancel"
            placement="topRight"
          >
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              style={{ color: '#262626' }}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  // Use mobile or desktop columns based on screen size
  const columns = isMobile ? mobileColumns : desktopColumns

  return (
    <Table
      dataSource={meals}
      columns={columns}
      loading={loading}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => 
          `${range[0]}-${range[1]} of ${total} meals`
      }}
      locale={{
        emptyText: (
          <Empty
            description="No meals logged yet"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Text type="secondary">
              Start by logging your first meal to track your cooking!
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
  )
}

export default MealsTable 