Expense Tracker App Documentation

 Overview
This is a React-based expense tracking application that allows users to add income and expenses, view their transaction history, and export data to CSV format. The app features a sleek, dark-themed UI with responsive design for various screen sizes.

 Key Features
1. Add income and expenses with descriptions
2. View current balance (income minus expenses)
3. See transaction history with expandable details
4. Delete individual transactions
5. Export all transactions to CSV
6. Persistent data storage using localStorage
7. Responsive design that works on mobile, tablet, and desktop
8. Support for shorthand currency notation (k, m, b)
9. Nigerian Naira (₦) as the default currency

 Technical Architecture

 Core Technologies
- React (v19.0.0)
- React Hooks (useState, useEffect, useRef)
- CSS3 with responsive design
- Local storage for data persistence
- Font Awesome icons via CDN

 Component Structure
The application is built as a single component (`App.js`) with the following logical sections:
- Header with balance display
- Input section (split into income and expense forms)
- Transactions section (list of transactions with expandable details)

 Data Model
Each transaction is stored as an object with:
```javascript
{
  id: Number, // Timestamp used as unique identifier
  type: String, // "Income" or "Expense"
  amount: Number, // Parsed numeric amount
  description: String, // User-provided description
  timestamp: String // ISO string of creation time
}
```

 Key Functions

 State Management
- Transactions data is persisted in localStorage
- Input fields maintain their own state until submission
- A reference to the transactions list allows for dynamic height adjustment

 Transaction Management
- `addIncome()` and `addExpense()` create new transaction records
- `deleteTransaction()` removes transactions by ID
- `toggleDetails()` expands/collapses transaction details
- `parseAmount()` handles currency notation (e.g., "1k" → 1000)

 UI/UX Features
- Dynamic calculation of transaction list height based on available viewport space
- Formatting functions for currency and dates
- CSV export functionality with proper encoding
- Keyboard support (Enter key to submit)

 CSS Structure
The CSS uses:
- Custom properties (variables) for consistent theming
- Media queries for responsive design (desktop, tablet, mobile)
- Flexbox and Grid for layout
- Animations and transitions for interactive elements
- Font Awesome icons for UI elements

 Data Persistence
The application uses localStorage for persisting:
- All transactions
- Which transaction is currently expanded

The app includes safeguards for environments where localStorage is unavailable.

 Additional Features
- Shorthand notation parsing (1k = 1,000, 1m = 1,000,000, etc.)
- Responsive design with three breakpoints (desktop, tablet, mobile)
- Different styling for income vs expense items
- Expandable transaction details with date/time and delete option

This expense tracker provides a complete solution for tracking personal finances with a focus on usability and visual appeal.