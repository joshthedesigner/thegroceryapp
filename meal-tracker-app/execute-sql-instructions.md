# 🔧 DATABASE SCHEMA UPDATE INSTRUCTIONS

## 🎯 **GOAL**: Add the missing `price` column to fix the "Database Setup Required" error

### **📋 STEP-BY-STEP INSTRUCTIONS:**

#### **Step 1: Open Supabase Dashboard**
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in with your account
3. Select your project: `jdoitxsoquqaudygnbmh`

#### **Step 2: Navigate to SQL Editor**
1. In the left sidebar, click on **"SQL Editor"**
2. Click **"New query"** to create a new SQL query

#### **Step 3: Execute the SQL**
1. Copy and paste this exact SQL code into the editor:

```sql
-- Add price column to ingredients table
ALTER TABLE ingredients 
ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- Add documentation comment
COMMENT ON COLUMN ingredients.price IS 'Total cost of purchasing this ingredient (e.g., $5.99 for 500g flour)';

-- Verify the change
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'ingredients' 
AND column_name = 'price';
```

2. Click the **"Run"** button (or press Ctrl+Enter)

#### **Step 4: Verify Success**
You should see:
- ✅ **Success message**: "Query executed successfully"
- ✅ **Results table**: Showing the new `price` column details

#### **Step 5: Test Your App**
1. Go back to your app at http://localhost:5173/
2. Refresh the page
3. The "Database Setup Required" message should disappear! 🎉

### **🔍 What This Does:**
- **Adds `price` column**: Stores ingredient costs (e.g., $5.99)
- **Sets default value**: $0.00 for existing records
- **Uses proper data type**: DECIMAL(10,2) for currency
- **Adds documentation**: Explains what the column stores

### **🚀 Expected Results:**
- ✅ No more "Database Setup Required" error
- ✅ Dashboard loads properly
- ✅ Can add ingredients with prices
- ✅ Meal cost calculations work
- ✅ All price-related features enabled

### **❓ If You Get Errors:**
- **"Column already exists"**: The column was already added
- **Permission errors**: Make sure you're using the correct Supabase project
- **Other errors**: Share the error message and I'll help fix it

---

**🎯 Ready to execute? Copy the SQL above and run it in your Supabase SQL Editor!** 