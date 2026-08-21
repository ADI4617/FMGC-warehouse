import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, StaffStatus } from '../../types';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, onClose }) => {
  const { addStaffMember } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('Sales Staff');
  const [department, setDepartment] = useState('Field Sales - West Sector');
  const [status, setStatus] = useState<StaffStatus>('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim()) {
      setError('Please provide both staff member full name and work email.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      addStaffMember({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || '+91 98000 11223',
        role,
        department: department.trim(),
        status
      });
      setIsSubmitting(false);
      onClose();
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setRole('Sales Staff');
      setDepartment('Field Sales - West Sector');
      setStatus('pending');
    }, 350);
  };

  const departmentsList = [
    'Executive Operations',
    'Executive Office',
    'Central Warehouse Depot',
    'Field Sales - West Sector',
    'Field Sales - North Sector',
    'Finance & Accounts',
    'Logistics & Dispatch',
    'Trade Sales & Counter',
    'Audit & Compliance'
  ];

  return (
    <div className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#1A1A1A]/20 rounded-lg max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#1A1A1A]/10 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C733E]">Staff Directory</span>
              <span className="text-[#1A1A1A]/30 text-xs">•</span>
              <span className="text-[10px] uppercase font-mono-data text-[#78746D]">Identity Provisioning</span>
            </div>
            <h3 className="text-[20px] font-serif font-bold text-[#1A1A1A] tracking-tight">
              Add Staff Member
            </h3>
            <p className="text-[12.5px] text-[#5C5850]">
              Dispatch an onboarding invitation and assign system role permissions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#78746D] hover:text-[#1A1A1A] p-1 rounded hover:bg-[#F4F1EA] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {error && (
          <div className="bg-[#F9EBEB] border border-[#8B2626]/30 text-[#8B2626] rounded p-2.5 text-[12px] flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
              Full Legal Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vikas More"
              className="w-full bg-[#F4F1EA] border border-[#1A1A1A]/20 focus:border-[#1A1A1A] focus:bg-[#FFFFFF] rounded px-3 py-2 text-[13px] text-[#1A1A1A] placeholder-[#78746D] outline-none transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                Work Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vikas.m@apexfmcg.com"
                className="w-full bg-[#F4F1EA] border border-[#1A1A1A]/20 focus:border-[#1A1A1A] focus:bg-[#FFFFFF] rounded px-3 py-2 text-[13px] text-[#1A1A1A] placeholder-[#78746D] outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98210 66542"
                className="w-full bg-[#F4F1EA] border border-[#1A1A1A]/20 focus:border-[#1A1A1A] focus:bg-[#FFFFFF] rounded px-3 py-2 text-[13px] text-[#1A1A1A] placeholder-[#78746D] outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                Assign System Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-[#F4F1EA] border border-[#1A1A1A]/20 focus:border-[#1A1A1A] focus:bg-[#FFFFFF] rounded px-3 py-2 text-[13px] text-[#1A1A1A] outline-none cursor-pointer"
              >
                <option value="Admin">Administrator (Full operational access)</option>
                <option value="Manager">Manager (Commercial & Reports)</option>
                <option value="Warehouse">Warehouse Staff (Inward & Stock)</option>
                <option value="Sales Staff">Sales Staff (POS & Retailers)</option>
                <option value="Collection Staff">Collection Staff (Receipts & Credit)</option>
                <option value="Viewer">Viewer (Read-only reports)</option>
                <option value="Owner">Owner (Master Co-owner)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                Department / Team
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-[#F4F1EA] border border-[#1A1A1A]/20 focus:border-[#1A1A1A] focus:bg-[#FFFFFF] rounded px-3 py-2 text-[13px] text-[#1A1A1A] outline-none cursor-pointer"
              >
                {departmentsList.map((dep) => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1.5">
              Initial Invitation Status
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-[12.5px] text-[#1A1A1A] cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="pending"
                  checked={status === 'pending'}
                  onChange={() => setStatus('pending')}
                  className="text-[#1A1A1A] focus:ring-0 cursor-pointer"
                />
                <span>Send Pending Email Invitation</span>
              </label>
              <label className="flex items-center gap-2 text-[12.5px] text-[#1A1A1A] cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={status === 'active'}
                  onChange={() => setStatus('active')}
                  className="text-[#1A1A1A] focus:ring-0 cursor-pointer"
                />
                <span>Mark Immediately Active</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-[#1A1A1A]/10 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#FFFFFF] border border-[#1A1A1A]/20 hover:bg-[#F4F1EA] text-[#1A1A1A] px-4 py-2 rounded text-[12.5px] font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F7F2] border border-[#D4AF37]/50 px-5 py-2 rounded text-[12.5px] font-medium tracking-wide flex items-center gap-2 shadow-xs cursor-pointer active:scale-[0.99] transition-all disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                  <span>Sending Invitation...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">send</span>
                  <span>Send Invitation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
