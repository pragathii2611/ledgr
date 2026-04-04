import { useEffect } from "react";
import { useTransactionStore } from "../store/transactionStore";
import KPICards from "../components/dashboard/KPICards";
import TrendChart from "../components/dashboard/TrendChart";
import CategoryChart from "../components/dashboard/CategoryChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import HealthScore from "../components/dashboard/HealthScore";

export default function Dashboard() {
  const { transactions, isLoading, fetchTransactions } = useTransactionStore();

  useEffect(() => {
    if (transactions.length === 0) fetchTransactions();
  }, []);

  return (
    <div className="space-y-5 md:space-y-6">
      <KPICards transactions={transactions} isLoading={isLoading} />

      <TrendChart transactions={transactions} isLoading={isLoading} />

      {transactions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          <HealthScore transactions={transactions} isLoading={isLoading} />
          <CategoryChart transactions={transactions} isLoading={isLoading} />
        </div>
      )}

      <RecentTransactions transactions={transactions} isLoading={isLoading} />
    </div>
  );
}