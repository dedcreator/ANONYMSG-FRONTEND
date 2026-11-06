'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useTheme } from '@/app/context/ThemeContext'
import { API_BASE_URL } from '@/lib/api'

export default function VerifyEmailClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { darkMode } = useTheme()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  const themeClasses = {
    bg: darkMode ? 'bg-[#0B0F19]' : 'bg-slate-50',
    card: darkMode ? 'bg-slate-900/90 border border-slate-800' : 'bg-white border border-slate-200 shadow-sm',
    text: darkMode ? 'text-white' : 'text-slate-900',
    textSecondary: darkMode ? 'text-slate-400' : 'text-slate-600',
  }

  useEffect(() => {
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (!token || !email) {
      setStatus('error')
      setMessage('Invalid verification link')
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify-email/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, email })
        })

        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage(data.message || 'Email verified successfully!')
          setTimeout(() => router.push('/login'), 3000)
        } else {
          setStatus('error')
          setMessage(data.error || 'Verification failed')
        }
      } catch (error) {
        setStatus('error')
        setMessage('Network error. Please try again.')
      }
    }

    verifyEmail()
  }, [searchParams, router])

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${themeClasses.bg}`}>
      <div className={`${themeClasses.card} rounded-2xl p-8 max-w-md w-full text-center`}>
        {status === 'loading' && (
          <>
            <Loader2 size={44} className="animate-spin text-blue-500 mx-auto mb-4" />
            <h2 className={`text-xl font-bold mb-2 ${themeClasses.text}`}>Verifying Your Email...</h2>
            <p className={`${themeClasses.textSecondary} text-sm`}>Please wait while we verify your account.</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle size={28} className="text-emerald-500" />
            </div>
            <h2 className={`text-xl font-bold mb-2 ${themeClasses.text}`}>Email Verified!</h2>
            <p className={`${themeClasses.textSecondary} text-sm mb-6`}>{message}</p>
            <Link href="/login">
              <button className="w-full px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl text-white font-medium transition shadow-sm">
                Go to Login
              </button>
            </Link>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <XCircle size={28} className="text-rose-500" />
            </div>
            <h2 className={`text-xl font-bold mb-2 ${themeClasses.text}`}>Verification Failed</h2>
            <p className={`${themeClasses.textSecondary} text-sm mb-6`}>{message}</p>
            <div className="space-y-3">
              <Link href="/login">
                <button className="w-full px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl text-white font-medium transition shadow-sm">
                  Back to Login
                </button>
              </Link>
              <Link href="/forgot-password">
                <button className="w-full px-6 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-800 dark:text-slate-200 font-medium transition">
                  Need Help?
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
