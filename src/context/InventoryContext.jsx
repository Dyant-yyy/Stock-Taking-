import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialDepartments,
  initialDevices,
  initialStockTakingRecords,
  monthOptions,
  statusColumns,
  typeOptions
} from '../data/initialData';

const InventoryContext = createContext();

const STORAGE_KEY_DEVICES = 'its_devices_v5';
const STORAGE_KEY_STOCK_RECORDS = 'its_stock_records_v5';
const STORAGE_KEY_SIGNATURES = 'its_signatures_v5';

const safeParseStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (err) {
    return fallback;
  }
};

export const InventoryProvider = ({ children }) => {
  // 0. User session & active screen ('dashboard' | 'login')
  const [currentUser, setCurrentUser] = useState(() => {
    return safeParseStorage('its_user_session', null);
  });

  const [currentScreen, setCurrentScreen] = useState(() => {
    const session = safeParseStorage('its_user_session', null);
    return session ? 'dashboard' : 'login';
  });

  const [loginUserTrigger, setLoginUserTrigger] = useState(0);

  const loginUser = (userData) => {
    const user = typeof userData === 'string'
      ? { name: userData, dept: 'IS', role: 'Staff' }
      : (userData || { name: 'Staff User', dept: 'IS', role: 'Staff' });
    setCurrentUser(user);
    setCurrentScreen('dashboard');
    setIsScannerOpen(true);
    setScannerNotice('Selamat datang di Sistem Stock Taking PT. ITS! Arahkan kamera atau scan barcode stiker komputer untuk memulai pendataan.');
    setLoginUserTrigger(prev => prev + 1);
    try {
      localStorage.setItem('its_user_session', JSON.stringify(user));
    } catch (e) {}
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
    try {
      localStorage.removeItem('its_user_session');
    } catch (e) {}
  };

  // 1. Devices List (Initial 27 authentic devices from Toray stock sheet)
  const [devices, setDevices] = useState(() => {
    const saved = safeParseStorage(STORAGE_KEY_DEVICES, null);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    return initialDevices;
  });

  // 2. Stock Taking Records per Year & Month: { "2026_1": { "dev-1": { status: "Online", remark: "" } } }
  const [stockRecords, setStockRecords] = useState(() => {
    const saved = safeParseStorage(STORAGE_KEY_STOCK_RECORDS, null);
    if (saved && typeof saved === 'object' && Object.keys(saved).length > 0) {
      return saved;
    }
    return initialStockTakingRecords;
  });

  // 3. Active Time Period (Year & Month)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(1); // 1 = Januari
  const availableYears = [2024, 2025, 2026, 2027, 2028];

  // 4. Active View: 'stock-taking' (Gambar 1) | 'ledger' (Gambar 2) | 'both'
  const [activeView, setActiveView] = useState('stock-taking');

  // 5. Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterType, setFilterType] = useState('All');

  // 6. Signatures (PIC & Manager as seen on the physical documents)
  const [signatures, setSignatures] = useState(() => {
    return safeParseStorage(STORAGE_KEY_SIGNATURES, {
      picName: 'Anggit Kurniawan',
      picTitle: 'PIC / IT Staff',
      managerName: 'Matheus Djoko',
      managerTitle: 'IT Manager',
      docNo: 'IS-FRM-ITS-PC-Ledger-IS',
      revision: '0',
      createdDate: '26 Januari 2026'
    });
  });

  // 7. Quick Device Modal State
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);

  // 8. Barcode & Asset Tag Modal State
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [barcodeDevice, setBarcodeDevice] = useState(null);

  // 9. Universal Barcode & Camera Scanner State
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedDevice, setScannedDevice] = useState(null);
  const [scannerNotice, setScannerNotice] = useState('');

  // Auto-detect URL parameter on initial load (e.g. https://domain/?scan=NITSIS2307352)
  // Allows any mobile phone camera or QR scanner to open the web app directly to that device!
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.location) {
        const params = new URLSearchParams(window.location.search);
        const scanParam = params.get('scan') || params.get('device') || params.get('asset');
        if (scanParam) {
          const targetKey = decodeURIComponent(scanParam).trim().toLowerCase();
          const matched = devices.find(d => 
            (d.computerName || '').toLowerCase() === targetKey ||
            (d.id || '').toLowerCase() === targetKey ||
            (d.specs?.assetTag || '').toLowerCase() === targetKey ||
            (d.specs?.serialNumber || '').toLowerCase() === targetKey ||
            (d.ipAddress || '').toLowerCase() === targetKey
          );
          if (matched) {
            setScannedDevice(matched);
            setIsScannerOpen(true);
            setCurrentScreen('dashboard');
          }
        }
      }
    } catch (e) {
      console.warn('URL deep-link parameter parsing error:', e);
    }
  }, [devices]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DEVICES, JSON.stringify(devices));
    } catch (e) {}
  }, [devices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STOCK_RECORDS, JSON.stringify(stockRecords));
    } catch (e) {}
  }, [stockRecords]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SIGNATURES, JSON.stringify(signatures));
    } catch (e) {}
  }, [signatures]);

  // Key generator for current year and month
  const periodKey = `${currentYear}_${currentMonth}`;
  const currentMonthRecord = stockRecords[periodKey] || {};

  // Update Status Checklist for a device in current month
  const updateDeviceStockStatus = (deviceId, newStatus) => {
    setStockRecords(prev => {
      const prevPeriod = prev[periodKey] || {};
      const currentItem = prevPeriod[deviceId] || { status: '', remark: '' };
      
      // If clicking already selected status, toggle it off or keep
      const updatedStatus = currentItem.status === newStatus ? '' : newStatus;

      return {
        ...prev,
        [periodKey]: {
          ...prevPeriod,
          [deviceId]: {
            ...currentItem,
            status: updatedStatus
          }
        }
      };
    });
  };

  // Update Remark for a device in current month
  const updateDeviceStockRemark = (deviceId, remark) => {
    setStockRecords(prev => {
      const prevPeriod = prev[periodKey] || {};
      const currentItem = prevPeriod[deviceId] || { status: 'Online', remark: '' };
      return {
        ...prev,
        [periodKey]: {
          ...prevPeriod,
          [deviceId]: {
            ...currentItem,
            remark
          }
        }
      };
    });
  };

  // Quick Action: Centang Semua Online untuk Bulan Ini
  const checkAllOnline = () => {
    setStockRecords(prev => {
      const prevPeriod = prev[periodKey] || {};
      const updatedPeriod = { ...prevPeriod };

      devices.forEach(dev => {
        const existing = updatedPeriod[dev.id] || {};
        updatedPeriod[dev.id] = {
          ...existing,
          status: 'Online'
        };
      });

      return {
        ...prev,
        [periodKey]: updatedPeriod
      };
    });
  };

  // Reset Checklist Bulan Ini
  const resetMonthStock = () => {
    if (window.confirm(`Yakin ingin mereset checklist bulan ${monthOptions.find(m => m.value === currentMonth)?.label} ${currentYear}?`)) {
      setStockRecords(prev => ({
        ...prev,
        [periodKey]: {}
      }));
    }
  };

  // Add New Device
  const addDevice = (deviceData) => {
    const newId = `dev-${Date.now()}`;
    const nextNo = devices.length > 0 ? Math.max(...devices.map(d => d.no || 0)) + 1 : 1;
    const cleanData = { ...deviceData };
    delete cleanData._isFromScan;
    delete cleanData._scannedCode;

    const newDevice = {
      ...cleanData,
      id: newId,
      no: nextNo
    };
    setDevices(prev => [...prev, newDevice]);

    // Also set default status for current period
    if (deviceData.status || deviceData.remark !== undefined) {
      setStockRecords(prev => ({
        ...prev,
        [periodKey]: {
          ...(prev[periodKey] || {}),
          [newId]: {
            status: deviceData.status || 'Online',
            remark: deviceData.remark || ''
          }
        }
      }));
    }
    setIsDeviceModalOpen(false);
    setEditingDevice(null);
  };

  // Update Existing Device
  const updateDevice = (updatedDevice) => {
    const cleanData = { ...updatedDevice };
    delete cleanData._isFromScan;
    delete cleanData._scannedCode;

    setDevices(prev => prev.map(d => d.id === cleanData.id ? cleanData : d));

    if (cleanData.status || cleanData.remark !== undefined) {
      setStockRecords(prev => ({
        ...prev,
        [periodKey]: {
          ...(prev[periodKey] || {}),
          [cleanData.id]: {
            status: cleanData.status || 'Online',
            remark: cleanData.remark || ''
          }
        }
      }));
    }

    setIsDeviceModalOpen(false);
    setEditingDevice(null);
  };

  // Delete Device
  const deleteDevice = (deviceId) => {
    if (window.confirm('Hapus perangkat ini dari daftar inventaris?')) {
      setDevices(prev => prev.filter(d => d.id !== deviceId));
    }
  };

  // Modal controls
  const openAddModal = (initialData = null) => {
    setEditingDevice(initialData);
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

  const openBarcodeModal = (device) => {
    setBarcodeDevice(device);
    setIsBarcodeModalOpen(true);
  };

  const closeBarcodeModal = () => {
    setIsBarcodeModalOpen(false);
    setBarcodeDevice(null);
  };

  const openScannerModal = (device = null, notice = '') => {
    if (device) setScannedDevice(device);
    if (notice) setScannerNotice(notice);
    setIsScannerOpen(true);
  };

  const closeScannerModal = () => {
    setIsScannerOpen(false);
    setScannedDevice(null);
  };

  // Helper to get real-time condition of device in current period
  const getDeviceCurrentStatus = (deviceId) => {
    const periodData = stockRecords[periodKey] || {};
    const item = periodData[deviceId];
    if (item && item.status) return item.status;
    const dev = devices.find(d => d.id === deviceId);
    return dev?.status || 'Online';
  };

  const getDeviceCurrentRemark = (deviceId) => {
    const periodData = stockRecords[periodKey] || {};
    const item = periodData[deviceId];
    if (item && item.remark !== undefined) return item.remark;
    const dev = devices.find(d => d.id === deviceId);
    return dev?.remark || '';
  };

  // Direct update of condition & remark from scanner or audit view
  const updateDeviceCondition = (deviceId, newStatus, newRemark = null) => {
    // 1. Update in stock records for active period
    setStockRecords(prev => {
      const prevPeriod = prev[periodKey] || {};
      const currentItem = prevPeriod[deviceId] || { status: 'Online', remark: '' };
      return {
        ...prev,
        [periodKey]: {
          ...prevPeriod,
          [deviceId]: {
            ...currentItem,
            status: newStatus,
            remark: newRemark !== null ? newRemark : currentItem.remark
          }
        }
      };
    });

    // 2. Also keep device base status/remark in sync
    setDevices(prev => prev.map(d => {
      if (d.id === deviceId) {
        return {
          ...d,
          status: newStatus,
          remark: newRemark !== null ? newRemark : d.remark
        };
      }
      return d;
    }));

    // 3. If currently inspected in scanner, update scannedDevice too
    setScannedDevice(prev => {
      if (prev && prev.id === deviceId) {
        return {
          ...prev,
          status: newStatus,
          remark: newRemark !== null ? newRemark : prev.remark
        };
      }
      return prev;
    });
  };

  // Filtered devices based on search query, department, type
  const filteredDevices = devices.filter(dev => {
    const matchesSearch = !searchQuery || 
      (dev.computerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dev.user || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dev.department || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dev.type || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = filterDept === 'All' || dev.department === filterDept;
    const matchesType = filterType === 'All' || dev.type === filterType;

    return matchesSearch && matchesDept && matchesType;
  });

  return (
    <InventoryContext.Provider
      value={{
        currentUser,
        currentScreen,
        setCurrentScreen,
        loginUser,
        logoutUser,
        devices,
        filteredDevices,
        stockRecords,
        currentMonthRecord,
        currentYear,
        setCurrentYear,
        currentMonth,
        setCurrentMonth,
        availableYears,
        activeView,
        setActiveView,
        searchQuery,
        setSearchQuery,
        filterDept,
        setFilterDept,
        filterType,
        setFilterType,
        departments: initialDepartments,
        statusColumns,
        typeOptions,
        monthOptions,
        signatures,
        setSignatures,
        updateDeviceStockStatus,
        updateDeviceStockRemark,
        checkAllOnline,
        resetMonthStock,
        addDevice,
        updateDevice,
        deleteDevice,
        isDeviceModalOpen,
        editingDevice,
        openAddModal,
        openEditModal,
        closeModal,
        isBarcodeModalOpen,
        barcodeDevice,
        openBarcodeModal,
        closeBarcodeModal,
        // Universal Scanner Integration
        isScannerOpen,
        scannedDevice,
        setScannedDevice,
        scannerNotice,
        setScannerNotice,
        openScannerModal,
        closeScannerModal,
        getDeviceCurrentStatus,
        getDeviceCurrentRemark,
        updateDeviceCondition,
        statusOptions: statusColumns.map(s => ({ value: s.key, label: s.label, color: s.color, badgeClass: s.badgeClass })),
        openBarcodePrint: openBarcodeModal
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
