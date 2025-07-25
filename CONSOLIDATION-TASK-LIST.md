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
- **✅ Category 6 COMPLETE** - Date Formatting consolidated
- **✅ Category 7 COMPLETE** - Date Filtering Alignment consolidated
- **✅ Category 8 COMPLETE** - Recent Data Filtering Alignment consolidated
- **⏳ Category 9 PENDING** - Currency Formatting (needs investigation)

## Next Steps

The only remaining task is Category 9: Currency Formatting, which requires more investigation and will be handled in a future session.

**Current Status**: 8 of 9 categories completed successfully! 🎉

Outstanding work:
- Currency Formatting investigation and implementation
- Document all currency display cases
- Plan handling of edge cases
- Consider input field implications

All other consolidation tasks have been completed and verified. 