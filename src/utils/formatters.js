// format currency in Indian Rupee format
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// format date to readable string
// "2026-01-15" → "15 Jan 2026"
export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// format date to short version
// "2026-01-15" → "15 Jan"
export const formatDateShort = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

// format month name from date string
// "2026-01-15" → "January"
export const formatMonth = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

// get month short name
// "2026-01-15" → "Jan"
export const getMonthShort = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    month: "short",
  });
};

// format large numbers compactly
// 92400 → "₹92.4K"
export const formatCompact = (amount) => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount}`;
};

// get today's date as yyyy-mm-dd string
export const getTodayString = () => {
  return new Date().toISOString().split("T")[0];
};