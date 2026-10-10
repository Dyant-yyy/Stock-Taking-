import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialDepartments,
  initialDevices,
  initialLogs,
  statusOptions,
  typeOptions
} from '../data/initialData';

const InventoryContext = createContext();

const safeParseStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (err) {
    return fallback;
  }
};

export const InventoryProvider = ({ children }) => {
  // Current Logged-in User
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('its_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Devices matching client table specification
  const [devices, setDevices] = useState(() => {
    try {
      const saved = localStorage.getItem('its_devices_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].computerName) {
          return parsed;
        }
      }
    } catch (e) {}
    return initialDevices;
  });

  // Departments list
  const [departments, setDepartments] = useState(() => safeParseStorage('its_departments_v3', initialDepartments));
  const [logs, setLogs] = useState(() => safeParseStorage('its_logs_v3', initialLogs));

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');

  // Modal State for Add / Edit Device
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);

  // Barcode Scanner & Verification Modal State
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedDevice, setScannedDevice] = useState(null);

  // Barcode / QR Print Sticker Modal State
  const [isBarcodePrintOpen, setIsBarcodePrintOpen] = useState(false);
  const [barcodeDevice, setBarcodeDevice] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('its_devices_v3', JSON.stringify(devices));
    } catch (e) {}
  }, [devices]);

  useEffect(() => {
    try {
      localStorage.setItem('its_departments_v3', JSON.stringify(departments));
    } catch (e) {}
  }, [departments]);

  useEffect(() => {
    try {
      localStorage.setItem('its_logs_v3', JSON.stringify(logs));
    } catch (e) {}
  }, [logs]);

  // Activity logger
  const addLog = (action, details, category = 'General') => {
    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUser ? `${currentUser.name} (${currentUser.deptCode || 'IS'})` : 'Admin',
      action,
      details,
      category
    };
    setLogs(prev => [newLog, ...(Array.isArray(prev) ? prev : [])]);
  };

  // Auth Operations
  const registerUser = (userData) => {
    setCurrentUser(userData);
    try {
      localStorage.setItem('its_current_user', JSON.stringify(userData));
    } catch (e) {}
    addLog('Registrasi', `User ${userData.name} ([${userData.deptCode}]) terdaftar dan masuk ke sesi.`, 'Auth');
  };

  const loginUser = (identifier) => {
    const userObj = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: identifier.trim(),
      deptCode: 'IS',
      loginTime: new Date().toISOString()
    };
    setCurrentUser(userObj);
    try {
      localStorage.setItem('its_current_user', JSON.stringify(userObj));
    } catch (e) {}
    addLog('Login', `User ${identifier} masuk ke sesi inventory.`, 'Auth');
    return true;
  };

  const logoutUser = () => {
    addLog('Logout', `User ${currentUser?.name || ''} keluar dari sesi.`, 'Auth');
    setCurrentUser(null);
    try {
      localStorage.removeItem('its_current_user');
    } catch (e) {}
  };

  // Device CRUD Operations
  const addDevice = (deviceData) => {
    const nextId = `DEV-${String((Array.isArray(devices) ? devices.length : 0) + 1).padStart(3, '0')}`;
    const newDevice = {
      id: nextId,
      department: deviceData.department || 'IS',
      computerName: deviceData.computerName || `ITS-${deviceData.department || 'IS'}-PC${String(devices.length + 1).padStart(2, '0')}`,
      ipAddress: deviceData.ipAddress || '192.168.1.100',
      type: deviceData.type || 'Desktop PC',
      user: deviceData.user || 'Unassigned',
      status: deviceData.status || 'In',
      remark: deviceData.remark || '-'
    };

    setDevices(prev => [newDevice, ...(Array.isArray(prev) ? prev : [])]);
    addLog('Tambah Device', `Menambahkan komputer [${newDevice.computerName}] (IP: ${newDevice.ipAddress})`, 'Inventory');
  };

  const updateDevice = (updatedData) => {
    setDevices(prev => (Array.isArray(prev) ? prev : []).map(d => d.id === updatedData.id ? { ...d, ...updatedData } : d));
    addLog('Update Device', `Mengupdate data komputer [${updatedData.computerName}]`, 'Inventory');
  };

  const updateDeviceStatus = (id, newStatus) => {
    setDevices(prev => (Array.isArray(prev) ? prev : []).map(d => {
      if (d.id === id) {
        addLog('Update Status', `Status komputer ${d.computerName} diverifikasi menjadi ${newStatus}`, 'Status');
        return { ...d, status: newStatus };
      }
      return d;
    }));
  };

  const deleteDevice = (id) => {
    const target = (Array.isArray(devices) ? devices : []).find(d => d.id === id);
    if (target) {
      setDevices(prev => (Array.isArray(prev) ? prev : []).filter(d => d.id !== id));
      addLog('Hapus Device', `Menghapus komputer [${target.computerName}] dari sistem`, 'Inventory');
    }
  };

  const resetToSeedData = () => {
    localStorage.removeItem('its_devices_v3');
    localStorage.removeItem('its_departments_v3');
    localStorage.removeItem('its_logs_v3');
    setDevices(initialDevices);
    setDepartments(initialDepartments);
    setLogs(initialLogs);
    setFilterDept('All');
    setFilterStatus('All');
    setFilterType('All');
    setSearchQuery('');
    addLog('Reset Data', 'Mereset data inventaris ke data awal bawaan ITS', 'System');
  };

  const openAddModal = () => {
    setEditingDevice(null);
    setIsDeviceModalOpen(true);
  };

  const openEditModal = (device) => {
    setEditingDevice(device);
    setIsDeviceModalOpen(true);
  };

  const closeModal = () => {
    setIsDeviceModalOpen(false);
    setEditingDevice(null);
  };

  // Barcode Scanner Controls
  const openScannerModal = (preselected = null) => {
    setScannedDevice(preselected);
    setIsScannerOpen(true);
  };

  const closeScannerModal = () => {
    setIsScannerOpen(false);
    setScannedDevice(null);
  };

  // Barcode Sticker Print Controls
  const openBarcodePrint = (device) => {
    setBarcodeDevice(device);
    setIsBarcodePrintOpen(true);
  };

  const closeBarcodePrint = () => {
    setIsBarcodePrintOpen(false);
    setBarcodeDevice(null);
  };

  return (
    <InventoryContext.Provider value={{
      currentUser,
      registerUser,
      loginUser,
      logoutUser,
      // Data
      devices: Array.isArray(devices) ? devices : initialDevices,
      departments: Array.isArray(departments) ? departments : initialDepartments,
      logs: Array.isArray(logs) ? logs : initialLogs,
      statusOptions,
      typeOptions,
      // Filters
      searchQuery,
      setSearchQuery,
      filterDept,
      setFilterDept,
      filterStatus,
      setFilterStatus,
      filterType,
      setFilterType,
      // Modals
      isDeviceModalOpen,
      editingDevice,
      openAddModal,
      openEditModal,
      closeModal,
      // Scanner & Barcode Print
      isScannerOpen,
      openScannerModal,
      closeScannerModal,
      scannedDevice,
      setScannedDevice,
      isBarcodePrintOpen,
      barcodeDevice,
      openBarcodePrint,
      closeBarcodePrint,
      // Methods
      addDevice,
      updateDevice,
      updateDeviceStatus,
      deleteDevice,
      resetToSeedData,
      addLog
    }}>
      <div className="theme-dark">
        {children}
      </div>
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
