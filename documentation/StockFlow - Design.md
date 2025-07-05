# 1. Introduction

## 1.1 Project Context

The client, Lisa Monroe, is an Area Manager at a fashion retail company named *Shadex*. She is responsible for overseeing inventory across multiple store locations. Currently, she travels in person to collect handwritten stock reports from each store. This process is inefficient, prone to human error, and often leads to delays in stock reporting and decision-making.

The client expressed a need for a desktop application that allows her to remotely manage and monitor store inventory, reduce manual effort, and improve reporting accuracy and responsiveness.

## 1.2 Problem Statement

The client's existing workflow is manual and unstructured:
- Store employees prepare physical stock reports, which are collected during in-person visits
- Errors in data entry frequently occur and require time-consuming correction
- Stock levels are not consistently updated or monitored in real-time
- There is no automated mechanism to flag low stock or trigger timely restocking

These issues reduce productivity and impair timely operational decisions.

## 1.3 Project Objective

The objective of this project is to design and implement **StockFlow**, a standalone Java-based desktop application that will allow the client to:
- Log in securely to access the system
- Select a store location and view its inventory in a tabular format
- Add, remove, or modify product entries in the inventory
- Adjust stock levels for individual products
- Receive **automated low-stock alerts via email**
- Generate structured product reports and export them in CSV format

## 1.4 Constraints

- The application will be developed in **Java** using the **Swing** GUI toolkit
- Data will be stored locally in a **SQLite** database file (`stockflow.db`)
- The application will operate entirely on the client’s desktop (no networked database)
- Email alerts will be sent using the **client’s configured SMTP server** via the Jakarta Mail (JavaMail) API
- The user interface will be designed to be intuitive and user-friendly for non-technical users

# 2. System Overview

## 2.1 Application Summary

**StockFlow** is a desktop-based inventory management system designed to help retail managers monitor and maintain product stock levels across store locations. The system streamlines stock reporting, automates low-stock alerts, and allows real-time updates to the product database. It is intended to replace a manual, paper-based workflow with a secure, responsive, and user-friendly application.

The application will feature:
- A login system for user authentication
- Store selection and inventory viewing
- Full CRUD (Create, Read, Update, Delete) functionality for products
- CSV report generation for offline archiving and review
- Automated low-stock email notifications using the Jakarta Mail API

## 2.2 Technical Architecture

StockFlow will be developed using the following components:

| Layer | Component | Description |
|-------|-----------|-------------|
| **User Interface** | Java Swing | GUI forms and dialogs for login, home page, product management, alerts |
| **Business Logic** | Java classes | Encapsulates validation, stock adjustment logic, CSV generation, etc. |
| **Database Layer** | SQLite (via JDBC) | Stores users, products, stock levels, and sales data in a local `.db` file |
| **Email Subsystem** | Jakarta Mail (JavaMail API) | Sends automated low-stock alerts via SMTP |
| **File Output** | Java I/O | Used for exporting inventory reports in CSV format |

## 2.3 Key Functional Components

- **Authentication Module**  
  Verifies user credentials against stored records in the SQLite database.

- **Inventory Module**  
  Displays current stock by store, allows add/remove/edit of product entries.

- **Stock Adjustment Module**  
  Allows quantity to be incremented or decremented; triggers email alerts if below threshold.

- **Report Module**  
  Compiles product data and generates CSV reports, including revenue metrics.

- **Alert Module**  
  Detects low-stock conditions and sends email notifications to the client.

## 2.4 Target Environment

- Operating System: macOS (Sequoia)
- Runtime: Java SE 17
- Development Environment: Eclipse IDE
- Dependencies: SQLite JDBC, Jakarta Mail
- Database File: `stockflow.db`, located locally alongside the application

# 3. Database Design

## 3.1 Overview

The StockFlow application uses a single embedded SQLite database file (`stockflow.db`) to store all persistent data. This database structure has been designed to support multi-location inventory tracking, role-based user access, low-stock alerting, and transaction logging.

The schema emphasizes:

- **Normalization**: Avoiding redundancy by separating products, locations, stock levels, and users.
- **Auditability**: Through transaction and alert tables that log every significant change.
- **Scalability**: Ability to support additional users, stores, or features without restructuring.
- **Security**: Restricting data access through a `user_locations` access control mapping.

## 3.2 Entity Relationship Diagram (ERD)

The following tables form the core schema of the StockFlow system:

### Core Tables and Relationships

| Table           | Description                                      |
|------------------|--------------------------------------------------|
| `users`          | Stores login credentials and role information   |
| `locations`      | Represents each physical store location         |
| `products`       | Stores product details                          |
| `stock`          | Maps product availability per store             |
| `alerts`         | Records low-stock alert events                  |
| `transactions`   | Tracks changes to stock levels and user actions |
| `user_locations` | Maps users to permitted store locations         |

### Key Relationships

- Each `stock` row links a `product` to a `location`
- `transactions` reference both `stock` and `user`
- `alerts` link a `product` to a `location`
- `user_locations` maps users to the locations they can access
- Users with no entry in `user_locations` are treated as having access to all stores, but their permissions are still determined by their `role`

## 3.3 Table Definitions

### `users`

Stores information about users who can log in and use the system.

| Column     | Type     | Description                                          |
|------------|----------|------------------------------------------------------|
| `id`       | INTEGER  | Unique identifier for each user                      |
| `username` | TEXT     | Chosen login name                                    |
| `password` | TEXT     | Password for logging in (can be stored securely)     |
| `email`    | TEXT     | Email address used for notifications (if needed)     |
| `role`     | TEXT     | User role, such as `admin` or `staff`                |

---

### `locations`

Represents each store or physical branch.

| Column    | Type    | Description                                |
| --------- | ------- | ------------------------------------------ |
| `id`      | INTEGER | Unique identifier for the location         |
| `name`    | TEXT    | Name of the store (e.g. "Oxford Street")   |
| `code`    | TEXT    | Optional short code for internal reference |
| `address` | TEXT    | Address of the store                       |

---

### `products`

Holds details about items that can be stocked and sold.

| Column        | Type    | Description                          |
|---------------|---------|--------------------------------------|
| `id`          | INTEGER | Unique ID for each product           |
| `name`        | TEXT    | Product name                         |
| `description` | TEXT    | Description or notes about the item  |
| `price`       | REAL    | Selling price per unit               |
| `sku`         | TEXT    | Optional product code or barcode     |

---

### `stock`

Keeps track of how many units of each product are available at each store.

| Column            | Type    | Description                                        |
| ----------------- | ------- | -------------------------------------------------- |
| `id`              | INTEGER | Unique ID for this stock record                    |
| `product_id`      | INTEGER | Link to the product being stored                   |
| `location_id`     | INTEGER | Link to the store where the product is located     |
| `quantity`        | INTEGER | Current number of units in stock                   |
| `amount_sold`     | INTEGER | Total units sold so far from this location         |
| `low_stock_level` | INTEGER | Level below which a low-stock alert should trigger |

---

### `alerts`

Used to record when stock levels fall below the warning level.

| Column         | Type     | Description                                     |
|----------------|----------|-------------------------------------------------|
| `id`           | INTEGER  | Unique ID for the alert                         |
| `product_id`   | INTEGER  | Which product the alert is about                |
| `location_id`  | INTEGER  | Which store the alert applies to                |
| `timestamp`    | TEXT     | Date and time when the alert was triggered      |
| `stock_level`  | INTEGER  | Quantity in stock when the alert happened       |
| `status`       | TEXT     | Whether the alert has been sent or handled      |

---

### `transactions`

Records all changes made to the stock, such as adding or removing items.

| Column           | Type     | Description                                       |
|------------------|----------|---------------------------------------------------|
| `id`             | INTEGER  | Unique ID for the transaction                     |
| `stock_id`       | INTEGER  | Which stock record was affected                   |
| `user_id`        | INTEGER  | Who made the change                               |
| `action_type`    | TEXT     | Type of action (e.g. `add`, `remove`, `sale`)     |
| `quantity_change`| INTEGER  | Number of units added or removed                  |
| `timestamp`      | TEXT     | Date and time of the change                       |
| `note`           | TEXT     | Optional comment explaining the reason            |

---

### `user_locations`

Controls which users can see which store locations.

| Column        | Type     | Description                                       |
|---------------|----------|---------------------------------------------------|
| `user_id`     | INTEGER  | User who is being granted access                  |
| `location_id` | INTEGER  | Store location they can access                    |

> **Note:**  
> If a user is **not listed** in this table at all, they will be able to see **all** store locations. However, their abilities (such as viewing or editing) still depend on their `role` in the `users` table.


## 3.4 Design Rationale

The database was designed to make the system efficient, flexible, and easy to maintain. The structure allows the inventory system to support multiple users, locations, and types of activity without needing to change the design later.

### Key Design Decisions

- **Separation of Data**: Each type of information (like users, products, locations, stock levels) is stored in its own table. This makes the system more organised and reduces repetition.

- **Multi-location Support**: Products can be stored in more than one location. The `stock` table connects products and locations so that each store has its own stock levels.

- **User Access Control**: Not all users need access to all stores. The `user_locations` table allows the system to limit which users can see or edit which locations, depending on their role.

- **Alerts for Low Stock**: The `alerts` table makes it possible to track when items fall below a minimum level. This can be used to send email notifications or show warnings in the interface.

- **Full History of Changes**: The `transactions` table records every change made to the stock, including who made the change, when it happened, and what the reason was. This helps prevent mistakes and supports accountability.

- **Easy to Expand**: If new features are needed later (such as suppliers, order tracking, or barcodes), new tables can be added without changing the existing ones.

### Benefits of This Design

- Clean structure that’s easy to query and update
- Allows users to be restricted to certain stores
- Makes it possible to send alerts automatically
- Keeps a full log of actions for security and audit purposes
- Works well for both small and larger businesses

This database design provides a strong foundation for building a real-world inventory management system that can grow over time.

# 4. System Architecture

## 4.1 Overview

The StockFlow system is a standalone desktop application built using the Java programming language. It stores all data in a local SQLite database file and uses a graphical user interface (GUI) to allow users to view and update information about products, stock levels, and alerts.

The system follows a simple but effective architecture, which separates different parts of the program so they are easier to understand, test, and maintain.

## 4.2 Main Components

### 1. **User Interface (UI)**

- Created using Java Swing
- Shows forms, tables, and buttons for interacting with the system
- Allows users to log in, view stock, edit products, and perform actions

### 2. **Application Logic**

- Processes user actions (e.g. logging in, adding stock)
- Handles rules such as checking for low stock or access control
- Coordinates between the UI and the database

### 3. **Database Layer**

- Connects to a local SQLite database file (`stockflow.db`)
- Reads and writes data using SQL commands
- Uses JDBC (Java Database Connectivity) to communicate with the database

### 4. **Email Notification System**

- Sends out emails when stock levels are too low
- Uses the Jakarta Mail (JavaMail) library to connect to an email server
- Can be turned off or replaced with a simple message if needed

## 4.3 Technology Stack

| Layer                | Technology              |
| -------------------- | ----------------------- |
| Programming Language | Java 17                 |
| GUI Framework        | Java Swing              |
| Database             | SQLite (local file)     |
| Database Access      | JDBC                    |
| Email Library        | Jakarta Mail (optional) |
| Development Tool     | Eclipse IDE             |
| Platform             | macOS Sequoia           |

## 4.4 Data Flow Summary

1. User logs in via the login screen
2. The application checks credentials using the `users` table
3. After login, the user sees only the store locations they are allowed to access
4. Any stock changes made by the user are saved to the database
5. If the quantity of a product falls below its low-stock threshold:
   - A new alert is added to the `alerts` table
   - An email is sent to the appropriate users (if enabled)
6. All changes are logged in the `transactions` table

## 4.5 Deployment

- The system runs on a single computer
- No internet is needed except for email alerts
- All data is stored locally in one `.db` file


# 5. Data Flow and Interaction Design

