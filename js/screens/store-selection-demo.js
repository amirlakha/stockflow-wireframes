/* ==================== MODULE: screens/store-selection-demo.js ==================== */
/* Store selection screen demo controls and functionality */

const storeSelectionDemoControls = {
    originalStores: null,
    isGridView: true,
    currentStorePage: 1,
    storesPerPage: 5,

    initialize() {
        const storesGrid = document.getElementById('storesGrid');
        if (storesGrid && !this.originalStores) {
            this.originalStores = storesGrid.innerHTML;
        }
    },

    showAllStores() {
        const searchInput = document.getElementById('storeSearchInput');
        const regionFilter = document.getElementById('regionFilter');
        const alertFilter = document.getElementById('alertFilter');
        
        if (searchInput) searchInput.value = '';
        if (regionFilter) regionFilter.selectedIndex = 0;
        if (alertFilter) alertFilter.selectedIndex = 0;
        
        // Reset to first page
        this.currentStorePage = 1;
        
        // Trigger the filtering to refresh the display
        setTimeout(() => handleStoreFiltering(), 10);
    },

    filterByRegion() {
        const regionFilter = document.getElementById('regionFilter');
        if (!regionFilter) return;

        regionFilter.selectedIndex = 3; // Select "North"
        setTimeout(() => handleStoreFiltering(), 10);
    },

    searchStores() {
        const searchInput = document.getElementById('storeSearchInput');
        if (!searchInput) return;

        searchInput.value = 'birmingham';
        setTimeout(() => handleStoreFiltering(), 10);
    },

    filterByCriticalAlerts() {
        const alertFilter = document.getElementById('alertFilter');
        if (!alertFilter) return;

        alertFilter.selectedIndex = 4; // Select "Critical Alerts (11+)"
        setTimeout(() => handleStoreFiltering(), 10);
    },

    updateViewMode() {
        const storesGrid = document.getElementById('storesGrid');
        const storeCards = document.querySelectorAll('.store-card');
        
        if (!storesGrid) return;

        if (this.isGridView) {
            storesGrid.classList.remove('list-view');
            storeCards.forEach(card => {
                card.classList.remove('list-view');
                // Reset any list-view specific content structure
                if (card.querySelector('.store-content')) {
                    this.resetCardToGridView(card);
                }
            });
        } else {
            storesGrid.classList.add('list-view');
            storeCards.forEach(card => {
                if (!card.classList.contains('pagination')) {
                    card.classList.add('list-view');
                    this.convertCardToListView(card);
                }
            });
        }
    },

    convertCardToListView(card) {
        if (card.querySelector('.store-content')) return; // Already converted

        const statusIndicator = card.querySelector('.store-status-indicator');
        const statusLabel = card.querySelector('.store-status-label');
        const storeName = card.querySelector('.store-name');
        const storeLocation = card.querySelector('.store-location');
        const storeMetrics = card.querySelector('.store-metrics');
        const storeUpdated = card.querySelector('.store-updated');

        const storeContent = document.createElement('div');
        storeContent.className = 'store-content';

        const storeInfo = document.createElement('div');
        storeInfo.className = 'store-info';

        // Keep status indicators in their absolute positions
        storeInfo.appendChild(storeName.cloneNode(true));
        storeInfo.appendChild(storeLocation.cloneNode(true));

        storeContent.appendChild(storeInfo);
        storeContent.appendChild(storeMetrics.cloneNode(true));
        storeContent.appendChild(storeUpdated.cloneNode(true));

        // Clear and rebuild card content
        card.innerHTML = '';
        card.appendChild(statusIndicator.cloneNode(true));
        card.appendChild(statusLabel.cloneNode(true));
        card.appendChild(storeContent);
    },

    resetCardToGridView(card) {
        const statusIndicator = card.querySelector('.store-status-indicator');
        const statusLabel = card.querySelector('.store-status-label');
        const storeContent = card.querySelector('.store-content');
        
        if (!storeContent) return;

        const storeInfo = storeContent.querySelector('.store-info');
        const storeMetrics = storeContent.querySelector('.store-metrics');
        const storeUpdated = storeContent.querySelector('.store-updated');

        // Clear and rebuild with original structure
        card.innerHTML = '';
        card.appendChild(statusIndicator.cloneNode(true));
        card.appendChild(statusLabel.cloneNode(true));
        
        const nameEl = storeInfo.querySelector('.store-name');
        const locationEl = storeInfo.querySelector('.store-location');
        
        card.appendChild(nameEl.cloneNode(true));
        card.appendChild(locationEl.cloneNode(true));
        card.appendChild(storeMetrics.cloneNode(true));
        card.appendChild(storeUpdated.cloneNode(true));
    }
};