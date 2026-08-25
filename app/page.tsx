// app/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/app/context/ThemeContext'
import {Navbar} from '@/components/Navbar'

// Icons
import { 
  Shield, Zap, Heart, Users, User, Lock, MessageSquare, 
  ArrowRight, Check, Star, Globe, Sparkles, 
  TrendingUp, Smile, Award, Clock, Mic, Image,
  Palette, BarChart3, Send, Share2, Crown,
  Rocket, Gem, Infinity, Target, Coffee, Play,
  ChevronRight, Quote, MoveRight
} from 'lucide-react'

// Button Component with theme support
const Button = ({ children, variant = 'primary', size = 'md', className = '', onClick, href, fullWidth, darkMode = false, ...props }: any) => {
  const baseStyles = "font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 rounded-xl"
  
  const variants: any = {
    primary: "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25",
    secondary: darkMode 
      ? "bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 backdrop-blur-sm"
      : "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200",
    outline: "border-2 border-blue-500 text-blue-500 hover:bg-blue-500/10",
  }
  
  const sizes: any = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }
  
  const Component = href ? Link : 'button'
  
  return (
    <Component
      href={href || '#'}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  )
}

// Footer Component with theme support
const Footer = ({ darkMode }: { darkMode: boolean }) => (
  <footer className={`border-t py-16 px-4 transition-colors duration-300 ${darkMode ? 'border-slate-850 bg-[#0B0F19]' : 'border-slate-200/80 bg-white/50 backdrop-blur-sm'}`}>
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-slate-900'}`}>Anon<span className="text-blue-500">Q</span></span>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Speak freely. Stay anonymous.</p>
        </div>
        <div>
          <h4 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Product</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/features" className={`${darkMode ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition`}>Features</Link></li>
            <li><Link href="/pricing" className={`${darkMode ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition`}>Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className={`${darkMode ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition`}>About</Link></li>
            <li><Link href="/contact" className={`${darkMode ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition`}>Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/privacy" className={`${darkMode ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition`}>Privacy</Link></li>
            <li><Link href="/terms" className={`${darkMode ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition`}>Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className={`text-center text-sm pt-8 border-t ${darkMode ? 'text-gray-600 border-white/5' : 'text-gray-400 border-gray-200/50'}`}>
        © 2024 AnonQ. All rights reserved.
      </div>
    </div>
  </footer>
)

