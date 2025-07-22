import React, { useState } from 'react'
import { 
  Table, 
  Button, 
  Space, 
  Progress, 
  Tag, 
  Popconfirm, 
  message,
  Input,
  Select,
  Row,
  Col,
  Radio,
  Empty,
  Typography
} from 'antd'
import { 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  FilterOutlined 
} from '@ant-design/icons'

const { Search } = Input
const { Option } = Select
const { Text } = Typography

const IngredientsTable = ({ 
  ingredients, 
  loading, 
  onEdit, 
  onDelete, 
  getUsagePercentage
}) => {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Filter ingredients based on search and status
  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus = statusFilter === 'all' || getUsageStatus(ingredient) === statusFilter
    return matchesSearch && matchesStatus
  })

  // Get status color
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

  // Get status text
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

  // Helper for status
  const getUsageStatus = (ingredient) => {
    if (!ingredient.amount_used || ingredient.amount_used === 0) return 'notused'
    const percentage = getUsagePercentage(ingredient)
    if (percentage === 100) return 'finished'
    if (percentage >= 80) return 'success' // Green - mostly used
    if (percentage >= 30) return 'warning' // Orange - partially used
    return 'exception' // Red - barely used
  }

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const result = await onDelete(id)
      if (result.error) {
        message.error(result.error)
      } else {
        message.success('Ingredient deleted successfully!')
      }
    } catch (error) {
      message.error('Failed to delete ingredient')
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Amount Purchased',
      dataIndex: 'amount_purchased',
      key: 'amount_purchased',
      sorter: (a, b) => a.amount_purchased - b.amount_purchased,
      render: (amount, record) => `${amount} ${record.unit}`
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (price) => `$${price.toFixed(2)}`
    },
    {
      title: 'Usage',
      key: 'usage',
      render: (_, record) => {
        const percentage = getUsagePercentage(record)
        // No status icons, just percent and progress bar
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 160 }}>
            <span style={{ minWidth: 38, fontWeight: 500 }}>{percentage}%</span>
            <Progress 
              percent={percentage} 
              showInfo={false}
              size="small"
              style={{ width: 80 }}
            />
          </div>
        )
      }
    },
    {
      title: 'Remaining',
      dataIndex: 'amount_remaining',
      key: 'amount_remaining',
      sorter: (a, b) => a.amount_remaining - b.amount_remaining,
      render: (amount, record) => `${amount.toFixed(2)} ${record.unit}`
    },
    {
      title: 'Status',
      key: 'status',
      filters: [
        { text: 'Not Used', value: 'notused' },
        { text: 'Finished', value: 'finished' },
        { text: 'Mostly Used', value: 'success' },
        { text: 'Partially Used', value: 'warning' },
        { text: 'Barely Used', value: 'exception' }
      ],
      onFilter: (value, record) => getUsageStatus(record) === value,
      render: (_, record) => {
        const status = getUsageStatus(record)
        return (
          <Tag color={getStatusColor(status)}>
            {getStatusText(status)}
          </Tag>
        )
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Delete this ingredient?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Table
      columns={columns}
      dataSource={filteredIngredients}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => 
          `${range[0]}-${range[1]} of ${total} ingredients`
      }}
      scroll={{ x: 800 }}
      locale={{
        emptyText: (
          <Empty
            description="You haven’t added any ingredients yet."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Text type="secondary">
              Start by adding your first ingredient to track your groceries!
            </Text>
          </Empty>
        )
      }}
    />
  )
}

export default IngredientsTable 