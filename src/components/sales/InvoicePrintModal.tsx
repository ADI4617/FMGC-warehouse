import React from 'react';
import { useApp } from '../../context/AppContext';

export const InvoicePrintModal: React.FC = () => {
  const { activeInvoiceToPrint, setActiveInvoiceToPrint, addToast } = useApp();

  if (!activeInvoiceToPrint) return null;

  const handlePrint = () => {
    window.print();
    addToast('success', 'Print Triggered', `Printed Invoice ${activeInvoiceToPrint.invoiceNumber}`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 print:p-0">
      <div className="bg-[#FFFFFF] rounded max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden print:max-w-none print:shadow-none print:rounded-none border border-[#1A1A1A]/20">
        {/* Header Controls (Hidden during print) */}
        <div className="p-4 bg-[#F4F1EA] border-b border-[#1A1A1A]/10 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1A1A1A]">receipt</span>
            <span className="font-serif font-bold text-[#1A1A1A] text-[16px]">Tax Invoice Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/50 text-[11.5px] font-medium px-3.5 py-1.5 rounded flex items-center gap-1.5 hover:bg-[#2A2A2A] cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[15px] text-[#D4AF37]">print</span>
              Print Invoice
            </button>
            <button
              onClick={() => setActiveInvoiceToPrint(undefined)}
              className="text-[#78746D] hover:text-[#1A1A1A] p-1.5 rounded cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-[#FFFFFF] text-[#1A1A1A] space-y-6 font-sans">
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b-2 border-[#1A1A1A] pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-mono-data font-bold tracking-widest text-[#8C733E] uppercase">Official Commercial Invoice</span>
              </div>
              <h1 className="text-[26px] font-serif font-bold text-[#1A1A1A] tracking-tight">FMCG Distro Hub</h1>
              <p className="text-[12px] text-[#5C5850]">Premier Wholesale & Retail Distribution Operations</p>
              <p className="text-[11px] text-[#78746D] font-mono-data">GSTIN: 27AAACF8899K1Z4 | Lic # FMCG-DIST-2026</p>
              <p className="text-[11px] text-[#78746D]">104 Warehouse Zone, Express Logistics Park</p>
            </div>
            <div className="text-right">
              <span className="text-[16px] font-serif font-bold text-[#1A1A1A] block uppercase tracking-wider">TAX INVOICE</span>
              <span className="text-[13.5px] font-bold text-[#1A1A1A] font-mono-data bg-[#EEEBE3] px-2 py-0.5 rounded border border-[#1A1A1A]/10 inline-block mt-1">
                {activeInvoiceToPrint.invoiceNumber}
              </span>
              <p className="text-[11.5px] text-[#78746D] mt-1.5 font-mono-data">Date: {activeInvoiceToPrint.date}</p>
              <p className="text-[11.5px] text-[#78746D] font-mono-data">Time: {activeInvoiceToPrint.time}</p>
            </div>
          </div>

          {/* Bill To Customer Info */}
          <div className="grid grid-cols-2 gap-4 bg-[#FDFBF7] p-3.5 rounded border border-[#1A1A1A]/10 text-[12px]">
            <div>
              <span className="text-[9px] font-bold text-[#78746D] uppercase tracking-editorial block">Billed To (Customer):</span>
              <p className="font-serif font-bold text-[#1A1A1A] text-[14px] mt-0.5">{activeInvoiceToPrint.customerName}</p>
              <p className="text-[#5C5850]">{activeInvoiceToPrint.storeName}</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-bold text-[#78746D] uppercase tracking-editorial block">Payment Terms:</span>
              <p className="font-mono-data text-[#1A1A1A] mt-0.5">Method: {activeInvoiceToPrint.paymentMethod}</p>
              <p className="font-semibold text-[#234E3E] font-mono-data">Status: {activeInvoiceToPrint.paymentStatus}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left text-[12px] border-collapse">
            <thead>
              <tr className="border-b border-[#1A1A1A] text-[#1A1A1A] font-bold text-[10px] uppercase tracking-editorial">
                <th className="py-2">#</th>
                <th className="py-2">Item Description & Master SKU</th>
                <th className="py-2 text-right">Billed Qty</th>
                <th className="py-2 text-right">Bonus Qty</th>
                <th className="py-2 text-right">Unit Price</th>
                <th className="py-2 text-right">Total ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/8 font-mono-data">
              {activeInvoiceToPrint.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2 text-[#78746D]">{idx + 1}</td>
                  <td className="py-2 font-sans">
                    <span className="font-bold text-[#1A1A1A] font-mono-data">{item.sku}</span> - {item.name}
                  </td>
                  <td className="py-2 text-right font-bold text-[#1A1A1A]">{item.quantity}</td>
                  <td className="py-2 text-right text-[#234E3E]">{item.freeQuantity || 0}</td>
                  <td className="py-2 text-right">${item.unitPrice.toFixed(2)}</td>
                  <td className="py-2 text-right font-bold text-[#1A1A1A]">${item.totalAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-1.5 text-[12px]">
              <div className="flex justify-between text-[#5C5850]">
                <span>Items Subtotal:</span>
                <span className="font-mono-data font-semibold">${activeInvoiceToPrint.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#5C5850]">
                <span>GST Tax (Assessed):</span>
                <span className="font-mono-data">$0.00</span>
              </div>
              <div className="flex justify-between text-[14.5px] font-bold text-[#1A1A1A] border-t border-[#1A1A1A] pt-1">
                <span>Grand Total:</span>
                <span className="font-mono-data text-[#1A1A1A] font-bold">${activeInvoiceToPrint.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11.5px] text-[#234E3E] font-semibold">
                <span>Settled Amount:</span>
                <span className="font-mono-data">${activeInvoiceToPrint.amountPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11.5px] text-[#8B2626] font-semibold">
                <span>Balance Transferred to Receivables:</span>
                <span className="font-mono-data">${activeInvoiceToPrint.balanceDue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Terms & Signatures */}
          <div className="pt-8 border-t border-[#1A1A1A]/12 flex justify-between text-[11px] text-[#78746D]">
            <div>
              <p className="font-bold text-[#1A1A1A]">Terms & Conditions:</p>
              <p>1. Goods once sold will not be returned unless damaged prior to receipt.</p>
              <p>2. Subject to State Jurisdiction only.</p>
            </div>
            <div className="text-right">
              <div className="h-10"></div>
              <p className="border-t border-[#1A1A1A]/30 pt-1 font-bold text-[#1A1A1A]">Authorized Signatory</p>
              <p className="text-[10px] font-mono-data">Issued by {activeInvoiceToPrint.createdBy}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
