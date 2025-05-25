const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const userDataPath = app.getPath('userData');
const menuFilePath = path.join(userDataPath, 'menu.json');
const settingsFilePath = path.join(userDataPath, 'settings.json');
const ordersLogDir = path.join(userDataPath, 'orders_log');
const draftOrderPath = path.join(userDataPath, 'current_order_draft.json');

const defaultMenuPath = app.isPackaged ? path.join(process.resourcesPath, 'data_defaults', 'menu.json') : path.join(__dirname, 'data_defaults', 'menu.json');
const defaultSettingsPath = app.isPackaged ? path.join(process.resourcesPath, 'data_defaults', 'settings.json') : path.join(__dirname, 'data_defaults', 'settings.json');

function ensureDataFilesExist() {
    try {
        if (!fs.existsSync(userDataPath)) {
            fs.mkdirSync(userDataPath, { recursive: true });
        }
        if (!fs.existsSync(ordersLogDir)) {
            fs.mkdirSync(ordersLogDir, { recursive: true });
        }

        const dataDefaultsDir = app.isPackaged ? path.join(process.resourcesPath, 'data_defaults') : path.join(__dirname, 'data_defaults');
        if (!fs.existsSync(dataDefaultsDir)) {
            if (!app.isPackaged) fs.mkdirSync(dataDefaultsDir, { recursive: true });
        }

        if (!fs.existsSync(menuFilePath)) {
            if (fs.existsSync(defaultMenuPath)) {
                fs.copyFileSync(defaultMenuPath, menuFilePath);
            } else {
                fs.writeFileSync(menuFilePath, JSON.stringify({ categories: [], items: [] }, null, 2));
            }
        }

        if (!fs.existsSync(settingsFilePath)) {
            if (fs.existsSync(defaultSettingsPath)) {
                fs.copyFileSync(defaultSettingsPath, settingsFilePath);
            } else {
                fs.writeFileSync(settingsFilePath, JSON.stringify({ taxRate: 0, currencySymbol: '$', deliveryPersonnel: [], restaurantName: "POS System" }, null, 2));
            }
        }
    } catch (error) {
        console.error('Error ensuring data files:', error);
    }
}

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
        icon: path.join(__dirname, 'assets', 'icon.png')
    });

    mainWindow.loadFile('index.html');
    // mainWindow.webContents.openDevTools(); // Descomentar para desarrollo
}

