import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ROLE_DEFINITIONS } from '../../data/initialData';
import { UserRole } from '../../types';

export const RolesPermissions: React.FC = () => {
  const {
    users,
    currentUser,
    permissionMatrix,
    updatePermissionMatrixRule,
    requestElevatedAction,
    navigateTo,
    addToast
  } = useApp();

  const [selectedRoleFilter, setSelectedRoleFilter] = useState<UserRole | 'All'>('All');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  const categories = ['All', 'Analytics', 'Catalog', 'Commercial', 'Inbound', 'Operations', 'Financial', 'AI Tools', 'Administration'];

  const filteredMatrix = permissionMatrix.filter(rule => {
    if (activeCategoryFilter !== 'All' && rule.category !== activeCategoryFilter) {
      return false;
    }
    return true;
  });

  const handleTogglePermission = (moduleId: any, key: 'canView' | 'canCreate' | 'canEdit' | 'canDelete' | 'canApprove', currentVal: boolean) => {
    // If not Admin/Owner, guard
    if (currentUser.role !== 'Admin' && currentUser.role !== 'Owner') {
      addToast('error', 'Unauthorized', 'Only Administrators or Owners can modify the enterprise RBAC matrix.');
      return;
    }

    requestElevatedAction({
      actionName: `Modify Permission: ${moduleId}.${key}`,
      description: `Toggle capability "${key}" for module "${moduleId}" from ${currentVal ? 'Granted' : 'Revoked'} to ${!currentVal ? 'Granted' : 'Revoked'}.`,
      resourceType: 'SecurityPolicy',
      resourceId: moduleId,
      impactWarning: 'Adjusting system-wide access controls will affect real-time session permissions for all active staff.',
      onConfirm: () => {
        updatePermissionMatrixRule(moduleId, { [key]: !currentVal });
      }
    });
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1440px] mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Top Editorial Breadcrumb Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-3 border-b border-[#1A1A1A]/10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => navigateTo('/staff')}
              className="text-[10px] uppercase font-bold tracking-widest text-[#78746D] hover:text-[#1A1A1A] transition-colors cursor-pointer"
            >
              &larr; Staff Directory
            </button>
            <span className="text-[#1A1A1A]/30 text-xs">•</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C733E]">
              Security & Access Control
            </span>
          </div>
          <h2 className="text-[30px] sm:text-[34px] font-serif font-bold text-[#1A1A1A] tracking-tight">
            Roles & Permissions Matrix
          </h2>
          <p className="text-[13.5px] text-[#5C5850] mt-0.5">
            Control which operational actions and data modules each staff persona can view, edit, approve, or delete.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigateTo('/staff')}
            className="bg-[#FFFFFF] hover:bg-[#F4F1EA] border border-[#1A1A1A]/20 text-[#1A1A1A] px-4 py-2 rounded text-[12.5px] font-medium tracking-wide flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-[#78746D]">badge</span>
            <span>View All Staff ({users.length})</span>
          </button>
          <button
            onClick={() => navigateTo('/audit-logs')}
            className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#F9F7F2] border border-[#D4AF37]/50 px-4 py-2 rounded text-[12.5px] font-medium tracking-wide flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-[0.99] transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-[#D4AF37]">history</span>
            <span>Access Audit Trail</span>
          </button>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ROLE_DEFINITIONS.map((roleDef) => {
          const userCountForRole = users.filter(u => u.role === roleDef.id).length;
          const isCurrentRole = currentUser.role === roleDef.id;

          return (
            <div
              key={roleDef.id}
              className={`bg-[#FFFFFF] border rounded-lg p-4 shadow-2xs flex flex-col justify-between transition-all ${
                isCurrentRole
                  ? 'border-[#1A1A1A] ring-1 ring-[#1A1A1A]/20 shadow-xs'
                  : 'border-[#1A1A1A]/12 hover:border-[#1A1A1A]/30'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-[#78746D] block">
                      Role Profile
                    </span>
                    <h4 className="font-serif font-bold text-[16px] text-[#1A1A1A]">
                      {roleDef.title}
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono-data font-bold bg-[#F4F1EA] text-[#1A1A1A] border border-[#1A1A1A]/10 px-2 py-0.5 rounded">
                    {userCountForRole} {userCountForRole === 1 ? 'user' : 'users'}
                  </span>
                </div>

                <p className="text-[11.5px] text-[#8C733E] font-medium italic mb-2">
                  &ldquo;{roleDef.tagline}&rdquo;
                </p>

                <p className="text-[12px] text-[#5C5850] leading-relaxed mb-3">
                  {roleDef.description}
                </p>

                <div>
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#78746D] block mb-1">
                    Allowed Scopes:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {roleDef.allowedModules.slice(0, 4).map((mod, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono-data bg-[#F4F1EA] text-[#1A1A1A] border border-[#1A1A1A]/8 px-1.5 py-0.5 rounded"
                      >
                        {mod}
                      </span>
                    ))}
                    {roleDef.allowedModules.length > 4 && (
                      <span className="text-[10px] text-[#78746D] self-center">
                        +{roleDef.allowedModules.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1A1A1A]/10 flex items-center justify-between">
                {isCurrentRole ? (
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#234E3E] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#234E3E]" />
                    Your Active Role
                  </span>
                ) : (
                  <span className="text-[11px] text-[#78746D] font-mono-data">
                    {roleDef.isElevated ? 'Elevated Security' : 'Standard Access'}
                  </span>
                )}

                <button
                  onClick={() => setSelectedRoleFilter(roleDef.id === selectedRoleFilter ? 'All' : roleDef.id)}
                  className="text-[11.5px] text-[#8C733E] hover:text-[#1A1A1A] font-medium underline underline-offset-2 cursor-pointer"
                >
                  {selectedRoleFilter === roleDef.id ? 'Clear Filter' : 'Filter Scope'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Permission Matrix Table */}
      <div className="bg-[#FFFFFF] border border-[#1A1A1A]/15 rounded-lg shadow-2xs overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-4 border-b border-[#1A1A1A]/10 bg-[#FBF9F4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-serif font-bold text-[17px] text-[#1A1A1A]">
              Granular Permission Matrix by Module
            </h3>
            <p className="text-[12px] text-[#5C5850]">
              Click any permission flag to toggle access or request elevated security adjustments.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                  activeCategoryFilter === cat
                    ? 'bg-[#1A1A1A] text-[#F9F7F2] font-semibold'
                    : 'bg-[#FFFFFF] text-[#5C5850] border border-[#1A1A1A]/15 hover:bg-[#F4F1EA]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Ledger */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-[12.5px] border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#F4F1EA] border-b border-[#1A1A1A]/12 text-[10px] font-bold text-[#78746D] uppercase tracking-widest">
                <th className="p-3.5 pl-5">Module / Feature Domain</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 text-center">View / Read</th>
                <th className="p-3.5 text-center">Create / Ingest</th>
                <th className="p-3.5 text-center">Edit / Modify</th>
                <th className="p-3.5 text-center">Delete / Write-off</th>
                <th className="p-3.5 text-center">Approve / Sign</th>
                <th className="p-3.5 text-right pr-5">Primary Roles Allowed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/8">
              {filteredMatrix.map((rule) => {
                return (
                  <tr key={rule.moduleId} className="hover:bg-[#F9F7F2]/80 transition-colors">
                    <td className="p-3.5 pl-5">
                      <div className="font-semibold text-[#1A1A1A]">{rule.moduleName}</div>
                      <div className="text-[10px] font-mono-data text-[#78746D]">{rule.moduleId}</div>
                    </td>

                    <td className="p-3.5">
                      <span className="text-[10.5px] font-mono-data font-medium bg-[#F4F1EA] text-[#5C5850] px-2 py-0.5 rounded border border-[#1A1A1A]/8">
                        {rule.category}
                      </span>
                    </td>

                    {/* View */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleTogglePermission(rule.moduleId, 'canView', rule.canView)}
                        className={`w-7 h-7 rounded inline-flex items-center justify-center font-bold text-[13px] transition-transform active:scale-90 cursor-pointer ${
                          rule.canView
                            ? 'bg-[#EBF5EE] text-[#234E3E] border border-[#234E3E]/30'
                            : 'bg-[#F9EBEB] text-[#8B2626] border border-[#8B2626]/20'
                        }`}
                        title="Click to toggle View permission"
                      >
                        {rule.canView ? '✓' : '✗'}
                      </button>
                    </td>

                    {/* Create */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleTogglePermission(rule.moduleId, 'canCreate', rule.canCreate)}
                        className={`w-7 h-7 rounded inline-flex items-center justify-center font-bold text-[13px] transition-transform active:scale-90 cursor-pointer ${
                          rule.canCreate
                            ? 'bg-[#EBF5EE] text-[#234E3E] border border-[#234E3E]/30'
                            : 'bg-[#F9EBEB] text-[#8B2626] border border-[#8B2626]/20'
                        }`}
                        title="Click to toggle Create permission"
                      >
                        {rule.canCreate ? '✓' : '✗'}
                      </button>
                    </td>

                    {/* Edit */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleTogglePermission(rule.moduleId, 'canEdit', rule.canEdit)}
                        className={`w-7 h-7 rounded inline-flex items-center justify-center font-bold text-[13px] transition-transform active:scale-90 cursor-pointer ${
                          rule.canEdit
                            ? 'bg-[#EBF5EE] text-[#234E3E] border border-[#234E3E]/30'
                            : 'bg-[#F9EBEB] text-[#8B2626] border border-[#8B2626]/20'
                        }`}
                        title="Click to toggle Edit permission"
                      >
                        {rule.canEdit ? '✓' : '✗'}
                      </button>
                    </td>

                    {/* Delete */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleTogglePermission(rule.moduleId, 'canDelete', rule.canDelete)}
                        className={`w-7 h-7 rounded inline-flex items-center justify-center font-bold text-[13px] transition-transform active:scale-90 cursor-pointer ${
                          rule.canDelete
                            ? 'bg-[#EBF5EE] text-[#234E3E] border border-[#234E3E]/30'
                            : 'bg-[#F9EBEB] text-[#8B2626] border border-[#8B2626]/20'
                        }`}
                        title="Click to toggle Delete permission"
                      >
                        {rule.canDelete ? '✓' : '✗'}
                      </button>
                    </td>

                    {/* Approve */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleTogglePermission(rule.moduleId, 'canApprove', rule.canApprove)}
                        className={`w-7 h-7 rounded inline-flex items-center justify-center font-bold text-[13px] transition-transform active:scale-90 cursor-pointer ${
                          rule.canApprove
                            ? 'bg-[#EBF5EE] text-[#234E3E] border border-[#234E3E]/30'
                            : 'bg-[#F9EBEB] text-[#8B2626] border border-[#8B2626]/20'
                        }`}
                        title="Click to toggle Approve permission"
                      >
                        {rule.canApprove ? '✓' : '✗'}
                      </button>
                    </td>

                    {/* Roles Summary */}
                    <td className="p-3.5 text-right pr-5">
                      <div className="flex items-center justify-end gap-1 flex-wrap">
                        {rule.category === 'Administration' ? (
                          <span className="text-[10px] font-bold text-[#8C733E] bg-[#F4F1EA] px-1.5 py-0.5 rounded border border-[#8C733E]/20">
                            Owner / Admin Only
                          </span>
                        ) : rule.category === 'Commercial' ? (
                          <span className="text-[10px] font-medium text-[#1A1A1A] bg-[#F4F1EA] px-1.5 py-0.5 rounded border border-[#1A1A1A]/10">
                            Sales, Manager, Admin
                          </span>
                        ) : rule.category === 'Inbound' || rule.category === 'Operations' ? (
                          <span className="text-[10px] font-medium text-[#1A1A1A] bg-[#F4F1EA] px-1.5 py-0.5 rounded border border-[#1A1A1A]/10">
                            Warehouse, Manager, Admin
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-[#1A1A1A] bg-[#F4F1EA] px-1.5 py-0.5 rounded border border-[#1A1A1A]/10">
                            All Operational Staff
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
