import React from 'react'
import { Modal, Typography, Table, Space, Tag, Card, Row, Col, Statistic } from 'antd'
import { 
  DollarOutlined, 
  ShoppingCartOutlined, 
  FireOutlined,
  ClockCircleOutlined,
  TrophyOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { formatDate, getFilteredDataForPeriod } from '../utils/calculationUtils'

const { Title, Text } = Typography

const MetricDetailsModal = ({ 
  visible, 
  onCancel, 
  metricType, 
  ingredients = [], 
  meals = [],
  timeFilter = 'all',
  periodOffset = 0,
  getDateRange
}) => {
  // Get filtered data using shared utility
  const { filteredIngredients, filteredMeals } = getFilteredDataForPeriod(
    ingredients, meals, timeFilter, periodOffset, getDateRange
  )

  const getMetricInfo = () => {
    switch (metricType) {
      case 'totalIngredients':
        return {
          title: 'Total Ingredients Added',
          description: 'All ingredient entries added during the selected period',
          icon: <ShoppingCartOutlined />,
          color: '#1890ff',
          data: filteredIngredients,
          columns: [
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
              render: (text) => <Text strong>{text}</Text>
            },
            {
              title: 'Quantity',
              key: 'quantity',
              render: (_, record) => (
                <Text>{record.amount_purchased} {record.unit || 'units'}</Text>
              )
            },
            {
              title: 'Value',
              dataIndex: 'price',
              key: 'price',
              render: (price) => (
                <Space>
                  <DollarOutlined />
                  <Text strong>${price.toFixed(2)}</Text>
                </Space>
              )
            },
            {
              title: 'Date Added',
              dataIndex: 'purchase_date',
              key: 'purchase_date',
              render: (date) => formatDate(date)
            }
          ]
        }
      
      case 'distinctIngredients':
        return {
          title: 'Distinct Ingredients',
          description: 'Unique ingredient types added during the selected period',
          icon: <ShoppingCartOutlined />,
          color: '#52c41a',
          data: filteredIngredients,
          columns: [
            {
              title: 'Ingredient Type',
              dataIndex: 'name',
              key: 'name',
              render: (text) => <Text strong>{text}</Text>
            },
            {
              title: 'Total Quantity',
              key: 'total_quantity',
              render: (_, record) => {
                const total = filteredIngredients
                  .filter(ing => ing.name === record.name)
                  .reduce((sum, ing) => sum + ing.amount_purchased, 0)
                return <Text>{total} {record.unit || 'units'}</Text>
              }
            },
            {
              title: 'Total Value',
              key: 'total_value',
              render: (_, record) => {
                const total = filteredIngredients
                  .filter(ing => ing.name === record.name)
                  .reduce((sum, ing) => sum + ing.price, 0)
                return (
                  <Space>
                    <DollarOutlined />
                    <Text strong>${total.toFixed(2)}</Text>
                  </Space>
                )
              }
            }
          ]
        }
      
      case 'totalValue':
        return {
          title: 'Total Value of Ingredients',
          description: 'Total monetary value of all ingredients added',
          icon: <DollarOutlined />,
          color: '#faad14',
          data: filteredIngredients,
          columns: [
            {
              title: 'Ingredient',
              dataIndex: 'name',
              key: 'name',
              render: (text) => <Text strong>{text}</Text>
            },
            {
              title: 'Value',
              dataIndex: 'price',
              key: 'price',
              render: (price) => (
                <Space>
                  <DollarOutlined />
                  <Text strong>${price.toFixed(2)}</Text>
                </Space>
              )
            },
            {
              title: 'Quantity',
              key: 'quantity',
              render: (_, record) => (
                <Text>{record.amount_purchased} {record.unit || 'units'}</Text>
              )
            },
            {
              title: 'Date Added',
              dataIndex: 'purchase_date',
              key: 'purchase_date',
              render: (date) => formatDate(date)
            }
          ]
        }
      
      case 'ingredientsUsed':
        return {
          title: 'Ingredients Used',
          description: 'Total quantity of ingredients consumed in meals',
          icon: <FireOutlined />,
          color: '#13c2c2',
          data: filteredIngredients.filter(ing => ing.amount_used > 0),
          columns: [
            {
              title: 'Ingredient',
              dataIndex: 'name',
              key: 'name',
              render: (text) => <Text strong>{text}</Text>
            },
            {
              title: 'Amount Used',
              key: 'amount_used',
              render: (_, record) => (
                <Text>{record.amount_used} {record.unit || 'units'}</Text>
              )
            },
            {
              title: 'Total Purchased',
              key: 'total_purchased',
              render: (_, record) => (
                <Text>{record.amount_purchased} {record.unit || 'units'}</Text>
              )
            },
            {
              title: 'Usage %',
              key: 'usage_percent',
              render: (_, record) => {
                const percentage = record.amount_purchased > 0 
                  ? (record.amount_used / record.amount_purchased) * 100 
                  : 0
                return <Text>{percentage.toFixed(1)}%</Text>
              }
            }
          ]
        }
      
      case 'unusedValue':
        return {
          title: 'Unused Value',
          description: 'Value of ingredients not consumed in meals',
          icon: <ClockCircleOutlined />,
          color: '#f5222d',
          data: filteredIngredients.filter(ing => ing.amount_remaining > 0),
          columns: [
            {
              title: 'Ingredient',
              dataIndex: 'name',
              key: 'name',
              render: (text) => <Text strong>{text}</Text>
            },
            {
              title: 'Remaining',
              key: 'remaining',
              render: (_, record) => (
                <Text>{record.amount_remaining} {record.unit || 'units'}</Text>
              )
            },
            {
              title: 'Remaining Value',
              key: 'remaining_value',
              render: (_, record) => {
                const usageRatio = record.amount_remaining / record.amount_purchased
                const remainingValue = record.price * usageRatio
                return (
                  <Space>
                    <DollarOutlined />
                    <Text type="danger">${remainingValue.toFixed(2)}</Text>
                  </Space>
                )
              }
            },
            {
              title: 'Waste %',
              key: 'waste_percent',
              render: (_, record) => {
                const percentage = record.amount_purchased > 0 
                  ? (record.amount_remaining / record.amount_purchased) * 100 
                  : 0
                return <Text type="danger">{percentage.toFixed(1)}%</Text>
              }
            }
          ]
        }
      
      case 'usageEfficiency':
        return {
          title: 'Usage Efficiency',
          description: 'Percentage of ingredients used vs purchased',
          icon: <TrophyOutlined />,
          color: '#722ed1',
          data: filteredIngredients,
          columns: [
            {
              title: 'Ingredient',
              dataIndex: 'name',
              key: 'name',
              render: (text) => <Text strong>{text}</Text>
            },
            {
              title: 'Used',
              key: 'used',
              render: (_, record) => (
                <Text>{record.amount_used} {record.unit || 'units'}</Text>
              )
            },
            {
              title: 'Purchased',
              key: 'purchased',
              render: (_, record) => (
                <Text>{record.amount_purchased} {record.unit || 'units'}</Text>
              )
            },
            {
              title: 'Efficiency',
              key: 'efficiency',
              render: (_, record) => {
                const percentage = record.amount_purchased > 0 
                  ? (record.amount_used / record.amount_purchased) * 100 
                  : 0
                
                let color = 'error'
                if (percentage >= 80) color = 'success'
                else if (percentage >= 50) color = 'warning'
                
                return <Tag color={color}>{percentage.toFixed(1)}%</Tag>
              }
            }
          ]
        }
      
      case 'mealsLogged':
        return {
          title: 'Meals Logged',
          description: 'Total number of meals prepared',
          icon: <FireOutlined />,
          color: '#eb2f96',
          data: filteredMeals,
          columns: [
            {
              title: 'Meal Name',
              dataIndex: 'meal_name',
              key: 'meal_name',
              render: (text) => <Text strong>{text}</Text>
            },
            {
              title: 'Date Cooked',
              dataIndex: 'date_cooked',
              key: 'date_cooked',
              render: (date) => formatDate(date)
            },
            {
              title: 'Total Cost',
              dataIndex: 'total_cost',
              key: 'total_cost',
              render: (cost) => (
                <Space>
                  <DollarOutlined />
                  <Text strong>${cost ? cost.toFixed(2) : '0.00'}</Text>
                </Space>
              )
            },
            {
              title: 'Ingredients',
              key: 'ingredients_count',
              render: (_, record) => (
                <Text>{record.meal_ingredients?.length || 0} ingredients</Text>
              )
            }
          ]
        }
      
      case 'averageMealCost':
        return {
          title: 'Average Meal Cost',
          description: 'Average cost per meal prepared',
          icon: <DollarOutlined />,
          color: '#fa8c16',
          data: filteredMeals,
          columns: [
            {
              title: 'Meal Name',
              dataIndex: 'meal_name',
              key: 'meal_name',
              render: (text) => <Text strong>{text}</Text>
            },
            {
              title: 'Cost',
              dataIndex: 'total_cost',
              key: 'total_cost',
              render: (cost) => (
                <Space>
                  <DollarOutlined />
                  <Text strong>${cost ? cost.toFixed(2) : '0.00'}</Text>
                </Space>
              )
            },
            {
              title: 'Date',
              dataIndex: 'date_cooked',
              key: 'date_cooked',
              render: (date) => dayjs(date).format('MMM DD, YYYY')
            },
            {
              title: 'vs Average',
              key: 'vs_average',
              render: (_, record) => {
                const avgCost = filteredMeals.length > 0 
                  ? filteredMeals.reduce((sum, meal) => sum + (meal.total_cost || 0), 0) / filteredMeals.length
                  : 0
                const diff = (record.total_cost || 0) - avgCost
                const color = diff > 0 ? 'danger' : diff < 0 ? 'success' : 'default'
                return (
                  <Text type={color}>
                    {diff > 0 ? '+' : ''}${diff.toFixed(2)}
                  </Text>
                )
              }
            }
          ]
        }
      
      default:
        return null
    }
  }

  const metricInfo = getMetricInfo()

  if (!metricInfo) {
    return null
  }

  return (
    <Modal
      title={
        <Space>
          <span style={{ color: metricInfo.color }}>{metricInfo.icon}</span>
          {metricInfo.title}
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close
        </Button>
      ]}
      width={800}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text type="secondary">{metricInfo.description}</Text>
        
        <Row gutter={16}>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="Total Count"
                value={metricInfo.data.length}
                valueStyle={{ color: metricInfo.color }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="Total Value"
                value={metricInfo.data.reduce((sum, item) => sum + (item.price || 0), 0)}
                precision={2}
                prefix="$"
                valueStyle={{ color: metricInfo.color }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="Time Period"
                value={timeFilter === 'all' ? 'All Time' : timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)}
                valueStyle={{ color: metricInfo.color }}
              />
            </Card>
          </Col>
        </Row>

        <Table
          dataSource={metricInfo.data}
          columns={metricInfo.columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} items`
          }}
          size="small"
          locale={{
            emptyText: (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Text type="secondary">No data available for this metric.</Text>
              </div>
            )
          }}
        />
      </Space>
    </Modal>
  )
}

export default MetricDetailsModal 