/* ==================== MODULE: initialization.js ==================== */
/* Application initialization and event setup */

// Handle form submission for login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            loginDemoControls.simulateLogin();
        });

        // Clear error state when user starts typing
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        
        function clearError() {
            const errorMessage = document.getElementById('errorMessage');
            if (errorMessage && errorMessage.classList.contains('show')) {
                loginDemoControls.showNormalState();
            }
        }

        if (usernameInput) {
            usernameInput.addEventListener('input', clearError);
        }

        if (passwordInput) {
            passwordInput.addEventListener('input', clearError);
        }
    }
});

// Initialize everything once DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize login screen
    loginDemoControls.showNormalState();
    
    // Show credential hint for first-time users
    setTimeout(() => {
        if (document.getElementById('login') && document.getElementById('login').classList.contains('active') && !sessionStorage.getItem('loginHintShown')) {
            alert('Demo Credentials:\n\nUsername: lisa.monroe\nPassword: stockflow123\n\nOr try any other combination to see error state.');
            sessionStorage.setItem('loginHintShown', 'true');
        }
    }, 2000);

    // Initialize store selection demo controls
    storeSelectionDemoControls.initialize();
    
    // Add event listeners for store selection filters
    setupStoreSelectionFilters();
});

function setupStoreSelectionFilters() {
    // Wait for the elements to be available
    setTimeout(() => {
        const searchInput = document.getElementById('storeSearchInput');
        const regionFilter = document.getElementById('regionFilter');
        const alertFilter = document.getElementById('alertFilter');

        if (searchInput) {
            searchInput.addEventListener('input', function() {
                handleStoreFiltering();
            });
        }

        if (regionFilter) {
            regionFilter.addEventListener('change', function() {
                handleStoreFiltering();
            });
        }

        if (alertFilter) {
            alertFilter.addEventListener('change', function() {
                handleStoreFiltering();
            });
        }
    }, 100);
}

// Store Selection specific functions
function selectStore(storeId) {
    alert(`Selecting ${storeId} store...\n\n→ Navigating to Inventory Overview\n\nThis would load the inventory screen for the selected store location.`);
}

function showMoreStores() {
    alert('Loading more stores...\n\nThis would show additional store locations with pagination.');
}

function toggleGridView() {
    const viewToggleBtn = document.getElementById('viewToggleBtn');
    if (!viewToggleBtn) return;

    storeSelectionDemoControls.isGridView = !storeSelectionDemoControls.isGridView;
    
    if (storeSelectionDemoControls.isGridView) {
        viewToggleBtn.textContent = '⊞';
        viewToggleBtn.classList.remove('active');
        viewToggleBtn.title = 'Switch to List View';
    } else {
        viewToggleBtn.textContent = '☰';
        viewToggleBtn.classList.add('active');
        viewToggleBtn.title = 'Switch to Grid View';
    }

    storeSelectionDemoControls.updateViewMode();
}

