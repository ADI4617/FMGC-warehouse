import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const AuditLogsManagement: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.newValue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="p-6 max-w-[1440px] mx-auto space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#1A1A1A]/10">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase font-bold tracking-editorial text-[#8C733E]">Compliance & Verification</span>
          <span className="text-[#1A1A1A]/30 text-xs">•</span>
          <span className="text-[10px] uppercase font-mono-data text-[#78746D]">Immutable Ledger Records</span>
        </div>
        <h2 className="text-[32px] font-serif font-bold text-[#1A1A1A] tracking-tight">Audit Trail & Security Logs</h2>
        <p className="text-[13.5px] text-[#5C5850]">Immutable system log of all stock adjustments, invoice commits, discount overrides, and credit sales.</p>
      </div>

      {/* Table Container */}
      <div className="bg-[#FFFFFF] border border-[#1A1A1A]/12 rounded shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#1A1A1A]/10 flex flex-col sm:flex-row justify-between gap-3 bg-[#FFFFFF]">
          <div className="relative w-full sm:w-80">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#78746D] text-[18px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit logs..."
              className="w-full bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded pl-8 pr-3 py-1.5 text-[12.5px] outline-none focus:border-[#1A1A1A]"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-[#F4F1EA] border border-[#1A1A1A]/15 rounded px-3 py-1.5 text-[12px] font-medium text-[#1A1A1A] outline-none"
          >
            <option value="ALL">All Actions</option>
            <option value="STOCK_ADJUSTMENT">Stock Adjustments</option>
            <option value="CONFIRM_AI_INVOICE">AI Invoice Commits</option>
            <option value="CREATE_SALE">Sales Transactions</option>
            <option value="RECORD_PAYMENT">Payment Collections</option>
            <option value="APPLY_EXPIRY_DISCOUNT">FEFO Promotions</option>
            <option value="RETURN_TO_SUPPLIER">RTS Returns</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12.5px]">
            <thead className="bg-[#F4F1EA] border-b border-[#1A1A1A]/10 text-[10px] font-bold text-[#78746D] uppercase tracking-editorial">
              <tr>
                <th className="p-3.5 w-44">Timestamp</th>
                <th className="p-3.5">Actor (Role)</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Target Entity</th>
                <th className="p-3.5">Change Value / Diff</th>
                <th className="p-3.5">Reason / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]/8 font-mono-data">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-[#F4F1EA] text-[12.5px]">
                  <td className="p-3.5 text-[#78746D] text-[11.5px]">{log.timestamp}</td>
                  <td className="p-3.5 font-sans font-medium text-[#1A1A1A]">
                    <div>{log.actor}</div>
                    <span className="text-[10px] bg-[#EEEBE3] border border-[#1A1A1A]/10 text-[#5C5850] px-1 py-0.2 rounded font-mono-data">{log.actorRole}</span>
                  </td>
                  <td className="p-3.5 font-sans">
                    <span className="bg-[#EEEBE3] text-[#1A1A1A] font-semibold px-2 py-0.5 rounded text-[10.5px] border border-[#1A1A1A]/15 font-mono-data">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#1A1A1A] font-bold">
                    {log.entity}: {log.entityId}
                  </td>
                  <td className="p-3.5 text-[#1A1A1A] font-sans text-[12px] max-w-xs truncate" title={log.newValue}>
                    {log.newValue}
                  </td>
                  <td className="p-3.5 text-[#78746D] font-sans text-[12px]">{log.reason || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
