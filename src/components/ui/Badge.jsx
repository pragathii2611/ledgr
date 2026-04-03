export default function Badge({ type }) {
  const styles = {
    income: "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0] dark:bg-[#052e16] dark:text-[#4ade80] dark:border-[#166534]",
    expense: "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA] dark:bg-[#2d0a0a] dark:text-[#f87171] dark:border-[#7f1d1d]",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border tracking-wide uppercase ${styles[type]}`}
    >
      {type}
    </span>
  );
}