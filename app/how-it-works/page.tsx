// app/how-it-works/page.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTheme } from '@/app/context/ThemeContext'
import { Navbar } from '@/components/Navbar'
import { 
  Users, Share2, MessageSquare, Sparkles, Shield, Lock, Zap,
  ArrowRight, CheckCircle, Rocket, Target, Star, Crown,
  MoveRight, Play, Gift, Heart, Clock, Mail, Link as LinkIcon, Globe
} from 'lucide-react'

// Button Component
const Button = ({ children, variant = 'primary', size = 'md', className = '', onClick, href, darkMode = false }: any) => {
  const baseStyles = "font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2 rounded-xl"
  
  const variants: any = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm",
    secondary: darkMode 
      ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
      : "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20",
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

// Step Component
const Step = ({ step, title, description, icon: Icon, details, index, darkMode, isLast }: any) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className={`relative ${!isLast ? 'pb-12' : ''}`}
  >
    {!isLast && (
      <div className={`absolute left-6 top-16 bottom-0 w-0.5 ${darkMode ? 'bg-blue-500/20' : 'bg-blue-200'}`} />
    )}
    
    <div className="flex gap-6">
      {/* Step Number */}
      <div className="shrink-0">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold ${
          darkMode 
            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' 
            : 'bg-blue-100 text-blue-600 border border-blue-200'
        }`}>
          {step}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <div className={`p-6 rounded-2xl transition-all duration-300 ${
          darkMode 
            ? 'bg-white/5 border border-white/10 hover:border-blue-500/30' 
            : 'bg-white border border-gray-200/60 shadow-sm hover:shadow-xl'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-xl ${darkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
              <Icon className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h3>
          </div>
          
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} leading-relaxed mb-4`}>
            {description}
          </p>
          
          {details && details.length > 0 && (
            <ul className="space-y-2">
              {details.map((detail: string, idx: number) => (
                <li key={idx} className="flex items-center gap-2 text-sm">
                  <CheckCircle size={14} className="text-green-500 shrink-0" />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  </motion.div>
)

// Footer Component
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

export default function HowItWorksPage() {
  const { darkMode } = useTheme()

  const steps = [
    {
      step: '01',
      title: 'Create Your Account',
      description: 'Sign up in seconds with just an email and username. No personal information required. Your identity is completely anonymous.',
      icon: Users,
      details: [
        'Choose a unique username',
        'Set your profile preferences',
        'Customize your page with themes and colors'
      ]
    },
    {
      step: '02',
      title: 'Share Your Profile Link',
      description: 'Share your unique anonymous profile link anywhere - social media, email, or your website. Let people find you.',
      icon: Share2,
      details: [
        'Copy your custom link',
        'Share on social platforms',
        'Embed on your website'
      ]
    },
    {
      step: '03',
      title: 'Receive Messages',
      description: 'Get honest, unfiltered messages from anyone. Your identity stays completely anonymous. Start real conversations.',
      icon: MessageSquare,
      details: [
        'Real-time message delivery',
        'Voice messages supported',
        'Images and GIFs too'
      ]
    },
  ]

  const benefits = [
    { icon: Shield, title: '100% Anonymous', desc: 'Your identity is never revealed' },
    { icon: Lock, title: 'End-to-End Encrypted', desc: 'Your messages are secure' },
    { icon: Zap, title: 'Real-time Delivery', desc: 'Messages arrive instantly' },
    { icon: Heart, title: 'AI Moderation', desc: 'Keep conversations respectful' },
  ]

  const themeClasses = {
    bg: darkMode ? 'bg-black' : 'bg-gray-50',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textSec: darkMode ? 'text-gray-400' : 'text-gray-600',
  }

  return (
    <div className={`min-h-screen ${themeClasses.bg}`}>
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-blue-50 border border-blue-100'}`}>
              <Rocket size={16} className="text-blue-600" />
              <span className={`text-sm ${themeClasses.textSec}`}>Getting Started</span>
            </div>
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${themeClasses.text}`}>
              How It <span className="text-blue-600">Works</span>
            </h1>
            <p className={`text-xl ${themeClasses.textSec} max-w-2xl mx-auto leading-relaxed`}>
              Three simple steps to start receiving anonymous messages and connecting with your audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/register">
                <Button darkMode={darkMode} size="lg">
                  Get Started <MoveRight size={18} />
                </Button>
              </Link>
              <Button variant="secondary" darkMode={darkMode} size="lg">
                <Play size={18} /> Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <Step
              key={step.step}
              {...step}
              index={index}
              darkMode={darkMode}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className={`py-16 px-4 ${darkMode ? 'bg-white/5' : 'bg-gray-50/80'}`}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className={`text-sm font-medium text-blue-600 uppercase tracking-wider`}>Benefits</span>
            <h2 className={`text-3xl md:text-4xl font-bold ${themeClasses.text} mb-4 mt-2`}>
              Why Choose <span className="text-blue-600">AnonQ</span>
            </h2>
            <p className={`text-xl ${themeClasses.textSec} max-w-2xl mx-auto`}>
              The smartest way to receive anonymous feedback
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`text-center p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
                  darkMode 
                    ? 'bg-white/5 border border-white/10 hover:border-blue-500/30' 
                    : 'bg-white border border-gray-200/60 shadow-sm hover:shadow-xl'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                  darkMode ? 'bg-blue-500/10' : 'bg-blue-50'
                }`}>
                  <benefit.icon className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                  {benefit.title}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {benefit.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '10K+', label: 'Active Users', icon: Users },
              { value: '50K+', label: 'Messages Sent', icon: MessageSquare },
              { value: '180+', label: 'Countries', icon: Globe },
              { value: '99.9%', label: 'Uptime', icon: Shield },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`text-center p-6 rounded-2xl ${
                  darkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200/60 shadow-sm'
                }`}
              >
                <stat.icon className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className={`text-3xl font-bold ${themeClasses.text}`}>{stat.value}</div>
                <div className={`text-sm ${themeClasses.textSec}`}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className={`py-16 px-4 ${darkMode ? 'bg-white/5' : 'bg-gray-50/80'}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className={`text-sm font-medium text-purple-500 uppercase tracking-wider`}>FAQ</span>
            <h2 className={`text-3xl md:text-4xl font-bold ${themeClasses.text} mb-4 mt-2`}>
              Quick <span className="text-blue-600">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: 'Is it really anonymous?',
                a: 'Yes! We never store any identifying information. Your identity is completely protected.'
              },
              {
                q: 'Do I need to download anything?',
                a: 'No, AnonQ works entirely in your browser. No downloads or installations needed.'
              },
              {
                q: 'Is it free?',
                a: 'Yes, the basic version is completely free. Pro features are available for $3/month.'
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl transition-all duration-300 ${
                  darkMode 
                    ? 'bg-white/5 border border-white/10 hover:border-blue-500/30' 
                    : 'bg-white border border-gray-200/60 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg ${darkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                    <Star className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                      {faq.q}
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/faq">
              <span className={`text-sm text-blue-500 hover:underline cursor-pointer`}>
                View all FAQs →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className={`rounded-3xl p-12 relative overflow-hidden ${
            darkMode ? 'bg-slate-900/90 border border-slate-800' : 'bg-slate-50 border border-slate-200 shadow-sm'
          }`}>
            <div className="relative z-10">
              <Rocket className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className={`text-3xl md:text-4xl font-bold ${themeClasses.text} mb-4`}>
                Ready to Get Started?
              </h2>
              <p className={`${themeClasses.textSec} mb-8 max-w-2xl mx-auto`}>
                Join thousands of users who are already using AnonQ to receive honest, anonymous feedback.
              </p>
              <Link href="/register">
                <Button darkMode={darkMode} size="lg">
                  Create Free Account <MoveRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer darkMode={darkMode} />
    </div>
  )
}