## 5.1 Use Case Diagram

This diagram shows the main interactions between different types of users (admin and regular users) and the features of the system.

![[stockflow-use-case-diagram.png | left | 600]]

> 💡 **Notes**
> - "User" includes both staff and admin roles.
> - Admins can manage user access and store permissions.
> - The system automatically sends email alerts when stock is low.

### 5.2 Sequence Diagram

The following sequence diagram shows the core interactions between users, the UI, the database, and supporting services such as alerting and email. It captures the main use cases for both regular users and administrators.

![[stockflow-sequence-diagram.png|left|800]]

### 5.3 System Data Flow Diagram

This diagram shows how data moves between users, the StockFlow system, the underlying database, and the email server. It represents the major interactions that take place when users view stock, record transactions, or when administrators manage the system.

![[stockflow-dataflow.png]]

### 5.5 Entity Relationship Diagram (ERD)

This UML-style Entity Relationship Diagram shows the structure of the StockFlow database. It includes all major entities (tables), their attributes, and the relationships between them. 

The diagram illustrates how users interact with the system, how stock is tracked across locations, and how alerts and transactions are recorded in response to inventory changes.

![[stockflow-erd.png|800]]

# 6. User Interface Design and Screen Structure

## 6.1 Overview

The StockFlow user interface has been designed to provide clear and efficient access to inventory management functions while implementing appropriate role-based access control. The interface uses a hierarchical navigation structure that guides users through a logical sequence from login through store selection to specific inventory operations.

The screen design follows these key principles:

- **Clarity**: Clean, uncluttered layouts with clear visual hierarchy to reduce user confusion
- **Efficiency**: Minimising the number of clicks required to complete common tasks
- **Role-Based Access**: Dynamic interface that shows or hides functionality based on user permissions
- **Consistency**: Standardised navigation patterns and visual elements throughout the application

## 6.2 Screen Categories and Organization

### 6.2.1 Authentication and Navigation Screens

These screens handle user authentication and provide the main navigation structure for the application.

|Screen|Purpose|User Access|
|---|---|---|
|Login Screen|Authenticate users and verify their role in the system|All users (before authentication)|
|Main Dashboard|Central hub for navigation and system overview|All authenticated users|
|Store Selection Screen|Allow users to choose which store location to work with|Users with access to multiple stores|

### 6.2.2 Inventory Management Screens

These screens provide the core inventory viewing and transaction recording functionality that addresses the client's main requirements.

|Screen|Purpose|User Access|
|---|---|---|
|Inventory Overview Screen|Display current stock levels for the selected store|All authenticated users|
|Record Sale Screen|Process sales transactions and automatically reduce stock quantities|All authenticated users|
|Record Purchase Screen|Record new stock arrivals and update inventory levels|All authenticated users|
|Stock Adjustment Screen|Allow manual stock corrections with full audit trail|Administrator users only|

### 6.2.3 Data Management Screens

These screens handle product information management, low-stock alerts, and report generation capabilities.

|Screen|Purpose|User Access|
|---|---|---|
|Product Management Screen|Add, edit, and configure product details and settings|Administrator and authorized staff users|
|Alerts Dashboard Screen|Monitor and manage low-stock notifications|All authenticated users|
|Reports Screen|Generate and export inventory reports in CSV format|All authenticated users|

### 6.2.4 Administrative Screens

These screens provide system administration capabilities for managing users and store locations.

|Screen|Purpose|User Access|
|---|---|---|
|User Management Screen|Create and manage user accounts and their permissions|Administrator users only|
|Location Management Screen|Configure store locations and their details|Administrator users only|

## 6.3 Detailed Screen Specifications

### 6.3.1 Login Screen

- **Main Purpose**: Authenticate users and establish their session within the application
- **Key Components**: Username input field, password input field, login button, error message display area
- **Navigation Flow**: Successfully authenticated users are redirected to the Main Dashboard
- **Security Features**: Failed login attempts are recorded in the database, with basic protection against repeated login attempts

### 6.3.2 Main Dashboard

- **Main Purpose**: Serve as the central navigation point and provide an overview of system status
- **Key Components**:
    - Navigation menu that adapts based on user role
    - Summary statistics (number of accessible stores, current alert count)
    - Recent activity display showing latest transactions
    - Quick action buttons for frequently used functions
- **Navigation Flow**: Provides access to all other screens in the application
- **Customization**: Interface elements are shown or hidden based on the user's role and store access permissions

### 6.3.3 Store Selection Screen

- **Main Purpose**: Allow users to choose which store location they want to work with
- **Key Components**:
    - Display of stores in either grid or list format
    - Search functionality and filtering options
    - Status indicators showing alerts or last update times for each store
- **Navigation Flow**: Selecting a store leads to the Inventory Overview screen for that location
- **Access Control**: Only shows stores that the user has permission to access (based on the user_locations table)

### 6.3.4 Inventory Overview Screen

- **Main Purpose**: Display a comprehensive view of all products and their stock levels for the selected store
- **Key Components**:
    - Sortable table displaying products with current stock quantities
    - Visual indicators for low-stock situations (colour coding or icons)
    - Quick action buttons for Record Sale and Record Purchase functions
    - Search and filter functionality to find specific products
    - Updated display when returning from transaction screens
- **Navigation Flow**: Acts as the main hub for accessing all transaction-related screens
- **Data Display**: Shows product quantities, low-stock threshold levels, and total sales data

### 6.3.5 Record Sale Screen

- **Main Purpose**: Process sales transactions and automatically update inventory levels
- **Key Components**:
    - Product selection interface with search capability
    - Quantity input fields with validation to prevent errors
    - Transaction summary showing the total before confirmation
    - Preview of how stock levels will change after the sale
- **Navigation Flow**: Returns to Inventory Overview screen with a confirmation message
- **Input Validation**: Prevents users from selling more items than are currently in stock, requires positive quantity values

### 6.3.6 Record Purchase Screen

- **Main Purpose**: Add newly received stock to the inventory system
- **Key Components**:
    - Interface for entering multiple products in one purchase (bulk entry)
    - Quantity and cost tracking for each item
    - Optional supplier information fields
    - Capability to process multiple products at once
- **Navigation Flow**: Returns to Inventory Overview screen with confirmation of successful update
- **Additional Features**: Allows users to add new products to the system during the purchase recording process

### 6.3.7 Stock Adjustment Screen (Administrator Only)

- **Main Purpose**: Allow manual corrections to stock levels with full audit trail for accountability
- **Key Components**:
    - Product selection interface showing current stock levels
    - Input field for adjustment quantity (can be positive or negative)
    - Required text field for explaining the reason for the adjustment
    - Administrator authorization confirmation step
- **Navigation Flow**: Returns to Inventory Overview screen with the adjustment properly logged
- **Security Implementation**: All adjustments are recorded in the transactions table with the administrator's user ID for audit purposes

### 6.3.8 Product Management Screen

- **Main Purpose**: Maintain the product catalog and configure product-specific settings
- **Key Components**:
    - Searchable and filterable list of all products in the system
    - Form interface for adding and editing product information (name, description, price, SKU)
    - Configuration settings for low-stock threshold levels
    - Interface for managing different prices across multiple store locations
- **Navigation Flow**: Accessible from the Main Dashboard screen
- **Advanced Features**: Bulk operations capability for updating multiple products simultaneously

### 6.3.9 Alerts Dashboard Screen

- **Main Purpose**: Monitor current low-stock situations and manage alert notifications
- **Key Components**:
    - Table of active alerts with severity level indicators
    - Historical view of past alerts and their resolution status
    - Configuration options for email notification settings
    - Bulk actions for managing multiple alerts at once
- **Navigation Flow**: Accessible from Main Dashboard and can appear as popup notifications when new alerts are generated
- **Data Updates**: Shows current alert status and updates when user returns to this screen after making stock changes

### 6.3.10 Reports Screen

- **Main Purpose**: Generate and export various types of inventory and sales reports
- **Key Components**:
    - Selection options for different report types (inventory status, sales data, transaction history)
    - Date range picker for specifying the time period to include
    - Filter options for specific stores and product categories
    - Export format selection (with CSV as the primary format)
    - Preview functionality to check report content before exporting
- **Navigation Flow**: Accessible from the Main Dashboard screen
- **Advanced Features**: Options for scheduled report generation and email delivery of reports

### 6.3.11 User Management Screen (Administrator Only)

- **Main Purpose**: Administer user accounts and configure access permissions throughout the system
- **Key Components**:
    - List of all users with their role indicators
    - Forms for adding new users and editing existing user information
    - Interface for assigning store access permissions to users
    - Password reset functionality for user account maintenance
- **Navigation Flow**: Accessible from the Admin section of the Main Dashboard
- **Audit Features**: All changes to user accounts are logged in the database for security audit purposes

### 6.3.12 Location Management Screen (Administrator Only)

- **Main Purpose**: Configure store locations and manage the organisational structure
- **Key Components**:
    - Complete list of store locations with their current details
    - Forms for adding new locations and editing existing location information
    - System for assigning and managing location codes
    - Interface for maintaining address and contact information for each store
- **Navigation Flow**: Accessible from the Admin section of the Main Dashboard
- **System Integration**: Links directly to user access permissions and inventory allocation functions

## 6.4 Navigation Flow and Screen Relationships

### 6.4.1 Standard User Navigation Path

```
Login → Main Dashboard → Store Selection → Inventory Overview → [Transaction Screens]
```

### 6.4.2 Administrator Navigation Path

```
Main Dashboard → Admin Functions → [User Management | Location Management]
```

### 6.4.3 Reporting and Monitoring Navigation Path

```
Main Dashboard → [Alerts Dashboard | Reports Screen | Product Management]
```

## 6.5 Design Standards and Implementation Guidelines

### 6.5.1 Responsive Layout Design

- Interface layout adapts to different screen sizes while maintaining full functionality
- Minimum supported screen resolution: 1024x768 pixels
- Table layouts include horizontal scrolling capability for smaller screens

### 6.5.2 Accessibility and Usability Standards

- Clear visual hierarchy implemented through consistent typography and spacing
- High contrast color schemes to ensure readability for all users
- Full keyboard navigation support for all interactive interface elements
- Compatibility with screen reading software for form fields and data tables

### 6.5.3 Error Handling and Input Validation

- Real-time validation with clear, specific error messages displayed inline
- Confirmation dialogs implemented for any actions that could result in data loss
- Graceful error handling when database connections are unavailable
- User-friendly error messages that include suggested solutions or next steps

### 6.5.4 Performance and User Experience Considerations

- Efficient database queries to ensure responsive interface interactions
- Pagination implementation for large datasets (products, transaction history) to improve screen loading times
- Clear loading indicators for operations that may take several seconds (large report generation)
- Local data storage ensures fast access to inventory information without network delays

## 6.6 System Integration Points

### 6.6.1 Database Integration

- All screens connect to the local SQLite database using JDBC for data access
- Transaction integrity is maintained across all screen interactions to prevent data corruption
- Data updates are immediately reflected in the interface when moving between screens

### 6.6.2 Email System Integration

- Alert-related screens interface with the Jakarta Mail library for sending notifications
- Configuration screens provided for SMTP server settings and email preferences
- Email delivery status tracking and comprehensive error handling for failed deliveries

### 6.6.3 File Export Integration

- Reports screen integrates with Java I/O libraries for CSV file generation
- User-friendly file location selection and save confirmation dialogs
- Progress indicators displayed for large dataset exports to provide user feedback


# 6.7 Login Screen Wireframe

<svg viewBox="0 0 1100 650" xmlns="http://www.w3.org/2000/svg"> <!-- Background --> <rect width="1100" height="650" fill="#e5e5e5"/> <!-- Title -->

<text x="550" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#333">StockFlow Login Screen</text>

<!-- Screen Container (optimized width) --> <rect x="50" y="60" width="550" height="480" rx="25" ry="25" fill="#f5f0e8" stroke="#333" stroke-width="3"/> <!-- StockFlow Title -->

