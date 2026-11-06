// app/terms/page.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTheme } from '@/app/context/ThemeContext'
import { Navbar } from '@/components/Navbar'
import { 
  Sparkles, FileText, Shield, Users, MessageSquare,
  CheckCircle, AlertCircle, Scale, Clock, Database,
  MoveRight, Lock, Globe, UserCheck
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
  
  // Fix: Check if href is provided and use Link, otherwise use button
  if (href) {
    return (
      <Link
        href={href}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        onClick={onClick}
      >
        {children}
      </Link>
    )
  }
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
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

export default function TermsPage() {
  const { darkMode } = useTheme()

  const sections = [
    {
      icon: Shield,
      title: 'Acceptance of Terms',
      content: 'By using AnonQ, you agree to these terms of service. If you do not agree, please do not use our service.'
    },
    {
      icon: Users,
      title: 'User Responsibilities',
      content: 'You are responsible for all content you send and receive. You agree not to use the service for illegal activities, harassment, or spamming.'
    },
    {
      icon: MessageSquare,
      title: 'Message Content',
      content: 'All messages are anonymous. We do not monitor content but reserve the right to remove content that violates our policies.'
    },
    {
      icon: Lock,
      title: 'Privacy and Security',
      content: 'We take privacy seriously. Your data is encrypted and we never share your information with third parties without your consent.'
    },
    {
      icon: Scale,
      title: 'Prohibited Uses',
      content: 'You may not use AnonQ for illegal activities, harassment, spamming, or any behavior that violates our community guidelines.'
    },
    {
      icon: Clock,
      title: 'Account Termination',
      content: 'We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time.'
    },
    {
      icon: Database,
      title: 'Data Retention',
      content: 'Messages are stored for 30 days. You have full control to delete your data at any time from your dashboard.'
    },
    {
      icon: Globe,
      title: 'Governing Law',
      content: 'These terms are governed by the laws of the United States. Any disputes shall be resolved in California courts.'
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
              <FileText size={16} className="text-blue-600" />
              <span className={`text-sm ${themeClasses.textSec}`}>Terms of Service</span>
            </div>
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${themeClasses.text}`}>
              Terms of <span className="text-blue-600">Service</span>
            </h1>
            <p className={`text-xl ${themeClasses.textSec} max-w-2xl mx-auto leading-relaxed`}>
              Please read these terms carefully before using AnonQ. By using our service, you agree to these terms.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terms Sections */}
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

      {/* Key Points */}
      <section className={`py-16 px-4 ${darkMode ? 'bg-white/5' : 'bg-gray-50/80'}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="grid md:grid-cols-3 gap-6">
            {[
              { icon: UserCheck, label: '18+ Only', desc: 'Must be 18 or older to use' },
              { icon: Shield, label: 'No Abuse', desc: 'Zero tolerance for harassment' },
              { icon: AlertCircle, label: 'Use Responsibly', desc: 'Respect others\' privacy' },
            ].map((item, i) => (
              <div key={i} className={`p-4 rounded-2xl text-center ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200/60 shadow-sm'}`}>
                <item.icon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className={`font-semibold ${themeClasses.text}`}>{item.label}</h4>
                <p className={`text-sm ${themeClasses.textSec}`}>{item.desc}</p>
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
            By using AnonQ, you agree to these terms of service.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center">
          <div className={`rounded-3xl p-12 relative overflow-hidden ${darkMode ? 'bg-slate-900/90 border border-slate-800' : 'bg-slate-50 border border-slate-200 shadow-sm'}`}>
            <h2 className={`text-3xl md:text-4xl font-bold ${themeClasses.text} mb-4`}>Questions About Our Terms?</h2>
            <p className={`${themeClasses.textSec} mb-8 max-w-2xl mx-auto`}>
              We're here to help. Contact us if you have any questions about our terms of service.
            </p>
            <Button darkMode={darkMode} href="/contact">
              Contact Us <MoveRight size={18} />
            </Button>
          </div>
        </motion.div>
      </section>

      <Footer darkMode={darkMode} />
    </div>
  )
}