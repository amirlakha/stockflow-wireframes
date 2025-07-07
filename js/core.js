/* ==================== MODULE: core.js ==================== */
/* Core navigation system and screen management */

// Navigation functionality with proper button activation
function showScreenAndActivate(buttonElement, screenId) {
    try {
        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-button').forEach(button => {
            button.classList.remove('active');
        });
        
        // Activate the clicked button
        if (buttonElement) {
            buttonElement.classList.add('active');
        }
        
        // Show the screen
        showScreen(screenId);
    } catch (error) {
        console.error('Error in showScreenAndActivate:', error);
    }
}

// Main screen switching function
function showScreen(screenId) {
    try {
        // Hide all screens
        document.querySelectorAll('.screen-content').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Hide all notes
        document.querySelectorAll('.notes-content').forEach(note => {
            note.classList.remove('active');
        });
        
        // Hide all demo controls
        document.querySelectorAll('.demo-controls-content').forEach(demo => {
            demo.classList.remove('active');
        });
        
        // Show selected screen
        const screenElement = document.getElementById(screenId);
        if (screenElement) {
            screenElement.classList.add('active');
        }
        
        // Show corresponding notes
        const notesElement = document.getElementById(screenId + '-notes');
        if (notesElement) {
            notesElement.classList.add('active');
        }
        
        // Show corresponding demo controls
        const demoElement = document.getElementById(screenId + '-demo');
        if (demoElement) {
            demoElement.classList.add('active');
        }
        
        // Update screen info
        const screenData = screens[screenId];
        if (screenData) {
            const titleElement = document.getElementById('screen-title');
            const descElement = document.getElementById('screen-description');
            if (titleElement) titleElement.textContent = screenData.title;
            if (descElement) descElement.textContent = screenData.description;
        }

        // Initialize screen-specific functionality
        if (screenId === 'store-selection') {
            storeSelectionDemoControls.initialize();
            // Initialize view toggle button
            const viewToggleBtn = document.getElementById('viewToggleBtn');
            if (viewToggleBtn) {
                viewToggleBtn.title = 'Switch to List View';
                storeSelectionDemoControls.isGridView = true;
            }
            // Setup filter event listeners
            setupStoreSelectionFilters();
            // Initialize store display with all stores
            setTimeout(() => handleStoreFiltering(), 100);
        }
        
    } catch (error) {
        console.error('Error in showScreen:', error);
    }
}

// Utility navigation functions
function navigateTo(screenId) {
    if (screens[screenId]) {
        showScreen(screenId);
        // Update the nav button
        document.querySelectorAll('.nav-button').forEach(button => {
            button.classList.remove('active');
        });
        const targetButton = Array.from(document.querySelectorAll('.nav-button')).find(button => {
            return button.onclick && button.onclick.toString().includes(screenId);
        });
        if (targetButton) {
            targetButton.classList.add('active');
        }
    } else {
        showAlert(`Navigating to ${screenId.replace('-', ' ')}`);
    }
}

function showAlert(message) {
    alert(`${message}\n\nThis would open the corresponding screen or functionality.`);
}

function handleLogout() {
    alert('Logging out...\n\n→ Returning to Login Screen');
    showScreen('login');
    document.querySelectorAll('.nav-button').forEach(button => {
        button.classList.remove('active');
    });
    const loginButton = document.querySelector('[onclick*="login"]');
    if (loginButton) {
        loginButton.classList.add('active');
    }
}