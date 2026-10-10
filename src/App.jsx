import React from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { Header } from './components/Header';
import { RegistrationView } from './components/RegistrationView';
import { Dashboard } from './components/Dashboard';
import { DeviceModal } from './components/DeviceModal';

const MainAppContent = () => {
  const { currentUser } = useInventory();

  // 1. Initial Gate: Registration & Login Form
  if (!currentUser) {
    return <RegistrationView />;
  }

  // 2. Main Executive View: First Dashboard Table
  return (
    <div className="app-shell">
      <Header />
      <main className="client-dashboard-main">
        <Dashboard />
      </main>
      <DeviceModal />
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