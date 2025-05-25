// --- Global State ---
let currentOrder = {
    items: [], customerName: '', customerAddress: '', customerPhone: '',
    orderType: 'Take-away', deliveryPersonId: null,
    subtotal: 0, taxAmount: 0, totalAmount: 0,
};
let menuData = { categories: [], items: [] };
let settings = { taxRate: 0, currencySymbol: '$', deliveryPersonnel: [], restaurantName: "POS Loading..." };
let selectedCategoryId = null;
let adminMenuData = null;
let currentAdminTab = 'general-settings-content';
let currentMenuMgmSubTab = 'menu-mgm-items-content';
let currentEditingCategoryId = null;
let currentEditingItemId = null;

// --- DOM Elements ---
const categoryTabsContainer = document.getElementById('category-tabs-container');
const menuGrid = document.getElementById('menu-grid');
const orderItemsList = document.getElementById('order-items-list');
const subtotalAmountEl = document.getElementById('subtotal-amount');
const taxAmountEl = document.getElementById('tax-amount');
const taxRateDisplayEl = document.getElementById('tax-rate-display');
const totalAmountEl = document.getElementById('total-amount');
const restaurantNameEl = document.getElementById('restaurant-name');
const deliveryPersonSelect = document.getElementById('delivery-person');
const customerNameInput = document.getElementById('customer-name');
const customerAddressInput = document.getElementById('customer-address');
const customerPhoneInput = document.getElementById('customer-phone');
const deliveryFieldsDiv = document.getElementById('delivery-fields');
const orderTypeRadios = document.querySelectorAll('input[name="orderType"]');
const clearOrderBtn = document.getElementById('clear-order-btn');
const completeOrderBtn = document.getElementById('complete-order-btn');
const currentDatetimeEl = document.getElementById('current-datetime');
const viewDailySalesBtn = document.getElementById('view-daily-sales-btn');
const addItemModal = document.getElementById('add-item-modal');
const modalItemNameEl = document.getElementById('modal-item-name');
const modalMenuItemIdInput = document.getElementById('modal-menu-item-id');
const modalQuantityInput = document.getElementById('modal-quantity');
const modalSpecialNoteInput = document.getElementById('modal-special-note');
const modalAddToOrderBtn = document.getElementById('modal-add-to-order-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const salesReportModal = document.getElementById('sales-report-modal');
const reportDateEl = document.getElementById('report-date');
const reportOrdersCountEl = document.getElementById('report-orders-count');
const reportTotalSalesEl = document.getElementById('report-total-sales');
const reportCloseBtn = document.getElementById('report-close-btn');
const viewOrdersBtn = document.getElementById('view-orders-btn');
const viewOrdersModal = document.getElementById('view-orders-modal');
const ordersModalCloseBtn = document.getElementById('orders-modal-close-btn');
const ordersListContainer = document.getElementById('orders-list-container');
const orderDetailView = document.getElementById('order-detail-view');
const settingsCog = document.getElementById('settings-cog');
const adminSettingsModal = document.getElementById('admin-settings-modal');
const settingsModalCloseBtn = document.getElementById('settings-modal-close-btn');
const tabGeneralSettings = document.getElementById('tab-general-settings');
const tabMenuManagement = document.getElementById('tab-menu-management');
const generalSettingsContent = document.getElementById('general-settings-content');
const menuManagementContent = document.getElementById('menu-management-content');
const settingRestaurantNameInput = document.getElementById('setting-restaurant-name');
const settingTaxRateInput = document.getElementById('setting-tax-rate');
const settingCurrencySymbolInput = document.getElementById('setting-currency-symbol');
const deliveryPersonnelListDiv = document.getElementById('delivery-personnel-list');
const newDeliveryPersonNameInput = document.getElementById('new-delivery-person-name');
const addDeliveryPersonBtn = document.getElementById('add-delivery-person-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const menuMgmTabItems = document.getElementById('menu-mgm-tab-items');
const menuMgmTabCategories = document.getElementById('menu-mgm-tab-categories');
const menuMgmItemsContent = document.getElementById('menu-mgm-items-content');
const menuMgmCategoriesContent = document.getElementById('menu-mgm-categories-content');
const menuMgmItemsList = document.getElementById('menu-mgm-items-list');
const menuMgmCategoriesList = document.getElementById('menu-mgm-categories-list');
const menuMgmShowItemFormBtn = document.getElementById('menu-mgm-show-item-form-btn');
const menuMgmShowCategoryFormBtn = document.getElementById('menu-mgm-show-category-form-btn');
const saveMenuChangesBtn = document.getElementById('save-menu-changes-btn');
const menuMgmItemFormContainer = document.getElementById('menu-mgm-item-form-container');
const menuMgmItemFormTitle = document.getElementById('menu-mgm-item-form-title');
const menuMgmItemIdInput = document.getElementById('menu-mgm-item-id-input');
const menuMgmItemNameInput = document.getElementById('menu-mgm-item-name');
const menuMgmItemPriceInput = document.getElementById('menu-mgm-item-price');
const menuMgmItemCategorySelect = document.getElementById('menu-mgm-item-category');
const menuMgmItemImageInput = document.getElementById('menu-mgm-item-image');
const menuMgmItemSaveBtn = document.getElementById('menu-mgm-item-save-btn');
const menuMgmItemCancelBtn = document.getElementById('menu-mgm-item-cancel-btn');
const menuMgmCategoryFormContainer = document.getElementById('menu-mgm-category-form-container');
const menuMgmCategoryFormTitle = document.getElementById('menu-mgm-category-form-title');
const menuMgmCategoryIdInput = document.getElementById('menu-mgm-category-id-input');
const menuMgmCategoryNameInput = document.getElementById('menu-mgm-category-name');
const menuMgmCategorySaveBtn = document.getElementById('menu-mgm-category-save-btn');
const menuMgmCategoryCancelBtn = document.getElementById('menu-mgm-category-cancel-btn');
const viewReportsBtn = document.getElementById('view-reports-btn');
const reportsModal = document.getElementById('reports-modal');
const reportsModalCloseBtn = document.getElementById('reports-modal-close-btn');
const reportTypeSelect = document.getElementById('report-type-select');
const reportDateRangeSelect = document.getElementById('report-date-range-select');
const generateReportBtn = document.getElementById('generate-report-btn');
const reportDisplayArea = document.getElementById('report-display-area');

// --- Utility Functions ---
function formatCurrency(amount) {
    return `${settings.currencySymbol || '$'}${Number(amount || 0).toFixed(2)}`;
}

// --- Main POS UI Update Functions ---
function renderCategories() {
    categoryTabsContainer.innerHTML = '';
    if (!menuData || !menuData.categories || menuData.categories.length === 0) {
        categoryTabsContainer.innerHTML = '<span class="text-slate-500 italic px-2 py-2">No categories found.</span>';
        return;
    }
    menuData.categories.forEach(category => {
        const tab = document.createElement('button');
        tab.className = `px-4 py-2 text-sm font-medium rounded-md focus:outline-none transition-all duration-150 ease-in-out whitespace-nowrap shadow-sm
                     ${category.id === selectedCategoryId
            ? 'bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-1'
            : 'bg-slate-200 text-slate-700 hover:bg-slate-300 hover:text-slate-800'}`;
        tab.textContent = category.name;
        tab.dataset.categoryId = category.id;
        tab.addEventListener('click', () => {
            selectedCategoryId = category.id;
            renderCategories();
            renderMenuItems();
        });
        categoryTabsContainer.appendChild(tab);
    });
}
function renderMenuItems() {
    menuGrid.innerHTML = '';
    if (!selectedCategoryId) {
        menuGrid.innerHTML = '<p class="col-span-full text-slate-500 italic p-4 text-center">Select a category to see items.</p>';
        return;
    }
    const itemsInCategory = menuData.items.filter(item => item.categoryId === selectedCategoryId);
    if (itemsInCategory.length === 0) {
        menuGrid.innerHTML = '<p class="col-span-full text-slate-500 italic p-4 text-center">No items in this category.</p>';
        return;
    }
    itemsInCategory.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item p-3 border border-slate-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-grab bg-white flex flex-col text-center transform hover:-translate-y-1';
        itemDiv.innerHTML = `
      <img src="${item.image || 'assets/images/placeholder_food.png'}" alt="${item.name}" class="w-full h-32 object-cover rounded-lg mb-3 shadow-md">
      <h4 class="text-sm font-semibold text-slate-800 flex-grow mb-1 leading-tight">${item.name}</h4>
      <p class="text-base text-blue-600 font-bold">${formatCurrency(item.price)}</p>
    `;
        itemDiv.draggable = true;
        itemDiv.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('application/json', JSON.stringify(item));
        });
        menuGrid.appendChild(itemDiv);
    });
}
function renderOrder() {
    orderItemsList.innerHTML = '';
    if (currentOrder.items.length === 0) {
        orderItemsList.innerHTML = '<li class="text-slate-400 italic p-3 text-center text-sm">Your order is empty.</li>';
    } else {
        currentOrder.items.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'px-3 py-2.5 border-b border-slate-100 hover:bg-slate-50 text-sm flex justify-between items-start transition-colors duration-100';
            listItem.innerHTML = `
        <div class="flex-grow pr-2">
          <span class="font-semibold text-slate-800 block">${item.name}</span>
          <span class="text-xs text-slate-500">Qty: ${item.quantity} &bull; Price: ${formatCurrency(item.unitPrice * item.quantity)}</span>
          ${item.specialNote ? `<br><small class="text-slate-600 italic text-xs leading-tight block mt-0.5">Note: ${item.specialNote}</small>` : ''}
        </div>
        <div class="space-x-1 flex-shrink-0 flex items-center">
          <button class="edit-item-btn p-1.5 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-blue-300" data-index="${index}" title="Edit item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" /></svg>
          </button>
          <button class="remove-item-btn p-1.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-red-300" data-index="${index}" title="Remove item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" /></svg>
          </button>
        </div>
      `;
            orderItemsList.appendChild(listItem);
        });
    }
    document.querySelectorAll('.edit-item-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const buttonElement = event.target.closest('button');
            if (buttonElement && buttonElement.dataset.index !== undefined) {
                const indexToEdit = parseInt(buttonElement.dataset.index);
                if (currentOrder.items && currentOrder.items[indexToEdit] !== undefined) {
                    openAddItemModal(currentOrder.items[indexToEdit], indexToEdit);
                } else { console.error(`[DEBUG] Error: No item found at index ${indexToEdit} in currentOrder.items.`); alert("Error: Could not find the item to edit."); }
            } else { console.error("[DEBUG] Error: Could not determine index for edit button."); alert("Error: Could not initiate edit."); }
        });
    });
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const buttonElement = event.target.closest('button');
            if (buttonElement && buttonElement.dataset.index !== undefined) {
                const indexToRemove = parseInt(buttonElement.dataset.index);
                if (currentOrder.items && currentOrder.items[indexToRemove] !== undefined) { removeItemFromOrder(indexToRemove); }
                else { console.error(`[DEBUG] Error: No item found at index ${indexToRemove} to remove.`); alert("Error: Could not find the item to remove."); }
            } else { console.error("[DEBUG] Error: Could not determine index for remove button."); alert("Error: Could not initiate remove."); }
        });
    });
    calculateTotals();
    subtotalAmountEl.textContent = formatCurrency(currentOrder.subtotal);
    taxAmountEl.textContent = formatCurrency(currentOrder.taxAmount);
    totalAmountEl.textContent = formatCurrency(currentOrder.totalAmount);
    if(settings && settings.taxRate !== undefined) taxRateDisplayEl.textContent = (settings.taxRate * 100).toFixed(0);
    window.electronAPI.saveDraftOrder(currentOrder);
}

