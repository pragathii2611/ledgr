import { formatDate, formatCurrency } from "../../utils/formatters";
import { categoryColors } from "../../data/mockData";
import Badge from "../ui/Badge";
import EmptyState from "../ui/EmptyState";
import { useAppStore } from "../../store/appStore";
import { useTransactionStore } from "../../store/transactionStore";
import TransactionModal from "./TransactionModal";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

function groupByDate(transactions) {
  const map = {};
  transactions.forEach((txn) => {
    if (!map[txn.date]) map[txn.date] = [];
    map[txn.date].push(txn);
  });
  return Object.entries(map).sort((a, b) => new Date(b[0]) - new Date(a[0]));
}

export default function TransactionTimeline({ transactions }) {
  const { role } = useAppStore();
  const { deleteTransaction } = useTransactionStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  const grouped = groupByDate(transactions);

  const handleEdit = (txn) => { setEditingTx(txn); setModalOpen(true); };
  const handleClose = () => { setModalOpen(false); setEditingTx(null); };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    await deleteTransaction(id);
    toast.success("Transaction deleted.");
  };

  if (transactions.length === 0) {
    return <EmptyState title="No transactions found" subtitle="Try adjusting your filters." />;
  }

  return (
    <>
      <div className="relative">
        {grouped.map(([date, txns], groupIdx) => {
          const dayTotal = txns.reduce((sum, t) => {
            return t.type === "income" ? sum + t.amount : sum - t.amount;
          }, 0);

          return (
            <div key={date} className="relative pl-8 mb-8">
              {/* vertical line */}
              {groupIdx < grouped.length - 1 && (
                <div className="absolute left-[11px] top-8 bottom-[-32px] w-px bg-[#EBEBE8] dark:bg-[#2E2E2C]" />
              )}

              {/* date node */}
              <div className="absolute left-0 top-1 flex flex-col items-center">
                <div className="w-[22px] h-[22px] rounded-full bg-[#4F46E5] flex items-center justify-center shrink-0 z-10">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              </div>

              {/* date header */}
              <div className="flex items-center justify-between mb-3 -mt-0.5">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[#1A1A18] dark:text-[#F0EFEC]">
                    {formatDate(date)}
                  </span>
                  <span className="text-xs text-[#A8A8A5]">
                    {txns.length} transaction{txns.length > 1 ? "s" : ""}
                  </span>
                </div>
                <span className={`text-sm font-semibold font-mono ${dayTotal >= 0 ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                  {dayTotal >= 0 ? "+" : ""}{formatCurrency(Math.abs(dayTotal))}
                </span>
              </div>

              {/* transactions for this day */}
              <div className="space-y-2">
                {txns.map((txn) => (
                  <div
                    key={txn.id}
                    className="bg-white dark:bg-[#242422] border border-[#EBEBE8] dark:border-[#2E2E2C] rounded-xl px-5 py-4 flex items-center gap-4 hover:border-[#4F46E5] dark:hover:border-[#4F46E5] transition-colors duration-150 group"
                  >
                    {/* category dot */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${categoryColors[txn.category] || "#A8A8A5"}18` }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: categoryColors[txn.category] || "#A8A8A5" }}
                      />
                    </div>

                    {/* description + category */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A1A18] dark:text-[#F0EFEC] truncate">
                        {txn.description}
                      </p>
                      <p className="text-xs text-[#A8A8A5] mt-0.5">{txn.category}</p>
                    </div>

                    {/* badge */}
                    <Badge type={txn.type} />

                    {/* amount */}
                    <span className={`text-sm font-semibold font-mono shrink-0 ${txn.type === "income" ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                      {txn.type === "income" ? "+" : "-"}{formatCurrency(txn.amount)}
                    </span>

                    {/* admin actions */}
                    {role === "admin" && (
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-100 shrink-0">
                        <button
                          onClick={() => handleEdit(txn)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B6B68] hover:text-[#4F46E5] hover:bg-[#EEF2FF] dark:hover:bg-[#2E2C4E] transition-all"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(txn.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B6B68] hover:text-[#DC2626] hover:bg-[#FEF2F2] dark:hover:bg-[#2d0a0a] transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <TransactionModal
        isOpen={modalOpen}
        onClose={handleClose}
        transaction={editingTx}
      />
    </>
  );
}