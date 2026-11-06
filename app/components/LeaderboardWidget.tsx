// app/components/LeaderboardWidget.tsx
'use client'

import { useState, useEffect } from 'react'
import { Trophy, Gift, Sparkles, Crown, Loader2 } from 'lucide-react'
import { paymentsAPI } from '@/lib/api'

interface LeaderboardItem {
  id: string
  sender: string
  amount: number
  currency: string
  badge: string
  message?: string
  created_at: string
}

interface LeaderboardWidgetProps {
  username: string
  onOpenGiftModal: () => void
  darkMode?: boolean
}

export function LeaderboardWidget({
  username,
  onOpenGiftModal,
  darkMode = true
}: LeaderboardWidgetProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([])
  const [totalSupporters, setTotalSupporters] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await paymentsAPI.getLeaderboard(username)
        if (res.ok) {
          const data = await res.json()
          setLeaderboard(data.leaderboard || [])
          setTotalSupporters(data.total_supporters || 0)
        }
      } catch (err) {
        console.error('Failed to load leaderboard:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [username])

  const getRankMedal = (index: number) => {
    if (index === 0) return { icon: '🥇', label: 'Top Supporter', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' }
    if (index === 1) return { icon: '🥈', label: 'Rank 2', color: 'text-slate-300 bg-slate-400/10 border-slate-400/30' }
    if (index === 2) return { icon: '🥉', label: 'Rank 3', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' }
    return { icon: `#${index + 1}`, label: `Rank ${index + 1}`, color: 'text-slate-400 bg-slate-800/40 border-slate-700/40' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-blue-500" size={24} />
      </div>
    )
  }

  return (
    <div className={`rounded-3xl p-6 transition-all border ${
      darkMode
        ? 'bg-slate-900/60 border-slate-800 backdrop-blur-xl shadow-xl'
        : 'bg-white border-slate-200 shadow-md'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-sm">
            <Trophy size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Top Supporters</h3>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {totalSupporters} {totalSupporters === 1 ? 'supporter' : 'supporters'} showed love
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenGiftModal}
          className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
        >
          <Gift size={14} />
          <span>Send Tip</span>
        </button>
      </div>

      {/* Leaderboard List */}
      {leaderboard.length === 0 ? (
        <div className="text-center py-8 px-4">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <Sparkles size={24} />
          </div>
          <h4 className="font-bold text-sm mb-1 text-slate-900 dark:text-white">No supporters yet!</h4>
          <p className={`text-xs mb-4 max-w-xs mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Be the first to gift @{username} and claim the #1 spot on the wall of champions!
          </p>
          <button
            type="button"
            onClick={onOpenGiftModal}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm active:scale-95"
          >
            Send First Gift 🎁
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((item, index) => {
            const medal = getRankMedal(index)
            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 border transition-all ${
                  index === 0
                    ? darkMode
                      ? 'bg-amber-950/20 border-amber-500/30'
                      : 'bg-amber-50/70 border-amber-200'
                    : darkMode
                    ? 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                    : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                }`}
              >
                {/* Left rank & name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 border ${medal.color}`}>
                    {medal.icon}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-sm truncate text-slate-900 dark:text-white">{item.sender}</p>
                      {index === 0 && <Crown size={12} className="text-yellow-400 shrink-0" />}
                    </div>
                    <p className={`text-[11px] truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {item.badge}
                    </p>
                  </div>
                </div>

                {/* Right amount */}
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-sm text-blue-500 dark:text-blue-400">
                    ₦{item.amount.toLocaleString()}
                  </span>
                  {item.message && (
                    <p className={`text-[10px] max-w-[120px] sm:max-w-[200px] truncate italic ${
                      darkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      &ldquo;{item.message}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
