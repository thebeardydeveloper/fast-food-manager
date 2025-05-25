const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Data loading
    loadMenuItems: () => ipcRenderer.invoke('load-menu-items'),
    loadSettings: () => ipcRenderer.invoke('load-settings'),
    saveSettings: (newSettings) => ipcRenderer.invoke('save-settings', newSettings),
    saveMenuData: (newMenuData) => ipcRenderer.invoke('save-menu-data', newMenuData),
    getReportData: (reportType, dateRangePreset) => ipcRenderer.invoke('get-report-data', reportType, dateRangePreset),

    // Order management
    saveOrder: (orderData) => ipcRenderer.invoke('save-order', orderData),
    printReceipt: (receiptContent) => ipcRenderer.send('print-receipt', receiptContent),
    saveDraftOrder: (draftData) => ipcRenderer.send('save-draft-order', draftData),
    loadDraftOrder: () => ipcRenderer.invoke('load-draft-order'),

    // Reporting (getDailySalesReport is still here, getReportData is new)
    getDailySalesReport: () => ipcRenderer.invoke('get-daily-sales-report'),

    // Order Log
    listOrderFiles: () => ipcRenderer.invoke('list-order-files'),
    getOrderDetails: (filename) => ipcRenderer.invoke('get-order-details', filename),

    // UI Utilities
    confirmAction: (message) => ipcRenderer.invoke('confirm-action', message),

    // Listeners for updates from main process
    onSettingsUpdated: (callback) => ipcRenderer.on('settings-updated', (_event, value) => callback(value)),
    removeSettingsUpdatedListener: (callback) => ipcRenderer.removeListener('settings-updated', callback),
    onMenuDataUpdated: (callback) => ipcRenderer.on('menu-data-updated', (_event, value) => callback(value)),
    removeMenuDataUpdatedListener: (callback) => ipcRenderer.removeListener('menu-data-updated', callback)
});