// --- Main POS Order Logic ---
function calculateTotals() {
    currentOrder.subtotal = currentOrder.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    currentOrder.taxAmount = currentOrder.subtotal * (settings.taxRate || 0);
    currentOrder.totalAmount = currentOrder.subtotal + currentOrder.taxAmount;
}
function addItemToOrder(menuItem, quantity, specialNote, editIndex = -1) {
    const existingItemIndex = editIndex === -1 ? currentOrder.items.findIndex(
        item => item.menuItemId === menuItem.id && item.specialNote === specialNote
    ) : -1;
    if (editIndex !== -1) {
        currentOrder.items[editIndex] = {
            menuItemId: menuItem.id, name: menuItem.name, unitPrice: menuItem.price,
            quantity: quantity, specialNote: specialNote
        };
    } else if (existingItemIndex > -1 && !specialNote && specialNote === currentOrder.items[existingItemIndex].specialNote) {
        currentOrder.items[existingItemIndex].quantity += quantity;
    } else {
        currentOrder.items.push({
            menuItemId: menuItem.id, name: menuItem.name, quantity: quantity,
            unitPrice: menuItem.price, specialNote: specialNote
        });
    }
    renderOrder();
}
function removeItemFromOrder(index) {
    if (index >= 0 && index < currentOrder.items.length) {
        currentOrder.items.splice(index, 1);
        renderOrder();
    } else {
        console.error(`[DEBUG] Attempted to remove item with invalid index: ${index}`);
    }
}
function clearOrder() {
    currentOrder = {
        items: [], customerName: '', customerAddress: '', customerPhone: '',
        orderType: 'Take-away', deliveryPersonId: null,
        subtotal: 0, taxAmount: 0, totalAmount: 0,
    };
    if(customerNameInput) customerNameInput.value = '';
    if(customerAddressInput) customerAddressInput.value = '';
    if(customerPhoneInput) customerPhoneInput.value = '';
    if(deliveryPersonSelect) deliveryPersonSelect.value = '';
    const takeAwayRadio = document.querySelector('input[name="orderType"][value="Take-away"]');
    if (takeAwayRadio) takeAwayRadio.checked = true;
    toggleDeliveryFields();
    renderOrder();
}

