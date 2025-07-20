# UI Layout Design Document: Dashboard Page

## Purpose

The Dashboard Page is designed to provide users with a clean, organized overview of their ingredient usage, spending, and meal data over time. The layout must be intuitive, easily navigable, and responsive, offering key insights at a glance while enabling detailed exploration through drilldowns.

## Layout Overview

The page is divided into three main sections:

1. **Top Section** – Metric Cards
2. **Middle Section** – Line Graph (Value Trends)
3. **Bottom Section** – Data Table (Ingredients and Meals View)

## 1. Top Section: Metric Cards

### Layout

**Grid Layout:**
- The metric cards are organized in a grid format, with two rows and four columns, prioritizing visibility and accessibility of important stats.
- Each card should have sufficient spacing around it for clarity.

**Card Size:**
- Each metric card should have a consistent size and layout (e.g., 2:1 aspect ratio) to maintain uniformity.

### Content and Design

#### Ingredients Overview (Left Column)

**Total Ingredients Added**
- Displays total count with a trend indicator (up or down arrow).
- **Position:** Top-left card in the first row.

**Number of Ingredients**
- Displays unique ingredient types with a trend indicator.
- **Position:** Top-right card in the first row.

**Value of Ingredients**
- Displays total monetary value of all ingredients added.
- **Position:** Bottom-left card in the second row.

**Amount of Ingredients Used**
- Displays total quantity of ingredients used, with unit (grams, items, etc.).
- **Position:** Bottom-right card in the second row.

#### Meals Overview (Right Column)

**Number of Meals Added**
- Displays total meals logged, with a trend indicator.
- **Position:** Top-left card in the first row.

**Average Cost per Meal**
- Displays average monetary value per meal, with a trend indicator.
- **Position:** Top-right card in the first row.

### Visual Design of Metric Cards

**Background:**
- Each metric card should have a clean, white background for a minimalist and professional appearance.

**Card Layout:**
Each card should have the following structure:

- **Title:** Positioned at the top of the card. The title should be descriptive (e.g., "Total Ingredients Added") and bolded to make it stand out.
- **Metric Value:** Below the title, display the metric value (e.g., "250") in large, bold typography to highlight the most important information.
- **Trending Value:** Under the metric value, include a smaller, grey text that indicates the trend (e.g., "up 5% compared to last week"). This provides context without overwhelming the primary data.

**Spacing and Padding:**
- Each card should have even spacing around the content to ensure a balanced look.
- Ensure there is equal padding within the card to prevent the text from being too close to the edges, enhancing readability and user experience.

**Typography:**
- **Title:** Bold, slightly larger font size (e.g., 18px).
- **Metric Value:** Large, bold font size (e.g., 32px) to make the data the focal point of the card.
- **Trending Value:** Smaller, grey text (e.g., 14px) to visually differentiate it from the main metric.

**Card Arrangement:**
- The cards should be evenly spaced in a grid layout, allowing for balanced alignment and a tidy, organized look.
- Ensure each card has sufficient space between adjacent cards to avoid a crowded appearance.

## 2. Middle Section: Line Graph (Value Trends)

### Layout

**Full-Width Graph:**
- The line graph should take up a large portion of the page width (approximately 60-70%), sitting directly below the metric cards.
- This section should be visually prominent to emphasize trends over time.

**Graph Control Panel:**
- The toggle for switching between Value views only should be positioned directly above the graph.
- It should be easy to toggle with a simple button or dropdown for switching the data type.

### Content and Design

#### Graph Lines

- **Value of Ingredients Added (Blue):** Tracks the total monetary value of ingredients added over time.
- **Value of Ingredients Used (Green):** Tracks the monetary value of ingredients used in meals over time.
- **Value of Ingredients Unused (Red):** Tracks the monetary value of ingredients not used in meals over time.

#### Time Scale
- The X-axis should display the time periods selected (week, month, or year).
- The Y-axis should scale based on the monetary value, with clear numeric labels on both axes.

#### Graph Controls

**Legend:**
- Positioned at the top-right of the graph, aligned with the header.
- Use color-coded labels for each graph line (blue for total ingredients, green for used ingredients, and red for unused ingredients).

