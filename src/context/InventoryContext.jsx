import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialDepartments,
  initialDevices,
  initialLogs,
  initialMonthlyInspections,
  monthOptions,
  physicalConditionOptions,
  inspectionResultOptions,
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

const STORAGE_KEY_USER = 'its_current_user';
const STORAGE_KEY_DEVICES = 'its_devices_clean_v4';
const STORAGE_KEY_DEPTS = 'its_departments_clean_v4';
const STORAGE_KEY_LOGS = 'its_logs_clean_v4';
const STORAGE_KEY_INSPECTIONS = 'its_monthly_inspections_clean_v4';

// Clean legacy dummy devices from old localStorage keys immediately
try {
  localStorage.removeItem('its_devices_v3');
  localStorage.removeItem('its_devices_v2');
  localStorage.removeItem('its_devices_v1');
  localStorage.removeItem('its_monthly_inspections_v1');
  localStorage.removeItem('its_logs_v3');
} catch (e) {}

export const InventoryProvider = ({ children }) => {
  // Current Logged-in User
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Devices: starts completely clean and empty (no dummy devices)
  const [devices, setDevices] = useState(() => {
    return safeParseStorage(STORAGE_KEY_DEVICES, []);
  });

  // Departments list (master data)
  const [departments, setDepartments] = useState(() => safeParseStorage(STORAGE_KEY_DEPTS, initialDepartments));
  const [logs, setLogs] = useState(() => safeParseStorage(STORAGE_KEY_LOGS, []));

  // Monthly Device Inspections: starts completely clean and empty
  const [monthlyInspections, setMonthlyInspections] = useState(() => 
    safeParseStorage(STORAGE_KEY_INSPECTIONS, [])
  );

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
      localStorage.setItem(STORAGE_KEY_DEVICES, JSON.stringify(devices));
    } catch (e) {}
  }, [devices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DEPTS, JSON.stringify(departments));
    } catch (e) {}
  }, [departments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
    } catch (e) {}
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INSPECTIONS, JSON.stringify(monthlyInspections));
    } catch (e) {}
  }, [monthlyInspections]);

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
    localStorage.removeItem(STORAGE_KEY_DEVICES);
    localStorage.removeItem(STORAGE_KEY_LOGS);
    localStorage.removeItem(STORAGE_KEY_INSPECTIONS);
    setDevices([]);
    setLogs([]);
    setMonthlyInspections([]);
    setFilterDept('All');
    setFilterStatus('All');
    setFilterType('All');
    setSearchQuery('');
    addLog('Reset Data', 'Mereset data inventaris menjadi kosong', 'System');
  };

  // Monthly Inspection CRUD Operations
  const addMonthlyInspection = (inspectionData) => {
    const yr = inspectionData.year || 2026;
    const mo = String(inspectionData.month || 10).padStart(2, '0');
    const nextId = `INSP-${yr}-${mo}-${String((Array.isArray(monthlyInspections) ? monthlyInspections.length : 0) + 1).padStart(3, '0')}`;
    const newRecord = {
      id: nextId,
      ...inspectionData,
      inspectionDate: inspectionData.inspectionDate || new Date().toISOString().split('T')[0]
    };

    setMonthlyInspections(prev => [newRecord, ...(Array.isArray(prev) ? prev : [])]);
    addLog('Input Pemeriksaan', `Mencatat pemeriksaan perangkat [${inspectionData.computerName}] periode ${inspectionData.periodName}`, 'Inspection');
    return newRecord;
  };

  const updateMonthlyInspection = (updatedData) => {
    setMonthlyInspections(prev => (Array.isArray(prev) ? prev : []).map(r => r.id === updatedData.id ? { ...r, ...updatedData } : r));
    addLog('Update Pemeriksaan', `Mengupdate pemeriksaan [${updatedData.computerName}] periode ${updatedData.periodName}`, 'Inspection');
  };

  const deleteMonthlyInspection = (id) => {
    const target = (Array.isArray(monthlyInspections) ? monthlyInspections : []).find(r => r.id === id);
    if (target) {
      setMonthlyInspections(prev => (Array.isArray(prev) ? prev : []).filter(r => r.id !== id));
      addLog('Hapus Pemeriksaan', `Menghapus record audit [${target.computerName}] periode ${target.periodName}`, 'Inspection');
    }
  };

  const quickVerifyMonthlyInspection = (device, month, year) => {
    const periodLabel = `${monthOptions.find(m => m.value === Number(month))?.label || `Bulan ${month}`} ${year}`;
    const existingIndex = (Array.isArray(monthlyInspections) ? monthlyInspections : []).findIndex(
      r => (r.deviceId === device.id || r.computerName === device.computerName) && Number(r.month) === Number(month) && Number(r.year) === Number(year)
    );

    if (existingIndex >= 0) {
      const existing = monthlyInspections[existingIndex];
      const nextStatus = existing.inspectionResult === 'Verified (Sesuai)' ? 'Pending (Belum Diperiksa)' : 'Verified (Sesuai)';
      updateMonthlyInspection({
        ...existing,
        inspectionResult: nextStatus,
        inspectionDate: new Date().toISOString().split('T')[0],
        auditorName: currentUser ? `${currentUser.name} (${currentUser.deptCode || 'IS'})` : 'Auditor IT'
      });
    } else {
      addMonthlyInspection({
        deviceId: device.id,
        year: Number(year),
        month: Number(month),
        periodName: periodLabel,
        computerName: device.computerName,
        ipAddress: device.ipAddress,
        department: device.department,
        user: device.user,
        type: device.type,
        inspectionDate: new Date().toISOString().split('T')[0],
        auditorName: currentUser ? `${currentUser.name} (${currentUser.deptCode || 'IS'})` : 'Auditor IT',
        physicalCondition: 'Baik / Normal',
        status: device.status || 'In',
        inspectionResult: 'Verified (Sesuai)',
        notes: `Pemeriksaan rutin berkala ${periodLabel} terverifikasi.`
      });
    }
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
      devices: Array.isArray(devices) ? devices : [],
      departments: Array.isArray(departments) ? departments : initialDepartments,
      logs: Array.isArray(logs) ? logs : [],
      monthlyInspections: Array.isArray(monthlyInspections) ? monthlyInspections : [],
      setMonthlyInspections,
      monthOptions,
      physicalConditionOptions,
      inspectionResultOptions,
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
      addMonthlyInspection,
      updateMonthlyInspection,
      deleteMonthlyInspection,
      quickVerifyMonthlyInspection,
      addLog
    }}>
      <div className="theme-dark">
        {children}
      </div>
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
