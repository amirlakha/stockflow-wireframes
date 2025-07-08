# Epic 004: Add Record Sale and Purchase Screens to Gallery

## Overview
Add fully interactive Record Sale and Purchase screens to the StockFlow wireframe gallery, maintaining consistency with existing screens and ensuring all functionality is testable at each step.

## Pre-requisites
- [x] Design documentation complete (sections 6.3.5, 6.3.6, 6.10, 6.11)
- [x] Store context system implemented and working
- [x] Product data structure established in inventory screen

## Phase 1: Static HTML Structure (Non-breaking)
### Step 1.1: Add HTML sections for both screens
- [x] Add Record Sale screen HTML section to index.html
- [x] Add Record Purchase screen HTML section to index.html
- [x] Ensure screens are hidden by default (display: none)
- [x] Test: Verify existing screens still work, new screens don't appear

### Step 1.2: Update navigation menu
- [x] Add "Record Sale" menu item (after Inventory Overview)
- [x] Add "Record Purchase" menu item (after Record Sale)
- [x] Keep menu items disabled/grayed out initially
- [x] Test: Menu shows new items but they're not clickable yet

## Phase 2: Basic CSS Styling (Non-breaking)
### Step 2.1: Create CSS files
- [x] Create css/screens/record-sale.css
- [x] Create css/screens/record-purchase.css
- [x] Add basic screen layout styles (hidden by default)
- [x] Test: No visual changes to existing screens

### Step 2.2: Import CSS files
- [x] Add CSS imports to index.html
- [x] Verify CSS loads without errors
- [x] Test: Check browser console for any CSS errors

### Step 2.3: Commit Phase 2
- [ ] Review all changes with git status
- [ ] Stage and commit CSS files and imports
- [ ] Commit message: "Add CSS styling for Record Sale and Purchase screens"

## Phase 3: Core JavaScript Structure (Non-breaking)
### Step 3.1: Create JavaScript modules
- [ ] Create js/screens/record-sale-demo.js with empty module
- [ ] Create js/screens/record-purchase-demo.js with empty module
- [ ] Add module imports to index.html
- [ ] Test: No JavaScript errors in console

### Step 3.2: Add screen initialization
- [ ] Add Record Sale screen to screenInitializers in initialization.js
- [ ] Add Record Purchase screen to screenInitializers
- [ ] Keep screens non-functional (just log initialization)
- [ ] Test: Console shows initialization logs when navigating

### Step 3.3: Commit Phase 3
- [ ] Review all changes with git status
- [ ] Stage and commit JavaScript structure files
- [ ] Commit message: "Add JavaScript module structure for transaction screens"

