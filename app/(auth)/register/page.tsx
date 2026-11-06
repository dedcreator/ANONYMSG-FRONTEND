// app/(auth)/register/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@/app/context/ThemeContext'
import { authAPI } from '@/lib/api'
import { Button } from '@/components/ui/Button'

export default function RegisterPage() {
  const router = useRouter()
  const { darkMode } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      router.push('/dashboard')
    } else {
      setCheckingAuth(false)
    }
  }, [router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      const response = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        if (data.username) setErrors(prev => ({ ...prev, username: data.username[0] }))
        if (data.email) setErrors(prev => ({ ...prev, email: data.email[0] }))
        if (data.password) setErrors(prev => ({ ...prev, password: data.password[0] }))
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, general: 'Network error. Please try again.' }))
    } finally {
      setIsLoading(false)
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
              <User className="text-white" size={28} />
            </div>
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${themeClasses.text}`}>Create Account</h1>
            <p className={`${themeClasses.textSecondary} mt-2 text-sm`}>Start receiving anonymous messages</p>
          </div>

          {success && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-500 text-sm text-center flex items-center justify-center gap-2">
              <Check size={16} />
              Account created! Please check your email to verify your account.
            </div>
          )}

          {errors.general && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-500 text-sm text-center">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className={`block text-xs sm:text-sm font-medium ${themeClasses.textSecondary} mb-1 sm:mb-2`}>
                Username
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                  className={`w-full ${themeClasses.input} rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition ${
                    errors.username ? 'border-rose-500' : ''
                  }`}
                  placeholder="coolusername"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-xs text-red-500">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className={`block text-xs sm:text-sm font-medium ${themeClasses.textSecondary} mb-1 sm:mb-2`}>
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full ${themeClasses.input} rounded-xl pl-10 pr-4 py-2.5 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className={`block text-xs sm:text-sm font-medium ${themeClasses.textSecondary} mb-1 sm:mb-2`}>
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full ${themeClasses.input} rounded-xl pl-10 pr-10 py-2.5 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`block text-xs sm:text-sm font-medium ${themeClasses.textSecondary} mb-1 sm:mb-2`}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full ${themeClasses.input} rounded-xl pl-10 pr-10 py-2.5 placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition ${
                    errors.confirmPassword ? 'border-red-500' : ''
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Agreement */}
            <label className={`flex items-start gap-3 p-2 rounded-lg transition cursor-pointer ${
              errors.agreeTerms ? 'bg-red-500/10' : ''
            }`}>
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5"
              />
              <span className="text-xs sm:text-sm text-gray-400">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-500 hover:text-blue-400">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-500 hover:text-blue-400">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-xs text-red-500">{errors.agreeTerms}</p>
            )}

            <Button type="submit" fullWidth loading={isLoading} variant="primary">
              Create Account
              <ArrowRight size={16} />
            </Button>
          </form>

          <div className={`mt-6 text-center text-sm ${themeClasses.textSecondary}`}>
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500 hover:text-blue-400 font-semibold transition">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}