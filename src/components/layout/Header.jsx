import { useAppStore } from "../../store/appStore";
import { Sun, Moon, Bell } from "lucide-react";

const pageTitles = {
  dashboard: { title: "Dashboard", subtitle: "Welcome back, Pragathi" },
  transactions: { title: "Transactions", subtitle: "Manage your financial activity" },
  insights: { title: "Insights", subtitle: "Understand your spending patterns" },
  settings: { title: "Settings", subtitle: "Manage your account and preferences" },
};

export default function Header() {
  const { activePage, isDarkMode, toggleDarkMode, role } = useAppStore();
  const { title, subtitle } = pageTitles[activePage] || pageTitles.dashboard;

  return (
    <header className="h-16 px-6 md:px-8 flex items-center justify-between border-b border-[#F0F0F0] dark:border-[#27272A] bg-white dark:bg-[#18181B] shrink-0">
      {/* page title */}
      <div>
        <h1 className="text-sm font-semibold text-[#0A0A0A] dark:text-[#FAFAFA] tracking-tight">
          {title}
        </h1>
        <p className="text-xs text-[#9CA3AF] dark:text-[#52525B] mt-0.5">
          {subtitle}
        </p>
      </div>

      {/* right side */}
      <div className="flex items-center gap-2">
        {/* role badge */}
        <span
          className={`text-[10px] font-medium px-2.5 py-1 rounded-full border tracking-wide uppercase
          ${
            role === "admin"
              ? "bg-[#F0FDF4] border-[#BBF7D0] text-[#16A34A] dark:bg-[#052e16] dark:border-[#166534] dark:text-[#4ade80]"
              : "bg-[#FFF7ED] border-[#FED7AA] text-[#D97706] dark:bg-[#2d1a06] dark:border-[#92400e] dark:text-[#fbbf24]"
          }`}
        >
          {role}
        </span>

        {/* dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7280] hover:text-[#0A0A0A] dark:hover:text-[#FAFAFA] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] transition-all duration-100"
        >
          {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* notification bell — decorative for now */}
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6B7280] hover:text-[#0A0A0A] dark:hover:text-[#FAFAFA] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] transition-all duration-100">
          <Bell size={15} />
        </button>
      </div>
    </header>
  );
}