## Phase 4: Navigation Integration (First visible change)
### Step 4.1: Enable navigation
- [ ] Update navigation menu to make new items clickable
- [ ] Add screen switching logic in core.js
- [ ] Ensure proper screen hiding/showing
- [ ] Test: Can navigate to new screens (they'll be empty)

### Step 4.2: Add breadcrumb navigation
- [ ] Implement breadcrumb trail for Record Sale
- [ ] Implement breadcrumb trail for Record Purchase
- [ ] Include store context in breadcrumbs
- [ ] Test: Breadcrumbs show correct path

### Step 4.3: Commit Phase 4
- [ ] Review all changes with git status
- [ ] Stage and commit navigation integration
- [ ] Commit message: "Enable navigation to Record Sale and Purchase screens"

## Phase 5: Record Sale Screen Implementation
### Step 5.1: Static layout
- [ ] Add header with store context badge
- [ ] Create product search section
- [ ] Add selected items table structure
- [ ] Include transaction summary panel
- [ ] Test: Visual layout matches wireframe

### Step 5.2: Product search functionality
- [ ] Implement product search input
- [ ] Add search results dropdown
- [ ] Filter products from store context
- [ ] Handle product selection
- [ ] Test: Can search and select products

### Step 5.3: Quantity management
- [ ] Add quantity input for each product
- [ ] Implement increment/decrement buttons
- [ ] Add validation (can't exceed stock)
- [ ] Update totals dynamically
- [ ] Test: Quantity changes update correctly

### Step 5.4: Transaction completion
- [ ] Add process sale button
- [ ] Implement validation checks
- [ ] Show success confirmation
- [ ] Update local product quantities
- [ ] Test: Sale reduces inventory numbers

### Step 5.5: Commit Phase 5
- [ ] Review all changes with git status
- [ ] Stage and commit Record Sale implementation
- [ ] Commit message: "Implement Record Sale screen functionality"

## Phase 6: Record Purchase Screen Implementation
### Step 6.1: Static layout
- [ ] Add header with store context
- [ ] Create supplier details section
- [ ] Add product entry table
- [ ] Include purchase summary panel
- [ ] Test: Visual layout matches wireframe

### Step 6.2: Product entry system
- [ ] Implement add product row functionality
- [ ] Create product dropdown/search
- [ ] Add quantity and cost inputs
- [ ] Enable row deletion
- [ ] Test: Can add/remove product rows

### Step 6.3: Bulk entry features
- [ ] Add "Add Multiple" button
- [ ] Implement CSV-style paste support
- [ ] Add validation for bulk data
- [ ] Show preview before adding
- [ ] Test: Bulk entry works correctly

### Step 6.4: Purchase completion
- [ ] Add complete purchase button
- [ ] Calculate total costs
- [ ] Show confirmation dialog
- [ ] Update local product quantities
- [ ] Test: Purchase increases inventory

### Step 6.5: Commit Phase 6
- [ ] Review all changes with git status
- [ ] Stage and commit Record Purchase implementation
- [ ] Commit message: "Implement Record Purchase screen functionality"

## Phase 7: Advanced Features
### Step 7.1: Demo controls
- [ ] Add demo control buttons for Record Sale
- [ ] Add demo control buttons for Record Purchase
- [ ] Implement pre-fill scenarios
- [ ] Add error state demonstrations
- [ ] Test: Demo buttons show different states

### Step 7.2: Validation and error handling
- [ ] Add comprehensive validation rules
- [ ] Show inline error messages
- [ ] Prevent invalid submissions
- [ ] Handle edge cases gracefully
- [ ] Test: All validation rules work

### Step 7.3: State persistence
- [ ] Save draft transactions in sessionStorage
- [ ] Restore drafts when returning to screen
- [ ] Clear drafts after completion
- [ ] Handle browser refresh
- [ ] Test: Drafts persist correctly

### Step 7.4: Commit Phase 7
- [ ] Review all changes with git status
- [ ] Stage and commit advanced features
- [ ] Commit message: "Add advanced features to transaction screens"

## Phase 8: Integration and Polish
### Step 8.1: Cross-screen updates
- [ ] Update dashboard after transactions
- [ ] Refresh inventory screen data
- [ ] Update low stock alerts
- [ ] Sync all related screens
- [ ] Test: Changes reflect everywhere

### Step 8.2: Implementation notes
- [ ] Add developer notes for Record Sale
- [ ] Add developer notes for Record Purchase
- [ ] Document demo scenarios
- [ ] Include technical details
- [ ] Test: Notes display correctly

### Step 8.3: Final polish
- [ ] Add loading states
- [ ] Implement smooth transitions
- [ ] Add keyboard shortcuts
- [ ] Ensure mobile responsiveness
- [ ] Test: Professional user experience

### Step 8.4: Commit Phase 8
- [ ] Review all changes with git status
- [ ] Stage and commit final integration
- [ ] Commit message: "Complete transaction screens with integration and polish"

## Testing Checklist (Run after each phase)
- [ ] All existing screens still function
- [ ] No JavaScript console errors
- [ ] Navigation works correctly
- [ ] Store context passes through
- [ ] Demo controls work as expected
- [ ] Data updates are consistent
- [ ] Browser refresh doesn't break state
- [ ] Mobile view is functional

## Success Criteria
- Both screens fully interactive
- Consistent with existing design patterns
- All demo scenarios functional
- No breaking changes to existing screens
- Clear implementation notes for developers
- Smooth user experience throughout

## Notes
- Each phase builds incrementally
- Every step can be tested independently
- Rollback is possible at any point
- Focus on one screen at a time in implementation phases
- Maintain consistency with existing patterns