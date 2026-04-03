import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getMonthlyData } from "../../utils/calculations";
import { formatCompact } from "../../utils/formatters";
import { ChartSkeleton } from "../ui/Skeleton";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white dark:bg-[#18181B] border border-[#F0F0F0] dark:border-[#27272A] rounded-lg shadow-modal p-4 text-sm">
      <p className="text-[#9CA3AF] mb-3 font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[#6B7280] capitalize">{entry.name}:</span>
          <span className="text-[#0A0A0A] dark:text-[#FAFAFA] font-semibold">
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
    <div className="bg-white dark:bg-[#18181B] border border-[#F0F0F0] dark:border-[#27272A] rounded-card shadow-card p-6">
      {/* header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-base font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
            Monthly Overview
          </p>
          <p className="text-sm text-[#9CA3AF] mt-1">
            Income vs expenses trend
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
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#6366F1]" />
            Balance
          </div>
        </div>
      </div>

      {/* chart */}
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />

          <XAxis
            dataKey="month"
            tick={{ fontSize: 13, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 13, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatCompact}
            width={60}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="income"
            stroke="#22C55E"
            strokeWidth={2.5}
            fill="url(#incomeGrad)"
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#EF4444"
            strokeWidth={2.5}
            fill="url(#expenseGrad)"
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#6366F1"
            strokeWidth={2.5}
            fill="url(#balanceGrad)"
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}