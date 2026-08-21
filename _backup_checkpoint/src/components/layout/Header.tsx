import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const {
    currentUser,
    globalSearch,
    setGlobalSearch,
    setActiveTab,
    products,
    batches,
    customers,
    setIsNewSaleOpen,
    setIsAddStockOpen,
    setIsAiOptimizerOpen
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Critical alerts count
  const expiringBatches = batches.filter(b => b.daysToExpiry <= 15);
  const lowStockProducts = products.filter(p => p.inStock <= p.minThreshold);
  const overdueCustomers = customers.filter(c => c.overdueAmount > 0);
  const totalAlertsCount = expiringBatches.length + lowStockProducts.length + overdueCustomers.length;

  const filteredSearchResults = globalSearch.trim() === '' ? [] : [
    ...products.filter(p => p.name.toLowerCase().includes(globalSearch.toLowerCase()) || p.sku.toLowerCase().includes(globalSearch.toLowerCase())).map(p => ({ type: 'Product', label: `${p.sku} - ${p.name}`, tab: 'inventory' as const })),
    ...customers.filter(c => c.name.toLowerCase().includes(globalSearch.toLowerCase()) || c.storeName.toLowerCase().includes(globalSearch.toLowerCase())).map(c => ({ type: 'Customer', label: `${c.name} (${c.storeName})`, tab: 'customers' as const })),
    ...batches.filter(b => b.batchNumber.toLowerCase().includes(globalSearch.toLowerCase())).map(b => ({ type: 'Batch', label: `Batch #${b.batchNumber} - ${b.productName}`, tab: 'inventory' as const }))
  ].slice(0, 6);

  return (
    <header className="fixed top-0 right-0 left-[240px] h-16 bg-[#FFFFFF] border-b border-[#1A1A1A]/10 flex justify-between items-center px-6 z-20 shadow-[0_1px_4px_rgba(26,26,26,0.02)]">
      {/* Global Search Bar with AI Icon */}
      <div className="flex-1 max-w-md relative">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#78746D] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            placeholder="Search SKU ledger, batch numbers, retailer accounts..."
            className="w-full bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded pl-9 pr-9 py-2 text-[13px] text-[#1A1A1A] placeholder-[#78746D] focus:outline-none focus:border-[#1A1A1A] focus:bg-[#FFFFFF] transition-all shadow-2xs"
          />
          <button
            onClick={() => setActiveTab('ai-center')}
            title="Consult AI Business Assistant"
            className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C733E] text-[18px] hover:scale-110 transition-transform cursor-pointer"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            auto_awesome
          </button>
        </div>

        {/* Live Search Dropdown */}
        {showSearchDropdown && globalSearch.trim() !== '' && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#FFFFFF] border border-[#1A1A1A]/15 rounded shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="text-[9.5px] font-bold text-[#78746D] px-2 py-1 uppercase tracking-widest border-b border-[#1A1A1A]/10">
              Matching Records ({filteredSearchResults.length})
            </div>
            {filteredSearchResults.length > 0 ? (
              <div className="space-y-1 mt-1">
                {filteredSearchResults.map((res, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveTab(res.tab);
                      setShowSearchDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded text-left text-[12.5px] hover:bg-[#F4F1EA] transition-colors cursor-pointer"
                  >
                    <span className="text-[#1A1A1A] font-medium truncate">{res.label}</span>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-[#1A1A1A] bg-[#EEEBE3] px-2 py-0.5 rounded border border-[#1A1A1A]/10">
                      {res.type}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center text-[12px] text-[#78746D] font-serif italic">
                No matching master records found in catalog.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Action Buttons & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Sale / Stock buttons */}
        <div className="hidden lg:flex items-center gap-2 mr-2">
          <button
            onClick={() => setIsNewSaleOpen(true)}
            className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F7F2] border border-[#D4AF37]/50 text-[11.5px] font-medium tracking-wide px-3 py-1.5 rounded flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[15px] text-[#D4AF37]">point_of_sale</span>
            New Order Entry
          </button>
          <button
            onClick={() => setIsAddStockOpen(true)}
            className="bg-[#FFFFFF] border border-[#1A1A1A]/20 hover:bg-[#F4F1EA] text-[#1A1A1A] text-[11.5px] font-medium tracking-wide px-3 py-1.5 rounded flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[15px] text-[#78746D]">add</span>
            Receive Inventory
          </button>
        </div>

        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-[#5C5850] hover:text-[#1A1A1A] hover:bg-[#F4F1EA] rounded transition-colors cursor-pointer"
            title="Operational Alerts"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {totalAlertsCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#8B2626] text-[#F9F7F2] text-[8.5px] font-mono-data font-bold flex items-center justify-center rounded-full border border-white">
                {totalAlertsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[#FFFFFF] border border-[#1A1A1A]/15 rounded shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]/10">
                <span className="text-[12px] font-bold text-[#1A1A1A] uppercase tracking-wider">Priority Bulletins</span>
                <span className="text-[9px] bg-[#F9EBEB] text-[#8B2626] border border-[#8B2626]/20 font-mono-data font-bold px-1.5 py-0.5 rounded">
                  {totalAlertsCount} Active
                </span>
              </div>
              <div className="divide-y divide-[#1A1A1A]/10 max-h-72 overflow-y-auto custom-scrollbar">
                {expiringBatches.map(b => (
                  <div key={b.id} className="py-2 flex items-start gap-2 cursor-pointer hover:bg-[#F9EBEB]/60 p-1.5 rounded transition-colors" onClick={() => { setActiveTab('inventory'); setShowNotifications(false); }}>
                    <span className="material-symbols-outlined text-[#8B2626] text-[16px] mt-0.5">timer</span>
                    <div>
                      <p className="text-[12px] font-medium text-[#1A1A1A]">{b.sku} ({b.productName})</p>
                      <p className="text-[10.5px] text-[#8B2626] font-mono-data font-medium">Expires in {b.daysToExpiry} days • Batch #{b.batchNumber}</p>
                    </div>
                  </div>
                ))}
                {lowStockProducts.map(p => (
                  <div key={p.id} className="py-2 flex items-start gap-2 cursor-pointer hover:bg-[#FBF4E8]/80 p-1.5 rounded transition-colors" onClick={() => { setActiveTab('inventory'); setShowNotifications(false); }}>
                    <span className="material-symbols-outlined text-[#9C5B23] text-[16px] mt-0.5">inventory_2</span>
                    <div>
                      <p className="text-[12px] font-medium text-[#1A1A1A]">{p.name}</p>
                      <p className="text-[10.5px] text-[#9C5B23] font-mono-data font-medium">In Stock: {p.inStock} units (Threshold {p.minThreshold})</p>
                    </div>
                  </div>
                ))}
                {overdueCustomers.map(c => (
                  <div key={c.id} className="py-2 flex items-start gap-2 cursor-pointer hover:bg-[#F4F1EA] p-1.5 rounded transition-colors" onClick={() => { setActiveTab('collections'); setShowNotifications(false); }}>
                    <span className="material-symbols-outlined text-[#8C733E] text-[16px] mt-0.5">account_balance_wallet</span>
                    <div>
                      <p className="text-[12px] font-medium text-[#1A1A1A]">{c.name}</p>
                      <p className="text-[10.5px] text-[#5C5850] font-mono-data font-medium">${c.overdueAmount.toLocaleString()} overdue ledger balance</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Assistant Quick Toggle */}
        <button
          onClick={() => setActiveTab('ai-center')}
          className="p-1.5 text-[#8C733E] hover:bg-[#F4F1EA] rounded transition-colors cursor-pointer flex items-center justify-center border border-[#D4AF37]/30"
          title="Open AI Business Advisor"
        >
          <span className="material-symbols-outlined text-[19px] fill-1">auto_awesome</span>
        </button>

        {/* Profile Avatar */}
        <div
          onClick={() => setActiveTab('staff')}
          className="flex items-center gap-2 p-1 rounded hover:bg-[#F4F1EA] cursor-pointer transition-colors border border-transparent hover:border-[#1A1A1A]/10"
          title={`${currentUser.name} (${currentUser.role})`}
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-7 h-7 rounded-full object-cover border border-[#1A1A1A]/20"
          />
        </div>
      </div>
    </header>
  );
};
