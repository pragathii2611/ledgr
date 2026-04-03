export function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-[#EBEBE8] dark:bg-[#2E2E2C] rounded-lg ${className}`} />
  );
}

export function KPICardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#242422] border border-[#EBEBE8] dark:border-[#2E2E2C] rounded-card shadow-card p-6">
      <Skeleton className="h-3 w-24 mb-5" />
      <Skeleton className="h-10 w-36 mb-3" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-6 py-4"><Skeleton className="h-3.5 w-20" /></td>
      <td className="px-6 py-4"><Skeleton className="h-3.5 w-44" /></td>
      <td className="px-6 py-4"><Skeleton className="h-3.5 w-24" /></td>
      <td className="px-6 py-4"><Skeleton className="h-3.5 w-16" /></td>
      <td className="px-6 py-4"><Skeleton className="h-3.5 w-20 ml-auto" /></td>
    </tr>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white dark:bg-[#242422] border border-[#EBEBE8] dark:border-[#2E2E2C] rounded-card shadow-card p-6">
      <Skeleton className="h-4 w-36 mb-2" />
      <Skeleton className="h-3 w-48 mb-8" />
      <Skeleton className="h-52 w-full" />
    </div>
  );
}