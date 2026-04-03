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
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
      };

      if (isEditing) {
        await updateTransaction(transaction.id, payload);
        toast.success("Transaction updated.");
      } else {
        await addTransaction(payload);
        toast.success("Transaction added.");
      }
      onClose();
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 text-sm bg-[#FAFAFA] dark:bg-[#09090B] border border-[#F0F0F0] dark:border-[#27272A] rounded-xl text-[#0A0A0A] dark:text-[#FAFAFA] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#18181B] dark:focus:ring-[#FAFAFA] focus:border-transparent transition-all duration-150";

  const labelClass =
    "block text-sm font-medium text-[#6B7280] dark:text-[#A1A1AA] mb-2";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Transaction" : "Add Transaction"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* description */}
        <div>
          <label className={labelClass}>Description</label>
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="e.g. Swiggy order"
            className={inputClass}
          />
        </div>

        {/* amount + type */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Amount (₹)</label>
            <input
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Type</label>
            <div className="flex rounded-xl border border-[#F0F0F0] dark:border-[#27272A] overflow-hidden h-[46px]">
              {["expense", "income"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, type: t }))}
                  className={`flex-1 text-sm font-medium capitalize transition-all duration-150
                    ${
                      form.type === t
                        ? t === "income"
                          ? "bg-[#16A34A] text-white"
                          : "bg-[#DC2626] text-white"
                        : "text-[#6B7280] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A]"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* category */}
        <div>
          <label className={labelClass}>Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* date */}
        <div>
          <label className={labelClass}>Date</label>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 text-sm font-medium text-[#6B7280] bg-[#F4F4F5] dark:bg-[#27272A] hover:bg-[#E4E4E7] dark:hover:bg-[#3F3F46] rounded-xl transition-all duration-150"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 text-sm font-medium text-white bg-[#18181B] dark:bg-[#FAFAFA] dark:text-[#18181B] hover:opacity-90 rounded-xl transition-all duration-150 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </form>
    </Modal>
  );
}