<text x="325" y="150" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="bold" font-style="italic" fill="#333">StockFlow</text>

<!-- Username Label -->

<text x="100" y="220" font-family="Arial, sans-serif" font-size="14" font-weight="500" fill="#333">Username</text>

<!-- Username Field --> <rect x="100" y="230" width="380" height="50" rx="8" ry="8" fill="white" stroke="#ddd" stroke-width="2"/> <text x="115" y="258" font-family="Arial, sans-serif" font-size="14" fill="#999">Enter your username</text> <!-- Password Label -->

<text x="100" y="310" font-family="Arial, sans-serif" font-size="14" font-weight="500" fill="#333">Password</text>

<!-- Password Field --> <rect x="100" y="320" width="380" height="50" rx="8" ry="8" fill="white" stroke="#ddd" stroke-width="2"/> <text x="115" y="348" font-family="Arial, sans-serif" font-size="14" fill="#999">Enter your password</text> <!-- Error Message -->

<text x="100" y="395" font-family="Arial, sans-serif" font-size="13" font-style="italic" fill="#d32f2f">Username or Password is incorrect. Please try again!</text>

<!-- Login Button --> <rect x="100" y="420" width="380" height="50" rx="8" ry="8" fill="#d4a574"/> <text x="290" y="450" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white">LOGIN</text> <!-- Callout Numbers (consistent 30px gap from screen edge) --> <circle cx="630" cy="255" r="12" fill="#d32f2f"/> <text x="630" y="261" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">1</text> <circle cx="630" cy="345" r="12" fill="#d32f2f"/> <text x="630" y="351" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">2</text> <circle cx="630" cy="395" r="12" fill="#d32f2f"/> <text x="630" y="401" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">3</text> <circle cx="630" cy="445" r="12" fill="#d32f2f"/> <text x="630" y="451" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">4</text> <!-- Annotation Boxes (vertically centered with screen) --> <!-- Annotation 1 --> <rect x="720" y="90" width="340" height="90" rx="6" ry="6" fill="white" stroke="#666" stroke-width="1" filter="drop-shadow(2px 2px 6px rgba(0,0,0,0.15))"/> <circle cx="745" cy="115" r="12" fill="#d32f2f"/> <text x="745" y="121" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">1</text> <text x="770" y="120" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Username Field:</text> <text x="770" y="138" font-family="Arial, sans-serif" font-size="12" fill="#333">Modern input field with label and placeholder text.</text> <text x="770" y="154" font-family="Arial, sans-serif" font-size="12" fill="#333">Accepts alphanumeric characters, minimum 3 chars.</text> <text x="770" y="170" font-family="Arial, sans-serif" font-size="12" fill="#333">Validates input in real-time.</text> <!-- Annotation 2 --> <rect x="720" y="200" width="340" height="90" rx="6" ry="6" fill="white" stroke="#666" stroke-width="1" filter="drop-shadow(2px 2px 6px rgba(0,0,0,0.15))"/> <circle cx="745" cy="225" r="12" fill="#d32f2f"/> <text x="745" y="231" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">2</text> <text x="770" y="230" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Password Field:</text> <text x="770" y="248" font-family="Arial, sans-serif" font-size="12" fill="#333">Secure input with label above and placeholder text.</text> <text x="770" y="264" font-family="Arial, sans-serif" font-size="12" fill="#333">Input is masked with dots, minimum 6 characters.</text> <text x="770" y="280" font-family="Arial, sans-serif" font-size="12" fill="#333">Validates password strength requirements.</text> <!-- Annotation 3 --> <rect x="720" y="310" width="340" height="90" rx="6" ry="6" fill="white" stroke="#666" stroke-width="1" filter="drop-shadow(2px 2px 6px rgba(0,0,0,0.15))"/> <circle cx="745" cy="335" r="12" fill="#d32f2f"/> <text x="745" y="341" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">3</text> <text x="770" y="340" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Error Message (Error State Only):</text> <text x="770" y="358" font-family="Arial, sans-serif" font-size="12" fill="#333">Red italic text appears when authentication fails.</text> <text x="770" y="374" font-family="Arial, sans-serif" font-size="12" fill="#333">Hidden by default, shown after failed login attempt.</text> <text x="770" y="390" font-family="Arial, sans-serif" font-size="12" fill="#333">Clears when user starts typing in either field.</text> <!-- Annotation 4 --> <rect x="720" y="420" width="340" height="90" rx="6" ry="6" fill="white" stroke="#666" stroke-width="1" filter="drop-shadow(2px 2px 6px rgba(0,0,0,0.15))"/> <circle cx="745" cy="445" r="12" fill="#d32f2f"/> <text x="745" y="451" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">4</text> <text x="770" y="450" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Login Button:</text> <text x="770" y="468" font-family="Arial, sans-serif" font-size="12" fill="#333">Full-width modern button in brand colours.</text> <text x="770" y="484" font-family="Arial, sans-serif" font-size="12" fill="#333">Triggers database authentication via linear search.</text> <text x="770" y="500" font-family="Arial, sans-serif" font-size="12" fill="#333">Navigates to Main Dashboard on successful login.</text> </svg>

## 6.7.1 Component Specifications

### Username Field (Callout 1)

- **Field Type**: Text input field with clear label above
- **Placeholder Text**: "Enter your username" displayed in grey when field is empty
- **Visual Design**: White background with rounded corners and subtle border
- **Character Requirements**: Accepts letters and numbers, minimum 3 characters required
- **Field Behaviour**: Retains entered text if login fails to avoid re-typing

### Password Field (Callout 2)

- **Field Type**: Password input field that masks entered characters
- **Placeholder Text**: "Enter your password" displayed in grey when field is empty
- **Visual Design**: Matching style to username field for consistency
- **Security Display**: All typed characters shown as dots or asterisks
- **Character Requirements**: Minimum 6 characters required for security

### Error Message Area (Callout 3)

- **Display Condition**: Only visible after a failed login attempt
- **Message Content**: "Username or Password is incorrect. Please try again!"
- **Visual Design**: Red italic text to clearly indicate an error state
- **Position**: Located between password field and login button
- **Clearing Behaviour**: Disappears when user begins typing in either field

### Login Button (Callout 4)

