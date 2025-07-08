/* ==================== MODULE: record-sale-demo.js ==================== */
/* Demo functionality for Record Sale screen */

const recordSaleDemo = {
    // Store reference and sale items
    selectedStore: null,
    saleItems: [],
    initialized: false,
    
    // Initialize the screen
    init() {
        console.log('Record Sale screen initialized');
        
        // Get store context from sessionStorage
        const storeContext = sessionStorage.getItem('selectedStore');
        if (storeContext) {
            this.selectedStore = JSON.parse(storeContext);
            console.log('Store context loaded:', this.selectedStore.name);
            
            // Update store name in UI
            const storeNameElement = document.getElementById('sale-store-name');
            const storeBadgeElement = document.getElementById('sale-store-badge');
            if (storeNameElement) storeNameElement.textContent = this.selectedStore.name;
            if (storeBadgeElement) storeBadgeElement.textContent = this.selectedStore.name;
        }
        
        // Initialize only once to prevent duplicate event listeners
        if (!this.initialized) {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                this.initializeSearch();
                this.initializeEventListeners();
            }, 100);
            this.initialized = true;
        }
        
        // Clear any existing sale items
        this.saleItems = [];
        this.updateSaleTable();
        this.updateSummary();
    },

    // Clear the current sale
    clearSale() {
        console.log('Clearing sale');
        this.saleItems = [];
        this.updateSaleTable();
        this.updateSummary();
    },
    
    // Initialize search functionality
    initializeSearch() {
        const searchInput = document.querySelector('#record-sale .product-search-input');
        
        console.log('Initializing search - Input:', searchInput);
        
        if (!searchInput) {
            console.log('Search input not found!');
            return;
        }
        
        // Create dropdown if it doesn't exist
        let searchDropdown = document.querySelector('#record-sale .search-results-dropdown');
        if (!searchDropdown) {
            const searchControls = document.querySelector('#record-sale .search-controls');
            const dropdown = document.createElement('div');
            dropdown.className = 'search-results-dropdown';
            dropdown.style.display = 'none';
            searchControls.appendChild(dropdown);
        }
        
        // Track selected index
        this.selectedSearchIndex = -1;
        
        // Search input event - live search as user types
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                this.performSearch(query);
                this.selectedSearchIndex = -1;
            } else {
                this.hideSearchResults();
            }
        });
        
        // Keyboard navigation
        searchInput.addEventListener('keydown', (e) => {
            const dropdown = document.querySelector('#record-sale .search-results-dropdown');
            const items = dropdown ? dropdown.querySelectorAll('.search-result-item') : [];
            
            if (items.length === 0 && e.key === 'Enter') return;
            
            switch(e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (dropdown.style.display !== 'none') {
                        this.selectedSearchIndex = Math.min(this.selectedSearchIndex + 1, items.length - 1);
                        this.updateSelectedItem(items);
                    }
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    if (dropdown.style.display !== 'none') {
                        this.selectedSearchIndex = Math.max(this.selectedSearchIndex - 1, -1);
                        this.updateSelectedItem(items);
                    }
                    break;
                    
                case 'Enter':
                    e.preventDefault();
                    if (this.selectedSearchIndex >= 0 && items[this.selectedSearchIndex]) {
                        items[this.selectedSearchIndex].click();
                    }
                    break;
                    
            }
        });
        
        // Click outside to close dropdown
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#record-sale .search-controls')) {
                this.hideSearchResults();
            }
        });
    },
    
    // Update selected item highlighting
    updateSelectedItem(items) {
        items.forEach((item, index) => {
            if (index === this.selectedSearchIndex) {
                item.classList.add('selected');
                // Ensure selected item is visible
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    },
    
    // Initialize event listeners
    initializeEventListeners() {
        // Complete sale button
        const completeSaleBtn = document.querySelector('#record-sale .complete-sale-button');
        if (completeSaleBtn) {
            completeSaleBtn.addEventListener('click', () => this.completeSale());
        }
        
        // Cancel button
        const cancelBtn = document.querySelector('#record-sale .cancel-sale-button');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.cancelSale());
        }
    },
    
    // Perform product search
    performSearch(query) {
        console.log('Performing search for:', query);
        
        if (!this.selectedStore || !this.selectedStore.products) {
            console.log('No store context or products available');
            console.log('Selected store:', this.selectedStore);
            return;
        }
        
        console.log('Searching in', this.selectedStore.products.length, 'products');
        
        const searchResults = this.selectedStore.products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.sku.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
        
        console.log('Found', searchResults.length, 'results');
        this.displaySearchResults(searchResults);
    },
    
    // Display search results
    displaySearchResults(results) {
        const dropdown = document.querySelector('#record-sale .search-results-dropdown');
        console.log('Dropdown element:', dropdown);
        if (!dropdown) {
            console.log('No dropdown element found!');
            return;
        }
        
        if (results.length === 0) {
            dropdown.innerHTML = '<div class="no-results">No products found</div>';
        } else {
            dropdown.innerHTML = results.map(product => `
                <div class="search-result-item" data-sku="${product.sku}">
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-details">
                            <span class="sku">SKU: ${product.sku}</span>
                            <span class="stock">Stock: ${product.stock} units</span>
                        </div>
                    </div>
                    <div class="product-price">£${product.price.toFixed(2)}</div>
                </div>
            `).join('');
            
            // Add click handlers to results
            const allItems = dropdown.querySelectorAll('.search-result-item');
            allItems.forEach((item, index) => {
                item.addEventListener('click', () => {
                    const sku = item.getAttribute('data-sku');
                    const product = this.selectedStore.products.find(p => p.sku === sku);
                    if (product) {
                        this.addProductToSale(product);
                        this.hideSearchResults();
                        document.querySelector('#record-sale .product-search-input').value = '';
                    }
                });
                
                // Update selection on mouse hover
                item.addEventListener('mouseenter', () => {
                    this.selectedSearchIndex = index;
                    this.updateSelectedItem(allItems);
                });
            });
        }
        
        dropdown.style.display = 'block';
    },
    
    // Hide search results
    hideSearchResults() {
        const dropdown = document.querySelector('#record-sale .search-results-dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    },
    
    // Add product to sale
    addProductToSale(product) {
        // Check if product already in sale
        const existingItem = this.saleItems.find(item => item.sku === product.sku);
        
        if (existingItem) {
            // Increment quantity if not exceeding stock
            if (existingItem.quantity < product.stock) {
                existingItem.quantity++;
            } else {
                console.log('Cannot add more - insufficient stock');
            }
        } else {
            // Add new item
            this.saleItems.push({
                ...product,
                quantity: 1
            });
        }
        
        this.updateSaleTable();
        this.updateSummary();
    },
    
    // Update sale table
    updateSaleTable() {
        const tbody = document.querySelector('#record-sale .sale-items-table tbody');
        if (!tbody) return;
        
        if (this.saleItems.length === 0) {
            tbody.innerHTML = `
                <tr class="empty-state">
                    <td colspan="7">No items added to sale yet. Search for products above.</td>
                </tr>
            `;
        } else {
            tbody.innerHTML = this.saleItems.map((item, index) => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.sku}</td>
                    <td>${item.stock} units</td>
                    <td>£${item.price.toFixed(2)}</td>
                    <td>
                        <div class="quantity-controls">
                            <button class="qty-decrease" data-index="${index}">-</button>
                            <input type="text" class="qty-input" value="${item.quantity}" 
                                   data-index="${index}">
                            <button class="qty-increase" data-index="${index}">+</button>
                        </div>
                    </td>
                    <td>£${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                        <button class="remove-item" data-index="${index}">Remove</button>
                    </td>
                </tr>
            `).join('');
            
            // Add quantity control event listeners
            tbody.querySelectorAll('.qty-decrease').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    this.decreaseQuantity(index);
                });
            });
            
            tbody.querySelectorAll('.qty-increase').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    this.increaseQuantity(index);
                });
            });
            
            tbody.querySelectorAll('.qty-input').forEach(input => {
                input.addEventListener('input', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    // Remove non-digits from input
                    const cleanValue = e.target.value.replace(/[^\d]/g, '');
                    e.target.value = cleanValue;
                    
                    const quantity = parseInt(cleanValue) || 0;
                    
                    if (quantity > 0 && quantity <= this.saleItems[index].stock) {
                        this.saleItems[index].quantity = quantity;
                        this.updateSummary();
                        this.updateStockImpactPreview();
                    } else if (quantity > this.saleItems[index].stock) {
                        // Limit to available stock
                        e.target.value = this.saleItems[index].stock;
                        this.saleItems[index].quantity = this.saleItems[index].stock;
                        this.updateSummary();
                        this.updateStockImpactPreview();
                    } else if (cleanValue === '') {
                        // Allow empty during typing
                        this.saleItems[index].quantity = 1;
                    }
                });
                
                // Restore value on blur if empty
                input.addEventListener('blur', (e) => {
                    if (e.target.value === '') {
                        const index = parseInt(e.target.dataset.index);
                        e.target.value = this.saleItems[index].quantity;
                        this.updateSummary();
                    }
                });
            });
            
            tbody.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    this.removeItem(index);
                });
            });
        }
    },
    
    // Update summary
    updateSummary() {
        const subtotal = this.saleItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const vat = subtotal * 0.20;
        const total = subtotal + vat;
        
        // Update summary bar
        document.querySelector('#record-sale .subtotal-amount').textContent = `£${subtotal.toFixed(2)}`;
        document.querySelector('#record-sale .vat-amount').textContent = `£${vat.toFixed(2)}`;
        document.querySelector('#record-sale .total-amount').textContent = `£${total.toFixed(2)}`;
        
        // Enable/disable complete sale button
        const completeSaleBtn = document.querySelector('#record-sale .complete-sale-button');
        if (completeSaleBtn) {
            completeSaleBtn.disabled = this.saleItems.length === 0;
        }
        
        // Update stock impact preview
        this.updateStockImpactPreview();
    },
    
    // Update stock impact preview
    updateStockImpactPreview() {
        const previewContent = document.querySelector('#record-sale .stock-impact-preview .preview-content');
        if (!previewContent) return;
        
        if (this.saleItems.length === 0) {
            previewContent.innerHTML = '<p class="preview-message">Add items to see stock impact</p>';
        } else {
            previewContent.innerHTML = `
                <div class="impact-summary">
                    <h4>Stock Changes:</h4>
                    ${this.saleItems.map(item => `
                        <div class="impact-item">
                            <span>${item.name}</span>
                            <span class="impact-change">-${item.quantity} units</span>
                            <span class="new-stock">(${item.stock - item.quantity} remaining)</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    },
    
    // Quantity management
    decreaseQuantity(index) {
        if (this.saleItems[index].quantity > 1) {
            this.saleItems[index].quantity--;
            this.updateSaleTable();
            this.updateSummary();
        }
    },
    
    increaseQuantity(index) {
        const item = this.saleItems[index];
        if (item.quantity < item.stock) {
            item.quantity++;
            this.updateSaleTable();
            this.updateSummary();
        }
    },
    
    removeItem(index) {
        this.saleItems.splice(index, 1);
        this.updateSaleTable();
        this.updateSummary();
    },
    
    // Complete sale
    completeSale() {
        console.log('Completing sale:', this.saleItems);
        // In a real app, this would update the backend
        alert('Sale completed successfully!');
        this.clearSale();
    },
    
    // Cancel sale
    cancelSale() {
        if (this.saleItems.length > 0) {
            if (confirm('Cancel this sale? All items will be removed.')) {
                this.clearSale();
                navigateTo('inventory');
            }
        } else {
            // Navigate back to inventory
            console.log('Cancelling sale');
            navigateTo('inventory');
        }
    }
};

// Make available globally
window.recordSaleDemo = recordSaleDemo;