// --- Main POS Add Item Modal Logic ---
function openAddItemModal(itemData, editIndex = -1) {
    if (editIndex !== -1) {
        if (!itemData || typeof itemData.menuItemId === 'undefined') {
            alert('An error occurred while trying to edit the item. Item data is invalid.'); return;
        }
        const orderItem = itemData;
        modalMenuItemIdInput.value = orderItem.menuItemId;
        modalItemNameEl.textContent = `Configure: ${orderItem.name}`;
        modalQuantityInput.value = orderItem.quantity;
        modalSpecialNoteInput.value = orderItem.specialNote || '';
        modalAddToOrderBtn.textContent = "Update Item";
        modalAddToOrderBtn.dataset.editIndex = editIndex;
    } else {
        if (!itemData || typeof itemData.id === 'undefined') {
            alert('An error occurred while trying to add the item. Menu item data is invalid.'); return;
        }
        const menuItem = itemData;
        modalMenuItemIdInput.value = menuItem.id;
        modalItemNameEl.textContent = `Configure: ${menuItem.name}`;
        modalQuantityInput.value = 1;
        modalSpecialNoteInput.value = '';
        modalAddToOrderBtn.textContent = "Add to Order";
        delete modalAddToOrderBtn.dataset.editIndex;
    }
    addItemModal.style.display = 'flex';
    modalQuantityInput.focus();
}
function closeAddItemModal() { addItemModal.style.display = 'none'; }

// --- Main POS Drag and Drop Logic ---
const currentOrderPanel = document.getElementById('current-order-panel');
currentOrderPanel.addEventListener('dragover', (event) => event.preventDefault());
currentOrderPanel.addEventListener('drop', (event) => {
    event.preventDefault();
    const itemDataString = event.dataTransfer.getData('application/json');
    if (itemDataString) {
        try {
            const menuItem = JSON.parse(itemDataString);
            openAddItemModal(menuItem);
        } catch (e) { alert("Error adding item via drag and drop. Invalid item data."); }
    }
});

// --- Main POS Event Handlers ---
function handleModalAddToOrder() {
    const menuItemId = modalMenuItemIdInput.value;
    const quantity = parseInt(modalQuantityInput.value);
    const specialNote = modalSpecialNoteInput.value.trim();
    const editIndex = modalAddToOrderBtn.dataset.editIndex ? parseInt(modalAddToOrderBtn.dataset.editIndex) : -1;
    const menuItem = menuData.items.find(item => item.id === menuItemId);
    if (menuItem && quantity > 0) {
        addItemToOrder(menuItem, quantity, specialNote, editIndex);
        closeAddItemModal();
    } else { alert("Invalid item or quantity."); }
}
async function handleCompleteOrder() {
    currentOrder.customerName = customerNameInput.value.trim();
    currentOrder.customerAddress = customerAddressInput.value.trim();
    currentOrder.customerPhone = customerPhoneInput.value.trim();
    currentOrder.deliveryPersonId = deliveryPersonSelect.value;
    if (currentOrder.items.length === 0) { alert('Order is empty!'); return; }
    if (currentOrder.orderType === 'Delivery') {
        if (!currentOrder.customerName) { alert('Customer Name is required for delivery.'); return; }
        if (!currentOrder.customerAddress) { alert('Customer Address is required for delivery.'); return; }
        if (!currentOrder.deliveryPersonId) { alert('Please select a delivery person for delivery.'); return; }
    }
    const orderToSave = {
        ...currentOrder, timestamp: new Date().toISOString(),
        deliveryPersonName: currentOrder.deliveryPersonId && settings.deliveryPersonnel ? settings.deliveryPersonnel.find(dp => dp.id === currentOrder.deliveryPersonId)?.name : null,
        taxRate: settings.taxRate, currencySymbol: settings.currencySymbol
    };
    const result = await window.electronAPI.saveOrder(orderToSave);
    if (result.success) {
        alert(`Order ${result.orderId} saved successfully!`);
        const receiptHtml = generateReceiptHtml(orderToSave, result.orderId);
        window.electronAPI.printReceipt(receiptHtml);
        clearOrder();
    } else { alert(`Failed to save order: ${result.error}`); }
}
function generateReceiptHtml(order, orderId) {
    let html = `<html><head><title>Receipt</title><style>body{font-family:monospace;margin:15px;font-size:12px;}table{width:100%;border-collapse:collapse;}th,td{padding:3px;text-align:left;border-bottom:1px dashed #ccc;}.total td{border-top:1px solid #000;font-weight:bold;}.center{text-align:center;}</style></head><body>`;
    html += `<div class="center"><h2>${settings.restaurantName || 'Receipt'}</h2>`;
    if (settings.restaurantAddress) html += `<p>${settings.restaurantAddress}</p>`;
    if (settings.restaurantPhone) html += `<p>${settings.restaurantPhone}</p>`;
    html += `<p>Order ID: ${orderId}<br>Date: ${new Date(order.timestamp).toLocaleString()}</p></div><hr>`;
    html += `<p>Type: ${order.orderType}</p>`;
    if(order.customerName) html += `<p>Customer: ${order.customerName}</p>`;
    if(order.orderType === 'Delivery' && order.customerAddress) html += `<p>Address: ${order.customerAddress}</p>`;
    if(order.customerPhone) html += `<p>Phone: ${order.customerPhone}</p>`;
    if(order.orderType === 'Delivery' && order.deliveryPersonName) html += `<p>Delivery: ${order.deliveryPersonName}</p>`;
    html += `<hr><table><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>`;
    order.items.forEach(item => {
        html += `<tr><td style="word-break:break-word;">${item.name} ${item.specialNote ? `(${item.specialNote})` : ''}</td><td>${item.quantity}</td><td>${formatCurrency(item.unitPrice)}</td><td>${formatCurrency(item.unitPrice * item.quantity)}</td></tr>`;
    });
    html += `</tbody></table><hr>`;
    html += `<p style="text-align:right;">Subtotal: ${formatCurrency(order.subtotal)}</p>`;
    html += `<p style="text-align:right;">Tax (${(order.taxRate*100).toFixed(0)}%): ${formatCurrency(order.taxAmount)}</p>`;
    html += `<p class="total" style="text-align:right;font-size:14px;">Total: ${formatCurrency(order.totalAmount)}</p>`;
    html += `<div class="center" style="margin-top:15px;"><p>Thank you!</p></div></body></html>`;
    return html;
}
function toggleDeliveryFields() {
    currentOrder.orderType = document.querySelector('input[name="orderType"]:checked').value;
    deliveryFieldsDiv.style.display = currentOrder.orderType === 'Delivery' ? 'block' : 'none';
}

