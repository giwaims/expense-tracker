import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // Main state
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState("");
  const [incomeDescription, setIncomeDescription] = useState("");
  const [expense, setExpense] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  // Debug state to verify localStorage
  const [setStorageStatus] = useState("Checking...");

  // Check if localStorage is available
  const isLocalStorageAvailable = () => {
    try {
      const testKey = "__test_key__";
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Initialize app and load data
  useEffect(() => {
    // First verify localStorage is working
    if (!isLocalStorageAvailable()) {
      setStorageStatus("LocalStorage not available in your browser. Transactions won't persist.");
      console.error("LocalStorage is not available");
      return;
    }

    try {
      // Load saved transactions
      const savedTransactions = localStorage.getItem("expense-tracker-transactions");
      if (savedTransactions) {
        const parsedTransactions = JSON.parse(savedTransactions);
        setTransactions(parsedTransactions);
        setStorageStatus(`Loaded ${parsedTransactions.length} transactions`);
        console.log("Loaded transactions:", parsedTransactions);
      } else {
        setStorageStatus("No saved transactions found");
      }

      // Load expanded transaction info
      const savedExpandedId = localStorage.getItem("expense-tracker-expanded-id");
      if (savedExpandedId && savedExpandedId !== "null") {
        setExpandedId(parseInt(savedExpandedId));
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      setStorageStatus(`Error loading data: ${error.message}`);
    }
  }, [setStorageStatus]);

  // Save transactions whenever they change
  useEffect(() => {
    if (!isLocalStorageAvailable()) return;

    try {
      // Only save if we have transactions to save and the component is mounted
      if (transactions.length >= 0) {
        localStorage.setItem("expense-tracker-transactions", JSON.stringify(transactions));
        setStorageStatus(`Saved ${transactions.length} transactions`);
        console.log("Saved transactions:", transactions);
      }
    } catch (error) {
      console.error("Error saving transactions:", error);
      setStorageStatus(`Error saving data: ${error.message}`);
    }
  }, [transactions, setStorageStatus]);

  // Save expanded ID when it changes
  useEffect(() => {
    if (!isLocalStorageAvailable()) return;
    localStorage.setItem("expense-tracker-expanded-id", expandedId);
  }, [expandedId]);

  // Toggle transaction details
  const toggleDetails = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Add income with improved validation
  const addIncome = () => {
    if (income && !isNaN(parseFloat(income)) && incomeDescription) {
      const amount = parseFloat(income);
      const newTransaction = {
        id: Date.now(),
        type: "Income",
        amount: amount,
        description: incomeDescription,
        timestamp: new Date().toISOString()
      };

      // Force saving by creating a new array instance
      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);

      // Manually save to localStorage as a backup mechanism
      try {
        localStorage.setItem("expense-tracker-transactions", JSON.stringify(updatedTransactions));
        console.log("Manually saved after adding income");
      } catch (err) {
        console.error("Manual save failed:", err);
      }

      setIncome("");
      setIncomeDescription("");
    }
  };

  // Add expense with improved validation
  const addExpense = () => {
    if (expense && !isNaN(parseFloat(expense)) && expenseDescription) {
      const amount = parseFloat(expense);
      const newTransaction = {
        id: Date.now(),
        type: "Expense",
        amount: amount,
        description: expenseDescription,
        timestamp: new Date().toISOString()
      };

      // Force saving by creating a new array instance
      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);

      // Manually save to localStorage as a backup mechanism
      try {
        localStorage.setItem("expense-tracker-transactions", JSON.stringify(updatedTransactions));
        console.log("Manually saved after adding expense");
      } catch (err) {
        console.error("Manual save failed:", err);
      }

      setExpense("");
      setExpenseDescription("");
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e, type) => {
    if (e.key === "Enter") {
      if (type === "income") {
        addIncome();
      } else if (type === "expense") {
        addExpense();
      }
    }
  };

  // Delete a transaction with improved handling
  const deleteTransaction = (id) => {
    const updatedTransactions = transactions.filter(
      (transaction) => transaction.id !== id
    );

    setTransactions(updatedTransactions);

    // Manually save to localStorage as a backup mechanism
    try {
      localStorage.setItem("expense-tracker-transactions", JSON.stringify(updatedTransactions));
      console.log("Manually saved after deletion");
    } catch (err) {
      console.error("Manual save failed:", err);
    }

    // If deleted transaction was expanded, collapse it
    if (expandedId === id) {
      setExpandedId(null);
    }
  };

  // Calculate balance
  const calculateBalance = () => {
    const totalIncome = transactions
      .filter((transaction) => transaction.type === "Income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalExpenses = transactions
      .filter((transaction) => transaction.type === "Expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return totalIncome - totalExpenses;
  };

  // Format currency in Naira
  const formatCurrency = (amount) => {
    return `\u20A6${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
    })}`;
  };

  // Format timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Force save transactions (for testing)
  const forceSave = () => {
    try {
      localStorage.setItem("expense-tracker-transactions", JSON.stringify(transactions));
      setStorageStatus(`Manually saved ${transactions.length} transactions`);
      console.log("Force saved transactions");
    } catch (err) {
      console.error("Force save failed:", err);
      setStorageStatus(`Force save failed: ${err.message}`);
    }
  }; forceSave();

  return (
    <div className="App">
      <header>
        <h1>Expense Tracker</h1>
        <div className="balance-section">
          <h2>Current Balance</h2>
          <p>{formatCurrency(calculateBalance())}</p>
        </div>
      </header>

      <main>
        <div className="input-container">
          <div className="input-section income-section">
            <h2>Add Income</h2>
            <div className="input-group">
              <input
                type="text"
                placeholder="Description"
                value={incomeDescription}
                onChange={(e) => setIncomeDescription(e.target.value)}
              />
              <input
                type="number"
                placeholder="Amount"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, "income")}
              />
              <button onClick={addIncome}>+</button>
            </div>
          </div>

          <div className="input-section expense-section">
            <h2>Add Expense</h2>
            <div className="input-group">
              <input
                type="text"
                placeholder="Description"
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
              />
              <input
                type="number"
                placeholder="Amount"
                value={expense}
                onChange={(e) => setExpense(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, "expense")}
              />
              <button onClick={addExpense}>-</button>
            </div>
          </div>
        </div>

        <div className="transactions-section">
          <h2>Transactions</h2>
          {transactions.length === 0 ? (
            <p className="no-transactions">No transactions found.</p>
          ) : (
            <ul>
              {transactions.map((transaction) => (
                <li
                  key={transaction.id}
                  className={`${transaction.type.toLowerCase()} ${expandedId === transaction.id ? "expanded" : ""
                    }`}
                  onClick={() => toggleDetails(transaction.id)}
                >
                  <div className="transaction-summary">
                    <span>
                      {transaction.type}: {formatCurrency(transaction.amount)}
                    </span>
                    <span className="transaction-description">
                      {transaction.description}
                    </span>
                  </div>
                  {expandedId === transaction.id && (
                    <div className="transaction-details">
                      <div className="detail-row">
                        <span>Date:</span>
                        <span>{formatDate(transaction.timestamp)}</span>
                      </div>
                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTransaction(transaction.id);
                        }}
                      >
                        Delete Transaction
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;