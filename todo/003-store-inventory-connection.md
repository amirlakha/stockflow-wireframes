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

### Step 2: Update Navigation Function 🔄
- [x] Modify `selectStore()` to accept store object
- [x] Keep existing alert for now (non-breaking)
- [x] Add console.log to verify store data passed
- [ ] **User Testing Required**
- [ ] Commit: "Update selectStore to accept store data"

### Step 3: Pass Store Context During Navigation ⏳
- [ ] Update `selectStore()` to call `navigateTo('inventory')` after alert
- [ ] Pass store data to inventory before navigation
- [ ] Keep alert to show what's happening
- [ ] **User Testing Required**
- [ ] Commit: "Pass store context during navigation"

### Step 4: Update Inventory Header ⏳
- [ ] Read store context in inventory initialization
- [ ] Update store badge to show selected store name
- [ ] Update breadcrumb with store name
- [ ] Default to "Oxford Street" if no store selected
- [ ] **User Testing Required**
- [ ] Commit: "Update inventory header with store context"

### Step 5: Add More Sample Stores ⏳
- [ ] Extend store data array with 8 total stores
- [ ] Add stores: Camden, Westfield, Kings Road
- [ ] Each with unique metrics and status
- [ ] **User Testing Required**
- [ ] Commit: "Add more sample stores for pagination"

### Step 6: Implement Store Pagination Logic ⏳
- [ ] Add `currentStorePage` property to store selection
- [ ] Add `storesPerPage: 6` configuration
- [ ] Create `paginateStores()` function
- [ ] Update `handleStoreFiltering()` to use pagination
- [ ] **User Testing Required**
- [ ] Commit: "Implement store pagination logic"

### Step 7: Make Pagination Interactive ⏳
- [ ] Update `showMoreStores()` to increment page
- [ ] Add "Previous" pagination card when on page 2+
- [ ] Update pagination text with actual remaining count
- [ ] Reset to page 1 when filters change
- [ ] **User Testing Required**
- [ ] Commit: "Make store pagination interactive"

### Step 8: Connect Store Context to Products ⏳
- [ ] Add store-specific product sets (simulation)
- [ ] Filter products based on selected store
- [ ] Update product count in header
- [ ] Update alerts count based on filtered products
- [ ] **User Testing Required**
- [ ] Commit: "Connect store context to products"

### Step 9: Polish Navigation Flow ⏳
- [ ] Remove alert from `selectStore()`
- [ ] Add smooth transition effect
- [ ] Ensure back button returns to store selection
- [ ] Preserve last selected store in session
- [ ] **User Testing Required**
- [ ] Commit: "Polish navigation flow"

### Step 10: Update Documentation ⏳
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