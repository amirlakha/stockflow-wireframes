# Epic: Connect Store Selection to Inventory Overview

## Goal
Wire up the store selection screen to properly navigate to the inventory overview with the selected store's context, and implement pagination for store selection.

## Non-Breaking Implementation Steps

### Step 1: Add Store Context Infrastructure ✅
- [x] Add `selectedStore` property to inventoryDemoControls
- [x] Add `setSelectedStore()` method to accept store data
- [x] Create `getStoreById()` helper function in store selection
- [x] No UI changes - just infrastructure
- [x] **User Testing Required**
- [x] Commit: "Add store context infrastructure"

### Step 2: Update Navigation Function ✅
- [x] Modify `selectStore()` to accept store object
- [x] Keep existing alert for now (non-breaking)
- [x] Add console.log to verify store data passed
- [x] **User Testing Required**
- [x] Commit: "Update selectStore to accept store data"

### Step 3: Pass Store Context During Navigation ✅
- [x] Update `selectStore()` to call `navigateTo('inventory')` after alert
- [x] Pass store data to inventory before navigation
- [x] Keep alert to show what's happening
- [x] **User Testing Required**
- [x] Commit: "Pass store context during navigation"

### Step 4: Update Inventory Header ✅
- [x] Read store context in inventory initialization
- [x] Update store badge to show selected store name
- [x] Update breadcrumb with store name
- [x] Default to "Oxford Street" if no store selected
- [x] **User Testing Required**
- [x] Commit: "Update inventory header with store context"

### Step 5: Add More Sample Stores ✅
- [x] Extend store data array with 8 total stores
- [x] Add stores: Camden, Westfield, Kings Road
- [x] Each with unique metrics and status
- [x] Update product counts to be between 8-50 for realism
- [x] Ensure alert counts are reasonable (0-5 for good, 6-10 for warning, 11+ for critical)
- [x] **User Testing Required**
- [x] Commit: "Add more sample stores for pagination"

### Step 6: Implement Store Pagination Logic ✅
- [x] Add `currentStorePage` property to store selection
- [x] Add `storesPerPage: 5` configuration (changed from 6 for better layout)
- [x] Create `paginateStores()` function (integrated into handleStoreFiltering)
- [x] Update `handleStoreFiltering()` to use pagination
- [x] **User Testing Required**
- [x] Commit: "Implement store pagination logic"

### Step 7: Make Pagination Interactive ✅
- [x] Update `showMoreStores()` to increment page
- [x] Add "Previous" pagination card when on page 2+
- [x] Update pagination text with actual remaining count
- [x] Reset to page 1 when filters change (already done in Step 6)
- [x] **User Testing Required**
- [x] Commit: "Make store pagination interactive"

### Step 8: Connect Store Context to Products ✅
- [x] Add store-specific product sets (8-50 products per store)
- [x] Generate additional products dynamically to match store counts
- [x] Filter products based on selected store
- [x] Update product count in header
- [x] Update alerts count based on filtered products
- [x] Remove "Large Inventory" demo button (no longer needed)
- [x] Update "Live Update" button to also update header summary when alerts change
- [x] **User Testing Required**
- [x] Commit: "Connect store context to products"

### Step 9: Polish Navigation Flow ✅
- [x] Remove alert from `selectStore()`
- [x] Add smooth transition effect
- [x] Ensure back button returns to store selection
- [x] Preserve last selected store in session
- [x] **User Testing Required**
- [ ] Commit: "Polish navigation flow"

### Step 10: Update Dashboard Summary Cards ⏳
- [ ] Calculate total stores accessible (8)
- [ ] Calculate total alerts across all stores
- [ ] Calculate total products across all stores
- [ ] Update dashboard cards dynamically
- [ ] **User Testing Required**
- [ ] Commit: "Update dashboard summary with real data"

### Step 11: Update Documentation ⏳
- [ ] Update implementation notes
- [ ] Document new store context system
- [ ] Update CLAUDE.md with completion status
- [ ] Create review section in todo
- [ ] **User Acceptance**
- [ ] Commit: "Update documentation for store-inventory connection"

## Testing Checklist (After Each Step)
- [ ] All screens display correctly
- [ ] Navigation between screens works
- [ ] Store selection filters work
- [ ] Inventory features remain functional
- [ ] No console errors
- [ ] Demo controls work in both screens

## Why Each Step is Non-Breaking:
1. **Steps 1-2**: Only add properties/methods, no behavior change
2. **Steps 3-4**: Navigation added after existing alert, displays enhanced
3. **Steps 5-6**: More data doesn't break existing functionality
4. **Steps 7-8**: Pagination enhancement, inventory filtering additive
5. **Steps 9-10**: Polish and docs only

## Rollback Strategy
Each step can be reverted independently if issues arise, as they build on each other without modifying core functionality until the final polish step.

## Status Legend
- ⏳ Not Started
- 🔄 In Progress
- ✅ Completed
- ❌ Blocked/Issue

Last Updated: 2025-07-07 - Epic started