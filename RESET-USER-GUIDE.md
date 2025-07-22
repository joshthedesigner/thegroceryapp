# Reset User Data Guide
## Simulate Being a Brand New User

This guide will help you safely remove all data for `jogold@linkedin.com` and reset the app to treat you as a new user.

## 🎯 What This Will Do

- ✅ Remove all user data from Supabase database
- ✅ Clear browser storage (localStorage, sessionStorage, cookies)
- ✅ Reset welcome screen state
- ✅ Preserve other users' data
- ✅ Maintain app functionality

## 📋 Step-by-Step Instructions

### Step 1: Clear Database Data

1. **Open Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor

2. **Run the Reset Script**
   - Copy the contents of `reset-user-data.sql`
   - Paste into the SQL Editor
   - Click "Run" to execute

3. **Verify Data Removal**
   - The script will show you how many records were deleted
   - All tables should show 0 remaining records for your user

### Step 2: Clear Browser Storage

1. **Open Browser Developer Tools**
   - Press `F12` or right-click → "Inspect"
   - Go to Console tab

2. **Run Storage Clear Script**
   - Copy the contents of `clear-user-storage.js`
   - Paste into the console and press Enter
   - Or run: `clearUserStorage.clearAll()`

3. **Verify Storage is Cleared**
   - Run: `clearUserStorage.checkState()`
   - Should show empty storage

### Step 3: Sign Out and Clear Session

1. **Sign Out from App**
   - Go to your app
   - Click logout/sign out
   - Or manually clear Supabase session

2. **Clear Browser Cache (Optional)**
   - Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
   - Clear cookies and site data for your app domain

### Step 4: Test New User Experience

1. **Visit Your App**
   - Go to your app URL
   - You should see the login page

2. **Sign In Again**
   - Use Google OAuth to sign in with `jogold@linkedin.com`
   - You should be treated as a new user

3. **Verify Welcome Screen**
   - The welcome screen should appear
   - No existing data should be visible
   - All onboarding should trigger

## 🔍 Where User Data is Stored

### Database (Supabase)
- **`auth.users`** - User account info
- **`user_preferences`** - Welcome screen state
- **`ingredients`** - User's ingredients
- **`meals`** - User's meals
- **`meal_ingredients`** - Meal-ingredient relationships

### Browser Storage
- **`localStorage`** - Test user flags, welcome state fallback
- **`sessionStorage`** - Session data
- **Cookies** - Supabase authentication tokens

## 🛡️ Safety Measures

- ✅ Scripts only target `jogold@linkedin.com`
- ✅ Uses safe SQL with proper error handling
- ✅ Preserves other users' data
- ✅ Maintains database structure
- ✅ No destructive operations on auth.users

## 🚨 Important Notes

1. **Backup First**: Consider backing up your data before running scripts
2. **Test Environment**: If possible, test on a staging environment first
3. **Authentication**: You'll need to re-authenticate after clearing cookies
4. **Welcome Screen**: The welcome screen will appear on next login

## 🔧 Troubleshooting

### If Welcome Screen Doesn't Appear
1. Check if `user_preferences` table exists
2. Verify `has_seen_welcome` is `false` for your user
3. Clear browser storage again
4. Check console for errors

### If Data Still Shows
1. Verify the SQL script ran successfully
2. Check if you're logged in with the correct account
3. Clear browser cache completely
4. Try incognito/private browsing mode

### If Authentication Fails
1. Clear all Supabase cookies
2. Sign out completely
3. Clear browser cache
4. Try a different browser

## 📊 Verification Checklist

After completing all steps, verify:

- [ ] No ingredients visible in Ingredients tab
- [ ] No meals visible in Meals tab
- [ ] Welcome screen appears on login
- [ ] Dashboard shows empty state
- [ ] No user preferences stored
- [ ] Fresh authentication session

## 🎉 Success!

Once completed, you'll have a completely fresh user experience with:
- Clean database state
- Reset welcome screen
- No existing data
- Fresh authentication
- All onboarding flows active

---

**Need Help?** Check the console for any error messages and ensure all steps were completed successfully. 