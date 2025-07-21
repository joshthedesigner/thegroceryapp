import React, { useState, useEffect } from 'react'
import { 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  Select, 
  InputNumber, 
  Button, 
  Space, 
  Alert, 
  Divider,
  Typography,
  Card
} from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { useIngredients } from '../hooks/useIngredients'
import { useMeals } from '../hooks/useMeals'
import dayjs from 'dayjs'

const { Option } = Select
const { Text } = Typography

const MealForm = ({ visible, onCancel, onSuccess, editingMeal = null, user }) => {
  const [form] = Form.useForm()
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { ingredients, loading: ingredientsLoading } = useIngredients(user?.id)
  const { addMeal, updateMeal, addIngredientToMeal } = useMeals(user?.id)

  const isEditing = !!editingMeal

  useEffect(() => {
    if (visible) {
      if (isEditing && editingMeal) {
        // Populate form with existing meal data
        form.setFieldsValue({
          meal_name: editingMeal.meal_name,
          date_cooked: dayjs(editingMeal.date_cooked),
          total_cost: editingMeal.total_cost
        })
        
        // Load existing meal ingredients
        if (editingMeal.meal_ingredients) {
          setSelectedIngredients(editingMeal.meal_ingredients.map(mi => ({
            ingredient_id: mi.ingredient_id,
            ingredient_name: mi.ingredient_name,
            quantity_used: mi.quantity_used,
            unit: mi.unit,
            available_amount: mi.available_amount
          })))
        }
      } else {
        // Reset form for new meal
        form.resetFields()
        setSelectedIngredients([])
      }
      setError('')
    }
  }, [visible, editingMeal, form, isEditing])

  const handleAddIngredient = () => {
    setSelectedIngredients([...selectedIngredients, {
      ingredient_id: null,
      ingredient_name: '',
      quantity_used: 0,
      unit: '',
      available_amount: 0
    }])
  }

  const handleRemoveIngredient = (index) => {
    const newIngredients = selectedIngredients.filter((_, i) => i !== index)
    setSelectedIngredients(newIngredients)
  }

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...selectedIngredients]
    
    if (field === 'ingredient_id') {
      const ingredient = ingredients.find(ing => ing.id === value)
      newIngredients[index] = {
        ...newIngredients[index],
        ingredient_id: value,
        ingredient_name: ingredient ? ingredient.name : '',
        unit: ingredient ? ingredient.unit : '',
        available_amount: ingredient ? ingredient.amount_remaining : 0
      }
    } else {
      newIngredients[index] = {
        ...newIngredients[index],
        [field]: value
      }
    }
    
    setSelectedIngredients(newIngredients)
  }

  const validateIngredientUsage = () => {
    for (const ingredient of selectedIngredients) {
      if (ingredient.quantity_used > ingredient.available_amount) {
        return `Cannot use ${ingredient.quantity_used}${ingredient.unit} of ${ingredient.ingredient_name}. Only ${ingredient.available_amount}${ingredient.unit} available.`
      }
    }
    return null
  }

  const calculateTotalCost = () => {
    let total = 0
    for (const ingredient of selectedIngredients) {
      const ingredientData = ingredients.find(ing => ing.id === ingredient.ingredient_id)
      if (ingredientData && ingredient.quantity_used > 0) {
        const usageRatio = ingredient.quantity_used / ingredientData.amount_purchased
        total += ingredientData.price * usageRatio
      }
    }
    return Math.round(total * 100) / 100 // Round to 2 decimal places
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError('')

      const values = await form.validateFields()
      
      // Validate ingredients
      if (selectedIngredients.length === 0) {
        setError('Please add at least one ingredient to your meal.')
        return
      }

      const validationError = validateIngredientUsage()
      if (validationError) {
        setError(validationError)
        return
      }

      const mealData = {
        meal_name: values.meal_name,
        date_cooked: values.date_cooked.format('YYYY-MM-DD'),
        total_cost: calculateTotalCost()
      }

      let mealId
      if (isEditing) {
        // Update existing meal
        const { data, error } = await updateMeal(editingMeal.id, mealData)
        if (error) throw error
        mealId = editingMeal.id
      } else {
        // Create new meal
        const { data, error } = await addMeal(mealData)
        if (error) throw error
        mealId = data.id
      }

      // Create meal ingredients
      for (const ingredient of selectedIngredients) {
        if (ingredient.ingredient_id && ingredient.quantity_used > 0) {
          const { error } = await addIngredientToMeal(
            mealId,
            ingredient.ingredient_id,
            ingredient.quantity_used
          )
          if (error) throw error
        }
      }

      onSuccess()
      form.resetFields()
      setSelectedIngredients([])
    } catch (err) {
      setError(err.message || 'Failed to save meal. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setSelectedIngredients([])
    setError('')
    onCancel()
  }

  return (
    <Modal
      title={isEditing ? 'Edit Meal' : 'Log New Meal'}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="meal_name"
          label="Meal Name"
          rules={[{ required: true, message: 'Please enter a meal name' }]}
        >
          <Input placeholder="e.g., Chicken Stir Fry" />
        </Form.Item>

        <Form.Item
          name="date_cooked"
          label="Date Cooked"
          rules={[{ required: true, message: 'Please select a date' }]}
        >
          <DatePicker 
            style={{ width: '100%' }} 
            placeholder="Select date"
            defaultValue={dayjs()}
          />
        </Form.Item>

        <Divider orientation="left">Ingredients Used</Divider>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {selectedIngredients.map((ingredient, index) => (
          <Card 
            key={index} 
            size="small" 
            style={{ marginBottom: 16 }}
            extra={
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveIngredient(index)}
              />
            }
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Form.Item
                label="Ingredient"
                required
                style={{ marginBottom: 8 }}
              >
                <Select
                  placeholder="Select an ingredient"
                  value={ingredient.ingredient_id}
                  onChange={(value) => handleIngredientChange(index, 'ingredient_id', value)}
                  loading={ingredientsLoading}
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {ingredients.map(ing => (
                    <Option key={ing.id} value={ing.id}>
                      {ing.name} ({ing.amount_remaining}{ing.unit} remaining)
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Quantity Used"
                required
                style={{ marginBottom: 8 }}
              >
                <InputNumber
                  min={0}
                  max={ingredient.available_amount}
                  value={ingredient.quantity_used}
                  onChange={(value) => handleIngredientChange(index, 'quantity_used', value)}
                  addonAfter={ingredient.unit}
                  style={{ width: '100%' }}
                  placeholder="0"
                />
                {ingredient.available_amount > 0 && (
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Available: {ingredient.available_amount}{ingredient.unit}
                  </Text>
                )}
              </Form.Item>
            </Space>
          </Card>
        ))}

        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={handleAddIngredient}
          style={{ width: '100%', marginBottom: 16 }}
        >
          Add Ingredient
        </Button>

        {selectedIngredients.length > 0 && (
          <Alert
            message={`Estimated Total Cost: $${calculateTotalCost().toFixed(2)}`}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              disabled={selectedIngredients.length === 0}
            >
              {isEditing ? 'Update Meal' : 'Log Meal'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default MealForm 