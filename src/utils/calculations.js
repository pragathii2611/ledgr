// get total income from transactions array
export const getTotalIncome = (transactions) => {
  return transactions
    .filter((txn) => txn.type === "income")
    .reduce((sum, txn) => sum + txn.amount, 0);
};

// get total expenses from transactions array
export const getTotalExpenses = (transactions) => {
  return transactions
    .filter((txn) => txn.type === "expense")
    .reduce((sum, txn) => sum + txn.amount, 0);
};

// get net balance
export const getNetBalance = (transactions) => {
  return getTotalIncome(transactions) - getTotalExpenses(transactions);
};

// get savings rate as a percentage
export const getSavingsRate = (transactions) => {
  const income = getTotalIncome(transactions);
  const expenses = getTotalExpenses(transactions);
  if (income === 0) return 0;
  return (((income - expenses) / income) * 100).toFixed(1);
};

// group transactions by month
// returns array like:
// [{ month: "Jan 2026", income: 92400, expenses: 34000, balance: 58400 }]
export const getMonthlyData = (transactions) => {
  const map = {};

  transactions.forEach((txn) => {
    const date = new Date(txn.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });

    if (!map[key]) {
      map[key] = { key, month: label, income: 0, expenses: 0, balance: 0 };
    }

    if (txn.type === "income") {
      map[key].income += txn.amount;
    } else {
      map[key].expenses += txn.amount;
    }

    map[key].balance = map[key].income - map[key].expenses;
  });

  return Object.values(map).sort((a, b) => a.key.localeCompare(b.key));
};

// get spending breakdown by category
// returns array sorted by amount descending
export const getCategoryBreakdown = (transactions) => {
  const map = {};

  transactions
    .filter((txn) => txn.type === "expense")
    .forEach((txn) => {
      if (!map[txn.category]) {
        map[txn.category] = 0;
      }
      map[txn.category] += txn.amount;
    });

  const total = Object.values(map).reduce((sum, val) => sum + val, 0);

  return Object.entries(map)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? ((amount / total) * 100).toFixed(1) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
};

// get highest spending category
export const getTopCategory = (transactions) => {
  const breakdown = getCategoryBreakdown(transactions);
  return breakdown.length > 0 ? breakdown[0] : null;
};

// get biggest single expense
export const getBiggestExpense = (transactions) => {
  const expenses = transactions.filter((txn) => txn.type === "expense");
  if (expenses.length === 0) return null;
  return expenses.reduce((max, txn) =>
    txn.amount > max.amount ? txn : max
  );
};

// get transactions for a specific month
// monthKey format: "2026-01"
export const getTransactionsByMonth = (transactions, monthKey) => {
  return transactions.filter((txn) => txn.date.startsWith(monthKey));
};

// get month over month change
// returns percentage change in balance vs previous month
export const getMonthlyChange = (transactions) => {
  const monthly = getMonthlyData(transactions);
  if (monthly.length < 2) return null;

  const current = monthly[monthly.length - 1];
  const previous = monthly[monthly.length - 2];

  if (previous.balance === 0) return null;

  const change = (((current.balance - previous.balance) / Math.abs(previous.balance)) * 100).toFixed(1);
  return {
    percentage: change,
    direction: change >= 0 ? "up" : "down",
    current: current.balance,
    previous: previous.balance,
  };
};