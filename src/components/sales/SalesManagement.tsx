import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SaleTransaction } from '../../types';

export const SalesManagement: React.FC = () => {
  const { sales, setIsNewSaleOpen, setActiveInvoiceToPrint, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredSales = sales.filter(s => {
    const matchesSearch = s.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || s.paymentStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalCollected = sales.reduce((acc, s) => acc + s.amountPaid, 0);
  const totalPending = sales.reduce((acc, s) => acc + s.balanceDue, 0);

  return (
    <div className="p-6 max-w-[1440px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-2 border-b border-[#1A1A1A]/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-editorial text-[#8C733E]">Commercial Ledger</span>
            <span className="text-[#1A1A1A]/30 text-xs">•</span>
            <span className="text-[10px] uppercase font-mono-data text-[#78746D]">Sales & Order Fulfillment</span>
          </div>
          <h2 className="text-[32px] font-serif font-bold text-[#1A1A1A] tracking-tight">Sales & Orders</h2>
          <p className="text-[13.5px] text-[#5C5850]">Manage field sales, billing invoices, and order fulfillments.</p>
        </div>
        <button
          onClick={() => setIsNewSaleOpen(true)}
          className="bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/50 text-[12px] font-medium py-2 px-4 rounded flex items-center gap-2 hover:bg-[#2A2A2A] transition-all shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">add_shopping_cart</span>
          Create New Sale / Order
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 p-4 rounded shadow-2xs">
          <span className="text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">Total Sales Volume</span>
          <div className="text-[24px] font-bold text-[#1A1A1A] font-mono-data mt-1">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-[#234E3E] font-semibold">{sales.length} Invoices Generated</span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 p-4 rounded shadow-2xs">
          <span className="text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">Collected Payments</span>
          <div className="text-[24px] font-bold text-[#234E3E] font-mono-data mt-1">
            ${totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-[#78746D]">Cash & electronic settlements</span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 p-4 rounded shadow-2xs">
          <span className="text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">Credit Receivables</span>
          <div className="text-[24px] font-bold text-[#8B2626] font-mono-data mt-1">
            ${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-[#8B2626] font-semibold">Unpaid balance on credit</span>
        </div>
      </div>

      {/* Search & Table */}
      <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded shadow-2xs overflow-hidden">
        <div className="p-3.5 border-b border-[#1A1A1A]/10 flex flex-col sm:flex-row justify-between gap-3 bg-[#F4F1EA]">
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#78746D] text-[17px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search invoice or customer..."
              className="w-full bg-[#FFFFFF] border border-[#1A1A1A]/20 rounded pl-8 pr-3 py-1.5 text-[12px] outline-none focus:border-[#1A1A1A]"
            />
          </div>

          <div className="flex gap-1.5 bg-[#EEEBE3] p-1 rounded border border-[#1A1A1A]/10">
            {['All', 'Paid', 'Unpaid', 'Partial'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 text-[11px] font-bold rounded transition-colors cursor-pointer ${
                  filterStatus === status
                    ? 'bg-[#FFFFFF] text-[#1A1A1A] shadow-2xs font-mono-data'
                    : 'text-[#78746D] hover:text-[#1A1A1A]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12.5px]">
            <thead className="bg-[#FFFFFF] border-b border-[#1A1A1A]/10 text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">
              <tr>
                <th className="p-3.5">Invoice #</th>
                <th className="p-3.5">Customer / Store</th>
                <th className="p-3.5">Date & Time</th>
                <th className="p-3.5 text-center">Items Count</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-center">Payment Status</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/8 font-mono-data">
              {filteredSales.map(sale => (
                <tr key={sale.id} className="hover:bg-[#F4F1EA] transition-colors">
                  <td className="p-3.5 font-bold text-[#1A1A1A]">{sale.invoiceNumber}</td>
                  <td className="p-3.5 font-sans">
                    <div className="font-bold text-[#1A1A1A]">{sale.customerName}</div>
                    <div className="text-[11px] text-[#78746D]">{sale.storeName}</div>
                  </td>
                  <td className="p-3.5 font-sans text-[#5C5850] text-[11.5px]">
                    {sale.date} {sale.time}
                  </td>
                  <td className="p-3.5 text-center font-sans font-medium text-[#1A1A1A] text-[12px]">
                    {sale.items.length} items ({sale.items.reduce((a, b) => a + b.quantity, 0)} units)
                  </td>
                  <td className="p-3.5 text-right font-bold text-[#1A1A1A]">
                    ${sale.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-3.5 text-center font-sans">
                    {sale.paymentStatus === 'Paid' && (
                      <span className="bg-[#E8F0EB] text-[#234E3E] border border-[#234E3E]/20 px-2 py-0.5 rounded text-[10px] font-semibold">
                        Paid ({sale.paymentMethod})
                      </span>
                    )}
                    {sale.paymentStatus === 'Unpaid' && (
                      <span className="bg-[#F9EBEB] text-[#8B2626] border border-[#8B2626]/20 px-2 py-0.5 rounded text-[10px] font-semibold">
                        Unpaid (Credit)
                      </span>
                    )}
                    {sale.paymentStatus === 'Partial' && (
                      <span className="bg-[#FBF4E8] text-[#9C5B23] border border-[#9C5B23]/25 px-2 py-0.5 rounded text-[10px] font-semibold">
                        Partial ($ {sale.balanceDue.toFixed(2)} Due)
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => setActiveInvoiceToPrint(sale)}
                      className="bg-[#FFFFFF] border border-[#1A1A1A]/20 hover:bg-[#F4F1EA] text-[#1A1A1A] p-1.5 rounded inline-flex items-center gap-1 text-[11px] font-sans font-medium shadow-2xs cursor-pointer"
                      title="View & Print Tax Invoice"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#78746D]">receipt</span>
                      Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
