import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  companyProfileData,
  initialDepartments,
  initialEmployees,
  initialDevices,
  initialCheckouts,
  initialMaintenance,
  initialSpareParts,
  initialStockTakings,
  initialLogs
} from '../data/initialData';

const InventoryContext = createContext();

const safeParseStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (err) {
    console.warn(`Failed to parse localStorage key ${key}, falling back to initial data`, err);
    return fallback;
  }
};

export const InventoryProvider = ({ children }) => {
  // Navigation & View State
  const [viewMode, setViewMode] = useState('profile'); // 'profile' | 'portal'
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'devices' | 'checkout' | 'maintenance' | 'spareparts' | 'stocktaking' | 'departments' | 'audit'
  const [theme, setTheme] = useState('dark');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');

  // Data Collections with Safe LocalStorage Fallback
  const [devices, setDevices] = useState(() => safeParseStorage('its_devices', initialDevices));
  const [checkouts, setCheckouts] = useState(() => safeParseStorage('its_checkouts', initialCheckouts));
  const [maintenance, setMaintenance] = useState(() => safeParseStorage('its_maintenance', initialMaintenance));
  const [spareParts, setSpareParts] = useState(() => safeParseStorage('its_spareparts', initialSpareParts));
  const [stockTakings, setStockTakings] = useState(() => safeParseStorage('its_stock_takings', initialStockTakings));
  const [departments, setDepartments] = useState(() => safeParseStorage('its_departments', initialDepartments));
  const [logs, setLogs] = useState(() => safeParseStorage('its_logs', initialLogs));

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
  const [isStockTakingModalOpen, setIsStockTakingModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  // LocalStorage Synchronization
  useEffect(() => {
    try {
      localStorage.setItem('its_devices', JSON.stringify(devices));
    } catch (e) { console.error(e); }
  }, [devices]);

  useEffect(() => {
    try {
      localStorage.setItem('its_checkouts', JSON.stringify(checkouts));
    } catch (e) { console.error(e); }
  }, [checkouts]);

  useEffect(() => {
    try {
      localStorage.setItem('its_maintenance', JSON.stringify(maintenance));
    } catch (e) { console.error(e); }
  }, [maintenance]);

  useEffect(() => {
    try {
      localStorage.setItem('its_spareparts', JSON.stringify(spareParts));
    } catch (e) { console.error(e); }
  }, [spareParts]);

  useEffect(() => {
    try {
      localStorage.setItem('its_stock_takings', JSON.stringify(stockTakings));
    } catch (e) { console.error(e); }
  }, [stockTakings]);

  useEffect(() => {
    try {
      localStorage.setItem('its_departments', JSON.stringify(departments));
    } catch (e) { console.error(e); }
  }, [departments]);

  useEffect(() => {
    try {
      localStorage.setItem('its_logs', JSON.stringify(logs));
    } catch (e) { console.error(e); }
  }, [logs]);

  // Helper to log system activity
  const addLog = (action, details, category = 'General', user = 'Auditor IT') => {
    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user,
      action,
      details,
      category
    };
    setLogs(prev => [newLog, ...(Array.isArray(prev) ? prev : [])]);
  };

  // Stock Taking (Opname) Operations
  const addStockTaking = (recordData) => {
    const newRecord = {
      id: `STK-2026-${String((Array.isArray(stockTakings) ? stockTakings.length : 0) + 1).padStart(3, '0')}`,
      ...recordData,
      stockTakingDate: recordData.stockTakingDate || new Date().toISOString().split('T')[0]
    };

    setStockTakings(prev => [newRecord, ...(Array.isArray(prev) ? prev : [])]);

    // Update target device condition & verified status
    if (recordData.deviceId) {
      setDevices(prev => (Array.isArray(prev) ? prev : []).map(d => {
        if (d.id === recordData.deviceId) {
          return {
            ...d,
            condition: recordData.physicalCondition || d.condition,
            location: recordData.locationStatus === 'Moved' ? recordData.scannedLocation : d.location
          };
        }
        return d;
      }));
    }

    addLog('Stock Taking', `Stock Opname input for asset ${recordData.assetTag} (${recordData.departmentCode}) - Result: ${recordData.auditResultStatus}`, 'Stock Taking', recordData.auditorName);
  };

  // Department Master Operations
  const addDepartment = (deptData) => {
    const codeUpper = (deptData.code || 'DEPT').toUpperCase();
    const newDept = {
      id: `DEPT-${codeUpper}`,
      code: codeUpper,
      name: deptData.name,
      head: deptData.head || 'Penanggung Jawab',
      icon: deptData.icon || 'Building2',
      description: deptData.description || ''
    };
    setDepartments(prev => [...(Array.isArray(prev) ? prev : []), newDept]);
    addLog('Add Master Department', `Added new Master Departemen [${codeUpper}] ${deptData.name}`, 'Department');
  };

  const updateDepartment = (deptData) => {
    setDepartments(prev => (Array.isArray(prev) ? prev : []).map(d => d.id === deptData.id ? { ...d, ...deptData } : d));
    addLog('Update Master Department', `Updated Master Departemen info [${deptData.code}]`, 'Department');
  };

  const deleteDepartment = (id) => {
    const safeDepts = Array.isArray(departments) ? departments : [];
    const target = safeDepts.find(d => d.id === id);
    if (target) {
      setDepartments(prev => (Array.isArray(prev) ? prev : []).filter(d => d.id !== id));
      addLog('Delete Master Department', `Deleted Master Departemen [${target.code}] ${target.name}`, 'Department');
    }
  };

  // Device CRUD Operations
  const addDevice = (newDeviceData) => {
    const safeDevices = Array.isArray(devices) ? devices : [];
    const id = `DEV-${String(safeDevices.length + 1).padStart(3, '0')}`;
    const assetTag = newDeviceData.assetTag || `ITS-${(newDeviceData.category || 'PC').substring(0, 3).toUpperCase()}-2026-${String(safeDevices.length + 1).padStart(3, '0')}`;
    const device = {
      ...newDeviceData,
      id,
      assetTag
    };
    setDevices(prev => [device, ...(Array.isArray(prev) ? prev : [])]);
    addLog('Add Device', `Added new asset ${assetTag} (${device.name})`, 'Device');
  };

  const updateDevice = (updatedData) => {
    setDevices(prev => (Array.isArray(prev) ? prev : []).map(d => d.id === updatedData.id ? { ...d, ...updatedData } : d));
    addLog('Update Device', `Updated specification & info for asset ${updatedData.assetTag}`, 'Device');
  };

  const deleteDevice = (id) => {
    const safeDevices = Array.isArray(devices) ? devices : [];
    const target = safeDevices.find(d => d.id === id);
    if (target) {
      setDevices(prev => (Array.isArray(prev) ? prev : []).filter(d => d.id !== id));
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
    setCheckouts(prev => [newCheckout, ...(Array.isArray(prev) ? prev : [])]);

    // Update Device status
    setDevices(prev => (Array.isArray(prev) ? prev : []).map(d => d.id === checkoutData.deviceId ? { ...d, status: 'In Use', assignedTo: checkoutData.borrowerName } : d));
    addLog('Checkout Device', `Assigned asset ${checkoutData.assetTag} to ${checkoutData.borrowerName} (${checkoutData.purpose})`, 'Checkout');
  };

  const returnDevice = (checkoutId, condition, notes) => {
    const safeCheckouts = Array.isArray(checkouts) ? checkouts : [];
    const targetCheckout = safeCheckouts.find(c => c.id === checkoutId);
    if (targetCheckout) {
      setCheckouts(prev => (Array.isArray(prev) ? prev : []).map(c => c.id === checkoutId ? {
        ...c,
        actualReturnDate: new Date().toISOString().split('T')[0],
        status: 'Returned',
        notes: notes || c.notes
      } : c));

      // Reset device status
      setDevices(prev => (Array.isArray(prev) ? prev : []).map(d => d.id === targetCheckout.deviceId ? {
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
    setMaintenance(prev => [newTicket, ...(Array.isArray(prev) ? prev : [])]);

    // Update device status to Maintenance
    setDevices(prev => (Array.isArray(prev) ? prev : []).map(d => d.id === ticketData.deviceId ? { ...d, status: 'Maintenance', condition: 'Under Repair' } : d));
    addLog('Report Maintenance', `Reported fault for ${ticketData.assetTag}: ${ticketData.description}`, 'Maintenance');
  };

  const updateMaintenanceStatus = (ticketId, newStatus, technicianNotes = '') => {
    const safeMaintenance = Array.isArray(maintenance) ? maintenance : [];
    const ticket = safeMaintenance.find(m => m.id === ticketId);
    setMaintenance(prev => (Array.isArray(prev) ? prev : []).map(m => m.id === ticketId ? {
      ...m,
      status: newStatus,
      completionDate: newStatus === 'Completed' ? new Date().toISOString().split('T')[0] : m.completionDate,
      notes: technicianNotes || m.notes
    } : m));

    if (ticket && newStatus === 'Completed') {
      setDevices(prev => (Array.isArray(prev) ? prev : []).map(d => d.id === ticket.deviceId ? { ...d, status: 'In Use', condition: 'Good' } : d));
      addLog('Maintenance Completed', `Completed repair ticket ${ticketId} for ${ticket.assetTag}`, 'Maintenance');
    }
  };

  // Spare Parts Operations
  const updateSparePartStock = (partId, delta) => {
    setSpareParts(prev => (Array.isArray(prev) ? prev : []).map(p => p.id === partId ? { ...p, stockQuantity: Math.max(0, (p.stockQuantity || 0) + delta) } : p));
    const safeParts = Array.isArray(spareParts) ? spareParts : [];
    const target = safeParts.find(p => p.id === partId);
    if (target) {
      addLog('Stock Adjustment', `Adjusted stock for ${target.name} by ${delta > 0 ? '+' : ''}${delta}`, 'Spare Parts');
    }
  };

  const addSparePart = (partData) => {
    const newPart = {
      id: `SPR-${Date.now()}`,
      ...partData
    };
    setSpareParts(prev => [newPart, ...(Array.isArray(prev) ? prev : [])]);
    addLog('Add Spare Part', `Added new inventory item ${partData.name} (${partData.partNumber})`, 'Spare Parts');
  };

  // Reset to original mock data
  const resetToSeedData = () => {
    try {
      localStorage.clear();
    } catch (e) { console.error(e); }
    setDevices(initialDevices);
    setCheckouts(initialCheckouts);
    setMaintenance(initialMaintenance);
    setSpareParts(initialSpareParts);
    setStockTakings(initialStockTakings);
    setDepartments(initialDepartments);
    setLogs(initialLogs);
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
      devices: Array.isArray(devices) ? devices : initialDevices,
      checkouts: Array.isArray(checkouts) ? checkouts : initialCheckouts,
      maintenance: Array.isArray(maintenance) ? maintenance : initialMaintenance,
      spareParts: Array.isArray(spareParts) ? spareParts : initialSpareParts,
      stockTakings: Array.isArray(stockTakings) ? stockTakings : initialStockTakings,
      departments: Array.isArray(departments) ? departments : initialDepartments,
      employees: Array.isArray(employees) ? employees : initialEmployees,
      logs: Array.isArray(logs) ? logs : initialLogs,
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
      isStockTakingModalOpen,
      setIsStockTakingModalOpen,
      isDeptModalOpen,
      setIsDeptModalOpen,
      editingDept,
      setEditingDept,
      // Methods
      addStockTaking,
      addDepartment,
      updateDepartment,
      deleteDepartment,
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
