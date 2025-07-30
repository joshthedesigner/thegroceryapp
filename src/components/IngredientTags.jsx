import React from 'react'
import { Tag, Space, Tooltip } from 'antd'

/**
 * Reusable component for rendering ingredient tags
 * @param {Array} mealIngredients - Array of meal_ingredients
 * @param {Object} options - Rendering options
 * @returns {JSX.Element} Rendered ingredient tags
 */
const IngredientTags = ({ mealIngredients, options = {} }) => {
  const {
    maxDisplay = 2,
    showCount = false,
    showAll = false,
    tagColor = 'blue',
    wrap = true
  } = options

  if (!mealIngredients || mealIngredients.length === 0) {
    return <Tag color="default">No ingredients</Tag>
  }

  const validIngredients = mealIngredients.filter(ing => ing.ingredients && ing.ingredients.name)
  
  if (validIngredients.length === 0) {
    return <Tag color="orange">Ingredients missing</Tag>
  }

  if (showCount) {
    return <Tag color={tagColor}>{`${validIngredients.length} ingredients`}</Tag>
  }

  if (showAll) {
    return (
      <Space wrap={wrap}>
        {validIngredients.map((ing, index) => (
          <Tag key={index} color={tagColor}>
            {ing.ingredients.name}
          </Tag>
        ))}
      </Space>
    )
  }

  const firstFew = validIngredients.slice(0, maxDisplay)
  const remaining = validIngredients.slice(maxDisplay)

  return (
    <Space wrap={wrap}>
      {firstFew.map((ing, index) => (
        <Tag key={index} color={tagColor}>
          {ing.ingredients.name}
        </Tag>
      ))}
      {remaining.length > 0 && (
        <Tooltip title={remaining.map(ing => ing.ingredients.name).join(', ')} placement="top">
          <Tag color={tagColor} style={{ cursor: 'pointer' }}>+{remaining.length} more</Tag>
        </Tooltip>
      )}
    </Space>
  )
}

export default IngredientTags 