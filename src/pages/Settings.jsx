import { useState } from "react";
import { useAppStore } from "../store/appStore";
import { useTransactionStore } from "../store/transactionStore";
import { user } from "../data/mockData";
import {
  User,
  Shield,
  Eye,
  Moon,
  Sun,
  Trash2,
  Info,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";

function Section({ title, subtitle, children }) {
  return (
    <div className="bg-white dark:bg-[#18181B] border border-[#F0F0F0] dark:border-[#27272A] rounded-card shadow-card overflow-hidden">
      <div className="px-6 py-5 border-b border-[#F0F0F0] dark:border-[#27272A]">
        <p className="text-base font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
          {title}
        </p>
        {subtitle && (
          <p className="text-sm text-[#9CA3AF] mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="divide-y divide-[#F0F0F0] dark:divide-[#27272A]">
        {children}
      </div>
    </div>
  );
}

function Row({ label, sub, children }) {
  return (
    <div className="flex items-center justify-between px-6 py-5">
      <div>
        <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
          {label}
        </p>
        {sub && (
          <p className="text-sm text-[#9CA3AF] mt-0.5">{sub}</p>
        )}
      </div>
      <div className="ml-6 shrink-0">{children}</div>
    </div>
  );
}

export default function Settings() {
  const { role, setRole, isDarkMode, toggleDarkMode } = useAppStore();
  const { transactions, fetchTransactions } = useTransactionStore();
  const [budget, setBudget] = useState(user.monthlyBudget);
  const [editingBudget, setEditingBudget] = useState(false);

  const spent = transactions
    .filter((t) => {
      const d = new Date(t.date);
      const now = new Date();
      return (
        t.type === "expense" &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const budgetPct = Math.min((spent / budget) * 100, 100).toFixed(0);
  const budgetColor =
    budgetPct >= 90
      ? "#DC2626"
      : budgetPct >= 70
      ? "#D97706"
      : "#16A34A";

  const handleResetData = async () => {
    if (!window.confirm("This will reset all transactions to the original mock data. Continue?")) return;
    localStorage.removeItem("ledgr-transactions");
    await fetchTransactions();
    toast.success("Data reset to default.");
  };

  const handleSaveBudget = () => {
    setEditingBudget(false);
    toast.success("Monthly budget updated.");
  };

  return (
    <div className="space-y-5 max-w-2xl">

      {/* profile */}
      <Section title="Profile" subtitle="Your account information">
        <Row label="Name" sub="Display name across Ledgr">
          <span className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
            {user.name}
          </span>
        </Row>
        <Row label="Email" sub="Associated account email">
          <span className="text-sm text-[#6B7280]">{user.email}</span>
        </Row>
        <Row label="Avatar" sub="Your initials">
          <div className="w-9 h-9 rounded-full bg-[#F4F4F5] dark:bg-[#27272A] flex items-center justify-center">
            <span className="text-sm font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
              {user.avatar}
            </span>
          </div>
        </Row>
      </Section>

      {/* role */}
      <Section title="Role" subtitle="Controls what actions you can perform">
        <Row
          label="Current Role"
          sub={
            role === "admin"
              ? "Can add, edit and delete transactions"
              : "Read-only access to all data"
          }
        >
          <div className="flex rounded-xl border border-[#F0F0F0] dark:border-[#27272A] overflow-hidden">
            {[
              { id: "admin", icon: Shield, label: "Admin" },
              { id: "viewer", icon: Eye, label: "Viewer" },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setRole(r.id);
                  toast.success(`Switched to ${r.label} mode.`);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-150
                  ${
                    role === r.id
                      ? "bg-[#18181B] dark:bg-[#FAFAFA] text-white dark:text-[#18181B]"
                      : "text-[#6B7280] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A]"
                  }`}
              >
                <r.icon size={14} />
                {r.label}
              </button>
            ))}
          </div>
        </Row>
      </Section>

      {/* preferences */}
      <Section title="Preferences" subtitle="Customize your experience">
        <Row
          label="Dark Mode"
          sub={isDarkMode ? "Currently using dark theme" : "Currently using light theme"}
        >
          <button
            onClick={toggleDarkMode}
            className={`relative w-12 h-6 rounded-full transition-all duration-200 ${
              isDarkMode ? "bg-[#18181B]" : "bg-[#E4E4E7]"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 flex items-center justify-center ${
                isDarkMode ? "left-6" : "left-0.5"
              }`}
            >
              {isDarkMode ? (
                <Moon size={10} className="text-[#18181B]" />
              ) : (
                <Sun size={10} className="text-[#D97706]" />
              )}
            </div>
          </button>
        </Row>

        <Row label="Currency" sub="Used across all calculations">
          <span className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
            Indian Rupee (₹)
          </span>
        </Row>
      </Section>

      {/* budget tracker */}
      <Section title="Monthly Budget" subtitle="Track your spending against a set limit">
        <Row
          label="Budget Limit"
          sub={`₹${spent.toLocaleString("en-IN")} spent of ₹${budget.toLocaleString("en-IN")}`}
        >
          {editingBudget ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-32 px-3 py-2 text-sm bg-[#FAFAFA] dark:bg-[#09090B] border border-[#F0F0F0] dark:border-[#27272A] rounded-xl text-[#0A0A0A] dark:text-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#18181B] dark:focus:ring-[#FAFAFA]"
              />
              <button
                onClick={handleSaveBudget}
                className="px-3 py-2 text-sm font-medium text-white bg-[#18181B] dark:bg-[#FAFAFA] dark:text-[#18181B] rounded-xl hover:opacity-90"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditingBudget(true)}
              className="px-4 py-2 text-sm font-medium text-[#6B7280] bg-[#F4F4F5] dark:bg-[#27272A] rounded-xl hover:bg-[#E4E4E7] dark:hover:bg-[#3F3F46] transition-all"
            >
              Edit
            </button>
          )}
        </Row>

        {/* progress bar */}
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#9CA3AF]">Budget used</span>
            <span
              className="text-sm font-semibold"
              style={{ color: budgetColor }}
            >
              {budgetPct}%
            </span>
          </div>
          <div className="w-full h-2 bg-[#F4F4F5] dark:bg-[#27272A] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${budgetPct}%`, backgroundColor: budgetColor }}
            />
          </div>
          <p className="text-xs text-[#9CA3AF] mt-2">
            {budgetPct >= 90
              ? "⚠ You're close to your budget limit."
              : budgetPct >= 70
              ? "You're approaching your monthly limit."
              : "You're well within your budget this month."}
          </p>
        </div>
      </Section>

      {/* data */}
      <Section title="Data" subtitle="Manage your application data">
        <Row
          label="Reset to Default"
          sub="Restore all transactions to original mock data"
        >
          <button
            onClick={handleResetData}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#DC2626] bg-[#FEF2F2] dark:bg-[#2d0a0a] rounded-xl hover:opacity-80 transition-opacity"
          >
            <Trash2 size={14} />
            Reset
          </button>
        </Row>
      </Section>

      {/* about */}
      <Section title="About" subtitle="Application information">
        <Row label="App Name" sub="Your personal finance dashboard">
          <span className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
            Ledgr
          </span>
        </Row>
        <Row label="Version" sub="Current build">
          <span className="text-sm text-[#6B7280]">1.0.0</span>
        </Row>
        <Row label="Tagline" sub="">
          <span className="text-sm text-[#9CA3AF] italic">
            Your finances, clearly.
          </span>
        </Row>
      </Section>

    </div>
  );
}