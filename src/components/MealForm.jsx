import React, { useState, useEffect, useMemo } from 'react'
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
  Card,
  Table,
  Checkbox,
  message
} from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { useIngredients } from '../hooks/useIngredients'
import { useMeals } from '../hooks/useMeals'
import dayjs from 'dayjs'
import { formatDate } from '../utils/calculationUtils'

const { Option } = Select
const { Text } = Typography

const MealForm = ({ visible, onCancel, onSuccess, editingMeal = null, user }) => {
  const [form] = Form.useForm()
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [mealInfo, setMealInfo] = useState({ meal_name: '', date_cooked: null })
  const [ingredientSelection, setIngredientSelection] = useState([]) // [{id, checked, quantityUsed}]
  const [dirty, setDirty] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  
  const { ingredients, loading: ingredientsLoading } = useIngredients(user?.id)
  const { addMeal, updateMeal, addIngredientToMeal, updateMealIngredient, deleteMealIngredient } = useMeals(user?.id)

  const isEditing = !!editingMeal

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(handler)
  }, [search])

  // Filtered ingredients based on search
  const filteredIngredients = useMemo(() => {
    if (!debouncedSearch) return ingredients
    return ingredients.filter(ing =>
      ing.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  }, [ingredients, debouncedSearch])

  // Reset wizard state on open/close
  useEffect(() => {
    if (visible && !isEditing) {
      setStep(1)
      setMealInfo({ meal_name: '', date_cooked: null })
      setIngredientSelection(ingredients.map(ing => ({ id: ing.id, checked: false, quantityUsed: 0 })))
      setDirty(false)
    }
  }, [visible, isEditing, ingredients])

  useEffect(() => {
    if (visible) {
      if (isEditing && editingMeal) {
        // Populate form with existing meal data
        form.setFieldsValue({
          meal_name: editingMeal.meal_name,
          date_cooked: dayjs(editingMeal.date_cooked),
          total_cost: editingMeal.total_cost
        })
        
        // Set meal info for edit mode
        setMealInfo({ 
          meal_name: editingMeal.meal_name, 
          date_cooked: dayjs(editingMeal.date_cooked) 
        })
        
        // Initialize ingredient selection with existing meal ingredients
        const existingIngredients = editingMeal.meal_ingredients || []
        const initialSelection = ingredients.map(ing => {
          const existingIngredient = existingIngredients.find(mi => mi.ingredient_id === ing.id)
          return {
            id: ing.id,
            checked: !!existingIngredient,
            quantityUsed: existingIngredient ? existingIngredient.quantity_used : 0,
            mealIngredientId: existingIngredient ? existingIngredient.id : null
          }
        })
        setIngredientSelection(initialSelection)
        
        // Set selected ingredients for display
        setSelectedIngredients(existingIngredients.map(mi => ({
          ingredient_id: mi.ingredient_id,
          ingredient_name: mi.ingredient_name,
          quantity_used: mi.quantity_used,
          amount_remaining: mi.amount_remaining || 0
        })))
        
        // Start at step 2 for editing
        setStep(2)
      } else {
        // Reset form for new meal
        form.resetFields()
        setSelectedIngredients([])
        setIngredientSelection(ingredients.map(ing => ({ id: ing.id, checked: false, quantityUsed: 0 })))
      }
      setError('')
    }
  }, [visible, editingMeal, form, isEditing, ingredients])

  // Step 1: Meal Info
  const handleMealInfoNext = async () => {
    try {
      const values = await form.validateFields(['meal_name', 'date_cooked'])
      setMealInfo({ meal_name: values.meal_name, date_cooked: values.date_cooked })
      setStep(2)
      setDirty(true)
    } catch (err) {
      // Validation error, do nothing
    }
  }

  // Step 2: Ingredient Selection
  const handleIngredientCheck = (id, checked) => {
    console.log('🔍 handleIngredientCheck:', { id, checked })
    setIngredientSelection(prev => prev.map(row => row.id === id ? { ...row, checked, quantityUsed: checked ? row.quantityUsed : 0 } : row))
    setDirty(true)
  }
  const handleQuantityChange = (id, value) => {
    console.log('🔍 handleQuantityChange:', { id, value })
    setIngredientSelection(prev => prev.map(row => row.id === id ? { ...row, quantityUsed: value } : row))
    setDirty(true)
  }

  // Save meal (Step 2 CTA)
  const handleSaveMeal = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Validate at least one ingredient selected
      console.log('🔍 ingredientSelection:', ingredientSelection)
      const selected = ingredientSelection.filter(row => row.checked && row.quantityUsed > 0)
      console.log('🔍 selected ingredients:', selected)
      if (selected.length === 0) {
        setError('Please select at least one ingredient and enter quantity used.')
        setLoading(false)
        return
      }
      
      // Validate meal info
      if (!mealInfo.meal_name || !mealInfo.date_cooked) {
        setError('Please enter meal name and date.')
        setLoading(false)
        setStep(1)
        return
      }

      if (isEditing) {
        // Update existing meal
        const mealData = {
          meal_name: mealInfo.meal_name,
          date_cooked: mealInfo.date_cooked.format('YYYY-MM-DD'),
          total_cost: 0 // Will be calculated after updating ingredients
        }
        
        const { data, error: mealError } = await updateMeal(editingMeal.id, mealData)
        if (mealError) throw mealError
        
        // Update meal ingredients
        for (const row of selected) {
          if (row.mealIngredientId) {
            // Update existing meal ingredient
            await updateMealIngredient(row.mealIngredientId, row.quantityUsed)
          } else {
            // Add new meal ingredient
            await addIngredientToMeal(editingMeal.id, row.id, row.quantityUsed)
          }
        }
        
        // Remove ingredients that are no longer selected
        const currentIngredientIds = selected.map(s => s.id)
        const existingIngredients = editingMeal.meal_ingredients || []
        for (const existing of existingIngredients) {
          if (!currentIngredientIds.includes(existing.ingredient_id)) {
            await deleteMealIngredient(existing.id)
          }
        }
      } else {
        // Create new meal
        const mealData = {
          meal_name: mealInfo.meal_name,
          date_cooked: mealInfo.date_cooked.format('YYYY-MM-DD'),
          total_cost: 0 // Will be calculated after adding ingredients
        }
        const { data, error: mealError } = await addMeal(mealData)
        if (mealError) throw mealError
        const mealId = data.id
        
        // Add ingredients
        for (const row of selected) {
          await addIngredientToMeal(mealId, row.id, row.quantityUsed)
        }
      }
      
      setDirty(false)
      onSuccess()
    } catch (err) {
      setError(err.message || 'Failed to save meal. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Remove discard confirmation modal for Cancel button
  const handleCancelButton = () => {
    onCancel()
  }

  // Always close immediately when X is clicked
  const handleModalCancel = () => {
    onCancel()
  }

  return (
    <>
      <Modal
        title={isEditing ? 'Edit Meal' : 'Log New Meal'}
        open={visible}
        onCancel={handleModalCancel}
        footer={null}
        width={800}
        destroyOnHidden
      >
        {/* Step Indicator removed */}
        {/* Step 1: Meal Info */}
        {step === 1 && (
          <Form
            form={form}
            layout="vertical"
            initialValues={{ date_cooked: dayjs() }}
          >
            <Form.Item
              name="meal_name"
              label="Meal Name"
              rules={[{ required: true, message: 'Please enter a meal name' }]}
            >
              <Input placeholder="e.g., Chicken Stir Fry" onChange={() => setDirty(true)} />
            </Form.Item>
            <Form.Item
              name="date_cooked"
              label="Date Cooked"
              rules={[{ required: true, message: 'Please select a date' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                placeholder="Select date"
                onChange={() => setDirty(true)}
              />
            </Form.Item>
            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, gap: 8 }}>
              <Button onClick={handleCancelButton}>Cancel</Button>
              <Button type="primary" onClick={handleMealInfoNext}>
                Next &rarr;
              </Button>
            </div>
          </Form>
        )}
        {/* Step 2: Select Ingredients */}
        {step === 2 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
              <Input
                placeholder="Search ingredients..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: 260, marginRight: 12 }}
                allowClear
                aria-label="Search ingredients"
              />
            </div>
            <div style={{ maxHeight: 400, overflowY: 'auto', marginBottom: 16, borderRadius: 8, border: '1px solid #f0f0f0', background: '#fff' }}>
              <Table
                dataSource={filteredIngredients}
                rowKey="id"
                pagination={false}
                loading={ingredientsLoading}
                locale={{ 
                  emptyText: (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '32px 16px',
                      color: '#666'
                    }}>
                      {search ? (
                        <div>
                          <div style={{ fontSize: 16, marginBottom: 8, color: '#333' }}>
                            🔍 No matching ingredients found
                          </div>
                          <div style={{ fontSize: 14 }}>
                            Try adjusting your search terms
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: 18, marginBottom: 12, color: '#333', fontWeight: 500 }}>
                            📦 No ingredients available
                          </div>
                          <div style={{ fontSize: 14, marginBottom: 16, lineHeight: 1.5 }}>
                            You need to add ingredients first before you can log a meal.
                          </div>
                          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                            1. Go to the <strong>Ingredients</strong> page<br/>
                            2. Add your ingredients with quantities<br/>
                            3. Come back here to log your meal
                          </div>
                        </div>
                      )}
                    </div>
                  )
                }}
                columns={[
                  {
                    title: '',
                    dataIndex: 'select',
                    key: 'select',
                    width: 48,
                    render: (_, ing) => (
                      <Checkbox
                        checked={ingredientSelection.find(row => row.id === ing.id)?.checked || false}
                        onChange={e => handleIngredientCheck(ing.id, e.target.checked)}
                      />
                    )
                  },
                  {
                    title: 'Ingredient',
                    dataIndex: 'name',
                    key: 'name',
                  },
                  {
                    title: 'Remaining',
                    key: 'remaining',
                    render: (_, ing) => `${ing.amount_remaining} ${ing.unit || 'units'}`
                  },
                  {
                    title: 'Quantity Used',
                    key: 'quantityUsed',
                    render: (_, ing) => {
                      const row = ingredientSelection.find(row => row.id === ing.id)
                      return (
                        <InputNumber
                          min={0}
                          max={ing.amount_remaining || 999999}
                          value={row?.quantityUsed || 0}
                          onChange={val => handleQuantityChange(ing.id, val)}
                          disabled={!row?.checked}
                          style={{ width: 100 }}
                          placeholder="0"
                        />
                      )
                    }
                  }
                ]}
              />
            </div>
            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                style={{ marginTop: 16, marginBottom: 0 }}
              />
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
              <Button onClick={() => setStep(1)}>&larr; Back</Button>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button onClick={handleCancelButton}>Cancel</Button>
                <Button type="primary" loading={loading} onClick={handleSaveMeal}>
                  {isEditing ? 'Update Meal' : 'Add Meal'}
                </Button>
              </div>
            </div>
          </>
        )}
      </Modal>
    </>
  )
}

export default MealForm 