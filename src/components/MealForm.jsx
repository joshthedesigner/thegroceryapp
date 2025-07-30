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

// Utility function to convert abbreviated units to full names
const getFullUnitName = (unit) => {
  const unitMap = {
    'g': 'grams',
    'kg': 'kilograms',
    'lbs': 'pounds',
    'lb': 'pounds',
    'oz': 'ounces',
    'ml': 'milliliters',
    'l': 'liters',
    'items': 'items',
    'pieces': 'pieces',
    'cups': 'cups',
    'tbsp': 'tablespoons',
    'tsp': 'teaspoons'
  }
  return unitMap[unit] || unit || 'units'
}

const MealForm = ({ visible, onCancel, onSuccess, editingMeal = null, user, refreshIngredients, ingredients, ingredientsLoading }) => {
  const [form] = Form.useForm()
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [mealInfo, setMealInfo] = useState({ meal_name: '', date_cooked: null, weekFilter: 'this_week' })
  const [ingredientSelection, setIngredientSelection] = useState([]) // [{id, checked, quantityUsed}]
  const [dirty, setDirty] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  // Restaurant meal tracking state
  const [mealType, setMealType] = useState('home_cooked')
  const [restaurantName, setRestaurantName] = useState('')
  const [restaurantCost, setRestaurantCost] = useState(null)
  
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

  // Filter ingredients by week based on mealInfo.weekFilter
  const weekFilteredIngredients = useMemo(() => {
    if (!ingredients || ingredients.length === 0) return []
    
    const now = dayjs()
    const startOfThisWeek = now.startOf('week')
    const startOfLastWeek = now.subtract(1, 'week').startOf('week')
    const startOfLastTwoWeeks = now.subtract(2, 'week').startOf('week')
    
    return ingredients.filter(ingredient => {
      const purchaseDate = dayjs(ingredient.purchase_date)
      
      if (mealInfo.weekFilter === 'this_week') {
        return purchaseDate.isSameOrAfter(startOfThisWeek, 'day')
      } else if (mealInfo.weekFilter === 'this_week_plus_last') {
        return purchaseDate.isSameOrAfter(startOfLastWeek, 'day')
      } else if (mealInfo.weekFilter === 'this_week_plus_last_2') {
        return purchaseDate.isSameOrAfter(startOfLastTwoWeeks, 'day')
      }
      
      return true // Default to showing all ingredients
    })
  }, [ingredients, mealInfo.weekFilter])

  // Combined filtered ingredients (search + week filter)
  const finalFilteredIngredients = useMemo(() => {
    if (!debouncedSearch) return weekFilteredIngredients
    return weekFilteredIngredients.filter(ing =>
      ing.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  }, [weekFilteredIngredients, debouncedSearch])

  // Reset wizard state on open/close
  useEffect(() => {
    if (visible && !isEditing) {
      setStep(1)
      setMealInfo({ meal_name: '', date_cooked: null, weekFilter: 'this_week' })
      setDirty(false)
      setError('') // Clear any previous errors
      // Reset restaurant meal state
      setMealType('home_cooked')
      setRestaurantName('')
      setRestaurantCost(null)
      // Reset form fields
      form.resetFields()
    }
  }, [visible, isEditing])

  useEffect(() => {
    if (visible) {
      if (isEditing && editingMeal) {
        // Populate form with existing meal data
        form.setFieldsValue({
          meal_name: editingMeal.meal_name,
          date_cooked: dayjs(editingMeal.date_cooked),
          total_cost: editingMeal.total_cost,
          meal_type: editingMeal.meal_type || 'home_cooked',
          restaurant_name: editingMeal.restaurant_name || '',
          restaurant_cost: editingMeal.restaurant_cost || null
        })
        
        // Set meal info for edit mode
        setMealInfo({ 
          meal_name: editingMeal.meal_name, 
          date_cooked: dayjs(editingMeal.date_cooked) 
        })
        
        // Set restaurant meal state for editing
        setMealType(editingMeal.meal_type || 'home_cooked')
        setRestaurantName(editingMeal.restaurant_name || '')
        setRestaurantCost(editingMeal.restaurant_cost || null)
        
        // Initialize ingredient selection with existing meal ingredients
        const existingIngredients = editingMeal.meal_ingredients || []
        const initialSelection = weekFilteredIngredients.map(ing => {
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
        setSelectedIngredients([])
        setIngredientSelection(weekFilteredIngredients.map(ing => ({ id: ing.id, checked: false, quantityUsed: 0 })))
        setError('') // Clear any previous errors
        // Reset restaurant meal state
        setMealType('home_cooked')
        setRestaurantName('')
        setRestaurantCost(null)
      }
      setError('')
    }
  }, [visible, editingMeal, form, isEditing])

  // Handle ingredient selection updates when weekFilteredIngredients changes
  useEffect(() => {
    if (visible && !isEditing && weekFilteredIngredients.length > 0) {
      // Only update ingredient selection if we're not editing and the modal is visible
      // and if ingredientSelection is empty (initial setup)
      if (ingredientSelection.length === 0) {
        setIngredientSelection(weekFilteredIngredients.map(ing => ({ id: ing.id, checked: false, quantityUsed: 0 })))
      }
    }
  }, [weekFilteredIngredients, visible, isEditing, ingredientSelection.length])

  // Monitor step changes
  useEffect(() => {
    // console.log('[DEBUG] Step changed to:', step)
  }, [step])

  // Step 1: Meal Info
  const handleMealInfoNext = async () => {
    // console.log('[DEBUG] handleMealInfoNext called, current step:', step)
    try {
      const fieldsToValidate = ['date_cooked', 'weekFilter', 'meal_type']
      if (mealType === 'home_cooked') {
        fieldsToValidate.push('meal_name')
      } else {
        fieldsToValidate.push('restaurant_name', 'restaurant_cost')
      }
      
      const values = await form.validateFields(fieldsToValidate)
      
      // Additional validation for restaurant meals
      if (values.meal_type === 'restaurant') {
        if (!values.restaurant_name?.trim()) {
          setError('Please enter a restaurant name.')
          return
        }
        if (values.restaurant_cost === null || values.restaurant_cost === undefined || values.restaurant_cost < 0) {
          setError('Please enter a valid meal cost.')
          return
        }
      }
      
      // console.log('[DEBUG] Form validation passed, values:', values)
      setMealInfo({ meal_name: values.meal_name, date_cooked: values.date_cooked, weekFilter: values.weekFilter })
      // console.log('[DEBUG] About to set step to 2, current step:', step)
      setStep(2)
      // console.log('[DEBUG] setStep(2) called')
      setDirty(true)
    } catch (err) {
      // Validation error - show error message
      // console.log('[DEBUG] Form validation error:', err)
      setError('Please fill in all required fields before proceeding.')
    }
  }

  // Step 2: Ingredient Selection
  const handleIngredientCheck = (id, checked) => {
    setIngredientSelection(prev => prev.map(row => row.id === id ? { ...row, checked, quantityUsed: checked ? row.quantityUsed : 0 } : row))
    setDirty(true)
  }
  const handleQuantityChange = (id, value) => {
    setIngredientSelection(prev => prev.map(row => row.id === id ? { ...row, quantityUsed: value } : row))
    setDirty(true)
  }

  // Save meal (Step 2 CTA)
  const handleSaveMeal = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Get form values for validation
      const formValues = await form.validateFields()
      
      // Validate at least one ingredient selected for home cooked meals
      if (mealType === 'home_cooked') {
        const selected = ingredientSelection.filter(row => row.checked && row.quantityUsed > 0)
        if (selected.length === 0) {
          setError('Please select at least one ingredient and enter quantity used.')
          setLoading(false)
          return
        }
      }
      
      // Validate meal info based on meal type
      if (mealType === 'home_cooked') {
        if (!formValues.meal_name || !formValues.date_cooked) {
          setError('Please enter meal name and date.')
          setLoading(false)
          setStep(1)
          return
        }
      } else {
        if (!formValues.restaurant_name?.trim() || formValues.restaurant_cost === null || formValues.restaurant_cost === undefined || formValues.restaurant_cost < 0 || !formValues.date_cooked) {
          setError('Please enter restaurant name, cost, and date.')
          setLoading(false)
          setStep(1)
          return
        }
      }

      if (isEditing) {
        // Update existing meal
        const mealData = {
          meal_name: mealType === 'restaurant' ? formValues.restaurant_name : formValues.meal_name,
          date_cooked: formValues.date_cooked.format('YYYY-MM-DD'),
          meal_type: mealType,
          restaurant_name: mealType === 'restaurant' ? formValues.restaurant_name : null,
          restaurant_cost: mealType === 'restaurant' ? formValues.restaurant_cost : null,
          total_cost: mealType === 'restaurant' ? formValues.restaurant_cost : 0 // Will be calculated after updating ingredients for home cooked meals
        }
        
        const { data, error: mealError } = await updateMeal(editingMeal.id, mealData)
        if (mealError) throw mealError
        
        // Update meal ingredients only for home cooked meals
        if (mealType === 'home_cooked') {
          const selected = ingredientSelection.filter(row => row.checked && row.quantityUsed > 0)
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
        }
      } else {
        // Create new meal
        const mealData = {
          meal_name: mealType === 'restaurant' ? formValues.restaurant_name : formValues.meal_name,
          date_cooked: formValues.date_cooked.format('YYYY-MM-DD'),
          meal_type: mealType,
          restaurant_name: mealType === 'restaurant' ? formValues.restaurant_name : null,
          restaurant_cost: mealType === 'restaurant' ? formValues.restaurant_cost : null,
          total_cost: mealType === 'restaurant' ? formValues.restaurant_cost : 0 // Will be calculated after adding ingredients for home cooked meals
        }
        const { data, error: mealError } = await addMeal(mealData)
        if (mealError) throw mealError
        const mealId = data.id
        
        // Add ingredients only for home cooked meals
        if (mealType === 'home_cooked') {
          const selected = ingredientSelection.filter(row => row.checked && row.quantityUsed > 0)
          for (const row of selected) {
            await addIngredientToMeal(mealId, row.id, row.quantityUsed)
          }
        }
      }
      
      setDirty(false)
      onSuccess()
    } catch (err) {
      // Handle specific constraint violation errors
      if (err.message && err.message.includes('duplicate key') || err.message && err.message.includes('meals_user_id_meal_name_date_cooked_key')) {
        setError('A meal with this name already exists for this date. Please choose a different name or date.')
      } else if (err.message && err.message.includes('UNIQUE')) {
        setError('A meal with this name already exists for this date. Please choose a different name or date.')
      } else {
        setError(err.message || 'Failed to save meal. Please try again.')
      }
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
        styles={{
          header: {
            paddingBottom: '8px'
          }
        }}
      >
        {/* Step 1: Meal Info */}
        {step === 1 && (
          <Form
            form={form}
            layout="vertical"
            initialValues={{ date_cooked: dayjs(), weekFilter: 'this_week', meal_type: 'home_cooked' }}
          >
            <Form.Item
              name="meal_type"
              label="Meal Type *"
              rules={[{ required: true, message: 'Please select a meal type' }]}
              required={false}
            >
              <Select 
                value={mealType}
                onChange={(value) => {
                  setMealType(value)
                  setDirty(true)
                }}
                style={{ width: 280 }}
              >
                <Option value="home_cooked">Home Cooked</Option>
                <Option value="restaurant">Restaurant</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="date_cooked"
              label="Date *"
              rules={[{ required: true, message: 'Please select a date' }]}
              required={false}
            >
              <DatePicker 
                style={{ width: 200 }} 
                placeholder="Select date"
                onChange={() => setDirty(true)}
              />
            </Form.Item>
            
            {mealType === 'home_cooked' ? (
              <>
                <Form.Item
                  name="meal_name"
                  label="Meal Name *"
                  rules={[{ required: true, message: 'Please enter a meal name' }]}
                  required={false}
                >
                  <Input 
                    placeholder="e.g., Chicken Stir Fry" 
                    onChange={() => setDirty(true)}
                    style={{ width: 350 }}
                  />
                </Form.Item>
                <Form.Item
                  name="weekFilter"
                  label="Which week's ingredients do you want to use? *"
                  rules={[{ required: true, message: 'Please select a week filter' }]}
                  required={false}
                >
                  <Select 
                    onChange={(value) => {
                      setDirty(true)
                    }}
                    style={{ width: 280 }}
                  >
                    <Option value="this_week">This week</Option>
                    <Option value="this_week_plus_last">This week + last week</Option>
                    <Option value="this_week_plus_last_2">This week + last 2 weeks</Option>
                  </Select>
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  name="restaurant_name"
                  label="Restaurant Name *"
                  rules={[{ required: true, message: 'Please enter a restaurant name' }]}
                  required={false}
                >
                  <Input 
                    placeholder="e.g., McDonald's" 
                    onChange={() => setDirty(true)}
                    style={{ width: 350 }}
                  />
                </Form.Item>
                <Form.Item
                  name="restaurant_cost"
                  label="Meal Cost *"
                  rules={[
                    { required: true, message: 'Please enter a meal cost' },
                    { type: 'number', min: 0, message: 'Cost must be 0 or greater' }
                  ]}
                  required={false}
                >
                  <InputNumber
                    placeholder="0.00"
                    onChange={() => setDirty(true)}
                    min={0}
                    step={0.01}
                    precision={2}
                    style={{ width: 200 }}
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </>
            )}
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
              <Button type="primary" onClick={() => {
                if (mealType === 'restaurant') {
                  handleSaveMeal()
                } else {
                  handleMealInfoNext()
                }
              }}>
                {mealType === 'restaurant' ? 'Save' : 'Next &rarr;'}
              </Button>
            </div>
          </Form>
        )}
        {/* Step 2: Select Ingredients (Home Cooked Meals Only) */}
        {step === 2 && mealType === 'home_cooked' && (
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
                dataSource={finalFilteredIngredients}
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
                    width: 64,
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
                    title: 'Usage',
                    key: 'usage',
                    render: (_, ing) => {
                      const remaining = ing.amount_remaining || ing.amount_purchased || 0
                      const used = ing.amount_used || 0
                      const total = ing.amount_purchased || 0
                      const unit = ing.unit || 'units'
                      return `${used}/${total} ${getFullUnitName(unit)} used`
                    }
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
                          style={{ width: 136 }}
                          placeholder="0"
                          suffix={
                            <span style={{
                              color: '#666',
                              fontSize: 'calc(1em - 4px)',
                              fontWeight: 'normal',
                              paddingLeft: '4px'
                            }}>
                              {getFullUnitName(ing.unit)}
                            </span>
                          }
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
                <Button type="primary" loading={loading} onClick={handleSaveMeal} style={{ fontWeight: '700' }}>
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