import React from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Leaf, Factory, TrendingUp, ShieldCheck, LayoutDashboard, FileText,
  Bell, Trophy, PlusCircle, Package, BarChart3, Users, Settings, LogOut
} from 'lucide-react';

const NAV_ITEMS = {
  ward: [
    { label: 'Dashboard', path: '/ward', icon: LayoutDashboard },
    { label: 'Add Waste Entry', path: '/ward/entry', icon: PlusCircle },
    { label: 'My Ledger', path: '/ward/ledger', icon: FileText },
    { label: 'Notifications', path: '/ward/notifications', icon: Bell },
  ],
  plant: [
    { label: 'Dashboard', path: '/plant', icon: LayoutDashboard },
    { label: 'Log Processing', path: '/plant/processing', icon: Package },
    { label: 'Analytics', path: '/plant/analytics', icon: BarChart3 },
    { label: 'Ledger', path: '/plant/ledger', icon: FileText },
    { label: 'Notifications', path: '/plant/notifications', icon: Bell },
  ],
  investor: [
    { label: 'Dashboard', path: '/investor', icon: LayoutDashboard },
    { label: 'Marketplace', path: '/investor/marketplace', icon: Factory },
    { label: 'My Investments', path: '/investor/portfolio', icon: TrendingUp },
    { label: 'Leaderboard', path: '/investor/leaderboard', icon: Trophy },
    { label: 'Notifications', path: '/investor/notifications', icon: Bell },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'All Transactions', path: '/admin/ledger', icon: FileText },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ],
};

const ROLE_LABELS = {
  ward: 'Village Ward',
  plant: 'CBG Plant Operator',
  investor: 'Investor',
  admin: 'Administrator',
};

const ROLE_ICONS = {
  ward: Leaf,
  plant: Factory,
  investor: TrendingUp,
  admin: ShieldCheck,
};

export default function Sidebar() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentUser) return null;

  const navItems = NAV_ITEMS[currentUser.role] || [];
  const RoleIcon = ROLE_ICONS[currentUser.role] || Leaf;

  return (
    <aside
      data-testid="sidebar"
      className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-[#8D6E63]/15 flex flex-col z-40"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      {/* Brand */}
      <div className="p-5 border-b border-[#8D6E63]/15">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#1B5E20] flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h1
              className="text-base font-bold text-[#1A1C1A] leading-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Neo Circular
            </h1>
            <p className="text-[10px] tracking-[0.15em] uppercase text-[#758077] font-semibold">
              Ledger
            </p>
          </div>
        </div>
      </div>

      {/* Role Badge */}
      <div className="px-5 py-3 border-b border-[#8D6E63]/15">
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#E8F5E9]">
          <RoleIcon className="w-4 h-4 text-[#1B5E20]" strokeWidth={1.5} />
          <span className="text-xs font-semibold text-[#1B5E20]">
            {ROLE_LABELS[currentUser.role]}
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-3 px-3 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium mb-0.5 transition-all duration-200 ${
                isActive
                  ? 'bg-[#1B5E20] text-white shadow-sm'
                  : 'text-[#4A554C] hover:text-[#1B5E20] hover:bg-[#1B5E20]/5'
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-[#8D6E63]/15">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#4CAF50] flex items-center justify-center text-white text-xs font-bold">
            {currentUser.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#1A1C1A] truncate">{currentUser.name}</p>
            <p className="text-xs text-[#758077] truncate">{currentUser.email}</p>
          </div>
        </div>
        <button
          data-testid="logout-button"
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-[#8D6E63] hover:bg-[#8D6E63]/10 transition-colors"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.5} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
