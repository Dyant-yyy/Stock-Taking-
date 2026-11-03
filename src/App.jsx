import React from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { Dashboard } from './components/Dashboard';
import { RegistrationView } from './components/RegistrationView';
import { DeviceModal } from './components/DeviceModal';
import { DeviceBarcodeModal } from './components/DeviceBarcodeModal';
import { BarcodeScannerModal } from './components/BarcodeScannerModal';

const AppContent = () => {
  const { currentScreen } = useInventory();

  if (currentScreen === 'login') {
    return <RegistrationView />;
  }

  return (
    <div className="app-shell">
      <Dashboard />
      <DeviceModal />
      <DeviceBarcodeModal />
      <BarcodeScannerModal />
    </div>
  );
};

export default function App() {
  return (
    <InventoryProvider>
      <AppContent />
    </InventoryProvider>
  );
}