- **Design**: Full-width button using brand colour (#d4a574)
- **Text**: "LOGIN" in white, bold capital letters for emphasis
- **Position**: Bottom of the form for logical flow
- **State Changes**: Displays pressed state when clicked
- **Function**: Submits credentials for verification when clicked

## 6.7.2 User Interaction Flow

### First-Time Access

1. User opens the application and sees the login screen
2. StockFlow branding displayed prominently at the top
3. Two empty input fields with clear labels and placeholder text
4. Login button visible at the bottom of the form

### Successful Login Process

1. User enters their username in the first field
2. User enters their password in the second field (characters masked)
3. User clicks the LOGIN button
4. System verifies the credentials
5. If valid, user is taken to the Main Dashboard
6. Dashboard displays with the user's name in welcome message

### Failed Login Process

1. User enters incorrect username or password
2. User clicks the LOGIN button
3. Error message appears in red below the password field
4. Input fields retain their content (password remains masked)
5. User can modify either field to try again
6. Error message disappears when user starts typing

### Visual Feedback

- **Input Fields**: Border highlights when field is active/selected
- **Button States**: Visual change when button is pressed
- **Error Display**: Clear red text for failed authentication
- **Field Validation**: Visual indicators for meeting requirements

## 6.7.3 Design Rationale

### Layout Decisions

- **Centered Design**: Login form centered on screen for focus
- **Vertical Layout**: Natural top-to-bottom flow for form completion
- **Adequate Spacing**: Generous padding prevents cramped appearance
- **Single Column**: Simple, clear path through the login process

### Visual Design Choices

- **Brand Consistency**: StockFlow logo/name prominently displayed
- **Neutral Background**: Beige (#f5f0e8) creates warm, professional appearance
- **Clear Typography**: Sans-serif fonts for better screen readability
- **Colour Usage**: Brand colour for button, red for errors only

### User Experience Considerations

- **Clear Labels**: Each field clearly labeled above the input
- **Helpful Placeholders**: Guide users on expected input format
- **Error Handling**: Non-specific error message for security (doesn't reveal if username exists)
- **Minimal Fields**: Only essential fields to reduce friction
- **Retained Input**: Username stays filled after failed attempt for convenience

### Accessibility Features

- **High Contrast**: Dark text on light backgrounds for readability
- **Large Click Targets**: Button and fields sized for easy interaction
- **Clear Error Messages**: Distinct colour and positioning for error visibility
- **Logical Tab Order**: Users can navigate form using keyboard alone

# 6.7 Main Dashboard Wireframe

<svg viewBox="0 0 1300 700" xmlns="http://www.w3.org/2000/svg"> <!-- Background --> <rect width="1300" height="700" fill="#e5e5e5"/> <!-- Title -->

<text x="650" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#333">StockFlow Main Dashboard</text>

<!-- Screen Container --> <rect x="50" y="60" width="700" height="580" rx="25" ry="25" fill="#f5f0e8" stroke="#333" stroke-width="3"/> <!-- Header Section --> <rect x="70" y="80" width="660" height="60" rx="8" ry="8" fill="#ffffff" stroke="#ddd" stroke-width="1"/> <text x="90" y="105" font-family="Arial, sans-serif" font-size="20" font-weight="bold" font-style="italic" fill="#333">StockFlow</text> <text x="90" y="125" font-family="Arial, sans-serif" font-size="12" fill="#666">Welcome back, Lisa Monroe</text> <rect x="620" y="95" width="90" height="30" rx="15" ry="15" fill="#d4a574"/> <text x="665" y="113" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">LOGOUT</text> <!-- Navigation Menu --> <rect x="70" y="160" width="200" height="460" rx="8" ry="8" fill="#ffffff" stroke="#ddd" stroke-width="1"/> <text x="90" y="185" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Navigation</text> <!-- Menu Items with better spacing --> <rect x="90" y="200" width="160" height="38" rx="4" ry="4" fill="#f8f9fa" stroke="#e9ecef" stroke-width="1"/> <text x="100" y="222" font-family="Arial, sans-serif" font-size="12" fill="#333">📍 Store Selection</text> <rect x="90" y="248" width="160" height="38" rx="4" ry="4" fill="#f8f9fa" stroke="#e9ecef" stroke-width="1"/> <text x="100" y="270" font-family="Arial, sans-serif" font-size="12" fill="#333">📦 Inventory Overview</text> <rect x="90" y="296" width="160" height="38" rx="4" ry="4" fill="#f8f9fa" stroke="#e9ecef" stroke-width="1"/> <text x="100" y="318" font-family="Arial, sans-serif" font-size="12" fill="#333">🛍️ Record Sale</text> <rect x="90" y="344" width="160" height="38" rx="4" ry="4" fill="#f8f9fa" stroke="#e9ecef" stroke-width="1"/> <text x="100" y="366" font-family="Arial, sans-serif" font-size="12" fill="#333">📋 Product Management</text> <rect x="90" y="392" width="160" height="38" rx="4" ry="4" fill="#f8f9fa" stroke="#e9ecef" stroke-width="1"/> <text x="100" y="414" font-family="Arial, sans-serif" font-size="12" fill="#333">⚠️ Alerts Dashboard</text> <rect x="90" y="440" width="160" height="38" rx="4" ry="4" fill="#f8f9fa" stroke="#e9ecef" stroke-width="1"/> <text x="100" y="462" font-family="Arial, sans-serif" font-size="12" fill="#333">📊 Reports</text> <!-- Admin Section Divider --> <line x1="90" y1="490" x2="250" y2="490" stroke="#ddd" stroke-width="1"/> <text x="90" y="510" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#666">Admin Only</text> <!-- Admin Menu Items with subtle highlighting --> <rect x="90" y="520" width="160" height="38" rx="4" ry="4" fill="#f5f5f5" stroke="#e0e0e0" stroke-width="1"/> <text x="100" y="542" font-family="Arial, sans-serif" font-size="12" fill="#333">👥 User Management</text> <rect x="90" y="568" width="160" height="38" rx="4" ry="4" fill="#f5f5f5" stroke="#e0e0e0" stroke-width="1"/> <text x="100" y="590" font-family="Arial, sans-serif" font-size="12" fill="#333">🏪 Location Management</text> <!-- Main Content Area --> <rect x="290" y="160" width="440" height="460" rx="8" ry="8" fill="#ffffff" stroke="#ddd" stroke-width="1"/> <!-- Quick Stats Cards with better spacing -->

<text x="310" y="185" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Quick Overview</text>

<rect x="310" y="200" width="100" height="80" rx="6" ry="6" fill="#e8f5e8" stroke="#c3e6c3" stroke-width="1"/> <text x="360" y="225" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#2d5a2d">5</text> <text x="360" y="240" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#666">Stores</text> <text x="360" y="270" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#666">Accessible</text> <rect x="420" y="200" width="100" height="80" rx="6" ry="6" fill="#fff3cd" stroke="#ffeaa7" stroke-width="1"/> <text x="470" y="225" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#856404">12</text> <text x="470" y="240" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#666">Low Stock</text> <text x="470" y="270" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#666">Alerts</text> <rect x="530" y="200" width="100" height="80" rx="6" ry="6" fill="#e6f3ff" stroke="#b3d9ff" stroke-width="1"/> <text x="580" y="225" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#004085">847</text> <text x="580" y="240" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#666">Products</text> <text x="580" y="270" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#666">In System</text> <!-- Divider line --> <line x1="310" y1="295" x2="710" y2="295" stroke="#e9ecef" stroke-width="1"/> <!-- Recent Activity with improved formatting -->

<text x="310" y="320" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Recent Activity</text>

<rect x="310" y="335" width="400" height="130" rx="6" ry="6" fill="#f8f9fa" stroke="#e9ecef" stroke-width="1"/> <text x="320" y="355" font-family="Arial, sans-serif" font-size="11" fill="#333">• Sale recorded: 3x T-Shirts at Oxford Street</text> <text x="600" y="355" font-family="Arial, sans-serif" font-size="10" fill="#888">(2 mins ago)</text>

<text x="320" y="375" font-family="Arial, sans-serif" font-size="11" fill="#333">• Stock adjustment: +50 Jeans at Birmingham</text> <text x="590" y="375" font-family="Arial, sans-serif" font-size="10" fill="#888">(15 mins ago)</text>

<text x="320" y="395" font-family="Arial, sans-serif" font-size="11" fill="#333">• Low stock alert: Dresses at Manchester</text> <text x="600" y="395" font-family="Arial, sans-serif" font-size="10" fill="#888">(1 hour ago)</text>

<text x="320" y="415" font-family="Arial, sans-serif" font-size="11" fill="#333">• New user created: John Smith</text> <text x="600" y="415" font-family="Arial, sans-serif" font-size="10" fill="#888">(2 hours ago)</text>

<text x="320" y="435" font-family="Arial, sans-serif" font-size="11" fill="#333">• Purchase recorded: 25x Shoes at London</text> <text x="590" y="435" font-family="Arial, sans-serif" font-size="10" fill="#888">(3 hours ago)</text>

<text x="320" y="455" font-family="Arial, sans-serif" font-size="11" fill="#333">• Report generated: Weekly inventory</text> <text x="580" y="455" font-family="Arial, sans-serif" font-size="10" fill="#888">(Today, 9:30am)</text>

<!-- Divider line --> <line x1="310" y1="480" x2="710" y2="480" stroke="#e9ecef" stroke-width="1"/> <!-- Quick Actions -->

<text x="310" y="505" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Quick Actions</text>

<rect x="310" y="520" width="120" height="40" rx="6" ry="6" fill="#d4a574"/> <text x="370" y="543" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">Record Sale</text> <rect x="440" y="520" width="120" height="40" rx="6" ry="6" fill="#28a745"/> <text x="500" y="543" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">Add Stock</text> <rect x="570" y="520" width="120" height="40" rx="6" ry="6" fill="#007bff"/> <text x="630" y="543" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">View Reports</text> <!-- Alert Notification --> <rect x="310" y="580" width="400" height="30" rx="6" ry="6" fill="#f8d7da" stroke="#f5c6cb" stroke-width="1"/> <text x="320" y="598" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#721c24">⚠️ Alert: 12 products are running low on stock - Click to view</text> <!-- Callout Numbers - repositioned for better clarity --> <circle cx="780" cy="110" r="12" fill="#d32f2f"/> <text x="780" y="116" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">1</text> <circle cx="280" cy="350" r="12" fill="#d32f2f"/> <text x="280" y="356" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">2</text> <circle cx="780" cy="240" r="12" fill="#d32f2f"/> <text x="780" y="246" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">3</text> <circle cx="780" cy="390" r="12" fill="#d32f2f"/> <text x="780" y="396" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">4</text> <circle cx="780" cy="540" r="12" fill="#d32f2f"/> <text x="780" y="546" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">5</text> <circle cx="780" cy="595" r="12" fill="#d32f2f"/> <text x="780" y="601" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">6</text> <!-- Annotation Boxes - widened and repositioned --> <!-- Annotation 1 --> <rect x="820" y="70" width="400" height="90" rx="6" ry="6" fill="white" stroke="#666" stroke-width="1" filter="drop-shadow(2px 2px 6px rgba(0,0,0,0.15))"/> <circle cx="845" cy="95" r="12" fill="#d32f2f"/> <text x="845" y="101" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">1</text> <text x="870" y="100" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Header Section:</text> <text x="870" y="118" font-family="Arial, sans-serif" font-size="12" fill="#333">Displays StockFlow branding and personalised welcome message.</text> <text x="870" y="134" font-family="Arial, sans-serif" font-size="12" fill="#333">Shows current user name and provides logout functionality.</text> <text x="870" y="150" font-family="Arial, sans-serif" font-size="12" fill="#333">Maintains session information and user context.</text> <!-- Annotation 2 --> <rect x="820" y="180" width="400" height="90" rx="6" ry="6" fill="white" stroke="#666" stroke-width="1" filter="drop-shadow(2px 2px 6px rgba(0,0,0,0.15))"/> <circle cx="845" cy="205" r="12" fill="#d32f2f"/> <text x="845" y="211" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">2</text> <text x="870" y="210" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Navigation Menu:</text> <text x="870" y="228" font-family="Arial, sans-serif" font-size="12" fill="#333">Role-based menu showing available system functions.</text> <text x="870" y="244" font-family="Arial, sans-serif" font-size="12" fill="#333">Admin-only sections highlighted with subtle background.</text> <text x="870" y="260" font-family="Arial, sans-serif" font-size="12" fill="#333">Links to all major screens and functionality.</text> <!-- Annotation 3 --> <rect x="820" y="290" width="400" height="90" rx="6" ry="6" fill="white" stroke="#666" stroke-width="1" filter="drop-shadow(2px 2px 6px rgba(0,0,0,0.15))"/> <circle cx="845" cy="315" r="12" fill="#d32f2f"/> <text x="845" y="321" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">3</text> <text x="870" y="320" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Quick Stats Cards:</text> <text x="870" y="338" font-family="Arial, sans-serif" font-size="12" fill="#333">Dashboard widgets showing key metrics at a glance.</text> <text x="870" y="354" font-family="Arial, sans-serif" font-size="12" fill="#333">Store count, alert numbers, and product totals.</text> <text x="870" y="370" font-family="Arial, sans-serif" font-size="12" fill="#333">Colour-coded for quick visual assessment.</text> <!-- Annotation 4 --> <rect x="820" y="400" width="400" height="90" rx="6" ry="6" fill="white" stroke="#666" stroke-width="1" filter="drop-shadow(2px 2px 6px rgba(0,0,0,0.15))"/> <circle cx="845" cy="425" r="12" fill="#d32f2f"/> <text x="845" y="431" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">4</text> <text x="870" y="430" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Recent Activity Feed:</text> <text x="870" y="448" font-family="Arial, sans-serif" font-size="12" fill="#333">Real-time log of system activities and transactions.</text> <text x="870" y="464" font-family="Arial, sans-serif" font-size="12" fill="#333">Shows sales, stock changes, alerts, and user actions.</text> <text x="870" y="480" font-family="Arial, sans-serif" font-size="12" fill="#333">Timestamped entries for audit and monitoring.</text> <!-- Annotation 5 --> <rect x="820" y="510" width="400" height="90" rx="6" ry="6" fill="white" stroke="#666" stroke-width="1" filter="drop-shadow(2px 2px 6px rgba(0,0,0,0.15))"/> <circle cx="845" cy="535" r="12" fill="#d32f2f"/> <text x="845" y="541" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">5</text> <text x="870" y="540" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Quick Action Buttons:</text> <text x="870" y="558" font-family="Arial, sans-serif" font-size="12" fill="#333">Direct access to most frequently used functions.</text> <text x="870" y="574" font-family="Arial, sans-serif" font-size="12" fill="#333">Record sales, add stock, and view reports quickly.</text> <text x="870" y="590" font-family="Arial, sans-serif" font-size="12" fill="#333">Reduces navigation time for common tasks.</text> <!-- Annotation 6 --> <rect x="820" y="620" width="400" height="70" rx="6" ry="6" fill="white" stroke="#666" stroke-width="1" filter="drop-shadow(2px 2px 6px rgba(0,0,0,0.15))"/> <circle cx="845" cy="640" r="12" fill="#d32f2f"/> <text x="845" y="646" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">6</text> <text x="870" y="645" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Alert Notification Banner:</text> <text x="870" y="663" font-family="Arial, sans-serif" font-size="12" fill="#333">Prominent display of urgent system notifications.</text> <text x="870" y="679" font-family="Arial, sans-serif" font-size="12" fill="#333">Links directly to alerts dashboard for action.</text> </svg>

## 6.7.1 Component Specifications

### Header Section (Callout 1)

- **Application Branding**: Displays the StockFlow logo in the top-left corner
- **Welcome Message**: Shows personalised greeting with the user's full name
- **Logout Button**: Positioned in the top-right for easy access
- **Visual Design**: Clean white background with clear typography

### Navigation Menu (Callout 2)

- **Layout**: Vertical sidebar on the left side of the screen
- **Standard Menu Options**:
    - Store Selection - Choose which store to work with
    - Inventory Overview - View current stock levels
    - Record Sale - Process customer purchases
    - Product Management - Add or edit product information
    - Alerts Dashboard - View and manage low-stock warnings
    - Reports - Generate inventory and sales reports
- **Administrator Options**:
    - User Management - Create and modify user accounts
    - Location Management - Add or edit store locations
- **Visual Hierarchy**: Admin section separated by a divider line and different background colour

### Quick Stats Cards (Callout 3)

- **Stores Accessible**: Displays the number of stores the user can view and manage
- **Low Stock Alerts**: Shows count of products currently below minimum stock levels
- **Products in System**: Total number of products in the database
- **Visual Design**: Each card uses a different colour to indicate status:
    - Green for normal metrics
    - Yellow for warnings requiring attention
    - Blue for informational statistics

### Recent Activity Feed (Callout 4)

- **Content**: Displays the six most recent system activities
- **Information Shown**:
    - Type of activity (sale, purchase, adjustment, alert)
    - Products and quantities involved
    - Store location where activity occurred
    - Time elapsed since the activity
- **Purpose**: Provides quick visibility of system usage and recent changes

### Quick Action Buttons (Callout 5)

- **Record Sale Button**: Direct access to sales recording functionality
- **Add Stock Button**: Quick link to record new inventory arrivals
- **View Reports Button**: Shortcut to report generation screen
- **Design**: Large, colourful buttons for easy identification and clicking

### Alert Notification Banner (Callout 6)

- **Visibility**: Only appears when products are below minimum stock levels
- **Content**: Shows total count of products requiring attention
- **Interaction**: Entire banner is clickable to view detailed alert information
- **Design**: Red background colour to indicate urgency

## 6.7.2 User Interaction Flow

### Accessing the Dashboard

1. User successfully logs in with valid credentials
2. Dashboard displays with user's name in the header
3. Menu shows options based on user's role (admin or standard)
4. Statistics and activity feed load automatically

### Navigation Options

1. **Using the Menu**:    
    - User clicks any menu item to navigate to that screen
    - Admin-only options are hidden from standard users
    - Current screen is highlighted in the menu

2. **Using Quick Actions**:    
    - Buttons provide direct access to common tasks
    - Bypass menu navigation for frequently used functions

3. **Responding to Alerts**:    
    - Click alert banner to view detailed alert information
    - Navigate to specific products needing attention

### Information Display

- **Statistics Update**: Cards refresh each time user returns to dashboard
- **Activity Feed**: Shows most recent six activities across all accessible stores
- **Time Display**: Activities show relative time (minutes, hours, or specific times for older items)

## 6.7.3 Design Rationale

### Layout Decisions

- **Left Navigation**: Follows common design patterns for desktop applications
- **Central Content Area**: Maximises space for important information
- **Top Header**: Keeps branding and user info consistently visible

### Visual Hierarchy

- **Size and Colour**: Important elements (stats cards, alerts) use larger text and distinctive colours
- **Grouping**: Related items (menu options, quick actions) are visually grouped together
- **White Space**: Adequate spacing prevents cluttered appearance

### User Experience Considerations

- **Quick Access**: Most common functions available within one click
- **Role-Based Display**: Users only see options they can use
- **Visual Feedback**: Colour coding helps users quickly assess system status
- **Consistent Navigation**: Menu remains visible on all screens for easy movement


# 6.8 Store Selection Screen Wireframe

<svg viewBox="0 0 1450 750" xmlns="http://www.w3.org/2000/svg">
<!-- Background -->
<rect width="1450" height="750" fill="#e5e5e5"/>

<!-- Title -->
<text x="725" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#333">StockFlow Store Selection Screen</text>

<!-- Screen Container (widened for proper margins) -->
<rect x="50" y="60" width="800" height="645" rx="25" ry="25" fill="#f5f0e8" stroke="#333" stroke-width="3"/>

<!-- Header Section -->
<rect x="70" y="80" width="760" height="65" rx="8" ry="8" fill="#ffffff" stroke="#ddd" stroke-width="1" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))"/>
<text x="90" y="110" font-family="Arial, sans-serif" font-size="20" font-weight="bold" font-style="italic" fill="#333">StockFlow</text>
<text x="90" y="130" font-family="Arial, sans-serif" font-size="13" fill="#666">Dashboard > Store Selection</text>
<rect x="670" y="95" width="140" height="35" rx="17" ry="17" fill="#6c757d"/>
<text x="740" y="115" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">← Back to Dashboard</text>

<!-- Search and Filter Section (more spacious) -->
<rect x="70" y="165" width="760" height="80" rx="8" ry="8" fill="#ffffff" stroke="#ddd" stroke-width="1" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))"/>
<<<text x="90" y="190" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#333">Select a Store Location</text>
<rect x="90" y="205" width="520" height="32" rx="16" ry="16" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1"/>
<text x="115" y="224" font-family="Arial, sans-serif" font-size="12" fill="#999">🔍 Search stores by name or location...</text>
<rect x="630" y="205" width="120" height="32" rx="16" ry="16" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1"/>
<text x="690" y="224" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#666">All Regions ▼</text>
<rect x="770" y="205" width="40" height="32" rx="16" ry="16" fill="#e9ecef" stroke="#ced4da" stroke-width="1"/>
<text x="790" y="224" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#666">⊞</text>

