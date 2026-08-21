import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { InventoryManagement } from './components/inventory/InventoryManagement';
import { PurchaseManagement } from './components/purchase/PurchaseManagement';
import { AiCenterAssistant } from './components/ai/AiCenterAssistant';
import { SalesManagement } from './components/sales/SalesManagement';
import { CustomerManagement } from './components/customers/CustomerManagement';
import { SupplierManagement } from './components/suppliers/SupplierManagement';
import { CollectionsManagement } from './components/collections/CollectionsManagement';
import { ReportsManagement } from './components/reports/ReportsManagement';
import { StaffManagement } from './components/staff/StaffManagement';
import { RolesPermissions } from './components/staff/RolesPermissions';
import { AuditLogsManagement } from './components/audit/AuditLogsManagement';
import { SettingsManagement } from './components/settings/SettingsManagement';
import { PlatformAdminPage } from './components/admin/PlatformAdminPage';

// Auth Pages
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';

// Modals & Overlays
import { NewSaleModal } from './components/sales/NewSaleModal';
import { InvoicePrintModal } from './components/sales/InvoicePrintModal';
import { AddStockModal } from './components/inventory/AddStockModal';
import { StockAdjustmentModal } from './components/inventory/StockAdjustmentModal';
import { RecordPaymentModal } from './components/customers/RecordPaymentModal';
import { AiOptimizerModal } from './components/ai/AiOptimizerModal';
import { NotificationToast } from './components/common/NotificationToast';
import { ElevatedActionModal } from './components/staff/ElevatedActionModal';

// RBAC Guard helper
const checkModuleAccess = (tab: string, role: string): boolean => {
  if (role === 'Owner' || role === 'Admin') return true;
  if (tab === 'dashboard') return true;
  if (tab === 'inventory' || tab === 'purchase') {
    return role === 'Warehouse' || role === 'Manager';
  }
  if (tab === 'sales' || tab === 'customers') {
    return role === 'Sales Staff' || role === 'Manager' || role === 'Collection Staff';
  }
  if (tab === 'collections') {
    return role === 'Collection Staff' || role === 'Manager';
  }
  if (tab === 'reports') {
    return role === 'Manager' || role === 'Collection Staff' || role === 'Viewer';
  }
  if (tab === 'ai-center') {
    return role === 'Manager';
  }
  if (tab === 'staff' || tab === 'staff-roles' || tab === 'audit-logs' || tab === 'settings') {
    return false; // Only Owner & Admin
  }
  return true;
};

const MainAppContent: React.FC = () => {
  const { activeTab, isAuthenticated, currentUser, navigateTo } = useApp();

  // If viewing standalone auth pages
  if (activeTab === 'signup') {
    return (
      <>
        <SignupPage />
        <NotificationToast />
      </>
    );
  }

  if (activeTab === 'forgot-password') {
    return (
      <>
        <ForgotPasswordPage />
        <NotificationToast />
      </>
    );
  }

  if (activeTab === 'login' || !isAuthenticated) {
    return (
      <>
        <LoginPage />
        <NotificationToast />
      </>
    );
  }

  // Super Admin view
  if (activeTab === 'platform-admin') {
    return (
      <div className="min-h-screen bg-[#F9F7F2] font-sans text-[#1A1A1A]">
        <PlatformAdminPage />
        <NotificationToast />
      </div>
    );
  }

  const isAllowed = checkModuleAccess(activeTab, currentUser.role);

  return (
    <div className="min-h-screen bg-[#F9F7F2] flex font-sans text-[#1A1A1A] antialiased">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar />

      {/* Main App Container (Offset for 240px sidebar) */}
      <div className="flex-1 ml-[240px] flex flex-col min-w-0">
        {/* Fixed Header */}
        <Header />

        {/* Dynamic Main Workspace (Offset for 64px header) */}
        <main className="flex-1 mt-16 overflow-y-auto">
          {!isAllowed ? (
            /* Restricted Role Guard Screen */
            <div className="p-8 max-w-2xl mx-auto my-12 text-center bg-[#FFFFFF] border border-[#8B2626]/20 rounded-lg p-8 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#F9EBEB] text-[#8B2626] flex items-center justify-center mx-auto border border-[#8B2626]/30">
                <span className="material-symbols-outlined text-[26px]">lock</span>
              </div>
              <h3 className="text-[22px] font-serif font-bold text-[#1A1A1A]">
                Access Restricted • Elevated Role Required
              </h3>
              <p className="text-[13.5px] text-[#5C5850] leading-relaxed">
                Your active role as <strong className="text-[#1A1A1A] font-mono-data">{currentUser.role}</strong> does not possess the required security clearance for the <strong className="text-[#1A1A1A] uppercase font-mono-data">{activeTab}</strong> domain.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => navigateTo('/dashboard')}
                  className="bg-[#1A1A1A] text-[#F9F7F2] border border-[#D4AF37]/50 px-4 py-2 rounded text-[12.5px] font-medium cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <ExecutiveDashboard />}
              {activeTab === 'inventory' && <InventoryManagement />}
              {activeTab === 'purchase' && <PurchaseManagement />}
              {activeTab === 'ai-center' && <AiCenterAssistant />}
              {activeTab === 'sales' && <SalesManagement />}
              {activeTab === 'customers' && <CustomerManagement />}
              {activeTab === 'suppliers' && <SupplierManagement />}
              {activeTab === 'collections' && <CollectionsManagement />}
              {activeTab === 'reports' && <ReportsManagement />}
              {activeTab === 'staff' && <StaffManagement />}
              {activeTab === 'staff-roles' && <RolesPermissions />}
              {activeTab === 'audit-logs' && <AuditLogsManagement />}
              {activeTab === 'settings' && <SettingsManagement />}
            </>
          )}
        </main>
      </div>

      {/* Global Modals, Guards & Toasts */}
      <NewSaleModal />
      <InvoicePrintModal />
      <AddStockModal />
      <StockAdjustmentModal />
      <RecordPaymentModal />
      <AiOptimizerModal />
      <ElevatedActionModal />
      <NotificationToast />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
