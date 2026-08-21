import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AiInvoiceScanner } from './AiInvoiceScanner';

export const PurchaseManagement: React.FC = () => {
  const { purchases, isAddStockOpen, setIsAddStockOpen } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'scanner' | 'history'>('scanner');

  return (
    <div className="space-y-4">
      {/* Subtab navigation */}
      <div className="bg-[#FFFFFF] border-b border-[#1A1A1A]/10 px-6 pt-3 flex items-center justify-between">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveSubTab('scanner')}
            className={`pb-3 text-[12.5px] font-bold tracking-wide transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeSubTab === 'scanner'
                ? 'border-[#1A1A1A] text-[#1A1A1A]'
                : 'border-transparent text-[#78746D] hover:text-[#1A1A1A]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#8C733E] fill-1">auto_awesome</span>
            AI Invoice Scanner & Verification
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`pb-3 text-[12.5px] font-bold tracking-wide transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeSubTab === 'history'
                ? 'border-[#1A1A1A] text-[#1A1A1A]'
                : 'border-transparent text-[#78746D] hover:text-[#1A1A1A]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#78746D]">history</span>
            Inbound Purchase Log ({purchases.length})
          </button>
        </div>

        <button
          onClick={() => setIsAddStockOpen(true)}
          className="bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/50 text-[11.5px] font-medium py-1.5 px-3.5 rounded mb-2 flex items-center gap-1.5 cursor-pointer shadow-xs hover:bg-[#2A2A2A]"
        >
          <span className="material-symbols-outlined text-[15px] text-[#D4AF37]">add</span>
          Manual Lot Entry
        </button>
      </div>

      {activeSubTab === 'scanner' ? (
        <AiInvoiceScanner />
      ) : (
        <div className="p-6 max-w-[1440px] mx-auto">
          <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-[#1A1A1A]/10 bg-[#F4F1EA] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-editorial text-[#8C733E]">Receiving Invoices</span>
                <h3 className="text-[16px] font-serif font-bold text-[#1A1A1A]">Inbound Purchase Transactions</h3>
              </div>
              <span className="text-[11.5px] text-[#78746D] font-mono-data">{purchases.length} Records</span>
            </div>
            <table className="w-full text-left border-collapse text-[12.5px]">
              <thead className="bg-[#FFFFFF] border-b border-[#1A1A1A]/10 text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">
                <tr>
                  <th className="p-3.5">Invoice Reference</th>
                  <th className="p-3.5">Supplier</th>
                  <th className="p-3.5">Posting Date</th>
                  <th className="p-3.5 text-center">Items Count</th>
                  <th className="p-3.5 text-right">Inbound Valuation</th>
                  <th className="p-3.5 text-center">Ingestion Mode</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/8 font-mono-data">
                {purchases.map(p => (
                  <tr key={p.id} className="hover:bg-[#F4F1EA]">
                    <td className="p-3.5 font-bold text-[#1A1A1A]">{p.invoiceNumber}</td>
                    <td className="p-3.5 font-sans font-semibold text-[#1A1A1A]">{p.supplierName}</td>
                    <td className="p-3.5 font-sans text-[#78746D] text-[11.5px]">{p.date}</td>
                    <td className="p-3.5 text-center font-sans text-[12px]">
                      {p.items.length} items ({p.items.reduce((sum, i) => sum + i.quantity, 0)} units)
                    </td>
                    <td className="p-3.5 text-right font-bold text-[#1A1A1A] text-[13.5px]">
                      ${p.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3.5 text-center font-sans">
                      {p.isAiScanned ? (
                        <span className="bg-[#EEEBE3] text-[#1A1A1A] border border-[#1A1A1A]/15 text-[10px] font-bold px-2 py-0.5 rounded inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px] text-[#8C733E] fill-1">auto_awesome</span>
                          AI OCR Scanned
                        </span>
                      ) : (
                        <span className="bg-[#F4F1EA] text-[#5C5850] border border-[#1A1A1A]/10 text-[10px] font-bold px-2 py-0.5 rounded">
                          Manual Entry
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-center font-sans">
                      <span className="bg-[#E8F0EB] text-[#234E3E] border border-[#234E3E]/20 text-[10px] font-semibold px-2 py-0.5 rounded">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
