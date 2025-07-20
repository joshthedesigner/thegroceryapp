# Meal Tracker Application - Testing Checklist

## 🧪 **COMPREHENSIVE TESTING PLAN**

### **Phase 1: Authentication Testing** ✅
- [ ] **Google OAuth Login**
  - [ ] Click "Sign in with Google" button
  - [ ] Complete Google authentication flow
  - [ ] Verify user is redirected to dashboard after login
  - [ ] Check user session persistence on page refresh
  - [ ] Verify user menu shows correct user information

- [ ] **Logout Functionality**
  - [ ] Click logout in user menu
  - [ ] Verify user is redirected to login page
  - [ ] Check session is properly cleared

### **Phase 2: Core Functionality Testing** ✅

#### **2.1 Ingredients Management**
- [ ] **Add New Ingredient**
  - [ ] Navigate to Ingredients page
  - [ ] Click "Add Ingredient" button
  - [ ] Fill form with: Name, Unit, Amount, Price, Purchase Date
  - [ ] Submit form and verify ingredient appears in table
  - [ ] Check ingredient shows correct usage percentage (0% initially)

- [ ] **Edit Ingredient**
  - [ ] Click edit button on an ingredient
  - [ ] Modify ingredient details
  - [ ] Save changes and verify updates in table
  - [ ] Check usage calculations remain accurate

- [ ] **Delete Ingredient**
  - [ ] Click delete button on an ingredient
  - [ ] Confirm deletion in popup
  - [ ] Verify ingredient is removed from table
  - [ ] Check no errors occur

- [ ] **Ingredient Table Features**
  - [ ] Test search functionality
  - [ ] Test sorting by different columns
  - [ ] Verify progress bars show correct percentages
  - [ ] Check color-coded status indicators (Green/Yellow/Red)

#### **2.2 Meal Tracking**
- [ ] **Add New Meal**
  - [ ] Navigate to Meals page
  - [ ] Click "Log Meal" button
  - [ ] Fill meal name and date
  - [ ] Add ingredients with quantities
  - [ ] Verify cost calculation is accurate
  - [ ] Submit and check meal appears in table

- [ ] **Meal Validation**
  - [ ] Try to use more ingredients than available
  - [ ] Verify error message appears
  - [ ] Try to submit meal with no ingredients
  - [ ] Verify validation prevents submission

- [ ] **Edit Meal**
  - [ ] Click edit on a meal
  - [ ] Modify ingredients or quantities
  - [ ] Save changes and verify updates
  - [ ] Check ingredient inventory updates correctly

- [ ] **Delete Meal**
  - [ ] Delete a meal with ingredients
  - [ ] Verify ingredient inventory is restored
  - [ ] Check meal is removed from table

- [ ] **Meal Table Features**
  - [ ] Test expandable rows to see ingredients
  - [ ] Verify ingredient tags show correctly
  - [ ] Check cost calculations are accurate
  - [ ] Test sorting and pagination

### **Phase 3: Dashboard Analytics Testing** ✅

#### **3.1 Metric Cards**
- [ ] **Metric Calculations**
  - [ ] Verify Total Ingredients count is accurate
  - [ ] Check Distinct Ingredients shows unique types
  - [ ] Verify Total Value calculation
  - [ ] Check Ingredients Used amount
  - [ ] Verify Unused Value calculation
  - [ ] Check Usage Efficiency percentage
  - [ ] Verify Meals Logged count
  - [ ] Check Average Meal Cost calculation

- [ ] **Metric Card Interactions**
  - [ ] Click on each metric card
  - [ ] Verify detailed breakdown modal opens
  - [ ] Check modal shows correct data
  - [ ] Test modal pagination and sorting
  - [ ] Verify modal closes properly

#### **3.2 Time Filtering**
- [ ] **Time Period Selection**
  - [ ] Test Week filter
  - [ ] Test Month filter
  - [ ] Test Year filter
  - [ ] Test All Time filter
  - [ ] Verify all metrics update correctly
  - [ ] Check graphs update with time filter

- [ ] **Navigation Controls**
  - [ ] Test Previous/Next buttons (when applicable)
  - [ ] Verify Reset button functionality
  - [ ] Check period display shows correct dates

#### **3.3 Line Graph**
- [ ] **Graph Display**
  - [ ] Verify Value trends show correctly
  - [ ] Test Count vs Value toggle
  - [ ] Check legend shows all data series
  - [ ] Verify tooltips show correct data
  - [ ] Test graph responsiveness

- [ ] **Data Accuracy**
  - [ ] Verify Total Value line (Blue)
  - [ ] Check Used Value line (Green)
  - [ ] Verify Unused Value line (Red)
  - [ ] Check Meal Cost line (Purple, dashed)

#### **3.4 Progress Bars**
- [ ] **Usage Progress**
  - [ ] Verify progress bars show correct percentages
  - [ ] Check color coding (Green ≥80%, Yellow 50-79%, Red <50%)
  - [ ] Test hover tooltips show detailed information
  - [ ] Verify sorting (lowest usage first)

