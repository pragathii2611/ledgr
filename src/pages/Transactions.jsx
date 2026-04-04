import { useEffect, useState } from "react";
import { useTransactionStore } from "../store/transactionStore";
import { useAppStore } from "../store/appStore";
import TransactionFilters from "../components/transactions/TransactionFilters";
import TransactionTable from "../components/transactions/TransactionTable";
import TransactionTimeline from "../components/transactions/TransactionTimeline";
import ExportButton from "../components/transactions/ExportButton";
import { useFilteredTransactions } from "../hooks/useFilteredTransactions";
import { LayoutList, GitBranch } from "lucide-react";

export default function Transactions() {
  const { transactions, fetchTransactions } = useTransactionStore();
  const { role } = useAppStore();
  const filtered = useFilteredTransactions();
  const [view, setView] = useState("table");

  useEffect(() => {
    if (transactions.length === 0) fetchTransactions();
  }, []);

  return (
    <div className="space-y-5">
      {/* top bar */}
      <div className="flex items-center justify-between">
        {/* view toggle */}
        <div className="flex rounded-xl border border-[#EBEBE8] dark:border-[#2E2E2C] overflow-hidden bg-white dark:bg-[#242422]">
          <button
            onClick={() => setView("table")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-150
              ${view === "table"
                ? "bg-[#4F46E5] text-white"
                : "text-[#6B6B68] dark:text-[#8C8C88] hover:bg-[#F0EFEC] dark:hover:bg-[#2E2E2C]"
              }`}
          >
            <LayoutList size={15} />
            Table
          </button>
          <button
            onClick={() => setView("timeline")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-150
              ${view === "timeline"
                ? "bg-[#4F46E5] text-white"
                : "text-[#6B6B68] dark:text-[#8C8C88] hover:bg-[#F0EFEC] dark:hover:bg-[#2E2E2C]"
              }`}
          >
            <GitBranch size={15} />
            Timeline
          </button>
        </div>

        <ExportButton />
      </div>

      {/* filters */}
      <TransactionFilters />

      {/* content */}
      {view === "table" ? (
        <TransactionTable />
      ) : (
        <div className="bg-white dark:bg-[#242422] border border-[#EBEBE8] dark:border-[#2E2E2C] rounded-card shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-base font-semibold text-[#1A1A18] dark:text-[#F0EFEC]">
                Transaction Timeline
              </p>
              <p className="text-sm text-[#A8A8A5] mt-0.5">
                {filtered.length} transactions in chronological order
              </p>
            </div>
            {role === "admin" && (
              <button
                onClick={() => setView("table")}
                className="text-sm text-[#4F46E5] hover:underline"
              >
                Switch to table to add
              </button>
            )}
          </div>
          <TransactionTimeline transactions={filtered} />
        </div>
      )}
    </div>
  );
}