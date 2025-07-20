# PRD: Dashboard Page

## Purpose

The Dashboard Page provides users with a comprehensive view of their ingredient spending, usage, and meal tracking over a selected time period (week, month, or year). The page helps users monitor food utilization, identify trends in spending and ingredient usage, and minimize waste. By visualizing key metrics, the dashboard empowers users to make data-driven decisions to improve their home cooking efficiency and budgeting.

## Key Features

### 1. Metric Cards (Top Section)

The dashboard's top section displays key statistics, providing users with a high-level overview of their ingredient and meal data for the selected time period. These metrics should be organized into two sections: Ingredients Overview and Meals Overview.

#### Ingredients Overview

**Total Ingredients Added**
- **Description:** Displays the total number of ingredient entries added by the user during the selected time range.
- **Calculation:** Count of all ingredients added during the selected period.
- **Display:** Numeric value with trend indicator (e.g., up or down arrow).

**Number of Ingredients**
- **Description:** Displays the count of distinct ingredient types added by the user in the selected period.
- **Calculation:** Unique ingredient names (e.g., "Chicken Breast" counts as 1 regardless of quantity).
- **Display:** Numeric value with trend indicator.

**Value of Ingredients**
- **Description:** Displays the total monetary value of all ingredients added during the selected period.
- **Calculation:** Sum of user-provided values for each ingredient added.
- **Display:** Numeric value in currency format, with trend indicator.

**Amount of Ingredients Used**
- **Description:** Displays the total quantity of ingredients consumed in meals during the selected period.
- **Calculation:** Sum of all ingredient amounts used in meals.
- **Display:** Numeric value with appropriate unit (e.g., "1,250g", "15 items") and trend indicator.

**Value of Ingredients Unused**
- **Description:** Displays the value of ingredients not consumed in meals during the selected period.
- **Calculation:** Total value of ingredients minus the value of ingredients used in meals.
- **Display:** Numeric value in currency format, with trend indicator.

#### Meals Overview

**Number of Meals Added**
- **Description:** Displays the total number of meals logged by the user during the selected period.
- **Display:** Numeric value with trend indicator.

**Average Cost per Meal**
- **Description:** Displays the average monetary value of each meal prepared by the user during the selected period.
- **Calculation:** Total value of ingredients used in meals divided by the number of meals logged.
- **Display:** Numeric value in currency format, with trend indicator.

### 2. Time Filter

- **Time Range Toggle:** Users can select the desired time period for data visualization: week, month, or year.
  - **Week:** Display data for the last seven days.
  - **Month:** Display data for the last 30 days.
  - **Year:** Display data for the last 365 days.
- **Navigation:** Users can move forward and backward through time, allowing them to adjust the time range dynamically.
- **Behavior:** When the time filter is changed, all metrics, graphs, and tables on the dashboard should update to reflect the selected time range.

### 3. Line Graph (Middle Section)

The line graph will only display value trends, tracking the monetary value of ingredients and meals over time.

#### Graph: Value Trends
- **Total Value of Ingredients (Blue):** Tracks the total monetary value of ingredients added over time.
- **Value of Ingredients Used (Green):** Tracks the monetary value of ingredients used in meals over time.
- **Value of Ingredients Unused (Red):** Tracks the monetary value of ingredients not consumed in meals over time.

#### Toggle Control
- Users can toggle between "Count" and "Value" views for the graph. In this case, only the Value view will be displayed.

#### Legend
- The graph will include a color-coded legend for easy identification of each line (blue, green, and red).

#### Time Scale
- The X-axis will represent the time periods (week/month/year), and the Y-axis will adjust based on the value (currency).

### 4. Table (Bottom Section)

The table section allows users to drill down into more granular data by toggling between two views: Ingredients View and Meals View.

#### Ingredients View (Default)
- **Name:** The name of the ingredient.
- **Total Value:** The full value of the ingredient when added.
- **Amount Used:** The quantity consumed in meals (e.g., "250g / 500g").
- **Percent Used:** The percentage of the ingredient used relative to its total quantity.
- **Remaining Value:** The value of the unused portion of the ingredient.
- **Status:** A visual indicator to show the status of the ingredient usage:
  - **Green:** Fully used
  - **Yellow:** Partially used
  - **Red:** Unused

#### Meals View
- **Meal Name:** The name of the logged meal.
- **Date Cooked:** The date when the meal was prepared.
- **Ingredients Used:** A list of ingredients with the quantities used in the meal (e.g., "200g Chicken, 100g Rice").
- **Total Cost:** The total monetary value of the ingredients used in the meal.
- **Average Cost:** The cost per meal (for comparison).

### 5. User Interactions

- **Select Time Filter:** Users can choose the time range (week, month, or year) for the dashboard metrics and trends.
- **Navigate Through Time:** Users can navigate forward or backward through time to view historical data.
- **Toggle Between Views:** Users can toggle between the "Ingredients View" and "Meals View" tables to focus on either ingredient data or meal data.
- **Toggle Graph View:** Users can toggle between "Count" and "Value" views for the line graph. In this case, only the Value graph will be active.
- **Click on Metric Cards:** Clicking on any metric card should open a detailed breakdown for that metric.
- **Sort Table Columns:** Users can sort the data in the table by clicking on the column headers.
- **Filter Table Data:** Users can filter the table by ingredient type or meal type.

## Data Model

### Users
- ID, Name, Email

### Ingredients
- ID, Name, Unit, Quantity Purchased, Quantity Remaining, Cost, Purchase Date, User ID

### Meals
- ID, Name, Date, Ingredients Used (array of IngredientUse records), User ID

### IngredientUse (Join Table)
- Meal ID, Ingredient ID, Quantity Used

## Logic Summary

### Ingredient Usage
- Ingredients are logged with a purchase quantity and cost. When an ingredient is used in a meal, the quantity used is deducted from the remaining inventory. The monetary value of the used portion is also calculated based on the ingredient's original value.

### Unused Ingredients
- The dashboard calculates the value of ingredients that were not used in meals during the selected period by subtracting the used value from the total value.

### Meal Costing
- Meals are logged with the ingredients used, and their total cost is the sum of the ingredient values. The average cost per meal is calculated by dividing the total cost of used ingredients by the number of meals logged.

### Time Filter Behavior
- Changing the time filter (week, month, year) causes all metrics, graphs, and tables to refresh to reflect the new time range. This ensures the dashboard always shows the most relevant data for the user's selected timeframe. 