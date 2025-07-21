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
  CalendarOutlined
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

    return (
      <Card size="small" style={{ margin: '0 50px' }}>
        <Title level={5} style={{ marginBottom: 16 }}>
          Ingredients Used
        </Title>
        <Table
          dataSource={record.meal_ingredients}
          pagination={false}
          size="small"
          columns={[
            {
              title: 'Ingredient',
              dataIndex: 'ingredient_name',
              key: 'ingredient_name',
              render: (text) => <Text strong>{text}</Text>
            },
            {
              title: 'Quantity Used',
              dataIndex: 'quantity_used',
              key: 'quantity_used',
              render: (quantity, record) => (
                <Text>
                  {quantity} {record.unit}
                </Text>
              )
            },
            {
              title: 'Cost',
              dataIndex: 'cost',
              key: 'cost',
              render: (cost) => (
                <Text type="success">
                  ${cost ? cost.toFixed(2) : '0.00'}
                </Text>
              )
            }
          ]}
        />
      </Card>
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
        if (!ingredients || ingredients.length === 0) {
          return <Tag color="default">No ingredients</Tag>
        }
        return (
          <Space wrap>
            {ingredients.slice(0, 2).map((ing, index) => (
              <Tag key={index} color="blue">
                {ing.ingredient_name}
              </Tag>
            ))}
            {ingredients.length > 2 && (
              <Tag color="blue">+{ingredients.length - 2} more</Tag>
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
        <Space>
          <DollarOutlined />
          <Text strong type="success">
            ${cost ? cost.toFixed(2) : '0.00'}
          </Text>
        </Space>
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
    <div style={{ border: '1.5px solid #e5e7eb', borderRadius: 12, background: '#fff', boxShadow: 'none', padding: 16 }}>
      <Table
        dataSource={meals}
        columns={columns}
        loading={loading}
        rowKey="id"
        expandable={{
          expandedRowRender,
          expandedRowKeys,
          onExpand: handleExpand,
          expandRowByClick: true
        }}
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
    </div>
  )
}

export default MealsTable 