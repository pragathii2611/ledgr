export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-6 h-6 border-2 border-[#F0F0F0] dark:border-[#27272A] border-t-[#18181B] dark:border-t-[#FAFAFA] rounded-full animate-spin" />
    </div>
  );
}