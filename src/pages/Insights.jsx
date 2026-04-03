import { useEffect } from "react";
import { useTransactionStore } from "../store/transactionStore";
import {
  getMonthlyData,
  getCategoryBreakdown,
  getTopCategory,
  getBiggestExpense,
  getSavingsRate,
  getTotalIncome,
  getTotalExpenses,
  getNetBalance,
} from "../utils/calculations";
import { formatCurrency, formatDate } from "../utils/formatters";
import { categoryColors } from "../data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Flame, PiggyBank, Wallet, ArrowUpCircle } from "lucide-react";
import { ChartSkeleton } from "../components/ui/Skeleton";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white dark:bg-[#18181B] border border-[#F0F0F0] dark:border-[#27272A] rounded-xl shadow-modal p-4 text-sm">
      <p className="text-[#9CA3AF] mb-3 font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
          <span className="text-[#6B7280] capitalize">{entry.name}:</span>
          <span className="text-[#0A0A0A] dark:text-[#FAFAFA] font-semibold">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function InsightCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white dark:bg-[#18181B] border border-[#F0F0F0] dark:border-[#27272A] rounded-card shadow-card p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#9CA3AF] font-medium uppercase tracking-widest">
          {label}
        </span>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-semibold text-[#0A0A0A] dark:text-[#FAFAFA] tracking-tight">
          {value}
        </p>
        <p className="text-sm text-[#9CA3AF] mt-1">{sub}</p>
      </div>
    </div>
  );
}

export default function Insights() {
  const { transactions, isLoading, fetchTransactions } = useTransactionStore();

  useEffect(() => {
    if (transactions.length === 0) fetchTransactions();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {Array(4).fill(0).map((_, i) => <ChartSkeleton key={i} />)}
        </div>
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    );
  }

  const monthly = getMonthlyData(transactions);
  const breakdown = getCategoryBreakdown(transactions);
  const topCategory = getTopCategory(transactions);
  const biggestExpense = getBiggestExpense(transactions);
  const savingsRate = getSavingsRate(transactions);
  const totalIncome = getTotalIncome(transactions);
  const totalExpenses = getTotalExpenses(transactions);
  const netBalance = getNetBalance(transactions);

  // observation text
  const observation = (() => {
    const rate = parseFloat(savingsRate);
    if (rate >= 50) return `Excellent work! You're saving ${savingsRate}% of your income — well above the recommended 20%. Keep it up.`;
    if (rate >= 30) return `Great discipline. A ${savingsRate}% savings rate puts you ahead of most. Consider increasing your SIP contributions.`;
    if (rate >= 20) return `You're saving ${savingsRate}% of your income — right at the healthy benchmark. Look for small wins to push above 30%.`;
    return `Your savings rate of ${savingsRate}% is below the 20% benchmark. Your biggest spend is ${topCategory?.category} — reviewing this could help.`;
  })();

  return (
    <div className="space-y-6">

      {/* insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <InsightCard
          icon={Flame}
          label="Top Category"
          value={topCategory?.category || "—"}
          sub={topCategory ? `${formatCurrency(topCategory.amount)} · ${topCategory.percentage}% of spend` : "No data"}
          color="#F97316"
        />
        <InsightCard
          icon={PiggyBank}
          label="Savings Rate"
          value={`${savingsRate}%`}
          sub={parseFloat(savingsRate) >= 20 ? "Above the 20% benchmark" : "Below the 20% benchmark"}
          color="#6366F1"
        />
        <InsightCard
          icon={Wallet}
          label="Biggest Expense"
          value={biggestExpense ? formatCurrency(biggestExpense.amount) : "—"}
          sub={biggestExpense ? `${biggestExpense.description} · ${formatDate(biggestExpense.date)}` : "No data"}
          color="#DC2626"
        />
        <InsightCard
          icon={ArrowUpCircle}
          label="Net Balance"
          value={formatCurrency(netBalance)}
          sub={netBalance >= 0 ? "You're in the green" : "Expenses exceed income"}
          color="#16A34A"
        />
      </div>

      {/* monthly bar chart */}
      <div className="bg-white dark:bg-[#18181B] border border-[#F0F0F0] dark:border-[#27272A] rounded-card shadow-card p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-base font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
              Monthly Comparison
            </p>
            <p className="text-sm text-[#9CA3AF] mt-1">
              Income vs expenses per month
            </p>
          </div>
          <div className="flex items-center gap-5 text-sm text-[#6B7280]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
              Income
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
              Expenses
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthly} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 13, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 13, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} width={60} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="income" fill="#22C55E" radius={[6, 6, 0, 0]} opacity={0.85} />
            <Bar dataKey="expenses" fill="#EF4444" radius={[6, 6, 0, 0]} opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* category breakdown + observation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* category breakdown table */}
        <div className="lg:col-span-2 bg-white dark:bg-[#18181B] border border-[#F0F0F0] dark:border-[#27272A] rounded-card shadow-card">
          <div className="px-6 py-5 border-b border-[#F0F0F0] dark:border-[#27272A]">
            <p className="text-base font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
              Category Breakdown
            </p>
            <p className="text-sm text-[#9CA3AF] mt-0.5">
              Detailed spending by category
            </p>
          </div>
          <div className="p-6 space-y-4">
            {breakdown.map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: categoryColors[item.category] || "#9CA3AF" }}
                    />
                    <span className="text-sm text-[#0A0A0A] dark:text-[#FAFAFA] font-medium">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-[#9CA3AF]">{item.percentage}%</span>
                    <span className="text-sm font-semibold font-mono text-[#0A0A0A] dark:text-[#FAFAFA]">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                </div>
                {/* progress bar */}
                <div className="w-full h-1.5 bg-[#F4F4F5] dark:bg-[#27272A] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: categoryColors[item.category] || "#9CA3AF",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* observation card */}
        <div className="space-y-4">
          {/* ai observation */}
          <div className="bg-white dark:bg-[#18181B] border border-[#F0F0F0] dark:border-[#27272A] rounded-card shadow-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#6366F1] animate-pulse" />
              <p className="text-sm font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
                Smart Observation
              </p>
            </div>
            <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA] leading-relaxed">
              {observation}
            </p>
          </div>

          {/* monthly summary cards */}
          {monthly.map((m) => {
            const saved = m.income - m.expenses;
            const rate = m.income > 0 ? ((saved / m.income) * 100).toFixed(1) : 0;
            const isPositive = saved >= 0;
            return (
              <div
                key={m.month}
                className="bg-white dark:bg-[#18181B] border border-[#F0F0F0] dark:border-[#27272A] rounded-card shadow-card p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
                    {m.month}
                  </p>
                  <div className="flex items-center gap-1">
                    {isPositive ? (
                      <TrendingUp size={14} className="text-[#16A34A]" />
                    ) : (
                      <TrendingDown size={14} className="text-[#DC2626]" />
                    )}
                    <span className={`text-sm font-medium ${isPositive ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
                      {rate}% saved
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-[#9CA3AF] mb-1">Income</p>
                    <p className="text-sm font-semibold font-mono text-[#16A34A]">
                      {formatCurrency(m.income)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3AF] mb-1">Expenses</p>
                    <p className="text-sm font-semibold font-mono text-[#DC2626]">
                      {formatCurrency(m.expenses)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}