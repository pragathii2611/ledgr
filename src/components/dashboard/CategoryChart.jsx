import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getCategoryBreakdown } from "../../utils/calculations";
import { formatCurrency } from "../../utils/formatters";
import { categoryColors } from "../../data/mockData";
import { ChartSkeleton } from "../ui/Skeleton";

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const { name, value, percentage } = payload[0].payload;
  return (
    <div className="bg-white dark:bg-[#242422] border border-[#EBEBE8] dark:border-[#2E2E2C] rounded-xl shadow-modal p-4 text-sm">
      <p className="font-semibold text-[#1A1A18] dark:text-[#F0EFEC] mb-1">{name}</p>
      <p className="text-[#6B6B68]">{formatCurrency(value)}</p>
      <p className="text-[#A8A8A5]">{percentage}% of total</p>
    </div>
  );
}

export default function CategoryChart({ transactions, isLoading }) {
  if (isLoading) return <ChartSkeleton />;
  const breakdown = getCategoryBreakdown(transactions);
  const data = breakdown.map((item) => ({
    name: item.category,
    value: item.amount,
    percentage: item.percentage,
    color: categoryColors[item.category] || "#A8A8A5",
  }));

  return (
    <div className="bg-white dark:bg-[#242422] border border-[#EBEBE8] dark:border-[#2E2E2C] rounded-card shadow-card p-6">
      <div className="mb-6">
        <p className="text-base font-semibold text-[#1A1A18] dark:text-[#F0EFEC]">
          Spending by Category
        </p>
        <p className="text-sm text-[#A8A8A5] mt-1">Where your money is going</p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" strokeWidth={0}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} opacity={0.85} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="w-full space-y-3">
          {data.slice(0, 6).map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-[#6B6B68] dark:text-[#8C8C88] truncate flex-1">{item.name}</span>
              <span className="text-sm font-semibold text-[#1A1A18] dark:text-[#F0EFEC] shrink-0 font-mono">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}