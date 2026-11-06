// app/pricing/page.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTheme } from '@/app/context/ThemeContext'
import { Navbar } from '@/components/Navbar'
import { 
  Sparkles, Check, Crown, Star, Rocket, Zap, Shield,
  MessageSquare, Mic, Image, BarChart3, Palette,
  Users, Award, Clock, MoveRight, ArrowRight, Play
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

export default function PricingPage() {
  const { darkMode } = useTheme()

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        '50 messages/month',
        'Basic analytics',
        'Text messages only',
        'Standard support',
        'Community access',
      ],
      cta: 'Get Started',
      ctaLink: '/register',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$3',
      period: '/month',
      description: 'Best for serious users',
      features: [
        'Unlimited messages',
        'Voice messages',
        'Custom themes',
        'Advanced analytics',
        'Priority support',
        'No ads',
        'Message pinning',
      ],
      cta: 'Upgrade to Pro',
      ctaLink: '/register',
      popular: true,
    },
    {
      name: 'Business',
      price: '$8',
      period: '/month',
      description: 'For teams and businesses',
      features: [
        'Everything in Pro',
        'API access',
        'Team accounts',
        'Custom branding',
        'Dedicated support',
        'White-label options',
        'Advanced security',
      ],
      cta: 'Contact Sales',
      ctaLink: '/contact',
      popular: false,
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
              <Crown size={16} className="text-yellow-500" />
              <span className={`text-sm ${themeClasses.textSec}`}>Pricing</span>
            </div>
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${themeClasses.text}`}>
              Choose Your <span className="text-blue-600">Plan</span>
            </h1>
            <p className={`text-xl ${themeClasses.textSec} max-w-2xl mx-auto leading-relaxed`}>
              Pick the plan that works best for you. All plans include our core anonymous messaging features.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular 
                    ? `border-2 border-blue-600 shadow-lg shadow-blue-500/10 ${darkMode ? 'bg-slate-900' : 'bg-white'}`
                    : darkMode 
                      ? 'bg-slate-900/60 border border-slate-800 hover:border-slate-700' 
                      : 'bg-white border border-gray-200/60 shadow-sm hover:shadow-md'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-sm">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className={`text-xl font-bold ${themeClasses.text}`}>{plan.name}</h3>
                  <div className={`text-4xl font-bold mt-2 ${themeClasses.text}`}>
                    {plan.price}<span className={`text-lg font-normal ${themeClasses.textSec}`}>{plan.period}</span>
                  </div>
                  <p className={`text-sm ${themeClasses.textSec} mt-2`}>{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <Check size={18} className="text-green-500 shrink-0" />
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.ctaLink}>
                  <button className={`w-full py-2.5 px-4 rounded-xl font-semibold transition ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                      : darkMode 
                        ? 'border border-slate-700 hover:bg-slate-800 text-white' 
                        : 'border border-gray-300 hover:bg-gray-50 text-gray-900'
                  }`}>
                    {plan.cta}
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className={`py-16 px-4 ${darkMode ? 'bg-white/5' : 'bg-gray-50/80'}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h2 className={`text-2xl md:text-3xl font-bold ${themeClasses.text}`}>
              Compare <span className="text-blue-600">Features</span>
            </h2>
          </motion.div>

          <div className={`rounded-2xl overflow-hidden ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200/60 shadow-sm'}`}>
            <div className="grid grid-cols-4 gap-0">
              <div className={`p-4 border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <span className={`font-semibold ${themeClasses.text}`}>Feature</span>
              </div>
              <div className={`p-4 text-center border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Free</span>
              </div>
              <div className={`p-4 text-center border-b ${darkMode ? 'border-white/10' : 'border-gray-200'} bg-blue-500/5`}>
                <span className={`font-semibold text-blue-500`}>Pro</span>
              </div>
              <div className={`p-4 text-center border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Business</span>
              </div>
            </div>

            {[
              { name: 'Messages', free: '50/month', pro: 'Unlimited', business: 'Unlimited' },
              { name: 'Voice Messages', free: 'No', pro: 'Yes', business: 'Yes' },
              { name: 'Custom Themes', free: 'No', pro: 'Yes', business: 'Yes' },
              { name: 'Analytics', free: 'Basic', pro: 'Advanced', business: 'Advanced' },
              { name: 'Support', free: 'Standard', pro: 'Priority', business: 'Dedicated' },
              { name: 'API Access', free: 'No', pro: 'No', business: 'Yes' },
              { name: 'Team Accounts', free: 'No', pro: 'No', business: 'Yes' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-4 gap-0">
                <div className={`p-4 ${darkMode ? 'border-white/5' : 'border-gray-100'} ${i % 2 === 0 ? (darkMode ? 'bg-white/5' : 'bg-gray-50') : ''}`}>
                  <span className={`text-sm ${themeClasses.text}`}>{row.name}</span>
                </div>
                <div className={`p-4 text-center ${darkMode ? 'border-white/5' : 'border-gray-100'} ${i % 2 === 0 ? (darkMode ? 'bg-white/5' : 'bg-gray-50') : ''}`}>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{row.free}</span>
                </div>
                <div className={`p-4 text-center ${darkMode ? 'border-white/5' : 'border-gray-100'} ${i % 2 === 0 ? (darkMode ? 'bg-white/5' : 'bg-gray-50') : ''} bg-blue-500/5`}>
                  <span className={`text-sm font-medium text-blue-500`}>{row.pro}</span>
                </div>
                <div className={`p-4 text-center ${darkMode ? 'border-white/5' : 'border-gray-100'} ${i % 2 === 0 ? (darkMode ? 'bg-white/5' : 'bg-gray-50') : ''}`}>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{row.business}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h2 className={`text-2xl md:text-3xl font-bold ${themeClasses.text}`}>
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. No questions asked.' },
              { q: 'Is there a free trial?', a: 'Yes, you can try all Pro features free for 7 days.' },
              { q: 'What payment methods do you accept?', a: 'We accept credit cards, PayPal, and crypto payments.' },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl transition-all duration-300 ${
                  darkMode ? 'bg-white/5 border border-white/10 hover:border-blue-500/30' : 'bg-white border border-gray-200/60 shadow-sm hover:shadow-md'
                }`}
              >
                <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{faq.q}</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center">
          <div className={`rounded-3xl p-12 relative overflow-hidden ${darkMode ? 'bg-slate-900/90 border border-slate-800' : 'bg-slate-50 border border-slate-200 shadow-sm'}`}>
            <Rocket className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className={`text-3xl md:text-4xl font-bold ${themeClasses.text} mb-4`}>Start Your Free Trial Today</h2>
            <p className={`${themeClasses.textSec} mb-8 max-w-2xl mx-auto`}>
              Try all Pro features free for 7 days. No credit card required.
            </p>
            <Link href="/register">
              <Button darkMode={darkMode} size="lg">Get Started <MoveRight size={18} /></Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer darkMode={darkMode} />
    </div>
  )
}