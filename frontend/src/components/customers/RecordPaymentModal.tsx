import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export const RecordPaymentModal: React.FC = () => {
  const {
    isRecordPaymentOpen,
    setIsRecordPaymentOpen,
    selectedCustomerIdForPayment,
    setSelectedCustomerIdForPayment,
    customers,
    recordCollectionPayment
  } = useApp();

  const [customerId, setCustomerId] = useState(selectedCustomerIdForPayment || customers[0]?.id || '');
  const [amount, setAmount] = useState('500');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Cheque' | 'UPI' | 'NEFT/RTGS'>('Cash');
  const [notes, setNotes] = useState('Collected by delivery van on route');

  useEffect(() => {
    if (selectedCustomerIdForPayment) {
      setCustomerId(selectedCustomerIdForPayment);
      const cust = customers.find(c => c.id === selectedCustomerIdForPayment);
      if (cust && cust.outstandingBalance > 0) {
        setAmount(cust.outstandingBalance.toString());
      }
    }
  }, [selectedCustomerIdForPayment, customers]);

  if (!isRecordPaymentOpen) return null;

  const targetCustomer = customers.find(c => c.id === customerId) || customers[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCustomer || Number(amount) <= 0) return;

    recordCollectionPayment(targetCustomer.id, Number(amount), paymentMethod, notes);
    setIsRecordPaymentOpen(false);
    setSelectedCustomerIdForPayment(undefined);
  };

  return (
    <div className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] border border-[#1A1A1A]/20 rounded max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex justify-between items-center pb-3 border-b border-[#1A1A1A]/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8C733E] text-2xl">payments</span>
            <div>
              <h3 className="text-[18px] font-serif font-bold text-[#1A1A1A]">Record Payment Collection</h3>
              <p className="text-[11px] uppercase tracking-editorial text-[#78746D]">Cash & Bank Ledger Entry</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsRecordPaymentOpen(false);
              setSelectedCustomerIdForPayment(undefined);
            }}
            className="text-[#78746D] hover:text-[#1A1A1A] p-1 cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
          {/* Customer Selection */}
          <div>
            <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Customer / Retailer</label>
            <select
              value={customerId}
              onChange={(e) => {
                setCustomerId(e.target.value);
                const cust = customers.find(c => c.id === e.target.value);
                if (cust) setAmount(cust.outstandingBalance.toString());
              }}
              className="w-full p-2 bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A]"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} - {c.storeName} (Due: ${c.outstandingBalance})
                </option>
              ))}
            </select>
          </div>

          {/* Current Outstanding Box */}
          <div className="bg-[#F4F1EA] p-3 rounded border border-[#1A1A1A]/10 flex justify-between items-center text-[12.5px]">
            <div>
              <span className="text-[#78746D] text-[11px] uppercase tracking-editorial font-bold">Total Outstanding:</span>
              <p className="font-mono-data font-bold text-[#1A1A1A] text-[15px]">${targetCustomer?.outstandingBalance.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <span className="text-[#8B2626] text-[11px] uppercase tracking-editorial font-bold">Overdue:</span>
              <p className="font-mono-data font-bold text-[#8B2626] text-[15px]">${targetCustomer?.overdueAmount.toLocaleString()}</p>
            </div>
          </div>

          {/* Amount Paid */}
          <div>
            <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Amount Collected ($)</label>
            <input
              type="number"
              min="1"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2.5 bg-[#F4F1EA] border border-[#1A1A1A]/20 rounded font-mono-data font-bold text-[16px] text-[#234E3E] outline-none focus:border-[#1A1A1A]"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Payment Instrument</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Cash', 'UPI', 'Cheque', 'NEFT/RTGS'] as const).map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`py-1.5 px-3 rounded font-medium text-[11.5px] uppercase tracking-editorial border transition-all cursor-pointer ${
                    paymentMethod === method
                      ? 'bg-[#1A1A1A] text-[#F9F7F2] border-[#D4AF37]/50 shadow-2xs'
                      : 'bg-[#FFFFFF] text-[#5C5850] border-[#1A1A1A]/15 hover:bg-[#F4F1EA]'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Notes / Reference */}
          <div>
            <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Collection Notes / Cheque Ref</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Cheque #492041 or Cash handover"
              className="w-full p-2 bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded outline-none focus:border-[#1A1A1A]"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-[#1A1A1A]/10">
            <button
              type="button"
              onClick={() => {
                setIsRecordPaymentOpen(false);
                setSelectedCustomerIdForPayment(undefined);
              }}
              className="px-4 py-2 text-[#5C5850] hover:bg-[#F4F1EA] rounded cursor-pointer text-[12px] uppercase tracking-editorial font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/50 font-medium rounded hover:bg-[#2A2A2A] shadow-2xs flex items-center gap-1.5 cursor-pointer text-[12px]"
            >
              <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">receipt</span>
              Issue Money Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
