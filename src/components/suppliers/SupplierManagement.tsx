import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const SupplierManagement: React.FC = () => {
  const { suppliers, addSupplier, setIsAddStockOpen } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    leadTimeDays: 3,
    paymentTerms: 'Net 30 Days'
  });

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSupplier({
      name: supplierForm.name,
      contactPerson: supplierForm.contactPerson,
      phone: supplierForm.phone,
      email: supplierForm.email,
      address: supplierForm.address,
      leadTimeDays: Number(supplierForm.leadTimeDays),
      paymentTerms: supplierForm.paymentTerms,
      totalPurchases: 0,
      payableBalance: 0
    });
    setShowAddSupplierModal(false);
    setSupplierForm({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      leadTimeDays: 3,
      paymentTerms: 'Net 30 Days'
    });
  };

  return (
    <div className="p-6 max-w-[1440px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pb-2 border-b border-[#1A1A1A]/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-editorial text-[#8C733E]">Vendor Directory</span>
            <span className="text-[#1A1A1A]/30 text-xs">•</span>
            <span className="text-[10px] uppercase font-mono-data text-[#78746D]">Supply Chain Procurement</span>
          </div>
          <h2 className="text-[32px] font-serif font-bold text-[#1A1A1A] tracking-tight">Suppliers & Manufacturers</h2>
          <p className="text-[13.5px] text-[#5C5850]">Vendor master data, lead time SLAs, and payable liabilities.</p>
        </div>
        <button
          onClick={() => setShowAddSupplierModal(true)}
          className="bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/50 text-[12px] font-medium py-2 px-4 rounded flex items-center gap-2 hover:bg-[#2A2A2A] transition-all shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">domain_add</span>
          Add Vendor / Supplier
        </button>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredSuppliers.map(sup => (
          <div key={sup.id} className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded p-5 shadow-2xs flex flex-col justify-between hover:border-[#1A1A1A]/30 transition-all">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="bg-[#EEEBE3] text-[#1A1A1A] font-bold text-[10px] px-2 py-0.5 rounded font-mono-data border border-[#1A1A1A]/10">
                  {sup.code}
                </span>
                <span className="text-[11px] text-[#234E3E] font-medium flex items-center gap-1 font-mono-data">
                  <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                  {sup.leadTimeDays}d Lead Time
                </span>
              </div>
              <h3 className="text-[17px] font-serif font-bold text-[#1A1A1A]">{sup.name}</h3>
              <p className="text-[12px] text-[#5C5850] mt-0.5 font-sans">Contact: {sup.contactPerson}</p>

              <div className="mt-4 pt-3 border-t border-[#1A1A1A]/8 space-y-1.5 text-[11.5px] text-[#78746D]">
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span className="font-mono-data text-[#1A1A1A]">{sup.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Terms:</span>
                  <span className="text-[#1A1A1A] font-medium font-sans">{sup.paymentTerms}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Purchases:</span>
                  <span className="font-mono-data font-bold text-[#1A1A1A]">${sup.totalPurchases.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1A1A1A]/8 flex justify-between items-center">
              <div>
                <span className="text-[9.5px] text-[#78746D] uppercase font-bold tracking-editorial block">Payable Balance</span>
                <span className="font-mono-data font-bold text-[14px] text-[#8B2626]">${sup.payableBalance.toLocaleString()}</span>
              </div>
              <button
                onClick={() => setIsAddStockOpen(true)}
                className="bg-[#F4F1EA] hover:bg-[#1A1A1A] hover:text-[#F9F7F2] text-[#1A1A1A] text-[11px] font-medium px-3 py-1.5 rounded transition-colors cursor-pointer border border-[#1A1A1A]/10 font-mono-data"
              >
                Create PO
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 border border-[#1A1A1A]/20">
            <h3 className="text-[17px] font-serif font-bold text-[#1A1A1A] mb-4">Register New Supplier / FMCG Brand</h3>
            <form onSubmit={handleSubmit} className="space-y-3.5 text-[12.5px]">
              <div>
                <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Company / Brand Name</label>
                <input
                  type="text"
                  required
                  value={supplierForm.name}
                  onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                  className="w-full p-2 border border-[#1A1A1A]/20 rounded outline-none focus:border-[#1A1A1A]"
                  placeholder="e.g. Nestle Distribution Central"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Key Account Manager</label>
                  <input
                    type="text"
                    required
                    value={supplierForm.contactPerson}
                    onChange={(e) => setSupplierForm({ ...supplierForm, contactPerson: e.target.value })}
                    className="w-full p-2 border border-[#1A1A1A]/20 rounded outline-none focus:border-[#1A1A1A]"
                    placeholder="e.g. Sarah Jenkins"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={supplierForm.phone}
                    onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                    className="w-full p-2 border border-[#1A1A1A]/20 rounded outline-none focus:border-[#1A1A1A] font-mono-data"
                    placeholder="+1 (555) 304-9988"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Lead Time (Days)</label>
                  <input
                    type="number"
                    value={supplierForm.leadTimeDays}
                    onChange={(e) => setSupplierForm({ ...supplierForm, leadTimeDays: Number(e.target.value) })}
                    className="w-full p-2 border border-[#1A1A1A]/20 rounded outline-none focus:border-[#1A1A1A] font-mono-data"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#78746D] uppercase tracking-editorial mb-1">Payment Terms</label>
                  <select
                    value={supplierForm.paymentTerms}
                    onChange={(e) => setSupplierForm({ ...supplierForm, paymentTerms: e.target.value })}
                    className="w-full p-2 border border-[#1A1A1A]/20 rounded outline-none focus:border-[#1A1A1A] bg-[#FFFFFF]"
                  >
                    <option>Net 15 Days</option>
                    <option>Net 30 Days</option>
                    <option>Net 45 Days</option>
                    <option>Immediate / Advance</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#1A1A1A]/10">
                <button
                  type="button"
                  onClick={() => setShowAddSupplierModal(false)}
                  className="px-4 py-2 text-[#5C5850] hover:bg-[#F4F1EA] rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A1A1A] text-[#F9F7F2] font-medium rounded hover:bg-[#2A2A2A]"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
