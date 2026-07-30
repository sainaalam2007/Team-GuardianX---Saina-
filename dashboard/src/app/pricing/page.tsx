"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Pricing() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');

  // Checkout Modal States
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [checkoutStep, setCheckoutStep] = useState<'details' | 'processing' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');

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

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setCheckoutStep('success');
    }, 2000);
  };

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
                onClick={() => {
                  if (plan.buttonVariant !== 'outline') {
                    setSelectedPlan(plan);
                    setCheckoutStep('details');
                  }
                }}
                className={`w-full py-4 rounded-xl font-bold tracking-wide transition-all ${
                  plan.buttonVariant === 'gradient'
                    ? 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]'
                    : plan.buttonVariant === 'outline'
                    ? 'bg-slate-800/50 border border-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-200 hover:bg-white text-slate-900 shadow-xl'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Modal Overlay */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
            
            {/* Close Button */}
            {checkoutStep === 'details' && (
              <button 
                onClick={() => setSelectedPlan(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}

            {/* Step 1: Payment Details */}
            {checkoutStep === 'details' && (
              <div className="p-8">
                <div className="mb-6 border-b border-slate-800 pb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Complete your Upgrade</h2>
                  <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <div>
                      <div className="text-sm text-slate-400">Selected Plan</div>
                      <div className="font-bold text-indigo-400">{selectedPlan.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white">{selectedPlan.price}</div>
                      <div className="text-xs text-slate-500">{selectedPlan.period}</div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handlePayNow}>
                  {/* Payment Method Toggle */}
                  <div className="flex p-1 bg-slate-950/50 rounded-xl border border-slate-800 mb-6">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex justify-center items-center gap-2 ${paymentMethod === 'card' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                      Credit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex justify-center items-center gap-2 ${paymentMethod === 'upi' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      UPI / Wallet
                    </button>
                  </div>

                  {paymentMethod === 'card' ? (
                    <div className="space-y-4 mb-8">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Card Number</label>
                        <input type="text" placeholder="0000 0000 0000 0000" required className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Expiry Date</label>
                          <input type="text" placeholder="MM/YY" required className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">CVC</label>
                          <input type="text" placeholder="123" required className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Cardholder Name</label>
                        <input type="text" placeholder="John Doe" required className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 mb-8">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">UPI ID</label>
                        <input type="text" placeholder="yourname@bank" required className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-300 text-sm flex items-start gap-3">
                        <svg className="shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                        You will receive a payment request on your UPI app after clicking Pay Now.
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all flex justify-center items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Pay Securely
                  </button>
                  <div className="text-center mt-4 flex items-center justify-center gap-2 text-slate-500 text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Payments are encrypted and secured by Stripe
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Processing */}
            {checkoutStep === 'processing' && (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">Processing Payment...</h2>
                <p className="text-slate-400">Please do not close this window or click back.</p>
              </div>
            )}

            {/* Step 3: Success */}
            {checkoutStep === 'success' && (
              <div className="p-12 flex flex-col items-center justify-center text-center bg-gradient-to-b from-slate-900 to-slate-800">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <svg className="text-emerald-400" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Payment Successful!</h2>
                <p className="text-slate-300 mb-8 max-w-sm">
                  Welcome to <span className="font-bold text-indigo-400">{selectedPlan.name}</span>. Your fleet now has access to advanced AI tracking and features.
                </p>
                <button 
                  onClick={() => router.push('/')}
                  className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-bold py-4 rounded-xl transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
