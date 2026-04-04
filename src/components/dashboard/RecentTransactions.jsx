import { useAppStore } from "../../store/appStore";
import Badge from "../ui/Badge";
import EmptyState from "../ui/EmptyState";
import { formatDate, formatCurrency } from "../../utils/formatters";
import { categoryColors } from "../../data/mockData";
import { ArrowRight } from "lucide-react";
import { TableRowSkeleton } from "../ui/Skeleton";

export default function RecentTransactions({ transactions, isLoading }) {
  const { setActivePage } = useAppStore();
  const recent = transactions.slice(0, 5);

  return (
    <div className="bg-white dark:bg-[#242422] border border-[#EBEBE8] dark:border-[#2E2E2C] rounded-card shadow-card">
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#EBEBE8] dark:border-[#2E2E2C]">
        <div>
          <p className="text-base font-semibold text-[#1A1A18] dark:text-[#F0EFEC]">Recent Transactions</p>
          <p className="text-sm text-[#A8A8A5] mt-0.5">Latest activity</p>
        </div>
        <button
          onClick={() => setActivePage("transactions")}
          className="flex items-center gap-1.5 text-sm text-[#6B6B68] hover:text-[#1A1A18] dark:hover:text-[#F0EFEC] transition-colors duration-100"
        >
          View all <ArrowRight size={14} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#EBEBE8] dark:border-[#2E2E2C]">
              {["Description", "Category", "Date", "Type", "Amount"].map((h) => (
                <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-[#A8A8A5] uppercase tracking-widest">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBEBE8] dark:divide-[#2E2E2C]">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => <TableRowSkeleton key={i} />)
            ) : recent.length === 0 ? (
              <tr><td colSpan={5}><EmptyState title="No transactions yet" subtitle="Add your first transaction to get started." /></td></tr>
            ) : (
              recent.map((txn) => (
                <tr key={txn.id} className="hover:bg-[#F7F6F3] dark:hover:bg-[#1C1C1A] transition-colors duration-100">
                  <td className="px-6 py-4"><span className="text-sm font-medium text-[#1A1A18] dark:text-[#F0EFEC]">{txn.description}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColors[txn.category] || "#A8A8A5" }} />
                      <span className="text-sm text-[#6B6B68] dark:text-[#8C8C88]">{txn.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="text-sm text-[#A8A8A5]">{formatDate(txn.date)}</span></td>
                  <td className="px-6 py-4"><Badge type={txn.type} /></td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-sm font-semibold font-mono ${txn.type === "income" ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                      {txn.type === "income" ? "+" : "-"}{formatCurrency(txn.amount)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          
        </table>
      </div>
    </div>
  );
}

{/* table */}
<div className="overflow-x-auto -mx-0">
  <div className="min-w-[600px]">
    <table className="w-full"></table>
    </div>
</div>
