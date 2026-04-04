import { useAppStore } from "../../store/appStore";
import { Sun, Moon, Bell, Shield, Eye, Menu } from "lucide-react";

const pageTitles = {
  dashboard: { title: "Dashboard", subtitle: "Welcome back, Pragathi" },
  transactions: { title: "Transactions", subtitle: "Manage your financial activity" },
  insights: { title: "Insights", subtitle: "Understand your spending patterns" },
  settings: { title: "Settings", subtitle: "Manage your account and preferences" },
};

export default function Header() {
  const { activePage, isDarkMode, toggleDarkMode, role, setRole, toggleSidebar } = useAppStore();
  const { title, subtitle } = pageTitles[activePage] || pageTitles.dashboard;

  return (
    <header className="h-16 md:h-20 px-4 md:px-8 lg:px-10 flex items-center justify-between border-b border-[#EBEBE8] dark:border-[#2E2E2C] bg-white dark:bg-[#242422] shrink-0">
      <div className="flex items-center gap-3">
        {/* hamburger — mobile only */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-[#6B6B68] hover:bg-[#F0EFEC] dark:hover:bg-[#2E2E2C] transition-all"
        >
          <Menu size={18} />
        </button>

        <div>
          <h1 className="text-sm md:text-base font-semibold text-[#1A1A18] dark:text-[#F0EFEC] tracking-tight">
            {title}
          </h1>
          <p className="text-xs md:text-sm text-[#A8A8A5] mt-0.5 hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* role switcher */}
        <div className="flex rounded-xl border border-[#EBEBE8] dark:border-[#2E2E2C] overflow-hidden">
          <button
            onClick={() => setRole("admin")}
            className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-2 text-xs md:text-sm font-medium transition-all duration-150
              ${role === "admin"
                ? "bg-[#4F46E5] text-white"
                : "text-[#6B6B68] dark:text-[#8C8C88] hover:bg-[#F0EFEC] dark:hover:bg-[#2E2E2C]"
              }`}
          >
            <Shield size={13} />
            <span className="hidden sm:inline">Admin</span>
          </button>
          <button
            onClick={() => setRole("viewer")}
            className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-2 text-xs md:text-sm font-medium transition-all duration-150
              ${role === "viewer"
                ? "bg-[#4F46E5] text-white"
                : "text-[#6B6B68] dark:text-[#8C8C88] hover:bg-[#F0EFEC] dark:hover:bg-[#2E2E2C]"
              }`}
          >
            <Eye size={13} />
            <span className="hidden sm:inline">Viewer</span>
          </button>
        </div>

        {/* dark mode */}
        <button
          onClick={toggleDarkMode}
          className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl text-[#6B6B68] hover:text-[#1A1A18] dark:hover:text-[#F0EFEC] hover:bg-[#F0EFEC] dark:hover:bg-[#2E2E2C] transition-all duration-100"
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* bell */}
        <button className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl text-[#6B6B68] hover:text-[#1A1A18] dark:hover:text-[#F0EFEC] hover:bg-[#F0EFEC] dark:hover:bg-[#2E2E2C] transition-all duration-100">
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
}