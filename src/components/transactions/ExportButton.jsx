import { useState } from "react";
import { Download } from "lucide-react";
import { useFilteredTransactions } from "../../hooks/useFilteredTransactions";
import { exportToCSV, exportToJSON } from "../../utils/exportUtils";
import toast from "react-hot-toast";

export default function ExportButton() {
  const filtered = useFilteredTransactions();
  const [open, setOpen] = useState(false);

  const handleExport = (type) => {
    if (filtered.length === 0) {
      toast.error("No transactions to export.");
      return;
    }
    if (type === "csv") {
      exportToCSV(filtered, "ledgr-export");
      toast.success(`Exported ${filtered.length} transactions as CSV.`);
    } else {
      exportToJSON(filtered, "ledgr-export");
      toast.success(`Exported ${filtered.length} transactions as JSON.`);
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#6B7280] dark:text-[#A1A1AA] bg-white dark:bg-[#18181B] border border-[#F0F0F0] dark:border-[#27272A] rounded-xl hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] transition-all duration-150"
      >
        <Download size={15} />
        Export
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-[#18181B] border border-[#F0F0F0] dark:border-[#27272A] rounded-xl shadow-modal z-20 overflow-hidden">
            {["csv", "json"].map((type) => (
              <button
                key={type}
                onClick={() => handleExport(type)}
                className="w-full px-4 py-3 text-sm text-left text-[#0A0A0A] dark:text-[#FAFAFA] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] transition-colors uppercase font-medium"
              >
                Export as {type.toUpperCase()}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}