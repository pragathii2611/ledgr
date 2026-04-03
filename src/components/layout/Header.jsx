import { useAppStore } from "../../store/appStore";
import { Sun, Moon, Bell, Shield, Eye } from "lucide-react";

const pageTitles = {
  dashboard: { title: "Dashboard", subtitle: "Welcome back, Pragathi" },
  transactions: { title: "Transactions", subtitle: "Manage your financial activity" },
  insights: { title: "Insights", subtitle: "Understand your spending patterns" },
  settings: { title: "Settings", subtitle: "Manage your account and preferences" },
};

export default function Header() {
  const { activePage, isDarkMode, toggleDarkMode, role, setRole } = useAppStore();
  const { title, subtitle } = pageTitles[activePage] || pageTitles.dashboard;

  return (
    <header className="h-20 px-8 md:px-10 flex items-center justify-between border-b border-[#F0F0F0] dark:border-[#27272A] bg-white dark:bg-[#18181B] shrink-0">
      {/* page title */}
      <div>
        <h1 className="text-base font-semibold text-[#0A0A0A] dark:text-[#FAFAFA] tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-[#9CA3AF] dark:text-[#52525B] mt-0.5">
          {subtitle}
        </p>
      </div>

      {/* right side */}
      <div className="flex items-center gap-3">

        {/* role switcher */}
        <div className="flex rounded-xl border border-[#F0F0F0] dark:border-[#27272A] overflow-hidden">
          <button
            onClick={() => setRole("admin")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-150
              ${
                role === "admin"
                  ? "bg-[#18181B] dark:bg-[#FAFAFA] text-white dark:text-[#18181B]"
                  : "text-[#6B7280] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A]"
              }`}
          >
            <Shield size={14} />
            Admin
          </button>
          <button
            onClick={() => setRole("viewer")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-150
              ${
                role === "viewer"
                  ? "bg-[#18181B] dark:bg-[#FAFAFA] text-white dark:text-[#18181B]"
                  : "text-[#6B7280] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A]"
              }`}
          >
            <Eye size={14} />
            Viewer
          </button>
        </div>

        {/* dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-[#6B7280] hover:text-[#0A0A0A] dark:hover:text-[#FAFAFA] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] transition-all duration-100"
        >
          {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* notification bell */}
        <button className="w-10 h-10 flex items-center justify-center rounded-xl text-[#6B7280] hover:text-[#0A0A0A] dark:hover:text-[#FAFAFA] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] transition-all duration-100">
          <Bell size={17} />
        </button>

      </div>
    </header>
  );
}