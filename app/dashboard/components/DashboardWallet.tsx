// app/dashboard/components/DashboardWallet.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Gift,
  CheckCircle, AlertCircle, Building, CreditCard, Loader2,
  DollarSign, Sparkles, RefreshCw, Lock, ShieldCheck, ChevronRight,
  TrendingUp, Clock
} from 'lucide-react'
import { paymentsAPI } from '@/lib/api'
import { Wallet, PaymentTransaction, Gift as GiftType, Bank } from '@/types'

interface DashboardWalletProps {
  darkMode?: boolean
}

export function DashboardWallet({ darkMode = true }: DashboardWalletProps) {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [gifts, setGifts] = useState<GiftType[]>([])
  const [banks, setBanks] = useState<Bank[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Bank Form State
  const [selectedBankCode, setSelectedBankCode] = useState('')
  const [selectedBankName, setSelectedBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [resolvingAccount, setResolvingAccount] = useState(false)
  const [savingSettings, setSavingSettings] = useState(false)
  const [bankSuccessMsg, setBankSuccessMsg] = useState('')
  const [bankErrorMsg, setBankErrorMsg] = useState('')

  // Withdrawal State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawing, setWithdrawing] = useState(false)
  const [withdrawError, setWithdrawError] = useState('')
  const [withdrawSuccess, setWithdrawSuccess] = useState('')

  // Gifting Preferences
  const [allowGifting, setAllowGifting] = useState(true)
  const [minGiftAmount, setMinGiftAmount] = useState(500)

  const loadWalletData = async () => {
    try {
      const [walletRes, txRes, giftsRes, banksRes] = await Promise.all([
        paymentsAPI.getWallet(),
        paymentsAPI.getTransactions(),
        paymentsAPI.getGifts(),
        paymentsAPI.getBanks('NG'),
      ])

      if (walletRes.ok) {
        const wData: Wallet = await walletRes.json()
        setWallet(wData)
        setSelectedBankCode(wData.bank_code || '')
        setSelectedBankName(wData.bank_name || '')
        setAccountNumber(wData.account_number || '')
        setAccountName(wData.account_name || '')
        setAllowGifting(wData.allow_gifting ?? true)
        setMinGiftAmount(Number(wData.minimum_gift_amount) || 500)
      }

      if (txRes.ok) {
        const tData = await txRes.json()
        setTransactions(Array.isArray(tData) ? tData : (tData.results || []))
      }

      if (giftsRes.ok) {
        const gData = await giftsRes.json()
        setGifts(Array.isArray(gData) ? gData : (gData.results || []))
      }

      if (banksRes.ok) {
        const bData = await banksRes.json()
        setBanks(bData.banks || [])
      }
    } catch (err) {
      console.error('Failed to load wallet data:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadWalletData()
  }, [])

  // Resolve Bank Account Name
  const handleResolveAccount = async () => {
    if (!accountNumber || accountNumber.length < 10 || !selectedBankCode) {
      setBankErrorMsg('Please enter a valid 10-digit account number and select a bank')
      return
    }

    setResolvingAccount(true)
    setBankErrorMsg('')
    setBankSuccessMsg('')

    try {
      const res = await paymentsAPI.resolveAccount({
        account_number: accountNumber,
        bank_code: selectedBankCode,
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setAccountName(data.account_name)
        setBankSuccessMsg(`Verified: ${data.account_name}`)
      } else {
        setBankErrorMsg(data.error || 'Could not verify account name. Please check bank and number.')
      }
    } catch (err: any) {
      setBankErrorMsg(err.message || 'Account resolution failed')
    } finally {
      setResolvingAccount(false)
    }
  }

  // Save Payout Details & Gifting Settings
  const handleSavePayoutSettings = async () => {
    if (!selectedBankName || !accountNumber || !accountName) {
      setBankErrorMsg('Please complete bank details and verify account name')
      return
    }

    setSavingSettings(true)
    setBankErrorMsg('')
    setBankSuccessMsg('')

    try {
      const res = await paymentsAPI.updateWallet({
        bank_name: selectedBankName,
        bank_code: selectedBankCode,
        account_number: accountNumber,
        account_name: accountName,
        allow_gifting: allowGifting,
        minimum_gift_amount: minGiftAmount,
      })

      if (res.ok) {
        const updated = await res.json()
        setWallet(updated)
        setBankSuccessMsg('Payout details saved successfully!')
      } else {
        setBankErrorMsg('Failed to save payout settings')
      }
    } catch (err: any) {
      setBankErrorMsg(err.message || 'Error saving settings')
    } finally {
      setSavingSettings(false)
    }
  }

  // Request Instant Withdrawal
  const handleRequestWithdrawal = async () => {
    const amt = parseFloat(withdrawAmount)
    if (isNaN(amt) || amt < 1000) {
      setWithdrawError('Minimum withdrawal amount is ₦1,000')
      return
    }

    if (!wallet || amt > parseFloat(String(wallet.balance))) {
      setWithdrawError('Insufficient available balance')
      return
    }

    if (!wallet.account_number || !wallet.account_name) {
      setWithdrawError('Please configure and save your payout bank account first')
      return
    }

    setWithdrawing(true)
    setWithdrawError('')
    setWithdrawSuccess('')

    try {
      const res = await paymentsAPI.requestPayout({
        amount: amt,
        bank_name: wallet.bank_name,
        bank_code: wallet.bank_code,
        account_number: wallet.account_number,
        account_name: wallet.account_name,
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setWithdrawSuccess('Withdrawal initiated! Funds will arrive in your bank account.')
        setWithdrawAmount('')
        loadWalletData()
        setTimeout(() => {
          setShowWithdrawModal(false)
          setWithdrawSuccess('')
        }, 2000)
      } else {
        setWithdrawError(data.error || 'Withdrawal request failed')
      }
    } catch (err: any) {
      setWithdrawError(err.message || 'Network error during withdrawal')
    } finally {
      setWithdrawing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    )
  }

  const numBalance = wallet ? parseFloat(String(wallet.balance)) : 0
  const numEarned = wallet ? parseFloat(String(wallet.total_earned)) : 0
  const numWithdrawn = wallet ? parseFloat(String(wallet.total_withdrawn)) : 0

  return (
    <div className="space-y-8 animate-in">
      {/* Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Creator Wallet</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
              Verified
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your tips, gifts, payouts, and bank settlement account
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setRefreshing(true)
            loadWalletData()
          }}
          disabled={refreshing}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition shadow-sm ${
            darkMode 
              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800' 
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin text-blue-500' : 'text-blue-500'} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Primary Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Available Balance Card */}
        <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white shadow-xl shadow-blue-500/20 border border-blue-400/30">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
              Available for Payout
            </span>
            <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20">
              <WalletIcon size={18} className="text-white" />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold tracking-tight">
                ₦{numBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <p className="text-xs text-blue-100/80 mt-1 font-medium">Instant withdrawal to Nigerian bank</p>
          </div>

          <button
            type="button"
            onClick={() => setShowWithdrawModal(true)}
            disabled={numBalance < 1000}
            className="w-full py-3 px-4 rounded-2xl bg-white text-blue-900 font-bold text-sm hover:bg-blue-50 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowUpRight size={16} />
            <span>Withdraw Earnings</span>
          </button>
        </div>

        {/* Lifetime Earnings */}
        <div className={`rounded-3xl p-6 border transition ${
          darkMode ? 'bg-slate-900/60 border-slate-800 backdrop-blur-xl' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Total Revenue Earned
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp size={18} />
            </div>
          </div>

          <div className="mb-2">
            <span className="text-2xl font-bold">
              ₦{numEarned.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            From {gifts.length} gifts & Q&A session ticket sales
          </p>
        </div>

        {/* Total Withdrawn */}
        <div className={`rounded-3xl p-6 border transition ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Total Withdrawn
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <ArrowDownLeft size={18} />
            </div>
          </div>

          <div className="mb-2">
            <span className="text-2xl font-bold">
              ₦{numWithdrawn.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Paid out securely to your bank account
          </p>
        </div>
      </div>

      {/* Grid: Bank Payout Setup + Received Gifts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Bank Account Settings */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`rounded-3xl p-6 sm:p-7 border ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200/50 dark:border-white/10">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Building size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base">Payout Bank Account</h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Where your creator earnings and tips are deposited
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Bank Select */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  Select Your Bank
                </label>
                <select
                  value={selectedBankCode}
                  onChange={(e) => {
                    const code = e.target.value
                    setSelectedBankCode(code)
                    const found = banks.find(b => b.code === code)
                    if (found) setSelectedBankName(found.name)
                  }}
                  className={`w-full px-4 py-3 rounded-2xl text-sm border transition ${
                    darkMode
                      ? 'bg-neutral-900 border-white/10 text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-900'
                  } focus:outline-none focus:border-blue-500`}
                >
                  <option value="">-- Choose your Bank --</option>
                  {banks.map((bank) => (
                    <option key={bank.id} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Account Number & Verify */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  10-Digit Account Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={10}
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 0123456789"
                    className={`flex-1 px-4 py-3 rounded-2xl text-sm border font-mono transition ${
                      darkMode
                        ? 'bg-neutral-900 border-white/10 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    } focus:outline-none focus:border-blue-500`}
                  />
                  <button
                    type="button"
                    onClick={handleResolveAccount}
                    disabled={resolvingAccount || accountNumber.length < 10 || !selectedBankCode}
                    className="px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {resolvingAccount ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                    <span>Verify</span>
                  </button>
                </div>
              </div>

              {/* Account Holder Name (Resolved) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={accountName}
                  placeholder="Verified name will appear here automatically"
                  className={`w-full px-4 py-3 rounded-2xl text-sm border font-semibold ${
                    accountName
                      ? darkMode ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : darkMode ? 'bg-neutral-900/50 border-white/10 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500'
                  }`}
                />
              </div>

              {/* Status messages */}
              {bankSuccessMsg && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle size={14} />
                  <span>{bankSuccessMsg}</span>
                </div>
              )}

              {bankErrorMsg && (
                <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{bankErrorMsg}</span>
                </div>
              )}

              {/* Save Button */}
              <button
                type="button"
                onClick={handleSavePayoutSettings}
                disabled={savingSettings || !accountName}
                className="w-full py-3 px-5 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingSettings ? <Loader2 size={16} className="animate-spin" /> : null}
                <span>Save Bank Account</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Gifts Feed */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`rounded-3xl p-6 sm:p-7 border ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200/50 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <Gift size={18} className="text-pink-400" />
                <h3 className="font-bold text-base">Recent Fan Gifts</h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 font-semibold">
                {gifts.length} received
              </span>
            </div>

            {gifts.length === 0 ? (
              <div className="text-center py-10">
                <Gift size={32} className="mx-auto text-gray-500 mb-2 opacity-50" />
                <p className="font-semibold text-sm">No gifts received yet</p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Share your profile link to receive tips from fans
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {gifts.map((gift) => (
                  <div
                    key={gift.id}
                    className={`p-3.5 rounded-2xl border transition flex items-start justify-between gap-3 ${
                      darkMode ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs">
                          {gift.is_anonymous ? 'Anonymous Fan' : gift.sender_alias || 'Generous Fan'}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-medium">
                          {gift.badge}
                        </span>
                      </div>
                      {gift.message && (
                        <p className={`text-xs mt-1 italic ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          &ldquo;{gift.message}&rdquo;
                        </p>
                      )}
                      <p className={`text-[10px] mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {new Date(gift.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-sm text-emerald-400">
                        +₦{parseFloat(String(gift.amount)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className={`rounded-3xl p-6 sm:p-7 border ${
        darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-base">Transaction & Payout History</h3>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {transactions.length} transactions
          </span>
        </div>

        {transactions.length === 0 ? (
          <p className={`text-sm text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No transactions found
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b ${darkMode ? 'border-white/10 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Reference</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 dark:divide-white/5">
                {transactions.map((tx) => {
                  const isPayout = tx.transaction_type === 'payout'
                  return (
                    <tr key={tx.id} className="hover:bg-white/5 transition">
                      <td className="py-3 font-medium capitalize">
                        {tx.transaction_type.replace(/_/g, ' ')}
                      </td>
                      <td className="py-3 font-mono text-[11px] text-gray-400">
                        {tx.tx_ref}
                      </td>
                      <td className="py-3 font-mono font-bold">
                        <span className={isPayout ? 'text-blue-400' : 'text-emerald-400'}>
                          {isPayout ? '-' : '+'}₦{parseFloat(String(tx.amount)).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          tx.status === 'successful'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : tx.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowWithdrawModal(false)} />
          
          <div className={`relative w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl z-10 border ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="font-extrabold text-xl mb-1">Withdraw Creator Earnings</h3>
            <p className={`text-xs mb-5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Available Balance: <strong className="text-blue-400">₦{numBalance.toLocaleString()}</strong>
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Amount to Withdraw (₦)
                </label>
                <input
                  type="number"
                  placeholder="Min ₦1,000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className={`w-full px-4 py-3 rounded-2xl text-base font-bold font-mono border ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  } focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`}
                />
              </div>

              {/* Destination Bank Summary */}
              <div className={`p-4 rounded-2xl border text-xs space-y-1 ${
                darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <p className="text-slate-400">Destination Account:</p>
                <p className="font-bold text-slate-900 dark:text-white">{wallet?.account_name || 'No bank saved'}</p>
                <p className="text-slate-400">{wallet?.bank_name} • {wallet?.account_number}</p>
              </div>

              {withdrawSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                  {withdrawSuccess}
                </div>
              )}

              {withdrawError && (
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  {withdrawError}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className={`flex-1 py-3 rounded-2xl font-semibold text-xs border transition ${
                  darkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestWithdrawal}
                disabled={withdrawing}
                className="flex-1 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50"
              >
                {withdrawing ? <Loader2 size={14} className="animate-spin" /> : null}
                <span>Confirm Payout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
