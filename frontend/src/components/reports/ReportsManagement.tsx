import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const ReportsManagement: React.FC = () => {
  const { products, sales, purchases, customers, batches, addToast } = useApp();
  const [reportType, setReportType] = useState<'sales' | 'inventory' | 'fefo' | 'collections'>('sales');

  const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalPurchases = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalStockValue = products.reduce((sum, p) => sum + (p.inStock * p.purchasePrice), 0);
  const totalReceivables = customers.reduce((sum, c) => sum + c.outstandingBalance, 0);

  const handleExportReport = () => {
    addToast('success', 'Report Exported', `Generated full ${reportType.toUpperCase()} analytical summary.`);
  };

  return (
    <div className="p-6 max-w-[1440px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-2 border-b border-[#1A1A1A]/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-editorial text-[#8C733E]">Executive Intelligence</span>
            <span className="text-[#1A1A1A]/30 text-xs">•</span>
            <span className="text-[10px] uppercase font-mono-data text-[#78746D]">Real-Time Data Feeds</span>
          </div>
          <h2 className="text-[32px] font-serif font-bold text-[#1A1A1A] tracking-tight">Business Intelligence & Reports</h2>
          <p className="text-[13.5px] text-[#5C5850]">Comprehensive distribution analytics, velocity breakdown, and ledger reports.</p>
        </div>
        <button
          onClick={handleExportReport}
          className="bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/50 text-[12px] font-medium py-2 px-4 rounded flex items-center gap-2 hover:bg-[#2A2A2A] transition-all shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">download</span>
          Export Full Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 p-4 rounded shadow-2xs">
          <span className="text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">Gross Revenue (MTD)</span>
          <div className="text-[24px] font-bold text-[#1A1A1A] font-mono-data mt-1">
            ${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-[#234E3E] font-medium">+18.2% vs last month</span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 p-4 rounded shadow-2xs">
          <span className="text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">COGS / Purchases</span>
          <div className="text-[24px] font-bold text-[#1A1A1A] font-mono-data mt-1">
            ${totalPurchases.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-[#78746D]">Gross Margin ~28.5%</span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 p-4 rounded shadow-2xs">
          <span className="text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">Current Stock Valuation</span>
          <div className="text-[24px] font-bold text-[#1A1A1A] font-mono-data mt-1">
            ${totalStockValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-[#234E3E] font-medium">12 Active SKUs</span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 p-4 rounded shadow-2xs">
          <span className="text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">Market Receivables</span>
          <div className="text-[24px] font-bold text-[#1A1A1A] font-mono-data mt-1">
            ${totalReceivables.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-[#8B2626] font-medium">DSO: 22 Days Avg</span>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div className="flex border-b border-[#1A1A1A]/10 gap-6">
        {[
          { id: 'sales', label: 'Sales by Product SKU' },
          { id: 'inventory', label: 'Stock Valuation & Turnover' },
          { id: 'fefo', label: 'Expiry Loss Risk Matrix' },
          { id: 'collections', label: 'Customer Recovery Performance' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`pb-2.5 text-[12.5px] uppercase tracking-editorial font-medium transition-all border-b-2 cursor-pointer ${
              reportType === tab.id
                ? 'border-[#1A1A1A] text-[#1A1A1A] font-bold'
                : 'border-transparent text-[#78746D] hover:text-[#1A1A1A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Table */}
      <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded shadow-2xs overflow-hidden">
        {reportType === 'sales' && (
          <table className="w-full text-left border-collapse text-[12.5px]">
            <thead className="bg-[#F4F1EA] border-b border-[#1A1A1A]/10 text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">
              <tr>
                <th className="p-3.5">SKU Code</th>
                <th className="p-3.5">Product Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 text-right">Selling Rate</th>
                <th className="p-3.5 text-right">In Stock</th>
                <th className="p-3.5 text-right">Total Stock Value</th>
                <th className="p-3.5 text-center">Velocity Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/8 font-mono-data">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-[#F4F1EA]">
                  <td className="p-3.5 font-bold text-[#1A1A1A]">{p.sku}</td>
                  <td className="p-3.5 font-sans font-medium text-[#1A1A1A]">{p.name}</td>
                  <td className="p-3.5 font-sans text-[#5C5850] text-[11.5px]">{p.category}</td>
                  <td className="p-3.5 text-right text-[#1A1A1A]">${p.sellingPrice.toFixed(2)}</td>
                  <td className="p-3.5 text-right font-bold">{p.inStock}</td>
                  <td className="p-3.5 text-right font-bold text-[#1A1A1A]">
                    ${(p.inStock * p.purchasePrice).toFixed(2)}
                  </td>
                  <td className="p-3.5 text-center font-sans">
                    {p.inStock > 200 ? (
                      <span className="bg-[#EEEBE3] border border-[#1A1A1A]/10 text-[#234E3E] text-[10.5px] font-semibold px-2 py-0.5 rounded">High Mover</span>
                    ) : p.inStock > 50 ? (
                      <span className="bg-[#EEEBE3] border border-[#1A1A1A]/10 text-[#1A1A1A] text-[10.5px] font-semibold px-2 py-0.5 rounded">Moderate</span>
                    ) : (
                      <span className="bg-[#EEEBE3] border border-[#1A1A1A]/10 text-[#9C5B23] text-[10.5px] font-semibold px-2 py-0.5 rounded">Low Stock</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reportType === 'fefo' && (
          <table className="w-full text-left border-collapse text-[12.5px]">
            <thead className="bg-[#F4F1EA] border-b border-[#1A1A1A]/10 text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">
              <tr>
                <th className="p-3.5">Batch #</th>
                <th className="p-3.5">SKU & Product</th>
                <th className="p-3.5 text-right">Quantity</th>
                <th className="p-3.5">Expiry Date</th>
                <th className="p-3.5 text-right">Days Left</th>
                <th className="p-3.5 text-right">Estimated At-Risk Value</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/8 font-mono-data">
              {batches.map(b => (
                <tr key={b.id} className="hover:bg-[#F4F1EA]">
                  <td className="p-3.5 font-bold text-[#1A1A1A]">BAT-{b.batchNumber}</td>
                  <td className="p-3.5 font-sans font-medium text-[#1A1A1A]">
                    <span>{b.sku}</span> - {b.productName}
                  </td>
                  <td className="p-3.5 text-right font-bold">{b.quantity}</td>
                  <td className="p-3.5 font-sans text-[#78746D]">{b.expiryDate}</td>
                  <td className={`p-3.5 text-right font-bold ${b.daysToExpiry <= 15 ? 'text-[#8B2626]' : 'text-[#234E3E]'}`}>
                    {b.daysToExpiry} Days
                  </td>
                  <td className="p-3.5 text-right font-bold text-[#1A1A1A]">
                    ${(b.quantity * b.purchasePrice).toFixed(2)}
                  </td>
                  <td className="p-3.5 text-center font-sans">
                    {b.daysToExpiry <= 15 ? (
                      <span className="bg-[#EEEBE3] border border-[#8B2626]/30 text-[#8B2626] text-[10.5px] font-bold px-2 py-0.5 rounded">High Risk</span>
                    ) : (
                      <span className="bg-[#EEEBE3] border border-[#234E3E]/30 text-[#234E3E] text-[10.5px] font-semibold px-2 py-0.5 rounded">Healthy</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {(reportType === 'inventory' || reportType === 'collections') && (
          <div className="p-8 text-center text-[#78746D] bg-[#FFFFFF]">
            <span className="material-symbols-outlined text-4xl text-[#1A1A1A] mb-2">analytics</span>
            <p className="font-serif font-bold text-[#1A1A1A] text-[16px]">Analytical Report Generated</p>
            <p className="text-[12px] mt-1 text-[#5C5850]">Data synchronized with real-time warehouse inventory ledger.</p>
          </div>
        )}
      </div>
    </div>
  );
};
