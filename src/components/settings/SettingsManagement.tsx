import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const SettingsManagement: React.FC = () => {
  const { resetToDefaults, addToast } = useApp();

  const [companyName, setCompanyName] = useState('FMCG Distro Hub Ltd');
  const [gstin, setGstin] = useState('27AAACF8899K1Z4');
  const [defaultCreditDays, setDefaultCreditDays] = useState('30');
  const [fefoAlertHorizon, setFefoAlertHorizon] = useState('15');
  const [lowStockThresholdRatio, setLowStockThresholdRatio] = useState('20');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Settings Saved', 'System configurations updated.');
  };

  return (
    <div className="p-6 max-w-[1000px] mx-auto space-y-6">
      <div className="pb-2 border-b border-[#1A1A1A]/10">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase font-bold tracking-editorial text-[#8C733E]">System Administration</span>
          <span className="text-[#1A1A1A]/30 text-xs">•</span>
          <span className="text-[10px] uppercase font-mono-data text-[#78746D]">Configuration Ledger</span>
        </div>
        <h2 className="text-[32px] font-serif font-bold text-[#1A1A1A] tracking-tight">System Settings & Master Config</h2>
        <p className="text-[13.5px] text-[#5C5850]">Configure distribution business profile, tax parameters, and AI thresholds.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Profile */}
        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded p-5 shadow-2xs space-y-4">
          <h3 className="text-[16px] font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8C733E]">business</span>
            Distributorship Entity Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
            <div>
              <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Company Trade Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2 bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded text-[#1A1A1A] font-medium outline-none focus:border-[#1A1A1A]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Tax / GSTIN Number</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full p-2 bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded font-mono-data text-[#1A1A1A] font-medium outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </div>
        </div>

        {/* AI & FEFO Thresholds */}
        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded p-5 shadow-2xs space-y-4">
          <h3 className="text-[16px] font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8C733E]">auto_awesome</span>
            AI Optimizer & FEFO Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[13px]">
            <div>
              <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">FEFO Critical Horizon (Days)</label>
              <input
                type="number"
                value={fefoAlertHorizon}
                onChange={(e) => setFefoAlertHorizon(e.target.value)}
                className="w-full p-2 bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded font-mono-data text-[#1A1A1A] font-medium outline-none focus:border-[#1A1A1A]"
              />
              <span className="text-[10.5px] text-[#78746D] mt-0.5 block">Trigger promo below this day mark</span>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Default Customer Credit Days</label>
              <input
                type="number"
                value={defaultCreditDays}
                onChange={(e) => setDefaultCreditDays(e.target.value)}
                className="w-full p-2 bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded font-mono-data text-[#1A1A1A] font-medium outline-none focus:border-[#1A1A1A]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Reorder Safety Buffer (%)</label>
              <input
                type="number"
                value={lowStockThresholdRatio}
                onChange={(e) => setLowStockThresholdRatio(e.target.value)}
                className="w-full p-2 bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded font-mono-data text-[#1A1A1A] font-medium outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={() => {
              if (confirm("Reset all databases to default demo state? This will restore sample invoices and batches.")) {
                resetToDefaults();
              }
            }}
            className="bg-[#EEEBE3] text-[#8B2626] border border-[#8B2626]/20 hover:bg-[#E2DDD2] text-[12px] font-medium px-4 py-2 rounded transition-colors cursor-pointer"
          >
            Reset Database to Demo Dataset
          </button>

          <button
            type="submit"
            className="bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/50 text-[12.5px] font-medium px-6 py-2 rounded hover:bg-[#2A2A2A] transition-all shadow-2xs cursor-pointer"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
