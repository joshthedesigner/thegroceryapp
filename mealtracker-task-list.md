# Complete Task List for Meal Tracker Web Application (Supabase + Vercel + ANT Design)

## Phase 1: Initial Setup & Project Foundation

### 1. Set Up Supabase Project
- [x] Create a new Supabase project
- [x] Set up Supabase database schema:
  - [x] Create Ingredients Table
  - [x] Create Meals Table
  - [x] Create Meal_Ingredients Table
- [x] Enable Google Authentication:
  - [x] Go to Supabase Dashboard > Authentication > Settings > External OAuth Providers
  - [x] Enable Google and configure Client ID and Client Secret from Google Developer Console

**Review Step 1: Supabase Project Setup**
- [x] Review the Supabase database schema and ensure all tables are correctly set up
- [x] Ensure Google Authentication is correctly enabled and API keys are configured

### 2. Frontend Setup
- [x] Initialize a new React app or preferred frontend framework (e.g., Vite)
- [x] Install necessary dependencies:
  - [x] Install Supabase SDK (npm install @supabase/supabase-js)
  - [x] Install ANT Design (npm install antd)
  - [x] Install React Router and other libraries as needed
- [x] Set up the basic file structure:
  - [x] Organize components (e.g., Dashboard, Ingredient Entry, Meal Log)
  - [x] Create separate folders for API calls, components, and styles
  - [x] Set up Tailwind CSS or any additional styling preferences alongside ANT Design components

**Review Step 2: Frontend Project Initialization**
- [x] Ensure ANT Design is correctly installed and integrated with the app
- [x] Verify the file structure for components, API calls, and styles

## Phase 2: Core Features - Backend & Frontend Integration

### 3. Ingredients CRUD Operations (Backend)
- [x] Create API endpoints for ingredients:
  - [x] POST /ingredients to add new ingredients
  - [x] GET /ingredients/{id} to fetch ingredient details
  - [x] PUT /ingredients/{id} to update an ingredient
  - [x] DELETE /ingredients/{id} to delete an ingredient

**Review Step 3: Ingredients CRUD Operations (Backend)**
- [x] Test the API endpoints for ingredients
- [x] Ensure user_id is correctly associated with ingredients in Supabase

### 4. Ingredients CRUD Operations (Frontend)
- [x] Create frontend components to manage ingredients using ANT Design components (e.g., Input, Button, Modal, Table):
  - [x] Ingredient form to add new ingredients using ANT Form
  - [x] Display ingredients in a list using ANT Table with options to edit or delete

**Review Step 4: Ingredients CRUD Operations (Frontend)**
- [x] Test ingredient form and verify the correct listing of ingredients using ANT Table
- [x] Ensure data is properly sent to the backend and displayed

### 5. Meal CRUD Operations (Backend)
- [x] Create API endpoints for meals:
  - [x] POST /meals to add a new meal
  - [x] GET /meals/{id} to fetch a meal
  - [x] PUT /meals/{id} to update a meal
  - [x] DELETE /meals/{id} to delete a meal

**Review Step 5: Meal CRUD Operations (Backend)**
- [x] Test the API endpoints for meals
- [x] Verify that meal data is correctly stored and linked to the user

### 6. Meal CRUD Operations (Frontend)
- [x] Create frontend components to log and view meals using ANT Design components (e.g., Input, DatePicker, Select, Button):
  - [x] Meal logging form for entering meal details with ANT Form
  - [x] Display meals using ANT Table with options to edit or delete

**Review Step 6: Meal CRUD Operations (Frontend)**
- [x] Test meal logging form and verify meal data is logged correctly
- [x] Ensure frontend displays meals properly

### 7. Meal Ingredients Linking (Backend)
- [x] Create POST /meal_ingredients API endpoint to log ingredients used in meals

**Review Step 7: Meal Ingredients Linking (Backend)**
- [x] Test the linking of ingredients to meals, ensuring correct quantity tracking

### 8. Meal Ingredients Linking (Frontend)
- [x] Provide an interface to link ingredients to meals with quantities used. Use ANT Select, Input Number, and Button
- [x] Display ingredients in meal details using ANT Table

