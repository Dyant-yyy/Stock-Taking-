import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  companyProfileData,
  initialDepartments,
  initialEmployees,
  initialDevices,
  initialCheckouts,
  initialMaintenance,
  initialSpareParts,
  initialLogs
} from '../data/initialData';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  // Navigation & View State
  const [viewMode, setViewMode] = useState('profile'); // 'profile' | 'portal'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'devices' | 'checkout' | 'maintenance' | 'spareparts' | 'departments' | 'audit'
  const [theme, setTheme] = useState('dark');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');

  // Data Collections with LocalStorage Fallback
  const [devices, setDevices] = useState(() => {
    const saved = localStorage.getItem('its_devices');
    return saved ? JSON.parse(saved) : initialDevices;
  });

  const [checkouts, setCheckouts] = useState(() => {
    const saved = localStorage.getItem('its_checkouts');
    return saved ? JSON.parse(saved) : initialCheckouts;
  });

  const [maintenance, setMaintenance] = useState(() => {
    const saved = localStorage.getItem('its_maintenance');
    return saved ? JSON.parse(saved) : initialMaintenance;
  });

  const [spareParts, setSpareParts] = useState(() => {
    const saved = localStorage.getItem('its_spareparts');
    return saved ? JSON.parse(saved) : initialSpareParts;
  });

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('its_logs');
    return saved ? JSON.parse(saved) : initialLogs;
  });

  const [departments] = useState(initialDepartments);
  const [employees] = useState(initialEmployees);

  // Modals & Dialog State
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isDeviceFormOpen, setIsDeviceFormOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [isDeviceDetailOpen, setIsDeviceDetailOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isReportMaintenanceOpen, setIsReportMaintenanceOpen] = useState(false);

  // LocalStorage Synchronization
  useEffect(() => {
    localStorage.setItem('its_devices', JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    localStorage.setItem('its_checkouts', JSON.stringify(checkouts));
  }, [checkouts]);

  useEffect(() => {
    localStorage.setItem('its_maintenance', JSON.stringify(maintenance));
  }, [maintenance]);

  useEffect(() => {
    localStorage.setItem('its_spareparts', JSON.stringify(spareParts));
  }, [spareParts]);

  useEffect(() => {
    localStorage.setItem('its_logs', JSON.stringify(logs));
  }, [logs]);

  // Helper to log system activity
  const addLog = (action, details, category = 'General', user = 'Admin IT') => {
    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user,
      action,
      details,
      category
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Device CRUD Operations
  const addDevice = (newDeviceData) => {
    const id = `DEV-${String(devices.length + 1).padStart(3, '0')}`;
    const assetTag = newDeviceData.assetTag || `ITS-${newDeviceData.category.substring(0, 3).toUpperCase()}-2026-${String(devices.length + 1).padStart(3, '0')}`;
    const device = {
      ...newDeviceData,
      id,
      assetTag
    };
    setDevices(prev => [device, ...prev]);
    addLog('Add Device', `Added new asset ${assetTag} (${device.name})`, 'Device');
  };

  const updateDevice = (updatedData) => {
    setDevices(prev => prev.map(d => d.id === updatedData.id ? { ...d, ...updatedData } : d));
    addLog('Update Device', `Updated specification & info for asset ${updatedData.assetTag}`, 'Device');
  };

  const deleteDevice = (id) => {
    const target = devices.find(d => d.id === id);
    if (target) {
      setDevices(prev => prev.filter(d => d.id !== id));
      addLog('Delete Device', `Decommissioned / Removed asset ${target.assetTag} (${target.name})`, 'Device');
    }
  };

  // Checkout Operations
  const checkoutDevice = (checkoutData) => {
    const newCheckout = {
      id: `CHK-${Date.now()}`,
      ...checkoutData,
      checkoutDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    setCheckouts(prev => [newCheckout, ...prev]);

    // Update Device status
    setDevices(prev => prev.map(d => d.id === checkoutData.deviceId ? { ...d, status: 'In Use', assignedTo: checkoutData.borrowerName } : d));
    addLog('Checkout Device', `Assigned asset ${checkoutData.assetTag} to ${checkoutData.borrowerName} (${checkoutData.purpose})`, 'Checkout');
  };

  const returnDevice = (checkoutId, condition, notes) => {
    const targetCheckout = checkouts.find(c => c.id === checkoutId);
    if (targetCheckout) {
      setCheckouts(prev => prev.map(c => c.id === checkoutId ? {
        ...c,
        actualReturnDate: new Date().toISOString().split('T')[0],
        status: 'Returned',
        notes: notes || c.notes
      } : c));

      // Reset device status
      setDevices(prev => prev.map(d => d.id === targetCheckout.deviceId ? {
        ...d,
        status: 'Available',
        condition: condition || d.condition,
        assignedTo: 'Unassigned'
      } : d));

      addLog('Return Device', `Returned asset ${targetCheckout.assetTag} from ${targetCheckout.borrowerName}`, 'Checkout');
    }
  };

  // Maintenance Operations
  const createMaintenanceTicket = (ticketData) => {
    const newTicket = {
      id: `MNT-${Date.now()}`,
      ...ticketData,
      reportDate: new Date().toISOString().split('T')[0],
      status: 'In Progress'
    };
    setMaintenance(prev => [newTicket, ...prev]);

    // Update device status to Maintenance
    setDevices(prev => prev.map(d => d.id === ticketData.deviceId ? { ...d, status: 'Maintenance', condition: 'Under Repair' } : d));
    addLog('Report Maintenance', `Reported fault for ${ticketData.assetTag}: ${ticketData.description}`, 'Maintenance');
  };

  const updateMaintenanceStatus = (ticketId, newStatus, technicianNotes = '') => {
    const ticket = maintenance.find(m => m.id === ticketId);
    setMaintenance(prev => prev.map(m => m.id === ticketId ? {
      ...m,
      status: newStatus,
      completionDate: newStatus === 'Completed' ? new Date().toISOString().split('T')[0] : m.completionDate,
      notes: technicianNotes || m.notes
    } : m));

    if (ticket && newStatus === 'Completed') {
      setDevices(prev => prev.map(d => d.id === ticket.deviceId ? { ...d, status: 'In Use', condition: 'Good' } : d));
      addLog('Maintenance Completed', `Completed repair ticket ${ticketId} for ${ticket.assetTag}`, 'Maintenance');
    }
  };

  // Spare Parts Operations
  const updateSparePartStock = (partId, delta) => {
    setSpareParts(prev => prev.map(p => p.id === partId ? { ...p, stockQuantity: Math.max(0, p.stockQuantity + delta) } : p));
    const target = spareParts.find(p => p.id === partId);
    if (target) {
      addLog('Stock Adjustment', `Adjusted stock for ${target.name} by ${delta > 0 ? '+' : ''}${delta} (New Stock: ${Math.max(0, target.stockQuantity + delta)})`, 'Spare Parts');
    }
  };

  const addSparePart = (partData) => {
    const newPart = {
      id: `SPR-${Date.now()}`,
      ...partData
    };
    setSpareParts(prev => [newPart, ...prev]);
    addLog('Add Spare Part', `Added new inventory item ${partData.name} (${partData.partNumber})`, 'Spare Parts');
  };

  // Reset to original mock data
  const resetToSeedData = () => {
    setDevices(initialDevices);
    setCheckouts(initialCheckouts);
    setMaintenance(initialMaintenance);
    setSpareParts(initialSpareParts);
    setLogs(initialLogs);
    localStorage.clear();
    addLog('Reset Data', 'Reset all system data to initial PT. Indonesia Toray Synthetics factory seeds', 'System');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <InventoryContext.Provider value={{
      companyProfileData,
      viewMode,
      setViewMode,
      activeTab,
      setActiveTab,
      theme,
      toggleTheme,
      searchQuery,
      setSearchQuery,
      selectedCategoryFilter,
      setSelectedCategoryFilter,
      selectedDeptFilter,
      setSelectedDeptFilter,
      selectedStatusFilter,
      setSelectedStatusFilter,
      devices,
      checkouts,
      maintenance,
      spareParts,
      logs,
      departments,
      employees,
      // Modals
      selectedDevice,
      setSelectedDevice,
      isDeviceFormOpen,
      setIsDeviceFormOpen,
      editingDevice,
      setEditingDevice,
      isDeviceDetailOpen,
      setIsDeviceDetailOpen,
      isQRScannerOpen,
      setIsQRScannerOpen,
      isPrintModalOpen,
      setIsPrintModalOpen,
      isCheckoutModalOpen,
      setIsCheckoutModalOpen,
      isReportMaintenanceOpen,
      setIsReportMaintenanceOpen,
      // Methods
      addDevice,
      updateDevice,
      deleteDevice,
      checkoutDevice,
      returnDevice,
      createMaintenanceTicket,
      updateMaintenanceStatus,
      updateSparePartStock,
      addSparePart,
      resetToSeedData,
      addLog
    }}>
      <div className={theme === 'dark' ? 'theme-dark' : 'theme-light'}>
        {children}
      </div>
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
