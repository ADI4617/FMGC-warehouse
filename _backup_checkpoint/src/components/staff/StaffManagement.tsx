import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole, StaffStatus } from '../../types';
import { AddStaffModal } from './AddStaffModal';
import { StaffDetailModal } from './StaffDetailModal';

export const StaffManagement: React.FC = () => {
  const {
    users,
    currentUser,
    setCurrentUser,
    addToast,
    navigateTo,
    resendInvitation
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<User | null>(null);

  // Computed metrics
  const totalStaff = users.length;
  const activeStaff = users.filter(u => u.status === 'active').length;
  const pendingStaff = users.filter(u => u.status === 'pending').length;
  const adminStaff = users.filter(u => u.role === 'Admin' || u.role === 'Owner').length;

  // Filtered staff records
  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.phone && u.phone.includes(searchQuery));

    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: StaffStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#EBF5EE] text-[#234E3E] border border-[#234E3E]/25">
            <span className="w-1.5 h-1.5 rounded-full bg-[#234E3E]" />
            Active
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#FBF4E8] text-[#9C5B23] border border-[#9C5B23]/25">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9C5B23]" />
            Pending Invite
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#F9EBEB] text-[#8B2626] border border-[#8B2626]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B2626]" />
            Suspended
          </span>
        );
      case 'deactivated':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#EEEBE3] text-[#78746D] border border-[#1A1A1A]/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#78746D]" />
            Deactivated
          </span>
        );
      default:
        return null;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'Owner':
        return (
          <span className="text-[10px] font-bold text-[#8C733E] bg-[#F4F1EA] border border-[#8C733E]/30 px-2 py-0.5 rounded tracking-wide">
            OWNER
          </span>
        );
      case 'Admin':
        return (
          <span className="text-[10px] font-bold text-[#1A1A1A] bg-[#EEEBE3] border border-[#1A1A1A]/20 px-2 py-0.5 rounded tracking-wide">
            ADMIN
          </span>
        );
      case 'Manager':
        return (
          <span className="text-[10px] font-bold text-[#234E3E] bg-[#EBF5EE] border border-[#234E3E]/20 px-2 py-0.5 rounded tracking-wide">
            MANAGER
          </span>
        );
      case 'Warehouse':
        return (
          <span className="text-[10px] font-bold text-[#5C5850] bg-[#F4F1EA] border border-[#1A1A1A]/10 px-2 py-0.5 rounded tracking-wide">
            WAREHOUSE
          </span>
        );
      case 'Sales Staff':
        return (
          <span className="text-[10px] font-bold text-[#9C5B23] bg-[#FBF4E8] border border-[#9C5B23]/25 px-2 py-0.5 rounded tracking-wide">
            SALES
          </span>
        );
      case 'Collection Staff':
        return (
          <span className="text-[10px] font-bold text-[#234E3E] bg-[#EBF5EE] border border-[#234E3E]/20 px-2 py-0.5 rounded tracking-wide">
            COLLECTION
          </span>
        );
      case 'Viewer':
        return (
          <span className="text-[10px] font-bold text-[#78746D] bg-[#F4F1EA] border border-[#1A1A1A]/10 px-2 py-0.5 rounded tracking-wide">
            VIEWER
          </span>
        );
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Top Editorial Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-3 border-b border-[#1A1A1A]/10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C733E]">
              Organization & Security
            </span>
            <span className="text-[#1A1A1A]/30 text-xs">•</span>
            <span className="text-[10px] uppercase font-mono-data text-[#78746D]">
              Personnel & RBAC
            </span>
          </div>
          <h2 className="text-[30px] sm:text-[34px] font-serif font-bold text-[#1A1A1A] tracking-tight">
            Staff & Roles
          </h2>
          <p className="text-[13.5px] text-[#5C5850] mt-0.5">
            Manage employees, roles and access permissions across your distribution business.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigateTo('/staff/roles')}
            className="bg-[#FFFFFF] hover:bg-[#F4F1EA] border border-[#1A1A1A]/20 text-[#1A1A1A] px-4 py-2 rounded text-[12.5px] font-medium tracking-wide flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-[0.99] transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-[#8C733E]">tune</span>
            <span>Manage Roles</span>
          </button>
          
          <button
            onClick={() => setIsAddStaffOpen(true)}
            className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F7F2] border border-[#D4AF37]/50 px-4 py-2 rounded text-[12.5px] font-medium tracking-wide flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-[0.99] transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">person_add</span>
            <span>+ Add Staff</span>
          </button>
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Staff */}
        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-[#78746D] mb-1">
            <span className="text-[10.5px] uppercase font-bold tracking-wider">Total Staff</span>
            <span className="material-symbols-outlined text-[18px]">group</span>
          </div>
          <div className="text-[26px] font-mono-data font-bold text-[#1A1A1A] leading-tight">
            {totalStaff}
          </div>
          <div className="text-[11px] text-[#5C5850] mt-1 font-serif italic">
            Across all depots & field zones
          </div>
        </div>

        {/* Active Staff */}
        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-[#234E3E] mb-1">
            <span className="text-[10.5px] uppercase font-bold tracking-wider">Active</span>
            <span className="material-symbols-outlined text-[18px]">verified</span>
          </div>
          <div className="text-[26px] font-mono-data font-bold text-[#234E3E] leading-tight">
            {activeStaff}
          </div>
          <div className="text-[11px] text-[#5C5850] mt-1 font-serif italic">
            Authorized session holders
          </div>
        </div>

        {/* Pending Invitations */}
        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-[#9C5B23] mb-1">
            <span className="text-[10.5px] uppercase font-bold tracking-wider">Pending Invitations</span>
            <span className="material-symbols-outlined text-[18px]">mail</span>
          </div>
          <div className="text-[26px] font-mono-data font-bold text-[#9C5B23] leading-tight">
            {pendingStaff}
          </div>
          <div className="text-[11px] text-[#5C5850] mt-1 font-serif italic">
            Awaiting email registration
          </div>
        </div>

        {/* Administrators */}
        <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-[#8C733E] mb-1">
            <span className="text-[10.5px] uppercase font-bold tracking-wider">Administrators</span>
            <span className="material-symbols-outlined text-[18px]">shield</span>
          </div>
          <div className="text-[26px] font-mono-data font-bold text-[#1A1A1A] leading-tight">
            {adminStaff}
          </div>
          <div className="text-[11px] text-[#5C5850] mt-1 font-serif italic">
            Owner & Admin security level
          </div>
        </div>
      </div>

      {/* Active Session Persona Bar */}
      <div className="bg-[#FFFFFF] border border-[#D4AF37]/50 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-12 h-12 rounded-md object-cover border border-[#D4AF37] shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-[16px] text-[#1A1A1A]">
                {currentUser.name}
              </span>
              <span className="bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/40 text-[10px] font-semibold px-2 py-0.5 rounded tracking-wide">
                Active Session ({currentUser.role})
              </span>
            </div>
            <p className="text-[11.5px] text-[#78746D] font-mono-data mt-0.5">
              {currentUser.email} • {currentUser.department || 'Operations'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
          <div className="text-right hidden md:block">
            <span className="text-[9.5px] uppercase font-bold tracking-wider text-[#78746D] block">
              Simulate Active Role
            </span>
            <span className="text-[11.5px] text-[#234E3E] font-medium font-mono-data">
              Instant Persona Switch
            </span>
          </div>

          <select
            value={currentUser.id}
            onChange={(e) => {
              const selected = users.find(u => u.id === e.target.value);
              if (selected) {
                setCurrentUser(selected);
                addToast('info', 'Switched Active Persona', `Now simulating system as ${selected.name} (${selected.role})`);
              }
            }}
            className="bg-[#F4F1EA] border border-[#1A1A1A]/20 hover:border-[#1A1A1A] rounded px-3 py-1.5 text-[12.5px] text-[#1A1A1A] font-medium cursor-pointer outline-none transition-colors"
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Ledger Table with Search & Filters */}
      <div className="bg-[#FFFFFF] border border-[#1A1A1A]/15 rounded-lg shadow-2xs overflow-hidden">
        
        {/* Table Filters Header */}
        <div className="p-4 border-b border-[#1A1A1A]/10 bg-[#FBF9F4] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#78746D] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search staff by name, email, department, phone..."
              className="w-full bg-[#FFFFFF] border border-[#1A1A1A]/20 rounded pl-9 pr-3 py-1.5 text-[12.5px] text-[#1A1A1A] placeholder-[#78746D] outline-none focus:border-[#1A1A1A] transition-all"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2">
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#FFFFFF] border border-[#1A1A1A]/20 rounded px-2.5 py-1.5 text-[12px] text-[#1A1A1A] font-medium outline-none cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="Owner">Owner</option>
              <option value="Admin">Administrator</option>
              <option value="Manager">Operations Manager</option>
              <option value="Warehouse">Warehouse Staff</option>
              <option value="Sales Staff">Sales Staff</option>
              <option value="Collection Staff">Collection Staff</option>
              <option value="Viewer">Viewer</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#FFFFFF] border border-[#1A1A1A]/20 rounded px-2.5 py-1.5 text-[12px] text-[#1A1A1A] font-medium outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="deactivated">Deactivated</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-[12.5px] border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-[#F4F1EA] border-b border-[#1A1A1A]/12 text-[10px] font-bold text-[#78746D] uppercase tracking-widest">
                <th className="p-3.5 pl-5">Staff Member</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Last Active</th>
                <th className="p-3.5">Module Access</th>
                <th className="p-3.5 text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/8">
              {filteredUsers.map((u) => {
                const isActivePersona = u.id === currentUser.id;

                return (
                  <tr
                    key={u.id}
                    className={`hover:bg-[#F9F7F2]/80 transition-colors ${
                      isActivePersona ? 'bg-[#F4F1EA]/40' : ''
                    }`}
                  >
                    {/* Staff Member */}
                    <td className="p-3.5 pl-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#1A1A1A]/15 shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isActivePersona && (
                              <span className="text-[9px] bg-[#1A1A1A] text-[#F9F7F2] px-1.5 py-0.2 rounded font-mono-data font-bold">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-mono-data text-[#78746D]">{u.email}</div>
                          {u.phone && <div className="text-[10px] font-mono-data text-[#78746D]">{u.phone}</div>}
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="p-3.5">
                      {getRoleBadge(u.role)}
                    </td>

                    {/* Department */}
                    <td className="p-3.5 text-[#5C5850]">
                      {u.department || 'Operations Team'}
                    </td>

                    {/* Status */}
                    <td className="p-3.5">
                      {getStatusBadge(u.status)}
                    </td>

                    {/* Last Active */}
                    <td className="p-3.5 font-mono-data text-[11.5px] text-[#5C5850]">
                      {u.lastActive}
                    </td>

                    {/* Module Access Badges */}
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {(u.accessModules || ['Dashboard', 'Reports']).slice(0, 2).map((mod, i) => (
                          <span
                            key={i}
                            className="bg-[#F4F1EA] text-[#5C5850] border border-[#1A1A1A]/8 px-1.5 py-0.5 rounded text-[9.5px] font-mono-data whitespace-nowrap"
                          >
                            {mod}
                          </span>
                        ))}
                        {(u.accessModules || []).length > 2 && (
                          <span className="text-[10px] text-[#78746D] self-center">
                            +{(u.accessModules || []).length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-right pr-5">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* View & Edit Profile */}
                        <button
                          onClick={() => setSelectedUserForDetail(u)}
                          className="bg-[#FFFFFF] hover:bg-[#F4F1EA] border border-[#1A1A1A]/20 text-[#1A1A1A] px-2.5 py-1 rounded text-[11.5px] font-medium transition-colors cursor-pointer"
                          title="Manage user profile & permissions"
                        >
                          Manage
                        </button>

                        {/* Switch Persona */}
                        {!isActivePersona && (
                          <button
                            onClick={() => {
                              setCurrentUser(u);
                              addToast('info', 'Persona Switched', `Active session switched to ${u.name} (${u.role})`);
                            }}
                            className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F7F2] border border-[#D4AF37]/40 px-2.5 py-1 rounded text-[11.5px] font-medium transition-all cursor-pointer"
                            title="Simulate role persona"
                          >
                            Simulate
                          </button>
                        )}

                        {/* Resend invite if pending */}
                        {u.status === 'pending' && (
                          <button
                            onClick={() => resendInvitation(u.id)}
                            className="text-[#8C733E] hover:text-[#1A1A1A] p-1 rounded hover:bg-[#F4F1EA] cursor-pointer"
                            title="Resend invitation email"
                          >
                            <span className="material-symbols-outlined text-[17px]">forward_to_inbox</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#78746D] font-serif italic text-[14px]">
                    No staff records found matching the specified query or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      <AddStaffModal
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
      />

      {/* Staff Detail / Action Modal */}
      <StaffDetailModal
        user={selectedUserForDetail}
        isOpen={!!selectedUserForDetail}
        onClose={() => setSelectedUserForDetail(null)}
      />
    </div>
  );
};
