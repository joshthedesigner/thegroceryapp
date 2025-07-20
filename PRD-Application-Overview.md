# PRD Application Overview: Requirements Document: Home Meal Tracker Web App

## Product Purpose

The Home Meal Tracker App empowers individuals to make informed decisions about their home cooking habits by tracking:

- **Ingredients purchased**
- **Meals prepared**
- **Ingredient usage over time**

It helps users:

- Reduce food waste
- Increase budget awareness
- Discover patterns in cooking and spending habits

## Jobs to Be Done (JTBD)

**When I buy groceries for home cooking,**
I want to track what I've purchased and how much I spent,
so I can understand my food costs and reduce waste.

**When I cook a meal at home,**
I want to log what I made and which ingredients I used,
so I can see how efficiently I'm using what I buy.

**When I review my food habits,**
I want to see trends in usage, spending, and waste over time,
so I can improve my meal planning and budgeting.

## User Persona: Budget-Conscious Home Cook

- Cooks at home 3–6 times per week
- Wants to reduce food waste and understand grocery spend
- Interested in improving cooking efficiency and planning better meals

## User Stories

- As a user, I want to log the ingredients I purchase so I can track costs and inventory.
- As a user, I want to log the meals I cook so I know what I used.
- As a user, I want to see how much of each ingredient I used vs. wasted.
- As a user, I want a dashboard to visualize spending, ingredient usage, and meal trends.
- As a user, I want to toggle between weekly, monthly, and yearly views so I can see my habits over time.
- As a user, I want clear warnings if I try to use more of an ingredient than I have available.
- As a user, I want the ability to edit or delete ingredients and meals to keep my data accurate.

## Core App Features & Flows

### 1. User Authentication
- Sign up / login with Gmail
- Secure user sessions
- Persistent data tied to user account

### 2. Ingredients Page
**Purpose:** Log purchased ingredients and track their cost and availability.

**Features:**
- **Add ingredients** with:
  - Name, unit, quantity, cost, and date of purchase
- **Edit and delete** ingredient entries
- **View inventory** with:
  - Quantity remaining
  - Total value
  - Usage percentage
  - Waste estimation based on unused amounts

### 3. Meal Tracker Page
**Purpose:** Log meals and record ingredient consumption.

**Features:**
- **Add meals** with:
  - Name, date, and list of ingredients with quantities used
- **Edit and delete** meals
- **On save:**
  - Deduct used quantities from ingredient inventory
  - Trigger inline validation if usage exceeds availability
  - Disallow meals with no ingredients selected

### 4. Dashboard Page
**Purpose:** Visualize food habits, ingredient usage, and cost efficiency over time.

#### Metric Cards
**Ingredients Overview**
- Total Ingredients Added
- Number of Distinct Ingredients
- Total Value of Ingredients
- Amount of Ingredients Used
- Value of Ingredients Unused

**Meals Overview**
- Number of Meals Logged
- Average Cost per Meal

#### Time Filter
- Week, Month, Year toggle
- Navigation forward/backward through periods

#### Line Graph
**Graph Option 1: Ingredients Trends**
- Total Ingredients Added
- Ingredients Used
- Ingredients Unused

**Graph Option 2: Value Trends**
- Total Value of Ingredients
- Value of Ingredients Used
- Value of Ingredients Unused

**Includes:**
- Toggle switch for graph type (count/value)
- Time-based X-axis and unit-appropriate Y-axis
- Clear legend with color-coded lines

#### Table View
**Ingredients Table:**
- Name
- Total Value
- Amount Used (e.g. "250g / 500g")
- Percent Used
- Remaining Value
- Usage Status (Fully Used, Partially Used, Unused)

**Meals Table:**
- Meal Name
- Date Cooked
- Ingredients Used
- Total Cost
- Average Cost

#### User Interactions
- Select time filter (week/month/year)
- Navigate to previous or next time periods
- Toggle between Ingredients and Meals tables
- Toggle graph view (Count vs. Value)
- Click metric cards for drill-down
- Sort table columns
- Filter table data by ingredient or meal type

## Data Model

### Users
- ID, Name, Email

### Ingredients
- ID, Name, Unit, Quantity Purchased, Quantity Remaining, Cost, Purchase Date, User ID

### Meals
- ID, Name, Date, Ingredients Used (array of IngredientUse records), User ID

### IngredientUse (Join Table)
- Meal ID, Ingredient ID, Quantity Used

## Logic Summary (Detailed)

The application logic is driven by accurate tracking and transformation of ingredient data across user actions. Key behaviors include:

### Ingredient Tracking Logic:
- When an ingredient is added, it records its total quantity, unit, cost, and purchase date.
- Each time a user logs a meal and selects an ingredient with a usage amount, the app deducts that amount from the remaining inventory for that ingredient.
- The value of the ingredient used is prorated based on the percentage of the original quantity used.
- The unused value of an ingredient is calculated as:
  - `Remaining Quantity ÷ Original Quantity × Original Value`

### Validation Rules:
- Users cannot log a meal with zero ingredients.
- Inline validation prevents users from using more of an ingredient than is currently available.
- Users can edit or delete both ingredients and meals; these updates should trigger real-time re-calculations for inventory, waste, and value.

### Waste Calculation:
- Ingredients not logged in any meal within the selected time range are considered "unused" for that range.
- The value of unused ingredients is calculated and displayed to highlight inefficiencies.
- In future versions, this logic can be extended to factor in expiration dates or spoilage windows.

### Meal Costing Logic:
- A meal's cost is the sum of the proportional value of the ingredients used.
- Average cost per meal = total cost of all meals ÷ number of meals logged.

### Dashboard Synchronization:
- All dashboard elements (cards, graphs, tables) sync to the selected time range.
- Recalculations are triggered on time filter changes, ingredient/meal edits, or additions. 