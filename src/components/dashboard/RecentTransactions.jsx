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
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F0] dark:border-[#27272A]">
        <div>
          <p className="text-sm font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
            Recent Transactions
          </p>
          <p className="text-xs text-[#9CA3AF] mt-0.5">Latest activity</p>
        </div>
        <button
          onClick={() => setActivePage("transactions")}
          className="flex items-center gap-1 text-xs text-[#6B7280] hover:text-[#0A0A0A] dark:hover:text-[#FAFAFA] transition-colors duration-100"
        >
          View all
          <ArrowRight size={12} />
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
                  className="px-5 py-3 text-left text-[10px] font-medium text-[#9CA3AF] uppercase tracking-widest"
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
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                      {txn.description}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: categoryColors[txn.category] || "#9CA3AF",
                        }}
                      />
                      <span className="text-xs text-[#6B7280] dark:text-[#A1A1AA]">
                        {txn.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-[#9CA3AF]">
                      {formatDate(txn.date)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge type={txn.type} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span
                      className={`text-xs font-semibold font-mono ${
                        txn.type === "income"
                          ? "text-[#16A34A]"
                          : "text-[#DC2626]"
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