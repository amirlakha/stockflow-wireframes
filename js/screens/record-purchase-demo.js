/* ==================== MODULE: record-purchase-demo.js ==================== */
/* Demo functionality for Record Purchase screen */

const recordPurchaseDemo = {
    // Store reference and purchase items
    selectedStore: null,
    purchaseItems: [],
    nextItemId: 1,
    initialized: false,
    
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
        
        // Initialize only once to prevent duplicate event listeners
        if (!this.initialized) {
            setTimeout(() => {
                this.initializeEventListeners();
            }, 100);
            this.initialized = true;
        }
        
        // Try to restore draft purchase
        this.restoreDraft();
    },
    
    // Restore draft purchase from sessionStorage
    restoreDraft() {
        const draftKey = `draft_purchase_${this.selectedStore ? this.selectedStore.id : 'default'}`;
        const draftData = sessionStorage.getItem(draftKey);
        
        if (draftData) {
            try {
                const draft = JSON.parse(draftData);
                this.purchaseItems = draft.items || [];
                this.nextItemId = draft.nextItemId || 1;
                
                // Restore purchase details
                if (draft.supplier) document.querySelector('#record-purchase .supplier-input').value = draft.supplier;
                if (draft.invoice) document.querySelector('#record-purchase .invoice-input').value = draft.invoice;
                if (draft.deliveryDate) document.querySelector('#record-purchase .delivery-date-input').value = draft.deliveryDate;
                if (draft.notes) {
                    const notesTextarea = document.querySelector('#record-purchase .purchase-notes textarea');
                    if (notesTextarea) notesTextarea.value = draft.notes;
                }
                
                console.log('Draft purchase restored:', this.purchaseItems.length, 'items');
            } catch (e) {
                console.error('Error restoring draft:', e);
                this.purchaseItems = [];
                this.nextItemId = 1;
            }
        } else {
            this.purchaseItems = [];
            this.nextItemId = 1;
        }
        
        this.updatePurchaseTable();
        this.updateSummary();
    },
    
    // Save draft purchase to sessionStorage
    saveDraft() {
        const draftKey = `draft_purchase_${this.selectedStore ? this.selectedStore.id : 'default'}`;
        
        const draft = {
            items: this.purchaseItems,
            nextItemId: this.nextItemId,
            supplier: document.querySelector('#record-purchase .supplier-input').value,
            invoice: document.querySelector('#record-purchase .invoice-input').value,
            deliveryDate: document.querySelector('#record-purchase .delivery-date-input').value,
            notes: document.querySelector('#record-purchase .purchase-notes textarea')?.value || '',
            timestamp: new Date().toISOString()
        };
        
        sessionStorage.setItem(draftKey, JSON.stringify(draft));
        console.log('Draft purchase saved');
    },
    
    // Clear draft from sessionStorage
    clearDraft() {
        const draftKey = `draft_purchase_${this.selectedStore ? this.selectedStore.id : 'default'}`;
        sessionStorage.removeItem(draftKey);
        console.log('Draft purchase cleared');
    },

    // Clear the current purchase
    clearPurchase() {
        console.log('Clearing purchase');
        this.purchaseItems = [];
        this.nextItemId = 1;
        this.updatePurchaseTable();
        this.updateSummary();
        this.saveDraft();
        this.clearDraft();
        
        // Clear input fields
        document.querySelector('#record-purchase .supplier-input').value = '';
        document.querySelector('#record-purchase .invoice-input').value = '';
        document.querySelector('#record-purchase .delivery-date-input').value = '';
        const notesTextarea = document.querySelector('#record-purchase .purchase-notes textarea');
        if (notesTextarea) notesTextarea.value = '';
    },
    
    // Initialize event listeners
    initializeEventListeners() {
        console.log('Initializing Record Purchase event listeners');
        
        // Initialize search functionality
        this.initializeSearch();
        
        // Complete purchase button
        const completePurchaseBtn = document.querySelector('#record-purchase .complete-purchase-button');
        if (completePurchaseBtn) {
            completePurchaseBtn.addEventListener('click', () => this.completePurchase());
        }
        
        // Cancel button
        const cancelBtn = document.querySelector('#record-purchase .cancel-purchase-button');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.cancelPurchase());
        }
        
        // Purchase detail inputs - save draft on change
        const supplierInput = document.querySelector('#record-purchase .supplier-input');
        const invoiceInput = document.querySelector('#record-purchase .invoice-input');
        const deliveryDateInput = document.querySelector('#record-purchase .delivery-date-input');
        const notesTextarea = document.querySelector('#record-purchase .purchase-notes textarea');
        
        [supplierInput, invoiceInput, deliveryDateInput, notesTextarea].forEach(input => {
            if (input) {
                input.addEventListener('input', () => this.saveDraft());
            }
        });
    },
    
    // Initialize search functionality
    initializeSearch() {
        const searchInput = document.querySelector('#record-purchase .product-search-input');
        
        if (!searchInput) return;
        
        // Create dropdown if it doesn't exist
        let searchDropdown = document.querySelector('#record-purchase .search-results-dropdown');
        if (!searchDropdown) {
            const searchControls = document.querySelector('#record-purchase .search-controls');
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
            const dropdown = document.querySelector('#record-purchase .search-results-dropdown');
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
            if (!e.target.closest('#record-purchase .search-controls')) {
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
    
    // Perform product search
    performSearch(query) {
        if (!this.selectedStore || !this.selectedStore.products) {
            console.log('No store context or products available');
            return;
        }
        
        const searchResults = this.selectedStore.products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.sku.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
        
        this.displaySearchResults(searchResults);
    },
    
    // Display search results
    displaySearchResults(results) {
        const dropdown = document.querySelector('#record-purchase .search-results-dropdown');
        if (!dropdown) return;
        
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
                        this.addProductToPurchase(product);
                        this.hideSearchResults();
                        document.querySelector('#record-purchase .product-search-input').value = '';
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
        const dropdown = document.querySelector('#record-purchase .search-results-dropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    },
    
    // Add product to purchase
    addProductToPurchase(product) {
        // Check if product already in purchase
        const existingItem = this.purchaseItems.find(item => item.product && item.product.sku === product.sku);
        
        if (existingItem) {
            // Increment quantity
            existingItem.quantity++;
        } else {
            // Add new item
            const newItem = {
                id: this.nextItemId++,
                product: product,
                quantity: 1,
                unitCost: product.price // Default to current price
            };
            this.purchaseItems.push(newItem);
        }
        
        this.updatePurchaseTable();
        this.updateSummary();
        this.saveDraft();
    },
    
    // Update purchase table
    updatePurchaseTable() {
        const tbody = document.querySelector('#record-purchase .purchase-items-table tbody');
        console.log('Purchase table tbody:', tbody);
        if (!tbody) {
            console.log('No tbody found!');
            return;
        }
        
        if (this.purchaseItems.length === 0) {
            tbody.innerHTML = `
                <tr class="empty-state">
                    <td colspan="7">No items added yet. Search for products above.</td>
                </tr>
            `;
        } else {
            tbody.innerHTML = this.purchaseItems.map((item, index) => `
                <tr>
                    <td>${item.product.name}</td>
                    <td>${item.product.sku}</td>
                    <td>${item.product.stock} units</td>
                    <td>
                        <div class="quantity-controls">
                            <button class="qty-decrease" data-index="${index}">-</button>
                            <input type="text" class="qty-input" value="${item.quantity}" 
                                   data-index="${index}">
                            <button class="qty-increase" data-index="${index}">+</button>
                        </div>
                    </td>
                    <td>
                        <input type="text" class="cost-input" value="${item.unitCost.toFixed(2)}" 
                               data-index="${index}" placeholder="0.00">
                    </td>
                    <td class="subtotal-cell">£${(item.quantity * item.unitCost).toFixed(2)}</td>
                    <td>
                        <button class="remove-item" data-index="${index}">Remove</button>
                    </td>
                </tr>
            `).join('');
            
            // Add event listeners for all controls
            this.attachTableEventListeners();
        }
    },
    
    // Attach event listeners to table controls
    attachTableEventListeners() {
        
        // Quantity controls
        document.querySelectorAll('#record-purchase .qty-decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.decreaseQuantity(index);
            });
        });
        
        document.querySelectorAll('#record-purchase .qty-increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.increaseQuantity(index);
            });
        });
        
        document.querySelectorAll('#record-purchase .qty-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const index = parseInt(e.target.dataset.index);
                // Remove non-digits from input
                const cleanValue = e.target.value.replace(/[^\d]/g, '');
                e.target.value = cleanValue;
                
                const quantity = parseInt(cleanValue) || 0;
                
                if (quantity > 0) {
                    this.purchaseItems[index].quantity = quantity;
                    // Update only the subtotal cell, not the whole table
                    const row = e.target.closest('tr');
                    const subtotalCell = row.querySelector('.subtotal-cell');
                    if (subtotalCell) {
                        subtotalCell.textContent = `£${(this.purchaseItems[index].quantity * this.purchaseItems[index].unitCost).toFixed(2)}`;
                    }
                    this.updateSummary();
                    this.updateStockUpdatePreview();
                    this.saveDraft();
                } else if (cleanValue === '') {
                    // Allow empty during typing
                    this.purchaseItems[index].quantity = 1;
                }
            });
            
            // Restore value on blur if empty
            input.addEventListener('blur', (e) => {
                if (e.target.value === '') {
                    const index = parseInt(e.target.dataset.index);
                    e.target.value = this.purchaseItems[index].quantity;
                    const row = e.target.closest('tr');
                    const subtotalCell = row.querySelector('.subtotal-cell');
                    if (subtotalCell) {
                        subtotalCell.textContent = `£${(this.purchaseItems[index].quantity * this.purchaseItems[index].unitCost).toFixed(2)}`;
                    }
                    this.updateSummary();
                }
            });
        });
        
        // Unit cost input
        document.querySelectorAll('#record-purchase .cost-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const index = parseInt(e.target.dataset.index);
                // Allow digits and decimal point
                const value = e.target.value;
                const cleanValue = value.replace(/[^\d.]/g, '');
                
                // Only update if value changed
                if (value !== cleanValue) {
                    e.target.value = cleanValue;
                }
                
                // Validate decimal format
                const parts = cleanValue.split('.');
                if (parts.length > 2) {
                    // Multiple decimal points, keep only first
                    e.target.value = parts[0] + '.' + parts[1];
                    return;
                }
                
                const cost = parseFloat(cleanValue) || 0;
                this.purchaseItems[index].unitCost = cost;
                
                // Update only the subtotal cell, not the whole table
                const row = e.target.closest('tr');
                const subtotalCell = row.querySelector('.subtotal-cell');
                if (subtotalCell) {
                    subtotalCell.textContent = `£${(this.purchaseItems[index].quantity * cost).toFixed(2)}`;
                }
                this.updateSummary();
                this.saveDraft();
            });
            
            // Format on blur
            input.addEventListener('blur', (e) => {
                const index = parseInt(e.target.dataset.index);
                const cost = this.purchaseItems[index].unitCost;
                e.target.value = cost.toFixed(2);
            });
        });
        
        // Remove item
        document.querySelectorAll('#record-purchase .remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.removeItem(index);
            });
        });
    },
    
    
    // Quantity management
    decreaseQuantity(index) {
        if (this.purchaseItems[index].quantity > 1) {
            this.purchaseItems[index].quantity--;
            this.updatePurchaseTable();
            this.updateSummary();
        }
    },
    
    increaseQuantity(index) {
        this.purchaseItems[index].quantity++;
        this.updatePurchaseTable();
        this.updateSummary();
        this.saveDraft();
    },
    
    updateQuantity(index, quantity) {
        this.purchaseItems[index].quantity = Math.max(1, quantity);
        this.updatePurchaseTable();
        this.updateSummary();
        this.saveDraft();
    },
    
    updateUnitCost(index, cost) {
        this.purchaseItems[index].unitCost = Math.max(0, cost);
        this.updatePurchaseTable();
        this.updateSummary();
        this.saveDraft();
    },
    
    removeItem(index) {
        this.purchaseItems.splice(index, 1);
        this.updatePurchaseTable();
        this.updateSummary();
        this.saveDraft();
    },
    
    // Update summary
    updateSummary() {
        const totalItems = this.purchaseItems.filter(item => item.product).length;
        const totalUnits = this.purchaseItems.reduce((sum, item) => sum + (item.product ? item.quantity : 0), 0);
        const totalCost = this.purchaseItems.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
        
        // Update summary bar
        document.querySelector('#record-purchase .total-items').textContent = `${totalUnits} units`;
        document.querySelector('#record-purchase .total-cost').textContent = `£${totalCost.toFixed(2)}`;
        
        // Enable/disable complete purchase button
        const completePurchaseBtn = document.querySelector('#record-purchase .complete-purchase-button');
        if (completePurchaseBtn) {
            completePurchaseBtn.disabled = totalItems === 0;
        }
        
        // Update stock update preview
        this.updateStockUpdatePreview();
    },
    
    // Update stock update preview
    updateStockUpdatePreview() {
        const previewContent = document.querySelector('#record-purchase .stock-update-preview .preview-content');
        if (!previewContent) return;
        
        const validItems = this.purchaseItems.filter(item => item.product);
        
        if (validItems.length === 0) {
            previewContent.innerHTML = '<p class="preview-message">Add items to see stock update</p>';
        } else {
            previewContent.innerHTML = `
                <div class="update-summary">
                    <h4>Stock Updates:</h4>
                    ${validItems.map(item => `
                        <div class="update-item">
                            <span>${item.product.name}</span>
                            <span class="update-change">+${item.quantity} units</span>
                            <span class="new-stock">(${item.product.stock + item.quantity} total)</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    },
    
    
    // Complete purchase
    completePurchase() {
        const supplier = document.querySelector('#record-purchase .supplier-input').value;
        const invoice = document.querySelector('#record-purchase .invoice-input').value;
        const date = document.querySelector('#record-purchase .delivery-date-input').value;
        
        // Validation checks
        const errors = this.validatePurchase();
        if (errors.length > 0) {
            this.showValidationErrors(errors);
            return;
        }
        
        // Calculate total
        const total = this.purchaseItems.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
        
        // Show confirmation with purchase details
        const confirmMessage = `Complete this purchase?\n\nSupplier: ${supplier || 'Not specified'}\nItems: ${this.purchaseItems.filter(item => item.product).length}\nTotal Cost: £${total.toFixed(2)}`;
        
        if (!confirm(confirmMessage)) {
            return;
        }
        
        console.log('Completing purchase:', {
            supplier,
            invoice,
            date,
            items: this.purchaseItems.filter(item => item.product)
        });
        
        // Update inventory quantities
        this.updateInventoryQuantities();
        
        alert('Purchase recorded successfully!');
        this.clearPurchase();
        
        // Navigate back to inventory
        navigateTo('inventory');
    },
    
    // Validate purchase before completion
    validatePurchase() {
        const errors = [];
        
        // Check if there are items
        const validItems = this.purchaseItems.filter(item => item.product);
        if (validItems.length === 0) {
            errors.push('No items added to purchase');
        }
        
        // Check for zero quantities
        const zeroQuantityItems = validItems.filter(item => item.quantity === 0);
        if (zeroQuantityItems.length > 0) {
            errors.push('Some items have zero quantity');
        }
        
        // Check for zero costs
        const zeroCostItems = validItems.filter(item => item.unitCost === 0);
        if (zeroCostItems.length > 0) {
            errors.push('Some items have zero unit cost');
        }
        
        // Check if delivery date is in the future
        const deliveryDate = document.querySelector('#record-purchase .delivery-date-input').value;
        if (deliveryDate) {
            const selectedDate = new Date(deliveryDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate > today) {
                errors.push('Delivery date cannot be in the future');
            }
        }
        
        return errors;
    },
    
    // Show validation errors
    showValidationErrors(errors) {
        const errorMessage = 'Cannot complete purchase:\n\n' + errors.map(e => '• ' + e).join('\n');
        alert(errorMessage);
    },
    
    // Update inventory quantities after purchase
    updateInventoryQuantities() {
        if (!this.selectedStore) {
            console.error('No store selected');
            return;
        }
        
        // Get current store data from sessionStorage
        const storeData = sessionStorage.getItem('selectedStore');
        if (!storeData) {
            console.error('No store data in sessionStorage');
            return;
        }
        
        const store = JSON.parse(storeData);
        
        // Update quantities for each purchased item
        this.purchaseItems.filter(item => item.product).forEach(purchaseItem => {
            const productIndex = store.products.findIndex(p => p.sku === purchaseItem.product.sku);
            if (productIndex !== -1) {
                // Increase the stock quantity
                store.products[productIndex].stock += purchaseItem.quantity;
                
                // Update status based on new stock level
                const newStock = store.products[productIndex].stock;
                if (newStock <= 5) {
                    store.products[productIndex].status = 'critical';
                } else if (newStock <= 20) {
                    store.products[productIndex].status = 'warning';
                } else {
                    store.products[productIndex].status = 'good';
                }
                
                console.log(`Updated ${purchaseItem.product.name}: ${purchaseItem.product.stock} -> ${newStock}`);
            }
        });
        
        // Save updated store data back to sessionStorage
        sessionStorage.setItem('selectedStore', JSON.stringify(store));
        console.log('Inventory updated in sessionStorage');
        
        // Trigger inventory refresh flag
        sessionStorage.setItem('inventoryNeedsRefresh', 'true');
    },
    
    // Cancel purchase
    cancelPurchase() {
        if (this.purchaseItems.length > 0) {
            if (confirm('Cancel this purchase? All items will be removed.')) {
                this.clearPurchase();
                navigateTo('inventory');
            }
        } else {
            console.log('Cancelling purchase');
            navigateTo('inventory');
        }
    }
};

// Make available globally
window.recordPurchaseDemo = recordPurchaseDemo;