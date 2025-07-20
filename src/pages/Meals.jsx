import React, { useState } from 'react'
import { Typography, Button, Space, message, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useMeals } from '../hooks/useMeals'
import MealForm from '../components/MealForm'
import MealsTable from '../components/MealsTable'

const { Title } = Typography

const Meals = ({ user }) => {
  const [formVisible, setFormVisible] = useState(false)
  const [editingMeal, setEditingMeal] = useState(null)
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState(null)
  
  const { 
    meals, 
    loading, 
    deleteMeal, 
    refreshMeals 
  } = useMeals(user?.id)

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
    setFormVisible(false)
    setEditingMeal(null)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} className="page-title">
            Meals
          </Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddMeal}
          >
            Log Meal
          </Button>
        </div>
      </div>
      
      <MealsTable
        meals={meals}
        loading={loading}
        onEdit={handleEditMeal}
        onDelete={handleDeleteMeal}
        onViewDetails={handleViewDetails}
      />

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
            
            {selectedMeal.meal_ingredients && selectedMeal.meal_ingredients.length > 0 ? (
              <div>
                <Title level={5}>Ingredients Used:</Title>
                <ul>
                  {selectedMeal.meal_ingredients.map((ingredient, index) => (
                    <li key={index}>
                      {ingredient.ingredient_name} - {ingredient.quantity_used} {ingredient.unit}
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