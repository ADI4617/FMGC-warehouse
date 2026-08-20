import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword, navigateTo } = useApp();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      forgotPassword(email);
      setIsLoading(false);
      setIsSubmitted(true);
    }, 450);
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

        <button
          onClick={() => navigateTo('/login')}
          className="text-[13px] text-[#8C733E] hover:text-[#1A1A1A] font-semibold underline underline-offset-4 transition-colors cursor-pointer"
        >
          &larr; Back to sign in
        </button>
      </header>

      {/* Main Box */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-12 flex items-center">
        <div className="w-full bg-[#FFFFFF] border border-[#1A1A1A]/15 rounded-lg p-6 sm:p-8 shadow-[0_8px_30px_rgba(26,26,26,0.06)]">
          {!isSubmitted ? (
            <>
              <div className="mb-6">
                <div className="w-10 h-10 rounded bg-[#F4F1EA] text-[#8C733E] flex items-center justify-center border border-[#8C733E]/20 mb-3">
                  <span className="material-symbols-outlined text-[22px]">lock_reset</span>
                </div>
                <h3 className="text-[24px] font-serif font-bold text-[#1A1A1A] tracking-tight">
                  Recover Your Credentials
                </h3>
                <p className="text-[13px] text-[#5C5850] mt-1">
                  Enter your registered work email. We&apos;ll dispatch a secure recovery token to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#78746D] text-[18px]">
                      mail
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rajesh.k@apexfmcg.com"
                      className="w-full bg-[#F4F1EA] border border-[#1A1A1A]/20 focus:border-[#1A1A1A] focus:bg-[#FFFFFF] rounded pl-9 pr-3 py-2.5 text-[13px] text-[#1A1A1A] placeholder-[#78746D] outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F7F2] border border-[#D4AF37]/50 font-medium py-2.5 px-4 rounded text-[13px] tracking-wide flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-[0.99] transition-all disabled:opacity-75"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                      <span>Dispatching Link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Recovery Instructions</span>
                      <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">send</span>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4 space-y-4 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-[#EBF5EE] text-[#234E3E] flex items-center justify-center border border-[#234E3E]/30 mx-auto">
                <span className="material-symbols-outlined text-[24px]">mark_email_read</span>
              </div>
              <h3 className="text-[22px] font-serif font-bold text-[#1A1A1A]">Check Your Inbox</h3>
              <p className="text-[13px] text-[#5C5850] leading-relaxed">
                We have transmitted instructions to <strong className="text-[#1A1A1A] font-mono-data">{email}</strong>. Follow the encrypted link to set a new password.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigateTo('/login')}
                  className="w-full bg-[#1A1A1A] text-[#F9F7F2] py-2 px-4 rounded text-[13px] font-medium border border-[#D4AF37]/40 cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-[#1A1A1A]/10 text-center text-[12px] text-[#78746D]">
            Need help? Contact system administrator or Super Admin.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-4 border-t border-[#1A1A1A]/10 bg-[#FFFFFF]/60 text-center text-[11.5px] text-[#78746D]">
        © 2026 FMCG Distro Inc. All rights reserved.
      </footer>
    </div>
  );
};
