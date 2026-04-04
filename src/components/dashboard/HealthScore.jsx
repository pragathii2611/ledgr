import { useEffect, useState } from "react";
import { getSavingsRate, getTopCategory, getTotalIncome, getTotalExpenses } from "../../utils/calculations";
import { user } from "../../data/mockData";

function calculateHealthScore(transactions) {
  if (!transactions.length) return 0;

  const income = getTotalIncome(transactions);
  const expenses = getTotalExpenses(transactions);
  const savingsRate = income > 0 ? (income - expenses) / income : 0;
  const topCat = getTopCategory(transactions);
  const topCatPct = topCat ? topCat.percentage / 100 : 0;
  const incomeTypes = new Set(transactions.filter(t => t.type === "income").map(t => t.category)).size;
  const spent = transactions
    .filter(t => {
      const d = new Date(t.date);
      const now = new Date();
      return t.type === "expense" && d.getMonth() === now.getMonth();
    })
    .reduce((s, t) => s + t.amount, 0);
  const budgetAdherence = Math.max(0, 1 - spent / user.monthlyBudget);

  // score components out of 100
  const savingsScore = Math.min(savingsRate * 200, 40);       // max 40pts
  const diversityScore = Math.min(incomeTypes * 10, 20);      // max 20pts
  const concentrationScore = Math.max(0, (1 - topCatPct) * 20); // max 20pts
  const budgetScore = budgetAdherence * 20;                   // max 20pts

  return Math.round(savingsScore + diversityScore + concentrationScore + budgetScore);
}

function getScoreLabel(score) {
  if (score >= 80) return { label: "Excellent", color: "#16A34A", bg: "#F0FDF4", dark: "#052e16" };
  if (score >= 60) return { label: "Good", color: "#4F46E5", bg: "#EEF2FF", dark: "#1e1b4b" };
  if (score >= 40) return { label: "Fair", color: "#D97706", bg: "#FFFBEB", dark: "#2d1a06" };
  return { label: "Needs Work", color: "#DC2626", bg: "#FEF2F2", dark: "#2d0a0a" };
}

function AnimatedRing({ score, color }) {
  const [displayed, setDisplayed] = useState(0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayed / 100) * circumference;

  useEffect(() => {
    if (score === 0) return;
    let current = 0;
    const step = score / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= score) {
        setDisplayed(score);
        clearInterval(timer);
      } else {
        setDisplayed(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
        {/* background ring */}
        <circle
          cx="64" cy="64" r={radius}
          fill="none"
          stroke="#EBEBE8"
          strokeWidth="10"
          className="dark:stroke-[#2E2E2C]"
        />
        {/* progress ring */}
        <circle
          cx="64" cy="64" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.016s linear" }}
        />
      </svg>
      {/* center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-[#1A1A18] dark:text-[#F0EFEC] font-mono">
          {displayed}
        </span>
        <span className="text-[10px] text-[#A8A8A5] uppercase tracking-widest mt-0.5">
          Score
        </span>
      </div>
    </div>
  );
}

export default function HealthScore({ transactions, isLoading }) {
  if (isLoading) return null;

  const score = calculateHealthScore(transactions);
  const { label, color, bg, dark } = getScoreLabel(score);

  const breakdown = [
    { label: "Savings Rate", value: Math.min(parseFloat(getSavingsRate(transactions)) * 2, 40).toFixed(0), max: 40 },
    { label: "Income Sources", value: Math.min(new Set(transactions.filter(t => t.type === "income").map(t => t.category)).size * 10, 20).toFixed(0), max: 20 },
    { label: "Spend Balance", value: Math.max(0, (1 - (getTopCategory(transactions)?.percentage || 0) / 100) * 20).toFixed(0), max: 20 },
    { label: "Budget Control", value: Math.max(0, (1 - transactions.filter(t => { const d = new Date(t.date); const n = new Date(); return t.type === "expense" && d.getMonth() === n.getMonth(); }).reduce((s, t) => s + t.amount, 0) / user.monthlyBudget) * 20).toFixed(0), max: 20 },
  ];

  return (
    <div className="bg-white dark:bg-[#242422] border border-[#EBEBE8] dark:border-[#2E2E2C] rounded-card shadow-card p-6">
      <div className="mb-6">
        <p className="text-base font-semibold text-[#1A1A18] dark:text-[#F0EFEC]">
          Financial Health Score
        </p>
        <p className="text-sm text-[#A8A8A5] mt-1">
          Based on your savings, spending and income
        </p>
      </div>

      <div className="flex items-center gap-8">
        {/* ring */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <AnimatedRing score={score} color={color} />
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ color, backgroundColor: bg }}
          >
            {label}
          </span>
        </div>

        {/* breakdown */}
        <div className="flex-1 space-y-3">
          {breakdown.map((b) => (
            <div key={b.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-[#6B6B68] dark:text-[#8C8C88]">{b.label}</span>
                <span className="text-xs font-semibold font-mono text-[#1A1A18] dark:text-[#F0EFEC]">
                  {Math.round(b.value)}/{b.max}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#F0EFEC] dark:bg-[#2E2E2C] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(b.value / b.max) * 100}%`, backgroundColor: color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}