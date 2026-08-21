import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, users, navigateTo } = useApp();
  
  const [email, setEmail] = useState('rajesh.k@apexfmcg.com');
  const [password, setPassword] = useState('ApexSecure2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your work email address.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const success = login(email, password);
      setIsLoading(false);
      if (!success) {
        setErrorMessage('Invalid credentials or account suspended. Try a demo persona below.');
      }
    }, 450);
  };

  const handleQuickPersona = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('ApexSecure2026!');
    setIsLoading(true);
    setTimeout(() => {
      login(userEmail, 'ApexSecure2026!');
      setIsLoading(false);
    }, 300);
  };

  const demoPersonas: { name: string; role: UserRole; email: string; avatar: string; desc: string }[] = [
    {
      name: 'Sarah Jenkins',
      role: 'Owner',
      email: 'sarah.j@apexfmcg.com',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLOB9lDQ_LVO4gdlt2o1hqXMadKA61JyF6FNwOL_VEqtLBlBiuseCtWrTL9wgQ5H71Y17lsn5v6fDPq57zfTbrk-K0fSyE5r1UPwovN4krnqcmiA14c0DKGv6p3PqyTqgSo7a3nBrBbDYqkmy2EhX20YMy49WMe6diSAZvR_e1hVHxapSI_TuLX04FxOGjC6A078PuK0Wy4bi_1sNPMtOd7blFHn8rOjMM4987JUBvl4x9PY5rRxs',
      desc: 'Master tenant ownership & root controls'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Admin',
      email: 'rajesh.k@apexfmcg.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      desc: 'Full operational, staff & security access'
    },
    {
      name: 'Amit Sharma',
      role: 'Warehouse',
      email: 'amit.s@apexfmcg.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      desc: 'Stock inward, FEFO & AI scanner'
    },
    {
      name: 'Priya Patil',
      role: 'Sales Staff',
      email: 'priya.p@apexfmcg.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      desc: 'Route sales, POS billing & order dispatch'
    },
    {
      name: 'Sneha Joshi',
      role: 'Collection Staff',
      email: 'sneha.j@apexfmcg.com',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      desc: 'Cash collection & credit ledger control'
    },
    {
      name: 'Ananya Deshmukh',
      role: 'Viewer',
      email: 'ananya.d@apexfmcg.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      desc: 'Read-only financial and ledger audits'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#F9F7F2] flex flex-col justify-between text-[#1A1A1A]">
      {/* Top Editorial Banner */}
      <header className="px-6 lg:px-12 py-5 border-b border-[#1A1A1A]/10 bg-[#FFFFFF]/80 backdrop-blur-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#1A1A1A] text-[#F9F7F2] flex items-center justify-center border border-[#D4AF37]/60 shadow-xs">
            <span className="material-symbols-outlined text-[19px] text-[#D4AF37] fill-1">account_balance</span>
          </div>
          <div>
            <h1 className="font-serif font-bold text-[18px] leading-tight text-[#1A1A1A] tracking-tight">FMCG DISTRO</h1>
            <p className="text-[9px] uppercase tracking-widest font-semibold text-[#78746D]">Supply Ledger & ERP • v2.4</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[13px]">
          <span className="text-[#78746D] hidden sm:inline">Need to onboard a new distribution warehouse?</span>
          <button
            onClick={() => navigateTo('/signup')}
            className="text-[#8C733E] hover:text-[#1A1A1A] font-semibold underline underline-offset-4 transition-colors cursor-pointer"
          >
            Create your business &rarr;
          </button>
        </div>
      </header>

      {/* Main Split Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Brand Story & Live Operational Previews */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#F4F1EA] border border-[#D4AF37]/40 px-3 py-1 rounded text-[11px] font-semibold text-[#8C733E] tracking-wider uppercase">
              <span className="material-symbols-outlined text-[15px] fill-1 text-[#D4AF37]">auto_awesome</span>
              AI-Powered Distribution Management
            </div>

            <h2 className="text-[36px] sm:text-[46px] font-serif font-bold tracking-tight text-[#1A1A1A] leading-[1.12]">
              Run your distribution operation from one modern platform.
            </h2>
            
            <p className="text-[15.5px] text-[#5C5850] font-sans leading-relaxed max-w-xl">
              AI handles repetitive purchase ingestion, automatic FEFO batch rotation, and credit reconciliation — surfacing the key commercial decisions that protect your working capital.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="bg-[#FFFFFF] border border-[#1A1A1A]/10 rounded p-3.5 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="w-6 h-6 rounded bg-[#F4F1EA] text-[#234E3E] flex items-center justify-center border border-[#234E3E]/20">
                  <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                </span>
                <h4 className="font-serif font-bold text-[13.5px] text-[#1A1A1A]">Batch-Level FEFO Control</h4>
              </div>
              <p className="text-[11.5px] text-[#5C5850]">Automated expiry tracking, dynamic clearance discounts, and zero shrinkage loss.</p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#1A1A1A]/10 rounded p-3.5 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="w-6 h-6 rounded bg-[#F4F1EA] text-[#8C733E] flex items-center justify-center border border-[#8C733E]/20">
                  <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                </span>
                <h4 className="font-serif font-bold text-[13.5px] text-[#1A1A1A]">AI Inward Invoice Scanner</h4>
              </div>
              <p className="text-[11.5px] text-[#5C5850]">Extract supplier bills, resolve uncertain line items, and post directly to warehouse stock.</p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#1A1A1A]/10 rounded p-3.5 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="w-6 h-6 rounded bg-[#F4F1EA] text-[#1A1A1A] flex items-center justify-center border border-[#1A1A1A]/20">
                  <span className="material-symbols-outlined text-[14px]">point_of_sale</span>
                </span>
                <h4 className="font-serif font-bold text-[13.5px] text-[#1A1A1A]">Route Sales & POS Billing</h4>
              </div>
              <p className="text-[11.5px] text-[#5C5850]">Field order intake, instant money receipts, and automated credit limit thresholds.</p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#1A1A1A]/10 rounded p-3.5 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="w-6 h-6 rounded bg-[#F4F1EA] text-[#8B2626] flex items-center justify-center border border-[#8B2626]/20">
                  <span className="material-symbols-outlined text-[14px]">shield_person</span>
                </span>
                <h4 className="font-serif font-bold text-[13.5px] text-[#1A1A1A]">Strict Multi-Tenant RBAC</h4>
              </div>
              <p className="text-[11.5px] text-[#5C5850]">Role-based access matrix, sensitive action elevated approvals, and tamper-proof audit trails.</p>
            </div>
          </div>

          {/* Quick Demo Persona Bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#78746D]">
                One-Click Instant Persona Sign In:
              </span>
              <span className="text-[10.5px] text-[#8C733E] font-medium">Select any role to test system</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {demoPersonas.map((persona, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickPersona(persona.email)}
                  className="flex items-center gap-2 bg-[#FFFFFF] hover:bg-[#F4F1EA] border border-[#1A1A1A]/15 hover:border-[#D4AF37] p-2 rounded text-left transition-all cursor-pointer group shadow-2xs"
                >
                  <img
                    src={persona.avatar}
                    alt={persona.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#1A1A1A]/20 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0">
                    <p className="text-[11.5px] font-bold text-[#1A1A1A] truncate">{persona.name}</p>
                    <span className="text-[9.5px] font-mono-data uppercase font-semibold text-[#8C733E] block">
                      {persona.role}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div className="lg:col-span-5">
          <div className="bg-[#FFFFFF] border border-[#1A1A1A]/15 rounded-lg p-6 sm:p-8 shadow-[0_8px_30px_rgba(26,26,26,0.06)] relative">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C733E]">Secure Terminal</span>
                <span className="text-[#1A1A1A]/30 text-xs">•</span>
                <span className="text-[10px] uppercase font-mono-data text-[#78746D]">Apex FMCG Hub</span>
              </div>
              <h3 className="text-[26px] font-serif font-bold text-[#1A1A1A] tracking-tight">Welcome back</h3>
              <p className="text-[13px] text-[#5C5850] mt-0.5">Sign in to your distribution workspace</p>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="mb-4 bg-[#F9EBEB] border border-[#8B2626]/30 text-[#8B2626] rounded p-3 text-[12.5px] flex items-center gap-2 animate-in fade-in">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#78746D] text-[18px]">
                    mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[#F4F1EA] border border-[#1A1A1A]/20 focus:border-[#1A1A1A] focus:bg-[#FFFFFF] rounded pl-9 pr-3 py-2.5 text-[13px] text-[#1A1A1A] placeholder-[#78746D] outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => navigateTo('/forgot-password')}
                    className="text-[11.5px] text-[#8C733E] hover:text-[#1A1A1A] font-medium transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#78746D] text-[18px]">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#F4F1EA] border border-[#1A1A1A]/20 focus:border-[#1A1A1A] focus:bg-[#FFFFFF] rounded pl-9 pr-10 py-2.5 text-[13px] text-[#1A1A1A] placeholder-[#78746D] outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78746D] hover:text-[#1A1A1A] cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[12.5px] text-[#5C5850]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#1A1A1A]/30 text-[#1A1A1A] focus:ring-0 cursor-pointer"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F7F2] border border-[#D4AF37]/50 font-medium py-2.5 px-4 rounded text-[13px] tracking-wide flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-[0.99] transition-all disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    <span>Authenticating Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Workspace</span>
                    <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">arrow_forward</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#1A1A1A]/10" />
                </div>
                <div className="relative flex justify-center text-[10.5px] uppercase tracking-widest">
                  <span className="bg-[#FFFFFF] px-2 text-[#78746D] font-mono-data">or connect with sso</span>
                </div>
              </div>

              {/* Google / SAML SSO Button */}
              <button
                type="button"
                onClick={() => handleQuickPersona('sarah.j@apexfmcg.com')}
                className="w-full bg-[#FFFFFF] hover:bg-[#F4F1EA] border border-[#1A1A1A]/20 text-[#1A1A1A] py-2 px-4 rounded text-[12.5px] font-medium flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google Workspace</span>
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-[#1A1A1A]/10 text-center text-[12.5px] text-[#5C5850]">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => navigateTo('/signup')}
                className="font-bold text-[#8C733E] hover:text-[#1A1A1A] underline underline-offset-2 transition-colors cursor-pointer"
              >
                Create your business
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-4 border-t border-[#1A1A1A]/10 bg-[#FFFFFF]/60 flex flex-col sm:flex-row items-center justify-between text-[11.5px] text-[#78746D]">
        <p>© 2026 FMCG Distro Inc. All rights reserved. Encrypted 256-bit ledger transport.</p>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <button onClick={() => navigateTo('/platform-admin')} className="hover:text-[#1A1A1A] transition-colors cursor-pointer">
            Platform Admin Console
          </button>
          <span>•</span>
          <span className="hover:text-[#1A1A1A] cursor-pointer">Terms of Service</span>
          <span>•</span>
          <span className="hover:text-[#1A1A1A] cursor-pointer">Security & Compliance</span>
        </div>
      </footer>
    </div>
  );
};
