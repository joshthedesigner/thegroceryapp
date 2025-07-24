import React, { useState } from 'react'
import { Typography, Button, Space, message, Modal } from 'antd'
import { PlusOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useMeals } from '../hooks/useMeals'
import MealForm from '../components/MealForm'
import MealsTable from '../components/MealsTable'
import dayjs from 'dayjs'

const { Title } = Typography

const getWeekRange = (date) => {
  const start = dayjs(date).startOf('week')
  const end = dayjs(date).endOf('week')
  return { start, end }
}

const formatWeekRange = (start, end) => {
  return `${start.format('MMM D')} – ${end.format('MMM D, YYYY')}`
}

const Meals = ({ user }) => {
  const [formVisible, setFormVisible] = useState(false)
  const [editingMeal, setEditingMeal] = useState(null)
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState(null)
  // Week navigation state
  const [selectedWeekStart, setSelectedWeekStart] = useState(dayjs().startOf('week'))

  const { 
    meals, 
    loading, 
    deleteMeal, 
    refreshMeals 
  } = useMeals(user?.id)

  // Filter meals by selected week
  const { start: weekStart, end: weekEnd } = getWeekRange(selectedWeekStart)
  const filteredMeals = (meals || []).filter(meal => {
    const mealDate = dayjs(meal.date_cooked)
    return mealDate.isSameOrAfter(weekStart, 'day') && mealDate.isSameOrBefore(weekEnd, 'day')
  })
  
  // Debug filtering
  console.log('Meals page - all meals:', meals?.length)
  console.log('Meals page - week range:', weekStart.format('YYYY-MM-DD'), 'to', weekEnd.format('YYYY-MM-DD'))
  console.log('Meals page - filtered meals:', filteredMeals?.length)

  const handlePrevWeek = () => {
    setSelectedWeekStart(prev => dayjs(prev).subtract(1, 'week').startOf('week'))
  }
  const handleNextWeek = () => {
    // Only allow going forward if not on current week
    if (!dayjs(selectedWeekStart).isSame(dayjs().startOf('week'), 'day')) {
      setSelectedWeekStart(prev => dayjs(prev).add(1, 'week').startOf('week'))
    }
  }
  const isCurrentWeek = dayjs(selectedWeekStart).isSame(dayjs().startOf('week'), 'day')

  const handleAddMeal = () => {
    setEditingMeal(null)
    setFormVisible(true)
  }

  const handleEditMeal = (meal) => {
    setEditingMeal(meal)
    setFormVisible(true)
  }

  const handleDeleteMeal = async (mealId) => {
    try {
      const { error } = await deleteMeal(mealId)
      if (error) throw error
      
      message.success('Meal deleted successfully')
      refreshMeals()
    } catch (err) {
      message.error('Failed to delete meal: ' + err.message)
    }
  }

  const handleViewDetails = (meal) => {
    setSelectedMeal(meal)
    setDetailsVisible(true)
  }

  const handleFormSuccess = () => {
    setFormVisible(false)
    setEditingMeal(null)
    message.success(editingMeal ? 'Meal updated successfully' : 'Meal logged successfully')
    refreshMeals()
  }

  const handleFormCancel = () => {
    console.log('[Meals] handleFormCancel called: closing modal')
    setFormVisible(false)
    setEditingMeal(null)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
          <Title level={2} className="page-title" style={{ margin: 0 }}>
            Meals
          </Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#fff',
                border: '1px solid #e5e7eb',
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
              onClick={handleAddMeal}
              style={{ minWidth: 140, height: 46, padding: '0 24px', fontSize: 16, display: 'flex', alignItems: 'center' }}
            >
              <span style={{ display: 'inline-block', width: '100%' }}>Log Meal</span>
            </Button>
          </div>
        </div>
      </div>
      
      <MealsTable
        meals={filteredMeals}
        loading={loading}
        onEdit={handleEditMeal}
        onDelete={handleDeleteMeal}
        onViewDetails={handleViewDetails}
      />
      
      {/* Add debugging */}
      {console.log('Meals page filteredMeals:', filteredMeals)}
      {console.log('Meals page filteredMeals length:', filteredMeals?.length)}

      <MealForm
        visible={formVisible}
        editingMeal={editingMeal}
        onCancel={handleFormCancel}
        onSuccess={handleFormSuccess}
        user={user}
      />

      {/* Meal Details Modal */}
      <Modal
        title="Meal Details"
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={[
          <Button key="edit" type="primary" onClick={() => {
            setDetailsVisible(false)
            handleEditMeal(selectedMeal)
          }}>
            Edit Meal
          </Button>,
          <Button key="close" onClick={() => setDetailsVisible(false)}>
            Close
          </Button>
        ]}
        width={600}
      >
        {selectedMeal && (
          <div>
            <Title level={4}>{selectedMeal.meal_name}</Title>
            <p><strong>Date:</strong> {new Date(selectedMeal.date_cooked).toLocaleDateString()}</p>
            <p><strong>Total Cost:</strong> ${selectedMeal.total_cost?.toFixed(2) || '0.00'}</p>
            
            {/* Debug info */}
            {console.log('Modal selectedMeal:', selectedMeal)}
            {console.log('Modal meal_ingredients:', selectedMeal.meal_ingredients)}
            {console.log('Modal meal_ingredients length:', selectedMeal.meal_ingredients?.length)}
            
            {selectedMeal.meal_ingredients && selectedMeal.meal_ingredients.length > 0 ? (
              <div>
                <Title level={5}>Ingredients Used:</Title>
                <ul>
                  {selectedMeal.meal_ingredients.map((ingredient, index) => (
                    <li key={index}>
                      {ingredient.ingredients?.name || 'Unknown ingredient'} - {ingredient.quantity_used} units
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No ingredients recorded for this meal.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Meals 