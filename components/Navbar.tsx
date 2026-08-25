// /components/Navbar.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useTheme } from '@/app/context/ThemeContext'
import { Menu, X, Home, MessageSquare, User, LogOut, Sun, Moon, Inbox, Sparkles, BarChart3, Rocket, Zap } from 'lucide-react'

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { darkMode, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Don't render top navbar on any dashboard routes
  if (pathname?.startsWith('/dashboard')) {
    return null
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAuthenticated(!!localStorage.getItem('access_token'))
    }
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    setIsAuthenticated(false)
    router.push('/')
  }

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/features', label: 'Features', icon: Zap },
    { href: '/how-it-works', label: 'How It Works', icon: Rocket },
  ]

  const themeClasses = {
    bg: darkMode ? 'bg-slate-950/85 backdrop-blur-xl border-slate-800/80' : 'bg-white/85 backdrop-blur-xl border-slate-200/80',
    text: darkMode ? 'text-white' : 'text-slate-900',
    textSecondary: darkMode ? 'text-slate-400' : 'text-slate-600',
    hover: darkMode ? 'hover:bg-slate-900 hover:text-white' : 'hover:bg-slate-100 hover:text-slate-900',
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b ${themeClasses.bg} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className={`text-xl font-black tracking-tight ${themeClasses.text}`}>
              Anon<span className="text-blue-500">Q</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${themeClasses.textSecondary} ${themeClasses.hover}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition ${themeClasses.textSecondary} ${themeClasses.hover}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-blue-500/25 active:scale-95"
                >
                  <Inbox size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className={`p-2 rounded-xl transition ${themeClasses.textSecondary} ${themeClasses.hover}`}
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${themeClasses.textSecondary} ${themeClasses.hover}`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-blue-500/25 active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl transition ${themeClasses.textSecondary} ${themeClasses.hover}`}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-t ${darkMode ? 'border-slate-800 bg-slate-950/95' : 'border-slate-200 bg-white/95'} backdrop-blur-xl`}>
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${themeClasses.textSecondary} ${themeClasses.hover}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
            
            <button
              onClick={() => { toggleTheme(); setMobileMenuOpen(false) }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition w-full font-medium ${themeClasses.textSecondary} ${themeClasses.hover}`}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/25"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Inbox size={18} />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false) }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-rose-500 hover:bg-rose-500/10 transition w-full font-medium text-sm"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition border border-slate-200 dark:border-slate-800 font-medium text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/25"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}