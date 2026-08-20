import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';

export const CustomerManagement: React.FC = () => {
  const {
    customers,
    addCustomer,
    updateCustomer,
    setIsRecordPaymentOpen,
    setSelectedCustomerIdForPayment,
    addToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState('All Zones');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    storeName: '',
    phone: '',
    email: '',
    address: '',
    zone: 'North Zone',
    creditLimit: 5000,
    creditDays: 30
  });

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = zoneFilter === 'All Zones' || c.zone === zoneFilter;
    return matchesSearch && matchesZone;
  });

  const totalOutstanding = customers.reduce((sum, c) => sum + c.outstandingBalance, 0);
  const totalOverdue = customers.reduce((sum, c) => sum + c.overdueAmount, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer({
      name: newCustomerForm.name,
      storeName: newCustomerForm.storeName,
      phone: newCustomerForm.phone,
      email: newCustomerForm.email,
      address: newCustomerForm.address,
      zone: newCustomerForm.zone,
      creditLimit: Number(newCustomerForm.creditLimit),
      creditDays: Number(newCustomerForm.creditDays),
      outstandingBalance: 0,
      overdueAmount: 0,
      status: 'Active'
    });
    setShowAddCustomerModal(false);
    setNewCustomerForm({
      name: '',
      storeName: '',
      phone: '',
      email: '',
      address: '',
      zone: 'North Zone',
      creditLimit: 5000,
      creditDays: 30
    });
  };

  return (
    <div className="p-6 max-w-[1440px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-2 border-b border-[#1A1A1A]/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-editorial text-[#8C733E]">Accounts Directory</span>
            <span className="text-[#1A1A1A]/30 text-xs">•</span>
            <span className="text-[10px] uppercase font-mono-data text-[#78746D]">Credit Risk Ledger</span>
          </div>
          <h2 className="text-[32px] font-serif font-bold text-[#1A1A1A] tracking-tight">Customer Accounts & Credit</h2>
          <p className="text-[13.5px] text-[#5C5850]">Manage retail store accounts, credit limits, and collection pipelines.</p>
        </div>
        <button
          onClick={() => setShowAddCustomerModal(true)}
          className="bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/50 text-[12px] font-medium py-2 px-4 rounded flex items-center gap-2 hover:bg-[#2A2A2A] transition-all shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">person_add</span>
          Add Retail Customer
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 p-4 rounded shadow-2xs">
          <span className="text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">Active Retailers</span>
          <div className="text-[24px] font-serif font-bold text-[#1A1A1A] mt-1">{customers.length} Accounts</div>
          <span className="text-[11px] text-[#234E3E] font-medium">Spread across 4 distribution zones</span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 p-4 rounded shadow-2xs">
          <span className="text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">Market Receivables</span>
          <div className="text-[24px] font-bold text-[#1A1A1A] font-mono-data mt-1">
            ${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-[#5C5850]">Pending invoices on credit terms</span>
        </div>

        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 p-4 rounded shadow-2xs">
          <span className="text-[10px] font-bold text-[#8B2626] uppercase tracking-editorial">Overdue Receivables</span>
          <div className="text-[24px] font-bold text-[#8B2626] font-mono-data mt-1">
            ${totalOverdue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-[#8B2626] font-medium">Exceeded standard payment terms</span>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded shadow-2xs overflow-hidden">
        <div className="p-3.5 border-b border-[#1A1A1A]/10 flex flex-col sm:flex-row justify-between gap-3 bg-[#F4F1EA]">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#78746D] text-[17px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, store, code..."
              className="w-full bg-[#FFFFFF] border border-[#1A1A1A]/20 rounded pl-8 pr-3 py-1.5 text-[12px] outline-none focus:border-[#1A1A1A]"
            />
          </div>

          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="bg-[#FFFFFF] border border-[#1A1A1A]/20 rounded px-3 py-1.5 text-[11.5px] font-medium text-[#1A1A1A] outline-none"
          >
            <option>All Zones</option>
            <option>North Zone</option>
            <option>South Zone</option>
            <option>Central Zone</option>
            <option>East Zone</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12.5px]">
            <thead className="bg-[#FFFFFF] border-b border-[#1A1A1A]/10 text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">
              <tr>
                <th className="p-3.5">Customer / Code</th>
                <th className="p-3.5">Store & Zone</th>
                <th className="p-3.5">Contact Details</th>
                <th className="p-3.5 text-right">Credit Limit</th>
                <th className="p-3.5 text-right">Outstanding</th>
                <th className="p-3.5 text-right">Overdue</th>
                <th className="p-3.5 text-center">Credit Utilized</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/8 font-mono-data">
              {filteredCustomers.map(cust => {
                const utilPercent = Math.min(100, Math.round((cust.outstandingBalance / cust.creditLimit) * 100));
                const isOverLimit = cust.outstandingBalance > cust.creditLimit;

                return (
                  <tr key={cust.id} className="hover:bg-[#F4F1EA] transition-colors">
                    <td className="p-3.5 font-sans">
                      <div className="font-bold text-[#1A1A1A]">{cust.name}</div>
                      <div className="text-[11px] text-[#78746D] font-mono-data">{cust.code}</div>
                    </td>
                    <td className="p-3.5 font-sans">
                      <div className="font-medium text-[#1A1A1A]">{cust.storeName}</div>
                      <span className="text-[10px] bg-[#EEEBE3] text-[#5C5850] px-1.5 py-0.2 rounded border border-[#1A1A1A]/10 inline-block mt-0.5">{cust.zone}</span>
                    </td>
                    <td className="p-3.5 font-sans text-[11.5px] text-[#5C5850]">
                      <div>{cust.phone}</div>
                      <div className="text-[10.5px] text-[#78746D] font-mono-data">{cust.email}</div>
                    </td>
                    <td className="p-3.5 text-right text-[#1A1A1A]">
                      ${cust.creditLimit.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right font-bold text-[#1A1A1A]">
                      ${cust.outstandingBalance.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right font-bold text-[#8B2626]">
                      {cust.overdueAmount > 0 ? `$${cust.overdueAmount.toLocaleString()}` : '$0'}
                    </td>
                    <td className="p-3.5 text-center font-sans">
                      <div className="w-24 mx-auto">
                        <div className="flex justify-between text-[9.5px] font-mono-data font-bold mb-0.5">
                          <span>{utilPercent}%</span>
                          {isOverLimit && <span className="text-[#8B2626]">OVER</span>}
                        </div>
                        <div className="w-full bg-[#EEEBE3] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              utilPercent > 85 ? 'bg-[#8B2626]' : utilPercent > 50 ? 'bg-[#9C5B23]' : 'bg-[#234E3E]'
                            }`}
                            style={{ width: `${utilPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-center font-sans">
                      <button
                        onClick={() => {
                          setSelectedCustomerIdForPayment(cust.id);
                          setIsRecordPaymentOpen(true);
                        }}
                        className="bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/40 text-[11px] font-medium px-3 py-1 rounded hover:bg-[#2A2A2A] transition-all flex items-center gap-1 mx-auto shadow-2xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[13px] text-[#D4AF37]">payments</span>
                        Collect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 border border-[#1A1A1A]/20">
            <h3 className="text-[17px] font-serif font-bold text-[#1A1A1A] mb-4">Register New Retail Customer</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-[12.5px]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Customer / Owner Name</label>
                  <input
                    type="text"
                    required
                    value={newCustomerForm.name}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                    className="w-full p-2 border border-[#1A1A1A]/20 rounded outline-none focus:border-[#1A1A1A]"
                    placeholder="e.g. David Miller"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Store / Outlet Name</label>
                  <input
                    type="text"
                    required
                    value={newCustomerForm.storeName}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, storeName: e.target.value })}
                    className="w-full p-2 border border-[#1A1A1A]/20 rounded outline-none focus:border-[#1A1A1A]"
                    placeholder="e.g. Miller Supermarket"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newCustomerForm.phone}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                    className="w-full p-2 border border-[#1A1A1A]/20 rounded outline-none focus:border-[#1A1A1A] font-mono-data"
                    placeholder="+1 (555) 019-2834"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Email</label>
                  <input
                    type="email"
                    value={newCustomerForm.email}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                    className="w-full p-2 border border-[#1A1A1A]/20 rounded outline-none focus:border-[#1A1A1A] font-mono-data"
                    placeholder="david@millers.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Delivery Zone</label>
                  <select
                    value={newCustomerForm.zone}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, zone: e.target.value })}
                    className="w-full p-2 border border-[#1A1A1A]/20 rounded outline-none focus:border-[#1A1A1A] bg-[#FFFFFF]"
                  >
                    <option>North Zone</option>
                    <option>South Zone</option>
                    <option>Central Zone</option>
                    <option>East Zone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Credit Limit ($)</label>
                  <input
                    type="number"
                    value={newCustomerForm.creditLimit}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, creditLimit: Number(e.target.value) })}
                    className="w-full p-2 border border-[#1A1A1A]/20 rounded outline-none focus:border-[#1A1A1A] font-mono-data"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Credit Days</label>
                  <input
                    type="number"
                    value={newCustomerForm.creditDays}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, creditDays: Number(e.target.value) })}
                    className="w-full p-2 border border-[#1A1A1A]/20 rounded outline-none focus:border-[#1A1A1A] font-mono-data"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Delivery Address</label>
                <input
                  type="text"
                  value={newCustomerForm.address}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, address: e.target.value })}
                  className="w-full p-2 border border-[#1A1A1A]/20 rounded outline-none focus:border-[#1A1A1A]"
                  placeholder="Street address, shop number..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#1A1A1A]/10">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2 text-[#5C5850] hover:bg-[#F4F1EA] rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A1A1A] text-[#F9F7F2] font-medium rounded hover:bg-[#2A2A2A]"
                >
                  Save Customer Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
