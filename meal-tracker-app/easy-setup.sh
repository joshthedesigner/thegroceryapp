#!/bin/bash

# 🚀 EASY MEAL TRACKER SETUP SCRIPT
# This script opens everything you need to fix the database issue

echo "🚀 MEAL TRACKER - EASY SETUP"
echo "============================"
echo "Timestamp: $(date)"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Not in the meal-tracker-app directory!"
    print_info "Please run this script from the meal-tracker-app folder"
    exit 1
fi

print_status "Starting easy setup process..."

# Step 1: Check if Vite is running
print_info "Step 1: Checking if development server is running..."
if pgrep -f "vite" > /dev/null; then
    print_status "Development server is already running"
else
    print_warning "Development server is not running"
    print_info "Starting development server..."
    npm run dev &
    sleep 3
fi

# Step 2: Open browser to the app
print_info "Step 2: Opening your app in browser..."
open "http://localhost:5173" 2>/dev/null || open "http://localhost:5174" 2>/dev/null || print_warning "Could not open browser automatically"

# Step 3: Open Supabase dashboard
print_info "Step 3: Opening Supabase dashboard..."
open "https://supabase.com/dashboard" 2>/dev/null || print_warning "Could not open Supabase dashboard automatically"

# Step 4: Create the SQL file for easy copying
print_info "Step 4: Creating SQL file for easy copying..."

cat > "FIX_DATABASE.sql" << 'EOF'
-- 🔧 FIX DATABASE SCHEMA - COPY AND PASTE THIS IN SUPABASE SQL EDITOR
-- This will add the missing price column and fix the "Database Setup Required" error

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
EOF

print_status "SQL file created: FIX_DATABASE.sql"

# Step 5: Create step-by-step instructions
print_info "Step 5: Creating step-by-step instructions..."

cat > "QUICK_FIX_INSTRUCTIONS.md" << 'EOF'
# 🚀 QUICK FIX INSTRUCTIONS

## 🎯 **GOAL**: Fix the "Database Setup Required" error in 3 easy steps

### **Step 1: Open Supabase Dashboard**
- The dashboard should have opened automatically
- If not, go to: https://supabase.com/dashboard
- Sign in and select your project: `jdoitxsoquqaudygnbmh`

### **Step 2: Execute the SQL**
- In the left sidebar, click **"SQL Editor"**
- Click **"New query"**
- Copy the contents of `FIX_DATABASE.sql` file
- Paste it into the SQL editor
- Click **"Run"** button

### **Step 3: Test Your App**
- Go back to your app (should be open at http://localhost:5173)
- Refresh the page
- The error should be gone! 🎉

## 🔍 **What This Fixes:**
- ✅ Removes "Database Setup Required" message
- ✅ Enables price tracking for ingredients
- ✅ Fixes meal cost calculations
- ✅ Enables all dashboard features

## 📋 **Files Created:**
- `FIX_DATABASE.sql` - SQL to copy/paste
- `QUICK_FIX_INSTRUCTIONS.md` - These instructions

## 🆘 **If You Get Errors:**
- **"Column already exists"**: The fix is already applied
- **Permission errors**: Make sure you're in the right Supabase project
- **Other errors**: Share the error message

---
**🎯 Ready? Copy the SQL and run it in Supabase!**
EOF

print_status "Instructions created: QUICK_FIX_INSTRUCTIONS.md"

# Step 6: Show current status
echo ""
echo "📊 CURRENT STATUS:"
echo "=================="
print_info "Development server: $(pgrep -f "vite" > /dev/null && echo "Running" || echo "Not running")"
print_info "App URL: http://localhost:5173 (or 5174)"
print_info "Supabase Dashboard: https://supabase.com/dashboard"
print_info "SQL File: FIX_DATABASE.sql"
print_info "Instructions: QUICK_FIX_INSTRUCTIONS.md"

# Step 7: Show the SQL content
echo ""
echo "📋 SQL TO COPY (also saved in FIX_DATABASE.sql):"
echo "================================================"
cat "FIX_DATABASE.sql"

echo ""
echo "🎉 SETUP COMPLETE!"
echo "=================="
print_status "All tools opened and files created"
print_info "Next: Copy the SQL above and run it in Supabase SQL Editor"
print_info "Then refresh your app - the error should disappear!"

# Keep the script running to show the output
echo ""
print_info "Press Ctrl+C to exit this script"
print_info "Your app and Supabase dashboard should now be open"

# Wait for user input
read -p "Press Enter to continue..." 