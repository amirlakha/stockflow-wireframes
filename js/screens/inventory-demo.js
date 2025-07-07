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
    
    // Search and filter state
    searchTerm: '',
    categoryFilter: 'all',
    stockLevelFilter: 'all',
    
    // Sorting state
    sortColumn: 'name',
    sortDirection: 'asc',
    
    // Pagination state
    itemsPerPage: 10,
    
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
        
        if (!this.isPreviewMode) {
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
        } else {
            alert('Demo: Normal Inventory Mix\n\nShowing balanced stock levels with good/warning/critical items mixed.');
        }
    },
    
    showCriticalAlerts() {
        console.log('Demo: Highlighting critical stock alerts');
        
        if (!this.isPreviewMode) {
            // Set stock level filter to show critical items
            this.stockLevelFilter = 'critical';
            this.currentPage = 1;
            
            // Update the stock level dropdown
            const stockSelect = document.getElementById('stockLevelFilter');
            if (stockSelect) stockSelect.value = 'critical';
            
            this.updateProductTable();
            
            // Show a brief notification
            const count = this.getFilteredProducts().length;
            console.log(`Showing ${count} critical stock items`);
        } else {
            alert('Demo: Critical Alerts Focus\n\nFiltering to show only products with low stock warnings.');
        }
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
        
        // Update the table if in functional mode
        if (!this.isPreviewMode) {
            this.currentPage = 1; // Reset to first page
            this.updateProductTable();
        } else {
            alert('Demo: Large Inventory Dataset\n\nSimulating 50 products to demonstrate pagination functionality.');
        }
    },
    
    simulateStockUpdate() {
        console.log('Demo: Simulating real-time stock level changes');
        
        if (!this.isPreviewMode) {
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
            
            console.log(`Stock update complete: ${updateCount} products updated`);
        } else {
            alert('Demo: Live Stock Updates\n\nSimulating real-time inventory changes with random stock adjustments.');
        }
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
            
            console.log(`Updated table with ${products.length} products`);
            
            // Update pagination controls
            this.generatePagination();
        } catch (error) {
            console.error('Error updating product table:', error);
        }
    },
    
    handleSearch(searchTerm) {
        console.log(`Filtering products by search term: ${searchTerm}`);
        
        if (this.isPreviewMode) return; // Don't search in preview mode
        
        // Update search term
        this.searchTerm = searchTerm.toLowerCase().trim();
        
        // Reset to first page when filtering
        this.currentPage = 1;
        
        // Update the table with filtered results
        this.updateProductTable();
    },
    
    handleSort(column) {
        console.log(`Sorting products by column: ${column}`);
        
        if (this.isPreviewMode) return;
        
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
    
    filterProducts(criteria) {
        console.log(`Applying filter criteria: ${criteria}`);
        // Phase 3: Filter products based on category, status, etc.
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
        
        if (!paginationInfo || !paginationControls || this.isPreviewMode) {
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
        
        if (this.isPreviewMode) return;
        
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
            if (this.isPreviewMode) return;
            
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
            if (this.isPreviewMode) return;
            
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
                if (this.isPreviewMode) return;
                
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
        console.log('Record Sale clicked');
        alert('Record Sale\n\nThis would open a dialog to record a sale transaction.\n\nFeatures:\n• Product selection\n• Quantity input\n• Customer details\n• Payment processing');
    },
    
    handleAddStock() {
        console.log('Add Stock clicked');
        alert('Add Stock\n\nThis would open a dialog to add new stock.\n\nFeatures:\n• Product selection\n• Quantity to add\n• Supplier info\n• Update inventory levels');
    },
    
    handleAdjustStock() {
        console.log('Adjust Stock clicked');
        alert('Adjust Stock\n\nThis would open a dialog for stock adjustments.\n\nFeatures:\n• Select products\n• Adjust quantities\n• Add reason for adjustment\n• Track adjustment history');
    },
    
    handleExport() {
        console.log('Export clicked');
        
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
                
                // Initialize search and filter functionality
                this.initializeSearch();
                this.initializeCategoryFilter();
                this.initializeStockLevelFilter();
                this.initializeSorting();
                this.initializeQuickActions();
                
                // Update the product table
                this.updateProductTable();
            }
        } else {
            console.error('Could not find preview or functional containers');
        }
    }
};