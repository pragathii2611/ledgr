import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { useTransactionStore } from "../../store/transactionStore";
import { categories } from "../../data/mockData";
import { getTodayString } from "../../utils/formatters";
import toast from "react-hot-toast";

const defaultForm = {
  description: "",
  amount: "",
  category: "Food & Dining",
  type: "expense",
  date: getTodayString(),
};

export default function TransactionModal({ isOpen, onClose, transaction }) {
  const { addTransaction, updateTransaction } = useTransactionStore();
  const [form, setForm] = useState(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!transaction;

  useEffect(() => {
    if (transaction) {
      setForm({
        description: transaction.description,
        amount: transaction.amount.toString(),
        category: transaction.category,
        type: transaction.type,
        date: transaction.date,
      });
    } else {
      setForm(defaultForm);
    }
  }, [transaction, isOpen]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description.trim() || !form.amount || !form.date) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = { ...form, amount: parseFloat(form.amount) };
      if (isEditing) {
        await updateTransaction(transaction.id, payload);
        toast.success("Transaction updated.");
      } else {
        await addTransaction(payload);
        toast.success("Transaction added.");
      }
      onClose();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 text-sm bg-[#F7F6F3] dark:bg-[#1C1C1A] border border-[#EBEBE8] dark:border-[#2E2E2C] rounded-xl text-[#1A1A18] dark:text-[#F0EFEC] placeholder-[#A8A8A5] focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all duration-150";
  const labelClass = "block text-sm font-medium text-[#6B6B68] dark:text-[#8C8C88] mb-2";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit Transaction" : "Add Transaction"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Description</label>
          <input name="description" value={form.description} onChange={handleChange} placeholder="e.g. Swiggy order" className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Amount (₹)</label>
            <input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="0" min="0" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Type</label>
            <div className="flex rounded-xl border border-[#EBEBE8] dark:border-[#2E2E2C] overflow-hidden h-[46px]">
              {["expense", "income"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, type: t }))}
                  className={`flex-1 text-sm font-medium capitalize transition-all duration-150
                    ${form.type === t
                      ? t === "income" ? "bg-[#16A34A] text-white" : "bg-[#DC2626] text-white"
                      : "text-[#6B6B68] hover:bg-[#F0EFEC] dark:hover:bg-[#2E2E2C]"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className={labelClass}>Date</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} className={inputClass} />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 text-sm font-medium text-[#6B6B68] bg-[#F0EFEC] dark:bg-[#2E2E2C] hover:opacity-80 rounded-xl transition-all duration-150"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 text-sm font-medium text-white bg-[#4F46E5] hover:bg-[#4338CA] rounded-xl transition-colors duration-150 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </form>
    </Modal>
  );
}