import { formatDate } from "./formatters";

// export transactions as CSV file
export const exportToCSV = (transactions, filename = "ledgr-export") => {
  const headers = ["Date", "Description", "Category", "Type", "Amount (INR)"];

  const rows = transactions.map((txn) => [
    formatDate(txn.date),
    `"${txn.description}"`,
    txn.category,
    txn.type,
    txn.amount,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();

  URL.revokeObjectURL(url);
};

// export transactions as JSON file
export const exportToJSON = (transactions, filename = "ledgr-export") => {
  const data = JSON.stringify(transactions, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().split("T")[0]}.json`;
  link.click();

  URL.revokeObjectURL(url);
};