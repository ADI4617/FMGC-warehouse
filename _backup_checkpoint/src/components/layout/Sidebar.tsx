import React from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    setCurrentUser,
    users,
    currentTenant,
    logout,
    setIsAiOptimizerOpen
  } = useApp();

  const allNavItems: { id: NavigationTab; label: string; icon: string; badge?: string; isAi?: boolean; roles?: string[] }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'sales', label: 'Sales & Ledger', icon: 'shopping_cart', roles: ['Owner', 'Admin', 'Manager', 'Sales Staff'] },
    { id: 'purchase', label: 'Purchase Invoices', icon: 'inventory_2', roles: ['Owner', 'Admin', 'Manager', 'Warehouse'] },
    { id: 'inventory', label: 'Stock & Batches', icon: 'warehouse', roles: ['Owner', 'Admin', 'Manager', 'Warehouse'] },
    { id: 'customers', label: 'Retailers & Credits', icon: 'group', roles: ['Owner', 'Admin', 'Manager', 'Sales Staff', 'Collection Staff'] },
    { id: 'suppliers', label: 'Suppliers Registry', icon: 'local_shipping', roles: ['Owner', 'Admin', 'Manager'] },
    { id: 'collections', label: 'Collections Hub', icon: 'payments', roles: ['Owner', 'Admin', 'Manager', 'Collection Staff'] },
    { id: 'reports', label: 'Executive Reports', icon: 'assessment', roles: ['Owner', 'Admin', 'Manager', 'Collection Staff', 'Viewer'] },
    { id: 'ai-center', label: 'AI Business Center', icon: 'auto_awesome', isAi: true, roles: ['Owner', 'Admin', 'Manager'] },
    { id: 'staff', label: 'Staff & Roles', icon: 'badge', roles: ['Owner', 'Admin'] },
    { id: 'audit-logs', label: 'Audit Trail', icon: 'history', roles: ['Owner', 'Admin'] },
  ];

  // Filter navigation items by current user's role
  const allowedNavItems = allNavItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(currentUser.role);
  });

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-[#FFFFFF] border-r border-[#1A1A1A]/12 flex flex-col py-3.5 z-30 select-none shadow-[1px_0_10px_rgba(26,26,26,0.03)]">
      
      {/* Editorial Masthead Header */}
      <div className="px-4 mb-3 pb-3 border-b border-[#1A1A1A]/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#1A1A1A] text-[#F9F7F2] flex items-center justify-center border border-[#D4AF37]/50 shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[18px] text-[#D4AF37] fill-1">account_balance</span>
          </div>
          <div className="min-w-0">
            <h1 className="font-serif font-bold text-[16px] leading-tight text-[#1A1A1A] tracking-tight truncate">
              {currentTenant.name.split(' ')[0]} Distro
            </h1>
            <p className="text-[9px] uppercase tracking-widest font-semibold text-[#78746D] truncate">
              {currentTenant.plan} • Supply ERP
            </p>
          </div>
        </div>
        <div className="mt-2 h-[1.5px] w-8 bg-[#D4AF37]" />
      </div>

      {/* AI Optimizer Editorial CTA */}
      <div className="px-3 mb-2.5">
        <button
          onClick={() => setIsAiOptimizerOpen(true)}
          className="w-full bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F7F2] border border-[#D4AF37]/40 rounded py-2 px-3 flex items-center justify-center gap-2 text-[11.5px] font-medium tracking-wide shadow-xs cursor-pointer active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-[16px] text-[#D4AF37] fill-1">auto_awesome</span>
          <span>AI Optimizer Engine</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-0.5">
        <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-[#78746D]/80 flex items-center justify-between">
          <span>Directory</span>
          <span className="text-[8.5px] font-mono-data text-[#8C733E] uppercase">{currentUser.role}</span>
        </div>

        {allowedNavItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-[12.5px] transition-all cursor-pointer text-left ${
                isActive
                  ? 'bg-[#1A1A1A] text-[#F9F7F2] font-semibold shadow-xs'
                  : 'text-[#5C5850] font-normal hover:bg-[#F4F1EA] hover:text-[#1A1A1A]'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[17px] shrink-0 ${
                  isActive
                    ? item.isAi ? 'text-[#D4AF37]' : 'text-[#F9F7F2]'
                    : item.isAi ? 'text-[#8C733E]' : 'text-[#78746D]'
                }`}
                style={item.isAi && isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="truncate flex-1 tracking-tight">{item.label}</span>
              {item.badge && (
                <span className="text-[9px] bg-[#F9EBEB] text-[#8B2626] border border-[#8B2626]/20 px-1.5 py-0.2 rounded font-mono-data font-semibold">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />
              )}
            </button>
          );
        })}

        {/* Roles Sub-link if Admin/Owner */}
        {(currentUser.role === 'Owner' || currentUser.role === 'Admin') && (
          <button
            onClick={() => setActiveTab('staff-roles')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 pl-6 rounded text-[12px] transition-all cursor-pointer text-left ${
              activeTab === 'staff-roles'
                ? 'bg-[#1A1A1A] text-[#F9F7F2] font-semibold shadow-xs'
                : 'text-[#78746D] hover:bg-[#F4F1EA] hover:text-[#1A1A1A]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-[#8C733E]">tune</span>
            <span className="truncate flex-1">Roles & Matrix</span>
          </button>
        )}
      </nav>

      {/* Footer Navigation & Profile */}
      <div className="mt-auto px-2 pt-2 border-t border-[#1A1A1A]/10 space-y-0.5">
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-[12px] transition-colors cursor-pointer text-left ${
            activeTab === 'settings'
              ? 'bg-[#1A1A1A] text-[#F9F7F2] font-medium'
              : 'text-[#5C5850] hover:bg-[#F4F1EA]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] text-[#78746D]">settings</span>
          <span className="tracking-tight">System Settings</span>
        </button>

        {/* User Card with Role Switcher & Sign Out */}
        <div className="mt-1 pt-1.5 border-t border-[#1A1A1A]/10 px-2 bg-[#F4F1EA] rounded p-2 border border-[#1A1A1A]/8 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-[#1A1A1A]/20 shrink-0"
              />
              <div className="min-w-0 truncate">
                <p className="text-[11.5px] font-semibold text-[#1A1A1A] truncate leading-tight">{currentUser.name}</p>
                <span className="text-[8.5px] uppercase tracking-wider text-[#234E3E] font-bold">
                  {currentUser.role}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out of Session"
              className="text-[#78746D] hover:text-[#8B2626] p-1 rounded hover:bg-[#FFFFFF] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
            </button>
          </div>

          <div className="pt-1 border-t border-[#1A1A1A]/10 flex items-center justify-between">
            <span className="text-[9px] text-[#78746D] font-mono-data uppercase">Simulate:</span>
            <select
              value={currentUser.id}
              onChange={(e) => {
                const selected = users.find(u => u.id === e.target.value);
                if (selected) setCurrentUser(selected);
              }}
              title="Switch Active Persona"
              className="text-[9.5px] bg-[#FFFFFF] border border-[#1A1A1A]/20 rounded px-1.5 py-0.5 text-[#1A1A1A] font-medium cursor-pointer hover:border-[#1A1A1A] outline-none"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.role} ({u.name.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
};