<!-- Store Grid Section (much more spacious) -->
<rect x="70" y="265" width="760" height="350" rx="8" ry="8" fill="#ffffff" stroke="#ddd" stroke-width="1" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))"/>

<!-- Row 1 - Better spaced cards -->
<!-- Store Card 1 - Oxford Street -->
<rect x="99" y="290" width="215" height="140" rx="8" ry="8" fill="#f8f9fa" stroke="#28a745" stroke-width="2" filter="drop-shadow(0px 3px 8px rgba(0,0,0,0.12))"/>
<circle cx="124" cy="320" r="12" fill="#28a745"/>
<text x="124" y="325" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white">✓</text>
<text x="149" y="325" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#333">Oxford Street</text>
<text x="304" y="302" text-anchor="end" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#28a745">GOOD</text>
<text x="114" y="345" font-family="Arial, sans-serif" font-size="12" fill="#666">London, Central</text>

<!-- Metrics section with proper spacing -->
<rect x="114" y="360" width="180" height="50" rx="6" ry="6" fill="#f1f3f4" stroke="#e9ecef" stroke-width="1"/>
<text x="124" y="378" font-family="Arial, sans-serif" font-size="12" fill="#333">📦 847 Products</text>
<text x="124" y="395" font-family="Arial, sans-serif" font-size="12" fill="#333">⚠️ 3 Alerts</text>
<text x="114" y="425" font-family="Arial, sans-serif" font-size="11" fill="#888">Last updated: 5 mins ago</text>

<!-- Store Card 2 - Birmingham -->
<rect x="343" y="290" width="215" height="140" rx="8" ry="8" fill="#f8f9fa" stroke="#28a745" stroke-width="2" filter="drop-shadow(0px 3px 8px rgba(0,0,0,0.12))"/>
<circle cx="368" cy="320" r="12" fill="#28a745"/>
<text x="368" y="325" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white">✓</text>
<text x="393" y="325" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#333">Birmingham Central</text>
<text x="548" y="302" text-anchor="end" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#28a745">GOOD</text>
<text x="358" y="345" font-family="Arial, sans-serif" font-size="12" fill="#666">Birmingham, Midlands</text>

<rect x="358" y="360" width="180" height="50" rx="6" ry="6" fill="#f1f3f4" stroke="#e9ecef" stroke-width="1"/>
<text x="368" y="378" font-family="Arial, sans-serif" font-size="12" fill="#333">📦 692 Products</text>
<text x="368" y="395" font-family="Arial, sans-serif" font-size="12" fill="#333">⚠️ 1 Alert</text>
<text x="358" y="425" font-family="Arial, sans-serif" font-size="11" fill="#888">Last updated: 12 mins ago</text>

<!-- Store Card 3 - Manchester (Warning) -->
<rect x="587" y="290" width="215" height="140" rx="8" ry="8" fill="#f8f9fa" stroke="#ffc107" stroke-width="2" filter="drop-shadow(0px 3px 8px rgba(0,0,0,0.12))"/>
<circle cx="612" cy="320" r="12" fill="#ffc107"/>
<text x="612" y="325" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white">!</text>
<text x="637" y="325" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#333">Manchester Trafford</text>
<text x="792" y="302" text-anchor="end" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#856404">WARNING</text>
<text x="602" y="345" font-family="Arial, sans-serif" font-size="12" fill="#666">Manchester, North</text>

<rect x="602" y="360" width="180" height="50" rx="6" ry="6" fill="#fff3cd" stroke="#ffeaa7" stroke-width="1"/>
<text x="612" y="378" font-family="Arial, sans-serif" font-size="12" fill="#333">📦 734 Products</text>
<text x="612" y="395" font-family="Arial, sans-serif" font-size="12" fill="#333">⚠️ 8 Alerts</text>
<text x="602" y="425" font-family="Arial, sans-serif" font-size="11" fill="#888">Last updated: 1 hour ago</text>

<!-- Row 2 - Better spaced cards -->
<!-- Store Card 4 - Leeds -->
<rect x="99" y="450" width="215" height="140" rx="8" ry="8" fill="#f8f9fa" stroke="#28a745" stroke-width="2" filter="drop-shadow(0px 3px 8px rgba(0,0,0,0.12))"/>
<circle cx="124" cy="480" r="12" fill="#28a745"/>
<text x="124" y="485" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white">✓</text>
<text x="149" y="485" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#333">Leeds City Centre</text>
<text x="304" y="462" text-anchor="end" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#28a745">GOOD</text>
<text x="114" y="505" font-family="Arial, sans-serif" font-size="12" fill="#666">Leeds, Yorkshire</text>

<rect x="114" y="520" width="180" height="50" rx="6" ry="6" fill="#f1f3f4" stroke="#e9ecef" stroke-width="1"/>
<text x="124" y="538" font-family="Arial, sans-serif" font-size="12" fill="#333">📦 521 Products</text>
<text x="124" y="555" font-family="Arial, sans-serif" font-size="12" fill="#333">⚠️ 0 Alerts</text>
<text x="114" y="585" font-family="Arial, sans-serif" font-size="11" fill="#888">Last updated: 2 hours ago</text>

<!-- Store Card 5 - Bristol (Critical) -->
<rect x="343" y="450" width="215" height="140" rx="8" ry="8" fill="#f8f9fa" stroke="#dc3545" stroke-width="2" filter="drop-shadow(0px 3px 8px rgba(0,0,0,0.12))"/>
<circle cx="368" cy="480" r="12" fill="#dc3545"/>
<text x="368" y="485" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white">!</text>
<text x="393" y="485" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#333">Bristol Cabot Circus</text>
<text x="548" y="462" text-anchor="end" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#dc3545">CRITICAL</text>
<text x="358" y="505" font-family="Arial, sans-serif" font-size="12" fill="#666">Bristol, Southwest</text>

<rect x="358" y="520" width="180" height="50" rx="6" ry="6" fill="#f8d7da" stroke="#f5c6cb" stroke-width="1"/>
<text x="368" y="538" font-family="Arial, sans-serif" font-size="12" fill="#333">📦 612 Products</text>
<text x="368" y="555" font-family="Arial, sans-serif" font-size="12" fill="#333">⚠️ 15 Alerts</text>
<text x="358" y="585" font-family="Arial, sans-serif" font-size="11" fill="#888">Last updated: 4 hours ago</text>

<!-- Pagination Card (Better proportioned) -->
<rect x="587" y="450" width="215" height="140" rx="8" ry="8" fill="#f8f9fa" stroke="#6c757d" stroke-width="2" stroke-dasharray="10,5" filter="drop-shadow(0px 3px 8px rgba(0,0,0,0.12))"/>
<circle cx="694" cy="485" r="18" fill="#6c757d"/>
<text x="694" y="491" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white">+3</text>
<text x="694" y="520" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#333">More Stores</text>
<text x="694" y="540" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#666">Click to view next page</text>
<rect x="634" y="555" width="120" height="25" rx="12" ry="12" fill="#6c757d"/>
<text x="694" y="569" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="white">VIEW MORE →</text>

<!-- Enhanced Summary Stats Bar -->
<rect x="70" y="625" width="760" height="55" rx="8" ry="8" fill="#e8f5e8" stroke="#c3e6c3" stroke-width="1" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))"/>
<text x="90" y="648" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#2d5a2d">Summary:</text>
<text x="90" y="665" font-family="Arial, sans-serif" font-size="13" fill="#2d5a2d">5 stores accessible • 3,406 total products • 27 active alerts</text>
<rect x="670" y="640" width="140" height="28" rx="14" ry="14" fill="#28a745"/>
<text x="740" y="657" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">View All Store Reports</text>

<!-- Callout Numbers (repositioned for wider screen) -->
<circle cx="880" cy="112" r="12" fill="#d32f2f"/>
<text x="880" y="118" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">1</text>

<circle cx="880" cy="205" r="12" fill="#d32f2f"/>
<text x="880" y="211" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">2</text>

<circle cx="357" cy="360" r="12" fill="#d32f2f"/>
<text x="357" y="366" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">3</text>

<circle cx="622" cy="300" r="12" fill="#d32f2f"/>
<text x="622" y="306" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">4</text>

<circle cx="607" cy="520" r="12" fill="#d32f2f"/>
<text x="607" y="526" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">5</text>

