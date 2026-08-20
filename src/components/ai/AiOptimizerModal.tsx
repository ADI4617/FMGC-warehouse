import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

export const AiOptimizerModal: React.FC = () => {
  const {
    isAiOptimizerOpen,
    setIsAiOptimizerOpen,
    products,
    batches,
    customers,
    createPurchase,
    applyExpiryDiscount,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'reorder' | 'fefo' | 'routes' | 'credit'>('reorder');
  const [isExecuting, setIsExecuting] = useState(false);

  if (!isAiOptimizerOpen) return null;

  const lowStockItems = products.filter(p => p.inStock <= p.minThreshold);
  const expiringBatches = batches.filter(b => b.daysToExpiry <= 15);
  const highRiskCustomers = customers.filter(c => c.overdueAmount > 0);

  const handleExecuteAutoReorder = () => {
    setIsExecuting(true);
    setTimeout(() => {
      // Generate PO for first 2 depleted SKUs
      createPurchase({
        supplierId: 'sup-1',
        supplierName: 'Parle Agro & Biscuits Co.',
        date: new Date().toISOString().substring(0, 10),
        items: [
          {
            productId: 'prod-4',
            sku: 'PAR-GLU-80',
            name: 'Parle-G Glucose Biscuits 80g',
            quantity: 500,
            freeQuantity: 25,
            unitPrice: 0.35,
            batchNumber: 'PAR-AUTO-901',
            expiryDate: '2027-08-01',
            totalAmount: 175.00
          }
        ],
        totalAmount: 175.00,
        paymentStatus: 'Pending',
        isAiScanned: false,
        status: 'Confirmed'
      });

      setIsExecuting(false);
      setIsAiOptimizerOpen(false);
      addToast('success', 'AI Reorder PO Created', 'Generated PO for 500 units of Parle-G Glucose with supplier SLA 2 days.');
      try {
        confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
      } catch {}
    }, 1000);
  };

  const handleExecuteMarkdownClearance = () => {
    setIsExecuting(true);
    setTimeout(() => {
      applyExpiryDiscount('bat-1', 30);
      setIsExecuting(false);
      setIsAiOptimizerOpen(false);
      addToast('success', 'FEFO Clearance Active', 'Applied 30% markdown on Greek Yogurt to liquidate 45 units before 4-day expiry.');
      try {
        confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
      } catch {}
    }, 800);
  };

  const handleOptimizeRoutes = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setIsAiOptimizerOpen(false);
      addToast('success', 'Delivery Manifest Optimized', 'Clustered 5 retail drop-offs into 2 delivery routes. Reduced route distance by 24%.');
    }, 900);
  };

  return (
    <div className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] border border-[#1A1A1A]/20 rounded max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-5 bg-[#1A1A1A] border-b border-[#D4AF37]/40 text-[#F9F7F2] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#F4F1EA] border border-[#D4AF37] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#1A1A1A] text-[22px]">auto_awesome</span>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-editorial text-[#D4AF37]">Autonomous Optimization Matrix</div>
              <h3 className="text-[20px] font-serif font-bold tracking-tight text-[#F9F7F2]">AI Supply Chain Optimizer</h3>
            </div>
          </div>
          <button
            onClick={() => setIsAiOptimizerOpen(false)}
            className="text-[#F9F7F2]/70 hover:text-white p-1 cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#1A1A1A]/10 bg-[#F4F1EA] px-4 pt-2">
          {[
            { id: 'reorder', label: 'Predictive Reorder', icon: 'shopping_cart', count: lowStockItems.length },
            { id: 'fefo', label: 'FEFO Clearance', icon: 'event_busy', count: expiringBatches.length },
            { id: 'routes', label: 'Route Dispatch', icon: 'alt_route' },
            { id: 'credit', label: 'Credit Risk', icon: 'gavel', count: highRiskCustomers.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-3 text-[11.5px] uppercase tracking-editorial font-medium flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#1A1A1A] text-[#1A1A1A] bg-[#FFFFFF] rounded-t'
                  : 'border-transparent text-[#78746D] hover:text-[#1A1A1A]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
              {tab.label}
              {tab.count !== undefined && (
                <span className="text-[10px] bg-[#8B2626]/10 text-[#8B2626] font-bold px-1.5 py-0.2 rounded font-mono-data">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-[13px]">
          {activeTab === 'reorder' && (
            <div className="space-y-4">
              <div className="bg-[#F4F1EA] border border-[#1A1A1A]/12 p-3.5 rounded flex items-start gap-3">
                <span className="material-symbols-outlined text-[#8C733E] text-[22px] mt-0.5">insights</span>
                <div>
                  <h4 className="font-serif font-bold text-[#1A1A1A] text-[14.5px]">Stock Depletion Velocity Analysis</h4>
                  <p className="text-[12.5px] text-[#5C5850] mt-0.5">
                    Based on 14-day rolling run-rates, 2 SKUs will breach safety buffer stock within 48 hours.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="border border-[#1A1A1A]/12 rounded p-3 flex justify-between items-center bg-[#FFFFFF] shadow-2xs">
                  <div>
                    <div className="font-bold text-[#1A1A1A] font-mono-data">PAR-GLU-80 (Parle-G 80g)</div>
                    <div className="text-[12px] text-[#78746D]">Current: 45 units | Daily Run-rate: 22 units/day</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11.5px] font-bold text-[#8B2626] uppercase tracking-editorial block">Depletes in 2 Days</span>
                    <span className="text-[11px] text-[#234E3E] font-medium font-mono-data">Recommended PO: 500 units</span>
                  </div>
                </div>

                <div className="border border-[#1A1A1A]/12 rounded p-3 flex justify-between items-center bg-[#FFFFFF] shadow-2xs">
                  <div>
                    <div className="font-bold text-[#1A1A1A] font-mono-data">DAI-405-MIL (Full Cream Milk 1L)</div>
                    <div className="text-[12px] text-[#78746D]">Current: 0 units | Daily Run-rate: 35 units/day</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11.5px] font-bold text-[#8B2626] uppercase tracking-editorial block">Out of Stock Now</span>
                    <span className="text-[11px] text-[#234E3E] font-medium font-mono-data">Recommended PO: 250 units</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1A1A1A]/10 flex justify-end">
                <button
                  onClick={handleExecuteAutoReorder}
                  disabled={isExecuting}
                  className="bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/50 text-[12px] uppercase tracking-editorial font-medium py-2 px-5 rounded flex items-center gap-2 hover:bg-[#2A2A2A] transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">auto_awesome</span>
                  {isExecuting ? 'Generating PO...' : 'Auto-Generate Purchase Orders'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'fefo' && (
            <div className="space-y-4">
              <div className="bg-[#F4F1EA] border border-[#1A1A1A]/12 p-3.5 rounded flex items-start gap-3">
                <span className="material-symbols-outlined text-[#8C733E] text-[22px] mt-0.5">event_busy</span>
                <div>
                  <h4 className="font-serif font-bold text-[#1A1A1A] text-[14.5px]">FEFO Expiry Loss Mitigation Engine</h4>
                  <p className="text-[12.5px] text-[#5C5850] mt-0.5">
                    Identified $315.00 in vulnerable inventory. AI recommends automated 30% markdown to liquidate before expiration.
                  </p>
                </div>
              </div>

              <div className="border border-[#8B2626]/20 bg-[#F4F1EA] rounded p-3.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-serif font-bold text-[#1A1A1A]">DAI-YOG-01 (Greek Yogurt Plain 1kg)</h5>
                    <p className="text-[11.5px] text-[#78746D] font-mono-data">Batch #B992 | 45 units remaining | Expires in 4 days</p>
                  </div>
                  <span className="text-[10.5px] font-bold text-[#8B2626] bg-[#8B2626]/10 px-2 py-0.5 rounded font-mono-data">
                    30% Discount Recommended
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1A1A1A]/10 flex justify-end">
                <button
                  onClick={handleExecuteMarkdownClearance}
                  disabled={isExecuting}
                  className="bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/50 text-[12px] uppercase tracking-editorial font-medium py-2 px-5 rounded flex items-center gap-2 hover:bg-[#2A2A2A] transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">local_offer</span>
                  {isExecuting ? 'Applying...' : 'Activate 30% FEFO Clearance'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'routes' && (
            <div className="space-y-4">
              <div className="bg-[#F4F1EA] border border-[#1A1A1A]/12 p-3.5 rounded flex items-start gap-3">
                <span className="material-symbols-outlined text-[#8C733E] text-[22px] mt-0.5">local_shipping</span>
                <div>
                  <h4 className="font-serif font-bold text-[#1A1A1A] text-[14.5px]">Smart Delivery Dispatch Routing</h4>
                  <p className="text-[12.5px] text-[#5C5850] mt-0.5">
                    Orders ready for dispatch have been clustered by delivery zone and time windows to optimize vehicle fuel costs.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded shadow-2xs">
                  <div className="flex justify-between font-serif font-bold text-[13px] text-[#1A1A1A]">
                    <span>Van 1 (North Sector Route)</span>
                    <span className="text-[#234E3E] font-sans text-[12px]">3 Stops (City Retailers, Metro Mart, Green Grocers)</span>
                  </div>
                  <div className="text-[11.5px] text-[#78746D] mt-1 font-mono-data">Estimated Travel Time: 42 mins | Weight: 420 kg</div>
                </div>

                <div className="p-3 bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded shadow-2xs">
                  <div className="flex justify-between font-serif font-bold text-[13px] text-[#1A1A1A]">
                    <span>Van 2 (Central Sector Route)</span>
                    <span className="text-[#234E3E] font-sans text-[12px]">2 Stops (QuickStop, Corner Market)</span>
                  </div>
                  <div className="text-[11.5px] text-[#78746D] mt-1 font-mono-data">Estimated Travel Time: 28 mins | Weight: 180 kg</div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1A1A1A]/10 flex justify-end">
                <button
                  onClick={handleOptimizeRoutes}
                  disabled={isExecuting}
                  className="bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/50 text-[12px] uppercase tracking-editorial font-medium py-2 px-5 rounded flex items-center gap-2 hover:bg-[#2A2A2A] transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">alt_route</span>
                  {isExecuting ? 'Optimizing...' : 'Lock Manifest & Dispatch Vans'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'credit' && (
            <div className="space-y-4">
              <div className="bg-[#F4F1EA] border border-[#8B2626]/20 p-3.5 rounded flex items-start gap-3">
                <span className="material-symbols-outlined text-[#8B2626] text-[22px] mt-0.5">gavel</span>
                <div>
                  <h4 className="font-serif font-bold text-[#1A1A1A] text-[14.5px]">Customer Credit Limit Risk Enforcement</h4>
                  <p className="text-[12.5px] text-[#5C5850] mt-0.5">
                    Retail accounts with over 75% credit utilization or past 45-day overdue invoices will have new orders held pending collection.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {highRiskCustomers.map(c => (
                  <div key={c.id} className="p-3 bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded flex justify-between items-center shadow-2xs">
                    <div>
                      <div className="font-serif font-bold text-[#1A1A1A]">{c.name} ({c.storeName})</div>
                      <div className="text-[11.5px] text-[#78746D] font-mono-data">Credit: ${c.outstandingBalance} / ${c.creditLimit} limit</div>
                    </div>
                    <span className="text-[11px] font-bold text-[#8B2626] bg-[#8B2626]/10 px-2 py-0.5 rounded font-mono-data">
                      ${c.overdueAmount} Overdue (Hold Order)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