**Review Step 8: Meal Ingredients Linking (Frontend)**
- [x] Test ingredient linking to meals and ensure the frontend reflects the changes

## Phase 3: Data Structure & Analytics

### 9. Dashboard Metric Cards
- [x] Create frontend components for metric cards using ANT Design Card component:
  - [x] Total Ingredients Added
  - [x] Total Ingredients Used
  - [x] Total Value of Ingredients
  - [x] Number of Meals Logged
  - [x] Average Meal Cost

**Review Step 9: Dashboard Metric Cards**
- [x] Test metric cards for correct display of data and trends
- [x] Ensure that the data aggregates and reflects changes in real-time

### 10. Line Graph (Value Trends)
- [x] Implement the line graph to display trends in the value of ingredients used vs value of ingredients unused using ANT Design's Chart (or another preferred charting library)

**Review Step 10: Line Graph**
- [x] Test the graph for correct data display
- [x] Verify that the graph updates dynamically with new ingredient and meal data

### 11. Ingredient Usage Progress Bars
- [x] Implement progress bars for ingredients using ANT Progress component to show percentage used
- [x] Add hover functionality to show detailed numbers when hovering over progress bars

**Review Step 11: Ingredient Usage Progress Bars**
- [x] Test progress bars to ensure they reflect the correct percentage and update as ingredients are used
- [x] Check hover functionality to show the correct details

## Phase 4: Enhancements & Refinements

### 12. Real-Time Data Sync
- [ ] Implement Supabase Realtime to sync ingredient and meal data across devices
- [ ] Ensure that any updates made by the user are reflected instantly on the UI

**Review Step 12: Real-Time Data Sync**
- [ ] Test the real-time syncing to ensure that changes are immediately visible without page refresh

### 13. Error Handling & Empty States
- [ ] Add error handling to display appropriate messages when something goes wrong (e.g., missing meal data, incorrect ingredient quantity)
- [ ] Implement empty states (e.g., "No meals logged yet") when there is no data to show

**Review Step 13: Error Handling & Empty States**
- [ ] Test error handling for incorrect inputs or failed actions
- [ ] Verify empty states are correctly displayed when there's no data

## Phase 5: Deployment Preparation

### 14. Vercel Deployment Configuration
- [ ] Set up a Vercel account and link to the GitHub repository
- [ ] Add Supabase environment variables (URL, API keys) in Vercel's dashboard

**Review Step 14: Vercel Deployment Configuration**
- [ ] Ensure environment variables are correctly configured in Vercel
- [ ] Test automated deployment to Vercel

## Phase 6: Testing & Final Adjustments

### 15. Manual Testing
- [ ] Test all features:
  - [ ] Google login
  - [ ] Ingredient and meal logging
  - [ ] Dashboard metrics and graphs
  - [ ] Real-time data syncing
  - [ ] Error handling and empty states

**Review Step 15: Manual Testing**
- [ ] Review the entire app manually to ensure all features work as expected
- [ ] Test the app on different devices/browsers

### 16. Automated Testing (If Applicable)
- [ ] If automated tests are written, run them to verify that the app's core functionalities pass all tests

**Review Step 16: Automated Testing**
- [ ] Ensure automated tests pass and cover all critical features

## Phase 7: Deployment

### 17. Deploy on Vercel
- [ ] Connect GitHub repository to Vercel for automated deployments
- [ ] Set up production and staging environments on Vercel
- [ ] Test the deployed app on the live production URL

**Review Step 17: Production Deployment**
- [ ] Test the live app to ensure everything works as expected
- [ ] Verify the performance and fix any deployment-related issues

## Additional Review Steps

### User Experience (UX) Review
- [ ] Review the app's usability, ensuring the interface is intuitive and aesthetically pleasing
- [ ] Conduct user testing if possible and gather feedback on UX/UI

### Performance Optimization
- [ ] Test the app's performance under various conditions (e.g., large number of ingredients or meals)
- [ ] Implement optimizations if necessary (e.g., lazy loading, caching)

### Security Review
- [ ] Ensure that Supabase authentication is correctly implemented and data access is restricted to the logged-in user
- [ ] Conduct a security audit on the app to verify the integrity of sensitive user data 