app.whenReady().then(() => {
    ensureDataFilesExist();
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.handle('load-menu-items', async () => {
    try {
        if (!fs.existsSync(menuFilePath)) {
            if(fs.existsSync(defaultMenuPath)) {
                const data = fs.readFileSync(defaultMenuPath, 'utf-8');
                return JSON.parse(data);
            }
            return { categories: [], items: [] };
        }
        const data = fs.readFileSync(menuFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Failed to load menu items:', error);
        dialog.showErrorBox('Error Loading Menu', `Could not load menu items. Error: ${error.message}`);
        return { categories: [], items: [] };
    }
});

ipcMain.handle('load-settings', async () => {
    try {
        if (!fs.existsSync(settingsFilePath)) {
            if(fs.existsSync(defaultSettingsPath)) {
                const data = fs.readFileSync(defaultSettingsPath, 'utf-8');
                return JSON.parse(data);
            }
            return { taxRate: 0, currencySymbol: '$', deliveryPersonnel: [], restaurantName: "POS (Default Settings)" };
        }
        const data = fs.readFileSync(settingsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Failed to load settings:', error);
        dialog.showErrorBox('Error Loading Settings', `Could not load settings. Error: ${error.message}`);
        return { taxRate: 0, currencySymbol: '$', deliveryPersonnel: [], restaurantName: "POS (Settings Error)" };
    }
});

ipcMain.handle('save-settings', async (event, newSettings) => {
    try {
        fs.writeFileSync(settingsFilePath, JSON.stringify(newSettings, null, 2));
        BrowserWindow.getAllWindows().forEach(win => {
            win.webContents.send('settings-updated', newSettings);
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to save settings:', error);
        dialog.showErrorBox('Error Saving Settings', `Could not save settings. Error: ${error.message}`);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('save-menu-data', async (event, newMenuData) => {
    try {
        if (!newMenuData || !Array.isArray(newMenuData.categories) || !Array.isArray(newMenuData.items)) {
            return { success: false, error: 'Invalid menu data structure.' };
        }
        fs.writeFileSync(menuFilePath, JSON.stringify(newMenuData, null, 2));
        BrowserWindow.getAllWindows().forEach(win => {
            win.webContents.send('menu-data-updated', newMenuData);
        });
        return { success: true, menuData: newMenuData };
    } catch (error) {
        console.error('Failed to save menu data:', error);
        dialog.showErrorBox('Error Saving Menu', `Could not save menu data. Error: ${error.message}`);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('get-report-data', async (event, reportType, dateRangePreset) => {
    try {
        let localMenuData = { categories: [], items: [] };
        if (fs.existsSync(menuFilePath)) {
            localMenuData = JSON.parse(fs.readFileSync(menuFilePath, 'utf-8'));
        }

        const getStartDate = (preset) => {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            if (preset === 'today') return now;
            if (preset === 'last7days') {
                const d = new Date(now);
                d.setDate(d.getDate() - 6);
                return d;
            }
            if (preset === 'last30days') {
                const d = new Date(now);
                d.setDate(d.getDate() - 29);
                return d;
            }
            if (preset === 'allTime') return new Date(0);
            return now;
        };

        const startDate = getStartDate(dateRangePreset);
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        if (!fs.existsSync(ordersLogDir)) {
            fs.mkdirSync(ordersLogDir, { recursive: true });
            return { success: true, data: [], reportType: reportType, message: "Orders log directory was missing or empty." };
        }

        const orderFiles = fs.readdirSync(ordersLogDir);
        const relevantOrders = [];

        for (const file of orderFiles) {
            if (file.startsWith('order_') && file.endsWith('.json')) {
                try {
                    const filePath = path.join(ordersLogDir, file);
                    const orderData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                    const orderTimestamp = new Date(orderData.timestamp);
                    if (orderTimestamp >= startDate && orderTimestamp <= endDate) {
                        relevantOrders.push(orderData);
                    }
                } catch (err) {
                    console.error(`Error reading or parsing order file ${file}:`, err);
                }
            }
        }

        if (reportType === 'topSellingItems') {
            const itemCounts = {};
            relevantOrders.forEach(order => {
                (order.items || []).forEach(item => {
                    itemCounts[item.menuItemId] = (itemCounts[item.menuItemId] || 0) + item.quantity;
                });
            });
            const reportData = Object.entries(itemCounts)
                .map(([menuItemId, quantity]) => {
                    const menuItemDetails = localMenuData.items.find(i => i.id === menuItemId);
                    return {
                        itemId: menuItemId,
                        name: menuItemDetails ? menuItemDetails.name : `Unknown Item (ID: ${menuItemId})`,
                        quantitySold: quantity,
                    };
                })
                .sort((a, b) => b.quantitySold - a.quantitySold)
                .slice(0, 20);
            return { success: true, data: reportData, reportType };

        } else if (reportType === 'salesByCategory') {
            const categorySales = {};
            relevantOrders.forEach(order => {
                (order.items || []).forEach(item => {
                    const menuItemDetails = localMenuData.items.find(i => i.id === item.menuItemId);
                    if (menuItemDetails && menuItemDetails.categoryId) {
                        const categoryId = menuItemDetails.categoryId;
                        const itemTotalSales = item.quantity * item.unitPrice;
                        categorySales[categoryId] = (categorySales[categoryId] || 0) + itemTotalSales;
                    } else if (menuItemDetails) {
                        const uncatId = 'uncategorized';
                        const itemTotalSales = item.quantity * item.unitPrice;
                        categorySales[uncatId] = (categorySales[uncatId] || 0) + itemTotalSales;
                    }
                });
            });
            const reportData = Object.entries(categorySales)
                .map(([categoryId, totalSales]) => {
                    let categoryName = `Unknown Category (ID: ${categoryId})`;
                    if (categoryId === 'uncategorized') {
                        categoryName = 'Uncategorized Items';
                    } else {
                        const categoryDetails = localMenuData.categories.find(c => c.id === categoryId);
                        if (categoryDetails) categoryName = categoryDetails.name;
                    }
                    return {
                        categoryId: categoryId,
                        name: categoryName,
                        totalSales: totalSales,
                    };
                })
                .sort((a, b) => b.totalSales - a.totalSales);
            return { success: true, data: reportData, reportType };
        }
        return { success: false, error: 'Unknown report type' };
    } catch (error) {
        console.error(`Error generating report ${reportType}:`, error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('save-order', async (event, orderData) => {
    try {
        const orderId = `order_${new Date().toISOString().replace(/[-:.]/g, '')}.json`;
        const filePath = path.join(ordersLogDir, orderId);
        fs.writeFileSync(filePath, JSON.stringify(orderData, null, 2));
        if (fs.existsSync(draftOrderPath)) {
            fs.unlinkSync(draftOrderPath);
        }
        return { success: true, orderId };
    } catch (error) {
        console.error('Failed to save order:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.on('print-receipt', (event, receiptHtmlContent) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
        const printWindow = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: false, contextIsolation: false }});
        printWindow.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(receiptHtmlContent));
        printWindow.webContents.on('did-finish-load', () => {
            printWindow.webContents.print({}, (success, failureReason) => {
                if (!success) console.log("Printing failed:", failureReason);
                printWindow.close();
            });
        });
    }
});

ipcMain.on('save-draft-order', (event, draftData) => {
    try {
        fs.writeFileSync(draftOrderPath, JSON.stringify(draftData, null, 2));
    } catch (error) {
        console.error('Failed to save draft order:', error);
    }
});

ipcMain.handle('load-draft-order', async () => {
    try {
        if (fs.existsSync(draftOrderPath)) {
            const data = fs.readFileSync(draftOrderPath, 'utf-8');
            return JSON.parse(data);
        }
        return null;
    } catch (error) {
        console.error('Failed to load draft order:', error);
        return null;
    }
});

ipcMain.handle('get-daily-sales-report', async () => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        let totalSales = 0;
        let ordersCount = 0;
        if (!fs.existsSync(ordersLogDir)) fs.mkdirSync(ordersLogDir, {recursive: true});
        const files = fs.readdirSync(ordersLogDir);
        files.forEach(file => {
            if (file.startsWith('order_') && file.endsWith('.json')) {
                const filePath = path.join(ordersLogDir, file);
                const orderData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                if (orderData.timestamp && orderData.timestamp.startsWith(today)) {
                    totalSales += orderData.totalAmount || 0;
                    ordersCount++;
                }
            }
        });
        return { date: today, totalSales, ordersCount };
    } catch (error) {
        console.error('Failed to get daily sales report:', error);
        return { date: new Date().toISOString().slice(0, 10), totalSales: 0, ordersCount: 0, error: error.message };
    }
});

ipcMain.handle('confirm-action', async (event, message) => {
    const focusedWindow = BrowserWindow.fromWebContents(event.sender);
    const result = await dialog.showMessageBox(focusedWindow, {
        type: 'question', buttons: ['Cancel', 'OK'], defaultId: 1,
        title: 'Confirm Action', message: message || 'Are you sure?',
    });
    return result.response === 1;
});

ipcMain.handle('list-order-files', async () => {
    try {
        if (!fs.existsSync(ordersLogDir)) fs.mkdirSync(ordersLogDir, {recursive: true});
        const files = fs.readdirSync(ordersLogDir)
            .filter(file => file.startsWith('order_') && file.endsWith('.json'))
            .map(file => ({ filename: file }))
            .sort((a, b) => b.filename.localeCompare(a.filename));
        return files;
    } catch (error) {
        console.error('Failed to list order files:', error);
        return { error: error.message };
    }
});

ipcMain.handle('get-order-details', async (event, filename) => {
    try {
        const filePath = path.join(ordersLogDir, filename);
        if (!fs.existsSync(filePath)) return { error: 'Order file not found.' };
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Failed to read order file ${filename}:`, error);
        return { error: error.message };
    }
});