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
      className="flex flex-col h-full bg-white dark:bg-[#18181B] border-r border-[#F0F0F0] dark:border-[#27272A] shrink-0 overflow-hidden"
    >
      {/* logo */}
      <div className="flex items-center justify-between px-5 h-20 border-b border-[#F0F0F0] dark:border-[#27272A]">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-[#18181B] dark:bg-white rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white dark:text-[#18181B] text-sm font-semibold">
                  L
                </span>
              </div>
              <span className="text-[#0A0A0A] dark:text-[#FAFAFA] font-semibold text-lg tracking-tight">
                Ledgr
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {!isSidebarOpen && (
          <div className="w-8 h-8 bg-[#18181B] dark:bg-white rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white dark:text-[#18181B] text-sm font-semibold">
              L
            </span>
          </div>
        )}

        {isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6B7280] hover:text-[#0A0A0A] dark:hover:text-[#FAFAFA] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] transition-all duration-100"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* nav items */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm transition-all duration-100 group relative
                ${
                  isActive
                    ? "bg-[#F4F4F5] dark:bg-[#27272A] text-[#0A0A0A] dark:text-[#FAFAFA] font-medium"
                    : "text-[#6B7280] dark:text-[#A1A1AA] hover:bg-[#F9F9F9] dark:hover:bg-[#27272A] hover:text-[#0A0A0A] dark:hover:text-[#FAFAFA]"
                }`}
            >
              <Icon
                size={19}
                className={`shrink-0 ${
                  isActive
                    ? "text-[#0A0A0A] dark:text-[#FAFAFA]"
                    : "text-[#9CA3AF] group-hover:text-[#6B7280] dark:group-hover:text-[#A1A1AA]"
                }`}
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
                  className="absolute left-0 w-0.5 h-6 bg-[#0A0A0A] dark:bg-[#FAFAFA] rounded-r-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* role switcher */}
      <div className="px-3 pb-5 space-y-4">
        {isSidebarOpen ? (
          <>
            <p className="text-[11px] text-[#9CA3AF] dark:text-[#52525B] uppercase tracking-widest px-1 font-medium">
              Role
            </p>
            <div className="flex rounded-xl border border-[#F0F0F0] dark:border-[#27272A] overflow-hidden">
              <button
                onClick={() => setRole("admin")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all duration-150
                  ${
                    role === "admin"
                      ? "bg-[#18181B] dark:bg-white text-white dark:text-[#18181B]"
                      : "text-[#6B7280] hover:bg-[#F9F9F9] dark:hover:bg-[#27272A]"
                  }`}
              >
                <Shield size={13} />
                Admin
              </button>
              <button
                onClick={() => setRole("viewer")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-all duration-150
                  ${
                    role === "viewer"
                      ? "bg-[#18181B] dark:bg-white text-white dark:text-[#18181B]"
                      : "text-[#6B7280] hover:bg-[#F9F9F9] dark:hover:bg-[#27272A]"
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
            className="w-full flex items-center justify-center py-2.5 text-[#9CA3AF] hover:text-[#0A0A0A] dark:hover:text-[#FAFAFA] transition-all"
          >
            <ChevronRight size={16} />
          </button>
        )}

        {/* user */}
        {isSidebarOpen && (
          <div className="flex items-center gap-3 px-1 pt-1">
            <div className="w-9 h-9 rounded-full bg-[#F4F4F5] dark:bg-[#27272A] flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
                {user.avatar}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0A0A0A] dark:text-[#FAFAFA] truncate">
                {user.name}
              </p>
              <p className="text-xs text-[#9CA3AF] truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}