#### **3.5 Dashboard Table**
- [ ] **Ingredients View**
  - [ ] Test toggle to Ingredients view
  - [ ] Verify all columns display correctly
  - [ ] Test sorting by each column
  - [ ] Check status filters work
  - [ ] Test search functionality

- [ ] **Meals View**
  - [ ] Test toggle to Meals view
  - [ ] Verify meal details show correctly
  - [ ] Check ingredient lists display properly
  - [ ] Test sorting and pagination
  - [ ] Verify cost calculations

- [ ] **Table Interactions**
  - [ ] Click "View Details" on table rows
  - [ ] Verify detail modals open correctly
  - [ ] Check modal shows comprehensive information
  - [ ] Test modal close functionality

### **Phase 4: Integration Testing** ✅

#### **4.1 Data Flow**
- [ ] **Add Ingredient → Dashboard Update**
  - [ ] Add new ingredient
  - [ ] Navigate to dashboard
  - [ ] Verify metrics update immediately
  - [ ] Check graphs reflect new data

- [ ] **Log Meal → Ingredient Usage Update**
  - [ ] Log a meal with ingredients
  - [ ] Check ingredient usage percentages update
  - [ ] Verify dashboard metrics reflect changes
  - [ ] Test progress bars update correctly

- [ ] **Delete Meal → Inventory Restoration**
  - [ ] Delete a meal
  - [ ] Verify ingredient inventory is restored
  - [ ] Check dashboard metrics update
  - [ ] Test progress bars reflect changes

#### **4.2 Real-time Updates**
- [ ] **Cross-page Synchronization**
  - [ ] Add ingredient on Ingredients page
  - [ ] Navigate to Dashboard
  - [ ] Verify data appears without refresh
  - [ ] Test same with meals

#### **4.3 Error Handling**
- [ ] **Network Errors**
  - [ ] Test with poor internet connection
  - [ ] Verify error messages display properly
  - [ ] Check loading states work correctly

- [ ] **Validation Errors**
  - [ ] Test form validation messages
  - [ ] Verify required field validation
  - [ ] Check numeric input validation

### **Phase 5: User Experience Testing** ✅

#### **5.1 Responsive Design**
- [ ] **Mobile Testing**
  - [ ] Test on mobile viewport
  - [ ] Verify navigation works on mobile
  - [ ] Check forms are usable on small screens
  - [ ] Test table responsiveness

- [ ] **Desktop Testing**
  - [ ] Test on desktop viewport
  - [ ] Verify all features work properly
  - [ ] Check hover states and interactions

#### **5.2 Performance**
- [ ] **Loading Times**
  - [ ] Test initial page load speed
  - [ ] Verify dashboard loads quickly
  - [ ] Check form submissions are responsive
  - [ ] Test table pagination performance

#### **5.3 Accessibility**
- [ ] **Keyboard Navigation**
  - [ ] Test tab navigation through forms
  - [ ] Verify keyboard shortcuts work
  - [ ] Check focus indicators are visible

- [ ] **Screen Reader Compatibility**
  - [ ] Test with screen reader if available
  - [ ] Verify alt text for images
  - [ ] Check ARIA labels are present

### **Phase 6: Edge Cases** ✅

#### **6.1 Data Edge Cases**
- [ ] **Empty States**
  - [ ] Test with no ingredients
  - [ ] Test with no meals
  - [ ] Verify empty state messages display
  - [ ] Check dashboard handles empty data

- [ ] **Large Data Sets**
  - [ ] Test with many ingredients
  - [ ] Test with many meals
  - [ ] Verify pagination works correctly
  - [ ] Check performance with large datasets

#### **6.2 User Edge Cases**
- [ ] **Rapid Actions**
  - [ ] Test rapid form submissions
  - [ ] Verify no duplicate entries
  - [ ] Check error handling for conflicts

- [ ] **Browser Compatibility**
  - [ ] Test in different browsers
  - [ ] Verify consistent behavior
  - [ ] Check for browser-specific issues

## 🎯 **TESTING INSTRUCTIONS**

### **How to Use This Checklist:**

1. **Start with Phase 1** - Test authentication first
2. **Move through each phase systematically** - Don't skip steps
3. **Mark items as complete** - Use ✅ to track progress
4. **Document any issues** - Note bugs or unexpected behavior
5. **Test thoroughly** - Don't rush through the process

### **Testing Environment:**
- **URL**: http://localhost:5173/
- **Browser**: Chrome/Firefox/Safari
- **Device**: Desktop and Mobile (if possible)

### **Expected Results:**
- All functionality should work as described in PRD
- No console errors should appear
- Data should persist correctly
- UI should be responsive and intuitive

## 📝 **ISSUE TRACKING**

### **Document Any Issues Found:**
- **Description**: What happened
- **Steps to Reproduce**: How to recreate the issue
- **Expected vs Actual**: What should happen vs what did happen
- **Severity**: High/Medium/Low
- **Browser/Device**: Where the issue occurred

---

**Ready to begin testing? Start with Phase 1: Authentication Testing!** 🚀 