// --- Reporting Modals Logic ---
async function showDailySalesReport() {
    const report = await window.electronAPI.getDailySalesReport();
    if (report.error) { alert(`Error fetching report: ${report.error}`); return; }
    reportDateEl.textContent = new Date(report.date).toLocaleDateString();
    reportOrdersCountEl.textContent = report.ordersCount;
    reportTotalSalesEl.textContent = formatCurrency(report.totalSales);
    salesReportModal.style.display = 'flex';
}
async function displayOrderDetails(filename) {
    orderDetailView.innerHTML = '<p class="italic text-slate-500">Loading details...</p>';
    const order = await window.electronAPI.getOrderDetails(filename);
    if (order && !order.error) {
        let detailsHtml = `<h3 class="text-lg font-semibold mb-2 text-slate-800">Order: ${order.orderId || filename.replace('order_','').replace('.json','')}</h3>`;
        detailsHtml += `<p><strong>Date:</strong> ${new Date(order.timestamp).toLocaleString()}</p>`;
        detailsHtml += `<p><strong>Type:</strong> ${order.orderType}</p>`;
        if (order.customerName) detailsHtml += `<p><strong>Customer:</strong> ${order.customerName}</p>`;
        if (order.orderType === 'Delivery') {
            if (order.customerAddress) detailsHtml += `<p><strong>Address:</strong> ${order.customerAddress}</p>`;
            if (order.deliveryPersonName) detailsHtml += `<p><strong>Delivery By:</strong> ${order.deliveryPersonName}</p>`;
        }
        if (order.customerPhone) detailsHtml += `<p><strong>Phone:</strong> ${order.customerPhone}</p>`;
        detailsHtml += '<h4 class="font-semibold mt-3 mb-1 text-slate-800">Items:</h4><ul class="list-disc list-inside space-y-1.5 text-slate-700">';
        order.items.forEach(item => {
            detailsHtml += `<li>${item.name} (Qty: ${item.quantity}) - ${formatCurrency(item.unitPrice * item.quantity)}`;
            if (item.specialNote) detailsHtml += `<br><small class="text-slate-500 italic">Note: ${item.specialNote}</small>`;
            detailsHtml += `</li>`;
        });
        detailsHtml += '</ul>';
        detailsHtml += `<div class="mt-4 pt-3 border-t border-slate-200 space-y-1 text-right">`;
        detailsHtml += `<p class="text-slate-600"><strong>Subtotal:</strong> ${formatCurrency(order.subtotal)}</p>`;
        detailsHtml += `<p class="text-slate-600"><strong>Tax (${(order.taxRate * 100).toFixed(0)}%):</strong> ${formatCurrency(order.taxAmount)}</p>`;
        detailsHtml += `<p class="text-lg font-bold text-slate-800">Total: ${formatCurrency(order.totalAmount)}</p></div>`;
        orderDetailView.innerHTML = detailsHtml;
    } else {
        orderDetailView.innerHTML = `<p class="text-red-500">Could not load order details. ${order.error || ''}</p>`;
    }
}
async function loadAndDisplayOrders() {
    ordersListContainer.innerHTML = '<p class="italic text-slate-500 p-2">Loading orders...</p>';
    orderDetailView.innerHTML = '<p class="italic text-slate-500 p-2">Select an order to see details.</p>';
    const result = await window.electronAPI.listOrderFiles();
    if (result && !result.error && Array.isArray(result)) {
        if (result.length === 0) {
            ordersListContainer.innerHTML = '<p class="italic text-slate-500 p-2">No completed orders found.</p>';
            return;
        }
        const ul = document.createElement('ul');
        result.forEach(orderFile => {
            const li = document.createElement('li');
            const button = document.createElement('button');
            let displayName = orderFile.filename.replace('order_','').replace('.json','');
            try {
                const tsPart = displayName.substring(0, 14);
                displayName = `${tsPart.substring(0,4)}-${tsPart.substring(4,6)}-${tsPart.substring(6,8)} ${tsPart.substring(8,10)}:${tsPart.substring(10,12)}`;
            } catch(e) { /* use processed filename */ }
            button.textContent = displayName;
            button.className = 'w-full text-left p-2.5 text-sm rounded-lg hover:bg-slate-100 focus:outline-none focus:bg-slate-100 transition-colors duration-150';
            button.addEventListener('click', () => {
                document.querySelectorAll('#orders-list-container button.selected').forEach(btn => btn.classList.remove('selected', 'bg-blue-600', 'text-white'));
                button.classList.add('selected', 'bg-blue-600', 'text-white');
                displayOrderDetails(orderFile.filename);
            });
            li.appendChild(button);
            ul.appendChild(li);
        });
        ordersListContainer.innerHTML = '';
        ordersListContainer.appendChild(ul);
    } else {
        ordersListContainer.innerHTML = `<p class="text-red-500 p-2">Error loading orders: ${result.error || 'Unknown error'}</p>`;
    }
}

