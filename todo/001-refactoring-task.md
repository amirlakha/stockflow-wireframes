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

### Step 3: Extract CSS - Components 🔄
- [x] Extract demo-controls.css to css/components/demo-controls.css
- [x] Extract notes.css to css/components/notes.css
- [x] Update index.html to include these files
- [x] Remove extracted CSS from inline styles
- [ ] Verify demo controls and notes styling
- [ ] **User Testing Required**
- [ ] Commit: "Extract component CSS modules"

### Step 4: Extract CSS - Screen Styles ⏳
- [ ] Extract screens/login.css (lines 309-447)
- [ ] Extract screens/dashboard.css (lines 448-722)
- [ ] Extract screens/store-selection.css (lines 723-1,104)
- [ ] Extract screens/inventory-overview.css (lines 1,105-1,561)
- [ ] Update index.html to include all screen CSS files
- [ ] Verify each screen displays correctly
- [ ] **User Testing Required**
- [ ] Commit: "Extract screen-specific CSS modules"

### Step 5: Extract CSS - Responsive ⏳
- [ ] Extract responsive.css (lines 1,562-1,666)
- [ ] Update index.html to include responsive CSS last
- [ ] Test responsive design on different screen sizes
- [ ] **User Testing Required**
- [ ] Commit: "Extract responsive CSS module"

### Step 6: Extract JavaScript - Configuration ⏳
- [ ] Create js/config.js with screens configuration object
- [ ] Update index.html to include config.js
- [ ] Verify configuration is accessible
- [ ] **User Testing Required**
- [ ] Commit: "Extract JavaScript configuration"

### Step 7: Extract JavaScript - Core Module ⏳
- [ ] Extract js/core.js (lines 2,481-2,630)
- [ ] Update index.html to include core.js
- [ ] Verify navigation still works
- [ ] **User Testing Required**
- [ ] Commit: "Extract core JavaScript module"

### Step 8: Extract JavaScript - Screen Modules ⏳
- [ ] Extract js/screens/login-demo.js (lines 2,631-2,723)
- [ ] Extract js/screens/dashboard-demo.js (lines 2,724-2,847)
- [ ] Extract js/screens/inventory-demo.js (lines 2,848-2,986)
- [ ] Extract js/screens/store-selection-demo.js (lines 2,987-3,149)
- [ ] Update index.html to include all screen JS files
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