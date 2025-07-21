import React, { useState } from 'react'
import { 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  DatePicker, 
  Button, 
  Space,
  message,
  Modal
} from 'antd'
import { PlusOutlined, SaveOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const { Option } = Select

const IngredientForm = ({ 
  visible,
  onSubmit, 
  initialValues = null, 
  loading = false, 
  onCancel 
}) => {
  const [form] = Form.useForm()
  const [suggestions, setSuggestions] = useState([])
  const [searchValue, setSearchValue] = useState('')

  // Common ingredient names for typeahead
  const commonIngredients = [
    'Chicken Breast', 'Ground Beef', 'Salmon', 'Tuna', 'Shrimp',
    'Rice', 'Pasta', 'Bread', 'Potatoes', 'Onions', 'Garlic',
    'Tomatoes', 'Lettuce', 'Spinach', 'Carrots', 'Broccoli',
    'Milk', 'Cheese', 'Eggs', 'Butter', 'Olive Oil', 'Salt',
    'Pepper', 'Flour', 'Sugar', 'Honey', 'Lemon', 'Lime'
  ]

  // Unit options
  const unitOptions = [
    { value: 'g', label: 'Grams (g)' },
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'lbs', label: 'Pounds (lbs)' },
    { value: 'oz', label: 'Ounces (oz)' },
    { value: 'ml', label: 'Milliliters (ml)' },
    { value: 'l', label: 'Liters (l)' },
    { value: 'items', label: 'Items' },
    { value: 'pieces', label: 'Pieces' },
    { value: 'cups', label: 'Cups' },
    { value: 'tbsp', label: 'Tablespoons (tbsp)' },
    { value: 'tsp', label: 'Teaspoons (tsp)' }
  ]

  // Handle name input with typeahead
  const handleNameChange = (value) => {
    setSearchValue(value)
    if (value) {
      const filtered = commonIngredients.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5)) // Show top 5 suggestions
    } else {
      setSuggestions([])
    }
  }

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    setSearchValue(suggestion)
    setSuggestions([])
    form.setFieldsValue({ name: suggestion })
  }

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const ingredientData = {
        name: values.name,
        unit: values.unit,
        amount_purchased: values.amount_purchased,
        price: values.price,
        purchase_date: values.purchase_date.format('YYYY-MM-DD')
      }

      const result = await onSubmit(ingredientData)
      
      if (result.error) {
        message.error(result.error)
      } else {
        message.success('Ingredient added successfully!')
        form.resetFields()
        setSearchValue('')
        setSuggestions([])
      }
    } catch (error) {
      message.error('Failed to add ingredient')
    }
  }

  // Set initial values when editing
  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        purchase_date: initialValues.purchase_date ? 
          dayjs(initialValues.purchase_date) : dayjs()
      })
      setSearchValue(initialValues.name || '')
    }
  }, [initialValues, form])

  return (
    <Modal
      title={initialValues ? "Edit Ingredient" : "Add Ingredient"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          unit: 'g',
          purchase_date: dayjs()
        }}
      >
        <Form.Item
          label="Ingredient Name"
          name="name"
          rules={[{ required: true, message: 'Please enter ingredient name' }]}
        >
          <div style={{ position: 'relative' }}>
            <Input
              placeholder="e.g., Chicken Breast"
              value={searchValue}
              onChange={(e) => handleNameChange(e.target.value)}
              onBlur={() => setTimeout(() => setSuggestions([]), 200)}
            />
            {suggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                zIndex: 1000,
                maxHeight: '200px',
                overflow: 'auto'
              }}>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      borderBottom: index < suggestions.length - 1 ? '1px solid #f0f0f0' : 'none'
                    }}
                    onMouseDown={() => handleSuggestionSelect(suggestion)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Form.Item>

        <Form.Item
          label="Unit"
          name="unit"
          rules={[{ required: true, message: 'Please select unit' }]}
        >
          <Select placeholder="Select unit">
            {unitOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Amount Purchased"
          name="amount_purchased"
          rules={[{ required: true, message: 'Please enter amount' }]}
        >
          <InputNumber
            placeholder="e.g., 500"
            min={0}
            step={0.01}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: 'Please enter price' }]}
        >
          <InputNumber
            placeholder="e.g., 5.99"
            min={0}
            step={0.01}
            prefix="$"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="Purchase Date"
          name="purchase_date"
          rules={[{ required: true, message: 'Please select purchase date' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={initialValues ? <SaveOutlined /> : <PlusOutlined />}
            >
              {initialValues ? 'Update Ingredient' : 'Add Ingredient'}
            </Button>
            {onCancel && (
              <Button onClick={onCancel}>
                Cancel
              </Button>
            )}
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default IngredientForm 