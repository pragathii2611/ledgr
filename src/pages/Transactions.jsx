import { useEffect } from "react";
import { useTransactionStore } from "../store/transactionStore";
import TransactionFilters from "../components/transactions/TransactionFilters";
import TransactionTable from "../components/transactions/TransactionTable";
import ExportButton from "../components/transactions/ExportButton";

export default function Transactions() {
  const { transactions, fetchTransactions } = useTransactionStore();

  useEffect(() => {
    if (transactions.length === 0) {
      fetchTransactions();
    }
  }, []);

  return (
    <div className="space-y-5">
      {/* top bar */}
      <div className="flex items-center justify-end">
        <ExportButton />
      </div>

      {/* filters */}
      <TransactionFilters />

      {/* table */}
      <TransactionTable />
    </div>
  );
}