# Product Requirements Document: Meal Tracker Page

## Purpose

The Meal Tracker Page enables users to log the meals they prepare and track the ingredients used in each meal. This page focuses on meal entry, meal costs, and ingredient usage without tracking or goal-setting features.

## Goals

- **Log Meals:** Allow users to record meals they've prepared, linking each meal to the ingredients used.
- **Monitor Meal Costs:** Calculate and display the total cost of each meal based on the ingredients used.

## User Stories

- As a user, I want to log the meals I cook so that I can keep track of the ingredients used and their cost.
- As a user, I want to select ingredients from my inventory and add them to a meal entry so that I can monitor how much of each ingredient is being used.
- As a user, I want to see the total cost of each meal based on the ingredients used, so I can manage my cooking budget.
- As a user, I want to track the ingredients I've used without including additional tracking or goal-setting features.

## Core Features

### 1. Meal Entry Form

**Fields:**

- **Meal Name:** Text input field where the user enters the name of the meal (e.g., "Chicken Salad").
- **Meal Date:** Date picker to select the date the meal was prepared.
- **Ingredients Used:** Typeahead input field where users can select ingredients from their inventory. As users type the name of an ingredient, a list of suggestions appears, and they can select the ingredient. When selected, the ingredient name, amount, and price auto-populate.
- **Ingredient Quantity Used:** Input field where users can specify the amount of each ingredient used in the meal (e.g., "200g", "2 items").
- **Save Button:** To save the new meal entry.

### 2. Meal List

**Table View:**
Display the meals the user has logged in a table format with the following columns:

- **Meal Name:** Name of the meal (e.g., "Chicken Salad")
- **Date Cooked:** The date the meal was prepared (e.g., "2025-07-20")
- **Ingredients Used:** List of ingredients with quantities used (e.g., "200g Chicken, 100g Lettuce").
- **Total Cost:** Total monetary value of ingredients used in the meal (e.g., "$7.00").
- **Actions:** Options to edit or delete each entry.

### 3. Edit and Delete Meal Entries

- **Edit:** Clicking the edit icon beside each entry should allow users to modify meal details (meal name, ingredients, quantities, etc.).
- **Delete:** Users can delete a meal entry if it was logged incorrectly. A confirmation prompt should appear before deletion.

### 4. Meal Search & Filter

- **Search Bar:** Allow users to search for meals by name or date.
- **Filter Options:** Allow users to filter meals based on:
  - Meal name
  - Date range (e.g., this week, this month, custom range)

## User Interface Design

### General Layout

- The page should have a clean, minimalist design with a white background to maintain readability and focus on the meal tracking data.
- The Meal Entry Form should be clearly separated from the meal list, with the form placed at the top of the page or in a modal to prevent screen clutter.
- The meal list should be displayed in a responsive table that is scrollable and easy to navigate.

### Typography

- **Meal Names:** Bold and slightly larger font (e.g., 18px).
- **Other Fields:** Standard text size (e.g., 14px) for clarity.
- **Cost and Quantity:** Displayed in bold to emphasize important data points like total cost or amount used.

### Colors

- **Primary Color:** Use a light gray or white background for the page and table.
- **Progress Bars:** Use a color scale to indicate ingredient usage:
  - Green for usage (more than 50% used).
  - Yellow for partial usage.
  - Red for unused ingredients.
- **Action Buttons:** Use clear and consistent color schemes for edit (blue) and delete (red) buttons.

## Data Structure Considerations

The data entered on the Meal Tracker Page will be stored and linked to other pages such as the Ingredients Page. Here's how the meal and ingredient data will be structured:

### Meal Data Model

**Meal:**
- **ID:** Unique identifier for each meal.
- **Name:** String value of the meal (e.g., "Chicken Salad").
- **Date Cooked:** Date when the meal was prepared (e.g., timestamp).
- **Ingredients Used:** A list of references to ingredients from the Ingredients Page, including the amount used and the total cost for each ingredient.
- **Total Cost:** Calculated value based on the ingredients used in the meal.

### Ingredient Data Model

**Ingredient:**
- **ID:** Unique identifier for each ingredient.
- **Name:** String value of the ingredient (e.g., "Chicken Breast").
- **Amount Used:** Numeric value representing the total amount of the ingredient used in logged meals.
- **Amount Remaining:** Calculated field representing the remaining amount of the ingredient in the inventory after usage.

### Database Schema

The Meals table will store all meal entries, including linked references to ingredients.

The Ingredients table will store all the details about each ingredient, and the Amount Used field will be updated automatically based on the meals logged.

## Acceptance Criteria

- Users should be able to log meals with required details (meal name, date, ingredients used, quantity, and cost).
- The typeahead feature should allow users to select ingredients from their inventory while logging meals.
- The Total Cost of each meal should be calculated and displayed correctly.
- Users should be able to search and filter meals by name or date.
- The Meal List should be displayed in a clean and organized table with the correct fields visible.
- The user should be able to edit or delete meal entries with confirmation prompts for deletions.
- The interface should be fully responsive, displaying correctly on desktop, tablet, and mobile devices. 