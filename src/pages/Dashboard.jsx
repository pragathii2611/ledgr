import { useEffect } from "react";
import { useTransactionStore } from "../store/transactionStore";
import KPICards from "../components/dashboard/KPICards";
import TrendChart from "../components/dashboard/TrendChart";
import CategoryChart from "../components/dashboard/CategoryChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";

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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendChart transactions={transactions} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-1">
          <CategoryChart transactions={transactions} isLoading={isLoading} />
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={transactions} isLoading={isLoading} />
    </div>
  );
}