function handleStoreFiltering() {
    const searchInput = document.getElementById('storeSearchInput');
    const regionFilter = document.getElementById('regionFilter');
    const alertFilter = document.getElementById('alertFilter');
    const storesGrid = document.getElementById('storesGrid');

    if (!searchInput || !regionFilter || !alertFilter || !storesGrid) return;

    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedRegion = regionFilter.value;
    const selectedAlertLevel = alertFilter.value;

    // Define all store data
    const allStores = [
        {
            id: 'oxford-street',
            name: 'Oxford Street',
            location: 'London, Central',
            region: 'London',
            products: 847,
            alerts: 3,
            status: 'good',
            updated: '5 mins ago'
        },
        {
            id: 'birmingham',
            name: 'Birmingham Central', 
            location: 'Birmingham, Midlands',
            region: 'Midlands',
            products: 692,
            alerts: 1,
            status: 'good',
            updated: '12 mins ago'
        },
        {
            id: 'manchester',
            name: 'Manchester Trafford',
            location: 'Manchester, North', 
            region: 'North',
            products: 734,
            alerts: 8,
            status: 'warning',
            updated: '1 hour ago'
        },
        {
            id: 'leeds',
            name: 'Leeds City Centre',
            location: 'Leeds, Yorkshire',
            region: 'Yorkshire', 
            products: 521,
            alerts: 0,
            status: 'good',
            updated: '2 hours ago'
        },
        {
            id: 'bristol',
            name: 'Bristol Cabot Circus',
            location: 'Bristol, Southwest',
            region: 'Southwest',
            products: 612,
            alerts: 15,
            status: 'critical',
            updated: '4 hours ago'
        }
    ];

    // Filter stores based on criteria
    let filteredStores = allStores.filter(store => {
        // Search filter
        if (searchTerm && !store.name.toLowerCase().includes(searchTerm) && !store.location.toLowerCase().includes(searchTerm)) {
            return false;
        }

        // Region filter
        if (selectedRegion !== 'All Regions ▼' && store.region !== selectedRegion) {
            return false;
        }

        // Alert level filter
        if (selectedAlertLevel !== 'All Alerts ▼') {
            switch (selectedAlertLevel) {
                case 'No Alerts':
                    if (store.alerts !== 0) return false;
                    break;
                case 'Low Alerts (1-5)':
                    if (store.alerts < 1 || store.alerts > 5) return false;
                    break;
                case 'High Alerts (6-10)':
                    if (store.alerts < 6 || store.alerts > 10) return false;
                    break;
                case 'Critical Alerts (11+)':
                    if (store.alerts < 11) return false;
                    break;
            }
        }

        return true;
    });

    // Generate HTML for filtered stores
    let storesHTML = '';
    
    if (filteredStores.length === 0) {
        storesHTML = `
            <div style="grid-column: span 3; text-align: center; padding: 60px 20px; color: #666; font-style: italic;">
                <div style="font-size: 24px; margin-bottom: 10px;">🔍</div>
                <div>No stores match the selected criteria</div>
                <div style="font-size: 12px; margin-top: 10px;">Try adjusting your search or filter settings</div>
            </div>
        `;
    } else {
        filteredStores.forEach(store => {
            const statusClass = store.status;
            const statusIcon = store.status === 'good' ? '✓' : '!';
            const statusLabel = store.status === 'good' ? 'GOOD' : (store.status === 'warning' ? 'WARNING' : 'CRITICAL');
            const metricsClass = store.status === 'good' ? '' : store.status;

            storesHTML += `
                <div class="store-card ${statusClass}" onclick="selectStore('${store.id}')">
                    <div class="store-status-indicator ${statusClass}">${statusIcon}</div>
                    <div class="store-status-label ${statusClass}">${statusLabel}</div>
                    <div class="store-name">${store.name}</div>
                    <div class="store-location">${store.location}</div>
                    <div class="store-metrics ${metricsClass}">
                        <div class="metric-item">📦 ${store.products} Products</div>
                        <div class="metric-item">⚠️ ${store.alerts} Alert${store.alerts !== 1 ? 's' : ''}</div>
                    </div>
                    <div class="store-updated">Last updated: ${store.updated}</div>
                </div>
            `;
        });

        // Add pagination card if showing all stores and not filtered
        if (filteredStores.length === allStores.length && searchTerm === '' && selectedRegion === 'All Regions ▼' && selectedAlertLevel === 'All Alerts ▼') {
            storesHTML += `
                <div class="store-card pagination" onclick="showMoreStores()">
                    <div class="pagination-circle">+3</div>
                    <div class="pagination-text">More Stores</div>
                    <div class="pagination-subtitle">Click to view next page</div>
                    <button class="view-more-button">VIEW MORE →</button>
                </div>
            `;
        }
    }

    storesGrid.innerHTML = storesHTML;
    
    // Apply current view mode after updating content
    storeSelectionDemoControls.updateViewMode();
}