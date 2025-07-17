import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState("");
  const [incomeDescription, setIncomeDescription] = useState("");
  const [expense, setExpense] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const transactionsListRef = useRef(null);

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

  useEffect(() => {
    if (isLocalStorageAvailable()) {
      const savedTransactions = localStorage.getItem(
        "expense-tracker-transactions"
      );
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));

      const savedExpandedId = localStorage.getItem(
        "expense-tracker-expanded-id"
      );
      if (savedExpandedId && savedExpandedId !== "null")
        setExpandedId(parseInt(savedExpandedId));
    }
  }, []);

  useEffect(() => {
    if (!isLocalStorageAvailable()) return;
    localStorage.setItem(
      "expense-tracker-transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  useEffect(() => {
    if (!isLocalStorageAvailable()) return;
    localStorage.setItem("expense-tracker-expanded-id", expandedId);
  }, [expandedId]);

  useEffect(() => {
    const updateTransactionsListHeight = () => {
      if (!transactionsListRef.current) return;

      const header = document.querySelector(".app-header");
      const inputSection = document.querySelector(".input-section");
      const transactionsHeader = document.querySelector(".transactions-header");
      const app = document.querySelector(".app");

      if (!header || !inputSection || !transactionsHeader || !app) return;

      const headerHeight = header.getBoundingClientRect().height;
      const inputSectionHeight = inputSection.getBoundingClientRect().height;
      const transactionsHeaderHeight =
        transactionsHeader.getBoundingClientRect().height;

      const viewportHeight = window.innerHeight;

      const appPadding = 40;
      const transactionsSectionPadding = 40;
      const margins = 60;

      const availableHeight =
        viewportHeight -
        (headerHeight +
          inputSectionHeight +
          transactionsHeaderHeight +
          appPadding +
          transactionsSectionPadding +
          margins);

      const maxHeight = Math.max(200, availableHeight);
      transactionsListRef.current.style.maxHeight = `${maxHeight}px`;
    };

    updateTransactionsListHeight();
    window.addEventListener("resize", updateTransactionsListHeight);

    return () =>
      window.removeEventListener("resize", updateTransactionsListHeight);
  }, [transactions, expandedId]);

  const toggleDetails = (id) => setExpandedId(expandedId === id ? null : id);

  const parseAmount = (value) => {
    const trimmedValue = value.trim().toLowerCase().replace("₦", ""); // Ignore ₦ symbol
    if (trimmedValue.endsWith("k")) {
      const num = parseFloat(trimmedValue.replace("k", ""));
      return isNaN(num) ? 0 : num * 1000;
    } else if (trimmedValue.endsWith("m")) {
      const num = parseFloat(trimmedValue.replace("m", ""));
      return isNaN(num) ? 0 : num * 1000000;
    } else if (trimmedValue.endsWith("b")) {
      const num = parseFloat(trimmedValue.replace("b", ""));
      return isNaN(num) ? 0 : num * 1000000000;
    }
    return parseFloat(trimmedValue) || 0;
  };

  const addIncome = () => {
    const amount = parseAmount(income);
    if (!income || amount <= 0 || !incomeDescription) return;
    const newTransaction = {
      id: Date.now(),
      type: "Income",
      amount,
      description: incomeDescription,
      timestamp: new Date().toISOString(),
    };
    setTransactions([...transactions, newTransaction]);
    setIncome("");
    setIncomeDescription("");
  };

  const addExpense = () => {
    const amount = parseAmount(expense);
    if (!expense || amount <= 0 || !expenseDescription) return;
    const newTransaction = {
      id: Date.now(),
      type: "Expense",
      amount,
      description: expenseDescription,
      timestamp: new Date().toISOString(),
    };
    setTransactions([...transactions, newTransaction]);
    setExpense("");
    setExpenseDescription("");
  };

  const handleKeyPress = (e, type) => {
    if (e.key === "Enter") {
      type === "income" ? addIncome() : addExpense();
    }
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const calculateBalance = () => {
    const totalIncome = transactions
      .filter((t) => t.type === "Income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === "Expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return totalIncome - totalExpenses;
  };

  const formatCurrency = (amount) =>
    `\u20A6${amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const exportToCSV = () => {
    const headers = ["Type", "Amount", "Description", "Date"].join(",") + "\n";
    const rows = transactions
      .map((t) =>
        [
          t.type,
          `"${formatCurrency(t.amount).replace(/"/g, '""')}"`,
          `"${t.description.replace(/"/g, '""')}"`,
          `"${formatDate(t.timestamp).replace(/"/g, '""')}"`,
        ].join(",")
      )
      .join("\n");
    const csvContent = "\uFEFF" + headers + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `transactions_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Expense Tracker</h1>
        <div className="balance-card">
          <span className="balance-label">Balance</span>
          <span
            className={`balance-amount ${
              calculateBalance() >= 0 ? "positive" : "negative"
            }`}
          >
            {formatCurrency(calculateBalance())}
          </span>
        </div>
      </header>

      <main className="app-main">
        <section className="input-section">
          <div className="input-card income">
            <h2>Add Income</h2>
            <input
              type="text"
              placeholder="Description"
              value={incomeDescription}
              onChange={(e) => setIncomeDescription(e.target.value)}
            />
            <input
              type="text"
              placeholder="Amount (₦)"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, "income")}
            />
            <button className="action-btn income-btn" onClick={addIncome}>
              Add
            </button>
          </div>
          <div className="input-card expense">
            <h2>Add Expense</h2>
            <input
              type="text"
              placeholder="Description"
              value={expenseDescription}
              onChange={(e) => setExpenseDescription(e.target.value)}
            />
            <input
              type="text"
              placeholder="Amount (₦)"
              value={expense}
              onChange={(e) => setExpense(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, "expense")}
            />
            <button className="action-btn expense-btn" onClick={addExpense}>
              Add
            </button>
          </div>
        </section>

        <section className="transactions-section">
          <div className="transactions-header">
            <h2>Transactions</h2>
            {transactions.length > 0 && (
              <button className="export-btn" onClick={exportToCSV}>
                <i className="fas fa-file-export"></i>
              </button>
            )}
          </div>
          {transactions.length === 0 ? (
            <p className="no-transactions">No transactions yet.</p>
          ) : (
            <ul className="transactions-list" ref={transactionsListRef}>
              {transactions.map((transaction) => (
                <li
                  key={transaction.id}
                  className={`transaction-item ${transaction.type.toLowerCase()} ${
                    expandedId === transaction.id ? "expanded" : ""
                  }`}
                  onClick={() => toggleDetails(transaction.id)}
                >
                  <div className="transaction-summary">
                    <span className="transaction-type">
                      {transaction.type}: {formatCurrency(transaction.amount)}
                    </span>
                    <span className="transaction-desc">
                      {transaction.description}
                    </span>
                  </div>
                  {expandedId === transaction.id && (
                    <div className="transaction-details">
                      <div className="details-row">
                        <p>{formatDate(transaction.timestamp)}</p>
                        <button
                          className="delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTransaction(transaction.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
