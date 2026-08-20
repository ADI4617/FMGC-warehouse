import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const StockAdjustmentModal: React.FC = () => {
  const {
    isStockAdjustmentOpen,
    setIsStockAdjustmentOpen,
    selectedProductForAdjustment,
    setSelectedProductForAdjustment,
    recordStockAdjustment
  } = useApp();

  const [delta, setDelta] = useState('5');
  const [adjustmentType, setAdjustmentType] = useState<'Addition' | 'Deduction' | 'Damage'>('Damage');
  const [reason, setReason] = useState('Broken seal during unloading');

  if (!isStockAdjustmentOpen || !selectedProductForAdjustment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qtyNumber = Number(delta);
    if (qtyNumber <= 0) return;

    if (adjustmentType === 'Damage') {
      recordStockAdjustment(selectedProductForAdjustment.id, 'ADJ-MANUAL', qtyNumber, reason, true);
    } else if (adjustmentType === 'Addition') {
      recordStockAdjustment(selectedProductForAdjustment.id, 'ADJ-MANUAL', qtyNumber, reason, false);
    } else {
      recordStockAdjustment(selectedProductForAdjustment.id, 'ADJ-MANUAL', -qtyNumber, reason, false);
    }

    setIsStockAdjustmentOpen(false);
    setSelectedProductForAdjustment(undefined);
  };

  return (
    <div className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] border border-[#1A1A1A]/20 rounded max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex justify-between items-center pb-3 border-b border-[#1A1A1A]/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8B2626]">tune</span>
            <div>
              <h3 className="text-[18px] font-serif font-bold text-[#1A1A1A]">Stock Adjustment / Damage</h3>
              <p className="text-[11px] uppercase tracking-editorial text-[#78746D]">Inventory Audit Reconciliation</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsStockAdjustmentOpen(false);
              setSelectedProductForAdjustment(undefined);
            }}
            className="text-[#78746D] hover:text-[#1A1A1A] p-1 cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
          {/* Target Product */}
          <div className="bg-[#F4F1EA] p-3 rounded border border-[#1A1A1A]/10">
            <span className="text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">Adjusting SKU</span>
            <div className="font-bold text-[14px] text-[#1A1A1A] font-mono-data mt-0.5">{selectedProductForAdjustment.sku}</div>
            <div className="text-[12.5px] text-[#1A1A1A] font-medium">{selectedProductForAdjustment.name}</div>
            <div className="flex justify-between mt-2 pt-2 border-t border-[#1A1A1A]/10 text-[12px]">
              <span>Current In-Stock: <strong className="font-mono-data">{selectedProductForAdjustment.inStock}</strong></span>
              <span>Recorded Damaged: <strong className="font-mono-data text-[#8B2626]">{selectedProductForAdjustment.damaged}</strong></span>
            </div>
          </div>

          {/* Type of Adjustment */}
          <div>
            <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Adjustment Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Damage', 'Addition', 'Deduction'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAdjustmentType(type)}
                  className={`py-1.5 px-2 rounded text-[11.5px] font-medium uppercase tracking-editorial border transition-all cursor-pointer ${
                    adjustmentType === type
                      ? type === 'Damage'
                        ? 'bg-[#1A1A1A] text-[#F9F7F2] border-[#8B2626]'
                        : 'bg-[#1A1A1A] text-[#F9F7F2] border-[#D4AF37]/50'
                      : 'bg-[#FFFFFF] text-[#5C5850] border-[#1A1A1A]/15 hover:bg-[#F4F1EA]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Quantity Units</label>
            <input
              type="number"
              min="1"
              required
              value={delta}
              onChange={(e) => setDelta(e.target.value)}
              className="w-full p-2 bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded font-mono-data font-medium text-[15px]"
            />
          </div>

          {/* Reason (Audit Trail mandatory) */}
          <div>
            <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Mandatory Audit Reason</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Physical inventory count mismatch, water leak damage..."
              className="w-full p-2 bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded outline-none focus:border-[#1A1A1A]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#1A1A1A]/10">
            <button
              type="button"
              onClick={() => {
                setIsStockAdjustmentOpen(false);
                setSelectedProductForAdjustment(undefined);
              }}
              className="px-4 py-2 text-[#5C5850] hover:bg-[#F4F1EA] rounded cursor-pointer text-[12px] uppercase tracking-editorial font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1A1A1A] text-[#F9F7F2] border border-[#8B2626]/50 font-medium rounded hover:bg-[#2A2A2A] shadow-2xs cursor-pointer text-[12px]"
            >
              Record Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
