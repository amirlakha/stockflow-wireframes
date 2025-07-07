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
- **Future Screens Planned**: Record Sale, Alerts Dashboard

## Key Development Patterns
1. **Demo Controls**: Each screen has buttons to demonstrate different states (normal, error, busy)
2. **Console Logging**: All demo actions log to browser console for debugging
3. **Realistic Data**: Uses sample data that matches the actual business context
4. **State Management**: JavaScript modules handle screen state and transitions

## Important Files
- `/documentation/` folder contains the complete StockFlow design specification and system diagrams
- `StockFlow - Design.md` - Full system design document with requirements and specifications
- Various `.png` files - System diagrams (ERD, data flow, sequence, use case)

## Development Tips
- Check console logs when testing demo functionality
- The inventory screen auto-initializes when navigated to
- Sync concept was removed as this is a desktop app with local DB

## IMPORTANT PROJECT-SPECIFIC INSTRUCTIONS:
1. **Always create local todo files**: For every major task, create a separate todo file in the `todo/` directory with a numbered filename corresponding to the task (e.g., `001-refactoring-task.md`, `002-feature-xyz.md`)
2. **Update todo files continuously**: The todo file should be updated as you progress through the task
3. **Non-breaking steps with user verification**: Every task should be split into non-breaking steps that allow testing between commits
4. **Testing before commits**: Always follow this order: make changes → user testing/verification → then commit (never commit before user approval)
5. **Incremental approach**: Each step should be atomic and reversible if issues arise
6. **Model usage preference**: Use Opus for planning and designing solutions, then switch to Sonnet for executing the implementation plan
7. **Git workflow**: ALWAYS show full `git status` output (not `git status --porcelain`) before asking user to stage files with `git add -A`. If the git status output gets truncated (showing "... +n lines"), provide a complete summary of all changes including: branch status, ahead/behind commits, modified files, untracked files, and staged files. User needs to see complete file change details before approving staging.
