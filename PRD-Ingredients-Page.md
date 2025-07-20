# Product Requirements Document: Ingredients Page

## Purpose

The Ingredients Page allows users to log, view, and manage the ingredients they purchase for home cooking. It helps track the cost, quantity, and usage of ingredients, providing insights into spending, food waste, and efficiency in the kitchen.

## Goals

- **Track Ingredient Purchases:** Allow users to record ingredients they've purchased, including quantity and price.
- **Monitor Ingredient Usage:** Enable users to track how much of each ingredient has been used in meals.
- **Provide Inventory Management:** Display remaining quantities and costs of ingredients to prevent over-purchasing and waste.
- **Display Trends:** Offer insights into how ingredient usage is aligned with cooking habits over time.

## User Stories

- As a user, I want to log the ingredients I buy so that I can keep track of what I have and how much I spent.
- As a user, I want to view my ingredients in a list to see what I have on hand and how much of each ingredient is remaining.
- As a user, I want to see how much of an ingredient I've used so I can better plan future meals and avoid buying unnecessary ingredients.
- As a user, I want to delete or edit ingredient entries to keep my inventory up to date and accurate.
- As a user, I want to search and filter ingredients to quickly find what I need in my inventory.
- As a user, I want to easily select an ingredient by typing its name in a typeahead input field, making ingredient entry quicker and more accurate.

## Core Features

### 1. Ingredient Entry Form

**Fields:**

- **Unit Type:** Dropdown menu to select the unit of measurement (e.g., "g", "kg", "items", "lbs", etc.). This unit will be displayed first.
- **Ingredient Name:** Typeahead input field where users can type the name of an ingredient, and suggestions will appear as they type, allowing them to select the correct ingredient from a list. When an ingredient is selected, it auto-populates the Ingredient Name field.
- **Amount Purchased:** Input field where the user enters the amount of the ingredient purchased (e.g., "500", "3"). This field will adjust to the selected unit (e.g., "500g" or "3 items").
- **Price:** Input field for the cost of the ingredient (e.g., "$5.00").
- **Purchase Date:** Automatically populated with the current date, but the user can edit it if necessary.
- **Save Button:** To save the new ingredient entry.

### 2. Ingredient List

**Table View:**
Display the ingredients the user has entered in a table format with the following columns:

- **Name:** Ingredient name (e.g., "Chicken Breast")
- **Amount Purchased:** Quantity purchased with the unit (e.g., "500g")
- **Price:** Monetary value of the ingredient (e.g., "$5.00")
- **Amount Used:** Percentage of the ingredient used (with a progress bar).
- **Remaining:** Remaining amount (e.g., "250g").
- **Actions:** Options to edit or delete each entry.

### 3. Search & Filter

- **Search Bar:** Allow users to search for ingredients by name using a typeahead feature that suggests ingredients as the user types.
- **Filter Options:** Allow users to filter by:
  - Ingredient name

### 4. Progress Bar for Ingredient Usage

- **Percent Used:** Display a small progress bar in the "Amount Used" column. This bar should represent the percentage of the ingredient used based on meal logs.
- The progress bar will fill from left to right, indicating how much of the ingredient has been consumed.
- The color of the progress bar should align with the ingredient status:
  - Green for ingredients with substantial usage.
  - Yellow for ingredients that are partially used.
  - Red for ingredients that have not been used.

### 5. Edit and Delete Ingredient Entries

- **Edit:** Clicking the edit icon beside each entry should allow users to modify the details (name, amount, price, etc.).
- **Delete:** Users can delete an ingredient if it is no longer in their inventory or if it was added by mistake. A confirmation prompt should appear before deletion.

### 6. Ingredient Status Indicator

Each ingredient should have a visual indicator next to its name or in the "Status" column showing:

- **Green:** Fully used or nearing completion.
- **Yellow:** Partially used.
- **Red:** Unused or expired.

## User Interface Design

### General Layout

- The page should have a clean and minimalist design with a white background to make the ingredients easy to read and understand.
- Ingredient Entry Form should be clearly separated from the ingredient list, with the form placed at the top of the page or in a modal to prevent it from cluttering the screen.
- The ingredient list should be displayed in a responsive table, making it easy for users to scroll and find specific items.
- Action Buttons (edit, delete) should be clearly visible but not intrusive, placed in the last column.

### Typography

- **Ingredient Names:** Bold and slightly larger font (e.g., 18px).
- **Other Fields:** Standard text size (e.g., 14px) for clarity.
- **Percentage Used:** The progress bar and percentage text should be easily legible, with the percentage value in bold text.

### Colors

- **Primary Color:** Use a light gray or white background for the page and table.
- **Progress Bars:**
  - Green for usage (more than 50% used).
  - Yellow for partial usage.
  - Red for unused ingredients.
- **Action Buttons:** Use clear and consistent color schemes for edit (blue) and delete (red) buttons.

## Data Structure Considerations

The data entered on the Ingredients Page will be stored in the following structure to ensure efficient access, tracking, and updates:

### Ingredient Data Model

**Ingredient:**
- **ID:** Unique identifier for each ingredient.
- **Name:** String value of the ingredient (e.g., "Chicken Breast").
- **Unit:** Measurement unit (e.g., "g", "kg", "items").
- **Amount Purchased:** Numeric value indicating the total amount purchased (e.g., 500 for 500g).
- **Price:** Numeric value for the total cost of the ingredient (e.g., 5.00 for $5.00).
- **Purchase Date:** Date when the ingredient was added (e.g., timestamp).
- **Amount Used:** Numeric value for the total amount used in meals (e.g., 250 for 250g).
- **Amount Remaining:** Calculated field representing how much is left after usage.
- **Status:** A derived field indicating if the ingredient is unused, partially used, or fully used (e.g., "Red", "Yellow", "Green").

### Database Schema

The Ingredients table will store all the details about the ingredients entered by users. Each entry will be uniquely identified by the ID field. This schema will allow for filtering by ingredient name, unit, and usage status.

The Meal Logs table will reference each ingredient's ID when a user logs its usage in a meal. This allows the system to dynamically calculate Amount Used and update Amount Remaining in the Ingredients table based on the logged data.

## Acceptance Criteria

- Users should be able to enter ingredients with required details (name, unit, amount, price).
- Users should be able to type an ingredient name, and suggestions should appear as they type in a typeahead input field, allowing for quick selection.
- Ingredients must be displayed in a clean and organized table with the correct fields visible.
- Users should be able to filter ingredients based on name.
- Progress bars should accurately reflect ingredient usage, updating when the user logs meals.
- The user should be able to edit or delete ingredient entries with confirmation prompts for deletions.
- The interface should be fully responsive, displaying correctly on desktop, tablet, and mobile devices.
- Ingredient data should be accurately stored and retrieved from the backend, with calculations for Amount Used and Amount Remaining working as expected. 