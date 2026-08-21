import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const SignupPage: React.FC = () => {
  const { signup, navigateTo } = useApp();

  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [plan, setPlan] = useState<'Enterprise' | 'Growth' | 'Starter'>('Enterprise');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !businessName.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms of Service to provision your tenant.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const success = signup({
        fullName,
        businessName,
        email,
        phone,
        password,
        plan
      });
      setIsLoading(false);
      if (!success) {
        setErrorMessage('Failed to create business workspace. Please verify your inputs.');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#F9F7F2] flex flex-col justify-between text-[#1A1A1A]">
      {/* Header */}
      <header className="px-6 lg:px-12 py-5 border-b border-[#1A1A1A]/10 bg-[#FFFFFF]/80 backdrop-blur-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#1A1A1A] text-[#F9F7F2] flex items-center justify-center border border-[#D4AF37]/60 shadow-xs">
            <span className="material-symbols-outlined text-[19px] text-[#D4AF37] fill-1">account_balance</span>
          </div>
          <div>
            <h1 className="font-serif font-bold text-[18px] leading-tight text-[#1A1A1A] tracking-tight">FMCG DISTRO</h1>
            <p className="text-[9px] uppercase tracking-widest font-semibold text-[#78746D]">Supply Ledger & ERP</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[13px]">
          <span className="text-[#78746D] hidden sm:inline">Already registered?</span>
          <button
            onClick={() => navigateTo('/login')}
            className="text-[#8C733E] hover:text-[#1A1A1A] font-semibold underline underline-offset-4 transition-colors cursor-pointer"
          >
            Sign in &rarr;
          </button>
        </div>
      </header>

      {/* Main Form Box */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/15 rounded-lg p-6 sm:p-10 shadow-[0_8px_30px_rgba(26,26,26,0.06)]">
          
          <div className="mb-6 pb-4 border-b border-[#1A1A1A]/10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C733E]">Organization Onboarding</span>
              <span className="text-[#1A1A1A]/30 text-xs">•</span>
              <span className="text-[10px] uppercase font-mono-data text-[#78746D]">Root Tenant Setup</span>
            </div>
            <h2 className="text-[28px] sm:text-[32px] font-serif font-bold text-[#1A1A1A] tracking-tight">
              Create Your Business Workspace
            </h2>
            <p className="text-[13.5px] text-[#5C5850] mt-1">
              Set up your master distribution hub, inventory ledgers, and assign yourself as the root Owner.
            </p>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="mb-5 bg-[#F9EBEB] border border-[#8B2626]/30 text-[#8B2626] rounded p-3 text-[12.5px] flex items-center gap-2 animate-in fade-in">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-[#F4F1EA] border border-[#1A1A1A]/20 focus:border-[#1A1A1A] focus:bg-[#FFFFFF] rounded px-3 py-2 text-[13px] text-[#1A1A1A] placeholder-[#78746D] outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                  Business / Trading Name *
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Apex Consumer Distribution Ltd."
                  className="w-full bg-[#F4F1EA] border border-[#1A1A1A]/20 focus:border-[#1A1A1A] focus:bg-[#FFFFFF] rounded px-3 py-2 text-[13px] text-[#1A1A1A] placeholder-[#78746D] outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                  Work Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@apexfmcg.com"
                  className="w-full bg-[#F4F1EA] border border-[#1A1A1A]/20 focus:border-[#1A1A1A] focus:bg-[#FFFFFF] rounded px-3 py-2 text-[13px] text-[#1A1A1A] placeholder-[#78746D] outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                  Mobile / Contact Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98200 12345"
                  className="w-full bg-[#F4F1EA] border border-[#1A1A1A]/20 focus:border-[#1A1A1A] focus:bg-[#FFFFFF] rounded px-3 py-2 text-[13px] text-[#1A1A1A] placeholder-[#78746D] outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                  Master Password *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-[#F4F1EA] border border-[#1A1A1A]/20 focus:border-[#1A1A1A] focus:bg-[#FFFFFF] rounded px-3 py-2 text-[13px] text-[#1A1A1A] placeholder-[#78746D] outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full bg-[#F4F1EA] border border-[#1A1A1A]/20 focus:border-[#1A1A1A] focus:bg-[#FFFFFF] rounded px-3 py-2 text-[13px] text-[#1A1A1A] placeholder-[#78746D] outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Plan Tier Selector */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-2">
                Select Edition / Tier
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'Starter', label: 'Starter', desc: 'Up to 5 staff • Core POS' },
                  { id: 'Growth', label: 'Growth', desc: 'Up to 25 staff • AI Scanner' },
                  { id: 'Enterprise', label: 'Enterprise', desc: 'Unlimited • Full RBAC & API' }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setPlan(tier.id as any)}
                    className={`p-3 rounded border text-left transition-all cursor-pointer ${
                      plan === tier.id
                        ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#F9F7F2] shadow-xs'
                        : 'border-[#1A1A1A]/15 bg-[#F4F1EA] text-[#1A1A1A] hover:border-[#1A1A1A]'
                    }`}
                  >
                    <span className="text-[12.5px] font-bold block">{tier.label}</span>
                    <span className={`text-[10px] block mt-0.5 ${plan === tier.id ? 'text-[#D4AF37]' : 'text-[#78746D]'}`}>
                      {tier.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-[12px] text-[#5C5850]">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[#1A1A1A]/30 text-[#1A1A1A] focus:ring-0 cursor-pointer"
                />
                <span>
                  I agree to the FMCG Distro Terms of Service, Multi-Tenant Data Isolation Policy, and 256-bit Encrypted Ledger Agreement.
                </span>
              </label>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F7F2] border border-[#D4AF37]/50 font-medium py-3 px-4 rounded text-[13.5px] tracking-wide flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-[0.99] transition-all disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    <span>Provisioning Tenant Workspace & Ledgers...</span>
                  </>
                ) : (
                  <>
                    <span>Create Business Workspace</span>
                    <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">check_circle</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-[#1A1A1A]/10 text-center text-[12.5px] text-[#5C5850]">
            Already have an active tenant account?{' '}
            <button
              onClick={() => navigateTo('/login')}
              className="font-bold text-[#8C733E] hover:text-[#1A1A1A] underline underline-offset-2 transition-colors cursor-pointer"
            >
              Sign in to workspace
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-4 border-t border-[#1A1A1A]/10 bg-[#FFFFFF]/60 text-center text-[11.5px] text-[#78746D]">
        © 2026 FMCG Distro Inc. Cloud ERP Platform for Consumer Goods Distribution.
      </footer>
    </div>
  );
};
