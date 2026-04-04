import { useMemo, useState } from "react";
import { formatCurrency } from "../../utils/formatters";
function getDaysInYear(year) {
  const days = [];
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d).toISOString().split("T")[0]);
  }
  return days;
}

function getColor(amount, max) {
  if (!amount) return null;
  const intensity = amount / max;
  if (intensity > 0.75) return "#4F46E5";
  if (intensity > 0.5) return "#6366F1";
  if (intensity > 0.25) return "#818CF8";
  return "#C7D2FE";
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function SpendingHeatmap({ transactions }) {
  const year = 2026;

  const spendByDay = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === "expense" && t.date.startsWith(`${year}`))
      .forEach((t) => {
        map[t.date] = (map[t.date] || 0) + t.amount;
      });
    return map;
  }, [transactions]);

  const maxSpend = Math.max(...Object.values(spendByDay), 1);
  const days = getDaysInYear(year);

  // pad start so week starts correctly
  const firstDay = new Date(days[0]).getDay();
  const padded = [...Array(firstDay).fill(null), ...days];

  // group into weeks
  const weeks = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }

  // month label positions
  const monthPositions = [];
  MONTHS.forEach((month, idx) => {
    const firstOfMonth = `${year}-${String(idx + 1).padStart(2, "0")}-01`;
    const dayIndex = days.indexOf(firstOfMonth);
    if (dayIndex !== -1) {
      const weekIndex = Math.floor((dayIndex + firstDay) / 7);
      monthPositions.push({ month, weekIndex });
    }
  });

  const [tooltip, setTooltip] = useState(null);

  return (
    <div className="bg-white dark:bg-[#242422] border border-[#EBEBE8] dark:border-[#2E2E2C] rounded-card shadow-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-base font-semibold text-[#1A1A18] dark:text-[#F0EFEC]">
            Spending Heatmap
          </p>
          <p className="text-sm text-[#A8A8A5] mt-1">
            Daily spending activity across {year}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#A8A8A5]">
          <span>Less</span>
          {[null, "#C7D2FE", "#818CF8", "#6366F1", "#4F46E5"].map((c, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: c || "#F0EFEC" }}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <div className="inline-flex gap-4">
          {/* day labels */}
          <div className="flex flex-col gap-[3px] pt-6">
            {DAYS.map((d, i) => (
              <div
                key={d}
                className="h-[11px] text-[9px] text-[#A8A8A5] leading-none"
                style={{ visibility: i % 2 === 0 ? "hidden" : "visible" }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* grid */}
          <div>
            {/* month labels */}
            <div className="flex mb-1" style={{ gap: "3px" }}>
              {weeks.map((_, wi) => {
                const mp = monthPositions.find((m) => m.weekIndex === wi);
                return (
                  <div key={wi} className="w-[11px] text-[9px] text-[#A8A8A5] whitespace-nowrap overflow-visible">
                    {mp ? mp.month : ""}
                  </div>
                );
              })}
            </div>

            {/* cells */}
            <div className="flex" style={{ gap: "3px" }}>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: "3px" }}>
                  {week.map((day, di) => {
                    if (!day) return <div key={di} className="w-[11px] h-[11px]" />;
                    const amount = spendByDay[day];
                    const color = getColor(amount, maxSpend);
                    return (
                      <div
                        key={day}
                        className="w-[11px] h-[11px] rounded-sm cursor-pointer transition-transform hover:scale-125 relative"
                        style={{
                          backgroundColor: color || (
                            document.documentElement.classList.contains("dark")
                              ? "#2E2E2C"
                              : "#F0EFEC"
                          ),
                        }}
                        onMouseEnter={(e) => {
                          if (amount) {
                            setTooltip({
                              day,
                              amount,
                              x: e.clientX,
                              y: e.clientY,
                            });
                          }
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-[#1A1A18] dark:bg-[#F0EFEC] text-white dark:text-[#1A1A18] text-xs px-3 py-2 rounded-lg shadow-modal pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y - 40 }}
        >
          <p className="font-semibold">{formatCurrency(tooltip.amount)}</p>
          <p className="text-[10px] opacity-70">{tooltip.day}</p>
        </div>
      )}
    </div>
  );
}