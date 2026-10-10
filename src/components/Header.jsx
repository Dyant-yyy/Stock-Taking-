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
    devices = [],
    setActiveTab
  } = useInventory();

  const [showNotifications, setShowNotifications] = useState(false);

  const safeDevices = Array.isArray(devices) ? devices : [];

  const discrepancyDevices = safeDevices.filter(d => d?.status === 'Discrepancy');
  const missingDevices = safeDevices.filter(d => d?.status === 'Missing');
  const totalNotifications = discrepancyDevices.length + missingDevices.length;

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
            <div className="sub-title">ITS Device Stock Taking System</div>
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
            <ClipboardCheck size={16} />
            <span>Stock Opname Portal</span>
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
          className="header-action-btn primary"
          onClick={handleInputStockTaking}
          title="Input Stock Taking (Opname)"
        >
          <ClipboardCheck size={18} />
          <span className="btn-text">+ Stock Opname</span>
        </button>

        <button
          className="header-action-btn secondary"
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
            title="Notifikasi Stock Opname Alert"
          >
            <Bell size={20} />
            {totalNotifications > 0 && (
              <span className="notification-badge">{totalNotifications}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-popover">
              <div className="popover-header">
                <h4>Temuan Stock Opname ({totalNotifications})</h4>
                <button onClick={() => setShowNotifications(false)}>×</button>
              </div>
              <div className="popover-body">
                {totalNotifications === 0 ? (
                  <div className="empty-notif">
                    <CheckCircle size={24} className="text-success" />
                    <p>Semua perangkat fisik terverifikasi lengkap.</p>
                  </div>
                ) : (
                  <>
                    {discrepancyDevices.map(d => (
                      <div key={d.id} className="notif-item warning" onClick={() => { if (setViewMode) setViewMode('portal'); if (setActiveTab) setActiveTab('devices'); setShowNotifications(false); }}>
                        <AlertTriangle size={18} className="icon-warning" />
                        <div>
                          <strong>Temuan Selisih (Discrepancy)</strong>
                          <p>{d.assetTag} ({d.name}): {d.notes}</p>
                        </div>
                      </div>
                    ))}
                    {missingDevices.map(d => (
                      <div key={d.id} className="notif-item danger" onClick={() => { if (setViewMode) setViewMode('portal'); if (setActiveTab) setActiveTab('devices'); setShowNotifications(false); }}>
                        <AlertTriangle size={18} className="icon-danger" />
                        <div>
                          <strong>Perangkat Hilang (Missing)</strong>
                          <p>{d.assetTag} ({d.name}) belum ditemukan di lokasi.</p>
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
            if (window.confirm('Apakah Anda yakin ingin mereset seluruh data inventaris ke data awal Stock Opname ITS?')) {
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
