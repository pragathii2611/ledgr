import { useAppStore } from "./store/appStore";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import FinancialAssistant from "./components/chat/FinancialAssistant";

const pages = {
  dashboard: Dashboard,
  transactions: Transactions,
  insights: Insights,
  settings: Settings,
};

export default function App() {
  const { activePage } = useAppStore();
  const Page = pages[activePage] || Dashboard;

  return (
    <>
      <Layout>
        <Page />
      </Layout>
      <FinancialAssistant />
    </>
  );
}