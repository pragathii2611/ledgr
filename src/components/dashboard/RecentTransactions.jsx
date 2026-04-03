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
    <div className="bg-white dark:bg-[#18181B] border border-[#F0F0F0] dark:border-[#27272A] rounded-card shadow-card">
      {/* header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0F0F0] dark:border-[#27272A]">
        <div>
          <p className="text-base font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
            Recent Transactions
          </p>
          <p className="text-sm text-[#9CA3AF] mt-0.5">Latest activity</p>
        </div>
        <button
          onClick={() => setActivePage("transactions")}
          className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#0A0A0A] dark:hover:text-[#FAFAFA] transition-colors duration-100"
        >
          View all
          <ArrowRight size={14} />
        </button>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#F0F0F0] dark:border-[#27272A]">
              {["Description", "Category", "Date", "Type", "Amount"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F0F0] dark:divide-[#27272A]">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => <TableRowSkeleton key={i} />)
            ) : recent.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <EmptyState
                    title="No transactions yet"
                    subtitle="Add your first transaction to get started."
                  />
                </td>
              </tr>
            ) : (
              recent.map((txn) => (
                <tr
                  key={txn.id}
                  className="hover:bg-[#FAFAFA] dark:hover:bg-[#09090B] transition-colors duration-100"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                      {txn.description}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: categoryColors[txn.category] || "#9CA3AF" }}
                      />
                      <span className="text-sm text-[#6B7280] dark:text-[#A1A1AA]">
                        {txn.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#9CA3AF]">
                      {formatDate(txn.date)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge type={txn.type} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`text-sm font-semibold font-mono ${
                        txn.type === "income" ? "text-[#16A34A]" : "text-[#DC2626]"
                      }`}
                    >
                      {txn.type === "income" ? "+" : "-"}
                      {formatCurrency(txn.amount)}
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