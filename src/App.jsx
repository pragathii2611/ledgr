import { useAppStore } from "./store/appStore";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard.jsx";
import Transactions from "./pages/Transactions.jsx";
import Insights from "./pages/Insights.jsx";
import Settings from "./pages/Settings.jsx";

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
    <Layout>
      <Page />
    </Layout>
  );
}