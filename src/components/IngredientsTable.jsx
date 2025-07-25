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
import { 
  getIngredientUsageStatus, 
  getStatusColor, 
  getStatusText,
  formatDate,
  calculateIngredientRemainingValue
} from '../utils/calculationUtils'

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
      title: 'Purchase Date',
      dataIndex: 'purchase_date',
      key: 'purchase_date',
      width: 150,
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.purchase_date) - new Date(b.purchase_date)
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (price) => `$${price.toFixed(2)}`
    },
    {
      title: 'Percent Used',
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
      title: 'Remaining Value',
      key: 'remaining_value',
      render: (_, record) => {
        const remainingValue = calculateIngredientRemainingValue(record)
        return `$${remainingValue.toFixed(2)}`
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
      title: '',
      key: 'actions',
      width: 200,
      align: 'right',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            size="small" 
            onClick={() => onEdit(record)}
            icon={<EditOutlined />}
            style={{ color: '#262626' }}
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