import React, { useState } from 'react'
import { Typography, Button, Modal, Space, Alert, Empty } from 'antd'
import { PlusOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useIngredients } from '../hooks/useIngredients'
import IngredientForm from '../components/IngredientForm'
import IngredientsTable from '../components/IngredientsTable'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

const { Title } = Typography

// Simple error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    // Log error to console
    console.error('ErrorBoundary caught:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return <Alert message="An error occurred" description={this.state.error?.toString()} type="error" showIcon style={{ margin: 32 }} />
    }
    return this.props.children
  }
}

const getWeekRange = (date) => {
  const start = dayjs(date).startOf('week')
  const end = dayjs(date).endOf('week')
  return { start, end }
}

const formatWeekRange = (start, end) => {
  return `${start.format('MMM D')} – ${end.format('MMM D, YYYY')}`
}

const Ingredients = ({ user }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  // Week navigation state
  const [selectedWeekStart, setSelectedWeekStart] = useState(dayjs().startOf('week'))

  const {
    ingredients,
    loading,
    error,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    getUsagePercentage,
    getUsageStatus
  } = useIngredients(user?.id)

  // Log the value of ingredients
  console.log('Ingredients data:', ingredients)

  // Filter ingredients by selected week
  const { start: weekStart, end: weekEnd } = getWeekRange(selectedWeekStart)
  const filteredIngredients = (ingredients || []).filter(ing => {
    if (!ing.purchase_date) {
      console.warn('Ingredient missing purchase_date:', ing)
      return false
    }
    const purchaseDate = dayjs(ing.purchase_date)
    if (!purchaseDate.isValid()) {
      console.warn('Invalid purchase_date for ingredient:', ing)
      return false
    }
    return purchaseDate.isSameOrAfter(weekStart, 'day') && purchaseDate.isSameOrBefore(weekEnd, 'day')
  })

  const handlePrevWeek = () => {
    setSelectedWeekStart(prev => dayjs(prev).subtract(1, 'week').startOf('week'))
  }
  const handleNextWeek = () => {
    if (!dayjs(selectedWeekStart).isSame(dayjs().startOf('week'), 'day')) {
      setSelectedWeekStart(prev => dayjs(prev).add(1, 'week').startOf('week'))
    }
  }
  const isCurrentWeek = dayjs(selectedWeekStart).isSame(dayjs().startOf('week'), 'day')

  const handleAddIngredient = async (ingredientData) => {
    setFormLoading(true)
    const result = await addIngredient(ingredientData)
    setFormLoading(false)
    
    if (!result.error) {
      setIsModalVisible(false)
    }
    
    return result
  }

  const handleUpdateIngredient = async (ingredientData) => {
    setFormLoading(true)
    const result = await updateIngredient(editingIngredient.id, ingredientData)
    setFormLoading(false)
    
    if (!result.error) {
      setIsModalVisible(false)
      setEditingIngredient(null)
    }
    
    return result
  }

  const handleEdit = (ingredient) => {
    setEditingIngredient(ingredient)
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingIngredient(null)
  }

  const handleSubmit = editingIngredient ? handleUpdateIngredient : handleAddIngredient

  // Log props to IngredientsTable and IngredientForm
  console.log('IngredientsTable props:', {
    ingredients: filteredIngredients,
    loading,
    onEdit: handleEdit,
    onDelete: deleteIngredient,
    getUsagePercentage,
    getUsageStatus
  })
  console.log('IngredientForm props:', {
    visible: isModalVisible,
    initialValues: editingIngredient,
    onCancel: handleCancel,
    onSubmit: handleSubmit,
    loading: formLoading
  })

  return (
    <ErrorBoundary>
      <div className="page-container">
        <div className="page-header">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              marginBottom: 16,
            }}
          >
            <Title level={2} className="page-title" style={{ margin: 0 }}>
              Ingredients
            </Title>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Date Arrow Filter Container */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#fff',
                  border: '1px solid #e5e7eb', // gray-200
                  borderRadius: 8,
                  height: 48,
                  padding: '0 18px',
                  boxShadow: 'none',
                  gap: 8,
                }}
              >
                <button
                  onClick={handlePrevWeek}
                  style={{
                    border: 'none',
                    background: 'none',
                    padding: 0,
                    margin: 0,
                    cursor: 'pointer',
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    height: 48,
                  }}
                  aria-label="Previous week"
                >
                  <LeftOutlined style={{ fontSize: 18, color: '#222' }} />
                </button>
                <span style={{ fontWeight: 500, fontSize: 16, minWidth: 120, textAlign: 'center' }}>
                  {formatWeekRange(weekStart, weekEnd)}
                </span>
                <button
                  onClick={handleNextWeek}
                  disabled={isCurrentWeek}
                  style={{
                    border: 'none',
                    background: 'none',
                    padding: 0,
                    margin: 0,
                    cursor: isCurrentWeek ? 'not-allowed' : 'pointer',
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: isCurrentWeek ? 0.5 : 1,
                    height: 48,
                  }}
                  aria-label="Next week"
                >
                  <RightOutlined style={{ fontSize: 18, color: '#222' }} />
                </button>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
                style={{ minWidth: 140, height: 48, padding: '0 24px', fontSize: 16, display: 'flex', alignItems: 'center' }}
              >
                <span style={{ display: 'inline-block', width: '100%' }}>Add Ingredient</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Only show error if it's not a database connection error */}
        {error && !error.includes('does not exist') && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Show database setup message if tables don't exist */}
        {error && error.includes('does not exist') && (
          <Alert
            message="Database Setup Required"
            description="The database tables need to be created. Please run the SQL script in your Supabase dashboard to set up the required tables."
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {filteredIngredients.length === 0 && !loading ? (
          <Empty
            description="No ingredients added for this week"
            style={{ marginTop: 48 }}
          >
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setIsModalVisible(true)}
            >
              Add Your First Ingredient
            </Button>
          </Empty>
        ) : (
          <IngredientsTable
            ingredients={filteredIngredients}
            loading={loading}
            onEdit={handleEdit}
            onDelete={deleteIngredient}
            getUsagePercentage={getUsagePercentage}
            getUsageStatus={getUsageStatus}
          />
        )}

        <IngredientForm
          visible={isModalVisible}
          initialValues={editingIngredient}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          loading={formLoading}
        />
      </div>
    </ErrorBoundary>
  )
}

export default Ingredients 