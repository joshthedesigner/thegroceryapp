import React, { useState } from 'react'
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Popconfirm, 
  Typography, 
  Card,
  Tooltip,
  Empty
} from 'antd'
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  DollarOutlined,
  CalendarOutlined,
  DownOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Text, Title } = Typography

const MealsTable = ({ 
  meals, 
  loading, 
  onEdit, 
  onDelete, 
  onViewDetails 
}) => {
  // Add debugging
  console.log('MealsTable received meals:', meals);
  console.log('MealsTable meals length:', meals?.length);
  if (meals && meals.length > 0) {
    console.log('First meal ingredients:', meals[0].meal_ingredients);
  }

  const [expandedRowKeys, setExpandedRowKeys] = useState([])

  const handleExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys([...expandedRowKeys, record.id])
    } else {
      setExpandedRowKeys(expandedRowKeys.filter(key => key !== record.id))
    }
  }

  const expandedRowRender = (record) => {
    if (!record.meal_ingredients || record.meal_ingredients.length === 0) {
      return (
        <Card size="small" style={{ margin: '0 50px' }}>
          <Empty 
            description="No ingredients recorded" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      )
    }

    // Filter out meal_ingredients with null ingredients
    const validMealIngredients = record.meal_ingredients.filter(ing => ing.ingredients && ing.ingredients.name);
    
    if (validMealIngredients.length === 0) {
      return (
        <Card size="small" style={{ margin: '0 50px' }}>
          <Empty 
            description="Ingredients data is missing" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      )
    }

    return (
      <div style={{ margin: '0 50px', background: '#fff', borderRadius: 8 }}>
        <Table
          dataSource={validMealIngredients}
          pagination={false}
          size="small"
          columns={[
            {
              title: 'Ingredient',
              key: 'ingredient_name',
              render: (_, rec) => <Text strong>{rec.ingredients.name}</Text>
            },
            {
              title: 'Quantity Used',
              dataIndex: 'quantity_used',
              key: 'quantity_used',
              render: (quantity, rec) => (
                <Text>
                  {quantity} {rec.ingredients.unit || 'units'}
                </Text>
              )
            }
          ]}
        />
      </div>
    )
  }

  const columns = [
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
      title: 'Ingredients',
      dataIndex: 'meal_ingredients',
      key: 'ingredients_count',
      render: (ingredients) => {
        console.log('Ingredients render function called with:', ingredients);
        if (!ingredients || ingredients.length === 0) {
          console.log('No ingredients found, showing "No ingredients" tag');
          return <Tag color="default">No ingredients</Tag>
        }
        
        // Check if any ingredients have valid ingredient data
        const validIngredients = ingredients.filter(ing => ing.ingredients && ing.ingredients.name);
        console.log('Valid ingredients found:', validIngredients.length);
        
        if (validIngredients.length === 0) {
          console.log('No valid ingredients found, showing "Ingredients missing" tag');
          return <Tag color="orange" style={{ backgroundColor: '#fa8c16', color: 'white', border: '2px solid red' }}>Ingredients missing</Tag>
        }
        
        console.log('Valid ingredients found, rendering tags for:', validIngredients);
        const firstTwo = validIngredients.slice(0, 2)
        const remaining = validIngredients.slice(2)
        return (
          <Space wrap>
            {firstTwo.map((ing, index) => (
              <Tag key={index} color="blue">
                {ing.ingredients.name}
              </Tag>
            ))}
            {remaining.length > 0 && (
              <Tooltip title={remaining.map(ing => ing.ingredients.name).join(', ')} placement="top">
                <Tag color="blue" style={{ cursor: 'pointer' }}>+{remaining.length} more</Tag>
              </Tooltip>
            )}
          </Space>
        )
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Meal">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Meal">
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
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ]

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
    />
  )
}

export default MealsTable 