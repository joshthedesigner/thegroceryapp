import React, { useState } from 'react'
import { Typography, Button, Modal, Space, Alert, Empty } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useIngredients } from '../hooks/useIngredients'
import IngredientForm from '../components/IngredientForm'
import IngredientsTable from '../components/IngredientsTable'

const { Title } = Typography

const Ingredients = ({ user }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

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

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} className="page-title">
            Ingredients
          </Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Add Ingredient
          </Button>
        </div>
      </div>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {ingredients.length === 0 && !loading ? (
        <Empty
          description="No ingredients added yet"
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
          ingredients={ingredients}
          loading={loading}
          onEdit={handleEdit}
          onDelete={deleteIngredient}
          getUsagePercentage={getUsagePercentage}
          getUsageStatus={getUsageStatus}
        />
      )}

      <Modal
        title={editingIngredient ? 'Edit Ingredient' : 'Add New Ingredient'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
        destroyOnClose
      >
        <IngredientForm
          onSubmit={handleSubmit}
          initialValues={editingIngredient}
          loading={formLoading}
          onCancel={handleCancel}
        />
      </Modal>
    </div>
  )
}

export default Ingredients 