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

  const handleEdit = (txn) => { setEditingTx(txn); setModalOpen(true); };
  const handleAdd = () => { setEditingTx(null); setModalOpen(true); };
  const handleClose = () => { setModalOpen(false); setEditingTx(null); };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    await deleteTransaction(id);
    toast.success("Transaction deleted.");
  };

  return (
    <>
      <div className="bg-white dark:bg-[#242422] border border-[#EBEBE8] dark:border-[#2E2E2C] rounded-card shadow-card">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EBEBE8] dark:border-[#2E2E2C]">
          <div>
            <p className="text-base font-semibold text-[#1A1A18] dark:text-[#F0EFEC]">All Transactions</p>
            <p className="text-sm text-[#A8A8A5] mt-0.5">{filtered.length} records found</p>
          </div>
          {role === "admin" && (
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl transition-colors duration-150"
            >
              + Add Transaction
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#EBEBE8] dark:border-[#2E2E2C]">
                {["Description", "Category", "Date", "Type", "Amount", ...(role === "admin" ? ["Actions"] : [])].map((h) => (
                  <th key={h} className={`px-6 py-4 text-xs font-semibold text-[#A8A8A5] uppercase tracking-widest ${h === "Amount" || h === "Actions" ? "text-right" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBEBE8] dark:divide-[#2E2E2C]">
              {isLoading ? (
                Array(8).fill(0).map((_, i) => <TableRowSkeleton key={i} />)
              ) : filtered.length === 0 ? (
                <tr><td colSpan={role === "admin" ? 6 : 5}>
                  <EmptyState title="No transactions found" subtitle="Try adjusting your filters or add a new transaction." />
                </td></tr>
              ) : (
                filtered.map((txn) => (
                  <tr key={txn.id} className="hover:bg-[#F7F6F3] dark:hover:bg-[#1C1C1A] transition-colors duration-100 group">
                    <td className="px-6 py-4"><span className="text-sm font-medium text-[#1A1A18] dark:text-[#F0EFEC]">{txn.description}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: categoryColors[txn.category] || "#A8A8A5" }} />
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
                    {role === "admin" && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                          <button onClick={() => handleEdit(txn)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B6B68] hover:text-[#4F46E5] hover:bg-[#EEF2FF] dark:hover:bg-[#2E2C4E] transition-all">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDelete(txn.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B6B68] hover:text-[#DC2626] hover:bg-[#FEF2F2] dark:hover:bg-[#2d0a0a] transition-all">
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

      <TransactionModal isOpen={modalOpen} onClose={handleClose} transaction={editingTx} />
    </>
  );
}

<div className="overflow-x-auto">
  <div className="min-w-[700px]">
    <table className="w-full"></table>
    </div>
</div>