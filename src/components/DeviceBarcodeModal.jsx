import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import { X, Printer, QrCode, Barcode, Copy, Check, Save, Cpu, HardDrive, Network, MapPin, Shield } from 'lucide-react';
import { generateBarcodeBars } from '../utils/barcodeGenerator';

export const DeviceBarcodeModal = () => {
  const {
    isBarcodeModalOpen,
    barcodeDevice,
    closeBarcodeModal,
    updateDevice
  } = useInventory();

  // Active sub-tab in this modal: 'sticker' | 'specs'
  const [activeModalTab, setActiveModalTab] = useState('sticker');
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form state for editing specs
  const [specForm, setSpecForm] = useState({
    brand: '',
    model: '',
    cpu: '',
    ram: '',
    storage: '',
    os: '',
    ipAddress: '',
    macAddress: '',
    serialNumber: '',
    assetTag: '',
    location: ''
  });

  useEffect(() => {
    if (barcodeDevice) {
      const s = barcodeDevice.specs || {};
      setSpecForm({
        brand: s.brand || (barcodeDevice.type === 'Server' ? 'Dell' : 'Lenovo'),
        model: s.model || (barcodeDevice.type === 'Server' ? 'PowerEdge R750' : 'ThinkPad T14'),
        cpu: s.cpu || 'Intel Core i5-1245U @ 4.4GHz',
        ram: s.ram || '16 GB DDR4',
        storage: s.storage || '512 GB NVMe SSD',
        os: s.os || 'Windows 11 Pro 64-bit',
        ipAddress: s.ipAddress || barcodeDevice.ipAddress || '192.168.10.50',
        macAddress: s.macAddress || '00:1A:2B:3C:4D:5E',
        serialNumber: s.serialNumber || barcodeDevice.serialNumber || 'SN829102',
        assetTag: s.assetTag || barcodeDevice.assetTag || `ITS-${barcodeDevice.computerName}`,
        location: s.location || (barcodeDevice.department === 'IS' ? 'Gedung IS - Lantai 2' : `${barcodeDevice.department} Office`)
      });
      setActiveModalTab('sticker');
      setSaveSuccess(false);
    }
  }, [barcodeDevice, isBarcodeModalOpen]);

  if (!isBarcodeModalOpen || !barcodeDevice) return null;

  const barcodeResult = generateBarcodeBars(barcodeDevice.computerName);

  // QR Code payload
  const qrData = `PT. ITS | ${barcodeDevice.computerName} | ${barcodeDevice.department} | ${barcodeDevice.user} | IP:${specForm.ipAddress} | SN:${specForm.serialNumber}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData)}&color=00255b`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const text = `PT. INDONESIA TORAY SYNTHETICS - ASSET SPECIFICATION
Computer Name : ${barcodeDevice.computerName}
Asset Tag     : ${specForm.assetTag}
Dept/Section  : ${barcodeDevice.department}
User/PIC      : ${barcodeDevice.user}
Type          : ${barcodeDevice.type}
Brand/Model   : ${specForm.brand} ${specForm.model}
CPU           : ${specForm.cpu}
RAM           : ${specForm.ram}
Storage       : ${specForm.storage}
OS            : ${specForm.os}
IP Address    : ${specForm.ipAddress}
MAC Address   : ${specForm.macAddress}
Serial Number : ${specForm.serialNumber}
Lokasi        : ${specForm.location}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSpecs = (e) => {
    e.preventDefault();
    const updated = {
      ...barcodeDevice,
      ipAddress: specForm.ipAddress,
      serialNumber: specForm.serialNumber,
      assetTag: specForm.assetTag,
      specs: { ...specForm }
    };
    updateDevice(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={closeBarcodeModal}>
      <div className="modal-container modal-barcode-view" onClick={(e) => e.stopPropagation()}>
        {/* Header Modal */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="brand-icon barcode-accent">
              <Barcode size={22} className="icon-toray" />
            </div>
            <div>
              <h3>Barcode & Spesifikasi Hardware</h3>
              <p className="modal-sub-text">{barcodeDevice.computerName} • [{barcodeDevice.department}] • {barcodeDevice.user}</p>
            </div>
          </div>
          <button className="btn-modal-close" onClick={closeBarcodeModal} title="Tutup">
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher: Stiker Barcode vs Edit Spesifikasi */}
        <div className="modal-tabs-bar">
          <button
            type="button"
            className={`modal-tab-pill ${activeModalTab === 'sticker' ? 'active' : ''}`}
            onClick={() => setActiveModalTab('sticker')}
          >
            <Barcode size={14} />
            <span>1. Stiker Barcode & QR</span>
          </button>

          <button
            type="button"
            className={`modal-tab-pill ${activeModalTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveModalTab('specs')}
          >
            <Cpu size={14} />
            <span>2. Detail Spesifikasi Hardware</span>
          </button>
        </div>

        <div className="modal-body">
          {/* TAB 1: STIKER BARCODE FISIK & QR ASSET */}
          {activeModalTab === 'sticker' && (
            <div className="tab-pane-content">
              <p className="text-sm text-muted text-center mb-3">
                Stiker barcode resmi siap cetak untuk ditempel pada unit casing fisik komputer.
              </p>

              <div className="printable-asset-sticker" id="asset-sticker-card">
                {/* Header Stiker */}
                <div className="sticker-header-strip">
                  <div className="sticker-toray-badge">PT. INDONESIA TORAY SYNTHETICS</div>
                  <div className="sticker-plant-sub">TANGERANG PLANT • IT ASSET TAG</div>
                </div>

                {/* Body Stiker */}
                <div className="sticker-content-grid">
                  {/* QR Code */}
                  <div className="sticker-qr-wrapper">
                    <img
                      src={qrImageUrl}
                      alt={`QR ${barcodeDevice.computerName}`}
                      className="sticker-qr-img"
                    />
                    <span className="sticker-scan-tag">SCAN ASSET</span>
                  </div>

                  {/* Barcode Code 128 */}
                  <div className="sticker-barcode-details">
                    <div className="sticker-computer-headline">
                      {barcodeDevice.computerName}
                    </div>

                    <div className="sticker-barcode-box">
                      <svg
                        viewBox={`0 0 ${barcodeResult.totalWidth} 48`}
                        className="barcode-svg-element"
                        preserveAspectRatio="none"
                      >
                        {barcodeResult.bars.map((bar, i) => (
                          <rect
                            key={i}
                            x={bar.x}
                            y="0"
                            width={bar.width}
                            height="48"
                            fill="#000000"
                          />
                        ))}
                      </svg>
                      <div className="barcode-readable-code">
                        {specForm.assetTag || barcodeDevice.computerName}
                      </div>
                    </div>

                    {/* Metadata Singkat */}
                    <div className="sticker-quick-meta">
                      <div className="quick-item">
                        <span className="lbl">DEPT:</span>
                        <span className="val font-bold">[{barcodeDevice.department}]</span>
                      </div>
                      <div className="quick-item">
                        <span className="lbl">TYPE:</span>
                        <span className="val">{barcodeDevice.type}</span>
                      </div>
                      <div className="quick-item">
                        <span className="lbl">USER:</span>
                        <span className="val">{barcodeDevice.user}</span>
                      </div>
                      <div className="quick-item">
                        <span className="lbl">IP:</span>
                        <span className="val code-font">{specForm.ipAddress}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detail Spesifikasi Ringkas pada Stiker */}
                <div className="sticker-specs-detail-table">
                  <div className="spec-row">
                    <span className="spec-title">Hardware:</span>
                    <span className="spec-data">{specForm.brand} {specForm.model} • {specForm.cpu}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-title">RAM & Disk:</span>
                    <span className="spec-data">{specForm.ram} • {specForm.storage}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-title">OS & S/N:</span>
                    <span className="spec-data">{specForm.os} • S/N: {specForm.serialNumber}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-title">Lokasi:</span>
                    <span className="spec-data">{specForm.location}</span>
                  </div>
                </div>

                <div className="sticker-footer-note">
                  PROPERTY OF PT. INDONESIA TORAY SYNTHETICS - DO NOT REMOVE
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SPESIFIKASI HARDWARE & JARINGAN (EDITABLE) */}
          {activeModalTab === 'specs' && (
            <form onSubmit={handleSaveSpecs} className="tab-pane-content">
              {saveSuccess && (
                <div className="alert-success-banner mb-3">
                  ✓ Spesifikasi perangkat berhasil diperbarui!
                </div>
              )}

              <div className="form-grid-two">
                <div className="form-group">
                  <label>Merk / Brand:</label>
                  <input
                    type="text"
                    placeholder="Contoh: Lenovo / Dell / HP"
                    value={specForm.brand}
                    onChange={(e) => setSpecForm(prev => ({ ...prev, brand: e.target.value }))}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Model Komputer:</label>
                  <input
                    type="text"
                    placeholder="Contoh: ThinkPad T14 / PowerEdge R750"
                    value={specForm.model}
                    onChange={(e) => setSpecForm(prev => ({ ...prev, model: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid-two margin-top-sm">
                <div className="form-group">
                  <label>Processor (CPU):</label>
                  <input
                    type="text"
                    placeholder="Contoh: Intel Core i7-1260P @ 4.7GHz"
                    value={specForm.cpu}
                    onChange={(e) => setSpecForm(prev => ({ ...prev, cpu: e.target.value }))}
                    className="form-input code-font"
                  />
                </div>

                <div className="form-group">
                  <label>Sistem Operasi (OS):</label>
                  <input
                    type="text"
                    placeholder="Contoh: Windows 11 Pro 64-bit"
                    value={specForm.os}
                    onChange={(e) => setSpecForm(prev => ({ ...prev, os: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid-two margin-top-sm">
                <div className="form-group">
                  <label>Kapasitas RAM:</label>
                  <input
                    type="text"
                    placeholder="Contoh: 16 GB DDR4 / 32 GB DDR5"
                    value={specForm.ram}
                    onChange={(e) => setSpecForm(prev => ({ ...prev, ram: e.target.value }))}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Storage (Disk):</label>
                  <input
                    type="text"
                    placeholder="Contoh: 512 GB PCIe NVMe SSD"
                    value={specForm.storage}
                    onChange={(e) => setSpecForm(prev => ({ ...prev, storage: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid-two margin-top-sm">
                <div className="form-group">
                  <label>IP Address Jaringan:</label>
                  <input
                    type="text"
                    placeholder="Contoh: 192.168.10.45"
                    value={specForm.ipAddress}
                    onChange={(e) => setSpecForm(prev => ({ ...prev, ipAddress: e.target.value }))}
                    className="form-input code-font"
                  />
                </div>

                <div className="form-group">
                  <label>MAC Address:</label>
                  <input
                    type="text"
                    placeholder="Contoh: 00:1A:2B:3C:4D:5E"
                    value={specForm.macAddress}
                    onChange={(e) => setSpecForm(prev => ({ ...prev, macAddress: e.target.value }))}
                    className="form-input code-font"
                  />
                </div>
              </div>

              <div className="form-grid-two margin-top-sm">
                <div className="form-group">
                  <label>Serial Number (S/N):</label>
                  <input
                    type="text"
                    placeholder="Contoh: PF3Z8001"
                    value={specForm.serialNumber}
                    onChange={(e) => setSpecForm(prev => ({ ...prev, serialNumber: e.target.value }))}
                    className="form-input code-font"
                  />
                </div>

                <div className="form-group">
                  <label>Asset Tag ID:</label>
                  <input
                    type="text"
                    placeholder={`ITS-${barcodeDevice.computerName}`}
                    value={specForm.assetTag}
                    onChange={(e) => setSpecForm(prev => ({ ...prev, assetTag: e.target.value }))}
                    className="form-input code-font"
                  />
                </div>
              </div>

              <div className="form-group margin-top-sm">
                <label>Lokasi Penempatan:</label>
                <input
                  type="text"
                  placeholder="Contoh: Gedung IS - Lantai 2 / Ruang Server"
                  value={specForm.location}
                  onChange={(e) => setSpecForm(prev => ({ ...prev, location: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div className="margin-top text-right">
                <button type="submit" className="btn-primary">
                  <Save size={15} />
                  <span>Simpan Spesifikasi</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Modal Actions */}
        <div className="modal-footer">
          <div className="footer-left-actions">
            <button
              type="button"
              className="btn-action-ghost"
              onClick={handleCopy}
              title="Salin spesifikasi ke clipboard"
            >
              {copied ? <Check size={15} className="text-emerald" /> : <Copy size={15} />}
              <span>{copied ? 'Tersalin!' : 'Salin Info Spesifikasi'}</span>
            </button>
          </div>

          <div className="footer-right-actions">
            <button type="button" className="btn-secondary" onClick={closeBarcodeModal}>
              Tutup
            </button>
            <button type="button" className="btn-primary" onClick={handlePrint}>
              <Printer size={16} />
              <span>Cetak Stiker Barcode</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
