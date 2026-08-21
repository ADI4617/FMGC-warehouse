import React from 'react';
import { useApp } from '../../context/AppContext';

export const NotificationToast: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-[#FFFFFF] rounded p-4 shadow-xl border flex items-start gap-3 animate-in slide-in-from-bottom-3 duration-200 ${
              isSuccess ? 'border-[#234E3E]/40' : isWarning ? 'border-[#8C733E]/40' : isError ? 'border-[#8B2626]/40' : 'border-[#1A1A1A]/20'
            }`}
          >
            <div
              className={`w-7 h-7 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                isSuccess
                  ? 'bg-[#234E3E]/10 text-[#234E3E]'
                  : isWarning
                  ? 'bg-[#8C733E]/10 text-[#8C733E]'
                  : isError
                  ? 'bg-[#8B2626]/10 text-[#8B2626]'
                  : 'bg-[#1A1A1A]/10 text-[#1A1A1A]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isSuccess ? 'check_circle' : isWarning ? 'warning' : isError ? 'error' : 'info'}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-[13px] font-serif font-bold text-[#1A1A1A] leading-tight">{toast.title}</h4>
              <p className="text-[12px] text-[#5C5850] mt-0.5 leading-snug">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#78746D] hover:text-[#1A1A1A] p-1 shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
