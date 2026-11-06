// app/(auth)/login/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/app/context/ThemeContext'
import { authAPI, API_BASE_URL } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const { darkMode } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [error, setError] = useState('')
  const [needsVerification, setNeedsVerification] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      router.push('/dashboard')
    } else {
      setCheckingAuth(false)
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setNeedsVerification(false)
    setIsLoading(true)
    
    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      })
      
      const data = await response.json()
      
      if (response.ok) {
        localStorage.setItem('access_token', data.access)
        localStorage.setItem('refresh_token', data.refresh)
        localStorage.setItem('user', JSON.stringify(data.user))
        router.push('/dashboard')
      } else {
        // Check if error is about unverified email
        if (data.error && data.error.toLowerCase().includes('verify')) {
          setNeedsVerification(true)
          setVerificationEmail(formData.email)
          setError(data.error)
        } else {
          setError(data.error || 'Login failed')
        }
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resendVerificationEmail = async () => {
    setIsResending(true)
    setError('')
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-verification/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verificationEmail })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setResendSuccess(true)
        setTimeout(() => setResendSuccess(false), 5000)
      } else {
        setError(data.error || 'Failed to resend verification email')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  // Show loading spinner while checking auth
  if (checkingAuth) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-black' : 'bg-white'}`}>
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const themeClasses = {
    bg: darkMode ? 'bg-[#0B0F19]' : 'bg-slate-50',
    card: darkMode ? 'bg-slate-900/90 border border-slate-800' : 'bg-white border border-slate-200 shadow-sm',
    input: darkMode ? 'bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500' : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400',
    text: darkMode ? 'text-white' : 'text-slate-900',
    textSecondary: darkMode ? 'text-slate-400' : 'text-slate-600',
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
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${themeClasses.text}`}>Welcome Back</h1>
            <p className={`${themeClasses.textSecondary} mt-2 text-sm`}>Sign in to your anonymous account</p>
          </div>

          {/* Verification Needed Message */}
          {needsVerification && (
            <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-500 text-sm font-medium mb-2">
                    Please verify your email address first
                  </p>
                  <button
                    onClick={resendVerificationEmail}
                    disabled={isResending}
                    className="text-sm text-blue-500 hover:text-blue-400 font-medium disabled:opacity-50"
                  >
                    {isResending ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      'Resend verification email →'
                    )}
                  </button>
                  {resendSuccess && (
                    <p className="text-emerald-500 text-xs mt-2">
                      ✓ Verification email sent! Please check your inbox.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {error && !needsVerification && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className={`block text-xs sm:text-sm font-medium ${themeClasses.textSecondary} mb-1 sm:mb-2`}>
                Email or Username
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full ${themeClasses.input} rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition`}
                  placeholder="you@example.com or username"
                  required
                  disabled={needsVerification}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs sm:text-sm font-medium ${themeClasses.textSecondary} mb-1 sm:mb-2`}>
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full ${themeClasses.input} rounded-xl pl-10 pr-10 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition`}
                  placeholder="••••••••"
                  required
                  disabled={needsVerification}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500" 
                  disabled={needsVerification}
                />
                <span>Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-blue-500 hover:text-blue-400 font-medium transition">
                Forgot password?
              </Link>
            </div>

            {!needsVerification && (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl text-white font-semibold transition shadow-sm disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            )}

            {needsVerification && (
              <div className="text-center">
                <Link href="/login">
                  <button className="text-blue-500 hover:text-blue-400 text-sm font-medium">
                    Back to login
                  </button>
                </Link>
              </div>
            )}
          </form>

          {!needsVerification && (
            <div className={`mt-6 text-center text-sm ${themeClasses.textSecondary}`}>
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-500 hover:text-blue-400 font-semibold transition">
                Create one now
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}