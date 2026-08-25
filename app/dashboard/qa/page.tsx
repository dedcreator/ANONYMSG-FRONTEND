// app/dashboard/qa/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/app/context/ThemeContext'
import { 
  Plus, Calendar, Users, MessageSquare, Clock, X, Eye, Lock, 
  Share2, Copy, Check, Loader2, Play, Square, Link2
} from 'lucide-react'
import { FaTwitter, FaInstagram, FaYoutube, FaGithub } from 'react-icons/fa'
import { FiLink } from 'react-icons/fi'
import Link from 'next/link'
import { qaAPI } from '@/lib/api'

interface QASession {
  id: string
  title: string
  description: string
  is_active: boolean
  is_live: boolean
  starts_at: string
  ends_at: string | null
  allow_anonymous: boolean
  require_approval: boolean
  host_username: string
  question_count: number
  is_host: boolean
  created_at: string
}

export default function DashboardQAPage() {
  const router = useRouter()
  const { darkMode } = useTheme()
  const [sessions, setSessions] = useState<QASession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming'>('all')
  const [copied, setCopied] = useState<Record<string, boolean>>({})
  const [createdSession, setCreatedSession] = useState<QASession | null>(null)
  const [showShareModal, setShowShareModal] = useState<QASession | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    starts_at: '',
    ends_at: '',
    allow_anonymous: true,
    require_approval: false,
    max_questions: 100
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchSessions()
  }, [filter])

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const live = filter === 'live'
      const response = await qaAPI.getSessions(live)
      
      if (response.ok) {
        const data = await response.json()
        const sessionsData = Array.isArray(data) ? data : (data.results || [])
        setSessions(sessionsData)
      } else {
        setError('Failed to load Q&A sessions')
        setSessions([])
      }
    } catch (err) {
      setError('Network error')
      setSessions([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // FIX: Ensure starts_at is never null - provide a default if empty
      const startsAt = formData.starts_at ? new Date(formData.starts_at).toISOString() : new Date().toISOString()
      const endsAt = formData.ends_at ? new Date(formData.ends_at).toISOString() : null

      const sessionData = {
        title: formData.title,
        description: formData.description || '',
        starts_at: startsAt,  // Now always a string, never null
        ends_at: endsAt,
        allow_anonymous: formData.allow_anonymous,
        require_approval: formData.require_approval,
        max_questions: formData.max_questions || 100
      }

      const response = await qaAPI.createSession(sessionData)
      
      if (response.ok) {
        const data = await response.json()
        setCreatedSession(data)
        setShowCreateModal(false)
        setFormData({
          title: '',
          description: '',
          starts_at: '',
          ends_at: '',
          allow_anonymous: true,
          require_approval: false,
          max_questions: 100
        })
        await fetchSessions()
        setTimeout(() => setCreatedSession(null), 15000)
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to create session')
      }
    } catch (err) {
      alert('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleLive = async (sessionId: string, isLive: boolean) => {
    try {
      const response = await qaAPI.toggleLive(sessionId, !isLive)
      
      if (response.ok) {
        await fetchSessions()
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to toggle live status')
      }
    } catch (err) {
      alert('Network error. Please try again.')
    }
  }

  const copyLink = (sessionId: string) => {
    const url = `${window.location.origin}/qa/${sessionId}`
    navigator.clipboard.writeText(url)
    setCopied(prev => ({ ...prev, [sessionId]: true }))
    setTimeout(() => setCopied(prev => ({ ...prev, [sessionId]: false })), 2000)
  }

  const shareToTwitter = (session: QASession) => {
    const url = `${window.location.origin}/qa/${session.id}`
    const text = `Join my Q&A session: ${session.title}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
  }

  const shareToWhatsApp = (session: QASession) => {
    const url = `${window.location.origin}/qa/${session.id}`
    window.open(`https://wa.me/?text=${encodeURIComponent(`Join my Q&A session: ${session.title} - ${url}`)}`, '_blank')
  }

  const themeClasses = {
    bg: darkMode ? 'bg-black' : 'bg-gray-50',
    card: darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200/50',
    cardHover: darkMode ? 'hover:border-blue-500/30' : 'hover:border-blue-500/50',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textSecondary: darkMode ? 'text-gray-400' : 'text-gray-600',
    input: darkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400',
    modalOverlay: 'bg-black/50 backdrop-blur-sm',
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.bg}`}>
        <Loader2 size={32} className="animate-spin text-blue-500" />
      </div>
    )
  }

  const sessionsList = Array.isArray(sessions) ? sessions : []

  return (
    <div className={`min-h-screen ${themeClasses.bg}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {createdSession && (
          <div className={`mb-6 p-4 rounded-2xl border ${darkMode ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'} animate-in`}>
            <div className="flex items-start gap-3">
              <Check size={20} className="text-green-500 mt-0.5" />
              <div className="flex-1">
                <p className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                  ✅ Q&A Session created successfully!
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/qa/${createdSession.id}`}
                    readOnly
                    className={`flex-1 min-w-[200px] ${themeClasses.input} p-2 rounded-xl text-sm`}
                  />
                  <button
                    onClick={() => copyLink(createdSession.id)}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm transition"
                  >
                    {copied[createdSession.id] ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <button
                    onClick={() => setShowShareModal(createdSession)}
                    className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm transition flex items-center gap-1 font-semibold shadow-md shadow-blue-500/20"
                  >
                    <Share2 size={16} /> Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className={`text-3xl font-extrabold tracking-tight ${themeClasses.text}`}>My Q&A Sessions</h1>
            <p className={themeClasses.textSecondary}>Host live Q&A and get anonymous questions</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition flex items-center gap-2 shadow-lg shadow-blue-500/25 active:scale-95 text-sm"
          >
            <Plus size={18} />
            Host Session
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          {['all', 'live', 'upcoming'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                filter === f
                  ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : darkMode
                  ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {error ? (
          <div className={`p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-center`}>
            {error}
          </div>
        ) : sessionsList.length === 0 ? (
          <div className={`text-center py-16 ${themeClasses.card} rounded-2xl border`}>
            <MessageSquare size={48} className="mx-auto mb-4 text-blue-500/60" />
            <h3 className={`text-lg font-bold ${themeClasses.text} mb-2`}>No Q&A sessions yet</h3>
            <p className={themeClasses.textSecondary}>Host your first Q&A session to get started!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition shadow-lg shadow-blue-500/25 active:scale-95 text-sm"
            >
              Host a Session
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sessionsList.map((session) => (
              <div
                key={session.id}
                className={`${themeClasses.card} rounded-2xl border p-6 transition ${themeClasses.cardHover}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className={`text-lg font-semibold ${themeClasses.text}`}>
                        {session.title}
                      </h3>
                      {session.is_live && (
                        <span className="flex items-center gap-1 text-xs px-2 py-1 bg-red-500 text-white rounded-full animate-pulse">
                          <span className="w-1.5 h-1.5 bg-white rounded-full" />
                          LIVE
                        </span>
                      )}
                      {session.is_host && (
                        <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                          Host
                        </span>
                      )}
                    </div>
                    
                    {session.description && (
                      <p className={`text-sm ${themeClasses.textSecondary} mt-1 line-clamp-2`}>
                        {session.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
                      <span className={themeClasses.textSecondary}>
                        <Users size={14} className="inline mr-1" />
                        {session.question_count} questions
                      </span>
                      <span className={themeClasses.textSecondary}>
                        <Calendar size={14} className="inline mr-1" />
                        {new Date(session.starts_at).toLocaleString()}
                      </span>
                      {session.allow_anonymous && (
                        <span className="text-green-500 flex items-center gap-1">
                          <Lock size={12} /> Anonymous
                        </span>
                      )}
                    </div>

                    {session.is_host && (
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <button
                          onClick={() => copyLink(session.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1 ${
                            darkMode 
                              ? 'bg-white/5 hover:bg-white/10 text-gray-300' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {copied[session.id] ? (
                            <>
                              <Check size={14} />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              Copy Link
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setShowShareModal(session)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1 ${
                            darkMode 
                              ? 'bg-white/5 hover:bg-white/10 text-gray-300' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          <Share2 size={14} /> Share
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    {session.is_host && (
                      <button
                        onClick={() => toggleLive(session.id, session.is_live)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1 ${
                          session.is_live
                            ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                            : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                        }`}
                      >
                        {session.is_live ? (
                          <><Square size={12} /> End</>
                        ) : (
                          <><Play size={12} /> Go Live</>
                        )}
                      </button>
                    )}
                    <Link
                      href={`/qa/${session.id}`}
                      className={`px-4 py-1.5 rounded-xl text-xs font-medium transition text-center ${
                        darkMode
                          ? 'bg-blue-500 hover:bg-blue-600 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {session.is_live ? 'Join' : 'View'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className={`absolute inset-0 ${themeClasses.modalOverlay}`} onClick={() => setShowShareModal(null)} />
          <div className={`relative w-full max-w-md ${themeClasses.card} rounded-2xl border p-6 shadow-2xl animate-scale`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${themeClasses.text}`}>Share Q&A Session</h2>
              <button
                onClick={() => setShowShareModal(null)}
                className={`p-1 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                <X size={20} className={themeClasses.textSecondary} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className={`text-sm ${themeClasses.textSecondary} mb-2`}>Share this session with your audience</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/qa/${showShareModal.id}`}
                    readOnly
                    className={`flex-1 ${themeClasses.input} p-2 rounded-xl text-sm`}
                  />
                  <button
                    onClick={() => copyLink(showShareModal.id)}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center pt-4 border-t border-gray-200/50 dark:border-white/10">
                <button
                  onClick={() => shareToTwitter(showShareModal)}
                  className="p-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-xl transition flex items-center gap-2"
                >
                  <FaTwitter size={18} /> Twitter
                </button>
                <button
                  onClick={() => shareToWhatsApp(showShareModal)}
                  className="p-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl transition flex items-center gap-2"
                >
                  <MessageSquare size={18} /> WhatsApp
                </button>
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/qa/${showShareModal.id}`
                    navigator.clipboard.writeText(url)
                    copyLink(showShareModal.id)
                  }}
                  className={`p-3 rounded-xl transition flex items-center gap-2 ${
                    darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Link2 size={18} /> Copy Link
                </button>
              </div>

              <div className="text-center pt-4 border-t border-gray-200/50 dark:border-white/10">
                <p className={`text-xs ${themeClasses.textSecondary}`}>
                  Anyone with the link can join and ask questions anonymously
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className={`absolute inset-0 ${themeClasses.modalOverlay}`} onClick={() => setShowCreateModal(false)} />
          <div className={`relative w-full max-w-lg ${themeClasses.card} rounded-2xl border p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-scale`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${themeClasses.text}`}>Host Q&A Session</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className={`p-1 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                <X size={20} className={themeClasses.textSecondary} />
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-1`}>
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full ${themeClasses.input} p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition`}
                  placeholder="e.g., Developer Q&A - Frontend Edition"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-1`}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={`w-full ${themeClasses.input} p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition resize-none`}
                  rows={3}
                  placeholder="What's this Q&A about?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-1`}>
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.starts_at}
                    onChange={(e) => setFormData(prev => ({ ...prev, starts_at: e.target.value }))}
                    className={`w-full ${themeClasses.input} p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-1`}>
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.ends_at}
                    onChange={(e) => setFormData(prev => ({ ...prev, ends_at: e.target.value }))}
                    className={`w-full ${themeClasses.input} p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="allow_anonymous"
                    checked={formData.allow_anonymous}
                    onChange={(e) => setFormData(prev => ({ ...prev, allow_anonymous: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="allow_anonymous" className={`text-sm ${themeClasses.textSecondary}`}>
                    Allow anonymous questions
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="require_approval"
                    checked={formData.require_approval}
                    onChange={(e) => setFormData(prev => ({ ...prev, require_approval: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="require_approval" className={`text-sm ${themeClasses.textSecondary}`}>
                    Require approval before questions appear
                  </label>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-1`}>
                  Max Questions
                </label>
                <input
                  type="number"
                  value={formData.max_questions}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_questions: parseInt(e.target.value) || 100 }))}
                  className={`w-full ${themeClasses.input} p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition`}
                  min="10"
                  max="500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className={`flex-1 px-4 py-2 rounded-xl transition ${
                    darkMode ? 'bg-white/10 hover:bg-white/20 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.title || !formData.starts_at}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 active:scale-95 text-sm"
                >
                  {isSubmitting ? 'Creating...' : 'Create Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}