/* ==================== MODULE: screens/inventory-demo.js ==================== */
/* Inventory Overview screen demo controls and functionality */

const inventoryDemoControls = {
    // Current state
    currentProducts: [],
    currentStore: 'oxford-street',
    currentFilter: 'all',
    currentSort: 'name',
    currentPage: 1,
    
    // Store context
    selectedStore: null,
    
    // Search and filter state
    searchTerm: '',
    categoryFilter: 'all',
    stockLevelFilter: 'all',
    
    // Sorting state
    sortColumn: 'name',
    sortDirection: 'asc',
    
    // Pagination state
    itemsPerPage: 10,
    
    // Store-specific product data
    storeProducts: {
        'oxford-street': [
            { id: 1, name: 'Designer Blazer - Black', sku: 'BLZ-001', stock: 12, minLevel: 5, price: 299.99, status: 'good', updated: '2 hrs ago', category: 'Clothing' },
            { id: 2, name: 'Silk Scarf Collection', sku: 'SCF-002', stock: 8, minLevel: 10, price: 89.99, status: 'warning', updated: '3 hrs ago', category: 'Clothing' },
            { id: 3, name: 'Leather Handbag - Brown', sku: 'HBG-003', stock: 3, minLevel: 8, price: 450.00, status: 'critical', updated: '1 hr ago', category: 'Clothing' },
            { id: 4, name: 'Premium Denim Jeans', sku: 'JNS-004', stock: 25, minLevel: 10, price: 129.99, status: 'good', updated: '4 hrs ago', category: 'Clothing' },
            { id: 5, name: 'Cashmere Sweater - Cream', sku: 'SWT-005', stock: 15, minLevel: 8, price: 199.99, status: 'good', updated: '30 mins ago', category: 'Clothing' },
            { id: 6, name: 'Oxford Dress Shoes', sku: 'SHO-006', stock: 18, minLevel: 10, price: 175.00, status: 'good', updated: '2 hrs ago', category: 'Footwear' },
            { id: 7, name: 'Formal Suit - Navy', sku: 'SUT-007', stock: 9, minLevel: 5, price: 599.99, status: 'good', updated: '1 hr ago', category: 'Clothing' },
            { id: 8, name: 'Designer Belt - Black', sku: 'BLT-008', stock: 22, minLevel: 10, price: 125.00, status: 'good', updated: '3 hrs ago', category: 'Clothing' },
            // Additional products to reach 45 total
            { id: 9, name: 'Luxury Watch', sku: 'WCH-009', stock: 4, minLevel: 3, price: 899.99, status: 'good', updated: '5 hrs ago', category: 'Clothing' },
            { id: 10, name: 'Silk Tie Collection', sku: 'TIE-010', stock: 35, minLevel: 15, price: 79.99, status: 'good', updated: '1 hr ago', category: 'Clothing' }
        ],
        'birmingham': [
            { id: 1, name: 'Cotton T-Shirt - White', sku: 'TSH-101', stock: 45, minLevel: 20, price: 19.99, status: 'good', updated: '1 hr ago', category: 'Clothing' },
            { id: 2, name: 'Denim Jeans - Blue', sku: 'JNS-102', stock: 12, minLevel: 15, price: 49.99, status: 'warning', updated: '2 hrs ago', category: 'Clothing' },
            { id: 3, name: 'Running Shoes - Black', sku: 'SHO-103', stock: 28, minLevel: 10, price: 89.99, status: 'good', updated: '30 mins ago', category: 'Footwear' },
            { id: 4, name: 'Hooded Sweatshirt', sku: 'SWT-104', stock: 33, minLevel: 15, price: 39.99, status: 'good', updated: '3 hrs ago', category: 'Clothing' },
            { id: 5, name: 'Casual Sneakers', sku: 'SNK-105', stock: 19, minLevel: 10, price: 59.99, status: 'good', updated: '2 hrs ago', category: 'Footwear' },
            { id: 6, name: 'Basic Polo Shirt', sku: 'PLO-106', stock: 38, minLevel: 20, price: 29.99, status: 'good', updated: '1 hr ago', category: 'Clothing' },
            { id: 7, name: 'Cargo Shorts', sku: 'SHT-107', stock: 22, minLevel: 10, price: 34.99, status: 'good', updated: '4 hrs ago', category: 'Clothing' },
            { id: 8, name: 'Baseball Cap', sku: 'CAP-108', stock: 41, minLevel: 15, price: 24.99, status: 'good', updated: '30 mins ago', category: 'Clothing' }
        ],
        'manchester': [
            { id: 1, name: 'Vintage Band T-Shirt', sku: 'VNT-201', stock: 8, minLevel: 10, price: 34.99, status: 'warning', updated: '2 hrs ago', category: 'Clothing' },
            { id: 2, name: 'Leather Boots - Brown', sku: 'BOT-202', stock: 5, minLevel: 8, price: 149.99, status: 'warning', updated: '1 hr ago', category: 'Footwear' },
            { id: 3, name: 'Flannel Shirt - Red', sku: 'FLN-203', stock: 2, minLevel: 10, price: 44.99, status: 'critical', updated: '3 hrs ago', category: 'Clothing' },
            { id: 4, name: 'Ripped Jeans - Black', sku: 'RJN-204', stock: 9, minLevel: 12, price: 69.99, status: 'warning', updated: '30 mins ago', category: 'Clothing' },
            { id: 5, name: 'Canvas Backpack', sku: 'BPK-205', stock: 6, minLevel: 8, price: 79.99, status: 'warning', updated: '2 hrs ago', category: 'Clothing' },
            { id: 6, name: 'Denim Jacket', sku: 'DNJ-206', stock: 4, minLevel: 6, price: 89.99, status: 'warning', updated: '1 hr ago', category: 'Clothing' },
            { id: 7, name: 'Beanie Hat - Black', sku: 'BNE-207', stock: 15, minLevel: 10, price: 19.99, status: 'good', updated: '4 hrs ago', category: 'Clothing' },
            { id: 8, name: 'Combat Boots', sku: 'CMB-208', stock: 3, minLevel: 5, price: 129.99, status: 'warning', updated: '30 mins ago', category: 'Footwear' }
        ],
        'leeds': [
            { id: 1, name: 'Sports Jersey - Blue', sku: 'JRS-301', stock: 25, minLevel: 10, price: 59.99, status: 'good', updated: '1 hr ago', category: 'Clothing' },
            { id: 2, name: 'Training Shorts', sku: 'TRS-302', stock: 30, minLevel: 15, price: 29.99, status: 'good', updated: '2 hrs ago', category: 'Clothing' },
            { id: 3, name: 'Running Tights', sku: 'TGT-303', stock: 18, minLevel: 10, price: 49.99, status: 'good', updated: '30 mins ago', category: 'Clothing' },
            { id: 4, name: 'Sports Bra', sku: 'BRA-304', stock: 22, minLevel: 12, price: 39.99, status: 'good', updated: '3 hrs ago', category: 'Clothing' },
            { id: 5, name: 'Athletic Socks - Pack', sku: 'SOC-305', stock: 45, minLevel: 20, price: 14.99, status: 'good', updated: '1 hr ago', category: 'Clothing' },
            { id: 6, name: 'Gym Bag', sku: 'GYM-306', stock: 12, minLevel: 8, price: 69.99, status: 'good', updated: '2 hrs ago', category: 'Clothing' }
        ],
        'bristol': [
            { id: 1, name: 'Boho Dress - Floral', sku: 'BHO-401', stock: 1, minLevel: 8, price: 89.99, status: 'critical', updated: '2 hrs ago', category: 'Clothing' },
            { id: 2, name: 'Sandals - Tan', sku: 'SND-402', stock: 8, minLevel: 10, price: 49.99, status: 'warning', updated: '1 hr ago', category: 'Footwear' },
            { id: 3, name: 'Sun Hat - Straw', sku: 'HAT-403', stock: 2, minLevel: 5, price: 34.99, status: 'critical', updated: '3 hrs ago', category: 'Clothing' },
            { id: 4, name: 'Beach Tote Bag', sku: 'TOT-404', stock: 0, minLevel: 8, price: 29.99, status: 'critical', updated: '30 mins ago', category: 'Clothing' },
            { id: 5, name: 'Maxi Skirt - White', sku: 'SKT-405', stock: 9, minLevel: 12, price: 54.99, status: 'warning', updated: '2 hrs ago', category: 'Clothing' },
            { id: 6, name: 'Crochet Top', sku: 'CRO-406', stock: 2, minLevel: 8, price: 44.99, status: 'critical', updated: '1 hr ago', category: 'Clothing' },
            { id: 7, name: 'Linen Pants - Beige', sku: 'LIN-407', stock: 7, minLevel: 10, price: 69.99, status: 'warning', updated: '4 hrs ago', category: 'Clothing' }
        ],
        'camden': [
            { id: 1, name: 'Punk Rock T-Shirt', sku: 'PNK-501', stock: 18, minLevel: 10, price: 29.99, status: 'good', updated: '1 hr ago', category: 'Clothing' },
            { id: 2, name: 'Doc Martens - Black', sku: 'DOC-502', stock: 8, minLevel: 8, price: 159.99, status: 'warning', updated: '2 hrs ago', category: 'Footwear' },
            { id: 3, name: 'Studded Belt', sku: 'STD-503', stock: 12, minLevel: 8, price: 39.99, status: 'good', updated: '30 mins ago', category: 'Clothing' },
            { id: 4, name: 'Plaid Skirt', sku: 'PLD-504', stock: 9, minLevel: 6, price: 49.99, status: 'good', updated: '3 hrs ago', category: 'Clothing' },
            { id: 5, name: 'Fishnet Stockings', sku: 'FSH-505', stock: 25, minLevel: 15, price: 14.99, status: 'good', updated: '1 hr ago', category: 'Clothing' }
        ],
        'westfield': [
            { id: 1, name: 'Smart Casual Shirt', sku: 'SCS-601', stock: 15, minLevel: 10, price: 79.99, status: 'good', updated: '2 hrs ago', category: 'Clothing' },
            { id: 2, name: 'Chinos - Khaki', sku: 'CHN-602', stock: 6, minLevel: 12, price: 69.99, status: 'warning', updated: '1 hr ago', category: 'Clothing' },
            { id: 3, name: 'Loafers - Brown', sku: 'LOF-603', stock: 4, minLevel: 8, price: 119.99, status: 'warning', updated: '3 hrs ago', category: 'Footwear' },
            { id: 4, name: 'Polo Shirt - Navy', sku: 'POL-604', stock: 8, minLevel: 10, price: 49.99, status: 'warning', updated: '30 mins ago', category: 'Clothing' },
            { id: 5, name: 'Messenger Bag', sku: 'MSG-605', stock: 3, minLevel: 5, price: 99.99, status: 'warning', updated: '2 hrs ago', category: 'Clothing' },
            { id: 6, name: 'Smart Watch', sku: 'WCH-606', stock: 5, minLevel: 8, price: 299.99, status: 'warning', updated: '1 hr ago', category: 'Clothing' },
            { id: 7, name: 'Sunglasses - Aviator', sku: 'SUN-607', stock: 20, minLevel: 12, price: 89.99, status: 'good', updated: '4 hrs ago', category: 'Clothing' }
        ],
        'kings-road': [
            { id: 1, name: 'Designer Dress - Red', sku: 'DES-701', stock: 5, minLevel: 3, price: 599.99, status: 'good', updated: '2 hrs ago', category: 'Clothing' },
            { id: 2, name: 'High Heels - Black', sku: 'HEL-702', stock: 8, minLevel: 6, price: 249.99, status: 'good', updated: '1 hr ago', category: 'Footwear' },
            { id: 3, name: 'Clutch Purse - Gold', sku: 'CLT-703', stock: 10, minLevel: 5, price: 179.99, status: 'good', updated: '3 hrs ago', category: 'Clothing' },
            { id: 4, name: 'Cocktail Dress', sku: 'COC-704', stock: 4, minLevel: 3, price: 399.99, status: 'good', updated: '30 mins ago', category: 'Clothing' }
        ]
    },
    
    // Store themes for generating additional products
    storeThemes: {
        'oxford-street': {
            prefix: ['Designer', 'Premium', 'Luxury', 'Exclusive', 'High-End'],
            types: ['Blazer', 'Dress', 'Coat', 'Shirt', 'Trousers', 'Accessories'],
            priceRange: [150, 600]
        },
        'birmingham': {
            prefix: ['Basic', 'Essential', 'Classic', 'Everyday', 'Casual'],
            types: ['T-Shirt', 'Jeans', 'Hoodie', 'Shorts', 'Jacket', 'Trainers'],
            priceRange: [20, 80]
        },
        'manchester': {
            prefix: ['Vintage', 'Retro', 'Urban', 'Street', 'Alternative'],
            types: ['Band Tee', 'Leather Jacket', 'Boots', 'Flannel', 'Beanie', 'Backpack'],
            priceRange: [30, 150]
        },
        'leeds': {
            prefix: ['Sport', 'Active', 'Performance', 'Training', 'Athletic'],
            types: ['Leggings', 'Sports Top', 'Trainers', 'Shorts', 'Track Jacket', 'Gym Wear'],
            priceRange: [25, 90]
        },
        'bristol': {
            prefix: ['Boho', 'Festival', 'Beach', 'Summer', 'Hippie'],
            types: ['Maxi Dress', 'Sandals', 'Kimono', 'Hat', 'Jewelry', 'Bag'],
            priceRange: [30, 100]
        },
        'camden': {
            prefix: ['Punk', 'Gothic', 'Rock', 'Edgy', 'Alternative'],
            types: ['Band Merch', 'Boots', 'Studded Items', 'Chains', 'Patches', 'Pins'],
            priceRange: [20, 160]
        },
        'westfield': {
            prefix: ['Smart', 'Business', 'Contemporary', 'Modern', 'Sophisticated'],
            types: ['Shirt', 'Blazer', 'Chinos', 'Loafers', 'Watch', 'Briefcase'],
            priceRange: [60, 300]
        },
        'kings-road': {
            prefix: ['Couture', 'Haute', 'Bespoke', 'Limited Edition', 'Designer'],
            types: ['Evening Dress', 'Heels', 'Handbag', 'Jewelry', 'Scarf', 'Clutch'],
            priceRange: [200, 1000]
        }
    },
    
    // Get target alert count for each store
    getTargetAlerts(storeId) {
        const alertCounts = {
            'oxford-street': 3,
            'birmingham': 1,
            'manchester': 8,
            'leeds': 0,
            'bristol': 15,
            'camden': 4,
            'westfield': 7,
            'kings-road': 2
        };
        return alertCounts[storeId] || 0;
    },
    
    // Generate additional products to reach target count
    generateAdditionalProducts(storeId, existingProducts, targetCount) {
        const products = [...existingProducts];
        const theme = this.storeThemes[storeId];
        if (!theme) return products;
        
        let idCounter = existingProducts.length + 1;
        
        while (products.length < targetCount) {
            const prefixIndex = (idCounter - 1) % theme.prefix.length;
            const typeIndex = (idCounter - 1) % theme.types.length;
            const prefix = theme.prefix[prefixIndex];
            const type = theme.types[typeIndex];
            
            // Determine stock status based on position (to match store alert counts)
            let status = 'good';
            let stock = 20 + (idCounter % 30);
            let minLevel = 10;
            
            // Calculate how many alerts we need vs how many we have
            const currentAlerts = products.filter(p => p.status === 'warning' || p.status === 'critical').length;
            const targetAlerts = this.getTargetAlerts(storeId);
            const needMoreAlerts = currentAlerts < targetAlerts;
            
            // Create warning/critical items to match store alert counts
            // Only create alerts if we still need more
            if (needMoreAlerts) {
                if (storeId === 'bristol' && currentAlerts < 15) {
                    // Bristol needs 15 alerts total (already has 7 in base: 4 critical + 3 warning)
                    // Need 8 more alerts - mix of warning and critical
                    if (idCounter >= 8 && idCounter <= 15) {
                        if (idCounter % 2 === 0) {
                            status = 'warning';
                            stock = 6 + (idCounter % 4);
                            minLevel = 10;
                        } else {
                            status = 'critical';
                            stock = Math.floor(idCounter % 5);
                            minLevel = 8;
                        }
                    }
                } else if (storeId === 'manchester' && currentAlerts < 8) {
                    // Manchester needs 8 alerts (already has 7 in base)
                    // Need 1 more alert
                    if (idCounter === 9) {
                        status = 'warning';
                        stock = 8;
                        minLevel = 10;
                    }
                } else if (storeId === 'westfield' && currentAlerts < 7) {
                    // Westfield needs 7 alerts (already has 5 in base)
                    // Need 2 more alerts
                    if (idCounter === 8 || idCounter === 9) {
                        status = 'warning';
                        stock = 7 + (idCounter % 3);
                        minLevel = 12;
                    }
                } else if (storeId === 'oxford-street' && currentAlerts < 3) {
                    // Oxford needs 3 alerts total (already has 2, need 1 more)
                    if (idCounter === 11) {
                        status = 'warning';
                        stock = 9;
                        minLevel = 12;
                    }
                } else if (storeId === 'camden' && currentAlerts < 4) {
                    // Camden needs 4 alerts (already has 1)
                    // Need 3 more alerts
                    if (idCounter >= 6 && idCounter <= 8) {
                        status = 'warning';
                        stock = 8 + (idCounter % 3);
                        minLevel = 10;
                    }
                } else if (storeId === 'kings-road' && currentAlerts < 2) {
                    // Kings Road needs 2 alerts (already has 0)
                    if (idCounter === 5 || idCounter === 6) {
                        status = 'warning';
                        stock = 7 + idCounter % 2;
                        minLevel = 8;
                    }
                } else if (storeId === 'birmingham' && currentAlerts < 1) {
                    // Birmingham already has 1 alert in base products, don't add more
                    // This condition should never be true
                } else if (storeId === 'leeds' && currentAlerts < 0) {
                    // Leeds has 0 alerts - keep it that way
                    // This condition should never be true
                }
            }
            
            const basePrice = theme.priceRange[0] + 
                ((theme.priceRange[1] - theme.priceRange[0]) * ((idCounter % 10) / 10));
            
            products.push({
                id: idCounter,
                name: `${prefix} ${type}`,
                sku: `${storeId.substring(0, 3).toUpperCase()}-${String(idCounter).padStart(3, '0')}`,
                stock: stock,
                minLevel: minLevel,
                price: Math.round(basePrice * 100) / 100,
                status: status,
                updated: `${(idCounter % 12) + 1} hrs ago`,
                category: type.includes('Shoe') || type.includes('Boot') || type.includes('Trainer') || type.includes('Sandal') || type.includes('Heel') || type.includes('Loafer') ? 'Footwear' : 'Clothing'
            });
            
            idCounter++;
        }
        
        return products;
    },
    
    // Default sample products (for backward compatibility)
    sampleProducts: [
        {
            id: 1, name: 'Classic Cotton T-Shirt', sku: 'TSH-001',
            stock: 45, minLevel: 10, price: 19.99, status: 'good',
            updated: '2 hrs ago', category: 'Clothing'
        },
        {
            id: 2, name: 'Denim Jeans - Blue', sku: 'JN-004', 
            stock: 8, minLevel: 15, price: 49.99, status: 'warning',
            updated: '5 hrs ago', category: 'Clothing'
        },
        {
            id: 3, name: 'Summer Dress - Floral', sku: 'DR-012',
            stock: 2, minLevel: 20, price: 34.99, status: 'critical',
            updated: '1 day ago', category: 'Clothing'
        },
        {
            id: 4, name: 'Leather Jacket - Black', sku: 'JK-007',
            stock: 12, minLevel: 5, price: 199.99, status: 'good',
            updated: '3 hrs ago', category: 'Clothing'
        },
        {
            id: 5, name: 'Running Shoes - White', sku: 'SH-023',
            stock: 6, minLevel: 12, price: 89.99, status: 'warning',
            updated: '6 hrs ago', category: 'Footwear'
        },
        {
            id: 6, name: 'Wool Sweater - Navy', sku: 'SW-015',
            stock: 28, minLevel: 8, price: 79.99, status: 'good',
            updated: '1 hr ago', category: 'Clothing'
        },
        {
            id: 7, name: 'Casual Sneakers - Black', sku: 'SN-041',
            stock: 3, minLevel: 15, price: 65.99, status: 'critical',
            updated: '8 hrs ago', category: 'Footwear'
        },
        {
            id: 8, name: 'Business Shirt - White', sku: 'SH-089',
            stock: 22, minLevel: 12, price: 45.99, status: 'good',
            updated: '4 hrs ago', category: 'Clothing'
        }
    ],
    
    // Demo control functions
    showNormalInventory() {
        console.log('Demo: Showing normal inventory mix');
        this.currentProducts = this.sampleProducts.slice();
        
        // Reset filters and show all products
        this.searchTerm = '';
        this.categoryFilter = 'all';
        this.stockLevelFilter = 'all';
        this.currentPage = 1;
        
        // Update UI elements
        const searchInput = document.getElementById('productSearchInput');
        const categorySelect = document.getElementById('categoryFilter');
        const stockSelect = document.getElementById('stockLevelFilter');
        
        if (searchInput) searchInput.value = '';
        if (categorySelect) categorySelect.value = 'all';
        if (stockSelect) stockSelect.value = 'all';
        
        this.updateProductTable();
        this.updateSummaryStats();
    },
    
    showCriticalAlerts() {
        console.log('Demo: Highlighting critical stock alerts');
        
        // Set stock level filter to show critical items
        this.stockLevelFilter = 'critical';
        this.currentPage = 1;
        
        // Update the stock level dropdown
        const stockSelect = document.getElementById('stockLevelFilter');
        if (stockSelect) stockSelect.value = 'critical';
        
        this.updateProductTable();
        this.updateSummaryStats();
        
        // Show a brief notification
        const count = this.getFilteredProducts().length;
        console.log(`Showing ${count} critical stock items`);
    },
    
    
    simulateStockUpdate() {
        console.log('Demo: Simulating real-time stock level changes');
        
        let updateCount = 0;
        
        // Randomly update some stock levels
        this.currentProducts.forEach(product => {
            if (Math.random() < 0.3) { // 30% chance to update
                const change = Math.floor(Math.random() * 10) - 5; // -5 to +5
                const oldStock = product.stock;
                product.stock = Math.max(0, product.stock + change);
                
                // Update status based on new stock level
                const oldStatus = product.status;
                product.status = product.stock <= product.minLevel ? 
                    (product.stock <= product.minLevel * 0.5 ? 'critical' : 'warning') : 'good';
                
                product.updated = 'just now';
                updateCount++;
                
                console.log(`Updated ${product.name}: stock ${oldStock} → ${product.stock}, status ${oldStatus} → ${product.status}`);
            }
        });
        
        // Refresh the table to show updates
        this.updateProductTable();
        this.updateSummaryStats();
        // Update header to reflect any alert changes
        this.updateInventoryHeader();
        
        console.log(`Stock update complete: ${updateCount} products updated`);
    },

    // Utility functions
    initializeInventory() {
        // First check if we have products in the selected store from sessionStorage
        if (this.selectedStore && this.selectedStore.products && Array.isArray(this.selectedStore.products)) {
            // Use existing products from sessionStorage (these may have been updated by transactions)
            this.currentProducts = this.selectedStore.products;
            console.log('Loaded existing products from sessionStorage:', this.currentProducts.length);
        } else if (this.selectedStore && this.storeProducts[this.selectedStore.id]) {
            // Generate new products only if none exist in sessionStorage
            const baseProducts = this.storeProducts[this.selectedStore.id];
            const targetCount = this.selectedStore.products || 45;
            // Generate additional products to match the store's product count
            this.currentProducts = this.generateAdditionalProducts(this.selectedStore.id, baseProducts, targetCount);
            console.log('Generated new products:', this.currentProducts.length);
        } else {
            // Default to Oxford Street products with full count
            const baseProducts = this.storeProducts['oxford-street'];
            this.currentProducts = this.generateAdditionalProducts('oxford-street', baseProducts, 45);
            console.log('Using default Oxford Street products:', this.currentProducts.length);
        }
        
        // Update sessionStorage after initializing products
        this.updateSessionStorage();
    },
    
    setSelectedStore(store) {
        this.selectedStore = store;
        console.log('Store context set:', store);
        
        // Only reinitialize if we don't have products or if the store changed
        const needsInit = !this.currentProducts || this.currentProducts.length === 0 || 
                         (this.previousStoreId && this.previousStoreId !== store.id);
        
        if (needsInit) {
            // Reinitialize inventory with store-specific products
            this.initializeInventory();
        } else if (store.products && Array.isArray(store.products)) {
            // Use the products from the store object if available
            this.currentProducts = store.products;
            console.log('Using products from store object:', this.currentProducts.length);
        }
        
        this.previousStoreId = store.id;
        this.updateInventoryHeader();
        
        // Update sessionStorage with the store including products
        if (store && this.currentProducts) {
            const storeWithProducts = {
                ...store,
                products: this.currentProducts
            };
            sessionStorage.setItem('selectedStore', JSON.stringify(storeWithProducts));
        }
    },
    
    updateSessionStorage() {
        // Update sessionStorage with current store and products
        if (this.selectedStore && this.currentProducts) {
            const storeWithProducts = {
                ...this.selectedStore,
                products: this.currentProducts
            };
            sessionStorage.setItem('selectedStore', JSON.stringify(storeWithProducts));
        }
    },
    
    updateInventoryHeader() {
        // Default to Oxford Street if no store selected
        const store = this.selectedStore || {
            name: 'Oxford Street',
            products: 45,
            alerts: 3
        };
        
        // Calculate actual product count and alerts from current products
        const productCount = this.currentProducts.length;
        const alertCount = this.currentProducts.filter(p => p.status === 'warning' || p.status === 'critical').length;
        
        // Update breadcrumb
        const breadcrumb = document.querySelector('.inventory-breadcrumb');
        if (breadcrumb) {
            breadcrumb.textContent = `Dashboard > Store Selection > ${store.name} Inventory`;
        }
        
        // Update store info badge with actual counts
        const badge = document.querySelector('.store-info-badge');
        if (badge) {
            badge.innerHTML = `${store.name}<br>${productCount} Products • ${alertCount} Alert${alertCount !== 1 ? 's' : ''}`;
        }
    },
    
    updateProductTable() {
        // Check if table exists
        const tableBody = document.getElementById('productTableBody');
        if (!tableBody) {
            return;
        }
        
        try {
            // Filter products based on all criteria
            let products = this.getFilteredProducts();
            
            // Apply pagination
            const totalProducts = products.length;
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            const paginatedProducts = products.slice(start, end);
            
            // Build table rows HTML
            const rowsHTML = paginatedProducts.map(product => {
                const statusClass = product.status;
                const statusIcon = product.status === 'good' ? '✓' : '!';
                const statusText = product.status === 'good' ? 'GOOD' : 
                                  product.status === 'warning' ? 'LOW' : 'CRITICAL';
                
                return `
                    <tr class="product-row ${statusClass}">
                        <td><span class="status-indicator ${statusClass}">${statusIcon}</span>${product.name}</td>
                        <td>${product.sku}</td>
                        <td>${product.category}</td>
                        <td><span class="stock-number ${statusClass}">${product.stock}</span></td>
                        <td>${product.minLevel}</td>
                        <td>£${product.price.toFixed(2)}</td>
                        <td><span class="status-text ${statusClass}">${statusText}</span></td>
                        <td>${product.updated}</td>
                    </tr>
                `;
            }).join('');
            
            // Update table body
            tableBody.innerHTML = rowsHTML;
            
            // Update pagination controls
            this.generatePagination();
        } catch (error) {
            console.error('Error updating product table:', error);
        }
    },
    
    handleSearch(searchTerm) {
        // Update search term
        this.searchTerm = searchTerm.toLowerCase().trim();
        
        // Reset to first page when filtering
        this.currentPage = 1;
        
        // Update the table with filtered results
        this.updateProductTable();
    },
    
    handleSort(column) {
        console.log(`Sorting products by column: ${column}`);
        
        // Toggle direction if same column, otherwise reset to ascending
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        
        // Sort the products
        this.currentProducts.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];
            
            // Handle undefined values
            if (aVal === undefined) aVal = '';
            if (bVal === undefined) bVal = '';
            
            // Numeric comparison for numeric fields
            if (column === 'stock' || column === 'minLevel' || column === 'price') {
                aVal = parseFloat(aVal) || 0;
                bVal = parseFloat(bVal) || 0;
                return this.sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
            }
            
            // String comparison for text fields
            aVal = String(aVal).toLowerCase();
            bVal = String(bVal).toLowerCase();
            
            if (this.sortDirection === 'asc') {
                return aVal.localeCompare(bVal);
            } else {
                return bVal.localeCompare(aVal);
            }
        });
        
        // Update the table and indicators
        this.updateSortIndicators();
        this.updateProductTable();
    },
    
    // Get filtered products based on all active filters
    getFilteredProducts() {
        let products = [...this.currentProducts];
        
        // Apply search filter
        if (this.searchTerm) {
            products = products.filter(product => 
                product.name.toLowerCase().includes(this.searchTerm) ||
                product.sku.toLowerCase().includes(this.searchTerm) ||
                (product.category && product.category.toLowerCase().includes(this.searchTerm))
            );
        }
        
        // Apply category filter
        if (this.categoryFilter && this.categoryFilter !== 'all') {
            products = products.filter(product => product.category === this.categoryFilter);
        }
        
        // Apply stock level filter
        if (this.stockLevelFilter && this.stockLevelFilter !== 'all') {
            products = products.filter(product => product.status === this.stockLevelFilter);
        }
        
        console.log(`Filtered ${products.length} products from ${this.currentProducts.length} total`);
        return products;
    },
    
    generatePagination() {
        console.log('Generating pagination controls');
        
        const paginationInfo = document.getElementById('paginationInfo');
        const paginationControls = document.getElementById('paginationControls');
        
        if (!paginationInfo || !paginationControls) {
            return;
        }
        
        // Get filtered products count
        const filteredProducts = this.getFilteredProducts();
        const totalProducts = filteredProducts.length;
        const totalPages = Math.ceil(totalProducts / this.itemsPerPage);
        
        // Ensure current page is valid
        if (this.currentPage > totalPages) {
            this.currentPage = 1;
        }
        
        // Calculate display range
        const start = totalProducts === 0 ? 0 : ((this.currentPage - 1) * this.itemsPerPage) + 1;
        const end = Math.min(this.currentPage * this.itemsPerPage, totalProducts);
        
        // Update pagination info
        paginationInfo.textContent = `Showing ${start}-${end} of ${totalProducts} products`;
        
        // Clear existing controls
        paginationControls.innerHTML = '';
        
        // Don't show pagination controls if only one page
        if (totalPages <= 1) {
            return;
        }
        
        // Previous button
        const prevButton = document.createElement('button');
        prevButton.className = 'pagination-btn';
        prevButton.textContent = '← Previous';
        prevButton.disabled = this.currentPage === 1;
        prevButton.onclick = () => this.goToPage(this.currentPage - 1);
        paginationControls.appendChild(prevButton);
        
        // Page numbers
        const pageNumbers = this.getPaginationRange(this.currentPage, totalPages);
        pageNumbers.forEach(pageNum => {
            if (pageNum === '...') {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                paginationControls.appendChild(ellipsis);
            } else {
                const pageButton = document.createElement('button');
                pageButton.className = 'pagination-btn';
                if (pageNum === this.currentPage) {
                    pageButton.classList.add('active');
                }
                pageButton.textContent = pageNum;
                pageButton.onclick = () => this.goToPage(pageNum);
                paginationControls.appendChild(pageButton);
            }
        });
        
        // Next button
        const nextButton = document.createElement('button');
        nextButton.className = 'pagination-btn';
        nextButton.textContent = 'Next →';
        nextButton.disabled = this.currentPage === totalPages;
        nextButton.onclick = () => this.goToPage(this.currentPage + 1);
        paginationControls.appendChild(nextButton);
    },
    
    // Calculate which page numbers to show
    getPaginationRange(current, total) {
        const delta = 2; // Pages to show on each side of current
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= total; i++) {
            if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
                range.push(i);
            }
        }

        range.forEach((i) => {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        });

        return rangeWithDots;
    },
    
    // Navigate to specific page
    goToPage(pageNumber) {
        console.log(`Navigating to page ${pageNumber}`);
        
        const filteredProducts = this.getFilteredProducts();
        const totalPages = Math.ceil(filteredProducts.length / this.itemsPerPage);
        
        // Validate page number
        if (pageNumber < 1 || pageNumber > totalPages) {
            console.warn(`Invalid page number: ${pageNumber}`);
            return;
        }
        
        this.currentPage = pageNumber;
        this.updateProductTable();
        this.generatePagination();
    },
    
    // Initialize search functionality
    initializeSearch() {
        const searchInput = document.getElementById('productSearchInput');
        if (!searchInput) {
            console.log('Search input not found, skipping initialization');
            return;
        }
        
        // Remove any existing listeners first
        searchInput.removeEventListener('input', this.handleSearchInput);
        
        // Create bound handler to maintain 'this' context
        this.handleSearchInput = (e) => {
            this.handleSearch(e.target.value);
        };
        
        // Add new listener
        searchInput.addEventListener('input', this.handleSearchInput);
        
        console.log('Search functionality initialized');
    },
    
    // Initialize category filter
    initializeCategoryFilter() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (!categoryFilter) {
            console.log('Category filter not found, skipping initialization');
            return;
        }
        
        // Remove any existing listeners
        categoryFilter.removeEventListener('change', this.handleCategoryChange);
        
        // Create bound handler
        this.handleCategoryChange = (e) => {
            this.categoryFilter = e.target.value;
            console.log(`Category filter changed to: ${this.categoryFilter}`);
            this.currentPage = 1; // Reset to first page
            this.updateProductTable();
        };
        
        // Add listener
        categoryFilter.addEventListener('change', this.handleCategoryChange);
        
        console.log('Category filter initialized');
    },
    
    // Initialize stock level filter
    initializeStockLevelFilter() {
        const stockLevelFilter = document.getElementById('stockLevelFilter');
        if (!stockLevelFilter) {
            console.log('Stock level filter not found, skipping initialization');
            return;
        }
        
        // Remove any existing listeners
        stockLevelFilter.removeEventListener('change', this.handleStockLevelChange);
        
        // Create bound handler
        this.handleStockLevelChange = (e) => {
            this.stockLevelFilter = e.target.value;
            console.log(`Stock level filter changed to: ${this.stockLevelFilter}`);
            this.currentPage = 1; // Reset to first page
            this.updateProductTable();
        };
        
        // Add listener
        stockLevelFilter.addEventListener('change', this.handleStockLevelChange);
        
        console.log('Stock level filter initialized');
    },
    
    // Initialize column sorting
    initializeSorting() {
        const headers = document.querySelectorAll('.inventory-functional .sortable-header');
        if (!headers.length) {
            console.log('No sortable headers found, skipping sorting initialization');
            return;
        }
        
        headers.forEach(header => {
            // Remove any existing listeners
            header.removeEventListener('click', this.handleHeaderClick);
            
            // Add cursor style
            header.style.cursor = 'pointer';
            
            // Create bound handler
            this.handleHeaderClick = (e) => {
                const column = e.currentTarget.dataset.column;
                if (column) {
                    this.handleSort(column);
                }
            };
            
            // Add listener
            header.addEventListener('click', this.handleHeaderClick);
        });
        
        console.log('Column sorting initialized');
        this.updateSortIndicators();
    },
    
    // Update visual sort indicators
    updateSortIndicators() {
        const headers = document.querySelectorAll('.inventory-functional .sortable-header');
        
        headers.forEach(header => {
            const column = header.dataset.column;
            // Remove any existing indicators
            header.textContent = header.textContent.replace(/ ↑| ↓/g, '');
            
            // Add indicator for active sort column
            if (column === this.sortColumn) {
                header.textContent += this.sortDirection === 'asc' ? ' ↑' : ' ↓';
            }
        });
    },
    
    // Initialize quick actions
    initializeQuickActions() {
        console.log('Initializing quick actions');
        
        // Record Sale button
        const recordSaleBtn = document.querySelector('.inventory-functional .action-btn-record-sale');
        if (recordSaleBtn) {
            recordSaleBtn.onclick = () => this.handleRecordSale();
        }
        
        // Add Stock button
        const addStockBtn = document.querySelector('.inventory-functional .action-btn-add-stock');
        if (addStockBtn) {
            addStockBtn.onclick = () => this.handleAddStock();
        }
        
        // Adjust Stock button
        const adjustStockBtn = document.querySelector('.inventory-functional .action-btn-adjust-stock');
        if (adjustStockBtn) {
            adjustStockBtn.onclick = () => this.handleAdjustStock();
        }
        
        // Export button
        const exportBtn = document.querySelector('.inventory-functional .action-btn-export');
        if (exportBtn) {
            exportBtn.onclick = () => this.handleExport();
        }
    },
    
    // Quick action handlers
    handleRecordSale() {
        console.log('Record Sale clicked - navigating to Record Sale screen');
        navigateTo('record-sale');
    },
    
    handleAddStock() {
        console.log('Add Stock clicked - navigating to Record Purchase screen');
        navigateTo('record-purchase');
    },
    
    handleAdjustStock() {
        console.log('Adjust Stock clicked');
        alert('Adjust Stock\n\nThis would open a dialog for stock adjustments.\n\nFeatures:\n• Select products\n• Adjust quantities\n• Add reason for adjustment\n• Track adjustment history');
    },
    
    handleExport() {
        console.log('Export clicked');
        
        const btn = document.querySelector('.inventory-functional .action-btn-export');
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Exporting...';
        }
        
        try {
            // Simple CSV export implementation
            const products = this.getFilteredProducts();
            if (products.length === 0) {
                alert('No products to export');
                return;
            }
            
            // Create CSV content
            const headers = ['Name', 'SKU', 'Category', 'Stock', 'Min Level', 'Price', 'Status', 'Last Updated'];
            const csvContent = [
                headers.join(','),
                ...products.map(p => [
                    `"${p.name}"`,
                    p.sku,
                    p.category,
                    p.stock,
                    p.minLevel,
                    p.price,
                    p.status,
                    `"${p.updated}"`
                ].join(','))
            ].join('\n');
            
            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            console.log(`Exported ${products.length} products to CSV`);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed. Please try again.');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.textContent = 'Export';
            }
        }
    },
    
    // Update summary statistics
    updateSummaryStats() {
        console.log('Updating summary statistics');
        
        // Get all products and calculate stats
        const allProducts = this.currentProducts;
        const goodStockCount = allProducts.filter(p => p.status === 'good').length;
        const warningStockCount = allProducts.filter(p => p.status === 'warning').length;
        const criticalStockCount = allProducts.filter(p => p.status === 'critical').length;
        
        // Update the summary stats elements
        const totalProductsEl = document.getElementById('totalProducts');
        const goodStockEl = document.getElementById('goodStock');
        const lowStockEl = document.getElementById('lowStock');
        const criticalAlertsEl = document.getElementById('criticalAlerts');
        
        if (totalProductsEl) totalProductsEl.textContent = allProducts.length;
        if (goodStockEl) goodStockEl.textContent = goodStockCount;
        if (lowStockEl) lowStockEl.textContent = warningStockCount;
        if (criticalAlertsEl) criticalAlertsEl.textContent = criticalStockCount;
        
        console.log(`Stats updated: ${allProducts.length} total, ${goodStockCount} good, ${warningStockCount} low, ${criticalStockCount} critical`);
    }
};