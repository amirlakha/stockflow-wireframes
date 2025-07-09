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
The project has been refactored into a modular structure:

### File Structure
```
css/
  base.css              /* Global styles and CSS variables */
  navigation.css        /* Header and navigation styles */
  components/
    demo-controls.css   /* Demo button and control styles */
    notes.css          /* Implementation notes styling */
  screens/            /* Individual screen styles */
  responsive.css       /* Media queries for mobile/tablet */

js/
  core.js                    /* Main app logic and screen management */
  screens/
    login-demo.js           /* Login screen demo controls */
    dashboard-demo.js       /* Dashboard demo controls */
    inventory-demo.js       /* Inventory screen demo (Phase 3 complete) */
    store-selection-demo.js /* Store selection demo */
    record-sale-demo.js     /* Record Sale screen (Phase 5 complete) */
    record-purchase-demo.js /* Record Purchase screen (Phase 5 complete) */
  initialization.js         /* App initialization */

index.html             /* Main entry point */
```

### Screen Management
Each screen follows this pattern:
1. HTML section with `class="screen" id="[screen-name]-screen"`
2. Demo controls section for interactive demonstrations
3. Implementation notes for developers
4. Associated JavaScript module for demo functionality

## Current Implementation Status
- **Phase 1 Complete**: Login, Dashboard, Store Selection (fully interactive)
- **Phase 2 Complete**: Inventory Overview JavaScript foundation
- **Phase 3 Complete**: Inventory Overview (fully interactive with search, filters, sorting, pagination, and summary stats)
- **Phase 4 Complete**: Store-Inventory Connection (context passing, dynamic products, real dashboard data)
- **Phase 5 Complete**: Record Sale & Purchase Screens (fully interactive with real-time inventory updates)
- **Phase 6 Complete**: Transaction Integration (inventory updates persist, dashboard reflects changes)
- **Future Screens Planned**: Alerts Dashboard, Reports

## Key Development Patterns
1. **Demo Controls**: Each screen has buttons to demonstrate different states (normal, error, busy)
2. **Console Logging**: All demo actions log to browser console for debugging
3. **Realistic Data**: Uses sample data that matches the actual business context
4. **State Management**: JavaScript modules handle screen state and transitions
5. **Store Context System**: Store selection passes context (id, name, products, alerts) to inventory screen via `setSelectedStore()`. Context persisted in sessionStorage for navigation consistency.

## Important Files
- `/documentation/` folder contains the complete StockFlow design specification and system diagrams
- `StockFlow - Design.md` - Full system design document with requirements and specifications
- Various `.png` files - System diagrams (ERD, data flow, sequence, use case)

## Development Tips
- Check console logs when testing demo functionality
- The inventory screen auto-initializes when navigated to
- Dashboard shows real data calculated from all 8 stores
- Store selection maintains context through navigation
- Transaction screens update inventory in real-time (persisted in sessionStorage)
- Draft transactions are saved automatically and restored on navigation
- Stock status changes automatically based on quantity thresholds
- Sync concept was removed as this is a desktop app with local DB

## IMPORTANT PROJECT-SPECIFIC INSTRUCTIONS:
1. **Always create local todo files**: For every major task, create a separate todo file in the `todo/` directory with a numbered filename corresponding to the task (e.g., `001-refactoring-task.md`, `002-feature-xyz.md`)
2. **Update todo files continuously**: The todo file should be updated as you progress through the task
3. **Non-breaking steps with user verification**: Every task should be split into non-breaking steps that allow testing between commits
4. **Testing before commits**: Always follow this order: make changes → user testing/verification → then commit (never commit before user approval)
5. **Incremental approach**: Each step should be atomic and reversible if issues arise
6. **Model usage preference**: Use Opus for planning and designing solutions, then switch to Sonnet for executing the implementation plan
7. **Git workflow**: 
   - Step 1: ALWAYS show full `git status` output (not `git status --porcelain`) and summarize all changes
   - Step 2: Wait for user approval to run `git add -A`
   - Step 3: Show proposed verbose commit message and run the commit (user will approve via their git settings)
   - If git status output gets truncated, provide complete summary of all changes
8. **Verbose commit messages**: Always create detailed commit messages that list all changes made. Format: First line summary, blank line, then bullet points of specific changes, ending with "🤖 Generated with [Claude Code](https://claude.ai/code)\n\nCo-Authored-By: Claude <noreply@anthropic.com>"
