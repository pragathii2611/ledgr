# Ledgr — Your finances, clearly.

A premium personal finance dashboard built for the Zorvyn FinTech Frontend Developer Intern assignment.

**Live Demo:** https://ledgr-one-phi.vercel.app

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React + Vite |
| Styling | Tailwind CSS |
| State | Zustand |
| Charts | Recharts |
| Animations | Framer Motion |
| AI Assistant | OpenAI GPT-4o mini |
| Deploy | Vercel |

---

## Features

### Core Requirements
- **Dashboard Overview** — 4 KPI cards with animated count-up, area trend chart, category donut chart, recent transactions table
- **Transactions** — Full table with search, filter by type/category, date range, amount range, sort by date/amount/category, Table and Timeline view toggle
- **Role Based UI** — Admin can add, edit, delete transactions. Viewer has read-only access. Switch roles via header toggle or sidebar
- **Insights** — Top category, savings rate, biggest expense, monthly comparison bar chart, category breakdown with progress bars, smart observation
- **State Management** — Zustand with three stores: appStore (role, theme, navigation), transactionStore (CRUD, loading), filterStore (all filter state)

### Enhancements
- **Dark / Light mode** — Full dark mode with warm neutral palette, persisted via localStorage
- **Export CSV and JSON** — Downloads filtered transactions with proper formatting
- **Mock API simulation** — `mockApi.js` wraps data with 700ms delay to simulate real network calls
- **Animations** — Framer Motion page transitions, modal open/close, sidebar collapse, skeleton loaders
- **Advanced filters** — Date range picker, amount min/max range, combined with search and category filters
- **Financial Health Score** — Animated ring chart scoring 0-100 based on savings rate, income diversity, spend concentration, budget control
- **Spending Heatmap** — GitHub-style calendar showing daily spend activity across the year with hover tooltips
- **Transaction Timeline** — Alternative view grouping transactions by date with day totals
- **AI Financial Assistant** — GPT-4o mini powered chatbot with access to real transaction data, answers questions about spending, savings, and financial health
- **Responsive** — Works on mobile, tablet, and desktop. Sidebar becomes a slide-in drawer on mobile

---

## Architecture Decisions

### Why Zustand over Context
Zustand gives a cleaner API with less boilerplate than useContext + useReducer. Each concern is separated into its own store — app state, transactions, and filters — making the code modular and easy to extend.

### Mock API Pattern
`src/services/mockApi.js` wraps the mock data with simulated network delays. This means the app handles loading states, errors, and async patterns exactly as it would with a real backend — just without one.

### Folder Structure
```
src/
├── components/
│   ├── chat/          ← AI assistant
│   ├── dashboard/     ← KPI cards, charts, heatmap, health score
│   ├── insights/      ← Insights components
│   ├── layout/        ← Sidebar, header, layout wrapper
│   ├── transactions/  ← Table, timeline, filters, modal, export
│   └── ui/            ← Reusable: card, badge, modal, skeleton, empty state
├── store/             ← Zustand stores
├── data/              ← Mock data and category config
├── services/          ← Mock API
├── utils/             ← Formatters, calculations, export helpers
├── hooks/             ← useFilteredTransactions
└── pages/             ← Dashboard, Transactions, Insights, Settings
```

---

## Role System

Switch between Admin and Viewer using the toggle in the header or sidebar.

| Feature | Admin | Viewer |
|---|---|---|
| View all data | ✓ | ✓ |
| Add transaction | ✓ | ✗ |
| Edit transaction | ✓ | ✗ |
| Delete transaction | ✓ | ✗ |
| Export data | ✓ | ✓ |
| AI assistant | ✓ | ✓ |

---

## Setup Instructions
```bash
# Clone the repo
git clone https://github.com/pragathii2611/ledgr.git
cd ledgr

# Install dependencies
npm install

# Add environment variable
echo "VITE_OPENAI_API_KEY=your_key_here" > .env

# Start dev server
npm run dev
```

Open `http://localhost:5173`

> The app works fully without the OpenAI API key — the AI assistant will show an error message but everything else functions normally.

---

## Mock Data

60 transactions across January, February, and March 2026 covering 11 categories: Salary, Freelance, Investment, Housing, Food & Dining, Transport, Shopping, Entertainment, Healthcare, Utilities, Education.

Data is designed to feel real — odd amounts like ₹1,847, UPI-style descriptions, variable freelance income, and realistic spending patterns.

---

## Assumptions

- Data is India-specific — INR currency, Indian UPI transaction descriptions, Bangalore context
- No backend required — all data is mock and persisted in localStorage
- The AI assistant requires an OpenAI API key to function
- Dark mode preference and role selection persist across sessions via localStorage

---

## Known Limitations

- The spending heatmap only shows 2026 data since mock data is limited to Q1 2026
- Trend chart shows a drop in April because only one test transaction exists for that month
- AI responses depend on OpenAI API availability and credits

---