// --- Admin Settings - General Settings Logic ---
function populateSettingsForm() {
    if (!settings) return;
    settingRestaurantNameInput.value = settings.restaurantName || '';
    settingTaxRateInput.value = settings.taxRate || 0;
    settingCurrencySymbolInput.value = settings.currencySymbol || '$';
    renderDeliveryPersonnelSettings();
}
function renderDeliveryPersonnelSettings() {
    deliveryPersonnelListDiv.innerHTML = '';
    if (settings.deliveryPersonnel && settings.deliveryPersonnel.length > 0) {
        const ul = document.createElement('ul');
        ul.className = 'space-y-1.5';
        settings.deliveryPersonnel.forEach((person, index) => {
            const li = document.createElement('li');
            li.className = 'flex justify-between items-center px-2.5 py-1.5 bg-slate-100 rounded-md text-sm';
            li.textContent = person.name;
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Del';
            removeBtn.className = 'px-2.5 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-md hover:bg-red-200 focus:outline-none focus:ring-1 focus:ring-red-300 transition-colors duration-150';
            removeBtn.onclick = () => {
                settings.deliveryPersonnel.splice(index, 1);
                renderDeliveryPersonnelSettings();
            };
            li.appendChild(removeBtn);
            ul.appendChild(li);
        });
        deliveryPersonnelListDiv.appendChild(ul);
    } else {
        deliveryPersonnelListDiv.innerHTML = '<p class="text-slate-500 italic text-sm px-1 py-2">No delivery personnel configured.</p>';
    }
}
function handleAddDeliveryPerson() {
    const newName = newDeliveryPersonNameInput.value.trim();
    if (newName) {
        if (!settings.deliveryPersonnel) settings.deliveryPersonnel = [];
        const newId = 'dp_' + Date.now();
        settings.deliveryPersonnel.push({ id: newId, name: newName });
        newDeliveryPersonNameInput.value = '';
        renderDeliveryPersonnelSettings();
    }
}
async function handleSaveSettings() {
    const newSettingsData = {
        ...settings,
        restaurantName: settingRestaurantNameInput.value.trim(),
        taxRate: parseFloat(settingTaxRateInput.value) || 0,
        currencySymbol: settingCurrencySymbolInput.value.trim() || '$',
        deliveryPersonnel: settings.deliveryPersonnel || []
    };
    const result = await window.electronAPI.saveSettings(newSettingsData);
    if (result.success) {
        alert('General settings saved successfully!');
    } else {
        alert(`Error saving general settings: ${result.error || 'Unknown error'}`);
    }
}

// --- Admin Settings Modal Tab Logic ---
function setActiveAdminTab(selectedTabId, selectedContentId) {
    document.querySelectorAll('.admin-tab-button').forEach(btn => {
        btn.classList.remove('border-blue-500', 'text-blue-600', 'font-semibold');
        btn.classList.add('border-transparent', 'text-slate-500', 'hover:text-slate-700', 'hover:border-slate-300');
    });
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    const activeTabButton = document.getElementById(selectedTabId);
    const activeTabContent = document.getElementById(selectedContentId);
    if (activeTabButton) {
        activeTabButton.classList.add('border-blue-500', 'text-blue-600', 'font-semibold');
        activeTabButton.classList.remove('border-transparent', 'text-slate-500', 'hover:text-slate-700', 'hover:border-slate-300');
    }
    if (activeTabContent) activeTabContent.classList.remove('hidden');
    currentAdminTab = selectedContentId;
    if (selectedContentId === 'menu-management-content') {
        loadAdminMenuDataAndRender();
        setActiveMenuMgmSubTab('menu-mgm-tab-items', 'menu-mgm-items-content');
    }
}
function setActiveMenuMgmSubTab(selectedSubTabId, selectedSubContentId) {
    document.querySelectorAll('.menu-mgm-subtab-button').forEach(btn => {
        btn.classList.remove('border-purple-500', 'text-purple-600', 'font-semibold');
        btn.classList.add('border-transparent', 'text-slate-500', 'hover:text-slate-700', 'hover:border-slate-300');
    });
    document.querySelectorAll('.menu-mgm-subtab-content').forEach(content => {
        content.classList.add('hidden');
    });
    const activeSubTabButton = document.getElementById(selectedSubTabId);
    const activeSubTabContent = document.getElementById(selectedSubContentId);
    if (activeSubTabButton) {
        activeSubTabButton.classList.add('border-purple-500', 'text-purple-600', 'font-semibold');
        activeSubTabButton.classList.remove('border-transparent', 'text-slate-500', 'hover:text-slate-700', 'hover:border-slate-300');
    }
    if (activeSubTabContent) activeSubTabContent.classList.remove('hidden');
    currentMenuMgmSubTab = selectedSubContentId;
    if (adminMenuData) {
        if (currentMenuMgmSubTab === 'menu-mgm-items-content') renderAdminMenuItemsList();
        else if (currentMenuMgmSubTab === 'menu-mgm-categories-content') renderAdminCategoriesList();
        menuMgmItemFormContainer.classList.add('hidden');
        menuMgmCategoryFormContainer.classList.add('hidden');
    }
}

// --- Menu Management CRUD Logic ---
async function loadAdminMenuDataAndRender() {
    if (!adminMenuData) {
        const loadedMenu = await window.electronAPI.loadMenuItems();
        if (loadedMenu) adminMenuData = JSON.parse(JSON.stringify(loadedMenu));
        else {
            adminMenuData = { categories: [], items: [] };
            alert('Could not load menu data for editing.');
        }
    }
    if (currentMenuMgmSubTab === 'menu-mgm-items-content') renderAdminMenuItemsList();
    else if (currentMenuMgmSubTab === 'menu-mgm-categories-content') renderAdminCategoriesList();
}

