import { create } from "zustand";

export const useFilterStore = create((set) => ({
  search: "",
  type: "all",
  category: "all",
  sortBy: "date",
  sortOrder: "desc",
  dateFrom: "",
  dateTo: "",
  amountMin: "",
  amountMax: "",

  // setters
  setSearch: (search) => set({ search }),
  setType: (type) => set({ type }),
  setCategory: (category) => set({ category }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setDateFrom: (dateFrom) => set({ dateFrom }),
  setDateTo: (dateTo) => set({ dateTo }),
  setAmountMin: (amountMin) => set({ amountMin }),
  setAmountMax: (amountMax) => set({ amountMax }),

  // reset all filters
  resetFilters: () =>
    set({
      search: "",
      type: "all",
      category: "all",
      sortBy: "date",
      sortOrder: "desc",
      dateFrom: "",
      dateTo: "",
      amountMin: "",
      amountMax: "",
    }),

  // check if any filter is active
  hasActiveFilters: () => {
    const state = useFilterStore.getState();
    return (
      state.search !== "" ||
      state.type !== "all" ||
      state.category !== "all" ||
      state.dateFrom !== "" ||
      state.dateTo !== "" ||
      state.amountMin !== "" ||
      state.amountMax !== ""
    );
  },
}));