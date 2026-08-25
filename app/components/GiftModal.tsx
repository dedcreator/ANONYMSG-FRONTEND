// app/components/GiftModal.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Gift, Sparkles, Shield, Lock, CreditCard,
  ArrowRight, Loader2, Info
} from 'lucide-react'
import { paymentsAPI } from '@/lib/api'

interface GiftModalProps {
  isOpen: boolean
  onClose: () => void
  creatorUsername: string
  creatorAvatar?: string | null
  darkMode?: boolean
}

const PRESET_AMOUNTS = [
  { amount: 500, label: '₦500', badge: 'Supporter', icon: '🥉' },
  { amount: 1000, label: '₦1,000', badge: 'Bronze VIP', icon: '☕' },
  { amount: 2500, label: '₦2,500', badge: 'Silver VIP', icon: '🥈' },
  { amount: 5000, label: '₦5,000', badge: 'Gold Champion', icon: '🥇' },
  { amount: 10000, label: '₦10,000', badge: 'Crown Backer', icon: '👑' },
  { amount: 25000, label: '₦25,000', badge: 'Angel Backer', icon: '💎' },
  { amount: 50000, label: '₦50,000', badge: 'Diamond Legend', icon: '⭐' },
]

export function GiftModal({
  isOpen,
  onClose,
  creatorUsername,
  creatorAvatar = null,
  darkMode = true
}: GiftModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(1000)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [currency] = useState<string>('NGN')
  const [senderAlias, setSenderAlias] = useState<string>('')
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true)
  const [message, setMessage] = useState<string>('')
  const [payerEmail, setPayerEmail] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const effectiveAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount
  const platformFee = Math.round(effectiveAmount * 0.075) // 7.5% Platform Fee
  const creatorPayout = Math.max(0, effectiveAmount - platformFee)

  const getTierBadge = (amount: number) => {
    if (amount >= 50000) return { title: 'Diamond Legend', icon: '⭐', color: 'text-amber-400' }
    if (amount >= 20000) return { title: 'Angel Backer', icon: '💎', color: 'text-cyan-400' }
    if (amount >= 5000) return { title: 'Gold Champion', icon: '🥇', color: 'text-yellow-400' }
    if (amount >= 2000) return { title: 'Silver VIP', icon: '🥈', color: 'text-slate-300' }
    return { title: 'Bronze Supporter', icon: '🥉', color: 'text-blue-400' }
  }

  const currentTier = getTierBadge(effectiveAmount)

  const handlePay = async () => {
    if (effectiveAmount < 100) {
      setError('Minimum gift amount is ₦100')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/payment/process?creator=${encodeURIComponent(creatorUsername)}&type=gift`
        : undefined

      const res = await paymentsAPI.initializeGift({
        creator_username: creatorUsername,
        amount: effectiveAmount,
        currency,
        sender_alias: isAnonymous ? 'Generous Anon' : (senderAlias || 'Generous Supporter'),
        is_anonymous: isAnonymous,
        message,
        payer_email: payerEmail || undefined,
        redirect_url: redirectUrl,
      })

      const data = await res.json()

      if (res.ok && data.success && data.payment_link) {
        window.location.href = data.payment_link
      } else {
        setError(data.error || 'Failed to initialize payment. Please try again.')
      }
    } catch (err: any) {
      setError(err?.message || 'Payment service error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window / Mobile Bottom Sheet */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.96 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-lg rounded-t-[32px] sm:rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden z-10 max-h-[92vh] overflow-y-auto ${
            darkMode
              ? 'bg-slate-900 border border-slate-800 text-white shadow-blue-950/40'
              : 'bg-white border border-slate-200 text-slate-900 shadow-2xl'
          }`}
        >
          {/* Mobile Drag Indicator */}
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto mb-4 sm:hidden" />

          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-72 h-72 bg-gradient-to-br from-blue-600/20 via-indigo-600/15 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-5 right-5 p-2 rounded-full transition ${
              darkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
            }`}
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              {creatorAvatar ? (
                <img
                  src={creatorAvatar}
                  alt={creatorUsername}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/30 shadow-md"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-500/25">
                  {creatorUsername.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-1 rounded-lg text-xs shadow-md">
                <Gift size={12} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-xl tracking-tight">Gift @{creatorUsername}</h3>
                <Sparkles size={16} className="text-amber-400" />
              </div>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Encourage & reward creator via instant secure checkout
              </p>
            </div>
          </div>

          {/* Amount Presets */}
          <div className="space-y-3 mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Select Amount ({currency})
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {PRESET_AMOUNTS.map((preset) => {
                const isSelected = selectedAmount === preset.amount && !customAmount
                return (
                  <button
                    key={preset.amount}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(preset.amount)
                      setCustomAmount('')
                    }}
                    className={`p-2.5 sm:p-3 rounded-2xl text-center font-extrabold text-sm transition-all duration-200 border relative ${
                      isSelected
                        ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white border-blue-400 shadow-lg shadow-blue-500/30 scale-[1.03]'
                        : darkMode
                        ? 'bg-slate-950/60 border-slate-800 hover:bg-slate-800 text-slate-200'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <span className="text-xs block opacity-80 mb-0.5">{preset.icon}</span>
                    <span>{preset.label}</span>
                  </button>
                )
              })}

              {/* Custom amount trigger / direct input */}
              <div className="relative">
                <input
                  type="number"
                  placeholder="Custom ₦"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className={`w-full h-full p-2.5 text-center font-bold text-sm rounded-2xl border transition-all ${
                    customAmount
                      ? 'bg-blue-600/15 border-blue-500 text-white ring-2 ring-blue-500/20'
                      : darkMode
                      ? 'bg-slate-950/60 border-slate-800 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  } focus:outline-none focus:border-blue-500`}
                />
              </div>
            </div>

            {/* Supporter Badge & Fee Breakdown */}
            <div className={`p-4 rounded-2xl border space-y-2.5 ${
              darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span>{currentTier.icon}</span>
                  <span className="text-slate-400">Unlocked Tier:</span>
                  <span className={`font-bold ${currentTier.color}`}>{currentTier.title}</span>
                </div>
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                  ₦{effectiveAmount.toLocaleString()}
                </span>
              </div>

              {/* Transparent Fee Summary */}
              <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1">
                  <Info size={12} className="text-blue-400" />
                  <span>Creator receives: <strong className="text-emerald-400">₦{creatorPayout.toLocaleString()}</strong></span>
                </div>
                <span>Platform fee: ₦{platformFee.toLocaleString()} (7.5%)</span>
              </div>
            </div>
          </div>

          {/* Supportive Note */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Supportive Note (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a cheer, congrats, or secret note..."
                maxLength={300}
                rows={2}
                className={`w-full px-4 py-2.5 rounded-2xl text-sm transition-all border ${
                  darkMode
                    ? 'bg-slate-950/60 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
            </div>

            {/* Identity Switcher */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Your Name / Alias
                </label>
                <input
                  type="text"
                  disabled={isAnonymous}
                  value={senderAlias}
                  onChange={(e) => setSenderAlias(e.target.value)}
                  placeholder={isAnonymous ? 'Anonymous Supporter' : 'Your name or @handle'}
                  className={`w-full px-3.5 py-2.5 rounded-2xl text-sm transition-all border ${
                    darkMode
                      ? 'bg-slate-950/60 border-slate-800 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  } disabled:opacity-50 focus:outline-none focus:border-blue-500`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Your Email (For Receipt)
                </label>
                <input
                  type="email"
                  value={payerEmail}
                  onChange={(e) => setPayerEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={`w-full px-3.5 py-2.5 rounded-2xl text-sm transition-all border ${
                    darkMode
                      ? 'bg-slate-950/60 border-slate-800 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  } focus:outline-none focus:border-blue-500`}
                />
              </div>
            </div>

            {/* Anonymous Toggle */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-700"
              />
              <span className={`text-xs ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Keep my donation completely anonymous on leaderboards
              </span>
            </label>
          </div>

          {/* Error display */}
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <Shield size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Pay Action */}
          <button
            type="button"
            onClick={handlePay}
            disabled={isLoading || effectiveAmount < 100}
            className="w-full py-3.5 px-6 rounded-2xl font-extrabold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Opening Secure Checkout...</span>
              </>
            ) : (
              <>
                <CreditCard size={18} />
                <span>Send ₦{effectiveAmount.toLocaleString()} Gift</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Security footnote */}
          <div className="mt-4 flex items-center justify-center gap-2 text-center text-slate-400 text-[11px]">
            <Lock size={12} className="text-emerald-400" />
            <span>Secured with 256-bit bank-grade encryption</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
