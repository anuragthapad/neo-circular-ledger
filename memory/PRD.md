# Neo Circular Ledger - PRD

## Problem Statement
Frontend-only sustainability platform tracking biomass supply, processing, carbon credits, and investments for a circular biogas ecosystem. No backend database - all data stored in localStorage.

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn UI + Recharts
- **Data**: localStorage with React Context (AppContext)
- **Auth**: Mock role-based login with demo accounts
- **Charts**: Recharts (Pie, Bar, Line charts)

## User Personas
1. **Village Ward** - Rural community biomass supplier
2. **CBG Plant Operator** - Biogas processing facility
3. **Investor** - Neo Circular Fund member
4. **Admin** - System administrator

## Core Requirements
- Role-based dashboards with KPI cards and charts
- Waste entry with auto-calculation (carbon credits + payments)
- Processing log management
- Investment marketplace
- Ledger system (immutable transaction logs)
- Notifications system
- Leaderboards

## What's Been Implemented (Feb 2026)
- [x] Login page with mock auth + quick demo access
- [x] Village Ward: Dashboard, Waste Entry Form (auto-calc), Ledger, Notifications
- [x] CBG Plant Operator: Dashboard, Processing Log, Analytics, Ledger, Notifications
- [x] Investor: Dashboard, Marketplace, Portfolio, Leaderboard, Notifications
- [x] Admin: Dashboard, User Management, All Transactions, Analytics, Settings
- [x] Real-time auto-calculation of carbon credits and payments
- [x] Chart visualizations (Pie, Bar charts)
- [x] Notifications bell with dropdown
- [x] localStorage persistence

## Prioritized Backlog
### P0 (Critical) - Done
### P1 (High)
- Date-range filter on ledger views
- Investment payment flow mock UI
### P2 (Medium)
- AI waste mix recommendation
- Risk engine scoring
- Blockchain-ready ledger view
- Export data (CSV/PDF)
### P3 (Low)
- Multi-language support
- Mobile responsive improvements
- Dark mode toggle

## Next Tasks
1. Date filters on ledger tables
2. Mobile responsiveness fine-tuning
3. AI recommendation for best waste mix
