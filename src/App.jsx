import React from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CompanyProfileView } from './components/CompanyProfileView';
import { Dashboard } from './components/Dashboard';
import { DeviceList } from './components/DeviceList';
import { CheckoutManagement } from './components/CheckoutManagement';
import { MaintenanceManagement } from './components/MaintenanceManagement';
import { SparePartsManagement } from './components/SparePartsManagement';
import { StockTakingManagement } from './components/StockTakingManagement';
import { DepartmentUserManagement } from './components/DepartmentUserManagement';
import { AuditLogView } from './components/AuditLogView';
import { DeviceFormModal } from './components/DeviceFormModal';
import { DeviceDetailModal } from './components/DeviceDetailModal';
import { QRScannerModal } from './components/QRScannerModal';
import { AssetTagPrintModal } from './components/AssetTagPrintModal';
import { StockTakingFormModal } from './components/StockTakingFormModal';
import { DepartmentFormModal } from './components/DepartmentFormModal';

const MainAppContent = () => {
  const { viewMode, activeTab } = useInventory();

  const renderActivePortalTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'devices':
        return <DeviceList />;
      case 'stocktaking':
        return <StockTakingManagement />;
      case 'checkout':
        return <CheckoutManagement />;
      case 'maintenance':
        return <MaintenanceManagement />;
      case 'spareparts':
        return <SparePartsManagement />;
      case 'departments':
        return <DepartmentUserManagement />;
      case 'audit':
        return <AuditLogView />;
      case 'print':
        return <DeviceList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-shell">
      {/* Top Navbar Header */}
      <Header />

      {/* Main Content Area */}
      {viewMode === 'profile' ? (
        <main className="profile-container">
          <CompanyProfileView />
        </main>
      ) : (
        <div className="portal-layout">
          <Sidebar />
          <main className="portal-main-content">
            {renderActivePortalTab()}
          </main>
        </div>
      )}

      {/* Global Modals */}
      <DeviceFormModal />
      <DeviceDetailModal />
      <QRScannerModal />
      <AssetTagPrintModal />
      <StockTakingFormModal />
      <DepartmentFormModal />
    </div>
  );
};

export default function App() {
  return (
    <InventoryProvider>
      <MainAppContent />
    </InventoryProvider>
  );
}