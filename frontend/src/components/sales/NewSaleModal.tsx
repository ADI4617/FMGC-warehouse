import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SaleItem } from '../../types';

export const NewSaleModal: React.FC = () => {
  const {
    isNewSaleOpen,
    setIsNewSaleOpen,
    products,
    customers,
    createSale,
    currentUser,
    addToast
  } = useApp();

  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [items, setItems] = useState<SaleItem[]>([
    {
      productId: products[0]?.id || '',
      sku: products[0]?.sku || '',
      name: products[0]?.name || '',
      quantity: 20,
      freeQuantity: 0,
      unitPrice: products[0]?.sellingPrice || 15,
      totalAmount: (products[0]?.sellingPrice || 15) * 20
    }
  ]);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Credit' | 'Bank Transfer' | 'UPI'>('Credit');
  const [amountPaidInput, setAmountPaidInput] = useState('0');

  if (!isNewSaleOpen) return null;

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  const handleProductChange = (index: number, prodId: string) => {
    const prod = products.find(p => p.id === prodId);
    if (!prod) return;

    setItems(prev => prev.map((item, i) => {
      if (i === index) {
        const qty = item.quantity || 1;
        return {
          ...item,
          productId: prod.id,
          sku: prod.sku,
          name: prod.name,
          unitPrice: prod.sellingPrice,
          totalAmount: prod.sellingPrice * qty
        };
      }
      return item;
    }));
  };

  const handleQtyChange = (index: number, qty: number) => {
    setItems(prev => prev.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          quantity: qty,
          totalAmount: Number((item.unitPrice * qty).toFixed(2))
        };
      }
      return item;
    }));
  };

  const handleFreeQtyChange = (index: number, freeQty: number) => {
    setItems(prev => prev.map((item, i) => {
      if (i === index) {
        return { ...item, freeQuantity: freeQty };
      }
      return item;
    }));
  };

  const handlePriceChange = (index: number, price: number) => {
    setItems(prev => prev.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          unitPrice: price,
          totalAmount: Number((price * item.quantity).toFixed(2))
        };
      }
      return item;
    }));
  };

  const handleAddItem = () => {
    const available = products.find(p => !items.some(i => i.productId === p.id)) || products[0];
    setItems(prev => [
      ...prev,
      {
        productId: available.id,
        sku: available.sku,
        name: available.name,
        quantity: 10,
        freeQuantity: 0,
        unitPrice: available.sellingPrice,
        totalAmount: available.sellingPrice * 10
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalAmount = subtotal;
  const amountPaid = paymentMethod === 'Credit' ? Number(amountPaidInput) || 0 : totalAmount;
  const balanceDue = Math.max(0, totalAmount - amountPaid);
  const paymentStatus = balanceDue === 0 ? 'Paid' : amountPaid > 0 ? 'Partial' : 'Unpaid';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check stock availability
    for (const item of items) {
      const prod = products.find(p => p.id === item.productId);
      const totalNeeded = item.quantity + (item.freeQuantity || 0);
      if (prod && prod.inStock < totalNeeded) {
        addToast('error', 'Insufficient Stock', `Cannot fulfill ${totalNeeded} units of ${prod.sku}. Current stock: ${prod.inStock}`);
        return;
      }
    }

    createSale({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      storeName: selectedCustomer.storeName,
      date: new Date().toISOString().substring(0, 10),
      items,
      subtotal,
      discountAmount: 0,
      taxAmount: 0,
      totalAmount,
      amountPaid,
      balanceDue,
      paymentMethod,
      paymentStatus,
      createdBy: currentUser.name
    });

    setIsNewSaleOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] rounded max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 border border-[#1A1A1A]/20">
        {/* Header */}
        <div className="p-4 border-b border-[#1A1A1A]/10 flex justify-between items-center bg-[#F4F1EA]">
          <div>
            <h3 className="text-[17px] font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1A1A1A]">point_of_sale</span>
              Create Sale / Dispatch Order
            </h3>
            <p className="text-[11.5px] text-[#78746D]">Fast entry with real-time stock and customer credit check</p>
          </div>
          <button
            onClick={() => setIsNewSaleOpen(false)}
            className="text-[#78746D] hover:text-[#1A1A1A] p-1 rounded cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          {/* Customer selection & Credit Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FDFBF7] p-3.5 rounded border border-[#1A1A1A]/10">
            <div>
              <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Select Account</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full p-2 bg-[#FFFFFF] border border-[#1A1A1A]/20 rounded text-[12.5px] font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A]"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.storeName} ({c.zone})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col justify-center text-[12px]">
              <div className="flex justify-between">
                <span className="text-[#78746D]">Credit Authorization:</span>
                <span className="font-mono-data font-bold">${selectedCustomer.creditLimit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[#78746D]">Outstanding Balance:</span>
                <span className={`font-mono-data font-bold ${selectedCustomer.outstandingBalance > selectedCustomer.creditLimit * 0.7 ? 'text-[#8B2626]' : 'text-[#1A1A1A]'}`}>
                  ${selectedCustomer.outstandingBalance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-[#1A1A1A]/12 rounded overflow-hidden shadow-2xs">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-[#F4F1EA] border-b border-[#1A1A1A]/10 text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">
                <tr>
                  <th className="p-2.5">Product SKU / Name</th>
                  <th className="p-2.5 text-right w-20">Qty</th>
                  <th className="p-2.5 text-right w-20">Free Qty</th>
                  <th className="p-2.5 text-right w-24">Rate ($)</th>
                  <th className="p-2.5 text-right w-24">Total</th>
                  <th className="p-2.5 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]/8 font-mono-data bg-[#FFFFFF]">
                {items.map((item, index) => {
                  const prod = products.find(p => p.id === item.productId);
                  return (
                    <tr key={index} className="hover:bg-[#F4F1EA]">
                      <td className="p-2 font-sans">
                        <select
                          value={item.productId}
                          onChange={(e) => handleProductChange(index, e.target.value)}
                          className="w-full p-1.5 bg-[#FFFFFF] border border-[#1A1A1A]/15 rounded text-[11.5px] font-medium outline-none"
                        >
                          {products.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.sku} - {p.name} (Stock: {p.inStock})
                            </option>
                          ))}
                        </select>
                        {prod && prod.inStock < (item.quantity + (item.freeQuantity || 0)) && (
                          <span className="text-[10px] text-[#8B2626] font-bold block mt-0.5 font-mono-data">
                            Warning: Stock is only {prod.inStock} units!
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-right">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQtyChange(index, Number(e.target.value))}
                          className="w-16 p-1 border border-[#1A1A1A]/20 rounded text-right text-[11.5px] font-bold bg-[#FFFFFF]"
                        />
                      </td>
                      <td className="p-2 text-right">
                        <input
                          type="number"
                          min="0"
                          value={item.freeQuantity || 0}
                          onChange={(e) => handleFreeQtyChange(index, Number(e.target.value))}
                          className="w-16 p-1 border border-[#1A1A1A]/20 rounded text-right text-[11.5px] bg-[#FFFFFF]"
                        />
                      </td>
                      <td className="p-2 text-right">
                        <input
                          type="number"
                          step="0.01"
                          min="0.1"
                          value={item.unitPrice}
                          onChange={(e) => handlePriceChange(index, Number(e.target.value))}
                          className="w-20 p-1 border border-[#1A1A1A]/20 rounded text-right text-[11.5px] bg-[#FFFFFF]"
                        />
                      </td>
                      <td className="p-2 text-right font-bold text-[#1A1A1A]">
                        ${item.totalAmount.toFixed(2)}
                      </td>
                      <td className="p-2 text-center font-sans">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="text-[#78746D] hover:text-[#8B2626] p-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="text-[11.5px] font-bold text-[#1A1A1A] hover:text-[#8C733E] flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            Add Another Product Line
          </button>

          {/* Payment Terms & Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#1A1A1A]/10">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Credit', 'Cash', 'UPI', 'Bank Transfer'] as const).map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-1.5 px-2 rounded text-[11.5px] font-bold transition-all border cursor-pointer ${
                      paymentMethod === method
                        ? 'bg-[#1A1A1A] text-[#F9F7F2] border-[#1A1A1A]'
                        : 'bg-[#FFFFFF] text-[#5C5850] border-[#1A1A1A]/15 hover:bg-[#F4F1EA]'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              {paymentMethod === 'Credit' && (
                <div className="mt-2">
                  <label className="block text-[10px] text-[#78746D] uppercase font-bold tracking-editorial">Initial Advance / Deposit ($)</label>
                  <input
                    type="number"
                    min="0"
                    max={totalAmount}
                    value={amountPaidInput}
                    onChange={(e) => setAmountPaidInput(e.target.value)}
                    className="w-full p-1.5 border border-[#1A1A1A]/20 rounded text-[12px] font-mono-data bg-[#FFFFFF]"
                  />
                </div>
              )}
            </div>

            {/* Total Summary */}
            <div className="bg-[#FDFBF7] p-3.5 rounded border border-[#1A1A1A]/12 space-y-1.5 text-[12.5px]">
              <div className="flex justify-between">
                <span className="text-[#78746D]">Items Subtotal:</span>
                <span className="font-mono-data font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[15px] font-bold text-[#1A1A1A] pt-1 border-t border-[#1A1A1A]/10">
                <span>Total Bill Amount:</span>
                <span className="font-mono-data text-[#1A1A1A]">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11.5px] text-[#8B2626] font-semibold">
                <span>Balance Transferred to Credit:</span>
                <span className="font-mono-data">${balanceDue.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-[#1A1A1A]/10">
            <button
              type="button"
              onClick={() => setIsNewSaleOpen(false)}
              className="px-4 py-2 text-[#5C5850] hover:bg-[#F4F1EA] rounded text-[12px] font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1A1A1A] text-[#F9F7F2] font-medium rounded hover:bg-[#2A2A2A] text-[12px] shadow-xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">check</span>
              Confirm & Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
