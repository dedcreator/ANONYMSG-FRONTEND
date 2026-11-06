// app/dashboard/components/DashboardBottomNav.tsx
'use client'

import { motion } from 'framer-motion'
import { Inbox, MessageSquare, Wallet, BarChart3, Settings, Archive } from 'lucide-react'

interface DashboardBottomNavProps {
  activeTab: 'inbox' | 'analytics' | 'settings' | 'archive' | 'qa' | 'wallet'
  setActiveTab: (tab: 'inbox' | 'analytics' | 'settings' | 'archive' | 'qa' | 'wallet') => void
  unreadCount: number
  darkMode: boolean
}

export function DashboardBottomNav({
  activeTab,
  setActiveTab,
  unreadCount,
  darkMode,
}: DashboardBottomNavProps) {
  const navItems = [
    { icon: Inbox, label: 'Inbox', tab: 'inbox' as const, badge: unreadCount },
    { icon: MessageSquare, label: 'Q&A', tab: 'qa' as const, badge: 0 },
    { icon: Wallet, label: 'Wallet', tab: 'wallet' as const, badge: 0 },
    { icon: BarChart3, label: 'Stats', tab: 'analytics' as const, badge: 0 },
    { icon: Archive, label: 'Archive', tab: 'archive' as const, badge: 0 },
    { icon: Settings, label: 'Settings', tab: 'settings' as const, badge: 0 },
  ]

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-1 pointer-events-none safe-area-bottom"
    >
      <div 
        className={`pointer-events-auto max-w-md mx-auto rounded-2xl p-1.5 flex items-center justify-around border shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
          darkMode 
            ? 'bg-slate-950/90 border-blue-500/20 shadow-[0_-4px_25px_rgba(37,99,235,0.2)]' 
            : 'bg-white/95 border-slate-200/80 shadow-[0_-4px_25px_rgba(0,0,0,0.08)]'
        }`}
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.tab
          const Icon = item.icon

          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className="relative flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 group"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavPill"
                  className="absolute inset-0 rounded-xl bg-blue-600 shadow-sm"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center">
                <div className="relative">
                  <Icon
                    size={20}
                    className={`transition-colors duration-200 ${
                      isActive
                        ? 'text-white'
                        : darkMode
                        ? 'text-slate-400 group-hover:text-blue-400'
                        : 'text-slate-500 group-hover:text-blue-600'
                    }`}
                  />
                  {item.badge > 0 && (
                    <span 
                      className={`absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        isActive
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'bg-blue-600 text-white animate-pulse'
                      }`}
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1 font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-white font-semibold'
                      : darkMode
                      ? 'text-slate-400 group-hover:text-slate-200'
                      : 'text-slate-500 group-hover:text-slate-800'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
