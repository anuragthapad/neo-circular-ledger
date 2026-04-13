import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Search, X, Menu } from 'lucide-react';

export default function Header({ title, subtitle, onMenuToggle }) {
  const { currentUser, notifications, markNotificationRead } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);

  if (!currentUser) return null;

  const userNotifs = notifications.filter(n => n.userId === currentUser.id);
  const unreadCount = userNotifs.filter(n => !n.read).length;

  return (
    <header
      data-testid="app-header"
      className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#8D6E63]/15 px-4 md:px-8 py-4"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Hamburger for mobile */}
          <button
            data-testid="mobile-menu-btn"
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md hover:bg-[#1B5E20]/5 transition-colors"
          >
            <Menu className="w-5 h-5 text-[#4A554C]" strokeWidth={1.5} />
          </button>
          <div>
          <h2
            data-testid="page-title"
            className="text-2xl font-bold text-[#1A1C1A] tracking-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-[#758077] mt-0.5">{subtitle}</p>
          )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md border border-[#8D6E63]/20 bg-white">
            <Search className="w-4 h-4 text-[#758077]" strokeWidth={1.5} />
            <input
              data-testid="header-search"
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-[#1A1C1A] placeholder:text-[#758077] outline-none w-40"
            />
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              data-testid="notifications-bell"
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-md hover:bg-[#1B5E20]/5 transition-colors"
            >
              <Bell className="w-5 h-5 text-[#4A554C]" strokeWidth={1.5} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#D32F2F] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {showNotifs && (
              <div className="absolute right-0 top-12 w-80 bg-white border border-[#8D6E63]/15 rounded-lg shadow-lg z-50">
                <div className="flex items-center justify-between p-3 border-b border-[#8D6E63]/10">
                  <span className="text-sm font-semibold text-[#1A1C1A]">Notifications</span>
                  <button onClick={() => setShowNotifs(false)}>
                    <X className="w-4 h-4 text-[#758077]" />
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {userNotifs.length === 0 ? (
                    <p className="p-4 text-sm text-[#758077] text-center">No notifications</p>
                  ) : (
                    userNotifs.slice(0, 8).map(n => (
                      <button
                        key={n.id}
                        data-testid={`notif-${n.id}`}
                        onClick={() => markNotificationRead(n.id)}
                        className={`w-full text-left px-4 py-3 border-b border-[#8D6E63]/5 hover:bg-[#F1F8E9]/50 transition-colors ${
                          !n.read ? 'bg-[#E8F5E9]/30' : ''
                        }`}
                      >
                        <p className={`text-sm ${!n.read ? 'font-semibold text-[#1A1C1A]' : 'text-[#4A554C]'}`}>
                          {n.message}
                        </p>
                        <p className="text-xs text-[#758077] mt-1">
                          {new Date(n.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
