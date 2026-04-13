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

## What's Been Implemented

### Phase 1 (Feb 2026)
- [x] Login page with mock auth + quick demo access
- [x] Village Ward: Dashboard, Waste Entry Form (auto-calc), Ledger, Notifications
- [x] CBG Plant Operator: Dashboard, Processing Log, Analytics, Ledger, Notifications
- [x] Investor: Dashboard, Marketplace, Portfolio, Leaderboard, Notifications
- [x] Admin: Dashboard, User Management, All Transactions, Analytics, Settings
- [x] Chart visualizations (Pie, Bar charts)
- [x] Notifications bell with dropdown
- [x] localStorage persistence

### Phase 2 - Enhancements (Feb 2026)
- [x] Date-range filters on all ledger pages (Ward, Plant, Admin)
- [x] CSV export on all ledger/transaction tables
- [x] Mobile responsive sidebar with hamburger toggle
- [x] AI waste mix recommendation (Smart card on Ward dashboard)
- [x] Shareable Impact Report page (Print + Share + environmental equivalence)
- [x] Print styles for Impact Report

## Prioritized Backlog
### P1 (High)
- Real-time notifications via WebSocket
- User profile editing
### P2 (Medium)
- Multi-language support (Hindi)
- Dark mode toggle
- Risk engine scoring
### P3 (Low)
- Blockchain-ready ledger hashing
- PDF export for Impact Report

## Next Tasks
1. PDF export for Impact Report (using html2pdf or jsPDF)
2. Multi-language support
3. Dark mode toggle
