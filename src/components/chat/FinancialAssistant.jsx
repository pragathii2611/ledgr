import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { useTransactionStore } from "../../store/transactionStore";
import {
  getTotalIncome,
  getTotalExpenses,
  getNetBalance,
  getSavingsRate,
  getTopCategory,
  getBiggestExpense,
  getMonthlyData,
  getCategoryBreakdown,
} from "../../utils/calculations";
import { formatCurrency } from "../../utils/formatters";

function buildContext(transactions) {
  const income = getTotalIncome(transactions);
  const expenses = getTotalExpenses(transactions);
  const balance = getNetBalance(transactions);
  const savingsRate = getSavingsRate(transactions);
  const topCat = getTopCategory(transactions);
  const biggestExpense = getBiggestExpense(transactions);
  const monthly = getMonthlyData(transactions);
  const breakdown = getCategoryBreakdown(transactions);

  return `You are Ledgr AI, a helpful and friendly personal finance assistant. You have access to the user's real financial data below. Answer questions based on this data. Be concise, warm, and insightful. Use ₹ for currency. Never make up data. Keep responses short and to the point — 2 to 4 sentences max unless the user asks for detail.

FINANCIAL SUMMARY:
- Total Income: ${formatCurrency(income)}
- Total Expenses: ${formatCurrency(expenses)}
- Net Balance: ${formatCurrency(balance)}
- Savings Rate: ${savingsRate}%
- Top Spending Category: ${topCat?.category || "N/A"} (${topCat?.percentage || 0}% of expenses, ${formatCurrency(topCat?.amount || 0)})
- Biggest Single Expense: ${biggestExpense?.description || "N/A"} — ${formatCurrency(biggestExpense?.amount || 0)} on ${biggestExpense?.date || "N/A"}

MONTHLY BREAKDOWN:
${monthly.map((m) => `- ${m.month}: Income ${formatCurrency(m.income)}, Expenses ${formatCurrency(m.expenses)}, Balance ${formatCurrency(m.balance)}`).join("\n")}

CATEGORY BREAKDOWN (expenses only):
${breakdown.map((c) => `- ${c.category}: ${formatCurrency(c.amount)} (${c.percentage}%)`).join("\n")}

RECENT TRANSACTIONS (last 10):
${transactions.slice(0, 10).map((t) => `- ${t.date}: ${t.description} — ${t.type === "income" ? "+" : "-"}${formatCurrency(t.amount)} (${t.category})`).join("\n")}`;
}

function Message({ message }) {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold mt-0.5
          ${isUser
            ? "bg-[#4F46E5] text-white"
            : "bg-[#EEF2FF] dark:bg-[#2E2C4E] text-[#4F46E5]"
          }`}
      >
        {isUser ? "P" : <Sparkles size={13} />}
      </div>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isUser
            ? "bg-[#4F46E5] text-white rounded-tr-sm"
            : "bg-[#F7F6F3] dark:bg-[#2E2E2C] text-[#1A1A18] dark:text-[#F0EFEC] rounded-tl-sm"
          }`}
      >
        {message.content}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3"
    >
      <div className="w-7 h-7 rounded-full bg-[#EEF2FF] dark:bg-[#2E2C4E] flex items-center justify-center shrink-0">
        <Sparkles size={13} className="text-[#4F46E5]" />
      </div>
      <div className="bg-[#F7F6F3] dark:bg-[#2E2E2C] px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#A8A8A5]"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

const SUGGESTIONS = [
  "How much did I spend this month?",
  "What's my savings rate?",
  "Where am I overspending?",
  "How's my financial health?",
];

export default function FinancialAssistant() {
  const { transactions } = useTransactionStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi Pragathi! I'm Ledgr AI, your personal finance assistant. I have access to your real financial data and can answer questions about your spending, savings, and more. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || isLoading) return;
    setInput("");

    const newMessages = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const systemPrompt = buildContext(transactions);

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          max_tokens: 1024,
          messages: [
            { role: "system", content: systemPrompt },
            ...newMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          ],
        }),
      });

      const data = await response.json();
      const reply =
        data.choices?.[0]?.message?.content ||
        "Sorry, I couldn't process that. Please try again.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please check your connection and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#4F46E5] text-white shadow-modal flex items-center justify-center hover:bg-[#4338CA] transition-colors duration-150"
          >
            <MessageCircle size={22} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[580px] bg-white dark:bg-[#242422] border border-[#EBEBE8] dark:border-[#2E2E2C] rounded-2xl shadow-modal flex flex-col overflow-hidden"
          >
            {/* header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EBEBE8] dark:border-[#2E2E2C] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#EEF2FF] dark:bg-[#2E2C4E] flex items-center justify-center">
                  <Sparkles size={15} className="text-[#4F46E5]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A18] dark:text-[#F0EFEC]">
                    Ledgr AI
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                    <p className="text-xs text-[#A8A8A5]">Online</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#A8A8A5] hover:text-[#1A1A18] dark:hover:text-[#F0EFEC] hover:bg-[#F0EFEC] dark:hover:bg-[#2E2E2C] transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* messages */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 space-y-4">
              {messages.map((msg, i) => (
                <Message key={i} message={msg} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            {/* suggestions — only show on first message */}
            {messages.length === 1 && !isLoading && (
              <div className="px-5 pb-3 flex flex-wrap gap-2 shrink-0">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-[#EBEBE8] dark:border-[#2E2E2C] text-[#6B6B68] dark:text-[#8C8C88] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all duration-150 bg-white dark:bg-[#242422]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* input */}
            <div className="px-5 py-4 border-t border-[#EBEBE8] dark:border-[#2E2E2C] shrink-0">
              <div className="flex items-center gap-3 bg-[#F7F6F3] dark:bg-[#1C1C1A] rounded-xl px-4 py-3">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your finances..."
                  className="flex-1 text-sm bg-transparent text-[#1A1A18] dark:text-[#F0EFEC] placeholder-[#A8A8A5] border-none focus:ring-0"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="w-8 h-8 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center hover:bg-[#4338CA] disabled:opacity-40 transition-all duration-150 shrink-0"
                >
                  <Send size={14} />
                </button>
              </div>
              <p className="text-[10px] text-[#A8A8A5] text-center mt-2">
                Powered by GPT-4o mini · Your data stays private
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}