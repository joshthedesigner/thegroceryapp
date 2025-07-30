import React, { useState, useEffect } from 'react'
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
  Typography,
  Dropdown
} from 'antd'
import { 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  FilterOutlined,
  MoreOutlined
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

  // Mobile table columns
  const mobileColumns = [
    {
      title: '',
      key: 'mobile_content',
      render: (_, record) => {
        const percentage = getUsagePercentage(record)
        const status = getIngredientUsageStatus(record)
        const remainingValue = calculateIngredientRemainingValue(record)
        
        const menuItems = [
          {
            key: 'delete',
            label: 'Delete',
            onClick: () => {
              // Use Popconfirm logic
              if (window.confirm('Delete this ingredient? This action cannot be undone.')) {
                handleDelete(record.id)
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
              paddingLeft: '12px',
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
              <div style={{ flexShrink: 0, minWidth: 0 }}>
                <Dropdown
                  menu={{ items: menuItems }}
                  placement="bottomLeft"
                  trigger={['click']}
                >
                  <Button
                    type="text"
                    icon={<MoreOutlined />}
                    style={{ 
                      padding: '8px 8px',
                      height: 'auto',
                      color: '#666',
                      fontSize: '18px'
                    }}
                  />
                </Dropdown>
              </div>
            </div>
            
            {/* Stacked Data */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '12px', paddingRight: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Text strong style={{ color: '#666' }}>Used:</Text>
                <div style={{ width: '25%' }}>
                  <Progress 
                    percent={percentage} 
                    size="small" 
                    status={getIngredientUsageStatus(record)}
                    format={(percent) => `${percent}%`}
                    style={{ marginBottom: 0, width: '100%' }}
                  />
                </div>
              </div>
              <div>
                <Text strong style={{ marginRight: '8px', color: '#666' }}>Date:</Text>
                <Text>{formatDate(record.purchase_date)}</Text>
              </div>
              <div>
                <Text strong style={{ marginRight: '8px', color: '#666' }}>Price:</Text>
                <Text>${record.price.toFixed(2)}</Text>
              </div>
              <div>
                <Text strong style={{ marginRight: '8px', color: '#666' }}>Remaining:</Text>
                <Text>${remainingValue.toFixed(2)}</Text>
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

  // Use mobile or desktop columns based on screen size
  const columns = isMobile ? mobileColumns : desktopColumns

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
      scroll={isMobile ? undefined : { x: 800 }}
      locale={{
        emptyText: (
          <Empty
            description="You haven't added any ingredients yet."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Text type="secondary">
              Start by adding your first ingredient to track your groceries!
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

export default IngredientsTable 