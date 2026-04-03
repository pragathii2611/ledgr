import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
} from "lucide-react";
import { KPICardSkeleton } from "../ui/Skeleton";

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
    <div className="bg-white dark:bg-[#242422] border border-[#EBEBE8] dark:border-[#2E2E2C] rounded-card shadow-card p-6 flex flex-col gap-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#A8A8A5] font-medium uppercase tracking-widest">
          {label}
        </span>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}18` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
      </div>

      <div>
        <p className="text-4xl font-semibold text-[#1A1A18] dark:text-[#F0EFEC] tracking-tight font-mono">
          {prefix}{animated.toLocaleString("en-IN")}
        </p>
        <p className="text-sm text-[#A8A8A5] mt-2">{sub}</p>
      </div>

      {trendValue !== undefined && (
        <div className="flex items-center gap-2">
          {isPositive
            ? <TrendingUp size={14} className="text-[#16A34A]" />
            : <TrendingDown size={14} className="text-[#DC2626]" />
          }
          <span className={`text-sm font-medium ${isPositive ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
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
      color: "#4F46E5",
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
      color: "#D97706",
      prefix: "",
      trendValue: 2.3,
      trend: "up",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card) => (
        <KPICard key={card.label} {...card} isLoading={isLoading} />
      ))}
    </div>
  );
}