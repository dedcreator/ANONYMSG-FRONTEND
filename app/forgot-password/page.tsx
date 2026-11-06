// app/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/app/context/ThemeContext'
import { API_BASE_URL } from '@/lib/api'

export default function ForgotPasswordPage() {
  const { darkMode } = useTheme()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState('')

  const themeClasses = {
    bg: darkMode ? 'bg-[#0B0F19]' : 'bg-slate-50',
    card: darkMode ? 'bg-slate-900/90 border border-slate-800' : 'bg-white border border-slate-200 shadow-sm',
    input: darkMode ? 'bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500' : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400',
    text: darkMode ? 'text-white' : 'text-slate-900',
    textSecondary: darkMode ? 'text-slate-400' : 'text-slate-600',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      })

      const data = await response.json()

      if (response.ok) {
        setIsSent(true)
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-20 ${themeClasses.bg}`}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className={`${themeClasses.card} rounded-2xl p-6 sm:p-8`}>
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
              <Mail className="text-white" size={28} />
            </div>
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${themeClasses.text}`}>Forgot Password?</h1>
            <p className={`${themeClasses.textSecondary} mt-2 text-sm`}>
              Enter your email or username and we'll send you a link to reset your password.
            </p>
          </div>

          {isSent ? (
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="text-emerald-500" size={28} />
              </div>
              <h2 className={`text-xl font-bold mb-2 ${themeClasses.text}`}>Check Your Email</h2>
              <p className={`${themeClasses.textSecondary} text-sm mb-6`}>
                We've sent a password reset link to <span className="text-blue-500 font-medium">{email}</span>
              </p>
              <p className="text-slate-500 text-xs mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Link href="/login">
                <button className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl text-white font-medium transition shadow-sm">
                  Back to Login
                </button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div>
                <label className={`block text-xs sm:text-sm font-medium ${themeClasses.textSecondary} mb-1 sm:mb-2`}>
                  Email Address or Username
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full ${themeClasses.input} rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition`}
                    placeholder="you@example.com or username"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl text-white font-semibold transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className={`text-center text-sm ${themeClasses.textSecondary}`}>
                Remember your password?{' '}
                <Link href="/login" className="text-blue-500 hover:text-blue-400 font-semibold transition">
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
