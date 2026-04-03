import { useEffect, useRef, useState } from "react";
import { TrendingUp, TrendingDown, Wallet, ArrowDownCircle, ArrowUpCircle, PiggyBank } from "lucide-react";
import { formatCompact, formatCurrency } from "../../utils/formatters";
import { KPICardSkeleton } from "../ui/Skeleton";

// animates number counting up from 0
function useCountUp(target, duration = 800, isLoading = false) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (isLoading || target === 0) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, isLoading]);

  return value;
}

function KPICard({ label, value, sub, icon: Icon, trend, trendValue, color, isLoading, prefix = "₹" }) {
  const animated = useCountUp(value, 800, isLoading);

  if (isLoading) return <KPICardSkeleton />;

  const isPositive = trend === "up";

  return (
    <div className="bg-white dark:bg-[#18181B] border border-[#F0F0F0] dark:border-[#27272A] rounded-card shadow-card p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
      {/* top row */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#9CA3AF] dark:text-[#52525B] font-medium uppercase tracking-widest">
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
      </div>

      {/* value */}
      <div>
        <p className="text-2xl font-semibold text-[#0A0A0A] dark:text-[#FAFAFA] tracking-tight font-mono">
          {prefix}{animated.toLocaleString("en-IN")}
        </p>
        <p className="text-xs text-[#9CA3AF] dark:text-[#52525B] mt-1">
          {sub}
        </p>
      </div>

      {/* trend */}
      {trendValue !== undefined && (
        <div className="flex items-center gap-1.5">
          {isPositive ? (
            <TrendingUp size={12} className="text-[#16A34A]" />
          ) : (
            <TrendingDown size={12} className="text-[#DC2626]" />
          )}
          <span
            className={`text-xs font-medium ${
              isPositive ? "text-[#16A34A]" : "text-[#DC2626]"
            }`}
          >
            {isPositive ? "+" : ""}{trendValue}% vs last month
          </span>
        </div>
      )}
    </div>
  );
}

export default function KPICards({ transactions, isLoading }) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;
  const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;

  const cards = [
    {
      label: "Net Balance",
      value: balance,
      sub: "Total across all months",
      icon: Wallet,
      color: "#18181B",
      trend: balance >= 0 ? "up" : "down",
      trendValue: 12.4,
    },
    {
      label: "Total Income",
      value: income,
      sub: "Salary + Freelance + Dividends",
      icon: ArrowUpCircle,
      color: "#16A34A",
      trend: "up",
      trendValue: 8.2,
    },
    {
      label: "Total Expenses",
      value: expenses,
      sub: "All spending this period",
      icon: ArrowDownCircle,
      color: "#DC2626",
      trend: "down",
      trendValue: -3.1,
    },
    {
      label: "Savings Rate",
      value: Number(savingsRate),
      sub: "Of total income saved",
      icon: PiggyBank,
      color: "#6366F1",
      prefix: "",
      trendValue: 2.3,
      trend: "up",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <KPICard key={card.label} {...card} isLoading={isLoading} />
      ))}
    </div>
  );
}