/* ==================== MODULE: screens/inventory-demo.js ==================== */
/* Inventory Overview screen demo controls and functionality - Phase 2 */

const inventoryDemoControls = {
    // Current state
    currentProducts: [],
    currentStore: 'oxford-street',
    currentFilter: 'all',
    currentSort: 'name',
    currentPage: 1,
    
    // Toggle mode for Phase 3
    isPreviewMode: true,
    
    // Search state
    searchTerm: '',
    
    // Sample product data
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
        // Phase 3: Will update product table display
        alert('Demo: Normal Inventory Mix\n\nShowing balanced stock levels with good/warning/critical items mixed.');
    },
    
    showCriticalAlerts() {
        console.log('Demo: Highlighting critical stock alerts');
        // Filter to show more critical items
        this.currentProducts = this.sampleProducts.filter(p => p.status === 'critical' || p.status === 'warning');
        // Phase 3: Will emphasize low stock items in table
        alert('Demo: Critical Alerts Focus\n\nFiltering to show only products with low stock warnings.');
    },
    
    showLargeInventory() {
        console.log('Demo: Demonstrating pagination with large dataset');
        // Simulate larger dataset
        const expandedProducts = [];
        for (let i = 0; i < 50; i++) {
            const baseProduct = this.sampleProducts[i % this.sampleProducts.length];
            expandedProducts.push({
                ...baseProduct,
                id: i + 1,
                name: `${baseProduct.name} (Variant ${i + 1})`,
                sku: `${baseProduct.sku}-${String(i + 1).padStart(3, '0')}`
            });
        }
        this.currentProducts = expandedProducts;
        // Phase 3: Will demonstrate pagination controls
        alert('Demo: Large Inventory Dataset\n\nSimulating 50 products to demonstrate pagination functionality.');
    },
    
    simulateStockUpdate() {
        console.log('Demo: Simulating real-time stock level changes');
        // Randomly update some stock levels
        this.currentProducts.forEach(product => {
            if (Math.random() < 0.3) { // 30% chance to update
                const change = Math.floor(Math.random() * 10) - 5; // -5 to +5
                product.stock = Math.max(0, product.stock + change);
                product.status = product.stock <= product.minLevel ? 
                    (product.stock <= product.minLevel * 0.5 ? 'critical' : 'warning') : 'good';
                product.updated = 'just now';
            }
        });
        // Phase 3: Will refresh table with updated values
        alert('Demo: Live Stock Updates\n\nSimulating real-time inventory changes with random stock adjustments.');
    },

    // Utility functions (ready for Phase 3)
    initializeInventory() {
        console.log('Initializing inventory display');
        this.currentProducts = this.sampleProducts.slice();
        // Phase 3: Set up initial inventory display
    },
    
    updateProductTable() {
        console.log('Refreshing product table with current data');
        
        // Check if we're in functional mode and table exists
        const tableBody = document.getElementById('productTableBody');
        if (!tableBody || this.isPreviewMode) {
            console.log('Table update skipped - not in functional mode or table not found');
            return;
        }
        
        try {
            // Filter products based on search term
            let products = this.currentProducts;
            
            if (this.searchTerm) {
                products = products.filter(product => 
                    product.name.toLowerCase().includes(this.searchTerm) ||
                    product.sku.toLowerCase().includes(this.searchTerm) ||
                    (product.category && product.category.toLowerCase().includes(this.searchTerm))
                );
            }
            
            // Build table rows HTML
            const rowsHTML = products.map(product => {
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
            
            console.log(`Updated table with ${products.length} products`);
        } catch (error) {
            console.error('Error updating product table:', error);
        }
    },
    
    handleSearch(searchTerm) {
        console.log(`Filtering products by search term: ${searchTerm}`);
        
        if (this.isPreviewMode) return; // Don't search in preview mode
        
        // Update search term
        this.searchTerm = searchTerm.toLowerCase().trim();
        
        // Update the table with filtered results
        this.updateProductTable();
    },
    
    handleSort(column) {
        console.log(`Sorting products by column: ${column}`);
        // Phase 3: Sort products by specified column
    },
    
    filterProducts(criteria) {
        console.log(`Applying filter criteria: ${criteria}`);
        // Phase 3: Filter products based on category, status, etc.
    },
    
    generatePagination() {
        console.log('Generating pagination controls');
        // Phase 3: Create pagination controls for large datasets
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
    
    // Toggle between preview and functional modes
    togglePreviewMode() {
        this.isPreviewMode = !this.isPreviewMode;
        console.log(`Inventory mode switched to: ${this.isPreviewMode ? 'Preview' : 'Functional'}`);
        
        // Get the containers
        const previewDiv = document.querySelector('.inventory-in-progress');
        const functionalDiv = document.querySelector('.inventory-functional');
        const modeIndicator = document.getElementById('modeIndicator');
        
        if (previewDiv && functionalDiv) {
            if (this.isPreviewMode) {
                // Show preview, hide functional
                previewDiv.style.display = 'block';
                functionalDiv.style.display = 'none';
                if (modeIndicator) {
                    modeIndicator.textContent = 'Preview Mode';
                    modeIndicator.style.color = '#0066cc';
                }
            } else {
                // Hide preview, show functional
                previewDiv.style.display = 'none';
                functionalDiv.style.display = 'block';
                if (modeIndicator) {
                    modeIndicator.textContent = 'Functional Mode';
                    modeIndicator.style.color = '#28a745';
                }
                
                // Initialize inventory if switching to functional mode
                if (this.currentProducts.length === 0) {
                    this.initializeInventory();
                }
                
                // Initialize search functionality
                this.initializeSearch();
                
                // Update the product table
                this.updateProductTable();
            }
        } else {
            console.error('Could not find preview or functional containers');
        }
    }
};