"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  // Form states
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Details
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
  const [contact, setContact] = useState('');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  // Step 2: OTP
  const [otp, setOtp] = useState('');

  const handleRequestOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (contactMethod === 'phone') {
      const isPhoneValid = /^\d{10}$/.test(contact);
      if (!isPhoneValid) {
        setError('Phone number must be exactly 10 digits.');
        setLoading(false);
        return;
      }
    } else {
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
      if (!isEmailValid) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }
    }

    if (!state || !city) {
      setError('Please provide your State and City for accurate tracking.');
      setLoading(false);
      return;
    }

    // Mock API call to send OTP
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Mock Verify
    setTimeout(() => {
      const isOtpValid = /^\d{5}$/.test(otp);

      if (isOtpValid) {
        // Success
        sessionStorage.setItem('auth_token', 'mock_secure_token_abc123');
        
        // Save username (first part of email or the phone number itself)
        const username = contactMethod === 'email' ? contact.split('@')[0] : contact;
        sessionStorage.setItem('username', username);
        
        router.push('/');
      } else {
        // Fail
        setError('Invalid OTP. Please enter any 5-digit PIN.');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 selection:bg-indigo-500/30 font-sans">
      {/* Background glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">GuardianX</h1>
          <p className="text-slate-400 text-sm mt-2 tracking-wide uppercase">Fleet Command Center</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-50" />

          {step === 1 ? (
            <form onSubmit={handleRequestOTP} className="space-y-6">
              
              {/* Contact Method Toggle */}
              <div className="flex p-1 bg-slate-950/50 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setContactMethod('email')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${contactMethod === 'email' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setContactMethod('phone')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${contactMethod === 'phone' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Phone Number
                </button>
              </div>

              {/* Contact Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {contactMethod === 'email' ? 'Fleet Admin Email' : 'Fleet Admin Phone'}
                </label>
                <input 
                  type={contactMethod === 'email' ? 'email' : 'tel'} 
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  placeholder={contactMethod === 'email' ? 'fleet.commander@company.com' : '9876543210'}
                  required
                />
              </div>

              {/* Location Details */}
              <div className="pt-4 border-t border-slate-800/80">
                <h3 className="text-sm font-semibold text-slate-300 mb-4">Regional Tracking Data</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Country</label>
                    <select 
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none"
                    >
                      <option value="India">India</option>
                      <option value="USA">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">State / Region</label>
                      <input 
                        type="text" 
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                        placeholder="Maharashtra"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">City</label>
                      <input 
                        type="text" 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                        placeholder="Mumbai"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-3 rounded-xl flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending Secure OTP...
                  </>
                ) : (
                  'Send Authentication Code'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                </div>
                <h2 className="text-xl font-bold text-slate-100">Verification Sent</h2>
                <p className="text-slate-400 text-sm mt-2">
                  Please enter the 5-digit code sent to <br/>
                  <span className="font-semibold text-slate-300">{contact}</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">Secure OTP</label>
                <input 
                  type="password" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl px-4 py-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-center text-2xl tracking-widest font-mono"
                  placeholder="•••••"
                  maxLength={5}
                  required
                />
              </div>

              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-3 rounded-xl flex items-center gap-2 justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading || otp.length < 5}
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Verify & Access'
                )}
              </button>

              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
              >
                Use a different contact method
              </button>
            </form>
          )}
          
          <div className="mt-8 text-center text-xs text-slate-600 font-mono">
            GuardianX Secure Auth v2.0
          </div>
        </div>
      </div>
    </div>
  );
}
