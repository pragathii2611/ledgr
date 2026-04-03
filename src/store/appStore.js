import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAppStore = create(
  persist(
    (set) => ({
      // role
      role: "admin",
      setRole: (role) => set({ role }),

      // theme
      isDarkMode: false,
      toggleDarkMode: () =>
        set((state) => {
          const next = !state.isDarkMode;
          if (next) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { isDarkMode: next };
        }),

      // active page
      activePage: "dashboard",
      setActivePage: (page) => set({ activePage: page }),

      // sidebar
      isSidebarOpen: true,
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    }),
    {
      name: "ledgr-app",
      onRehydrateStorage: () => (state) => {
        // reapply dark mode class on page reload
        if (state?.isDarkMode) {
          document.documentElement.classList.add("dark");
        }
      },
    }
  )
);