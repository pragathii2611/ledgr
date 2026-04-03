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
    <header className="h-20 px-8 md:px-10 flex items-center justify-between border-b border-[#EBEBE8] dark:border-[#2E2E2C] bg-white dark:bg-[#242422] shrink-0">
      <div>
        <h1 className="text-base font-semibold text-[#1A1A18] dark:text-[#F0EFEC] tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-[#A8A8A5] mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* role switcher */}
        <div className="flex rounded-xl border border-[#EBEBE8] dark:border-[#2E2E2C] overflow-hidden">
          <button
            onClick={() => setRole("admin")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-150
              ${role === "admin"
                ? "bg-[#4F46E5] text-white"
                : "text-[#6B6B68] dark:text-[#8C8C88] hover:bg-[#F0EFEC] dark:hover:bg-[#2E2E2C]"
              }`}
          >
            <Shield size={14} />
            Admin
          </button>
          <button
            onClick={() => setRole("viewer")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-150
              ${role === "viewer"
                ? "bg-[#4F46E5] text-white"
                : "text-[#6B6B68] dark:text-[#8C8C88] hover:bg-[#F0EFEC] dark:hover:bg-[#2E2E2C]"
              }`}
          >
            <Eye size={14} />
            Viewer
          </button>
        </div>

        {/* dark mode */}
        <button
          onClick={toggleDarkMode}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-[#6B6B68] hover:text-[#1A1A18] dark:hover:text-[#F0EFEC] hover:bg-[#F0EFEC] dark:hover:bg-[#2E2E2C] transition-all duration-100"
        >
          {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* bell */}
        <button className="w-10 h-10 flex items-center justify-center rounded-xl text-[#6B6B68] hover:text-[#1A1A18] dark:hover:text-[#F0EFEC] hover:bg-[#F0EFEC] dark:hover:bg-[#2E2E2C] transition-all duration-100">
          <Bell size={17} />
        </button>
      </div>
    </header>
  );
}