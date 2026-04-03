export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-[#F4F4F5] dark:bg-[#27272A] rounded-lg ${className}`}
    />
  );
}

export function KPICardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#18181B] border border-[#F0F0F0] dark:border-[#27272A] rounded-card shadow-card p-5">
      <Skeleton className="h-3 w-24 mb-4" />
      <Skeleton className="h-8 w-32 mb-3" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-4 py-3"><Skeleton className="h-3 w-20" /></td>
      <td className="px-4 py-3"><Skeleton className="h-3 w-40" /></td>
      <td className="px-4 py-3"><Skeleton className="h-3 w-24" /></td>
      <td className="px-4 py-3"><Skeleton className="h-3 w-16" /></td>
      <td className="px-4 py-3"><Skeleton className="h-3 w-20 ml-auto" /></td>
    </tr>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white dark:bg-[#18181B] border border-[#F0F0F0] dark:border-[#27272A] rounded-card shadow-card p-5">
      <Skeleton className="h-3 w-32 mb-6" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}