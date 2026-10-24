import React from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { Dashboard } from './components/Dashboard';
import { LoginView } from './components/LoginView';
import { DeviceModal } from './components/DeviceModal';
import { DeviceBarcodeModal } from './components/DeviceBarcodeModal';

const AppContent = () => {
  const { currentScreen } = useInventory();

  if (currentScreen === 'login') {
    return <LoginView />;
  }

  return (
    <div className="app-shell">
      <Dashboard />
      <DeviceModal />
      <DeviceBarcodeModal />
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