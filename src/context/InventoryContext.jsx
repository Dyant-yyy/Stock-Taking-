import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  companyProfileData,
  initialDepartments,
  initialEmployees,
  initialDevices,
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
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'stocktaking' | 'devices' | 'departments' | 'audit' | 'print'
  const [theme, setTheme] = useState('dark');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');

  // Data Collections with Safe LocalStorage Fallback
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('its_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [devices, setDevices] = useState(() => safeParseStorage('its_devices', initialDevices));
  const [stockTakings, setStockTakings] = useState(() => safeParseStorage('its_stock_takings', initialStockTakings));
  const [departments, setDepartments] = useState(() => safeParseStorage('its_departments', initialDepartments));
  const [logs, setLogs] = useState(() => safeParseStorage('its_logs', initialLogs));
  const [employees, setEmployees] = useState(() => safeParseStorage('its_employees', initialEmployees));

  // Modals & Dialog State
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isDeviceFormOpen, setIsDeviceFormOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [isDeviceDetailOpen, setIsDeviceDetailOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
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

  useEffect(() => {
    try {
      localStorage.setItem('its_employees', JSON.stringify(employees));
    } catch (e) { console.error(e); }
  }, [employees]);

  // Auth Operations
  const registerUser = (userData) => {
    setCurrentUser(userData);
    try {
      localStorage.setItem('its_current_user', JSON.stringify(userData));
    } catch (e) { console.error(e); }

    setEmployees(prev => {
      const safe = Array.isArray(prev) ? prev : [];
      if (!safe.some(emp => emp.id === userData.id || emp.email === userData.email)) {
        return [...safe, {
          id: userData.id,
          name: userData.name,
          deptId: userData.deptId,
          position: userData.position,
          email: userData.email
        }];
      }
      return safe;
    });

    addLog('User Registration', `Pegawai [${userData.deptCode || 'IS'}] ${userData.name} terdaftar sebagai ${userData.position || userData.role}`, 'System', userData.name);
    setViewMode('portal');
    setActiveTab('dashboard');
  };

  const loginUser = (identifier) => {
    const safeEmps = Array.isArray(employees) ? employees : [];
    const matched = safeEmps.find(e => 
      e.id.toLowerCase() === identifier.toLowerCase() || 
      e.email.toLowerCase() === identifier.toLowerCase() ||
      e.name.toLowerCase().includes(identifier.toLowerCase())
    );

    if (matched) {
      const safeDepts = Array.isArray(departments) ? departments : [];
      const deptObj = safeDepts.find(d => d.id === matched.deptId || d.code === matched.deptId);
      const userObj = {
        id: matched.id,
        name: matched.name,
        deptId: matched.deptId,
        deptCode: deptObj ? deptObj.code : 'IS',
        position: matched.position,
        email: matched.email,
        role: matched.position,
        loginTime: new Date().toISOString()
      };
      setCurrentUser(userObj);
      try {
        localStorage.setItem('its_current_user', JSON.stringify(userObj));
      } catch (e) { console.error(e); }
      addLog('User Login', `Pegawai [${userObj.deptCode}] ${userObj.name} berhasil masuk ke sesi audit`, 'System', userObj.name);
      setViewMode('portal');
      setActiveTab('dashboard');
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    addLog('User Logout', `Sesi pegawai ${currentUser?.name || ''} diakhiri`, 'System', currentUser?.name || 'User');
    setCurrentUser(null);
    try {
      localStorage.removeItem('its_current_user');
    } catch (e) { console.error(e); }
  };

  // Helper to log system activity
  const addLog = (action, details, category = 'Stock Taking', user = 'Auditor IT') => {
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
    const today = new Date().toISOString().split('T')[0];
    const newRecord = {
      id: `STK-2026-${String((Array.isArray(stockTakings) ? stockTakings.length : 0) + 1).padStart(3, '0')}`,
      ...recordData,
      stockTakingDate: recordData.stockTakingDate || today
    };

    setStockTakings(prev => [newRecord, ...(Array.isArray(prev) ? prev : [])]);

    // Update target device audit status & location
    if (recordData.deviceId) {
      setDevices(prev => (Array.isArray(prev) ? prev : []).map(d => {
        if (d.id === recordData.deviceId) {
          return {
            ...d,
            status: recordData.auditResultStatus || 'Verified',
            condition: recordData.physicalCondition || d.condition,
            lastStockTakingDate: today,
            location: recordData.locationStatus === 'Moved' ? recordData.scannedLocation : d.location
          };
        }
        return d;
      }));
    }

    addLog('Stock Taking', `Input Stock Opname ${recordData.assetTag} (${recordData.departmentCode}) - Result: ${recordData.auditResultStatus}`, 'Stock Taking', recordData.auditorName);
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
    addLog('Add Master Department', `Added Master Departemen [${codeUpper}] ${deptData.name}`, 'Department');
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
      assetTag,
      status: newDeviceData.status || 'Pending Audit',
      lastStockTakingDate: null
    };
    setDevices(prev => [device, ...(Array.isArray(prev) ? prev : [])]);
    addLog('Add Device', `Added new asset ${assetTag} (${device.name}) for Stock Taking`, 'Device');
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
      addLog('Delete Device', `Decommissioned asset ${target.assetTag} (${target.name})`, 'Device');
    }
  };

  // Reset to original mock data
  const resetToSeedData = () => {
    try {
      localStorage.clear();
    } catch (e) { console.error(e); }
    setDevices(initialDevices);
    setStockTakings(initialStockTakings);
    setDepartments(initialDepartments);
    setLogs(initialLogs);
    addLog('Reset Data', 'Reset all system data to initial PT. Indonesia Toray Synthetics Stock Taking factory seeds', 'System');
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
      isStockTakingModalOpen,
      setIsStockTakingModalOpen,
      isDeptModalOpen,
      setIsDeptModalOpen,
      editingDept,
      setEditingDept,
      // Methods
      currentUser,
      registerUser,
      loginUser,
      logoutUser,
      openStockTakingModalForDevice: (dev) => {
        if (dev) setSelectedDevice(dev);
        setIsStockTakingModalOpen(true);
      },
      addStockTaking,
      addDepartment,
      updateDepartment,
      deleteDepartment,
      addDevice,
      updateDevice,
      deleteDevice,
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
