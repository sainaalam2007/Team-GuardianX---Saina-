"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Pricing() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  const plans = [
    {
      name: 'Guardian Free',
      description: 'Essential telemetry and safety alerts for small teams.',
      price: '$0',
      period: 'forever',
      features: [
        'Up to 5 riders',
        'Basic real-time telemetry (Speed, Location)',
        'Standard crash alerts',
        '7-day data retention',
        'Community hazard feed'
      ],
      buttonText: 'Current Plan',
      buttonVariant: 'outline',
      popular: false
    },
    {
      name: 'Guardian Pro',
      description: 'Advanced AI insights and predictive maintenance for growing fleets.',
      price: billingCycle === 'monthly' ? '$49' : '$39',
      period: 'per rider / month',
      features: [
        'Up to 50 riders',
        'AI Risk Prediction Coaching',
        'Predictive maintenance alerts',
        '30-day historical route heatmaps',
        'Drowsiness & Alcohol detection algorithms',
        'Priority email support'
      ],
      buttonText: 'Upgrade to Pro',
      buttonVariant: 'gradient',
      popular: true
    },
    {
      name: 'Guardian Enterprise',
      description: 'Unmatched scale and deep emergency integrations for massive operations.',
      price: 'Custom',
      period: 'contact us',
      features: [
        'Unlimited riders',
        'Direct EMS (Emergency Services) integration',
        'Raw WebSocket & API access',
        'Unlimited data retention',
        'Custom SSO & SLA',
        '24/7 dedicated fleet manager hotline'
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'solid',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
      {/* Dynamic Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Header & Navigation */}
      <div className="max-w-7xl mx-auto mb-12 flex justify-between items-center relative z-10">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
          Back to Command Center
        </button>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight mb-4">
            Scale Your Fleet's Safety
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Choose the right level of AI-powered risk prediction and telemetry to protect your riders and optimize your operations.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <span className={`text-sm font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annually' : 'monthly')}
              className="relative w-16 h-8 bg-slate-800 rounded-full p-1 border border-slate-700/50 shadow-inner transition-colors duration-300"
            >
              <div 
                className={`w-6 h-6 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full shadow-md transform transition-transform duration-300 ${billingCycle === 'annually' ? 'translate-x-8' : 'translate-x-0'}`} 
              />
            </button>
            <span className={`text-sm font-semibold flex items-center gap-2 ${billingCycle === 'annually' ? 'text-white' : 'text-slate-500'}`}>
              Annually <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative bg-slate-900/60 backdrop-blur-xl border rounded-3xl p-8 flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                plan.popular 
                  ? 'border-indigo-500/50 shadow-[0_0_40px_rgba(79,70,229,0.15)] md:-mt-4 md:mb-4' 
                  : 'border-slate-700/50 shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-100 mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm h-10">{plan.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-5xl font-black text-white tracking-tight">{plan.price}</span>
                <span className="text-slate-500 text-sm font-medium">{plan.period}</span>
              </div>

              <div className="flex-1">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <svg className={`w-5 h-5 mt-0.5 shrink-0 ${plan.popular ? 'text-indigo-400' : 'text-blue-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="text-slate-300 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                className={`w-full py-4 rounded-xl font-bold tracking-wide transition-all ${
                  plan.buttonVariant === 'gradient'
                    ? 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]'
                    : plan.buttonVariant === 'outline'
                    ? 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800 text-slate-300'
                    : 'bg-slate-200 hover:bg-white text-slate-900 shadow-xl'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
