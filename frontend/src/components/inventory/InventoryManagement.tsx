import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, Batch } from '../../types';

export const InventoryManagement: React.FC = () => {
  const {
    products,
    batches,
    stockMovements,
    setIsAddStockOpen,
    setIsStockAdjustmentOpen,
    setSelectedProductForAdjustment,
    applyExpiryDiscount,
    returnBatchToSupplier,
    writeOffBatch,
    addToast
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('Status: All');
  const [expiryDaysFilter, setExpiryDaysFilter] = useState<'15d' | '30d' | '60d'>('15d');
  const [showFullLedgerModal, setShowFullLedgerModal] = useState(false);
  const [activeMenuSku, setActiveMenuSku] = useState<string | null>(null);

  // Filtered Products
  const filteredProducts = products.filter(p => {
    if (categoryFilter !== 'All Categories' && p.category !== categoryFilter) return false;
    if (statusFilter === 'Status: Healthy' && p.status !== 'Healthy') return false;
    if (statusFilter === 'Status: Low' && p.status !== 'Low') return false;
    if (statusFilter === 'Status: Out' && p.status !== 'Out of Stock') return false;
    return true;
  });

  // Filtered Expiry Batches based on 15d, 30d, 60d tabs
  const maxDays = expiryDaysFilter === '15d' ? 15 : expiryDaysFilter === '30d' ? 30 : 60;
  const filteredBatches = batches.filter(b => b.daysToExpiry <= maxDays && b.quantity > 0);

  const exportInventoryCSV = () => {
    const headers = ['SKU,Name,Category,Brand,InStock,Damaged,PurchaseRate,SellingRate,TotalValue,Status\n'];
    const rows = products.map(p => 
      `"${p.sku}","${p.name}","${p.category}","${p.brand}",${p.inStock},${p.damaged},${p.purchasePrice},${p.sellingPrice},${(p.inStock * p.purchasePrice).toFixed(2)},"${p.status}"`
    );
    const csvBlob = new Blob([headers.join('') + rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(csvBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FMCG_Inventory_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    addToast('success', 'Export Complete', 'Inventory report downloaded as CSV.');
  };

  return (
    <div className="p-6 max-w-[1440px] mx-auto flex flex-col xl:flex-row gap-6">
      {/* Left Column: Inventory Overview & Ledger (Flex-1) */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        {/* Editorial Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-2 border-b border-[#1A1A1A]/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-editorial text-[#8C733E]">Stock Ledger & Lots</span>
              <span className="text-[#1A1A1A]/30 text-xs">•</span>
              <span className="text-[10px] uppercase font-mono-data text-[#78746D]">Inventory Control</span>
            </div>
            <h2 className="text-[32px] font-serif font-bold text-[#1A1A1A] tracking-tight leading-tight">
              Inventory & Batches
            </h2>
            <p className="text-[13.5px] text-[#5C5850] mt-0.5 font-sans">
              Real-time SKU visibility, lot trace, and FEFO stock replenishment controls.
            </p>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={exportInventoryCSV}
              className="bg-[#FFFFFF] border border-[#1A1A1A]/20 text-[#1A1A1A] text-[11.5px] font-medium tracking-wide py-2 px-3.5 rounded shadow-2xs hover:bg-[#F4F1EA] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px] text-[#78746D]">download</span>
              Export CSV
            </button>
            <button
              onClick={() => setIsAddStockOpen(true)}
              className="bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/50 text-[11.5px] font-medium tracking-wide py-2 px-3.5 rounded shadow-xs hover:bg-[#2A2A2A] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px] text-[#D4AF37]">add</span>
              Receive Stock
            </button>
          </div>
        </div>

        {/* Inventory Overview Table Container */}
        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded shadow-2xs flex flex-col flex-1 min-h-[400px]">
          {/* Table Controls */}
          <div className="p-3.5 border-b border-[#1A1A1A]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#F4F1EA] rounded-t">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1A1A1A] text-[18px]">inventory_2</span>
              <h3 className="text-[15px] font-serif font-bold text-[#1A1A1A]">
                Master Catalog Overview
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#FFFFFF] border border-[#1A1A1A]/20 rounded py-1 px-3 text-[11.5px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] cursor-pointer"
              >
                <option>All Categories</option>
                <option>Beverages</option>
                <option>Snacks</option>
                <option>Dairy</option>
                <option>Household</option>
                <option>Personal Care</option>
                <option>Groceries</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#FFFFFF] border border-[#1A1A1A]/20 rounded py-1 px-3 text-[11.5px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] cursor-pointer"
              >
                <option>Status: All</option>
                <option>Status: Healthy</option>
                <option>Status: Low</option>
                <option>Status: Out</option>
              </select>
            </div>
          </div>

          {/* Table Data */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFFFFF] border-b border-[#1A1A1A]/10 text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">
                  <th className="p-3 sticky left-0 bg-[#FFFFFF] z-10 w-64">SKU / Designation</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">In Store</th>
                  <th className="p-3 text-right">Damaged</th>
                  <th className="p-3 text-right">Valuation</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="text-[12.5px] text-[#1A1A1A] divide-y divide-[#1A1A1A]/8">
                {filteredProducts.map((prod) => {
                  const isAiLow = prod.sku === 'SNA-110-CHI' || prod.aiPredictedShortage;
                  const isOut = prod.inStock === 0;

                  return (
                    <tr
                      key={prod.id}
                      className={`transition-colors group cursor-pointer ${
                        isAiLow ? 'bg-[#FDFBF7] hover:bg-[#F4F1EA]' : 'hover:bg-[#F4F1EA]'
                      }`}
                    >
                      {/* SKU Name Column */}
                      <td className="p-3 sticky left-0 bg-[#FFFFFF] group-hover:bg-[#F4F1EA] z-10">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono-data font-bold text-[#1A1A1A]">{prod.sku}</span>
                          {isAiLow && (
                            <span
                              className="material-symbols-outlined text-[#8C733E] text-[15px] fill-1 animate-pulse-subtle"
                              title="AI Predicted Shortage"
                            >
                              auto_awesome
                            </span>
                          )}
                        </div>
                        <div className="text-[#5C5850] text-[11.5px] truncate w-56 font-normal">
                          {prod.name}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-3 text-[#5C5850] text-[12px] font-medium">
                        {prod.category}
                      </td>

                      {/* In Stock */}
                      <td className={`p-3 text-right font-mono-data font-semibold ${isOut ? 'text-[#8B2626] font-bold' : 'text-[#1A1A1A]'}`}>
                        {prod.inStock.toLocaleString()}
                      </td>

                      {/* Damaged */}
                      <td className="p-3 text-right font-mono-data text-[#78746D]">
                        {prod.damaged}
                      </td>

                      {/* Total Value */}
                      <td className="p-3 text-right font-mono-data font-semibold text-[#1A1A1A]">
                        ${(prod.inStock * prod.purchasePrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Status Badge */}
                      <td className="p-3 text-center">
                        {prod.status === 'Healthy' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E8F0EB] text-[#234E3E] border border-[#234E3E]/20">
                            Healthy
                          </span>
                        )}
                        {prod.status === 'Low' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FBF4E8] text-[#9C5B23] border border-[#9C5B23]/20">
                            Low Buffer
                          </span>
                        )}
                        {prod.status === 'Out of Stock' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F9EBEB] text-[#8B2626] border border-[#8B2626]/20">
                            Depleted
                          </span>
                        )}
                      </td>

                      {/* Action Menu */}
                      <td className="p-3 text-right relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuSku(activeMenuSku === prod.sku ? null : prod.sku);
                          }}
                          className="text-[#78746D] hover:text-[#1A1A1A] p-1 rounded hover:bg-[#EEEBE3]"
                        >
                          <span className="material-symbols-outlined text-[17px]">more_vert</span>
                        </button>

                        {activeMenuSku === prod.sku && (
                          <div className="absolute right-0 top-full mt-1 w-44 bg-[#FFFFFF] border border-[#1A1A1A]/15 rounded shadow-xl py-1 z-40 text-left">
                            <button
                              onClick={() => {
                                setSelectedProductForAdjustment(prod);
                                setIsStockAdjustmentOpen(true);
                                setActiveMenuSku(null);
                              }}
                              className="w-full px-3 py-1.5 text-[11.5px] text-[#1A1A1A] hover:bg-[#F4F1EA] flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-[15px] text-[#78746D]">tune</span>
                              Adjust Stock Level
                            </button>
                            <button
                              onClick={() => {
                                setShowFullLedgerModal(true);
                                setActiveMenuSku(null);
                              }}
                              className="w-full px-3 py-1.5 text-[11.5px] text-[#1A1A1A] hover:bg-[#F4F1EA] flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-[15px] text-[#78746D]">receipt_long</span>
                              Movement Ledger
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Ledger Preview (Recent Movements) */}
        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded shadow-2xs">
          <div className="p-3.5 border-b border-[#1A1A1A]/10 flex justify-between items-center bg-[#F4F1EA] rounded-t">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1A1A1A] text-[18px]">receipt_long</span>
              <h3 className="text-[14px] font-serif font-bold text-[#1A1A1A]">
                Recent Ledger Postings
              </h3>
            </div>
            <button
              onClick={() => setShowFullLedgerModal(true)}
              className="text-[#1A1A1A] text-[11px] font-bold uppercase tracking-wider hover:text-[#8C733E] cursor-pointer"
            >
              View Full Audit Log →
            </button>
          </div>
          <div className="p-2">
            <table className="w-full text-left">
              <tbody className="text-[12px] divide-y divide-[#1A1A1A]/8">
                {stockMovements.slice(0, 5).map((mov) => (
                  <tr key={mov.id} className="hover:bg-[#F4F1EA]">
                    <td className="py-2 px-3 text-[#78746D] w-28 font-mono-data text-[11px]">{mov.timeFormatted}</td>
                    <td className="py-2 px-3 w-24">
                      {mov.type === 'Purchase' && (
                        <span className="bg-[#EEEBE3] text-[#1A1A1A] border border-[#1A1A1A]/10 px-2 py-0.5 rounded text-[10px] font-mono-data font-semibold">
                          Purchase
                        </span>
                      )}
                      {mov.type === 'Sale' && (
                        <span className="bg-[#E8F0EB] text-[#234E3E] border border-[#234E3E]/20 px-2 py-0.5 rounded text-[10px] font-mono-data font-semibold">
                          Sale
                        </span>
                      )}
                      {mov.type === 'Adj' && (
                        <span className="bg-[#F4F1EA] text-[#5C5850] border border-[#1A1A1A]/10 px-2 py-0.5 rounded text-[10px] font-mono-data font-semibold">
                          Adj
                        </span>
                      )}
                      {mov.type === 'Damage' && (
                        <span className="bg-[#F9EBEB] text-[#8B2626] border border-[#8B2626]/20 px-2 py-0.5 rounded text-[10px] font-mono-data font-semibold">
                          Damage
                        </span>
                      )}
                      {mov.type === 'Return' && (
                        <span className="bg-[#FBF4E8] text-[#9C5B23] border border-[#9C5B23]/20 px-2 py-0.5 rounded text-[10px] font-mono-data font-semibold">
                          Return
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 font-bold text-[#1A1A1A] font-mono-data">
                      {mov.sku}
                    </td>
                    <td className={`py-2 px-3 font-mono-data font-bold ${mov.quantity > 0 ? 'text-[#234E3E]' : 'text-[#8B2626]'}`}>
                      {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                    </td>
                    <td className="py-2 px-3 text-[#78746D] text-right text-[11px] truncate max-w-[180px] font-mono-data">
                      {mov.referenceNo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Column: Expiry Risk Panel (w-80) */}
      <div className="w-full xl:w-80 shrink-0 flex flex-col gap-4">
        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded shadow-2xs flex flex-col h-full relative overflow-hidden">
          {/* Top Editorial Gold Accent Bar */}
          <div className="h-1 w-full bg-[#D4AF37]"></div>

          <div className="p-4 border-b border-[#1A1A1A]/10 pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#8B2626] text-[19px]">event_busy</span>
                <h3 className="text-[15px] font-serif font-bold text-[#1A1A1A]">
                  Shelf Life Horizon
                </h3>
              </div>
              <span className="bg-[#F9EBEB] text-[#8B2626] border border-[#8B2626]/20 text-[9px] font-bold font-mono-data px-1.5 py-0.2 rounded uppercase">
                {batches.filter(b => b.daysToExpiry <= 15).length} Critical
              </span>
            </div>

            {/* Time horizon filter tabs */}
            <div className="flex bg-[#F4F1EA] rounded p-0.5 border border-[#1A1A1A]/10">
              {(['15d', '30d', '60d'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setExpiryDaysFilter(tab)}
                  className={`flex-1 py-1 text-center text-[11px] font-bold rounded transition-all cursor-pointer ${
                    expiryDaysFilter === tab
                      ? 'text-[#1A1A1A] bg-[#FFFFFF] shadow-2xs font-mono-data'
                      : 'text-[#78746D] hover:text-[#1A1A1A]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Expiry Cards List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3 bg-[#FDFBF7]">
            {/* Card 1: DAI-YOG-01 */}
            <div className="border border-[#8B2626]/20 bg-[#FFFFFF] rounded p-3 relative shadow-2xs">
              <div className="flex justify-between items-start mb-1">
                <span className="font-mono-data font-bold text-[12.5px] text-[#1A1A1A]">DAI-YOG-01</span>
                <span className="text-[#8B2626] font-mono-data font-bold text-[11px] flex items-center gap-1 bg-[#F9EBEB] px-1.5 py-0.2 rounded">
                  <span className="material-symbols-outlined text-[13px]">timer</span> 4 Days
                </span>
              </div>
              <p className="text-[11.5px] text-[#5C5850] mb-2 font-sans">Greek Yogurt Plain 1kg (Batch #B992)</p>
              
              <div className="flex justify-between items-center bg-[#F4F1EA] p-2 rounded border border-[#1A1A1A]/10 mb-2 text-[11px]">
                <span className="text-[#78746D]">
                  Qty: <strong className="text-[#1A1A1A] font-mono-data">45</strong>
                </span>
                <span className="text-[#78746D]">
                  Value: <strong className="text-[#1A1A1A] font-mono-data">$135.00</strong>
                </span>
              </div>

              {/* FEFO Badge */}
              <div className="flex items-center gap-1 bg-[#EEEBE3] text-[#1A1A1A] border border-[#1A1A1A]/15 px-1.5 py-0.5 rounded text-[10px] font-bold mb-2 w-fit">
                <span className="material-symbols-outlined text-[12px] text-[#8C733E] fill-1">auto_awesome</span>
                FEFO Flush Priority
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => applyExpiryDiscount('bat-1', 30)}
                  className="flex-1 bg-[#FFFFFF] border border-[#1A1A1A]/20 text-[#1A1A1A] text-[11px] font-bold py-1.5 rounded hover:bg-[#F4F1EA] transition-colors cursor-pointer"
                >
                  Discount 30%
                </button>
                <button
                  onClick={() => returnBatchToSupplier('bat-1')}
                  className="flex-1 bg-[#FFFFFF] border border-[#1A1A1A]/20 text-[#1A1A1A] text-[11px] font-bold py-1.5 rounded hover:bg-[#F4F1EA] transition-colors cursor-pointer"
                >
                  RTS lot
                </button>
              </div>
            </div>

            {/* Card 2: BEV-JUI-12 */}
            <div className="border border-[#9C5B23]/25 bg-[#FFFFFF] rounded p-3 relative shadow-2xs">
              <div className="flex justify-between items-start mb-1">
                <span className="font-mono-data font-bold text-[12.5px] text-[#1A1A1A]">BEV-JUI-12</span>
                <span className="text-[#9C5B23] font-mono-data font-bold text-[11px] flex items-center gap-1 bg-[#FBF4E8] px-1.5 py-0.2 rounded">
                  <span className="material-symbols-outlined text-[13px]">timer</span> 12 Days
                </span>
              </div>
              <p className="text-[11.5px] text-[#5C5850] mb-2 font-sans">Orange Juice 250ml (Batch #J441)</p>
              
              <div className="flex justify-between items-center bg-[#F4F1EA] p-2 rounded border border-[#1A1A1A]/10 mb-2 text-[11px]">
                <span className="text-[#78746D]">
                  Qty: <strong className="text-[#1A1A1A] font-mono-data">120</strong>
                </span>
                <span className="text-[#78746D]">
                  Value: <strong className="text-[#1A1A1A] font-mono-data">$180.00</strong>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => applyExpiryDiscount('bat-2', 15)}
                  className="flex-1 bg-[#FFFFFF] border border-[#1A1A1A]/20 text-[#1A1A1A] text-[11px] font-bold py-1.5 rounded hover:bg-[#F4F1EA] transition-colors cursor-pointer"
                >
                  Discount 15%
                </button>
                <button
                  onClick={() => writeOffBatch('bat-2')}
                  className="flex-1 bg-[#FFFFFF] border border-[#8B2626]/40 text-[#8B2626] text-[11px] font-bold py-1.5 rounded hover:bg-[#F9EBEB] transition-colors cursor-pointer"
                >
                  Write-off
                </button>
              </div>
            </div>

            {/* Other Expiring Batches */}
            {filteredBatches.filter(b => b.sku !== 'DAI-YOG-01' && b.sku !== 'BEV-JUI-12').map(b => (
              <div key={b.id} className="border border-[#1A1A1A]/12 bg-[#FFFFFF] rounded p-2.5 shadow-2xs text-[11.5px]">
                <div className="flex justify-between font-bold mb-1 font-mono-data">
                  <span>{b.sku}</span>
                  <span className="text-[#9C5B23]">{b.daysToExpiry}d rem.</span>
                </div>
                <p className="text-[#78746D] mb-1.5 font-sans">{b.productName} (Lot #{b.batchNumber})</p>
                <div className="flex justify-between text-[#1A1A1A] font-mono-data text-[11px]">
                  <span>Qty: {b.quantity}</span>
                  <span>Exp: {b.expiryDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Ledger Modal */}
      {showFullLedgerModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150 border border-[#1A1A1A]/20">
            <div className="p-4 border-b border-[#1A1A1A]/10 flex justify-between items-center bg-[#F4F1EA]">
              <div>
                <h3 className="text-[16px] font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1A1A1A]">receipt_long</span>
                  Complete Stock Movement Ledger
                </h3>
                <p className="text-[11.5px] text-[#78746D]">Chronological audit trail of all inventory receipts, issues, and adjustments</p>
              </div>
              <button
                onClick={() => setShowFullLedgerModal(false)}
                className="text-[#78746D] hover:text-[#1A1A1A] p-1 rounded"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="bg-[#F4F1EA] font-bold text-[#78746D] border-b border-[#1A1A1A]/10 uppercase text-[10px] tracking-editorial">
                    <th className="p-2">Timestamp</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">SKU</th>
                    <th className="p-2 text-right">Quantity</th>
                    <th className="p-2">Reference</th>
                    <th className="p-2">Auditor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]/8 font-mono-data">
                  {stockMovements.map(m => (
                    <tr key={m.id} className="hover:bg-[#F4F1EA]">
                      <td className="p-2 text-[#78746D] font-sans">{m.timeFormatted}</td>
                      <td className="p-2 font-sans font-semibold">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#EEEBE3] text-[#1A1A1A] border border-[#1A1A1A]/10">
                          {m.type}
                        </span>
                      </td>
                      <td className="p-2 font-bold text-[#1A1A1A]">{m.sku}</td>
                      <td className={`p-2 text-right font-bold ${m.quantity > 0 ? 'text-[#234E3E]' : 'text-[#8B2626]'}`}>
                        {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                      </td>
                      <td className="p-2 text-[#5C5850] font-sans">{m.referenceNo}</td>
                      <td className="p-2 text-[#78746D] font-sans text-[11px]">{m.actor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border-t border-[#1A1A1A]/10 flex justify-end bg-[#F4F1EA]">
              <button
                onClick={() => setShowFullLedgerModal(false)}
                className="bg-[#1A1A1A] text-[#F9F7F2] text-[11.5px] font-medium px-4 py-2 rounded"
              >
                Dismiss Journal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
