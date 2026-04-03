import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getCategoryBreakdown } from "../../utils/calculations";
import { formatCurrency } from "../../utils/formatters";
import { categoryColors } from "../../data/mockData";
import { ChartSkeleton } from "../ui/Skeleton";

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const { name, value, percentage } = payload[0].payload;

  return (
    <div className="bg-white dark:bg-[#18181B] border border-[#F0F0F0] dark:border-[#27272A] rounded-lg shadow-modal p-3 text-xs">
      <p className="font-medium text-[#0A0A0A] dark:text-[#FAFAFA] mb-1">{name}</p>
      <p className="text-[#6B7280]">{formatCurrency(value)}</p>
      <p className="text-[#9CA3AF]">{percentage}% of total</p>
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
    color: categoryColors[item.category] || "#9CA3AF",
  }));

  return (
    <div className="bg-white dark:bg-[#18181B] border border-[#F0F0F0] dark:border-[#27272A] rounded-card shadow-card p-5">
      {/* header */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
          Spending by Category
        </p>
        <p className="text-xs text-[#9CA3AF] mt-0.5">
          Where your money is going
        </p>
      </div>

      <div className="flex items-center gap-6">
        {/* donut */}
        <div className="shrink-0">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} opacity={0.85} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* legend */}
        <div className="flex-1 space-y-2.5 min-w-0">
          {data.slice(0, 6).map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-[#6B7280] dark:text-[#A1A1AA] truncate flex-1">
                {item.name}
              </span>
              <span className="text-xs font-medium text-[#0A0A0A] dark:text-[#FAFAFA] shrink-0 font-mono">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}