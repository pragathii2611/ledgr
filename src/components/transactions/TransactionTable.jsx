import { useState } from "react";
import { useTransactionStore } from "../../store/transactionStore";
import { useAppStore } from "../../store/appStore";
import { useFilteredTransactions } from "../../hooks/useFilteredTransactions";
import Badge from "../ui/Badge";
import EmptyState from "../ui/EmptyState";
import { TableRowSkeleton } from "../ui/Skeleton";
import TransactionModal from "./TransactionModal";
import { formatDate, formatCurrency } from "../../utils/formatters";
import { categoryColors } from "../../data/mockData";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function TransactionTable() {
  const { transactions, isLoading, deleteTransaction } = useTransactionStore();
  const { role } = useAppStore();
  const filtered = useFilteredTransactions();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  const handleEdit = (txn) => {
    setEditingTx(txn);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTx(null);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    await deleteTransaction(id);
    toast.success("Transaction deleted.");
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingTx(null);
  };

  return (
    <>
      {/* table */}
      <div className="bg-white dark:bg-[#18181B] border border-[#F0F0F0] dark:border-[#27272A] rounded-card shadow-card">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0F0F0] dark:border-[#27272A]">
          <div>
            <p className="text-base font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
              All Transactions
            </p>
            <p className="text-sm text-[#9CA3AF] mt-0.5">
              {filtered.length} records found
            </p>
          </div>

          {role === "admin" && (
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#18181B] dark:bg-[#FAFAFA] dark:text-[#18181B] rounded-xl hover:opacity-90 transition-opacity"
            >
              + Add Transaction
            </button>
          )}
        </div>

        {/* table content */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F0F0F0] dark:border-[#27272A]">
                {["Description", "Category", "Date", "Type", "Amount", ...(role === "admin" ? ["Actions"] : [])].map((h) => (
                  <th
                    key={h}
                    className={`px-6 py-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest ${h === "Amount" || h === "Actions" ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F0] dark:divide-[#27272A]">
              {isLoading ? (
                Array(8).fill(0).map((_, i) => <TableRowSkeleton key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={role === "admin" ? 6 : 5}>
                    <EmptyState
                      title="No transactions found"
                      subtitle="Try adjusting your filters or add a new transaction."
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((txn) => (
                  <tr
                    key={txn.id}
                    className="hover:bg-[#FAFAFA] dark:hover:bg-[#09090B] transition-colors duration-100 group"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                        {txn.description}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
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

                    {role === "admin" && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                          <button
                            onClick={() => handleEdit(txn)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7280] hover:text-[#0A0A0A] dark:hover:text-[#FAFAFA] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] transition-all"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(txn.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7280] hover:text-[#DC2626] hover:bg-[#FEF2F2] dark:hover:bg-[#2d0a0a] transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* modal */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={handleClose}
        transaction={editingTx}
      />
    </>
  );
}