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
    
    // Ensure initial screen is visible with fade-in
    const activeScreen = document.querySelector('.screen-content.active');
    if (activeScreen) {
        activeScreen.classList.add('fade-in');
    }
    
    // Initialize dashboard data
    dashboardDemoControls.updateDashboardStats();
    
    // Show credential hint for first-time users
    setTimeout(() => {
        if (document.getElementById('login') && document.getElementById('login').classList.contains('active') && !sessionStorage.getItem('loginHintShown')) {
            alert('Demo Credentials:\n\nUsername: lisa.monroe\nPassword: stockflow123\n\nOr try any other combination to see error state.');
            sessionStorage.setItem('loginHintShown', 'true');
        }
    }, 2000);

    // Initialize store selection demo controls
    storeSelectionDemoControls.initialize();
    
    // Initialize dashboard screen observer to update stats when it becomes active
    const dashboardScreen = document.getElementById('dashboard');
    if (dashboardScreen) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.target.classList.contains('active')) {
                    // Always update dashboard stats when screen becomes active
                    dashboardDemoControls.updateDashboardStats();
                }
            });
        });
        observer.observe(dashboardScreen, { attributes: true, attributeFilter: ['class'] });
    }
    
    // Initialize inventory screen when it becomes active
    const inventoryScreen = document.getElementById('inventory');
    if (inventoryScreen) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.target.classList.contains('active')) {
                    // Check if inventory needs refresh (after a sale or purchase)
                    const needsRefresh = sessionStorage.getItem('inventoryNeedsRefresh');
                    
                    // Restore selected store from session if available
                    const savedStore = sessionStorage.getItem('selectedStore');
                    if (savedStore) {
                        const store = JSON.parse(savedStore);
                        
                        // Always set the selected store to ensure we have the latest data
                        inventoryDemoControls.setSelectedStore(store);
                        
                        // Clear the refresh flag if it was set
                        if (needsRefresh === 'true') {
                            sessionStorage.removeItem('inventoryNeedsRefresh');
                        }
                    } else if (inventoryDemoControls.currentProducts.length === 0) {
                        // Only initialize if we have no products and no saved store
                        inventoryDemoControls.initializeInventory();
                    }
                    inventoryDemoControls.updateInventoryHeader();
                    inventoryDemoControls.initializeSearch();
                    inventoryDemoControls.initializeCategoryFilter();
                    inventoryDemoControls.initializeStockLevelFilter();
                    inventoryDemoControls.initializeSorting();
                    inventoryDemoControls.initializeQuickActions();
                    inventoryDemoControls.updateProductTable();
                    inventoryDemoControls.updateSummaryStats();
                }
            });
        });
        observer.observe(inventoryScreen, { attributes: true, attributeFilter: ['class'] });
    }
    
    // Initialize Record Sale screen when it becomes active
    const recordSaleScreen = document.getElementById('record-sale');
    if (recordSaleScreen) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.target.classList.contains('active')) {
                    recordSaleDemo.init();
                }
            });
        });
        observer.observe(recordSaleScreen, { attributes: true, attributeFilter: ['class'] });
    }
    
    // Initialize Record Purchase screen when it becomes active
    const recordPurchaseScreen = document.getElementById('record-purchase');
    if (recordPurchaseScreen) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.target.classList.contains('active')) {
                    recordPurchaseDemo.init();
                }
            });
        });
        observer.observe(recordPurchaseScreen, { attributes: true, attributeFilter: ['class'] });
    }
    
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
                storeSelectionDemoControls.currentStorePage = 1;
                handleStoreFiltering();
            });
        }

        if (regionFilter) {
            regionFilter.addEventListener('change', function() {
                storeSelectionDemoControls.currentStorePage = 1;
                handleStoreFiltering();
            });
        }

        if (alertFilter) {
            alertFilter.addEventListener('change', function() {
                storeSelectionDemoControls.currentStorePage = 1;
                handleStoreFiltering();
            });
        }
    }, 100);
}

// Store Selection specific functions
function selectStore(storeId) {
    // Get the store data
    const store = getStoreById(storeId);
    console.log('Store selected:', store);
    
    // Pass store data to inventory before navigation
    if (store && inventoryDemoControls) {
        inventoryDemoControls.setSelectedStore(store);
        
        // Get the actual products for this store
        let storeWithProducts = {...store};
        if (inventoryDemoControls.storeProducts && inventoryDemoControls.storeProducts[storeId]) {
            const baseProducts = inventoryDemoControls.storeProducts[storeId];
            const targetCount = store.products;
            storeWithProducts.products = inventoryDemoControls.generateAdditionalProducts(storeId, baseProducts, targetCount);
        }
        
        // Save selected store with products to session storage
        sessionStorage.setItem('selectedStore', JSON.stringify(storeWithProducts));
    }
    
    // Navigate directly to inventory without alert
    navigateTo('inventory');
}

function showMoreStores() {
    storeSelectionDemoControls.currentStorePage++;
    handleStoreFiltering();
}

