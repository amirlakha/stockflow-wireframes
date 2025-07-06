# Refactoring Task: Split Monolithic HTML

## Goal
Transform the 3,378-line index.html into a well-structured, modular codebase while maintaining all functionality and GitHub Pages compatibility.

## Approach
Each step will be non-breaking, tested, and committed separately before proceeding.

### Why Each Step is Non-Breaking:
- **Steps 1-5 (CSS Extraction)**: We're copying CSS to external files and adding `<link>` tags. The original functionality remains unchanged.
- **Steps 6-9 (JS Extraction)**: We're copying JavaScript to external files and adding `<script>` tags. All code execution order is preserved.
- **Step 10 (Cleanup)**: We only remove the code that's already been successfully externalized.
- **Steps 11-13 (Enhancements)**: These are additive changes that don't affect existing functionality.

## Steps

### Step 1: Create Directory Structure ✅
- [x] Create css/ directory with subdirectories (components/, screens/)
- [x] Create js/ directory with subdirectory (screens/)
- [x] Create components/ directory with subdirectory (screens/)
- [x] Verify structure is created correctly
- [x] **User Testing Required**
- [x] Commit: "Create directory structure for modular refactoring"

### Step 2: Extract CSS - Base and Navigation ✅
- [x] Extract base.css (lines 8-93)
- [x] Extract navigation.css (lines 94-148)
- [x] Create new index.html that includes these CSS files
- [x] Remove extracted CSS from inline styles
- [x] Verify styling still works
- [x] **User Testing Required**
- [x] Commit: "Extract base and navigation CSS modules"

### Step 3: Extract CSS - Components ✅
- [x] Extract demo-controls.css to css/components/demo-controls.css
- [x] Extract notes.css to css/components/notes.css
- [x] Update index.html to include these files
- [x] Remove extracted CSS from inline styles
- [x] Verify demo controls and notes styling
- [x] **User Testing Required**
- [x] Commit: "Extract component CSS modules"

### Step 4: Extract CSS - Screen Styles ✅
- [x] Extract screens/login.css to css/screens/login.css
- [x] Extract screens/dashboard.css to css/screens/dashboard.css
- [x] Extract screens/store-selection.css to css/screens/store-selection.css
- [x] Extract screens/inventory-overview.css to css/screens/inventory-overview.css
- [x] Update index.html to include all screen CSS files
- [x] Remove extracted CSS from inline styles
- [x] Verify each screen displays correctly
- [x] **User Testing Required**
- [x] Commit: "Extract screen-specific CSS modules"

### Step 5: Extract CSS - Responsive ✅
- [x] Extract responsive.css to css/responsive.css
- [x] Update index.html to include responsive CSS last
- [x] Remove extracted CSS from inline styles
- [x] Test responsive design on different screen sizes
- [x] **User Testing Required**
- [x] Commit: "Extract responsive CSS module"

### Step 6: Extract JavaScript - Configuration ✅
- [x] Create js/config.js with screens configuration object
- [x] Update index.html to include config.js
- [x] Remove extracted configuration from inline script
- [x] Verify configuration is accessible
- [x] **User Testing Required**
- [x] Commit: "Extract JavaScript configuration"

### Step 7: Extract JavaScript - Core Module ✅
- [x] Extract js/core.js with navigation and screen management
- [x] Update index.html to include core.js
- [x] Remove extracted core functions from inline script
- [x] Verify navigation still works
- [x] **User Testing Required**
- [x] Commit: "Extract core JavaScript module"

### Step 8: Extract JavaScript - Screen Modules 🔄
- [x] Extract js/screens/login-demo.js with login demo controls
- [x] Extract js/screens/dashboard-demo.js with dashboard demo functionality
- [x] Extract js/screens/inventory-demo.js with inventory demo and Phase 2 data
- [x] Extract js/screens/store-selection-demo.js with store filtering controls
- [x] Update index.html to include all screen JS files
- [x] Remove extracted screen modules from inline script
- [ ] Verify all demo controls work
- [ ] **User Testing Required**
- [ ] Commit: "Extract screen JavaScript modules"

### Step 9: Extract JavaScript - Initialization ⏳
- [ ] Extract js/initialization.js (lines 3,150-3,376)
- [ ] Update index.html to include initialization.js last
- [ ] Verify app initializes correctly
- [ ] **User Testing Required**
- [ ] Commit: "Extract initialization JavaScript module"

### Step 10: Clean Up index.html ⏳
- [ ] Remove all extracted CSS and JS from index.html
- [ ] Ensure all link and script tags are in correct order
- [ ] Verify file is significantly smaller
- [ ] Test complete functionality
- [ ] **User Testing Required**
- [ ] Commit: "Clean up index.html after extraction"

### Step 11: Create Component Loader (Optional) ⏳
- [ ] Create simple component loader in js/component-loader.js
- [ ] Extract HTML sections to components/ directory
- [ ] Update index.html to load components
- [ ] Test all screens load correctly
- [ ] **User Testing Required**
- [ ] Commit: "Add component loader and extract HTML templates"

### Step 12: Add Phase 3 Placeholders ⏳
- [ ] Create placeholder files for Record Sale screen
- [ ] Create placeholder files for Alerts Dashboard screen
- [ ] Update navigation to include new screens
- [ ] **User Testing Required**
- [ ] Commit: "Add Phase 3 screen placeholders"

### Step 13: Update Documentation ⏳
- [ ] Update CLAUDE.md with new file structure
- [ ] Add development guidelines for new structure
- [ ] Document how to add new screens
- [ ] **User Testing Required**
- [ ] Commit: "Update documentation for new structure"

## Testing Checklist (After Each Step)
- [ ] All screens display correctly
- [ ] Navigation works between screens
- [ ] Demo controls function properly
- [ ] Responsive design works on mobile/tablet
- [ ] No console errors
- [ ] Page loads without flash of unstyled content

## Notes
- Each step is designed to be atomic and non-breaking
- User should test after each commit
- If any step breaks functionality, we can easily revert
- Priority on maintaining GitHub Pages compatibility (no build process)

## Status Legend
- ⏳ Not Started
- 🔄 In Progress
- ✅ Completed
- ❌ Blocked/Issue

Last Updated: 2025-07-06 - Step 1 in progress, awaiting user testing