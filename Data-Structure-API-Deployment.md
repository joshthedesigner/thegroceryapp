# Meal Tracker Web Application: Data Structure, Flow, API Integration, and Deployment

## Overview

This document outlines the architecture, data structure, API requirements, user authentication, and deployment considerations for the Meal Tracker Web Application. The app uses Supabase for backend storage and authentication, Vercel for deployment, and integrates Google Authentication for user login.

## Data Structure

### Supabase Database Structure

The Meal Tracker Web Application will use Supabase as the backend database. The app will consist of several core tables and relationships to store and manage ingredient and meal data.

#### Tables:

##### 1. Ingredients Table
Stores details about the ingredients the user adds to their inventory.

**Columns:**
- **id (Primary Key):** Unique identifier for the ingredient.
- **user_id:** References the user who added the ingredient (linked to Google Auth user).
- **name:** Name of the ingredient (e.g., "Chicken Breast").
- **unit:** Measurement unit (e.g., "g", "kg", "items").
- **amount_purchased:** Quantity purchased (e.g., 500).
- **price:** Price of the ingredient (e.g., 5.00 for $5.00).
- **purchase_date:** Date of purchase.
- **amount_used:** Total amount used in logged meals (e.g., 250g).
- **amount_remaining:** Amount of the ingredient remaining (calculated).
- **created_at:** Timestamp when the ingredient was added.
- **updated_at:** Timestamp when the ingredient details were last updated.

##### 2. Meals Table
Logs the meals prepared by the user and tracks the ingredients used.

**Columns:**
- **id (Primary Key):** Unique identifier for the meal.
- **user_id:** References the user who logged the meal (linked to Google Auth user).
- **meal_name:** Name of the meal (e.g., "Chicken Salad").
- **date_cooked:** Date when the meal was prepared.
- **total_cost:** Total cost of the meal based on ingredients used.
- **created_at:** Timestamp when the meal was logged.
- **updated_at:** Timestamp when the meal entry was last updated.

##### 3. Meal_Ingredients Table
This is a many-to-many relationship table connecting meals and ingredients with their quantities used.

**Columns:**
- **id (Primary Key):** Unique identifier for the record.
- **meal_id:** References the meal.
- **ingredient_id:** References the ingredient.
- **quantity_used:** Amount of the ingredient used in the meal (e.g., 200g).
- **created_at:** Timestamp when the entry was created.
- **updated_at:** Timestamp when the entry was last updated.

## Google Authentication Integration

### Google Auth with Supabase

Instead of manually creating accounts, users will authenticate via Google OAuth using Supabase Auth. This will streamline the login process and allow users to sign in using their existing Google accounts.

#### Steps for Google Authentication Integration:

**Set up Google OAuth in Supabase:**
1. Go to the Supabase Dashboard.
2. Navigate to Authentication > Settings > External OAuth Providers.
3. Enable Google and input the Client ID and Client Secret from the Google Developer Console.

**Frontend Integration (with Supabase JS SDK):**

Install the Supabase client on the frontend:
```bash
npm install @supabase/supabase-js
```

Initialize the Supabase client in the frontend app:
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://your-project-url.supabase.co', 'your-public-api-key');
```

**Google Login Flow:**
Use the Supabase signIn method to authenticate users via Google:
```javascript
async function signInWithGoogle() {
  const { user, session, error } = await supabase.auth.signIn({
    provider: 'google'
  });

  if (error) {
    console.error('Error logging in with Google:', error.message);
    return;
  }

  console.log('User logged in:', user);
  console.log('Session:', session);
}
```

**Session Management:**
Supabase automatically handles session management with JWT tokens. Upon successful login, the user session is created. You can check if the user is logged in by calling:
```javascript
const session = supabase.auth.session();
if (session) {
  console.log('User is logged in:', session.user);
} else {
  console.log('No active session');
}
```

**Log Out:**
Users can log out via:
```javascript
async function logOut() {
  await supabase.auth.signOut();
  console.log('User logged out');
}
```

## API Integration

### API Endpoints for CRUD Operations

The API exposes endpoints to manage ingredients and meals:

#### Ingredients CRUD

**Create Ingredient:**
- **POST** `/ingredients`
- **Payload:**
```json
{
  "user_id": "uuid",
  "name": "Chicken Breast",
  "unit": "g",
  "amount_purchased": 500,
  "price": 5.00,
  "purchase_date": "2025-07-20"
}
```

**Read Ingredient:**
- **GET** `/ingredients/{id}`

**Update Ingredient:**
- **PUT** `/ingredients/{id}`

**Delete Ingredient:**
- **DELETE** `/ingredients/{id}`

#### Meals CRUD

**Create Meal:**
- **POST** `/meals`
- **Payload:**
```json
{
  "user_id": "uuid",
  "meal_name": "Chicken Salad",
  "date_cooked": "2025-07-20",
  "total_cost": 7.00
}
```

**Read Meal:**
- **GET** `/meals/{id}`

**Update Meal:**
- **PUT** `/meals/{id}`

**Delete Meal:**
- **DELETE** `/meals/{id}`

#### Meal Ingredients CRUD

**Create Meal Ingredient:**
- **POST** `/meal_ingredients`
- **Payload:**
```json
{
  "meal_id": "uuid",
  "ingredient_id": "uuid",
  "quantity_used": 200
}
```

**Read Meal Ingredient:**
- **GET** `/meal_ingredients/{id}`

**Update Meal Ingredient:**
- **PUT** `/meal_ingredients/{id}`

**Delete Meal Ingredient:**
- **DELETE** `/meal_ingredients/{id}`

## Frontend-Backend Flow

### Frontend Data Integration

The frontend will use Supabase to handle CRUD operations with the database, providing a seamless connection between the user interface and backend.

- **Ingredient Logging:** The frontend sends ingredient details to the API (POST request) when users add new ingredients.
- **Meal Logging:** When users log a meal, the frontend will send data to the API, which includes the meal name, ingredients used, and the total cost.
- **Real-time Updates:** The frontend will subscribe to Supabase Realtime to display live updates when ingredients or meals are added or updated.

### Real-time Data Syncing

Supabase's Realtime feature ensures that ingredient and meal data is synchronized in real-time across all devices. If a user adds or updates data, the changes are reflected immediately on the user's dashboard.

## Deployment with Vercel

1. **Create a Vercel Account:** Sign up at Vercel.
2. **Link GitHub Repository:** Link your GitHub repository to Vercel for automated deployments.
3. **Configure Vercel Environment Variables:** Add Supabase URL, API keys, and Google OAuth credentials in the Vercel dashboard under Environment Variables.
4. **Automatic Deployment:** Vercel will automatically deploy the app when changes are pushed to the repository.
5. **Staging and Production:** Set up staging and production environments on Vercel and deploy accordingly.

## Security Considerations

- **Session Management:** Supabase automatically handles JWT token-based session management for logged-in users. Ensure to validate session expiration and re-authenticate as necessary.
- **API Security:** Ensure that API keys and Supabase credentials are stored securely as environment variables and never hardcoded in the app code. 