<circle cx="880" cy="655" r="12" fill="#d32f2f"/>
<text x="880" y="661" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">6</text>

<!-- Annotation Boxes (repositioned for wider screen) -->
<!-- Annotation 1 -->
<rect x="920" y="70" width="450" height="90" rx="6" ry="6" fill="white" stroke="#666" stroke-width="1" filter="drop-shadow(2px 2px 6px rgba(0,0,0,0.15))"/>
<circle cx="945" cy="95" r="12" fill="#d32f2f"/>
<text x="945" y="101" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">1</text>
<text x="970" y="100" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Header with Navigation:</text>
<text x="970" y="118" font-family="Arial, sans-serif" font-size="12" fill="#333">Shows current page in breadcrumb navigation.</text>
<text x="970" y="134" font-family="Arial, sans-serif" font-size="12" fill="#333">Back to Dashboard button for easy navigation.</text>
<text x="970" y="150" font-family="Arial, sans-serif" font-size="12" fill="#333">Maintains consistent branding and layout.</text>

<!-- Annotation 2 -->
<rect x="920" y="180" width="450" height="90" rx="6" ry="6" fill="white" stroke="#666" stroke-width="1" filter="drop-shadow(2px 2px 6px rgba(0,0,0,0.15))"/>
<circle cx="945" cy="205" r="12" fill="#d32f2f"/>
<text x="945" y="211" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">2</text>
<text x="970" y="210" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Search and Filter Bar:</text>
<text x="970" y="228" font-family="Arial, sans-serif" font-size="12" fill="#333">Search field for finding stores by name or location.</text>
<text x="970" y="244" font-family="Arial, sans-serif" font-size="12" fill="#333">Region filter dropdown and view toggle options.</text>
<text x="970" y="260" font-family="Arial, sans-serif" font-size="12" fill="#333">Helps users locate specific stores quickly.</text>

<!-- Annotation 3 -->
<rect x="920" y="290" width="450" height="90" rx="6" ry="6" fill="white" stroke="#666" stroke-width="1" filter="drop-shadow(2px 2px 6px rgba(0,0,0,0.15))"/>
<circle cx="945" cy="315" r="12" fill="#d32f2f"/>
<text x="945" y="321" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">3</text>
<text x="970" y="320" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Store Information Cards:</text>
<text x="970" y="338" font-family="Arial, sans-serif" font-size="12" fill="#333">Each card shows store name, location, and key metrics.</text>
<text x="970" y="354" font-family="Arial, sans-serif" font-size="12" fill="#333">Product count, alert numbers, and last update time.</text>
<text x="970" y="370" font-family="Arial, sans-serif" font-size="12" fill="#333">Click any card to access that store's inventory.</text>

<!-- Annotation 4 -->
<rect x="920" y="400" width="450" height="90" rx="6" ry="6" fill="white" stroke="#666" stroke-width="1" filter="drop-shadow(2px 2px 6px rgba(0,0,0,0.15))"/>
<circle cx="945" cy="425" r="12" fill="#d32f2f"/>
<text x="945" y="431" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">4</text>
<text x="970" y="430" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Status Indicators:</text>
<text x="970" y="448" font-family="Arial, sans-serif" font-size="12" fill="#333">Green: All systems normal, recent updates.</text>
<text x="970" y="464" font-family="Arial, sans-serif" font-size="12" fill="#333">Yellow: Some alerts, moderate update delays.</text>
<text x="970" y="480" font-family="Arial, sans-serif" font-size="12" fill="#333">Red: Multiple alerts, requires immediate attention.</text>

<!-- Annotation 5 -->
<rect x="920" y="510" width="450" height="90" rx="6" ry="6" fill="white" stroke="#666" stroke-width="1" filter="drop-shadow(2px 2px 6px rgba(0,0,0,0.15))"/>
<circle cx="945" cy="535" r="12" fill="#d32f2f"/>
<text x="945" y="541" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">5</text>
<text x="970" y="540" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Pagination and Navigation:</text>
<text x="970" y="558" font-family="Arial, sans-serif" font-size="12" fill="#333">Indicates additional stores available on next page.</text>
<text x="970" y="574" font-family="Arial, sans-serif" font-size="12" fill="#333">Prevents screen overcrowding with large store counts.</text>
<text x="970" y="590" font-family="Arial, sans-serif" font-size="12" fill="#333">Maintains good performance with data loading.</text>

<!-- Annotation 6 -->
<rect x="920" y="610" width="450" height="70" rx="6" ry="6" fill="white" stroke="#666" stroke-width="1" filter="drop-shadow(2px 2px 6px rgba(0,0,0,0.15))"/>
<circle cx="945" cy="630" r="12" fill="#d32f2f"/>
<text x="945" y="636" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">6</text>
<text x="970" y="635" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Summary Statistics Bar:</text>
<text x="970" y="653" font-family="Arial, sans-serif" font-size="12" fill="#333">Aggregated metrics across all accessible stores.</text>
<text x="970" y="669" font-family="Arial, sans-serif" font-size="12" fill="#333">Quick action button for comprehensive reporting.</text>
</svg>

## 6.8.1 Component Specifications

### Header with Navigation (Callout 1)

- **Application Branding**: Consistent StockFlow logo positioning from previous screens
- **Breadcrumb Navigation**: Shows "Dashboard > Store Selection" to indicate current location
- **Back Button**: "← Back to Dashboard" button for easy navigation return
- **Visual Design**: Maintains header styling consistency across the application

### Search and Filter Bar (Callout 2)

- **Search Field**: Large text input with placeholder "🔍 Search stores by name or location..."
- **Region Filter**: Dropdown showing "All Regions" with options for geographic filtering
- **View Toggle**: Grid view icon allowing switch between display formats
- **Functionality**: Real-time search filtering and instant view updates

### Store Information Cards (Callout 3)

- **Store Name**: Prominent display of store location name
- **Geographic Location**: Shows city and region for easy identification
- **Status Labels**: Top-right corner positioning showing "GOOD", "WARNING", or "CRITICAL"
- **Key Metrics Display**:
    - Product count (📦 symbol)
    - Alert count (⚠️ symbol)
    - Last update timestamp
- **Interactive Design**: Entire card is clickable to access store inventory
- **Visual Hierarchy**: Clear separation between name, location, metrics, and status information

### Status Indicators (Callout 4)

- **Green Circle**: Store operating normally, recent updates, minimal alerts (✓ icon)
- **Yellow Circle**: Moderate alert level, some attention needed (! icon)
- **Red Circle**: High alert count, immediate attention required (! icon)
- **Visual Position**: Top-left corner of each store card for immediate visibility
- **Status Labels**: Color-coded text in top-right corner matching circle colors
- **Size**: 12px radius circles for proper proportions without dominating the design

### Pagination and Navigation (Callout 5)

- **Additional Stores Indicator**: Dashed border card showing "+3 More Stores"
- **Visual Design**: Smaller circle (18px radius) with balanced spacing
- **Page Navigation**: Click to view next page of store locations
- **Performance Optimization**: Prevents loading too many cards simultaneously
- **User Guidance**: Clear indication that more stores are available
- **Action Button**: "VIEW MORE →" button for explicit navigation

### Summary Statistics Bar (Callout 6)

- **Aggregate Metrics**: Total stores accessible, combined product count, total alerts
- **Visual Design**: Green background indicating positive/informational status
- **Quick Action**: "View All Store Reports" button for comprehensive analytics
- **Context Awareness**: Updates based on user's access permissions
- **Positioning**: Proper margins within screen container boundaries

## 6.8.2 User Interaction Flow

### Initial Screen Load

1. User arrives from Main Dashboard after clicking "Store Selection"
2. System queries user_locations table to determine accessible stores
3. Screen displays only stores the user has permission to access
4. Status indicators load showing current alert levels and update times

### Store Selection Process

1. **Browsing Stores**:
    
    - User views grid of store cards with key information
    - Status colors and labels provide immediate visual assessment
    - Last update times help prioritize which stores need attention
2. **Using Search and Filters**:
    
    - User can type in search field to find specific stores
    - Region filter narrows results by geographic area
    - Real-time filtering updates card display instantly
3. **Selecting a Store**:
    
    - User clicks any store card to access that location
    - System navigates to Inventory Overview screen for selected store
    - Selected store context is maintained throughout session

### Navigation Options

- **Back to Dashboard**: Returns to main navigation hub
- **Pagination**: Access additional stores if user has many locations
- **View All Reports**: Generate comprehensive cross-store analytics

### Visual Feedback

- **Status Assessment**: Immediate understanding of store health through color coding
- **Update Recency**: Timestamp information helps prioritize attention
- **Alert Counts**: Numeric indicators show severity of issues
- **Hover States**: Cards provide visual feedback when interactive

## 6.8.3 Design Rationale

### Layout Decisions

- **Grid Layout**: Allows quick visual comparison of multiple stores
- **Card-Based Design**: Each store gets dedicated space for key information
- **Consistent Spacing**: 29px margins prevent cramped appearance while maximizing content
- **3×2 Grid**: Optimal balance between information density and readability

### Visual Hierarchy

- **Store Names**: Largest text for easy identification
- **Status System**: Dual indication through both color and text for accessibility
- **Metrics Layout**: Consistent icon-based presentation for quick scanning
- **Clear Separation**: Status labels positioned to avoid conflicts with store names

### User Experience Considerations

- **Access Control**: Only displays stores user can actually access
- **Performance**: Pagination prevents slow loading with many stores
- **Quick Assessment**: Color coding and metrics allow rapid decision-making
- **Context Preservation**: Breadcrumbs and navigation maintain user orientation
- **Progressive Disclosure**: Summary view leads to detailed inventory screens

### Information Architecture

- **Prioritization**: Alert counts and status help users focus on urgent stores
- **Efficiency**: Search and filter reduce time to find specific locations
- **Scalability**: Pagination system supports organizations with many store locations
- **Consistency**: Familiar patterns from previous screens reduce learning curve

### Accessibility Features

- **High Contrast**: Status indicators use distinct colors with sufficient contrast
- **Multiple Indicators**: Both color and text labels for status (not color-only)
- **Clear Labels**: All interactive elements clearly labeled
- **Keyboard Navigation**: Cards and buttons accessible via keyboard
- **Readable Typography**: Font sizes optimized for clarity and readability

### Design Consistency

- **Brand Integration**: Consistent with overall StockFlow design system
- **Color Palette**: Uses established brand colors throughout
- **Typography**: Maintains font hierarchy from other screens
- **Spacing System**: Uses consistent margin and padding values
- **Interactive Elements**: Button and card styling matches established patterns


# 6.9 Inventory Overview Screen Wireframe

<svg viewBox="0 0 1450 760" xmlns="http://www.w3.org/2000/svg">
<!-- Background -->
<rect width="1450" height="760" fill="#e5e5e5"/>

<!-- Title -->
<text x="725" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#333">StockFlow Inventory Overview Screen</text>

<!-- Screen Container -->
<rect x="50" y="60" width="800" height="630" rx="25" ry="25" fill="#f5f0e8" stroke="#333" stroke-width="3"/>

<!-- Header Section with Store Context -->
<rect x="70" y="80" width="760" height="65" rx="8" ry="8" fill="#ffffff" stroke="#ddd" stroke-width="1" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))"/>
<text x="90" y="110" font-family="Arial, sans-serif" font-size="20" font-weight="bold" font-style="italic" fill="#333">StockFlow</text>
<text x="90" y="130" font-family="Arial, sans-serif" font-size="13" fill="#666">Dashboard > Store Selection > Oxford Street Inventory</text>

<!-- Store Info Badge -->
<rect x="600" y="90" width="120" height="45" rx="8" ry="8" fill="#e8f5e8" stroke="#c3e6c3" stroke-width="1"/>
<text x="660" y="108" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#2d5a2d">Oxford Street</text>
<text x="660" y="122" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#2d5a2d">847 Products • 3 Alerts</text>

