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

  const loginUser = (userData) => {
    const user = typeof userData === 'string'
      ? { name: userData, dept: 'IS', role: 'Staff' }
      : (userData || { name: 'Staff User', dept: 'IS', role: 'Staff' });
    setCurrentUser(user);
    setCurrentScreen('dashboard');
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
    const newDevice = {
      ...deviceData,
      id: newId,
      no: nextNo
    };
    setDevices(prev => [...prev, newDevice]);

    // Also set default status for current period
    if (deviceData.status) {
      setStockRecords(prev => ({
        ...prev,
        [periodKey]: {
          ...(prev[periodKey] || {}),
          [newId]: {
            status: deviceData.status,
            remark: deviceData.remark || ''
          }
        }
      }));
    }
    setIsDeviceModalOpen(false);
  };

  // Update Existing Device
  const updateDevice = (updatedDevice) => {
    setDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d));
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

  const openBarcodeModal = (device) => {
    setBarcodeDevice(device);
    setIsBarcodeModalOpen(true);
  };

  const closeBarcodeModal = () => {
    setIsBarcodeModalOpen(false);
    setBarcodeDevice(null);
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
        closeBarcodeModal
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
