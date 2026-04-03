import { useAppStore } from "../../store/appStore";
import { user } from "../../data/mockData";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  Settings,
  Shield,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "insights", label: "Insights", icon: Lightbulb },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { activePage, setActivePage, role, setRole, isSidebarOpen, toggleSidebar } =
    useAppStore();

  return (
    <motion.aside
      animate={{ width: isSidebarOpen ? 260 : 76 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col h-full bg-white dark:bg-[#242422] border-r border-[#EBEBE8] dark:border-[#2E2E2C] shrink-0 overflow-hidden"
    >
      {/* logo */}
      <div className="flex items-center justify-between px-5 h-20 border-b border-[#EBEBE8] dark:border-[#2E2E2C]">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-[#4F46E5] rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-semibold">L</span>
              </div>
              <span className="text-[#1A1A18] dark:text-[#F0EFEC] font-semibold text-lg tracking-tight">
                Ledgr
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {!isSidebarOpen && (
          <div className="w-8 h-8 bg-[#4F46E5] rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white text-sm font-semibold">L</span>
          </div>
        )}

        {isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6B6B68] hover:text-[#1A1A18] dark:hover:text-[#F0EFEC] hover:bg-[#F0EFEC] dark:hover:bg-[#2E2E2C] transition-all duration-100"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm transition-all duration-100 group relative
                ${isActive
                  ? "bg-[#EEF2FF] dark:bg-[#2E2C4E] text-[#4F46E5] font-medium"
                  : "text-[#6B6B68] dark:text-[#8C8C88] hover:bg-[#F0EFEC] dark:hover:bg-[#2E2E2C] hover:text-[#1A1A18] dark:hover:text-[#F0EFEC]"
                }`}
            >
              <Icon
                size={19}
                className={`shrink-0 ${isActive ? "text-[#4F46E5]" : "text-[#A8A8A5] group-hover:text-[#6B6B68]"}`}
              />
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap text-[15px]"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 w-0.5 h-6 bg-[#4F46E5] rounded-r-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* role + user */}
      <div className="px-3 pb-5 space-y-4">
        {isSidebarOpen ? (
          <>
            <p className="text-[11px] text-[#A8A8A5] uppercase tracking-widest px-1 font-medium">
              Role
            </p>
            <div className="flex rounded-xl border border-[#EBEBE8] dark:border-[#2E2E2C] overflow-hidden">
              <button
                onClick={() => setRole("admin")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all duration-150
                  ${role === "admin"
                    ? "bg-[#4F46E5] text-white"
                    : "text-[#6B6B68] hover:bg-[#F0EFEC] dark:hover:bg-[#2E2E2C]"
                  }`}
              >
                <Shield size={13} />
                Admin
              </button>
              <button
                onClick={() => setRole("viewer")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all duration-150
                  ${role === "viewer"
                    ? "bg-[#4F46E5] text-white"
                    : "text-[#6B6B68] hover:bg-[#F0EFEC] dark:hover:bg-[#2E2E2C]"
                  }`}
              >
                <Eye size={13} />
                Viewer
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center py-2.5 text-[#A8A8A5] hover:text-[#1A1A18] dark:hover:text-[#F0EFEC] transition-all"
          >
            <ChevronRight size={16} />
          </button>
        )}

        {isSidebarOpen && (
          <div className="flex items-center gap-3 px-1 pt-1">
            <div className="w-9 h-9 rounded-full bg-[#EEF2FF] dark:bg-[#2E2C4E] flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-[#4F46E5]">P</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#1A1A18] dark:text-[#F0EFEC] truncate">
                {user.name}
              </p>
              <p className="text-xs text-[#A8A8A5] truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}