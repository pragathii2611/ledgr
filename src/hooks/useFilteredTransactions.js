import { useMemo } from "react";
import { useTransactionStore } from "../store/transactionStore";
import { useFilterStore } from "../store/filterStore";

export const useFilteredTransactions = () => {
  const { transactions } = useTransactionStore();
  const {
    search,
    type,
    category,
    sortBy,
    sortOrder,
    dateFrom,
    dateTo,
    amountMin,
    amountMax,
  } = useFilterStore();

  const filtered = useMemo(() => {
    let result = [...transactions];

    // search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (txn) =>
          txn.description.toLowerCase().includes(q) ||
          txn.category.toLowerCase().includes(q)
      );
    }

    // type filter
    if (type !== "all") {
      result = result.filter((txn) => txn.type === type);
    }

    // category filter
    if (category !== "all") {
      result = result.filter((txn) => txn.category === category);
    }

    // date range
    if (dateFrom) {
      result = result.filter((txn) => txn.date >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((txn) => txn.date <= dateTo);
    }

    // amount range
    if (amountMin !== "") {
      result = result.filter((txn) => txn.amount >= Number(amountMin));
    }
    if (amountMax !== "") {
      result = result.filter((txn) => txn.amount <= Number(amountMax));
    }

    // sorting
    result.sort((a, b) => {
      let valA, valB;

      if (sortBy === "date") {
        valA = new Date(a.date);
        valB = new Date(b.date);
      } else if (sortBy === "amount") {
        valA = a.amount;
        valB = b.amount;
      } else if (sortBy === "category") {
        valA = a.category;
        valB = b.category;
      } else if (sortBy === "description") {
        valA = a.description;
        valB = b.description;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [
    transactions,
    search,
    type,
    category,
    sortBy,
    sortOrder,
    dateFrom,
    dateTo,
    amountMin,
    amountMax,
  ]);

  return filtered;
};