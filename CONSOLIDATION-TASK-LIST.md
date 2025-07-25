# Function Consolidation Task List

## Overview
This task list systematically consolidates duplicate functions across the codebase to improve maintainability and ensure consistency.

## Task Categories (Priority Order)

### 🔴 CRITICAL - High Impact Duplicates

#### **Category 1: `calculateMealCost` Consolidation** ✅ **COMPLETE**
**Impact**: Meal cost calculations could be inconsistent across the app
**Files Affected**: 
- `src/services/supabase.js` (lines 222-236) ✅ **Updated**
- `src/services/supabase-updated.js` (lines 210-224) ✅ **Updated**
- `src/hooks/useMeals.js` (lines 199-213) ✅ **Updated**

**Status**: ✅ **COMPLETED**
- ✅ Added to `calculationUtils.js` with improved variable naming
- ✅ Removed duplicate implementations
- ✅ Updated all imports
- ✅ Build passes successfully
- ✅ All tests pass

---

#### **Category 2: `getUsagePercentage` Consolidation**
**Impact**: Usage percentages could show different values in different components
**Files Affected**:
- `src/hooks/useIngredients.js` (lines 101-107)
- `src/components/IngredientsTable.jsx` (lines 70-78)
- `src/components/DashboardTable.jsx` (lines 116-120)
- `src/components/IngredientUsageProgress.jsx` (lines 15-18)

**Steps**:
1. **Diagnose**: Compare all 4 implementations, identify differences
2. **Propose**: Move to `calculationUtils.js`, update all imports
3. **Execute**: Consolidate into single function
4. **Test**: Verify usage percentages are consistent across all components
5. **Review**: Confirm no regressions

---

#### **Category 3: Status Functions Consolidation**
**Impact**: Status colors and text could be inconsistent
**Files Affected**:
- `src/hooks/useIngredients.js` (lines 109-115)
- `src/components/IngredientsTable.jsx` (lines 46-68)
- `src/components/DashboardTable.jsx` (lines 122-142)
- `src/components/IngredientUsageProgress.jsx` (lines 20-36)

**Functions**: `getUsageStatus`, `getStatusColor`, `getStatusText`

**Steps**:
1. **Diagnose**: Compare all implementations, identify differences
2. **Propose**: Move to `calculationUtils.js`, update all imports
3. **Execute**: Consolidate into single set of functions
4. **Test**: Verify status colors and text are consistent
5. **Review**: Confirm no regressions

---

### 🟡 MODERATE - Medium Impact Duplicates

#### **Category 4: Week Range Functions Consolidation**
**Impact**: Week calculations could be inconsistent between pages
**Files Affected**:
- `src/pages/Meals.jsx` (lines 10-18)
- `src/pages/Ingredients.jsx` (lines 35-43)

**Functions**: `getWeekRange`, `formatWeekRange`

**Steps**:
1. **Diagnose**: Compare implementations, confirm they're identical
2. **Propose**: Move to `calculationUtils.js`, update imports
3. **Execute**: Consolidate into single functions
4. **Test**: Verify week ranges work correctly on both pages
5. **Review**: Confirm no regressions

---

#### **Category 5: User Preferences Functions Consolidation**
**Impact**: User preferences could be handled inconsistently
**Files Affected**:
- `src/services/supabase.js` (lines 324-365)
- `src/features/welcome/utils/welcomeStorage.js` (lines 9-140)

**Functions**: `getUserPreferences`, `updateUserPreferences`, `markWelcomeSeen`

**Steps**:
1. **Diagnose**: Compare implementations, identify differences and dependencies
2. **Propose**: Consolidate into single location, update imports
3. **Execute**: Consolidate functions
4. **Test**: Verify user preferences work correctly
5. **Review**: Confirm no regressions

---

## Execution Process for Each Category

### **Phase 1: Diagnose** 🔍
- [x] Compare all implementations side-by-side
- [x] Identify differences in logic, parameters, return values
- [x] Document current usage patterns
- [x] Identify potential breaking changes
- [x] Create comparison report

### **Phase 2: Propose** 📋
- [x] Design consolidated function signature
- [x] Choose optimal location (usually `calculationUtils.js`)
- [x] Plan import updates
- [x] Document proposed changes
- [x] Wait for review/approval

