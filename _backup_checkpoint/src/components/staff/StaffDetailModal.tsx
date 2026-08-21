import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';

interface StaffDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StaffDetailModal: React.FC<StaffDetailModalProps> = ({ user, isOpen, onClose }) => {
  const {
    currentUser,
    changeStaffRole,
    suspendStaffMember,
    reactivateStaffMember,
    deactivateStaffMember,
    resendInvitation,
    auditLogs
  } = useApp();

  const [isChangingRole, setIsChangingRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.role || 'Sales Staff');
  const [roleChangeReason, setRoleChangeReason] = useState('');
  
  const [showConfirmAction, setShowConfirmAction] = useState<'suspend' | 'deactivate' | 'reactivate' | null>(null);
  const [actionReason, setActionReason] = useState('');

  if (!isOpen || !user) return null;

  const isSelf = currentUser.id === user.id;

  // Filter relevant audit logs for this user
  const userLogs = auditLogs
    .filter(log => log.entityId === user.email || log.actor === user.name)
    .slice(0, 5);

  const handleSaveRole = () => {
    if (!selectedRole) return;
    changeStaffRole(user.id, selectedRole, roleChangeReason);
    setIsChangingRole(false);
    setRoleChangeReason('');
  };

  const handleConfirmStateAction = () => {
    if (showConfirmAction === 'suspend') {
      suspendStaffMember(user.id, actionReason);
    } else if (showConfirmAction === 'reactivate') {
      reactivateStaffMember(user.id);
    } else if (showConfirmAction === 'deactivate') {
      deactivateStaffMember(user.id, actionReason);
    }
    setShowConfirmAction(null);
    setActionReason('');
    onClose();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#EBF5EE] text-[#234E3E] border border-[#234E3E]/20">
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

  return (
    <div className="fixed inset-0 bg-[#1A1A1A]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#1A1A1A]/20 rounded-lg max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#1A1A1A]/10 pb-4">
          <div className="flex items-center gap-3.5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-14 h-14 rounded-md object-cover border border-[#1A1A1A]/20 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[20px] font-serif font-bold text-[#1A1A1A] leading-tight">
                  {user.name}
                </h3>
                {getStatusBadge(user.status)}
              </div>
              <p className="text-[12px] text-[#78746D] font-mono-data mt-0.5">{user.email} • {user.phone || 'No phone set'}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C733E] bg-[#F4F1EA] px-2 py-0.5 rounded border border-[#8C733E]/20">
                  {user.role}
                </span>
                <span className="text-[11px] text-[#5C5850]">
                  {user.department || 'Operations Team'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#78746D] hover:text-[#1A1A1A] p-1 rounded hover:bg-[#F4F1EA] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Sensitive Action Confirmation Box */}
        {showConfirmAction && (
          <div className="bg-[#F9EBEB] border border-[#8B2626]/30 rounded-lg p-4 space-y-3 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#8B2626] text-[22px] shrink-0">
                warning
              </span>
              <div>
                <h4 className="text-[14px] font-serif font-bold text-[#8B2626]">
                  {showConfirmAction === 'suspend' && `Suspend Access for ${user.name}?`}
                  {showConfirmAction === 'deactivate' && `Deactivate Account for ${user.name}?`}
                  {showConfirmAction === 'reactivate' && `Reactivate Access for ${user.name}?`}
                </h4>
                <p className="text-[12px] text-[#5C5850] mt-0.5">
                  {showConfirmAction === 'suspend' && 'The user will be immediately logged out and blocked from accessing protected modules until reactivated.'}
                  {showConfirmAction === 'deactivate' && 'This marks the user account as terminated. All active sessions and token allowances will be revoked.'}
                  {showConfirmAction === 'reactivate' && 'This will restore login capabilities and permission privileges for this staff member.'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-[10.5px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                Reason for Audit Trail *
              </label>
              <input
                type="text"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="e.g. Scheduled leave, security audit, department transfer"
                className="w-full bg-[#FFFFFF] border border-[#8B2626]/40 rounded px-3 py-1.5 text-[12.5px] outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowConfirmAction(null)}
                className="bg-[#FFFFFF] border border-[#1A1A1A]/20 px-3 py-1 rounded text-[12px] font-medium hover:bg-[#F4F1EA] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStateAction}
                className="bg-[#8B2626] hover:bg-[#701E1E] text-[#FFFFFF] px-3.5 py-1 rounded text-[12px] font-medium cursor-pointer"
              >
                Confirm {showConfirmAction === 'suspend' ? 'Suspension' : showConfirmAction === 'deactivate' ? 'Deactivation' : 'Reactivation'}
              </button>
            </div>
          </div>
        )}

        {/* Change Role Section */}
        {isChangingRole ? (
          <div className="bg-[#F4F1EA] border border-[#D4AF37]/40 rounded-lg p-4 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#1A1A1A]">
                Change System Role
              </span>
              <button
                onClick={() => setIsChangingRole(false)}
                className="text-[11.5px] text-[#78746D] hover:text-[#1A1A1A] underline cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                  Select New Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full bg-[#FFFFFF] border border-[#1A1A1A]/20 rounded px-3 py-1.5 text-[12.5px] outline-none cursor-pointer"
                >
                  <option value="Admin">Administrator</option>
                  <option value="Manager">Operations Manager</option>
                  <option value="Warehouse">Warehouse Staff</option>
                  <option value="Sales Staff">Sales Staff</option>
                  <option value="Collection Staff">Collection Staff</option>
                  <option value="Viewer">Viewer (Read-only)</option>
                  <option value="Owner">Owner</option>
                </select>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-1">
                  Change Justification
                </label>
                <input
                  type="text"
                  value={roleChangeReason}
                  onChange={(e) => setRoleChangeReason(e.target.value)}
                  placeholder="e.g. Promotion, lateral shift"
                  className="w-full bg-[#FFFFFF] border border-[#1A1A1A]/20 rounded px-3 py-1.5 text-[12.5px] outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleSaveRole}
                className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F7F2] border border-[#D4AF37]/50 px-4 py-1.5 rounded text-[12px] font-medium tracking-wide cursor-pointer"
              >
                Apply Role Change & Log Audit
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#1A1A1A]/10 rounded-lg p-4 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#78746D] block">
                Assigned Role & Level
              </span>
              <p className="text-[14px] font-serif font-bold text-[#1A1A1A] mt-0.5">
                {user.role}
              </p>
            </div>
            
            <button
              onClick={() => {
                setSelectedRole(user.role);
                setIsChangingRole(true);
              }}
              disabled={isSelf}
              className="bg-[#FFFFFF] hover:bg-[#F4F1EA] border border-[#1A1A1A]/20 text-[#1A1A1A] px-3 py-1.5 rounded text-[12px] font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[15px] text-[#8C733E]">edit</span>
              Change Role
            </button>
          </div>
        )}

        {/* Assigned Module Permissions */}
        <div>
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-2">
            Module Access & Scope
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {(user.accessModules || ['Dashboard', 'Reports']).map((mod, i) => (
              <span
                key={i}
                className="bg-[#F4F1EA] text-[#1A1A1A] border border-[#1A1A1A]/10 px-2.5 py-1 rounded text-[11.5px] font-mono-data font-medium"
              >
                ✓ {mod}
              </span>
            ))}
          </div>
        </div>

        {/* Recent Staff Activity Trail */}
        <div>
          <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#1A1A1A] mb-2 flex items-center justify-between">
            <span>Recent Activity Logs</span>
            <span className="text-[10.5px] text-[#78746D] font-mono-data font-normal">
              {userLogs.length} events logged
            </span>
          </h4>
          
          {userLogs.length > 0 ? (
            <div className="divide-y divide-[#1A1A1A]/10 border border-[#1A1A1A]/10 rounded bg-[#F9F7F2]/50">
              {userLogs.map((log) => (
                <div key={log.id} className="p-2.5 text-[12px] flex items-center justify-between">
                  <div>
                    <span className="font-mono-data font-bold text-[#1A1A1A] mr-2">
                      {log.action}
                    </span>
                    <span className="text-[#5C5850]">{log.newValue}</span>
                  </div>
                  <span className="text-[10.5px] text-[#78746D] font-mono-data shrink-0 ml-2">
                    {log.timestamp.substring(11, 16)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 border border-[#1A1A1A]/10 rounded text-center text-[12px] text-[#78746D] font-serif italic">
              No recent audit trail entries for this account.
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="pt-4 border-t border-[#1A1A1A]/10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {user.status === 'pending' && (
              <button
                onClick={() => resendInvitation(user.id)}
                className="bg-[#FFFFFF] hover:bg-[#F4F1EA] border border-[#D4AF37] text-[#1A1A1A] px-3 py-1.5 rounded text-[12px] font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px] text-[#8C733E]">forward_to_inbox</span>
                Resend Invitation
              </button>
            )}

            {user.status === 'active' && !isSelf && (
              <button
                onClick={() => setShowConfirmAction('suspend')}
                className="bg-[#FFFFFF] hover:bg-[#F9EBEB] border border-[#8B2626]/30 text-[#8B2626] px-3 py-1.5 rounded text-[12px] font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">lock</span>
                Suspend Access
              </button>
            )}

            {user.status === 'suspended' && (
              <button
                onClick={() => setShowConfirmAction('reactivate')}
                className="bg-[#EBF5EE] hover:bg-[#d8eedd] border border-[#234E3E]/30 text-[#234E3E] px-3 py-1.5 rounded text-[12px] font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">lock_open</span>
                Reactivate Account
              </button>
            )}

            {user.status !== 'deactivated' && !isSelf && (
              <button
                onClick={() => setShowConfirmAction('deactivate')}
                className="text-[#78746D] hover:text-[#8B2626] text-[12px] font-medium underline px-2 py-1 cursor-pointer"
              >
                Deactivate
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="bg-[#1A1A1A] text-[#F9F7F2] px-4 py-1.5 rounded text-[12px] font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
