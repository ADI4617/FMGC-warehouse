import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const CollectionsManagement: React.FC = () => {
  const {
    customers,
    collections,
    setIsRecordPaymentOpen,
    setSelectedCustomerIdForPayment,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'aging' | 'receipts'>('aging');

  const totalOutstanding = customers.reduce((sum, c) => sum + c.outstandingBalance, 0);
  const totalOverdue = customers.reduce((sum, c) => sum + c.overdueAmount, 0);
  const totalCollectedToday = collections.reduce((sum, c) => sum + c.amount, 0);

  const handleSendReminder = (customerName: string) => {
    addToast('success', 'Reminder Sent', `Payment reminder SMS & WhatsApp dispatched to ${customerName}.`);
  };

  return (
    <div className="p-6 max-w-[1440px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-2 border-b border-[#1A1A1A]/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-editorial text-[#8C733E]">Financial Operations</span>
            <span className="text-[#1A1A1A]/30 text-xs">•</span>
            <span className="text-[10px] uppercase font-mono-data text-[#78746D]">Aging & Recovery Audit</span>
          </div>
          <h2 className="text-[32px] font-serif font-bold text-[#1A1A1A] tracking-tight">Collections & Receivables</h2>
          <p className="text-[13.5px] text-[#5C5850]">Credit aging analysis, field cash collections, and receipt records.</p>
        </div>
        <button
          onClick={() => {
            setSelectedCustomerIdForPayment(undefined);
            setIsRecordPaymentOpen(true);
          }}
          className="bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/50 text-[12px] font-medium py-2 px-4 rounded flex items-center gap-2 hover:bg-[#2A2A2A] transition-all shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">payments</span>
          Record Collection Receipt
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 p-4 rounded shadow-2xs">
          <span className="text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">Total Outstanding</span>
          <div className="text-[24px] font-bold text-[#1A1A1A] font-mono-data mt-1">
            ${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-[#5C5850]">Across all retailer ledgers</span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 p-4 rounded shadow-2xs">
          <span className="text-[10px] font-bold text-[#8B2626] uppercase tracking-editorial">Critical Overdue</span>
          <div className="text-[24px] font-bold text-[#8B2626] font-mono-data mt-1">
            ${totalOverdue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-[#8B2626] font-medium">&gt; 30-45 days unpaid</span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 p-4 rounded shadow-2xs">
          <span className="text-[10px] font-bold text-[#234E3E] uppercase tracking-editorial">Collected Today</span>
          <div className="text-[24px] font-bold text-[#234E3E] font-mono-data mt-1">
            ${totalCollectedToday.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-[#234E3E] font-medium">{collections.length} Money Receipts</span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 p-4 rounded shadow-2xs">
          <span className="text-[10px] font-bold text-[#8C733E] uppercase tracking-editorial">Collection Health</span>
          <div className="text-[24px] font-bold text-[#8C733E] font-mono-data mt-1">88.4%</div>
          <span className="text-[11px] text-[#8C733E] font-medium">On-time recovery rate</span>
        </div>
      </div>

      {/* Tab Controls */}
      <div className="flex border-b border-[#1A1A1A]/10 gap-6">
        <button
          onClick={() => setActiveTab('aging')}
          className={`pb-2.5 text-[13px] font-medium uppercase tracking-editorial transition-all border-b-2 cursor-pointer ${
            activeTab === 'aging'
              ? 'border-[#1A1A1A] text-[#1A1A1A] font-bold'
              : 'border-transparent text-[#78746D] hover:text-[#1A1A1A]'
          }`}
        >
          Receivables Aging Matrix
        </button>
        <button
          onClick={() => setActiveTab('receipts')}
          className={`pb-2.5 text-[13px] font-medium uppercase tracking-editorial transition-all border-b-2 cursor-pointer ${
            activeTab === 'receipts'
              ? 'border-[#1A1A1A] text-[#1A1A1A] font-bold'
              : 'border-transparent text-[#78746D] hover:text-[#1A1A1A]'
          }`}
        >
          Money Receipts Log ({collections.length})
        </button>
      </div>

      {/* Tab 1: Aging Analysis Table */}
      {activeTab === 'aging' && (
        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[12.5px]">
              <thead className="bg-[#F4F1EA] border-b border-[#1A1A1A]/10 text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">
                <tr>
                  <th className="p-3.5">Customer / Outlet</th>
                  <th className="p-3.5">Zone</th>
                  <th className="p-3.5 text-right">0 - 15 Days</th>
                  <th className="p-3.5 text-right">16 - 30 Days</th>
                  <th className="p-3.5 text-right">31 - 45 Days</th>
                  <th className="p-3.5 text-right">45+ Days (Overdue)</th>
                  <th className="p-3.5 text-right font-bold">Total Due</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/8 font-mono-data">
                {customers.map(c => {
                  const hasOverdue = c.overdueAmount > 0;
                  const currentBalance = Math.max(0, c.outstandingBalance - c.overdueAmount);
                  const bucket0_15 = currentBalance * 0.6;
                  const bucket16_30 = currentBalance * 0.4;
                  const bucket31_45 = c.overdueAmount * 0.4;
                  const bucket45Plus = c.overdueAmount * 0.6;

                  return (
                    <tr key={c.id} className="hover:bg-[#F4F1EA] transition-colors">
                      <td className="p-3.5 font-sans">
                        <div className="font-bold text-[#1A1A1A]">{c.name}</div>
                        <div className="text-[11px] text-[#78746D] font-mono-data">{c.storeName} ({c.code})</div>
                      </td>
                      <td className="p-3.5 font-sans text-[#5C5850] text-[11.5px]">{c.zone}</td>
                      <td className="p-3.5 text-right text-[#234E3E]">
                        ${bucket0_15 > 0 ? bucket0_15.toFixed(2) : '0.00'}
                      </td>
                      <td className="p-3.5 text-right text-[#1A1A1A]">
                        ${bucket16_30 > 0 ? bucket16_30.toFixed(2) : '0.00'}
                      </td>
                      <td className="p-3.5 text-right text-[#9C5B23]">
                        ${bucket31_45 > 0 ? bucket31_45.toFixed(2) : '0.00'}
                      </td>
                      <td className="p-3.5 text-right text-[#8B2626] font-bold">
                        ${bucket45Plus > 0 ? bucket45Plus.toFixed(2) : '0.00'}
                      </td>
                      <td className="p-3.5 text-right font-bold text-[#1A1A1A] text-[13.5px]">
                        ${c.outstandingBalance.toFixed(2)}
                      </td>
                      <td className="p-3.5 text-center font-sans">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedCustomerIdForPayment(c.id);
                              setIsRecordPaymentOpen(true);
                            }}
                            className="bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/40 text-[11px] font-medium px-2.5 py-1 rounded hover:bg-[#2A2A2A] shadow-2xs cursor-pointer"
                          >
                            Collect
                          </button>
                          {hasOverdue && (
                            <button
                              onClick={() => handleSendReminder(c.name)}
                              className="bg-[#EEEBE3] text-[#1A1A1A] border border-[#1A1A1A]/20 text-[11px] font-medium px-2 py-1 rounded hover:bg-[#E2DDD2] cursor-pointer"
                              title="Send WhatsApp / SMS Reminder"
                            >
                              Remind
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Money Receipts History */}
      {activeTab === 'receipts' && (
        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded shadow-2xs overflow-hidden">
          <table className="w-full text-left border-collapse text-[12.5px]">
            <thead className="bg-[#F4F1EA] border-b border-[#1A1A1A]/10 text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">
              <tr>
                <th className="p-3.5">Receipt #</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Date & Time</th>
                <th className="p-3.5 text-right">Amount Collected</th>
                <th className="p-3.5">Method</th>
                <th className="p-3.5">Recorded By</th>
                <th className="p-3.5">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/8 font-mono-data">
              {collections.map(col => (
                <tr key={col.id} className="hover:bg-[#F4F1EA]">
                  <td className="p-3.5 font-bold text-[#1A1A1A]">{col.receiptNumber}</td>
                  <td className="p-3.5 font-sans font-medium text-[#1A1A1A]">{col.customerName}</td>
                  <td className="p-3.5 font-sans text-[#78746D] text-[11.5px]">{col.date} {col.time}</td>
                  <td className="p-3.5 text-right font-bold text-[#234E3E] text-[13.5px]">
                    +${col.amount.toFixed(2)}
                  </td>
                  <td className="p-3.5 font-sans">
                    <span className="bg-[#EEEBE3] border border-[#1A1A1A]/10 text-[#1A1A1A] text-[10.5px] font-medium px-2 py-0.5 rounded font-mono-data">
                      {col.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3.5 font-sans text-[#5C5850] text-[11.5px]">{col.recordedBy}</td>
                  <td className="p-3.5 font-sans text-[#78746D] text-[11.5px]">{col.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
