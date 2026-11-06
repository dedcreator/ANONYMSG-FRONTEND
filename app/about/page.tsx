// app/about/page.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTheme } from '@/app/context/ThemeContext'
import { Navbar } from '@/components/Navbar'
import { 
  Sparkles, Shield, Heart, Users, MessageSquare, Award,
  Rocket, Target, Globe, Zap, Lock, Star,
  CheckCircle, ArrowRight, MoveRight, Play,
  Crown, Gift, TrendingUp, Smile
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

export default function AboutPage() {
  const { darkMode } = useTheme()

  const values = [
    { icon: Shield, title: 'Privacy First', desc: 'Your identity is never revealed. No tracking, no logs.' },
    { icon: Lock, title: 'Security First', desc: 'End-to-end encryption for all messages.' },
    { icon: Users, title: 'Community First', desc: 'Building a safe space for honest conversations.' },
    { icon: Heart, title: 'Respect First', desc: 'AI-powered moderation keeps conversations respectful.' },
  ]

  const team = [
    { name: 'Alex Chen', role: 'Founder & CEO', avatar: 'AC' },
    { name: 'Sarah Johnson', role: 'CTO', avatar: 'SJ' },
    { name: 'Mike Rodriguez', role: 'Lead Designer', avatar: 'MR' },
    { name: 'Emily Kim', role: 'Head of Community', avatar: 'EK' },
  ]

  const milestones = [
    { year: '2023', title: 'Launched AnonQ', desc: 'Started with a vision for anonymous communication' },
    { year: '2024', title: '10K Users', desc: 'Reached 10,000 active users worldwide' },
    { year: '2024', title: 'Voice Messages', desc: 'Launched voice message feature' },
    { year: '2025', title: 'Global Reach', desc: 'Expanded to 180+ countries' },
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
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-blue-50 border border-blue-100'}`}>
              <Sparkles size={16} className="text-blue-600" />
              <span className={`text-sm ${themeClasses.textSec}`}>About Us</span>
            </div>
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${themeClasses.text}`}>
              We Believe in{' '}
              <span className="text-blue-600">Honest Conversations</span>
            </h1>
            <p className={`text-xl ${themeClasses.textSec} max-w-2xl mx-auto leading-relaxed`}>
              AnonQ was built on the belief that everyone deserves to express themselves freely and receive honest feedback without fear.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}>
              <span className={`text-sm font-medium text-blue-600 uppercase tracking-wider`}>Our Mission</span>
              <h2 className={`text-3xl md:text-4xl font-bold ${themeClasses.text} mt-2 mb-4`}>
                Empowering <span className="text-blue-600">Authentic Connections</span>
              </h2>
              <p className={`${themeClasses.textSec} leading-relaxed mb-4`}>
                We believe that the best conversations happen when people feel safe to speak their truth. AnonQ provides the platform for honest, anonymous communication.
              </p>
              <p className={`${themeClasses.textSec} leading-relaxed`}>
                Our mission is to break down barriers to communication and create a world where everyone can share their thoughts freely.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              whileInView={{ opacity: 1, x: 0 }}
              className={`p-8 rounded-2xl ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200/60 shadow-sm'}`}
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '10K+', label: 'Active Users' },
                  { value: '50K+', label: 'Messages Sent' },
                  { value: '180+', label: 'Countries' },
                  { value: '99.9%', label: 'Uptime' },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 rounded-xl">
                    <div className={`text-2xl font-bold ${themeClasses.text}`}>{stat.value}</div>
                    <div className={`text-sm ${themeClasses.textSec}`}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={`py-16 px-4 ${darkMode ? 'bg-white/5' : 'bg-gray-50/80'}`}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className={`text-sm font-medium text-purple-500 uppercase tracking-wider`}>Values</span>
            <h2 className={`text-3xl md:text-4xl font-bold ${themeClasses.text} mb-4 mt-2`}>
              What We <span className="text-blue-600">Stand For</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 ${
                  darkMode ? 'bg-white/5 border border-white/10 hover:border-blue-500/30' : 'bg-white border border-gray-200/60 shadow-sm hover:shadow-xl'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                  <value.icon className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{value.title}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className={`text-sm font-medium text-green-500 uppercase tracking-wider`}>Team</span>
            <h2 className={`text-3xl md:text-4xl font-bold ${themeClasses.text} mb-4 mt-2`}>
              Meet the <span className="text-blue-600">People</span> Behind AnonQ
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 ${
                  darkMode ? 'bg-white/5 border border-white/10 hover:border-blue-500/30' : 'bg-white border border-gray-200/60 shadow-sm hover:shadow-xl'
                }`}
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold ${
                  darkMode ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' : 'bg-blue-100 text-blue-600 border border-blue-200'
                }`}>
                  {member.avatar}
                </div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{member.name}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className={`py-16 px-4 ${darkMode ? 'bg-white/5' : 'bg-gray-50/80'}`}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className={`text-sm font-medium text-orange-500 uppercase tracking-wider`}>Journey</span>
            <h2 className={`text-3xl md:text-4xl font-bold ${themeClasses.text} mb-4 mt-2`}>
              Our <span className="text-blue-600">Milestones</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-6">
            {milestones.map((milestone, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
                  darkMode ? 'bg-white/5 border border-white/10 hover:border-blue-500/30' : 'bg-white border border-gray-200/60 shadow-sm hover:shadow-xl'
                }`}
              >
                <div className={`text-4xl font-bold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{milestone.year}</div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{milestone.title}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{milestone.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center">
          <div className={`rounded-3xl p-12 relative overflow-hidden ${darkMode ? 'bg-slate-900/90 border border-slate-800' : 'bg-slate-50 border border-slate-200 shadow-sm'}`}>
            <div className="relative z-10">
              <Rocket className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className={`text-3xl md:text-4xl font-bold ${themeClasses.text} mb-4`}>Join Our Community</h2>
              <p className={`${themeClasses.textSec} mb-8 max-w-2xl mx-auto`}>
                Be part of something bigger. Join thousands of users who are already using AnonQ.
              </p>
              <Link href="/register">
                <Button darkMode={darkMode} size="lg">Get Started <MoveRight size={18} /></Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer darkMode={darkMode} />
    </div>
  )
}