function renderAdminCategoriesList() {
    menuMgmCategoriesList.innerHTML = '';
    if (!adminMenuData || !adminMenuData.categories || adminMenuData.categories.length === 0) {
        menuMgmCategoriesList.innerHTML = '<p class="italic text-slate-400 p-2">No categories. Click "Add New Category".</p>'; return;
    }
    adminMenuData.categories.forEach(category => {
        const div = document.createElement('div');
        div.className = 'flex justify-between items-center p-1.5 bg-white hover:bg-slate-50 rounded-md border border-slate-200';
        div.innerHTML = `
            <span class="font-medium text-slate-700 truncate">${category.name}</span>
            <div class="flex-shrink-0 space-x-1">
                <button data-category-id="${category.id}" class="menu-mgm-edit-category-btn px-1.5 py-0.5 text-blue-600 hover:text-blue-800 rounded-md hover:bg-blue-100 transition-colors text-xs">Edit</button>
                <button data-category-id="${category.id}" data-category-name="${category.name}" class="menu-mgm-delete-category-btn px-1.5 py-0.5 text-red-500 hover:text-red-700 rounded-md hover:bg-red-100 transition-colors text-xs">Del</button>
            </div>`;
        menuMgmCategoriesList.appendChild(div);
    });
    attachAdminCategoryActionListeners();
}
function handleShowCategoryForm(mode, categoryId = null) {
    currentEditingCategoryId = categoryId;
    if (mode === 'add') {
        menuMgmCategoryFormTitle.textContent = "Add New Category";
        menuMgmCategoryIdInput.value = '';
        menuMgmCategoryNameInput.value = '';
    } else if (mode === 'edit' && categoryId) {
        const category = adminMenuData.categories.find(cat => cat.id === categoryId);
        if (category) {
            menuMgmCategoryFormTitle.textContent = "Edit Category";
            menuMgmCategoryIdInput.value = category.id;
            menuMgmCategoryNameInput.value = category.name;
        } else { alert("Category not found for editing."); return; }
    }
    menuMgmCategoryFormContainer.classList.remove('hidden');
    menuMgmItemFormContainer.classList.add('hidden');
    menuMgmCategoryNameInput.focus();
}
function handleSaveCategory() {
    const categoryName = menuMgmCategoryNameInput.value.trim();
    const categoryId = menuMgmCategoryIdInput.value;
    if (!categoryName) { alert("Category name cannot be empty."); menuMgmCategoryNameInput.focus(); return; }
    if (categoryId) {
        const categoryIndex = adminMenuData.categories.findIndex(cat => cat.id === categoryId);
        if (categoryIndex > -1) {
            if (adminMenuData.categories.some(cat => cat.id !== categoryId && cat.name.toLowerCase() === categoryName.toLowerCase())) {
                alert("Another category with this name already exists."); menuMgmCategoryNameInput.focus(); return;
            }
            adminMenuData.categories[categoryIndex].name = categoryName;
        } else { alert("Error: Category to update not found."); return; }
    } else {
        if (adminMenuData.categories.some(cat => cat.name.toLowerCase() === categoryName.toLowerCase())) {
            alert("A category with this name already exists."); menuMgmCategoryNameInput.focus(); return;
        }
        adminMenuData.categories.push({ id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, name: categoryName });
    }
    renderAdminCategoriesList();
    menuMgmCategoryFormContainer.classList.add('hidden');
    currentEditingCategoryId = null;
}
async function handleDeleteCategory(categoryId, categoryName) {
    if (!categoryId) return;
    const isCategoryInUse = adminMenuData.items.some(item => item.categoryId === categoryId);
    if (isCategoryInUse) {
        alert(`Cannot delete category "${categoryName}". It is currently assigned to one or more menu items. Please reassign or delete those items first.`);
        return;
    }
    const confirmed = await window.electronAPI.confirmAction(`Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`);
    if (confirmed) {
        adminMenuData.categories = adminMenuData.categories.filter(cat => cat.id !== categoryId);
        renderAdminCategoriesList();
        if (selectedCategoryId === categoryId) {
            selectedCategoryId = (adminMenuData.categories.length > 0) ? adminMenuData.categories[0].id : null;
        }
    }
}
function attachAdminCategoryActionListeners() {
    document.querySelectorAll('.menu-mgm-edit-category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const catId = e.target.closest('button').dataset.categoryId;
            handleShowCategoryForm('edit', catId);
        });
    });
    document.querySelectorAll('.menu-mgm-delete-category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            const catId = button.dataset.categoryId;
            const catName = button.dataset.categoryName;
            handleDeleteCategory(catId, catName);
        });
    });
}

function renderAdminMenuItemsList() {
    menuMgmItemsList.innerHTML = '';
    if (!adminMenuData || !adminMenuData.items || adminMenuData.items.length === 0) {
        menuMgmItemsList.innerHTML = '<p class="italic text-slate-400 p-2">No menu items. Click "Add New Item".</p>'; return;
    }
    adminMenuData.items.forEach(item => {
        const categoryName = adminMenuData.categories.find(cat => cat.id === item.categoryId)?.name || 'Uncategorized';
        const div = document.createElement('div');
        div.className = 'flex justify-between items-center p-1.5 bg-white hover:bg-slate-50 rounded-md border border-slate-200';
        div.innerHTML = `
            <div class="truncate"><span class="font-medium text-slate-700">${item.name}</span><span class="text-slate-500 ml-2 text-xs">(${categoryName})</span></div>
            <div class="flex-shrink-0 space-x-1">
                <span class="text-xs font-semibold text-blue-600 mr-2">${formatCurrency(item.price)}</span>
                <button data-item-id="${item.id}" class="menu-mgm-edit-item-btn px-1.5 py-0.5 text-blue-600 hover:text-blue-800 rounded-md hover:bg-blue-100 transition-colors text-xs">Edit</button>
                <button data-item-id="${item.id}" data-item-name="${item.name}" class="menu-mgm-delete-item-btn px-1.5 py-0.5 text-red-500 hover:text-red-700 rounded-md hover:bg-red-100 transition-colors text-xs">Del</button>
            </div>`;
        menuMgmItemsList.appendChild(div);
    });
    attachAdminItemActionListeners();
}
function handleShowItemForm(mode, itemId = null) {
    currentEditingItemId = itemId;
    menuMgmItemCategorySelect.innerHTML = '';
    if (adminMenuData && adminMenuData.categories && adminMenuData.categories.length > 0) {
        adminMenuData.categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            menuMgmItemCategorySelect.appendChild(option);
        });
        menuMgmItemCategorySelect.disabled = false;
    } else {
        menuMgmItemCategorySelect.innerHTML = '<option value="">Add a category first</option>';
        menuMgmItemCategorySelect.disabled = true;
    }

    if (mode === 'add') {
        menuMgmItemFormTitle.textContent = "Add New Item";
        menuMgmItemIdInput.value = '';
        menuMgmItemNameInput.value = '';
        menuMgmItemPriceInput.value = '';
        menuMgmItemImageInput.value = '';
        if (adminMenuData.categories.length > 0) {
            menuMgmItemCategorySelect.value = adminMenuData.categories[0].id;
        }
    } else if (mode === 'edit' && itemId) {
        const item = adminMenuData.items.find(it => it.id === itemId);
        if (item) {
            menuMgmItemFormTitle.textContent = "Edit Item";
            menuMgmItemIdInput.value = item.id;
            menuMgmItemNameInput.value = item.name;
            menuMgmItemPriceInput.value = item.price;
            menuMgmItemImageInput.value = item.image || '';
            menuMgmItemCategorySelect.value = item.categoryId || '';
        } else { alert("Item not found for editing."); return; }
    }
    menuMgmItemFormContainer.classList.remove('hidden');
    menuMgmCategoryFormContainer.classList.add('hidden');
    menuMgmItemNameInput.focus();
}
function handleSaveItem() {
    const itemId = menuMgmItemIdInput.value;
    const itemName = menuMgmItemNameInput.value.trim();
    const itemPriceStr = menuMgmItemPriceInput.value.trim();
    const itemCategoryId = menuMgmItemCategorySelect.value;
    const itemImagePath = menuMgmItemImageInput.value.trim();

    if (!itemName) { alert("Item name cannot be empty."); menuMgmItemNameInput.focus(); return; }
    if (!itemPriceStr || isNaN(parseFloat(itemPriceStr)) || parseFloat(itemPriceStr) < 0) {
        alert("Please enter a valid positive price for the item."); menuMgmItemPriceInput.focus(); return;
    }
    const itemPrice = parseFloat(itemPriceStr);
    if (!itemCategoryId && adminMenuData.categories.length > 0) {
        alert("Please select a category for the item."); menuMgmItemCategorySelect.focus(); return;
    } else if (adminMenuData.categories.length === 0 && !itemCategoryId) {
        alert("No categories available. Please add a category first before adding items."); return;
    }

    if (itemId) {
        const itemIndex = adminMenuData.items.findIndex(it => it.id === itemId);
        if (itemIndex > -1) {
            adminMenuData.items[itemIndex] = { ...adminMenuData.items[itemIndex], name: itemName, price: itemPrice, categoryId: itemCategoryId, image: itemImagePath };
        } else { alert("Error: Item to update not found."); return; }
    } else {
        adminMenuData.items.push({ id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, name: itemName, price: itemPrice, categoryId: itemCategoryId, image: itemImagePath });
    }
    renderAdminMenuItemsList();
    menuMgmItemFormContainer.classList.add('hidden');
    currentEditingItemId = null;
}
async function handleDeleteItem(itemId, itemName) {
    if (!itemId) return;
    const confirmed = await window.electronAPI.confirmAction(`Are you sure you want to delete the item "${itemName}"? This action cannot be undone.`);
    if (confirmed) {
        adminMenuData.items = adminMenuData.items.filter(it => it.id !== itemId);
        renderAdminMenuItemsList();
    }
}
function attachAdminItemActionListeners() {
    document.querySelectorAll('.menu-mgm-edit-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.closest('button').dataset.itemId;
            handleShowItemForm('edit', itemId);
        });
    });
    document.querySelectorAll('.menu-mgm-delete-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            const itemId = button.dataset.itemId;
            const itemName = button.dataset.itemName;
            handleDeleteItem(itemId, itemName);
        });
    });
}

