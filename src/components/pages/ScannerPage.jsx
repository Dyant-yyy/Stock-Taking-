import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import {
  QrCode,
  Camera,
  Search,
  CheckCircle2,
  Printer,
  HardDrive,
  User,
  ShieldCheck,
  Building2,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Smartphone
} from 'lucide-react';

export const ScannerPage = ({ onNavigate }) => {
  const {
    devices = [],
    openScannerModal,
    openBarcodePrint,
    updateDeviceStatus
  } = useInventory();

  const [searchKey, setSearchKey] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(devices[0] || null);

  // Filter devices for lookup
  const matchedDevices = devices.filter(d => {
    if (!searchKey.trim()) return false;
    const q = searchKey.toLowerCase();
    return (
      (d.computerName || '').toLowerCase().includes(q) ||
      (d.ipAddress || '').toLowerCase().includes(q) ||
      (d.user || '').toLowerCase().includes(q) ||
      (d.id || '').toLowerCase().includes(q)
    );
  });

  const activeDevice = matchedDevices.length > 0 ? matchedDevices[0] : selectedDevice;

  const handleQuickStatusChange = (status) => {
    if (activeDevice) {
      updateDeviceStatus(activeDevice.id, status);
    }
  };

  return (
    <div className="page-fade-in scanner-page-shell">
      {/* Page Header */}
      <div className="inventory-section-header">
        <div className="section-title-wrap">
          <h1 className="section-main-title">
            <QrCode size={24} style={{ color: '#38bdf8' }} />
            <span>Pusat Barcode & QR Code Perangkat IT</span>
          </h1>
          <p className="section-subtitle-text">
            Scan Kamera Langsung, Pencarian Serial Tag, dan Cetak Stiker Label Inventaris Resmi PT. ITS Tangerang
          </p>
        </div>

        <button
          className="btn-inventory-action btn-blue-solid"
          onClick={() => openScannerModal()}
        >
          <Camera size={16} />
          <span>Buka Scanner Kamera</span>
        </button>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="scanner-layout-grid">
        {/* Left Column: Interactive Camera Launcher & Quick Lookup */}
        <div className="scanner-left-column">
          {/* Camera Scanner Launcher Hero Card */}
          <div className="bento-surface scanner-hero-card">
            <div className="scanner-hero-content">
              <div className="scanner-camera-icon-bubble">
                <Camera size={32} />
              </div>
              <h2 className="scanner-hero-title">Scan Barcode / QR dengan Kamera</h2>
              <p className="scanner-hero-desc">
                Gunakan kamera smartphone atau webcam laptop untuk memindai stiker barcode fisik yang tertempel pada CPU, laptop, atau monitor di area pabrik ITS.
              </p>

              <div className="scanner-hero-actions-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
                <button
                  className="btn-launch-camera-scanner"
                  style={{ flex: 1, minWidth: '180px' }}
                  onClick={() => openScannerModal()}
                >
                  <Camera size={18} />
                  <span>📷 Buka Kamera Langsung</span>
                </button>
                <button
                  className="btn-inventory-action"
                  style={{ flex: 1, minWidth: '180px', justifyContent: 'center', background: 'rgba(14, 165, 233, 0.15)', borderColor: 'rgba(14, 165, 233, 0.4)', color: '#38bdf8' }}
                  onClick={() => openScannerModal()}
                >
                  <Smartphone size={17} />
                  <span>Kamera Smartphone (HP)</span>
                </button>
              </div>

              <div className="scanner-format-tags" style={{ marginTop: '14px' }}>
                <span className="scanner-format-tag">Android & iOS</span>
                <span className="scanner-format-tag">Webcam Laptop</span>
                <span className="scanner-format-tag">Code 128 / QR</span>
                <span className="scanner-format-tag">Barcode Gun USB</span>
              </div>
            </div>
          </div>

          {/* Quick Search & Instant Status Verifier */}
          <div className="bento-surface scanner-lookup-card">
            <div className="bento-card-header">
              <div className="card-header-left">
                <Search size={18} style={{ color: '#60a5fa' }} />
                <h3 className="card-header-title">Verifikasi Cepat / Lookup Serial Tag</h3>
              </div>
            </div>

            <div className="scanner-search-input-wrap">
              <input
                type="text"
                placeholder="Ketik Computer Name, IP Address, atau Nama User..."
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                className="scanner-search-field"
              />
              {searchKey && (
                <button
                  className="scanner-clear-btn"
                  onClick={() => setSearchKey('')}
                >
                  ×
                </button>
              )}
            </div>

            {/* Quick Match / Current Selected Device Display */}
            {activeDevice ? (
              <div className="scanner-device-inspect-box">
                <div className="inspect-box-top">
                  <div>
                    <span className="inspect-device-name">{activeDevice.computerName}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span className="table-ip-badge">IP {activeDevice.ipAddress}</span>
                      <span className={`dept-badge-pill dept-${(activeDevice.department || 'default').toLowerCase()}`}>
                        {activeDevice.department}
                      </span>
                    </div>
                  </div>
                  <div className="inspect-status-current">
                    <span className="inspect-status-label">Status Saat Ini:</span>
                    <strong className={`status-text-highlight ${activeDevice.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {activeDevice.status}
                    </strong>
                  </div>
                </div>

                <div className="inspect-box-meta">
                  <div className="inspect-meta-item">
                    <User size={13} style={{ color: '#727885' }} />
                    <span>User: <strong>{activeDevice.user}</strong></span>
                  </div>
                  <div className="inspect-meta-item">
                    <HardDrive size={13} style={{ color: '#727885' }} />
                    <span>Type: <strong>{activeDevice.type}</strong></span>
                  </div>
                </div>

                {/* 1-Click Quick Status Verifier Buttons */}
                <div className="inspect-status-actions-block">
                  <span className="inspect-actions-caption">Verifikasi & Update Status Langsung:</span>
                  <div className="quick-status-buttons-row">
                    <button
                      className={`btn-quick-status online ${activeDevice.status === 'Online' ? 'active' : ''}`}
                      onClick={() => handleQuickStatusChange('Online')}
                    >
                      Online
                    </button>
                    <button
                      className={`btn-quick-status in ${activeDevice.status === 'In' ? 'active' : ''}`}
                      onClick={() => handleQuickStatusChange('In')}
                    >
                      In
                    </button>
                    <button
                      className={`btn-quick-status out ${activeDevice.status === 'Out' ? 'active' : ''}`}
                      onClick={() => handleQuickStatusChange('Out')}
                    >
                      Out
                    </button>
                    <button
                      className={`btn-quick-status not-used ${activeDevice.status === 'Not Used' ? 'active' : ''}`}
                      onClick={() => handleQuickStatusChange('Not Used')}
                    >
                      Not Used
                    </button>
                    <button
                      className={`btn-quick-status broken ${activeDevice.status === 'Broken' ? 'active' : ''}`}
                      onClick={() => handleQuickStatusChange('Broken')}
                    >
                      Broken
                    </button>
                    <button
                      className={`btn-quick-status disposal ${activeDevice.status === 'Disposal' ? 'active' : ''}`}
                      onClick={() => handleQuickStatusChange('Disposal')}
                    >
                      Disposal
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                  <button
                    className="btn-inventory-action btn-blue-solid"
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => openBarcodePrint(activeDevice)}
                  >
                    <Printer size={15} />
                    <span>Cetak Stiker Komputer Ini</span>
                  </button>
                  <button
                    className="btn-inventory-action"
                    onClick={() => onNavigate && onNavigate('devices')}
                    title="Buka di Tabel Master"
                  >
                    <ExternalLink size={15} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="scanner-empty-lookup">
                <Search size={30} style={{ opacity: 0.4, margin: '0 auto 8px', display: 'block' }} />
                <span>Ketik nama komputer atau IP di atas untuk memverifikasi unit</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Stiker Preview & Ready-to-Print List */}
        <div className="scanner-right-column">
          {/* Stiker Preview Mockup */}
          <div className="bento-surface sticker-preview-panel">
            <div className="bento-card-header">
              <div className="card-header-left">
                <Printer size={18} style={{ color: '#fbbf24' }} />
                <h3 className="card-header-title">Preview Stiker Label Asset Toray ITS</h3>
              </div>
            </div>

            {/* Simulated Printed Thermal Sticker */}
            <div className="thermal-sticker-mockup">
              <div className="sticker-header-strip">
                <div className="sticker-logo-text">
                  <span className="sticker-company-toray">'TORAY'</span>
                  <span className="sticker-company-sub">PT. INDONESIA TORAY SYNTHETICS</span>
                </div>
                <span className="sticker-plant-code">PLANT TANGERANG</span>
              </div>

              <div className="sticker-device-body">
                <div className="sticker-device-title">
                  {activeDevice ? activeDevice.computerName : 'ITS-IS-PC01'}
                </div>
                <div className="sticker-meta-row">
                  <span>IP: <strong>{activeDevice ? activeDevice.ipAddress : '192.168.10.15'}</strong></span>
                  <span>DEPT: <strong>{activeDevice ? activeDevice.department : 'IS'}</strong></span>
                </div>
                <div className="sticker-user-row">
                  <span>USER: {activeDevice ? activeDevice.user : 'Administrator'}</span>
                </div>

                {/* Barcode Lines Graphic */}
                <div className="sticker-barcode-visual">
                  <div className="barcode-bars-cluster">
                    <span className="bar w-2"></span>
                    <span className="bar w-1"></span>
                    <span className="bar w-3"></span>
                    <span className="bar w-2"></span>
                    <span className="bar w-1"></span>
                    <span className="bar w-4"></span>
                    <span className="bar w-2"></span>
                    <span className="bar w-1"></span>
                    <span className="bar w-3"></span>
                    <span className="bar w-2"></span>
                    <span className="bar w-4"></span>
                    <span className="bar w-1"></span>
                    <span className="bar w-2"></span>
                    <span className="bar w-3"></span>
                    <span className="bar w-1"></span>
                  </div>
                  <span className="sticker-serial-digits">
                    ITS-TNG-{(activeDevice ? activeDevice.id : 'DEV-001').replace('-', '')}-2026
                  </span>
                </div>
              </div>

              <button
                className="btn-print-sticker-action"
                onClick={() => activeDevice && openBarcodePrint(activeDevice)}
              >
                <Printer size={16} />
                <span>Kirim ke Printer Label (Thermal 50x30mm)</span>
              </button>
            </div>
          </div>

          {/* Quick List of Devices to Pick */}
          <div className="bento-surface scanner-quick-list-card">
            <div className="bento-card-header">
              <div className="card-header-left">
                <HardDrive size={18} style={{ color: '#38bdf8' }} />
                <h3 className="card-header-title">Pilih Komputer untuk Cetak Label</h3>
              </div>
              <span style={{ fontSize: '12px', color: '#727885' }}>{devices.length} Unit</span>
            </div>

            <div className="scanner-device-pick-list">
              {devices.slice(0, 8).map(dev => (
                <div
                  key={dev.id}
                  className={`scanner-pick-item ${activeDevice?.id === dev.id ? 'active' : ''}`}
                  onClick={() => setSelectedDevice(dev)}
                >
                  <div className="pick-item-left">
                    <span className="pick-comp-name">{dev.computerName}</span>
                    <span className="pick-ip">{dev.ipAddress} • {dev.department}</span>
                  </div>
                  <button
                    className="btn-table-action-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      openBarcodePrint(dev);
                    }}
                    title="Cetak Label Langsung"
                  >
                    <Printer size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
