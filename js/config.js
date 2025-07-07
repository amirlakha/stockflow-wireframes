// Screen configuration data
const screens = {
    'login': {
        title: 'Login Screen',
        description: 'User authentication and system entry point. Validates credentials against local SQLite database and establishes user session with role-based permissions.'
    },
    'dashboard': {
        title: 'Main Dashboard',
        description: 'Central navigation hub showing system overview, quick statistics, recent activity, and role-based menu options for efficient system navigation.'
    },
    'store-selection': {
        title: 'Store Selection',
        description: 'Grid view of accessible store locations with search, filtering, status indicators, and access control based on user permissions from user_locations table.'
    },
    'inventory': {
        title: 'Inventory Overview',
        description: 'Real-time inventory management with product search, category filtering, stock level monitoring, and bulk operations. Features sortable columns, pagination, and CSV export functionality.'
    },
    'record-sale': {
        title: 'Record Sale',
        description: 'Transaction processing interface for recording customer sales, validating stock availability, and automatically updating inventory levels with full audit trail.'
    },
    'alerts': {
        title: 'Alerts Dashboard',
        description: 'Monitor and manage low-stock notifications across all accessible stores with severity indicators, historical tracking, and email notification controls.'
    }
};