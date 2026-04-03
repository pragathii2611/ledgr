import { Inbox } from "lucide-react";

export default function EmptyState({ title = "No data", subtitle = "Nothing to show here yet." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[#F4F4F5] dark:bg-[#27272A] flex items-center justify-center mb-4">
        <Inbox size={20} className="text-[#9CA3AF]" />
      </div>
      <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA] mb-1">
        {title}
      </p>
      <p className="text-xs text-[#9CA3AF] dark:text-[#52525B] max-w-xs">
        {subtitle}
      </p>
    </div>
  );
}