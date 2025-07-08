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
        // Get currently active screen
        const currentScreen = document.querySelector('.screen-content.active');
        const newScreen = document.getElementById(screenId);
        
        // If switching screens
        if (currentScreen && currentScreen !== newScreen) {
            // Fade out current screen
            currentScreen.classList.remove('fade-in');
            
            setTimeout(() => {
                // Hide all screens
                document.querySelectorAll('.screen-content').forEach(screen => {
                    screen.classList.remove('active', 'fade-in');
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
                if (newScreen) {
                    newScreen.classList.add('active');
                    // Trigger fade in after display is set
                    setTimeout(() => {
                        newScreen.classList.add('fade-in');
                    }, 10);
                }
                
                // Continue with rest of function
                showScreenContent(screenId);
            }, 300); // Match CSS transition duration
        } else {
            // First time showing or same screen
            document.querySelectorAll('.screen-content').forEach(screen => {
                screen.classList.remove('active', 'fade-in');
            });
            
            document.querySelectorAll('.notes-content').forEach(note => {
                note.classList.remove('active');
            });
            
            document.querySelectorAll('.demo-controls-content').forEach(demo => {
                demo.classList.remove('active');
            });
            
            if (newScreen) {
                newScreen.classList.add('active');
                setTimeout(() => {
                    newScreen.classList.add('fade-in');
                }, 10);
            }
            
            showScreenContent(screenId);
        }
    } catch (error) {
        console.error('Error in showScreen:', error);
    }
}

// Helper function to show screen content (notes, demo controls, etc.)
function showScreenContent(screenId) {
    try {
        
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
        
        // Hide demo controls section entirely for screens that don't need them
        const demoSection = document.querySelector('.demo-controls-section');
        if (demoSection) {
            if (screenId === 'dashboard' || screenId === 'record-sale' || screenId === 'record-purchase') {
                demoSection.style.display = 'none';
            } else {
                demoSection.style.display = 'block';
            }
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
        } else if (screenId === 'dashboard') {
            // Update dashboard with real data when shown
            dashboardDemoControls.updateDashboardStats();
        }
        
    } catch (error) {
        console.error('Error in showScreenContent:', error);
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