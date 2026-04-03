export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white dark:bg-[#18181B] border border-[#F0F0F0] dark:border-[#27272A] rounded-card shadow-card ${className}`}
    >
      {children}
    </div>
  );
}