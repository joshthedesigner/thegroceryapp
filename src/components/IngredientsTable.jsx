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
  Col
} from 'antd'
import { 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  FilterOutlined 
} from '@ant-design/icons'

const { Search } = Input
const { Option } = Select

const IngredientsTable = ({ 
  ingredients, 
  loading, 
  onEdit, 
  onDelete, 
  getUsagePercentage, 
  getUsageStatus 
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
      case 'success': return 'green'
      case 'warning': return 'orange'
      case 'exception': return 'red'
      default: return 'default'
    }
  }

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'success': return 'Mostly Used'
      case 'warning': return 'Partially Used'
      case 'exception': return 'Barely Used'
      default: return 'Unknown'
    }
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
        const status = getUsageStatus(record)
        
        return (
          <div className="progress-container">
            <Progress 
              percent={percentage} 
              status={status}
              size="small"
              style={{ flex: 1 }}
            />
            <span className="progress-text">{percentage}%</span>
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
    <div className="table-container">
      <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search ingredients..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              prefix={<FilterOutlined />}
            >
              <Option value="all">All Status</Option>
              <Option value="success">Mostly Used</Option>
              <Option value="warning">Partially Used</Option>
              <Option value="exception">Barely Used</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ color: '#8c8c8c' }}>
                {filteredIngredients.length} ingredient{filteredIngredients.length !== 1 ? 's' : ''}
              </span>
            </div>
          </Col>
        </Row>
      </div>
      
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
      />
    </div>
  )
}

export default IngredientsTable 