import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const ExecutiveDashboard: React.FC = () => {
  const {
    products,
    customers,
    sales,
    purchases,
    batches,
    setActiveTab,
    setIsNewSaleOpen,
    setIsAddStockOpen,
    setIsAiOptimizerOpen,
    setActiveInvoiceToPrint
  } = useApp();

  const [lastRefreshed, setLastRefreshed] = useState('just now');

  // Dynamically calculate metrics
  const totalStockValue = products.reduce((acc, p) => acc + (p.inStock * p.purchasePrice), 0);
  const totalReceivables = customers.reduce((acc, c) => acc + c.outstandingBalance, 0);
  const totalOverdue = customers.reduce((acc, c) => acc + c.overdueAmount, 0);
  
  // Today's sales & purchases
  const todaySales = sales.reduce((acc, s) => acc + s.totalAmount, 0);
  const todayPurchases = purchases.reduce((acc, p) => acc + p.totalAmount, 0);

  // Critical alerts counts
  const lowStockCount = products.filter(p => p.inStock <= p.minThreshold).length;
  const expiryCount = batches.filter(b => b.daysToExpiry <= 30).length;
  const overdueCount = customers.filter(c => c.overdueAmount > 0).length;

  return (
    <div className="p-6 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-12 gap-6">
        {/* Main Content Area (9 Columns) */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {/* Editorial Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-2 border-b border-[#1A1A1A]/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-editorial text-[#8C733E]">Executive Ledger</span>
                <span className="text-[#1A1A1A]/30 text-xs">•</span>
                <span className="text-[10px] uppercase font-mono-data text-[#78746D]">Distro Hub Index</span>
              </div>
              <h2 className="text-[32px] font-serif font-bold text-[#1A1A1A] tracking-tight leading-tight">
                Executive Overview
              </h2>
              <p className="text-[13.5px] text-[#5C5850] mt-0.5 font-sans">
                Real-time distribution metrics, stock valuation, and autonomous predictive analysis.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#78746D] bg-[#FFFFFF] px-3 py-1.5 rounded border border-[#1A1A1A]/12 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#234E3E] animate-pulse-subtle" />
              <span className="font-mono-data">Sync: {lastRefreshed}</span>
            </div>
          </div>

          {/* Editorial Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Sales Card */}
            <div
              onClick={() => setActiveTab('sales')}
              className="bg-[#FFFFFF] border border-[#1A1A1A]/12 p-4 rounded flex flex-col justify-between h-34 relative overflow-hidden group hover:border-[#1A1A1A]/40 transition-all cursor-pointer shadow-2xs"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">
                  01. Today's Sales
                </span>
                <span className="material-symbols-outlined text-[18px] text-[#1A1A1A]/30 group-hover:text-[#D4AF37] transition-colors">
                  trending_up
                </span>
              </div>
              <div>
                <div className="text-[26px] font-serif font-bold text-[#1A1A1A] tracking-tight mb-1">
                  ${todaySales > 0 ? todaySales.toLocaleString('en-US', { minimumFractionDigits: 0 }) : '12,450'}
                </div>
                <div className="flex items-center text-[#234E3E] text-[11px] font-mono-data font-semibold">
                  <span className="material-symbols-outlined text-[13px] mr-0.5">arrow_upward</span>
                  +12% vs prior cycle
                </div>
              </div>
            </div>

            {/* Purchase Value Card */}
            <div
              onClick={() => setActiveTab('purchase')}
              className="bg-[#FFFFFF] border border-[#1A1A1A]/12 p-4 rounded flex flex-col justify-between h-34 relative overflow-hidden group hover:border-[#1A1A1A]/40 transition-all cursor-pointer shadow-2xs"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">
                  02. Purchase Value
                </span>
                <span className="material-symbols-outlined text-[18px] text-[#1A1A1A]/30 group-hover:text-[#1A1A1A] transition-colors">
                  shopping_bag
                </span>
              </div>
              <div>
                <div className="text-[26px] font-serif font-bold text-[#1A1A1A] tracking-tight">
                  ${todayPurchases > 0 ? todayPurchases.toLocaleString('en-US', { minimumFractionDigits: 0 }) : '8,200'}
                </div>
                <div className="text-[10.5px] text-[#78746D] font-mono-data mt-1">2 Inbound lots recorded</div>
              </div>
            </div>

            {/* Total Receivables Card */}
            <div
              onClick={() => setActiveTab('collections')}
              className="bg-[#FFFFFF] border border-[#1A1A1A]/12 p-4 rounded flex flex-col justify-between h-34 relative overflow-hidden group hover:border-[#8B2626]/40 transition-all cursor-pointer shadow-2xs"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">
                  03. Receivables
                </span>
                <span className="material-symbols-outlined text-[18px] text-[#8B2626]/50">
                  account_balance_wallet
                </span>
              </div>
              <div>
                <div className="text-[26px] font-serif font-bold text-[#1A1A1A] tracking-tight mb-1">
                  ${totalReceivables.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </div>
                <div className="flex items-center text-[#8B2626] text-[10px] font-mono-data font-semibold bg-[#F9EBEB] px-1.5 py-0.5 rounded border border-[#8B2626]/20">
                  <span className="material-symbols-outlined text-[12px] mr-1">warning</span>
                  ${totalOverdue > 0 ? totalOverdue.toLocaleString('en-US') : '5,000'} overdue
                </div>
              </div>
            </div>

            {/* Stock Value Card */}
            <div
              onClick={() => setActiveTab('inventory')}
              className="bg-[#FFFFFF] border border-[#1A1A1A]/12 p-4 rounded flex flex-col justify-between h-34 relative overflow-hidden group hover:border-[#1A1A1A]/40 transition-all cursor-pointer shadow-2xs"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">
                  04. Stock Valuation
                </span>
                <span className="material-symbols-outlined text-[18px] text-[#1A1A1A]/30 group-hover:text-[#234E3E] transition-colors">
                  warehouse
                </span>
              </div>
              <div>
                <div className="text-[26px] font-serif font-bold text-[#1A1A1A] tracking-tight">
                  ${totalStockValue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </div>
                <div className="text-[10.5px] text-[#234E3E] font-mono-data font-semibold mt-1">12 Master SKUs in Store</div>
              </div>
            </div>
          </div>

          {/* AI Intelligence Dispatch - Editorial High Contrast Dark Canvas */}
          <div className="bg-[#1A1A1A] text-[#F9F7F2] border border-[#1A1A1A] rounded p-5 relative overflow-hidden shadow-sm">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#F9F7F2]/10">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded bg-[#D4AF37] text-[#1A1A1A] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[15px] fill-1">auto_awesome</span>
                </div>
                <h3 className="text-[16px] font-serif font-bold text-[#F9F7F2] tracking-wide">
                  The Intelligence Dispatch
                </h3>
              </div>
              <span className="text-[9.5px] uppercase font-bold tracking-widest text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-0.5 rounded">
                Predictive Synthesis
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Insight 1: Reorder */}
              <div className="bg-[#2A2A2A] border border-[#F9F7F2]/10 rounded p-4 flex items-start gap-3.5 hover:border-[#D4AF37]/50 transition-colors">
                <div className="w-8 h-8 rounded bg-[#1A1A1A] text-[#D4AF37] flex items-center justify-center shrink-0 border border-[#D4AF37]/30">
                  <span className="material-symbols-outlined text-[17px]">inventory_2</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-mono-data text-[12px] font-bold text-[#D4AF37] uppercase tracking-wider">
                      Reorder Directive
                    </h4>
                    <span className="text-[9px] bg-[#8B2626] text-[#F9F7F2] px-1.5 py-0.2 rounded font-mono-data">Urgent</span>
                  </div>
                  <p className="text-[12px] text-[#F9F7F2]/80 leading-relaxed mb-2.5 font-sans">
                    Parle-G 80g stock velocity indicates complete runout within 48 hours. Generate PO immediately for 200 cases.
                  </p>
                  <button
                    onClick={() => setIsAiOptimizerOpen(true)}
                    className="text-[11.5px] font-medium text-[#D4AF37] hover:text-[#F9F7F2] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Execute Procurement Routine</span>
                    <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Insight 2: Demand Surge */}
              <div className="bg-[#2A2A2A] border border-[#F9F7F2]/10 rounded p-4 flex items-start gap-3.5 hover:border-[#D4AF37]/50 transition-colors">
                <div className="w-8 h-8 rounded bg-[#1A1A1A] text-[#D4AF37] flex items-center justify-center shrink-0 border border-[#D4AF37]/30">
                  <span className="material-symbols-outlined text-[17px]">trending_up</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-mono-data text-[12px] font-bold text-[#D4AF37] uppercase tracking-wider">
                      Demand Surge Pattern
                    </h4>
                    <span className="text-[9px] bg-[#234E3E] text-[#F9F7F2] px-1.5 py-0.2 rounded font-mono-data">+25% Vol</span>
                  </div>
                  <p className="text-[12px] text-[#F9F7F2]/80 leading-relaxed font-sans">
                    Beverage category sales in North Zone increased by 25% this cycle. Buffer warehouse stock before weekend delivery runs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Table - Editorial Ledger */}
          <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded overflow-hidden shadow-2xs">
            <div className="p-3.5 border-b border-[#1A1A1A]/10 flex justify-between items-center bg-[#F4F1EA]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1A1A1A] text-[18px]">menu_book</span>
                <h3 className="text-[14px] font-serif font-bold text-[#1A1A1A]">
                  Chronological Transaction Ledger
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('sales')}
                className="text-[#1A1A1A] font-bold text-[11px] uppercase tracking-wider hover:text-[#8C733E] cursor-pointer"
              >
                View Full Ledger →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FFFFFF] border-b border-[#1A1A1A]/10 text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">
                    <th className="p-3 sticky left-0 bg-[#FFFFFF] z-10 w-1/4">Reference Code</th>
                    <th className="p-3 w-1/3">Entity / Description</th>
                    <th className="p-3 w-1/4">Timestamp</th>
                    <th className="p-3 text-right w-1/4">Settlement</th>
                  </tr>
                </thead>
                <tbody className="text-[12.5px] font-mono-data divide-y divide-[#1A1A1A]/8">
                  {/* Row 1 */}
                  <tr
                    onClick={() => setActiveTab('sales')}
                    className="hover:bg-[#F4F1EA] transition-colors group cursor-pointer"
                  >
                    <td className="p-3 sticky left-0 bg-[#FFFFFF] group-hover:bg-[#F4F1EA] font-bold text-[#1A1A1A]">
                      TRX-9824
                    </td>
                    <td className="p-3 flex items-center gap-2 text-[#1A1A1A]">
                      <span className="material-symbols-outlined text-[#78746D] text-[16px]">shopping_cart</span>
                      <span className="font-sans font-medium">Sale to City Retailers</span>
                    </td>
                    <td className="p-3 text-[#78746D] font-sans text-[11.5px]">Today, 10:45 AM</td>
                    <td className="p-3 text-right text-[#234E3E] font-bold">+$1,250.00</td>
                  </tr>

                  {/* Row 2 */}
                  <tr
                    onClick={() => setActiveTab('purchase')}
                    className="hover:bg-[#F4F1EA] transition-colors group cursor-pointer"
                  >
                    <td className="p-3 sticky left-0 bg-[#FFFFFF] group-hover:bg-[#F4F1EA] font-bold text-[#1A1A1A]">
                      TRX-9823
                    </td>
                    <td className="p-3 flex items-center gap-2 text-[#1A1A1A]">
                      <span className="material-symbols-outlined text-[#78746D] text-[16px]">inventory_2</span>
                      <span className="font-sans font-medium">Inbound Purchase from HUL</span>
                    </td>
                    <td className="p-3 text-[#78746D] font-sans text-[11.5px]">Today, 09:15 AM</td>
                    <td className="p-3 text-right text-[#1A1A1A] font-semibold">-$3,400.00</td>
                  </tr>

                  {/* Row 3 */}
                  <tr
                    onClick={() => setActiveTab('sales')}
                    className="hover:bg-[#F4F1EA] transition-colors group cursor-pointer"
                  >
                    <td className="p-3 sticky left-0 bg-[#FFFFFF] group-hover:bg-[#F4F1EA] font-bold text-[#1A1A1A]">
                      TRX-9822
                    </td>
                    <td className="p-3 flex items-center gap-2 text-[#1A1A1A]">
                      <span className="material-symbols-outlined text-[#78746D] text-[16px]">shopping_cart</span>
                      <span className="font-sans font-medium">Sale to Metro Mart</span>
                    </td>
                    <td className="p-3 text-[#78746D] font-sans text-[11.5px]">Yesterday, 16:30 PM</td>
                    <td className="p-3 text-right text-[#234E3E] font-bold">+$850.50</td>
                  </tr>

                  {/* Row 4 */}
                  <tr
                    onClick={() => setActiveTab('collections')}
                    className="hover:bg-[#F4F1EA] transition-colors group cursor-pointer"
                  >
                    <td className="p-3 sticky left-0 bg-[#FFFFFF] group-hover:bg-[#F4F1EA] font-bold text-[#1A1A1A]">
                      TRX-9821
                    </td>
                    <td className="p-3 flex items-center gap-2 text-[#1A1A1A]">
                      <span className="material-symbols-outlined text-[#78746D] text-[16px]">payments</span>
                      <span className="font-sans font-medium">Receipt from QuickStop Mart</span>
                    </td>
                    <td className="p-3 text-[#78746D] font-sans text-[11.5px]">Yesterday, 14:00 PM</td>
                    <td className="p-3 text-right text-[#234E3E] font-bold">+$500.00</td>
                  </tr>

                  {/* Row 5 */}
                  <tr
                    onClick={() => setActiveTab('purchase')}
                    className="hover:bg-[#F4F1EA] transition-colors group cursor-pointer"
                  >
                    <td className="p-3 sticky left-0 bg-[#FFFFFF] group-hover:bg-[#F4F1EA] font-bold text-[#1A1A1A]">
                      TRX-9820
                    </td>
                    <td className="p-3 flex items-center gap-2 text-[#1A1A1A]">
                      <span className="material-symbols-outlined text-[#78746D] text-[16px]">inventory_2</span>
                      <span className="font-sans font-medium">Inbound Purchase from ITC Ltd</span>
                    </td>
                    <td className="p-3 text-[#78746D] font-sans text-[11.5px]">Yesterday, 11:20 AM</td>
                    <td className="p-3 text-right text-[#1A1A1A] font-semibold">-$1,200.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Exceptions First Panel (Right 3 Columns) */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded p-4 shadow-2xs flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 border-b border-[#1A1A1A]/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#8B2626] text-[20px]">flag</span>
                <h3 className="text-[15px] font-serif font-bold text-[#1A1A1A]">Priority Bulletins</h3>
              </div>
              <span className="text-[9px] uppercase font-bold tracking-widest text-[#8B2626] bg-[#F9EBEB] px-1.5 py-0.2 rounded border border-[#8B2626]/20">
                Action Required
              </span>
            </div>

            <div className="space-y-3 flex-1">
              {/* Alert 1: Low Stock */}
              <div
                onClick={() => setActiveTab('inventory')}
                className="bg-[#FBF4E8] border border-[#9C5B23]/25 rounded p-3 flex items-start gap-2.5 hover:bg-[#F8ECD8] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[#9C5B23] mt-0.5 text-[18px]">inventory</span>
                <div>
                  <h4 className="text-[10px] font-bold text-[#9C5B23] uppercase tracking-wider mb-0.5">
                    Stock Depletion Risk
                  </h4>
                  <p className="text-[11.5px] text-[#5C5850] font-sans">
                    {lowStockCount > 0 ? `${lowStockCount} inventory lines beneath safe threshold.` : '15 items below threshold.'}
                  </p>
                </div>
              </div>

              {/* Alert 2: Expiry Risk */}
              <div
                onClick={() => setActiveTab('inventory')}
                className="bg-[#F9EBEB] border border-[#8B2626]/25 rounded p-3 flex items-start gap-2.5 hover:bg-[#F5D8D8] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[#8B2626] mt-0.5 text-[18px]">event_busy</span>
                <div>
                  <h4 className="text-[10px] font-bold text-[#8B2626] uppercase tracking-wider mb-0.5">
                    Batch Expiry Warning
                  </h4>
                  <p className="text-[11.5px] text-[#5C5850] font-sans">
                    {expiryCount > 0 ? `${expiryCount} batches approaching 30-day shelf life limit.` : '8 batches expiring within 30 days.'}
                  </p>
                </div>
              </div>

              {/* Alert 3: Overdue Collections */}
              <div
                onClick={() => setActiveTab('collections')}
                className="bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded p-3 flex items-start gap-2.5 hover:bg-[#EEEBE3] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[#1A1A1A] mt-0.5 text-[18px]">request_quote</span>
                <div>
                  <h4 className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-0.5">
                    Overdue Credit Accounts
                  </h4>
                  <p className="text-[11.5px] text-[#5C5850] font-sans">
                    {overdueCount > 0 ? `${overdueCount} accounts with pending bills past credit window.` : '12 invoices pending over 45 days.'}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Action trigger */}
            <div className="mt-4 pt-3 border-t border-[#1A1A1A]/10">
              <button
                onClick={() => setIsAiOptimizerOpen(true)}
                className="w-full bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/50 hover:bg-[#2A2A2A] py-2 rounded text-[11.5px] font-medium tracking-wide flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[15px] text-[#D4AF37] fill-1">auto_awesome</span>
                <span>Launch Optimizer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
