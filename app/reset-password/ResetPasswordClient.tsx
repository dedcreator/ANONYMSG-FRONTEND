'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/app/context/ThemeContext'
import { API_BASE_URL } from '@/lib/api'

export default function ResetPasswordClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { darkMode } = useTheme()
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isValidating, setIsValidating] = useState(true)

  const themeClasses = {
    bg: darkMode ? 'bg-[#0B0F19]' : 'bg-slate-50',
    card: darkMode ? 'bg-slate-900/90 border border-slate-800' : 'bg-white border border-slate-200 shadow-sm',
    input: darkMode ? 'bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500' : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400',
    text: darkMode ? 'text-white' : 'text-slate-900',
    textSecondary: darkMode ? 'text-slate-400' : 'text-slate-600',
  }

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    const emailParam = searchParams.get('email')
    
    if (!tokenParam || !emailParam) {
      setError('Invalid reset link')
      setIsValidating(false)
    } else {
      setToken(tokenParam)
      setEmail(emailParam)
      setIsValidating(false)
    }
  }, [searchParams])

  const validatePassword = () => {
    if (!newPassword) {
      setError('Password is required')
      return false
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePassword()) return
    
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.trim(),
          email: email.trim().toLowerCase(),
          new_password: newPassword,
          confirm_password: confirmPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => router.push('/login'), 3000)
      } else {
        setError(data.error || 'Failed to reset password')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isValidating) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.bg}`}>
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error && !token) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 ${themeClasses.bg}`}>
        <div className={`${themeClasses.card} rounded-2xl p-8 text-center max-w-md w-full`}>
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <AlertCircle className="text-rose-500" size={28} />
          </div>
          <h2 className={`text-xl font-bold mb-2 ${themeClasses.text}`}>Invalid Reset Link</h2>
          <p className={`${themeClasses.textSecondary} text-sm mb-6`}>{error}</p>
          <Link href="/forgot-password">
            <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl text-white font-medium transition shadow-sm">
              Request New Link
            </button>
          </Link>
        </div>
      </div>
    )
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
              <Lock className="text-white" size={28} />
            </div>
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${themeClasses.text}`}>Reset Password</h1>
            <p className={`${themeClasses.textSecondary} mt-2 text-sm`}>
              Create a new password for your account
            </p>
          </div>

          {isSuccess ? (
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="text-emerald-500" size={28} />
              </div>
              <h2 className={`text-xl font-bold mb-2 ${themeClasses.text}`}>Password Reset Successfully!</h2>
              <p className={`${themeClasses.textSecondary} text-sm mb-6`}>
                Your password has been updated. You will be redirected to login shortly.
              </p>
              <Link href="/login">
                <button className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl text-white font-medium transition shadow-sm">
                  Go to Login
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

              {/* New Password */}
              <div>
                <label className={`block text-xs sm:text-sm font-medium ${themeClasses.textSecondary} mb-1 sm:mb-2`}>
                  New Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full ${themeClasses.input} rounded-xl pl-10 pr-10 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition`}
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">Must be at least 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className={`block text-xs sm:text-sm font-medium ${themeClasses.textSecondary} mb-1 sm:mb-2`}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full ${themeClasses.input} rounded-xl pl-10 pr-10 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition`}
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
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
                    Reset Password
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
