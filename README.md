# FinanceOS — Finance Dashboard

A clean, interactive personal finance dashboard built with React.js and JavaScript.
Track your income, expenses, and spending patterns in a modern interface with dark mode support.

---

## Developer
**M. Jayantha Siva Srinivas**

## Framework
**React.js with JavaScript (Vite 8)**

## Deployed on
**Vercel**

---

## Live Demo

🔗 [https://finance-os-chi-red.vercel.app/](https://finance-os-chi-red.vercel.app/)

---

## GitHub Repository

📁 [https://github.com/MJSS-09/finance-os.git](https://github.com/MJSS-09/finance-os.git)

---

## About the Project

FinanceOS is a fully functional frontend finance dashboard built as part of a frontend development evaluation assignment. It allows users to track their financial activity, understand spending patterns, and gain insights from transaction data — all without a backend or database.

All data is stored in the browser's localStorage, making it self-contained and easy to run anywhere.

---

## Features

### Dashboard Overview
- 4 summary cards — Total Balance, Monthly Income, Monthly Expenses, Savings Rate
- Mini sparkline trend lines on each card
- Monthly balance trend bar chart (February, March, April)
- Spending breakdown donut chart with top 5 categories
- Weekly expense pattern chart
- Recent activity feed with quick navigation

### Transactions
- Full transaction list with date, description, category, type, and amount
- Real-time search by description or category
- Filter by type — Income or Expense
- Filter by category — 10 spending categories
- Sort by Date, Amount, or Name with ascending/descending toggle
- Live stats bar showing filtered totals
- Export filtered transactions as CSV

### Role-Based UI
| Role | Access |
|------|--------|
| Viewer (Default) | Read-only — view all data and export CSV |
| Admin | Full access — add, edit, and delete transactions |

Switch roles using the dropdown in the header. No login required.

### Insights
- Category breakdown with progress bars and percentages
- Highest spending category
- Savings rate as a percentage of income
- Month-over-month income and expense comparison
- Net balance result for the month

### Additional Features
- Dark mode — full theme toggle, saved across sessions
- Data persistence — transactions, role, and theme saved in localStorage
- Responsive design — works on mobile and desktop
- Empty state handling — friendly message when no results match filters
- Delete confirmation modal — prevents accidental data loss

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React.js | 18.2.0 | UI components and state management |
| JavaScript (ES6+) | ES2022 | Primary programming language |
| Vite | 8.0.0 | Build tool and development server |
| HTML5 | Latest | App entry point |
| CSS3 Inline Styles | Latest | Styling with CSS variables for theming |
| Node.js | v20 LTS | JavaScript runtime |
| Vercel | Web | Deployment platform |

---

## No External Dependencies

No chart library (custom SVG charts built from scratch)  
No UI component library (no Tailwind, MUI, or Bootstrap)  
No state management library (pure React hooks)  
No CSS framework (inline styles with CSS variables)

---