<rect x="740" y="95" width="80" height="35" rx="17" ry="17" fill="#6c757d"/>
<text x="780" y="115" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="white">← Back</text>

<!-- Search and Filter Section -->
<rect x="70" y="165" width="760" height="70" rx="8" ry="8" fill="#ffffff" stroke="#ddd" stroke-width="1" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))"/>
<text x="90" y="190" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#333">Product Inventory</text>

<rect x="90" y="200" width="460" height="25" rx="12" ry="12" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1"/>
<text x="105" y="215" font-family="Arial, sans-serif" font-size="11" fill="#999">🔍 Search products by name, SKU, or description...</text>

<rect x="560" y="200" width="100" height="25" rx="12" ry="12" fill="#f8f9fa" stroke="#ced4da" stroke-width="1"/>
<text x="610" y="215" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#666">All Categories ▼</text>

<rect x="670" y="200" width="80" height="25" rx="12" ry="12" fill="#f8f9fa" stroke="#ced4da" stroke-width="1"/>
<text x="710" y="215" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#666">Stock Level ▼</text>

<rect x="760" y="200" width="30" height="25" rx="12" ry="12" fill="#e9ecef" stroke="#ced4da" stroke-width="1"/>
<text x="775" y="215" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#666">⊞</text>

<!-- Quick Actions Bar -->
<rect x="70" y="240" width="760" height="45" rx="6" ry="6" fill="#f1f3f4" stroke="#e9ecef" stroke-width="1"/>
<rect x="85" y="250" width="80" height="25" rx="12" ry="12" fill="#d4a574"/>
<text x="125" y="265" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white">Record Sale</text>

<rect x="175" y="250" width="80" height="25" rx="12" ry="12" fill="#28a745"/>
<text x="215" y="265" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white">Add Stock</text>

<rect x="265" y="250" width="80" height="25" rx="12" ry="12" fill="#17a2b8"/>
<text x="305" y="265" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white">Adjust Stock</text>

<rect x="355" y="250" width="70" height="25" rx="12" ry="12" fill="#6c757d"/>
<text x="390" y="265" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white">Export</text>

<!-- Product Table Section -->
<rect x="70" y="305" width="760" height="310" rx="8" ry="8" fill="#ffffff" stroke="#ddd" stroke-width="1" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))"/>

<!-- Table Header -->
<rect x="90" y="320" width="720" height="30" rx="4" ry="4" fill="#f8f9fa" stroke="#e9ecef" stroke-width="1"/>
<text x="100" y="338" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#333">Product Name</text>
<text x="350" y="338" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#333">SKU</text>
<text x="450" y="338" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#333">Stock</text>
<text x="520" y="338" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#333">Min Level</text>
<text x="600" y="338" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#333">Price</text>
<text x="680" y="338" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#333">Status</text>
<text x="750" y="338" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#333">Updated</text>

<!-- Product Row 1 - Good Stock -->
<rect x="90" y="350" width="720" height="35" rx="4" ry="4" fill="#ffffff" stroke="#f1f3f4" stroke-width="1"/>
<circle cx="105" cy="367" r="6" fill="#28a745"/>
<text x="105" y="371" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="white">✓</text>
<text x="120" y="370" font-family="Arial, sans-serif" font-size="11" fill="#333">Classic Cotton T-Shirt</text>
<text x="350" y="370" font-family="Arial, sans-serif" font-size="11" fill="#666">TSH-001</text>
<text x="450" y="370" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#333">45</text>
<text x="520" y="370" font-family="Arial, sans-serif" font-size="11" fill="#666">10</text>
<text x="600" y="370" font-family="Arial, sans-serif" font-size="11" fill="#333">£19.99</text>
<text x="680" y="370" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#28a745">GOOD</text>
<text x="750" y="370" font-family="Arial, sans-serif" font-size="9" fill="#888">2 hrs ago</text>

<!-- Product Row 2 - Warning Stock -->
<rect x="90" y="385" width="720" height="35" rx="4" ry="4" fill="#fff3cd" stroke="#ffeaa7" stroke-width="1"/>
<circle cx="105" cy="402" r="6" fill="#ffc107"/>
<text x="105" y="406" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="white">!</text>
<text x="120" y="405" font-family="Arial, sans-serif" font-size="11" fill="#333">Denim Jeans - Blue</text>
<text x="350" y="405" font-family="Arial, sans-serif" font-size="11" fill="#666">JN-004</text>
<text x="450" y="405" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#856404">8</text>
<text x="520" y="405" font-family="Arial, sans-serif" font-size="11" fill="#666">15</text>
<text x="600" y="405" font-family="Arial, sans-serif" font-size="11" fill="#333">£49.99</text>
<text x="680" y="405" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#856404">LOW</text>
<text x="750" y="405" font-family="Arial, sans-serif" font-size="9" fill="#888">5 hrs ago</text>

<!-- Product Row 3 - Critical Stock -->
<rect x="90" y="420" width="720" height="35" rx="4" ry="4" fill="#f8d7da" stroke="#f5c6cb" stroke-width="1"/>
<circle cx="105" cy="437" r="6" fill="#dc3545"/>
<text x="105" y="441" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="white">!</text>
<text x="120" y="440" font-family="Arial, sans-serif" font-size="11" fill="#333">Summer Dress - Floral</text>
<text x="350" y="440" font-family="Arial, sans-serif" font-size="11" fill="#666">DR-012</text>
<text x="450" y="440" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#dc3545">2</text>
<text x="520" y="440" font-family="Arial, sans-serif" font-size="11" fill="#666">20</text>
<text x="600" y="440" font-family="Arial, sans-serif" font-size="11" fill="#333">£34.99</text>
<text x="680" y="440" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#dc3545">CRITICAL</text>
<text x="750" y="440" font-family="Arial, sans-serif" font-size="9" fill="#888">1 day ago</text>

<!-- Product Row 4 - Good Stock -->
<rect x="90" y="455" width="720" height="35" rx="4" ry="4" fill="#ffffff" stroke="#f1f3f4" stroke-width="1"/>
<circle cx="105" cy="472" r="6" fill="#28a745"/>
<text x="105" y="476" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="white">✓</text>
<text x="120" y="475" font-family="Arial, sans-serif" font-size="11" fill="#333">Leather Jacket - Black</text>
<text x="350" y="475" font-family="Arial, sans-serif" font-size="11" fill="#666">JK-007</text>
<text x="450" y="475" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#333">12</text>
<text x="520" y="475" font-family="Arial, sans-serif" font-size="11" fill="#666">5</text>
<text x="600" y="475" font-family="Arial, sans-serif" font-size="11" fill="#333">£199.99</text>
<text x="680" y="475" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#28a745">GOOD</text>
<text x="750" y="475" font-family="Arial, sans-serif" font-size="9" fill="#888">3 hrs ago</text>

<!-- Product Row 5 - Warning Stock -->
<rect x="90" y="490" width="720" height="35" rx="4" ry="4" fill="#fff3cd" stroke="#ffeaa7" stroke-width="1"/>
<circle cx="105" cy="507" r="6" fill="#ffc107"/>
<text x="105" y="511" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="white">!</text>
<text x="120" y="510" font-family="Arial, sans-serif" font-size="11" fill="#333">Running Shoes - White</text>
<text x="350" y="510" font-family="Arial, sans-serif" font-size="11" fill="#666">SH-023</text>
<text x="450" y="510" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#856404">6</text>
<text x="520" y="510" font-family="Arial, sans-serif" font-size="11" fill="#666">12</text>
<text x="600" y="510" font-family="Arial, sans-serif" font-size="11" fill="#333">£89.99</text>
<text x="680" y="510" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#856404">LOW</text>
<text x="750" y="510" font-family="Arial, sans-serif" font-size="9" fill="#888">6 hrs ago</text>

<!-- Product Row 6 - Good Stock -->
<rect x="90" y="525" width="720" height="35" rx="4" ry="4" fill="#ffffff" stroke="#f1f3f4" stroke-width="1"/>
<circle cx="105" cy="542" r="6" fill="#28a745"/>
<text x="105" y="546" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="white">✓</text>
<text x="120" y="545" font-family="Arial, sans-serif" font-size="11" fill="#333">Wool Sweater - Navy</text>
<text x="350" y="545" font-family="Arial, sans-serif" font-size="11" fill="#666">SW-015</text>
<text x="450" y="545" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#333">28</text>
<text x="520" y="545" font-family="Arial, sans-serif" font-size="11" fill="#666">8</text>
<text x="600" y="545" font-family="Arial, sans-serif" font-size="11" fill="#333">£79.99</text>
<text x="680" y="545" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#28a745">GOOD</text>
<text x="750" y="545" font-family="Arial, sans-serif" font-size="9" fill="#888">1 hr ago</text>

<!-- Pagination Controls -->
<rect x="90" y="570" width="720" height="30" rx="4" ry="4" fill="#f8f9fa" stroke="#e9ecef" stroke-width="1"/>
<text x="100" y="588" font-family="Arial, sans-serif" font-size="11" fill="#666">Showing 1-6 of 847 products</text>

<rect x="650" y="577" width="30" height="20" rx="3" ry="3" fill="#6c757d"/>
<text x="665" y="589" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white">← 1</text>

<rect x="690" y="577" width="20" height="20" rx="3" ry="3" fill="#d4a574"/>
<text x="700" y="589" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white">2</text>

<rect x="720" y="577" width="20" height="20" rx="3" ry="3" fill="#e9ecef"/>
<text x="730" y="589" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#666">3</text>

<rect x="750" y="577" width="30" height="20" rx="3" ry="3" fill="#6c757d"/>
<text x="765" y="589" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="white">→</text>

<!-- Summary Statistics Bar -->
<rect x="70" y="635" width="760" height="45" rx="8" ry="8" fill="#e8f5e8" stroke="#c3e6c3" stroke-width="1" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))"/>
<text x="90" y="655" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#2d5a2d">Stock Summary:</text>
<text x="90" y="670" font-family="Arial, sans-serif" font-size="12" fill="#2d5a2d">847 total products • 798 good stock • 46 low stock • 3 critical alerts • Last sync: 2 mins ago</text>

<rect x="690" y="645" width="130" height="25" rx="12" ry="12" fill="#28a745"/>
<text x="755" y="660" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="white">🔄 Sync Inventory</text>

<!-- Callout Numbers -->
<circle cx="880" cy="112" r="12" fill="#d32f2f"/>
<text x="880" y="118" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">1</text>

<circle cx="880" cy="190" r="12" fill="#d32f2f"/>
<text x="880" y="196" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">2</text>

<circle cx="880" cy="262" r="12" fill="#d32f2f"/>
<text x="880" y="268" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">3</text>

<circle cx="880" cy="360" r="12" fill="#d32f2f"/>
<text x="880" y="366" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">4</text>

<circle cx="880" cy="585" r="12" fill="#d32f2f"/>
<text x="880" y="591" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">5</text>

<circle cx="880" cy="657" r="12" fill="#d32f2f"/>
<text x="880" y="663" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">6</text>

<!-- Annotation Boxes -->
<!-- Annotation 1 -->
<rect x="920" y="70" width="450" height="90" rx="6" ry="6" fill="white" stroke="#666" stroke-width="1" filter="drop-shadow(2px 2px 6px rgba(0,0,0,0.15))"/>
<circle cx="945" cy="95" r="12" fill="#d32f2f"/>
<text x="945" y="101" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">1</text>
<text x="970" y="100" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Header with Store Context:</text>
<text x="970" y="118" font-family="Arial, sans-serif" font-size="12" fill="#333">Shows current store selection with key metrics badge.</text>
<text x="970" y="134" font-family="Arial, sans-serif" font-size="12" fill="#333">Breadcrumb navigation shows full path taken to reach this screen.</text>
<text x="970" y="150" font-family="Arial, sans-serif" font-size="12" fill="#333">Back button returns to Store Selection for easy store switching.</text>

