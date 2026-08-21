import React from 'react';
import { useApp } from '../../context/AppContext';

export const ElevatedActionModal: React.FC = () => {
  const { elevatedActionRequest, confirmElevatedAction, cancelElevatedAction, currentUser } = useApp();

  if (!elevatedActionRequest) return null;

  return (
    <div className="fixed inset-0 bg-[#1A1A1A]/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-[#FFFFFF] border-2 border-[#D4AF37] rounded-lg max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-[#1A1A1A]/10 pb-3">
          <div className="w-10 h-10 rounded bg-[#FBF4E8] text-[#9C5B23] flex items-center justify-center border border-[#9C5B23]/30 shrink-0">
            <span className="material-symbols-outlined text-[24px]">verified_user</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C733E]">
                Security Guardrail
              </span>
              <span className="text-[#1A1A1A]/30 text-xs">•</span>
              <span className="text-[10px] uppercase font-mono-data text-[#78746D]">
                Elevated Privilege Required
              </span>
            </div>
            <h3 className="text-[19px] font-serif font-bold text-[#1A1A1A] tracking-tight">
              {elevatedActionRequest.actionName}
            </h3>
          </div>
        </div>

        {/* Warning Details */}
        <div className="bg-[#F4F1EA] border border-[#1A1A1A]/10 rounded p-3.5 space-y-2 text-[12.5px]">
          <p className="text-[#1A1A1A] font-medium leading-relaxed">
            {elevatedActionRequest.description}
          </p>
          
          {elevatedActionRequest.impactWarning && (
            <div className="flex items-start gap-2 text-[#8B2626] font-medium bg-[#F9EBEB] p-2.5 rounded border border-[#8B2626]/20">
              <span className="material-symbols-outlined text-[17px] shrink-0 mt-0.5">error</span>
              <span>{elevatedActionRequest.impactWarning}</span>
            </div>
          )}

          <div className="pt-2 text-[11.5px] text-[#78746D] border-t border-[#1A1A1A]/10 flex items-center justify-between">
            <span>Executing Actor: <strong className="text-[#1A1A1A] font-mono-data">{currentUser.name} ({currentUser.role})</strong></span>
            <span>Target: <strong className="text-[#1A1A1A] font-mono-data">{elevatedActionRequest.resourceType} #{elevatedActionRequest.resourceId}</strong></span>
          </div>
        </div>

        <p className="text-[11.5px] text-[#78746D] font-serif italic">
          * This action will be immutably recorded in the Tenant Audit Trail with your cryptographic signature and session timestamp.
        </p>

        {/* Actions */}
        <div className="pt-2 border-t border-[#1A1A1A]/10 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={cancelElevatedAction}
            className="bg-[#FFFFFF] border border-[#1A1A1A]/20 hover:bg-[#F4F1EA] text-[#1A1A1A] px-4 py-2 rounded text-[12.5px] font-medium transition-colors cursor-pointer"
          >
            Cancel Action
          </button>
          <button
            type="button"
            onClick={confirmElevatedAction}
            className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F7F2] border border-[#D4AF37]/60 px-5 py-2 rounded text-[12.5px] font-medium tracking-wide flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-[0.99] transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">check_circle</span>
            <span>Authorize & Execute</span>
          </button>
        </div>
      </div>
    </div>
  );
};
