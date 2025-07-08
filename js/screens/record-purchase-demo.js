/* ==================== MODULE: record-purchase-demo.js ==================== */
/* Demo functionality for Record Purchase screen */

const recordPurchaseDemo = {
    // Store reference
    selectedStore: null,
    
    // Initialize the screen
    init() {
        console.log('Record Purchase screen initialized');
        
        // Get store context from sessionStorage
        const storeContext = sessionStorage.getItem('selectedStore');
        if (storeContext) {
            this.selectedStore = JSON.parse(storeContext);
            console.log('Store context loaded:', this.selectedStore.name);
            
            // Update store name in UI
            const storeNameElement = document.getElementById('purchase-store-name');
            const storeBadgeElement = document.getElementById('purchase-store-badge');
            if (storeNameElement) storeNameElement.textContent = this.selectedStore.name;
            if (storeBadgeElement) storeBadgeElement.textContent = this.selectedStore.name;
        }
    },

    // Demo: Show single item purchase
    showSingleItem() {
        console.log('Demo: Single item purchase');
        // TODO: Implement in Phase 6
    },

    // Demo: Show bulk purchase
    showBulkPurchase() {
        console.log('Demo: Bulk purchase scenario');
        // TODO: Implement in Phase 6
    },

    // Demo: Show purchase with supplier info
    showWithSupplier() {
        console.log('Demo: Purchase with supplier information');
        // TODO: Implement in Phase 6
    },

    // Demo: Clear the purchase
    clearPurchase() {
        console.log('Demo: Clearing purchase');
        // TODO: Implement in Phase 6
    }
};

// Make available globally
window.recordPurchaseDemo = recordPurchaseDemo;