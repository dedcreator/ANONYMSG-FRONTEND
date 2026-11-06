// app/privacy/page.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTheme } from '@/app/context/ThemeContext'
import { Navbar } from '@/components/Navbar'
import { 
  Sparkles, Shield, Lock, Eye, User, Database,
  Server, Mail, Cookie, CheckCircle, ArrowRight,
  MoveRight, ShieldCheck, Fingerprint, FileCheck
} from 'lucide-react'

const Button = ({ children, variant = 'primary', size = 'md', className = '', onClick, href, darkMode = false }: any) => {
  const baseStyles = "font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2 rounded-xl"
  
  const variants: any = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
    secondary: darkMode 
      ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
      : "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200",
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
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </Component>
  )
}

const Footer = ({ darkMode }: { darkMode: boolean }) => (
  <footer className={`border-t py-16 px-4 transition-colors duration-300 ${darkMode ? 'border-white/5 bg-black' : 'border-gray-200/50 bg-white/50 backdrop-blur-sm'}`}>
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Anon<span className="text-blue-600">Q</span>
            </span>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Ask Questions. Stay Anonymous.
          </p>
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

export default function PrivacyPage() {
  const { darkMode } = useTheme()

  const sections = [
    {
      icon: Shield,
      title: 'Information We Collect',
      content: 'We collect minimal information to provide our service. This includes your email address, username, and message content. We do not store IP addresses or tracking information.'
    },
    {
      icon: Lock,
      title: 'How We Use Your Data',
      content: 'Your data is used solely to provide the anonymous messaging service. Messages are delivered in real-time and stored securely. We do not sell or share your data with third parties.'
    },
    {
      icon: Eye,
      title: 'Data Security',
      content: 'All messages are encrypted end-to-end. We use industry-standard encryption protocols to protect your data. Our servers are secured with firewalls and regular security audits.'
    },
    {
      icon: User,
      title: 'Your Privacy Rights',
      content: 'You have the right to access, modify, or delete your data at any time. You can export your messages or permanently delete your account from your dashboard settings.'
    },
    {
      icon: Database,
      title: 'Data Storage',
      content: 'Messages are stored for up to 30 days. Archived messages are retained until you choose to delete them. Voice messages are encrypted and stored securely.'
    },
    {
      icon: Cookie,
      title: 'Cookies',
      content: 'We use essential cookies to keep you logged in and to remember your preferences. We do not use tracking cookies or third-party analytics cookies.'
    },
  ]

  const themeClasses = {
    bg: darkMode ? 'bg-black' : 'bg-gray-50',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textSec: darkMode ? 'text-gray-400' : 'text-gray-600',
  }

  return (
    <div className={`min-h-screen ${themeClasses.bg}`}>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-blue-50 border border-blue-100'}`}>
              <Shield size={16} className="text-green-500" />
              <span className={`text-sm ${themeClasses.textSec}`}>Privacy Policy</span>
            </div>
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${themeClasses.text}`}>
              Your Privacy <span className="text-blue-600">Matters</span>
            </h1>
            <p className={`text-xl ${themeClasses.textSec} max-w-2xl mx-auto leading-relaxed`}>
              We believe in complete transparency. Here's how we protect your privacy and handle your data.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Privacy Sections */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-6 rounded-2xl transition-all duration-300 ${
                  darkMode ? 'bg-white/5 border border-white/10 hover:border-blue-500/30' : 'bg-white border border-gray-200/60 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-xl shrink-0 ${darkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                    <section.icon className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>{section.title}</h3>
                    <p className={`text-sm ${themeClasses.textSec} leading-relaxed`}>{section.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className={`py-16 px-4 ${darkMode ? 'bg-white/5' : 'bg-gray-50/80'}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="grid md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, label: 'GDPR Compliant' },
              { icon: Fingerprint, label: 'No Tracking' },
              { icon: Lock, label: 'Encrypted' },
              { icon: FileCheck, label: 'Data Control' },
            ].map((badge, i) => (
              <div key={i} className={`p-4 rounded-2xl text-center ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200/60 shadow-sm'}`}>
                <badge.icon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <span className={`text-sm font-medium ${themeClasses.text}`}>{badge.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Last Updated */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className={`text-sm ${themeClasses.textSec}`}>
            Last updated: June 2024 • Version 1.0
          </p>
          <p className={`text-sm ${themeClasses.textSec} mt-2`}>
            By using AnonQ, you agree to our privacy policy.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center">
          <div className={`rounded-3xl p-12 relative overflow-hidden ${darkMode ? 'bg-slate-900/90 border border-slate-800' : 'bg-slate-50 border border-slate-200 shadow-sm'}`}>
            <h2 className={`text-3xl md:text-4xl font-bold ${themeClasses.text} mb-4`}>Have Questions About Privacy?</h2>
            <p className={`${themeClasses.textSec} mb-8 max-w-2xl mx-auto`}>
              We're here to help. Contact us if you have any privacy concerns.
            </p>
            <Link href="/contact">
              <Button darkMode={darkMode}>Contact Us <MoveRight size={18} /></Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer darkMode={darkMode} />
    </div>
  )
}