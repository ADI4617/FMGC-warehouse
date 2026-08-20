import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BusinessTenant } from '../../types';

export const PlatformAdminPage: React.FC = () => {
  const { currentTenant, updateTenant, navigateTo, addToast } = useApp();

  const [tenants, setTenants] = useState<BusinessTenant[]>([
    currentTenant,
    {
      id: 'tnt-002',
      name: 'Metro FastMoving Goods Ltd.',
      legalEntity: 'Metro Distribution Services LLP',
      gstin: '29AABCM5678R1Z2',
      email: 'logistics@metrofmcg.com',
      phone: '+91 80 4112 8800',
      address: 'Industrial Estate, Phase II, Peenya',
      city: 'Bangalore',
      state: 'Karnataka',
      currency: 'USD',
      plan: 'Growth',
      status: 'active',
      createdDate: '2025-06-18',
      totalSkusCount: 28,
      monthlyRevenueEstimate: 512000
    },
    {
      id: 'tnt-003',
      name: 'Delta Beverage & Confectionery',
      legalEntity: 'Delta Trade Corporation',
      gstin: '07AABCD9912K1Z9',
      email: 'ops@deltabev.com',
      phone: '+91 11 2920 4411',
      address: 'Okhla Industrial Area, Phase III',
      city: 'New Delhi',
      state: 'Delhi',
      currency: 'USD',
      plan: 'Enterprise',
      status: 'active',
      createdDate: '2025-07-22',
      totalSkusCount: 45,
      monthlyRevenueEstimate: 780000
    },
    {
      id: 'tnt-004',
      name: 'Coastal Supply Network',
      legalEntity: 'Coastal Wholesale & Retail Distributors',
      gstin: '33AABCC3344P1Z4',
      email: 'contact@coastalsupply.in',
      phone: '+91 44 2811 7733',
      address: 'Harbor Road, Guindy',
      city: 'Chennai',
      state: 'Tamil Nadu',
      currency: 'USD',
      plan: 'Starter',
      status: 'trial',
      createdDate: '2026-08-01',
      totalSkusCount: 8,
      monthlyRevenueEstimate: 85000
    }
  ]);

  const [filterPlan, setFilterPlan] = useState('All');

  const filteredTenants = tenants.filter(t => {
    if (filterPlan !== 'All' && t.plan !== filterPlan) return false;
    return true;
  });

  const totalGMV = tenants.reduce((sum, t) => sum + (t.monthlyRevenueEstimate || 0), 0);

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Platform Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-3 border-b border-[#1A1A1A]/10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8B2626]">
              Root SaaS Infrastructure
            </span>
            <span className="text-[#1A1A1A]/30 text-xs">•</span>
            <span className="text-[10px] uppercase font-mono-data text-[#78746D]">
              Platform Super Admin
            </span>
          </div>
          <h2 className="text-[30px] sm:text-[34px] font-serif font-bold text-[#1A1A1A] tracking-tight">
            Platform Master Console
          </h2>
          <p className="text-[13.5px] text-[#5C5850] mt-0.5">
            Cross-tenant orchestration, SaaS subscription tier management, and real-time ERP infrastructure metrics.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigateTo('/dashboard')}
            className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F7F2] border border-[#D4AF37]/50 px-4 py-2 rounded text-[12.5px] font-medium tracking-wide flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">dashboard</span>
            <span>Return to Tenant Workspace</span>
          </button>
        </div>
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded-lg p-4 shadow-2xs">
          <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#78746D] block">
            Provisioned Tenants
          </span>
          <div className="text-[26px] font-mono-data font-bold text-[#1A1A1A] mt-0.5">
            {tenants.length} Active
          </div>
          <p className="text-[11px] text-[#234E3E] font-medium mt-1 font-mono-data">
            100% Isolated Data Boundaries
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded-lg p-4 shadow-2xs">
          <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#78746D] block">
            Aggregated Monthly GMV
          </span>
          <div className="text-[26px] font-mono-data font-bold text-[#234E3E] mt-0.5">
            ${totalGMV.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#78746D] mt-1 font-serif italic">
            Across registered distributor depots
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded-lg p-4 shadow-2xs">
          <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#78746D] block">
            AI Scanner Ingestion Rate
          </span>
          <div className="text-[26px] font-mono-data font-bold text-[#8C733E] mt-0.5">
            99.4%
          </div>
          <p className="text-[11px] text-[#5C5850] mt-1 font-mono-data">
            Gemini Vision OCR Confidence
          </p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded-lg p-4 shadow-2xs">
          <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#78746D] block">
            Infrastructure Uptime
          </span>
          <div className="text-[26px] font-mono-data font-bold text-[#234E3E] mt-0.5">
            99.98%
          </div>
          <p className="text-[11px] text-[#5C5850] mt-1 font-serif italic">
            Zero ledger drift detected
          </p>
        </div>
      </div>

      {/* Tenants Roster Table */}
      <div className="bg-[#FFFFFF] border border-[#1A1A1A]/15 rounded-lg shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#1A1A1A]/10 bg-[#FBF9F4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif font-bold text-[17px] text-[#1A1A1A]">
              Distribution Business Tenants
            </h3>
            <p className="text-[12px] text-[#5C5850]">
              Multi-tenant root partitions with individual encrypted audit logs and catalog boundaries.
            </p>
          </div>

          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="bg-[#FFFFFF] border border-[#1A1A1A]/20 rounded px-3 py-1 text-[12px] font-medium outline-none cursor-pointer"
          >
            <option value="All">All Plans</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Growth">Growth</option>
            <option value="Starter">Starter</option>
          </select>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-[12.5px] border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#F4F1EA] border-b border-[#1A1A1A]/12 text-[10px] font-bold text-[#78746D] uppercase tracking-widest">
                <th className="p-3.5 pl-5">Tenant ID & Legal Entity</th>
                <th className="p-3.5">City / Region</th>
                <th className="p-3.5">Plan Tier</th>
                <th className="p-3.5">Tax GSTIN</th>
                <th className="p-3.5">Catalog SKUs</th>
                <th className="p-3.5">Est. Monthly GMV</th>
                <th className="p-3.5 text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/8">
              {filteredTenants.map((t) => {
                const isCurrent = t.id === currentTenant.id;

                return (
                  <tr key={t.id} className="hover:bg-[#F9F7F2]/80 transition-colors">
                    <td className="p-3.5 pl-5">
                      <div className="font-semibold text-[#1A1A1A] flex items-center gap-2">
                        <span>{t.name}</span>
                        {isCurrent && (
                          <span className="text-[9.5px] bg-[#1A1A1A] text-[#D4AF37] px-2 py-0.5 rounded font-mono-data font-bold">
                            CURRENT WORKSPACE
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#78746D] font-mono-data">{t.id} • {t.legalEntity}</div>
                    </td>

                    <td className="p-3.5 text-[#5C5850]">
                      {t.city}, {t.state}
                    </td>

                    <td className="p-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        t.plan === 'Enterprise'
                          ? 'bg-[#F4F1EA] text-[#8C733E] border border-[#8C733E]/30'
                          : t.plan === 'Growth'
                          ? 'bg-[#EBF5EE] text-[#234E3E] border border-[#234E3E]/30'
                          : 'bg-[#F4F1EA] text-[#78746D] border border-[#1A1A1A]/10'
                      }`}>
                        {t.plan}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono-data text-[11px] text-[#1A1A1A]">
                      {t.gstin}
                    </td>

                    <td className="p-3.5 font-mono-data text-[#1A1A1A]">
                      {t.totalSkusCount} SKUs
                    </td>

                    <td className="p-3.5 font-mono-data font-bold text-[#234E3E]">
                      ${(t.monthlyRevenueEstimate || 0).toLocaleString()}
                    </td>

                    <td className="p-3.5 text-right pr-5">
                      <button
                        onClick={() => {
                          updateTenant(t);
                          addToast('success', 'Switched Tenant Partition', `Now operating under tenant partition: ${t.name}`);
                          navigateTo('/dashboard');
                        }}
                        className="bg-[#FFFFFF] hover:bg-[#F4F1EA] border border-[#1A1A1A]/20 text-[#1A1A1A] px-2.5 py-1 rounded text-[11.5px] font-medium transition-colors cursor-pointer"
                      >
                        Enter Workspace
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
