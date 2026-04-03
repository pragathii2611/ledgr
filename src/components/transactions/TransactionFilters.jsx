import { Search, SlidersHorizontal, X } from "lucide-react";
import { useFilterStore } from "../../store/filterStore";
import { categories } from "../../data/mockData";

export default function TransactionFilters() {
  const {
    search, setSearch,
    type, setType,
    category, setCategory,
    sortBy, setSortBy,
    sortOrder, setSortOrder,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    amountMin, setAmountMin,
    amountMax, setAmountMax,
    resetFilters,
    hasActiveFilters,
  } = useFilterStore();

  const inputClass =
    "px-4 py-2.5 text-sm bg-white dark:bg-[#18181B] border border-[#F0F0F0] dark:border-[#27272A] rounded-xl text-[#0A0A0A] dark:text-[#FAFAFA] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#18181B] dark:focus:ring-[#FAFAFA] focus:border-transparent transition-all duration-150";

  return (
    <div className="bg-white dark:bg-[#18181B] border border-[#F0F0F0] dark:border-[#27272A] rounded-card shadow-card p-5 space-y-4">
      {/* row 1 — search + type + category + sort */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className={`${inputClass} pl-10 w-full`}
          />
        </div>

        {/* type */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={inputClass}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={inputClass}
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
          <option value="category">Sort by Category</option>
          <option value="description">Sort by Description</option>
        </select>

        {/* sort order */}
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className={`${inputClass} px-4 py-2.5 cursor-pointer`}
        >
          {sortOrder === "desc" ? "↓ Newest" : "↑ Oldest"}
        </button>

        {/* clear filters */}
        {hasActiveFilters() && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-[#DC2626] bg-[#FEF2F2] dark:bg-[#2d0a0a] rounded-xl hover:opacity-80 transition-opacity"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      {/* row 2 — advanced filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#9CA3AF]">From</span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#9CA3AF]">To</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#9CA3AF]">₹ Min</span>
          <input
            type="number"
            value={amountMin}
            onChange={(e) => setAmountMin(e.target.value)}
            placeholder="0"
            className={`${inputClass} w-28`}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#9CA3AF]">₹ Max</span>
          <input
            type="number"
            value={amountMax}
            onChange={(e) => setAmountMax(e.target.value)}
            placeholder="Any"
            className={`${inputClass} w-28`}
          />
        </div>
      </div>
    </div>
  );
}