async function handleSaveMenuChanges() {
    if (!adminMenuData) { alert("No menu data loaded to save."); return; }
    const confirmed = await window.electronAPI.confirmAction("Are you sure you want to save all menu changes? This will overwrite the current menu data.");
    if (confirmed) {
        const result = await window.electronAPI.saveMenuData(adminMenuData);
        if (result.success) {
            alert("Menu changes saved successfully!");
            menuData = JSON.parse(JSON.stringify(adminMenuData)); // Keep main menuData in sync
        } else { alert(`Failed to save menu changes: ${result.error || 'Unknown error'}`); }
    }
}

// --- Reports Modal Logic ---
async function handleGenerateReport() {
    const type = reportTypeSelect.value;
    const range = reportDateRangeSelect.value;
    reportDisplayArea.innerHTML = '<p class="italic text-slate-500 p-2">Generating report...</p>';
    const result = await window.electronAPI.getReportData(type, range);
    if (result && result.success) {
        displayReportData(result.data, result.reportType);
    } else {
        reportDisplayArea.innerHTML = `<p class="text-red-500 p-2">Error generating report: ${result.error || 'Unknown error'}</p>`;
    }
}
function displayReportData(data, type) {
    reportDisplayArea.innerHTML = '';
    if (!data || data.length === 0) {
        reportDisplayArea.innerHTML = '<p class="italic text-slate-500 p-2">No data found for this report and period.</p>'; return;
    }
    const table = document.createElement('table');
    table.className = 'min-w-full divide-y divide-slate-200 text-sm';
    const thead = table.createTHead();
    const tbody = table.createTBody();
    thead.className = "bg-slate-100";
    tbody.className = "bg-white divide-y divide-slate-200";
    if (type === 'topSellingItems') {
        const headerRow = thead.insertRow();
        headerRow.innerHTML = `<th class="px-4 py-2 text-left font-semibold text-slate-600">Item Name</th><th class="px-4 py-2 text-left font-semibold text-slate-600">Quantity Sold</th>`;
        data.forEach(item => {
            const row = tbody.insertRow();
            row.innerHTML = `<td class="px-4 py-2 whitespace-nowrap text-slate-700">${item.name}</td><td class="px-4 py-2 whitespace-nowrap text-slate-700 text-center">${item.quantitySold}</td>`;
        });
    } else if (type === 'salesByCategory') {
        const headerRow = thead.insertRow();
        headerRow.innerHTML = `<th class="px-4 py-2 text-left font-semibold text-slate-600">Category Name</th><th class="px-4 py-2 text-left font-semibold text-slate-600">Total Sales</th>`;
        data.forEach(cat => {
            const row = tbody.insertRow();
            row.innerHTML = `<td class="px-4 py-2 whitespace-nowrap text-slate-700">${cat.name}</td><td class="px-4 py-2 whitespace-nowrap text-slate-700">${formatCurrency(cat.totalSales)}</td>`;
        });
    }
    reportDisplayArea.appendChild(table);
}

// --- General App Initialization and UI State ---
function updateDateTime() {
    if (currentDatetimeEl) currentDatetimeEl.textContent = new Date().toLocaleString([], {dateStyle: 'medium', timeStyle: 'short'});
}
function initializeAppUIFromSettings() {
    if (!settings) return;
    restaurantNameEl.textContent = settings.restaurantName || "POS System";
    deliveryPersonSelect.innerHTML = '<option value="">Select...</option>';
    if (settings.deliveryPersonnel) {
        settings.deliveryPersonnel.forEach(dp => {
            const option = document.createElement('option');
            option.value = dp.id;
            option.textContent = dp.name;
            deliveryPersonSelect.appendChild(option);
        });
    }
    if(taxRateDisplayEl && settings.taxRate !== undefined) taxRateDisplayEl.textContent = (settings.taxRate * 100).toFixed(0);
    if (menuData && menuData.items) {
        renderOrder();
    }
}
async function refreshMainMenuDisplay() {
    const loadedMenu = await window.electronAPI.loadMenuItems();
    if (loadedMenu) {
        menuData = loadedMenu;
        if (menuData.categories && menuData.categories.length > 0) {
            if (!selectedCategoryId || !menuData.categories.find(c => c.id === selectedCategoryId)) {
                selectedCategoryId = menuData.categories[0].id;
            }
        } else {
            selectedCategoryId = null;
        }
        renderCategories();
        renderMenuItems();
    } else {
        alert("CRITICAL: Could not reload menu after update for POS display.");
    }
}

