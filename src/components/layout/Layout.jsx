import Sidebar from "./Sidebar";
import Header from "./Header";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../store/appStore";

export default function Layout({ children }) {
  const { isSidebarOpen, toggleSidebar } = useAppStore();

  return (
    <div className="flex h-screen bg-[#F7F6F3] dark:bg-[#1C1C1A] overflow-hidden">

      {/* mobile backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* sidebar */}
      <div className={`
        fixed lg:relative z-30 lg:z-auto h-full
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <Sidebar />
      </div>

      {/* main content */}
      <div className="flex flex-col flex-1 min-w-0 w-full">
        <Header />
        <main className="flex-1 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={children?.type?.name || "page"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}