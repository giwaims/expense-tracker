import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState("");
  const [incomeDescription, setIncomeDescription] = useState("");
  const [expense, setExpense] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");

  // Load transactions from local storage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions));
      } catch (error) {
        console.error("Error loading transactions:", error);
        setTransactions([]);
      }
    }
  }, []);

  // Save transactions to local storage whenever they change
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
  }, [transactions]);

  // Add income
  const addIncome = () => {
    if (income && incomeDescription) {
      const newTransaction = {
        id: Date.now(),
        type: "Income",
        amount: parseFloat(income),
        description: incomeDescription,
      };
      setTransactions([...transactions, newTransaction]);
      setIncome("");
      setIncomeDescription("");
    }
  };

  // Add expense
  const addExpense = () => {
    if (expense && expenseDescription) {
      const newTransaction = {
        id: Date.now(),
        type: "Expense",
        amount: parseFloat(expense),
        description: expenseDescription,
      };
      setTransactions([...transactions, newTransaction]);
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

  // Delete a transaction
  const deleteTransaction = (id) => {
    const updatedTransactions = transactions.filter(
      (transaction) => transaction.id !== id
    );
    setTransactions(updatedTransactions);
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
                  className={transaction.type.toLowerCase()}
                >
                  <span>
                    {transaction.type}: {formatCurrency(transaction.amount)} -{" "}
                    <strong>{transaction.description}</strong>
                  </span>
                  <button onClick={() => deleteTransaction(transaction.id)}>
                    ×
                  </button>
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
