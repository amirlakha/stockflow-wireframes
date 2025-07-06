# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
StockFlow is an interactive wireframe gallery for a desktop inventory management application. It's a single-page web application demonstrating the UI/UX design for a Java Swing-based inventory system for fashion retail stores.

## Development Commands
This is a static HTML project with no build process:
- **Run locally**: Open `index.html` directly in a browser or use any static web server
- **Deploy**: Already configured for GitHub Pages deployment using `index.html`
- **No dependencies**: Pure HTML/CSS/JavaScript implementation

## Architecture
The project uses a single-file architecture (`index.html` - 3200+ lines) containing:

### CSS Module Structure
```css
/* Modules are embedded within <style> tags in order: */
base.css              /* Global styles and CSS variables */
navigation.css        /* Header and navigation styles */
demo-controls.css     /* Demo button and control styles */
notes.css            /* Implementation notes styling */
screens/*.css        /* Individual screen styles */
responsive.css       /* Media queries for mobile/tablet */
```

### JavaScript Module Pattern
```javascript
/* JavaScript modules are embedded within <script> tags: */
core.js                    /* Main app logic and screen management */
screens/login-demo.js      /* Login screen demo controls */
screens/dashboard-demo.js  /* Dashboard demo controls */
screens/inventory-demo.js  /* Inventory screen demo (Phase 2 complete) */
screens/store-selection-demo.js /* Store selection demo */
initialization.js          /* App initialization */
```

### Screen Management
Each screen follows this pattern:
1. HTML section with `class="screen" id="[screen-name]-screen"`
2. Demo controls section for interactive demonstrations
3. Implementation notes for developers
4. Associated JavaScript module for demo functionality

## Current Implementation Status
- **Phase 1 Complete**: Login, Dashboard, Store Selection (fully interactive)
- **Phase 2 Complete**: Inventory Overview (JavaScript foundation ready)
- **Phase 3 Planned**: Record Sale, Alerts Dashboard

## Key Development Patterns
1. **Demo Controls**: Each screen has buttons to demonstrate different states (normal, error, busy)
2. **Console Logging**: All demo actions log to browser console for debugging
3. **Realistic Data**: Uses sample data that matches the actual business context
4. **State Management**: JavaScript modules handle screen state and transitions

## Important Files
- `/documentation/StockFlow - Design.md` - Complete system design specification
- `/documentation/Stockflow - Handover.md` - Development handoff notes with Phase 3 requirements
- `/documentation/*.png` - System diagrams (ERD, data flow, sequence, use case)

## Development Tips
- Check console logs when testing demo functionality
- Refer to handover documentation for Phase 3 implementation requirements
- The inventory demo module (`inventory-demo.js`) has the foundation for Phase 3 features

## REFACTORING GOALS:
1. Split monolithic HTML into logical components
2. Create proper file structure: src/css/, src/js/, src/components/, src/data/
3. Maintain all current functionality
4. Keep deployment working on GitHub Pages
5. Make it easy to implement Phase 3 of Inventory Overview
6. Prepare structure for future screen implementations

## CONSTRAINTS:
- Must remain deployable as static site (GitHub Pages compatible)
- Preserve all interactive demo controls and functionality

## IMPORTANT PROJECT-SPECIFIC INSTRUCTIONS:
1. **Always create local todo files**: For every major task, create a separate todo file in the `todo/` directory with a numbered filename corresponding to the task (e.g., `001-refactoring-task.md`, `002-feature-xyz.md`)
2. **Update todo files continuously**: The todo file should be updated as you progress through the task
3. **Non-breaking steps with user verification**: Every task should be split into non-breaking steps that allow testing between commits
4. **Testing before commits**: Always follow this order: make changes → user testing/verification → then commit (never commit before user approval)
5. **Incremental approach**: Each step should be atomic and reversible if issues arise
6. **Model usage preference**: Use Opus for planning and designing solutions, then switch to Sonnet for executing the implementation plan
7. **Git workflow**: ALWAYS show full `git status` output (not `git status --porcelain`) before asking user to stage files with `git add -A`. User needs to see complete file change details before approving staging.
