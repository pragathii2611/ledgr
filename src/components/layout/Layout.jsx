import { useAppStore } from "../../store/appStore";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }) {
  const { isSidebarOpen } = useAppStore();

  return (
    <div className="flex h-screen bg-[#FAFAFA] dark:bg-[#09090B] overflow-hidden">
      {/* sidebar */}
      <Sidebar />

      {/* main content */}
      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300`}
      >
        <Header />
        <main className="flex-1 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={children?.type?.name || "page"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="p-6 md:p-8 max-w-7xl mx-auto w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}