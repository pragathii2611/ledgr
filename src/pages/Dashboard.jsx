import { useEffect } from "react";
import { useTransactionStore } from "../store/transactionStore";
import KPICards from "../components/dashboard/KPICards";

export default function Dashboard() {
  const { transactions, isLoading, fetchTransactions } = useTransactionStore();

  useEffect(() => {
    if (transactions.length === 0) {
      fetchTransactions();
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <KPICards transactions={transactions} isLoading={isLoading} />
    </div>
  );
}