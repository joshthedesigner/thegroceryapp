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
import { getIngredientUsageStatus, getStatusColor, getStatusText } from '../utils/calculationUtils'

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
    const matchesStatus = statusFilter === 'all' || getIngredientUsageStatus(ingredient) === statusFilter
    return matchesSearch && matchesStatus
  })

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
      render: (name) => <strong>{name}</strong>
    },
    {
      title: 'Amount Purchased',
      dataIndex: 'amount_purchased',
      key: 'amount_purchased',
      sorter: (a, b) => a.amount_purchased - b.amount_purchased,
      render: (amount, record) => `${amount} ${record.unit || 'units'}`
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
        return (
          <Progress 
            percent={percentage} 
            size="small" 
            status={getIngredientUsageStatus(record)}
            format={(percent) => `${percent}%`}
          />
        )
      }
    },
    {
      title: 'Remaining',
      key: 'remaining',
      render: (_, record) => {
        return `${record.amount_remaining.toFixed(2)} ${record.unit || 'units'}`
      }
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
      onFilter: (value, record) => getIngredientUsageStatus(record) === value,
      render: (_, record) => {
        const status = getIngredientUsageStatus(record)
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
        <Space>
          <Button 
            type="link" 
            size="small" 
            onClick={() => onEdit(record)}
            icon={<EditOutlined />}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this ingredient?"
            description="This action cannot be undone."
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="link" 
              size="small" 
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
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