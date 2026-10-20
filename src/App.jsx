import React, { useEffect } from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { Header } from './components/Header';
import { RegistrationView } from './components/RegistrationView';
import { Dashboard } from './components/Dashboard';
import { DeviceModal } from './components/DeviceModal';
import { BarcodeScannerModal } from './components/BarcodeScannerModal';
import { BarcodePrintModal } from './components/BarcodePrintModal';

const MainAppContent = () => {
  const { currentUser, devices, openScannerModal } = useInventory();

  // URL Deep Link Listener for Barcode / QR Scan (?scan=COMPUTER_NAME or ?device=...)
  useEffect(() => {
    if (currentUser && devices && devices.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const scanCode = urlParams.get('scan') || urlParams.get('device');
      if (scanCode) {
        const matched = devices.find(d => 
          (d.computerName || '').toLowerCase() === scanCode.toLowerCase() ||
          (d.id || '').toLowerCase() === scanCode.toLowerCase() ||
          (d.ipAddress || '').toLowerCase() === scanCode.toLowerCase()
        );
        if (matched) {
          openScannerModal(matched);
        } else {
          openScannerModal();
        }
      }
    }
  }, [currentUser, devices, openScannerModal]);

  // 1. Initial Gate: Registration & Login Form
  if (!currentUser) {
    return <RegistrationView />;
  }

  // 2. Main Executive View: First Dashboard Table
  return (
    <div className="app-shell">
      <Dashboard />
      <DeviceModal />
      <BarcodeScannerModal />
      <BarcodePrintModal />
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