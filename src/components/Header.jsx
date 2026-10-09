import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import {
  Building2,
  Cpu,
  Search,
  QrCode,
  Sun,
  Moon,
  Bell,
  Plus,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  ClipboardCheck
} from 'lucide-react';

export const Header = () => {
  const {
    viewMode,
    setViewMode,
    theme,
    toggleTheme,
    searchQuery,
    setSearchQuery,
    setIsQRScannerOpen,
    setIsDeviceFormOpen,
    setEditingDevice,
    setIsStockTakingModalOpen,
    resetToSeedData,
    maintenance = [],
    spareParts = [],
    setActiveTab
  } = useInventory();

  const [showNotifications, setShowNotifications] = useState(false);

  const safeSpareParts = Array.isArray(spareParts) ? spareParts : [];
  const safeMaintenance = Array.isArray(maintenance) ? maintenance : [];

  const lowStockParts = safeSpareParts.filter(p => (p?.stockQuantity || 0) <= (p?.minThreshold || 0));
  const pendingMaintenance = safeMaintenance.filter(m => m?.status === 'In Progress');
  const totalNotifications = lowStockParts.length + pendingMaintenance.length;

  const handleCreateNewDevice = () => {
    if (setEditingDevice) setEditingDevice(null);
    if (setIsDeviceFormOpen) setIsDeviceFormOpen(true);
    if (setViewMode) setViewMode('portal');
    if (setActiveTab) setActiveTab('devices');
  };

  const handleInputStockTaking = () => {
    if (setIsStockTakingModalOpen) setIsStockTakingModalOpen(true);
    if (setViewMode) setViewMode('portal');
    if (setActiveTab) setActiveTab('stocktaking');
  };

  return (
    <header className="header-bar">
      <div className="header-left">
        <div className="brand-logo" onClick={() => setViewMode && setViewMode('profile')}>
          <div className="brand-icon">
            <Cpu className="icon-toray" />
          </div>
          <div className="brand-text">
            <div className="company-title">PT. Indonesia Toray Synthetics</div>
            <div className="sub-title">ITS Device Inventory System</div>
          </div>
        </div>

        {/* View Switcher Pill */}
        <div className="view-switcher-pill">
          <button
            className={`view-btn ${viewMode === 'profile' ? 'active' : ''}`}
            onClick={() => setViewMode && setViewMode('profile')}
          >
            <Building2 size={16} />
            <span>Company Profile</span>
          </button>
          <button
            className={`view-btn ${viewMode === 'portal' ? 'active' : ''}`}
            onClick={() => setViewMode && setViewMode('portal')}
          >
            <Cpu size={16} />
            <span>IT Inventory Portal</span>
          </button>
        </div>
      </div>

      <div className="header-center">
        {viewMode === 'portal' && (
          <div className="global-search-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Cari Asset Tag (ITS-PC-...), Model, S/N, Pegawai, atau Spesifikasi..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="global-search-input"
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery && setSearchQuery('')}>×</button>
            )}
          </div>
        )}
      </div>

      <div className="header-right">
        {/* Quick Actions */}
        <button
          className="header-action-btn secondary"
          onClick={() => setIsQRScannerOpen && setIsQRScannerOpen(true)}
          title="Scan QR Code Asset"
        >
          <QrCode size={18} />
          <span className="btn-text">Scan QR</span>
        </button>

        <button
          className="header-action-btn secondary"
          onClick={handleInputStockTaking}
          title="Input Stock Taking (Opname)"
        >
          <ClipboardCheck size={18} />
          <span className="btn-text">+ Stock Taking</span>
        </button>

        <button
          className="header-action-btn primary"
          onClick={handleCreateNewDevice}
          title="Tambah Perangkat Baru"
        >
          <Plus size={18} />
          <span className="btn-text">+ Asset Baru</span>
        </button>

        {/* Notifications Popover */}
        <div className="notification-wrapper">
          <button
            className="header-icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifikasi & System Alert"
          >
            <Bell size={20} />
            {totalNotifications > 0 && (
              <span className="notification-badge">{totalNotifications}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-popover">
              <div className="popover-header">
                <h4>Peringatan Sistem ({totalNotifications})</h4>
                <button onClick={() => setShowNotifications(false)}>×</button>
              </div>
              <div className="popover-body">
                {totalNotifications === 0 ? (
                  <div className="empty-notif">
                    <CheckCircle size={24} className="text-success" />
                    <p>Semua perangkat & stok dalam kondisi optimal.</p>
                  </div>
                ) : (
                  <>
                    {lowStockParts.map(part => (
                      <div key={part.id} className="notif-item warning" onClick={() => { if (setViewMode) setViewMode('portal'); if (setActiveTab) setActiveTab('spareparts'); setShowNotifications(false); }}>
                        <AlertTriangle size={18} className="icon-warning" />
                        <div>
                          <strong>Stok Sparepart Menipis!</strong>
                          <p>{part.name} sisa <strong>{part.stockQuantity}</strong> (Min: {part.minThreshold})</p>
                        </div>
                      </div>
                    ))}
                    {pendingMaintenance.map(item => (
                      <div key={item.id} className="notif-item danger" onClick={() => { if (setViewMode) setViewMode('portal'); if (setActiveTab) setActiveTab('maintenance'); setShowNotifications(false); }}>
                        <AlertTriangle size={18} className="icon-danger" />
                        <div>
                          <strong>Perbaikan Berjalan!</strong>
                          <p>{item.assetTag}: {item.description}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          className="header-icon-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Ganti ke Light Mode' : 'Ganti ke Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Reset Data Button */}
        <button
          className="header-icon-btn danger-hover"
          onClick={() => {
            if (window.confirm('Apakah Anda yakin ingin mereset seluruh data inventaris ke data bawaan pabrik ITS Tangerang?')) {
              if (resetToSeedData) resetToSeedData();
            }
          }}
          title="Reset ke Data Bawaan Pabrik"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </header>
  );
};
