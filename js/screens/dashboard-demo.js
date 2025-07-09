/* ==================== MODULE: screens/dashboard-demo.js ==================== */
/* Dashboard screen demo controls and functionality */

const dashboardDemoControls = {
    // Calculate real data from all stores
    calculateDashboardData() {
        // Define all stores (same as in handleStoreFiltering)
        const allStores = [
            { id: 'oxford-street', name: 'Oxford Street', products: 45, alerts: 3 },
            { id: 'birmingham', name: 'Birmingham Central', products: 38, alerts: 1 },
            { id: 'manchester', name: 'Manchester Trafford', products: 42, alerts: 8 },
            { id: 'leeds', name: 'Leeds City Centre', products: 29, alerts: 0 },
            { id: 'bristol', name: 'Bristol Cabot Circus', products: 35, alerts: 15 },
            { id: 'camden', name: 'Camden Market', products: 22, alerts: 4 },
            { id: 'westfield', name: 'Westfield Stratford', products: 50, alerts: 7 },
            { id: 'kings-road', name: 'Kings Road Chelsea', products: 18, alerts: 2 }
        ];
        
        // Check if we have updated data for the selected store in sessionStorage
        const selectedStoreData = sessionStorage.getItem('selectedStore');
        if (selectedStoreData) {
            const selectedStore = JSON.parse(selectedStoreData);
            const storeIndex = allStores.findIndex(s => s.id === selectedStore.id);
            
            if (storeIndex !== -1 && selectedStore.products) {
                // Update the store's product count and alerts based on actual data
                allStores[storeIndex].products = selectedStore.products.length;
                
                // Calculate alerts (warning + critical status items)
                const alertCount = selectedStore.products.filter(p => 
                    p.status === 'warning' || p.status === 'critical'
                ).length;
                allStores[storeIndex].alerts = alertCount;
            }
        }
        
        const totalStores = allStores.length;
        const totalAlerts = allStores.reduce((sum, store) => sum + store.alerts, 0);
        const totalProducts = allStores.reduce((sum, store) => sum + store.products, 0);
        
        return {
            stores: totalStores,
            alerts: totalAlerts,
            products: totalProducts
        };
    },
    
    updateDashboardStats() {
        const data = this.calculateDashboardData();
        
        const storeCount = document.getElementById('storeCount');
        const alertCount = document.getElementById('alertCount');
        const productCount = document.getElementById('productCount');
        const alertMessage = document.getElementById('alertMessage');
        
        if (storeCount) storeCount.textContent = data.stores;
        if (alertCount) alertCount.textContent = data.alerts;
        if (productCount) productCount.textContent = data.products;
        if (alertMessage) {
            alertMessage.textContent = `${data.alerts} products are running low on stock across all stores - Click to view`;
        }
    },
    
    // Removed demo control functions as dashboard now shows real data
    // The calculateDashboardData and updateDashboardStats functions remain
    // to provide real-time statistics for the dashboard
};