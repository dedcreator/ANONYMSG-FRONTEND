// app/dashboard/components/DashboardSidebar.tsx
'use client'

import Link from 'next/link'
import { Inbox, BarChart3, Settings, LogOut, Sun, Moon, Crown, Archive, Sparkles, MessageSquare, Wallet, ExternalLink } from 'lucide-react'
import { useTheme } from '@/app/context/ThemeContext'

interface DashboardSidebarProps {
  activeTab: 'inbox' | 'analytics' | 'settings' | 'archive' | 'qa' | 'wallet'
  setActiveTab: (tab: 'inbox' | 'analytics' | 'settings' | 'archive' | 'qa' | 'wallet') => void
  username: string
  unreadCount: number
  onLogout: () => void
  profilePicture?: string | null
}

export function DashboardSidebar({ 
  activeTab, 
  setActiveTab, 
  username, 
  unreadCount, 
  onLogout,
  profilePicture = null
}: DashboardSidebarProps) {
  const { darkMode, toggleTheme } = useTheme()

  const navItems = [
    { icon: Inbox, label: 'Inbox', tab: 'inbox' as const, badge: unreadCount },
    { icon: MessageSquare, label: 'Q&A Studio', tab: 'qa' as const, badge: 0 },
    { icon: Wallet, label: 'Wallet & Earnings', tab: 'wallet' as const, badge: 0 },
    { icon: BarChart3, label: 'Analytics', tab: 'analytics' as const, badge: 0 },
    { icon: Archive, label: 'Archive', tab: 'archive' as const, badge: 0 },
    { icon: Settings, label: 'Settings', tab: 'settings' as const, badge: 0 },
  ]

  const firstChar = username ? username.charAt(0).toUpperCase() : '?'

  return (
    <aside 
      className={`hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col z-30 transition-all duration-300 border-r backdrop-blur-2xl ${
        darkMode
          ? 'bg-slate-950/80 border-slate-800/80 text-white'
          : 'bg-white/80 border-slate-200/80 text-slate-900'
      }`}
    >
      <div className="p-5 flex flex-col h-full">
        {/* Brand Logo */}
        <div className="flex items-center justify-between mb-6 pb-5 border-b border-slate-200/60 dark:border-slate-800/60">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm transition-colors">
              <Sparkles className="text-white" size={18} />
            </div>
            <div>
              <p className="font-bold text-xl tracking-tight leading-none text-slate-900 dark:text-white">
                Anon<span className="text-blue-500">Q</span>
              </p>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">Creator Hub</p>
            </div>
          </Link>
        </div>

        {/* User Card */}
        <div className={`p-3 rounded-2xl mb-6 border transition-all duration-200 ${
          darkMode 
            ? 'bg-slate-900/60 border-slate-800 hover:border-blue-500/30' 
            : 'bg-slate-50 border-slate-200/80 hover:border-blue-500/30'
        }`}>
          <div className="flex items-center gap-3">
            {profilePicture ? (
              <img 
                src={profilePicture} 
                alt={username}
                className="w-10 h-10 rounded-xl object-cover border-2 border-blue-500/30 shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <span className="text-white font-bold text-sm">{firstChar}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate text-slate-900 dark:text-white">@{username}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Crown size={11} className="text-amber-400" />
                <span className="text-[11px] text-blue-500 font-medium">Pro Creator</span>
              </div>
            </div>
            <Link
              href={`/${username}`}
              target="_blank"
              title="View Public Profile"
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
            >
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.tab
            const Icon = item.icon

            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 group relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : darkMode
                    ? 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon 
                  size={18} 
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'
                  }`} 
                />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive 
                      ? 'bg-white text-blue-600' 
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 space-y-1.5">
          <button 
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              darkMode 
                ? 'text-slate-400 hover:text-white hover:bg-slate-900/60' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-blue-500" />}
            <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
          </button>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  )
}