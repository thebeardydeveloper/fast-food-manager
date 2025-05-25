# Fast Food Manager

Fast Food Manager is a comprehensive, cross-platform desktop Point of Sale (POS) application developed with Electron. It is designed to streamline order processing, menu management, and provide sales insights for fast-food establishments. The application features a modern user interface styled with Tailwind CSS and utilizes local JSON files for data persistence.

---

## Features

Fast Food Manager offers a robust set of features to manage daily restaurant operations:

### 🍽️ Point of Sale & Order Processing
* **Categorized Menu Display:** Presents menu items with images, names, and prices, organized into user-defined categories accessible via tabs.
* **Drag & Drop Order Building:** Allows users to easily add items to an order by dragging them from the menu panel.
* **Item Customization:** Supports specifying item quantity and adding special notes for individual items before they are added to the order.
* **Dynamic Order Panel:** Clearly lists all items in the current order, including quantity, price, applied notes, and line totals.
* **Order Modification:** Enables editing of item quantity and notes, as well as removal of items from an active order.
* **Real-time Calculations:** Automatically computes and displays the subtotal, applicable tax (based on a configurable flat rate), and the final order total.
* **Customer Information:** Provides fields for capturing customer name, address, and phone number for delivery orders. A simplified mode is available for take-away orders.
* **Delivery Assignment:** Allows selection of a delivery person from a pre-defined list for delivery orders.
* **Order Finalization:**
    * Saves completed order details to a local JSON log file for record-keeping and reporting.
    * Clears the current order interface for the next transaction.
    * Supports basic receipt printing.
* **Draft Order Recovery:** Automatically saves the state of an in-progress order to prevent data loss and allows restoration upon application restart.
* **Offline Capability:** Designed to function fully offline with all data stored locally.

### ⚙️ Restaurant & Menu Management (Admin Panel)
* **General Settings Configuration:**
    * Update restaurant name, tax rate, and currency symbol.
    * Manage a list of delivery personnel (add/remove).
* **In-App Menu Management (CRUD Operations):**
    * **Category Management:** Add, edit, and delete menu categories. Deletion includes a check to prevent removal if categories are in use by menu items.
    * **Menu Item Management:** Add, edit, and delete menu items, including their name, price, image path, and assigned category.
    * Changes are saved directly to the local `menu.json` file.

### 📜 Order History & Reporting
* **Completed Order Viewing:** A dedicated interface to list all past orders, with the ability to view detailed information for any selected order.
* **Basic Daily Sales Report:** Displays total sales and number of orders for the current day.
* **Detailed Reports:**
    * **Top Selling Items:** Identifies best-performing menu items based on quantity sold within selectable date ranges (Today, Last 7 Days, Last 30 Days, All Time).
    * **Sales by Category:** Provides a breakdown of total sales revenue for each menu category within the selected date ranges.

### 💻 Technical Details
* **Cross-Platform:** Developed with [Electron.js](https://www.electronjs.org/).
* **Modern UI:** Styled using [Tailwind CSS](https://tailwindcss.com/).
* **Local Data Persistence:** Utilizes JSON files for storing menu, settings, and order logs.
* **Secure IPC:** Implements secure Inter-Process Communication using Electron's `contextBridge`.

---

## 🚀 Getting Started

To run Fast Food Manager from the source code, follow these steps:

**Prerequisites:**
* [Node.js](https://nodejs.org/) (which includes npm)
* Git

**Installation & Setup:**

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/thebeardydeveloper/fast-food-manager.git](https://github.com/thebeardydeveloper/fast-food-manager.git)
    cd fast-food-manager
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Build Tailwind CSS:**
    The application uses Tailwind CSS, which needs to be compiled.
    * For a one-time production build:
        ```bash
        npm run build:css:prod
        ```
    * For development (watches for changes and rebuilds automatically - run in a separate terminal):
        ```bash
        npm run build:css
        ```

4.  **Run the application in development mode:**
    This command typically also runs the CSS build script if not already running.
    ```bash
    npm start
    ```
    Or, if you have a specific development script that assumes CSS is being watched separately:
    ```bash
    npm run dev
    ```
    To open Developer Tools, uncomment the line `mainWindow.webContents.openDevTools();` in `main.js`.

---

## 🔮 Future Enhancements

The following features are planned or considered for future versions:

* **Application Packaging:** Creation of distributable installers for Windows, macOS, and Linux using `electron-builder`.
* **Item Variations & Modifiers:** Support for different sizes, toppings, or other options with potential price adjustments.
* **On-Hold Orders:** Ability to temporarily save an order and recall it later.
* **Advanced Reporting:**
    * Graphical data representation (charts).
    * Custom date range selection for reports.
    * Exporting reports (e.g., to CSV or PDF).
* **User Interface Themes:** e.g., Dark mode.

---

## 🤝 Contributing

Contributions are welcome. Please feel free to fork the repository, make your changes, and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

---

## 📜 License

Please specify your project's license here. For example:
This project is licensed under the MIT License - see the `LICENSE.md` file for details (if you create one).