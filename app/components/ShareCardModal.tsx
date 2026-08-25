// app/components/ShareCardModal.tsx
'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Download, Copy, Share2, Sparkles, Check, 
  MessageSquare, Heart, Lock, Shield, Eye
} from 'lucide-react'
import { toPng } from 'html-to-image'

interface ShareCardModalProps {
  isOpen: boolean
  onClose: () => void
  username: string
  avatar?: string | null
  messageContent: string
  messageType?: 'text' | 'voice' | 'image' | 'gif'
  mediaUrl?: string | null
  creatorReply?: string | null
  giftAmount?: number | string | null
  darkMode?: boolean
}

const GRADIENT_THEMES = [
  { id: 'cosmic', name: 'Cosmic Purple', bg: 'bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-950 border-purple-500/30' },
  { id: 'cyber', name: 'Cyber Neon', bg: 'bg-gradient-to-br from-slate-950 via-cyan-950 to-neutral-950 border-cyan-500/30' },
  { id: 'sunset', name: 'Sunset Glow', bg: 'bg-gradient-to-br from-orange-950 via-pink-900 to-purple-950 border-pink-500/30' },
  { id: 'emerald', name: 'Emerald Velvet', bg: 'bg-gradient-to-br from-teal-950 via-emerald-950 to-slate-950 border-emerald-500/30' },
  { id: 'gold', name: 'Golden VIP', bg: 'bg-gradient-to-br from-amber-950 via-yellow-950 to-neutral-950 border-amber-500/30' },
  { id: 'midnight', name: 'Midnight Minimal', bg: 'bg-neutral-950 border-neutral-800' },
]

export function ShareCardModal({
  isOpen,
  onClose,
  username,
  avatar = null,
  messageContent,
  messageType = 'text',
  mediaUrl = null,
  creatorReply = null,
  giftAmount = null,
  darkMode = true
}: ShareCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [selectedTheme, setSelectedTheme] = useState(GRADIENT_THEMES[0])
  const [isExporting, setIsExporting] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleDownload = async () => {
    if (!cardRef.current) return
    setIsExporting(true)

    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.98,
        pixelRatio: 2.5,
        cacheBust: true,
      })

      const link = document.createElement('a')
      link.download = `anonmsg_${username}_${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Failed to export image:', err)
    } finally {
      setIsExporting(false)
    }
  }

  const handleCopyLink = () => {
    const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/${username}` : ''
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const numericGift = giftAmount ? parseFloat(String(giftAmount)) : 0

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden z-10 my-6 ${
            darkMode
              ? 'bg-neutral-900/95 border border-white/10 text-white'
              : 'bg-white border border-gray-200 text-gray-900'
          }`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-5 right-5 p-2 rounded-full transition ${
              darkMode ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
            }`}
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="mb-5">
            <h3 className="font-bold text-xl flex items-center gap-2">
              <span>Share to Instagram / Snapchat Story</span>
              <Sparkles size={18} className="text-yellow-400" />
            </h3>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Customize your aesthetic gradient story card and download as PNG
            </p>
          </div>

          {/* Theme Selector */}
          <div className="mb-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Select Gradient Theme
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {GRADIENT_THEMES.map((theme) => {
                const isActive = selectedTheme.id === theme.id
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedTheme(theme)}
                    className={`p-2 rounded-xl text-[11px] font-medium transition-all text-center border relative ${
                      theme.bg
                    } ${
                      isActive
                        ? 'ring-2 ring-blue-400 scale-105 shadow-md shadow-blue-500/20'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span className="text-white drop-shadow-sm truncate block">{theme.name.split(' ')[0]}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Story Card Canvas Preview (High Definition Exportable Box) */}
          <div className="flex justify-center mb-6">
            <div
              ref={cardRef}
              className={`w-full max-w-[360px] rounded-3xl p-6 shadow-2xl relative overflow-hidden border ${selectedTheme.bg}`}
              style={{ minHeight: '440px' }}
            >
              {/* Watermark Branding Header */}
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={username}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow">
                      {username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-bold text-sm">@{username}</p>
                    <p className="text-white/60 text-[10px]">anonmsg.me/{username}</p>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-[10px] font-semibold flex items-center gap-1 border border-white/15">
                  <Lock size={10} className="text-emerald-400" />
                  <span>AnonMsg</span>
                </div>
              </div>

              {/* Gift Badge If Attached */}
              {numericGift > 0 && (
                <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold shadow-lg shadow-amber-500/10">
                  <Sparkles size={12} className="text-yellow-400" />
                  <span>Super Message Tip: ₦{numericGift.toLocaleString()}</span>
                </div>
              )}

              {/* Anonymous Question / Message Bubble */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-4.5 mb-4 text-white shadow-xl">
                <div className="flex items-center gap-1.5 text-white/60 text-[11px] font-medium mb-1.5">
                  <MessageSquare size={12} />
                  <span>Anonymous asked:</span>
                </div>

                <p className="text-white font-medium text-base leading-relaxed break-words">
                  &ldquo;{messageContent || (messageType === 'voice' ? '🎙️ Sent a voice message' : '📸 Sent an image')}&rdquo;
                </p>

                {mediaUrl && messageType === 'image' && (
                  <div className="mt-3 rounded-xl overflow-hidden max-h-48 border border-white/10">
                    <img src={mediaUrl} alt="Attached" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Creator Reply Bubble (If present) */}
              {creatorReply && (
                <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-4 text-white shadow-xl">
                  <div className="flex items-center gap-1.5 text-blue-300 text-[11px] font-semibold mb-1">
                    <Heart size={12} className="text-pink-400 fill-pink-400" />
                    <span>@{username} replied:</span>
                  </div>
                  <p className="text-white text-sm font-normal leading-relaxed break-words">
                    {creatorReply}
                  </p>
                </div>
              )}

              {/* Card Footer Call to Action */}
              <div className="mt-8 pt-4 border-t border-white/10 text-center">
                <p className="text-white/80 font-bold text-xs">Send me a secret message & gift 👇</p>
                <p className="text-white/50 text-[10px] mt-0.5 font-mono">anonmsg.me/{username}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isExporting}
              className="py-3 px-5 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Download size={18} />
              <span>{isExporting ? 'Generating PNG...' : 'Download Story Image'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className={`py-3 px-5 rounded-2xl font-medium border transition-all flex items-center justify-center gap-2 ${
                darkMode
                  ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                  : 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-gray-900'
              }`}
            >
              {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
              <span>{copied ? 'Link Copied!' : 'Copy Profile Link'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
