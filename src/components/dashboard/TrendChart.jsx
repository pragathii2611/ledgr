import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { getMonthlyData } from "../../utils/calculations";
import { formatCompact } from "../../utils/formatters";
import { ChartSkeleton } from "../ui/Skeleton";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white dark:bg-[#242422] border border-[#EBEBE8] dark:border-[#2E2E2C] rounded-xl shadow-modal p-4 text-sm">
      <p className="text-[#A8A8A5] mb-3 font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[#6B6B68] capitalize">{entry.name}:</span>
          <span className="text-[#1A1A18] dark:text-[#F0EFEC] font-semibold">
            {formatCompact(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function TrendChart({ transactions, isLoading }) {
  if (isLoading) return <ChartSkeleton />;
  const data = getMonthlyData(transactions);

  return (
    <div className="bg-white dark:bg-[#242422] border border-[#EBEBE8] dark:border-[#2E2E2C] rounded-card shadow-card p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-base font-semibold text-[#1A1A18] dark:text-[#F0EFEC]">
            Monthly Overview
          </p>
          <p className="text-sm text-[#A8A8A5] mt-1">Income vs expenses trend</p>
        </div>
        <div className="flex items-center gap-5 text-sm text-[#6B6B68]">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#4F46E5]" />Balance</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#16A34A]" />Income</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#DC2626]" />Expenses</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16A34A" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#DC2626" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#EBEBE8" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 13, fill: "#A8A8A5" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 13, fill: "#A8A8A5" }} axisLine={false} tickLine={false} tickFormatter={formatCompact} width={60} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="balance" stroke="#4F46E5" strokeWidth={2.5} fill="url(#balanceGrad)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
          <Area type="monotone" dataKey="income" stroke="#16A34A" strokeWidth={2.5} fill="url(#incomeGrad)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
          <Area type="monotone" dataKey="expenses" stroke="#DC2626" strokeWidth={2.5} fill="url(#expenseGrad)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}