function showPreviousStores() {
    storeSelectionDemoControls.currentStorePage--;
    handleStoreFiltering();
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

function getStoreById(storeId) {
    // Define all store data (same as in handleStoreFiltering)
    const allStores = [
        {
            id: 'oxford-street',
            name: 'Oxford Street',
            location: 'London, Central',
            region: 'London',
            products: 45,
            alerts: 3,
            status: 'good',
            updated: '5 mins ago'
        },
        {
            id: 'birmingham',
            name: 'Birmingham Central', 
            location: 'Birmingham, Midlands',
            region: 'Midlands',
            products: 38,
            alerts: 1,
            status: 'good',
            updated: '12 mins ago'
        },
        {
            id: 'manchester',
            name: 'Manchester Trafford',
            location: 'Manchester, North', 
            region: 'North',
            products: 42,
            alerts: 8,
            status: 'warning',
            updated: '1 hour ago'
        },
        {
            id: 'leeds',
            name: 'Leeds City Centre',
            location: 'Leeds, Yorkshire',
            region: 'Yorkshire', 
            products: 29,
            alerts: 0,
            status: 'good',
            updated: '2 hours ago'
        },
        {
            id: 'bristol',
            name: 'Bristol Cabot Circus',
            location: 'Bristol, Southwest',
            region: 'Southwest',
            products: 35,
            alerts: 15,
            status: 'critical',
            updated: '4 hours ago'
        },
        {
            id: 'camden',
            name: 'Camden Market',
            location: 'London, North',
            region: 'London',
            products: 22,
            alerts: 4,
            status: 'good',
            updated: '30 mins ago'
        },
        {
            id: 'westfield',
            name: 'Westfield Stratford',
            location: 'London, East',
            region: 'London',
            products: 50,
            alerts: 7,
            status: 'warning',
            updated: '45 mins ago'
        },
        {
            id: 'kings-road',
            name: 'Kings Road Chelsea',
            location: 'London, Southwest',
            region: 'London',
            products: 18,
            alerts: 2,
            status: 'good',
            updated: '3 hours ago'
        }
    ];
    
    return allStores.find(store => store.id === storeId);
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
            products: 45,
            alerts: 3,
            status: 'good',
            updated: '5 mins ago'
        },
        {
            id: 'birmingham',
            name: 'Birmingham Central', 
            location: 'Birmingham, Midlands',
            region: 'Midlands',
            products: 38,
            alerts: 1,
            status: 'good',
            updated: '12 mins ago'
        },
        {
            id: 'manchester',
            name: 'Manchester Trafford',
            location: 'Manchester, North', 
            region: 'North',
            products: 42,
            alerts: 8,
            status: 'warning',
            updated: '1 hour ago'
        },
        {
            id: 'leeds',
            name: 'Leeds City Centre',
            location: 'Leeds, Yorkshire',
            region: 'Yorkshire', 
            products: 29,
            alerts: 0,
            status: 'good',
            updated: '2 hours ago'
        },
        {
            id: 'bristol',
            name: 'Bristol Cabot Circus',
            location: 'Bristol, Southwest',
            region: 'Southwest',
            products: 35,
            alerts: 15,
            status: 'critical',
            updated: '4 hours ago'
        },
        {
            id: 'camden',
            name: 'Camden Market',
            location: 'London, North',
            region: 'London',
            products: 22,
            alerts: 4,
            status: 'good',
            updated: '30 mins ago'
        },
        {
            id: 'westfield',
            name: 'Westfield Stratford',
            location: 'London, East',
            region: 'London',
            products: 50,
            alerts: 7,
            status: 'warning',
            updated: '45 mins ago'
        },
        {
            id: 'kings-road',
            name: 'Kings Road Chelsea',
            location: 'London, Southwest',
            region: 'London',
            products: 18,
            alerts: 2,
            status: 'good',
            updated: '3 hours ago'
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

    // Remove the automatic reset - we'll handle it differently
    // The page should only reset when filters change via user input, not during pagination
    
    // Paginate the filtered stores
    const currentPage = storeSelectionDemoControls.currentStorePage;
    const storesPerPage = storeSelectionDemoControls.storesPerPage;
    const startIndex = (currentPage - 1) * storesPerPage;
    const endIndex = startIndex + storesPerPage;
    const paginatedStores = filteredStores.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredStores.length / storesPerPage);
    const remainingStores = filteredStores.length - endIndex;
    
    // Generate HTML for paginated stores
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
        // Add "Previous" pagination card if on page 2+
        if (currentPage > 1) {
            const previousCount = (currentPage - 2) * storesPerPage + storesPerPage;
            storesHTML += `
                <div class="store-card pagination" onclick="showPreviousStores()">
                    <div class="pagination-circle">←</div>
                    <div class="pagination-text">Previous Stores</div>
                    <div class="pagination-subtitle">Back to previous page</div>
                    <button class="view-more-button">← GO BACK</button>
                </div>
            `;
        }
        
        paginatedStores.forEach(store => {
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

        // Add "Next" pagination card if there are more stores to show
        if (remainingStores > 0) {
            storesHTML += `
                <div class="store-card pagination" onclick="showMoreStores()">
                    <div class="pagination-circle">+${remainingStores}</div>
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