async function initializeApp() {
    const loadedSettings = await window.electronAPI.loadSettings();
    if (loadedSettings) settings = loadedSettings;

    const loadedMenu = await window.electronAPI.loadMenuItems();
    if (loadedMenu) {
        menuData = loadedMenu;
        if (menuData.categories && menuData.categories.length > 0) {
            selectedCategoryId = menuData.categories[0].id;
        } else { console.warn("[DEBUG] No categories found in initial menu data load for POS."); }
        renderCategories();
        renderMenuItems();
    } else { alert("CRITICAL: Could not load menu. Application might not work correctly."); }

    initializeAppUIFromSettings();

    const draft = await window.electronAPI.loadDraftOrder();
    if (draft && draft.items && draft.items.length > 0) {
        const confirmed = await window.electronAPI.confirmAction('An unsaved order draft was found. Do you want to restore it?');
        if (confirmed) {
            currentOrder = draft;
            if(customerNameInput) customerNameInput.value = currentOrder.customerName || '';
            if(customerAddressInput) customerAddressInput.value = currentOrder.customerAddress || '';
            if(customerPhoneInput) customerPhoneInput.value = currentOrder.customerPhone || '';
            if(deliveryPersonSelect) deliveryPersonSelect.value = currentOrder.deliveryPersonId || '';
            const orderTypeRadio = document.querySelector(`input[name="orderType"][value="${currentOrder.orderType || 'Take-away'}"]`);
            if(orderTypeRadio) orderTypeRadio.checked = true;
        }
    }
    renderOrder();
    toggleDeliveryFields();
    updateDateTime();
    setInterval(updateDateTime, 10000);

    window.electronAPI.onSettingsUpdated((updatedSettings) => {
        settings = updatedSettings;
        initializeAppUIFromSettings();
        if (adminSettingsModal.style.display === 'flex' && currentAdminTab === 'general-settings-content') {
            populateSettingsForm();
        }
    });

    window.electronAPI.onMenuDataUpdated(async (updatedMenuData) => {
        menuData = { ...updatedMenuData };
        if (adminSettingsModal.style.display === 'flex' && currentAdminTab === 'menu-management-content') {
            adminMenuData = JSON.parse(JSON.stringify(updatedMenuData));
            if (currentMenuMgmSubTab === 'menu-mgm-items-content') renderAdminMenuItemsList();
            else if (currentMenuMgmSubTab === 'menu-mgm-categories-content') renderAdminCategoriesList();
        }
        await refreshMainMenuDisplay();
    });

    setupEventListeners();
}

function setupEventListeners() {
    orderTypeRadios.forEach(radio => radio.addEventListener('change', toggleDeliveryFields));
    clearOrderBtn.addEventListener('click', async () => {
        const confirmed = await window.electronAPI.confirmAction('Are you sure you want to clear the current order?');
        if (confirmed) clearOrder();
    });
    completeOrderBtn.addEventListener('click', handleCompleteOrder);
    modalAddToOrderBtn.addEventListener('click', handleModalAddToOrder);
    modalCancelBtn.addEventListener('click', closeAddItemModal);
    reportCloseBtn.addEventListener('click', () => salesReportModal.style.display = 'none');
    ordersModalCloseBtn.addEventListener('click', () => viewOrdersModal.style.display = 'none');
    settingsModalCloseBtn.addEventListener('click', () => { adminSettingsModal.style.display = 'none'; });
    reportsModalCloseBtn.addEventListener('click', () => reportsModal.style.display = 'none');
    viewDailySalesBtn.addEventListener('click', showDailySalesReport);
    viewOrdersBtn.addEventListener('click', () => { viewOrdersModal.style.display = 'flex'; loadAndDisplayOrders(); });
    settingsCog.addEventListener('click', () => {
        adminMenuData = null;
        setActiveAdminTab('tab-general-settings', 'general-settings-content');
        populateSettingsForm();
        adminSettingsModal.style.display = 'flex';
    });
    viewReportsBtn.addEventListener('click', () => {
        reportDisplayArea.innerHTML = '<p class="italic text-slate-500">Select report type and date range, then click "Generate Report".</p>';
        reportsModal.style.display = 'flex';
    });
    addDeliveryPersonBtn.addEventListener('click', handleAddDeliveryPerson);
    saveSettingsBtn.addEventListener('click', handleSaveSettings);
    tabGeneralSettings.addEventListener('click', () => setActiveAdminTab('tab-general-settings', 'general-settings-content'));
    tabMenuManagement.addEventListener('click', () => setActiveAdminTab('tab-menu-management', 'menu-management-content'));
    menuMgmTabItems.addEventListener('click', () => setActiveMenuMgmSubTab('menu-mgm-tab-items', 'menu-mgm-items-content'));
    menuMgmTabCategories.addEventListener('click', () => setActiveMenuMgmSubTab('menu-mgm-tab-categories', 'menu-mgm-categories-content'));
    menuMgmShowItemFormBtn.addEventListener('click', () => handleShowItemForm('add'));
    menuMgmItemCancelBtn.addEventListener('click', () => { menuMgmItemFormContainer.classList.add('hidden'); currentEditingItemId = null; });
    menuMgmItemSaveBtn.addEventListener('click', handleSaveItem);
    menuMgmShowCategoryFormBtn.addEventListener('click', () => handleShowCategoryForm('add'));
    menuMgmCategoryCancelBtn.addEventListener('click', () => { menuMgmCategoryFormContainer.classList.add('hidden'); currentEditingCategoryId = null; });
    menuMgmCategorySaveBtn.addEventListener('click', handleSaveCategory);
    saveMenuChangesBtn.addEventListener('click', handleSaveMenuChanges);
    generateReportBtn.addEventListener('click', handleGenerateReport);
}

document.addEventListener('DOMContentLoaded', initializeApp);