### **Phase 3: Execute** ⚡
- [x] Create consolidated function
- [x] Update all imports
- [x] Remove duplicate implementations
- [x] Test basic functionality
- [x] Commit changes

### **Phase 4: Test** 🧪
- [x] Verify function works in all contexts
- [x] Test edge cases
- [x] Check for regressions
- [x] Validate UI consistency
- [x] Document test results

### **Phase 5: Review** ✅
- [x] Present results to user
- [x] Wait for confirmation
- [x] Address any issues
- [x] Proceed to next category only after approval

## Success Criteria

### **For Each Category**:
- [x] Single implementation of each function
- [x] All imports updated correctly
- [x] No regressions in functionality
- [x] Consistent behavior across all components
- [x] User confirms everything works as expected

### **Overall**:
- [x] Reduced code duplication
- [x] Improved maintainability
- [x] Consistent behavior across the app
- [x] No breaking changes
- [x] All tests pass

## Notes

- **✅ Category 1 COMPLETE** - calculateMealCost successfully consolidated
- **✅ Category 2 COMPLETE** - getUsagePercentage consolidated
- **✅ Category 3 COMPLETE** - Status functions consolidated
- **✅ Category 4 COMPLETE** - Week Range functions consolidated
- **✅ Category 5 COMPLETE** - User Preferences functions consolidated

---

### 🟡 MODERATE - New Consolidation Opportunities

#### **Category 6: Date Formatting Consolidation**
**Impact**: Date formats could be inconsistent across the app
**Files Affected**:
- `src/components/DashboardTable.jsx`
- `src/components/IngredientsTable.jsx`
- `src/components/MealForm.jsx`
- `src/components/MetricDetailsModal.jsx`
- And others using date formatting

**Functions**: Create new `formatDate` utility

**Steps**:
1. **Diagnose**: Review all date formatting usage
2. **Propose**: Add to `calculationUtils.js` with standard format
3. **Execute**: Create function and update all imports
4. **Test**: Verify consistent date display
5. **Review**: Confirm no regressions

**Confidence Level**: HIGH (90%)
**Risk Level**: LOW

---

### 🟡 MODERATE - Update Existing Function Usage

#### **Category 7: Date Filtering Alignment**
**Impact**: Some components using custom date filtering instead of shared functions
**Files Affected**:
- `src/components/DashboardTable.jsx` (getFilteredData)
- `src/components/MetricDetailsModal.jsx` (getMetricData)
- `src/hooks/useMeals.js` (filterMealsByDateRange)

**Action**: Update to use existing `getFilteredDataForPeriod`

**Steps**:
1. **Diagnose**: Review current custom implementations
2. **Plan**: Map current usage to existing function
3. **Execute**: Replace with `getFilteredDataForPeriod`
4. **Test**: Verify filtering works correctly
5. **Review**: Confirm no regressions

**Confidence Level**: HIGH (85%)
**Risk Level**: LOW

---

#### **Category 8: Recent Data Filtering Alignment**
**Impact**: Custom recent data filtering instead of using shared functions
**Files Affected**:
- `src/components/DashboardMetrics.jsx` (recentPurchases)

**Action**: Update to use existing `getFilteredDataForPeriod`

**Steps**:
1. **Diagnose**: Review current implementation
2. **Plan**: Map to `getFilteredDataForPeriod` with 7-day range
3. **Execute**: Replace custom filtering
4. **Test**: Verify recent data display
5. **Review**: Confirm no regressions

**Confidence Level**: HIGH (85%)
**Risk Level**: LOW

---

### ⚪️ DEFERRED - Needs More Investigation

#### **Category 9: Currency Formatting**
**Impact**: Currency formatting inconsistent across components
**Status**: DEFERRED - Needs more investigation
**Reason**: 
- Medium confidence level (70%)
- Medium risk level
- Need to review all currency display cases
- May need different formats for different contexts

**Investigation Needed**:
1. Document all currency display cases
2. Identify special formatting requirements
3. Consider input field implications
4. Plan handling of edge cases

---

## Ready for Next Category?

**Next Step**: Begin **Category 6: Date Formatting Consolidation**

Shall we proceed with Category 6? 