export default function HomePage() {
  const { darkMode } = useTheme()
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [activeTab, setActiveTab] = useState<'messages' | 'voice' | 'qa' | 'tips'>('messages')
  const [demoInput, setDemoInput] = useState('')
  const [demoSent, setDemoSent] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end start"] })
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  useEffect(() => {
    const interval = setInterval(() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length), 6000)
    return () => clearInterval(interval)
  }, [])

  const handleDemoSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (demoInput.trim()) {
      setDemoSent(true)
      setTimeout(() => {
        setDemoSent(false)
        setDemoInput('')
      }, 3000)
    }
  }

  const features = [
    { 
      icon: Shield, 
      title: 'Zero-Knowledge Privacy', 
      desc: 'No IP tracking, no device fingerprinting, and zero logs. Senders remain 100% truly anonymous.', 
      badge: 'Military Grade', 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10 border-blue-500/20' 
    },
    { 
      icon: Mic, 
      title: 'Anonymous Voice Notes', 
      desc: 'Send pitch-modulated audio recordings with real-time waveform playback and voice protection.', 
      badge: 'Exclusive', 
      color: 'text-cyan-500', 
      bg: 'bg-cyan-500/10 border-cyan-500/20' 
    },
    { 
      icon: Crown, 
      title: 'Creator Tips & Monetization', 
      desc: 'Receive paid questions and direct cash tips with instant Nigerian bank payouts.', 
      badge: 'Monetize', 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10 border-amber-500/20' 
    },
    { 
      icon: Target, 
      title: 'Live Q&A Arenas', 
      desc: 'Host real-time ask-me-anything sessions with pinned topics, upvotes, and audience engagement.', 
      badge: 'Interactive', 
      color: 'text-indigo-500', 
      bg: 'bg-indigo-500/10 border-indigo-500/20' 
    },
    { 
      icon: Sparkles, 
      title: 'AI Toxicity Shield', 
      desc: 'Intelligent multi-layer filtering automatically screens out harassment, bullying, and toxic spam.', 
      badge: 'AI Powered', 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10 border-emerald-500/20' 
    },
    { 
      icon: BarChart3, 
      title: 'Viral Social Cards', 
      desc: 'Generate custom branded graphics with one click to share responses directly to Instagram Stories & TikTok.', 
      badge: 'Viral Growth', 
      color: 'text-blue-400', 
      bg: 'bg-blue-400/10 border-blue-400/20' 
    },
  ]

  const statsData = [
    { value: '500K+', label: 'Active Creators', trend: '+34% MoM', icon: Users },
    { value: '12M+', label: 'Messages Delivered', trend: 'Instant', icon: MessageSquare },
    { value: '₦45M+', label: 'Creator Payouts', trend: 'Verified', icon: Gem },
    { value: '99.99%', label: 'Anonymity Index', trend: 'Zero Leak', icon: Shield },
  ]

  const testimonials = [
    { 
      text: "AnonQ turned my Instagram audience into an active community. The anonymous voice notes are hilarious, and I've earned over ₦300k in tips this month alone!", 
      author: "@chidi_vlogs", 
      role: "Lifestyle Creator (180k followers)", 
      avatarColor: "from-blue-600 to-indigo-600" 
    },
    { 
      text: "The cleanest anonymous platform by far. AI moderation actually works, eliminating hate speech while letting genuine, honest questions through.", 
      author: "@amaka_tech", 
      role: "Software Engineer & Educator", 
      avatarColor: "from-blue-500 to-cyan-500" 
    },
    { 
      text: "Hosting live Q&A sessions on AnonQ gives our podcast unfiltered questions we would never get on regular social media. Instant game changer.", 
      author: "@lagosunfiltered", 
      role: "Podcast Host", 
      avatarColor: "from-indigo-600 to-blue-700" 
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) { 
      setIsSubmitted(true)
      setTimeout(() => setIsSubmitted(false), 4000)
      setEmail('') 
    }
  }

  const themeClasses = {
    bg: darkMode ? 'bg-[#0B0F19]' : 'bg-slate-50',
    text: darkMode ? 'text-white' : 'text-slate-900',
    textSec: darkMode ? 'text-slate-400' : 'text-slate-600',
    textMuted: darkMode ? 'text-slate-500' : 'text-slate-400',
    card: darkMode ? 'bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl' : 'bg-white border border-slate-200/80 shadow-sm',
    cardHover: darkMode ? 'hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10' : 'hover:border-blue-500/40 hover:shadow-xl',
    sectionBg: darkMode ? 'bg-slate-900/30' : 'bg-slate-100/50',
    input: darkMode ? 'bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20' : 'bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20',
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses.bg} selection:bg-blue-500 selection:text-white relative overflow-x-hidden`}>
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full blur-3xl opacity-30 ${darkMode ? 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500' : 'bg-gradient-to-tr from-blue-400 via-indigo-300 to-cyan-300 opacity-20'}`} />
        <div className={`absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 ${darkMode ? 'bg-blue-600' : 'bg-blue-400'}`} />
        <div className={`absolute bottom-20 -left-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 ${darkMode ? 'bg-indigo-600' : 'bg-indigo-300'}`} />
      </div>
      
      {/* Hero Section */}
      <section ref={targetRef} className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div style={{ opacity }} className="text-center max-w-4xl mx-auto">
          {/* Announcement Pill */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400 text-xs sm:text-sm font-semibold shadow-sm backdrop-blur-md"
          >
            <Sparkles size={15} className="animate-spin text-blue-500" style={{ animationDuration: '6s' }} />
            <span>AnonQ 2.0 is Live • Voice Notes, Tips & Live Q&A</span>
            <ChevronRight size={14} />
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6 ${themeClasses.text}`}
          >
            The Most Honest Place on the Internet{' '}
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Without the Noise.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-lg sm:text-xl ${themeClasses.textSec} mb-10 max-w-2xl mx-auto leading-relaxed`}
          >
            Receive unfiltered confessions, voice notes, live questions, and monetized creator tips with 100% zero-knowledge anonymity.
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link href="/register" className="w-full sm:w-auto">
              <Button darkMode={darkMode} size="lg" className="w-full sm:w-auto text-base font-bold shadow-xl shadow-blue-500/25">
                Claim Your Free Link <MoveRight size={18} />
              </Button>
            </Link>
            <Link href="/features" className="w-full sm:w-auto">
              <Button variant="secondary" darkMode={darkMode} size="lg" className="w-full sm:w-auto text-base font-semibold">
                <Play size={16} className="text-blue-500 fill-blue-500" /> Explore Features
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* VISUAL GRAPHIC: Interactive 3D Live App Preview Dock */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative max-w-5xl mx-auto mt-6"
        >
          {/* Glowing Aura Ring */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-3xl blur-2xl opacity-20 transform -rotate-1 scale-105 pointer-events-none" />

          {/* Mockup Glass Frame */}
          <div className={`relative rounded-3xl border ${themeClasses.card} shadow-2xl overflow-hidden p-4 sm:p-8 backdrop-blur-2xl`}>
            {/* Top Mockup App Header */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-200/50 dark:border-slate-800/80 mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-500/30">
                  A
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">@alex_creator</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      ✓ Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">anonq.me/alex_creator • 42.8k secret questions answered</p>
                </div>
              </div>

              {/* Mode Selector Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
                {[
                  { id: 'messages', label: '💬 Text Message' },
                  { id: 'voice', label: '🎙️ Voice Note' },
                  { id: 'qa', label: '🎯 Live Q&A' },
                  { id: 'tips', label: '🎁 Send Tip' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl transition ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Interactive Tab View */}
            <div className="grid md:grid-cols-12 gap-6 items-center">
              {/* Left Column: Interactive Simulation Card */}
              <div className="md:col-span-7 space-y-4">
                {activeTab === 'messages' && (
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-blue-500 flex items-center gap-1">
                        <Lock size={12} /> 100% Encrypted & Anonymous
                      </span>
                      <span>Max 500 chars</span>
                    </div>

                    <form onSubmit={handleDemoSend} className="space-y-3">
                      <textarea
                        value={demoInput}
                        onChange={(e) => setDemoInput(e.target.value)}
                        placeholder="What's a secret advice you wish you knew in your 20s? (Try typing here...)"
                        rows={3}
                        className={`w-full p-3.5 rounded-xl text-sm border resize-none focus:outline-none focus:ring-2 ${themeClasses.input}`}
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1.5 text-xs text-slate-400">
                          <span className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400">#LifeAdvice</span>
                          <span className="px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-400">#Career</span>
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition active:scale-95 flex items-center gap-1.5"
                        >
                          <Send size={13} />
                          <span>{demoSent ? 'Sent Anonymously!' : 'Send Secretly'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {activeTab === 'voice' && (
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-500 flex items-center gap-1.5">
                        <Mic size={14} /> Pitch-Modulated Voice
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        Identity Shielded
                      </span>
                    </div>

                    {/* Visual Voice Wave Bar */}
                    <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                        className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/25 active:scale-95"
                      >
                        {isPlayingAudio ? <Check size={16} /> : <Play size={16} className="fill-white" />}
                      </button>
                      <div className="flex-1 flex items-center gap-1 h-8">
                        {[35, 75, 45, 90, 60, 100, 40, 80, 50, 95, 70, 30, 85, 55, 65, 90, 40, 70, 85, 30].map((h, idx) => (
                          <div
                            key={idx}
                            style={{ height: `${isPlayingAudio ? Math.random() * 80 + 20 : h}%` }}
                            className={`flex-1 rounded-full transition-all duration-150 ${isPlayingAudio ? 'bg-cyan-400' : 'bg-slate-300 dark:bg-slate-700'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-mono text-slate-400">0:18</span>
                    </div>
                  </div>
                )}

                {activeTab === 'qa' && (
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-xs font-bold text-emerald-500">LIVE ARENA</span>
                      </div>
                      <span className="text-xs text-slate-400">1,420 viewers live</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        "What is your biggest fear as a startup founder in 2026?"
                      </p>
                      <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                        <span>🔥 342 upvotes</span>
                        <span className="text-blue-500 font-semibold">Answered 2m ago</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'tips' && (
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1">
                        <Crown size={14} /> Direct Creator Tip
                      </span>
                      <span className="text-xs font-bold text-emerald-400">Instant ₦ Payout</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {['₦1,000', '₦2,500', '₦5,000', '₦10,000'].map((amt, idx) => (
                        <button
                          key={amt}
                          className={`p-2.5 rounded-xl text-xs font-extrabold text-center border transition ${
                            idx === 2
                              ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white border-amber-400 shadow-md shadow-amber-500/25'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {amt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Live Feed Visual Graphic */}
              <div className="md:col-span-5 space-y-3">
                <div className="p-4 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl shadow-blue-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare size={16} className="text-blue-200" />
                      <span className="text-xs font-bold text-blue-100 uppercase tracking-wider">Incoming Feed</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-mono font-bold">Just Now</span>
                  </div>
                  <p className="text-sm font-medium leading-snug">
                    "Your latest tech review made me switch careers to UI/UX design. Thank you!"
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/15 text-xs text-blue-100">
                    <span>❤️ 1,280 reactions</span>
                    <span className="font-semibold">Shared to Story</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-sm">
                      ₦
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Tip Received +₦5,000</p>
                      <p className="text-[11px] text-slate-400">Anonymous supporter • 4m ago</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-500">Settled</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Numbers & Credibility Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto mt-20">
          {statsData.map((stat, i) => (
            <motion.div 
              key={stat.label} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.08 }} 
              className={`${themeClasses.card} rounded-3xl p-6 text-center transition ${themeClasses.cardHover}`}
            >
              <stat.icon className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className={`text-3xl font-black tracking-tight ${themeClasses.text}`}>{stat.value}</div>
              <div className={`text-xs font-medium ${themeClasses.textSec} mt-0.5`}>{stat.label}</div>
              <div className="text-[11px] text-emerald-500 mt-1 font-bold">{stat.trend}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works with Visual Workflow */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-blue-500 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
            How It Works
          </span>
          <h2 className={`text-3xl sm:text-5xl font-black tracking-tight ${themeClasses.text} mb-4 mt-3`}>
            Start Receiving Honest Messages in 30 Seconds
          </h2>
          <p className={`text-base sm:text-lg ${themeClasses.textSec}`}>
            No complicated setup. Just claim your handle and drop it into your social bio.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Claim Your Handle',
              desc: 'Sign up for free and choose your unique link (e.g. anonq.me/yourname). Personalize your avatar and themes.',
              icon: User,
              pill: 'Instant Setup',
              color: 'from-blue-600 to-indigo-600',
            },
            {
              step: '02',
              title: 'Share Anywhere',
              desc: 'Place your AnonQ link on your Instagram bio, TikTok, X, WhatsApp status, or embed it on your personal website.',
              icon: Share2,
              pill: 'Viral Ready',
              color: 'from-indigo-600 to-blue-500',
            },
            {
              step: '03',
              title: 'Receive & Monetize',
              desc: 'Get authentic confessions, audio voice notes, and paid tips. Reply with stylized cards directly to social stories.',
              icon: Crown,
              pill: 'Earn & Grow',
              color: 'from-blue-500 to-cyan-500',
            },
          ].map((item, i) => (
            <motion.div 
              key={item.step} 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }} 
              className={`${themeClasses.card} rounded-3xl p-8 transition ${themeClasses.cardHover} relative overflow-hidden flex flex-col justify-between`}
            >
              <div className="absolute top-4 right-5 text-5xl font-black text-slate-200/40 dark:text-slate-800/40 font-mono">
                {item.step}
              </div>

              <div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-lg shadow-blue-500/25 mb-6`}>
                  <item.icon size={24} />
                </div>
                <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">{item.pill}</span>
                <h3 className={`text-xl font-black tracking-tight ${themeClasses.text} mt-1 mb-3`}>{item.title}</h3>
                <p className={`text-sm ${themeClasses.textSec} leading-relaxed`}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className={`py-24 px-4 sm:px-6 lg:px-8 ${themeClasses.sectionBg} border-y border-slate-200/50 dark:border-slate-800/50`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              Feature Arsenal
            </span>
            <h2 className={`text-3xl sm:text-5xl font-black tracking-tight ${themeClasses.text} mb-4 mt-3`}>
              Engineered for Genuine, Safe Interaction
            </h2>
            <p className={`text-base sm:text-lg ${themeClasses.textSec}`}>
              Everything modern creators and communities need to communicate safely.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div 
                key={feature.title} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.05 }} 
                className={`${themeClasses.card} rounded-3xl p-7 transition ${themeClasses.cardHover}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${feature.bg} ${feature.color}`}>
                    {feature.badge}
                  </span>
                </div>
                <h3 className={`text-lg font-bold ${themeClasses.text} mb-2`}>{feature.title}</h3>
                <p className={`text-sm ${themeClasses.textSec} leading-relaxed`}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Testimonials Carousel */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            Creator Stories
          </span>
          <h2 className={`text-3xl sm:text-5xl font-black tracking-tight ${themeClasses.text} mb-4 mt-3`}>
            Loved by 500,000+ Creators
          </h2>
          <p className={`text-base sm:text-lg ${themeClasses.textSec}`}>
            See how creators across Africa and worldwide connect with their audiences.
          </p>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTestimonial} 
              initial={{ opacity: 0, scale: 0.96 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.96 }} 
              className={`${themeClasses.card} rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl`}
            >
              <Quote className="w-16 h-16 text-blue-500/15 absolute top-6 left-6 pointer-events-none" />
              <p className={`text-lg sm:text-2xl ${darkMode ? 'text-slate-200' : 'text-slate-800'} font-medium mb-8 leading-relaxed relative z-10`}>
                "{testimonials[activeTestimonial].text}"
              </p>

              <div className="flex items-center justify-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${testimonials[activeTestimonial].avatarColor} flex items-center justify-center text-white font-extrabold text-lg shadow-md`}>
                  {testimonials[activeTestimonial].author.charAt(1).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className={`font-bold text-sm sm:text-base ${themeClasses.text}`}>{testimonials[activeTestimonial].author}</p>
                  <p className={`text-xs ${themeClasses.textSec}`}>{testimonials[activeTestimonial].role}</p>
                </div>
              </div>

              <div className="flex justify-center gap-1 mt-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActiveTestimonial(i)} 
                className={`h-2 rounded-full transition-all duration-300 ${activeTestimonial === i ? 'w-8 bg-gradient-to-r from-blue-600 to-indigo-600' : 'w-2 bg-slate-300 dark:bg-slate-700'}`} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* High-Converting CTA Banner */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl p-8 sm:p-14 text-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white shadow-2xl shadow-blue-500/25 border border-blue-400/30"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-6">
              <Sparkles size={24} className="text-white" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
              Ready to Hear What People Really Think?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base mb-8 leading-relaxed">
              Create your free anonymous inbox in less than 30 seconds. No credit card required.
            </p>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter your email address" 
                  className="flex-1 rounded-2xl px-5 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/40" 
                  required 
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-white text-blue-900 font-bold rounded-2xl text-sm hover:bg-blue-50 transition active:scale-95 shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-md text-white font-bold flex items-center justify-center gap-2">
                <Check size={20} className="text-emerald-300" />
                <span>Success! Welcome aboard AnonQ.</span>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      <Footer darkMode={darkMode} />
    </div>
  )
}