**Hover Card:**
When a user hovers over any data point on the graph:

- **Hover Card Appearance:** A hover card should appear near the cursor, displaying detailed information about the specific data point.
- **Color Indicators:** The hover card will show color indicators matching the graph line colors:
  - Blue for Total Ingredients Added
  - Green for Ingredients Used
  - Red for Ingredients Unused
- **Typography:** The hover card should have black typography for the displayed numbers, ensuring they are clear and easy to read. The information should include:
  - The value for that data point (e.g., "Value: $150").
  - The line corresponding to the color (e.g., "Total Value of Ingredients Added").
- **Placement:** The hover card should be positioned close to the cursor, but not obstruct the view of the graph. It should disappear once the cursor moves away from the data point.

### Visual Design

**Graph Style:**
- Use a line graph style with smooth, clean lines for each data set.

**Colors:**
- Different colors for each line to maintain clarity:
  - Blue: Total ingredients added
  - Green: Ingredients used
  - Red: Ingredients unused

**Background:**
- The background of the graph should be light (e.g., white or light gray), with grid lines kept subtle to maintain focus on the graph data.

## 3. Bottom Section: Data Table

### Layout

**Table Size:**
- The table should be responsive and take up 100% of the width below the graph, but should remain easily readable by having a clean and compact layout.

**Table Navigation:**
- Include pagination or infinite scrolling for a smooth browsing experience.
- Display a maximum of 10 rows per page and allow users to navigate through multiple pages.

**Toggle Button:**
- Provide a toggle at the top of the table to switch between Ingredients View and Meals View.
- The default should be Ingredients View.

### Content and Design

#### Ingredients View

**Columns:**
- **Name:** Ingredient name
- **Total Value:** Total value of the ingredient when added
- **Percent Used:** Percentage of the ingredient used (e.g., "50% used").
- **Progress Bar:** A small progress bar displayed on the right side of the Percent Used column. This progress bar should visually represent the percentage of the ingredient that has been used.
- **Remaining Value:** The monetary value of the unused portion.
- **Status:** A visual indicator to show the usage status:
  - Green: Fully used
  - Yellow: Partially used
  - Red: Unused

**Design:**
- The progress bar should be small (approximately 50-70% of the column width) and placed beside the percentage value.
- The color of the progress bar should be consistent with the status (e.g., green for ingredients used).
- As the percentage increases, the progress bar should fill from left to right, reflecting the percentage of usage.

#### Meals View

**Columns:**
- **Meal Name:** Name of the meal
- **Date Cooked:** Date the meal was logged
- **Ingredients Used:** List of ingredients and quantities used (e.g., "200g Chicken, 100g Rice")
- **Total Cost:** The total value of ingredients used in the meal
- **Average Cost:** Cost per meal (for comparison)

### Visual Design

**Table Design:**
- Rows should alternate in color (e.g., white and light gray) for readability.
- Columns should be clearly labeled, and data should be centered for clarity.

**Sort Icons:**
- Each column should be sortable by clicking the column header (ascending/descending).

**Status Indicators:**
- Use color-coded status indicators (green, yellow, red) for ingredients.

## General Layout Design Considerations

### Responsiveness
- The layout should be fully responsive, meaning it should adjust for mobile, tablet, and desktop sizes.
- On smaller screens, some sections (like the metric cards) should stack vertically for easier navigation.

### Accessibility
- Ensure sufficient contrast between background and text for readability.
- Provide text alternatives for any icon-based content, and use keyboard-friendly controls for table sorting and filtering.

### Spacing & Margins
- Maintain consistent padding around all sections for clarity and to avoid a cramped layout.

## User Flow

### Page Load
- The page loads with default settings showing the weekly view, with all metric cards and the line graph populated with data.
- Users can toggle between week, month, and year views, and the dashboard should update accordingly.

### Interacting with Graphs
- Users can hover over data points on the graph for more information.
- The line graph can toggle between value views.

### Table Interaction
- Users can toggle between Ingredients View and Meals View.
- They can also sort columns and filter by ingredient or meal type. 