<!-- Annotation 2 -->
<rect x="920" y="180" width="450" height="90" rx="6" ry="6" fill="white" stroke="#666" stroke-width="1" filter="drop-shadow(2px 2px 6px rgba(0,0,0,0.15))"/>
<circle cx="945" cy="205" r="12" fill="#d32f2f"/>
<text x="945" y="211" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">2</text>
<text x="970" y="210" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Search and Filter Controls:</text>
<text x="970" y="228" font-family="Arial, sans-serif" font-size="12" fill="#333">Real-time search across product names, SKUs, and descriptions.</text>
<text x="970" y="244" font-family="Arial, sans-serif" font-size="12" fill="#333">Category and stock level filters for targeted viewing.</text>
<text x="970" y="260" font-family="Arial, sans-serif" font-size="12" fill="#333">Grid/List view toggle for different display preferences.</text>

<!-- Annotation 3 -->
<rect x="920" y="295" width="450" height="90" rx="6" ry="6" fill="white" stroke="#666" stroke-width="1" filter="drop-shadow(2px 2px 6px rgba(0,0,0,0.15))"/>
<circle cx="945" cy="320" r="12" fill="#d32f2f"/>
<text x="945" y="326" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">3</text>
<text x="970" y="325" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Quick Action Toolbar:</text>
<text x="970" y="343" font-family="Arial, sans-serif" font-size="12" fill="#333">Direct access to common inventory operations.</text>
<text x="970" y="359" font-family="Arial, sans-serif" font-size="12" fill="#333">Record Sale, Add Stock, Adjust Stock, and Export functions.</text>
<text x="970" y="375" font-family="Arial, sans-serif" font-size="12" fill="#333">Improved spacing with properly centered buttons.</text>

<!-- Annotation 4 -->
<rect x="920" y="405" width="450" height="90" rx="6" ry="6" fill="white" stroke="#666" stroke-width="1" filter="drop-shadow(2px 2px 6px rgba(0,0,0,0.15))"/>
<circle cx="945" cy="430" r="12" fill="#d32f2f"/>
<text x="945" y="436" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">4</text>
<text x="970" y="435" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Product Data Table:</text>
<text x="970" y="453" font-family="Arial, sans-serif" font-size="12" fill="#333">Comprehensive product listing with sortable columns.</text>
<text x="970" y="469" font-family="Arial, sans-serif" font-size="12" fill="#333">Color-coded status indicators: Green (Good), Yellow (Low), Red (Critical).</text>
<text x="970" y="485" font-family="Arial, sans-serif" font-size="12" fill="#333">Essential data: Name, SKU, current stock, minimum level, price, status.</text>

<!-- Annotation 5 -->
<rect x="920" y="515" width="450" height="90" rx="6" ry="6" fill="white" stroke="#666" stroke-width="1" filter="drop-shadow(2px 2px 6px rgba(0,0,0,0.15))"/>
<circle cx="945" cy="540" r="12" fill="#d32f2f"/>
<text x="945" y="546" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">5</text>
<text x="970" y="545" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Pagination Controls:</text>
<text x="970" y="563" font-family="Arial, sans-serif" font-size="12" fill="#333">Efficient navigation through large product catalogs.</text>
<text x="970" y="579" font-family="Arial, sans-serif" font-size="12" fill="#333">Shows current page position and total record count.</text>
<text x="970" y="595" font-family="Arial, sans-serif" font-size="12" fill="#333">Previous/Next controls with numbered page options.</text>

<!-- Annotation 6 -->
<rect x="920" y="625" width="450" height="70" rx="6" ry="6" fill="white" stroke="#666" stroke-width="1" filter="drop-shadow(2px 2px 6px rgba(0,0,0,0.15))"/>
<circle cx="945" cy="645" r="12" fill="#d32f2f"/>
<text x="945" y="651" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">6</text>
<text x="970" y="650" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">Inventory Summary Bar:</text>
<text x="970" y="668" font-family="Arial, sans-serif" font-size="12" fill="#333">Real-time aggregate statistics and sync status display.</text>
<text x="970" y="684" font-family="Arial, sans-serif" font-size="12" fill="#333">Manual sync trigger for immediate inventory updates.</text>
</svg>

## 6.9.1 Component Specifications

### Header with Store Context (Callout 1)

- **Application Branding**: Consistent StockFlow logo positioning from previous screens
- **Breadcrumb Navigation**: Shows complete path "Dashboard > Store Selection > Oxford Street Inventory"
- **Store Information Badge**: Displays selected store name with key metrics (847 Products • 3 Alerts)
- **Visual Design**: Green background indicates healthy store status with clear metric summary
- **Back Button**: "← Back" button for returning to Store Selection screen
- **Context Preservation**: Maintains user's location awareness throughout the navigation flow

### Search and Filter Controls (Callout 2)

- **Search Field**: Large text input with placeholder "🔍 Search products by name, SKU, or description..."
- **Category Filter**: Dropdown showing "All Categories" with options for product classification filtering
- **Stock Level Filter**: Dropdown for filtering by stock status (All, Good, Low, Critical levels)
- **View Toggle**: Grid view icon (⊞) allowing switch between table and card display formats
- **Real-time Functionality**: Instant filtering as user types or changes filter selections
- **Responsive Design**: Controls adapt to screen size while maintaining functionality

### Quick Action Toolbar (Callout 3)

- **Record Sale Button**: Brown/tan color (#d4a574) for primary sales transaction function
- **Add Stock Button**: Green color (#28a745) for inventory replenishment operations
- **Adjust Stock Button**: Blue color (#17a2b8) for administrative stock corrections
- **Export Button**: Grey color (#6c757d) for data export and reporting functions
- **Professional Spacing**: 45px container height with properly centered buttons (10px padding top/bottom)
- **Visual Hierarchy**: Color coding helps users quickly identify the action type needed
- **Consistent Alignment**: Toolbar aligns perfectly with search section above for clean stacking

### Product Data Table (Callout 4)

- **Column Structure**: Product Name, SKU, Stock, Min Level, Price, Status, Updated
- **Status Indicators**: Color-coded circles with icons:
    - Green circle with ✓ for Good stock levels
    - Yellow circle with ! for Low stock warnings
    - Red circle with ! for Critical stock alerts
- **Row Color Coding**: Background colors reinforce status (white, yellow tint, red tint)
- **Data Types**: Mix of text, numbers, currency, and time-based information
- **Visual Scanning**: Clear typography hierarchy enables quick data assessment
- **Sortable Headers**: Column headers designed for click-to-sort functionality

### Pagination Controls (Callout 5)

- **Current View Indicator**: "Showing 1-6 of 847 products" for context awareness
- **Page Navigation**: Previous (← 1), Current (2), Next (3), Forward (→) controls
- **Visual States**: Current page highlighted in brand color, inactive pages in grey
- **Efficient Design**: Compact controls don't overwhelm the interface
- **Large Dataset Support**: Handles substantial product catalogs with clear navigation
- **User Orientation**: Always shows position within the complete dataset

### Inventory Summary Bar (Callout 6)

- **Aggregate Statistics**: "847 total products • 798 good stock • 46 low stock • 3 critical alerts"
- **Sync Status**: "Last sync: 2 mins ago" provides data freshness context
- **Manual Sync Button**: "🔄 Sync Inventory" for immediate data refresh
- **Visual Design**: Green background reinforces positive inventory management theme
- **Real-time Updates**: Statistics reflect current filtering and actual inventory status
- **Action Integration**: Sync button provides immediate control over data accuracy

## 6.9.2 User Interaction Flow

### Initial Screen Load

1. User arrives from Store Selection after clicking a specific store card
2. System loads inventory data for selected store (Oxford Street in example)
3. Header displays store context with current metrics badge
4. Product table shows initial page of inventory with status indicators
5. All controls initialize with current store's data and filter states

### Product Search and Filtering Process

1. **Search Functionality**:
    
    - User types in search field for real-time product filtering
    - Search covers product names, SKUs, and descriptions simultaneously
    - Results update instantly as user types without page reload
2. **Filter Application**:
    
    - Category dropdown filters products by classification
    - Stock level filter shows only products matching selected status
    - Multiple filters work together (AND logic) for precise results
3. **View Mode Toggle**:
    
    - Grid view button switches between table and card display formats
    - User preference maintained throughout session
    - Responsive design adapts to different screen sizes

### Inventory Management Operations

1. **Quick Actions Usage**:
    
    - Record Sale: Opens sales transaction screen with current store context
    - Add Stock: Opens purchase/receiving screen for inventory replenishment
    - Adjust Stock: Opens administrative correction screen (admin users only)
    - Export: Generates CSV or report file with current filtered view
2. **Table Interaction**:
    
    - Click column headers to sort data (name, stock level, price, etc.)
    - Visual status indicators provide immediate stock level assessment
    - Color coding helps prioritize products needing attention
3. **Navigation Flow**:
    
    - Pagination maintains current filter settings across pages
    - Back button returns to Store Selection preserving user context
    - Breadcrumb navigation allows jumping to any previous level

### Data Synchronization

- **Automatic Updates**: Inventory numbers update when returning from transaction screens
- **Manual Sync**: User can trigger immediate refresh using sync button
- **Status Tracking**: Last sync time shows data freshness for user confidence
- **Real-time Alerts**: New critical stock situations appear immediately

## 6.9.3 Design Rationale

### Layout Decisions

- **Store Context Priority**: Header emphasizes current store selection with metrics badge
- **Action-Oriented Design**: Quick actions prominently placed for efficient workflow
- **Table-First Approach**: Traditional table view optimal for comparing multiple data points
- **Progressive Disclosure**: Essential data visible, detailed actions accessible via buttons

### Visual Design Choices

- **Status Color System**: Consistent green/yellow/red coding across all inventory screens
- **Typography Hierarchy**: Clear distinction between headers, data, and metadata
- **Button Color Logic**: Functional color coding (sales=brown, stock=green, admin=blue)
- **White Space Usage**: Generous spacing prevents information overload

### User Experience Considerations

- **Workflow Efficiency**: Most common tasks (search, filter, record sale) require minimal clicks
- **Context Preservation**: User always knows which store they're working with
- **Error Prevention**: Visual status indicators help identify problems before they escalate
- **Scalability**: Pagination and filtering handle large product catalogs effectively

### Information Architecture

- **Data Prioritization**: Most critical information (stock levels, alerts) prominently displayed
- **Logical Grouping**: Search/filter, actions, data, and summary clearly separated
- **Consistent Patterns**: Follows established design language from previous screens
- **Accessibility**: High contrast colors and clear labels for all user types

### Technical Integration

- **Database Performance**: Pagination prevents slow loading with large inventories
- **Real-time Updates**: Status indicators reflect current database state
- **Filter Efficiency**: Smart filtering reduces server load while maintaining responsiveness
- **Export Functionality**: Allows offline analysis and record-keeping

### Business Process Support

- **Manual to Digital**: Replaces handwritten stock reports with real-time digital data
- **Multi-location Management**: Clear store context enables managing multiple locations
- **Alert System**: Visual indicators help prevent stockouts and overstocking
- **Audit Trail**: Updated timestamps and user tracking support accountability

## 6.9.4 Accessibility Features

- **High Contrast Design**: Status indicators use both color and icons (not color-only)
- **Clear Typography**: Sans-serif fonts optimized for screen readability
- **Logical Tab Order**: Keyboard navigation follows intuitive flow
- **Screen Reader Support**: Proper labels and semantic markup for all interactive elements
- **Responsive Layout**: Maintains functionality across different screen sizes and devices

## 6.9.5 Performance Considerations

- **Efficient Data Loading**: Pagination limits initial load to manageable dataset
- **Smart Filtering**: Client-side filtering where possible to reduce server requests
- **Visual Feedback**: Loading states and sync indicators provide user confidence
- **Caching Strategy**: Recent data cached locally for faster subsequent loads

This Inventory Overview screen serves as the primary working interface where users spend most of their time managing stock levels. The design prioritizes efficiency, clarity, and error prevention while maintaining consistency with the overall StockFlow design system.


